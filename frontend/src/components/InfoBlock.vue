<template>
  <div class="info-block">
    <i :class="['icon-' + icon]"></i>
    <h1>{{ i18n(title) }}</h1>
    <p>{{ i18n(info) }}</p>
  </div>
</template>

<script>
  export default {
    name: 'info-block',

    props: {
      icon: {
        type: String,
        default: 'attention'
      },

      title: {
        type: String,
        required: true
      },

      info: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="less">
  @import '~Stylesheets/colors';

  .info-block {
    text-align: center;

    i {
      color: @purple;
      display: inline-block;
      font-size: 4em;
    }

  }
</style>
