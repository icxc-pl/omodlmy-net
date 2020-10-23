<template>
  <div id="page-home"
    :aria-label="i18n('MAIN_SCREEN')">
    <div>

      <!-- Licznik intencji -->
      <h3 class="encourage encourage-numbers">
        {{ getNumbers }}
      </h3>

      <!-- Slogan -->
      <h4 class="encourage encourage-slogan">
        {{ i18n('SLOGAN') }}
      </h4>

      <!-- Dołączam! -->
      <router-link to="lista-intencji"
                   class="btn btn-round">
        <i class="icon-heart-cross" aria-hidden="true"></i>
        <span>{{ i18n('IAM_PRAYING') }}</span>
      </router-link>

      <!-- Nadaj intencję -->
      <router-link to="nadaj-intencje"
                   class="btn">
        <i class="icon-feather" aria-hidden="true"></i>
        <span>{{ i18n('SEND_INTENTION') }}</span>
      </router-link>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',

    data () {
      return {
        intentions: null,
        praying: null
      };
    },

    computed: {
      getNumbers() {
        if (this.intentions == null) {
          return '+';
        } else {
          return i18n('NUMBERS', {
            intentions: this.intentions,
            praying: this.praying
          });
        }
      }
    },

    created () {
      this.apiClient.getHomeStats().then((res) => {
        this.intentions = res.data.intentions;
        this.praying = res.data.praying;
      });
    }
  };
</script>

<style lang="less" scoped>

  #page-home {

    &::before {
      content: '';
      display: inline-block;
      width: 0;
      height: calc(100vh - 5rem);
      vertical-align: middle;
    }

    & > div {
      display: inline-block;
      width: 100%;
      vertical-align: middle;
    }

    .encourage {
      margin: 0 auto;

      &.encourage-slogan {
        position: relative;
        width: fit-content;

        &::after {
          display: block;
          content: '';
          width: 4.8em;
          height: 0.195em;
          background: transparent url('~Img/slogan-line.svg') 0 0 no-repeat;
          background-size: contain;
          position: absolute;
          bottom: -0.35em;
          right: calc(~'50% - 6em');
        }
      }
    }

    .btn {
      color: white;

      &.btn-round {
        height: 10rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
        font-weight: bold;
        font-size: 1.2rem;

        i[class^="icon"] {
          display: block;
          margin-top: 1.8rem;
          font-size: 5rem;

          &::before {
            width: 1.23em;
            margin: 0;
          }
        }
      }
    }

  }
</style>
