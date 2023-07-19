<template>
  <div>
    <Modal v-model="detailModel" @on-visible-change="changeState" :width="900">
      <div class="title" v-if="!onlyBox">提交申报</div>
      <div class="title" v-if="onlyBox">提交申报</div>
      <div class="content">
        <div class="companyTax" v-if="!onlyBox">
          <Row type="flex" justify="space-between">
            <Col span="12" style="height: 100%">
              <div class="english">
                VAT税号:
                <span class="rightWord">
                  {{ DeclareGBInfo.taxNumber }}
                </span>
              </div>
            </Col>
            <Col span="12" style="height: 100%">
              <div class="english">
                公司名称:
                <span class="rightWord">
                  {{ companyName }}
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span="24" style="height: 100%">
              <div class="english">
                申报区间：
                <span class="rightWord">
                  {{ DeclareGBInfo.from === 'fromRedBtn' ? DeclareGBInfo.beginTime.slice(0, 10) : DeclareGBInfo.start }}
                  至 {{ DeclareGBInfo.from === 'fromRedBtn' ? DeclareGBInfo.endTime.slice(0, 10) : DeclareGBInfo.end }}
                </span>
              </div>
            </Col>
          </Row>
        </div>
        <Form v-if="onlyBox && JSON.stringify(detailInfo) != '{}'" :label-width="220">
          <FormItem label="Name:">
            <span>{{ companyName }}</span>
          </FormItem>
          <FormItem label="VAT Registration Number:">
            <span>{{ detailInfo.vatTaxNumber }}</span>
          </FormItem>
          <FormItem label="Period:">
            <span>{{ detailInfo.start.slice(0, 10) }}至</span>
            <span>{{ detailInfo.end.slice(0, 10) }}</span>
          </FormItem>
          <FormItem label="Due:">
            <span>{{ detailInfo.due.slice(0, 10) }}</span>
          </FormItem>
          <FormItem label="Correlation ID:">
            <span>{{ detailInfo.correlationId }}</span>
          </FormItem>
          <FormItem label="Receipt ID:">
            <span>{{ detailInfo.receiptId }}</span>
          </FormItem>
          <FormItem label="Time received:">
            <span>{{ detailInfo.receiptDate }}</span>
          </FormItem>
          <!-- <FormItem label="Receipt signature:">
              <span></span>
            </FormItem> -->
          <FormItem label="Time processed:">
            <span>{{ detailInfo.processingDate }}</span>
          </FormItem>
          <FormItem label="Form Bundle Number:">
            <span>{{ detailInfo.formBundleNumber }}</span>
          </FormItem>
          <FormItem label="Charge Reference Number:">
            <span>{{ detailInfo.chargeRefNumber }}</span>
          </FormItem>
        </Form>
        <p class="subtitle">申报数据：</p>
        <div class="tableBox">
          <table style="width: 100%">
            <tr class="header">
              <th style="width: 100px">序号</th>
              <th style="width: 500px">类型</th>
              <th style="width: 140px">金额</th>
            </tr>
            <tr v-for="(item, index) in returnData" :key="index" class="detail">
              <td>
                {{ item.name }}
              </td>
              <td class="text-left">
                {{ item.type }}
              </td>
              <td class="text-center money">
                {{ currencySign }}
                <!-- <input
                  @input="changeInput(item.name, $event)"
                  ref="box"
                  :class="item.name"
                  type="number"
                  :value="item.excludeTaxAmt"
                  disabled="disabled"
                /> -->
                {{ item.excludeTaxAmt | formatQianFenWei }}
              </td>
            </tr>
            <!-- <tr>
              <td></td>
              <td class="text-left"></td>
              <td class="text-left money">
                {{currencySign}}
                <input type="text" :value="item.excludeTaxAmt">
              </td>
             </tr> -->
          </table>
        </div>
      </div>
      <div class="footer" v-if="!onlyBox">
        <p class="remind">
          英国税局HMRC提醒您：当您提交此增值税信息至税局时，请确保该数据真实且完整，如果数据错误或者
          不实，税局有权按规定进行处罚。数据提交后无法更改。
        </p>
        <p class="remind">
          When you submit this VAT information you are making a legal declaration that the information is true and
          complete. A false declaration can result in prosecution.
        </p>
      </div>
      <div class="footerBtn" v-if="!onlyBox">
        <Button type="primary" @click="submit" style="margin-left: 15px">
          <p class="submitBottom">确认</p>
        </Button>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { caluTax, submitTaxdate } from '@/api/taxModule';
import { SubmitDeclarationTaxBureau } from '@/api/taxBureauService/taxBureauService';
export default {
  props: {
    currencySign: String,
    taxRate: Number,
    declareLog: Array,
    detailInfo: Object,
    paramsToDeclareGB: Object,
    gbDeclareExtra: Object,
    isProcess: Boolean,
  },
  data() {
    return {
      comfirmMessage: {},
      detailModel: true,
      info: [],
      returnData: [
        {
          name: 'box1',
          key: 'vatDueSales',
          type: 'VAT due on Sales and other outputs（销项税额）',
          excludeTaxAmt: this.gbDeclareExtra.box1,
        },
        {
          name: 'box2',
          key: 'vatDueAcquisitions',
          type: 'VAT due in this period on intra-community acquisitions of goods made in Northern Ireland from EU Member States(欧盟发往北爱尔兰销售数据)',
          excludeTaxAmt: this.gbDeclareExtra.box2,
        },
        {
          name: 'box3',
          key: 'totalVatDue',
          type: 'Total VAT due（销项总计）',
          excludeTaxAmt: this.gbDeclareExtra.box3,
        },
        {
          name: 'box4',
          key: 'vatReclaimedCurrPeriod',
          type: 'VAT due on Sales and other inputs（进项税额）',
          excludeTaxAmt: this.gbDeclareExtra.box4,
        },
        {
          name: 'box5',
          key: 'netVatDue',
          type: 'Net VAT to be paid to HMRC or reclaimed by you（应缴增值税）',
          excludeTaxAmt: this.gbDeclareExtra.box5,
        },
        {
          name: 'box6',
          key: 'totalValueSalesExVAT',
          type: ' Total value of all sales and other outputs excluding VAT（销售额，不含税）',
          excludeTaxAmt: this.gbDeclareExtra.box6,
        },
        {
          name: 'box7',
          key: 'totalValuePurchasesExVAT',
          type: 'Total value of all Purchases and other inputs excluding VAT（存货成本，不含增值税）',
          excludeTaxAmt: this.gbDeclareExtra.box7,
        },
        {
          name: 'box8',
          key: 'totalValueGoodsSuppliedExVAT',
          type: 'Total value of intra-community dispatches of goods and related costs (excluding VAT) from Northern Ireland to EU Member States(从北爱尔兰发往欧盟不含税销售总额，包含相关成本)',
          excludeTaxAmt: this.gbDeclareExtra.box8,
        },
        {
          name: 'box9',
          key: 'totalAcquisitionsExVAT',
          type: 'Total value of intra-community acquisitions of goods and related costs (excluding VAT) made in Northern Ireland from EU Member States(从欧盟发往北爱尔兰不含税销售总额，包含相关成本)',
          excludeTaxAmt: this.gbDeclareExtra.box9,
        },
      ],
      box1: 0,
      box2: 0,
      box3: 0,
      box4: 0,
      box5: 0,
      box6: 0,
      box7: 0,
      box8: 0,
      box9: 0,
      DeclareGBInfo: {},
      DeclareIndex: 0,
      onlyBox: true,
      UserInfoGB: {},
      companyName: '',
    };
  },
  methods: {
    changeState(val) {
      this.$emit('changeState', false);
    },
    changeInput(val, e) {
      if (val === 'box2') {
        let value = Number(e.target.value);
        this.comfirmMessage.vatDueAcquisitions = value;
        this.comfirmMessage.totalVatDue = value + this.comfirmMessage.vatDueSales;
        this.getValue();
      }
    },
    getValue() {
      for (const key in this.comfirmMessage) {
        for (let index = 0; index < this.returnData.length; index++) {
          if (this.comfirmMessage.hasOwnProperty(key)) {
            if (key == this.returnData[index].key) {
              this.returnData[index].excludeTaxAmt = this.comfirmMessage[key];
            }
          }
        }
      }
    },
    submit() {
      let query = {
        workOrderId: this.DeclareGBInfo.id,
        declareRule: this.comfirmMessage.declareRule,
        beginTime: this.DeclareGBInfo.beginTime,
        endTime: this.DeclareGBInfo.endTime,
        companyName: this.DeclareGBInfo.companyNameZh,
        countryNameEn: this.DeclareGBInfo.countryNameEn,
        taxDeclarationDeadline: this.DeclareGBInfo.taxDeclarationDeadline,
        checkStatus: !this.isProcess ? 'checkStatus' : '',
      };
      submitTaxdate(this.paramsToDeclareGB).then((res) => {
        if (res.code == 0) {
          this.comfirmMessage = res.data;
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
    // submit() {
    //   for (let index = 0; index < this.$refs.box.length; index++) {
    //     this['box' + (index + 1)] = this.$refs.box[index].value
    //   }
    //   var data = {
    //     box1: this.box1,
    //     box2: this.box2,
    //     box3: this.box3,
    //     box4: this.box4,
    //     box5: this.box5,
    //     box6: this.box6,
    //     box7: this.box7,
    //     box8: this.box8,
    //     box9: this.box9,
    //     serviceId: this.DeclareGBInfo.serviceId,
    //     periodKey: this.DeclareGBInfo.periodKey,
    //     vatTaxNumber: this.DeclareGBInfo.vatTaxNumber,
    //     taxRate: this.taxRate,
    //     taxAmtTotal: this.paramsToDeclareGB.taxAmtTotal,
    //     allTaxPrice: this.paramsToDeclareGB.allTaxPrice,
    //     deductionPrice: this.paramsToDeclareGB.deductionPrice,
    //     deductionB2bPrice: this.paramsToDeclareGB.deductionB2bPrice,
    //     excludeTaxPrice1: this.paramsToDeclareGB.excludeTaxPrice1,
    //     excludeTaxPrice2: this.paramsToDeclareGB.excludeTaxPrice2,
    //     includTaxPrice2: this.paramsToDeclareGB.includTaxPrice2,
    //     excludeTaxPrice: this.paramsToDeclareGB.excludeTaxPrice,
    //     excludeTaxPrice4: this.paramsToDeclareGB.excludeTaxPrice4,
    //     includTaxPrice: this.paramsToDeclareGB.includTaxPrice,
    //     listTaxDeductionItem: this.paramsToDeclareGB.listTaxDeductionItem,
    //     sellFile: this.paramsToDeclareGB.sellFile,
    //     declareRule: this.paramsToDeclareGB.declareRule,
    //     workId: this.DeclareGBInfo.id,
    //     userId: this.UserInfoGB.userId,
    //     otherIncludTaxAmt: this.paramsToDeclareGB.otherIncludTaxAmt,
    //     otherSaleFileUrl: this.paramsToDeclareGB.otherSaleFileUrl
    //   }
    //   SubmitDeclarationTaxBureau(data).then((res) => {
    //     if (res.code === 0) {
    //       // this.$Message.success('提交英国申报数据成功')
    //       // window.location.href = window.location.origin + '/work'
    //       this.$router.replace({
    //         path: "/declareSuccess", query: {
    //           workOrderId: this.DeclareGBInfo.id,
    //           declareRule: this.comfirmMessage.declareRule,
    //           beginTime: this.DeclareGBInfo.beginTime,
    //           endTime: this.DeclareGBInfo.endTime,
    //           companyName: this.DeclareGBInfo.companyNameZh,
    //           countryNameEn: this.DeclareGBInfo.countryNameEn,
    //           taxDeclarationDeadline: this.DeclareGBInfo.taxDeclarationDeadline.slice(0, 10),
    //           declareTime: res.timestamp,
    //           taxPaymentDeadline: res.data.taxPaymentDeadline

    //         }
    //       })
    //       window.sessionStorage.removeItem('DeclareInfoGB')
    //     } else {
    //       this.$Message.error(res.message)
    //     }
    //   }).catch((error) => {

    //   })
    // }
  },
  created() {
    // console.log('paramsToDeclareGB', this.paramsToDeclareGB)
    if (this.$route.query.index != undefined) {
      if (JSON.stringify(this.$store.state.bureau.declareInfo) !== '{}') {
        this.DeclareGBInfo = this.$store.state.bureau.declareInfo || {};
      } else {
        this.DeclareGBInfo = JSON.parse(window.sessionStorage.getItem('DeclareInfoGB')) || {};
      }
      if (this.DeclareGBInfo.from === 'fromRedBtn') {
        this.DeclareGBInfo.serviceId = this.DeclareGBInfo.orderServicesId;
      }
      this.companyName = this.DeclareGBInfo.companyNameZh || this.DeclareGBInfo.companyName;
      this.onlyBox = false;
    } else {
      this.DeclareGBInfo = this.declareLog;
      this.onlyBox = true;
    }
    // console.log('DeclareGBInfo', this.DeclareGBInfo)
    this.getValue();
  },
  mounted() {
    console.log(this.gbDeclareExtra);
  },
};
</script>
<style lang="less" scoped>
// /deep/ .ivu-modal {
//   top: 100px !important;
// }
.title {
  background: #ffffff;
  border-bottom: none;
  padding-left: 15px;
  color: #333333;
  font-weight: 500;
  padding-bottom: 15px;
  border-bottom: 1px solid #f6f6f6;
  font-size: 16px;
}
.content {
  /deep/ .ivu-row {
    margin: 10px 0px;
  }
  .companyTax {
    background: #ffffff;
    padding: 10px 15px;
  }
  .subtitle {
    color: #333333;
    padding: 10px 15px 6px;
    font-size: 14px;
    border-top: 1px solid #f6f6f6;
    font-family: PingFangSC-Medium, Microsoft YaHei PingFang SC;
    font-weight: 500;
  }
  .tableBox {
    table {
      padding: 10px;
      th,
      td {
        font-size: 12px;
        min-height: 40px;
        color: #333333;
        text-align: center;
      }
      th {
        padding: 10px;
        background: rgba(22, 173, 233, 0.2);
      }
      td {
        padding: 5px;
        input {
          width: 100px;
          margin-left: 0px;
          padding: 3px;
          border: none;
        }
      }
      tr {
        border-bottom: 1px solid #eeeeee;
      }
      .text-left {
        text-align: left;
      }
      .money {
        padding-left: 15px;
      }
    }
  }
  .english {
    font-size: 14px;
    color: #666666;
    line-height: 13px;
    height: 100%;
    position: relative;
    padding-top: 10px;
    text-align: left;
    .chinese {
      position: absolute;
      top: 28px;
      left: 0px;
    }
    .rightWord {
      font-size: 14px;
      color: #333333;
      line-height: 13px;
      font-family: 'PingFangSC', 'Microsoft YaHei', Helvetica, Arial, sans-serif;
      font-weight: 500;
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
.footer {
  margin: 10px 0px 20px;
  p {
    color: #ed3e3e;
    font-size: 12px;
    text-align: center;
    padding: 0px 20px;
  }
  .remind {
    text-align: left;
  }
}
.footerBtn {
  text-align: center;
  margin-bottom: 10px;
  p {
    font-size: 14px;
    line-height: 14px;
  }
}
.check {
  cursor: pointer;
}
/deep/ .ivu-form-item {
  margin-bottom: 0;
}
</style>
