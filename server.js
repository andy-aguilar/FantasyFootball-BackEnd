const EspnApiConn = require("./espn/espnApiConn");
const ESPNScraper = require("./espn/espnScraper");
const ESPNSocket = require("./espn/espnSocket")
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


io.on("connection", async (socket) => {
    console.log("New client connected")
    const [success, page, loginFrame, browser] = await ESPNScraper.loadEspn()
    let codeFrame
    if (success){
        console.log("ESPN loaded")
        socket.emit("readyForLogin", "readyForLogin")
    } else {
        socket.emit("error", "Something went wrong. We could not communicate with ESPN's servers. Please try again later.")
    }

    socket.on("login", async (resp) => {
        const [posRes, loggedIn, newFrame, userData] = await ESPNScraper.handleLogin(loginFrame, page, resp.email, resp.password)
        codeFrame = newFrame
        if(posRes && loggedIn){
            //Login succeeded without need for access code
            socket.emit("success", userData)
        } else if(posRes){
            // Login succeeded but needs access code
            socket.emit("readyForCode", "readyForCode")
        } else {

            socket.emit("error", "Something went wrong...")
        }
    })

    socket.on("code", async(resp) => {
        const [loggedIn, userData] = await ESPNScraper.handleAccessCode(codeFrame, page, resp.code)
        if(loggedIn){
            socket.emit("success", userData)
        } else {
            socket.emit("error", "Something went wrong...")
        }
    })
    
    socket.on("disconnect", async() => {
        console.log("Client disconnected")
        await browser.close()
    });
})





httpServer.listen(port, () => console.log(`Listening on port ${port}`));