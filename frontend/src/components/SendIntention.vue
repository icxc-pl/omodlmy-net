<template>
  <div id="page-send-intention">
    <p>
      <textarea :placeholder="i18n('INPUT_PLACEHOLDER_CONTENT')"
                :class="{ invalid: verify.content.$dirty && !verify.content.$valid }"
                v-model="content"></textarea>
      <span v-if="verify.content.$dirty && !verify.content.$valid" class="invalid">
        <span v-if="verify.content.required">{{ i18n('RULE_REQUIRED') }}</span>
        <span v-if="verify.content.minLength">{{ i18n('RULE_MIN_LENGTH', 7) }}</span>
        <span v-if="verify.content.maxLength">{{ i18n('RULE_MAX_LENGTH', 300) }}</span>
      </span>
    </p>
    <p>
      <input type="text"
             :placeholder="i18n('INPUT_PLACEHOLDER_AUTHOR')"
             v-model="author" />
    </p>
    <p class="captcha-test">
      <img :src="getCaptchaUrl"
           :alt="i18n('CAPTCHA_TITLE')"
           :title="i18n('CAPTCHA_TITLE')">
      <span>=</span>
      <input type="number"
             :placeholder="i18n('INPUT_PLACEHOLDER_CAPTCHA')"
             :class="{ invalid: verify.content.$dirty && !verify.content.$valid }"
             v-model="captcha" />
    </p>
    <p>
      <button type="button"
              :class="['btn', { working }]"
              @click="submit">
        <i class="icon-mail"></i> {{ i18n('SEND') }}
      </button>
    </p>
  </div>
</template>

<script>
  import VerifyMixin from 'Lib/mixins/Verify';

  export default {
    name: 'send-intention',
    mixins: [VerifyMixin],

    created () {
      this.$verify({
        content: {
          required: true,
          minLength: 7,
          maxLength: 300
        },
        captcha: {
          required: true
        }
      });
    },

    data () {
      return {
        working: false,
        error: null,
        content: '',
        author: '',
        captcha: ''
      };
    },

    computed: {
      getCaptchaUrl () {
        return `${this.env.url}/captcha?${Date.now()}`;
      }
    },

    methods: {

      /**
       * Submit
       */
      async submit () {
        if (this.working) {
          return;
        }

        // Validate
        if (!this.validate()) {
          this.$tostini({
            message: this.i18n('ERROR_INVALID_FORM'),
            type: 'error'
          });
          return;
        }

        // Send POST
        this.working = true;

        try {
          const res = await this.apiClient.postIntention({
            content: this.content,
            author: this.author,
            captcha: parseInt(this.captcha)
          });

          this.$tostini({
            message: this.i18n('INTENTION_SENT'),
            type: 'success'
          });

          this.$router.push({
            name: 'list-intentions'
          });

        } catch (err) {

          var errMsg = null;
          switch (err.status) {
            case 400 :
              errMsg = this.i18n('ERROR_CHECK_FORM');
              break;

            case 429 :
              errMsg = this.i18n(err.body.message, {
                x: new Date(err.body.createTime).toLocaleString()
              });
              break;

            default :
              errMsg = this.i18n('ERROR_UNKNOWN');
              break;
          }

          this.$tostini({
            message: errMsg,
            type: 'error'
          });
        }

        this.working = false;
      }

    }
  }
</script>

<style lang="less" scoped>
.captcha-test {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;

  img {
    height: 44px;
  }

  span {
    width: 2em;
    text-align: left;
  }

  input {
    margin: 0;
  }
}
</style>
