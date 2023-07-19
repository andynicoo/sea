import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getBrandList } from '@/api/base/basicsData';
import SelectTags from '@/components/form/SelectTags.vue';
import UserSelect from '@/components/form/UserSelect.vue';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import IntegerRange from '@/components/form/IntegerRange.vue';
import DecimalRange from '@/components/form/DecimalRange.vue';
import CityCascader from '@/components/form/CityCascader.vue';

export const rule: any = ref([
  {
    title: 'ID标识',
    field: 'unionId',
    type: 'input',
  },
  {
    title: '手机号',
    field: 'mobiles',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '归属地',
    field: 'city',
    type: 'component',
    component: shallowRef(CityCascader),
  },
  {
    title: '客户等级',
    field: 'level',
    type: 'select',
    options: [
      {
        value: 1,
        label: 'SMB客户',
      },
      {
        value: 2,
        label: 'KA客户',
      },
      {
        value: 3,
        label: '品牌客户',
      },
      {
        value: 4,
        label: '渠道客户',
      },
    ],
  },
  {
    title: '客户生命周期',
    field: 'custStatus',
    type: 'select',
    options: [
      {
        value: 0,
        label: '提升期',
      },
      {
        value: 1,
        label: '维护期',
      },
      {
        value: 2,
        label: '衰退期',
      },
      {
        value: 3,
        label: '流失期',
      },
    ],
  },
  {
    title: '跟进人',
    field: 'followUserIds',
    type: 'component',
    props: {
      emptySelect: true,
    },
    component: shallowRef(UserSelect),
  },
  {
    title: '跟进部门',
    field: 'followDepIds',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '客户成功',
    field: 'customerSuccessIds',
    type: 'component',
    props: {
      emptySelect: true,
    },
    component: shallowRef(UserSelect),
  },
  {
    title: '所属部门',
    field: 'customerSuccessDepIds',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '最新成交时间',
    field: 'orderTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '累计成交次数',
    field: 'orderCount',
    type: 'component',
    component: shallowRef(IntegerRange),
  },
  {
    title: '成交品牌',
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
    title: '各品牌累计成交金额',
    field: 'dealAmount',
    type: 'component',
    component: shallowRef(DecimalRange),
  },
  {
    title: '动态一年累计成交金额',
    field: 'yearSumAmount',
    type: 'component',
    component: shallowRef(DecimalRange),
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: 'ID标识',
    dataIndex: 'unionId',
    width: 160,
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: 110,
  },
  {
    title: '归属地',
    dataIndex: 'city',
    width: 110,
  },
  {
    title: '客户等级',
    dataIndex: 'level',
    width: 110,
  },
  {
    title: '客户生命周期',
    dataIndex: 'custStatus',
    width: 110,
  },
  {
    title: '跟进人',
    dataIndex: 'followUserName',
    width: 140,
  },
  {
    title: '跟进人部门',
    dataIndex: 'followUserDepName',
    width: 140,
  },
  {
    title: '客户成功',
    dataIndex: 'customerSuccessList',
    width: 180,
  },
  {
    title: '最新成交时间',
    dataIndex: 'orderCreateTime',
    width: 150,
  },
  {
    title: '累计成交次数',
    dataIndex: 'orderCount',
    width: 120,
  },
  {
    title: '各品牌累计成交金额',
    dataIndex: 'details',
    width: 200,
  },
  {
    title: '动态一年累计成交金额',
    dataIndex: 'payYearAmountSum',
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 100,
  },
]);
