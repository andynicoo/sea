<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #topSlot>
      <Statistics />
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="productAging">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'status'">
        <span v-if="record.status === 1">启用</span>
        <span style="color: red" v-else>禁用</span>
      </template>
      <template v-if="column.dataIndex === 'secret'">
        <div v-if="record.secret" class="secret-wrap">
          <div class="secret-text">{{ record.secret }}</div>
        </div>
        <template v-else>-</template>
      </template>
      <template v-if="column.dataIndex === 'pushCrm'">
        <span v-if="record.pushCrm === 1">已开启</span>
        <span v-else>已关闭</span>
      </template>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import Statistics from './components/Statistics.vue';
import { productAging } from '@/api/dataCenter/goodsOnShelves';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  if (data.params.createTimeQuery && data.params.createTimeQuery.length === 2) {
    data.params.createTimeQuery = [
      data.params.createTimeQuery[0].split(' ')[0] + ' 00:00:00',
      data.params.createTimeQuery[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  dataTable.value.getList(data.params, resetCurrent);
};
</script>

<style scoped lang="less"></style>
