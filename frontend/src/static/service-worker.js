/**
 * Service Worker file
 */

var CACHE_PREFIX = 'PACKAGE_NAME';
var CACHE_KEY = CACHE_PREFIX + '-vPACKAGE_VERSION';
var CACHE_PRELOAD = [
  'index.html', 'service-worker.js'
];
var DEVEL = self.location.hostname === 'localhost';


/**
 * Debug
 *
 * @param {string} msg Message
 */
function debug(msg) {
  if(DEVEL) {
    console.log(msg);
  }
}


/**
 * Service Worker logic
 *
 * @type {Object}
 */
var SW = {

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
  preloadData: function() {
    return this.openCache.then(function(cache) {
      debug('Cache preload');
      return cache.addAll(CACHE_PRELOAD);
    });
  },

  /**
   * Flush old data
   * @returns {Promise}
   */
  flushOldData: function() {
    return caches.keys().then(function(cacheKeys) {
      debug('Flush old data');
      return Promise.all(
        cacheKeys.map(function(cacheKey) {
          if(cacheKey !== CACHE_KEY) { // && cacheKey.startsWith(CACHE_PREFIX)) {
            debug('Deleted ' + cacheKey);
            return caches.delete(cacheKey);
          }
        })
      );
    });
  },

  /**
   * Get from cache response matching to request
   *
   * @param {Object} request Fetch request
   * @returns {Promise}
   */
  getFromCache: function(request) {
    return this.openCache.then(function(cache) {
      debug('Get from cache ' + request.url);
      return new Promise(function(resolve, reject) {
        cache.match(request).then(function (response) {
          if(typeof response === 'undefined') {
            reject();
          } else {
            resolve(response);
          }
        });
      });
    });
  },

  /**
   * Put to cache response of request
   *
   * @param {Object} request Fetch request
   * @param {Object} [response] Fetch response
   * @returns {Promise}
   */
  putToCache: function(request, response) {
    return this.openCache.then(function(cache) {
      if(response != null) {
        return cache.put(request, response);
      } else {
        return fetch(request).then(function (response) {
          return cache.put(request, response);
        }, function () {
          debug('Fetch failed');
        });
      }
    });
  },

  /**
   * Handle install event
   *
   * @param {Object} event Event
   */
  handleInstall: function(event) {
    debug('Install');

    event.waitUntil(this.preloadData().then(function() {
      return self.skipWaiting();
    }));
  },

  /**
   * Handle activate event
   *
   * @param {Object} event Event
   */
  handleActivate: function(event) {
    debug('Activate');

    event.waitUntil(this.flushOldData().then(function() {
      debug('Claim');
      return self.clients.claim();
    }));
  },

  /**
   * Handle fetch event
   *
   * @param {Object} event Event
   */
  handleFetch: function(event) {
    var request = event.request;

    if(request.mode === 'navigate') {
      debug('Fetch event cancelled - navigate');
      //return;
    }

    if(/\/api\//.test(request.url)) {
      debug('Fetch event cancelled - API call');
      return;
    }

    if(request.mode === 'same-origin' && request.url.indexOf(location.host) === -1) {
      debug('Fetch event cancelled - same origin');
      return;
    }

    debug('Fetch');

    var $this = this;
    var $fetch = new Promise(function(resolve, reject) {
      $this.getFromCache(request).then(function(response) {
        debug('Using cached data');
        resolve(response);
      }).catch(function() {
        debug('Fetching from network');
        fetch(request).then(function(response) {
          if(response.status === 404) {
            reject();
          } else {
            event.waitUntil($this.putToCache(request, response.clone()));
            resolve(response);
          }
        }, reject);
      });
    });

    event.respondWith($fetch);
  }
};

// Add install listener
self.addEventListener('install', SW.handleInstall.bind(SW));

// Add activate listener
self.addEventListener('activate', SW.handleActivate.bind(SW));

// Add fetch listener
self.addEventListener('fetch', SW.handleFetch.bind(SW));
