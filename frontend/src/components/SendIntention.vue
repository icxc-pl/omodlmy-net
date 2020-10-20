<template>
  <div id="page-send-intention">
    <p>
      <textarea
        :placeholder="i18n('INPUT_PLACEHOLDER_CONTENT', {
          min: verify.$rules.content.minLength,
          max: verify.$rules.content.maxLength
        })"
        :class="{
          invalid: verify.content.$dirty && !verify.content.$valid }"
        v-model="content"></textarea>
      <span v-if="verify.content.$dirty && !verify.content.$valid" class="invalid">
        <span v-if="verify.content.required">{{ i18n('RULE_REQUIRED') }}</span>
        <span v-if="verify.content.minLength">{{ i18n('RULE_MIN_LENGTH', verify.$rules.content.minLength) }}</span>
        <span v-if="verify.content.maxLength">{{ i18n('RULE_MAX_LENGTH', verify.$rules.content.maxLength) }}</span>
      </span>
    </p>
    <p>
      <input type="text"
             :placeholder="i18n('INPUT_PLACEHOLDER_AUTHOR')"
             :class="{ invalid: verify.author.$dirty && !verify.author.$valid }"
             v-model="author" />
    </p>
    <p class="captcha-test">
      <img :src="getCaptchaUrl"
           :alt="i18n('CAPTCHA_TITLE')"
           :title="i18n('CAPTCHA_TITLE')">
      <span>=</span>
      <input type="number"
             :placeholder="i18n('INPUT_PLACEHOLDER_CAPTCHA')"
             :class="{ invalid: verify.captcha.$dirty && !verify.captcha.$valid }"
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
    max-width: calc(~'40rem - 132px - 2em');
  }
}
</style>
