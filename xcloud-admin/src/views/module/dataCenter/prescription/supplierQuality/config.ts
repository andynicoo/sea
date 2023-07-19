import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getCountrySelectList, getEnterpriseSelect, getSupplierList } from '@/api/base/basicsData';
import GoodsTypeCascader from '@/components/form/GoodsTypeCascader.vue';
import WorkOrderType from '@/components/form/WorkOrderType.vue';

export const rule: any = ref([
  {
    title: '商品分类',
    field: 'productCateIds',
    type: 'component',
    component: shallowRef(GoodsTypeCascader),
  },
  {
    title: '国家',
    field: 'countryCodes',
    type: 'select',
    options: async () => {
      return ((await getCountrySelectList()) as any).map((v: { countryCode: string; countryNameZh: string }) => {
        return {
          value: v.countryCode,
          label: v.countryNameZh,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '服务商',
    field: 'supplierIds',
    type: 'select',
    options: async () => {
      return ((await getSupplierList()) as any).map((v: { id: string; shortName: string }) => {
        return {
          value: v.id,
          label: v.shortName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '工单类型',
    field: 'productFunctionCodes',
    type: 'component',
    component: shallowRef(WorkOrderType),
  },
  {
    title: '统计周期',
    field: 'statisticalDate',
    type: 'datePicker',
    value: [
      dayjs().date(1).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      allowClear: false,
    },
    validate: [{ required: true }],
  },
  {
    title: '企业主体',
    field: 'enterpriseIds',
    type: 'select',
    options: async () => {
      return ((await getEnterpriseSelect()) as any).map((v: { id: string; name: string }) => {
        return {
          value: v.id,
          label: v.name,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '服务商',
    dataIndex: 'supplierName',
    width: 160,
    fixed: true,
  },
  {
    title: '商品分类',
    dataIndex: 'productCate',
    width: 120,
    fixed: true,
  },
  {
    title: '国家',
    dataIndex: 'countryName',
    width: 120,
  },
  {
    title: '工单类型',
    dataIndex: 'businessTypeName',
    width: 130,
  },
  {
    title: '统计周期',
    dataIndex: 'statisticalDateStr',
    width: 190,
  },
  {
    title: '经验值',
    children: [
      {
        title: '累计完成',
        dataIndex: 'completedCount',
        width: 120,
      },
    ],
  },
  {
    title: '时效',
    children: [
      {
        title: '提前完成',
        dataIndex: 'advanceCompletedCount',
        width: 120,
      },
      {
        title: '按时完成',
        dataIndex: 'punctualCompletedCount',
        width: 120,
      },
      {
        title: '超时完成',
        dataIndex: 'delayCompletedCount',
        width: 120,
      },
      {
        title: '完成时效(天)',
        dataIndex: 'prescription',
        width: 130,
      },
      {
        title: '平均时效(天)',
        dataIndex: 'avgPrescription',
        width: 130,
      },
    ],
  },
  {
    title: '确定性',
    children: [
      {
        title: '接单量',
        dataIndex: 'orderNum',
        width: 120,
      },
      {
        title: '稳定性得分',
        dataIndex: 'stabilizeScore',
        width: 130,
      },
    ],
  },
]);
