const puppeteer = require('puppeteer');
const fs = require('fs')



async function scrape_ss(){

    const browser = await puppeteer.launch({
        headless: false,
        devtools:true,
        slowMo: 250,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            //'--proxy-server=socks5://127.0.0.1:1080',            
        ],        
        ignoreDefaultArgs: ["--enable-automation"]
    });
    const page = await browser.newPage();
    page.setViewport( { 'width':1920, 'height':1080});
    await page.goto('https://free-ss.site/');

    const subscriptionUrl = await page.evaluate(() => {
        return $('.mdui-textfield-input').val();
    });
    
    const ss_list = await page.evaluate(() => {

        function get_all_ss_json(tb)
        {
            let ret = []
            let rows = tb.rows;                           // 获取表格所有行
            let skip_china = 0;
            for(var i = 1; i<rows.length; i++ ){
                //console.log(rows[i])
                let ss = new Object()
                ss.provicder = rows[i].cells[0].innerHTML
                ss.hostname = rows[i].cells[1].innerHTML
                ss.port = rows[i].cells[2].innerHTML
                ss.password = rows[i].cells[3].innerHTML
                ss.method = rows[i].cells[4].innerHTML
                ss.country = rows[i].cells[6].innerHTML
                if(!ss.country.toUpperCase().search("CN"))
                {
                    console.log("skip china");
                    console.log(ss);
                    skip_china =  skip_china +1;
                }
                else
                {
                    ret[i-1 - skip_china] = ss
                }
            }
            return ret
        }
        function generate_url(ss)
        {
            //console.log(ss)
            let plain_ss = ss.method + ":" + ss.password + "@" + ss.hostname + ":" + ss.port
            //console.log(plain_ss)
            let base64_ss = window.btoa(plain_ss)
            //console.log(base64_ss)
            let ret= "ss://" + base64_ss
            //console.log(ret)
            return ret

        }
        function get_ss_suscription(ss_list)
        {
            let plainSsList = ""
            for(let i = 0; i < ss_list.length;i++)
            {
                let ssStr = generate_url(ss_list[i])
                if(plainSsList.length == 0){
                    plainSsList = ssStr;
                }
                else
                    plainSsList = plainSsList + "\n" + ssStr;
            }
            //console.log("SSLIST---->")
            //console.log(plainSsList)
            return plainSsList
        }
        console.log("into table list eval")
        var divs = document.querySelectorAll('div');
        var tbs = $('#tbss')
        for(var i = 0; i < tbs.length;i++){
            let ssList = get_all_ss_json(tbs[i])
            console.log(ssList)
            let ssListStr = get_ss_suscription(ssList)
            console.log(ssListStr)
            return ssListStr
            

        }
    })
    console.log("ss list" + ss_list )

    fs.writeFile("ss.txt",ss_list, function(err){
        if(err){
            console.error(err);
        }
        console.log("data write ok")
        fs.readFile("ss.txt", function (err, data) {
            if (err) {
               return console.error(err);
            }
            console.log("异步读取文件数据: " + data.toString());
         });

    } )
    
    await page.screenshot({path: 'ss.png'});
    await browser.close();
};
scrape_ss()
