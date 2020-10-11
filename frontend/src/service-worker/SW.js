import debug from './debug';

// eslint-disable-next-line no-undef
const CACHE_KEY = `omodlmy-net-v${__version}`;
const CACHE_PRELOAD = [
  'index.html', 'service-worker.js'
];

/**
 * Service Worker logic
 *
 * @type {Object}
 */
const SW = {

  /**
   * Open cache
   *
   * @type {Promise}
   */
  openCache: caches.open(CACHE_KEY),

  /**
   * Preload data
   * @returns {Promise}
   */
  async preloadData () {
    const cache = await this.openCache;
    debug('Cache preload');
    return cache.addAll(CACHE_PRELOAD);
  },

  /**
   * Flush old data
   * @returns {Promise}
   */
  async flushOldData () {
    const keys = await caches.keys();
    debug('Flush old data');

    const promises = [];
    for (let key of keys) {
      if(key !== CACHE_KEY) { // && cacheKey.startsWith(CACHE_PREFIX)) {
        debug(`Deleting ${key}`);
        promises.push(caches.delete(key));
      }
    }

    return Promise.all(promises);
  },

  /**
   * Get from cache response matching to request
   *
   * @param {Object} req Fetch request
   * @returns {Promise}
   */
  async getFromCache (req) {
    const cache = await this.openCache;
    debug(`Get from cache ${req.url}`);
    const res = await cache.match(req);
    if (res == null) {
      throw new Error(404);
    }
    return res;
  },

  /**
   * Put to cache response of request
   *
   * @param {Object} request Fetch request
   * @param {Object} [response] Fetch response
   * @returns {Promise}
   */
  async putToCache (req, res) {
    const cache = await this.openCache;

    if(res != null) {
      return cache.put(req, res);
    }

    try {
      res = await fetch(req);
      return cache.put(req, res);
    } catch (e) {
      debug('Fetch failed');
      console.warn(e);
    }
  },

  async fetch (req) {
    var res;
    try {
      res = await this.getFromCache(req);
      debug('Using cached data');
      return res;
    } catch (e) {
      debug('Fetching from network');
      res = await fetch(req);
      if (res.status === 404) {
        throw new Error(404);
      }
      await this.putToCache(req, res.clone());
      return res;
    }
  },

  /**
   * Handle install event
   *
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
   *
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
   *
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
