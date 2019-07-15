"use strict"

const navigate = require("./../../../lib/actions/navigate.js"),
      config = require("./../../../lib/client-config.js"),
      form = require("./../../../lib/containers/form.js"),
      mainNavigation = require("./../../../lib/containers/main-navigation");


describe("[F#1 | T#1]: Shanghai -> Yunnan Lu", () => {

    beforeAll(async () => {
        console.log(config.urls.locations.shanghai.yunnanLu);
        await navigate.toURL(config.urls.locations.shanghai.yunnanLu);
    });

    it("[TC #1]: should have sub-navigation bar", async () => {
        mainNavigation.setCustomNavigation("styleBreadcrumb__BreadcrumbContainer-sc-13o4qwy-0");
        await mainNavigation.isDisplayed(true);
        
        //Validate 首页 link is exit
        //mainNavigation.validateText('css', 'a[href*="https://www.wework.cn"]', "首页1")
        let home = await element(by.css('a[href*="https://www.wework.cn"]')).getText();
        console.log("Home link text: " + home);
        expect(home).toEqual("首页");

        //Validate 上海 link is exit
        //mainNavigation.validateText('css', 'a[href*="/city/shanghai"]', "上海1")
        let city = await element(by.css('a[href*="/city/shanghai"]')).getText();
        console.log("City link text: " + city);
        expect(city).toEqual("上海");

        //Validate 云南路118号 link is exit
        //mainNavigation.validateText('css', 'a[href*="/building/yunnanlu"]', "云南路118号")
        let l = "";
        let location = await element.all(by.css('a[href*="/building/yunnanlu"]')).map(elm => {
            return elm.getText().then(text => { 
                if(text === "云南路118号"){
                    l = text;
                    return text;
                }
            });
        })
        console.log("Location link text: " + l);
        expect(l).toEqual("云南路118号")
    });

    it("[TC #2]: should have location name and description", async () => {
        //mainNavigation.validateText('css', 'div[class*="ModuleTitle-sc-1j913nd-0"]', "云南路118号")
        let lName = "", location = await element.all(by.css('div[class*="ModuleTitle-sc-1j913nd-0"]')).map(elm => {
            return elm.getText().then(text => { 
                if(text === "云南路118号"){
                    lName = text;
                    return lName;
                }
            });
        });

        console.log("Location link text: " + lName);
        expect(lName).toEqual("云南路118号")

        //description
        let expectedText = "WeWork云南路118号位于黄浦区的中心地段，人民广场与淮海路之间，地铁 8号线直达。云南路被誉为中国美食之街，繁华而优越的地理位置使你与这个城市联系更加紧密，为你的工作带去更多便利。"
        //mainNavigation.validateText('class', "styleParagraph__Paragraph-sc-1asp3d4-0", expectedText)
        let description = await element(by.className("styleParagraph__Paragraph-sc-1asp3d4-0")).getText();
        console.log(description);
        expect(description).toEqual("WeWork云南路118号位于黄浦区的中心地段，人民广场与淮海路之间，地铁 8号线直达。云南路被誉为中国美食之街，繁华而优越的地理位置使你与这个城市联系更加紧密，为你的工作带去更多便利。")
    });

    it("TC #3]: should book the appointment", async () => {
        //verify the appointment form is exit
        expect(await element(by.className("OverlapLoader__OverlapLoaderWrapper-sc-1ywwqtb-0")).isDisplayed()).toBe(true);
        let appointmentTitle = await element(by.className("styleFormHeader__Title-sc-1lo07oi-2")).getText();
        expect(appointmentTitle).toEqual("云南路118号"); // Verify title

        //Avoid to use id in automation testing!
        await element(by.id("name")).click().sendKeys("Naren Chejara");
        await element(by.id("email")).click().sendKeys("jay@ho.com");
        await element(by.id("phone")).click().sendKeys("13524343720");
        await element(by.id("marketingConsent")).click();
        await element(by.className("styleUserInfoForm__SubmitButton-sc-1oni95b-8")).click();

        await browser.driver.sleep(10000);
        await element(by.id("BuildingPageTourInfoForm"));

        // choose a date
        await element(by.className("ant-calendar-picker-input")).click();
        //select month
        let nextMonthBtn;
        await element.all(by.css('a[class*="ant-calendar-next-month-btn"]')).map(elm => {
            return elm.getAttribute('title').then(title => {
                if(title === "下个月 (翻页下键)"){
                    nextMonthBtn = elm;
                    return;
            
                }
            })
        })
        await nextMonthBtn.click();
        

        //Select Day
        let dayEle;
        await element.all(by.className("ant-calendar-date")).map(elm => {
            return elm.getText().then(day => {
                if(day === "17"){
                    dayEle = elm;
                    return; 
                }
            });
        });
        await dayEle.click();

        //Click to select time
        let timeElm;
        await element.all(by.className("ant-select-selection__placeholder")).map(elm => {
            return elm.getText().then(placeHolder => {
                //console.log(placeHolder);
                if(placeHolder === "正在加载..."){
                    timeElm = elm;
                    return;
                }
            })
        });
        await browser.driver.sleep(2000);
        await timeElm.click();

        // Select Time
        //ant-select-dropdown-menu-item
        let timeE;
        await element.all(by.css('li[class*="ant-select-dropdown-menu-item"]')).map(elm => {
            browser.driver.sleep(10000);
            return elm.getText().then(t => {
                if(t === "2:00 PM"){
                    timeE = elm;
                    return;
                }
            })
        })
        await timeE.click();

        //Enter Company name (公司名称)
        await element(by.id("companyName")).click().sendKeys("WeWork");
        
        //Reservation | 请选择您的预约目的
        let resElm;
        await element.all(by.className("ant-select-selection__placeholder")).map(elm => {
            browser.driver.sleep(5000);
            return elm.getText().then(placeHolder => {
                if(placeHolder === "请选择您的预约目的"){
                    resElm = elm;
                    return;
                }
            })
        });
        await resElm.click();

        let selectResElm;
        await element.all(by.css('li[class*="ant-select-dropdown-menu-item"]')).map(elm => {
            browser.driver.sleep(5000);
            return elm.getText().then(t => {
                //console.log(t + "==" + (t === "市场及品牌合作"))
                if(t === "市场及品牌合作"){
                    selectResElm = elm;
                    return;    
                }
            })
        })
        await selectResElm.click();
        // await browser.driver.sleep(10000);

        //Submit the form
        //await element(by.className("SubmitButton")).click();
    });

    xit("[TC #4]: should have sub-navigation bar", async () => {
        
    });

    
});