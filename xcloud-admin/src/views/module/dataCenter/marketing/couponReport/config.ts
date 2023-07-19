import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getEnterpriseSelect } from '@/api/base/basicsData';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import SelectTags from '@/components/form/SelectTags.vue';

export const rule: any = ref([
  {
    title: '优惠券名称',
    field: 'couponName',
    type: 'input',
  },
  {
    title: '使用状态',
    field: 'employStatusList',
    type: 'select',
    options: [
      {
        value: 'UNUSED',
        label: '未使用',
      },
      {
        value: 'USED',
        label: '已使用',
      },
      {
        value: 'INVALID',
        label: '已失效',
      },
      {
        value: 'UN_TAKE_EFFECT',
        label: '未生效',
      },
      {
        value: 'VOIDED',
        label: '已作废',
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '是否为新客',
    field: 'isNewCustomer',
    type: 'select',
    options: [
      {
        value: 1,
        label: '是',
      },
      {
        value: 0,
        label: '否',
      },
    ],
  },
  {
    title: '发放人',
    field: 'issuer',
    type: 'input',
  },
  {
    title: '领取时间',
    field: 'drawTimeList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '销售订单号',
    field: 'orderNoList',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '订单归属人',
    field: 'orderBelonger',
    type: 'input',
  },
  {
    title: '领取方式',
    field: 'pickupMethodList',
    type: 'select',
    options: [
      {
        value: 'ACTIVITY',
        label: '客户领取',
      },
      {
        value: 'MANUAL',
        label: '系统发放',
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '使用时间',
    field: 'employTimeList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '领券手机号',
    field: 'getCouponPhoneList',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '所属部门',
    field: 'orderDepartmentIdList',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '所属企业',
    field: 'enterpriseIdList',
    type: 'select',
    options: async () => {
      return ((await getEnterpriseSelect()) as any).map((v: { id: string; name: string }) => {
        return {
          value: v.id,
          label: v.name,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '过期时间',
    field: 'overdueTimeList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '已领券券码',
    field: 'couponCodeList',
    type: 'component',
    component: shallowRef(SelectTags),
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '优惠券名称',
    dataIndex: 'couponName',
    width: 180,
    fixed: true,
    resizable: true,
  },
  {
    title: '优惠券内容',
    dataIndex: 'couponContent',
    width: 150,
    resizable: true,
  },
  {
    title: '领券手机号',
    dataIndex: 'getCouponPhone',
    width: 120,
  },
  {
    title: '适用范围',
    dataIndex: 'applyScope',
    width: 120,
  },
  {
    title: '领取方式',
    dataIndex: 'pickupMethod',
    width: 120,
  },
  {
    title: '是否为新客',
    dataIndex: 'isNewCustomerTest',
    width: 100,
  },
  {
    title: '已领券号码',
    dataIndex: 'couponCode',
    width: 200,
  },
  {
    title: '销售订单号',
    dataIndex: 'orderNo',
    width: 130,
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    width: 150,
    resizable: true,
  },
  {
    title: '发放人',
    dataIndex: 'issuer',
    width: 120,
  },
  {
    title: '订单归属人',
    dataIndex: 'orderBelonger',
    width: 120,
  },
  {
    title: '所属部门',
    dataIndex: 'orderDepartment',
    width: 130,
  },
  {
    title: '服务金额(元)',
    dataIndex: 'serviceAmount',
    width: 120,
  },
  {
    title: '应付金额(元)',
    dataIndex: 'payableAmount',
    width: 120,
  },
  {
    title: '优惠金额(元)',
    dataIndex: 'discountsAmount',
    width: 120,
  },
  {
    title: '实付金额(元)',
    dataIndex: 'actuallyAmount',
    width: 120,
  },
  {
    title: '领取时间',
    dataIndex: 'drawTime',
    width: 150,
  },
  {
    title: '使用时间',
    dataIndex: 'employTime',
    width: 150,
  },
  {
    title: '过期时间',
    dataIndex: 'overdueTime',
    width: 150,
  },
  {
    title: '使用状态',
    dataIndex: 'employStatus',
    width: 120,
  },
]);
