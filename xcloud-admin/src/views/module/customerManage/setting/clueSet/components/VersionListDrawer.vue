<template>
  <a-drawer
    v-model:visible="showDrawer"
    placement="right"
    :keyboard="false"
    :maskClosable="false"
    :closable="false"
    width="440px"
  >
    <template #title>
      <div class="title-head">
        <span class="text">
          版本对比
          <a-button type="primary" size="small" @click="comparison()" style="margin: 0 6px"> 版本对比 </a-button>
        </span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <div class="cell-wrap">
      <a-timeline>
        <a-timeline-item v-for="(li, index) of list" :key="index">
          <div class="cell">
            <div class="date">{{ li.updateTime || '-' }}</div>
            <div class="name">{{ li.version || '-' }}</div>
            <div class="name">{{ li.createName || '-' }}</div>

            <!-- <div class="btn">
              <a-button type="primary" size="small" @click="comparison(li)">版本对比</a-button>
            </div> -->
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
  </a-drawer>
  <VersionModal ref="versionModal" />
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import { findHistoryList } from '@/api/customerManage/clueSet';
import VersionModal from './VersionModal.vue';

const showDrawer = ref(false);
const list: any = ref([]);
watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      findHistoryListFun();
    });
  }
});

//版本对比
const versionModal: Ref = ref(null);
const comparison = () => {
  versionModal.value.showModal = true;
};

// 获取历史版本
const findHistoryListFun = () => {
  findHistoryList({}).then((res: any) => {
    list.value = res || [];
  });
};

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
.cell-wrap {
  .cell {
    position: relative;

    .date {
      font-size: 16px;
    }
    .name {
      font-size: 14px;
    }
    .btn {
      display: none;
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -12px;
    }
  }
  .cell:hover {
    .btn {
      display: block;
    }
  }
}
</style>
