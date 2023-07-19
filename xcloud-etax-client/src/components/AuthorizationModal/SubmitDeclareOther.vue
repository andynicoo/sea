<template>
  <div>
    <Modal v-model="detailModel"
           style="width:620px;">
      <div class="title">
        请确认您的申报数据
      </div>
      <div class="content">
        <div class="companyTax">
          <Row type="flex"
               justify="space-between">
            <Col span="8"
                 style="height: 100%">
            <div class="english">
              VAT Number:
              <span class="chinese">
                VAT税号
              </span>
              <span class="rightWord">
                GB 398243243
              </span>
            </div>
            </Col>
            <Col span="15"
                 style="height: 100%">
            <div class="english">
              Company Name:
              <span class="chinese">
                公司英文名称：
              </span>
              <span class="rightWord">
                SHENZHEN DJK FKA FALLAL
              </span>
            </div>
            </Col>
          </Row>
          <Row>
            <Col span="24"
                 style="height: 100%">
            <div class="english">
              Company Name:
              <span class="chinese">
                公司英文名称：
              </span>
              <span class="rightWord">
                SHENZHEN DJK FKA FALLAL
              </span>
            </div>
            </Col>
          </Row>
        </div>
        <div class="tableBox">
          <table style="width: 100%;">
            <tr class="header">
              <th>
                <div class="english">
                  Reporting time frame
                  <span class="chinese">
                    报税区间
                  </span>
                </div>
              </th>
              <th>
                <div class="english">
                  Return due date if paid electronically
                  <span class="chinese">
                    税金到账截止日期
                  </span>
                </div>
              </th>
              <th>
                <div class="english">
                  Operation
                  <span class="chinese">
                    操作
                  </span>
                </div>
              </th>
            </tr>
            <tr class="detail">
              <td>
                1
              </td>
              <td>
                2
              </td>
              <td>
                3
              </td>
            </tr>
            <!-- <tr v-for="(item, index) in returnData" :key="index" class="detail">
               <td>
                 {{item.month}}
               </td>
               <td>
                 {{currencySign+item.includTaxAmt}}
               </td>
               <td>
                 {{currencySign+item.excludeTaxAmt}}
               </td>
               <td>
                 {{item.taxAmt}}
               </td>
             </tr> -->
          </table>
        </div>
      </div>
      <div class="footer">
        <p class="remind">英国税局HMRC提醒您：当您提交此增值税信息至税局时，请确保该数据真实且完整，如果数据错误或者 不实，税局有权按规定进行处罚。数据提交后无法更改。 </p>
        <p class="remind">When you submit this VAT information you are making a legal declaration that the information is true and complete. A false declaration can result in prosecution.</p>
      </div>
      <Button type="primary"
              @click="submit"
              style="margin-left:15px;">
        <p class="submitTop">submit</p>
        <p class="submitBottom">提交</p>
      </Button>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detailModel: false,
      info: [],
      returnData: []
    }
  },
  methods: {
    changeState(val) {
      this.$emit('changeState', false)
    },
    submit() {

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
  font-weight: 500;
  &::before {
    content: "";
    border-left: 2px solid #16ade9;
    width: 2px;
    height: 9px;
    padding-left: 15px;
  }
  border-bottom: 1px solid #f6f6f6;
}
.content {
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
.footer {
  margin: 10px 0px;
  p {
    color: #ed3e3e;
    font-size: 12px;
    text-align: center;
  }
}
&/deep/ .ivu-modal {
  width: 630px !important;
}
</style>