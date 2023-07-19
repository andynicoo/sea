import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getEnterpriseSelect } from '@/api/base/basicsData';

export const rule: any = ref([
  {
    title: '业务分类',
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
  },
  {
    title: '工单类型',
    field: 'enterpriseIds32423',
    type: 'select',
    options: async () => {
      return ((await getEnterpriseSelect()) as any).map((v: { id: string; name: string }) => {
        return {
          value: v.id,
          label: v.name,
        };
      });
    },
  },
  {
    title: '状态',
    field: 'sadas',
    type: 'select',
    options: [
      {
        value: 1,
        label: '启用',
      },
      {
        value: 2,
        label: '禁用',
      },
    ],
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '业务分类',
    dataIndex: 'countryName',
    width: 150,
  },
  {
    title: '工单类型',
    dataIndex: 'submitGroupName',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'registerTax30',
    width: 120,
  },
  {
    title: '最新启用时间',
    dataIndex: 'registerTax60',
    width: 120,
  },
  {
    title: '商品分类',
    dataIndex: 'registerTax90',
    width: 120,
  },
  {
    title: '关联工单',
    dataIndex: 'registerTax30Ratio',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'registerTax60Ratio',
    width: 120,
  },
  {
    title: '已发布流程数',
    dataIndex: 'registerTax90Ratio',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'timeRegisterTax',
    width: 120,
  },
]);
