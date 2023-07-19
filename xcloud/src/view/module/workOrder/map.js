import util from '../../../utils/util';
export const statusList = [
  { label: '未购买', value: 0, show: false },
  { label: '服务中', value: 1, show: true },
  { label: '待续费', value: 2, show: false },
  { label: '税号注销', value: 3, show: false },
  { label: '已转出', value: 4, show: false },
  { label: '已取消', value: 9, show: true },
  { label: '取消中', value: 11, show: true },
];

export const currentCodeList = [
  { label: '未开始', value: 'NODE1' },
  { label: '待上传资料', value: 'NODE2' },
  { label: '待审核资料', value: 'NODE3' },
  { label: '已审核', value: 'NODE4' },
  { label: '待授权', value: 'NODE5' },
  { label: '待审核授权', value: 'NODE6' },
  { label: '办理中', value: 'NODE7' },
  { label: '已完成', value: 'NODE8' },
  { label: '待付款', value: 'NODE9' },
  { label: '待客户确认', value: 'NODE10' },
  { label: '待提交申报', value: 'NODE11' },
  { label: '待审核申报', value: 'NODE12' },
  { label: '待录入发票号', value: 'NODE13' },
  { label: '待缴纳税金', value: 'NODE14' },
  { label: '待审核税金', value: 'NODE15' },
  { label: '待上传回执', value: 'NODE16' },
  { label: '申报完成', value: 'NODE17' },
  { label: '待录入受理号', value: 'NODE18' },
  { label: '审核期', value: 'NODE19' },
  { label: '公告期', value: 'NODE20' },
  { label: '待翻译官方文件', value: 'NODE21' },
  { label: '待递交授权书', value: 'NODE22' },
  { label: '绘图中', value: 'NODE23' },
  { label: '建模中', value: 'NODE24' },
  { label: '待审核建模', value: 'NODE25' },
  { label: '待审核绘图', value: 'NODE26' },
];

export const currentCodeEnum = util.getEnumObj(currentCodeList);
