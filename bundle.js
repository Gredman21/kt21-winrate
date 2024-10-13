(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const playerStats = require('./playerStats.json')
const teamStats = require('./teamStats.json')
const teamPlayerStats = require('./teamPlayerStats.json')
const playersName = require('./data/players.json')
const teamsName = require('./data/teams.json')

document.addEventListener('DOMContentLoaded', function() {

    var players = []
    var totalGamesPlayers = []
    var victoryGamesPlayers = []
    var winRatePlayers = []

    var teams = []
    var totalGamesTeams = []
    var victoryGamesTeams = []
    var winRateTeams = []

    var teamPlayer = []
    var totalGamesTeamPlayer = []
    var victoryGamesTeamPlayer = []
    var winRateTeamPlayer = []

    for(i=0; i < playerStats.length; i++) {
        players[i] = playersName[playerStats[i].jogador]
        totalGamesPlayers[i] = playerStats[i].total_jogos
        victoryGamesPlayers[i] = playerStats[i].vitorias
        winRatePlayers[i] = playerStats[i].win_rate
    }

    for(i=0; i < teamStats.length; i++) {
        teams[i] = teamsName[teamStats[i].time]
        totalGamesTeams[i] = teamStats[i].total_jogos
        victoryGamesTeams[i] = teamStats[i].vitorias
        winRateTeams[i] = teamStats[i].win_rate
    }

    for(i=0; i < teamPlayerStats.length; i++) {
        teamPlayer[teamPlayerStats[i].jogador] = []
        totalGamesTeamPlayer[teamPlayerStats[i].jogador] = []
        victoryGamesTeamPlayer[teamPlayerStats[i].jogador] = []
        winRateTeamPlayer[teamPlayerStats[i].jogador] = []
    }

    var j = 0
    for(i=0; i < teamPlayerStats.length; i++) {
        teamPlayer[teamPlayerStats[i].jogador][j] = teamsName[teamPlayerStats[i].time]
        totalGamesTeamPlayer[teamPlayerStats[i].jogador][j] = teamPlayerStats[i].total_jogos
        victoryGamesTeamPlayer[teamPlayerStats[i].jogador][j] = teamPlayerStats[i].vitorias
        winRateTeamPlayer[teamPlayerStats[i].jogador][j] = teamPlayerStats[i].win_rate
        try{
            if(teamPlayerStats[i].jogador == teamPlayerStats[i+1].jogador) {
                j++
            }
            else{
                j = 0
            }
        } catch(e) {}
    }

    Chart.register(ChartDataLabels);
    
    // mostWinPlayerChart
    var ctx = document.getElementById('mostWinPlayerChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: players,
            datasets: [
                {
                    label: 'Vitórias',
                    data: victoryGamesPlayers,
                    borderWidth: 1,
                    stack: 'combined',
                    type: 'line'
                },
                {
                    label: 'Jogos',
                    data: totalGamesPlayers,
                    borderWidth: 1,
                    stack: 'single'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                datalabels: {
                    color: '#000000',
                    anchor: 'end',
                    align: 'top'
                }
            }
        }
    });

    // winRatePlayerChart
    var ctx = document.getElementById('winRatePlayerChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: players,
            datasets: [
                {
                    label: 'Win rate',
                    data: winRatePlayers,
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                datalabels: {
                    color: '#000000',
                    anchor: 'end',
                    align: 'top'
                }
            }
        }
    });

    // mostWinTeamChart
    var ctx = document.getElementById('mostWinTeamChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams,
            datasets: [
                {
                    label: 'Vitórias',
                    data: victoryGamesTeams,
                    borderWidth: 1,
                    stack: 'combined',
                    type: 'line'
                },
                {
                    label: 'Jogos',
                    data: totalGamesTeams,
                    borderWidth: 1,
                    stack: 'single'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                datalabels: {
                    color: '#000000',
                    anchor: 'end',
                    align: 'top'
                }
            }
        }
    });

    // winRateTeamGeneralChart
    var ctx = document.getElementById('winRateTeamGeneralChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams,
            datasets: [
                {
                    label: 'Win rate',
                    data: winRateTeams,
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                datalabels: {
                    color: '#000000',
                    anchor: 'end',
                    align: 'top'
                }
            }
        }
    });

    var parent = document.getElementById('teamPlayerCharts')
    for(i=0; i < teamPlayer.length; i++) {
        var tempCanvas = document.createElement('canvas')
        tempCanvas.id = `teamPlayerChart${i+1}`
        parent.appendChild(tempCanvas)
        var ctx = document.getElementById(`teamPlayerChart${i+1}`);
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: teamPlayer[i+1],
                datasets: [
                    {
                        label: 'Win rate',
                        data: winRateTeamPlayer[i+1],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: playersName[i+1],
                        font:{
                            size: 25
                        }
                    },
                    datalabels: {
                        color: '#000000',
                        anchor: 'end',
                        align: 'top'
                    }
                }
            }
        });
    }
})
},{"./data/players.json":2,"./data/teams.json":3,"./playerStats.json":4,"./teamPlayerStats.json":5,"./teamStats.json":6}],2:[function(require,module,exports){
module.exports=[
    "NULL",
    "João",
    "Rafael",
    "Lucas",
    "Davi",
    "Leon",
    "Mateus",
    "Luiz"
]
},{}],3:[function(require,module,exports){
module.exports=[
    "NULL",
    "Intercession Squad",
    "Tomb World",
    "Chaos Daemon",
    "Novitiates",
    "Hierotek Circle",
    "Space Marine",
    "Exaction Squad",
    "Strike Force Justian",
    "Veteran Guardsmen",
    "Karskin",
    "Chaos Cultists",
    "Blooded",
    "Phobos Strike Team",
    "Elucidian Startstrider",
    "Void-Dancer Troupe",
    "Fellgor Ravagers",
    "Hand Of The Archon",
    "Hearthkyn Salvagers",
    "Legionary",
    "Hunter Clade",
    "Mandrake",
    "Custode",
    "Pathfinder",
    "Kommando",
    "Inquisitorial Agents"
]
},{}],4:[function(require,module,exports){
module.exports=[{"jogador":1,"total_jogos":22,"vitorias":19.5,"win_rate":88.63636},{"jogador":3,"total_jogos":19,"vitorias":11.5,"win_rate":60.52632},{"jogador":5,"total_jogos":7,"vitorias":3,"win_rate":42.85714},{"jogador":4,"total_jogos":19,"vitorias":8,"win_rate":42.10526},{"jogador":6,"total_jogos":3,"vitorias":1,"win_rate":33.33333},{"jogador":2,"total_jogos":20,"vitorias":3,"win_rate":15},{"jogador":7,"total_jogos":2,"vitorias":0,"win_rate":0}]
},{}],5:[function(require,module,exports){
module.exports=[{"jogador":1,"time":17,"total_jogos":4,"vitorias":4,"win_rate":100},{"jogador":1,"time":1,"total_jogos":1,"vitorias":1,"win_rate":100},{"jogador":1,"time":25,"total_jogos":1,"vitorias":1,"win_rate":100},{"jogador":1,"time":19,"total_jogos":7,"vitorias":6,"win_rate":85.71429},{"jogador":1,"time":9,"total_jogos":6,"vitorias":5,"win_rate":83.33333},{"jogador":1,"time":23,"total_jogos":3,"vitorias":2.5,"win_rate":83.33333},{"jogador":2,"time":16,"total_jogos":2,"vitorias":1,"win_rate":50},{"jogador":2,"time":14,"total_jogos":3,"vitorias":1,"win_rate":33.33333},{"jogador":2,"time":7,"total_jogos":7,"vitorias":1,"win_rate":14.28571},{"jogador":2,"time":8,"total_jogos":1,"vitorias":0,"win_rate":0},{"jogador":2,"time":18,"total_jogos":2,"vitorias":0,"win_rate":0},{"jogador":2,"time":3,"total_jogos":1,"vitorias":0,"win_rate":0},{"jogador":2,"time":12,"total_jogos":4,"vitorias":0,"win_rate":0},{"jogador":3,"time":13,"total_jogos":2,"vitorias":2,"win_rate":100},{"jogador":3,"time":20,"total_jogos":7,"vitorias":4.5,"win_rate":64.28571},{"jogador":3,"time":15,"total_jogos":10,"vitorias":5,"win_rate":50},{"jogador":4,"time":24,"total_jogos":8,"vitorias":5,"win_rate":62.5},{"jogador":4,"time":4,"total_jogos":4,"vitorias":2,"win_rate":50},{"jogador":4,"time":1,"total_jogos":5,"vitorias":1,"win_rate":20},{"jogador":4,"time":13,"total_jogos":2,"vitorias":0,"win_rate":0},{"jogador":5,"time":9,"total_jogos":4,"vitorias":2.5,"win_rate":62.5},{"jogador":5,"time":1,"total_jogos":1,"vitorias":0.5,"win_rate":50},{"jogador":5,"time":19,"total_jogos":2,"vitorias":0,"win_rate":0},{"jogador":6,"time":1,"total_jogos":1,"vitorias":1,"win_rate":100},{"jogador":6,"time":21,"total_jogos":2,"vitorias":0,"win_rate":0},{"jogador":7,"time":19,"total_jogos":2,"vitorias":1,"win_rate":50}]
},{}],6:[function(require,module,exports){
module.exports=[{"time":25,"total_jogos":1,"vitorias":1,"win_rate":100},{"time":17,"total_jogos":4,"vitorias":4,"win_rate":100},{"time":23,"total_jogos":3,"vitorias":2.5,"win_rate":83.33333},{"time":9,"total_jogos":10,"vitorias":7.5,"win_rate":75},{"time":20,"total_jogos":7,"vitorias":4.5,"win_rate":64.28571},{"time":19,"total_jogos":11,"vitorias":7,"win_rate":63.63636},{"time":24,"total_jogos":8,"vitorias":5,"win_rate":62.5},{"time":4,"total_jogos":4,"vitorias":2,"win_rate":50},{"time":16,"total_jogos":2,"vitorias":1,"win_rate":50},{"time":15,"total_jogos":10,"vitorias":5,"win_rate":50},{"time":13,"total_jogos":4,"vitorias":2,"win_rate":50},{"time":1,"total_jogos":8,"vitorias":3.5,"win_rate":43.75},{"time":14,"total_jogos":3,"vitorias":1,"win_rate":33.33333},{"time":7,"total_jogos":7,"vitorias":1,"win_rate":14.28571},{"time":8,"total_jogos":1,"vitorias":0,"win_rate":0},{"time":12,"total_jogos":4,"vitorias":0,"win_rate":0},{"time":18,"total_jogos":2,"vitorias":0,"win_rate":0},{"time":3,"total_jogos":1,"vitorias":0,"win_rate":0},{"time":21,"total_jogos":2,"vitorias":0,"win_rate":0}]
},{}]},{},[1]);
