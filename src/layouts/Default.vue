<template>
  <div id="app">
    <v-app>
      <header class="header">
        <div class="header__left">
          <Logo v-if="!isHome" />
        </div>

        <div class="header__right">
          <LocaleChanger v-if="showLanguage" />
        </div>
      </header>

      <main class="main">
        <slot />
      </main>

      <footer class="footer">
        <span class="footer__copyright">Copyright © {{ new Date().getFullYear() }}.</span>
        <span class="footer__links">
          Powered by
          <a href="//gridsome.org">Gridsome</a>
        </span>
        <CookieLaw />
      </footer>
    </v-app>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import ToggleTheme from "~/components/ToggleTheme.vue";
import LocaleChanger from "~/components/LocaleChanger.vue";
import CookieLaw from "~/components/CookieLaw.vue";

export default {
  props: {
    isHome: { default: false },
    showLanguage: { default: false }
  },
  components: {
    Logo,
    ToggleTheme,
    LocaleChanger,
    CookieLaw
  },
  mounted: function() {},
};
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--header-height);
  padding: 0 calc(var(--space) / 2);
  top: 0;
  z-index: 10;

  &__left,
  &__right {
    display: flex;
    align-items: center;
  }

  @media screen and (min-width: 1300px) {
    //Make header sticky for large screens
    position: sticky;
    width: 100%;
  }
}

.main {
  margin: 0 auto;
  padding: 1.5vw 15px 0;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--space) / 2);
  text-align: center;
  font-size: 0.8em;

  > span {
    margin: 0 0.35em;
  }

  a {
    color: currentColor;
  }
}
</style>
