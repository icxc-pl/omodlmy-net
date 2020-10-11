<template>
    <nav :class="[ 'main-menu', { opened: isOpened } ]">

      <template v-if="isOpened">

        <!-- main menu trigger -->
        <div v-if="isModeMobile"
            class="main-menu-trigger"
            @click="close">
            <i class="icon-cancel"></i> {{ i18n('MENU_CLOSE') }}
        </div>

        <!-- main menu banner -->
        <div class="main-menu-banner"></div>

        <!-- main menu container -->
        <div class="main-menu-container">
          <ul>
            <li v-for="item in items"
                :key="item.title">
              <router-link :to="item.link"
                          @click.native="close">
                <i :class="[ 'icon-' + item.icon ]"></i> {{ i18n(item.title) }}
              </router-link>
            </li>
          </ul>
        </div>

        <footer>
          <a href="https://github.com/icxc-pl/omodlmy-net/" target="_blank">Omódlmy Net v{{ env.version }}</a>
        </footer>

      </template>

      <div v-else
           :class="['main-menu-trigger', { shadow: triggerShadow }]"
           @click="open">
          <i class="icon-menu"></i> {{ i18n('MENU') }}
      </div>

    </nav>
</template>

<script>
  /**
   * @typedef {Object} MenuItem
   * @property {string} title
   * @property {string} link
   * @property {string} icon
   */

  /**
   * Items
   * @type {MenuItem[]}
   */
  const ITEMS = [
    {
      title: 'HOME_SCREEN',
      link: '/',
      icon: 'home'
    },
    {
      title: 'LIST_INTENTIONS',
      link: 'lista-intencji',
      icon: 'list'
    },
    {
      title: 'SEND_INTENTION',
      link: 'nadaj-intencje',
      icon: 'feather'
    }
    // {
    //   title: 'INFORMATION',
    //   link: 'informacje',
    //   icon: 'help-circled'
    // }
  ];

  export default {
    name: 'main-menu',

    data () {
      return {
        mode: undefined,
        opened: false,
        triggerShadow: false,
        items: ITEMS
      };
    },

    computed: {
      isModeMobile () {
        return this.mode === 'mobile';
      },

      isModeDesktop () {
        return this.mode === 'desktop';
      },

      isOpened () {
        return this.isModeDesktop || this.opened;
      }
    },

    methods: {

      checkWindowSize () {
        this.mode = window.innerWidth < 1200 ? 'mobile' : 'desktop';
      },

      toggleOpen () {
        if (this.opened) {
          this.close();
        } else {
          this.open();
        }
      },

      open () {
        this.opened = true;
      },

      close () {
        this.opened = false;
      },

      disableShadow () {
        this.triggerShadow = false;
      },

      enableShadow () {
        this.triggerShadow = true;
      }
    },

    mounted () {
      this.checkWindowSize();
      window.addEventListener('resize', this.checkWindowSize.bind(this));
    }
  };
</script>

<style lang="less" scoped>
  @import '~Stylesheets/colors';
  @import '~Stylesheets/mixins/background';
  @import '~Stylesheets/mixins/responsiveness';
  @import '~Stylesheets/mixins/transition';

  nav.main-menu {
    background: white;
    height: 2.5rem;
    font-size: 1rem;
    line-height: 1;
    position: relative;
    z-index: 1;

    .main-menu-trigger {
      padding: 0.75rem;
      color: @purple;
      cursor: pointer;
      background: white;
      .transition(box-shadow);

      &.shadow {
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.125);
      }
    }

    .main-menu-banner {
      background: white url('~Img/main-menu-banner.jpg') center center no-repeat;
      background-size: cover;
      text-align: center;
      height: 10rem;
      border-bottom: 0.5rem solid white;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        margin: 0;
        padding: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        a {
          color: white;
          text-decoration: none;
          display: block;
          padding: 1rem 0.5rem;
        }
      }
    }

    &.opened {
      .background-gradient;
      height: 100vh;
      width: 100vw;
      z-index: 9999;
      position: absolute;
      color: white;

      .rwd-min-for-s({
        width: 20rem;
      });

      .main-menu-trigger {
        margin-bottom: -2.5rem;
        color: @purple;
        background: transparent;

        &:hover {
          color: @purple-warm;
        }
      }
    }

    footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: calc(~'100% - 2rem');
      text-align: center;
      padding: 1rem;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.8em;

      a {
        color: rgba(255, 255, 255, 0.5);
        text-decoration: none;
      }
    }
  }
</style>
