// import React, { useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import PlayerSection from './PlayerSection';

// const App = () => {
//     const [players, setPlayers] = useState([]);
//     const [abilities, setAbilities] = useState([]);

//     useEffect(() => {
//         Promise.all([
//             d3.csv('./data/players_rankings.csv'),
//             d3.csv('./data/players_ability.csv')
//         ]).then(([rankingData, abilityData]) => {
//             setPlayers(rankingData);
//             setAbilities(abilityData);
//         });
//     }, []);

//     return (
//         <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
//             <h1 style={{ textAlign: 'center', color: 'white', fontSize: '32px' }}>
//                 World Table Tennis Players Comparison
//             </h1>

//             <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
//                 <PlayerSection allPlayers={players} allAbilities={abilities} defaultPlayer="FAN Zhendong" />
//                 <PlayerSection allPlayers={players} allAbilities={abilities} defaultPlayer="MA Long" />
//             </div>
//         </div>
//     );
// };

// export default App;
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import PlayerSection from "./PlayerSection";

const MAX_PLAYERS = 5;

const App = () => {
  const [players, setPlayers] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [playerViews, setPlayerViews] = useState(["FAN Zhendong", "XU Xin"]);

  useEffect(() => {
    Promise.all([
      d3.csv("./data/players_rankings.csv"),
      d3.csv("./data/players_ability.csv"),
    ]).then(([rankingData, abilityData]) => {
      setPlayers(rankingData);
      setAbilities(abilityData);
    });
  }, []);

  const handleAddPlayer = () => {
    if (playerViews.length < MAX_PLAYERS) {
      const nextDefault =
        players[playerViews.length % players.length]?.Name || "FAN Zhendong";
      setPlayerViews([...playerViews, nextDefault]);
    }
  };

  const handleDeletePlayer = (index) => {
    if (index === 0) return;
    const newViews = [...playerViews];
    newViews.splice(index, 1);
    setPlayerViews(newViews);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        height: "95vh",
        width: "95vw",
      }}
    >
      <h1 style={{ textAlign: "center", color: "white", fontSize: "32px" }}>
        World Table Tennis Players Comparison
      </h1>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {playerViews.map((playerName, idx) => (
          <div key={idx} style={{ flex: 1, minWidth: 0 }}>
            <PlayerSection
              allPlayers={players}
              allAbilities={abilities}
              defaultPlayer={playerName}
              canDelete={idx !== 0 && idx !== 1}
              onDelete={() => handleDeletePlayer(idx)}
            />
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={handleAddPlayer}
          disabled={playerViews.length >= MAX_PLAYERS}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor:
              playerViews.length >= MAX_PLAYERS ? "#ccc" : "#1890ff",
            color: "white",
            border: "none",
            cursor:
              playerViews.length >= MAX_PLAYERS ? "not-allowed" : "pointer",
          }}
        >
          Add Player
        </button>
      </div>
    </div>
  );
};

export default App;
