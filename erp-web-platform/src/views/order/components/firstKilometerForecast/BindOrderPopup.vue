<template>
  <div>
    <a-form :form="form" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
      <a-form-item :label="$t('order.firstMileMethod')">
        <a-select
          @change="modeTransport"
          :dropdownMatchSelectWidth="false"
          v-decorator="[
            'fmType',
            { initialValue: '1', rules: [{ required: true }] }
          ]"
        >
          <a-select-option value="1">
            {{ $t('order.expressDelivery') }}
          </a-select-option>
          <a-select-option value="2">
            {{ $t('order.NonexpressDelivery') }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="揽收批次号或快递单号">
        <a-input
          v-decorator="[
            'fmNo',
            {
              rules: [
                {
                  required: true,
                  validator: checkTracking
                }
              ]
            }
          ]"
          :placeholder="
            transportType == '1'
              ? $t('order.enterTrackingNumber')
              : $t('order.enterBatchNumber')
          "
          :maxLength="50"
        />
      </a-form-item>
      <a-form-item :label="$t('order.logisticsProviders')">
        <a-select
          label-in-value
          v-if="transportType == '1'"
          key="m1"
          show-search
          option-filter-prop="children"
          allowClear
          @search="selectSearch"
          @blur="selectBlur"
          v-decorator="[
            'fmLogistic',
            {
              rules: [
                { required: true, message: $t('order.searchlogisticsProvider') }
              ]
            }
          ]"
          :placeholder="$t('order.searchlogisticsProvider')"
        >
          <a-select-option
            :value="item.value"
            v-for="item in logisticsList"
            :key="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-select
          v-else
          key="m2"
          v-decorator="[
            'logisticsProvidersB',
            {
              initialValue: 'shopee',
              rules: [{ required: true }]
            }
          ]"
        >
          <a-select-option value="shopee"> shopee </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import fmMixins from './mixins'
import Order from '@/api/order'
export default {
  mixins: [fmMixins],
  props: {
    selectedOrder: {
      type: Array,
      default: () => []
    },
    storeIds: {
      type: Number
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      transportType: '1',
      colorSelected: []
    }
  },
  mounted() {
    // //物流商列表数据处理
    // this.$data.logisticsListSource = this.handleCarrier(firstMileCarrierList)
    // this.$data.logisticsList = this.$data.logisticsListSource.slice(0, 100)
  },

  methods: {
    //批次号快递单号校验
    checkTracking(rule, value, callback) {
      if (value != undefined && /^[A-Za-z0-9 ]+$/.test(value)) {
        callback()
        return
      }
      callback('请输入正确的批次号/快递单号')
    },

    //切换运输方式
    modeTransport(val) {
      this.$data.transportType = val
      this.$data.form.resetFields()
    },
    //保存发货预报
    saveLogisticsForecast() {
      return new Promise((resolve) => {
        this.$data.form.validateFields(async (err, values) => {
          if (!err) {
            console.log(values)
            if (values.fmType == 1) {
              values.fmLogisticId = values.fmLogistic.key
              values.fmLogisticName = values.fmLogistic.label
            } else {
              values.fmLogisticId = '813'
              values.fmLogisticName = 'Shopee'
            }
            // values.ordersns = this.$props.selectedOrdersn
            values.packages = this.$props.selectedOrder.map((item) => {
              return {
                orderSn: item.ordersn,
                packageNumber: item.packageNumber
              }
            })
            values.region = 'CN'
            values.storeId = this.$props.storeIds
            try {
              let { data } = await Order.bindFirstMileTrackintNumber(values)
              if (data.length == 0) {
                this.$Message({
                  type: 'success',
                  content: this.$t('common.handlerSuccess')
                })
              } else {
                const h = this.$createElement
                let errorInfo = []
                data.forEach((item) => {
                  errorInfo.push(
                    h(
                      'p',
                      `订单号${JSON.parse(item).order_sn}：${
                        JSON.parse(item).fail_message.includes(
                          'Please check the order status'
                        )
                          ? '请“申请运单号”后再使用发货预报功能！'
                          : JSON.parse(item).fail_message
                      }`
                    )
                  )
                })
                this.$error({
                  title: '温馨提示',
                  width: 700,
                  content: h('div', {}, errorInfo)
                })
              }
              resolve(true)
            } catch (err) {
              resolve(false)
            }
          } else {
            resolve(false)
          }
        })
      })
    }
  }
}
</script>
