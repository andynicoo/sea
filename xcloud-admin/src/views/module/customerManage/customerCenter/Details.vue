<template>
  <div class="wrap">
    <div class="back-page" @click="returnPage()">
      <LeftOutlined class="icon" />
      <span class="text">查看详情</span>
    </div>
    <div class="content">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="baseInfo" tab="基本信息">
          <BaseInfo />
        </a-tab-pane>
        <a-tab-pane
          key="orderInfo"
          tab="订单信息"
          v-if="useButton('xcloudplat_customerManage_CustomerCenter_orderInfo')"
        >
          <OrderInfo />
        </a-tab-pane>
        <a-tab-pane
          key="payAccount"
          tab="线下打款账户"
          v-if="useButton('xcloudplat_customerManage_CustomerCenter_payAccount')"
        >
          <PaymentAccount />
        </a-tab-pane>
        <a-tab-pane
          key="accountInfo"
          tab="账号信息"
          v-if="useButton('xcloudplat_customerManage_CustomerCenter_accountInfo')"
        >
          <AccountInfo />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { jumpPage } from '@/utils/utils';
import { LeftOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/stores/store';
import type { ITabsRecord } from '@/types';

import BaseInfo from './components/details/BaseInfo.vue';
import OrderInfo from './components/details/OrderInfo.vue';
import PaymentAccount from './components/details/PaymentAccount.vue';
import AccountInfo from './components/details/AccountInfo.vue';
import type { Ref } from 'vue';
import { useButton } from '@/utils/utils';

const activeKey: Ref<string> = ref('baseInfo');

//返回
const returnPage = () => {
  jumpPage('/customerManage/customerCenter');
  const list: Array<ITabsRecord> = JSON.parse(JSON.stringify(useStore().tabsList));
  const index = list.findIndex((v: ITabsRecord) => v.path === '/customerManage/customerCenter/Details');
  list.splice(index, 1);
  useStore().setTabsList(list);
};
</script>

<style scoped lang="less">
.wrap {
  background-color: #fff;
  height: calc(100% - 10px);
  overflow: auto;
  padding: 10px 15px;
  .back-page {
    width: 100px;
    line-height: 22px;
    font-size: 14px;
    cursor: pointer;
    .icon {
      margin: 4px;
    }
    .text {
      margin-left: 2px;
    }
  }
}
</style>
