<template>
  <div class="wrap">
    <div class="back-page" @click="returnPage()">
      <LeftOutlined class="icon" />
      <span class="text">新增线索</span>
    </div>
    <EditInfo @submit="returnPage" />
  </div>
</template>

<script setup lang="ts">
import { jumpPage } from '@/utils/utils';
import { LeftOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/stores/store';
import type { ITabsRecord } from '@/types';
import EditInfo from './components/details/EditInfo.vue';

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
}
</style>
