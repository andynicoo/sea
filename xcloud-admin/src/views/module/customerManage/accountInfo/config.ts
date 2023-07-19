import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import SelectTags from '@/components/form/SelectTags.vue';
import { getBrandList, getEnterpriseSelect } from '@/api/base/basicsData';

export const rule: any = ref([
  {
    title: '手机号',
    field: 'userMobiles',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '品牌',
    field: 'brandId',
    type: 'select',
    options: async () => {
      return ((await getBrandList()) as any).map((v: { key: string; value: string }) => {
        return {
          value: v.key,
          label: v.value,
        };
      });
    },
  },
  {
    title: '主体',
    field: 'enterpriseId',
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
    title: '注册来源',
    field: 'source',
    type: 'select',
    options: [
      {
        value: 0,
        label: 'PC网页端',
      },
      {
        value: 1,
        label: 'H5端',
      },
      {
        value: 2,
        label: '微信小程序',
      },
      {
        value: 5,
        label: '后台录入',
      },
      {
        value: 6,
        label: '销售易',
      },
    ],
  },
  {
    title: '状态',
    field: 'status',
    type: 'select',
    options: [
      {
        value: 0,
        label: '禁用',
      },
      {
        value: 1,
        label: '启用',
      },
      {
        value: 3,
        label: '锁定',
      },
    ],
  },
  {
    title: '注册时间',
    field: 'createTimeQuery',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'nickname',
    width: 120,
  },
  {
    title: '手机号',
    dataIndex: 'userMobile',
    width: 120,
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
    width: 120,
  },
  {
    title: '主体',
    dataIndex: 'enterpriseName',
    width: 120,
  },
  {
    title: '注册来源',
    dataIndex: 'source',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 80,
  },
]);
