<template>
  <div id="app" role="presentation">

    <!-- no cookies info -->
    <info-block v-if="noCookies"
      title="NO_COOKIES"
      info="NO_COOKIES_INFO"></info-block>

    <!-- checking screen -->
    <div v-else-if="checking"
      class="checking"></div>

    <!-- offline info -->
    <info-block v-else-if="offline"
      title="OFFLINE"
      info="OFFLINE_INFO"></info-block>

    <!-- show app -->
    <template v-else>

      <!-- menu -->
      <main-menu
        ref="mainMenu"
        role="navigation" />

      <!-- content slot -->
      <router-view
        class="view-container"
        ref="container"
        role="main" />

      <!-- toast notification container -->
      <tostini-plate />

    </template>

  </div>
</template>

<script>
  import MainMenu from 'Components/MainMenu';
  import InfoBlock from 'Components/InfoBlock';
  import 'Stylesheets/index.less';

  export default {
    name: 'app',

    components: {
      MainMenu,
      InfoBlock
    },

    data () {
      return {
        checking: false,

        error: null,
        offline: false,
        noCookies: !navigator.cookieEnabled
      }
    },

    methods: {
      _reenablePositionCheck () {
        if (!this.$refs.container) {
          return;
        }

        this.$refs.container.$el.removeEventListener('scroll', this._boundCheckPosition);
        this.$refs.container.$el.addEventListener('scroll', this._boundCheckPosition);
      },

      checkPosition () {
        if (!this.$refs.container) {
          return;
        }

        const posY = this.$refs.container.$el.scrollTop;
        if (posY === 0) {
          this.$refs.mainMenu.disableShadow();
        } else {
          this.$refs.mainMenu.enableShadow();
        }
      }
    },

     created () {
      this.checking = true;
      this.apiClient.setupSecurity().then(() => {
        this._boundCheckPosition = this.checkPosition.bind(this);
      }).catch((err) => {
        this.offline = true;
        if (err.message !== 'Network Error') {
          this.error = i18n('UNKNOWN_ERROR_REFRESH');
        }
      }).finally(() => {
        this.checking = false;
      })
    },

    mounted () {
      this.checkPosition();
      this._reenablePositionCheck();
    },

    updated () {
      this.checkPosition();
      this._reenablePositionCheck();
    }
  }
</script>

<style lang="less">
  @import '~Stylesheets/colors';
  @import '~Stylesheets/mixins/responsiveness';

  html {
    height: 100vh;
    font-family: 'Lato', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    margin: 0;
    width: 100vw;
  }

  body {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Nunito', sans-serif;
    font-weight: 300;
    text-align: center;
    color: @purple;
  }

  #app > .info-block > i {
    margin-top: 22vh;
  }

  .checking {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white url('~Img/loader-purple.svg') center center no-repeat;
    background-size: 15%;
  }

  .view-container {
    height: calc(100vh - 2.5rem);
    overflow: auto;
    padding-top: 2.5rem;
    margin-top: -2.5rem;
  }

  .main-menu.opened + .view-container {
    margin-top: 0;

    .rwd-min-for-s({
      padding-left: 20rem;
    });

    .rwd-max-for-s({
      overflow: hidden;
    });
  }
</style>
