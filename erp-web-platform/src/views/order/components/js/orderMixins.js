import Order from '@/api/order'
export default {
  methods: {
    //处理拆分包裹数据
    handlePackage(data) {
      data.forEach((ele) => {
        if (ele.orderShopeeOrderPackageDTOS) {
          ele.orderShopeeOrderPackageDTOS.forEach((item) => {
            this.handlePackageItem(ele, item)
          })
        }
      })
    },
    handlePackageItem(order, goods) {
      goods.list?.forEach((list) => {
        order.items?.forEach((items) => {
          if (list.modelId == items.variationId) {
            Object.assign(list, items)
          }
        })
      })
    },
    //打印面单方法
    printPdf(params, packages = {}) {
      packages.printLoading = true
      packages.isSplitUp
        ? (params.order_list[0].package_number = packages.packageNumber)
        : ''
      Order.downLoadOrderPrintDocument(params)
        .then((res) => {
          packages.printLoading = false
          this.$store.commit('SET_BATCH_PRINT_LOAD', false)
          this.downloadPdf(res, 'application/pdf;chartset=UTF-8', 'test.pdf')
        })
        .catch((err) => {
          packages.printLoading = false
          this.$store.commit('SET_BATCH_PRINT_LOAD', false)
        })
    },
    //下载pdf
    downloadPdf(res, type, filename) {
      // 创建blob对象，解析流数据
      const blob = new Blob([res], {
        // 如果后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为'application/msword'，zip为 'application/zip'
        type: type
      })
      // const a = document.createElement('a')
      // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器打开而不是下载
      const URL = window.URL || window.webkitURL
      // 根据解析后的blob对象创建URL 对象
      const href = URL.createObjectURL(blob)
      window.open(href)
      // 下载链接
      // a.href = href
      // // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
      // a.download = filename
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
      // // 在内存中移除URL 对象
      // window.URL.revokeObjectURL(href)
    }
  }
}
