const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: true});//must set headlesss to true in pdf mode
    const page = await browser.newPage();
    page.setViewport( { width:1280, height:720});
    await page.goto('https://www.baidu.com',  {waitUntil: 'networkidle2'});
    await page.pdf({path: 'output/example.pdf', format:'A4'});
    await browser.close();
})();