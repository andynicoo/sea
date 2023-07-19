import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getEnterpriseSelect } from '@/api/base/basicsData';
import SourceCascader from '@/components/form/SourceCascader.vue';
import UserSelect from '@/components/form/UserSelect.vue';

export const rule: any = ref([
  {
    title: '线索来源',
    field: 'sourceSmallList',
    type: 'component',
    component: shallowRef(SourceCascader),
    style: {
      width: '230px',
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '手机号',
    field: 'mobile',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '跟进人',
    field: 'userIdList',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '创建时间',
    field: 'cluesCreateTime',
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
    title: '潜客转化时间',
    field: 'cluesChangeTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '客户首单时间',
    field: 'custUserOrderTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '所属企业',
    field: 'enterpriseIdList',
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
    title: '手机号',
    dataIndex: 'mobile',
    width: 120,
  },
  {
    title: '所属企业',
    dataIndex: 'enterpriseName',
    width: 120,
  },
  {
    title: '线索来源(大类)',
    dataIndex: 'sourceLargeName',
    width: 120,
  },
  {
    title: '线索来源(小类)',
    dataIndex: 'sourceSmallName',
    width: 120,
  },
  {
    title: '跟进人',
    dataIndex: 'followUserName',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '潜客转化时间',
    dataIndex: 'opportunityTime',
    width: 150,
  },
  {
    title: '客户首单时间',
    dataIndex: 'changeTime',
    width: 150,
  },
]);
