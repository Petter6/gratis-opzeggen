import { NextRequest, NextResponse } from "next/server";
import { getBrowser } from "../../../_lib/getbrowser";

// Define interface for the request data
interface RequestData {
  geboortedatum?: string;
  voornaam?: string;
  achternaam?: string;
  tussenvoegsel?: string;
  lotnummers: string[];
  voorletters?: string;
  postcode?: string;
  huisnummer?: string;
  toevoeging?: string;
  straatnaam?: string;
  woonplaats?: string;
  land?: string;
  email?: string;
  aanhef?: string;
  iban?: string;
}

export async function POST(request: NextRequest) {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto("https://faq.vriendenloterij.nl/contact", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    try {
      const data: RequestData = await request.json();
      let geboortedatumFormatted = "01-01-1990";

      await page.waitForSelector(".select2-selection");
      await page.click(".select2-selection");

      // Navigate with keyboard
      for (let i = 0; i < 2; i++) {
        await page.keyboard.press("ArrowDown");
      }

      await page.keyboard.press("Enter");

      await page.waitForSelector("#select2-custom-Tbskhg5bJ9LYSxLow-container");
      await page.click("#select2-custom-Tbskhg5bJ9LYSxLow-container");

      // Navigate with keyboard
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press("ArrowDown");
      }

      await page.keyboard.press("Enter");

      await page.waitForSelector("#select2-custom-KtdmK8FwJ3Ed2WAeZ-container");
      await page.click("#select2-custom-KtdmK8FwJ3Ed2WAeZ-container");

      // Navigate with keyboard
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press("ArrowDown");
      }
      await page.keyboard.press("Enter");

      await page.waitForSelector("#select2-custom-vBKQJrMrh3ihryCt5-container");
      await page.click("#select2-custom-vBKQJrMrh3ihryCt5-container");

      if (data.aanhef == "Mvr") {
        await page.keyboard.press("ArrowDown");
      }
      await page.keyboard.press("Enter");

      if (data.geboortedatum) {
        try {
          const dateObj = new Date(data.geboortedatum);
          const dd = String(dateObj.getDate()).padStart(2, "0");
          const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
          const yyyy = dateObj.getFullYear();
          geboortedatumFormatted = `${dd}-${mm}-${yyyy}`;
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }

      // Fill out the form
      await page.waitForSelector("#subject", { visible: true });
      await page.type(
        "#subject",
        `Opzeggen lot, ${data.voornaam || ""} ${data.achternaam || ""}`
      );

      const lotnummers = data.lotnummers!;

      const bericht =
        `Geachte VriendenLoterij, \n\nGraag wil ik mijn deelname aan de VriendenLoterij beëindigen. Hierbij zeg ik mijn lot(en) op met de volgende lotnummers:\n\n${lotnummers
          .map((lot: string, i: number) => `- Lotnummer ${i + 1}: ${lot}`)
          .join(
            "\n"
          )}\n\nAlvast bedankt voor de afhandeling. \n\nMet vriendelijke groet,\n${
          data.voornaam || ""
        } ${data.tussenvoegsel || ""} ${data.achternaam || ""}`.trim();

      await page.type("#question", bericht);
      await page.type("#custom-88qTHkcFa9Yij9szh", geboortedatumFormatted);
      await page.type("#custom-WSm74aCRv7GiGyaGA", data.voorletters || "J.");
      await page.type("#custom-o4KqqTd4RbChzkBeL", data.voornaam || "Julia");
      await page.type("#custom-WhYpxPEXRFTE3MRat", data.tussenvoegsel || "");
      await page.type("#custom-qGMrbawEcPmsXXa5S", data.achternaam || "Lange");
      await page.type("#custom-mN7iNzcZP6DPt4LBy", data.postcode || "1234AB");
      await page.type("#custom-5uKnLWTBdWtiDtDjH", data.huisnummer || "55");
      await page.type("#custom-WQBHjrTuoxW28rDpv", data.toevoeging || "");
      await page.type(
        "#custom-L5YcCHatbc9KjDerk",
        data.straatnaam || "dapperstraat"
      );
      await page.type(
        "#custom-CM8dLxLrkPaEADXzF",
        data.woonplaats || "amsterdam"
      );
      await page.type("#custom-dwi6LHX9z7mm83T5f", data.land || "Nederland");

      const lotnummerInputIds: string[] = [
        "custom-SXKHHvJoeguhRYmiL",
        "custom-DJmAwdc4rv86y99pQ",
        "custom-r7G3qviEmwmTJbpAa",
        "custom-mzF2HTFNMKpFN7v7s",
        "custom-9ktLiCmPCATe6nC9g",
      ];

      for (let i = 0; i < lotnummers.length; i++) {
        const inputId = lotnummerInputIds[i];
        if (i > 0) {
          await page.waitForSelector(".custom-lotnummer-link a", {
            visible: true,
          });
          await page.click(".custom-lotnummer-link a");
          await page.waitForSelector(`#${inputId}`, {
            visible: true,
            timeout: 5000,
          });
        }
        await page.type(`#${inputId}`, lotnummers[i]);
      }

      await page.type("#email", data.email || "test@gmail.com");

      await page.type("#custom-bCysFBi5Mj3Lr3GaS", data.iban || "NL");

      // For debugging - take a screenshot
      // await page.screenshot({ path: "form-filled.png" });
      // if (process.env.VERCEL_ENV === "production") {
      //   await page.waitForSelector("#submitQuestion", { visible: true });
      //   await page.click("#submitQuestion");
      // }

      // Don't keep the browser open indefinitely
      // await browser.close();

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error during form filling:", error);
      // await browser.close();
      return NextResponse.json(
        { success: false, error: "Form filling failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error launching browser:", error);
    return NextResponse.json(
      { success: false, error: "Browser launch failed" },
      { status: 500 }
    );
  }
}
