const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      webpackConfig.output.crossOriginLoading = "anonymous";
      return webpackConfig;
    },
  },
};
