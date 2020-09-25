const puppeteer = require('puppeteer');
const fs = require('fs')
var arguments = process.argv.splice(2);
console.log(arguments)
function js_sleep(time = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    })
  };
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
async function scrape_ss(target_file){

    const browser = await puppeteer.launch({
        headless: false,
        devtools:true,
        //slowMo: 250,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            //'--proxy-server=socks5://127.0.0.1:1080',            
        ],        
        ignoreDefaultArgs: ["--enable-automation"]
    });
    const page = await browser.newPage();
    page.setViewport( { 'width':1920, 'height':1080});
    await page.goto('https://free-ss.site/', {
        waitUntil: 'networkidle0'
    });

    let page_html = await page.content();
    //console.log([page_html])

    await page.click('.sorting_asc')

    js_sleep(500);

    await page.click('.sorting_desc')

    let qr_list = await page.$$('.sorting_1')
    console.log("qr list -> " + qr_list)
    console.log("qr list number-> " + qr_list.length)
    qr_list.forEach(function(item,index){
        console.log(item+'---'+index );      

    })

    let qr_number = await page.$$eval('.sorting_1', qr_list =>  {
        console.log("qr list number -> " + qr_list.length)
        return qr_list.length;
    }        
    )
    console.log("qr list 1-> " + qr_number)

    for(let i = 1; i <  qr_number; i++){
        let selector = "#tbss > tbody > tr:nth-child("+ i + ") > td.sorting_1 > i"
        console.log("selector -> " + selector)
        //await page.click(selector)
        //js_sleep(5000);
        //await page.click(selector)
        //js_sleep(5000);
    }


    //  
    
    
    //console.log("qr lsit num -> " + qr_list.length)

    /*
    const result = await page.evaluate(() => 
    {//run js in browser
        //get jquery in page
        let $ = window.$;
        let items =  $('.sorting_1')
        console.log("item number -> " + items.length)

    }
    )
    */





    
    //await page.screenshot({path: target_file+".png"});
    //await browser.close();
};
scrape_ss(arguments[0])
