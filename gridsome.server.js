// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
// const fs = require('fs');

module.exports = function (api) {
  api.loadSource(actions => {

    const PostsCollection = actions.getCollection('Post');
    Posts = PostsCollection.findNodes({ published: true });
    //Posts = PostsCollection.data();

    var TagsCollection = actions.addCollection({
      typeName: 'Tag'
    });
    TagsCollection.addReference('posts', 'Post');

    for (const Post of Posts) {
      const lang = Post.lang;
      const PostTags = Post.tags;
      for (const PostTag of PostTags) {

        var sluggedPostTag = actions.slugify(PostTag);
        var Tag = TagsCollection.findNode({ path: `/${lang}/tag/${sluggedPostTag}/` });
        var savedTag;
        if (Tag == null) {
          savedTag = TagsCollection.addNode({
            title: PostTag,
            lang: lang,
            posts: [actions.store.createReference('Post', Post.id)]
          });
        } else {
          Tag.posts.push(actions.store.createReference('Post', Post.id));
          savedTag = TagsCollection.updateNode(Tag);
        }
        var PostToUpdate = PostsCollection.findNode({ id: Post.id });
        var PostTagIndex = PostToUpdate.tags.indexOf(PostTag);
        PostToUpdate.tags[PostTagIndex] = actions.store.createReference('Tag', savedTag.id);
      }
    }
    /*
    fs.writeFile("posts.json", JSON.stringify(PostsCollection.data()), function (err) {
      if (err) { return console.log(err); }
      console.log("The file was saved!");
    });
    */
  })
}