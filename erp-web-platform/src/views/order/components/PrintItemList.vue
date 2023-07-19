<template>
  <div>
    <div ref="printWrapper">
      <div
        style="page-break-after: always; margin: 0px"
        v-for="order in orderRowList"
        :key="order.ordersn"
      >
        <table>
          <tr>
            <td colspan="2">
              <p>店铺名称:{{ order.storeAlias || order.storeName }}</p>
              <p>订单号:{{ order.ordersn }}</p>
            </td>
            <td>
              <p>
                运单号:
                <br />
                {{ order.trackingNo }}
              </p>
              <p>
                打印时间: <br />
                <!-- {{ order.orderCreateTime }} -->
                {{ timeNow }}
              </p>
            </td>
          </tr>
          <tr v-for="item in order.items" :key="item.id">
            <td>
              <img :src="item.imageUrl" style="width: 60px; height: 60px" />
            </td>
            <td>
              <p>商品名称：{{ item.itemName }}</p>
              <p>商品编码：{{ item.itemSku }}</p>
              <p>商品规格：{{ item.variationName }}</p>
            </td>
            <td>数量:{{ item.variationQuantityPurchased }}</td>
          </tr>
          <tr>
            <td colspan="3">
              <p>订单备注：{{ order.orderRemark }}</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Basic from '@/api/basic'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      moment,
      // printDataSource: '',
      // printData: [],
      orderRowList: [],
      timeNow: ''
    }
  },
  props: {
    translateChinese: {
      type: Boolean
    }
  },
  mounted() {
    // console.log(this.orderRowList)
  },
  methods: {
    //打印面单和物品清单
    async printFaceList(orders) {
      console.log(orders)
      let rows = cloneDeep(orders)
      if (this.translateChinese) {
        let params = {
          storeId: 0,
          to: 'zh',
          list: []
        }
        rows.forEach((order) => {
          order.items.forEach((item) => {
            params.list.push({
              source: item.itemName,
              target: '',
              translateId: item.id
            })
          })
        })

        const { data } = await Basic.batchTranslate(params)
        rows.forEach((order) => {
          order.items.forEach((item) => {
            data.list.forEach((target) => {
              if (target.translateId == item.id) {
                item.itemName = target.target
              }
            })
          })
        })
      }
      this.orderRowList = rows
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
        var cssString = `*{padding:0;margin:0}table{border:1px solid #ddd;border-collapse: collapse;border-spacing: 0;}td{padding:10px; border:1px solid #ddd;}`
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
          // if (packages) packages.printLoading = false
          iframe.contentWindow.print()
        }
      })
    },
    getTimeNow() {
      this.timeNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
