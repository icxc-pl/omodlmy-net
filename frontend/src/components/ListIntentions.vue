<template>
  <div id="page-send-intention"
    ref="container"
    :aria-label="i18n('LIST_OF_INTENTIONS')">

    <!-- Error -->
    <p v-if="error">
      {{ error }}
    </p>

    <template v-else>

      <!-- Intentions -->
      <div class="intentions">
        <intention v-for="item in items"
          :intention="item"
          :key="item._id"
          @joined-prayer="_whenJoinedPrayer($event, item)"></intention>
      </div>

      <!-- Info that everything loaded -->
      <p v-if="allLoaded">
        <span v-if="items.length > 0">{{ i18n('NO_MORE_INTENTIONS') }}</span>
        <span v-else>{{ i18n('NO_INTENTIONS') }}</span>
        <br>
        <span>
          <router-link to="nadaj-intencje">{{ i18n('SEND_INTENTION') }}</router-link>
          - {{ i18n('SLOGAN').toLowerCase() }}
        </span>
      </p>

      <!-- Infinity loading -->
      <div v-else
        :tabindex="0"
        :aria-label="i18n('LOADING_CONTENT')"
        @focus="loadingFocus">
        <mugen-scroll
          :handler="fetchData"
          :should-handle="!loading"
          scroll-container="container"
          class="loading"></mugen-scroll>
      </div>

    </template>

  </div>
</template>

<script>
  import Intention from './Intention';
  import MugenScroll from 'vue-mugen-scroll';

  const FETCH_LIMIT = 25;

  export default {
    name: 'list-intentions',

    components: {
      Intention,
      MugenScroll
    },

    data () {
      return {
        error: null,
        loading: false,
        allLoaded: false,
        items: [],
        focusOn: null
      };
    },

    methods: {

      /**
       * Fetch data
       */
      fetchData () {
        if (this.allLoaded) {
          return;
        }

        this.loading = true;
        var offset = this.items.length;

        this.apiClient.getIntentions({
          offset: offset,
          limit: FETCH_LIMIT
        }).then(this._whenFetchDataSuccess).catch(this._whenFetchDataFails);
      },

      /**
       * When fetch data success
       * @param res
       * @private
       */
      _whenFetchDataSuccess (res) {
        var items = res.data;

        if (items.length > 0) {
          this.items.absorb(items);
        }

        if (items.length !== FETCH_LIMIT) {
          this.allLoaded = true;
        }

        this.loading = false;

        // Mechanism to move back user's focus cursor in case one is using only keyboard
        if (this.focusOn !== null) {
          this.$nextTick(() => {
            const el = document.querySelector(`article.intention:nth-of-type(${this.focusOn}) button`);
            if (el) {
              el.focus();
            }
            this.focusOn = null;
          });
        }
      },

      /**
       * When fetch data fails
       * @param err
       * @private
       */
      _whenFetchDataFails (err) {
        this.error = this.apiClient.getXhrError(err)
        this.loading = false;
        this.allLoaded = true;
      },

      /**
       * When joined prayer
       * @param item
       * @param res
       * @private
       */
      _whenJoinedPrayer (res, item) {
        if (res) {
          item.praying = res.praying;
          item.joined = true;
        } else {
          location.reload(true);
        }
      },

      loadingFocus () {
        this.focusOn = this.items.length;
      }

    }
  }
</script>

<style lang="less" scoped>
  p {
    margin: 1rem;
    text-align: center;
  }
</style>
