<template>
  <div>
    <SearchForm :rule="rule" @submitParams="submitParams">
      <template #topSlot>
        <a-tabs v-model:activeKey="activeKey" @change="changeType">
          <a-tab-pane key="1" tab="待结算"></a-tab-pane>
          <a-tab-pane key="2" tab="已结算"></a-tab-pane>
        </a-tabs>
      </template>
      <template #operationSlot>
        <div class="button-box">
          <a-space>
            <!-- <a-button type="primary" @click="confing()" v-if="useButton('xcloudplat_distribution_commission_config')">
              分佣比列配置
            </a-button> -->
            <a-button
              type="primary"
              @click="downLoadFileDetail()"
              v-if="useButton('xcloudplat_distribution_commission_export')"
            >
              导出
            </a-button>
          </a-space>
        </div>
      </template>
    </SearchForm>
    <DataTable
      ref="dataTable"
      :columns="columns"
      :methodName="productList"
      :initSearch="false"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'settlementStatus'">
          {{ record.settlementStatus == 'PENDING' ? '待结算' : '已结算' }}
        </template>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { useButton, jumpPage } from '@/utils/utils';
import SearchForm from '@/components/page/SearchForm.vue';
import { ref, reactive, type Ref } from 'vue';
import { columns, rule } from './config';
import DataTable from '@/components/page/DataTable.vue';
import { productList, exportProduct } from '@/api/customerManage/distribution';
import { useStore } from '@/stores/store';
import { downloadFile } from '@/utils/utils';
import { message } from 'ant-design-vue';
const activeKey = ref('1');
const dataTable: Ref = ref(null);
const selectedRowKeys = ref([]);
const data: any = reactive({
  params: {
    settlementStatus: 'PENDING',
    enterpriseId: useStore().enterprise.record.id,
  },
  record: {},
});

//获取列表
const getList = (resetCurrent = true) => {
  selectedRowKeys.value = [];
  dataTable.value.getList(data.params, resetCurrent);
};
//点击搜索
const submitParams = (p: object) => {
  data.params = Object.assign({}, data.params, p);
  getList();
};

//分佣比列配置
const confing = () => {
  jumpPage('/distribution/configure');
};

//导出
const downLoadFileDetail = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择要导出的数据项');
    return false;
  }
  const commissionIds = selectedRowKeys.value.map((item: any) => item.id);
  exportProduct({ commissionIds }).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};

// 切换
const changeType = (type: any) => {
  if (type == 1) {
    data.params.settlementStatus = 'PENDING ';
  } else {
    data.params.settlementStatus = 'FINISHED';
  }
  getList();
};
</script>

<style scoped lang="less">
.spokesman {
  .search-wrap {
    color: red;
  }
}
</style>
