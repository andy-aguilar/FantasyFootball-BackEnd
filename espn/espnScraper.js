const puppeteer = require('puppeteer');
const fs = require('fs')

class ESPNScraper{

    static async loadEspn () {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        let loginFrame
        let success = false
        await page.setViewport({
            width: 1600,
            height: 1200,
            deviceScaleFactor: 1,
        });

        try{
            console.log("Starting navigation")
            await page.goto("https://www.espn.com", {waitUntil: "load", timeout: 240000})
            console.log("loaded")
            await page.waitForSelector("#global-user-trigger", {timeout:120000})
            await page.click("#global-user-trigger")
            console.log("Clicked the trigger")
            await page.waitForSelector('[tref="/members/v3_1/login"]', {timeout:60000})
            await page.click('[tref="/members/v3_1/login"]')
            console.log("login clicked")
            loginFrame = page.frames().find(frame => frame._name === "disneyid-iframe")
            await loginFrame.waitForSelector('input[type="email"]', {timeout:60000, visible: true})
            success = true
        } catch {
            await page.screenshot({path: "./puppeteer/noTrigger.png"})
            console.log("NO TRIGGER")
        }

        return [success, page, loginFrame, browser]
    }

    static async handleLogin(frame, page, email, password){
            page.screenshot({path: "./puppeteer/preLoginEntry.png"})
            await frame.type('input[type="email"]', email)
            await frame.type('input[type="password"]', password)
            await frame.click('button[type="submit"]')
            console.log("First form submitted")
            let success = false
            let loggedIn = false
            const userData = {}
            let codeFrame
            try {
                codeFrame = page.frames().find(frame => frame._name === "disneyid-iframe")
                await codeFrame.waitForSelector('input[type="tel"]', {timeout: 60000, visible: true})
                success = true
            } catch {
                console.log("NO ACCESS CODE SCREEN")
                page.screenshot({path: "./puppeteer/noAccessCodeScrn.png"})
                const cookies = await page.cookies()
                const userId = cookies.find(cookie => cookie.name === "SWID")
                const espnS2 = cookies.find(cookie => cookie.name === "espn_s2")
                if(userId && espnS2){
                    userData.userId = userId.value.substring(1,37)
                    userData.espnS2 = espnS2.value
                    success = true
                    loggedIn = true
                }
            }
            return [success, loggedIn, codeFrame, userData]
    }

    static async handleAccessCode(codeFrame, page, code){
        let success = false
        let userData = {}
        page.screenshot({path: "./puppeteer/yesAccessCodeScrn.png"})
        await codeFrame.type('input[type="tel"]', code)
        await codeFrame.click('button[type="submit"]')
        await codeFrame.waitForTimeout(30000)
        const cookies = await page.cookies()
        const userId = cookies.find(cookie => cookie.name === "SWID")
        const espnS2 = cookies.find(cookie => cookie.name === "espn_s2")
        if(userId && espnS2){
            userData.userId = userId.value.substring(1,37)
            userData.espnS2 = espnS2.value
            success = true
        } else {
            page.screenshot({path:"./puppeteer/noCookieAfterCode.png"})
        }
        return [success, userData]

    }
}

module.exports = ESPNScraper