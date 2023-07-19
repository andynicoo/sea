<template>
  <div class="orderListWrapper">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.searchContent"
                 clearable
                 placeholder="请输入手机号/订单号/服务公司"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <DatePicker v-model="date"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange"
                      placeholder="订单创建时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.orderSource"
                  placeholder="渠道来源">
            <Option value="0">PC网页端</Option>
            <!-- <Option value="1">微信小程序</Option> -->
            <Option value="2">H5</Option>
            <Option value="3">录入订单</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.orderBusinessSource"
                  placeholder="订单来源">
            <Option value="1">必胜道</Option>
            <Option value="2">卖家成长</Option>
            <Option value="3">跨标云</Option>
          </Select>
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
        <Tabs :value="searchForm.status"
              :animated="false"
              @on-click="tabsChange">
          <TabPane label="全部订单"
                   name="-1"></TabPane>
          <TabPane label="待审核"
                   name="0"></TabPane>
          <TabPane label="待退款"
                   name="1"></TabPane>
          <TabPane label="已退款"
                   name="2"></TabPane>
          <TabPane label="审核不通过"
                   name="3"></TabPane>
        </Tabs>
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="status"
                    slot-scope="{ row }">
            <span>{{row.status == '0' ? "待审核" : row.status == '1' ? "待退款" : row.status == '2' ? "已退款" : row.status == '3' ? "审核不通过" : ""}}</span>
          </template>
          <template slot="operate"
                    slot-scope="{ row }">
            <Button ghost
                    type="info"
                    v-show="hasAuthority('order_refund01')"
                    @click="toDetail(row)">查看</Button>
            <Button ghost
                    type="info"
                    v-show="hasAuthority('order_refund02')"
                    v-if="row.status === 0"
                    @click="auditFun(row.id)">审核</Button>
            <Button ghost
                    type="info"
                    v-show="hasAuthority('order_refund03')"
                    v-if="row.status === 1"
                    @click="refundFun(row)">确认退款</Button>
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.limit"
              show-total
              show-elevator />
      </div>
    </div>
    <refundDetail v-if="isDetailShow"
                  :rowInfo='rowInfo'
                  @back="backFun"
                  @refresh="refreshList"></refundDetail>
    <auditMedal v-if="isAuditMedalShow"
                @changeState="auditMedalFun"
                :refundId="refundId"
                @refresh="refreshList"></auditMedal>
    <refundMedal v-if="isRefundMedalShow"
                 @changeState="auditMedalFun"
                 :refundInfo="refundInfo"
                 @refresh="refreshList"></refundMedal>
  </div>
</template>
<script>
import refundDetail from "./components/refundDetail";
import auditMedal from "./components/auditMedal"
import refundMedal from "./components/refundMedal"
import * as API from '@/api/iipto/order.js';
export default {
  name: 'orderList',
  components: {
    refundDetail,
    auditMedal,
    refundMedal
  },
  data() {
    return {
      isDetailShow: false,
      isAuditMedalShow: false,
      isRefundMedalShow: false,
      searchForm: {
        searchContent: '',
        createEndDate: '',
        createStartDate: '',
        status: -1,
      },
      date: '',
      countryList: [],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      tableLoading: false,
      row: '',
      columns: [
        {
          type: 'index',
          width: 50
        },
        {
          title: '售后单号',
          key: 'refundNo',
          minWidth: 80,
        },
        {
          title: '订单号',
          key: 'orderNo',
          minWidth: 80,
        },
        {
          title: '申请时间',
          key: 'createTime'
        },
        {
          title: '用户账号',
          key: 'userMobile'
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '服务名称',
          // key: 'productNames',
          render(h, params) {
            let productNames = params.row.productNames.split(';')
            return h('div',
              productNames.map(function (type) {
                return h('div', {
                }, type);
              })
            );
          },
        },
        {
          title: '服务金额',
          key: 'orderMoney'
        },
        {
          title: '已付金额',
          key: 'amountMoney'
        },
        {
          title: '退款金额',
          key: 'refundMoney'
        },
        {
          title: '退款状态',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      allAmountMoney: 0,
      allDiscAmount: 0,
      allOrderMoney: 0,
      allOrderOldMoney: 0,
      tableData: [],
      refundInfo: {}
    }
  },
  mounted() {
    this.getOrderList();
  },
  methods: {
    //订单创建时间
    dateChange(date) {
      this.searchForm.createStartDate = date[0];
      this.searchForm.createEndDate = date[1];
    },
    //选择tab状态
    tabsChange(name) {
      this.searchForm.status = name;
      this.getOrderList();
    },
    //获取列表
    getOrderList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.getRefundList(params).then((res) => {
        if (res.code == 0) {
          // console.log(res.data.records)
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
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
      this.searchForm.status = '-1';
      this.getOrderList()
    },
    //重置列表
    resetList() {
      this.searchForm = {};
      this.date = "";
      this.pageInfo.page = 1;
      this.searchForm.status = -1;

      this.getOrderList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getOrderList()
    },
    //查看详情
    toDetail(row) {
      this.isDetailShow = true;
      this.rowInfo = row;
    },
    //确认到账操作
    refundFun(row) {
      this.isRefundMedalShow = true
      this.refundInfo = row
    },
    refreshList() {
      this.isAuditMedalShow = false
      this.isRefundMedalShow = false
      this.getOrderList()
    },
    auditMedalFun(obj) {
      this.isAuditMedalShow = obj.state
      this.isRefundMedalShow = obj.state
    },
    backFun() {
      this.isDetailShow = false
      this.getOrderList()
    },
    // 审核弹窗
    auditFun(id) {
      this.isAuditMedalShow = true
      this.refundId = id
    }
  }
}
</script>
<style lang="less" scoped>
.orderListWrapper {
}
.money {
  .statistical {
    padding-left: 17px;
    font-size: 14px;
    margin-bottom: 30px;
  }
}
</style>