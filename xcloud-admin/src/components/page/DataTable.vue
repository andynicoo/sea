<!-- 数据表格组件，适用于后端返回分页格式接口数据渲染的表格 -->
<template>
  <div class="table-wrap" :class="{ 'min-width': mainTable }">
    <div class="top-slot-wrap">
      <slot name="topSlot" />
    </div>
    <a-table
      size="small"
      :columns="columns"
      :data-source="dataSource"
      :loading="tableIndicator"
      :pagination="{
        position: ['bottomRight'],
        current: page.current,
        pageSize: page.pageSize,
        showQuickJumper: true,
        showSizeChanger: true,
        total: total,
        showTotal: (total: number) => `共 ${total} 条`,
      }"
      :rowKey="rowKey ? rowKey : (record: any) => record"
      :row-selection="rowSelection"
      :scroll="{ scrollToFirstRowOnChange: true, x: '100%', y: tableHeight || scrollY }"
      @change="change"
      @resizeColumn="handleResizeColumn"
      bordered
    >
      <template #headerCell="{ title, column }">
        <slot name="headerCell" :title="title" :column="column" />
      </template>
      <template #bodyCell="{ text, record, index, column }">
        <slot name="bodyCell" :text="text" :record="record" :index="index" :column="column">
          <template v-if="column.dataIndex === 'index'">
            <span>{{ index + 1 }}</span>
          </template>
        </slot>
      </template>
      <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row>
            <slot name="summary" />
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts" generic="T extends any">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import type {
  SorterResult,
  ColumnsType,
  TableRowSelection,
  TablePaginationConfig,
} from 'ant-design-vue/lib/table/interface.d.ts';
import type { IPageSize } from '@/types/index.js';

//传入参数
interface Props {
  columns: ColumnsType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methodName?: (params: any) => Promise<any>;
  //有些接口查询总数量很慢，后端要求总数量单独请求，非必传，传了单独请求
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalMethodName?: (params: any) => Promise<any>;
  rowKey?: string;
  initSearch?: boolean;
  rowSelection?: TableRowSelection;
  pageKeyStr?: {
    currentKey: string;
    pageSizeKey: string;
  };
  otherHeight?: number;
  mainTable?: boolean;
  pageSize?: number;
  scrollY?: number;
  layerKey?: string;
  customKey?: string;
}
const props = withDefaults(defineProps<Props>(), {
  initSearch: false,
  pageKeyStr: () => ({
    currentKey: 'page',
    pageSizeKey: 'limit',
  }),
  otherHeight: 0,
  mainTable: true,
  pageSize: 20,
  scrollY: 400,
});

//emit 方法
const emit = defineEmits(['resData']);

const tableIndicator = ref<boolean>(false);
let formModalTemp: object = reactive({});
const total = ref(0);
const dataSource = ref<Array<object>>([]);
const page = reactive<IPageSize>({
  current: 1,
  pageSize: 20,
});

// 排序 ASC:升序 DESC:降序
const tableSort = reactive<{ sort: 'ASC' | 'DESC' | undefined; sortField: string }>({
  sort: 'DESC',
  sortField: '',
});

const tableHeight = ref(0);

onMounted(() => {
  page.pageSize = props.pageSize;
  //初始化搜索
  if (props.initSearch) {
    getList();
  }
  setTableHeight();
  window.onresize = () => {
    setTableHeight();
  };
  //监听搜索高度变化
  if (document.querySelector('.content-main-wrap .search-wrap')) {
    const theResizeObserver: ResizeObserver = new ResizeObserver(() => {
      setTableHeight();
    });
    theResizeObserver.observe(document.querySelector('.content-main-wrap .search-wrap') as Element);
  }
});
onUnmounted(() => {
  window.onresize = null;
});

const setLoading = (v: boolean) => {
  tableIndicator.value = v;
};

//获取表格数据
const getList = (formModal: object = {}, resetCurrent = true) => {
  if (!props.methodName) {
    message.error('列表接口地址有误');
    return false;
  }
  formModalTemp = formModal;
  page.current = resetCurrent ? 1 : page.current;
  tableIndicator.value = true;
  const params = Object.assign(
    {},
    {
      [props.pageKeyStr.pageSizeKey]: page.pageSize,
      [props.pageKeyStr.currentKey]: page.current,
    },
    tableSort.sortField
      ? {
          sort: tableSort.sort,
          sortField: tableSort.sortField,
        }
      : {},
    formModal
  );

  //单独请求总数量
  if (props.totalMethodName) {
    getListTotal(params);
  }

  props
    .methodName(params)
    .then((res: any) => {
      tableIndicator.value = false;
      if (res instanceof Array) {
        dataSource.value = res || [];
      } else {
        dataSource.value =
          res.records ||
          (props.layerKey && res[props.layerKey].records) ||
          (props.customKey && res[props.customKey]) ||
          [];
      }
      if (!props.totalMethodName) {
        total.value =
          res instanceof Array
            ? res.length || 0
            : Number(res.total || (props.layerKey && res[props.layerKey].total)) || 0;
      }
      emit('resData', res);
    })
    .catch(() => {
      total.value = 0;
      tableIndicator.value = false;
    });
};

//获取表格总数量
const getListTotal = (params: unknown) => {
  props.totalMethodName?.(params).then((res: unknown) => {
    total.value = Number(res) || 0;
  });
};

//分页、排序、筛选变化时触发 pagination, filters, sorter, { currentDataSource }
const change = (
  pagination: TablePaginationConfig,
  filters = {},
  sorter: SorterResult | SorterResult[],
  extra: { action: string }
) => {
  if (extra.action === 'paginate') {
    page.current = pagination.current || 1;
    page.pageSize = pagination.pageSize || props.pageSize;
    getList(formModalTemp, false);
  }

  if (extra.action === 'sort') {
    if (!Array.isArray(sorter) && sorter?.order) {
      tableSort.sort = sorter.order === 'ascend' ? 'ASC' : 'DESC';
      tableSort.sortField = sorter.field as string;
    } else {
      tableSort.sort = undefined;
      tableSort.sortField = '';
    }
    getList(formModalTemp, false);
  }
};

//设置表格高度
const setTableHeight = () => {
  if (!props.mainTable) {
    return false;
  }
  const contentHeight = document.querySelector('.content-main-wrap')?.clientHeight || 700;
  const searchHeight = (document.querySelector('.content-main-wrap .search-wrap')?.clientHeight || 0) + 10;
  const tableTopSlotHeight = document.querySelector('.content-main-wrap .top-slot-wrap')?.clientHeight || 0;
  const tableHeadHeight = (document.querySelector('.content-main-wrap .ant-table-thead')?.clientHeight || 0) + 34;
  const tableSummaryHeight = document.querySelector('.content-main-wrap .ant-table-summary')?.clientHeight || 0;
  const pageSizeHeight = 42;
  tableHeight.value =
    contentHeight -
    searchHeight -
    tableTopSlotHeight -
    tableHeadHeight -
    tableSummaryHeight -
    pageSizeHeight -
    props.otherHeight;

  const tableBody = document.querySelector<HTMLElement>('.content-main-wrap .table-wrap .ant-table-body');
  if (tableBody) {
    tableBody.style.height = tableHeight.value + 'px';
  }
};

//设置拖动列宽
const handleResizeColumn = (w: number, col: any) => {
  col.width = w;
};

//暴露方法
defineExpose({ getList, setLoading });
</script>

<style scoped lang="less">
.table-wrap.min-width {
  // min-width: 1240px;
}
.table-wrap {
  position: relative;
  padding: 10px;
  background-color: #fff;
  .top-slot-wrap {
    height: auto;
  }
  &:deep(.ant-table-wrapper) {
    .ant-table-thead > tr > th {
      padding: 12px 10px;
      background-color: #ebf5ff;
    }
    .ant-table-tbody > tr > td {
      color: #666;
      padding: 10px;
      word-break: break-all;
    }
    .ant-table-summary {
      background-color: #f6f8fa;
      .ant-table-cell-fix-left,
      .ant-table-cell-fix-right {
        background-color: #f6f8fa;
      }
    }
    .ant-table-container .ant-table-body .ant-table-tbody > tr.ant-table-placeholder > td.ant-table-cell {
      border-bottom: 0;
    }
    .ant-pagination.ant-table-pagination {
      margin: 0;
      padding: 10px 10px 0;
      border-top: 1px solid #f0f0f0;
    }
    .ant-table-thead > tr > th {
      border-bottom: 1px solid #e5dbdb;
    }
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > thead > tr > th {
      border-right: 1px solid #e5dbdb;
      border-bottom: 1px solid #e5dbdb;
    }
  }
}
</style>
