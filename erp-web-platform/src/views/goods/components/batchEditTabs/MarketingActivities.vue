<template>
  <div class="me-marketing">
      <!-- <a-input-search
            class="me-search-activity"
            v-model="searchVal"
            placeholder="输入活动名称搜索"
            :enter-button="$t('common.search')"
            allowClear
            @search="shelfSearch"
          /> -->
      <a-tabs
        :default-active-key="activeKey"
        :tab-position="mode"
        :style="{ height: '200px'}"
        @change="MAChange"
        :animated="false"
      >
        <a-tab-pane
          v-for="(n, index) in statusOpts"
          :key="index"
          :tab="n.label"
        ></a-tab-pane>
      </a-tabs>
     
    <div class="me-card">
      <a-table
        class="me-shelf-list"
        :columns="columns"
        :data-source="dataSource"
        rowKey="discountId"
        :pagination="false"
        
        :loading="tableLoading"
      >
        
        <template slot="handler" slot-scope="text, record">
          <a-button type="link" @click="selectActive(record)">
            {{$t('toBeEdit.selectA')}}
            
          </a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import Goods from '@/api/goods'
export default {
  props:{
    currActive:{
      type:Function,
      default:null
    },
    storeId:{
      type:Number,
      default:null
    }
  },
  data() {
    return {
      mode: 'top',
      activeKey: 0,
      statusOpts: [
        {label:this.$t('discount.acting')},
        {label:this.$t('discount.nextAct')}
      ],


      
      searchVal: '',
      columns: [
        {
          title: this.$t('discount.actName'),
          dataIndex: 'discountName',
        },
        { title: this.$t('common.startTime'), dataIndex: 'startTime' },
        { title: this.$t('common.endTime'), dataIndex: 'endTime' },
        
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      dataSource:[],
      tableLoading:false
    }
  },
  created(){
    this.getTableData()
  },
  methods: {
    // //货架名称搜索
    // shelfSearch(val) {
    //   // this.$set(this.$data.paginationData, 'shelvesName', val)
    //   // this.reLoadData()
    // },
    //切换状态
    MAChange(val) {
      this.$data.activeKey = val
      this.getTableData()
    },
    //获取活动列表
    async getTableData() {
    this.$data.tableLoading = true
    this.$data.dataSource = []
      let { data } = await Goods.getDiscountList({
        status: this.$data.activeKey+1,
        storeId:this.$props.storeId,
      })
      this.$data.dataSource = data
      this.$data.tableLoading = false
    },
    //选择
    selectActive(row) {
      this.currActive(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-marketing {
  position: relative;
  ::v-deep .ant-tabs {
    height: 55px !important;
  }
}
.me-search-activity{
  position:absolute;
  width: 300px;
  top:5px;
  right:0px;
  z-index: 100;
}
</style>
