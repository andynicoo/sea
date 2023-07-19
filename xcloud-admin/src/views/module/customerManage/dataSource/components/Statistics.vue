<template>
  <a-row class="cell-wrap" type="flex">
    <a-col flex="1" class="cell">
      <div class="images">
        <img src="@/assets/img/icon/Group427318301.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.leadCount || 0 }}</p>
        <p class="tips-text">已接入线索</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318302.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.leadPushCrmCount || 0 }}</p>
        <p class="tips-text">已推送CRM线索</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318303.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.leadPushCrmErrorCount || 0 }}</p>
        <p class="tips-text">推送CRM失败线索</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318295.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.accountCount || 0 }}</p>
        <p class="tips-text">已接入客户</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318304.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.accountPushCrmCount || 0 }}</p>
        <p class="tips-text">已推送CRM客户</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318304.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.accountPushCrmErrorCount || 0 }}</p>
        <p class="tips-text">推送CRM失败客户</p>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { customerLeadAccountStatistics } from '@/api/customerManage/dataSource';

const statisticsInfo: any = ref({});

onMounted(() => {
  getStatistics();
});

//获取统计
const getStatistics = () => {
  customerLeadAccountStatistics().then((res: any) => {
    statisticsInfo.value = res;
  });
};
</script>

<style scoped lang="less">
.cell-wrap {
  padding-bottom: 10px;
  .ant-col {
    background-color: #fff;
    box-shadow: -2px 0px 10px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    border-radius: 10px;
    margin: 10px 10px 0;
    .images {
      width: 72px;
      height: 72px;
      margin: 16px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .text {
      flex: 1;
      margin: 16px 0;
      .num {
        line-height: 35px;
        font-size: 30px;
        color: #333;
        font-weight: bold;
        margin: 0 0 10px;
      }
      .tips-text {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }
  }
}
</style>
