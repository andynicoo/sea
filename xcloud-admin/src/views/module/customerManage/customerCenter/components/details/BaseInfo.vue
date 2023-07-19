<template>
  <div style="width: 800px">
    <div class="title-min">
      <span class="label">客户</span>
      <span>{{ router.currentRoute.value.query.mobile || '-' }}</span>
    </div>
    <a-form :model="detailsInfo" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item label="客户等级">
        <span v-if="detailsInfo.level === 1">SMB客户</span>
        <span v-else-if="detailsInfo.level === 2">KA客户</span>
        <span v-else-if="detailsInfo.level === 3">品牌客户</span>
        <span v-else-if="detailsInfo.level === 4">渠道客户</span>
      </a-form-item>
      <a-form-item label="客户生命周期">
        <span v-if="detailsInfo.custStatus === 0">提升期</span>
        <span v-else-if="detailsInfo.custStatus === 1">维护期</span>
        <span v-else-if="detailsInfo.custStatus === 2">衰退期</span>
        <span v-else-if="detailsInfo.custStatus === 3">流失期</span>
        <span v-else>-</span>
      </a-form-item>
      <a-form-item label="跟进人">
        <span v-if="detailsInfo.followUserName">{{
          detailsInfo.followUserName.substring(0, detailsInfo.followUserName.length - 1)
        }}</span>
      </a-form-item>
      <a-form-item label="跟进部门">
        <span v-if="detailsInfo.followUserDepName">{{
          detailsInfo.followUserDepName.substring(0, detailsInfo.followUserDepName.length - 1)
        }}</span>
      </a-form-item>
      <a-form-item label="最新成交时间">
        <span>{{ detailsInfo.orderCreateTime }}</span>
      </a-form-item>
      <a-form-item label="累计成交次数">
        <span>{{ detailsInfo.orderCount }}</span>
      </a-form-item>
      <a-form-item label="各品牌累计成交金额">
        <div class="details-list">
          <div class="details-li" v-for="(li, index) of detailsInfo.details || []" :key="index">
            <span> {{ li.brandName || '-' }} </span>
            <span>（{{ li.orderCount || 0 }} 单）: </span>
            <span> {{ li.orderSumAmount || 0 }}</span>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="动态一年累计成交金额">
        <span>{{ detailsInfo.payYearAmountSum }}</span>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getCustomerDetail } from '@/api/customerManage/customerCenter';
import router from '@/router';

const detailsInfo: any = ref({});

onMounted(() => {
  getDetailsInfo();
});

//获取信息
const getDetailsInfo = () => {
  getCustomerDetail({
    customerId: router.currentRoute.value.query.id,
  }).then((res: any) => {
    detailsInfo.value = res || {};
  });
};
</script>

<style scoped lang="less">
.title-min {
  line-height: 30px;
  margin-bottom: 15px;
  font-weight: bold;
  .label {
    background-color: rgb(205, 224, 245);
    color: rgb(45, 140, 240);
    padding: 2px 8px;
    border-radius: 3px;
    margin-right: 10px;
  }
}
.details-list {
  .details-li {
    line-height: 32px;
  }
}
</style>
