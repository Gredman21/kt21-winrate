var mysql = require('mysql');
var fs = require('fs');

const tableName = 'game'

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "kt_result_2nd_edition"
});

const mostWinPlayer = `SELECT jogador, SUM(magnitude) AS total_vitorias
    FROM (
        -- Seleciona vitórias normais (1 vitória para o jogador vencedor)
        SELECT winner_player AS jogador, 1 AS magnitude
        FROM ${tableName}
        WHERE winner_player IS NOT NULL

        UNION ALL

        -- Em caso de empate (winner_player é NULL), contabiliza 0.5 vitória para player1
        SELECT player1 AS jogador, 0.5 AS magnitude
        FROM ${tableName}
        WHERE winner_player IS NULL

        UNION ALL

        -- Em caso de empate (winner_player é NULL), contabiliza 0.5 vitória para player2
        SELECT player2 AS jogador, 0.5 AS magnitude
        FROM ${tableName}
        WHERE winner_player IS NULL
    ) AS vitorias_e_empates
    GROUP BY jogador
    ORDER BY total_vitorias DESC;`

const mostWinTeam = `SELECT time, SUM(magnitude) AS total_vitorias
    FROM (
        -- Vitórias normais: 1 vitória para o time do jogador vencedor (team1 ou team2)
        SELECT team1 AS time, 1 AS magnitude
        FROM ${tableName}
        WHERE winner_player = player1

        UNION ALL

        SELECT team2 AS time, 1 AS magnitude
        FROM ${tableName}
        WHERE winner_player = player2

        UNION ALL

        -- Empates: 0.5 vitória para ambos os times (team1 e team2) quando winner_player é NULL
        SELECT team1 AS time, 0.5 AS magnitude
        FROM ${tableName}
        WHERE winner_player IS NULL

        UNION ALL

        SELECT team2 AS time, 0.5 AS magnitude
        FROM ${tableName}
        WHERE winner_player IS NULL
    ) AS vitorias_e_empates
    GROUP BY time
    ORDER BY total_vitorias DESC;`

const winRatePlayer = `SELECT
    jogador,
    COUNT(*) AS total_jogos,
    SUM(CASE
        WHEN jogador = winner_player THEN 1  -- Vitória total se for o vencedor
        WHEN winner_player IS NULL THEN 0.5  -- Empate: 0.5 vitória para ambos os jogadores
        ELSE 0  -- Derrota
    END) AS vitorias,
    (SUM(CASE
        WHEN jogador = winner_player THEN 1
        WHEN winner_player IS NULL THEN 0.5
        ELSE 0
    END) / COUNT(*)) * 100 AS win_rate
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
    SUM(CASE
        WHEN time = time_vencedor THEN 1  -- Vitória total se o time venceu
        WHEN time_vencedor IS NULL THEN 0.5  -- Empate: 0.5 vitória para ambos os times
        ELSE 0  -- Derrota
    END) AS vitorias,
    (SUM(CASE
        WHEN time = time_vencedor THEN 1
        WHEN time_vencedor IS NULL THEN 0.5
        ELSE 0
    END) / COUNT(*)) * 100 AS win_rate
FROM (
    -- Seleciona todos os jogos como team1
    SELECT team1 AS time,
           CASE
               WHEN player1 = winner_player THEN team1
               WHEN player2 = winner_player THEN team2
               ELSE NULL  -- Empate, nenhum time vencedor
           END AS time_vencedor
    FROM ${tableName}

    UNION ALL

    -- Seleciona todos os jogos como team2
    SELECT team2 AS time,
           CASE
               WHEN player2 = winner_player THEN team2
               WHEN player1 = winner_player THEN team1
               ELSE NULL  -- Empate, nenhum time vencedor
           END AS time_vencedor
    FROM ${tableName}
) AS jogos_por_time
GROUP BY time
ORDER BY win_rate DESC;`

const winRateTeamEachPlayer = `SELECT
    jogador,
    time,
    COUNT(*) AS total_jogos,
    SUM(CASE
        WHEN time = time_vencedor THEN 1  -- Vitória total se o time venceu
        WHEN time_vencedor IS NULL THEN 0.5  -- Empate: 0.5 vitória para ambos os times
        ELSE 0  -- Derrota
    END) AS vitorias,
    (SUM(CASE
        WHEN time = time_vencedor THEN 1
        WHEN time_vencedor IS NULL THEN 0.5
        ELSE 0
    END) / COUNT(*)) * 100 AS win_rate
FROM (
    -- Seleciona todos os jogos como player1 e time1
    SELECT player1 AS jogador, team1 AS time,
           CASE
               WHEN player1 = winner_player THEN team1
               WHEN player2 = winner_player THEN team2
               ELSE NULL  -- Empate, nenhum time vencedor
           END AS time_vencedor
    FROM ${tableName}

    UNION ALL

    -- Seleciona todos os jogos como player2 e time2
    SELECT player2 AS jogador, team2 AS time,
           CASE
               WHEN player2 = winner_player THEN team2
               WHEN player1 = winner_player THEN team1
               ELSE NULL  -- Empate, nenhum time vencedor
           END AS time_vencedor
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
