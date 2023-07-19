import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getCountrySelectList, getEnterpriseSelect } from '@/api/base/basicsData';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import type { UserLevelMapOV, ServicesStatusListOV } from '@/types/myServices';
import type { VatDeclareDetailVO, VatCommitListRes } from '@/api/management/vat';

// 客户等级
export const userLevelMap: UserLevelMapOV = {
  0: '普通客户',
  1: 'SMB客户',
  2: 'KA客户',
  3: '品牌客户',
  4: '渠道客户',
};
// 申报周期(0、月报 1、季报 2、年报)
export const declarePeriodMap = {
  0: '月报',
  1: '季报',
  2: '年报',
};
// 工单状态
export const declareStatusMap = {
  10: '待提交申报',
  13: '待缴纳税金',
  16: '申报完成',
  18: '待提交申报(驳回)',
  19: '待缴纳税金(驳回)',
};
// 服务状态 服务状态 1、服务中 2、待续费 3、税号注销 4 已转出 9.已取消 10 封存 11取消中 12.已续费 13.确认转出
export const serviceStatusMap = {
  1: '服务中',
  2: '待续费',
  3: '税号注销',
  4: '已转出',
  9: '已取消',
  10: '封存',
  11: '取消中',
  12: '已续费',
  13: '确认转出',
};

//服务类型
export const functionCodesMap: ServicesStatusListOV[] = [
  {
    value: 5,
    label: 'VAT注册',
  },
  {
    value: 2,
    label: 'VAT转代理',
  },
  {
    value: 23,
    label: 'IOSS注册',
  },
];
export const rule: Ref<FormRule[]> = ref([
  {
    title: '客户手机号',
    field: 'mobile',
    type: 'input',
    props: {
      placeholder: '客户手机号',
    },
  },
  {
    title: 'VAT服务',
    field: 'serviceNo',
    type: 'input',
    props: {
      placeholder: '订单号/服务号/税号',
    },
  },
  {
    title: '选择主体',
    field: 'enterpriseIds',
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
    title: '选择国家',
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
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '服务状态',
    field: 'status',
    type: 'select',
    value: ['1'],
    options: Object.entries(serviceStatusMap).map(([key, value]) => ({ label: value, value: key })),

    props: {
      mode: 'multiple',
    },
  },
  {
    title: '服务创建时间',
    field: 'serviceCreate',
    type: 'datePicker',
    value: [
      dayjs().subtract(1, 'year').startOf('days').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('days').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '公司名称',
    field: 'companyNameZh',
    type: 'input',
  },
  {
    title: '服务名称',
    field: 'serviceName',
    type: 'input',
  },
  {
    title: '服务类型',
    field: 'functionCodes',
    type: 'select',
    options: functionCodesMap,
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '资料提交时间',
    field: 'materialSubmit',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '所属部门',
    field: 'departmentIds',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
]);

export const columns: TableColumnsType = [
  {
    title: '手机号',
    dataIndex: 'userMobile',
    width: 120,
    fixed: true,
  },
  {
    title: '客户等级',
    fixed: true,
    dataIndex: 'userLevel',
    width: 90,
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 120,
  },
  {
    title: '所属主体',
    dataIndex: 'enterpriseName',
    width: 120,
  },
  {
    title: '服务名称',
    dataIndex: 'serviceName',
    ellipsis: true,
    width: 200,
  },
  {
    title: '国家',
    dataIndex: 'countryNameZh',
    ellipsis: true,
    width: 80,
  },
  {
    title: '服务公司',
    dataIndex: 'companyNameZh',
    ellipsis: true,
    width: 150,
  },
  {
    title: '服务类型',
    dataIndex: 'functionCode',
    width: 150,
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 180,
  },
  {
    title: '服务进度',
    dataIndex: 'currentNodeCode',
    width: 180,
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    ellipsis: true,
    width: 200,
  },
  {
    title: '服务创建时间',
    dataIndex: 'createTime',
    width: 150,
    sorter: true,
  },
  {
    title: '最近提交资料时间',
    dataIndex: 'endCommitTime',
    width: 150,
  },
  {
    title: '最近驳回时间',
    dataIndex: 'rejectTime',
    width: 150,
  },
  {
    title: '驳回内容',
    dataIndex: 'rejectContent',
    ellipsis: true,
    width: 200,
  },
  {
    title: '驳回次数',
    dataIndex: 'rejectCount',
    width: 100,
    align: 'center',
    sorter: true,
  },
  {
    title: '订单归属人',
    dataIndex: 'attributionName',
    width: 120,
  },
  {
    title: '所属部门',
    dataIndex: 'consoleDepName',
    width: 120,
  },
  {
    title: '最新跟进时间',
    align: 'center',
    dataIndex: 'situationTime',
    fixed: 'right',
    width: 110,
    customRender({ text }) {
      return text ? dayjs(text).format('MM-DD HH:mm') : '';
    },
  },
  {
    title: '跟进记录',
    dataIndex: 'situationContent',
    align: 'center',
    fixed: 'right',
    width: 80,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 80,
    align: 'center',
    fixed: 'right',
  },
];

export const columnsOvertime: TableColumnsType = [
  {
    title: '手机号',
    dataIndex: 'userMobile',
    width: 120,
    fixed: true,
  },
  {
    title: '客户等级',
    dataIndex: 'userLevel',
    fixed: true,
    width: 90,
    customRender({ text }) {
      return userLevelMap[text];
    },
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 120,
  },
  {
    title: '所属主体',
    dataIndex: 'enterpriseName',
    width: 120,
  },
  {
    title: '服务名称',
    dataIndex: 'serviceName',
    ellipsis: true,
    width: 200,
  },
  {
    title: '国家',
    dataIndex: 'countryNameZh',
    ellipsis: true,
    width: 80,
  },
  {
    title: '服务公司',
    dataIndex: 'companyNameZh',
    ellipsis: true,
    width: 150,
  },
  {
    title: '服务类型',
    dataIndex: 'functionCode',
    width: 150,
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 180,
  },
  {
    title: '服务进度',
    dataIndex: 'currentNodeCode',
    width: 110,
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    width: 200,
  },
  {
    title: '服务创建时间',
    dataIndex: 'createTime',
    width: 200,
    sorter: true,
  },
  {
    title: '首次提交资料时间',
    dataIndex: 'firstCommitTime',
    width: 200,
    sorter: true,
  },
  {
    title: '客户发送邮箱时间',
    dataIndex: 'customerDataSendTime',
    width: 200,
  },
  {
    title: '提交到服务商',
    dataIndex: 'submitServiceTime',
    width: 200,
    sorter: true,
  },
  {
    title: '预计交付时长',
    dataIndex: 'deliveryDay',
    align: 'center',
    width: 130,
  },
  {
    title: '当前等待天数',
    dataIndex: 'currentDeliveryDay',
    align: 'center',
    width: 130,
  },
  {
    title: '订单归属人',
    dataIndex: 'attributionName',
    width: 150,
  },
  {
    title: '所属部门',
    dataIndex: 'consoleDepName',
    width: 100,
  },
  {
    title: '最新跟进时间',
    dataIndex: 'situationTime',
    align: 'center',
    fixed: 'right',
    width: 110,
    customRender({ text }) {
      return text ? dayjs(text).format('MM-DD HH:mm') : '';
    },
  },
  {
    title: '跟进记录',
    align: 'center',
    dataIndex: 'situationContent',
    width: 80,
    fixed: 'right',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 70,
    align: 'center',
    fixed: 'right',
  },
];

/** 待提交 */
export const commitColumns: TableColumnsType<VatCommitListRes> = [
  { title: '手机号', dataIndex: 'userMobile', width: 110, fixed: true },
  {
    title: '客户等级',
    fixed: true,
    dataIndex: 'userLevel',
    width: 90,
    customRender({ text }) {
      return userLevelMap[text];
    },
  },
  { title: '订单号', dataIndex: 'orderNo', width: 120 },
  { title: '所属主体', dataIndex: 'enterpriseName', width: 80 },
  { title: '服务名称', dataIndex: 'serviceName', ellipsis: true, width: 180 },
  { title: '国家', dataIndex: 'countryNameZh', width: 90 },
  { title: '服务公司', dataIndex: 'companyNameZh', width: 180 },
  {
    title: '服务类型',
    dataIndex: 'functionCode',
    width: 100,
    customRender({ text }) {
      // 2=VAT转代理  5=VAT注册   23=IOSS注册
      switch (text) {
        case 2:
          return 'VAT转代理';
        case 5:
          return 'VAT注册';
        case 23:
          return 'IOSS注册';
        default:
          return '--';
      }
    },
  },
  { title: '服务号', dataIndex: 'serviceNo', width: 180 },
  { title: '服务进度', dataIndex: 'currentNodeCode', width: 95 },
  { title: '处理人', dataIndex: 'handler', ellipsis: true, width: 100 },
  { title: '服务创建时间', dataIndex: 'createTime', width: 150, sorter: true },
  {
    title: '未处理天数',
    dataIndex: 'handleDay',
    width: 110,
    sorter: true,
    align: 'center',
  },
  { title: '计划服务时间', dataIndex: 'planServiceTime', width: 140, sorter: true },
  { title: '订单归属人', dataIndex: 'attributionName', ellipsis: true, width: 100 },
  { title: '所属部门', dataIndex: 'consoleDepName', ellipsis: true, width: 80 },
  {
    title: '最新跟进时间',
    align: 'center',
    dataIndex: 'situationTime',
    width: 110,
    fixed: 'right',
    customRender({ text }) {
      return text ? dayjs(text).format('MM-DD HH:mm') : '';
    },
  },
  { title: '跟进记录', dataIndex: 'situationContent', align: 'center', ellipsis: true, width: 80, fixed: 'right' },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 70,
    align: 'center',
    fixed: 'right',
  },
];

/** 下单/转代理 */
export const reAgentColumns: TableColumnsType = [
  { title: '手机号', dataIndex: 'userMobile', width: 110, fixed: true },
  {
    title: '客户等级',
    dataIndex: 'userLevel',
    fixed: true,
    width: 90,
    customRender({ text }) {
      return userLevelMap[text];
    },
  },
  { title: '订单号', dataIndex: 'orderNo', width: 120 },
  { title: '所属主体', dataIndex: 'enterpriseName', width: 80 },
  { title: '服务名称', dataIndex: 'serviceName', ellipsis: true, width: 180 },
  { title: '国家', dataIndex: 'countryNameZh', width: 90 },
  { title: '服务公司', dataIndex: 'companyNameZh', ellipsis: true, width: 180 },
  {
    title: '服务类型',
    dataIndex: 'functionCode',
    width: 100,
    customRender({ text }) {
      // 2=VAT转代理  5=VAT注册   23=IOSS注册
      switch (text) {
        case 2:
          return 'VAT转代理';
        case 5:
          return 'VAT注册';
        case 23:
          return 'IOSS注册';
        default:
          return '--';
      }
    },
  },
  { title: '服务号', dataIndex: 'serviceNo', width: 180 },
  { title: '服务进度', dataIndex: 'currentNodeCode', width: 95 },
  { title: '处理人', dataIndex: 'handler', ellipsis: true, width: 150 },
  { title: '服务创建时间', dataIndex: 'createTime', width: 150 },
  { title: '首次提交资料时间', dataIndex: 'firstCommitTime', width: 150 },
  { title: '服务完成时间', dataIndex: 'serviceCompleteTime', width: 150, sorter: true },
  { title: '本土税号', dataIndex: 'localTaxNumber', ellipsis: true, width: 120 },
  { title: '欧盟税号', dataIndex: 'vatTaxEuNumber', ellipsis: true, width: 120 },
  {
    title: '税号生效日期',
    dataIndex: 'taxEffectiveDate',
    width: 150,
    customRender({ text }) {
      return text ? dayjs(text).format('YYYY-MM-DD') : '--';
    },
  },
  {
    title: '申报周期',
    dataIndex: 'declarePeriod',
    width: 80,
    customRender({ text }) {
      // 申报周期类型(0:月报 1:季报 2:年报)
      const periodMap: { [key: string]: string } = { 0: '月报', 1: '季报', 2: '年报' };
      return periodMap[text] || '--';
    },
  },
  { title: '待申报', dataIndex: 'pendingDeclareCount', width: 70 },
  { title: '待缴税', dataIndex: 'pendingPayDeclareCount', width: 70 },
  { title: '被驳回', dataIndex: 'rejectDeclareCount', width: 70 },
  { title: '完成申报', dataIndex: 'completeDeclareCount', width: 80 },
  { title: '订单归属人', dataIndex: 'attributionName', ellipsis: true, width: 100 },
  { title: '所属部门', dataIndex: 'consoleDepName', ellipsis: true, width: 80 },
  { title: '服务截至时间', dataIndex: 'expirationTime', width: 150 },
  {
    title: '剩余服务时间',
    dataIndex: 'remainingDay',
    width: 110,
    customRender: ({ record }) => {
      return Number(record.remainingDay || 0) >= 0 ? `${record.remainingDay} 天` : '已过期';
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 70,
    fixed: 'right',
  },
];

/** 申报记录列表 */
export const declareRecordColumns: TableColumnsType<VatDeclareDetailVO> = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    width: 50,
    customRender({ index }) {
      return index;
    },
  },
  {
    title: '申报工单',
    dataIndex: 'taxWorkNo',
    align: 'center',
    width: 165,
  },
  {
    title: '申报周期',
    dataIndex: 'beginTime',
    align: 'center',
    width: 160,
    customRender({ record }) {
      return record.beginTime
        ? `${dayjs(record.beginTime).format('YYYY-MM-DD')} 至 ${dayjs(record.endTime).format('YYYY-MM-DD')}`
        : '--';
    },
  },
  {
    title: '申报进度',
    dataIndex: 'status',
    align: 'center',
    width: 100,
    customRender: ({ record }) => declareStatusMap[record.status],
  },
  {
    title: '工单状态',
    dataIndex: 'workStatus',
    align: 'center',
    width: 80,
    customRender: ({ record }) => (record.workStatus === 1 ? '正常' : '已取消'),
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 50,
    fixed: 'right',
  },
];
