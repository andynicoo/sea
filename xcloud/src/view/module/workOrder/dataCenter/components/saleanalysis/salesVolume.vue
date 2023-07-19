<template>
  <div>
    <div class="page-title">
      <span class="text">销售额分析</span>
      <span class="explain">
        <el-button type="warning" @click="statisticsDes()">统计说明</el-button>
      </span>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="data-box">
          <div class="li">
            <div class="tip">本月销售额</div>
            <div class="val" v-if="statisticsInfo.monthAmountMoney > 1000000">
              ￥ {{ (statisticsInfo.monthAmountMoney / 1000000).toFixed(2) }} M
            </div>
            <div class="val" v-else>￥ {{ statisticsInfo.monthAmountMoney | formatQianFenWei }}</div>
          </div>
          <div class="li">
            <div class="tip">本月商品销量</div>
            <div class="val">{{ statisticsInfo.monthProductSales || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="data-box">
          <div class="li">
            <div class="tip">今年销售额</div>
            <div class="val" v-if="statisticsInfo.yearAmountMoney > 1000000">
              ￥ {{ (statisticsInfo.yearAmountMoney / 1000000).toFixed(2) }} M
            </div>
            <div class="val" v-else>￥ {{ statisticsInfo.yearAmountMoney | formatQianFenWei }}</div>
          </div>
          <div class="li">
            <div class="tip">今年商品销量</div>
            <div class="val">{{ statisticsInfo.yearProductSales || 0 }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="统计说明" :visible.sync="visible" width="800px">
      <div class="explain-wrap">
        <p>1.数据源：取业务中台-数据中心-销售明细内符合要求的订单明细数据</p>
        <p>2.统计范围：付款时间为近T天所有订单状态为已付款、部分付款、部分退款的订单</p>
        <p>3.统计时效说明：每 10 分钟更新统计数据</p>
        <p>4.数据变更说明：统计到的销售额等指标数据会因以下场景而出现变动</p>
        <p>* 销售延迟录单，例如客户在 1 月份付款，销售人员 2 月份到中台录单</p>
        <p>
          *
          订单状态变更：部分付款订单，用户二次付款后，在商务助理未审核之前，其订单状态为付款待审核，不在统计范围内，但已产生了实际收入
        </p>
        <p>* 已付款订单用户申请退款（部分退款）后，其订单的实付金额不会变更</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStatistics } from '@/api/newApi/workOrder/dataCenter.js';
export default {
  data() {
    return {
      visible: false,
      statisticsInfo: {},
    };
  },
  mounted() {
    this.getStatistics();
  },
  methods: {
    // 统计说明
    statisticsDes() {
      this.visible = true;
    },
    // 获取订单销售数据统计
    getStatistics() {
      getStatistics({}).then((res) => {
        if (res.code === 0) {
          this.statisticsInfo = res.data || {};
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-title {
  padding: 10px 20px;
  .text {
    color: #333333;
    font-weight: bold;
    font-size: 22px;
    line-height: 32px;
  }
  .explain {
    float: right;
  }
}
.data-box {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 35px;
  margin: 0 15px;
  .li {
    flex: 1;
    font-size: 16px;
    text-align: center;
    .tip {
      margin-bottom: 10px;
      font-weight: bold;
    }
    .val {
    }
  }
}
.explain-wrap {
  padding: 10px 20px;
  p {
    line-height: 28px;
    margin: 5px 0;
  }
}
</style>
