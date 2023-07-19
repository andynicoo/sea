<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">奖金基数</span>
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
          <p>1.单行内下限必须低于上限</p>
          <p>2.所有数据必须按照从上到下，从底到高顺序填写</p>
          <p>3.业绩区间数值，不可重复或相交</p>
          <p>4.奖金比例不可重复</p>
        </div>
        <div class="tips-btn">
          <span @click="openFlag = !openFlag"> {{ openFlag ? '收起' : '展开' }} </span>
        </div>
      </div>

      <div class="table-wrap">
        <a-table size="small" :columns="columns" :data-source="list" :pagination="false">
          <template #bodyCell="{ record, index, column }">
            <template v-if="column.dataIndex === 'resultsOffline'">
              <a-input-number v-model:value="record.resultsOffline" placeholder="请输入" :min="0" :bordered="false" />
            </template>
            <template v-if="column.dataIndex === 'resultsOnline'">
              <a-input-number
                v-model:value="record.resultsOnline"
                placeholder="请输入"
                :min="record.resultsOffline || 0"
                :bordered="false"
              />
            </template>
            <template v-if="column.dataIndex === 'bonusProportion'">
              <a-input-number
                v-model:value="record.bonusProportion"
                placeholder="请输入"
                :min="0"
                :bordered="false"
                :formatter="(value: any) => `${value}%`"
                :parser="(value: any) => value.replace('%', '')"
              />
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

const props = defineProps({
  list: {
    default: [],
  },
});

const emit = defineEmits(['submit']);

const openFlag = ref(true);
const showDrawer = ref(false);
const columns = ref([
  { title: '业绩下限【>=】', dataIndex: 'resultsOffline', width: 100 },
  { title: '业绩上限【<】', dataIndex: 'resultsOnline', width: 100 },
  { title: '奖金比例', dataIndex: 'bonusProportion', width: 100 },
  { title: '操作', dataIndex: 'operation', width: 100 },
]);
const list: any = ref([]);

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      if (props.list.length > 0) {
        list.value = JSON.parse(JSON.stringify(props.list));
      } else {
        list.value = [
          {
            resultsOffline: 0,
            resultsOnline: null,
            bonusProportion: null,
          },
        ];
      }
    });
  }
});

//插入行
const addRecord = (index: number) => {
  list.value.splice(index + 1, 0, {
    resultsOffline: list.value[list.value.length - 1].resultsOnline || null,
    resultsOnline: null,
    bonusProportion: null,
  });
};

//删除
const removeRecord = (index: number) => {
  list.value.splice(index, 1);
};

//完成
const submit = () => {
  let min = 0;
  const arr: Array<number> = [];
  for (const li of list.value) {
    if (!li.resultsOffline && li.resultsOffline !== 0) {
      message.error('请输入业绩下限');
      return false;
    }
    if (!li.resultsOnline) {
      message.error('请输入业绩上限');
      return false;
    }
    if (!li.bonusProportion) {
      message.error('请输入奖金比例');
      return false;
    }
    if (li.resultsOffline >= min) {
      min = li.resultsOffline;
    } else {
      message.error('业绩数据应递增添加');
      return false;
    }
    if (li.resultsOnline > min) {
      min = li.resultsOnline;
    } else {
      message.error('业绩数据应递增添加');
      return false;
    }
    if (arr.indexOf(li.bonusProportion) === -1) {
      arr.push(li.bonusProportion);
    } else {
      message.error('奖金比例不可重复');
      return false;
    }
  }

  emit('submit', {
    keyStr: 'bonusRulesVOList',
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
}
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
</style>
