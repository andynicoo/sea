export const functionCodeList = [
  { label: '税号注册', type: 1, value: [5, 23] },
  { label: '税号转代理', type: 2, value: [2] },
  { label: '海牙认证', type: 3, value: [13] },
  { label: '税号注销', type: 4, value: [6] },
  { label: '税务申报', type: 5, value: [2, 5, 23] },
  { label: 'VAT退税', type: 6, value: [24] },
  { label: '税务稽查', type: 7, value: [7] },
  { label: '授权代表', type: 8, value: [16] },
  { label: '英代欧代备案', type: 9, value: [1] },
  { label: 'EPR注册', type: 10, value: [31] },
];

/** 工单下拉列表 */
export const supplyFunCodes = [
  // VAT服务
  {
    label: 'vat服务',
    value: 0,
    children: [
      { label: '税号注册', type: 1, value: 5 },
      { label: '税务转代理', type: 2, value: 2 },
      { label: '海牙认证', type: 9, value: 13 },
      { label: '税号注销', type: 4, value: 6 },
      { label: '税务稽查', type: 6, value: 7 },
      { label: 'VAT退税', type: 3, value: 24 },
      { label: 'vat申报', type: 0, value: 1 },
    ],
  },
  {
    label: '知识产权服务',
    value: 1,
    children: [
      // 知识产权
      { label: '国际商标注册', type: 7, value: 61 },
      { label: '外观专利', type: 0, value: 100 },
      // { label: "OA审查意见", type: 8, value: 61 },
    ],
  },
  {
    label: '合规服务',
    value: 2,
    children: [{ label: '授权代表', type: 10, value: 16 }],
  },
  {
    label: 'EPR服务',
    value: 5,
    children: [{ label: 'EPR注册', type: 5, value: 31 }],
  },
];

/**工单监控区间 */
export const monitorEnum = [
  { id: 5, section: '注册中 - 注册完成' }, //注册税号
  { id: 2, section: '转代理中 - 转代理完成' }, //税务转代理
  { id: 24, section: '退税中 - 退税完成' }, //海牙认证
  { id: 6, section: '注销中 - 已完成' }, //税号注销
  { id: 31, section: '注册中 - 注册完成' }, //ERP注册
  { id: 7, section: '处理中 - 已完成' }, //税务稽查
  { id: 61, section: '律师审核 - 审核期' }, //国际商标注册
  { id: 13, section: '海牙认证 - 海牙认证完成' }, //海牙认证
  { id: 16, section: '已审核 - 待授权' }, //授权代表
  { id: 1, section: '待上传回执 - 申报完成' }, //vat申报
  { id: 100, section: '下载资料 - 上传专利证书' }, //外观专利
];

/**工单监控区间 */
export const monitorTypeEnum = [
  { id: 5, section: '注册税号' }, //注册税号
  { id: 2, section: '税务转代理' }, //税务转代理
  { id: 24, section: 'vat退税' }, //海牙认证
  { id: 6, section: '税号注销' }, //税号注销
  { id: 31, section: 'ERP注册' }, //ERP注册
  { id: 7, section: '税务稽查' }, //税务稽查
  { id: 61, section: '国际商标注册' }, //国际商标注册
  { id: 13, section: '海牙认证' }, //海牙认证
  { id: 16, section: '授权代表' }, //授权代表
  { id: 1, section: 'vat申报' }, //vat申报
  { id: 100, section: '外观专利' }, //外观专利
];

export const prescriptionDateList = [
  { label: '天', type: 'DAY', value: 1 },
  // { label: '周', type: 'WEEK', value: 2 },
  // { label: '月', type: 'MONTH', value: 3 },
];

/**过滤国家列表 */
export const countryArr = [
  'GB',
  'DE',
  'ES',
  'FR',
  'IT',
  'PL',
  'CZ',
  'SA',
  'FI',
  'HR',
  'HU',
  'IE',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
  'EE',
  'BG',
  'DK',
  'BE',
  'AT',
  'CY',
  'GR',
  'EL',
  'CN',
  'HK',
  'TW',
  'KOR',
  'EU',
  'JP',
  'US',
  'MC',
  'IM',
  'AE',
  'AU',
  'MYS',
  'MX',
  'CHL',
  'WIPO',
  'BRA',
  'CHE',
  'RUS',
  'MAR',
  'CA',
  'SG',
  'NZ',
  'ID',
  'IN',
  'VNM',
  'AZ',
  'KH',
  'LA',
  'MM',
  'MO',
  'PH',
  'TH',
];
