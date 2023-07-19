import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getEnterpriseSelect } from '@/api/base/basicsData';

export const rule: any = ref([
  {
    title: '提交服务商时间',
    field: 'subMatTime',
    type: 'datePicker',
    value: [
      dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '所属企业',
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
    style: {
      width: '170px',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '国家',
    dataIndex: 'countryName',
    width: 150,
    fixed: true,
  },
  {
    title: '提交量',
    dataIndex: 'submitGroupName',
    width: 120,
  },
  {
    title: '30天下号量',
    dataIndex: 'registerTax30',
    width: 120,
  },
  {
    title: '60天下号量',
    dataIndex: 'registerTax60',
    width: 120,
  },
  {
    title: '90天下号量',
    dataIndex: 'registerTax90',
    width: 120,
  },
  {
    title: '30天下号率',
    dataIndex: 'registerTax30Ratio',
    width: 120,
  },
  {
    title: '60天下号率',
    dataIndex: 'registerTax60Ratio',
    width: 120,
  },
  {
    title: '90天下号率',
    dataIndex: 'registerTax90Ratio',
    width: 120,
  },
  {
    title: '时效内下号量',
    dataIndex: 'timeRegisterTax',
    width: 120,
  },
  {
    title: '超时效下号量',
    dataIndex: 'overTimeRegisterTax',
    width: 120,
  },
  {
    title: '时效内尚未下号量',
    dataIndex: 'timeNoRegisterTax',
    width: 140,
  },
  {
    title: '超时效未下号量',
    dataIndex: 'overTimeNoRegisterTax',
    width: 160,
  },
  {
    title: '平均下号时长（天）',
    dataIndex: 'avgRegisterTaxTime',
    width: 150,
  },
]);
