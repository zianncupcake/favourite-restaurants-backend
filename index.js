const express = require("express");
// const cors = require("cors");
// const serverless = require("serverless-http")
const puppeteer = require("puppeteer");

const app = express();
const port = 8080;

// app.use(cors({
//     origin: "*"
//   }));

app.use((req, res, next) => {
    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from all origins
    next();
  });

app.get("/scrape", async (req, res) => {
  const username = req.query.username;
    if (!username) {
      return res.status(400).sendStatus("Username is required");
    }

  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto("https://www.instagram.com/accounts/login", {
      waitUntil: "networkidle2",
    });
    await page.type("input[name=username]", "starlightagents", {
      delay: 20,
    });
    await page.type("input[name=password]", "Sjyjy8600", { delay: 20 });
    await page.click("button[type=submit]", { delay: 20 });

    const notifyBtns = await page.waitForSelector("div.x1i10hfl.x1i10hfl");
    console.log("notifyBtns", notifyBtns);
    if (notifyBtns.length > 0) {
      await notifyBtns[0].click();
    } else {
      console.log("No notification buttons to click.");
    }
    await page.goto(`https://www.instagram.com/${username}/`, {
      waitUntil: "networkidle2",
    });

    let nameText = null;
    try {
      const nameElement = await page.waitForSelector("span.x1lliihq.x1plvlek", {
        timeout: 5000,
      });
      nameText = await nameElement?.evaluate((el) => el.textContent);
    } catch (error) {
      console.log("Name element not found within the specified timeout");
    }
    console.log("BIO", nameText);

    let descriptionText = null;
    try {
      const descriptionElement = await page.waitForSelector(
        "span._ap3a._aaco",
        { timeout: 5000 }
      );
      descriptionText = await descriptionElement?.evaluate(
        (el) => el.textContent
      );
    } catch (error) {
      console.log("Description element not found within the specified timeout");
    }
    console.log("descriptionText", descriptionText);

    let locationText = null;
    try {
      const locationElement = await page.waitForSelector("h1._ap3a._aaco", {
        timeout: 5000,
      });
      locationText = await locationElement?.evaluate((el) => el.textContent);
    } catch (error) {
      console.log("Location element not found within the specified timeout");
    }
    console.log("locationText", locationText);

    let websiteText = null;
    try {
      const websiteElement = await page.waitForSelector(
        "div.x6ikm8r.x10wlt62 > a > span.x1lliihq.x1plvlek > span.x6ikm8r",
        { timeout: 5000 }
      );
      websiteText = await websiteElement?.evaluate((el) => el.textContent);
    } catch (error) {
      console.log("Website element not found within the specified timeout");
    }
    console.log("websiteText", websiteText);
    res.json({
      nameText: nameText,
      descriptionText: descriptionText,
      locationText: locationText,
      websiteText: websiteText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).sendStatus(err);
  }

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// module.exports.handler = serverless(app)