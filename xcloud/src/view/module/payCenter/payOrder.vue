<template>
  <div class="payAdmin">
    <Card>
      <Form ref="searchForm" :model="searchForm" class :label-width="100" inline>
        <FormItem label="支付订单：">
          <Input style="width: 200px" clearable v-model="searchForm.payOrderNo" placeholder="请输入" />
        </FormItem>
        <FormItem label="手机号：">
          <Input style="width: 200px" clearable v-model="searchForm.mobile" placeholder="请输入" />
        </FormItem>
        <FormItem label="业务单号">
          <Input style="width: 200px" clearable v-model="searchForm.businessNo" placeholder="请输入" />
        </FormItem>
        <FormItem label="支付时间：">
          <DatePicker type="datetimerange" :options="dateOptions" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择创建时间" style="width: 280px" clearable :value="createTime" @on-change="changeCreateTime"></DatePicker>
        </FormItem>
        <FormItem label="支付主体：">
          <Select style="width: 200px" clearable v-model="searchForm.paySubjectId" placeholder="请选择支付主体">
            <Option v-for="item in companyArry" :value="item.paySubjectId" :key="item.paySubjectId">{{ item.subjectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="支付方式：">
          <Select style="width: 200px" clearable v-model="searchForm.payWayKey" placeholder="请选择支付方式">
            <Option v-for="value in payWayArry" :value="value.wayKey" :key="value.wayKey">{{ value.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="支付渠道">
          <Select style="width: 200px" clearable v-model="searchForm.payChannelKey" placeholder="请选择支付公司">
            <Option v-for="value in payCompanyArry" :value="value.key" :key="value.key">{{ value.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="支付状态：">
          <Select style="width: 280px" clearable v-model="searchForm.status" placeholder="请选择支付状态">
            <Option v-for="(item, index) in allocationType" :value="item.key" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="支付流水号：">
          <Input style="width: 200px" clearable v-model="searchForm.outTradeNo" placeholder="请输入" />
        </FormItem>
        <FormItem label="收款账号：">
          <Input style="width: 200px" clearable v-model="searchForm.actNo" placeholder="请输入" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchList">查询</Button>
          <Button @click="clearHandler" type="primary" ghost>重置</Button>
          <Button type="primary" @click="exportOrder" v-show="hasAuthority('export_pay_order')">导出</Button>
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loadTable">
        <template slot="businessNo" slot-scope="{ row }">
          <p v-for="(item,index) in row.businessNo.split(',')" :key="index">{{ item }}</p>
        </template>
        <template slot="mobile" slot-scope="{ row }">
          <span v-hidden>{{ row.mobile }}</span>
        </template>
        <template slot="refundAmount" slot-scope="{ row }">
          <span v-if="row.status != 'YTK' && row.status != 'BFTK'">{{ '-' }}</span>
          <a @click="viewRefundAmount(row)" v-else>{{ row.refundAmount }}</a>
        </template>
        <template slot="payAmount" slot-scope="{ row }"> {{ row.paymentCurrencyCode }} {{ row.payAmount }} </template>
        <template slot="status" slot-scope="{ row }">
          <Button v-if="row.status != 'ZFSB'">{{ statusType[row.status] }}</Button>
          <Tooltip content="Top Right text" placement="top-end" v-if="row.status == 'ZFSB'">
            <Button type="error" ghost icon="ios-alert-outline">支付失败</Button>
          </Tooltip>
        </template>
      </Table>
      <Page :total="pageInfo.total" show-elevator show-sizer transfer :current="pageInfo.current" :page-size="pageInfo.pageSize" show-total @on-change="handlePage" @on-page-size-change="handlePageSize" />
      <Modal v-model="modalReturn" title="退款明细" okText cancelText :mask-closable="false" :footer-hide="true" width="1000px">
        <Form ref="addRouteFrom" :label-width="100">
          <Row>
            <Table border :columns="columnsReturn" :data="formReturnData" :loading="loadTableReturn">
              <template slot="bank" slot-scope="{ row }">
                <Button type="primary" @click="viewBank(row)" ghost v-if="row.refundType == 'DISTRIBUTE_PAY'" v-show="hasAuthority('view_bank_order')">查看</Button>
                <span v-else>-</span>
              </template>
              <template slot="refundType" slot-scope="{ row }">
                <span>{{ returnType[row.refundType] }}</span>
              </template>
            </Table>
          </Row>
          <br />
          <FormItem>
            <Button type="primary" @click="modalReturn = false">提交</Button>
            <Button @click="modalReturn = false" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="modalBank" title="银行卡信息" okText cancelText :mask-closable="false" :footer-hide="true" width="600px">
        <Form ref="addAllFrom" :model="bankData" :label-width="100">
          <Row>
            <Col span="24">
              <FormItem label="账户类型">
                <Select clearable v-model="bankData.accountType" placeholder="请选择" disabled>
                  <Option v-for="item in accountType" :value="item.key" :key="item.key">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="开户人">
                <Input v-model="bankData.openAccount" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="银行名称">
                <Input v-model="bankData.bankName" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="银行卡号">
                <Input v-model="bankData.bankCard" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="开户行">
                <Input v-model="bankData.deposit" placeholder="" disabled />
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" @click="modalBank = false">提交</Button>
            <Button @click="modalBank = false" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import { getPayMainList, getPayCompany, getOrderList, getPayWalAll, getBankInfo, getReturnDetails, exportPayOrder } from '@/api/payCenter';
export default {
  data() {
    return {
      allocationType: [
        { key: 'WZF', name: '未支付' },
        { key: 'YZF', name: '已支付' },
        { key: 'ZFSB', name: '支付失败' },
        { key: 'YTK', name: '已退款' },
        { key: 'BFTK', name: '部分退款' },
      ],
      accountType: [
        { key: 'ENTERPRISE', name: '企业' },
        { key: 'PERSONAL', name: '个人' },
      ],
      statusType: {
        WZF: '未支付',
        YZF: '已支付',
        ZFSB: '支付失败',
        YTK: '已退款',
        BFTK: '部分退款',
      },
      returnType: {
        DISTRIBUTE_PAY: '代付退款',
        REFUND: '原路退款',
      },
      modalReturn: false,
      modalBank: false,
      loadTable: true,
      loadTableReturn: false,
      createTime: '',
      dateOptions: {
        shortcuts: [
          {
            text: '近一周',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            },
          },
          {
            text: '近一个月',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            },
          },
          {
            text: '近三个月',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            },
          },
        ],
      },
      columns: [
        {
          title: '支付订单号',
          key: 'payOrderNo',
          width: 200,
        },
        {
          title: '支付流水号',
          key: 'outTradeNo',
          width: 250,
        },
        {
          title: '业务订单号',
          key: 'businessNo',
          width: 150,
          slot: 'businessNo',
        },
        {
          title: '收款账号',
          key: 'actNo',
          width: 150,
        },
        {
          title: '商户名称',
          key: 'merchantName',
          width: 150,
        },
        {
          title: '手机号',
          key: 'mobile',
          width: 120,
          slot: 'mobile',
        },
        {
          title: '创建时间',
          key: 'createdTime',
          width: 180,
        },
        {
          title: '支付时间',
          key: 'payTime',
          width: 180,
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status',
          width: 120,
        },
        {
          title: '支付方式',
          key: 'payWayName',
          width: 100,
        },
        {
          title: '支付金额',
          key: 'payAmount',
          slot: 'payAmount',
          width: 100,
        },
        {
          title: '支付渠道',
          key: 'payChannelName',
          width: 100,
        },
        {
          title: '支付主体',
          key: 'subjectName',
          width: 150,
        },
        {
          title: '已退金额',
          key: 'refundAmount',
          slot: 'refundAmount',
          width: 100,
        },
        {
          title: '最近退款时间',
          key: 'refundTime',
          width: 180,
        },
      ],
      columnsReturn: [
        {
          title: '退款类型',
          key: 'refundType',
          slot: 'refundType',
        },
        {
          title: '退款订单号',
          key: 'payRefundNo',
        },
        {
          title: '原定单号',
          key: 'businessNo',
        },
        {
          title: '退款时间',
          key: 'refundTime',
        },
        {
          title: '退款金额',
          key: 'refundAmount',
        },
        {
          title: '备注',
          key: 'remark',
        },
        {
          title: '银行卡',
          key: 'bank',
          slot: 'bank',
        },
      ],
      data: [],
      formReturnData: [],
      bankData: {},
      searchForm: {
        status: '',
        outTradeNo: '',
        actNo: ''
      },
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
      },
      payCompanyArry: [],
      payWayArry: [],
      companyArry: [],
    };
  },
  methods: {
    getList() {
      let obj = this.searchForm;
      this.loadTable = true;
      let data = { ...this.pageInfo, ...obj };
      getOrderList(data)
        .then(
          (res) => {
            if (res.code == 0) {
              this.pageInfo.total = parseInt(res.data.total);
              this.data = res.data.records;
              this.loadTable = false;
            }
          },
          // eslint-disable-next-line handle-callback-err
          (err) => {}
        )
        .finally(() => {});
    },
    // 创建时间
    changeCreateTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes('00:00:00')) {
        endTime = endTime.replace('00:00:00', '23:59:59');
      }
      const dateTime = [time[0], endTime];
      this.searchForm.startCreatedTime = dateTime[0];
      this.searchForm.endCreatedTime = dateTime[1];
      this.createTime = dateTime;
    },
    viewRefundAmount(row) {
      this.modalReturn = true;
      getReturnDetails({ payOrderNo: row.payOrderNo })
        .then(
          (res) => {
            if (res.code == 0) {
              let data = res.data;
              this.formReturnData = data.records;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    viewBank(row) {
      this.modalBank = true;
      getBankInfo({ payRefundId: row.payRefundId })
        .then(
          (res) => {
            if (res.code == 0) {
              let data = res.data;
              if (data) {
                this.bankData = data;
              } else {
                this.bankData = {};
              }
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    searchList() {
      this.pageInfo.current = 1;
      this.getList();
    },
    clearHandler() {
      this.searchForm = {};
      this.createTime = '';
      this.getList();
    },
    exportOrder() {
      exportPayOrder({ size: -1 })
        .then(
          (res) => {
            this.$util.exportExcel(res);
          },
          (err) => {}
        )
        .finally(() => {});
    },
    getPayLsit() {
      getPayMainList({ current: 1, size: 999 })
        .then(
          (res) => {
            if (res.code == 0) {
              let data = res.data.records;
              this.companyArry = data;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    getCompanyList() {
      getPayCompany({ current: 1, size: 999 })
        .then(
          (res) => {
            let data = res.data;
            this.payCompanyArry = data;
          },
          (err) => {}
        )
        .finally(() => {});
    },
    getPayWayList() {
      getPayWalAll({ current: 1, size: 999 })
        .then(
          (res) => {
            let data = res.data;
            this.payWayArry = data;
          },
          (err) => {}
        )
        .finally(() => {});
    },
    // 分页
    handlePage(current) {
      this.pageInfo.current = current;
      this.handleSearch();
    },
    handlePageSize(size) {
      this.pageInfo.size = size;
      this.handleSearch();
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.current = page;
      }
      this.loading = true;
      this.getList();
    },
  },
  created() {},
  mounted() {
    this.getList();
    this.getPayLsit();
    this.getCompanyList();
    this.getPayWayList();
  },
};
</script>
<style lang="less">
.payAdmin {
  .ivu-form,
  .ivu-row-flex {
    button {
      margin-right: 10px;
    }
  }
  .ivu-row {
    margin: 10px;
  }
  .ivu-table-wrapper {
    margin-top: 10px;
    button {
      margin-right: 10px;
    }
    .spanHd {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        margin-right: 5px;
      }
    }
  }
  .ivu-form-item {
    margin-bottom: 5px;
  }
}
.ivu-modal-footer {
  text-align: center;
  .footerBt {
    width: 150px;
    height: 40px;
    font-size: 15px;
  }
}
</style>
