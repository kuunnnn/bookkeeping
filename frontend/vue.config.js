// const proxy = require('http-proxy-middleware');

module.exports = {
  devServer: {
    // proxy: "http://hkserver:8990"
    proxy: "http://127.0.0.1:4000"
  },
  chainWebpack: config => {
    config.module
      .rule("graphql")
      .test(/\.graphql$/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();
  }
};
