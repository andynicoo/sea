import util from '@/utils/util.js';
export const codeList = [
  //转代理
  { label: '待上传资料', value: 'NODE0015' },
  { label: '待审核', value: 'NODE0016' },
  { label: '待授权', value: 'NODE0017' },
  { label: '转代理中 ', value: 'NODE0018' },
  { label: '转代理中 ', value: 'NODE0019' },
  { label: '转代理完成 ', value: 'NODE0020' },

  //注册
  { label: '待上传资料', value: 'NODE001' },
  { label: '待审核', value: 'NODE002' },
  { label: '待授权', value: 'NODE003' },
  { label: '注册中 ', value: 'NODE005' },
  { label: '注册中 ', value: 'NODE006' },
  { label: '注册完成 ', value: 'NODE007' },

  //申报
  { label: '待提交申报 ', value: 'NODE0021' },
  { label: '待缴纳税金 ', value: 'NODE0022' },
  { label: '待审核税金 ', value: 'NODE0023' },
  { label: '待审核申报 ', value: 'NODE0024' },
  { label: '申报中', value: 'NODE0025' },
  { label: '申报对接完成', value: 'NODE0026' },
  { label: '申报完成', value: 'NODE0027' },

  //税务稽查
  { label: '待上传资料', value: 'NODE1156' },
  { label: '待处理', value: 'NODE1157' },
  { label: '处理中', value: 'NODE1158' },
  { label: '已完成 ', value: 'NODE1159' },

  // 海牙认证
  { label: '待上传资料', value: 'NODE0028' },
  { label: '待审核', value: 'NODE0029' },
  { label: '待授权', value: 'NODE0030' },
  { label: '海牙认证中 ', value: 'NODE0031' },
  { label: '认证完成', value: 'NODE0032' },

  //注销税号
  { label: '待上传资料', value: 'NODE0052' },
  { label: '待审核', value: 'NODE0053' },
  { label: '注销中', value: 'NODE0054' },
  { label: '已完成', value: 'NODE0055' },
  { label: '注销失败', value: 'NODE0056' },

  //退税
  { label: '待上传资料', value: 'NODE0067' },
  { label: '待审核', value: 'NODE0068' },
  { label: '退税中', value: 'NODE0069' },
  { label: '退税完成', value: 'NODE0070' },
];

export const statusList = [
  { label: '全部', value: '' },
  { label: '正常', value: '1' },
  { label: '待续费', value: '2' },
  { label: '已失效', value: '9' },
  { label: '取消中', value: '11' },
];

export const tabList = [
  { label: '全部', value: '-1' },
  { label: '待上传资料', value: 'NODE2' },
  { label: '待授权', value: 'NODE5' },
  { label: '处理中 ', value: 'PROCESSING' }, // NODE3 NODE4 NODE6 NODE7
  { label: '处理完成 ', value: 'NODE8' },
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
