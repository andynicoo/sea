<!-- 详情页面返回 -->
<template>
  <div class="back-page">
    <div class="back-btn" @click="returnPage()">
      <LeftOutlined class="icon" />
      <span class="text">返回列表</span>
    </div>
    <div class="back-opt">
      <a-space>
        <slot name="optSlot" />
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jumpPage } from '@/utils/utils';
import { useStore } from '@/stores/store';
import router from '@/router';
import type { ITabsRecord } from '@/types';
import { LeftOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  backUrl: {
    default: '',
  },
});

//返回
const returnPage = () => {
  jumpPage(props.backUrl);
  const list: Array<ITabsRecord> = JSON.parse(JSON.stringify(useStore().tabsList));
  const index = list.findIndex((v: ITabsRecord) => v.path === router.currentRoute.value.path);
  list.splice(index, 1);
  useStore().setTabsList(list);
};
</script>
<style scoped lang="less">
.back-page {
  height: 40px;
  background-color: #fff;
  padding: 8px 15px;
  margin-bottom: 10px;
  display: flex;
  .back-btn {
    width: 100px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    cursor: pointer;
    .icon {
      margin: 4px;
    }
    .text {
      margin-left: 2px;
    }
  }
  .back-opt {
    flex: 1;
    text-align: right;
  }
}
</style>
