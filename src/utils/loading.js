let loading = null

export default {
  showLoading (ctx, opts = {}) {
    loading = ctx.$loading({
      background: 'rgba(0, 0, 0, .4)',
      ...opts
    })
  },

  hideLoading () {
    loading.close()
  }
}
