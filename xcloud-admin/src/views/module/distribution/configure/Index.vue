<template>
  <div>
    <DataTable ref="dataTable" :columns="columns" :methodName="commissionList">
      <template #topSlot>
        <div class="button-box">
          <a-space>
            <a-button type="primary" @click="create()" v-if="useButton('xcloudplat_distribution_configure_create')">
              创建佣金比列
            </a-button>
          </a-space>
        </div>
      </template>
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'spokesmanPercentage'">
          {{ record.spokesmanPercentage + '%' }}
        </template>
        <template v-if="column.dataIndex === 'agentPercentage'">
          {{ record.agentPercentage + '%' }}
        </template>
        <template v-if="column.dataIndex === 'status'">
          {{ record.status == 'DISABLED' ? '停用' : '启用' }}
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button
            type="link"
            size="small"
            @click="update(record)"
            v-if="useButton('xcloudplat_distribution_configure_edit')"
          >
            修改
          </a-button>
          <a-button
            type="link"
            size="small"
            @click="updateStatus(record)"
            v-if="useButton('xcloudplat_distribution_configure_update')"
          >
            {{ record.status == 'DISABLED' ? '启用' : '停用' }}</a-button
          >
          <a-button
            type="link"
            size="small"
            @click="deleteConfig(record)"
            v-if="useButton('xcloudplat_distribution_configure_delete')"
          >
            删除配置
          </a-button>
        </template>
      </template>
    </DataTable>
    <AddModal ref="addModal" :record="data.record" @submit="getList(false)" />
    <UpdateModal ref="updateModal" :record="data.record" @submit="getList(false)" />
    <DeleteModal ref="deleteModal" :record="data.record" @submit="getList(false)" />
  </div>
</template>

<script setup lang="ts">
import { useButton } from '@/utils/utils';
import { ref, reactive, type Ref, onMounted } from 'vue';
import { columns } from './config';
import DataTable from '@/components/page/DataTable.vue';
import { commissionList } from '@/api/customerManage/distribution';
import { useStore } from '@/stores/store';
import AddModal from './components/AddModal.vue';
import UpdateModal from './components/UpdateModal.vue';
import DeleteModal from './components/DeleteModal.vue';
const dataTable: Ref = ref(null);

const data: any = reactive({
  params: {
    enterpriseId: useStore().enterprise.record.id,
  },
  record: {},
});

onMounted(() => {
  getList();
});
//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

// 创建佣金比列

//修改
const addModal: Ref = ref(null);
const update = (record: any) => {
  data.record = record;
  addModal.value.showModal = true;
};
const create = () => {
  addModal.value.showModal = true;
  data.record = {};
};

//修改状态
const updateModal: Ref = ref(null);
const updateStatus = (record: any) => {
  data.record = record;
  updateModal.value.showModal = true;
};

//删除配置
const deleteModal: Ref = ref(null);
const deleteConfig = (record: any) => {
  data.record = record;
  deleteModal.value.showModal = true;
};
</script>

<style scoped lang="less">
.button-box {
  margin-bottom: 20px;
}
</style>
