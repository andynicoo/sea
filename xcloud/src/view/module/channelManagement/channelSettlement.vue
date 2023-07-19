<template>
  <div class="invoiceList">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem label="渠道"
                  :label-width="40">
          <Input v-model="searchForm.searchContent"
                 style="width: 200px"
                 placeholder="渠道名称/登录账号"></Input>
        </FormItem>
        <FormItem label="申请时间"
                  :label-width="80">
          <DatePicker type="date"
                      @on-change="startDate"
                      v-model="searchForm.beginTime"
                      placeholder="开始日期"
                      style="width: 200px"></DatePicker>
          <span style="padding:0px 10px;">
            至
          </span>
          <DatePicker type="date"
                      @on-change="endDate"
                      v-model="searchForm.endTime"
                      placeholder="结束日期"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList('searchForm')">重置</Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <form-components @getList="getList"
                         :tableLoading="tableLoading"
                         :tableData="tableData"
                         :columns="columns"
                         :listTotal="tableData.length">
          <div slot="title">
            <Tabs class="tabs"
                  :value="searchForm.status"
                  :animated="false"
                  @on-click="tabsChange">
              <TabPane label="全部"
                       name="-1"></TabPane>
              <TabPane label="待审核"
                       name="1"></TabPane>
              <TabPane label="结算中"
                       name="2"></TabPane>
              <TabPane label="已结算"
                       name="3"></TabPane>
              <TabPane label="审核不通过"
                       name="4"></TabPane>
            </Tabs>
          </div>
        </form-components>
      </div>
    </div>
    <div v-else>
      <settlementDetail @back="back"
                        :id="detailId"></settlementDetail>
    </div>
  </div>
</template>
<script>
import * as API from '@/api/taxService/adv.js'
import formComponents from "./components/formComponents"
import settlementDetail from "./components/settlementDetail"
import { channelClearingList } from "@/api/taxService/channel.js"
import cacheQuery from '@/mixins/cacheQuery'
export default {
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      advModal: false,
      modalName: '',
      searchForm: {
        searchContent: '',
        beginTime: '',
        endTime: '',
        status: '-1',
        limit: 10,
        page: 1
      },
      cacheKey: 'searchForm',
      copyListQuery: {},
      detailId: '',
      tableLoading: false,
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 50
        },
        {
          title: '渠道名称',
          key: 'channelName',
          minWidth: 50,
        },
        {
          title: '渠道登录账号',
          key: 'adminUserName'
        },
        {
          title: '联系人',
          key: 'adminUserNickName'
        },
        {
          title: '联系电话',
          key: 'adminUserMobile'
        },
        {
          title: '申请结算金额',
          key: 'clearingMoney'
        },
        {
          title: '结算状态',
          key: 'status',
          render(h, params) {
            return h('span', params.row.status == 1 ? '待审核' : params.row.status == 2 ? '结算中' : params.row.status == 3 ? '已结算' : params.row.status == 4 ? '审核不通过' : '')
          }
        },
        {
          title: '渠道经理',
          key: 'channelManager'
        },
        {
          title: '操作',
          key: 'operate',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.detailShow(params.row.id)
                  }
                }
              }, '【详情】')
            ])
          }
        }
      ],
      tableData: [],
      id: '',
    }
  },
  mixins: [cacheQuery],
  mounted() {
    this.copyListQuery = {...this.searchForm}
    this.getPageCache()
    this.getchannelList();
  },
  components: {
    formComponents,
    settlementDetail
  },
  methods: {
    startDate(val) {
      this.searchForm.beginTime = val
    },
    endDate(val) {
      this.searchForm.endTime = val
    },
    getList(pageInfo) {
      this.searchForm.page = pageInfo.page
      this.getchannelList()
    },
    detailShow(id) {
      this.detailId = id
      this.isDetailShow = true
    },
    tabsChange(val) {
      this.searchForm.status = val
      this.getchannelList()
    },
    //获取列表
    getchannelList() {
      this.tableLoading = true;
      this.setPageCache()
      channelClearingList(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.tableLoading = false;
          this.tableData = res.data.records;
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList() {
      this.searchForm.page = 1;
      this.getchannelList()
    },
    //重置列表
    resetList(form) {
      // this.$refs[form].resetFields()
      // this.searchForm = {
      //   searchContent: '',
      //   beginTime: '',
      //   endTime: '',
      //   status: '-1',
      //   limit: 10,
      //   page: 1
      // };
      this.searchForm = {...this.copyListQuery}
      this.removePageCache()
      this.getchannelList()
    },
    //分页
    changePageHandler(page) {
      this.searchForm.page = page
      this.getchannelList()
    },
    back() {
      this.isDetailShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.invoiceList {
  background: #ffffff;
  min-height: 100vh;
  padding: 20px;
  .tableArea {
    .operateBtn {
      cursor: pointer;
    }
    .tabs {
      /deep/ .ivu-tabs-bar {
        margin-bottom: 0px;
        padding-bottom: -10px;
        border: none;
      }
    }
  }
}
</style>