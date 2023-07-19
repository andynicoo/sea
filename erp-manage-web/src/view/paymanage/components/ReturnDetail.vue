<template>
  <a-modal
    title="退款明细"
    :visible="value"
    :width="700"
    :closable="false"
  >
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="data.returnList || []"
      row-key="id"
    >
      <template #status="text,record">
        <span v-if="record.status === 1"> 退款中 </span>
        <span v-if="record.status === 2"> 退款成功 </span>
        <span v-if="record.status === 3"> 退款失败 </span>
      </template>

      <template #action="text,record">
        <span
          v-if="record.status === 1"
          class="action-button"
          @click="synchronization(record)"
        >
          同步
        </span>
      </template>
    </a-table>
    <template #footer>
      <a-button
        type="primary"
        @click="$emit('input', false)"
      >关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
import { searchReturnRecharge } from '@/api/payManage'

export default {
  components: {},
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
    columns() {
      return [
        {
          title: '退款时间',
          dataIndex: 'returnTime'
        },
        {
          title: '退款金额(元)',
          dataIndex: 'returnAmount'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: {
            customRender: 'status'
          }
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作人',
          dataIndex: 'updateBy'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },
  created() {},
  methods: {
    async synchronization(li) {
      try {
        await searchReturnRecharge({
          returnRechargeId: li.id
        })
        this.$emit('input', false)
        this.$message.success('操作成功')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
