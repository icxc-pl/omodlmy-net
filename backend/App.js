'use strict';

const path = require('path');
const express = require('express');
const svgCaptcha = require('svg-captcha');

const config = require('./config');


/**
 * App
 */
class App {

  /**
   * Constructor
   */
  constructor() {
    this.config = config;
    this.srv = express();
    this.mongod = null;

    this.initControllers();
    this.setup();
    this.handle();
  }

  /**
   * Init Controllers
   */
  initControllers() {
    this.controller = {};

    const controllersPath = path.resolve(__dirname, './lib/controllers');

    {
      let DBController = require(path.join(controllersPath, 'DB'));
      this.controller.db = new DBController();
    }

    {
      let SessionController = require(path.join(controllersPath, 'Session'));
      this.controller.session = new SessionController(this.controller.db);
    }

    {
      let StatsController = require(path.join(controllersPath, 'Stats'));
      this.controller.stats = new StatsController(
        this.controller.db,
        this.controller.session
      );
    }

    {
      let IntentionsController = require(path.join(controllersPath, 'Intentions'));
      this.controller.intentions = new IntentionsController(
        this.controller.db,
        this.controller.session
      );
    }

    {
      let PrayersController = require(path.join(controllersPath, 'Prayers'));
      this.controller.prayers = new PrayersController(
        this.controller.db,
        this.controller.session
      );
    }

    {
      let ApiController = require(path.join(controllersPath, 'Api'));
      this.controller.api = new ApiController(
        this.srv,
        this.controller.stats,
        this.controller.intentions,
        this.controller.prayers,
        this.controller.session
      );
    }

  }

  /**
   * Setup
   */
  setup() {
    this.enableCookiesSupport();
    this.enableSessionSupport();
    this.enableJsonSupport();
    this.enablePostDataSupport();
    this.setupSecurity();
  }

  /**
   * Handle
   */
  handle() {
    this.handleApiCalls();
    this.handleCaptcha();
    this.handleStaticFiles();
    this.handleOtherCases();
    this.handleInternalServerErrors();
  }

  /**
   * Start
   */
  start() {
    this.controller.db.init().then(() => {

      if (config.serverHttps) {
        const https = require('https');
        const fs = require('fs');
        const certDir = path.resolve(__filename, '../../common/cert');

        https.createServer({
          key: fs.readFileSync(path.join(certDir, 'local.omodlmy.net.key')),
          cert: fs.readFileSync(path.join(certDir, 'local.omodlmy.net.cert'))
        }, this.srv).listen(this.config.serverPort, () => {
          console.log(`server [https]: Listening ${this.config.serverAddr}:${this.config.serverPort}`);
        });

      } else {
        this.srv.listen(this.config.serverPort, this.config.serverAddr, () => {
          console.log(`server: Listening ${this.config.serverAddr}:${this.config.serverPort}`);
        });
      }

    }).catch(function() {
      process.exit(1);
    });
  }

  /**
   * Setup Security
   */
  setupSecurity() {
    const securityController = require('./lib/controllers/Security');
    this.srv.set('trust proxy', 1);
    this.srv.use(securityController.helmet);
    this.srv.use(securityController.allowedMethods);
    this.srv.use(securityController.cors);
    this.srv.use(securityController.xsrf);
  }

  /**
   * Enable Cookies Support
   */
  enableCookiesSupport() {
    const cookieParser = require('cookie-parser');
    this.srv.use(cookieParser());
  }

  /**
   * Enable Session Support
   */
  enableSessionSupport() {
    this.srv.use(this.controller.session.expressIntegration());
  }

  /**
   * Enable JSON Support
   */
  enableJsonSupport() {
    this.srv.use(express.json());

    this.srv.use((req, res, next) => {
      if (req.url.startsWith('/api/')) {
        res.header('Content-Type', 'application/json; charset=utf-8');
      }
      next();
    });
  }

  /**
   * Enable POST Data Support
   */
  enablePostDataSupport() {
    this.srv.use(express.urlencoded({
      extended: true
    }));
  }

  /**
   * Handle Internal Server Errors
   */
  handleInternalServerErrors() {
    this.srv.use(this.controller.api.handleInternalServerErrors);
  }

  /**
   * Handle API Calls
   */
  handleApiCalls() {
    // GET Meta
    this.controller.api.GET('/api/meta', 'getMeta');

    // GET Home Stats
    this.controller.api.GET('/api/home-stats', 'getHomeStats');

    // GET List of Intentions
    this.controller.api.GET('/api/intentions', 'getIntentions');

    // POST Add Intention
    this.controller.api.POST('/api/intentions', 'addIntention');

    // GET List of My Intentions
    this.controller.api.GET('/api/my-intentions', 'getMyIntentions');

    // GET List of Joined Prayers
    this.controller.api.GET('/api/joined-prayers', 'joinedPrayers');

    // POST Join Prayer
    this.controller.api.POST('/api/join-prayer/:id', 'joinPrayer');
  }

  /**
   * Handle Captcha
   */
  handleCaptcha() {
    this.srv.get('/captcha', (req, res) => {
        const captcha = svgCaptcha.createMathExpr({
          noise: 2,
          mathMin: 0,
          mathMax: 20,
          mathOperator: '+'
        });
        req.session.captcha = parseInt(captcha.text);
        res.type('svg');
        res.header('Cache-Control', 'no-cache');
        res.status(200).send(captcha.data);
    });
  }

  /**
   * Handle Static Files
   */
  handleStaticFiles() {
    this.srv.use(express.static(path.resolve(__dirname, 'www')));
  }

  /**
   * Handle Other Cases
   */
  handleOtherCases() {
    this.srv.use(this.controller.api.handleOtherCases);
  }

}

// Export
module.exports = App;
