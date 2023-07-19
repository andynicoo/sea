import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import formCreate from '@form-create/ant-design-vue';
import dayjs from 'dayjs';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import UserSelect from '@/components/form/UserSelect.vue';

formCreate.component('DepartmentCascader', DepartmentCascader);
formCreate.component('UserSelect', UserSelect);

export const rule: any = ref([
  {
    title: '统计周期',
    field: 'createTimeList',
    type: 'datePicker',
    value: [
      dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '需求类型',
    field: 'xxxa',
    type: 'select',
    options: [
      {
        value: 1,
        label: '开发需求',
      },
      {
        value: 1,
        label: '降本需求',
      },
    ],
  },
  {
    title: '部门',
    type: 'DepartmentCascader',
    field: 'aaaa',
  },
  {
    title: '人员',
    type: 'UserSelect',
    field: 'bbbb',
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '部门',
    dataIndex: 'platformDes',
    width: 120,
  },
  {
    title: '人员',
    dataIndex: 'explainRemarks',
    width: 200,
  },
  {
    title: '机会点创建数',
    dataIndex: 'remarks',
    width: 200,
  },
  {
    title: '机会点处理数',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '机会点处理时效',
    dataIndex: 'secret',
    width: 200,
  },
  {
    title: '需求创建数',
    dataIndex: 'pushCrm',
    width: 120,
  },
  {
    title: '需求处理数',
    dataIndex: 'pushCrm',
    width: 120,
  },
  {
    title: '需求处理时效',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '完成开发数',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '完成开发时效',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '完成上市数',
    dataIndex: 'createTime',
    width: 150,
  },
]);
