import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getCategoryOption } from '@/api/saasManage/kownManage/reportList';

const regionOptions = [
  { value: 'all', label: '全部' },
  { value: 'WEUR', label: '西欧' },
  { value: 'SEA', label: '东南亚' },
  { value: 'JK', label: '日韩' },
  { value: 'NA', label: '北美' },
  { value: 'AFRICA', label: '非洲' },
  { value: 'LAT', label: '拉丁美洲' },
  { value: 'CHN', label: '中国' },
];

export const rule: any = ref([
  {
    title: '报告标题',
    field: 'title',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '报告分类',
    field: 'categoryId',
    type: 'select',
    options: async () => {
      return ((await getCategoryOption()) as any).map((v: { id: string; categoryName: string }) => {
        return {
          value: v.id,
          label: v.categoryName,
        };
      });
    },
    // props: {
    //   mode: 'multiple',
    // },
  },
  {
    title: '所属地域',
    field: 'region',
    type: 'select',
    options: regionOptions,
  },
  {
    title: '状态',
    field: 'enabled',
    type: 'select',
    options: [
      { value: 'ENABLE', label: '已发布' },
      { value: 'DISABLE', label: '未发布' },
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
    title: 'ID',
    dataIndex: 'id',
    width: 150,
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
    title: '地域',
    dataIndex: 'region',
    width: 110,
    align: 'center',
    customRender: ({ text }) => {
      let data: string = '';
      regionOptions.forEach(item => {
        if (item.value === text) {
          data = item.label;
        }
      });
      return data;
    },
  },
  {
    title: '分类',
    dataIndex: 'categoryName',
    width: 110,
    align: 'center',
  },
  {
    title: '报告标题',
    dataIndex: 'title',
    width: 200,
    align: 'center',
  },
  {
    title: '浏览次数',
    dataIndex: 'record',
    width: 110,
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    width: 110,
    align: 'center',
    customRender: ({ text }) => {
      return text === 'ENABLE' ? '已发布' : '未发布';
    },
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: 150,
    align: 'center',
  },
  {
    title: '发布人',
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
    key:'operation',
    width: 180,
    align: 'center',
  },
]);
