<template>
    <nav :class="[ 'main-menu', { opened: isOpened } ]"
      :aria-label="i18n('MENU')">

      <button v-if="!isOpened"
           :class="['main-menu-trigger', { shadow: triggerShadow }]"
           :aria-label="i18n('MENU_OPEN')"
           aria-expanded="false"
           @click="open">
          <i class="icon-menu"
            role="img"
            :aria-label="i18n('ICON_LABEL_MENU')"></i>
          {{ i18n('MENU') }}
      </button>

      <template v-else>

        <!-- main menu trigger -->
        <button v-if="isModeMobile"
            class="main-menu-trigger"
            :aria-label="i18n('MENU_CLOSE')"
            aria-expanded="true"
            @click="close">
            <i class="icon-cancel"
              role="img"
              :aria-label="i18n('ICON_LABEL_CANCEL')"></i>
            {{ i18n('MENU_CLOSE') }}
        </button>

        <!-- main menu banner -->
        <div class="main-menu-banner"
          role="img"
          :aria-label="i18n('IMAGE_DESCRIPTION_PRAYING_WOMAN')"></div>

        <!-- main menu container -->
        <div class="main-menu-container">
          <ul role="menu" :aria-label="i18n('MENU_ELEMENTS')">
            <li v-for="item in mainItems"
                role="menuitem"
                :key="item.title">

              <!-- normal link -->
              <router-link v-if="item.link"
                :to="item.link"
                :title="i18n(item.title)"
                @keypress.native="close"
                @click.native="close">
                <i :class="[ 'icon-' + item.icon ]"
                  role="img"
                  :aria-label="getLabel(item)"></i>
                {{ i18n(item.title) }}
              </router-link>

              <!-- href link -->
              <a v-else-if="item.href"
                :href="item.href"
                :title="i18n(item.title)"
                rel="nooopener"
                target="_blank">
                <i :class="[ 'icon-' + item.icon ]"
                  role="img"
                  :aria-label="getLabel(item)"></i>
                {{ i18n(item.title) }}
              </a>

              <!-- method link -->
              <a v-else-if="item.method"
                href="#"
                :title="i18n(item.title)"
                @keypress.stop.prevent="callMethod(item.method)"
                @click.stop.prevent="callMethod(item.method)">
                <i :class="[ 'icon-' + item.icon ]"
                  role="img"
                  :aria-label="getLabel(item)"></i>
                {{ i18n(item.title) }}
              </a>

            </li>
          </ul>
        </div>

        <footer role="contentinfo" :aria-label="i18n('FOOTER')">
          <a v-for="item in footerItems"
            :key="item.title"
            :href="item.href"
            :title="i18n(item.title)"
            :aria-label="getLinkToLabel(item)"
            rel="nooopener"
            target="_blank">
            <i :class="[ 'icon-' + item.icon ]"
              role="img"
              :aria-label="getLabel(item)"></i>
          </a>

          <!-- space -->
          <div></div>

          <!-- wersja -->
          <span :title="i18n('VERSION_X', { x: env.version })"
            :aria-label="i18n('VERSION_X', { x: env.version })">v{{ env.version }}</span>
        </footer>

      </template>

    </nav>
</template>

<script>
  import { getTutorial } from 'Lib/platforms';

  /**
   * @typedef {Object} MenuItem
   * @property {string} title
   * @property {string} link
   * @property {string} icon
   */

  const ITEM = {
    home: {
      title: 'HOME_SCREEN',
      icon: 'home',
      link: '/'
    },
    listOfIntentions: {
      title: 'LIST_OF_INTENTIONS',
      icon: 'list',
      link: 'lista-intencji'
    },
    sendIntention: {
      title: 'SEND_INTENTION',
      icon: 'feather',
      link: 'nadaj-intencje'
    },
    listOfMyIntentions: {
      title: 'LIST_OF_MY_INTENTIONS',
      icon: 'folder',
      link: 'moje-intencje'
    },
    howToPray: {
      title: 'HOW_TO_PRAY',
      icon: 'book',
      link: 'jak-sie-modlic'
    },
    about: {
      title: 'ABOUT_APP',
      icon: 'info',
      link: 'o-aplikacji'
    },

    share: {
      title: 'SHARE',
      icon: 'share',
      method: 'share'
    },
    install: {
      title: 'INSTALL',
      icon: 'install',
      method: 'install'
    },

    contact: {
      title: 'CONTACT',
      icon: 'mail',
      href: 'mailto:kontakt@icxc.pl?subject=' + window.encodeURIComponent('Kontakt z aplikacji Omódlmy.net')
    },
    facebook: {
      title: 'FACEBOOK_PAGE',
      icon: 'facebook',
      href: 'https://www.facebook.com/omodlmy.net/'
    },
    youtube: {
      title: 'YOUTUBE_CHANNEL',
      icon: 'youtube',
      href: 'https://www.youtube.com/channel/UClNUVDh4x_SrUGPrpSGKrpw'
    },
    github: {
      title: 'GITHUB_REPO',
      icon: 'github',
      href: 'https://github.com/icxc-pl/omodlmy-net/'
    }
  };


  export default {
    name: 'main-menu',

    data () {
      return {
        mode: undefined,
        opened: false,
        triggerShadow: false,

        footerItems: [
          ITEM.contact,
          ITEM.facebook,
          ITEM.youtube,
          ITEM.github
        ]
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
      },

      mainItems () {
        /**
         * Items
         * @type {MenuItem[]}
         */
        const items = [
          ITEM.home,
          ITEM.listOfIntentions,
          ITEM.sendIntention,
          ITEM.listOfMyIntentions,
          ITEM.howToPray,
          ITEM.about
        ];

        if (this.env.isPlatformSupported && !this.env.isAppInstalled) {
          items.push(ITEM.install);
        }

        if (this.env.isShareSupported) {
          items.push(ITEM.share);
        }

        return items;
      }
    },

    methods: {

      callMethod (method) {
        if (typeof this[method] === 'function') {
          this[method]();
        } else {
          this.log(`Method ${method} does not exist`);
        }
      },

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
      },

      getLabel (item) {
        return i18n('ICON_LABEL_' + item.icon.toUpperCase().replace('-', '_'));
      },

      getLinkToLabel (item) {
        return i18n('LINK_TO') + ' ' + i18n(item.title);
      },

      share () {
        navigator.share({
          title: document.title,
          text: document.head.querySelector('meta[name="Description"]').getAttribute('content'),
          url: location.origin
        }).then(() => {
          this.$tostini({
            message: this.i18n('SHARE_THANK_YOU'),
            type: 'success'
          });
        }).catch(() => {
          this.log('Something went wrong with sharing');
        });
      },

      install () {
        const tutorialId = getTutorial();
        window.open(`https://www.youtube.com/watch?v=${tutorialId}`, '_blank');
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

  .main-menu {
    background: white;
    height: 2.5rem;
    font-size: 0.9rem;
    line-height: 1;
    position: relative;
    z-index: 1;

    &-trigger {
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

    &-banner {
      background: white url('~Img/main-menu-banner.jpg') center center no-repeat;
      background-size: cover;
      text-align: center;
      height: 25vh;
      border-bottom: 0.5rem solid white;
    }

    &-container {
      height: calc(~'75vh - 0.5rem - 42px');
      overflow: auto;
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
          padding: 0.9rem 0.5rem;
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
      width: 100%;
      height: 40px;
      display: flex;
      text-align: center;
      color: @half-white;
      line-height: 40px;
      background: @shadow;
      box-shadow: 0 3px 6px @shadow inset;

      a {
        color: @half-white;
        text-decoration: none;
        flex: 0 0 40px;
        height: 40px;

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

      span {
        font-size: 0.8em;
        padding: 0 0.9rem;
      }

      div {
        flex: 1;
      }
    }
  }
</style>
