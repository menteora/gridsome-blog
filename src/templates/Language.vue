<template>
  <Layout :is-home="true" :show-language="true">
    <!-- Author intro -->
    <HomeLogo :show-title="true" />

    <!-- List posts -->
    <div class="posts">
      <PostCard
        v-for="edge in $page.posts.edges"
        :key="edge.node.id"
        :post="edge.node"
      />
    </div>
  </Layout>
</template>

<page-query>
query Post ($id: String!) {
  posts: allPost(filter: { published: { eq: true }, lang: {eq: $id}}) {
    edges {
      node {
        id
        title
        date (format: "YYYY-MM-DDTHH:mm:ss.sssZ")
        timeToRead
        description
        cover_image
        path
        tags {
          id
          title
          path
        }
      }
    }
  }
}
</page-query>

<script>
import HomeLogo from "~/components/HomeLogo.vue";
import PostCard from "~/components/PostCard.vue";

export default {
  components: {
    HomeLogo,
    PostCard
  },
  metaInfo() {
    return {
    title: "",
    htmlAttrs: {
        lang: this.$root.$i18n.locale
      },
    }
  }
};
</script>
