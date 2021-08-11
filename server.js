const EspnApiConn = require("./espn/espnApiConn");
const ESPNScraper = require("./espn/espnScraper");
const {League, Player, PlayerSeason, Season} = require("./db/models/index")
const bodyParser = require('body-parser');

const app = require("express")();
const httpServer = require("http").createServer(app);
const options = {cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
}};
const io = require("socket.io")(httpServer, options);

const port = process.env.PORT || 4001;
const index = require("./routes/index");


app.use(index);





let interval;

io.on("connection", (socket) => {
    console.log("New client connected");
    timeout = setTimeout(() => getApiAndEmit(socket), 5000);

    socket.on("code", (arg) => console.log(arg))
    
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});



const getApiAndEmit = socket => {
    socket.emit("FromAPI", "Do the thing!");
};

httpServer.listen(port, () => console.log(`Listening on port ${port}`));


// const start = async function(){
//     // let lg = await EspnApiConn.getLeagueInfo("104204")
//     // EspnApiConn.getSeasons(lg)
//     ESPNScraper.getCookie()

//     // leagues = await EspnApiConn.getLeagues()
//     // console.log(leagues)
// }()




