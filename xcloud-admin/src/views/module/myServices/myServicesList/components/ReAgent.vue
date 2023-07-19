<template>
  <div>
    <DataTable
      ref="dataTable"
      :columns="reAgentColumns"
      :initSearch="false"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
      :methodName="getvatTaxNumberPage"
    >
      <template #topSlot>
        <a-button class="export-btn" type="primary" ghost v-if="useButton('MSL_9')" @click="downLoadFile()"
          ><img src="@/assets/img/icon/export.png" /> 导出</a-button
        >
        <a-radio-group class="statusList-group" v-model:value="dayTabActive" @change="getList()">
          <a-radio-button v-for="item of dayList" :key="item.key" :value="item.key"
            >{{ item.title }}（{{ item.value }}）</a-radio-button
          >
        </a-radio-group>
        <!-- <a-space>
        <a-tabs v-model:activeKey="dayTabActive" @change="getList()">
          <a-tab-pane v-for="item of dayList" :key="item.key" :tab="item.title + `(${item.value})`" />
        </a-tabs>
        <a-button type="danger" @click="downLoadFile()"> 导出 </a-button>
      </a-space> -->
      </template>

      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'serviceName'">
          <a-tooltip>
            <template #title>{{ record.serviceName }}</template>
            {{ record.serviceName }}
          </a-tooltip>
        </template>

        <template v-if="column.dataIndex === 'operation'">
          <a-space align="center">
            <a-tooltip title="工单详情" v-if="useButton('MSL_8')">
              <FileSearchOutlined style="color: #1890ff" @click="goDetailsPage(record)" />
            </a-tooltip>
            <a-tooltip title="申报记录" v-if="useButton('MSL_10')">
              <AuditOutlined style="color: #1890ff; margin-left: 10px" @click="onOpen(record)" />
            </a-tooltip>
          </a-space>
        </template>
      </template>
    </DataTable>
    <Record v-model:visible="declareModal" :id="declareId" />
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import DataTable from '@/components/page/DataTable.vue';
import { reAgentColumns } from './../config';
import { useButton, downloadFile } from '@/utils/utils';
import { FileSearchOutlined, AuditOutlined } from '@ant-design/icons-vue';
import { getvatTaxNumber, getvatTaxNumberPage, vatTaxNumberExport } from '@/api/management/vat';
import type { VatTaxNumberPage } from '@/api/management/vat';
import { useStore } from '@/stores/store';
import Record from './DeclareRecord.vue';

//传入参数
interface Props {
  searchParams: object;
}
const props = defineProps<Props>();

const { setPageCache, cacheData } = useSearchFormCache();

// 获取时间分组数量
type DayKeys = 'TOTAL' | 'CURRENTDAY' | 'CURRENTWEEK' | 'CURRENTMONTH';
const dayTabActive = ref<DayKeys>(cacheData.value.dateGroupStr || 'TOTAL');
const dayList = ref<{ title: string; value: number; key: DayKeys }[]>([
  { title: '全部', value: 0, key: 'TOTAL' },
  { title: '今天', value: 0, key: 'CURRENTDAY' },
  { title: '本周', value: 0, key: 'CURRENTWEEK' },
  { title: '本月', value: 0, key: 'CURRENTMONTH' },
]);
const getDayList = async () => {
  const res = await getvatTaxNumber(props.searchParams);
  dayList.value.forEach(dayItem => {
    dayItem.value = res.find(item => item.name === dayItem.key)?.value ?? 0;
  });
};
watch(
  () => props.searchParams,
  () => getDayList(),
  { deep: true }
);

//获取列表
const dataTable = ref<any | null>(null);
const getList = (resetCurrent = true) => {
  const params = {
    ...props.searchParams,
    dateGroupStr: dayTabActive.value,
  };
  setPageCache(params);
  dataTable.value?.getList(params, resetCurrent);
  selectedRowKeys.value = [];
};
watch(
  () => props.searchParams,
  () => getList(),
  { deep: true }
);

// 跳转详情
const userStore = useStore();
const goDetailsPage = (row: VatTaxNumberPage) => {
  if (row.functionCode === 5 || row.functionCode === 23) {
    userStore.$router().push({
      path: '/serviceManage/taxRegisterInfo',
      query: { workOrderId: row.id, serviceNo: row.serviceNo, isBack: 1 },
    });
  } else if (row.functionCode === 2) {
    userStore.$router().push({
      path: '/serviceManage/taxInfo',
      query: { workOrderId: row.id, serviceNo: row.serviceNo, isBack: 1 },
    });
  } else {
    message.error('未定义 row.functionCode ');
  }
};

/** 申报详情 */
const declareModal = ref(false);
const declareId = ref('');
const onOpen = (item: VatTaxNumberPage) => {
  declareModal.value = true;
  declareId.value = item?.serviceId;
};

/** 导出 VatTaxNumberPage */
const selectedRowKeys = ref<any[]>([]);
const downLoadFile = () => {
  console.log(selectedRowKeys.value);
  if (!selectedRowKeys.value.length) return message.warning('请勾选需要导出的数据！');
  const serviceIds = selectedRowKeys.value.map(item => item.id);
  vatTaxNumberExport({ serviceIds }).then(res => {
    downloadFile(res, '已下号转代理.xlsx');
  });
};
</script>

<style scoped lang="less">
.export-btn {
  float: right;
  margin-top: 10px;
  padding: 0 16px;
  img {
    width: 14px;
    height: 14px;
    float: left;
    margin: 4px 4px 0 0;
  }
}
.statusList-group {
  margin: 10px 0 20px;
  :deep(.ant-radio-button-wrapper) {
    padding: 2px 24px;
    height: auto;
  }
}
</style>
