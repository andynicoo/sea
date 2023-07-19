<template>
  <a-table class="answer-table" bordered :columns="columns" :data-source="props.dataSource" :pagination="false">
    <template #bodyCell="{ column, text, index, record }">
      <template v-if="column.dataIndex === 'index'">
        <span>{{ record.isBestAnswer==='true' ? '最佳答案' : index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'answerContext'">
        <a-tooltip :title="text">
          <div class="answer-context" v-html="text"></div>
        </a-tooltip>
      </template>
      <template v-if="column.dataIndex === 'operation'" class="operation">
        <span class="btn" @click="edit(index)">编辑</span>
        <span class="btn" @click="del(index)">删除</span>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { reactive, onMounted} from 'vue';
const props = defineProps({
  dataSource: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  operation: {
    type: Boolean,
    default: true,
  },
});

const columns = reactive([
  {
    title: '排序',
    dataIndex: 'index',
    width: 80,
    align: 'center',
  },
  {
    title: '回答内容',
    dataIndex: 'answerContext',
    width: 200,
    align: 'center',
  },
  {
    title: '回答者',
    dataIndex: 'respondentName',
    width: 180,
    align: 'center',
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: 150,
    align: 'center',
  },
  {
    title: '发布人',
    dataIndex: 'createName',
    width: 110,
    align: 'center',
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 150,
    align: 'center',
  },
  {
    title: '修改人',
    dataIndex: 'modifyName',
    width: 110,
    align: 'center',
  },
]);


onMounted(() => {
  if (props.operation) {
    columns.push({
      title: '操作',
      dataIndex: 'operation',
      width: 160,
      align: 'center',
    });
  } else {
    columns.pop();
  }
});

const emits = defineEmits(['editRow', 'delRow']);

// 编辑
function edit(index: number) {
  emits('editRow', index);
}

//删除
function del(index: number) {
  emits('delRow', index);
}
</script>
<style scoped lang="less">
.answer-table {
  width: 1000px;
  margin-left: 130px;
  .btn {
    display: inline-block;
    margin: 0 5px;
    cursor: pointer;
    &:hover {
      color: #1890ff;
    }
  }
  .answer-context {
    display: flex;
    align-items: center;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    :deep(p, h2, h2, h4, div) {
      width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
