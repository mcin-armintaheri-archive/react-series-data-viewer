module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactSeriesDataViewer',
      externals: {
        react: 'React'
      }
    }
  }
}
