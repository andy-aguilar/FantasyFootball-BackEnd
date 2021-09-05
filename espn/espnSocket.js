const ESPNScraper = require("./espnScraper");

const espnSocket = async(socket) => {
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
}

module.exports=espnSocket