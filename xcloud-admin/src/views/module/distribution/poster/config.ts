import type { TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';

export const Options = [
  { value: '', label: '全部' },
  { value: 'INVITATION_POSTER', label: '邀请海报' },
  { value: 'PROMOTION_POSTER', label: '获客海报' },
];
export const rule: any = ref([
  {
    title: '海报分类',
    field: 'type',
    type: 'select',
    options: Options,
  },
]);
export const columns: TableColumnsType = [
  {
    title: '海报名称',
    dataIndex: 'drpTitle',
  },
  {
    title: '海报图',
    dataIndex: 'drpImage',
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
  },
  {
    title: '海报分类',
    dataIndex: 'type',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];
