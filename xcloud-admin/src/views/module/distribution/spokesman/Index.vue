<template>
  <div class="spokesman">
    <SearchForm :rule="rule" @submitParams="submitParams" :searchPosition="350">
      <template #topSlot>
        <a-tabs v-model:activeKey="activeKey" @change="changeType">
          <a-tab-pane key="1" tab="代言人管理"></a-tab-pane>
          <a-tab-pane key="2" tab="代理人管理"></a-tab-pane>
        </a-tabs>
      </template>
    </SearchForm>

    <DataTable ref="dataTable" :columns="activeKey === '1' ? columns : columns1" :methodName="drpUserList">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'operation'">
          <template v-if="activeKey === '1'">
            <a-button
              type="link"
              size="small"
              @click="view(record, 'SPOKESMAN')"
              v-if="useButton('xcloudplat_distribution_spokesman_view')"
            >
              查看下级
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="addAgent(record)"
              v-if="useButton('xcloudplat_distribution_spokesman_add')"
            >
              新增代理人
            </a-button>
          </template>
          <template v-else>
            <a-button
              type="link"
              size="small"
              @click="view(record, 'AGENT')"
              v-if="useButton('xcloudplat_distribution_spokesman_view')"
            >
              查看下级
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="replace(record)"
              v-if="useButton('xcloudplat_distribution_spokesman_replace')"
            >
              更换上级代言人
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="remove(record)"
              v-if="useButton('xcloudplat_distribution_spokesman_remove')"
            >
              解除上下级关系
            </a-button>
          </template>
        </template>
      </template>
    </DataTable>
    <AddModal ref="addModal" :record="data.record" @submit="getList(false)" />
    <ReplaceModal ref="replaceModal" :record="data.record" @submit="getList(false)" />
    <RemoveModal ref="removeModal" :record="data.record" @submit="getList(false)" />
    <ViewModal ref="viewModal" :record="data.record" />
  </div>
</template>

<script setup lang="ts">
import { useButton } from '@/utils/utils';
import { ref, reactive, type Ref } from 'vue';
import { rule, columns, columns1 } from './config';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { drpUserList } from '@/api/customerManage/distribution';
import AddModal from './components/AddModal.vue';
import ReplaceModal from './components/ReplaceModal.vue';
import RemoveModal from './components/RemoveModal.vue';
import ViewModal from './components/ViewModal.vue';
import { useStore } from '@/stores/store';
const activeKey = ref('1');
const dataTable: Ref = ref(null);

const data: any = reactive({
  params: {
    custUserType: 'SPOKESMAN',
    enterpriseId: useStore().enterprise.record.id,
  },
  record: {},
});
//点击搜索
const submitParams = (p: object) => {
  data.params = Object.assign({}, data.params, p);
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

// 查看下级
const viewModal: Ref = ref(null);
const view = (record: any, type: any) => {
  record.type = type;
  data.record = record;
  viewModal.value.showModal = true;
};

// 新增代理人
const addModal: Ref = ref(null);
const addAgent = (record: any) => {
  data.record = record;
  addModal.value.showModal = true;
};

// 更换代言人
const replaceModal: Ref = ref(null);
const replace = (record: any) => {
  data.record = record;
  replaceModal.value.showModal = true;
};

// 解除上下级关系
const removeModal: Ref = ref(null);
const remove = (record: any) => {
  data.record = record;
  removeModal.value.showModal = true;
};

// 切换代理人和代言人
const changeType = (type: any) => {
  if (type == 1) {
    data.params.custUserType = 'SPOKESMAN';
  } else {
    data.params.custUserType = 'AGENT';
  }
  getList();
};
</script>
