<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">统计说明</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <div class="desc-wrap">
      <div class="p1">1、统计范围：符合业务中台收款明细到账时间、退款时间为近T天产生销售数据</div>
      <div class="p1">2、数据同步周期：系统间隔10分钟自动增量同步一次业务中台最新订单数据</div>
      <div class="p1">3、销售额数据：统计订单商品状态为已付款、部分付款、退款中、部分退款 商品实付金额之和</div>
      <div class="p1">
        4、退款额数据：统计订单商品状态为 申请退款
        状态商品实际退款成功金额、退款手续费金额（第三方手续费+平台手续费）之和
      </div>
      <div class="p1">
        5、到账时间与退款完成时间同时进行选择，将优先匹配符合到账时间数据再从中筛选符合退款成功时间的数据算为退款数据进行统计
      </div>
      <div class="p1">6、统计到的销售额等指标数据会因以下场景而出现变动</div>
      <div class="p2">6.1、销售录单后订单未及时确认到账，将会出实收金额存在差异</div>
      <div class="p2">6.2、销售延迟录单，例如客户在 1 月份付款，销售人员 2 月份到中台录单</div>
      <div class="p2">
        6.3、部分付款订单，进行第2笔凭证录入时，订单状态将由部分付款变为付款待确认，不在统计范围内,将减少对应的成交订单数
      </div>
      <div class="p2">
        6.4、同1笔订单存在多条付款信息，系统将匹配符合所选到账时间的数据进行统计均摊，如果选择的到账时间仅包含其中1条付款记录信息，将会出现商品统计销售额数据低于实际销售额
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { CloseOutlined } from '@ant-design/icons-vue';

const showDrawer = ref(false);

defineExpose({ showDrawer });
</script>

<style scoped lang="less">
.title-head {
  .text {
    font-size: 14px;
    color: #333;
  }
  .close-icon {
    float: right;
    cursor: pointer;
  }
}
.desc-wrap {
  .p1 {
    line-height: 32px;
    font-size: 14px;
    color: #000;
  }
  .p2 {
    line-height: 26px;
    font-size: 12px;
    color: #000;
    padding-left: 12px;
  }
}
</style>
