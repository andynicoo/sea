<template>
    <div>
      <Modal v-model="detailModel" @on-visible-change="changeState" :width="700">
        <div class="title" v-if="!onlyBox">
          please confirm
        </div>
        <div class="title" v-if="onlyBox">
          VAT Submission Receipt
        </div>
        <div class="content">
          <div class="companyTax">
            <Row type="flex" justify="space-between">
              <Col span="8" style="height: 100%">
                <div class="english">
                  VAT Number:
                  <span class="chinese">
                    VAT税号
                  </span>
                  <span class="rightWord">
                   {{detailInfo.vatTaxNumber}}
                  </span>
                </div>
              </Col>
              <Col span="15" style="height: 100%">
                <div class="english">
                  Company Name:
                  <span class="chinese">
                    公司名称
                  </span>
                  <span class="rightWord">
                    {{detailInfo.companyName || detailInfo.companyNameZh}}
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span="24" style="height: 100%">
                <div class="english">
                  Reporting time frame:
                  <span class="chinese">
                    申报区间：
                  </span>
                  <span class="rightWord">
                      区间
                     {{detailInfo.beginTime.slice(0,10)}} 至 {{detailInfo.endTime.slice(0,10)}}
                  </span>
                </div>
              </Col>
            </Row>
          </div>
          <!-- <Form :label-width='220'>
            <FormItem label="Name:">
              <span>{{detailInfo.companyName}}</span>
            </FormItem>
            <FormItem label="VAT Registration Number:">
              <span>{{detailInfo.vatTaxNumber}}</span>
            </FormItem>
            <FormItem label="Period:">
              <span>{{VatObligationsData[0].start.slice(0,10)}}至</span>
              <span>{{VatObligationsData[0].end.slice(0,10)}}</span>
            </FormItem>
            <FormItem label="Due:">
              <span>{{VatObligationsData[0].due.slice(0,10)}}</span>
            </FormItem>
            <FormItem label="Correlation ID:">
              <span>{{detailInfo.correlationId}}</span>
            </FormItem>
            <FormItem label="Receipt ID:">
              <span>{{detailInfo.receiptId}}</span>
            </FormItem>
            <FormItem label="Time received:">
              <span>{{detailInfo.receiptDate}}</span>
            </FormItem>
            <FormItem label="Time processed:">
              <span>{{detailInfo.processingDate}}</span>
            </FormItem>
            <FormItem label="Form Bundle Number:">
              <span>{{detailInfo.formBundleNumber}}</span>
            </FormItem>
            <FormItem label="Charge Reference Number:">
              <span>{{detailInfo.chargeRefNumber}}</span>
            </FormItem>
          </Form> -->
          <p class="subtitle">
            申报数据：
          </p>
          <div class="tableBox">
            <table style="width: 100%;">
             <tr class="header">
               <th style="width: 100px;">
                 序号
               </th>
               <th style="width: 500px;">
                 类型
               </th>
               <th style="width: 140px;">
                 金额
               </th>
             </tr>
             <tr v-for="(item, index) in returnData" :key="index" class="detail">
               <td>
                 {{item.name}}
               </td>
               <td class="text-left">
                 {{item.type}}
               </td>
               <td class="text-left money">
                 <input ref="box" type="number" :value="item.excludeTaxAmt" @input="changeInput(item.name, $event)" :class="item.name"  disabled="disabled">
               </td>
             </tr>
           </table>
          </div>
        </div>
        <div class="footer">
          <p class="remind">英国税局HMRC提醒您：当您提交此增值税信息至税局时，请确保该数据真实且完整，如果数据错误或者 不实，税局有权按规定进行处罚。数据提交后无法更改。 </p>
          <p class="remind">When you submit this VAT information you are making a legal declaration that the information is true and complete. A false declaration can result in prosecution.</p>
        </div>
        <div class="footerBtn">
          <Button type="primary" @click="submit" style="margin-left:15px;">
            <p class="submitTop">submit</p>
            <p class="submitBottom">提交</p>
          </Button>
        </div>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>
<script>
import {vatReturns} from "@/api/taxService/taxModule.js"
export default {
  data () {
    return {
      detailModel: true,
      info: [],
      returnData: [
        {
          name: 'box1',
          key:'vatDueSales',
          type: 'VAT due on Sales and other outputs（销项税额）',
          excludeTaxAmt: 0
        },
        {
          name: 'box2',
          key:'vatDueAcquisitions',
          type: 'VAT due in this period on acquisitions from other EC Menber States（销项税额--固定资产）',
          excludeTaxAmt: 0
        },
        {
          name: 'box3',
          key:'totalVatDue',
          type: 'Total VAT due（销项总计）',
          excludeTaxAmt: 0
        },
        {
          name: 'box4',
          key:'vatReclaimedCurrPeriod',
          type: 'VAT due on Sales and other inputs（进项税额）',
          excludeTaxAmt: 0
        },
        {
          name: 'box5',
          key:'netVatDue',
          type: 'Net VAT to be paid to HMRC or reclaimed by you（应缴增值税）',
          excludeTaxAmt: 0
        },
        {
          name: 'box6',
          key:'totalValueSalesExVAT',
          type: ' Total value of all sales and other outputs excluding VAT（销售额，不含税）',
          excludeTaxAmt: 0
        },
        {
          name: 'box7',
          key:'totalValuePurchasesExVAT',
          type: 'Total value of all Purchases and other inputs excluding VAT（存货成本，不含增值税）',
          excludeTaxAmt: 0
        },
        {
          name: 'box8',
          key:'totalValueGoodsSuppliedExVAT',
          type: 'Total value of all supplies of goods and related costs,excluding any VAT,to other EC member states（向其它欧盟国家销售涉及的成本费用）',
          excludeTaxAmt: 0
        },
        {
          name: 'box9',
          key:'totalAcquisitionsExVAT',
          type: 'Total value of all acquisitions of goods and related costs,excluding any VAT,to other EC member states（向其它欧盟国销售固定资产涉及的成本费用）',
          excludeTaxAmt: 0
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
      DeclareGBInfo: [],
      DeclareIndex: 0,
      onlyBox:true,
      VatObligationsData: [],
      comfirmMessage: {},
      addFrom: {}
    }
  },
  watch: {
  },
  methods: {
    changeState (val) {
      this.$emit('changeState', false)
    },
    changeInput(val, e) {
      console.log(val)
      if (val === 'box2') {
        let value = Number(e.target.value)
        console.log(value)
        this.comfirmMessage.vatDueAcquisitions = value
        this.comfirmMessage.totalVatDue = value + this.comfirmMessage.vatDueSales
        this.getValue()
      }
    },
    submit() {
      for (let index = 0; index < this.$refs.box.length; index++) {
        this['box' + (index+1)] = this.$refs.box[index].value
      }
      var data = {
        box1: this.box1,
        box2: this.box2,
        box3: this.box3,
        box4: this.box4,
        box5: this.box5,
        box6: this.box6,
        box7: this.box7,
        box8: this.box8,
        box9: this.box9,
        serviceId: this.detailInfo.id,
        periodKey: this.VatObligationsData[0].periodKey,
        vatTaxNumber: this.detailInfo.vatTaxNumber,
        userId: this.detailInfo.userId,
        listTaxDeductionItem: this.addFrom.listTaxDeductionItem,
        allTaxPrice: this.addFrom.allTaxPrice,
        declareRule: this.addFrom.declareRule,
        deductionPrice: this.addFrom.deductionPrice,
        excludeTaxPrice: this.addFrom.excludeTaxPrice,
        includTaxPrice: this.addFrom.includTaxPrice,
        sellFile: this.addFrom.sellFile,
        taxRate: this.addFrom.taxRate,
        workId: this.addFrom.workId,
      }
      vatReturns(data).then((res) => {
        if (res.code === 0) {
          this.$Message.success(res.message)
          setTimeout(function() {
            location.reload()
          }, 1000)
        } else {
          this.$Message.error(res.message)
        }
      }).catch((error) => {

      })
    },
    getValue() {
      for (const key in this.comfirmMessage) {
        for (let index = 0; index < this.returnData.length; index++) {
          if (this.comfirmMessage.hasOwnProperty(key)) {
            if (key == this.returnData[index].key) {
              this.returnData[index].excludeTaxAmt = this.comfirmMessage[key]
            } 
          }
        }
      }
    }
  },
  created() {
    this.detailInfo = this.$store.state.taxBureau.declareInfo[0]
    this.comfirmMessage = this.$store.state.taxBureau.comfirmMessage
    this.addFrom = this.$store.state.taxBureau.addFrom
    this.VatObligationsData = this.$store.state.taxBureau.VatObligationsData
    for (const key in this.comfirmMessage) {
      for (let index = 0; index < this.returnData.length; index++) {
        if (this.comfirmMessage.hasOwnProperty(key)) {
          if (key == this.returnData[index].key) {
            this.returnData[index].excludeTaxAmt = this.comfirmMessage[key]
          } 
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .title {
    background: #ffffff;
    border-bottom: none;
    padding-left: 15px;
    color: #333333;
    font-weight:500;
    padding-bottom: 15px;
    &::before {
      content: '';
      border-left: 2px solid #16ADE9;
      width: 2px;
      height: 9px;
      padding-left: 15px;
    }
    border-bottom: 1px solid #F6F6F6;
  }
  .content {
    .companyTax {
      background: #ffffff;
      padding: 10px 30px;
      &/deep/ .ivu-row {
        height: 50px;
      }
    }
    .subtitle {
      color: #666666;
      padding: 0px 30px 6px;
      font-size: 12px;
    }
    .tableBox {
      table {
        padding: 10px;
        th,td {
          font-size:12px;
          min-height: 40px;
          color: #333333;
          text-align: center;
        }
        th {
          padding: 10px;
        }
        td {
          padding: 5px;;
          input {
            width: 60px;
            margin-left: 0px;
            padding: 3px;
            border: none;
          }
        }
        tr {
          border-bottom: 1px solid #EEEEEE;
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
      font-weight:bold;
      font-size:12px;
      color: #666666;
      line-height:13px;
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
        font-size:12px;
        color:rgba(22,173,233,1);
        line-height:13px;
        margin-left: 15px;
      }
    }
    .chinese {
      font-size:12px;
      font-weight:400;
      color:rgba(102,102,102,1);
    }
    .tableBox {
      table {
        .header {
          background: #F6F6F6;
        }
      }
    }
  }
  .footer {
    margin: 10px 0px 20px;
    p {
      color: #ED3E3E;
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
    p {
      font-size: 12px;
      line-height: 14px;
    }
  }
  .check{
    cursor: pointer;
  }
  /deep/ .ivu-form-item{
    margin-bottom: 0;
  }
</style>