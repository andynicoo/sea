import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import UserSelect from '@/components/form/UserSelect.vue';

export const rule: any = ref([
  {
    title: '申请人',
    field: 'applyBys',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '任务创建时间',
    field: 'taskCreateTime',
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
    title: '任务名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '任务类型',
    dataIndex: 'type',
    width: 120,
  },
  {
    title: '审批ID',
    dataIndex: 'dingTalkApplyId',
    width: 140,
  },
  {
    title: '任务创建时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '申请人',
    dataIndex: 'applyByName',
    width: 120,
  },
  {
    title: '处理人',
    dataIndex: 'handledByName',
    width: 120,
  },
  {
    title: '推送记录',
    dataIndex: 'pushStatus',
    width: 140,
  },
  {
    title: '推送时间',
    dataIndex: 'sendTime',
    width: 150,
  },
  {
    title: '下载文件记录',
    dataIndex: 'downloadLogNum',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 120,
  },
]);
