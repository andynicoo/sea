import moment from 'moment'
export default {
  data: function() {
    return {
      moment,
      indeterminate: false,
      checkAll: false,
      checkLength: 0,
      isPackedLength: 0
    }
  },

  mounted: function() {},
  methods: {
    // 按照特定方式格式化
    sortArr(arr, str) {
      var _arr = [],
        _t = [],
        // 临时的变量
        _tmp

      // 按照特定的参数将数组排序将具有相同值得排在一起
      arr = arr.sort(function(a, b) {
        var s = a[str],
          t = b[str]

        return s < t ? -1 : 1
      })

      if (arr.length) {
        _tmp = arr[0][str]
      }
      // console.log( arr );
      // 将相同类别的对象添加到统一个数组
      for (var i in arr) {
        if (arr[i][str] === _tmp) {
          _t.push(arr[i])
        } else {
          _tmp = arr[i][str]
          _arr.push(_t)
          _t = [arr[i]]
        }
      }
      // 将最后的内容推出新数组
      _arr.push(_t)
      return _arr
    },
    //状态映射
    statusMap(code) {
      let map = [
        { label: '全部订单', id: 0 },
        { label: '未付款', id: 'unpaid' },
        { label: '打包', id: 'pending' },
        { label: '重新打包', id: 'repacked' },
        { label: '已打包', id: 'packed' },
        { label: '准备发货', id: 'ready_to_ship' },
        { label: '在途', id: 'shipped' },
        { label: '妥投', id: 'delivered' },
        { label: '已取消', id: 'canceled' },
        { label: '退款/退货', id: 'returned' },
        { label: '妥投失败', id: 'shipped_back_success' },
        { label: '妥投失败', id: 'shipped_back' },
        { label: '丢失/损毁', id: 9 }
      ]
      return map.filter((item) => item.id == code)[0]?.label
    },
    //所以订单全选
    checkAllChange(e) {
      this.indeterminate = false
      this.checkAll = e.target.checked
      this.checkAllFn(e.target.checked)
    },
    checkAllFn(flag) {
      this.$data.dataSource.forEach((order) => {
        order.check = flag
        order.indeterminate = false
        order.packList.forEach((pack) => {
          pack.check = flag
          pack.items.forEach((item) => {
            item.check = flag
          })
        })
      })
      this.getCheckLength()
    },
    //单个订单选择
    checkOrderChange(e, order) {
      order.indeterminate = false
      order.check = e.target.checked
      order.packList.forEach((pack) => {
        pack.check = e.target.checked
        pack.items.forEach((item) => {
          item.check = e.target.checked
        })
      })
      this.getCheckLength()
    },
    //items选择
    checkItemChange(e, item, order, type = 'items') {
      item.check = e.target.checked
      let checkLen = 0
      order[type].forEach((item) => {
        if (item.check) {
          checkLen += 1
        }
      })
      if (type != 'items') {
        item.items.forEach((item) => {
          item.check = e.target.checked
        })
      }
      if (checkLen == 0) {
        order.indeterminate = false
        order.check = false
      } else if (checkLen == order[type].length) {
        order.indeterminate = false
        order.check = true
      } else if (checkLen < order[type].length) {
        order.indeterminate = true
        order.check = true
      }
      this.getCheckLength()
    },
    //获取选中个数
    getCheckLength() {
      this.checkLength = 0
      this.isPackedLength = 0
      this.$data.dataSource.forEach((order) => {
        order.packList.forEach((pack) => {
          if (pack.check) {
            this.checkLength += 1
          }
          pack.items.forEach((item) => {
            if (pack.check && item.status == 'packed') {
              this.isPackedLength += 1
            }
            if (item.check) {
              this.checkLength += 1
            }
          })
        })
      })
    },
    //倒计时
    countDown() {
      this.$data.dataSource.forEach((order) => {
        order.packList.forEach((item) => {
          if (item.items[0].slaTimeStamp) {
            let d = 0
            let nowTime = parseInt(moment(new Date()).format('x'))
            let lastTime = parseInt(
              moment(item.items[0].slaTimeStamp).format('x')
            )
            if (lastTime - nowTime > 0) {
              d = moment.duration((lastTime - nowTime) / 1000, 'seconds')
              item.remainingTime = `${Math.floor(
                d.asDays()
              )}天${d.hours()}时${d.minutes()}分${d.seconds()}秒`
            } else {
              item.remainingTime = `已超时`
            }
          }
        })
      })
    },
    //打印面单
    printFace(html) {
      let innerHTML = ''
      html.forEach((item) => {
        innerHTML += `${decodeURIComponent(escape(window.atob(item.file)))}`
        // innerHTML += `<div style="page-break-after: always;">${decodeURIComponent(
        //   escape(window.atob(item.file))
        // )}</div>`
        innerHTML = innerHTML.replace(
          /<hr style='page-break-after: always;border-top: 3px dashed;'\/>/g,
          ''
        )
        innerHTML = innerHTML.replace(
          /style="height: 150mm; width: 100mm;/g,
          'style="page-break-after: always;height: 150mm; width: 100mm;'
        )

        // console.log(innerHTML)
      })
      this.$nextTick(() => {
        let _this = this
        var iframe = document.createElement('IFRAME')
        var doc = null
        iframe.setAttribute(
          'style',
          'position:absolute;width:0px;height:0px;left:-500px;top:-500px;'
        )
        document.body.appendChild(iframe)

        doc = iframe.contentWindow.document
        doc.write(innerHTML)
        doc.close()
        var cssString = `*{padding:0;margin:0}`
        var style = iframe.contentWindow.document.createElement('style')
        style.setAttribute('type', 'text/css')

        var cssText = iframe.contentWindow.document.createTextNode(cssString)
        style.appendChild(cssText)

        var heads = iframe.contentWindow.document.getElementsByTagName('head')
        if (heads.length) {
          heads[0].appendChild(style)
        } else {
          iframe.contentWindow.document.documentElement.appendChild(style)
        }
        iframe.contentWindow.focus()
        iframe.onload = function() {
          //解决图片显示不了的问题
          _this.printLoading = false
          iframe.contentWindow.print()
        }
      })
    }
  }
}
