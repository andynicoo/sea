<template>
  <a-modal
    title="新增退款"
    :visible="value"
    :width="700"
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
      <template #payPassword>
        <a-input
          v-model="formModel.payPassword"
          placeholder="请输入支付密码"
          type="password"
          autocomplete="off"
        />
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { returnRechargeMoney } from '@/api/payManage'

export default {
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formModel: {}
    }
  },
  computed: {
    formItem({ data }) {
      let arr = [
        {
          title: '订单信息',
          span: 24
        },
        {
          label: '订单号',
          span: 12,
          render: () => {
            return <span>{data.rechargeOrderNo}</span>
          }
        },
        {
          label: '支付时间',
          span: 12,
          render: () => {
            return <span>{data.paySuccessTime}</span>
          }
        },
        {
          label: '手机号',
          span: 12,
          render: () => {
            return <span>{data.account}</span>
          }
        },
        {
          label: '支付状态',
          span: 12,
          render: () => {
            return <span>{data.orderStatusDisplay}</span>
          }
        },
        {
          title: '退款信息',
          span: 24
        },
        {
          label: '支付金额',
          span: 12,
          render: () => {
            return <span>{data.payAmount}元</span>
          }
        },
        {
          label: '支付渠道',
          span: 12,
          render: () => {
            return <span>{data.payChannelDisplay}</span>
          }
        },
        {
          label: '可退金额',
          span: 12,
          render: () => {
            return (
              <span style="color:red">
                {(
                  Number(data.payAmount || 0) -
                  Number(data.sumReturnAmount || 0)
                ).toFixed(2)}
              </span>
            )
          }
        },
        {
          label: '支付方式',
          span: 12,
          render: () => {
            return <span>{data.payWayDisplay}</span>
          }
        },
        {
          itemType: 'number',
          key: 'returnAmount',
          required: true,
          label: '退款金额',
          itemProp: {
            min: 0,
            max:
              Number(data.payAmount || 0) - Number(data.sumReturnAmount || 0),
            precision: 2,
            style: 'width:100%'
          },
          span: 24
        },
        {
          itemType: 'input',
          key: 'payPassword',
          required: true,
          slotName: 'payPassword',
          label: '支付密码',
          itemProp: {
            style: 'width:100%'
          },
          span: 24
        },
        {
          itemType: 'textarea',
          key: 'remark',
          label: '备注',
          span: 24,
          itemProp: {
            showCount: true,
            maxLength: 50,
            style: 'width:100%'
          }
        }
      ]
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
      this.formModel = {
        rechargeOrderId: this.data.id,
        returnAmount: null,
        payPassword: null,
        remark: null
      }
    },
    afterClose() {
      this.formModel = {}
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      try {
        let params = JSON.parse(JSON.stringify(this.formModel))
        console.log(params)
        await returnRechargeMoney(params)
        this.$emit('input', false)
        this.$message.success('操作成功')
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
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
