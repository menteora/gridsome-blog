<template>
  <div class="locale-changer">
    <div>
      <button v-for="entry in languages" :key="entry.title" @click="changeLocale(entry.language)">
        <ClientOnly>
          <country-flag :country="entry.flag" size="normal" />
        </ClientOnly>
        {{entry.title}}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "locale-changer",
  data() {
    return {
      languages: [
        { flag: "gb", language: "en" },
        { flag: "it", language: "it" }
      ]
    };
  },
  methods: {
    changeLocale(locale) {
      this.$root.$i18n.locale = locale;
      this.$router.push({ path: `/${locale}` })
    }
  }
};
</script>