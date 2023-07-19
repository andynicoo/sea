import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { baseDataType, getEnterpriseSelect } from '@/api/base/basicsData';
import { useStore } from '@/stores/store';

export const rule: any = ref([
  {
    title: '统计方式',
    field: 'statisticsType',
    type: 'select',
    value: 1,
    options: [
      {
        value: 1,
        label: '部门',
      },
      {
        value: 2,
        label: '员工',
      },
      {
        value: 3,
        label: '商品',
      },
      {
        value: 4,
        label: '商品分类',
      },
    ],
  },
  {
    title: '所属企业',
    field: 'enterpriseId',
    type: 'select',
    value: useStore().enterprise.record.id,
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
    title: '统计周期',
    field: 'statisticalTimeList',
    type: 'datePicker',
    value: [
      dayjs().date(1).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '订单来源',
    field: 'orderSource',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'ORDER_SOURCE_TYPE' })) as any).map(
        (v: { dataCode: string; dataValue: string }) => {
          return {
            value: v.dataCode,
            label: v.dataValue,
          };
        }
      );
    },
  },
  {
    title: '支付方式',
    field: 'payChannel',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'PAYMENT_CHANNEL_TYPE' })) as any).map(
        (v: { dataCode: string; dataValue: string }) => {
          return {
            value: v.dataCode,
            label: v.dataValue,
          };
        }
      );
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '名称',
    dataIndex: 'statisticsTypeName',
    width: 150,
  },
  {
    title: '销售额（元）',
    dataIndex: 'totalSale',
    width: 120,
    sorter: (a, b) => a.totalSale - b.totalSale,
  },
  {
    title: '支付订单数',
    dataIndex: 'totalPayOrders',
    width: 120,
    sorter: (a, b) => a.totalPayOrders - b.totalPayOrders,
  },
  {
    title: '支付人数',
    dataIndex: 'payUsers',
    width: 120,
    sorter: (a, b) => a.payUsers - b.payUsers,
  },
  {
    title: '支付件数',
    dataIndex: 'totalThings',
    width: 120,
    sorter: (a, b) => a.totalThings - b.totalThings,
  },
  {
    title: '退款金额（元）',
    dataIndex: 'totalRefund',
    width: 120,
    sorter: (a, b) => a.totalRefund - b.totalRefund,
  },
  {
    title: '退款单量',
    dataIndex: 'totalRefundNum',
    width: 120,
    sorter: (a, b) => a.totalRefundNum - b.totalRefundNum,
  },
]);
