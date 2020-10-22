<template>
  <div class="intention">
    <!-- Container -->
    <div class="intention-container">
      <div class="intention-content">{{ intention.content }}</div>
      <div class="intention-details-block">
        <div class="intention-author">{{ getAuthor }}</div>
        <div class="intention-date">{{ getDateTime }}</div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="intention-footer">
      <template v-if="intention.joined">
        <span>{{ i18n('PRAYING_JOINED', intention.praying - 1) }}</span>
      </template>
      <template v-else>
        <span>{{ i18n('PRAYING', intention.praying) }}</span>
        <span :class="['pray-button', { joining }]"
             @click="joinPrayer">
          {{ i18n('IAM_PRAYING') }} <i class="icon-heart-cross" aria-hidden="true"></i>
        </span>
      </template>
    </footer>

  </div>
</template>

<script>
  import { getTimeAgoText } from '../lib/utils';

  export default {
    name: 'intention',

    props: {
      intention: {
        required: true
      }
    },

    data () {
      return {
        joining: false
      };
    },

    computed: {

      /**
       * Get author
       * @returns {string}
       */
      getAuthor() {
        return this.intention.author || 'Anonim';
      },

      /**
       * Get author & date time string
       * @returns {string}
       */
      getDateTime() {
        return getTimeAgoText(this.intention.createTime);
      }

    },

    methods: {

      /**
       * Get date time string
       * @param ms {number} Milliseconds
       * @returns {string}
       */
      getDateTime (ms) {
        var x = new Date(ms);
        return i18n('DATETIME', {
          date: x.toLocaleDateString(),
          time: x.toLocaleTimeString().substr(0, 5)
        });
      },

      /**
       * Join prayer
       * @param intention
       */
      joinPrayer () {
        if (this.joining) {
          return;
        }

        this.joining = true;
        return this.apiClient.postJoinPrayer(this.intention._id).then((res) => {
          this.$emit('joined-prayer', res.data);
        }).catch((err) => {
          this.$tostini({
            message: this.apiClient.getXhrError(err),
            type: 'error'
          });
        }).finally(() => {
          this.joining = false;
        });
      }

    }
  }
</script>

<style lang="less">

</style>
