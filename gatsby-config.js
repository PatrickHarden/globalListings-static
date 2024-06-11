module.exports = {
  pathPrefix: `/gatsby`,
  siteMetadata: {
    siteUrl: `http://gl-seo.cbrelistings.com/`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`
      }
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sitemap`
  ]
};


// {
//   resolve: "gatsby-plugin-load-script",
//   options: {
//     src: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAnAZuRFSBSnD9GWQsuKINrIM-MSv-XYGk&libraries=places",
//   }
// },