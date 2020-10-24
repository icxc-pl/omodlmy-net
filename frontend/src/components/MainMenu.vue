<template>
    <nav :class="[ 'main-menu', { opened: isOpened } ]"
      :aria-label="i18n('MENU')">

      <button v-if="!isOpened"
           :class="['main-menu-trigger', { shadow: triggerShadow }]"
           :aria-label="i18n('MENU_OPEN')"
           aria-expanded="false"
           @click="open">
          <i class="icon-menu" aria-hidden="true"></i> {{ i18n('MENU') }}
      </button>

      <template v-else>

        <!-- main menu trigger -->
        <button v-if="isModeMobile"
            class="main-menu-trigger"
            :aria-label="i18n('MENU_CLOSE')"
            aria-expanded="true"
            @click="close">
            <i class="icon-cancel" aria-hidden="true"></i> {{ i18n('MENU_CLOSE') }}
        </button>

        <!-- main menu banner -->
        <div class="main-menu-banner"
          role="img"
          :aria-label="i18n('IMAGE_DESCRIPTION_PRAYING_WOMAN')"></div>

        <!-- main menu container -->
        <div class="main-menu-container">
          <ul role="menu" :aria-label="i18n('MENU_ELEMENTS')">
            <li v-for="item in items"
                role="menuitem"
                :key="item.title">
              <router-link
                :to="item.link"
                @keypress.native="close"
                @click.native="close">
                <i :class="[ 'icon-' + item.icon ]" aria-hidden="true"></i> {{ i18n(item.title) }}
              </router-link>
            </li>
          </ul>
        </div>

        <footer role="contentinfo" :aria-label="i18n('FOOTER')">
          <a href="https://github.com/icxc-pl/omodlmy-net/"
            :aria-label="i18n('LINK_TO_REPO')"
            target="_blank">Omódlmy Net v{{ env.version }}</a>
        </footer>

      </template>

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
      title: 'LIST_OF_INTENTIONS',
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

  nav.main-menu {
    background: white;
    height: 2.5rem;
    font-size: 1rem;
    line-height: 1;
    position: relative;
    z-index: 1;

    .main-menu-trigger {
      position: relative;
      z-index: 1;
      display: block;
      width: 100%;
      padding: 0.75rem;
      color: @purple;
      background-color: white;
      transition: color 0.25s,
        background-color 0.25s,
        box-shadow 0.25s,
        outline-color 0.25s;
      border: none;
      outline: 1px dotted transparent;
      cursor: pointer;
      text-align: left;

      &.shadow {
        box-shadow: 0 0 4px @shadow;
      }

      &:hover,
      &:focus {
        color: @purple-warm !important;
        background-color: rgba(255, 255, 255, 0.25) !important;
      }

      &:focus {
        outline-color: @purple-warm;
      }

      &:active {
        outline: none !important;
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

        a {
          color: white;
          text-decoration: none;
          display: block;
          padding: 1rem 0.5rem;
          user-select: none;
          background-color: transparent;
          outline: 1px solid transparent;
          transition: background-color 0.25s,
            outline-color 0.25s;

          &:hover,
          &:focus {
            background-color: rgba(255, 255, 255, 0.05);
          }

          &:focus {
            outline-color: @half-white;
          }

          &:active {
            outline: none !important;
          }
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
        background-color: transparent;

        &:focus {
          outline-color: white;
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
      color: @half-white;
      font-size: 0.8em;

      a {
        color: @half-white;
        text-decoration: none;

        &:hover,
        &:focus {
          color: white;
        }

        &:focus {
          outline: 1px dotted @half-white;
        }

        &:active {
          outline: none !important;
        }
      }
    }
  }
</style>
