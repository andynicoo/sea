<template>
  <a-modal
    :visible="value"
    :after-close="afterClose"
    :closable="false"
    @ok="$emit('input', false)"
    @cancel="$emit('input', false)"
  >
    <SearchLabel :label-item="labelItem" :data="data" label-min-width="72px" />
  </a-modal>
</template>

<script>
import SearchLabel from '@/components/searchLabel'
const loadingImg = require('@/assets/loading-img.png')
export default {
  components: {
    SearchLabel
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    orderStatus: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {
    labelItem() {
      const obj = {
        0: [],
        1: [
          {
            label: '拒绝原因',
            dataIndex: 'refuseReason'
          }
        ],
        2: [
          {
            label: '汇款金额',
            dataIndex: 'withdrawMoneyAmount'
          },
          {
            label: '汇款凭证',
            dataIndex: 'voucherUrl',
            render: (h, { text }) => (
              <img src={text || loadingImg} height="70" />
            )
          }
        ],
        3: []
      }
      return [
        {
          label: '银行',
          dataIndex: 'receiveBank'
        },
        {
          label: '开户行',
          dataIndex: 'receiveSubbranch'
        },
        {
          label: '开户人',
          dataIndex: 'receivePayee'
        },
        {
          label: '卡号',
          dataIndex: 'receiveBankCard'
        },
        {
          label: '发票',
          dataIndex: 'invoiceUrl',
          render: (h, { text }) => <img src={text || loadingImg} height="70" />
        },
        ...obj[this.orderStatus]
      ]
    }
  },
  watch: {},
  methods: {
    async ok() {
      this.$refs.searchForm.validate()
    },
    afterClose() {}
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
