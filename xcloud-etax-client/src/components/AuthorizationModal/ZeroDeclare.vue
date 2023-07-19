<template>
  <div>
    <Modal v-model="detailModel" @on-visible-change="changeState">
      <div class="title">是否确认零申报？</div>
      <div class="content">
        <div class="subtitle">税局提示：</div>
        <p>
          当您提交此增值税信息至税局时，请确保该数据真实且 完整，如果数据错误或者不实，税局有权按规定进行处
          罚。数据提交后无法更改.
        </p>
        <p>
          When you submit this VAT information you are making a legal declaration that the information is true and
          complete. A false declaration can result in prosecution.
        </p>
      </div>
      <p class="flex-center">
        <Button type="primary" class="footerBtn" @click="submit" style="margin-left: 15px; margin-bottom: 3px">
          <p class="submitBottom">确认</p>
        </Button>
      </p>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { taxFilingInformation } from '@/api/taxBureauService/taxBureauService';
import { SubmitDeclarationTaxBureau } from '@/api/taxBureauService/taxBureauService';
import { submitTaxdate } from '@/api/taxModule';
export default {
  props: {
    comfirmMessage: Object,
    isProcess: Boolean,
  },
  data() {
    return {
      detailModel: true,
      info: [],
      returnData: [],
      DeclareGBInfo: [],
    };
  },
  created() {
    this.DeclareGBInfo = JSON.parse(sessionStorage.getItem('DeclareInfoGB'));
    if (this.DeclareGBInfo.from === 'fromRedBtn') {
      this.DeclareGBInfo.serviceId = this.DeclareGBInfo.orderServicesId;
    }
  },
  methods: {
    changeState(val) {
      this.$emit('changeState', false);
    },
    submit(that) {
      var data = {
        sellFile: this.comfirmMessage.sellFile,
        id: this.comfirmMessage.id,
        declareRule: this.comfirmMessage.declareRule,
      };
      let query = {
        workOrderId: this.DeclareGBInfo.id,
        declareRule: this.comfirmMessage.declareRule,
        beginTime: this.DeclareGBInfo.beginTime,
        endTime: this.DeclareGBInfo.endTime,
        companyName: this.DeclareGBInfo.companyNameZh,
        countryNameEn: this.DeclareGBInfo.countryNameEn,
        taxDeclarationDeadline: this.DeclareGBInfo.taxDeclarationDeadline.slice(0, 10),
        checkStatus: !this.isProcess ? 'checkStatus' : '',
      };
      submitTaxdate(data).then((res) => {
        if (res.code === 0) {
          this.submitNavigate({
            ...query,
            declareTime: res.timestamp,
          });
          // window.sessionStorage.removeItem('DeclareInfoGB');
        }
      });
    },
    submitNavigate(query) {
      this.detailModel = false;
      this.$router.push({
        path: '/declareSuccess',
        query,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.title {
  background: #ffffff;
  border-bottom: none;
  color: #333333;
  font-weight: 500;
  font-size: 16px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f6f6f6;
}
.content {
  background: rgba(255, 247, 247, 1);
  border-radius: 10px;
  color: #ed3e3e;
  padding: 16px;
  margin-top: 20px;
  margin-bottom: 20px;
  .subtitle {
    font-weight: 500;
    margin-bottom: 16px;
    font-family: 'PingFangSC', 'Microsoft YaHei', Helvetica, Arial, sans-serif;
  }
  .companyTax {
    margin: 15px 0px;
    background: #ffffff;
    padding: 20px 30px;
    &/deep/ .ivu-row {
      height: 50px;
    }
  }
  .tableBox {
    table {
      padding: 10px;
    }
  }
  .english {
    font-weight: bold;
    font-size: 12px;
    color: #666666;
    line-height: 13px;
    height: 100%;
    position: relative;
    margin-bottom: 29px;
    padding-top: 10px;
    text-align: left;
    .chinese {
      position: absolute;
      top: 28px;
      left: 0px;
    }
    .rightWord {
      font-size: 12px;
      color: rgba(22, 173, 233, 1);
      line-height: 13px;
      margin-left: 15px;
    }
  }
  .chinese {
    font-size: 12px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .tableBox {
    table {
      .header {
        background: #f6f6f6;
      }
    }
  }
}
.footerBtn {
  text-align: center;
  p {
    font-size: 14px;
    line-height: 14px;
  }
}
</style>
