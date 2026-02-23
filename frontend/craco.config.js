const path = require("path");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    plugins: {
      add: [
        new SubresourceIntegrityPlugin({
          hashFuncNames: ["sha384"], // sha384 is the recommended standard
          enabled: process.env.NODE_ENV === "production", // only in prod builds
        }),
      ],
    },
    configure: (webpackConfig) => {
      // Required: tells webpack to use absolute URLs so SRI can match assets
      webpackConfig.output.crossOriginLoading = "anonymous";
      return webpackConfig;
    },
  },
};
