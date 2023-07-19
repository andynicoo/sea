<template>
  <div>
    <div class="head">
      <div>
        <div style="padding-left: 32px">
          <span class="left">预申报详情</span>
          <span class="right">（ {{ orderServices.serviceName }} ）</span>
        </div>
        <!-- 顶部服务状态图 -->
        <div class="statusItem" style="margin: 20px auto; width: 70%">
          <Steps :current="orderStatus">
            <Step v-for="(item, index) in nodeList" :title="item.label" :key="index"></Step>
          </Steps>
        </div>

        <div class="tabTitle">
          <span :class="{ 'active-tab': pageType == 2 }">预申报资料</span>
        </div>
      </div>
    </div>
    <div v-if="pageType == 2" class="main">
      <div class="declare-info">
        <span
          class="btF upload-btn"
          type="text"
          @click="uploadTaxDeclareReceipt(eprDeclare.declareReceipt)"
          v-if="eprDeclare.declareReceipt"
        >
          <img src="@/assets/images/survey/uploadBlue.png" alt />
          查看回执
        </span>

        <DynamicForm
          :moduleList="dataReview"
          :showBtn="isEdit"
          :isCancel="isCancel"
          @formCancel="isEdit = false"
          :isEdit="isEdit"
          :showSave="isEdit"
          :showSubmit="isEdit"
          :isOld="true"
        />
      </div>
    </div>

    <DeclareReceiptDialog :showDeclareReceipt="showDeclareReceipt" :declareReceiptList="declareReceiptList" />
  </div>
</template>

<script>
import { getPreDeclareDetailAPI } from '@/api/preDeclare.js';

import TopSpeed from '../components/topSpeed.vue';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import EprAuthorizer from '../components/eprAuthorizer.vue';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import DeclareReceiptDialog from '../components/declareReceiptDialog';

export default {
  components: {
    TopSpeed,
    DynamicForm,
    // BatteryProductDtos,
    EprAuthorizer,
    DeclareReceiptDialog,
  },
  mixins: [isServiceCancel],
  data() {
    return {
      showSubmit: true, //表单提交按钮
      showSave: true, //表单保存按钮
      status: '',
      showDeclareReceipt: false,
      workNo: this.$route.query.workNo,
      pageType: 2,

      nodeList: [
        { label: '待预申报', value: 0 },
        { label: '预申报中', value: 1 },
        { label: '预申报完成', value: 2 },
      ],
      orderServices: {},
      moduleList: [],
      serviceInfo: {},

      eprDeclare: {},
      declareReceiptList: [],
      // epr
      eprWorkOrderInfo: {},
    };
  },
  computed: {
    isEdit() {
      return false;
    },
    orderStatus() {
      let index = this.nodeList.findIndex((item) => item.value === this.eprDeclare.status);
      return index ? index : 0;
    },
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          this.$set(item, 'disabled', true);
        });
      });
      return this.moduleList;
    },
  },
  methods: {
    getDetail() {
      let data = {
        workNo: this.workNo,
      };
      getPreDeclareDetailAPI(data).then((res) => {
        if (res.code === 0) {
          this.orderServices = res.data.orderServicesVO;
          this.eprDeclare = res.data.eprDeclare;
          this.ifCancel(res.data.orderServicesVO.status);
          this.serviceInfo = res.data.orderServices;

          if (res.data.dataReview.length > 0) {
            this.moduleList = res.data.dataReview;
          }
          this.status = res.data.nodeCode;

          this.eprWorkOrderInfo = res.data.eprWorkOrder;
        }
      });
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
  },
  created() {
    this.getDetail();
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.main {
  padding: 20px;
}

/deep/ .ivu-table-header {
  th {
    font-weight: 600;
    color: #333;
  }
}
/deep/ .ivu-table {
  td {
    padding-top: 16px;
    padding-bottom: 16px;
  }
}

.head {
  padding: 16px 0 0;
  background-color: #fff;
  .left {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .right {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
  .tabTitle {
    border-bottom: 1px solid #e9e9e9ff;
    padding-left: 32px;
    // margin-top: -18px;
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      font-family: PingFangSC;
      color: #333333;
      line-height: 40px;
      margin-right: 46px;
      cursor: pointer;
    }
    .active-tab {
      color: #1890ffff;
      border-bottom: 2px solid #1890ffff;
      font-weight: 500;
    }
  }
}
/deep/ .ivu-form-item-label {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  // float: none;
}
/deep/ .ivu-radio-group {
  margin-top: 4px;
}
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.upload-file {
  margin: 24px;
  .btn-grop {
    text-align: center;
    margin-top: 24px;
    padding-bottom: 24px;
  }
}
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    font-size: 16px;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    // float: none;
  }
  .ivu-form-item-content {
    width: 100%;
  }
}

.download {
  color: #02a7f0;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-block;
}
.btF {
  color: #6ed2f5;
  display: inline-block;
  margin: 20px 0 20px 10px;
  font-size: 16px;
  cursor: pointer;
  img {
    vertical-align: middle;
  }
}
.declare-info {
  background: #fff;
}
</style>
