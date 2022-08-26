const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const puppeteer = require("puppeteer");

app.get("/weather", async (req, res) => {
  const browser = await puppeteer.launch({ headless: true });

  const aboutBlankPage = (await browser.pages())[0];
  if (aboutBlankPage) {
    await aboutBlankPage.close();
  }

  const page = await browser.newPage();
  await page.goto("https://mars.nasa.gov/msl/weather/");

  const nasaWeatherDataScrape = await page.evaluate(() => {
    let items = [...document.querySelectorAll(".item")];
    return items.map((item) => {
      const newMap = new Map();
      newMap["Sol"] = item.childNodes[0].innerText.split(" ").pop();
      newMap["Date"] = item.childNodes[1].innerText;
      newMap["High"] = item.childNodes[4].innerText
        .split("C")[0]
        .split(" ")
        .pop();
      newMap["Low"] = item.childNodes[4].innerText
        .split("C")[1]
        .split(" ")
        .pop();
      return newMap;
    });
  });

  console.log(nasaWeatherDataScrape, "in");
  res.send(nasaWeatherDataScrape);

  const newPage = (await browser.pages())[0];
  await newPage.close();
});

app.listen(port, () => console.log(`listening on ${port}`));
