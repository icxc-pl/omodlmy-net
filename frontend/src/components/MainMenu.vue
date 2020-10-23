<template>
    <nav :class="[ 'main-menu', { opened: isOpened } ]"
      :aria-label="i18n('MENU')">

      <div v-if="!isOpened"
           :class="['main-menu-trigger', { shadow: triggerShadow }]"
           tabindex="0"
           role="button"
           :aria-label="i18n('MENU_OPEN')"
           aria-expanded="false"
           @keypress="open"
           @click="open">
          <i class="icon-menu" aria-hidden="true"></i> {{ i18n('MENU') }}
      </div>

      <template v-else>

        <!-- main menu trigger -->
        <div v-if="isModeMobile"
            class="main-menu-trigger"
            tabindex="0"
            role="button"
            :aria-label="i18n('MENU_CLOSE')"
            aria-expanded="true"
            @keypress="close"
            @click="close">
            <i class="icon-cancel" aria-hidden="true"></i> {{ i18n('MENU_CLOSE') }}
        </div>

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
      user-select: none;

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
          user-select: none;
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
