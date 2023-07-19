<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-upload
          name="file"
          :action="uploadUrl"
          @change="handleImportChange"
          :showUploadList="false"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          v-if="useButton('xcloudplat_workOrder_offlineData_batchImport')"
        >
          <a-button type="primary">批量导入Excel</a-button>
        </a-upload>
        <a-button
          type="primary"
          danger
          @click="batchDeletion()"
          v-if="useButton('xcloudplat_workOrder_offlineData_batchDelete')"
          >批量删除</a-button
        >
      </a-space>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    :methodName="getListPage"
    :pageKeyStr="{ currentKey: 'current', pageSizeKey: 'size' }"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operation'">
        <a-button
          v-if="useButton('xcloudplat_workOrder_offlineData_edit')"
          type="link"
          size="small"
          @click="edit(record)"
          title="编辑"
        >
          <EditOutlined />
        </a-button>
      </template>
    </template>
  </DataTable>

  <EditModal ref="editModal" :record="data.record" @submit="getList(false)" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { useButton } from '@/utils/utils';
import { getListPage, batchDel } from '@/api/workOrder/offlineData';
import { message, Modal } from 'ant-design-vue';
import EditModal from './components/EditModal.vue';
import { EditOutlined } from '@ant-design/icons-vue';

const selectedRowKeys = ref([]);

const uploadUrl = ref(import.meta.env.VITE_APP_API + '/xxjob/management/trademarkTransfer/trademarkDataImport');
const loading = ref<boolean>(false);

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: any) => {
  data.params = {
    dataTrademarkTransfer: {
      acceptanceNo: p.acceptanceNo || null,
      tradeName: p.tradeName || null,
    },
    countryCns: p.countryCodes?.length ? p.countryCodes : null,
  };

  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  selectedRowKeys.value = [];
  dataTable.value.getList(data.params, resetCurrent);
};

// 批量删除
const batchDeletion = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择要删除的数据项');
    return false;
  }
  const transferIds = selectedRowKeys.value.map((o: any) => o.transferId);
  Modal.confirm({
    title: '提示',
    width: 400,
    content: '确认要删除吗？',
    onOk() {
      return new Promise((resolve, reject) => {
        batchDel({
          transferIds,
        }).then((res: any) => {
          resolve(true);
          message.success('操作成功');
          getList(false);
        });
      });
    },
  });
};

//编辑
const editModal: Ref = ref(null);
const edit = (record: any) => {
  data.record = record;
  editModal.value.showModal = true;
};

//批量导入
const handleImportChange = (info: any) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    const { response } = info.file;
    loading.value = false;
    if (response.code === 0) {
      const { totalNum, successNum } = response.data;
      message.success(`本次共导入${totalNum}条数据，导入成功${successNum}条，导入失败${totalNum - successNum}条`);
      getList(false);
    } else {
      message.warning(response.message);
    }
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('上传失败请稍后重试！');
    return;
  }
};
</script>

<style scoped lang="less"></style>
