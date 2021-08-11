const puppeteer = require('puppeteer');

class ESPNScraper{
    static async getCookie(){
        const browser = await puppeteer.launch()
        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage()
        await page.setViewport({
            width: 1600,
            height: 1200,
            deviceScaleFactor: 1,
        });

        page.once("load", async () => {
            console.log("loaded")

            await page.click("#global-user-trigger")
            
            await page.click('[tref="/members/v3_1/login"]');
            await page.waitForTimeout(500)

            // await page.type('input', "aaguil3@gmail.com")
            const frame = page.frames().find(frame => frame._name === "disneyid-iframe")
            await frame.type('input[type="email"]', "aaguil3@gmail.com")
            await frame.type('input[type="password"]', "dalk_GNI0mok!jept")
            await frame.click('button[type="submit"]')
            await page.waitForTimeout(4000)

            // console.log(input)
            await page.screenshot({path: "test4.png"})
            console.log('done')
        })

        await page.goto('https://www.espn.com');



    
    }
}

module.exports = ESPNScraper