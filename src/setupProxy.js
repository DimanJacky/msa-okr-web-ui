const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://msa-okr-api-cs.okr.apps.msa31.do.neoflex.ru",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    })
  );
};
