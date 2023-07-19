<template>
  <a-modal title="查看" width="600px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <span v-if="list.length === 0"> 暂无记录</span>
      <div class="item" v-for="(li, index) of list || []" :key="index">
        <div class="item-li">
          <span class="label">预警时效：</span>
          <span> {{ li.warnDurationLog }}</span>
        </div>
        <div class="item-li">
          <span class="label">交付时效：</span>
          <span>{{ li.deliverDurationLog }}</span>
        </div>
        <div class="item-li">
          <span class="label"> {{ li.createTime ? '新建时间' : '更新时间' }}：</span>
          <span> {{ li.createTime ? li.createTime : li.changeDate }}</span>
        </div>
        <div class="item-li">
          <span class="label">操作人：</span>
          <span> {{ li.operatorUser }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button @click="showModal = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const props = defineProps({
  record: {
    default: {
      durationConfigsLogsVOS: [],
    },
  },
});

const showModal = ref(false);
const list: any = ref([]);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      list.value = props.record.durationConfigsLogsVOS;
    });
  }
});

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 56vh;
  overflow-y: auto;
  padding: 0 10px;
  .item {
    border: 1px solid #eee;
    padding: 10px 20px;
    margin-bottom: 12px;
    .item-li {
      line-height: 24px;
      .label {
        color: #999;
      }
    }
  }
}
</style>
