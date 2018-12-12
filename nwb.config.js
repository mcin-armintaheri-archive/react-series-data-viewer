const path = require("path");

module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      entry: path.resolve("src") + "/umd.js",
      global: "ReactSeriesDataViewer",
      externals: {
        react: "React"
      }
    }
  },
  babel: {
    plugins: [
      "flow-react-proptypes",
      ["module-resolver", { alias: { src: path.resolve("src") } }]
    ],
    presets: ["env", "flow"]
  },
  webpack: {
    html: {
      template: "demo/src/index.html"
    }
  },
  devServer: {
    proxy: {
      "/test-data": {
        target: "http://localhost:5000",
        pathRewrite: { "^/test-data": "" }
      }
    }
  }
};
