import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getEnterpriseSelect } from '@/api/base/basicsData';
import UserSelect from '@/components/form/UserSelect.vue';
import SelectTags from '@/components/form/SelectTags.vue';

export const rule: any = ref([
  {
    title: '订单创建时间',
    field: 'orderCreateTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '订单号',
    field: 'orderNo',
    type: 'input',
  },
  {
    title: '商品名称',
    field: 'productName',
    type: 'input',
  },
  {
    title: '订单归属人',
    field: 'attributionIds',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '工单生成时间',
    field: 'workCreateTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '服务号',
    field: 'serviceNos',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '服务名称',
    field: 'serviceName',
    type: 'input',
  },
  {
    title: '交付',
    field: 'handlerUserName',
    type: 'input',
  },
  {
    title: '业务节点',
    field: 'cureentNodeName',
    type: 'input',
  },
  {
    title: '工单号',
    field: 'workNos',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '商品ID',
    field: 'productIds',
    type: 'component',
    component: shallowRef(SelectTags),
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
    title: '订单号',
    dataIndex: 'orderNo',
    width: 140,
    fixed: true,
  },
  {
    title: '订单创建时间',
    dataIndex: 'orderCreateTime',
    width: 150,
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: '商品ID',
    dataIndex: 'productId',
    width: 180,
  },
  {
    title: '商品规格名称',
    dataIndex: 'specsName',
    width: 120,
  },
  {
    title: '服务名称',
    dataIndex: 'serviceName',
    width: 180,
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 190,
  },
  {
    title: '工单号',
    dataIndex: 'workNo',
    width: 200,
  },
  {
    title: '服务商/律师',
    dataIndex: 'supplierName',
    width: 130,
  },
  {
    title: '业务名称',
    dataIndex: 'typeName',
    width: 130,
  },
  {
    title: '工单生成时间',
    dataIndex: 'workCreateTime',
    width: 150,
  },
  {
    title: '当前业务节点',
    dataIndex: 'cureentNodeName',
    width: 130,
  },
  {
    title: '工单已耗时',
    dataIndex: 'nodesCalculation',
    width: 190,
  },
  {
    title: '订单归属人',
    dataIndex: 'attributionName',
    width: 120,
  },
  {
    title: '处理人',
    dataIndex: 'handlerUserName',
    width: 220,
  },
  {
    title: '所属主体',
    dataIndex: 'enterpriseName',
    width: 120,
  },
]);
