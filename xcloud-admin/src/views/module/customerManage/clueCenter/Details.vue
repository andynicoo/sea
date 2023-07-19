<template>
  <div class="wrap">
    <div class="back-page" @click="returnPage()">
      <LeftOutlined class="icon" />
      <span class="text">查看详情</span>
    </div>
    <div class="content">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="baseInfo" tab="基本信息">
          <EditInfo @submit="returnPage" />
        </a-tab-pane>
        <a-tab-pane key="followRecord" tab="跟进记录">
          <FollowRecord />
        </a-tab-pane>
        <a-tab-pane key="formInfo" tab="表单信息">
          <FormInfo />
        </a-tab-pane>
        <a-tab-pane key="operationLog" tab="操作日志">
          <OperationLog />
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
import EditInfo from './components/details/EditInfo.vue';
import FormInfo from './components/details/FormInfo.vue';
import FollowRecord from './components/details/FollowRecord.vue';
import OperationLog from './components/details/OperationLog.vue';

const activeKey = ref('baseInfo');

//返回
const returnPage = () => {
  jumpPage('/customerManage/clueCenter');
  const list: Array<ITabsRecord> = JSON.parse(JSON.stringify(useStore().tabsList));
  const index = list.findIndex((v: ITabsRecord) => v.path === '/customerManage/clueCenter/Details');
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
  .content {
  }
}
</style>
