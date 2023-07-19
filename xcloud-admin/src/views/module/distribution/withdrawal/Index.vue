<template>
  <div>
    <DataTable
      ref="dataTable"
      :columns="columns"
      :methodName="withdrawRecord"
      :initSearch="false"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    >
      <template #topSlot>
        <a-tabs v-model:activeKey="activeKey" @change="changeType">
          <a-tab-pane key="1" tab="申请提现"></a-tab-pane>
          <a-tab-pane key="2" tab="已付款"></a-tab-pane>
          <a-tab-pane key="3" tab="已拒绝"></a-tab-pane>
        </a-tabs>
        <div class="button-box">
          <a-space>
            <a-button
              type="primary"
              @click="downLoadFileDetail()"
              v-if="useButton('xcloudplat_distribution_withdrawal_export')"
            >
              导出
            </a-button>
          </a-space>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { useButton } from '@/utils/utils';
import { downloadFile } from '@/utils/utils';
import { ref, reactive, type Ref, onMounted } from 'vue';
import { columns } from './config';
import DataTable from '@/components/page/DataTable.vue';
import { withdrawRecord, exportWithdraw } from '@/api/customerManage/distribution';
import { useStore } from '@/stores/store';
import { message } from 'ant-design-vue';
const activeKey = ref('1');
const dataTable: Ref = ref(null);
const selectedRowKeys = ref([]);
const data: any = reactive({
  params: {
    withdrawStatus: 'PENDING',
    enterpriseId: useStore().enterprise.record.id,
  },
  record: {},
});

onMounted(() => {
  getList();
});
//获取列表
const getList = (resetCurrent = true) => {
  selectedRowKeys.value = [];
  dataTable.value.getList(data.params, resetCurrent);
};

//导出
const downLoadFileDetail = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择要导出的数据项');
    return false;
  }
  const withdrawIds = selectedRowKeys.value.map((item: any) => item.id);
  exportWithdraw({ withdrawIds }).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};
const typeTabs: any = reactive({
  1: 'PENDING',
  2: 'FINISHED',
  3: 'FAILED',
});
// 切换代理人和代言人
const changeType = (type: any) => {
  data.params.withdrawStatus = typeTabs[type];
  getList();
};
</script>

<style scoped lang="less">
.button-box {
  margin-bottom: 20px;
}
</style>
