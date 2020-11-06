<template>
  <div id="page-how-to-pray" :aria-label="i18n('HOW_TO_PRAY')">
    <div class="page-wrapper">

      <template v-if="prayer">
        <a href="#" class="header-back text-header" @click.stop.prevent="back">
          <i class="icon-left-open"></i>
          <span>{{ prayer.title }}</span>
        </a>

        <article v-html="getPrayer"></article>
      </template>

      <template v-else>
        <h2>Jak się modlić?</h2>

        <h3>Chcę się pomodlić, ale nie wiem, czy muszę modlić się jakąś konkretną modlitwą?</h3>
        <p class="align-justify">
          Nie, wszystko zależy od Ciebie. Jeżeli masz czas i chcesz np. odmówić brewiarz - proszę bardzo.
          Jeżeli już i tak w wielu intencjach się modlisz, wystarczy jakaś naprawdę prosta modlitwa czy
          krótka, szczera prośba do Boga.
        </p>

        <h3>Chcę się za kogoś pomodlić - czy muszę zrobić coś szczególnego?</h3>
        <p class="align-justify">
          Pod każdą intencją jest pasek, który dzieli się na dwie części: po lewej stronie wyświetlona jest informacja, ile
          osób dołączyło do modlitwy w tej intencji, natomiast po prawej stronie znajduje się przycisk <b>Modlę się</b>.
          Kliknięcie w ten przycisk deklaruje chęć dołączenia do modlitwy w tej intencji.
          Nie musisz tego robić, ale zachęcam! To fajne uczucie wiedzieć, że ktoś się modli w mojej intencji.
          Dlatego odwagi! :)
        </p>

        <h3>A co jeżeli nie umiem się modlić? Dawno tego nie robiłem/am...</h3>
        <p class="align-justify">
          Myślę, że sam św. Paweł najlepiej odpowie na to pytanie:
        </p>

        <blockquote>
          Na szczęście podobnie także Duch przychodzi z pomocą naszej słabości. Gdy bowiem nie umiemy się modlić tak,
          jak trzeba, sam Duch przyczynia się za nami w błaganiach, których nie można wyrazić słowami. Ten zaś, który
          przenika serca, zna zamiar Ducha, [wie], że przyczynia się za świętymi zgodnie z wolą Bożą.
          <br>
          <i>Rz 8,26–27</i>
        </blockquote>

        <p class="align-justify">
          Jeśli nie masz pomysłu, w jaki sposób omodlić daną intencję, możesz skorzystać z poniższych propozycji.
          Pamiętaj jednak, że najważniejsze jest, by Twoja modlitwa płynęła z serca, możesz modlić się własnymi słowami,
          tak jak podpowiada Ci serce. 😊
        </p>

        <list :items="items" @click="openPrayer"></list>

        <p class="align-justify">
          Polecam też
          <a href="http://filokalia.pl/modlitwa-serca-cz-5-sam-duch-modli-sie-w-nas/" target="_blank" rel="noopener">
            artykuł z Filokalia o modlitwie serca
          </a>.<br>
        </p>
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
