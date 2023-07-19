/* rwer.vue */
<template xlang="wxml">
  <div>
    <div class="table-content">
      <h3 class="table-title">待办事项</h3>
      <div class="table-box">
        <div class="todo-wrapper">
          <i-circle class="circle-custom-wrapper" :size="171" :percent="totalNum ? 100 : 0">
            <div class="Circle-custom">
              <template v-if="totalNum">
                <div class="Circle-custom-title1">{{ totalNum }}<span class="Circle-custom-title1-unit">项</span></div>
                <div class="Circle-custom-title2">待处理</div>
              </template>
              <div v-else class="Circle-custom-title3">暂无待办</div>
            </div>
          </i-circle>
          <div class="todo-wrapper-right">
            <a-row>
              <a-col :span="6" class="todo-list" v-for="item in workOrderTodoList" :key="item.key">
                <div
                  class="todo-item"
                  :class="item.key === selectTodoItem.key ? 'todo-item-active' : ''"
                  @click="selectTodoFn(item)"
                >
                  <span class="todo-item-label">{{ item.label }}</span>
                  <span class="todo-item-num">{{ item.num }}</span>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </div>
    <div class="table-content">
      <h3 class="table-title">待办工单——{{ selectTodoItem.label }}</h3>
      <div class="table-box">
        <a-tabs v-model="activeName" @change="selectTab">
          <!-- <a-tab-pane key="-1" tab="全部"></a-tab-pane> -->
          <a-tab-pane v-for="tab in copyTodoTabs" :key="tab.key" :tab="`${tab.label}（${tab.num}）`"></a-tab-pane>
        </a-tabs>
        <a-table
          :columns="filterColumns"
          :data-source="workList"
          :loading="tableLoading"
          :pagination="pagination"
          :rowKey="
            (record, index) => {
              return index;
            }
          "
          @change="handleTableChange"
          :locale="{ emptyText: '暂无数据' }"
          :scroll="{ x: true }"
        >
          <template slot="itemCode" slot-scope="record">
            <span
              v-if="
                record.itemCode === 'TOBE_TAXES' &&
                  selectTodoItem.searchType === 'TOBE_TAXES' &&
                  selectItemTab === 'EPR'
              "
              >缴纳回收费</span
            >
            <span v-else>{{ record.itemCode | filterItemCode(selectTodoItem.searchType) }}</span>
          </template>
          <template slot="taxDeclarationDeadline" slot-scope="record">
            <div class="tag-wrapper">
              <div>
                <div>{{ record.beginTime.substr(0, 10) }} 至 {{ record.endTime.substr(0, 10) }}</div>
                <div v-if="record.taxDeclarationDeadline">
                  {{ (record.taxDeclarationDeadline || '').split(' ')[0] }}截止提交
                </div>
              </div>
              <Tag class="tag" v-if="record.declarePeriod !== ''">{{ record.declarePeriod | filterDeclarePeriod }}</Tag>
            </div>
          </template>
          <template slot="officialFee" slot-scope="record">
            <span v-if="selectItemTab === 'EPR'">{{ record.currencySign }}{{ record.officialFee }}</span>
            <span v-else>{{ record.currencySign }}{{ record.allTaxPrice }}</span>
          </template>
          <template slot="remark" slot-scope="text, record">
            <div v-if="record.beginTime && record.endTime">
              <div>申报周期 {{ record.beginTime.substr(0, 10) }} 至 {{ record.endTime.substr(0, 10) }}</div>
            </div>
          </template>
          <template slot="operate" slot-scope="text, record">
            <div class="operate">
              <div v-if="selectTodoItem.searchType == 'TOBE_SUBMITTED'">
                <span @click.stop="toSubAgent(record)" class="btF">
                  {{ record.itemCode === 'TOBE_SUBMITTED' ? '填写资料' : '上传授权书' }}
                </span>
              </div>

              <div v-if="selectTodoItem.searchType == 'TOBE_MATERIALS_REJECT'">
                <span @click.stop="toSubAgent(record)" class="btF"> 修改资料 </span>
              </div>
              <div v-if="selectTodoItem.searchType == 'TOBE_DECLARED_REJECT'">
                <span @click.stop="toPaymentTax(record)" class="btF" v-if="record.itemCode === 'TOBE_TAXES_REJECT'">
                  缴纳税金
                </span>
                <span @click.stop="toDeclare(record)" class="btF" v-else> 修改申报 </span>
              </div>
              <div v-if="['TOBE_MATERIALS_REJECT', 'TOBE_DECLARED_REJECT'].includes(selectTodoItem.searchType)">
                <span @click.stop="checkRejectReason(record)" class="btF"> 驳回原因 </span>
              </div>

              <div v-if="record.itemCode == 'TOBE_DECLARED'">
                <span @click.stop="toDeclare(record)" class="btF"> 提交申报 </span>
              </div>
              <div v-if="record.itemCode == 'TOBE_TAXES'">
                <span @click.stop="toPaymentTax(record)" class="btF">
                  {{ selectItemTab === 'VAT' ? '缴纳税金' : '缴纳回收费' }}
                </span>
              </div>
              <div v-if="record.itemCode == 'TOBE_EPR_REG_PAY'">
                <span @click.stop="toPaymentTax(record)" class="btF"> 缴纳回收费 </span>
              </div>
            </div>
          </template>
        </a-table>
      </div>
      <RejectReasonDialog
        :rejectReasonDialog.sync="rejectReasonDialog"
        :checkItem="checkItem"
        @modify="(record) => toSubAgent(record)"
      />
    </div>
  </div>
</template>
<script>
import { workOrderTodoNum, pageWorkOrderTodo } from '@/api/home/home';
import { letterList } from '@/api/user/letters';
import { renewalList } from '@comp/api/renewal/index.js';
import { isAuthorized } from '@/api/taxBureauService/taxBureauService';
import { declareManagerList } from '@/api/taxModule';
import { itemCodeList } from './staticList';
import RejectReasonDialog from './rejectReasonDialog';
export default {
  data: () => ({
    activeName: '-1',
    tabList: [
      { label: '全部', value: '-1' },
      { label: '待提交资料', value: 'TOBE_SUBMITTED' },
      { label: '待授权', value: 'TOBE_AUTHORIZED' },
      { label: '待提交申报', value: 'TOBE_DECLARED' },
      { label: '待缴纳税金', value: 'TOBE_TAXES' },
    ],
    workForm: {
      size: 10,
      current: 1,
    },
    workTotal: 0,
    tableLoading: false,
    pagination: {},
    workList: [],
    uploadText: {
      2: '上传转代理资料',
      5: '上传注册资料',
      23: '上传注册资料',
      7: '上传稽查资料',
      6: '上传资料',
      24: '上传退税资料',
      13: '完善海牙信息',
      31: '上传资料',
      32: '上传资料',
      106: '上传资料',
      16: '上传资料',
      20: '上传资料',
      3101: '上传资料',
      3102: '上传资料',
      3103: '上传资料',
      3104: '上传资料',
      3105: '上传资料',
      3106: '上传资料',
      3107: '上传资料',
      3108: '上传资料',
    },
    columns: [
      {
        title: '待办事项',
        key: 'itemCode',
        scopedSlots: { customRender: 'itemCode' },
        width: 110,
      },
      {
        title: '公司名称',
        dataIndex: 'companyNameZh',
        key: 'companyNameZh',
        ellipsis: true,
        width: 120,
      },
      {
        title: '国家',
        dataIndex: 'countryNameZh',
        key: 'countryNameZh',
        ellipsis: true,
        width: 80,
      },
      {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
        ellipsis: true,
      },
      {
        title: '服务号',
        dataIndex: 'serviceNo',
        key: 'serviceNo',
        ellipsis: true,
      },
      {
        title: '申报周期',
        key: 'taxDeclarationDeadline',
        showTypes: ['TOBE_DECLARED', 'TOBE_TAXES', 'TOBE_DECLARED_REJECT'],
        scopedSlots: { customRender: 'taxDeclarationDeadline' },
        width: 180,
      },
      {
        title: '缴纳金额',
        key: 'officialFee',
        showTypes: ['TOBE_EPR_REG_PAY', 'TOBE_TAXES', 'TOBE_DECLARED_REJECT'],
        scopedSlots: { customRender: 'officialFee' },
        width: 100,
      },
      {
        title: '驳回原因',
        dataIndex: 'reject.reason',
        key: 'reject',
        ellipsis: true,
        showTypes: ['TOBE_MATERIALS_REJECT', 'TOBE_DECLARED_REJECT'],
        width: 100,
      },
      // {
      //   title: '备注',
      //   dataIndex: 'remark',
      //   key: 'remark',
      //   width: 280,
      //   ellipsis: true,
      //   scopedSlots: { customRender: 'remark' },
      // },
      {
        title: '操作',
        key: 'operate',
        scopedSlots: { customRender: 'operate' },
        align: 'center',
        width: 150,
        fixed: 'right',
      },
    ],
    workOrderTodoList: [
      { label: '待提交资料', num: 0, key: 'materialsNum', searchType: 'TOBE_SUBMITTED' },
      { label: '资料被驳回', num: 0, key: 'materialsRejectNum', searchType: 'TOBE_MATERIALS_REJECT' },
      { label: 'EPR注册待缴费', num: 0, key: 'eprRegPayNum', searchType: 'TOBE_EPR_REG_PAY' },
      { label: '待续费服务', num: 0, key: 'renewNum' },
      { label: '待提交申报', num: 0, key: 'declareNum', searchType: 'TOBE_DECLARED' },
      { label: '申报被驳回', num: 0, key: 'declareRejectNum', searchType: 'TOBE_DECLARED_REJECT' },
      { label: '申报缴纳税金', num: 0, key: 'declareTaxationNum', searchType: 'TOBE_TAXES' },
      // { label: '待处理信件', num: 0, key: 'letterNum' },
    ],
    selectTodoItem: {},
    selectItemTab: '',
    todoTabs: [
      { label: 'VAT', num: 0, key: 'VAT', hiddenTypes: ['TOBE_EPR_REG_PAY'] },
      { label: 'EPR', num: 0, key: 'EPR' },
      { label: '英欧代', num: 0, key: 'COMPLIANCE', showTypes: ['TOBE_SUBMITTED'] },
    ],
    copyTodoTabs: [],
    rejectReasonDialog: false,
    checkItem: {},
  }),
  components: {
    RejectReasonDialog,
  },
  computed: {
    filterColumns() {
      return this.columns.filter(
        (item) => !item.showTypes || (item.showTypes.length && item.showTypes.includes(this.selectTodoItem.searchType))
      );
    },
    totalNum() {
      return this.workOrderTodoList.map((item) => item.num).reduce((a, b) => +a + +b, 0);
    },
  },
  filters: {
    filterItemCode(itemCode, searchType) {
      return itemCodeList[searchType][itemCode];
    },
  },
  async mounted() {
    await this.getWorkNum();
    this.selectTodo(this.workOrderTodoList[0]);
  },
  methods: {
    handleTableChange(pagination) {
      this.research(pagination.current);
    },
    research(current) {
      this.pagination.current = current;
      this.workForm.current = current;
      this.getWorkTodoList();
    },
    //获取待办工单的列表
    getWorkTodoList() {
      this.tableLoading = true;
      pageWorkOrderTodo({
        ...this.workForm,
        searchType: this.selectTodoItem.searchType,
        serviceCode: this.selectItemTab,
      }).then((res) => {
        if (res.code === 0) {
          this.workList = res.data.records;
          this.workTotal = Number(res.data.total);
          this.tableLoading = false;
          const pagination = { ...this.pagination };
          pagination.total = Number(res.data.total);
          this.pagination = pagination;
        }
      });
    },
    async getOtherNum() {
      // let { letterNum } = await this.getLetterNum();
      let { renewNum } = await this.getRenewNum();
      this.workOrderTodoList.forEach((item) => {
        switch (item.key) {
          case 'letterNum':
            item.num = letterNum;
            break;
          case 'renewNum':
            item.num = renewNum;
            break;
        }
      });
    },
    // 获取待处理信件数
    getLetterNum() {
      return new Promise((resolve) => {
        letterList({
          processStatus: '1',
        }).then((res) => {
          if (res.code === 0) {
            resolve({ letterNum: res.data.total });
          }
        });
      });
    },
    // 获取待续费服务数
    getRenewNum() {
      return new Promise((resolve) => {
        renewalList().then((res) => {
          if (res.code === 0) {
            resolve({ renewNum: res.data.total });
          }
        });
      });
    },
    selectTodoFn(todoItem) {
      if (todoItem.searchType) {
        this.selectTodo(todoItem);
      } else {
        this.turnTo(todoItem);
      }
    },
    turnTo(todoItem) {
      switch (todoItem.key) {
        case 'letterNum': // 待处理信件
          this.$router.push({
            path: '/varletters',
          });
          break;
        case 'renewNum': // 待续费服务
          this.$router.push({
            path: '/renewal',
          });
          break;
      }
    },
    //获取工单数量
    getWorkNum() {
      return new Promise((resolve) => {
        workOrderTodoNum().then((res) => {
          if (res.code === 0) {
            this.workOrderTodoList.forEach((todoItem) => {
              if (todoItem.searchType) {
                let temp = res.data[todoItem.key];
                if (temp) {
                  todoItem.num = Object.values(temp).reduce((a, b) => a + b, 0);
                  todoItem.tabs = temp;
                }
              }
            });
            this.getOtherNum();
            resolve();
          }
        });
      });
    },
    // 点击待办事项
    selectTodo(todoItem) {
      this.selectTodoItem = todoItem;
      this.todoTabs.forEach((item) => {
        let todoTabNum = todoItem.tabs[item.key];
        item.num = todoTabNum || 0;
      });
      this.copyTodoTabs = this.todoTabs.filter((item) => item.num);
      if (this.copyTodoTabs.length) {
        let key = this.copyTodoTabs[0].key;
        this.activeName = key;
        this.selectTab(key);
      } else {
        let key = this.todoTabs[0].key;
        this.activeName = key;
        this.selectTab(key);
      }
    },
    // 查看驳回原因
    checkRejectReason(row) {
      this.checkItem = row;
      this.rejectReasonDialog = true;
    },
    // 点击待办事项二级
    selectTab(key) {
      this.selectItemTab = key;
      this.getWorkNum();
      this.research(1);
    },
    // 待提交资料
    compareDate(d1) {
      return new Date(d1.replace(/-/g, '\/')) > new Date('2023/07/06 22:30:00');
    },
    toSubAgent(row) {
      let functionCode = Number(row.productFunctionCode);
      let subJson = {
        id: row.workId,
        serviceId: row.id,
        serviceNo: row.serviceNo,
        countryCode: row.countryCode,
        countryNameZh: row.countryNameZh,
        cureentNodeCode: row.cureentNodeCode,
      };
      let detailsJosn = {
        status: row.cureentNodeCode,
        countryNameZh: row.countryNameZh,
        serviceId: row.id,
        serviceName: row.serviceName,
        serviceNo: row.serviceNo,
      };
      //OCR版本提交资料参数
      let newSubJson = {
        id: row.workId,
        serviceNo: row.serviceNo,
      };

      switch (functionCode) {
        case 1:
          this.toDeclare(row);
          break;
        case 2:
          if (row.countryCode === 'DE' && this.compareDate(row.flowCreateTime)) {
            // let path = row.progressBar === 2 && row.isP2p ? '/registerInfo/rejectInfo' : '/registrationInformation';
            let path = '/registrationInformation';
            this.$router.push({
              path,
              query: newSubJson,
            });
          } else {
            this.$router.push({
              path: '/turnToAgent',
              query: subJson,
            });
          }
          break;
        case 5:
          if (row.countryCode === 'DE' && this.compareDate(row.flowCreateTime)) {
            // let path = row.progressBar === 2 && row.isP2p ? '/registerInfo/rejectInfo' : '/registrationInformation';
            let path = '/registrationInformation';
            this.$router.push({
              path,
              query: newSubJson,
            });
          } else {
            this.$router.push({
              path: '/registerInfo',
              query: subJson,
            });
          }
          break;
        case 23:
          this.$router.push({
            path: '/registerInfo',
            query: subJson,
          });
          break;
        case 7:
          this.$router.push({
            path: '/taxInspection',
            query: subJson,
          });
          break;
        case 6:
          this.$router.push({
            path: '/cancelTaxNum',
            query: { ...subJson, status: row.progressBar },
          });
          break;
        case 13:
          this.$router.push({
            path: '/hagueInformation',
            query: {
              id: row.workId,
              status: row.progressBar,
              serviceId: row.id,
              serviceNo: row.serviceNo,
              productFunctionCode: row.productFunctionCode,
              supplierId: row.supplierId,
            },
          });
          break;
        case 24:
          this.$router.push({
            path: '/taxRefund',
            query: {
              id: row.workId,
              serviceId: row.id,
              countryCode: row.countryCode,
              cureentNodeCode: row.cureentNodeCode,
              progressBar: row.progressBar,
            },
          });
          break;
        case 31:
        case 3101:
        case 3102:
        case 3103:
        case 3104:
        case 3105:
        case 3106:
        case 3107:
        case 3108:
          this.$router.push({
            path: '/complianceBusiness/manageDetails',
            query: detailsJosn,
          });
          break;
        case 32:
          this.$router.push({
            path: '/complianceBusiness/EPRDetails',
            query: detailsJosn,
          });
          break;
        case 106:
          this.$router.push({
            path: '/complianceBusiness/addCategoryBrandDetails',
            query: detailsJosn,
          });
          break;
        case 107:
          this.$router.push({
            path: '/complianceBusiness/addCategoryBrandDetails',
            query: detailsJosn,
          });
          break;
        case 16:
          if (row.cureentNodeCode == 'NODE0066') {
            this.$router.push({
              path: '/complianceBusiness/filingDetails',
              query: {
                status: row.cureentNodeCode,
                countryNameZh: row.countryNameZh,
                serviceId: row.id,
              },
            });
          } else {
            this.$router.push({
              path: '/complianceBusiness/manageDetails',
              query: detailsJosn,
            });
          }
          break;
        case 20:
          this.$router.push({
            path: '/otherServicesDetail',
            query: { id: row.id, progressBar: row.progressBar },
          });
          break;
      }
    },
    // 待提交申报
    toDeclare(row) {
      if (row.productFunctionCode === '1') {
        declareManagerList({
          page: 1,
          limit: 10,
          companyName: row.companyNameZh,
          taxNumber: row.vatTaxNumber,
          beginTime: row.beginTime,
          endTime: row.endTime,
          // status: 10,
        }).then((res) => {
          if (res.code === 0) {
            row = res.data.records.filter((item) => item.serviceId === row.id)[0];
            // row = res.data.records[0];
            // if (row.status == 10 || row.status == 18) {
            if (row.countryCode === 'GB') {
              this.authorization(row);
            } else {
              this.$router.push({
                path: '/filingManagement/computedTax',
                query: {
                  servicesId: row.serviceId,
                  countryCode: row.countryCode,
                  periodType: row.declarePeriod,
                  beginTime: row.beginTime,
                  endTime: row.endTime,
                  workId: row.id,
                  companyNameEn: row.companyNameEn,
                  companyNameZh: row.companyNameZh,
                  productFunctionCode: row.regProductFunctionCode,
                  taxDeclarationDeadline: row.taxDeclarationDeadline,
                  vatTaxNumber: row.vatTaxNumber,
                },
              });
            }
            // }
          }
        });
      } else {
        this.$router.push({
          path: '/complianceBusiness/EPRDeclareDetails',
          query: {
            serviceNo: row.serviceNo,
            serviceName: row.serviceName,
            workNo: row.workNo,
          },
        });
      }
    },
    // 缴纳税金
    toPaymentTax(row) {
      if (row.productFunctionCode === '1') {
        this.$router.push({
          path: '/filingManagement',
          query: {
            key: '13',
          },
        });
        return;
      } else {
        this.$router.push({
          path: '/complianceBusiness/EPRList',
          query: {
            currentNode: 'NODE0365',
          },
        });
      }
    },
    authorization(row) {
      isAuthorized({
        vatTaxNumber: row.taxNumber,
        // serviceId: row.serviceId,
        workOrderId: row.id,
      }).then((res) => {
        if (res.data) {
          row.from = 'fromRedBtn';
          this.$store.commit('getDeclareInfo', row);
          window.sessionStorage.setItem('DeclareInfoGB', JSON.stringify(row));
          this.$router.push({
            path: '/filingData?',
            query: {
              index: 0,
              workId: row.id,
            },
          });
        } else {
          this.$Message.error('您还没授权，请联系客服进行授权');
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.table-content {
  background: #ffffff;
  margin-bottom: 21px;
  .table-title {
    font-size: 16px;
    font-weight: 400;
    line-height: 50px;
    border-bottom: 1px #e9e9e9 solid;
    padding-left: 32px;
    margin-bottom: 0;
  }
  .table-box {
    padding: 0 32px;
  }
  .operate {
    cursor: pointer;
    text-align: center;
    font-weight: 500;
    padding-top: 2px;
    img {
      width: 11px;
      margin-bottom: 2px;
    }
    .btF {
      min-width: 124px;
      color: #3a7fff;
    }
    .btF.flex-center {
      min-width: 124px;
      img {
        width: 18px;
      }
    }
    .red-button {
      color: #ed3e3e;
      border-color: #ed3e3e;
    }
    .upload-btn {
      // margin-right: 10px;
      // border-color: #16ade9;
      // color: #16ade9;
      // background-color: #fff;
      img {
        width: 18px;
        // height: 18px;
      }
    }
    .btR {
      min-width: 124px;
      background: #ed3e3e;
    }
  }
}

.todo-wrapper {
  display: flex;
  align-items: center;
  padding: 21px 0;

  .circle-custom-wrapper {
    flex: 0 0 171px;
    position: relative;
    &::after {
      position: absolute;
      content: '';
      width: 1px;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.06);
      top: 0;
      right: -41px;
    }
    .Circle-custom {
      color: rgba(0, 0, 0, 0.85);

      &-title1 {
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        &-unit {
          font-size: 19px;
          font-weight: normal;
        }
      }
      &-title2 {
        font-size: 16px;
        line-height: 20px;
      }
      &-title3 {
        font-size: 19px;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }
  .todo-wrapper-right {
    width: 100%;
    margin-left: 84px;
    .todo-list {
      &:nth-child(-n + 4) {
        margin-bottom: 13px;
      }
      .todo-item {
        width: 155px;
        padding: 8px 21px;
        display: flex;
        flex-direction: column;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.4);
        border-radius: 5px;
        cursor: pointer;
        &-num {
          font-size: 21px;
          font-weight: bold;
          margin-top: 6px;
          color: #000000;
        }
        &-active {
          background-color: rgba(24, 144, 255, 0.06);
        }
      }
    }
  }
}
.todo-item-tab-wrapper {
  margin: 30px 0 20px 20px;
  line-height: 28px;
  .todo-item-tab {
    padding: 5px 10px;
    background-color: #f5f5f5;
    border: 1px solid #f5f5f5;
    border-radius: 20px;
    margin-right: 15px;
    cursor: pointer;
    &-active {
      background-color: #fff;
      color: #639fff;
      border-color: #639fff;
    }
  }
}
.tag-wrapper {
  display: flex;
  align-items: center;
}
.tag {
  flex: 0 0 auto;
}
</style>
