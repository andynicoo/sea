<template>
  <SearchForm :rule="rule" @submitParams="submitParams"></SearchForm>

  <a-spin :spinning="loading">
    <ul class="services-status-tab">
      <li
        :class="{ active: data.servicesType == item.id }"
        v-for="item in data.servicesStatusList"
        :key="item.id"
        @click="servicesStatusChange(item)"
      >
        <b class="services-icon" :class="item.icon"></b>

        {{ item.label }}
        <p>{{ item.value }}</p>
      </li>
    </ul>
  </a-spin>
  <Commit v-if="data.servicesType === 1" :searchParams="data.params" />
  <DataRejected v-if="data.servicesType === 2" :searchParams="data.params" />
  <OvertimeDelivery v-if="data.servicesType === 3" :searchParams="data.params" />
  <ReAgent v-if="data.servicesType === 4" :searchParams="data.params" />
</template>

<script setup lang="ts">
import { rule } from './config';
import SearchForm from '@/components/page/SearchForm.vue';
import DataRejected from './components/DataRejected.vue';
import OvertimeDelivery from './components/OvertimeDelivery.vue';
import Commit from './components/Commit.vue';
import ReAgent from './components/ReAgent.vue';
import { getVatCount } from '@/api/management/vat';

import type { ServicesStatusListOV } from '@/types/myServices';
import { cloneDeep } from 'lodash';

const { setPageCache, cacheData } = useSearchFormCache();

const loading = ref(false);

const data: any = reactive({
  servicesStatusList: [
    {
      label: '待客户提交',
      id: 1,
      value: 0,
      icon: 'order-icon',
    },
    {
      label: '资料被驳回',
      id: 2,
      value: 0,
      icon: 'warn-icon',
    },
    {
      label: '工单超时未处理',
      id: 3,
      value: 0,
      icon: 'service-icon',
    },
    {
      label: '已下号/完成转代理',
      id: 4,
      value: 0,
      icon: 'complete-icon',
    },
  ],
  params: { ...cacheData.value },
  servicesType: cacheData.value.servicesType || 1,
});

//点击搜索
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const submitParams = async (params: any) => {
  if (params.serviceCreate && params.serviceCreate.length === 2) {
    params.serviceCreateStart = params.serviceCreate[0].split(' ')[0] + ' 00:00:00';
    params.serviceCreateEnd = params.serviceCreate[1].split(' ')[0] + ' 23:59:59';
    params.serviceCreate = [params.serviceCreateStart, params.serviceCreateEnd];
  }
  if (params.materialSubmit && params.materialSubmit.length === 2) {
    params.materialSubmitStart = params.materialSubmit[0].split(' ')[0] + ' 00:00:00';
    params.materialSubmitEnd = params.materialSubmit[1].split(' ')[0] + ' 23:59:59';
    params.materialSubmit = [params.materialSubmitStart, params.materialSubmitEnd];
  }
  if (params.departmentIds) {
    params.departmentIds = params.departmentIds.params;
  }
  data.params = params;
  setPageCache(params);

  loading.value = true;
  const res = await getVatCount(data.params).finally(() => (loading.value = false));
  data.servicesStatusList[0].value = res.vatCommitCount;
  data.servicesStatusList[1].value = res.vatRejectCount;
  data.servicesStatusList[2].value = res.vatDeclareCount;
  data.servicesStatusList[3].value = res.vatTaxNumberCount;
};
//切换服务状态
const servicesStatusChange = (item: ServicesStatusListOV) => {
  data.servicesType = item.id;
  setPageCache({ servicesType: item.id });
  setTimeout(() => {
    data.params = cloneDeep(data.params);
  });
};
</script>

<style scoped lang="less">
.services-status-tab {
  margin-top: -10px;
  background: #fff;
  width: 100%;
  display: flex;
  padding-left: 20px;
  padding-bottom: 14px;
  justify-content: space-between;
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
  li {
    background: #f4f7f9;
    margin-right: 20px;
    padding: 26px 5px 26px 32px;
    flex-grow: 2;
    border: 1px solid #f4f7f9;
    cursor: pointer;
    p {
      font-size: 18px;
      margin-top: 10px;
      font-weight: bold;
    }
    &.active {
      border: 1px solid #1890ff;
    }
  }
}

.services-icon {
  width: 56px;
  height: 56px;
  float: left;
  margin-right: 20px;
  background-size: 100% 100% !important;
}
.order-icon {
  background: url(@/assets/img/check/order-icon.png) no-repeat;
}
.warn-icon {
  background: url(@/assets/img/check/warn-icon.png) no-repeat;
}
.service-icon {
  background: url(@/assets/img/check/service-icon.png) no-repeat;
}
.complete-icon {
  background: url(@/assets/img/check/complete-icon.png) no-repeat;
}
</style>
