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

// ESPNScraper.getCookie()


io.on("connection", async (socket) => {
    console.log("New client connected");
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    let codeFrame
    await page.setViewport({
        width: 1600,
        height: 1200,
        deviceScaleFactor: 1,
    });
    page.once("load", async () => {
            socket.emit("load", "Loading Page...")
            console.log("loaded")
            try{
                await page.waitForSelector("#global-user-trigger", {timeout:60000})
                console.log("found Selector")
            } catch{
                socket.emit("load", "Something Went Wrong")
            }
            await page.click("#global-user-trigger")
            console.log("Clicked the trigger")
            // const [result] = await Promise.all([
            //     page.waitForNavigation({timeout: 0, waitUntil: "load"}),
            //     page.click('[tref="/members/v3_1/login"]')
            // ])
            await page.waitForSelector('[tref="/members/v3_1/login"]', {timeout:0})
            await page.click('[tref="/members/v3_1/login"]')
            socket.emit("load", "clicked on login")
            console.log("login clicked")
            const frame = page.frames().find(frame => frame._name === "disneyid-iframe")
            await frame.waitForSelector('input[type="email"]', {timeout:0})
            await frame.type('input[type="email"]', "aaguil3@gmail.com")
            await frame.type('input[type="password"]', "dalk_GNI0mok!jept")
            await frame.click('button[type="submit"]')
            // const [resultTwo] = await Promise.all([
            //     frame.click('button[type="submit"]'),
            //     page.waitForNavigation({timeout: 0, waitUntil: "load"})
            // ]) 

            socket.emit("load", "submitted login info")
            console.log("first form submitted")
            codeFrame = page.frames().find(frame => frame._name === "disneyid-iframe")
            if(codeFrame){
                await page.waitForTimeout(10000)
                await page.screenshot({path: "afterLoginClick.png"})
                const content = await page.content()
                fs.writeFile("./afterLoginClickContent.html", content, err => {
                    if (err) {
                        console.error(err)
                        return
                    }}
                )
                socket.emit("ready", "Type the code!")

            } else {
                socket.emit("ready", "Something went wrong")
            }
            //// this part should wait for response from USER
    })

    await page.goto('https://www.espn.com', {waitUntil: 'load', timeout: 0});

    socket.on("code", async (code) => {
        console.log("code received")   
        await codeFrame.type('input[type="tel"]', code)
        await codeFrame.click('button[type="submit"]')
        await page.waitForTimeout(1000)
        await page.screenshot({path: "test4.png"})
        const cookies = await page.cookies()
        const espnS2 = cookies.find(cookie => (
            cookie.name === "espn_s2")).value
        const userId = cookies.find(cookie => (
            cookie.name === "SWID"
        )).value.substring(1,37)

        console.log("ESPNS2=", espnS2)
        console.log("userId=", userId)
        // const leagues = await EspnApiConn.getLeagues(espnS2, userId)
        // console.log(leagues)
        // const leaguesJSON = JSON.stringify(leagus)
        socket.emit("done", "You did it!")
    })
    
    socket.on("disconnect", async() => {
        console.log("Client disconnected");
        await browser.close();
    });
});





httpServer.listen(port, () => console.log(`Listening on port ${port}`));


// const start = async function(){
//     // let lg = await EspnApiConn.getLeagueInfo("104204")
//     // EspnApiConn.getSeasons(lg)
//     ESPNScraper.getCookie()

//     // leagues = await EspnApiConn.getLeagues()
//     // console.log(leagues)
// }()




