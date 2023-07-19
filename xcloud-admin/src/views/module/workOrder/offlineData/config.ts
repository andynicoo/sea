import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getCountrySelectList } from '@/api/base/basicsData';

export const rule: any = ref([
  {
    title: '国家',
    field: 'countryCodes',
    type: 'select',
    options: async () => {
      return ((await getCountrySelectList()) as any).map((v: { countryCode: string; countryNameZh: string }) => {
        return {
          // value: v.countryCode,
          value: v.countryNameZh, //接口按国家中文名查询
          label: v.countryNameZh,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '商标名',
    field: 'tradeName',
    type: 'input'
  },
  {
    title: '受理号',
    field: 'acceptanceNo',
    type: 'input'
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '订单号',
    dataIndex: 'sn',
    width: 150,
    fixed: true
  },
  {
    title: '订单金额',
    dataIndex: 'price',
    width: 100,
  },
  {
    title: '国家',
    dataIndex: 'countryCn',
    width: 100,
  },
  {
    title: '商品明细',
    dataIndex: 'productDetails',
    width: 180,
  },
  {
    title: '销售名',
    dataIndex: 'salesName',
    width: 120,
  },
  {
    title: '联系电话',
    dataIndex: 'telephone',
    width: 110,
  },
  {
    title: '类目',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: '商标名称',
    dataIndex: 'tradeName',
    width: 100,
  },
  {
    title: '商标申请人',
    dataIndex: 'tradeApply',
    width: 180,
  },
  {
    title: '申请样式',
    dataIndex: 'applyStyle',
    width: 100,
  },
  {
    title: '提交官方日期',
    dataIndex: 'submitTime',
    width: 150,
  },
  {
    title: '受理号',
    dataIndex: 'acceptanceNo',
    width: 120,
  },
  {
    title: '目前状态',
    dataIndex: 'targetStatus',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 70,
    fixed: 'right'
  },
]);
