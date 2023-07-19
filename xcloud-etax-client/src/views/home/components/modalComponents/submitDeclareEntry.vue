<template>
  <div>
    <Modal v-model="detailModel"
           @on-visible-change="changeState"
           width="650">
      <div class="title">
        请选择您需要报税的时间
      </div>
      <div class="content">
        <div class="companyTax">
          <Row>
            <Col span="24"
                 style="height: 100%">
            <div class="english">
              VAT Number:
              <span class="chinese">
                VAT税号
              </span>
              <span class="rightWord">
                {{DeclareInfo[0].vatTaxNumber}}
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
                {{DeclareInfo[0].companyName}}
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
            <tr class="detail"
                v-for="(item, index) in DeclareInfo"
                :key="index">
              <td>
                {{item.start}}至{{item.end}}
              </td>
              <td>
                {{item.due}}
              </td>
              <td>
                <Button type="primary"
                        class="searchBtn"
                        @click="toFilingData(index)">Go</Button>
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
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    DeclareInfo: Array
  },
  data() {
    return {
      detailModel: true,
      returnData: []
    }
  },
  created() {
    console.log(this.DeclareInfo);
  },
  methods: {
    changeState(val) {
      this.$emit('changeState', false)
    },
    toFilingData(index) {
      this.$router.push({ path: '/filingData', query: { index: index } })
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
  padding-bottom: 10px;
  &::before {
    content: "";
    border-left: 2px solid #16ade9;
    width: 2px;
    height: 9px;
    padding-left: 15px;
  }
  border-bottom: 1px solid #f6f6f6;
}
&/deep/ .ivu-modal-body {
  padding: 16px 0px;
}
.content {
  .companyTax {
    background: #ffffff;
    padding: 20px 30px 0px;
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
      th,
      td {
        padding-left: 18px;
        button {
          margin-top: 5px;
        }
      }
    }
  }
}
</style>