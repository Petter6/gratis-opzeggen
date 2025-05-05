// src/lib/getBrowser.ts
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function getBrowser() {
  if (process.env.VERCEL_ENV === "production") {
    const executablePath = await chromium.executablePath();

    return await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
  } else {
    return await puppeteer.launch({
      headless: false, // Show browser window in development
      defaultViewport: null,
    });
  }
}
