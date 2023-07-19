<template>
  <div class="data-box-wrap">
    <div class="flex4">
      <div class="data-box">
        <div class="title-tips">
          实付销售额(已付款)
          <a-tooltip placement="top">
            <template #title>
              <div style="font-size: 12px">按照付款时间统计销售额</div>
            </template>

            <ExclamationCircleFilled style="color: #f0b955" />
          </a-tooltip>
        </div>
        <div class="num">
          <template v-if="resData.productMoney > 10000">
            <span class="num-max">{{ (resData.productMoney / 10000).toFixed(2) }}</span>
            <span>万</span>
          </template>
          <template v-else>
            <span class="num-max">{{ resData.productMoney || 0 }}</span>
            <span>元</span>
          </template>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.productMoneyMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productMoneyMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productMoneyMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.productMoneyYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productMoneyYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productMoneyYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">
          实付销售额(已到账)
          <a-tooltip placement="top">
            <template #title>
              <div style="font-size: 12px">按照确认到账时间统计销售额</div>
            </template>

            <ExclamationCircleFilled style="color: #f0b955" />
          </a-tooltip>
        </div>
        <div class="num">
          <template v-if="resData.productAmountMoney > 10000">
            <span class="num-max">{{ (resData.productAmountMoney / 10000).toFixed(2) }}</span>
            <span>万</span>
          </template>
          <template v-else>
            <span class="num-max">{{ resData.productAmountMoney || 0 }}</span>
            <span>元</span>
          </template>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.productAmountMoneyMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productAmountMoneyMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productAmountMoneyMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.productAmountMoneyYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productAmountMoneyYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productAmountMoneyYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">商品销量</div>
        <div class="num">
          <span class="num-max">{{ resData.productSales || 0 }}</span>
          <span>件</span>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.productSalesMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productSalesMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productSalesMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.productSalesYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productSalesYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productSalesYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">成交订单数</div>
        <div class="num">
          <span class="num-max">{{ resData.orderSales || 0 }}</span>
          <span>笔</span>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.orderSalesMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.orderSalesMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.orderSalesMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.orderSalesYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.orderSalesYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.orderSalesYearOnYear < 0" />
          </span>
        </div>
      </div>
    </div>
    <div class="flex5">
      <div class="data-box">
        <div class="title-tips">全部退款额</div>
        <div class="num">
          <template v-if="resData.refundMoney > 10000">
            <span class="num-max">{{ (resData.refundMoney / 10000).toFixed(2) }}</span>
            <span>万</span>
          </template>
          <template v-else>
            <span class="num-max">{{ resData.refundMoney || 0 }}</span>
            <span>元</span>
          </template>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.refundMoneyMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.refundMoneyMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.refundMoneyMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.refundMoneyYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.refundMoneyYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.refundMoneyYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">全部退款商品量</div>
        <div class="num">
          <span class="num-max">{{ resData.productSalesRefundMoney || 0 }}</span>
          <span>件</span>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.productSalesRefundMoneyMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productSalesRefundMoneyMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productSalesRefundMoneyMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.productSalesRefundMoneyYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productSalesRefundMoneyYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productSalesRefundMoneyYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">部分退款额</div>
        <div class="num">
          <template v-if="resData.partRefundMoney > 10000">
            <span class="num-max">{{ (resData.partRefundMoney / 10000).toFixed(2) }}</span>
            <span>万</span>
          </template>
          <template v-else>
            <span class="num-max">{{ resData.partRefundMoney || 0 }}</span>
            <span>元</span>
          </template>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.partRefundMoneyMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.partRefundMoneyMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.partRefundMoneyMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.partRefundMoneyYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.partRefundMoneyYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.partRefundMoneyYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">部分退款商品量</div>
        <div class="num">
          <span class="num-max">{{ resData.productSalesPartRefundMoney || 0 }}</span>
          <span>件</span>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.productSalesPartRefundMoneyMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productSalesPartRefundMoneyMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productSalesPartRefundMoneyMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.productSalesPartRefundMoneyYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.productSalesPartRefundMoneyYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.productSalesPartRefundMoneyYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">退款手续费</div>
        <div class="num">
          <template v-if="resData.refundPoundage > 10000">
            <span class="num-max">{{ (resData.refundPoundage / 10000).toFixed(2) }}</span>
            <span>万</span>
          </template>
          <template v-else>
            <span class="num-max">{{ resData.refundPoundage || 0 }}</span>
            <span>元</span>
          </template>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.refundPoundageMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.refundPoundageMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.refundPoundageMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.refundPoundageYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.refundPoundageYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.refundPoundageYearOnYear < 0" />
          </span>
        </div>
      </div>
    </div>
    <div class="flex3">
      <div class="data-box">
        <div class="title-tips">消费客户数</div>
        <div class="num">
          <span class="num-max">{{ resData.userSales || 0 }}</span>
          <!-- <span>个</span> -->
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.userSalesMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.userSalesMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.userSalesMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.userSalesYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.userSalesYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.userSalesYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">新客数</div>
        <div class="num">
          <span class="num-max">{{ resData.userNewSales || 0 }}</span>
          <!-- <span>个</span> -->
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.userNewSalesMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.userNewSalesMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.userNewSalesMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.userNewSalesYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.userNewSalesYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.userNewSalesYearOnYear < 0" />
          </span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">老客数</div>
        <div class="num">
          <span class="num-max">{{ resData.userOldSales || 0 }}</span>
          <!-- <span>个</span> -->
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.userOldSalesMonthOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.userOldSalesMonthOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.userOldSalesMonthOnYear < 0" />
          </span>
        </div>
        <div class="ratio">
          <span>同比 </span>
          <span> {{ resData.userOldSalesYearOnYear || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.userOldSalesYearOnYear > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.userOldSalesYearOnYear < 0" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue';
import { getOrderSalesStatistics } from '@/api/dataCenter/revenueAnalysis';
import { ref } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';

const props = defineProps({
  params: {
    default: {},
  },
});
const resData: any = ref({});

//获取数据
const getList = () => {
  getOrderSalesStatistics(props.params).then((res: any) => {
    resData.value = res || {};
  });
};

//暴露方法
defineExpose({ getList });
</script>

<style scoped lang="less">
.data-box-wrap {
  display: flex;
  margin: 15px 0;
  .flex3 {
    flex: 3;
    display: flex;
    background-color: #fff;
    padding: 20px 0;
    margin-left: 15px;
  }
  .flex4 {
    flex: 4;
    display: flex;
    background-color: #fff;
    padding: 20px 0;
  }
  .flex5 {
    flex: 5;
    display: flex;
    background-color: #fff;
    padding: 20px 0;
    margin-left: 15px;
  }
  .data-box {
    flex: 1;
    padding: 0 15px;
    font-size: 14px;
    .title-tips {
      color: #666;
    }
    .num {
      color: #333;
      .num-max {
        font-size: 30px;
        font-weight: 400;
        padding-right: 6px;
      }
    }
    .ratio {
      color: #333;
    }
  }
}
</style>
