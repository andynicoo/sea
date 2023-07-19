<template>
  <div ref="container">
    <div class="wrapper g-mb10">
      <a-space>
        <div class="infobox">
          <h2>
            订单额总额
            <span> 今日订单总额 </span>
          </h2>
          <h3>
            {{ orderInfo.orderTotal || '-' }}
            <span>{{ orderInfo.currentOrderTotal || '-' }}</span>
          </h3>
        </div>
        <div class="infobox">
          <h2>
            订单数
            <span> 今日订单数 </span>
          </h2>
          <h3>
            {{ orderInfo.orderNumTotal || '-' }}
            <span>{{ orderInfo.currentNumTotal || '-' }}</span>
          </h3>
        </div>
      </a-space>
    </div>
    <div class="wrapper g-mb10">
      <div class="g-mb10">
        <a-space>
          支付时间:
          <a-range-picker
            v-model="formModel.selectTime"
            :show-time="{ format: 'HH:mm:ss' }"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
          筛选条件:
          <a-cascader
            v-model="formModel.condition"
            :options="options"
            placeholder="请选择"
          />
        </a-space>
      </div>
      <a-space>
        <a-button @click="resetAndSearch"> 清空 </a-button>
        <a-button type="primary" @click="getList"> 确定 </a-button>
      </a-space>
    </div>
    <div class="wrapper g-mb15">
      <div ref="filters" class="filters">
        <div class="button-group">
          <a-button
            v-for="item in btnList"
            :key="item.value"
            :type="orderStatus === item.value ? 'primary' : ''"
            @click="handleClick(item)"
            >{{ item.label }}</a-button
          >
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
        <template #id="text, record">
          {{ record.discountAmount }}
        </template>
        <template #orderType="text, record">
          <!-- 预留，可能有套餐退订和手动退订的类型 -->
          {{
            orderStatus === 3
              ? record.orderType
                ? '套餐退订'
                : '--'
              : record.orderType === 1
              ? '乐聊套餐'
              : 'erp套餐'
          }}
        </template>
        <template #orderStatus="text">
          {{ orderStatusMap[text] }}
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
// import TableFilter from '@/components/tableFilter'
import { getOrderList, getOrderTotal, getOrderCondition } from '@/api/account'
import { debounce, setTableHeight } from '@/utils'
import moment from 'moment'
import colmnsObj from './colmuns'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  // memberAccount: ''
  selectTime: [],
  condition: []
}
export default {
  name: 'TakeAccount',
  components: {
    // TableFilter,
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}条`
      },
      tableHeight: 400,
      params: {},
      paginationParams: {
        ...initPagination
      },
      data: [],
      actionType: '',
      formModel: {
        selectTime: [],
        condition: []
      },
      title: '',
      currentObj: {},
      activeKey: 0,
      btnList: [
        // {
        //   label: '未付款',
        //   value: 0
        // },
        {
          label: '已付款',
          value: 1
        },
        {
          label: '退订',
          value: 3
        }
      ],
      orderStatus: 1,
      orderStatusMap: {
        0: '待付款',
        1: '已付款',
        2: '已取消',
        3: '退款中',
        4: '已退款',
        5: '退款失败',
        6: '待结算'
      },
      orderInfo: {},
      options: [
        {
          value: 'zhifu',
          label: '支付渠道',
          children: []
        },
        {
          value: 'taocan',
          label: '套餐类型',
          children: []
        }
      ] // 筛选条件
    }
  },
  computed: {
    // colItem() {
    //   return [
    //     {
    //       slotName: 'orderStatus',
    //       key: 'orderStatus'
    //     },
    //     {
    //       label: '创建时间',
    //       itemType: 'rangePicker',
    //       key: 'applyTime',
    //       itemProp: {
    //         disabledDate(val) {
    //           return val && val > moment().endOf('day')
    //         }
    //       }
    //     }
    //   ]
    // },
    columns() {
      console.log(this.orderStatus)
      return colmnsObj[this.orderStatus]
    }
  },
  created() {
    this.getList()
    this.getOptionsData()
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    // 倒计时
    countDown() {
      this.data.forEach((item) => {
        if (item.applyTime) {
          let addTime = 86400000
          let d = 0
          let nowTime = parseInt(moment(new Date()).format('x'))
          let lastTime = parseInt(moment(item.applyTime).format('x')) + addTime
          if (lastTime - nowTime > 0) {
            d = moment.duration((lastTime - nowTime) / 1000, 'seconds')
            item.remainingTime = `${d.hours()}时${d.minutes()}分${d.seconds()}秒`
          } else {
            item.remainingTime = `0时0分0秒`
          }
        }
      })
    },
    async setTableHeight(e) {
      setTableHeight(this)
    },
    formattime(time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return time
      }
    },
    async getList() {
      let params = Object.assign(
        { orderStatus: this.orderStatus },
        this.paginationParams,
        this.formModel,
        this.params,
        {
          startTime: this.formModel.selectTime.length
            ? this.formModel.selectTime[0]
            : null,
          endTime: this.formModel.selectTime.length
            ? this.formModel.selectTime[1]
            : null
        }
      )
      if (
        this.formModel.condition.length &&
        this.formModel.condition[0] === 'zhifu'
      ) {
        params.payChannel = this.getConditionValue()
      }
      if (
        this.formModel.condition.length &&
        this.formModel.condition[0] === 'taocan'
      ) {
        params.setMealType = this.getConditionValue()
      }
      try {
        const { data } = await getOrderList(params)
        this.data = data?.records || []
        this.data.map((el) => {
          this.$set(el, 'remainingTime', '')
        })
        this.pagination.total = data?.total || 0
        clearInterval(this.timeInterAfterSale) // 售后倒计时
        this.countDown()
        this.timeInterAfterSale = setInterval(() => this.countDown(), 1000)
      } catch (error) {
        console.error(error)
      }
      this.getOrderTotal()
    },
    async getOptionsData() {
      const { data } = await getOrderCondition({})
      this.options[0].children = this.transData(data.payChannel) || []
      this.options[1].children = this.transData(data.setMealType) || []
    },
    transData(data) {
      let temp = []
      data.map((ele) => {
        temp.push({
          value: ele.id,
          label: ele.value
        })
      })
      return temp
    },
    getConditionValue() {
      let temp = null
      if (this.formModel.condition.length) {
        temp = this.formModel.condition[1]
      }
      return temp
    },
    async getOrderTotal() {
      const { data } = await getOrderTotal({})
      this.orderInfo = data
    },
    resetAndSearch() {
      this.reset()
      this.getList()
    },
    onChange(pagination, filters, sorter) {
      this.pagination = { ...pagination }
      const { current, pageSize: size } = pagination
      const { field, order } = sorter
      this.paginationParams = { current, size }
      const orderObj = {
        ascend: 'asc',
        descend: 'desc'
      }
      this.params = {
        field,
        order: orderObj[order]
      }
      this.getList()
    },
    handleSearch() {
      this.resetParams()
      this.getList()
    },
    resetParams() {
      this.paginationParams = { ...initPagination }
      this.pagination.current = 1
      this.pagination.pageSize = 10
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
  border-radius: 3px;
  padding: 16px;
  .filters {
    padding-bottom: 12px;
  }
  .button-group {
    & > button:not(:last-child) {
      margin-right: 10px;
    }
  }
  .infobox {
    width: 240px;
    background: #efefef;
    padding: 12px;
    h2 {
      font-size: 16px;
      span {
        font-size: 14px;
        float: right;
      }
    }
    h3 {
      font-size: 16px;
      span {
        float: right;
      }
    }
  }
}
</style>
