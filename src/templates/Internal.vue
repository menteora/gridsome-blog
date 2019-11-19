<template>
  <Layout>
    <card-page title-position="outside">
      <template v-slot:outside>
        <div class="post-title">
          <h1 class="post-title__text">{{ $page.internal.edges[0].node.description }}</h1>
          <PostMeta :post="$page.internal.edges[0].node" />
        </div>
      </template>
      <g-image
        alt="Cover image"
        v-if="$page.internal.edges[0].node.coverImage"
        :src="$page.internal.node.coverImage"
      />
      <v-card-text class="text--primary body-1" v-html="$page.internal.edges[0].node.content"></v-card-text>
    </card-page>
  </Layout>
</template>

<script>
import PostMeta from "~/components/PostMeta";

export default {
  components: {
    PostMeta
  },
  metaInfo() {
    return {
      title: this.$page.internal.edges[0].node.title,
      meta: [
        {
          name: "description",
          content: this.$page.internal.edges[0].node.description
        }
      ]
    };
  }
};
</script>

<page-query>
query Internal ($path: String!) {
  internal: allInternal(limit: 1, filter: { path: { eq: $path }}) {
    edges {
      node {
        path
        content
        title
        description
      }
    }
  }
}
</page-query>

<style lang="scss">
.post-title {
  padding: calc(var(--space) / 2) 0 calc(var(--space) / 2);
  text-align: center;
}

.post {
  &__header {
    width: calc(100% + var(--space) * 2);
    margin-left: calc(var(--space) * -1);
    margin-top: calc(var(--space) * -1);
    margin-bottom: calc(var(--space) / 2);
    overflow: hidden;
    border-radius: var(--radius) var(--radius) 0 0;

    img {
      width: 100%;
    }

    &:empty {
      display: none;
    }
  }

  &__content {
    h2:first-child {
      margin-top: 0;
    }

    p:first-of-type {
      font-size: 1.2em;
      color: var(--title-color);
    }

    img {
      width: calc(100% + var(--space) * 2);
      margin-left: calc(var(--space) * -1);
      display: block;
      max-width: none;
    }
  }
}
</style>
