import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import LineChart from './LineChart';
import RadarBarChart from './RadarBarChart';
import WinsBarChart from "./WinsBarChart";

const App = () => {
    const [players, setPlayers] = useState([]);
    const [abilities, setAbilities] = useState([]);
    const [winsData, setWinsData] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [playerData, setPlayerData] = useState([]);
    const [abilityData, setAbilityData] = useState([]);

    // Load ranking, abilities, wins
    useEffect(() => {
        Promise.all([
            d3.csv('/data/players_rankings.csv'),
            d3.csv('/data/players_ability.csv'),
            d3.csv('/data/players_wins.csv')
        ]).then(([rankingData, abilityData, winsCSV]) => {
            setPlayers(rankingData);
            setAbilities(abilityData);

            // Extract wins for the default player
            const defaultPlayer = rankingData[0].Name;
            setSelectedPlayer(defaultPlayer);

            const winRow = winsCSV.find(d => d.Name === defaultPlayer);
            if (winRow) {
                const formatted = ['2017', '2018', '2019', '2020'].map(year => ({
                    year,
                    win: +winRow[`${year}_win`],
                    loss: +winRow[`${year}_loss`]
                }));
                setWinsData(formatted);
            }
        });
    }, []);

    // Line chart data
    useEffect(() => {
        if (!selectedPlayer || players.length === 0) return;

        const playerRow = players.find(p => p.Name === selectedPlayer);
        const months = Object.keys(playerRow).filter(key => key !== 'Name' && key !== 'Country');

        const formattedData = months.map(month => ({
            Date: month + '-01',
            Rank: +playerRow[month]
        }));

        setPlayerData(formattedData);
    }, [selectedPlayer, players]);

    // Radar chart data
    useEffect(() => {
        if (!selectedPlayer || abilities.length === 0) return;

        const row = abilities.find(p => p.Name === selectedPlayer);
        if (!row) return;

        const values = ['Serving', 'Defense', 'Speed', 'Experience', 'Power', 'Skill'].map(key => +row[key]);
        setAbilityData(values);
    }, [selectedPlayer, abilities]);

    useEffect(() => {
        if (!selectedPlayer) return;

        d3.csv('/data/players_wins.csv').then((data) => {
            const playerRow = data.find(d => d.Name === selectedPlayer);
            if (!playerRow) {
                setWinsData([]);
                return;
            }

            const formattedData = ['2017', '2018', '2019', '2020'].map(year => ({
                year,
                wins: +playerRow[`${year}_win`] || 0,
                losses: +playerRow[`${year}_loss`] || 0
            }));

            setWinsData(formattedData);
        }).catch((error) => {
            console.error('Error loading wins CSV:', error);
            setWinsData([]);
        });
    }, [selectedPlayer]);


    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '30px',
                fontSize: '32px',
                color: 'white',
            }}>
                World Table Tennis Players Data
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <label style={{ fontSize: '18px', marginRight: '10px' }}>Select Player:</label>
                <select
                    value={selectedPlayer || ''}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    style={{
                        padding: '6px 12px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        minWidth: '200px'
                    }}
                >
                    {players.map((player) => (
                        <option key={player.Name} value={player.Name}>
                            {player.Name} ({player.Country})
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <div style={{ flex: 1, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>World Ranking Trend</h2>
                    {playerData.length > 0 && <LineChart data={playerData} />}
                </div>

                <div style={{ flex: '0 0 420px', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Player Abilities Radar</h2>
                    {abilityData.length > 0 && <RadarBarChart data={abilityData} />}
                </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', marginTop: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Wins vs Losses by Year</h2>
                {winsData.length > 0 && <WinsBarChart data={winsData} />}
            </div>
        </div>
    );
};

export default App;
