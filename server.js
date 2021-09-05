const EspnApiConn = require("./espn/espnApiConn");
const ESPNScraper = require("./espn/espnScraper");
const {League, Player, PlayerSeason, Season} = require("./db/models/index")
const bodyParser = require('body-parser');

const fs = require('fs')

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


const puppeteer = require('puppeteer');

// const loadEspn = async () => {
//     const [success, page, loginFrame] = await ESPNScraper.loadEspn()
//     if (success){
//         console.log("ESPN loaded")
//         page.screenshot({path:"./puppeteer/readyForLogin.png"})
//     }
// }

// loadEspn()

io.on("connection", async (socket) => {
    console.log("New client connected")
    // const [success, page, loginFrame, browser] = await ESPNScraper.loadEspn()
    // if (success){
    //     console.log("ESPN loaded")
    //     socket.emit("readyForLogin", "readyForLogin")
    // } else {
    //     socket.emit("error", "Something went wrong. We could not communicate with ESPN's servers. Please try again later.")
    // }

    socket.on("login", async (resp) => {
        console.log(typeof resp)
        console.log(resp.email)
        console.log(resp.password)
    })
    
    socket.on("disconnect", async() => {
        console.log("Client disconnected")
        // await browser.close()
    });
})





httpServer.listen(port, () => console.log(`Listening on port ${port}`));