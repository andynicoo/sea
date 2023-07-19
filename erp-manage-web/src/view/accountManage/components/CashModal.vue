<template>
  <a-modal
    :visible="value"
    :after-close="afterClose"
    :closable="false"
    @ok="ok"
    @cancel="$emit('input', false)"
  >
    <SearchForm
      ref="searchForm"
      form-class="cash-form"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    >
      <template #timeSearchStr>
        <a-date-picker
          show-time
          :value="formModel.deadline"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="change"
        />
      </template>
      <template #paymentPicUrl>
        <UploadImg
          :files-list="filesList"
          @change="handleChange"
        />
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import UploadImg from '@/components/uploadImg'
import { uploadImgUrl } from '@/api/uploadImgUrl'
import moment from 'moment'
import { getPerPayMoney, cashMoney } from '@/api/accountManage'
const initFormModel = {
  deadline: moment().format('YYYY-MM-DD 00:00:00'),
  paymentPicUrl: '',
  paymentTime: moment().format('YYYY-MM-DD 00:00:00'),
  handleRemark: ''
}
export default {
  components: {
    SearchForm,
    // eslint-disable-next-line vue/no-unused-components
    UploadImg
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    actionType: {
      type: String,
      default: 'edit'
    },
    data: {
      type: Object,
      default: () => ({})
    },
    optType: {
      type: Number,
      default: () => {
        return 1
      }
    }
  },
  data() {
    return {
      formModel: {
        ...initFormModel
      },
      action: uploadImgUrl,
      filesList: [],
      payMoneyInfo: {}
    }
  },
  computed: {
    formItem({ data, payMoneyInfo }) {
      let arr = []
      let pullicArr = [
        {
          key: 'forwarderName',
          label: '贷代商名称',
          title: '预付提现',
          span: 24,
          render(h, { text }) {
            return <span>{data.forwarderName}</span>
          }
        },
        {
          key: 'balanceData',
          label: '旺币余额',
          span: 24,
          render(h, params) {
            return <span>{data?.accBalance ?? 0}</span>
          }
        },
        {
          key: 'maxPrePayMoney',
          label: '最大可预付金额',
          span: 24,
          render(h, { text }) {
            return <span>{data.maxPrePayMoney}</span>
          }
        },
        {
          label: '日期查询',
          itemType: 'date',
          key: 'deadline',
          span: 24,
          required: true,
          slotName: 'timeSearchStr'
        },
        {
          label: '待预付金额',
          key: 'orderNum',
          span: 24,
          render: (h, { text }) => {
            return (
              <span>
                {payMoneyInfo.perPayTotalMoney || 0}元/共
                {payMoneyInfo.orderNum || 0}笔订单
              </span>
            )
          }
        }
      ]

      if (this.optType === 1) {
        arr = pullicArr.concat([
          {
            key: 'settlement',
            label: '提现手续费',
            span: 24,
            render(h, params) {
              return <span>{payMoneyInfo.settlement ?? 0}</span>
            }
          },
          {
            key: 'withdrawalFee',
            label: '单笔提现手续费',
            span: 24,
            render(h, params) {
              return <span>{payMoneyInfo.withdrawalFee ?? 0}</span>
            }
          },
          {
            key: 'withdrawMoneyAmount',
            label: '实际到账',
            span: 24,
            render(h, params) {
              return <span>{payMoneyInfo.withdrawMoneyAmount ?? 0}</span>
            }
          },
          {
            label: '备注',
            key: 'handleRemark',
            itemType: 'input',
            span: 24
          }
        ])
      }
      if (this.optType === 2) {
        arr = pullicArr.concat([
          {
            label: '需支付金额',
            key: 'perPayTotalMoney',
            span: 24,
            render: () => {
              return (
                <span class="flag">{payMoneyInfo.perPayTotalMoney ?? 0}元</span>
              )
            }
          },
          {
            label: '转账凭证',
            key: 'paymentPicUrl',
            span: 24,
            slotName: 'paymentPicUrl',
            required: true
          },
          {
            label: '转账时间',
            key: 'paymentTime',
            span: 24,
            itemType: 'date',
            required: true,
            itemProp: {
              showTime: true,
              format: 'YYYY-MM-DD HH:mm:ss',
              valueFormat: 'YYYY-MM-DD HH:mm:ss'
            }
          },
          {
            label: '备注',
            key: 'handleRemark',
            itemType: 'input',
            span: 24
          }
        ])
      }
      return arr
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getPerPayMoney()
      }
    }
  },
  created() {},
  methods: {
    async ok() {
      this.$refs.searchForm.validate()
    },
    async getPerPayMoney() {
      const params = {
        deadline: this.formModel.deadline,
        forwarderId: this.data.id,
        isOnline: this.optType === 1
      }
      try {
        const { data } = await getPerPayMoney(params)
        // console.log(data)
        this.payMoneyInfo = data || {}
      } catch (error) {
        console.error(error)
      }
    },
    setFormModel() {
      const val = this.data
      const obj = {}
      if (this.actionType === 'edit') {
        Object.entries(this.formModel).forEach(([key, value]) => {
          obj[key] = val[key]
        })
        this.formModel = obj
      }
    },
    afterClose() {
      this.formModel = { ...initFormModel }
      this.filesList = []
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      const params = {
        forwarderId: this.data.id,
        isOnline: this.optType === 1,
        ...val
      }
      try {
        await cashMoney(params)
        this.$emit('input', false)
        this.$emit('ok')
        this.$message.success(
          `${this.actionType === 'add' ? '新增' : '修改'}成功`
        )
      } catch (error) {
        console.error(error)
      }
    },
    handleChange(list = []) {
      this.formModel.paymentPicUrl =
        list && list.map((item) => item.url || item.thumbUrl).join()
    },
    change(e) {
      this.formModel.deadline = e
      this.getPerPayMoney()
    }
  }
}
</script>

<style lang="less" scoped>
.flag {
  color: red;
}
.cash-form {
  /deep/.ant-form-item-label {
    min-width: 110px;
  }
}
</style>
