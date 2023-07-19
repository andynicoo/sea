<template>
  <div>
    <div class="orderList" v-if="!showOrderDetail">
      <Form class="cateForm" :model="searchForm" inline :label-width="90">
        <FormItem label="输入搜索：" prop="inputStr">
          <Input v-model="searchForm.inputStr" style="width:200px;" placeholder="订单编号/用户账号" clearable />
        </FormItem>
        <FormItem label="收款账户：" prop="payAccount">
          <Select v-model="searchForm.payAccount" style="width:200px;" placeholder="收款账户" label-in-value clearable>
            <Option v-for="(v,i) in payAccountList" :value="v.value" :key="i">{{ v.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="对账方式：" prop="verifyType">
          <Select v-model="searchForm.verifyType" style="width:200px;" clearable>
            <Option v-for="item in verifyTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="创建时间：" prop="createTime">
          <Date-picker v-model="createTime" type="daterange" placeholder="创建时间" @on-change="createTimeChange" style="width: 200px"></Date-picker>
        </FormItem>
        <FormItem prop="name" :label-width="10">
          <Button type="primary" @click="search">查询</Button>
          <Button type="primary" ghost style="margin-left: 10px" @click="clearHandler">重置</Button>
        </FormItem>
      </Form>
      <!-- tab栏 -->
      <div class="tabBar">
        <div class="left">
          <span class="span" v-for="(item,i) in tabList" @click="toggle(item.value)" :class="{'active':tabActive === item.value}">{{item.label}}</span>
        </div>
        <div class="right">
        </div>
      </div>
      <!-- 表格 -->
      <div style="margin-top:20px;">
        <Table border :loading="loading" :columns="columns" :data="tableData" @on-selection-change="selectChange">
          <template slot="operation" slot-scope="{ row,index }">
            <p class="button" style="line-height:25px;" v-show="hasAuthority('orderAccountCheck_look')" @click.stop="goDetails(row,index)">查看</p>
            <p class="button" style="line-height:25px;" v-if="row.reconStatus == 0" v-show="hasAuthority('confirmReceipt')" @click.stop="openConfirmReceipt(row,index)">确认到账</p>
          </template>
          <template slot="paymentFile" slot-scope="{ row,index }">
            <a v-if="row.paymentFile" :href="row.paymentFile" target="_blank">{{row.attachmentsName}}</a>
          </template>
          <template slot="verifyType" slot-scope="{ row,index }">
            <span v-if="row.verifyType == 1">人工对账</span>
            <span v-if="row.verifyType == 2">系统对账</span>
          </template>
          <template slot="reconStatus" slot-scope="{ row,index }">
            <span v-if="row.reconStatus == 0">待对账</span>
            <span v-if="row.reconStatus == 1">已对账</span>
            <span v-if="row.reconStatus == 2">驳回</span>
          </template>
          <template slot="paymentType" slot-scope="{ row,index }">
            <span v-if="row.paymentType == 0">分期</span>
            <span v-if="row.paymentType == 1">全款</span>
          </template>
        </Table>
        <Page class="pagination" @on-page-size-change="pageSizeChangeHandler" @on-change="pageChangeHandler" :current="page" :total="total" :page-size="limit" :page-size-opts="[10, 15, 20, 30]" show-sizer show-total show-elevator />
      </div>
      <!-- 确认到账 -->
      <Modal class="modal" v-model="confirmReceiptModal" width="400" title="确认到账" cancelText :mask-closable="false" :closable="false">
        <Form ref="attrModal" :model="confirmReceiptForm" :label-width="100">
          <FormItem label="到账日期：">
            <Date-picker v-model="gainedDate" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="到账日期" @on-change="gainedDateChange" style="width: 200px"></Date-picker>
          </FormItem>
          <FormItem label="审核状态：">
            <RadioGroup v-model="confirmReceiptForm.flag">
              <Radio label="1" style="margin-right:10px;">通过</Radio>
              <Radio label="2">驳回</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="驳回原因：" v-if="confirmReceiptForm.flag == 2">
            <Select v-model="confirmReceiptForm.rejectReason" style="width:200px;" placeholder="请选择驳回理由" clearable>
              <Option v-for="item in rejectReasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="理由：" v-if="confirmReceiptForm.flag == 2 && confirmReceiptForm.rejectReason == '其他'">
            <Input v-model="confirmReceiptForm.remark" type="textarea" :rows="4" placeholder="请输入备注信息" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="default" @click="confirmReceiptCancel">取消</Button>
          <Button type="primary" :loading="confirmReceiptLoading" @click="confirmReceiptConfirm">确定</Button>
        </div>
      </Modal>
    </div>
    <OrderDetail v-if="showOrderDetail" @getDetailStatus="detailStatusChange" :parentData="childData"></OrderDetail>
  </div>
</template>

<script>
import * as API from "@/api/orderManage/orderList";
import OrderDetail from '@/view/module/taxService/orderManage/components/OrderDetail'
export default {
  components: {
    OrderDetail
  },
  data() {
    return {
      showOrderDetail: false,
      searchForm: {},
      payAccountList: [],
      verifyTypeList: [
        {
          label: '人工对账',
          value: '1'
        },
        {
          label: '系统对账',
          value: '2'
        },
      ],
      createTime: '',

      tabActive: '',
      tabList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待对账',
          value: 0
        },
        {
          label: '已对账',
          value: 1
        },
        {
          label: '已驳回',
          value: 2
        },
      ],

      loading: false,
      columns: [
        {
          type: "selection",
          align: "center",
          width: 60,
        },
        {
          title: "订单编号",
          key: "orderNo",
          align: "center",
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center",
        },
        {
          title: "用户账号",
          key: "userMobile",
          align: "center",
        },
        {
          title: "商品信息",
          key: "productNames",
          align: "center",
        },
        {
          title: "订单总金额",
          key: "orderMoney",
          align: "center",
        },
        {
          title: "款项金额",
          key: "amount",
          align: "center",
        },
        {
          title: "付款方",
          key: "payer",
          align: "center",
        },
        {
          title: "付款方式",
          slot: "paymentType",
          align: "center",
        },
        {
          title: "支付凭证",
          slot: "paymentFile",
          align: "center",
        },
        {
          title: "打款时间",
          key: "paymentTime",
          align: "center",
        },
        {
          title: "备注",
          key: "remark",
          align: "center",
        },
        {
          title: "销售人员",
          key: "sellerName",
          align: "center",
        },
        {
          title: "对账方式",
          slot: "verifyType",
          align: "center",
        },
        {
          title: "交易流水号",
          key: "tradeNo",
          align: "center",
        },
        {
          title: "状态",
          slot: "reconStatus",
          align: "center",
        },
        {
          title: "操作",
          slot: "operation",
          align: "center",
        },
      ],
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      childData: {},

      confirmReceiptModal: false,
      confirmReceiptLoading: false,
      confirmReceiptForm: {},
      gainedDate: '',
      rejectReasonList: [
        {
          label: '收款账号不一致',
          value: '收款账号不一致',
        },
        {
          label: '金额不一致',
          value: '金额不一致',
        },
        {
          label: '付款方式错误',
          value: '付款方式错误',
        },
        {
          label: '附件错误',
          value: '附件错误',
        },
        {
          label: '其他',
          value: '其他',
        },
      ],
    }
  },
  methods: {
    // 查询
    search() {
      this.page = 1;
      this.getTableList();
    },
    // 重置
    clearHandler() {
      let reconStatus = this.searchForm.reconStatus;
      this.searchForm = {};
      this.searchForm.reconStatus = reconStatus;
      this.createTime = "";
      this.search();
    },
    // 收款账户下拉
    getAccountsList() {
      let self = this;
      API.getAccountsList()
        .then((res) => {
          if (res.code == 0) {
            self.payAccountList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查看详情
    goDetails(row, index) {
      this.showOrderDetail = true;
      this.childData = {
        orderId: row.orderId,
        orderNo: row.orderNo,
        orderType: 3,
      };
    },
    // 子组件状态
    detailStatusChange(val) {
      this.showOrderDetail = val;
      this.search();
    },
    // 对账状态切换
    toggle(val) {
      this.tabActive = val;
      this.searchForm.reconStatus = val;
      this.page = 1;
      this.getTableList();
    },
    // 创建时间
    createTimeChange(val) {
      this.searchForm.startCreateTime = val[0];
      this.searchForm.endCreateTime = val[1];
    },
    // 开启确认到账弹窗
    openConfirmReceipt(row) {
      this.confirmReceiptModal = true;
      this.confirmReceiptForm = JSON.parse(JSON.stringify(row));
      this.confirmReceiptForm.remark = '';
    },
    // 确认到账-取消
    confirmReceiptCancel() {
      this.confirmReceiptModal = false;
      this.confirmReceiptForm = {};
      this.gainedDate = '';
    },
    // 到账日期change
    gainedDateChange(val) {
      this.confirmReceiptForm.gainedDate = val;
    },
    // 确认到账-确定
    confirmReceiptConfirm() {
      let self = this;
      if (!this.confirmReceiptForm.flag) {
        this.$Message.warning('请选择是否通过！');
        return
      }
      if (this.confirmReceiptForm.flag == '2' && !this.confirmReceiptForm.rejectReason) {
        this.$Message.warning('请选择驳回原因！');
        return
      }
      if (this.confirmReceiptForm.flag == '2' && this.confirmReceiptForm.rejectReason == '其他' && !this.confirmReceiptForm.remark) {
        this.$Message.warning('请填写驳回理由！');
        return
      }
      let params;
      if (self.confirmReceiptForm.flag == '1') {
        params = {
          orderId: this.confirmReceiptForm.orderId,
          id: this.confirmReceiptForm.paymentId,
          flag: Number(this.confirmReceiptForm.flag),
          gainedDate: this.confirmReceiptForm.gainedDate,
          serialsNum: this.confirmReceiptForm.tradeNo,
        };
      } else {
        params = {
          orderId: this.confirmReceiptForm.orderId,
          id: this.confirmReceiptForm.paymentId,
          flag: Number(this.confirmReceiptForm.flag),
          gainedDate: this.confirmReceiptForm.gainedDate,
          remark: this.confirmReceiptForm.remark,
          rejectReason: this.confirmReceiptForm.rejectReason,
          serialsNum: this.confirmReceiptForm.tradeNo,
        };
      }
      this.confirmReceiptLoading = true;
      API.confirmReceipt(params)
        .then((res) => {
          if (res.code == 0) {
            self.$Message.success('确认到账完成！');
            self.confirmReceiptModal = false;
            self.confirmReceiptForm = {};
            self.gainedDate = '';
            self.getTableList();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          self.confirmReceiptLoading = false;
        });
    },
    // 表格select
    selectChange(rowData) {
      this.selectArr = rowData;
    },
    // 每页条数改变
    pageSizeChangeHandler(pageSize) {
      this.limit = pageSize
      this.pageChangeHandler()
    },
    // 翻页
    pageChangeHandler(page = 1) {
      this.page = page;
      this.getTableList();
    },
    // 获取table列表数据
    getTableList() {
      let self = this;
      let pageData = {
        page: self.page,
        limit: self.limit,
      };
      let params = {
        ...pageData,
        ...self.searchForm,
      };
      API.orderAccountCheckList(params)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.total = Number(res.data.total);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getAccountsList();
    this.getTableList();
  },
}
</script>

<style scoped lang="less">
.orderList {
  background: #fff;
  padding: 15px;
}
.tabBar {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  padding: 0 15px;
  .left {
    .span {
      display: inline-block;
      margin-right: 10px;
      padding: 5px 20px;
      background: #fff;
      border: 1px solid #ddd;
      cursor: pointer;
    }
    .active {
      background-color: #2d8cf0;
      color: #fff;
    }
  }
}
.tabBar1 {
  height: 40px;
  padding-bottom: 10px;
  .left {
    font-size: 14px;
    .item {
      margin-right: 10px;
    }
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 15px;
}
.button {
  color: #2d8cf0;
  cursor: pointer;
}
.operationFlex {
  text-align: left;
  .button {
    display: inline-block;
    width: 50%;
    height: 20px;
    line-height: 20px;
  }
}
.height30 {
  height: 30px;
  line-height: 30px;
}
</style>