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
  { label: '待上传资料', value: 'TABCODE1' },
  { label: '待授权', value: 'TABCODE2' },
  { label: '处理中 ', value: 'TABCODE3' },
  { label: '处理完成 ', value: 'TABCODE4' },
];

export const progressData = {
  // 注册+申报 (注册工单)
  5: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待授权',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待提交注册',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注册中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '转代理完成',
      status: '1',
      timeList: [],
    },
  ],
  // 转代理+申报 (转代理工单)
  2: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待授权',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待提交转代理',
      status: '1',
      timeList: [],
    },
    {
      progressName: '转代理中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '转代理完成',
      status: '1',
      timeList: [],
    },
  ],
  // IOSS注册+申报 (申报工单)
  23: [
    {
      progressName: '待提交申报',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核申报',
      status: '1',
      timeList: [],
    },
    {
      progressName: '申报中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '代缴纳税金',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核税金',
      status: '1',
      timeList: [],
    },
    {
      progressName: '申报对接完成',
      status: '1',
      timeList: [],
    },
    {
      progressName: '申报完成',
      status: '1',
      timeList: [],
    },
  ],
  // 税号注销 (注销工单)
  6: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注销中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注销完成',
      status: '1',
      timeList: [],
    },
  ],
  // 税务稽查 (稽查工单)
  7: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待处理',
      status: '1',
      timeList: [],
    },
    {
      progressName: '处理中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '处理完成',
      status: '1',
      timeList: [],
    },
  ],
  // VAT退税 (退税工单)
  24: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核',
      status: '1',
      timeList: [],
    },
    {
      progressName: '退税中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '退税完成',
      status: '1',
      timeList: [],
    },
  ],
  // EPR注册 (EPR注册工单)
  31: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '已审核',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待授权',
      status: '1',
      timeList: [],
    },
    {
      progressName: '授权待确认',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注册中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注册完成',
      status: '1',
      timeList: [],
    },
  ],
  // EPR转代理 (EPR转代理工单)
  32: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待授权',
      status: '1',
      timeList: [],
    },
    {
      progressName: '授权待确认',
      status: '1',
      timeList: [],
    },
    {
      progressName: '转代理中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '转代理完成',
      status: '1',
      timeList: [],
    },
  ],
  // 德国WEEE加类加品牌 (EPR加类加品工单)
  106: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '已审核',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注册中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注册完成',
      status: '1',
      timeList: [],
    },
  ],
  // 授权代表 (授权代表)
  16: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '已审核',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待授权',
      status: '1',
      timeList: [],
    },
    {
      progressName: '授权待确认',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注册中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '注册完成',
      status: '1',
      timeList: [],
    },
  ],
  // 海牙认证 (海牙认证)
  13: [
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待审核',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待授权',
      status: '1',
      timeList: [],
    },
    {
      progressName: '海牙认证中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '认证完成',
      status: '1',
      timeList: [],
    },
  ],
  // 其他服务（极简工单）
  20: [
    {
      progressName: '待处理',
      status: '1',
      timeList: [],
    },
    {
      progressName: '待上传资料',
      status: '1',
      timeList: [],
    },
    {
      progressName: '处理中',
      status: '1',
      timeList: [],
    },
    {
      progressName: '处理完成',
      status: '1',
      timeList: [],
    },
  ],
};

// export const itemCodeList = {
//   TOBE_SUBMITTED: '待提交资料',
//   TOBE_AUTHORIZED: '待授权',
//   TOBE_MATERIALS_REJECT: '资料被驳回',
//   TOBE_EPR_REG_PAY: 'EPR注册待缴费',
//   TOBE_DECLARED: '待提交申报',
//   TOBE_DECLARED_REJECT: '申报被驳回',
//   TOBE_TAXES: '待缴纳税金',
// };

export const itemCodeList = {
  TOBE_SUBMITTED: {
    TOBE_SUBMITTED: '待提交资料',
    TOBE_AUTHORIZED: '待授权',
  },
  TOBE_MATERIALS_REJECT: {
    TOBE_SUBMITTED: '资料驳回',
    TOBE_AUTHORIZED: '授权驳回',
  },
  TOBE_EPR_REG_PAY: {
    TOBE_EPR_REG_PAY: '缴纳回收费',
  },
  TOBE_DECLARED: {
    TOBE_DECLARED: '待提交申报',
  },
  TOBE_TAXES: {
    TOBE_TAXES: '缴纳税金',
    TOBE_EPR_REG_PAY: '缴纳回收费',
  },
  TOBE_DECLARED_REJECT: {
    TOBE_DECLARED_REJECT: '申报驳回',
    TOBE_TAXES_REJECT: '缴税驳回',
  },
};
