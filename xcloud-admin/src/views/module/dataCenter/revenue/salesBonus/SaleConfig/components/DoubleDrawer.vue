<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">业绩翻倍</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <div class="wrap">
      <div class="tips-wrap" :class="{ open: openFlag === true }">
        <div class="tips-icon">
          <img src="@/assets/img/salesBonus/tips-icon.svg" />
        </div>
        <div class="tips-text">
          <p>1.业绩翻倍日期不可超过活动日期</p>
          <p>2.时间必须按照从上到下，从前到后顺序填写</p>
          <p>3.业绩翻倍时间，不可重复或相交</p>
        </div>
        <div class="tips-btn">
          <span @click="openFlag = !openFlag"> {{ openFlag ? '收起' : '展开' }} </span>
        </div>
      </div>

      <div class="table-wrap">
        <a-table size="small" :columns="columns" :data-source="list" :pagination="false">
          <template #bodyCell="{ record, index, column }">
            <template v-if="column.dataIndex === 'performanceDoubleDate'">
              <a-range-picker
                v-model:value="record.performanceDoubleDate"
                :disabledDate="disabledDate"
                valueFormat="YYYY-MM-DD"
                :bordered="false"
              />
            </template>
            <template v-if="column.dataIndex === 'multiple'">
              <a-input-number v-model:value="record.multiple" placeholder="请输入" :min="0" :bordered="false" />
            </template>

            <template v-if="column.dataIndex === 'operation'">
              <span class="span-btn" @click="addRecord(index)">插入行</span>
              <span class="span-btn" @click="removeRecord(index)">删除</span>
            </template>
          </template>
        </a-table>
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
import { nextTick, ref, watch } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { betweenDay } from '@/utils/utils';

const props = defineProps({
  list: {
    default: [],
  },
  formModal: {
    default: {
      newActivityTimeList: [],
    },
  },
});

const emit = defineEmits(['submit']);

const openFlag = ref(true);
const showDrawer = ref(false);
const columns = ref([
  { title: '业绩翻倍日期', dataIndex: 'performanceDoubleDate', width: 200 },
  { title: '倍数', dataIndex: 'multiple', width: 100 },
  { title: '操作', dataIndex: 'operation', width: 100 },
]);
const list: any = ref([]);

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      dayjs.extend(isBetween);
      if (props.list.length > 0) {
        list.value = JSON.parse(JSON.stringify(props.list));
      } else {
        list.value = [
          {
            performanceDoubleDate: [],
            multiple: null,
          },
        ];
      }
    });
  }
});

//插入行
const addRecord = (index: number) => {
  list.value.splice(index + 1, 0, {
    performanceDoubleDate: [],
    multiple: null,
  });
};

//删除
const removeRecord = (index: number) => {
  list.value.splice(index, 1);
};

//禁用日期
const disabledDate = (current: Dayjs) => {
  let flag = false;
  const dateArr = props.formModal.newActivityTimeList;
  if (dateArr && dateArr.length === 2) {
    if (!dayjs(current).isBetween(dateArr[0], dateArr[1])) {
      flag = true;
    }
  }
  for (const li of list.value) {
    if (
      li.performanceDoubleDate &&
      dayjs(current).isBetween(li.performanceDoubleDate[0], li.performanceDoubleDate[1] + ' 23:59:59')
    ) {
      flag = true;
      break;
    }
  }
  return flag;
};

//完成
const submit = () => {
  const dateArr: Array<string> = [];
  for (const li of list.value) {
    if (!li.performanceDoubleDate || li.performanceDoubleDate.length === 0) {
      message.error('请选择日期');
      return false;
    }
    if (!li.multiple) {
      message.error('请输入倍数');
      return false;
    }
    for (const day of betweenDay(li.performanceDoubleDate[0], li.performanceDoubleDate[1]) || []) {
      if (dateArr.indexOf(day) !== -1) {
        message.error('日期重叠：' + day);
        return false;
      }
      dateArr.push(day);
    }
  }

  emit('submit', {
    keyStr: 'specialDoubleVOList',
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
  .tips-wrap {
    display: flex;
    padding: 12px 16px;
    background-color: #eef9ff;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin-bottom: 20px;
    .tips-icon {
      width: 24px;
      margin-right: 6px;
    }
    .tips-text {
      flex: 1;
      font-size: 12px;
      color: #999;
      p {
        margin-bottom: 6px;
      }
    }
    .tips-btn {
      width: 50px;
      font-size: 12px;
      color: #1890ff;
      text-align: center;
      span {
        cursor: pointer;
      }
    }
  }
  .tips-wrap.open {
    max-height: 200px;
  }
  .table-wrap {
    margin-bottom: 48px;
    .span-btn {
      font-size: 12px;
      color: #1890ff;
      padding: 0 5px;
      font-weight: 400;
      cursor: pointer;
    }
  }
  .btn-wrap {
    text-align: right;
  }
}
</style>
