const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setViewport( { 'width':1280, 'height':720});
    await page.goto('https://www.baidu.com');
    await page.screenshot({path: 'output/example.png'});
    await browser.close();
})();