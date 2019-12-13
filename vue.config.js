module.exports = {
  devServer: {
    proxy: {
      '/uu2': {
        target: 'https://m.uusport.net',
        secure: false,
        changeOrigin: true
      }
    }
  },
  // outputDir: 'uums',
  publicPath: process.env.NODE_ENV === 'production' ? '/pages/uums/dist' : '/'
}
