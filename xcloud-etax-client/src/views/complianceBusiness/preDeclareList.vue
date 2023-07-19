<template>
  <div>
    <div class="commontitle">预申报工作台</div>
    <div class="content">
      <div class="title">
        <span class="label">服务号/工单号</span>
        <Input
          v-model="searchForm.searchKeyword"
          clearable
          placeholder="请输入服务号/工单号"
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
        </Select>

        <span class="label">业务分类</span>
        <Select
          v-model="searchForm.type"
          placeholder="请选择业务分类"
          style="width: 180px; margin-right: 32px"
          clearable
        >
          <Option :value="2">包装法</Option>
        </Select>

        <Button type="primary" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
        <Button @click="handleReset" style="margin-left: 10px">重置</Button>
        <!-- <p style="margin-top: 20px">
          <span class="label">服务状态</span>
          <RadioGroup v-model="searchForm.serviceStatus" @on-change="getList">
            <Radio v-for="(item, index) in statusList" :label="item.value" class="statusStyle" :key="index" border>
              {{ item.label }}
            </Radio>
          </RadioGroup>
        </p> -->
      </div>
      <div class="tabs-box">
        <div :class="statusIndex == 'undefined' ? 'active' : ''" @click="changeStatus('undefined')">全部</div>
        <div
          @click="changeStatus(node.value)"
          :class="statusIndex === node.value ? 'active' : ''"
          v-for="node in nodeList"
          :key="node.label"
        >
          {{ node.label }}
        </div>
      </div>
      <div class="table1">
        <Table
          :style="{ 'min-height': registerList.length == 0 ? '184px' : '' }"
          :no-data-text="'暂无处理事项'"
          :columns="columns"
          :data="registerList"
        >
          <template slot="operate" slot-scope="{ row }" style="color: #16ade9">
            <div>
              <div class="btF" @click.stop="toRegister(row)" style="color: #515b6e">
                <img
                  src="@/assets/images/survey/detail.svg"
                  style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                />
                <span>查看</span>
              </div>

              <span
                class="btF text-blue"
                type="text"
                @click="uploadTaxDeclareReceipt(row.declareReceipt)"
                v-if="row.declareReceipt"
              >
                <img src="@/assets/images/survey/uploadBlue.png" alt style="vertical-align: text-bottom" />
                查看回执
              </span>
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
import { getPreDeclareListAPI } from '@/api/preDeclare';
import { productInfo } from '@/api/shoppingCar/shoppingCar';

import DeclareReceiptDialog from './components/declareReceiptDialog';
export default {
  data() {
    return {
      searchForm: {
        searchKeyword: '',
        countryCode: '',
        serviceStatus: '',
        companyNameZh: '',
        page: 1,
        limit: 10,
      },
      statusIndex: 'undefined',

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
            if (params.row.shopNature == 2 && params.row.registrantName != '') {
              type = params.row.registrantName;
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
            } else if (params.row.companyNameZh != '') {
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
            } else {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                type
              );
            }
          },
        },
        {
          title: '业务分类',
          key: 'functionCodeDesc',
          width: 170,
          render(h, params) {
            let typeStr = params.row.type == 2 ? '包装法' : '';
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
          minWidth: 190,
        },
        {
          title: '申报周期',
          key: 'declarePeriod',
          width: 170,
          render(h, params) {
            let typeStr =
              params.row.declarePeriod == 0
                ? '月报'
                : params.row.declarePeriod == 1
                ? '季报'
                : params.row.declarePeriod == 2
                ? '年报'
                : '';
            return h('span', typeStr);
          },
        },
        {
          title: '申报区间',
          render(h, params) {
            let typeStr = params.row.beginTime + '-' + params.row.endTime;
            return h('span', typeStr);
          },
          width: 126,
        },
        {
          title: '服务截止日期',
          key: 'due',
          width: 126,
        },
        {
          title: '服务进度',
          render(h, params) {
            let statusStr =
              params.row.status == 0
                ? '待预申报'
                : params.row.status == 1
                ? '预申报中'
                : params.row.status == 2
                ? '预申报完成'
                : '';
            return h('span', statusStr);
          },
          minWidth: 120,
        },
        {
          title: '操作',
          slot: 'operate',
          width: 200,
        },
      ],
      declareReceiptList: [],
      showDeclareReceipt: false,
      registerList: [],
      total: 0,
      nodeList: [
        { label: '待预申报', value: 0 },
        { label: '预申报中', value: 1 },
        { label: '预申报完成', value: 2 },
      ],
      statusList: [
        { label: '全部', value: '' },
        { label: '正常', value: '1' },
        { label: '取消中', value: '11' },
        { label: '已取消', value: '9' },
      ],
    };
  },
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
        countryCode: '',
        status: '',
        type: '',
        page: 1,
        limit: 10,
      };
    },
    toRegister(row) {
      let path = '/complianceBusiness/preDeclareDetails';
      this.$router.push({
        path,
        query: {
          workNo: row.workNo,
        },
      });
    },
    pageChange(page) {
      this.searchForm.page = page;
      this.getList();
    },
    replaceHttp(str) {
      return str.replace('http://', 'https://');
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
      getPreDeclareListAPI(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
        }
      });
    },
  },
  created() {
    this.getList();
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
      .huibiao {
        display: inline-block;
        background-color: #ff5050;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        // width: 16px;
        padding: 0 5px;
        margin-left: 2px;
      }
    }
  }
}
/deep/ .ivu-tooltip-inner {
  white-space: break-spaces !important;
}
</style>
