import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getCategoryOption } from '@/api/saasManage/kownManage/reportList';

export const rule: any = ref([
  {
    title: '活动标题',
    field: 'title',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '状态',
    field: 'enabled',
    type: 'select',
    options: [
      { value: 'ENABLE', label: '启用' },
      { value: 'DISABLE', label: '禁用' },
    ],
  },
  {
    title: '创建时间',
    field: 'createTimeStart',
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
    width: 60,
    align: 'center',
  },
  {
    title: '主图',
    dataIndex: 'mainPicUrl',
    customCell: (record, rowIndex, column) => {
      return { innerHTML: `<img class="main-img" src="${record.mainPicUrl}"/>` };
    },
    width: 180,
    align: 'center',
  },
  {
    title: '活动标题',
    dataIndex: 'title',
    width: 180,
    align: 'center',
  },
  {
    title: '活动时间',
    dataIndex: 'activityTime',
    width: 180,
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    width: 110,
    align: 'center',
    customRender: ({ text, record }) => {
      if (text === 'DISABLE') return '禁用';
      let startTime = new Date(record.startTime).getTime();
      let endTime = new Date(record.endTime).getTime();
      let currentTime = new Date().getTime();
      if (currentTime < startTime) return '未开始';
      if (currentTime > endTime) return '已结束';
      if (currentTime > startTime && currentTime < endTime) return '进行中';
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'createName',
    width: 110,
    align: 'center',
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 150,
    align: 'center',
  },
  {
    title: '修改人',
    dataIndex: 'modifyName',
    width: 110,
    align: 'center',
  },
  {
    title: '操作',
    key: 'opration',
    width: 160,
    align: 'center',
  },
]);
