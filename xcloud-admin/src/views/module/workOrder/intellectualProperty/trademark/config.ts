import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getAllUsers, getCountrySelectList } from '@/api/base/basicsData';
import { getAllServiceProgressAPI, newSupplierList } from '@/api/workOrder/intellectualProperty/trademark';
import type { INodeRecord, ISupplierRecord } from '@/types/trademark';

//特别注意： 主页用到了rule数组下标，若调整了rule数组注意更新主页、StatusOpt组件rule数组下标！！！
export const rule: any = ref([
  {
    title: '服务号',
    field: 'serviceNo',
    type: 'input',
  },
  {
    title: '手机号',
    field: 'mobile',
    type: 'input',
  },
  {
    title: '申请人',
    field: 'applyName',
    type: 'input',
  },
  {
    title: '订单编号',
    field: 'orderNo',
    type: 'input',
  },
  {
    title: '受理号',
    field: 'acceptNum',
    type: 'input',
  },
  {
    title: '商标名称',
    field: 'trademarkNameEn',
    type: 'input',
  },
  {
    title: '国家',
    field: 'countryCode',
    type: 'select',
    options: async () => {
      return ((await getCountrySelectList()) as any).map((v: { countryCode: string; countryNameZh: string }) => {
        return {
          value: v.countryCode,
          label: v.countryNameZh,
        };
      });
    },
  },
  {
    title: '服务名称',
    field: 'serviceName',
    type: 'input',
  },
  {
    title: '注册进度',
    field: 'nodeServiceProgressKey',
    type: 'select',
    options: async () => {
      return ((await getAllServiceProgressAPI({ functionCode: 61 })) as INodeRecord[]).map((v: INodeRecord) => {
        return {
          value: v.nodeCode + '>><<' + v.nodeServiceProgress + '>><<' + v.nodeServiceProgressName,
          label: v.nodeServiceProgressName,
        };
      });
    },
  },
  {
    title: '服务状态',
    field: 'servicesStatus',
    type: 'select',
    value: 1,
    options: [
      {
        value: 1,
        label: '服务中',
      },
      {
        value: 9,
        label: '已取消',
      },
      {
        value: 10,
        label: '封存',
      },
      {
        value: 11,
        label: '取消中',
      },
    ],
  },
  {
    title: '处理人',
    field: 'handleUserName',
    type: 'input',
  },
  {
    title: '渠道来源',
    field: 'orderSource',
    type: 'select',
    options: [
      {
        value: 1,
        label: 'PC网页端',
      },
      {
        value: 2,
        label: 'H5',
      },
      {
        value: 3,
        label: '录入订单',
      },
      {
        value: 4,
        label: '微信小程序',
      },
    ],
  },
  {
    title: '律师',
    field: 'attorneyId',
    type: 'select',
    options: async () => {
      return (
        (await newSupplierList({ supplierType: 2, functionCode: '61', countryCode: '' })) as ISupplierRecord[]
      ).map((v: ISupplierRecord) => {
        return {
          value: v.id,
          label: v.shortName,
        };
      });
    },
  },
  {
    title: '订单归属人',
    field: 'attributionId',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map(
        (v: { userId: string; nickName: string; mobile: string; departmentName: string }) => {
          return {
            value: v.userId,
            label: v.nickName + '——' + v.departmentName,
          };
        }
      );
    },
  },
  {
    title: '创建时间',
    field: 'creatTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改时间',
    field: 'updateTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '受理时间',
    field: 'acceptTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '是否转代理',
    field: 'isProxy',
    type: 'select',
    options: [
      {
        value: true,
        label: '是',
      },
      {
        value: false,
        label: '否',
      },
    ],
  },
  {
    title: '平台审核时间',
    field: 'platformAuditTime',
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
    title: '商标',
    dataIndex: 'trademarkInfo',
    width: 250,
    fixed: true,
  },
  {
    title: '国家',
    dataIndex: 'countryNameZh',
    width: 120,
  },
  {
    title: '申请人',
    dataIndex: 'applyName',
    width: 120,
  },
  {
    title: '服务进度',
    dataIndex: 'serviceProgressStr',
    width: 150,
  },
  {
    title: '服务状态',
    dataIndex: 'serviceStatusStr',
    width: 120,
  },
  {
    title: '受理号/日期',
    dataIndex: 'acceptInfo',
    width: 160,
  },
  {
    title: '服务截止日期',
    dataIndex: 'cutOffTime',
    width: 150,
  },
  {
    title: '商标状态',
    dataIndex: 'trademarkStatus',
    width: 150,
  },
  {
    title: '状态日期',
    dataIndex: 'trademarkStatusDate',
    width: 150,
  },
  {
    title: '订单归属人',
    dataIndex: 'attributionName',
    width: 150,
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 150,
  },
  {
    title: '下载资料时间',
    dataIndex: 'newDownloadTime',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '处理人',
    dataIndex: 'handleInfo',
    width: 200,
  },
  {
    title: '处理律师',
    dataIndex: 'attorneyName',
    width: 150,
  },
  {
    title: '订单备注',
    dataIndex: 'orderRemark',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 80,
    fixed: 'right',
  },
]);
