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
  metaInfo: {
    title: "Hello, world!"
  },
  data() {
    return {
      selected_language: "all"
    };
  },
  async mounted() {
    this.selected_language = this.$root.$i18n.locale;
  },
  computed: {
    filteredPosts() {
      var posts;
      switch (this.selected_language) {
        case "all":
          posts = this.$page.posts.edges;
          break;
        case "en":
          posts = this.$page.posts_en.edges;
          break;
        case "it":
          posts = this.$page.posts_it.edges;
          break;
        default:
          posts = this.$page.posts_en.edges;
      }
      return posts;
    }
  }
};
</script>

<style lang="scss">
</style>

