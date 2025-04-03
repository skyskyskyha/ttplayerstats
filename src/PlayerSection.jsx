// // PlayerSection.jsx
// import React, { useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import LineChart from './LineChart';
// import RadarBarChart from './RadarBarChart';
// import WinsBarChart from './WinsBarChart';

// const PlayerSection = ({ allPlayers, allAbilities, defaultPlayer }) => {
//     const [selectedPlayer, setSelectedPlayer] = useState(defaultPlayer);
//     const [playerData, setPlayerData] = useState([]);
//     const [abilityData, setAbilityData] = useState([]);
//     const [winsData, setWinsData] = useState([]);

//     useEffect(() => {
//         if (!selectedPlayer || allPlayers.length === 0) return;
//         const playerRow = allPlayers.find(p => p.Name === selectedPlayer);
//         const months = Object.keys(playerRow).filter(k => k !== 'Name' && k !== 'Country');
//         const formatted = months.map(month => ({
//             Date: month + '-01',
//             Rank: +playerRow[month]
//         }));
//         setPlayerData(formatted);
//     }, [selectedPlayer, allPlayers]);

//     useEffect(() => {
//         if (!selectedPlayer || allAbilities.length === 0) return;
//         const row = allAbilities.find(p => p.Name === selectedPlayer);
//         if (!row) return;
//         const values = ['Serving', 'Defense', 'Speed', 'Experience', 'Power', 'Skill'].map(key => +row[key]);
//         setAbilityData(values);
//     }, [selectedPlayer, allAbilities]);

//     useEffect(() => {
//         if (!selectedPlayer) return;
//         d3.csv('./data/players_wins.csv').then((data) => {
//             const playerRow = data.find(d => d.Name === selectedPlayer);
//             if (!playerRow) {
//                 setWinsData([]);
//                 return;
//             }
//             const formattedData = ['2017', '2018', '2019', '2020'].map(year => ({
//                 year,
//                 wins: +playerRow[`${year}_win`] || 0,
//                 losses: +playerRow[`${year}_loss`] || 0
//             }));
//             setWinsData(formattedData);
//         }).catch(() => setWinsData([]));
//     }, [selectedPlayer]);

//     return (
//         <div style={{ flex: 1, padding: '10px' }}>
//             <div style={{ marginBottom: '20px' }}>
//                 <label style={{ fontSize: '16px', marginRight: '8px' }}>Select Player:</label>
//                 <select
//                     value={selectedPlayer}
//                     onChange={(e) => setSelectedPlayer(e.target.value)}
//                     style={{ padding: '6px 10px', fontSize: '14px' }}
//                 >
//                     {allPlayers.map((player) => (
//                         <option key={player.Name} value={player.Name}>
//                             {player.Name} ({player.Country})
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div style={{ marginBottom: '30px' }}>
//                 <h3 style={{ textAlign: 'center' }}>World Ranking Trend</h3>
//                 {playerData.length > 0 && <LineChart data={playerData} />}
//             </div>

//             <div style={{ marginBottom: '30px' }}>
//                 <h3 style={{ textAlign: 'center' }}>Player Abilities Radar</h3>
//                 {abilityData.length > 0 && <RadarBarChart data={abilityData} />}
//             </div>

//             <div>
//                 <h3 style={{ textAlign: 'center' }}>Wins vs Losses by Year</h3>
//                 {winsData.length > 0 && <WinsBarChart data={winsData} />}
//             </div>
//         </div>
//     );
// };

// export default PlayerSection;

import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import LineChart from './LineChart';
import RadarBarChart from './RadarBarChart';
import WinsBarChart from './WinsBarChart';

const PlayerSection = ({ allPlayers, allAbilities, defaultPlayer, onDelete, canDelete }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(defaultPlayer);
    const [playerData, setPlayerData] = useState([]);
    const [abilityData, setAbilityData] = useState([]);
    const [winsData, setWinsData] = useState([]);

    useEffect(() => {
        if (!selectedPlayer || allPlayers.length === 0) return;
        const playerRow = allPlayers.find(p => p.Name === selectedPlayer);
        const months = Object.keys(playerRow).filter(k => k !== 'Name' && k !== 'Country');
        const formatted = months.map(month => ({
            Date: month + '-01',
            Rank: +playerRow[month]
        }));
        setPlayerData(formatted);
    }, [selectedPlayer, allPlayers]);

    useEffect(() => {
        if (!selectedPlayer || allAbilities.length === 0) return;
        const row = allAbilities.find(p => p.Name === selectedPlayer);
        if (!row) return;
        const values = ['Serving', 'Defense', 'Speed', 'Experience', 'Power', 'Skill'].map(key => +row[key]);
        setAbilityData(values);
    }, [selectedPlayer, allAbilities]);

    useEffect(() => {
        if (!selectedPlayer) return;
        d3.csv('./data/players_wins.csv').then((data) => {
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
        }).catch(() => setWinsData([]));
    }, [selectedPlayer]);

    return (
        <div style={{ width: '100%' }}>
            {canDelete && (
                <div style={{ textAlign: 'right', marginBottom: '5px' }}>
                    <button
                        onClick={onDelete}
                        style={{
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}

            <div style={{ marginBottom: '10px' }}>
                <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    style={{ width: '100%', padding: '4px', fontSize: '18px' }}
                >
                    {allPlayers.map((player) => (
                        <option key={player.Name} value={player.Name}>
                            {player.Name} ({player.Country})
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <LineChart data={playerData} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <RadarBarChart data={abilityData} />
            </div>
            <div>
                <WinsBarChart data={winsData} />
            </div>
        </div>
        
    );
};

export default PlayerSection;
