<template></template>

<script>
export default {
  metaInfo: {
    htmlAttrs: {
      lang: ""
    }
  },
  async mounted() {
    var browser_language = window.navigator.language.split("-")[0];
    var languages = ["it", "en"];
    var selected_language = languages.includes(browser_language)
      ? browser_language
      : "en";
    this.$router.push({ path: `/${selected_language}` });
  }
};
</script>
