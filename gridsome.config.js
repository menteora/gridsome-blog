// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
var appConfig = require('config').get('app')

module.exports = {
  siteName: 'Dinamicamente.org',
  siteDescription: 'Geeky posts in shuffle mode',

  templates: {
    Post: '/:lang/blog/:title',
    Tag: '/:lang/tag/:title',
    Internal: '/:lang/:title',
    Language: '/:id'
  },

  plugins: [
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: appConfig.get('GoogleAnalyticsId')
      }
    },
    {
      // Create posts from markdown files
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Language',
        path: 'content/languages/*.md',
      }
    },
    {
      // Create posts from markdown files
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Author',
        path: 'content/authors/*.md',
      }
    },
    {
      // Create posts from markdown files
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Post',
        path: 'content/posts/*.md',
        refs: {
          // Creates a GraphQL collection from 'tags' in front-matter and adds a reference.
          tags: {
            typeName: 'Tag'
          },
          author: 'Author',
        }
      }
    },
    {
      // Create posts from markdown files
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Internal',
        path: 'content/internals/*.md',
      }
    }
  ],

  transformers: {
    //Add markdown support to all file-system sources
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      anchorClassName: 'icon icon-link',
      plugins: [
        '@gridsome/remark-prismjs'
      ]
    }
  }
}
