import puppeteer from "puppeteer";
import express from "express";
var app = express();

app.get("/", async function (req, res) {
  let dataHemominas = await scrapHemominas(browser);
  res.json({ dataHemominas });
});

app.listen(3005, function () {
  console.log("Example app listening on port 3005!");
});

let browser: puppeteer.Browser;
(async () => {
  browser = await puppeteer.launch({
    //headless: false,
  });
})();

async function scrapHemominas(browser: puppeteer.Browser) {
  const page = await browser.newPage();
  await page.goto(`http://www.hemominas.mg.gov.br/`);

  let data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div.bolsasangue.span3 ")).map(
      (data: any) => ({
        type: data.children[0].textContent,
        state: data.children[2].textContent,
        img: data.children[1].children[0].currentSrc,
      })
    );
  });

  await page.close();

  return data;
}
