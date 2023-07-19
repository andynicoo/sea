<template>
  <div>
    <h3 class="me-forecast-tips">
      <!-- {{$t('order.package1')}} -->
    </h3>
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-form-item :label="$t('order.firstMileMethod')">
        <a-select
          @change="modeTransport"
          v-decorator="[
            'fmType',
            { initialValue: '1', rules: [{ required: true }] }
          ]"
        >
          <a-select-option value="1">
            {{ $t('order.expressDelivery') }}
          </a-select-option>
          <!-- <a-select-option value="2">
            {{$t('order.NonexpressDelivery')}}
          </a-select-option> -->
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('order.trackingNumber')">
        <a-input
          v-decorator="[
            'fmNo',
            {
              rules: [
                {
                  required: true,
                  validator: checkTracking,
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
          @search="handleOnSearch"
          @blur="handleOnBlur"
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
            :value="item.first_mile_carrier_id"
            v-for="item in logisticsList"
            :key="item.first_mile_carrier_id"
          >
            {{ item.first_mile_carrier_name }}
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
          <a-select-option value="shopee">
            shopee
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <div class="ant-modal-footer">
      <a-button @click="forecastCancel()">{{ $t('common.cancel') }} </a-button>
      <a-button
        type="primary"
        @click="saveLogisticsForecast"
        :loading="confirmLoading"
      >
        {{ $t('common.ok') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import firstMileCarrierList from '@/util/firstMileCarrierList'
import Order from '@/api/order'
export default {
  props: {
    forecastCancel: {
      type: Function,
      default: null
    },
    getOrderList: {
      type: Function,
      default: null
    },
    currOderId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      transportType: '1',
      colorSelected: [],
      logisticsList: [],
      confirmLoading: false
    }
  },
  mounted() {
    this.$data.logisticsList = firstMileCarrierList.list.slice(0, 100)
  },

  methods: {
    checkTracking(rule, value, callback) {
      if (value != undefined && value != undefined && /^[A-Za-z0-9]+$/.test(value)) {
        callback();
        return;
      }
      callback('请输入正确的快递单号');
    },
    handleOnSearch(value) {
      // 函数节流，防止数据频繁更新，每300毫秒才搜索一次
      let that = this
      if (!this.timer) {
        this.timer = setTimeout(function() {
          that.searchValue(value)
          that.timer = null
        }, 300)
      }
    },
    searchValue(value) {
      const datas = []
      // 对firstMileCarrierList.list进行遍历，将符合搜索条件的数据放入datas中
      firstMileCarrierList.list.forEach((item) => {
        if (
          item.first_mile_carrier_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
        ) {
          datas.push(item)
        }
      })
      // 然后只显示符合搜索条件的所有数据中的前100条
      this.$data.logisticsList = datas.slice(0, 100)
    },
    handleOnBlur() {
      this.$nextTick(() => {
        this.$data.logisticsList = firstMileCarrierList.list.slice(0, 100)
      })
    },

    //切换运输方式
    modeTransport(val) {
      this.$data.transportType = val
      this.$data.form.resetFields()
    },
    //保存发货预报
    saveLogisticsForecast() {
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          values.fmLogisticId = values.fmLogistic.key
          values.fmLogisticName = values.fmLogistic.label
          values.ordersn = this.$props.currOderId
          this.$data.confirmLoading = true
          try {
            let res = await Order.orderFmBind(values)
            if (res.code === 0) {
              this.$Message({
                type: 'success',
                content: this.$t('common.handlerSuccess')
              })
              this.$props.forecastCancel()
              this.$props.getOrderList()
            } else {
              this.$Message({ type: 'error', content: `${res.message}` })
            }
          } finally {
            this.$data.confirmLoading = false
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.ant-modal-footer {
  padding-bottom: 0;
}
.me-forecast-tips {
  padding-bottom: 10px;
}
</style>
