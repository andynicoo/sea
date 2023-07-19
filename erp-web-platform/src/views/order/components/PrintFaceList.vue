<template>
  <div>
    <div ref="printWrapper">
      <div
        style="page-break-after: always; margin: 0px"
        v-for="(orderRow, index) in orderRowList"
        :key="orderRow.ordersn"
      >
        <div
          style="
            width: 10cm;
            height: 10cm;
            box-sizing: border-box;
            margin: 0 auto;
          "
          v-if="printData.length"
        >
          <FaceSheetShopee
            :orderRow="orderRow"
            :printDataItem="printData[index]"
            :index="index"
          ></FaceSheetShopee>
        </div>
        <div
          style="
            width: 10cm;
            height: 10cm;
            box-sizing: border-box;
            font-size: 14px;
            line-height: 16px;
            margin: 20px auto;
          "
          v-if="printData.length && !printSheet"
        >
          <b style="font-size: 30px; line-height: 30px">{{
            printData[index].storeCountry
          }}</b>
          <p>
            shopee
            {{ printData[index].storeInfo.storeName }}
            <b style="float: right; font-size: 16px"
              >件数 {{ printData[index].goodsNum }}</b
            >
          </p>
          <p>
            {{ moment(new Date()).format('YYYY-MM-DD hh:mm:ss') }}
            {{ orderRow.trackingNo }}
          </p>
          <div
            v-for="(item, index) in printData[index].orderItemsList"
            :key="index"
            style="min-height: 45px; padding-top: 5px"
          >
            <img
              style="width: 45px; heigth: 45px; float: left; margin-right: 3px"
              :src="item.mainImage"
            />
            <p style="overflow: hidden">
              {{ item.itemName }} , {{ item.variationName }} *
              {{ item.variationQuantityPurchased }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Order from '@/api/order'
import FaceSheetShopee from './orderList/FaceSheetShopee'
export default {
  data() {
    return {
      moment,
      printDataSource: '',
      printData: [],
      orderRowList: []
    }
  },
  props: {
    printSheet: {
      type: Boolean
    }
  },
  components: {
    FaceSheetShopee
  },
  methods: {
    //打印面单和物品清单
    async printFaceList(rows, packages) {
      console.log(rows, packages)
      let sns = []
      try {
        if (packages?.packageNumber) {
          packages.printLoading = true
          sns.push({
            orderSn: packages.ordersn,
            packageNumber: packages.packageNumber
          })
        } else {
          rows.forEach((items) => {
            items.orderShopeeOrderPackageDTOS.forEach((pack) => {
              if (pack.trackingNo) {
                sns.push({
                  orderSn: pack.ordersn,
                  packageNumber: pack.packageNumber
                })
              }
            })
          })
        }

        let { data } = await Order.getOrderPrintDetailSheet({
          packages: sns
        })
        this.$data.printDataSource = data
        this.$data.printData = []
        this.$data.orderRowList = []
        this.$data.printDataSource.forEach((item, index) => {
          let ol = JSON.parse(item.orderLogistics)
          if (!ol || ol.error) {
            this.errorAlert(ol?.msg ?? '订单不支持打印面单')
          } else {
            item.orderLogistics = ol.shipping_document_info
            this.$data.printData.push(item)
            rows.forEach((order) => {
              this.$data.orderRowList.push(
                ...order.orderShopeeOrderPackageDTOS.filter(
                  (ele) => ele.trackingNo == item.orderLogistics.tracking_number
                )
              )
            })
          }
        })
        this.$store.commit('SET_BATCH_PRINT_LOAD', false)
        if (packages) packages.printLoading = false
        if (!this.$data.orderRowList.length) return
      } catch (err) {
        if (packages) packages.printLoading = false
      }
      if (!sns.length) {
        this.$store.commit('SET_BATCH_PRINT_LOAD', false)
        return this.$message.warning('申请运单号之后才可以打印面单')
      }
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
          if (packages) packages.printLoading = false
          iframe.contentWindow.print()
        }
      })
    }
  }
}
</script>
