import debug from './debug';

// eslint-disable-next-line no-undef
const CACHE_KEY = `omodlmy-net-v${__version}`;
const CACHE_PRELOAD = [
  'index.html',
  'service-worker.js',
  'assets/fonts/Fontello.woff',
  'assets/fonts/Lato-Bold.woff',
  'assets/fonts/Lato-Bold.woff2',
  'assets/fonts/Lato-Light.woff',
  'assets/fonts/Lato-Light.woff2',
  'assets/fonts/Lato-Regular.woff',
  'assets/fonts/Lato-Regular.woff2',
  'assets/fonts/Nunito-Bold.woff',
  'assets/fonts/Nunito-Bold.woff2',
  'assets/fonts/Nunito-Light.woff',
  'assets/fonts/Nunito-Light.woff2',
  'assets/fonts/Nunito-Regular.woff',
  'assets/fonts/Nunito-Regular.woff2',
  'assets/images/main-menu-banner.jpg'
];

/**
 * Service Worker logic
 * @type {Object}
 */
const SW = {

  /**
   * Open cache
   * @type {Promise}
   */
  openCache: caches.open(CACHE_KEY),

  /**
   * Preload data
   * @returns {Promise}
   */
  preloadData () {
    return this.openCache.then((cache) => {
      debug('Cache preload');
      return cache.addAll(CACHE_PRELOAD);
    });
  },

  /**
   * Flush old data
   * @returns {Promise}
   */
  flushOldData () {
    return caches.keys().then((keys) => {
      debug('Flush old data');
      const promises = [];
      for (let key of keys) {
        if(key !== CACHE_KEY) { // && cacheKey.startsWith(CACHE_PREFIX)) {
          debug(`Deleting ${key}`);
          promises.push(caches.delete(key));
        }
      }
      return Promise.all(promises);
    });
  },

  /**
   * Get from cache response matching to request
   * @param {Object} req Fetch request
   * @returns {Promise}
   */
  getFromCache (req) {
    return this.openCache.then((cache) => {
      debug(`Get from cache ${req.url}`);
      return cache.match(req).then((res) => {
        if (res == null) {
          throw new Error(404);
        }
        return res;
      });
    });
  },

  /**
   * Put to cache response of request
   * @param {Object} req Fetch request
   * @param {Object} res Fetch response
   * @returns {Promise}
   */
  putToCache (req, res) {
    return this.openCache.then((cache) => {
      if (res != null) {
        return cache.put(req, res.clone()).then(() => res);
      }
      return fetch(req).then((_res) => {
        return cache.put(req, _res.clone()).then(() => _res);
      });
    });
  },

  /**
   * Fetch
   * @param {Object} req
   */
  fetch (req) {
    return this.getFromCache(req).then((res) => {
      debug('Using cached data');
      return res;
    }).catch(() => {
      debug('Fetching from network');
      return fetch(req).then((res) => {
        if (res.status === 404) {
          throw new Error(404);
        }
        return this.putToCache(req, res);
      });
    });
  },

  /**
   * Handle install event
   * @param {Object} event Event
   */
  handleInstall (event) {
    debug('Install');

    event.waitUntil(this.preloadData().then(() => {
      debug('Skip Waiting');
      return self.skipWaiting();
    }));
  },

  /**
   * Handle activate event
   * @param {Object} event Event
   */
  handleActivate (event) {
    debug('Activate');

    event.waitUntil(this.flushOldData().then(() => {
      debug('Claim');
      return self.clients.claim();
    }));
  },

  /**
   * Handle fetch event
   * @param {Object} event Event
   */
  handleFetch (event) {
    const req = event.request;

    if(req.mode === 'navigate') {
      debug('Fetch event cancelled - navigate');
      return;
    }

    if(/\/captcha|api|sockjs-node\//.test(req.url)) {
      debug('Fetch event cancelled - ignored url');
      return;
    }

    if(req.mode === 'same-origin' && req.url.indexOf(location.host) === -1) {
      debug('Fetch event cancelled - same origin');
      return;
    }

    debug('Fetch');
    event.respondWith(this.fetch(req));
  }
};

export default SW;
