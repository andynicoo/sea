<template>
  <DataTable
    ref="dataTable"
    :columns="commitColumns"
    :initSearch="false"
    :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    :methodName="getVatCommitPage"
  >
    <template #topSlot>
      <a-button class="export-btn" v-if="useButton('MSL_2')" type="primary" ghost @click="downLoadFile()"
        ><img src="@/assets/img/icon/export.png" /> 导出</a-button
      >
      <a-radio-group class="statusList-group" v-model:value="dayTabActive" @change="getList()">
        <a-radio-button v-for="item of dayList" :key="item.key" :value="item.key"
          >{{ item.title }}（{{ item.value }}）</a-radio-button
        >
      </a-radio-group>
    </template>

    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'handleDay'">
        <div v-if="record.handleDay < 60">{{ record.handleDay === '-1' ? '' : record.handleDay }}</div>
        <span v-else class="currentDeliveryDay currentDeliveryDay30">{{ record.handleDay }}</span>
      </template>

      <template v-if="column.dataIndex === 'planServiceTime'">
        <a-date-picker
          v-model:value="record.planServiceTime"
          :bordered="false"
          :disabledDate="(c: any) => c <= dayjs()"
          placeholder="设置"
          valueFormat="YYYY-MM-DD"
          allowClear
          :disabled="!useButton('MSL_3')"
          @change="e => onServiceTimeChange(e, record.id)"
        >
          <span>设置</span>
        </a-date-picker>
      </template>

      <template v-if="column.dataIndex === 'serviceName'">
        <a-tooltip>
          <template #title>{{ record.serviceName }}</template>
          {{ record.serviceName }}
        </a-tooltip>
      </template>

      <template v-if="column.dataIndex === 'situationContent'">
        <a-tooltip v-if="record.situationContent" :title="record.situationContent" placement="topLeft">
          <span @click="followUpShow(record)" style="color: rgb(24, 144, 255)">{{
            record.situationContent?.slice?.(0, 10)
          }}</span>
          <!-- <a-button type="link" ></a-button> -->
        </a-tooltip>
        <a-button v-else shape="circle" @click="followUpShow(record)">
          <template #icon><FormOutlined /></template>
        </a-button>
      </template>

      <template v-if="column.dataIndex === 'operation'">
        <a-space align="center" :direction="'vertical'" style="width: 100%">
          <a-tooltip title="工单详情" v-if="useButton('MSL_1')">
            <FileSearchOutlined style="color: #1890ff" @click="goDetailsPage(record)" />
          </a-tooltip>
        </a-space>
      </template>
    </template>
  </DataTable>

  <FollowUpRecords ref="followUp" :dataRecord="followRecord" @getList="getList" />
</template>

<script setup lang="ts" generic="T extends any">
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { message } from 'ant-design-vue';
import { useStore } from '@/stores/store';
import { FileSearchOutlined, FormOutlined } from '@ant-design/icons-vue';
import { useButton, downloadFile } from '@/utils/utils';
import type { VatCommitListRes } from '@/api/management/type';
import DataTable from '@/components/page/DataTable.vue';
import FollowUpRecords from './FollowUpRecords.vue';
import { commitColumns } from './../config';
import { getVatCommitCountCount, getVatCommitPage, setVatServiceTime, vatCommitExport } from '@/api/management/vat';

//传入参数
interface Props {
  searchParams: object;
}
const props = defineProps<Props>();

const { setPageCache, cacheData } = useSearchFormCache();
const userStore = useStore();

// 获取时间分组数量
type DayKeys = 'daySum' | 'dayTo' | 'day1T7' | 'day8T15' | 'day16T30' | 'day31T60' | 'day61T';
const dayTabActive = ref<DayKeys>(cacheData.value.dayTabActive || 'daySum');
const dayformat = 'YYYY-MM-DD HH:mm:ss';
const dayList = ref<{ title: string; value: number; key: DayKeys; dayRange: (string | undefined)[] }[]>([
  { title: '全部', value: 0, key: 'daySum', dayRange: [undefined, undefined] },
  {
    title: '今天',
    value: 0,
    key: 'dayTo',
    dayRange: [dayjs().startOf('days').format(dayformat), dayjs().endOf('days').format(dayformat)],
  },
  {
    title: '1-7天内',
    value: 0,
    key: 'day1T7',
    dayRange: [
      dayjs().subtract(7, 'days').startOf('days').format(dayformat),
      dayjs().subtract(1, 'days').endOf('days').format(dayformat),
    ],
  },
  {
    title: '8-15天',
    value: 0,
    key: 'day8T15',
    dayRange: [
      dayjs().subtract(15, 'days').startOf('days').format(dayformat),
      dayjs().subtract(8, 'days').endOf('days').format(dayformat),
    ],
  },
  {
    title: '16-30天',
    value: 0,
    key: 'day16T30',
    dayRange: [
      dayjs().subtract(30, 'days').startOf('days').format(dayformat),
      dayjs().subtract(16, 'days').endOf('days').format(dayformat),
    ],
  },
  {
    title: '31-60天',
    value: 0,
    key: 'day31T60',
    dayRange: [
      dayjs().subtract(60, 'days').startOf('days').format(dayformat),
      dayjs().subtract(31, 'days').endOf('days').format(dayformat),
    ],
  },
  {
    title: '超过60天',
    value: 0,
    key: 'day61T',
    dayRange: [undefined, dayjs().subtract(61, 'days').endOf('days').format(dayformat)],
  },
]);
const getDayList = async () => {
  const res = await getVatCommitCountCount(props.searchParams);
  dayList.value.forEach(item => {
    item.value = res[item.key];
  });
};
watch(
  () => props.searchParams,
  () => getDayList(),
  { deep: true }
);

// 获取列表
const dataTable = ref<any | null>(null);
const getList = (resetCurrent = true) => {
  const currDayRange = dayList.value.find(item => item.key === dayTabActive.value)?.dayRange || [undefined, undefined];
  const params = {
    ...props.searchParams,
    handerTimeStart: currDayRange[0],
    handerTimeEnd: currDayRange[1],
  };
  setPageCache({ ...params, dayTabActive: dayTabActive.value });
  dataTable.value?.getList(params, resetCurrent);
  selectedRowKeys.value = [];
};
watch(
  () => props.searchParams,
  () => getList(),
  { deep: true }
);

// 跳转详情
const goDetailsPage = (row: VatCommitListRes) => {
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

// 计划时间
const onServiceTimeChange = async (dataValue: string | Dayjs, id: string) => {
  if (!dataTable.value) return;
  dataTable.value.setLoading(true);
  const serviceTime = dataValue ? dataValue + ' 00:00:00' : null;
  await setVatServiceTime(serviceTime, id).finally(() => {
    if (!dataTable.value) return;
    dataTable.value.setLoading(false);
  });
  message.success('设置成功');
};

// 跟进
const followUp: Ref = ref(null);
const followRecord = ref<VatCommitListRes>();
const followUpShow = (record: VatCommitListRes) => {
  followRecord.value = record;
  setTimeout(() => {
    followUp.value.visible = true;
  });
};

// 导出
const selectedRowKeys = ref<any[]>([]);
const downLoadFile = () => {
  console.log(selectedRowKeys.value.length);
  if (!selectedRowKeys.value.length) return message.warning('请勾选需要导出的数据！');
  const serviceIds = selectedRowKeys.value.map(item => item.id);
  vatCommitExport({ serviceIds }).then(res => {
    downloadFile(res, 'VAT服务-待客户提交.xlsx');
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

.currentDeliveryDay {
  background: #e72014;
  border-radius: 4px 4px 4px 4px;
  font-size: 12px;
  padding: 2px 6px;
  color: #fff;
}

.currentDeliveryDay30 {
  background: #f0b955;
}
</style>
