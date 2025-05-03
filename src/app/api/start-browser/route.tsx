import { NextResponse } from 'next/server'
const puppeteer = require('puppeteer');

export async function POST(request: Request) {
  
  const data = await request.json();
  let geboortedatumFormatted = '0'
  if (data.geboortedatum) {
    try {
      const dateObj = new Date(data.geboortedatum);
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yyyy = dateObj.getFullYear();
      geboortedatumFormatted = `${dd}-${mm}-${yyyy}`;
    } catch (e) {
      // fallback blijft 01-01-1990
    }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://faq.vriendenloterij.nl/contact', { waitUntil: 'networkidle2' });

  await page.type('#subject', `Opzeggen lot, ${data.voornaam} ${data.achternaam}`);

  const lotnummers = data.lotnummers?.filter(nr => nr.trim() !== '').slice(0, 5) || [];

  const bericht = `Geachte VriendenLoterij, \n\nGraag wil ik mijn deelname aan de VriendenLoterij beëindigen. Hierbij zeg ik mijn lot(en) op met de volgende lotnummers:

  ${lotnummers.map((lot, i) => `- Lotnummer ${i + 1}: ${lot}`).join('\n')}\n\nAlvast bedankt voor de afhandeling. \n\nMet vriendelijke groet,\n${data.voornaam} ${data.tussenvoegsel || ''} ${data.achternaam}`.trim();

  await page.type('#question', bericht);

  await page.type('#custom-88qTHkcFa9Yij9szh', geboortedatumFormatted || '01-01-1990');

  await page.type('#custom-WSm74aCRv7GiGyaGA', data.voorletters || 'J.');
  await page.type('#custom-o4KqqTd4RbChzkBeL', data.voornaam || 'Julia');
  await page.type('#custom-WhYpxPEXRFTE3MRat', data.tussenvoegsel || '');
  await page.type('#custom-qGMrbawEcPmsXXa5S', data.achternaam || 'Lange');

  await page.type('#custom-mN7iNzcZP6DPt4LBy', data.postcode || '1234AB');
  await page.type('#custom-5uKnLWTBdWtiDtDjH', data.huisnummer || '55');
  await page.type('#custom-WQBHjrTuoxW28rDpv', data.toevoeging || '');
  await page.type('#custom-L5YcCHatbc9KjDerk', data.straatnaam || 'dapperstraat');
  await page.type('#custom-CM8dLxLrkPaEADXzF', data.woonplaats || 'amsterdam');
  await page.type('#custom-dwi6LHX9z7mm83T5f', data.land || 'Nederland');


  // IDs zoals uit jouw screenshot (let op juiste volgorde!)
const lotnummerInputIds = [
  'custom-SXKHHvJoeguhRYmiL',
  'custom-DJmAwdc4rv86y99pQ',
  'custom-r7G3qviEmwmTJbpAa',
  'custom-mzF2HTFNMKpFN7v7s',
  'custom-9ktLiCmPCATe6nC9g',
];

for (let i = 0; i < lotnummers.length; i++) {
  const inputId = lotnummerInputIds[i];
  if (i > 0) {
    // Klik op "+ voeg nog een lotnummer toe"
    await page.click('.custom-lotnummer-link');
    await page.waitForSelector(`#${inputId}`, { visible: true });
  }
  await page.type(`#${inputId}`, lotnummers[i]);
}
  await page.type('#email', data.email || 'test@gmail.com');
  
  // await browser.close();

  return NextResponse.json({ status: 'success' });
}
