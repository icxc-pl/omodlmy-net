<template>
  <article class="intention"
    :aria-label="i18n('INTENTION')">

    <!-- Content -->
    <p class="intention-content"
      :aria-label="i18n('INTENTION_CONTENT')">{{ intention.content }}</p>

    <!-- Details -->
    <div class="intention-details">
      <span class="intention-details-author"
        :aria-label="i18n('AUTHOR')">{{ getAuthor }}</span>
      <time class="intention-details-date"
        :aria-label="i18n('POST_DATE')"
        :datetime="getDateTime">{{ getDateTimeText }}</time>
    </div>

    <!-- Footer -->
    <div class="intention-footer" role="presentation">

      <!-- When user already joined -->
      <template v-if="intention.joined">
        <span :aria-label="i18n('WHO_JOINED')">{{ i18n('PRAYING_JOINED', intention.praying - 1) }}</span>
      </template>

      <!-- otherwise -->
      <template v-else>
        <span :aria-label="i18n('WHO_JOINED')">{{ i18n('PRAYING', intention.praying) }}</span>

        <!-- Join button -->
        <button :class="['pray-button', { joining }]"
            :aria-label="i18n('JOIN_PRAYER_BUTTON')"
            @click="joinPrayer">
          {{ i18n('IAM_PRAYING') }}
          <i class="icon-heart-cross"
              role="img"
              :aria-label="i18n('ICON_LABEL_HEART_CROSS')"></i>
        </button>
      </template>

    </div>

  </article>
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
        return new Date(this.intention.createTime).toLocaleString();
      },

      /**
       * Get author & date time text
       * @returns {string}
       */
      getDateTimeText() {
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
