<template>
  <div>
    <div v-if="submitStatus === 'SUCCESS'" class="container">
      <div class="flex-column content">
        <img src="@/assets/images/common/pay-success.png" alt />
        <div class="success">申报成功</div>
        <div class="box">
          <p class="title">申报信息</p>
          <Row>
            <Col :span="12">
              <span> <span class="left">申报国家：</span> {{ countryNameEn }}</span>
            </Col>
            <Col :span="12">
              <span> <span class="left">公司名称：</span>{{ companyName }}</span>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
              <span> <span class="left">申报时间：</span>{{ submitTime }}</span>
            </Col>
            <Col :span="12">
              <span> <span class="left">申报区间：</span>{{ beginTime.slice(0, 10) }}至{{ endTime.slice(0, 10) }}</span>
            </Col>
          </Row>
        </div>
        <div class="prompt">待税局确认后下发回执</div>
        <div class="deadLine">税金到账截止日期：{{ taxDeclarationDeadline }}（跨境支付有延迟，建议提前缴税）</div>
        <div class="boxBtns">
          <Button style="width: 200px; margin-top: 10px" @click="$router.replace('/work')">返回首页</Button>
        </div>
      </div>
      <div class="followContent flex-column">
        <div class="title">关注跨税云公众号，实时查看VAT进度</div>
        <div>
          <img src="@/assets/images/common/itaxQR.jpg" alt="" />
        </div>
      </div>
    </div>
    <SubmitConfirm
      v-else
      :submitStatus="submitStatus"
      :companyName="companyName"
      :countryNameEn="countryNameEn"
      :beginTime="beginTime"
      :endTime="endTime"
      :submitTime="submitTime"
      :failReason="failReason"
      @stopTimeDown="stopTimeDown"
    />
  </div>
</template>

<script>
import { taxInfo, downloadAffirm, TaxBureauStatus } from '@/api/taxModule';
import { forms } from '@/api/taxBureauService/taxBureauService';
import SubmitConfirm from '@/views/home/components/submitConfirm.vue';
export default {
  data() {
    return {
      workOrderId: this.$route.query.workOrderId,
      serviceId: this.$route.query.serviceId,
      declareRule: this.$route.query.declareRule,
      endTime: this.$route.query.endTime,
      beginTime: this.$route.query.beginTime,
      companyName: this.$route.query.companyName,
      countryNameEn: this.$route.query.countryNameEn,
      declareTime: this.$route.query.declareTime,
      taxDeclarationDeadline: this.$route.query.taxPaymentDeadline,
      checkStatus: this.$route.query.checkStatus,
      submitTime: '',
      status: this.$route.query.status || '',
      supplierId: '',
      submitStatus: '',
      stop: false,
      failReason: '',
    };
  },
  components: {
    SubmitConfirm,
  },
  created() {
    if (this.checkStatus === 'checkStatus') {
      this.getStatus();
    } else {
      this.submitStatus = 'SUCCESS';
    }
    // this.$parent.$children[1].getDeclareManagerCount();
    this.submitTime = this.set_time(this.declareTime);
    this.getTaxInfo();
  },
  methods: {
    stopTimeDown() {
      this.stop = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    getStatus() {
      this.timer = setTimeout(() => {
        TaxBureauStatus({
          id: this.workOrderId,
        }).then((res) => {
          if (res.code === 0) {
            this.submitTime = this.set_time(res.timestamp);
            this.taxDeclarationDeadline = res.data.taxPaymentDeadline;
            this.status = res.data.status || '';
            this.submitStatus = res.data.responseStatus === 'WAIT' ? 'SUBMIT' : res.data.responseStatus;
            if (['SUCCESS', 'FAIL'].includes(this.submitStatus)) {
              this.failReason = res.data.responseMessage;
              this.stopTimeDown();
            }
            if (['', 'SUBMIT'].includes(this.submitStatus) && !this.stop) {
              this.getStatus();
            }
          }
        });
      }, 4000);
    },
    downloadTaxSure() {
      if (this.countryNameEn == '西班牙' && this.supplierId == '43') {
        this.$Modal.confirm({
          title: '温馨提示',
          content:
            '支付税金一定要按照税金单的银行信息来支付（如果您是之前已经申报过的客户，因银行账户更改，请您按照现在最新的税金单上的银行信息支付）',
          onOk: () => {
            downloadAffirm({ workOrderId: this.workOrderId }).then((res) => {
              if (res.code == 0) {
                let url = res.data;
                if (url.slice(0, 5) == 'http:') {
                  url = url.slice(0, 4) + 's' + url.slice(4);
                }
                window.open(url);
              }
            });
          },
        });
      } else {
        downloadAffirm({ workOrderId: this.workOrderId }).then((res) => {
          if (res.code == 0) {
            let url = res.data;
            if (url.slice(0, 5) == 'http:') {
              url = url.slice(0, 4) + 's' + url.slice(4);
            }
            window.open(url);
          }
        });
      }
    },
    getTaxInfo() {
      taxInfo({ id: this.serviceId }).then((res) => {
        if (res.code == 0) {
          if (res.data.countryCode == 'ES') {
            this.supplierId = res.data.supplierId;
          }
        }
      });
    },
    set_time(str) {
      var n = parseInt(str);
      var D = new Date(n);
      var year = D.getFullYear(); //四位数年份

      var month = D.getMonth() + 1; //月份(0-11),0为一月份
      month = month < 10 ? '0' + month : month;

      var day = D.getDate(); //月的某一天(1-31)
      day = day < 10 ? '0' + day : day;

      var hours = D.getHours(); //小时(0-23)
      hours = hours < 10 ? '0' + hours : hours;

      var minutes = D.getMinutes(); //分钟(0-59)
      minutes = minutes < 10 ? '0' + minutes : minutes;

      var now_time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
      return now_time;
    },
    uploadTaxDeclareReceipt() {
      if (this.countryNameEn === '英国' || this.countryNameEn === '德国') {
        forms({
          workOrderId: this.workOrderId,
        }).then((res) => {
          if (res.code === 0) {
            window.open(res.data);
          }
        });
        return;
      }
    },
    open() {
      window.open('https://pre-fdfs.itaxs.com/group1/M00/00/E4/rBLKLV_sXK2AcVRXABNGxSoIHWY373.pdf');
    },
  },
  destroyed() {
    this.stopTimeDown();
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 24px;
  margin-bottom: 0px;
  min-height: calc(100vh - 84px);
  background: #ffffff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .flex-column {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .content {
    padding-top: 70px;
    img {
      width: 76px;
      height: 76px;
    }
    .success {
      font-size: 20px;
      font-family: 'Microsoft Yahei', SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      margin-top: 24px;
      margin-bottom: 20px;
    }
    .box {
      border: 1px solid rgba(0, 0, 0, 0.15);
      padding: 16px 28px;
      min-width: 550px;
      .title {
        color: #16ade9;
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 20px;
        margin-bottom: 12px;
      }
      /deep/ .ivu-row {
        margin-bottom: 12px;
      }
      span {
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 20px;
        color: #333333;
        margin-bottom: 12px;
      }
      .left {
        color: rgba(0, 0, 0, 0.85);
      }
    }
    .prompt {
      font-size: 14px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 17px;
      margin: 20px 0px 0px;
    }
    .deadLine {
      font-size: 12px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 17px;
      margin-top: 20px;
    }
    .red {
      color: #ed3e3eff;
    }
    .boxBtns {
      display: flex;
      margin-top: 20px;
      /deep/ .ivu-btn {
        margin: 0px 10px;
      }
    }
    .info {
      margin-bottom: 12px;
      font-size: 16px;
      font-family: 'Microsoft Yahei', SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #333333;
      line-height: 16px;
      text-align: center;
      span {
        color: #16ade9;
      }
    }
  }
  .followContent {
    width: 730px;
    height: 240px;
    background: rgba(22, 173, 233, 0.1);
    margin: 40px auto;
    padding: 24px;
    .title {
      font-size: 16px;
      font-family: 'Microsoft Yahei', SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 24px;
      margin-bottom: 17px;
    }
    img {
      width: 144px;
    }
  }
}
</style>
