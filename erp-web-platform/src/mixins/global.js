export default {
  methods: {
    /**
     * @description 打开页面，
     * @param {*} path 路径，可以是外链也可以是内部链接
     * @param {*} [_blank=null] 是否打开新窗口，值为空则不打开新窗口，值为'_blank'则打开新窗口
     */
    openPage(path, _blank = null) {
      let isouterLink = /^http/.test(path)
      if (_blank == '_blank') {
        let routeData = this.$router.resolve({
          path: path
        })
        let targetPath = isouterLink ? path : routeData.href
        window.open(targetPath, '_blank')
      } else {
        if (isouterLink) {
          window.open(path)
        } else {
          window._VV.$router.push(path)
        }
      }
    },

    //获取语言
    getLocalLang(...key) {
      let keys = key.join('.')
      // return this.$vuetify.lang.t(`$vuetify.${keys}`) || 'Invalid lang'
    },

    //把接口的分页信息交给paginationData
    getPageFromResp(source) {
      let { current, size, pages, total } = source
      return {
        current,
        size: String(size),
        total
      }
    },

    //把接口的分页信息交给paginationData, type == Number
    getPageFromRespNum(source) {
      let { current, size, pages, total } = source
      return {
        current,
        size: String(size),
        pages,
        total
      }
    },

    //错误提示
    errorAlert(text, timeout = 2) {
      this.$message.error({
        content: text,
        duration: timeout
      })
    },

    //友情提示
    successAlert(text, timeout = 2) {
      this.$message.success({
        content: text,
        duration: timeout
      })
    },

    //询问提示
    confirmModal(message, self, cb) {
      this.$confirm({
        title: this.$t('common.message'),
        content: message || this.$t('common.deleteConfirm'),
        onOk: async () => {
          if (cb && typeof cb == 'function') {
            cb(self)
          }
        }
      })
    }
  }
}
