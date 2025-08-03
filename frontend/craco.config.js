const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: {
    proxy: {
      "/api/coingecko": {
        target: "https://api.coingecko.com",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api/coingecko": "/api/v3",
        },
      },
    },
  },
};
