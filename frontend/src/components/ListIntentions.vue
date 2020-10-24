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
      <section class="intentions">
        <intention v-for="item in items"
          :intention="item"
          :key="item._id"
          @joined-prayer="_whenJoinedPrayer($event, item)"></intention>
      </section>

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
      <mugen-scroll v-else
        :handler="fetchData"
        :should-handle="!loading"
        scroll-container="container"
        class="loading"></mugen-scroll>

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
        items: []
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
