import { getDataSourceList, getDataTypeList } from '/@/api/subscribe';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

// 搜索框字段配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'field1',
    component: 'ApiSelect',
    label: '数据源：',
    colProps: {
      span: 6,
    },
    componentProps: {
      api: getDataSourceList,
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'field2',
    component: 'ApiSelect',
    label: '数据类型：',
    colProps: {
      span: 6,
    },
    componentProps: {
      api: getDataTypeList,
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'field3',
    component: 'Input',
    label: '关键词：',
    colProps: {
      span: 6,
    },
  },
];

// 列表表格字段配置
export const columns: BasicColumn[] = [
  {
    title: '数据源',
    dataIndex: 'source',
    fixed: 'left',
    width: 150,
  },
  {
    title: '数据源类型',
    dataIndex: 'type',
    width: 150,
  },
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '内容标签',
    dataIndex: 'tags',
    width: 200,
  },
  {
    title: '创建时间',
    width: 150,
    dataIndex: 'createTime',
  },
];
