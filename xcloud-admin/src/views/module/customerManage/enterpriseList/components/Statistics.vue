<template>
  <a-row class="cell-wrap" type="flex">
    <a-col flex="1" class="cell">
      <div class="images">
        <img src="@/assets/img/icon/Group427318301.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.enterpriseSum || 0 }}</p>
        <p class="tips-text">企业总数</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318302.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.companyCreditCodeIsNull || 0 }}</p>
        <p class="tips-text">统一社会信用代码为空的企业</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318303.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.companyAddressEnProviceIsNull || 0 }}</p>
        <p class="tips-text">所在省份为空的企业</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318295.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.companyYearAmountIsNull || 0 }}</p>
        <p class="tips-text">年销售额空的企业</p>
      </div>
    </a-col>
    <a-col flex="1">
      <div class="images">
        <img src="@/assets/img/icon/Group427318304.png" />
      </div>
      <div class="text">
        <p class="num">{{ statisticsInfo.shopSalePlatformNameIsNll || 0 }}</p>
        <p class="tips-text">在售平台为空的企业</p>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { selectCompanyNameStatistics } from '@/api/customerManage/enterpriseList';

const statisticsInfo: any = ref({});

onMounted(() => {
  getStatistics();
});

//获取统计
const getStatistics = () => {
  selectCompanyNameStatistics({}).then((res: any) => {
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
