const chai = require('chai');
const expect = chai.expect;
const puppeteer = require('puppeteer');
const sleep = require('../sleep');

const { SERVER_ADDR } = require('../config');

describe('Integracja', function () {

  var browser,
    page;


  this.slow(1000);
  this.timeout(5000);


  const getText = async (selector) => {
    const el = await page.$(selector);
    let text = await page.evaluate(el => el.textContent, el);
    return text.trim();
  };

  const getAriaLabelOfCurrentPage = async () => {
    const el = await page.$('[role="main"]');
    let val = await page.evaluate(el => el.getAttribute('aria-label'), el);
    return val.trim();
  };


  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({
      width: 360,
      height: 640,
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true
    });
    await page.goto(SERVER_ADDR);

    await page.waitForSelector('#page-welcome');
  });

  after(async () => {
    await browser.close();
  });


  describe('Ekran powitania', () => {

    it('zaakceptuj', async () => {
      await page.click('button[type="submit"]');
      const el = await page.$('#page-welcome');
      expect(el).to.be.null;
    });

  });


  describe('Start', () => {

    it('jest widoczna liczba modlitw i dołączeń', async function () {
      this.slow(3000);

      await sleep(1000);
      const text = await getText('h3');
      expect(text).to.have.eq('0 intencji i 0 dołączeń');
    });

    it('jest widoczny slogan', async () => {
      const text = await getText('h4');
      expect(text).to.have.eq('Twoja modlitwa się liczy!');
    });

    it('jest widoczny przycisk "Modlę się"', async () => {
      const text = await getText('a.btn.btn-round');
      expect(text).to.have.eq('Modlę się');
    });

    it('jest widoczny przycisk "Nadaj intencję"', async () => {
      const text = await getText('a.btn:not(.btn-round)');
      expect(text).to.have.eq('Nadaj intencję');
    });

    it('przycisk "Modlę się" przenosi na listę intencji', async () => {
      await page.click('a.btn.btn-round');
      await sleep(100);
      const val = await getAriaLabelOfCurrentPage();
      expect(val).to.have.eq('Lista intencji');
      await page.goBack();
    });

    it('przycisk "Nadaj intencję" przenosi na formularz dodawania intencji', async () => {
      await page.click('a.btn:not(.btn-round)');
      await sleep(100);
      const val = await getAriaLabelOfCurrentPage();
      expect(val).to.have.eq('Formularz nadawania intencji');
      await page.goBack();
    });

  });

});
