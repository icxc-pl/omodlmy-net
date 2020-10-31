import finka from '@bitbar/finka';

import Vue from 'vue';
import VueVerify from 'vue-verify';
import vTostini from 'v-tostini';

import App from './App';

import router from './router';

import apiClient from './lib/api-client';
import env from './lib/env';
import i18n from './lib/i18n';

finka();

// Config
Vue.config.productionTip = false;

apiClient.setupClient(env.url);

// Use
Vue.use(VueVerify);
Vue.use(vTostini);

// Mixins
Vue.mixin({
  data () {
    return {
      env,
      i18n,
      apiClient
    }
  },

  methods: {
    log (...args) {
      if (this.env.dev) {
        console.log.apply(console, args);
      }
    }
  }
});

// create Vue
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

if (!env.dev && typeof navigator.serviceWorker !== 'undefined') {
  navigator.serviceWorker.register('service-worker.js');
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.msg === 'RELOAD') {
      window.location.reload();
    }
  });
} else {
    // The current browser doesn't support service workers.
}
