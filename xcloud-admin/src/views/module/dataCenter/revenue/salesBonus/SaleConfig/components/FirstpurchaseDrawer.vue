<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">首购规则</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <div class="wrap">
      <div class="form-wrap">
        <div class="cell" v-for="(record, index) of list || []" :key="index">
          <span style="margin-right: 10px">首购个人平均业绩</span>
          <a-select v-model:value="record.numericalValue" placeholder="请选择" style="width: 100px; margin-right: 10px">
            <a-select-option value="GreaterThan">大于</a-select-option>
            <a-select-option value="GreaterThanOrEqualTo">大于等于</a-select-option>
            <a-select-option value="LessThan">小于</a-select-option>
            <a-select-option value="LessThanOrEqualTo">小于等于</a-select-option>
            <a-select-option value="EqualTo">等于</a-select-option>
          </a-select>
          <a-input-number
            v-model:value="record.performance"
            placeholder="请输入"
            :min="0"
            style="width: 70px; margin-right: 10px"
          />
          <span style="margin-right: 10px">则按照</span>
          <a-select v-model:value="record.type" placeholder="请选择" style="width: 160px; margin-right: 10px">
            <a-select-option value="ActualPerformance">实际业绩</a-select-option>
            <a-select-option value="SetRideOrdersNum">设定值*实际订单数</a-select-option>
          </a-select>
          <span style="margin-right: 10px">计算业绩</span>
          <MinusCircleOutlined class="delete-btn" @click="removeRecord(index)" />
        </div>
        <a-button type="primary" @click="addRecord()" v-if="list.length < 2">插入行</a-button>
      </div>
      <div class="btn-wrap">
        <a-space :size="24">
          <a-button @click="showDrawer = false">取消</a-button>
          <a-button type="primary" @click="submit()">完成</a-button>
        </a-space>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';
import { CloseOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  list: {
    default: [],
  },
});

const emit = defineEmits(['submit']);
const showDrawer = ref(false);
const list: any = ref([]);

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      if (props.list.length > 0) {
        list.value = JSON.parse(JSON.stringify(props.list));
      } else {
        list.value = [
          {
            numericalValue: null,
            performance: null,
            type: null,
          },
        ];
      }
    });
  }
});

//插入行
const addRecord = () => {
  list.value.push({
    numericalValue: null,
    performance: null,
    type: null,
  });
};

//删除
const removeRecord = (index: number) => {
  list.value.splice(index, 1);
};

//完成
const submit = () => {
  for (const li of list.value) {
    if (!li.numericalValue || !li.performance || !li.type) {
      message.error('请输入必选项');
      return false;
    }
  }

  emit('submit', {
    keyStr: 'firstShopRuleVOList',
    value: list.value,
  });
  showDrawer.value = false;
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
.wrap {
  padding: 0 16px 0 18px;
  .form-wrap {
    overflow-x: auto;
    margin-bottom: 30px;
    .cell {
      margin-bottom: 16px;
      width: 630px;
      .delete-btn {
        cursor: pointer;
        color: red;
      }
    }
  }
  .btn-wrap {
    text-align: right;
  }
}
</style>
