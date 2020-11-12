<template>
  <div id="app" role="presentation">

    <!-- no cookies info -->
    <info-block v-if="cookies.disabled"
      title="NO_COOKIES"
      info="NO_COOKIES_INFO"></info-block>

    <!-- welcome page -->
    <welcome v-else-if="!cookies.accepted"></welcome>

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
        :key="$route.path"
        @menu-title="menuTitle"
        class="view-container"
        ref="container"
        role="main" />

      <!-- toast notification container -->
      <tostini-plate />

    </template>

  </div>
</template>

<script>
  import MainMenu from 'Components/pages/MainMenu';
  import Welcome from 'Components/pages/Welcome';
  import InfoBlock from 'Components/InfoBlock';
  import 'Stylesheets/index.less';

  export default {
    name: 'app',

    components: {
      MainMenu,
      Welcome,
      InfoBlock
    },

    data () {
      return {
        checking: false,

        error: null,
        offline: false,

        cookies: {
          disabled: !navigator.cookieEnabled,
          accepted: localStorage.getItem('cookies-accepted') === 'true'
        }
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
      },

      menuTitle (title) {
        this.$refs.mainMenu.setTitle(title);
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
