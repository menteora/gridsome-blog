<template>
  <Layout>
    <h1 class="tag-title text-center space-bottom"># {{ $page.tag.title }}</h1>

    <div class="posts">
      <PostCard v-for="post in $page.tag.posts" :key="post.id" :post="post" />
    </div>
  </Layout>
</template>

<page-query>
query Tag ($path: String!) {
  tag(path: $path) {
    title
    posts {
          id
          title
          path
          description
          lang
          }
        }
      }
</page-query>

<script>
import Author from "~/components/Author.vue";
import PostCard from "~/components/PostCard.vue";

export default {
  components: {
    Author,
    PostCard
  },
  metaInfo() {
    return {
      htmlAttrs: {
        lang: this.$page.tag.posts[0].lang
      }
    };
  }
};
</script>

<style lang="scss">
</style>

