<template>
  <div>
    <div ref="printWrapper">
      <div style="page-break-after:always;margin:5px ">
        <div
          style="margin:0 auto; border:1px solid #000000;text-align: center;padding-top:5px;width:10cm;height:10cm;box-sizing: border-box;"
        >
          <img id="barcode" style="width:7cm" />
          <p
            style="border-top: 1px solid #000000;padding: 10px;text-align: left; margin-top:10px"
          >
            {{ orderRow.name }}
          </p>
          <div
            style="border-top: 1px solid #000000;padding: 10px;text-align: left;"
          >
            <p>Pick Up Address: <br />{{ orderRow.fullAddress }}</p>
            <br />
            <p>Phone: <br />{{ orderRow.phone }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
export default {
  data() {
    return {
      orderRow: ''
    }
  },

  methods: {
    //打印面单和物品清单
    async printFaceList(item) {
      console.log(item)
      let _this = this
      _this.$data.orderRow = item
      console.log(_this.$data.orderRow)
      JsBarcode('#barcode', 'Hello World!!', {
        format: 'CODE128', //选择要使用的条形码类型
        width: 3, //设置条之间的宽度
        height: 100, //高度
        fontSize: 24,
        margin: 0,
        displayValue: true, //是否在条形码下方显示文字
        textAlign: 'center', //文字所在位置,默认中间
        text: _this.$data.orderRow.trackingNumber, //data.ordersn, //覆盖显示的文本
        lineColor: '#000' //设置条和文本的颜色。
      })
      this.$nextTick(() => {
        var iframe = document.createElement('IFRAME')
        var doc = null
        iframe.setAttribute(
          'style',
          'position:absolute;width:0px;height:0px;left:-500px;top:-500px;'
        )
        document.body.appendChild(iframe)

        doc = iframe.contentWindow.document
        doc.write(this.$refs.printWrapper.innerHTML)
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
          _this.$data.orderRow.printLoading = false
          iframe.contentWindow.print()
        }
      })
    }
  }
}
</script>
