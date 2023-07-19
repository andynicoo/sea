<template>
    <div>
      <Modal v-model="detailModel">
        <div class="title">
          是否确认零申报？
        </div>
        <div class="content">
          <div class="subtitle">税局提示</div>
          <div>-</div>
          <p>当您提交此增值税信息至税局时，请确保该数据真实且 完整，如果数据错误或者不实，税局有权按规定进行处 罚。数据提交后无法更改.</p>
          <p>When you submit this VAT information you are making a legal declaration that the information is true and complete. A false declaration can result in prosecution. </p>
        </div>
        <p class="flex-center" style="text-align: center;">
          <Button type="primary" class="footerBtn" @click="submit" style="margin-left:15px;">
            <p class="submitTop">submit</p>
            <p class="submitBottom">提交</p>
          </Button>
        </p>
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
      returnData: [],
      DeclareGBInfo: [],
      detailInfo: {},
      comfirmMessage: {},
      addFrom: {},
      VatObligationsData: {}
    }
  },
  created () {
    console.log(this.comfirmMessage);
    this.detailInfo = this.$store.state.taxBureau.declareInfo[0]
    console.log('显示detailInfo', this.detailInfo)
    this.comfirmMessage = this.$store.state.taxBureau.comfirmMessage
    this.addFrom = this.$store.state.taxBureau.addFrom
    this.VatObligationsData = this.$store.state.taxBureau.VatObligationsData
  },
  methods: {
    changeState (val) {
      this.$emit('changeState', false)
    },
    submit(that) {
      var data = {
        box1: '0',
        box2: '0',
        box3: '0',
        box4: '0',
        box5: '0',
        box6: '0',
        box7: '0',
        box8: '0',
        box9: '0',
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
          that.$Message.success(res.message)
          that.$emit('changeState', false)
          location.reload()
        } else {
          that.$Message.error(res.message)
        }
      }).catch((error) => {

      })
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
    background:rgba(255,247,247,1);
    border-radius:10px;
    color:#ED3E3E;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
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
  .footerBtn {
    text-align: center;
    p {
      font-size: 12px;
      line-height: 14px;
    }
  }
</style>