var mysql = require('mysql');
var fs = require('fs');

const tableName = 'game'

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "kt_result_2nd_edition"
});

const mostWinPlayer = `SELECT winner_player, COUNT(*) AS magnitude 
    FROM ${tableName} 
    GROUP BY winner_player 
    ORDER BY magnitude DESC;`

const mostWinTeam = `SELECT times, COUNT(*) AS magnitude
    FROM (
        SELECT team1 AS times FROM ${tableName}
        UNION ALL
        SELECT team2 AS times FROM ${tableName}
    ) AS todos
    GROUP BY times
    ORDER BY magnitude DESC;`

const winRatePlayer = `SELECT
        jogador, 
        COUNT(*) AS total_jogos,
        SUM(CASE WHEN jogador = winner_player THEN 1 ELSE 0 END) AS vitorias,
        (SUM(CASE WHEN jogador = winner_player THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS win_rate
    FROM (
        -- Seleciona todos os jogadores como player1
        SELECT player1 AS jogador, winner_player
        FROM ${tableName}
        UNION ALL
        -- Seleciona todos os jogadores como player2
        SELECT player2 AS jogador, winner_player
        FROM ${tableName}
    ) AS todos_jogos
    GROUP BY jogador
    ORDER BY win_rate DESC;`

const winRateTeamGeneral = `SELECT 
        time, 
        COUNT(*) AS total_jogos,
        SUM(CASE WHEN time = time_vencedor THEN 1 ELSE 0 END) AS vitorias,
        (SUM(CASE WHEN time = time_vencedor THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS win_rate
    FROM (
        -- Seleciona todos os times como team1 e verifica se o time venceu
        SELECT team1 AS time, 
            CASE WHEN player1 = winner_player THEN team1 ELSE team2 END AS time_vencedor
        FROM ${tableName}
        UNION ALL
        -- Seleciona todos os times como team2 e verifica se o time venceu
        SELECT team2 AS time, 
            CASE WHEN player1 = winner_player THEN team1 ELSE team2 END AS time_vencedor
        FROM ${tableName}
    ) AS todos_times
    GROUP BY time
    ORDER BY win_rate DESC;`

const winRateTeamEachPlayer = `SELECT 
        jogador,
        time, 
        COUNT(*) AS total_jogos,
        SUM(CASE WHEN time = time_vencedor THEN 1 ELSE 0 END) AS vitorias,
        (SUM(CASE WHEN time = time_vencedor THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS win_rate
    FROM (
        -- Seleciona todos os jogos como player1
        SELECT player1 AS jogador, team1 AS time, 
            CASE WHEN player1 = winner_player THEN team1 ELSE team2 END AS time_vencedor
        FROM ${tableName}
        UNION ALL
        -- Seleciona todos os jogos como player2
        SELECT player2 AS jogador, team2 AS time, 
            CASE WHEN player2 = winner_player THEN team2 ELSE team1 END AS time_vencedor
        FROM ${tableName}
    ) AS jogos_por_time
    GROUP BY jogador, time
    ORDER BY jogador, win_rate DESC;`

con.connect(function(err) {
    if (err) throw err;
    con.query(winRatePlayer, function (err, result) {
        if (err) throw err;
        console.log(result);

        fs.writeFileSync("./playerStats.json", JSON.stringify(result))
    });

    con.query(winRateTeamGeneral, function (err, result) {
        if (err) throw err;
        console.log(result);

        fs.writeFileSync("./teamStats.json", JSON.stringify(result))
    });

    con.query(winRateTeamEachPlayer, function (err, result) {
        if (err) throw err;
        console.log(result);

        fs.writeFileSync("./teamPlayerStats.json", JSON.stringify(result))
    });

    con.end()
});
