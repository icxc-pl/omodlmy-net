<template>
  <div id="page-how-to-pray" :aria-label="i18n('HOW_TO_PRAY')">
    <div>

      <template v-if="prayer">
        <a href="#" class="header-back" @click.stop.prevent="back">
          <i class="icon-left-open"></i> {{ prayer.title }}
        </a>

        <article v-html="getPrayer"></article>
      </template>

      <template v-else>
        <p>
          Jeśli nie masz pomysłu, w jaki sposób omodlić daną intencję, możesz skorzystać z poniższych propozycji.
          Pamiętaj jednak, że najważniejsze jest, by Twoja modlitwa płynęła z serca, możesz modlić się własnymi słowami,
          tak jak podpowiada Ci serce. 😊
        </p>

        <list :items="items" @click="openPrayer"></list>
      </template>

    </div>
  </div>
</template>

<script>
import List from '../List';

const PRAYERS = {

  chwalaOjcu: {
    file: 'chwala-ojcu',
    title: 'Chwała Ojcu'
  },

  koronkaDoBozegoMilosierdzia: {
    file: 'koronka-do-bozego-milosierdzia',
    title: 'Koronka do Bożego Miłosierdzia'
  },

  litaniaDoNajswietszegoSercaPanaJezusa: {
    file: 'litania-do-najswietszego-serca-pana-jezusa',
    title: 'Litania do Najświętszego Serca Pana Jezusa'
  },

  litaniaDoNajswietszejMaryiPanny: {
    file: 'litania-do-najswietszej-maryi-panny',
    title: 'Litania do Najświętszej Maryi Panny (Loretańska)'
  },

  litaniaDoWszystkichSwietych: {
    file: 'litania-do-wszystkich-swietych',
    title: 'Litania do Wszystkich Świętych'
  },

  modlitwaSwFranciszka: {
    file: 'modlitwa-sw-franciszka',
    title: 'Modlitwa św. Franciszka'
  },

  ojczeNasz: {
    file: 'ojcze-nasz',
    title: 'Ojcze nasz (Modlitwa Pańska)'
  },

  podTwojaObrone: {
    file: 'pod-twoja-obrone',
    title: 'Pod Twoją obronę'
  },

  rozaniec: {
    file: 'rozaniec',
    title: 'Różaniec'
  },

  zdrowasMaryjo: {
    file: 'zdrowas-maryjo',
    title: 'Zdrowaś Maryjo (Pozdrowienie anielskie)'
  }

};

export default {
  name: "how-to-pray",

  components: {
    List
  },

  methods: {
    openPrayer (item) {
      this.prayer = item;
    },

    back (event) {
      this.prayer = null;
    }
  },

  computed: {
    getPrayer () {
      return require(`Docs/${this.prayer.file}.md`);
    }
  },

  data () {
    return {
      items: [
        {
          title: 'Gdy masz tylko chwilę',
          items: [
            PRAYERS.ojczeNasz,
            PRAYERS.zdrowasMaryjo,
            PRAYERS.podTwojaObrone,
            PRAYERS.chwalaOjcu,
            PRAYERS.modlitwaSwFranciszka
          ]
        },
        {
          title: 'Gdy chcesz poświęcić na modlitwę więcej czasu',
          items: [
            PRAYERS.rozaniec,
            PRAYERS.koronkaDoBozegoMilosierdzia
          ]
        },
        {
          title: 'Litanie',
          items: [
            PRAYERS.litaniaDoNajswietszejMaryiPanny,
            PRAYERS.litaniaDoNajswietszegoSercaPanaJezusa,
            PRAYERS.litaniaDoWszystkichSwietych
          ]
        },
        {
          title: 'Modlitwy Maryjne',
          items: [
            PRAYERS.zdrowasMaryjo,
            PRAYERS.podTwojaObrone,
            PRAYERS.litaniaDoNajswietszejMaryiPanny
          ]
        }
      ],

      prayer: null
    };
  }
};
</script>

<style lang="less" scoped>
@import "~Stylesheets/mixins/responsiveness";

#page-how-to-pray {
  & > div {
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;

    .rwd-max-for-s({
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    });
  }

}
</style>
