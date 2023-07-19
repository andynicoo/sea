<template>
  <div>
    <SearchForm :rule="rule" @submitParams="submitParams" :searchPosition="300"></SearchForm>
    <DataTable ref="dataTable" :columns="columns" :methodName="drpList">
      <template #topSlot>
        <div class="button-box">
          <a-space>
            <a-button type="primary" @click="create" v-if="useButton('xcloudplat_distribution_poster_add')">
              上传海报
            </a-button>
          </a-space>
        </div>
      </template>
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'drpImage'">
          <img :src="record.drpImage" width="80" />
        </template>
        <template v-if="column.dataIndex === 'type'"> {{ typeMap[record.type] }} </template>
        <template v-if="column.dataIndex === 'status'">
          {{ record.status == 'DISABLED' ? '停用' : '启用' }}
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button
            v-if="useButton('xcloudplat_distribution_poster_edit')"
            type="link"
            size="small"
            @click="update(record)"
            >修改</a-button
          >
          <a-button
            v-if="useButton('xcloudplat_distribution_poster_updateStatus')"
            type="link"
            size="small"
            @click="updateStatus(record)"
            >{{ record.status == 'DISABLED' ? '启用' : '停用' }}</a-button
          >
          <a-button
            v-if="useButton('xcloudplat_distribution_poster_delete')"
            type="link"
            size="small"
            @click="deleteData(record)"
            >删除</a-button
          >
        </template>
      </template>
    </DataTable>
    <UpdateModal ref="updateModal" :record="data.record" @submit="getList(false)" />
    <DeleteModal ref="deleteModal" :record="data.record" @submit="getList(false)" />
    <AddEditModal ref="addEditModal" @submit="getList(false)" :id="detailId" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, type Ref, onMounted } from 'vue';
import type { TypesList } from '@/types/distribution';
import { rule, columns } from './config';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { drpList } from '@/api/customerManage/distribution';
import { useStore } from '@/stores/store';
import UpdateModal from './components/UpdateModal.vue';
import DeleteModal from './components/DeleteModal.vue';
import AddEditModal from './components/AddEditModal.vue';
import { useButton } from '@/utils/utils';

const dataTable: Ref = ref(null);
const updateModal: Ref = ref(null);
const deleteModal: Ref = ref(null);
const addEditModal: Ref = ref(null);
const detailId = ref('');
const data: any = reactive({
  params: {
    enterpriseId: useStore().enterprise.record.id,
    type: '',
  },
  record: {},
});

//点击搜索
const submitParams = (p: any) => {
  data.params = Object.assign(data.params, p);
  console.log('p', data.params);
  getList();
};
//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};
const create = () => {
  detailId.value = '';
  addEditModal.value.visible = true;
};
const update = async (record: any) => {
  const { drpId } = record;
  detailId.value = drpId;
  addEditModal.value.visible = true;
};
const updateStatus = (record: any) => {
  data.record = record;
  updateModal.value.showModal = true;
};
const deleteData = (record: any) => {
  data.record = record;
  deleteModal.value.showModal = true;
};
const typeMap = reactive<any>({
  INVITATION_POSTER: '邀请海报',
  PROMOTION_POSTER: '获客海报',
});
</script>
<style scoped lang="less">
.button-box {
  margin-bottom: 20px;
}
</style>
