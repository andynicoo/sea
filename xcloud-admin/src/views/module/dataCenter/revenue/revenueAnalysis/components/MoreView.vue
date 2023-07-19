<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">{{ title || '-' }}</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <DataTable ref="dataTable" :columns="columnsList" :methodName="methodName" :mainTable="false" :pageSize="10">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'xxx'">
          <span v-if="record.businessType === 1"> 线索 </span>
          <span v-else-if="record.businessType === 2"> 客户 </span>
        </template>
      </template>
    </DataTable>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, type Ref } from 'vue';
import DataTable from '@/components/page/DataTable.vue';
import { CloseOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  title: {
    default: '',
  },
  columns: {
    default: [],
  },
  columnTitle: {
    default: '-',
  },
  params: {
    default: {},
  },
  otherParams: {
    default: {},
  },
  methodName: {
    default: null,
    type: Function,
  },
  aggregationRankField: {
    default: '',
    type: String,
  },
  //退款原因分析使用
  refundApplyType: {
    default: undefined,
    type: String,
  },
});

const columnsList = computed(() => {
  return props.columns.length > 0
    ? props.columns
    : [
        {
          title: props.columnTitle,
          dataIndex: props.title === '服务商销售排行' ? 'supplierName' : 'groupByTypeName',
          width: 180,
        },
        {
          title: '销售额(已到账 ¥)',
          dataIndex: 'amount',
          width: 140,
        },
        {
          title: '商品销量',
          dataIndex: 'sales',
          width: 120,
        },
        {
          title: '退款额（¥）',
          dataIndex: 'refundMoney',
          width: 120,
        },
        {
          title: '商品退款量',
          dataIndex: 'refundSales',
          width: 120,
        },
      ];
});

const showDrawer = ref(false);

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      getList();
    });
  }
});

//获取列表
const dataTable: Ref = ref(null);
const getList = () => {
  dataTable.value.getList(Object.assign({}, props.params, props.otherParams));
};

defineExpose({ showDrawer });
</script>

<style scoped lang="less">
.title-head {
  .text {
    font-size: 14px;
    color: #333;
  }
  .close-icon {
    float: right;
    cursor: pointer;
  }
}
</style>
