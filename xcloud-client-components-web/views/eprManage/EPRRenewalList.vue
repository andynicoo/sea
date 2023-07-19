<template>
  <div>
    <div class="commontitle">服务单管理</div>
    <div class="content">
      <div class="title">
        <span class="label">公司名称/服务号</span>
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
          placeholder="请输入"
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
          v-model="searchForm.functionCode"
          placeholder="请选择业务分类"
          style="width: 180px; margin-right: 32px"
          clearable
        >
          <Option :value="item.value" v-for="(item, index) in productFunctionList" :key="index">{{
            item.label
          }}</Option>
        </Select>

        <Button type="primary" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
        <Button @click="handleReset" style="margin-left: 10px">重置</Button>
        <p style="margin-top: 20px">
          <span class="label">服务状态</span>
          <RadioGroup v-model="searchForm.status" @on-change="getList">
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
        >
          <template slot="operate" slot-scope="{ row }" style="color: #16ade9">
            <div>
              <div class="btF">
                <Button class="btF" type="text" @click="showUploadModal(row)" v-if="row.nodeCode == 'NODE0365'">
                  <img src="@/assets/images/survey/uploadYellow.png" alt />
                  上传缴费凭证
                </Button>
              </div>
              <!-- <div class="btF">
                <Button
                  class="btF upload-btn"
                  type="text"
                  @click="onlinePayTax(row)"
                  v-if="row.nodeCode == 'NODE0365' && !row.paymentOrderNo"
                >
                  在线缴回收费
                </Button>

                <Button
                  class="btF upload-btn"
                  type="text"
                  @click="showPayProcessModal(row)"
                  v-if="row.nodeCode == 'NODE0365' && row.paymentOrderNo"
                >
                  查看支付进度
                </Button>
              </div> -->

              <div
                class="btF"
                v-if="row.nodeCode !== 'NODE0361' && row.flowId"
                @click.stop="toRegister(row)"
                style="color: #515b6e;display: flex; align-items: center;width: 50px;margin: auto;"
              >
                <img
                  src="@/assets/images/survey/detail.svg"
                  style="width: 20px; position: relative;  margin-right: 2px"
                />
                <span>查看</span>
              </div>

            <div class="btF">
                <Button
                  class="btF upload-btn"
                  type="text"
                  @click.stop="toRegister(row)"
                  v-if="row.nodeCode == 'NODE0361'"
                >
                  待提交续费申请
                </Button>
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

    <UploadVoucherDialog :showUpload.sync="showUpload" :detailData="detailData" @uploadFile="uploadFile" />
  </div>
</template>

<script>
import { getEPRNodes, EPRManageList, createOrderEpr } from '@/api/taxModule';
import { newProductInfo } from '@/api/shoppingCar/shoppingCar';
import { getPayProgress } from '@/api/taxBureauService/taxBureauService';
import UploadVoucherDialog from './components/uploadVoucherDialog';

import { getEprRenewalListAPI, getEprNodeListAPI, uploadPaymentVoucherAPI } from './../../api/eprManage';

export default {
  data() {
    return {
      searchForm: {
        searchKeyword: '',
        currentNode: '',
        countryCode: '',
        functionCode: '',
        status: '1',
        page: 1,
        limit: 10,
      },
      fileUpload: this.ImgUrl,
      showPayTax: false,
      showPayProcess: false,
      showUpload: false,
      payChannel: '',
      statusIndex: 'undefined',
      productFunctionList: [
        { label: '电池法', value: 3131 },
        { label: '包装法', value: 3132 },
        { label: '纺织法', value: 3133 },
        { label: '家具法', value: 3134 },
        { label: '印刷法', value: 3135 },
        { label: '轮胎法', value: 3136 },
        { label: '玩具法', value: 3137 },
        { label: 'WEEE', value: 3138 },
      ],
      columns: [
        {
          title: '服务号',
          key: 'serviceNo',
          width: 170,
        },
        {
          title: '注册服务号',
          key: 'parentServiceNo',
          width: 170,
        },
        {
          title: '公司名称',
          key: 'companyNameZh',
          width: 180,
        },
        {
          title: '业务分类',
          key: 'productFunctionCodeName',
          width: 80,
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80,
        },
        {
          title: '服务名称',
          key: 'serviceName',
          width: 180,
          render: (h, params) => h('span', params.row.serviceName + '('+  params.row.specName +')')
        },
        {
          title: '年份',
          key: 'year',
          width: 80,
        },
        {
          title: '服务到期日期',
          key: 'expirationTime',
          render(h, params) {
            let endTime = params.row.expirationTime.slice(0, 10);
            return h('span', endTime);
          },
          width: 126,
        },
        {
          title: '服务进度',
          key: 'nodeCodeName',
          minWidth: 120,
        },
        {
          title: '操作',
          slot: 'operate',
          width: 300,
        },
      ],
      registerList: [],
      detailData: {
        bankPayInfosObj: {},
      },
      total: 0,
      nodeList: [],
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
        { label: '正常', value: '1' },
        { label: '取消中', value: '11' },
        { label: '已取消', value: '9' },
      ],
      fileList: [],
    };
  },
  components: {
    UploadVoucherDialog,
  },
  methods: {
    handleSubmit() {
      this.searchForm.page = 1;
      this.getList();
    },
    uploadFile(val) {
      // if (!this.fileList.length) {
      //   this.$Message.error('请上传文件');
      //   return;
      // }
      console.log(val);
      uploadPaymentVoucherAPI({
        serviceId: this.detailData.serviceId,
        voucherFiles: val,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('上传成功');
          this.getList();
          this.showUpload = false;
        }
      });
    },
    refreshPayProcess() {
      getPayProgress({
        payChannel: 'LIANLIANGLOBAL',
        workOrderId: this.detailData.eprId,
        thirdPaymentOauthId: this.detailData.thirdPaymentOauthId,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('获取支付进度成功');
            if (this.detailData.payStatus != res.data) {
              this.detailData.payStatus = res.data;
            }
            this.getList();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    payLian() {
      this.payChannel = 'LIANLIANGLOBAL';
    },
    async goPay() {
      if (!this.payChannel) {
        return this.$Message.error('请选择支付平台');
      }
      const params = {
        payChannel: this.payChannel,
        eprWorkOrderId: this.detailData.eprId,
      };
      createOrderEpr(params).then((res) => {
        if (res.code === 0) {
          this.showPayTax = false;
          this.getList();
          window.open(res.data.invoiceUrl);
        }
      });
    },
    onlinePayTax(row) {
      this.showPayTax = true;
      this.detailData = row;
      if (row.bankPayInfos) {
        this.detailData.bankPayInfosObj = JSON.parse(row.bankPayInfos);
      }
    },
    getProductInfo(row, functionCode, productName) {
      newProductInfo({
        functionCode,
        productName,
      }).then((res) => {
        console.log(res.data.records);
        if (res.data.records && res.data.records.length) {
          console.log(res.data.records[0]);

          this.$router.push({
            path: '/serviceDetail',
            query: {
              id: res.data.records[0].id,
              serviceId: row.serviceId,
              serviceType: 'EPR',
            },
          });
        }
      });
    },
    handleReset() {
      this.searchForm = {
        searchKeyword: '',
        currentNodeCode: '',
        countryCode: '',
        page: 1,
        limit: 10,
        status: '1',
      };
    },

    toRegister(row) {
      this.$router.push({
        path: '/complianceBusiness/EPRRenewalDetails',
        query: {
          serviceId: row.serviceId,
          workOrderId: row.workOrderId,
          flowId: row.flowId,
        },
      });
    },
    pageChange(page) {
      this.searchForm.page = page;
      this.getList();
    },
    changeStatus(nodeCode) {
      if (nodeCode == 'undefined') {
        this.searchForm.currentNodeCode = '';
      } else {
        this.searchForm.currentNodeCode = nodeCode;
      }
      this.statusIndex = nodeCode;
      this.searchForm.page = 1;
      this.getList();
    },
    showPayProcessModal(row) {
      this.showPayProcess = true;
      this.detailData = row;
      if (row.bankPayInfos) {
        this.detailData.bankPayInfosObj = JSON.parse(row.bankPayInfos);
      }
    },
    showUploadModal(row) {
      this.showUpload = true;
      this.detailData = row;
      if (row.bankPayInfos) {
        this.detailData.bankPayInfosObj = JSON.parse(row.bankPayInfos);
      }
    },
    getList() {
      getEprRenewalListAPI(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
        }
      });
    },
    getNodes() {
      getEprNodeListAPI({ functionCode: 3130 }).then((res) => {
        if (res.code === 0) {
          this.nodeList = res.data.filter((item) => item.nodeValue == 1);
        }
      });
    },
  },
  created() {
    this.getList();
    this.getNodes();
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
