<template>
  <SearchForm ref="searchForm" :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button type="danger" @click="(showDetail = true), (detailItem = {})"> 新建 </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getUseLabel"
    :initSearch="true"
    :pageKeyStr="{ currentKey: 'current', pageSizeKey: 'size' }"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'btns'">
        <a-space>
          <FormOutlined style="color: #1890ff; margin-left: 10px" @click="edit(record)" />
          <DeleteOutlined style="color: #1890ff; margin-left: 10px" @click="delect(record)" />
        </a-space>
      </template>

      <template v-if="column.dataIndex === 'status'">
        <span v-if="record.status === 'ENABLE'"> 启用 </span>
        <span v-else-if="record.status === 'STOP'"> 停用 </span>
      </template>
    </template>
  </DataTable>
  <DetailsModalVue
    :detailData="detailItem"
    ref="detailPage"
    v-if="showDetail"
    :title="'新建'"
    :show="showDetail"
    @close="(val: boolean) => (showDetail = val,getListPage())"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import SearchForm from '../../../../../components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { message, Modal } from 'ant-design-vue';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import DetailsModalVue from './components/detailsModal.vue';
import { getUseLabel, deleatLabel } from '../../../../../api/workOrder/intellectualProperty/cofing/userLabel';
const dataTable = ref<any>(null);
const showDetail = ref<boolean>(false);
const detailPage = ref<any>(null);

const data: any = reactive({
  params: {},
});
let detailItem = reactive({});

function edit(row: any) {
  detailItem = row;
  showDetail.value = true;
}

function delect(row: { id: string | number }) {
  const { id }: { id: number | string } = row;
  try {
    Modal.confirm({
      title: '提示',
      width: 400,
      content: '确认删除？',
      async onOk() {
        await deleatLabel({ id });
        getListPage();
        message.success('删除成功');
      },
    });
  } catch (error) {
    message.error('删除失败');
  }
}

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  getListPage();
};

const getListPage = (resetCurrent = true) => {
  dataTable.value.getList(data.params);
};
</script>

<style scoped lang="less"></style>
