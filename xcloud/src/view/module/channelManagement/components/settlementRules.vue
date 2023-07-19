<template>
  <div class="rule-container">
    <div class="box">
      <div class="ruleBox">
        <Row v-for="(item, index) in formRuleData"
             :key="index">
          <Col :span="3">
          <div>
            国家：<span style="font-weight:bold">{{item.countryName}}</span>
          </div>
          </Col>
          <Col :span="10">
          <div class="inline">
            <div class="line-width">
              返佣方式:
            </div>
            <Select v-model="formRuleData[index].rebateMethod"
                    style="width:200px;">
              <Option value="0">按比例返佣</Option>
              <Option value="1">按金额返佣</Option>
            </Select>
          </div>
          </Col>
          <Col :span="10">
          <div class="inline">
            <div class="line-width">
              返佣金额:
            </div>
            <Input style="margin-right:10px;width:200px;"
                   v-model="formRuleData[index].rebateValue"
                   placeholder="返佣金额"></Input>
            <span v-if="formRuleData[index].rebateMethod === '1'">
              %
            </span>
            <span v-else>
              元
            </span>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import { baseinfo } from "@/api/taxService/order";
export default {
  props: {
    ruleData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      formRuleData: []
    }
  },
  created() {
    this.baseinfoFun()
  },
  methods: {
    editModal() {
      this.$emit('editModal')
    },

  }
}
</script>

<style lang="less" scoped>
.rule-container {
  .box {
    .ruleBox {
      /deep/ .ivu-row {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
      }
      /deep/ .ivu-col {
        // padding: 0px 10px;
      }
      .inline {
        display: flex;
        align-items: center;
        .line-width {
          width: 80px;
        }
      }
    }
  }
}
</style>