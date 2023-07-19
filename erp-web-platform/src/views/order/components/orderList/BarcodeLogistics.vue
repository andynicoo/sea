<template>
  <div>
    <img :id="'Bar' + index" style="width:8cm" /><br />Tracking NO.:
    {{ trackingNo }}
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
export default {
  props: {
    trackingNo: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    JsBarcode('#Bar' + this.index, this.trackingNo, {
      format: 'CODE128', //选择要使用的条形码类型this.printDataItem.orderLogistics.tracking_no
      width: 3, //设置条之间的宽度
      height: 100, //高度
      fontSize: 24,
      margin: 0,
      displayValue: false, //是否在条形码下方显示文字
      // textAlign: 'center', //文字所在位置,默认中间
      // text: 'MY213895992137S', //覆盖显示的文本
      lineColor: '#000' //设置条和文本的颜色。
    })
  }
}
</script>
<style lang="scss" scoped></style>
