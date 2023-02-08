const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json())

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/player/", async (request, response) => {
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    ORDER BY
     player_Id`;
  const player = await db.all(getPlayerQuery);
  response.send(
    player.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, rose } = playerDetails;
  const addQuery = `INSERT 
         INTO 
         cricket_team
         (player_name, jersey_number, role) 
         VALUES (
        ${playerName},
        ${jerseyNumber},
        ${rose});`;
  const dbResponse = await db.run(addQuery);
  response.send("Player Added to Team");
});
