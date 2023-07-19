<template>
  <div class="invoiceList">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem label="渠道"
                  :label-width="40">
          <Input v-model="searchForm.findContent"
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
                      v-model="searchForm.endDate"
                      @on-change="endDate"
                      placeholder="结束日期"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <form-components @getList="getList"
                         :tableLoading="tableLoading"
                         :tableData="tableData"
                         :columns="columns"
                         :pageInfo="pageInfo"
                         :listTotal="listTotal">
          <div slot="title"
               class="tabs">
            <span>
              累计成交用户 {{statistical.paidCount}} 人
            </span>
            <span>
              累计成交金额：{{statistical.orderMoney}}
            </span>
            <span>
              待结算：{{statistical.noSettlementOrderMoney}}
            </span>
            <span>
              已结算：{{statistical.settlementOrderMoney}}
            </span>
          </div>
        </form-components>
      </div>
    </div>
    <div v-else>
      <channelDetail @back="back"
                     :channelId="channelId"></channelDetail>
    </div>
  </div>
</template>
<script>
import * as API from '@/api/taxService/adv.js'
import formComponents from "./components/formComponents"
import channelDetail from "./components/channelDetail"
import { channelList } from "@/api/taxService/channel.js";
import cacheQuery from '@/mixins/cacheQuery'
export default {
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      searchForm: {
        findContent: '',
        beginTime: '',
        endTime: '',
      },
      cacheKey: 'searchForm',
      copyListQuery: {},
      channelId: '',
      date: '',
      pageInfo: {
        limit: 10,
        page: 1,
      },
      statistical: {
        paidCount: 0,
        orderMoney: 0,
        noSettlementOrderMoney: 0,
        settlementOrderMoney: 0
      },
      listTotal: 0,
      tableLoading: false,
      columns: [
        {
          title: '渠道ID',
          key: 'id',
          width: 80
        },
        {
          title: '渠道名称',
          key: 'channelName',
          minWidth: 50,
        },
        {
          title: '渠道登录账户',
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
          title: '浏览量',
          key: 'pvCount'
        },
        {
          title: '浏览用户数',
          key: 'uvCount'
        },
        {
          title: '注册用户数',
          key: 'registerCount'
        },
        {
          title: '成交用户数',
          key: 'paidCount'
        },
        {
          title: '成交金额',
          key: 'orderMoney'
        },
        {
          title: '待结算',
          key: 'noSettlementOrderMoney'
        },
        {
          title: '已结算',
          key: 'settlementOrderMoney'
        },
        {
          title: '渠道经理',
          key: 'channelManager'
        },
        {
          title: '操作',
          key: 'operate',
          width: 100,
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
    this.getChannelList();
  },
  components: {
    formComponents,
    channelDetail,
  },
  methods: {
    startDate(val) {
      this.searchForm.beginTime = val
    },
    endDate(val) {
      this.searchForm.endTime = val
    },
    getList(pageInfo) {
      this.pageInfo = pageInfo
      this.getChannelList()
    },
    detailShow(id) {
      this.channelId = id
      this.isDetailShow = true
    },
    //获取列表
    getChannelList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      this.setPageCache()
      channelList(params).then((res) => {
        if (res.code == 0) {
          this.tableLoading = false;
          this.tableData = res.data.channelPage.records;
          this.listTotal = Number(res.data.channelPage.total);
          this.statistical.paidCount = res.data.channelListStatisticsVo.sumPaidCount
          this.statistical.orderMoney = res.data.channelListStatisticsVo.sumPayMoney
          this.statistical.noSettlementOrderMoney = res.data.channelListStatisticsVo.sumNoSettlementOrderMoney
          this.statistical.settlementOrderMoney = res.data.channelListStatisticsVo.sumSettlementOrderMoney
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getChannelList()
    },
    //重置列表
    resetList() {
      // this.searchForm = {
      //   findContent: '',
      //   beginTime: '',
      //   endTime: '',
      // };
      this.searchForm = {...this.copyListQuery}
      this.removePageCache()
      this.pageInfo.page = 1;
      this.getChannelList()
    },
    back() {
      this.isDetailShow = false
    },
  }
}
</script>
<style lang="less" scoped>
.invoiceList {
  background: #ffffff;
  min-height: 100vh;
  padding: 20px;
  .tableArea {
    .tabs {
      span {
        margin-right: 20px;
        font-weight: bold;
      }
    }
    .operateBtn {
      cursor: pointer;
    }
  }
}
.ruleBox {
  /deep/ .ivu-row {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  /deep/ .ivu-col {
    padding: 0px 10px;
  }
  .inline {
    display: flex;
    align-items: center;
    .line-width {
      width: 80px;
    }
  }
}
</style>