const express = require("express");
const EspnApiConn = require("./espn/espnApiConn")
const {League, Player, PlayerSeason, Season} = require("./db/models/index")
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express()

const PORT = 8000

const start = async function(){
    let lg = await EspnApiConn.getLeagueInfo("104204")
    EspnApiConn.getSeasons(lg)
}()


app.listen(PORT, () => { console.log("We are live on " + PORT)})