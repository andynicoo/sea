<template>
  <a-drawer
    v-model:visible="visible"
    class="custom-class"
    :width="682"
    title="申报详情"
    placement="right"
    destroyOnClose
  >
    <div style="padding: 0 16px">
      <a-space direction="vertical" size="middle" style="width: 100%">
        <h2 class="title">服务信息</h2>
        <div class="item">服务公司: {{ detailInfo?.companyNameZh }}</div>
        <div class="" style="display: flex; justify-content: space-between">
          <div class="item">
            <span>税号: {{ detailInfo?.vatTaxNumber }}</span>
            <a-divider type="vertical" />
            <span>{{ detailInfo?.countryNameZh }}</span>
            <a-divider type="vertical" />
            <span> {{ declarePeriod }}</span>
          </div>
          <div>
            <a-tag color="#87d068" v-if="serviceStatus === '服务中'">{{ serviceStatus }}</a-tag>
            <a-tag color="#2db7f5" v-else>{{ serviceStatus }}</a-tag>
          </div>
        </div>
        <div class="dataRecord-info">
          <a-row :gutter="10">
            <a-col :span="8">订单号：{{ detailInfo?.orderNo }}</a-col>
            <a-col :span="8" push="4">工单号：{{ detailInfo?.serviceNo }}</a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :span="12">税号下发日期：{{ detailInfo?.taxIssueDate }}</a-col>
            <a-col :span="12">税号生效日期：{{ detailInfo?.taxEffectiveDate }}</a-col>
          </a-row>
          <a-row :gutter="10"> </a-row>
        </div>
      </a-space>

      <h3 class="title" style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 0">
        <span>申报记录</span>
        <span>
          <a-button type="link" @click="downLoadFileFn2" :disabled="!detailInfo?.vatTaxNumberFile">
            <DownloadOutlined />下载税号证书
          </a-button>
        </span>
      </h3>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.title + `(${item.value.length})`"></a-tab-pane>
      </a-tabs>
      <a-table :columns="declareRecordColumns" :dataSource="dataSource" size="small" bordered class="small-table">
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'operation'">
            <a-tooltip v-if="record.declareReceipt">
              <template #title>下载回执</template>
              <div class="link-text" @click="downLoadFileFn(record)">
                <DownloadOutlined />
              </div>
            </a-tooltip> </template
        ></template>
      </a-table>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { getdeclareDetail } from '@/api/management/vat';
import type { DeclareDetailRes, VatDeclareDetailVO } from '@/api/management/vat';
import { message } from 'ant-design-vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { jumpPage, useButton, downloadFile } from '@/utils/utils';
import { declarePeriodMap, serviceStatusMap, declareRecordColumns } from '../config';

//传入参数
interface Props {
  id: string;
  visible: boolean;
}
interface Emits {
  (onchange: 'update:visible', v: boolean): void;
}
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const visible = computed({
  get: () => props.visible,
  set: v => emits('update:visible', v),
});

// tabs
type TabKey = 'ALL' | 'WAIT_DECLARE' | 'WAIT_CONTRIBUTE' | 'REJECT' | 'COMPLETE';
const activeKey = ref<TabKey>('ALL');
const tabList = ref([
  { title: '全部', key: 'ALL', value: [] as DeclareDetailRes['declareDetailVOList'] },
  { title: '待申报', key: 'WAIT_DECLARE', value: [] as DeclareDetailRes['declareDetailVOList'] },
  { title: '待缴税', key: 'WAIT_CONTRIBUTE', value: [] as DeclareDetailRes['declareDetailVOList'] },
  { title: '被驳回', key: 'REJECT', value: [] as DeclareDetailRes['declareDetailVOList'] },
  { title: '完成申报', key: 'COMPLETE', value: [] as DeclareDetailRes['declareDetailVOList'] },
]);
const dataSource = computed(() => tabList.value.find(item => item.key === activeKey.value)?.value || []);

// 获取详情
const detailInfo = ref<DeclareDetailRes | null>();
const declarePeriod = computed(() =>
  detailInfo.value?.declarePeriod ? declarePeriodMap[detailInfo.value.declarePeriod] : '--'
);
const serviceStatus = computed(() => (detailInfo.value?.status ? serviceStatusMap[detailInfo.value.status] : '--'));
const getDetial = async () => {
  const res = await getdeclareDetail(props.id);
  detailInfo.value = res;
  tabList.value[0].value = res.declareDetailVOList;
  tabList.value[1].value = res.declareDetailVOList.filter(item => item.status === 10);
  tabList.value[2].value = res.declareDetailVOList.filter(item => item.status === 13);
  tabList.value[3].value = res.declareDetailVOList.filter(item => [18, 19].includes(item.status));
  tabList.value[4].value = res.declareDetailVOList.filter(item => item.status === 16);
};
watchEffect(() => visible.value && getDetial());

const downLoadFileFn = (record: VatDeclareDetailVO) => {
  window.open(record.declareReceipt, '_blank');
};
const downLoadFileFn2 = () => {
  if (detailInfo.value?.vatTaxNumberFile) {
    window.open(detailInfo.value?.vatTaxNumberFile, '_blank');
  }
};
</script>

<style scoped lang="less">
.dataRecord-info {
  color: #999999;
  background: #f5f8fb;
  padding: 12px 12px 2px;
  font-size: 12px;
  :deep(.ant-row) {
    margin-bottom: 10px;
  }
}
.track-step {
  :deep(.ant-steps-item-title) {
    width: 100%;
    font-size: 14px;
  }
  :deep(.ant-steps-item-description) {
    background: #f5f8fb;
    padding: 20px;
  }
}
.trackType {
  float: right;
}
.formState-content {
  margin-top: 20px;
}
.origFileName {
  color: #666;
  &:hover {
    background-color: #f6f8fa;
  }
  .anticon {
    position: relative;
    top: 2px;
    left: 5px;
  }
}

.title {
  font-size: 16px;
  font-weight: 700;
}
// .item {
//   padding: 10px 0;
// }
:deep(.ant-divider-vertical) {
  border-color: #ccc;
  margin: 0 12px;
}
:deep(.ant-table-tbody) {
  font-size: 12px;
}

.link-text {
  color: #1890ff;
  cursor: pointer;
  text-align: center;
}
</style>
