const express = require("express");
const EspnApiConn = require("./espn/espnApiConn");
const ESPNScraper = require("./espn/espnScraper")

const {League, Player, PlayerSeason, Season} = require("./db/models/index")
const bodyParser = require('body-parser');


const app = express()

const PORT = 8000

const start = async function(){
    // let lg = await EspnApiConn.getLeagueInfo("104204")
    // EspnApiConn.getSeasons(lg)
    ESPNScraper.getCookie()

    // leagues = await EspnApiConn.getLeagues()
    // console.log(leagues)
}()


app.listen(PORT, () => { console.log("We are live on " + PORT)})