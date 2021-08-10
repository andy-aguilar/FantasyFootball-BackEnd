const express = require("express");
const EspnApiConn = require("./espn/espnApiConn")
const {League, Player, PlayerSeason, Season} = require("./db/models/index")
const bodyParser = require('body-parser');


const app = express()

const PORT = 8000

const start = async function(){
    // let lg = await EspnApiConn.getLeagueInfo("104204")
    // EspnApiConn.getSeasons(lg)

    leagues = await EspnApiConn.getLeagues()
    console.log(leagues)
}()

//{77C6A8B2-458E-48C0-B354-B11399EF4796}
//{77C6A8B2-458E-48C0-B354-B11399EF4796}
//{77C6A8B2-458E-48C0-B354-B11399EF4796}
//{77C6A8B2-458E-48C0-B354-B11399EF4796}
//{09363C00-EF83-41D0-B333-8EA9EC2B7E21}

//{EA55B21B-57D7-4D03-A64A-2A3C50A10022}
//{EA55B21B-57D7-4D03-A64A-2A3C50A10022}
//{EA55B21B-57D7-4D03-A64A-2A3C50A10022}
//{EA55B21B-57D7-4D03-A64A-2A3C50A10022}


app.listen(PORT, () => { console.log("We are live on " + PORT)})