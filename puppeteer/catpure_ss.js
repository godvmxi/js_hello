const puppeteer = require('puppeteer');

(async () => {



    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--proxy-server=socks5://127.0.0.1:1080',            
        ],
        ignoreDefaultArgs: ["--enable-automation"]
    });
    const page = await browser.newPage();
    page.setViewport( { 'width':1280, 'height':720});
    await page.goto('https://free-ss.site/');

    const subscriptionUrl = await page.evaluate(() => {
        return $('.mdui-textfield-input').val();
    });
    //await page.screenshot({path: 'output/ss.png'});
    //await browser.close();
})();