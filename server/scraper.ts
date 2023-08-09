const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { parse } = require('path');

const BRICKHOUSE_URL = 'https://brickhousedance.com/open-classes/';

export const fetchData = async(url: String) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        });

        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log("Waiting...")

        await page.waitForTimeout(10000);    // convert to waitForSelector

        const htmlContent = await page.content();
        // console.log(htmlContent);
        await browser.close();

        return htmlContent;
    } catch(error) {
        console.error('Error fetching data: ', error);
        return null;
    }
}

export function parseHTML(html: any) {
    const $ = cheerio.load(html);
    return $;
}

export function extractClassesInfo($: any) {
    const classesInfo = [];

    // $('span.hc_time').each((index, element) => {
    //     // console.log(element);
    //     classesInfo.push($(element));
    // });
    // console.log(classesInfo[0]['0']);

    // $('time.hc_starttime').each((index, element) => {
    //     // console.log(element);
    //     classesInfo.push($(element).text());
    // });

    classesInfo.push(extractStartTime($));
    classesInfo.push(extractEndTimes($));

    return classesInfo;
}

export function extractStartTime($: any) {
    const startTimes: any[] = []
    $('time.hc_starttime').each((index: number, element: any) => {
        startTimes.push($(element).text());
    });
    return startTimes;
}

export function extractEndTimes($: any) {
    const endTimes: any[] = []
    $('time.hc_endtime').each((index: number, element: any) => {
        endTimes.push($(element).text());
    })
    return endTimes;
}

export const runScraper = async(url: string) => {
    const html = await fetchData(url);
    const $ = parseHTML(html);

    const classesInfo = extractClassesInfo($);

    const data = classesInfo;
    console.log(data);
    console.log(data.length);
    // console.log(data.classesInfo[0].children);
    console.log("Finished");
    return data;
}

runScraper(BRICKHOUSE_URL);