export const COUNTRY = [
  { key: 'SG', lang: 'ENG', currency: 'SGD', langName: '英语' },
  { key: 'PH', lang: 'TL', currency: 'PHP', langName: '菲律宾语' },
  { key: 'MY', lang: 'MS', currency: 'MYR', langName: '马来语' },
  { key: 'ID', lang: 'ID', currency: 'IDR', langName: '印尼语' },
  { key: 'TH', lang: 'TH', currency: 'TH', langName: '泰语' },
  { key: 'VN', lang: 'VIN', currency: 'VND', langName: '越南语' },
  { key: 'BR', lang: 'PTB', currency: 'BRL', langName: '巴西语' },
  { key: 'TW', lang: 'CHT', currency: 'TWD', langName: '台湾繁体' },
  { key: 'MX', lang: 'ENG', currency: 'MXN', langName: '墨西哥' }
]
// export const COUNTRY = [
//     { key: 'SG', lang: 'EN', currency: 'SGD', langName: '英语' },
//     { key: 'PH', lang: 'PH', currency: 'PHP', langName: '菲律宾语' },
//     { key: 'MY', lang: 'MY', currency: 'MYR', langName: '马来语' },
//     { key: 'ID', lang: 'ID', currency: 'IDR', langName: '印尼语' },
//     { key: 'TH', lang: 'TH', currency: 'THB', langName: '泰语' },
//     { key: 'VN', lang: 'VN', currency: 'VND', langName: '越南语' },
//     { key: 'BR', lang: 'BR', currency: 'BRL', langName: '巴西语' },
//     { key: 'TW', lang: 'TW', currency: 'TWD', langName: '台湾繁体' },
//     { key: 'MX', lang: 'MX', currency: 'MXN', langName: '墨西哥' }
//   ]

/**
 * 采集站点配置需要注意的点
 * @param: conditionOpts 用于平台采集时支持的筛选条件，text为多语言字段
 * @param: pfs 用于平台采集子站点选项  name为 主站点 ｜(分隔符) 子站点多语言字段
 * @param: disableIndex 在第几个tab不显示
 */

export const COLLECT_SITE = [
  {
    isSelect: false,
    displayName: 'goodsCollection.tb',
    icon: 'icon_TB',
    pfs: null,
    platCode: 'TB',
    value: 0,
    url: 'https://www.taobao.com/',
    disableIndex: [2, 3],
    conditionOpts: [
      { value: 1, text: 'goodsCollection.sort1' },
      { value: 2, text: 'goodsCollection.sort2' },
      { value: 3, text: 'goodsCollection.sort3' },
      { value: 4, text: 'goodsCollection.sort4' },
      { value: 5, text: 'goodsCollection.sort5' }
    ], //查询条件
    initialImg: require('@/assets/images/shops-logo/initial-icon_TB.png'),
    selectImg: require('@/assets/images/shops-logo/select-icon_TB.png')
  },
  {
    isSelect: false,
    displayName: 'goodsCollection.tm',
    icon: 'icon_TM',
    pfs: null,
    platCode: 'TM',
    value: 1,
    url: 'https://www.tmall.com/',
    disableIndex: [2, 3],
    conditionOpts: [
      { value: 1, text: 'goodsCollection.sort1' },
      { value: 2, text: 'goodsCollection.sort2' },
      { value: 3, text: 'goodsCollection.sort3' },
      { value: 4, text: 'goodsCollection.sort4' },
      { value: 5, text: 'goodsCollection.sort5' }
    ], //查询条件
    initialImg: require('@/assets/images/shops-logo/initial-icon_TM.png'),
    selectImg: require('@/assets/images/shops-logo/select-icon_TM.png')
  },
  //   {
  //     isSelect: false,
  //     displayName: 'goodsCollection.smt',
  //     icon: 'icon_SMT',
  //     pfs: null,
  //     platCode: 'SMT',
  //     value: 2,
  //     url: 'https://www.aliexpress.com/',
  //     conditionOpts: [
  //       { value: 1, text: 'goodsCollection.sort1' },
  //       { value: 2, text: 'goodsCollection.sort2' },
  //       { value: 3, text: 'goodsCollection.sort3' },
  //       { value: 4, text: 'goodsCollection.sort4' },
  //       { value: 5, text: 'goodsCollection.sort5' }
  //     ], //查询条件
  //     initialImg: require('@/assets/images/shops-logo/initial-icon_SMT.png'),
  //     selectImg: require('@/assets/images/shops-logo/select-icon_SMT.png')
  //   },
  // {
  //   isSelect: false,
  //   displayName: 'Lazada',
  //   icon: 'icon_LAZADA',
  //   pfs: [
  //     {
  //       displayName: 'goodsCollection.ydnxy',
  //       name: `Lazada|goodsCollection.ydnxy`,
  //       url: 'https://www.lazada.co.id/',
  //       platCode: 'LAZADA_ID',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.xjp',
  //       name: `Lazada|goodsCollection.xjp`,
  //       url: 'https://www.lazada.sg/',
  //       platCode: 'LAZADA_SG',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.mlxy',
  //       name: `Lazada|goodsCollection.mlxy`,
  //       url: 'https://www.lazada.com.my/',
  //       platCode: 'LAZADA_MY',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yn',
  //       name: `Lazada|goodsCollection.yn`,
  //       url: 'https://www.lazada.vn/',
  //       platCode: 'LAZADA_VN',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.tg',
  //       name: `Lazada|goodsCollection.tg`,
  //       url: 'https://www.lazada.co.th/',
  //       platCode: 'LAZADA_TH',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.flb',
  //       name: `Lazada|goodsCollection.flb`,
  //       url: 'https://www.lazada.com.ph/',
  //       platCode: 'LAZADA_PH',
  //       isSelect: false
  //     }
  //   ],
  //   value: 3,
  //   url: 'https://www.lazada.com/en/',
  //   platCode: 'LAZADA',
  //   conditionOpts: [
  //     { value: 1, text: 'goodsCollection.sort1' },
  //     { value: 4, text: 'goodsCollection.sort4' },
  //     { value: 5, text: 'goodsCollection.sort5' }
  //   ], //查询条件
  //   initialImg: require('@/assets/images/shops-logo/initial-icon_LAZADA.png'),
  //   selectImg: require('@/assets/images/shops-logo/select-icon_LAZADA.png')
  // },
  //   {
  //     isSelect: false,
  //     displayName: 'goodsCollection.sp',
  //     icon: 'icon_SHOPEE',
  //     pfs: [
  //       {
  //         displayName: 'goodsCollection.ydnxy',
  //         name: `Shopee|goodsCollection.ydnxy`,
  //         url: 'https://id.xiapibuy.com/',
  //         platCode: 'SHOPEE_ID',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.xjp',
  //         name: `Shopee|goodsCollection.xjp`,
  //         url: 'https://sg.xiapibuy.com/',
  //         platCode: 'SHOPEE_SG',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.mlxy',
  //         name: `Shopee|goodsCollection.mlxy`,
  //         url: 'https://my.xiapibuy.com/',
  //         platCode: 'SHOPEE_MY',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.yn',
  //         name: `Shopee|goodsCollection.yn`,
  //         url: 'https://vn.xiapibuy.com/',
  //         platCode: 'SHOPEE_VN',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.tg',
  //         name: `Shopee|goodsCollection.tg`,
  //         url: 'https://th.xiapibuy.com/',
  //         platCode: 'SHOPEE_TH',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.flb',
  //         name: `Shopee|goodsCollection.flb`,
  //         url: 'https://ph.xiapibuy.com/',
  //         platCode: 'SHOPEE_PH',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.tw',
  //         name: `Shopee|goodsCollection.tw`,
  //         url: 'https://xiapi.xiapibuy.com/',
  //         platCode: 'SHOPEE_TW',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.bx',
  //         name: `Shopee|goodsCollection.bx`,
  //         url: 'https://br.xiapibuy.com/',
  //         platCode: 'SHOPEE_BR',
  //         isSelect: false
  //       }
  //     ],
  //     platCode: 'SHOPEE',
  //     value: 4,
  //     url: 'https://shopee.com/index.html',
  //     conditionOpts: [
  //       { value: 1, text: 'goodsCollection.sort1' },
  //       { value: 2, text: 'goodsCollection.sort2' },
  //       { value: 3, text: 'goodsCollection.sort3' },
  //       { value: 4, text: 'goodsCollection.sort4' },
  //       { value: 5, text: 'goodsCollection.sort5' }
  //     ], //查询条件
  //     initialImg: require('@/assets/images/shops-logo/initial-icon_SHOPEE.png'),
  //     selectImg: require('@/assets/images/shops-logo/select-icon_SHOPEE.png')
  //   },
  {
    isSelect: false,
    displayName: '1688',
    icon: 'icon_ALBB',
    pfs: null,
    platCode: 'ALBB',
    value: 5,
    url: 'https://www.1688.com/',
    conditionOpts: [
      { value: 1, text: 'goodsCollection.sort1' },
      { value: 3, text: 'goodsCollection.sort3' },
      { value: 4, text: 'goodsCollection.sort4' },
      { value: 5, text: 'goodsCollection.sort5' }
    ], //查询条件
    initialImg: require('@/assets/images/shops-logo/initial-icon_ALBB.png'),
    selectImg: require('@/assets/images/shops-logo/select-icon_ALBB.png')
  },
  {
    isSelect: false,
    displayName: 'goodsCollection.pdd',
    icon: 'icon_PDD',
    pfs: null,
    platCode: 'PDD',
    value: 6,
    url: 'https://mobile.yangkeduo.com/',
    disableIndex: [2, 3],
    conditionOpts: [
      { value: 1, text: 'goodsCollection.sort1' },
      { value: 2, text: 'goodsCollection.sort2' },
      { value: 3, text: 'goodsCollection.sort3' },
      { value: 4, text: 'goodsCollection.sort4' },
      { value: 5, text: 'goodsCollection.sort5' }
    ], //查询条件
    initialImg: require('@/assets/images/shops-logo/initial-icon_PDD.png'),
    selectImg: require('@/assets/images/shops-logo/select-icon_PDD.png')
  }
  //   {
  //     isSelect: false,
  //     displayName: 'goodsCollection.dhgate',
  //     icon: 'icon_DHGATE',
  //     pfs: null,
  //     platCode: 'DHGATE',
  //     value: 7,
  //     url: 'https://www.dhgate.com/',
  //     conditionOpts: [
  //       { value: 1, text: 'goodsCollection.sort1' },
  //       { value: 2, text: 'goodsCollection.sort2' },
  //       { value: 3, text: 'goodsCollection.sort3' },
  //       { value: 4, text: 'goodsCollection.sort4' },
  //       { value: 5, text: 'goodsCollection.sort5' },
  //       { value: 8, text: 'goodsCollection.sort8' }
  //     ], //查询条件
  //     initialImg: require('@/assets/images/shops-logo/initial-icon_DHGATE.png'),
  //     selectImg: require('@/assets/images/shops-logo/select-icon_DHGATE.png')
  //   },
  // {
  //   isSelect: false,
  //   displayName: 'goodsCollection.souxie',
  //   icon: 'icon_SOUXIE',
  //   pfs: null,
  //   platCode: 'SOOXIE',
  //   value: 8,
  //   url: 'https://sooxie.com/',
  //   conditionOpts: [
  //     { value: 1, text: 'goodsCollection.sort1' },
  //     { value: 2, text: 'goodsCollection.sort2' },
  //     { value: 3, text: 'goodsCollection.sort3' },
  //     { value: 4, text: 'goodsCollection.sort4' },
  //     { value: 5, text: 'goodsCollection.sort5' }
  //   ], //查询条件
  //   initialImg: require('@/assets/images/shops-logo/initial-icon_SOUXIE.png'),
  //   selectImg: require('@/assets/images/shops-logo/select-icon_SOUXIE.png')
  // },
  // {
  //   isSelect: false,
  //   displayName: 'goodsCollection.yiwugo',
  //   icon: 'icon_YIWUGO',
  //   pfs: null,
  //   platCode: 'YIWUGO',
  //   value: 7,
  //   url: 'https://www.yiwugo.com/index.html',
  //   conditionOpts: [
  //     { value: 1, text: 'goodsCollection.sort1' },
  //     { value: 3, text: 'goodsCollection.sort3' },
  //     { value: 4, text: 'goodsCollection.sort4' },
  //     { value: 5, text: 'goodsCollection.sort5' }
  //   ], //查询条件
  //   initialImg: require('@/assets/images/shops-logo/initial-icon_YIWUGO.png'),
  //   selectImg: require('@/assets/images/shops-logo/select-icon_YIWUGO.png')
  // },
  // {
  //   isSelect: false,
  //   displayName: 'goodsCollection.yiqiwang',
  //   icon: 'icon_17WANG',
  //   pfs: [
  //     {
  //       displayName: 'goodsCollection.yiqiwanggz',
  //       name: `17网|goodsCollection.yiqiwanggz`,
  //       url: 'https://gz.17zwd.com/',
  //       platCode: '17ZWD_GZ',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwangcs',
  //       name: `17网|goodsCollection.yiqiwangcs`,
  //       url: 'https://cs.17zwd.com/',
  //       platCode: '17ZWD_CS',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwangxt',
  //       name: `17网|goodsCollection.yiqiwangxt`,
  //       url: 'https://xt.17zwd.com/',
  //       platCode: '17ZWD_XT',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwangbg',
  //       name: `17网|goodsCollection.yiqiwangbg`,
  //       url: 'https://baigou.17zwd.com/',
  //       platCode: '17ZWD_BG',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwanghz',
  //       name: `17网|goodsCollection.yiqiwanghz`,
  //       url: 'https://hz.17zwd.com/',
  //       platCode: '17ZWD_HZ',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwangzz',
  //       name: `17网|goodsCollection.yiqiwangzz`,
  //       url: 'https://zz.17zwd.com/',
  //       platCode: '17ZWD_ZZ',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwanghld',
  //       name: `17网|goodsCollection.yiqiwanghld`,
  //       url: 'https://hld.17zwd.com/',
  //       platCode: '17ZWD_HLD',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwanghd',
  //       name: `17网|goodsCollection.yiqiwanghd`,
  //       url: 'https://huadu.17zwd.com/',
  //       platCode: '17ZWD_HD',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwangjy',
  //       name: `17网|goodsCollection.yiqiwangjy`,
  //       url: 'https://jy.17zwd.com/',
  //       platCode: '17ZWD_JY',
  //       isSelect: false
  //     },
  //     {
  //       displayName: 'goodsCollection.yiqiwangcd',
  //       name: `17网|goodsCollection.yiqiwangcd`,
  //       url: 'https://cd.17zwd.com/',
  //       platCode: '17ZWD_CD',
  //       isSelect: false
  //     }
  //   ],
  //   platCode: '17ZWD',
  //   value: 8,
  //   url: 'https://gz.17zwd.com/',
  //   conditionOpts: [
  //     { value: 1, text: 'goodsCollection.sort1' },
  //     { value: 2, text: 'goodsCollection.sort2' },
  //     { value: 4, text: 'goodsCollection.sort4' },
  //     { value: 5, text: 'goodsCollection.sort5' }
  //   ], //查询条件
  //   initialImg: require('@/assets/images/shops-logo/initial-icon_17WANG.png'),
  //   selectImg: require('@/assets/images/shops-logo/select-icon_17WANG.png')
  // }
  //   {
  //     isSelect: false,
  //     displayName: 'goodsCollection.sijixingzuo',
  //     icon: 'icon_SIJIXINGZUO',
  //     pfs: [
  //       {
  //         displayName: 'goodsCollection.sijixingzuohz',
  //         name: `四季星座|goodsCollection.sijixingzuohz`,
  //         url: 'https://hz.571xz.com/',
  //         platCode: '571XZ_HZ',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.sijixingzuocs',
  //         name: `四季星座|goodsCollection.sijixingzuocs`,
  //         url: 'https://cs.571xz.com/',
  //         platCode: '571XZ_CS',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.sijixingzuoqz',
  //         name: `四季星座|goodsCollection.sijixingzuoqz`,
  //         url: 'https://qz.571xz.com/',
  //         platCode: '571XZ_QZ',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.sijixingzuocz',
  //         name: `四季星座|goodsCollection.sijixingzuocz`,
  //         url: 'https://cz.571xz.com/',
  //         platCode: '571XZ_CZ',
  //         isSelect: false
  //       },
  //       {
  //         displayName: 'goodsCollection.sijixingzuoss',
  //         name: `四季星座|goodsCollection.sijixingzuoss`,
  //         url: 'https://ss.571xz.com/',
  //         platCode: '571XZ_SS',
  //         isSelect: false
  //       }
  //     ],
  //     platCode: '571XZ',
  //     value: 9,
  //     url: 'https://www.571xz.com/',
  //     conditionOpts: [
  //       { value: 1, text: 'goodsCollection.sort1' },
  //       { value: 2, text: 'goodsCollection.sort2' },
  //       { value: 3, text: 'goodsCollection.sort3' },
  //       { value: 4, text: 'goodsCollection.sort4' },
  //       { value: 5, text: 'goodsCollection.sort5' }
  //     ], //查询条件
  //     initialImg: require('@/assets/images/shops-logo/initial-icon_SIJI.png'),
  //     selectImg: require('@/assets/images/shops-logo/select-icon_SIJI.png')
  //   },
  // {
  //   isSelect: false,
  //   displayName: 'goodsCollection.mogujie',
  //   icon: 'icon_MOGU',
  //   pfs: null,
  //   platCode: 'MOGU',
  //   value: 10,
  //   url: 'https://www.mogu.com/',
  //   conditionOpts: [
  //     { value: 1, text: 'goodsCollection.sort1' },
  //     { value: 2, text: 'goodsCollection.sort2' },
  //     { value: 3, text: 'goodsCollection.sort3' }
  //   ], //查询条件
  //   initialImg: require('@/assets/images/shops-logo/initial-icon_MOGU.png'),
  //   selectImg: require('@/assets/images/shops-logo/select-icon_MOGU.png')
  // },
  // {
  //   isSelect: false,
  //   displayName: 'goodsCollection.hqhp',
  //   icon: 'icon_HQHP',
  //   pfs: null,
  //   platCode: 'HQHP',
  //   value: 10,
  //   url: 'https://www.chinabrands.cn/',
  //   disableIndex: [2],
  //   conditionOpts: [
  //     { value: 1, text: 'goodsCollection.sort1' },
  //     { value: 2, text: 'goodsCollection.sort2' },
  //     { value: 3, text: 'goodsCollection.sort3' },
  //     { value: 4, text: 'goodsCollection.sort4' },
  //     { value: 5, text: 'goodsCollection.sort5' }
  //   ], //查询条件
  //   initialImg: require('@/assets/images/shops-logo/initial-icon_HQHP.png'),
  //   selectImg: require('@/assets/images/shops-logo/select-icon_HQHP.png')
  // },
  //   {
  //     isSelect: false,
  //     displayName: 'goodsCollection.k3',
  //     icon: 'icon_K3',
  //     pfs: null,
  //     platCode: 'KS',
  //     value: 10,
  //     url: 'http://www.k3.cn/',
  //     conditionOpts: [
  //       { value: 1, text: 'goodsCollection.sort1' },
  //       { value: 2, text: 'goodsCollection.sort2' },
  //       { value: 3, text: 'goodsCollection.sort3' },
  //       { value: 4, text: 'goodsCollection.sort4' },
  //       { value: 5, text: 'goodsCollection.sort5' }
  //     ], //查询条件
  //     initialImg: require('@/assets/images/shops-logo/initial-icon_K3.png'),
  //     selectImg: require('@/assets/images/shops-logo/select-icon_K3.png')
  //   },
  // {
  //   isSelect: false,
  //   displayName: 'goodsCollection.bnn',
  //   icon: 'icon_gnn',
  //   pfs: null,
  //   platCode: 'BNN',
  //   value: 10,
  //   url: 'http://www.bao66.cn/',
  //   conditionOpts: [
  //     { value: 1, text: 'goodsCollection.sort1' },
  //     { value: 2, text: 'goodsCollection.sort2' },
  //     { value: 3, text: 'goodsCollection.sort3' },
  //     { value: 4, text: 'goodsCollection.sort4' },
  //     { value: 5, text: 'goodsCollection.sort5' }
  //   ], //查询条件
  //   initialImg: require('@/assets/images/shops-logo/initial-icon_bnn.png'),
  //   selectImg: require('@/assets/images/shops-logo/select-icon_bnn.png')
  // },
  //   {
  //     isSelect: false,
  //     displayName: 'goodsCollection.algj',
  //     icon: 'icon_algj',
  //     pfs: null,
  //     platCode: 'ALGJ',
  //     value: 10,
  //     url: 'https://www.alibaba.com/',
  //     conditionOpts: [], //查询条件
  //     initialImg: require('@/assets/images/shops-logo/initial-icon_algj.png'),
  //     selectImg: require('@/assets/images/shops-logo/select-icon_algj.png')
  //   }
]
