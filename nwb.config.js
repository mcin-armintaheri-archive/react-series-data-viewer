const path = require("path");

module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
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
    ]
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
