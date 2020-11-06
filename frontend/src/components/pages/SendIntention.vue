<template>
  <div id="page-send-intention"
    :aria-label="i18n('SEND_INTENTION_FORM')">
    <form class="page-wrapper">

      <!-- Content -->
      <div class="form-row">
        <label for="form-intention-content">{{ i18n('INTENTION_CONTENT') }}</label>
        <textarea
          id="form-intention-content"
          :placeholder="i18n('INPUT_PLACEHOLDER_CONTENT', {
            min: verify.$rules.content.minLength,
            max: verify.$rules.content.maxLength
          })"
          aria-required="true"
          :aria-invalid="isContentInvalid"
          aria-errormessage="error-message-intention-content"
          v-model="content"></textarea>
        <p v-if="isContentInvalid"
          id="error-message-intention-content">
          <template v-if="verify.content.required">{{ i18n('RULE_REQUIRED') }}</template>
          <template v-else-if="verify.content.minLength">{{ i18n('RULE_MIN_LENGTH', verify.$rules.content.minLength) }}</template>
          <template v-else-if="verify.content.maxLength">{{ i18n('RULE_MAX_LENGTH', verify.$rules.content.maxLength) }}</template>
        </p>
      </div>

      <!-- Author -->
      <div class="form-row">
        <label for="form-intention-author">{{ i18n('INTENTION_AUTHOR') }}</label>
        <input
          id="form-intention-author"
          type="text"
          :placeholder="i18n('INPUT_PLACEHOLDER_AUTHOR')"
          :aria-invalid="isAuthorInvalid"
          v-model="author" />
      </div>

      <!-- Captcha -->
      <div class="form-row">
        <label for="form-intention-captcha">{{ i18n('CAPTCHA_TITLE') }}</label>
        <div class="captcha-test">
          <img :src="getCaptchaUrl"
              :alt="i18n('CAPTCHA_DESCRIPTION')"
              :title="i18n('CAPTCHA_TITLE')">
          <span>=</span>
          <input
            id="form-intention-captcha"
            type="number"
            :placeholder="i18n('INPUT_PLACEHOLDER_CAPTCHA')"
            aria-required="true"
            :aria-invalid="isCaptchaInvalid"
            v-model="captcha" />
        </div>
      </div>

      <!-- Submit button -->
      <div class="form-row" style="margin-top: 1.5rem;">
        <button type="submit"
                :class="['btn', { working }]"
                @submit.stop.prevent="submit"
                @click.stop.prevent="submit">
          <i class="icon-mail"
            role="img"
            :aria-label="i18n('ICON_LABEL_MAIL')"></i> {{ i18n('SEND') }}
        </button>
      </div>

    </form>
  </div>
</template>

<script>
  import VerifyMixin from 'Lib/mixins/Verify';
  import validator from 'Lib/validator';

  export default {
    name: 'send-intention',
    mixins: [VerifyMixin],

    created () {
      this.$verify({
        content: {
          required: true,
          minLength: validator.schema.intention.properties.content.minLength,
          maxLength: validator.schema.intention.properties.content.maxLength
        },
        author: {
          required: false
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
        captcha: '',
        captchaIdx: 0
      };
    },

    computed: {
      isContentInvalid () {
        return this.verify.content.$dirty && !this.verify.content.$valid;
      },

      isAuthorInvalid () {
        return this.verify.author.$dirty && !this.verify.author.$valid;
      },

      isCaptchaInvalid () {
        return this.verify.captcha.$dirty && !this.verify.captcha.$valid;
      },

      getContent () {
        return this.content.trim();
      },

      getAuthor () {
        let author = this.author;
        if (typeof author === 'string') {
          author = author.trim();
          if (author === '') {
            author = null;
          }
        } else {
          author = null;
        }
        return author;
      },

      getCaptcha () {
        return parseInt(this.captcha);
      },

      getCaptchaUrl () {
        return `${this.env.url}/captcha?${this.captchaIdx}`;
      }
    },

    methods: {

      _validate () {
        if (!this.validate()) {
          this.$tostini({
            message: this.i18n('ERROR_INVALID_FORM'),
            type: 'error'
          });
          return false;
        }

        validator.validateIntention({
          content: this.getContent,
          author: this.getAuthor,
          captcha: this.getCaptcha
        });
        if (validator.validateIntention.errors != null) {
          for (let err of validator.validateIntention.errors) {
            const property = err.dataPath.substr(1);
            this.verify[property].$valid = false;
            this.$tostini({
              message: this.i18n(`ERROR_INVALID_${err.keyword.toUpperCase()}_${property.toUpperCase()}`),
              type: 'error'
            });
          }
          return false;
        }

        return true;
      },

      /**
       * Submit
       */
      submit () {
        if (this.working) {
          return;
        }

        // Validate
        if (!this._validate()) {
          return;
        }

        // Send POST
        this.working = true;

        return this.apiClient.postIntention({
          content: this.getContent,
          author: this.getAuthor,
          captcha: this.getCaptcha
        }).then((res) => {
          this.$tostini({
            message: this.i18n('INTENTION_SENT'),
            type: 'success'
          });

          this.$router.push({
            name: 'list-intentions'
          });
        }).catch((err) => {
          const res = err.response;
          let message = null;
          switch (res.status) {
            case 400 :
              message = this.i18n('ERROR_CHECK_FORM');
              break;

            case 401 :
              if (res.data.message === 'ERROR_INVALID_CAPTCHA') {
                this.captchaIdx++;
              }

              message = this.i18n(res.data.message);
              break;

            case 429 :
              message = this.i18n(res.data.message, {
                x: new Date(res.data.createTime).toLocaleString()
              });
              break;

            default :
              message = this.i18n('ERROR_UNKNOWN');
              break;
          }

          this.$tostini({
            message,
            type: 'error'
          });
        }).finally(() => {
          this.working = false;
        });
      }

    }
  }
</script>

<style lang="less" scoped>
.captcha-test {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 44px;
  }

  span {
    width: 2em;
    text-align: left;
  }

  input {
    min-width: 0;
    max-width: calc(~'40rem - 132px - 2em');
  }
}
</style>
