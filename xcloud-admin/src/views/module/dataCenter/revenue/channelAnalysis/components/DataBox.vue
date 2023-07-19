<template>
  <div class="data-box-wrap">
    <div class="flex4">
      <div class="data-box">
        <div class="title-tips">新增渠道</div>
        <div class="num">
          <span class="num-max">{{ resData.addChannel || 0 }}</span>
          <span>个</span>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.upAddChannel || 0 }} </span>
          <span>（ </span>
          <span> {{ resData.upAddChannelRatio || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.upAddChannelRatio > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.upAddChannelRatio < 0" />
          </span>
          <span> ）</span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">新增渠道成交公司</div>
        <div class="num">
          <span class="num-max">{{ resData.addChannelCompany || 0 }}</span>
          <span>个</span>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.upAddChannelCompany || 0 }} </span>
          <span>（ </span>
          <span> {{ resData.upAddChannelCompanyRatio || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.upAddChannelCompanyRatio > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.upAddChannelCompanyRatio < 0" />
          </span>
          <span> ）</span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">新增订单</div>
        <div class="num">
          <span class="num-max">{{ resData.addOrder || 0 }}</span>
          <span>个</span>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span> {{ resData.upAddOrder || 0 }} </span>
          <span>（ </span>
          <span> {{ resData.upAddOrderRatio || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.upAddOrderRatio > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.upAddOrderRatio < 0" />
          </span>
          <span> ）</span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">应收金额</div>
        <div class="num">
          <template v-if="resData.orderPaymentMoney > 10000">
            <span class="num-max">{{ (resData.orderPaymentMoney / 10000).toFixed(2) }}</span>
            <span>万</span>
          </template>
          <template v-else>
            <span class="num-max">{{ resData.orderPaymentMoney || 0 }}</span>
            <span>元</span>
          </template>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span>
            <template v-if="resData.upOrderPaymentMoney > 10000">
              {{ (resData.upOrderPaymentMoney / 10000).toFixed(2) }} 万
            </template>
            <template v-else> {{ resData.upOrderPaymentMoney || 0 }} 元 </template>
          </span>
          <span>（ </span>
          <span> {{ resData.upOrderPaymentMoneyRatio || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.upOrderPaymentMoneyRatio > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.upOrderPaymentMoneyRatio < 0" />
          </span>
          <span> ）</span>
        </div>
      </div>
      <div class="data-box">
        <div class="title-tips">实收金额</div>
        <div class="num">
          <template v-if="resData.orderPaidMoney > 10000">
            <span class="num-max">{{ (resData.orderPaidMoney / 10000).toFixed(2) }}</span>
            <span>万</span>
          </template>
          <template v-else>
            <span class="num-max">{{ resData.orderPaidMoney || 0 }}</span>
            <span>元</span>
          </template>
        </div>
        <div class="ratio">
          <span>环比 </span>
          <span>
            <template v-if="resData.upOrderPaidMoney > 10000">
              {{ (resData.upOrderPaidMoney / 10000).toFixed(2) }} 万
            </template>
            <template v-else> {{ resData.upOrderPaidMoney || 0 }} 元 </template>
          </span>
          <span>（ </span>
          <span> {{ resData.upOrderPaidMoneyRatio || 0 }} % </span>
          <span>
            <CaretUpOutlined style="color: red" v-if="resData.upOrderPaidMoneyRatio > 0" />
            <CaretDownOutlined style="color: green" v-else-if="resData.upOrderPaidMoneyRatio < 0" />
          </span>
          <span> ）</span>
        </div>
      </div>
      <div class="data-box" v-if="useButton('xcloudplat_dataCenter_channelAnalysis_order')">
        <div class="title-tips">累计订单</div>
        <div class="num">
          <span class="num-max">{{ resData.sumOrder || 0 }}</span>
          <span>个</span>
        </div>
      </div>
      <div class="data-box" v-if="useButton('xcloudplat_dataCenter_channelAnalysis_money')">
        <div class="title-tips">累计成交金额</div>
        <div class="num">
          <template v-if="resData.sumOrderPaidMoney > 10000">
            <span class="num-max">{{ (resData.sumOrderPaidMoney / 10000).toFixed(2) }}</span>
            <span>万</span>
          </template>
          <template v-else>
            <span class="num-max">{{ resData.sumOrderPaidMoney || 0 }}</span>
            <span>元</span>
          </template>
        </div>
      </div>
      <div class="data-box" v-if="useButton('xcloudplat_dataCenter_channelAnalysis_channel')">
        <div class="title-tips">累计渠道</div>
        <div class="num">
          <span class="num-max">{{ resData.allChannel || 0 }}</span>
          <span>个</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue';
import { useButton } from '@/utils/utils';

defineProps({
  resData: {
    type: Object,
    default: () => null,
  },
});
</script>

<style scoped lang="less">
.data-box-wrap {
  display: flex;
  margin: 15px 0;
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
    text-align: center;
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
