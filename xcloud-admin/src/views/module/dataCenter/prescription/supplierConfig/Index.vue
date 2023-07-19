<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button v-if="useButton('dataCenter_prescription_supplierConfig_add')" type="primary" @click="edit({})">
          新增
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getListPage"
    :pageKeyStr="{ currentKey: 'current', pageSizeKey: 'size' }"
  >
    <template #headerCell="{ title, column }">
      <template v-if="column.dataIndex === 'workOrderType'">
        <TitleTips
          :title="title"
          tips="工单类型要监控的节点范围，以预警时效和交付时效监控该范围的服务用时，并标记出服务的预警和超时"
        />
      </template>
      <template v-if="column.dataIndex === 'warnDuration'">
        <TitleTips :title="title" tips="当监控区间的服务用时大于预警时效时，服务单进入预警工单，且异常状态为预警" />
      </template>
      <template v-if="column.dataIndex === 'deliverDuration'">
        <TitleTips :title="title" tips="当监控区间的服务用时大于交付时效时，服务单异常状态由预警变为超时" />
      </template>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'workOrderType'"> {{ workOrderTypeFilter(record.workOrderType) }} </template>
      <template v-if="column.dataIndex === 'warnDuration'"> {{ record.warnDuration }} 天 </template>
      <template v-if="column.dataIndex === 'deliverDuration'"> {{ record.deliverDuration }} 天 </template>
      <template v-if="column.dataIndex === 'isUse'">
        <span v-if="record.isUse === 1">启用</span>
        <span v-else-if="record.isUse === 0" style="color: #ccc">禁用</span>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button
          v-if="useButton('dataCenter_prescription_supplierConfig_edit')"
          type="link"
          size="small"
          @click="edit(record)"
        >
          编辑
        </a-button>
        <a-button
          v-if="useButton('dataCenter_prescription_supplierConfig_edit')"
          type="link"
          size="small"
          @click="details(record)"
        >
          查看时效
        </a-button>
        <a-button
          v-if="record.isUse === 0 && useButton('dataCenter_prescription_supplierConfig_enable')"
          type="link"
          size="small"
          @click="operIsUse(record)"
        >
          启用
        </a-button>
        <a-button
          v-if="record.isUse === 1 && useButton('dataCenter_prescription_supplierConfig_deactivate')"
          type="link"
          size="small"
          danger
          @click="operIsUse(record)"
        >
          禁用
        </a-button>
      </template>
    </template>
  </DataTable>
  <EditModal ref="editModal" :record="data.record" @submit="getList(false)" />
  <DetailsModal ref="detailsModal" :record="data.record" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns, monitorEnum } from './config';
import { useButton } from '@/utils/utils';
import { getListPage, openOrClose } from '@/api/dataCenter/supplierConfig';
import TitleTips from '@/components/page/TitleTips.vue';
import EditModal from './components/EditModal.vue';
import DetailsModal from './components/DetailsModal.vue';
import { message } from 'ant-design-vue';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.workOrderType) {
    data.params.workOrderType = data.params.workOrderType[1];
  }
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//编辑
const editModal: Ref = ref(null);
const edit = (record: any) => {
  data.record = record;
  editModal.value.showModal = true;
};

//时效明细
const detailsModal: Ref = ref(null);
const details = (record: any) => {
  data.record = record;
  detailsModal.value.showModal = true;
};

// 启用 、 禁用
const operIsUse = (record: any) => {
  openOrClose({
    id: record.id,
  }).then(res => {
    message.success('操作成功');
    getList(false);
  });
};

//监控区间过滤
const workOrderTypeFilter = (key: number) => {
  const record = monitorEnum.find((v: { id: number }) => v.id == key);
  return record ? record.section : '-';
};
</script>

<style scoped lang="less"></style>
