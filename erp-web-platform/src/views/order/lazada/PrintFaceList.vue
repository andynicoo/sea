<template>
  <div>
    12321312312312
    <div ref="printWrapper">
      <table style="page-break-after: always; margin: 0px;">
        <tr>
          <td>商品信息</td>
          <td>订单号</td>
          <td width="60">数量</td>
        </tr>
        <tr v-for="orderRow in selectedOrderPrint" :key="orderRow.orderNumber">
          <td style="border: 1px solid #ebebeb">
            <div v-for="item in orderRow.items" :key="item.orderItemId">
              <dl style="padding: 5px;" class="me-goods-info" v-if="item.check">
                <dt
                  style="float: left;
    margin-right: 5px;"
                >
                  <img
                    style="width: 64px; height: 64px"
                    :src="item.productMainImage"
                  />
                </dt>
                <dd
                  style="overflow: hidden;
    text-align: left;"
                >
                  <p class="me-em2">{{ item.name }}</p>
                  <p>sellerSku: {{ item.sku }}</p>
                </dd>
              </dl>
            </div>
          </td>
          <td>{{ orderRow.orderNumber }}</td>
          <td>{{ packSum([orderRow]) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { add } from '@/util'
export default {
  data() {
    return {}
  },
  props: {
    selectedOrderPrint: {
      type: [Array]
    }
  },
  created() {},
  methods: {
    packSum(selectedOrder) {
      console.log(selectedOrder)
      let sum = 0
      selectedOrder.forEach((order) => {
        let itemLen = 0
        order.packList.forEach((pack) => {
          pack.items.forEach((item) => {
            if (item.check) {
              itemLen += 1
            }
          })
        })
        sum = add(sum, itemLen)
      })
      return sum
    },
    //打印面单和物品清单
    async printFaceList() {
      this.$nextTick(() => {
        let _this = this
        var iframe = document.createElement('IFRAME')
        var doc = null
        _this.$store.commit('SET_BATCH_PRINT_LOAD', false)
        iframe.setAttribute(
          'style',
          'position:absolute;width:0px;height:0px;left:-500px;top:-500px;'
        )
        document.body.appendChild(iframe)

        doc = iframe.contentWindow.document
        doc.write(this.$refs.printWrapper.innerHTML)
        doc.close()
        var cssString = `*{padding:0;margin:0}table{border:1px solid #ebebeb;border-collapse: collapse;
    border-spacing: 0;}table td{padding:5px;border: 1px solid #ebebeb}.tc{text-align:center}`
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

          iframe.contentWindow.print()
        }
      })
    }
  }
}
</script>
