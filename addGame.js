var mysql = require('mysql');

const players = {
    "joao": "1",
    "rafa": "2",
    "lucas": "3",
    "davi": "4",
    "leon": "5",
    "mateus": "6",
    "luiz": "7"
}
const teams = {
    "intercession": "1",
    "tombWorld": "2",
    "chaosDaemon": "3",
    "novitiate": "4",
    "hierotekCircle": "5",
    "spaceMarine": "6",
    "exaction": "7",
    "justian": "8",
    "VetGuard": "9",
    "karskin": "10",
    "chaosCultists": "11",
    "blooded": "12",
    "phobos": "13",
    "elucidianStartstrider": "14",
    "voidDancer": "15",
    "fellgorRavagers": "16",
    "handOfTheArchon": "17",
    "hearthkynSalvagers": "18",
    "legionary": "19",
    "hunterClade": "20",
    "mandrake": "21",
    "custode": "22",
    "pathfinder": "23",
    "kommando": "24",
    "inquisitorialAgents": "25"
}

const tableName = 'game'

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "kt_result_2nd_edition"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("DB connected");
    var sql = `INSERT INTO ${tableName} (player1, team1, player2, team2, winner_player) VALUES (
        ${players.joao},
        ${teams.intercession},

        ${players.rafa},
        ${teams.blooded},

        ${players.joao})`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

    con.end()
});
