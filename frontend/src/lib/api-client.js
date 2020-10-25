import Axios from 'axios';
import i18n from './i18n';

var client;

/**
 * Setup client
 * @param {String} url
 */
function setupClient (url) {
  client = Axios.create({
    baseURL: `${url}/api/`,

    withCredentials: true,

    xsrfCookieName: false,
    xsrfHeaderName: false
  });
}

/**
 * GET Meta
 * @param params {Object}
 * @returns {Object[]}
 */
function setupSecurity () {
  return client.get('/meta').then((res) => {
    // https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
    const token = res.headers['x-csrf-token'];
    client.defaults.headers.get['CSRF-Token'] = token;
    client.defaults.headers.post['CSRF-Token'] = token;
  });
}

/**
 * GET Home Stats
 * @param params {Object}
 * @returns {Object[]}
 */
function getHomeStats () {
  return client.get('/home-stats');
}

/**
 * GET Intentions
 * @param params {Object}
 * @returns {Object[]}
 */
function getIntentions (params) {
  return client.get('/intentions', {
    params
  });
}

/**
 * GET My Intentions
 * @param params {Object}
 * @returns {Object[]}
 */
function getMyIntentions (params) {
  return client.get('/my-intentions', {
    params
  });
}

/**
 * POST Intention
 * @param data {(Object|null)}
 * @param params {Object}
 * @returns {*}
 */
function postIntention (data, params) {
  if (data == null) {
    data = {}
  }

  return client.post('/intentions', {
    data,
    params,
  });
}

/**
 * POST Join Prayer
 * @param id {id} ID of intention to join
 * @returns {*}
 */
function postJoinPrayer (id) {
  return client.post(`/join-prayer/${id}`);
}

/**
 * Get XHR Error Message
 * @param err {Error}
 * @returns {*}
 */
function getXhrError(err) {
  var defaultError = i18n('ERROR_NETWORK_UNKNOWN');
  var _err = null;

  if(err == null || err.status === 0 || err.statusText == null || err.statusText.length === 0) {
    _err = defaultError;
  } else {
    _err = err.statusText;
  }

  return _err;
}

// Export
export default {
  setupClient,
  setupSecurity,

  getHomeStats,
  getIntentions,
  getMyIntentions,
  postIntention,
  postJoinPrayer,
  getXhrError
};
