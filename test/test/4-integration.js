const chai = require('chai');
const expect = chai.expect;
const puppeteer = require('puppeteer');
const sleep = require('../sleep');

const { SERVER_ADDR } = require('../config');
const { version } = require('../../package.json');

describe('Integracja', function () {

  var browser,
    page;


  this.slow(1000);
  this.timeout(5000);


  const getVisible = async (selector) => {
    return await page.waitForSelector(selector, { visible: true });
  };

  const getHidden = async (selector) => {
    return await page.waitForSelector(selector, { hidden: true });
  };

  const getValueOfSomething = async (selector, callback, ...args) => {
    const el = typeof selector === 'string' ? await getVisible(selector) : selector;
    args.unshift(el);

    let text = await page.evaluate(callback, ...args);
    return text.trim();
  };

  const getText = async (selector) => {
    return await getValueOfSomething(selector, el => el.textContent);
  };

  const getAttr = async (selector, attrName) => {
    return await getValueOfSomething(selector, (el, attrName) => el.getAttribute(attrName), attrName);
  };

  const getAriaLabelOfCurrentPage = async () => {
    return await getAttr('[role="main"]', 'aria-label');
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


  describe('Menu główne', () => {

    const menuElements = [
      {
        title: 'Start',
        to: 'Ekran główny',
        id: 'page-home'
      },
      {
        title: 'Lista intencji',
        to: 'Lista intencji',
        id: 'page-list-of-intentions'
      },
      {
        title: 'Nadaj intencję',
        to: 'Formularz nadawania intencji',
        id: 'page-send-intention'
      },
      {
        title: 'Lista moich intencji',
        to: 'Lista moich intencji',
        id: 'page-list-of-my-intentions'
      },
      {
        title: 'Jak się modlić?',
        to: 'Jak się modlić?',
        id: 'page-how-to-pray'
      },
      {
        title: 'O aplikacji',
        to: 'O aplikacji',
        id: 'page-about'
      }
    ];


    it('menu jest zamknięte', async () => {
      let val = await getAttr('.main-menu-trigger', 'aria-expanded');
      expect(val).to.be.eq('false');

      val = await getAttr('nav.main-menu', 'class');
      expect(val).to.not.include('opened');
    });

    it('widać przycisk "Menu"', async () => {
      const el = await getVisible('.main-menu-trigger');
      const text = await getText(el);
      expect(text).to.be.eq('Menu');
    });

    it('otwórz menu', async () => {
      await page.click('.main-menu-trigger');
    });

    it('menu jest otwarte', async () => {
      let val = await getAttr('.main-menu-trigger', 'aria-expanded');
      expect(val).to.be.eq('true');

      val = await getAttr('nav.main-menu', 'class');
      expect(val).to.include('opened');
    });

    it('widać przycisk "Zamknij menu"', async () => {
      const el = await getVisible('.main-menu-trigger');
      const text = await getText(el);
      expect(text).to.be.eq('Zamknij menu');
    });

    it('widać listę', async () => {
      const el = await getVisible('.main-menu-container > ul[role="menu"]');
      expect(el).to.be.not.null;
    });

    for (let i = 0; i < menuElements.length; i++) {
      ((n, item) => {
        it(`lista: widać "${item.title}"`, async () => {
          const el = await getVisible(`.main-menu-container > ul[role="menu"] > li:nth-child(${n})`);
          expect(el).to.be.not.null;

          const text = await getText(el);
          expect(text).to.be.eq(item.title);
        });

        it(`lista: "${item.title}" przenosi poprawnie`, async () => {
          await page.click(`.main-menu-container > ul[role="menu"] > li:nth-child(${n})`);
          await sleep(100);

          let val = await getAriaLabelOfCurrentPage();
          expect(val).to.be.eq(item.to);

          val = await getAttr('.view-container', 'id');
          expect(val).to.be.eq(item.id);

          await page.click('.main-menu-trigger');
        });
      })(i + 1, menuElements[i]);
    }

    it('widać stopkę', async () => {
      const el = await page.$('footer[role="contentinfo"]');
      expect(el).to.be.not.null;
    });

    it('stopka: widać poprawną wersję', async () => {
      const text = await getText('nav > footer > span:last-child');
      expect(text).to.be.eq(`v${version}`);
    });

    it('przejdź na ekran główny (zamknij menu)', async () => {
      await page.click(`.main-menu-container > ul[role="menu"] > li:nth-child(1)`);
    });

  });


  describe('Start', () => {

    it('jest widoczna liczba modlitw i dołączeń', async function () {
      this.slow(3000);

      await sleep(1000);
      const text = await getText('h3');
      expect(text).to.be.eq('0 intencji i 0 dołączeń');
    });

    it('jest widoczny slogan', async () => {
      const text = await getText('h4');
      expect(text).to.be.eq('Twoja modlitwa się liczy!');
    });

    it('jest widoczny przycisk "Modlę się"', async () => {
      const text = await getText('a.btn.btn-round');
      expect(text).to.be.eq('Modlę się');
    });

    it('jest widoczny przycisk "Nadaj intencję"', async () => {
      const text = await getText('a.btn:not(.btn-round)');
      expect(text).to.be.eq('Nadaj intencję');
    });

    it('przycisk "Modlę się" przenosi na listę intencji', async () => {
      await page.click('a.btn.btn-round');
      await sleep(100);
      const val = await getAriaLabelOfCurrentPage();
      expect(val).to.be.eq('Lista intencji');
      await page.goBack();
    });

    it('przycisk "Nadaj intencję" przenosi na formularz dodawania intencji', async () => {
      await page.click('a.btn:not(.btn-round)');
      await sleep(100);
      const val = await getAriaLabelOfCurrentPage();
      expect(val).to.be.eq('Formularz nadawania intencji');
      await page.goBack();
    });

  });


  describe('Jak się modlić?', () => {

    const prayers = [
      {
        title: 'Gdy masz tylko chwilę',
        items: [
          'Ojcze nasz (Modlitwa Pańska)',
          'Zdrowaś Maryjo (Pozdrowienie anielskie)',
          'Pod Twoją obronę',
          'Chwała Ojcu',
          'Modlitwa św. Franciszka'
        ]
      },
      {
        title: 'Gdy chcesz poświęcić na modlitwę więcej czasu',
        items: [
          'Różaniec',
          'Koronka do Bożego Miłosierdzia'
        ]
      },
      {
        title: 'Litanie',
        items: [
          'Litania do Najświętszej Maryi Panny (Loretańska)',
          'Litania do Najświętszego Serca Pana Jezusa',
          'Litania do Wszystkich Świętych'
        ]
      },
      {
        title: 'Modlitwy Maryjne',
        items: [
          'Zdrowaś Maryjo (Pozdrowienie anielskie)',
          'Pod Twoją obronę',
          'Litania do Najświętszej Maryi Panny (Loretańska)'
        ]
      }
    ];

    before(async () => {
      await page.goto(`${SERVER_ADDR}/#/jak-sie-modlic`);
    });

    for (let i = 0; i < prayers.length; i++) {
      ((n, category) => {

        it(`widać kategorię "${category.title}"`, async () => {
          const el = await getVisible(`ul.list > li:nth-child(${n}) > span`);
          expect(el).to.be.not.null;

          const text = await getText(el);
          expect(text).to.be.eq(category.title);
        });

        it(`nie widać modlitw w kategorii "${category.title}"`, async () => {
          const el = await getHidden(`ul.list > li:nth-child(${n}) > ul`);
          expect(el).to.be.not.null;
        });

        it(`kliknięcie pokazuje modlitwy w kategorii "${category.title}"`, async () => {
          await page.click(`ul.list > li:nth-child(${n}) > span`);
          const el = await getVisible(`ul.list > li:nth-child(${n}) > ul.expanded`);
          expect(el).to.be.not.null;
        });

        it(`zamknięcie kategorii "${category.title}"`, async () => {
          await page.click(`ul.list > li:nth-child(${n}) > span`);
          const el = await page.$(`ul.list > li:nth-child(${n}) > ul.expanded`);
          expect(el).to.be.null;
        });

        for (let j = 0; j < category.items.length; j++) {
          ((n, m, prayer) => {

            it(`widać modlitwę "${prayer}"`, async () => {
              await page.click(`ul.list > li:nth-child(${n}) > span`);

              const el = await getVisible(`ul.list > li:nth-child(${n}) > ul > li:nth-child(${m}) > span`);
              expect(el).to.be.not.null;

              const text = await getText(el);
              expect(text).to.be.eq(prayer);
            });

            it(`otworzenie modlitwy "${prayer}"`, async () => {
              await page.click(`ul.list > li:nth-child(${n}) > ul > li:nth-child(${m}) > span`);

              const hb = await getVisible(`a.header-back`);
              expect(hb).to.be.not.null;

              let text = await getText(hb);
              expect(text).to.be.eq(prayer);

              text = await getText('article');
              expect(text).to.not.be.empty.and.not.to.be.eq('undefined');

              await hb.click();
            });

          })(n, j + 1, category.items[j]);
        }

      })(i + 1, prayers[i]);
    }

  });


  describe('O aplikacji', () => {

    before(async () => {
      await page.goto(`${SERVER_ADDR}/#/o-aplikacji`);
    });

    it('wersja wyświetla się poprawnie', async () => {
      const text = await getText('article > p:first-of-type');
      expect(text).to.be.eq(`Wersja ${version}`);
    });

  });


});
