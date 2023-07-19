<template>
  <div class="wrapper">
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="data"
      row-key="id"
    >
      <template
        slot="imgs"
        slot-scope="text"
      >
        <div
          class="em-rebate-txt"
          v-html="text"
        />
      </template>

      <template #action="record">
        <span
          v-permission:advertising="['edit']"
          class="action-button"
          @click="handleAction(record)"
        >编辑</span>
      </template>
    </a-table>
    <RebateModal
      v-model="visible"
      :data="currentObj"
      @ok="getList"
    />
  </div>
</template>

<script>
import RebateModal from './components/RebateModal'
import { debounce, setTableHeight } from '@/utils'
import { rebateGet } from '@/api/website'

export default {
  name: 'AdList',
  components: {
    RebateModal
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      visible: false,
      data: [],
      currentObj: {}
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '描述内容',
          dataIndex: 'imgs',
          scopedSlots: {
            customRender: 'imgs'
          }
        },
        {
          title: '上次修改时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          scopedSlots: {
            customRender: 'action'
          }
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
      setTableHeight(this, 61)
    },
    // 获取数据
    async getList() {
      try {
        const { data } = await rebateGet()
        this.data = [data] || []
      } catch (error) {
        console.error(error)
      }
    },
    // 编辑数据
    handleAction(record) {
      this.visible = true
      this.currentObj = record
    }
  }
}
</script>

<style lang="less" scoped>
.em-rebate-txt {
  padding-top: 10px;
  /deep/ img {
    max-width: 200px;
    max-height: 200px;
  }
}
</style>
