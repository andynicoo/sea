<template>
  <div class="payAdmin">
    <Card>
      <Form ref="searchForm" :model="searchForm" class :label-width="80" inline>
        <row>
          <FormItem label="退款订单：">
            <Input style="width: 200px" clearable v-model="searchForm.payRefundNo" placeholder="请输入" />
          </FormItem>
          <FormItem label="手机号：">
            <Input style="width: 200px" clearable v-model="searchForm.mobile" placeholder="请输入" />
          </FormItem>
          <FormItem label="业务单号">
            <Input style="width: 200px" clearable v-model="searchForm.businessNo" placeholder="请输入" />
          </FormItem>
          <FormItem label="退款时间：">
            <DatePicker type="datetimerange" :options="dateOptions" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择创建时间" style="width: 280px" clearable :value="createTime" @on-change="changeCreateTime"></DatePicker>
          </FormItem>
        </row>
        <row>
          <FormItem label="退款方式：">
            <Select style="width: 200px" clearable v-model="searchForm.refundType" placeholder="请选择">
              <Option v-for="item in returnArry" :value="item.key" :key="item.key">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="支付主体：">
            <Select style="width: 200px" clearable v-model="searchForm.paySubjectId" placeholder="请选择">
              <Option v-for="item in companyArryMain" :value="item.paySubjectId" :key="item.paySubjectId">{{ item.subjectName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="支付渠道">
            <Select style="width: 200px" clearable v-model="searchForm.payChannelKey" placeholder="请选择">
              <Option v-for="value in payCompanyArry" :value="value.key" :key="value.key">{{ value.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="退款状态：">
            <Select style="width: 280px" clearable v-model="searchForm.status" placeholder="请选择退款状态">
              <Option v-for="(item, index) in allocationType" :value="item.key" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="exportRefundOrder" v-show="hasAuthority('export_pay_return')">导出</Button>
            <Button type="primary" @click="searchList">查询</Button>
            <Button @click="clearHandler" type="primary" ghost>重置</Button>
          </FormItem>
        </row>
        <row>
          <Button size="large" v-for="(item, index) in auditList" @click="statusChange(item)" :key="item.value" :type="item.label == label ? 'info' : 'default'">{{ item.label + numArry[index] }}</Button>
        </row>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loadTable">
        <template slot="mobile" slot-scope="{ row }">
          <span v-hidden>{{ row.mobile }}</span>
        </template>
        <template slot="refundType" slot-scope="{ row }">
          <span>{{ returnType[row.refundType] }}</span>
        </template>
        <template slot="refundAmount" slot-scope="{ row }">
          <span v-if="row.refundCurrencyCode!==''">
            {{ row.refundCurrencyCode }}
          </span>
          <span v-else>￥</span>
          <span>{{ row.refundAmount }}</span>
        </template>
        <template slot="refundTime" slot-scope="{ row }">
          <div>{{ row.refundName ? row.refundName + '/' + row.refundTime : row.refundTime }}</div>
        </template>
        <template slot="status" slot-scope="{ row }">
          <Button v-if="row.status != 'TKSB'">{{ statusType[row.status] }}</Button>
          <Tooltip :content="row.reason" placement="top-end" v-if="row.status == 'TKSB'">
            <Button type="error" ghost icon="ios-alert-outline">退款失败</Button>
          </Tooltip>
        </template>
        <template slot="bank" slot-scope="{ row }">
          <Button type="primary" @click="viewBank(row)" ghost v-if="row.refundType == 'DISTRIBUTE_PAY'" v-show="hasAuthority('view_bank_return')">查看</Button>
          <span v-else>-</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <Button type="primary" ghost @click="examine(row)" v-if="row.status == 'TKSB' || row.status == 'DTK'" v-show="hasAuthority('examine_pay_return')">审核</Button>
          <Button type="primary" ghost @click="synchronization(row)" v-else-if="row.status == 'TKZ'" v-show="hasAuthority('synchronization_return')">同步</Button>
          <span v-else>-</span>
        </template>
      </Table>
      <Page :total="pageInfo.total" show-elevator show-sizer transfer :current="pageInfo.current" :page-size="pageInfo.pageSize" show-total @on-change="handlePage" @on-page-size-change="handlePageSize" />
      <Modal v-model="modalReturn" title="新增退款" okText cancelText :mask-closable="false" :footer-hide="true" width="1000px">
        <Form ref="examinesubFrom" :rules="ruleAllFrom" :label-width="100" :model="examineFrom">
          <h3>订单信息</h3>
          <Row>
            <Col span="8">
              <FormItem label="退款订单">
                <Input v-model="orderData.payRefundNo" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="原订单号">
                <Input v-model="orderData.payOrderNo" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="业务订单">
                <Input v-model="orderData.businessNo" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="手机号">
                <Input v-model="orderData.mobile" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="支付时间">
                <Input v-model="orderData.payTime" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="支付主体">
                <Input v-model="orderData.subjectName" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="支付方式">
                <Input v-model="orderData.payWayName" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="支付渠道">
                <Input v-model="orderData.payChannelName" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
          </Row>
          <h3>退款信息</h3>
          <br />
          <Row>
            <Col span="8">
              <FormItem label="退款类型">
                <Select style="width: 200px" clearable v-model="examineFrom.refundType" placeholder="请选择" disabled>
                  <Option v-for="item in returnArry" :value="item.key" :key="item.key">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8" v-show="examineFrom.refundType == 'DISTRIBUTE_PAY'">
              <FormItem label="开户类型">
                <Input :value="examineFrom.accountType === 'PERSONAL' ? '个人' : '企业'" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8" v-show="examineFrom.refundType == 'DISTRIBUTE_PAY'">
              <FormItem label="开户人" v-show="examineFrom.refundType == 'DISTRIBUTE_PAY'">
                <Input v-model="examineFrom.openAccount" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
          </Row>
          <Row v-show="examineFrom.refundType == 'DISTRIBUTE_PAY'">
            <Col span="8">
              <FormItem label="银行名称">
                <Input v-model="examineFrom.bankName" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="银行卡号">
                <Input v-model="examineFrom.bankCard" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="开户行">
                <Input v-model="examineFrom.deposit" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="退款金额">
                <Input v-model="examineFrom.refundAmount" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="支付金额">
                <Input v-model="examineFrom.payAmount" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="已退金额">
                <Input v-model="examineFrom.sumRefundAmount" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
          </Row>
          <!-- {{examineFrom}} -->
          <!-- v-if="examineFrom.refundType == 'DISTRIBUTE_PAY'" -->
          <Row>
            <Col span="8">
              <FormItem label="代付渠道">
                <Input v-model="examineFrom.subjectName" :maxlength="30" placeholder="" disabled />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem prop="payChannelKey">
                <Select clearable v-model="examineFrom.payChannelKey" placeholder="请选择支付公司" :disabled="payComDisable">
                  <Option v-for="value in payCompanyArryReturn" :disabled="value.isDisable" :value="value.key" :key="value.key">{{ value.name }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="支付密码" prop="password">
                <Input v-model="examineFrom.password" :maxlength="30" placeholder="" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="备注">
                <Input v-model="examineFrom.remark" placeholder="请输入" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
              </FormItem>
            </Col>
          </Row>
          <br />
          <FormItem>
            <Button type="primary" @click="addReturn('examinesubFrom')">提交</Button>
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
            <Button type="primary" @click="modalBank = false">确定</Button>
            <Button @click="modalBank = false" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import { getPayMainList, getPayCompany, getReturnList, getBankInfo, getReturnInfo, subReturnInfo, exportPayRefundOrder, getReturnSum, getPayRoute, synchronizationReturn } from '@/api/payCenter';
export default {
  data() {
    return {
      allocationType: [
        { key: 'DTK', name: '待退款' },
        { key: 'YTK', name: '已退款' },
        { key: 'TKSB', name: '退款失败' },
        { key: 'TKZ', name: '退款中' },
      ],
      accountType: [
        { key: 'ENTERPRISE', name: '企业' },
        { key: 'PERSONAL', name: '个人' },
      ],
      statusType: {
        DTK: '待退款',
        YTK: '已退款',
        TKSB: '退款失败',
        TKZ: '退款中',
      },
      returnArry: [
        { key: 'DISTRIBUTE_PAY', name: '代付退款' },
        { key: 'REFUND', name: '原路退款' },
      ],
      returnType: {
        DISTRIBUTE_PAY: '代付退款',
        REFUND: '原路退款',
      },
      auditList: [
        {
          value: '',
          label: '全部',
        },
        {
          value: 'DTK',
          label: '待退款',
        },
        {
          value: 'YTK',
          label: '已退款',
        },
        {
          value: 'TKSB',
          label: '退款失败',
        },
        {
          value: 'TKZ',
          label: '退款中',
        },
      ],
      modalReturn: false,
      modalBank: false,
      loadTable: true,
      loadTableReturn: false,
      createTime: '',
      userId: this.$store.state.user.userId,
      userName: this.$store.state.user.userName,
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
          title: '退款订单号',
          key: 'payRefundNo',
          width: 200,
        },
        {
          title: '原支付订单号',
          key: 'payOrderNo',
          width: 200,
        },
        {
          title: '业务订单号',
          key: 'businessNo',
          width: 200,
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
          title: '申请时间',
          key: 'createdTime',
          width: 180,
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status',
          width: 130,
        },
        {
          title: '退款类型',
          key: 'refundType',
          slot: 'refundType',
          width: 100,
        },
        {
          title: '退款金额',
          key: 'refundAmount',
          slot: 'refundAmount',
          width: 100,
        },
        {
          title: '支付时间',
          key: 'payTime',
          width: 180,
        },

        {
          title: '支付方式',
          key: 'payWayName',
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
          width: 200,
        },
        {
          title: '银行卡',
          key: 'bank',
          slot: 'bank',
          width: 100,
        },
        {
          title: '退款人/退款时间',
          key: 'refundTime',
          slot: 'refundTime',
          width: 200,
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          fixed: 'right',
          width: 100,
        },
      ],
      columnsReturn: [
        {
          title: '退款类型',
          key: 'payOrderNo',
        },
        {
          title: '退款订单号',
          key: 'outTradeNo',
        },
        {
          title: '原定单号',
          key: 'businessNo',
        },
        {
          title: '退款时间',
          key: 'merchantName',
        },
        {
          title: '退款金额',
          key: 'mobile',
        },
        {
          title: '备注',
          key: 'businessNo',
        },
        {
          title: '银行卡',
          key: 'bank',
          slot: 'bank',
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
        },
      ],
      ruleAllFrom: {
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
        payChannelKey: {
          required: true,
          message: '请选择支付公司',
          trigger: 'change',
        },
      },
      data: [],
      formReturnData: [],
      examineFrom: {},
      orderData: {},
      bankData: {},
      searchForm: {
        status: '',
      },
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
      },
      payCompanyArry: [],
      payCompanyArryReturn: [],
      companyArry: [],
      companyArryMain: [],
      numArry: [0, 0, 0, 0, 0],
      label: '全部',
      isReturn: true,
      payComDisable: false,
    };
  },
  methods: {
    getList() {
      let obj = this.searchForm;
      this.loadTable = true;
      let data = { ...this.pageInfo, ...obj };
      getReturnList(data)
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
    statusChange(item) {
      this.searchForm.status = item.value;
      this.label = item.label;
      this.getList();
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
    optionsChange(el) {
      getPayRoute({ paySubjectId: el })
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              this.loadTableRoute = false;
              let data = res.data;
              let arry = [];
              data.forEach((item) => {
                let json = {
                  key: item.channelKey,
                  name: item.channelName,
                  isDisable: this.isReturnSelect(item),
                };
                arry.push(json);
              });
              this.payCompanyArryReturn = arry;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    isReturnSelect(item) {
      let checkArry = [];
      item.paymentWayDTOList.forEach((value) => {
        if (value.isSelectd) {
          checkArry.push(value.name);
        }
      });
      if (checkArry.indexOf('代付退款') > -1) {
        return false;
      } else {
        // 当REFUND（原路退款时）默认选中payChannelKey支付渠道对应的支付公司; 否则不变
        if(this.examineFrom.refundType === 'REFUND') {
          this.payComDisable = true;
        } else {
          this.payComDisable = false;
          this.examineFrom.payChannelKey = '';
        }
        return true;
      }
    },
    exportRefundOrder() {
      let obj = this.searchForm;
      let data = { ...this.pageInfo, ...obj };
      exportPayRefundOrder(data)
        .then(
          (res) => {
            this.$util.exportExcel(res);
          },
          (err) => {}
        )
        .finally(() => {});
    },
    examine(row) {
      this.modalReturn = true;
      this.isReturn = true;
      this.orderData = row;
      getReturnInfo({ payRefundId: row.payRefundId })
        .then(
          (res) => {
            if (res.code == 0) {
              let data = res.data;
              if (row.refundType == 'DISTRIBUTE_PAY') {
                data.payChannelKey = '';
              }
              this.examineFrom = data;
              this.optionsChange(data.paySubjectId);
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    synchronization(row) {
      synchronizationReturn({ payRefundNo: row.payRefundNo })
        .then(
          (res) => {
            if (res.code == 0) {
              setTimeout(() => {
                this.getList();
                this.getReturnOrderSum();
              }, 1000);
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    addReturn(all) {
      this.$refs[all].validate((valid) => {
        if (valid) {
          let obj = {
            userId: this.userId,
            userName: this.userName,
            paymentPassword: this.examineFrom.password,
            payRefundNo: this.examineFrom.payRefundNo,
            refundOrderCheckCode: this.examineFrom.refundOrderCheckCode,
            remark: this.examineFrom.remark,
            payChannelKey: this.examineFrom.payChannelKey,
            paySubjectId: this.examineFrom.paySubjectId,
          };
          subReturnInfo(obj)
            .then(
              (res) => {
                if (res.code == 0) {
                  this.modalReturn = false;
                  setTimeout(() => {
                    this.getList();
                    this.getReturnOrderSum();
                  }, 1000);
                }
              },
              (err) => {}
            )
            .finally(() => {});
        }
      });
    },
    searchList() {
      this.pageInfo.current = 1;
      this.getList();
    },
    clearHandler() {
      this.searchForm = {};
      this.createTime = '';
      this.label = '全部';
      this.getList();
    },
    getPayLsit() {
      getPayMainList({ current: 1, size: 999, status: 'ENABLE' })
        .then(
          (res) => {
            if (res.code == 0) {
              let data = res.data.records;
              if (data) {
                this.companyArry = data;
              } else {
                this.companyArry = [];
              }
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    getPayLsitMain() {
      getPayMainList({ current: 1, size: 999 })
        .then(
          (res) => {
            if (res.code == 0) {
              let data = res.data.records;
              if (data) {
                this.companyArryMain = data;
              } else {
                this.companyArryMain = [];
              }
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
    getReturnOrderSum() {
      getReturnSum({})
        .then(
          (res) => {
            let data = res.data;
            for (name in data) {
              if (data[name] == null) {
                data[name] = 0;
              }
            }
            let allNum = parseInt(data.dtkNum) + parseInt(data.tksbNum) + parseInt(data.tkzNum) + parseInt(data.ytkNum);
            this.numArry = [allNum, parseInt(data.dtkNum), parseInt(data.ytkNum), parseInt(data.tksbNum), parseInt(data.tkzNum)];
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
    this.getPayLsitMain();
    this.getCompanyList();
    this.getReturnOrderSum();
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
