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

        return [success, page, loginFrame]
    }
}

module.exports = ESPNScraper