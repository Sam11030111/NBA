import { gameLiveDataPractice } from './gameLive.js';
import { allGameStaticsDataPractice } from './gameStatic.js';
import { API_KEY } from './api.js';

async function fetchNBAGameLive() {
    const url = `https://api-nba-v1.p.rapidapi.com/games?live=all`;
    const options = {
	    method: 'GET',
	    headers: {
		    'X-RapidAPI-Key': API_KEY,
		    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
	    }
    };

    try {
	    const response = await fetch(url, options);
	    const result = await response.json();

        const gameLive = result.response.map((game) => {
            const gameId = game.id;
            const visitorId = game.teams.visitors.id;
            const homeId = game.teams.home.id;
            const visitorScores  = game.scores.visitors.linescore;
            const homeScores  = game.scores.home.linescore;
            const visitorImage = game.teams.visitors.logo;
            const homeImage = game.teams.home.logo;
          
            return { gameId, visitorId, homeId, visitorScores, homeScores, visitorImage, homeImage };
        });

        let index = 0; 
        function printNextElement() {
            if (index < gameLive.length) {
                console.log(gameLive[index].gameId);
                fetchGameStatics(gameLive[index].gameId, gameLive, index);
                index++;
            } else {
                console.log("沒有其他比賽了");
                clearInterval(printInterval); 
            }
        }
        const printInterval = setInterval(printNextElement, 3000);
        
    } catch (error) {
	    console.error(error);
    }
}

async function fetchGameStatics(gameId, gameLiveData, index) {
    const url = `https://api-nba-v1.p.rapidapi.com/games/statistics?id=${gameId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '12b3373934msh94c284e2ac3378ep115747jsn0bc159f41266',
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const allGameStatics = {
            gameId: result.parameters.id,
            teamIds: result.response.map(responseItem => responseItem.team.id),
            teamNames: result.response.map(responseItem => responseItem.team.nickname),
            statistics: result.response.map(responseItem => ({
              fgm: responseItem.statistics[0].fgm,
              fga: responseItem.statistics[0].fga,
              fgp: responseItem.statistics[0].fgp,
              ftm: responseItem.statistics[0].ftm,
              fta: responseItem.statistics[0].fta,
              ftp: responseItem.statistics[0].ftp,
              tpm: responseItem.statistics[0].tpm,
              tpa: responseItem.statistics[0].tpa,
              tpp: responseItem.statistics[0].tpp,
              offReb: responseItem.statistics[0].offReb,
              defReb: responseItem.statistics[0].defReb,
              totReb: responseItem.statistics[0].totReb,
              turnovers: responseItem.statistics[0].turnovers
            }))
        };
        
        gameLiveData.forEach((liveData) => {
            if (liveData.gameId === parseInt(allGameStatics.gameId)) {
                // Home
                const homeDivElement = $(`<div class="game${index}">`);
                homeDivElement.html(
                    `<div class="statics">
                    <div class="img-name">
                        <img src="${liveData.homeImage}" height="100"/>
                        <h3>${allGameStatics.teamNames[0]}(主場)</h3>
                    </div>
                    <div class="scores">            
                        <p>Q1<br>${liveData.homeScores[0]}</p>
                        <p>Q2<br>${liveData.homeScores[1]}</p>
                        <p>Q3<br>${liveData.homeScores[2]}</p>
                        <p>Q4<br>${liveData.homeScores[3]}</p>
                    </div>
                    <p>兩分球：${allGameStatics.statistics[0].fgm}/${allGameStatics.statistics[0].fga} --> 命中率：${allGameStatics.statistics[0].fgp}</p>
                    <p>三分球：${allGameStatics.statistics[0].tpm}/${allGameStatics.statistics[0].tpa} --> 命中率：${allGameStatics.statistics[0].tpp}</p>
                    <p>罰球：${allGameStatics.statistics[0].ftm}/${allGameStatics.statistics[0].fta} --> 命中率：${allGameStatics.statistics[0].ftp}</p>
                    <p>籃板：${allGameStatics.statistics[0].totReb}
                    <p>進攻籃板：${allGameStatics.statistics[0].offReb}
                    <p>防守籃板：${allGameStatics.statistics[0].defReb}
                    <p>失誤：${allGameStatics.statistics[0].turnovers}`
                );
                $('h1').after(homeDivElement);
        
                // Visitor
                const visitorDivElement = $('<div class="statics">');
                visitorDivElement.html(   
                    `<div class="img-name">
                        <img src="${liveData.visitorImage}" height="100"/>
                        <h3>${allGameStatics.teamNames[1]}(客場)</h3>
                    </div>
                    <div class="scores">            
                        <p>Q1<br>${liveData.visitorScores[0]}</p>
                        <p>Q2<br>${liveData.visitorScores[1]}</p>
                        <p>Q3<br>${liveData.visitorScores[2]}</p>
                        <p>Q4<br>${liveData.visitorScores[3]}</p>
                    </div>
                    <p>兩分球：${allGameStatics.statistics[1].fgm}/${allGameStatics.statistics[1].fga} --> 命中率：${allGameStatics.statistics[1].fgp}</p>
                    <p>三分球：${allGameStatics.statistics[1].tpm}/${allGameStatics.statistics[1].tpa} --> 命中率：${allGameStatics.statistics[1].tpp}</p>
                    <p>罰球：${allGameStatics.statistics[1].ftm}/${allGameStatics.statistics[1].fta} --> 命中率：${allGameStatics.statistics[1].ftp}</p>
                    <p>籃板：${allGameStatics.statistics[1].totReb}
                    <p>進攻籃板：${allGameStatics.statistics[1].offReb}
                    <p>防守籃板：${allGameStatics.statistics[1].defReb}
                    <p>失誤：${allGameStatics.statistics[1].turnovers}`
                );
                $(`.game${index}`).append(visitorDivElement);
            } 
          })

    } catch (error) {
        console.error(error);
    }
}

//fetchNBAGameLive();


// ---------------------------------------- 模擬 ----------------------------------------
// Live Data
// const gameLive = gameLiveDataPractice.response.map((game) => {
//     const gameId = game.id;
//     const visitorId = game.teams.visitors.id;
//     const homeId = game.teams.home.id;
//     const visitorScores  = game.scores.visitors.linescore;
//     const homeScores  = game.scores.home.linescore;
//     const visitorImage = game.teams.visitors.logo;
//     const homeImage = game.teams.home.logo;
  
//     return { gameId, visitorId, homeId, visitorScores, homeScores, visitorImage, homeImage };
// });

// // All games statics
// const allGameStatics = allGameStaticsDataPractice.map(game => ({
//     gameId: game.parameters.id,
//     teamIds: game.response.map(responseItem => responseItem.team.id),
//     teamNames: game.response.map(responseItem => responseItem.team.nickname),
//     statistics: game.response.map(responseItem => ({
//       fgm: responseItem.statistics[0].fgm,
//       fga: responseItem.statistics[0].fga,
//       fgp: responseItem.statistics[0].fgp,
//       ftm: responseItem.statistics[0].ftm,
//       fta: responseItem.statistics[0].fta,
//       ftp: responseItem.statistics[0].ftp,
//       tpm: responseItem.statistics[0].tpm,
//       tpa: responseItem.statistics[0].tpa,
//       tpp: responseItem.statistics[0].tpp,
//       offReb: responseItem.statistics[0].offReb,
//       defReb: responseItem.statistics[0].defReb,
//       totReb: responseItem.statistics[0].totReb,
//       turnovers: responseItem.statistics[0].turnovers
//     }))
// }));
  
// let num = 1;
// gameLive.forEach((liveData) => {
//   allGameStatics.forEach((staticData) => {
//     if (liveData.gameId === parseInt(staticData.gameId)) {
//         // Home
//         const homeDivElement = $(`<div class="game${num}">`);
//         homeDivElement.html(
//             `<div class="statics">
//             <div class="img-name">
//                 <img src="${liveData.homeImage}" height="100"/>
//                 <h3>${staticData.teamNames[0]}(主場)</h3>
//             </div>
//             <div class="scores">            
//                 <p>Q1<br>${liveData.homeScores[0]}</p>
//                 <p>Q2<br>${liveData.homeScores[1]}</p>
//                 <p>Q3<br>${liveData.homeScores[2]}</p>
//                 <p>Q4<br>${liveData.homeScores[3]}</p>
//             </div>
//             <p>兩分球：${staticData.statistics[0].fgm}/${staticData.statistics[0].fga} --> 命中率：${staticData.statistics[0].fgp}</p>
//             <p>三分球：${staticData.statistics[0].tpm}/${staticData.statistics[0].tpa} --> 命中率：${staticData.statistics[0].tpp}</p>
//             <p>罰球：${staticData.statistics[0].ftm}/${staticData.statistics[0].fta} --> 命中率：${staticData.statistics[0].ftp}</p>
//             <p>籃板：${staticData.statistics[0].totReb}
//             <p>進攻籃板：${staticData.statistics[0].offReb}
//             <p>防守籃板：${staticData.statistics[0].defReb}
//             <p>失誤：${staticData.statistics[0].turnovers}`
//         );
//         $('h1').after(homeDivElement);

//         // Visitor
//         const visitorDivElement = $('<div class="statics">');
//         visitorDivElement.html(   
//             `<div class="img-name">
//                 <img src="${liveData.visitorImage}" height="100"/>
//                 <h3>${staticData.teamNames[1]}(客場)</h3>
//             </div>
//             <div class="scores">            
//                 <p>Q1<br>${liveData.visitorScores[0]}</p>
//                 <p>Q2<br>${liveData.visitorScores[1]}</p>
//                 <p>Q3<br>${liveData.visitorScores[2]}</p>
//                 <p>Q4<br>${liveData.visitorScores[3]}</p>
//             </div>
//             <p>兩分球：${staticData.statistics[1].fgm}/${staticData.statistics[1].fga} --> 命中率：${staticData.statistics[1].fgp}</p>
//             <p>三分球：${staticData.statistics[1].tpm}/${staticData.statistics[1].tpa} --> 命中率：${staticData.statistics[1].tpp}</p>
//             <p>罰球：${staticData.statistics[1].ftm}/${staticData.statistics[1].fta} --> 命中率：${staticData.statistics[1].ftp}</p>
//             <p>籃板：${staticData.statistics[1].totReb}
//             <p>進攻籃板：${staticData.statistics[1].offReb}
//             <p>防守籃板：${staticData.statistics[1].defReb}
//             <p>失誤：${staticData.statistics[1].turnovers}`
//         );
//         $(`.game${num}`).append(visitorDivElement);
//         num++;
//     } 
//   })
// });

