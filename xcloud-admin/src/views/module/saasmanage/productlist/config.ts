import type { TableColumnsType } from 'ant-design-vue';
import { ref } from 'vue';
import { getProductBigList } from '@/api/saasManage/productList';

// import type { FormItem } from '@/types/member';

export const rule: any = ref([
  {
    title: '商品名称',
    field: 'productName',
    type: 'input',
  },
  {
    title: '所属产品大类',
    field: 'productCategoryId',
    type: 'select',
    options: async () => {
      return ((await getProductBigList({})) as any).map((v: { id: string; productCategoryName: string }) => {
        return {
          value: v.id,
          label: v.productCategoryName,
        };
      });
    },
  },
  {
    title: '产品状态',
    field: 'productStatus',
    type: 'select',
    options: [
      {
        value: 'null',
        label: '请选择',
      },
      {
        value: 'ENABLE',
        label: '启用',
      },
      {
        value: 'DISABLE',
        label: '禁用',
      },
    ],
  },
]);

export const columns: TableColumnsType = [
  {
    title: '商品名称',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: '商品服务图片',
    dataIndex: 'productImage',
    width: 150,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 150,
  },
  {
    title: '套餐内容',
    dataIndex: 'packageContent',
    width: 250,
  },
  {
    title: '所属产品大类',
    dataIndex: 'productCategoryName',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'productStatus',
    width: 100,
  },
  {
    title: '资料',
    dataIndex: 'dataNumber',
    width: 100,
  },
  {
    title: '流程',
    dataIndex: 'processNumber',
    width: 100,
  },
  {
    title: '优势',
    dataIndex: 'advantageNumber',
    width: 100,
  },
  {
    title: '谁需要服务',
    dataIndex: 'whoNeedNumber',
    width: 100,
  },
  {
    title: '增值服务',
    dataIndex: 'addValueNumber',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 150,
  },
];
