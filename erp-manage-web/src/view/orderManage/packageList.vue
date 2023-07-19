<template>
  <div
    ref="container"
    class="wrapper"
  >
    <div
      ref="filters"
      class="filters"
    >
      <TableFilter
        :col-item="colItem"
        :form-model="formModel"
        @submit="handleSearch"
        @reset="reset"
      />
    </div>
    <div
      ref="filters"
      class="filters"
    >
      <div class="state-list">
        <a-space>
          <a-button
            :type="formModel.searchType === 1 ? 'primary' : ''"
            @click="changeState(1)"
          >已出库</a-button>
          <a-button
            :type="formModel.searchType === 2 ? 'primary' : ''"
            @click="changeState(2)"
          >未出库</a-button>
        </a-space>
        <a-button
          class="btn-right"
          type="primary"
          @click="exportData()"
        >导出数据</a-button>
      </div>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => index"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #isInvita="text">
        <p v-if="text">是</p>
        <p v-else>否</p>
      </template>
    </a-table>
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import {
  getForwarderPackageList,
  downloadMgForwarderPackageList
} from '@/api/account'
import { getForwarderListAll } from '@/api/accountManage'
import { download, debounce, setTableHeight } from '@/utils'
import moment from 'moment'
import colmnsObj from './packageListColmuns'

export default {
  name: 'TakeAccount',
  components: {
    TableFilter
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}条`
      },
      formModel: {
        searchType: 1,
        deliveredTimeArr: [moment().subtract(1, 'month'), moment()],
        startTimeArr: []
      },
      tableHeight: 40,
      data: [],
      forwarderList: []
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '货代商',
          itemType: 'select',
          key: 'forwarderInfoId',
          itemData: this.forwarderList.map((v) => {
            return {
              label: v.forwarderName,
              value: v.id
            }
          })
        },
        {
          label: '订单号',
          itemType: 'input',
          key: 'platformOrderNo',
          placeholder: '请输入订单号'
        },
        {
          label: '手机号',
          itemType: 'input',
          key: 'maAccount',
          placeholder: '请输入手机号'
        },
        {
          label: '出库时间段',
          itemType: 'rangePicker',
          key: 'deliveredTimeArr',
          itemProp: {
            disabledDate(val) {
              return val && val > moment().endOf('day')
            }
          }
        },
        {
          label: '代打包时间段',
          itemType: 'rangePicker',
          key: 'startTimeArr',
          itemProp: {
            disabledDate(val) {
              return val && val > moment().endOf('day')
            }
          }
        }
      ]
    },
    columns() {
      return colmnsObj[this.formModel.searchType]
    }
  },
  created() {
    this.getForwarderListAll()
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
    reset() {
      this.formModel = {
        searchType: 1,
        deliveredTimeArr: [moment().subtract(1, 'month'), moment()],
        startTimeArr: []
      }
    },
    handleSearch() {
      this.getList()
    },
    async getList() {
      try {
        const { data } = await getForwarderPackageList(this.getParams())
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    async getForwarderListAll() {
      try {
        const { data } = await getForwarderListAll({})
        this.forwarderList = data || []
      } catch (error) {
        console.error(error)
      }
    },
    async exportData() {
      try {
        const result = await downloadMgForwarderPackageList(this.getParams())
        download(result, '代打包订单列表')
        this.$message.success('导出成功')
      } catch (error) {
        console.error(error)
      }
    },
    getParams() {
      let dateParams = {}
      if (this.formModel.deliveredTimeArr.length > 0) {
        dateParams.deliveredTimeStartTime = moment(
          this.formModel.deliveredTimeArr[0]
        ).format('YYYY-MM-DD HH:mm:ss')
        dateParams.deliveredTimeEndTime = moment(
          this.formModel.deliveredTimeArr[1]
        ).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.formModel.startTimeArr.length > 0) {
        dateParams.startTime = moment(this.formModel.startTimeArr[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        dateParams.endTime = moment(this.formModel.startTimeArr[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
      const params = Object.assign(
        {},
        {
          current: this.pagination.current,
          size: this.pagination.pageSize
        },
        this.formModel,
        dateParams
      )
      return params
    },
    changeState(type) {
      this.formModel.searchType = type
      this.getList()
    },
    onChange(pagination) {
      this.pagination = pagination
      this.getList()
    },
    async setTableHeight(e) {
      setTableHeight(this)
    }
  }
}
</script>

<style lang="less" scoped>
.state-list {
  padding: 15px 0;
  .btn-right {
    float: right;
  }
}
</style>
