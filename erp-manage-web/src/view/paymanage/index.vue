<template>
  <div ref="container" class="wrapper">
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => index"
      :scroll="{ y: tableHeight }"
    >
      <template #channel="text">
        <span v-if="text === 'aliPay'">阿里支付</span>
        <span v-if="text === 'wxPay'">微信支付</span>
        <span v-if="text === 'xsPay'">新生支付</span>
      </template>

      <template #applyPort="text">
        <span v-for="(li, index) of (text || '').split(',')" :key="index">
          {{ ApplyPort[li] }}、
        </span>
      </template>

      <template #status="text">
        <span v-if="text === 1">启用</span>
        <span v-if="text === 0">停用</span>
      </template>

      <template #updateInfo="text,record">
        <p style="margin:10px 0 0 0">{{ record.updateBy }}</p>
        <p>{{ record.updateTime }}</p>
      </template>

      <template #action="text,record">
        <span
          v-if="orderStatus === 0"
          class="action-button"
          @click="handleAction('visible', record)"
        >
          编辑
        </span>
      </template>
    </a-table>
    <!-- 编辑 -->
    <EditConfig v-model="visible" :data="currentObj" @ok="getList" />
  </div>
</template>

<script>
import EditConfig from './components/EditConfig'
import { getPayConfigList } from '@/api/payManage'
import { debounce, setTableHeight } from '@/utils'
const initFormModel = {
  // memberAccount: ''
}
export default {
  name: 'TakeAccount',
  components: {
    EditConfig
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      selectedRowKeys: [],
      tableHeight: 400,
      params: {},
      visible: false,
      refuseVisible: false,
      detailVisible: false,
      data: [],
      actionType: '',
      formModel: {},
      title: '',
      currentObj: {},
      activeKey: 0,
      orderStatus: 0,
      ApplyPort: {
        pc: 'PC端',
        H5: 'H5',
        official_account: '公众号',
        applet: '小程序',
        app: 'app'
      }
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '支付方式名称',
          dataIndex: 'name'
        },
        {
          title: '介绍',
          dataIndex: 'introduce'
        },
        {
          title: '渠道选择',
          dataIndex: 'channel',
          scopedSlots: { customRender: 'channel' }
        },
        {
          title: '适用端口',
          dataIndex: 'applyPort',
          scopedSlots: { customRender: 'applyPort' }
        },
        {
          title: '是否启用',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '操作人/时间',
          dataIndex: 'updateInfo',
          scopedSlots: { customRender: 'updateInfo' }
        },
        {
          title: '操作',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    async setTableHeight(e) {
      setTableHeight(this)
    },
    async getList() {
      try {
        const { data } = await getPayConfigList({})
        this.data = data || []
      } catch (error) {
        console.error(error)
      }
    },
    handleSearch() {
      this.resetParams()
      this.getList()
    },
    reset() {
      this.formModel = { ...initFormModel }
    },
    handleClick(item) {
      this.resetParams()
      this.reset()
      this.orderStatus = item.value
      this.getList()
    },
    handleAction(key, record) {
      this[key] = true
      this.currentObj = record
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .filters {
    padding-bottom: 12px;
  }
  .button-group {
    & > button:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
