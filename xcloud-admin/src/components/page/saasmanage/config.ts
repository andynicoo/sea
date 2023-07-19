import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import type { DataList } from '@/types/saasmanage';

export const columns = ref<TableColumnsType>([
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '描述',
    dataIndex: 'dataDescribe',
    key: 'dataDescribe',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
  },
  {
    title: '修改人名称',
    dataIndex: 'updateName',
    key: 'updateName',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
]);

export const columns2 = ref<TableColumnsType>([
  {
    title: '图标',
    dataIndex: 'iconUrl',
    key: 'iconUrl',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '描述',
    dataIndex: 'dataDescribe',
    key: 'dataDescribe',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
  },
  {
    title: '修改人名称',
    dataIndex: 'updateName',
    key: 'updateName',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
]);

export const dataListItem = ref<DataList>({
  id: '',
  title: '',
  dataDescribe: '',
  sort: '',
  updateName: '',
  iconUrl: '',
});

export const initDataListItem = () => {
  dataListItem.value = {
    id: '',
    title: '',
    dataDescribe: '',
    sort: '',
    updateName: '',
    iconUrl: '',
  };
};
