<template>
  <div>
    <table
      style="border:2px solid #000000;width:100%;height:100%;color:#000;border-collapse: collapse;border-spacing: 0;"
    >
      <tr>
        <td
          colspan="4"
          style="border-bottom:1px solid #999999;padding-left:5px; height:1cm"
        >
          Order ID: {{ orderRow.ordersn }}
        </td>
      </tr>
      <tr>
        <td
          colspan="4"
          style="border-bottom:1px solid #999999; text-align:center;padding:5px"
        >
          <BarcodeLogistics
            :index="index"
            :trackingNo="printDataItem.orderLogistics.tracking_number"
          ></BarcodeLogistics>
        </td>
      </tr>
      <tr>
        <td style="width: 25%; text-align:center;word-break: break-all;">
          {{ printDataItem.orderLogistics.first_mile_name }}
        </td>
        <td
          style="width: 25%; border-left:1px solid #999999;border-right:1px solid #999999; text-align:center;word-break: break-all;"
        >
          {{ printDataItem.orderLogistics.last_mile_name }}
        </td>
        <td
          style="width: 25%; border-right:1px solid #999999; text-align:center;font-size:40px;"
        >
          <b>{{ printDataItem.orderLogistics.goods_to_declare ? 'T' : 'P' }}</b>
        </td>
        <td style="width: 25%; text-align:center;word-break: break-all;">
          {{ printDataItem.orderLogistics.lane_code }}
        </td>
      </tr>
      <tr>
        <td
          colspan="2"
          style="border-top:1px solid #999999;padding:5px;line-height:14px"
        >
          <b
            >Ship To:{{
              printDataItem.orderLogistics.recipient_address
                ? printDataItem.orderLogistics.recipient_address.name
                : ''
            }}</b
          >
          <div style="height:55px;padding-top:3px; overflow:hidden;">
            {{
              printDataItem.orderLogistics.recipient_address
                ? printDataItem.orderLogistics.recipient_address.full_address
                : ''
            }}
          </div>
          Tel:{{
            printDataItem.orderLogistics.recipient_address
              ? printDataItem.orderLogistics.recipient_address.phone
              : ''
          }}
        </td>
        <td
          colspan="2"
          style="border-top:1px solid #999999;border-left:1px solid #999999;padding-left:5px;line-height:14px"
        >
          {{ printDataItem.orderLogistics.warehouse_address }}
        </td>
      </tr>
      <tr>
        <td
          colspan="2"
          style="border-top:1px solid #999999;padding-left:5px; height:2cm;font-size:12px"
        >
          <div style="max-height:88px; overflow:hidden">
            Items:<br />
            <p
              v-for="(item, index) in orderRow.items || orderRow.list"
              :key="index"
              style="line-height:14px;"
            >
              {{ item.variationName }} *
              {{ item.variationQuantityPurchased }}
            </p>
          </div>
        </td>
        <td
          colspan="2"
          style="border-top:1px solid #999999;font-size:40px; text-align:center"
        >
          <b>{{ printDataItem.orderLogistics.service_code }}</b>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import BarcodeLogistics from './BarcodeLogistics'
export default {
  props: {
    orderRow: {
      type: Object
    },
    printDataItem: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  components: {
    BarcodeLogistics
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped></style>
