<template>
  <div>
    <div class="commontitle">申报工作台</div>
    <div class="content">
      <div class="title">
        <span class="label">服务号/工单号</span>
        <Input
          v-model="searchForm.searchKeyword"
          clearable
          placeholder="请输入注册主体名称/服务号"
          style="width: 200px; margin-right: 32px"
        />
        <span class="label">公司中文名称</span>
        <Input
          v-model="searchForm.companyNameZh"
          clearable
          placeholder="请输入公司中文名称"
          style="width: 200px; margin-right: 32px"
        />
        <span class="label">国家</span>
        <Select
          v-model="searchForm.countryCode"
          placeholder="请选择国家"
          style="width: 180px; margin-right: 32px"
          clearable
        >
          <Option value="FR">法国</Option>
          <Option value="DE">德国</Option>
          <Option value="ES">西班牙</Option>
        </Select>
        <span class="label">业务分类</span>
        <Select
          v-model="searchForm.type"
          placeholder="请选择业务分类"
          style="width: 180px; margin-right: 32px"
          clearable
        >
          <Option :value="1">WEEE申报</Option>
          <Option :value="2">包装法申报</Option>
          <Option :value="3">电池法申报</Option>
        </Select>

        <Button type="primary" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
        <Button @click="handleReset" style="margin-left: 10px">重置</Button>
        <p style="margin-top: 20px">
          <span class="label">服务状态</span>
          <RadioGroup v-model="searchForm.serviceStatus" @on-change="getList">
            <Radio v-for="(item, index) in statusList" :label="item.value" class="statusStyle" :key="index" border>
              {{ item.label }}
            </Radio>
          </RadioGroup>
        </p>
      </div>
      <div class="tabs-box">
        <div :class="statusIndex == 'undefined' ? 'active' : ''" @click="changeStatus('undefined')">全部</div>
        <div
          @click="changeStatus(node.nodeCode)"
          :class="statusIndex === node.nodeCode ? 'active' : ''"
          v-for="node in nodeList"
          :key="node.nodeId"
        >
          {{ node.nodeName }}
        </div>
      </div>
      <div class="table1">
        <Table
          :style="{ 'min-height': registerList.length == 0 ? '184px' : '' }"
          :no-data-text="'暂无处理事项'"
          :columns="columns"
          :data="registerList"
          :loading="tableLoading"
        >
          <template slot="operate" slot-scope="{ row }" style="color: #16ade9">
            <div>
              <div @click.stop="toRegister(row)" class="btF" style="color: #f79728" v-if="row.status == 1">
                <img
                  src="@/assets/images/survey/shangchuan1.svg"
                  style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                />
                <span>提交资料</span>
              </div>

              <div class="btF" @click.stop="toRegister(row)" style="color: #515b6e" v-if="row.status != 1">
                <img
                  src="@/assets/images/survey/detail.svg"
                  style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                />
                <span> {{ row.status == 2 ? '补缴费用' : '查看' }}</span>
              </div>

              <div>
                <span
                  class="btF text-blue"
                  type="text"
                  @click="uploadTaxDeclareReceipt(row.declareReceipt)"
                  v-if="row.declareReceipt && row.status == 8"
                >
                  <img src="@/assets/images/survey/uploadBlue.png" alt style="vertical-align: text-bottom" />
                  下载回执
                </span>
              </div>
            </div>
          </template>
        </Table>
        <div style="margin-top: 30px; text-align: right">
          <Page :total="total" :page-size="searchForm.limit" :current="searchForm.page" @on-change="pageChange" />
        </div>
      </div>
    </div>
    <div style="height: 1px"></div>

    <DeclareReceiptDialog :showDeclareReceipt="showDeclareReceipt" :declareReceiptList="declareReceiptList" />
  </div>
</template>

<script>
import { getEPRNodes, EPRDeclareList } from '@/api/taxModule';
import cacheQuery from './../../../xcloud-client-components-web/mixin/cacheQuery';
import { EPRdeclareSuccess } from '@comp/api/eprManage';
import DeclareReceiptDialog from './components/declareReceiptDialog';
import moment from 'moment';
export default {
  data() {
    const that = this;
    return {
      searchForm: {
        searchKeyword: '',
        currentNode: '',
        countryCode: '',
        companyNameZh: '',
        serviceStatus: '',
        page: 1,
        limit: 10,
      },
      cacheKey: 'searchForm',
      statusIndex: 'undefined',
      showDeclareReceipt: false,
      declareReceiptList: [],
      columns: [
        {
          title: '服务号',
          key: 'serviceNo',
          width: 170,
        },
        {
          title: '工单号',
          key: 'workNo',
          width: 170,
        },
        {
          title: '公司名称',
          key: 'companyNameZh',
          width: 180,
          tooltip: true,
          render(h, params) {
            let type = '暂未填写';

            type = params.row.companyNameZh;
            return h(
              'Tooltip',
              {
                props: {
                  placement: 'top',
                  content: type,
                  maxWidth: '200px',
                },
                style: {
                  cursor: 'pointer',
                  'white-space': 'nowrap',
                  overflow: 'hidden',
                  'text-overflow': 'ellipsis',
                  '-webkit-box-orient': 'vertical',
                },
              },
              type
            );
          },
        },
        {
          title: '业务分类',
          key: 'country',
          width: 80,
          render(h, params) {
            let typeStr =
              params.row.type == 1
                ? 'WEEE申报'
                : params.row.type == 2
                ? '包装法申报'
                : params.row.type == 3
                ? '电池法申报'
                : '';
            return h('span', typeStr);
          },
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80,
        },
        {
          title: '服务名称',
          key: 'serviceName',
          minWidth: 90,
        },
        {
          title: '周期类型',
          key: 'declarePeriod',
          render(h, params) {
            let declarePeriodStr =
              params.row.declarePeriod == 0
                ? '月报'
                : params.row.declarePeriod == 1
                ? '季报'
                : params.row.declarePeriod == 2
                ? '年报'
                : '';
            return h('span', declarePeriodStr);
          },
          width: 80,
        },
        {
          title: '申报区间',
          key: 'due',
          render(h, params) {
            let declareTime = '-';
            if (params.row.beginTime && params.row.endTime) {
              declareTime = params.row.beginTime.slice(0, 10) + '-' + params.row.endTime.slice(0, 10);
            }
            return h('span', declareTime);
          },
          width: 126,
        },
        {
          title: '服务截止日期',
          key: 'due',
          render(h, params) {
            let endTime = params.row.due ? params.row.due.slice(0, 10) : '';
            return h('span', endTime);
          },
          width: 126,
        },
        {
          title: '服务进度',
          key: 'status',
          render(h, params) {
            const allList = [...that.nodeList, ...that.exNodeList];
            let result = allList.find((item) => item.nodeCode === params.row.status);
            result = result ? result.nodeName : '';
            return h('span', result);
          },
          minWidth: 120,
        },
        {
          title: '操作',
          slot: 'operate',
          width: 200,
        },
      ],
      tableLoading: false,
      registerList: [],
      total: 0,
      nodeList: [
        // { nodeCode: 0, nodeName: '未开始' },
        { nodeCode: 1, nodeName: '待上传资料' },
        { nodeCode: 10, nodeName: '款项待确认' },
        { nodeCode: 2, nodeName: '待补缴' },
        { nodeCode: -1, nodeName: '待申报' },
        { nodeCode: 7, nodeName: '申报中' },
        { nodeCode: 8, nodeName: '申报完成' },
      ],
      exNodeList: [
        { nodeCode: 3, nodeName: '待申报-客户已补缴' },
        { nodeCode: 4, nodeName: '待申报-客户未补缴' },
        { nodeCode: 5, nodeName: '待申报-客户未超额' },
        { nodeCode: 6, nodeName: '待申报-客户未提交' },
      ],
      nodeEnum: {
        WAIT_UPLOAD: 'NODE0060', //待上传资料
        WAIT_REVIEW: 'NODE0061', //待审核资料
        REVIEWED: 'NODE0062', //已审核
        WAIT_AUTHORIZE: 'NODE0063', //待授权
        AUTHORIZE_WAIT_CONFIRM: 'NODE0064', //授权待确认
        REGISTERING: ['NODE0065', 'NODE0265'], //转代理中
        REGISTER_COMPLETE: ['NODE0066', 'NODE0266'], //转代理完成
      },
      statusList: [
        { label: '全部', value: '' },
        { label: '正常', value: 1 },
        { label: '取消中', value: 11 },
        { label: '已取消', value: 9 },
      ],
      allStatusList: [
        { label: '全部', value: '' },
        { label: '正常', value: 1 },
        { label: '取消中', value: 11 },
        { label: '已取消', value: 9 },
        { label: '税号注销', value: 3 },
        { label: '已转出', value: 4 },
        { label: '已续费', value: 12 },
        { label: '确认转出', value: 13 },
      ],
    };
  },
  mixins: [cacheQuery],
  components: {
    DeclareReceiptDialog,
  },
  methods: {
    handleSubmit() {
      this.searchForm.page = 1;
      this.getList();
    },
    handleReset() {
      this.searchForm = {
        searchKeyword: '',
        currentNode: '',
        countryCode: '',
        page: 1,
        limit: 10,
        serviceStatus: '',
      };
      this.removePageCache();
    },
    uploadTaxDeclareReceipt(declareReceipt) {
      const declareList = declareReceipt.split(',');

      if (declareList.length > 1) {
        this.declareReceiptList = declareList;
        this.showDeclareReceipt = true;
      } else {
        let url = this.replaceHttp(declareReceipt);

        window.open(url);
      }
    },
    replaceHttp(str) {
      return str.replace('http://', 'https://');
    },
    async toRegister(row) {
      // 待上传资料 如果是最后一期. 则要判断前面几期必须大于待申报状态, 才能申报
      if (row.status === 1 && row.endTime.includes('12-31')) {
        this.tableLoading = true;
        const res = await EPRdeclareSuccess({ workNo: row.workNo }).finally(() => {
          this.tableLoading = false;
        });
        // 不在待申报及以后的状态 排除以下条件: exNodeList: 待申报状态, 7 申报中 8 申报完成
        const waitDeclareArr = this.exNodeList.map(item=>item.nodeCode).concat([7, 8])
        const fliterArr = res.data.filter(item=> !waitDeclareArr.includes(item.status))
        if (fliterArr.length) {
          const arr = fliterArr.map((item) => moment(item.beginTime).format('YYYY-MM-DD') + ' - ' + moment(item.endTime).format('YYYY-MM-DD'));
          this.$warning({
            title: '请先完成以下区间申报',
            content: (
              <div>
                {arr.map((v) => {
                  return <div>{v}</div>;
                })}
              </div>
            ),
          });
          return;
        }
      }
      let path = '/complianceBusiness/EPRDeclareDetails';
      this.$router.push({
        path,
        query: {
          // status: row.currentNodeCode,
          // countryNameZh: row.country,
          serviceNo: row.serviceNo,
          serviceName: row.serviceName,
          workNo: row.workNo,
        },
      });
    },
    pageChange(page) {
      this.searchForm.page = page;
      this.getList();
    },
    changeStatus(nodeCode) {
      if (nodeCode == 'undefined') {
        this.searchForm.status = '';
      } else {
        this.searchForm.status = nodeCode;
      }
      this.statusIndex = nodeCode;
      this.searchForm.page = 1;
      this.getList();
    },
    getList() {
      this.searchForm.enterpriseId = 29;
      this.setPageCache();
      EPRDeclareList(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
        }
      });
    },
    // getNodes() {
    //   getEPRNodes().then((res) => {
    //     if (res.code === 0) {
    //       this.nodeList = res.data;
    //     }
    //   });
    // },
  },
  created() {
    this.getPageCache();
    this.getList();

    // this.getNodes();
  },
};
</script>

<style lang="less" scoped>
.statusStyle {
  width: 80px;
  margin-right: 10px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  border-radius: 5px !important;
}
/deep/ .ivu-radio {
  display: none;
}
/deep/ .ivu-table-tip {
  table {
    min-height: 184px;
    font-size: 12px;
  }
}
/deep/ .ivu-tooltip-rel {
  max-width: 150px;
  display: block;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // -webkit-box-orient: vertical;
}
/deep/ .ivu-table-row {
  th,
  td {
    text-align: center;
    font-size: 12px;
  }
}
/deep/ .ivu-table-header {
  th {
    text-align: center;
    font-weight: 600;
    color: #333;
    font-size: 12px;
  }
}
.head {
  background-color: #ffffff;
  padding: 12px 32px;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
.content {
  border-radius: 4px;
  margin: 24px;
  min-height: 800px;
  background-color: #ffffff;
  .title {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 20px 24px 0;
    background-color: #ffffff;
    .label {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #666666;
      margin-right: 6px;
    }
  }
  .table1 {
    padding: 24px;
    .btF {
      cursor: pointer;
    }
  }
  .tabs-box {
    border-bottom: 1px solid #f6f6f6;
    padding-left: 24px;
    display: flex;
    margin-top: 20px;
    div {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333;
      margin-right: 42px;
      padding-bottom: 6px;
      cursor: pointer;
      &.active {
        color: #1890ff;
        border-bottom: 2px solid #1890ff;
      }
    }
  }
}
</style>
