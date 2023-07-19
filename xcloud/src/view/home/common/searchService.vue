<template>
  <div :style="contentStyleObj"
       class="content home-list">
    <p class="home-list-title">服务查询结果</p>
    <Table :data="data"
           :columns="columns"
           border></Table>
    <div class="page-info">
      <Page @on-change="changePageHandler"
            @on-page-size-change="handlePageSize"
            :current="pageInfo.page"
            :total="listTotal"
            :page-size="pageInfo.limit"
            show-total
            show-elevator
            show-sizer />
    </div>
  </div>
</template>
<script>
import '@/assets/style/common.css'
import { getTaxCountry } from '@/api/taxService/common.js';
export default {
  data() {
    return {
      contentStyleObj: {
        height: ""
      },
      searchForm: {},
      countryList: [],
      data: [
        {}
      ],
      columns: [
        {
          title: '订单号',
          align: 'center'
        },
        {
          title: '用户账号',
          align: 'center'
        },
        {
          title: '国家',
          align: 'center'
        },
        {
          title: '服务名称',
          align: 'center'
        },
        {
          title: '客户手机号',
          align: 'center'
        },
        {
          title: '服务进度',
          align: 'center'
        },
        {
          title: '进度记录',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center'
        },
      ],
      listTotal: 0,
      pageInfo: {
        page: 1,
        limit: 10
      }
    }
  },
  methods: {
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    //翻页
    changePageHandler(page) {

    },
    //调整页数
    handlePageSize(limit) {

    }
  },
  mounted() {
    this.contentStyleObj.height = window.screen.height - 200 + "px";
    this.getCountryList()
  },
}
</script>
<style lang="less" scoped>
.content {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}
</style>


