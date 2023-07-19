import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getCategoryOption } from '@/api/saasManage/kownManage/qaList';

export const rule: any = ref([
  {
    title: '问答标题',
    field: 'title',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '问题分类',
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
    title: '状态',
    field: 'questionStatus',
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
    // value: [
    //   dayjs().date(1).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    //   dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    // ],
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
    title: '分类',
    dataIndex: 'categoryName',
    width: 110,
    align: 'center',
  },
  {
    title: '问题标题',
    dataIndex: 'title',
    width: 180,
    align: 'center',
  },
  {
    title: '回答数',
    dataIndex: 'answerNumber',
    width: 110,
    align: 'center',
  },
  {
    title: '属性词',
    dataIndex: 'attributeWords',
    width: 110,
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'questionStatus',
    width: 110,
    align: 'center',
    customRender: ({ text }) => {
      return text === 'ENABLE' ? '已发布' : '未发布';
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
    key:'operation',
    width: 180,
    align: 'center',
  },
]);



