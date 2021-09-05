// io.on("connection", async (socket) => {
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








// const start = async function(){
//     // let lg = await EspnApiConn.getLeagueInfo("104204")
//     // EspnApiConn.getSeasons(lg)
//     ESPNScraper.getCookie()

//     // leagues = await EspnApiConn.getLeagues()
//     // console.log(leagues)
// }()
