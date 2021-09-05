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

const loadEspn = async () => {
    const [success, page, loginFrame] = await ESPNScraper.loadEspn()
    if (success){
        console.log("ESPN loaded")
        page.screenshot({path:"./puppeteer/readyForLogin.png"})
    }
}

loadEspn()

// io.on("connection", async (socket) => {
//     console.log("New client connected");
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
//     let codeFrame
//     await page.setViewport({
//         width: 1600,
//         height: 1200,
//         deviceScaleFactor: 1,
//     });
//     page.once("load", async () => {
//             socket.emit("load", "Loading Page...")
//             console.log("loaded")
//             try{
//                 await page.waitForSelector("#global-user-trigger", {timeout:60000})
//                 console.log("found Selector")
//             } catch{
//                 await page.screenshot({path: "./puppeteer/noTrigger.png"})
//                 socket.emit("load", "Something Went Wrong")
//             }
//             await page.click("#global-user-trigger")
//             console.log("Clicked the trigger")
//   
//             
//             await page.click('[tref="/members/v3_1/login"]')
//             socket.emit("load", "clicked on login")
//             console.log("login clicked")
//             const frame = page.frames().find(frame => frame._name === "disneyid-iframe")
//             await frame.waitForSelector('input[type="email"]', {timeout:0, visible: true})
//             await frame.type('input[type="email"]', "aaguil3@gmail.com")
//             await frame.type('input[type="password"]', "xzh3ceu!vzq*mxf7VEK")
//             await frame.click('button[type="submit"]')
//             // const [resultTwo] = await Promise.all([
//             //     frame.click('button[type="submit"]'),
//             //     page.waitForNavigation({timeout: 0, waitUntil: "load"})
//             // ]) 

//             socket.emit("load", "submitted login info")
//             console.log("first form submitted")
//             codeFrame = page.frames().find(frame => frame._name === "disneyid-iframe")
//             await codeFrame.waitForTimeout(30000)
//             if(codeFrame.isDetached()){
//                 const cookies = await page.cookies()
//                 const userId = cookies.find(cookie => cookie.name === "SWID")
//                 const espnS2 = cookies.find(cookie => cookie.name === "espn_s2")
//                 if(userId && espnS2){
//                     const userIdString = userId.value.substring(1, 37)
//                     const espnS2String = espnS2.value
//                     console.log("ESPNS2=", espnS2String)
//                     console.log("userId=", userIdString)
//                     const leagues = await EspnApiConn.getLeagues(espnS2String, userIdString)
//                     console.log(leagues)
//                     const leaguesString = JSON.stringify(leagues)
//                     socket.emit("ready", leaguesString)
//                 } else {
//                     console.log("NO COOKIES")
//                     await page.screenshot({path: "./puppeteer/noCookies.png"})
//                     const content = await page.content()
//                     fs.writeFile("./puppeteer/noCookies.html", content, err => {
//                         if(err){
//                             console.error(err)
//                             return
//                         }
//                     })
//                 }
//             } else {

//                 console.log("No detatch after submit, possibly ready for code")
//                 await page.screenshot({path: "./puppeteer/noDetatch.png"})
//                 socket.emit("ready", "Type the code!")
//             }
//             //// this part should wait for response from USER
//     })

//     await page.goto('https://www.espn.com', {waitUntil: 'load', timeout: 0});

//     socket.on("code", async (code) => {
//         console.log("code received")   
//         await codeFrame.type('input[type="tel"]', code)
//         await codeFrame.click('button[type="submit"]')
//         await codeFrame.waitForTimeout(30000)
//         if (codeFrame.isDetached()){
//             await page.screenshot({path: "test4.png"})
//             const cookies = await page.cookies()
//             fs.writeFile("./cookies.js", cookies, err => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })

//                 const userId = cookies.find(cookie => cookie.name === "SWID")
//                 const espnS2 = cookies.find(cookie => cookie.name === "espn_s2")
//                 if(userId && espnS2){
//                     const userIdString = userId.value.substring(1, 37)
//                     const espnS2String = espnS2.value
//                     console.log("ESPNS2=", espnS2String)
//                     console.log("userId=", userIdString)
//                     const leagues = await EspnApiConn.getLeagues(espnS2String, userIdString)
//                     console.log(leagues)
//                     const leaguesString = JSON.stringify(leagues)
//                     socket.emit("done", leaguesString)
//                 } else {
//                     console.log("NO COOKIES")
//                     await page.screenshot({path: "./puppeteer/noCookies2.png"})
//                     const content = await page.content()
//                     fs.writeFile("./puppeteer/noCookies2.html", content, err => {
//                         if(err){
//                             console.error(err)
//                             return
//                         }
//                     })
//                 }

//         } else {
//             console.log("no Detatch after code entry")
//         }
        
//         // const espnS2 = cookies.find(cookie => (
//         //     cookie.name === "espn_s2")).value
//         // const userId = cookies.find(cookie => (
//         //     cookie.name === "SWID"
//         // )).value.substring(1,37)


//         // const leaguesJSON = JSON.stringify(leagus)
//         socket.emit("ready", "You did it!")
//     })
    
//     socket.on("disconnect", async() => {
//         console.log("Client disconnected");
//         await browser.close();
//     });
// });





httpServer.listen(port, () => console.log(`Listening on port ${port}`));


// const start = async function(){
//     // let lg = await EspnApiConn.getLeagueInfo("104204")
//     // EspnApiConn.getSeasons(lg)
//     ESPNScraper.getCookie()

//     // leagues = await EspnApiConn.getLeagues()
//     // console.log(leagues)
// }()




