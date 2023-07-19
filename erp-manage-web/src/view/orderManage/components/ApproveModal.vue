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
      form-class="money-form"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    >
      <template #voucherUrl>
        <UploadImg
          :files-list="filesList"
          @change="handleChange"
        />
      </template>

      <template #payPassword>
        <a-input
          v-model="formModel.payPassword"
          type="password"
          autocomplete="off"
        />
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import UploadImg from '@/components/uploadImg'
import { moneyAgree } from '@/api/account'
import { uploadImgUrl } from '@/api/uploadImgUrl'
const initFormModel = {
  receiveBank: '',
  receiveSubbranch: '',
  receivePayee: '',
  receiveBankCard: '',
  invoiceUrl: '',
  sendMoneyTime: null
}
const loadingImg = require('@/assets/loading-img.png')
export default {
  components: {
    SearchForm,
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
    }
  },
  data() {
    return {
      formModel: {
        ...initFormModel
      },
      loadingImg,
      filesList: [],
      action: uploadImgUrl
    }
  },
  computed: {
    formItem({ data }) {
      let arr = []
      let pullicArr = [
        {
          title: '银行卡信息',
          span: 24
        },
        {
          //   itemType: 'input',
          key: 'receiveBank',
          label: '银行名称',
          span: 24,
          render: (h, { text }) => {
            return <span>{text}</span>
          }
        },
        {
          //   itemType: 'number',
          key: 'receiveSubbranch',
          label: '开户行',
          span: 24,
          render: (h, { text }) => {
            return <span>{text}</span>
          }
        },
        {
          key: 'receivePayee',
          label: '开户人',
          span: 24,
          render: (h, { text }) => {
            return <span>{text}</span>
          }
        },
        {
          key: 'receiveBankCard',
          label: '银行卡号',
          span: 24,
          render: (h, { text }) => {
            return <span>{text}</span>
          }
        },
        {
          title: '提现信息',
          span: 24
        }
      ]
      if (data.payChannel === 'xsPay') {
        arr = pullicArr.concat([
          {
            key: 'withdrawApplyIntegralAmount',
            label: '提现金额',
            span: 24,
            render: (h, { text }) => {
              return <span>{data.withdrawApplyIntegralAmount || 0}元</span>
            }
          },
          {
            key: 'chargeIntegralAmount',
            label: '手续费',
            span: 24,
            render: (h, { text }) => {
              return <span>{data.chargeIntegralAmount || 0}元</span>
            }
          },
          {
            key: 'withdrawalFee',
            label: '单笔提现费',
            span: 24,
            render: (h, { text }) => {
              return <span>{data.withdrawalFee || 0}元</span>
            }
          },
          {
            key: 'withdrawMoneyAmount',
            label: '实际到账',
            span: 24,
            render: (h, { text }) => {
              return <span>{data.withdrawMoneyAmount || 0}元</span>
            }
          },
          {
            key: 'payChannel',
            label: '支付方式',
            span: 24,
            render: (h, { text }) => {
              return <span>线上支付(确认汇款后通过第三方代付付款)</span>
            }
          },
          {
            key: 'payPassword',
            label: '支付密码',
            slotName: 'payPassword',
            required: true,
            span: 24
          }
          // {
          //   key: 'payPassword',
          //   label: '支付密码',
          //   itemType: 'input',
          //   required: true,
          //   span: 24
          // }
        ])
      }

      if (data.payChannel === 'aliPay') {
        arr = pullicArr.concat([
          {
            key: 'invoiceUrl',
            label: '发票',
            span: 24,
            render: (h, { text }) => {
              return <img src={text || this.loadingImg} height="80"></img>
            }
          },
          {
            itemType: 'date',
            key: 'sendMoneyTime',
            label: '汇款时间',
            required: true,
            span: 24,
            itemProp: {
              valueFormat: 'YYYY-MM-DD 00:00:00'
            }
          }
        ])
        if (data.orderStatusDisplay === '申请中') {
          arr = arr.concat([
            {
              label: '汇款凭证',
              key: 'voucherUrl',
              slotName: 'voucherUrl',
              span: 24
            }
          ])
        }
      }
      return arr
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) this.setFormModel()
      }
    }
  },
  created() {},
  methods: {
    async ok() {
      this.$refs.searchForm.validate()
    },
    setFormModel() {
      const val = this.data
      const obj = Object.create(null)
      if (this.actionType === 'edit') {
        Object.entries(this.formModel).forEach(([key, value]) => {
          obj[key] = val[key] || ''
        })
        this.formModel = {
          ...obj
        }
        this.filesList = obj.voucherUrl
          ? [
              {
                uid: Date.now(),
                url: obj.voucherUrl
              }
            ]
          : []
      }
    },
    afterClose() {
      this.formModel = { ...initFormModel }
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      const params = {
        id: this.data.id,
        ...val,
        voucherUrl: this.formModel.voucherUrl
      }
      try {
        await moneyAgree(params)
        this.$emit('input', false)
        this.$message.success('汇款确认成功')
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    },
    handleChange(list = []) {
      console.log(list)
      this.formModel.voucherUrl = list && list.map((item) => item.url).join()
    }
  }
}
</script>

<style lang="less" scoped>
.money-form {
  /deep/.ant-form-item-label {
    min-width: 80px;
  }
}
</style>
