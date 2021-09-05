const EspnApiConn = require("./espn/espnApiConn");
const ESPNScraper = require("./espn/espnScraper");
const ESPNSocket = require("./espn/espnSocket")
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



io.on("connection", ESPNSocket)





httpServer.listen(port, () => console.log(`Listening on port ${port}`));