<template>
  <div class="tabs-wrap">
    <a-tabs v-model:activeKey="activeKey" type="editable-card" :hideAdd="true" @change="changeTabs" @edit="editTabs">
      <a-tab-pane key="/home" tab="首页" :closable="false" />
      <a-tab-pane v-for="pane in panes" :key="pane.path" :tab="pane.title" />
    </a-tabs>
    <div class="btn-wrap">
      <a-dropdown>
        <span class="btn-text">关闭</span>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="closeTabs('all')"> 关闭所有 </a-menu-item>
            <a-menu-item @click="closeTabs('other')"> 关闭其他 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from '@/stores/store';
import router from '@/router';
import type { ITabsRecord } from '@/types';

const panes = computed<Array<ITabsRecord>>(() => useStore().tabsList);
const activeKey = ref<string>(router.currentRoute.value.path);

watch(
  () => router.currentRoute.value.path,
  () => {
    setActiveKey();
  }
);

onMounted(() => {
  setActiveKey();
});

//切换tabs
const changeTabs = (activeKey: any) => {
  const tab: ITabsRecord | undefined = panes.value.find((v: ITabsRecord) => v.path === activeKey);
  if (tab) {
    router.push({
      path: tab.path,
      query: tab.query,
    });
  } else {
    router.push(activeKey);
  }
};

//编辑tabs
const editTabs = (activeKey: string, action: string) => {
  if (action === 'remove') {
    const list: Array<ITabsRecord> = JSON.parse(JSON.stringify(panes.value)); //tabs列表
    const index = list.findIndex((v: ITabsRecord) => v.path === activeKey);
    const currentIndex = list.findIndex((v: ITabsRecord) => v.path === router.currentRoute.value.path);
    list.splice(index, 1);
    useStore().setTabsList(list);
    if (index === currentIndex) {
      if (list.length === 0) {
        router.push('/home');
      } else if (list.length > currentIndex) {
        router.push(list[currentIndex].path);
      } else {
        router.push(list[list.length - 1].path);
      }
    }
  }
};

//关闭tabs
const closeTabs = (type: string) => {
  if (type === 'all') {
    router.push('/home');
    useStore().setTabsList([]);
  } else if (type === 'other') {
    const tab = panes.value.find((v: ITabsRecord) => v.path === router.currentRoute.value.path);
    if (tab) {
      useStore().setTabsList([tab]);
    }
  }
};

//设置当前tab
const setActiveKey = () => {
  activeKey.value = router.currentRoute.value.path;
};
</script>

<style scoped lang="less">
.tabs-wrap {
  background-color: #eee;
  box-shadow: 0px 0 5px 1px rgb(100 100 100 / 10%) inset;
  display: flex;
  &:deep(.ant-tabs) {
    flex: 1;
    .ant-tabs-nav {
      margin: 4px 0 4px 10px;
      .ant-tabs-tab {
        line-height: 28px;
        line-height: 28px;
        padding: 0 12px;
        color: #515a6e;
        margin-right: 5px;
        border-radius: 3px;
        font-size: 12px;
        border: 1px solid #e8eaec;
      }
      .ant-tabs-nav-operations {
        background-color: #fff;
        .ant-tabs-nav-more {
          padding: 0 20px;
          border: 1px solid #e8eaec;
        }
      }
    }
  }
  .btn-wrap {
    width: 50px;
    margin: 4px 10px 4px 2px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #e8eaec;
    font-size: 12px;
    .btn-text {
      padding: 5px 8px;
    }
  }
}
</style>
