<template>
  <div id="page-about" :aria-label="i18n('ABOUT_APP')">
    <article class="page-wrapper">
      <h2>O aplikacji</h2>

      <p class="align-center">
        <img
          src="~Img/logo-horizontal-purple.svg"
          alt="Poziome logo Omódlmy Net"
          style="width: 17rem"
        />
        <br />
        Wersja {{ env.version }}
      </p>

      <p class="align-justify">
        <i>Omódlmy Net</i> to aplikacja typu
        <a
          href="https://pl.wikipedia.org/wiki/Progressive_web_app"
          target="_blank"
          rel="noopener">PWA</a>,
        która umożliwa anonimowe dodanie i/lub pomodlenie się w czyjejś intencji.
      </p>
      <p class="align-justify">
        Skąd pomysł? Gdy w Duszpasterstwie Akademickim ktoś prosił o modlitwę,
        pisał o tym na grupie na FB, zgłaszał to do skrzynki intencji, wysyłał
        maila z prośbą. Ludzie bardzo często odpowiadali, pisząc
        komentarz/odpowiedź w postaci "+" - czyli jakby krzyżyka. Był to
        pierwszy znak, że można zrobić to lepiej. Co więcej, nie ma narzędzia
        stworzonego właśnie w celu dodania swojej prośby, tak aby ktoś mógł się
        w tej konkretnej intencji pomodlić - niekoniecznie znajomy, przecież w
        Kościele jako wspólnocie rzadko znamy osoby siedzące obok nas, a
        jednak... modlimy się wspólnie.
      </p>

      <h3>Co symbolizuje logo?</h3>
      <p class="align-justify">
        Internet często na ikonkach jest przedstawiany w postaci globu
        oplecionego siecią kabli. A omodlmy.net ma być projektem, przez który
        właśnie dzięki tej sieci kabli popłynie modlitwa. Od razu pomyślałem o
        różańcu. Zapragnąłem, żeby w centrum był krzyż - symbol Jezusa, Alfy i
        Omegi, początku i końca - i z tego krzyża wypływa sieć stworzona z
        różańca. Co więcej te punkty (tajemnice różańca) symbolizują też ludzi,
        którzy są w różnym miejscu na ziemi i mogą modlić się za osobę być może
        z całkowicie innego miejsca.
      </p>

      <h3>Media o projekcie</h3>
      <ul>
        <li>
          <a
            href="http://www.radiorodzina.pl/19129,dziswkosciele-o-aplikacji-omodlmynet-posuchaj/"
            target="_blank"
            rel="noopener">
            Radio Rodzina we Wrocławiu: #DZISWKOSCIELE o aplikacji omodlmy.net
          </a>
        </li>
        <li>
          <a
            href="https://wroclaw.gosc.pl/doc/4889788.Szturmujmy-niebo-przez-internet"
            target="_blank"
            rel="noopener">
            GOŚĆ.pl Wrocławski: Szturmujmy niebo przez internet
          </a>
        </li>
      </ul>

      <h2>Kontakt</h2>
      <p class="align-justify">
        Jeżeli chcesz napisać kilka słów, podzielić się pomysłem, zgłosić błąd,
        zaproponować poprawkę, czy może wyrazić opinię to zachęcam do kontaktu
        na maila
        <a :href="getEmail">kontakt@icxc.pl</a>.
      </p>

      <h2>Kod źródłowy i licencja</h2>
      <p class="align-center">
        <img
          src="~Img/AGPLv3_Logo.svg"
          alt="Logo licencji AGPLv3"
          style="width: 12rem"
        />
      </p>
      <p class="align-justify">
        Kod źródłowy jest dostępny na
        <a
          href="https://github.com/icxc-pl/omodlmy-net/"
          target="_blank"
          rel="noopener">repozytorium GitHub</a>.
      </p>
    </article>
  </div>
</template>

<script>
export default {
  name: "about",

  computed: {
    getEmail() {
      return (
        "mailto:kontakt@icxc.pl?subject=" +
        window.encodeURIComponent("Kontakt z aplikacji Omódlmy.net")
      );
    },
  },
};
</script>

<style lang="less" scoped>
#page-about {
  img {
    max-width: 80vh;
    height: auto;
  }
}
</style>
