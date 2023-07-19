<template>
  <a-modal
    title="新增货代预报"
    :visible="showModal"
    @cancel="showModal = false"
    @ok="submit"
    width="600px"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
      <a-form-item label="物流公司">
        <a-select
          label-in-value
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
      </a-form-item>
      <a-form-item label="物流单号">
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
          placeholder="物流单号"
          :maxLength="50"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import fmMixins from './firstKilometerForecast/mixins'
import Order from '@/api/order'
export default {
  mixins: [fmMixins],
  props: {
    selectedRows: {
      type: Array
    }
  },
  data() {
    return {
      showModal: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    //快递单号校验
    checkTracking(rule, value, callback) {
      if (
        value != undefined &&
        /^[A-Za-z0-9 ]+$/.test(value) &&
        value.length < 50
      ) {
        callback()
        return
      }
      callback('请输入正确的快递单号')
    },
    //提交
    submit() {
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          let params = {
            fmLogisticName: values.fmLogistic.label.replace(/ /g, ''),
            fmNo: values.fmNo,
            fmLogisticId: values.fmLogistic.key,
            packages: []
          }
          this.selectedRows.forEach((order) => {
            if (order.orderShopeeOrderPackageDTOS.length > 1) {
              order.orderShopeeOrderPackageDTOS.forEach(
                ({ ordersn, packageNumber }) => {
                  params.packages.push({ orderSn: ordersn, packageNumber })
                }
              )
            } else {
              params.packages.push({
                orderSn: order.ordersn,
                packageNumber:
                  order.packageNumber ||
                  order.orderShopeeOrderPackageDTOS[0].packageNumber
              })
            }
          })
          this.confirmLoading = true
          Order.batchBindFirstMileTrackintNumber(params)
            .then((res) => {
              this.confirmLoading = false
              this.successAlert('操作成功!')
              this.showModal = false
              this.$emit('submit')
            })
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    }
    //解绑
    // unbindFirstMileTrackingNumber() {
    //   let parms = [
    //     {
    //       fmNo: this.packageInfo.fmNo,
    //       storeId: this.records.storeId,
    //       packages: [
    //         {
    //           orderSn: this.packageInfo.ordersn,
    //           packageNumber: this.packageInfo.packageNumber
    //         }
    //       ]
    //     }
    //   ]
    //   this.confirmLoading = true
    //   Order.unbindFirstMileTrackingNumber(parms)
    //     .then((res) => {
    //       this.records.fmStatus = 0
    //       this.saveLogisticsForecast()
    //     })
    //     .catch(() => {
    //       this.confirmLoading = false
    //     })
    // },
    //绑定发货预报
    // saveLogisticsForecast() {
    //   return new Promise((resolve) => {
    //     this.$data.form.validateFields(async (err, values) => {
    //       if (!err) {
    //         // console.log(values)
    //         let parms = {
    //           fmType: 1,
    //           fmNo: values.fmNo,
    //           fmLogisticId: values.fmLogistic.key,
    //           fmLogisticName: values.fmLogistic.label,
    //           packages: [
    //             {
    //               orderSn: this.packageInfo.ordersn,
    //               packageNumber: this.packageInfo.packageNumber
    //             }
    //           ],
    //           region: 'CN',
    //           storeId: this.records.storeId
    //         }
    //         this.confirmLoading = true
    //         try {
    //           let { data } = await Order.bindFirstMileTrackintNumber(parms)
    //           this.confirmLoading = false
    //           if (data.length == 0) {
    //             this.$Message({
    //               type: 'success',
    //               content: this.$t('common.handlerSuccess')
    //             })
    //             this.records.fmStatus = 1
    //             this.packageInfo.fmNo = values.fmNo
    //             this.packageInfo.fmLogisticName = values.fmLogistic.label
    //             this.showModal = false
    //           } else {
    //             const h = this.$createElement
    //             let errorInfo = []
    //             data.forEach((item) => {
    //               errorInfo.push(
    //                 h(
    //                   'p',
    //                   `订单号${JSON.parse(item).order_sn}：${
    //                     JSON.parse(item).fail_message.includes(
    //                       'Please check the order status'
    //                     )
    //                       ? '请“申请运单号”后再使用发货预报功能！'
    //                       : JSON.parse(item).fail_message
    //                   }`
    //                 )
    //               )
    //             })
    //             this.$error({
    //               title: '温馨提示',
    //               width: 700,
    //               content: h('div', {}, errorInfo)
    //             })
    //           }
    //           resolve(true)
    //         } catch (err) {
    //           resolve(false)
    //         }
    //       } else {
    //         resolve(false)
    //       }
    //     })
    //   })
    // }
  }
}
</script>
