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