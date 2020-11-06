<template>
  <div id="page-welcome"
    :aria-label="i18n('WELCOME_PAGE')">
    <form class="page-wrapper">

      <div class="align-center">
        <img
          src="~Img/logo-purple.svg"
          alt="Logo Omódlmy Net, przedstawiające różaniec oplatający glob, a pośrodku jest krzyż"
        />
      </div>

      <h1>Pokój i dobro!</h1>

      <p>
        Aplikacja <strong>Omódlmy Net</strong> to miejsce, w którym
        <strong>anonimowo</strong> możesz nadać swoją intencję i/lub wesprzeć
        innych modlitwą. Nie jest wymagana rejestracja, ale do poprawnego
        działania aplikacji używana jest pamięć Twojej przeglądarki (m.in. <strong>ciasteczka</strong>),
        tak więc korzystanie z niej oznacza zgodę na jej wykorzystywanie.
        <br />
        Równocześnie informujemy, że aplikacja w żaden sposób
        <strong>nie śledzi Ciebie</strong>
        - nie korzysta technologii wielkich korporacji czy tzw. trackerów.
        Aplikacja jest w 100% darmowa i bez reklam (co swoją drogą możesz
        sprawdzić w otwarym kodzie aplikacji!).
      </p>
      <p>Pamiętaj, że <strong>Twoja modlitwa się liczy!</strong></p>

      <button
        type="submit"
        class="btn"
        @submit.stop.prevent="submit"
        @click.stop.prevent="submit">
        Rozumiem i akceptuję
      </button>

      <p>
        P.S. Jeżli widzisz gdzieś błąd, to skorzystaj proszę z opcji
        <strong>Kontakt</strong> i zgłoś to. Mile widziane też wszelkie sugestie
        czy dobre słowo :)
      </p>

    </form>
  </div>
</template>

<script>
export default {
  name: "welcome",

  methods: {
    submit() {
      localStorage.setItem('cookies-accepted', 'true');
      this.$parent.cookies.accepted = true;
    },
  },
};
</script>

<style lang="less" scoped>
#page-welcome {
  img {
    width: 20vh;
    height: auto;
  }

  p {
    line-height: 1.5;
  }

  .btn {
    margin-top: 2rem;
    margin-bottom: 4rem;
  }
}
</style>
