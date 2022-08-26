const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const helmet = require("helmet"); // creates headers that protect from attacks (security)
const cors = require("cors"); // allows/disallows cross-site communication
const puppeteer = require("puppeteer");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --> Add this
// ** MIDDLEWARE ** //
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000",

];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable");
      callback(null, true);
    } else {
      console.log("Origin rejected");
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(helmet());
// --> Add this
app.use(cors(corsOptions));

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

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`server listening on port: ${PORT}`);
});
