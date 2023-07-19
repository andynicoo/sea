<template>
  <div class="logs-page" :loading="loading">
    <div class="panel-hd">
      <div class="title">操作日志</div>
    </div>
    <div class="panel-bd">
      <a-table :dataSource="data" :columns="columns" :bordered="true">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'username'">{{
            +record.clientType === 1 ? '用户' : record.username
          }}</template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, inject, watch } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getBusinessLogListByNo } from '@/api/base/basicsData';
import { useRoute } from 'vue-router';

const loading = ref(false);
const data = ref<any>([]);
const detail = inject('detail') as any;
const pageData = reactive({
  detail: inject('detail') as any,
});
const columns = ref<TableColumnsType>([
  {
    title: '操作员',
    dataIndex: 'username',
    key: 'username',
    width: 200,
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
  },
  {
    title: '操作时间',
    dataIndex: 'businessOperateTime',
    key: 'businessOperateTime',
  },
  {
    title: '操作类型',
    dataIndex: 'businessOperateName',
    key: 'businessOperateName',
  },
  {
    title: '操作内容',
    dataIndex: 'businessOperateReason',
    key: 'businessOperateReason',
  },
]);
const route = useRoute();
const getData = async () => {
  loading.value = true;
  try {
    data.value = await getBusinessLogListByNo({ businessNo: route.query.recordNo });
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
onMounted(() => {
  getData();
});
defineExpose({
  getData,
});
</script>
<style lang="less" scoped>
.logs-page {
  background: #fff;
  .title {
    font-weight: bold;
  }
}
</style>
