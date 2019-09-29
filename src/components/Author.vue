<template>
  <div class="author">
    <g-image
      :alt="author.id"
      class="author__image"
      :src="author.image"
      width="180"
      height="180"
      blur="5"
    />

    <h1 class="author__site-title">{{ author.name }}</h1>

    <p class="author__intro">{{ author.intro }}</p>

    <p class="author__links">
      <a :href="author.github">GitHub</a>
    </p>
  </div>
</template>
<script>
export default {
  props: ["author"]
};
</script>

<style lang="scss">
.author {
  margin: 0 auto;
  max-width: 500px;
  text-align: center;
  padding: calc(var(--space) / 2) 0;

  &__image {
    border-radius: 100%;
    width: 90px;
    height: 90px;
    margin-bottom: 1em;
  }

  &__intro {
    opacity: 0.8;
  }

  &__site-title {
    font-size: 1.5em;
  }

  &__links {
    margin-top: -0.5em;
    a {
      margin: 0 0.5em;
    }
  }
}
</style>
