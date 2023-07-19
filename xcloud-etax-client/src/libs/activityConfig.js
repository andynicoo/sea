const ACTIVITY_TYPE = [
  {
    value: 'ZERO_BUY',
    label: '零元购',
  },
  {
    value: 'LOW_PRICE_SPIKE',
    label: '爆款低价秒杀区',
  },
  {
    value: 'LIMIT_TIME_DISCOUNT',
    label: '限时折扣商品区',
  },
  {
    value: 'COMPLIANCE_SECOND_KILL',
    label: '合规秒杀区',
  },
  {
    value: 'NEW_USER',
    label: '优惠券',
  },
  {
    value: 'WEBSITE_SECOND_KILL',
    label: '官网限时秒杀',
  },
];
const ACTIVITY_LIST = [
  {
    top: '',
    label: '中秋活动',
    type: 'midAutumn',
    typeData: {
      LOW_PRICE_SPIKE: {
        label: 'lowList',
        title: '爆款低价',
        isRow: false,
      },
      LIMIT_TIME_DISCOUNT: {
        label: 'limitList',
        title: '限时折扣',
        isRow: false,
      },
    },
    bg: {
      banner_big: require('@/assets/images/activity/mid-autumn/banner-big.png'),
      banner_slide: require('@/assets/images/activity/mid-autumn/banner-slide.png'),
      color: '#FEE7D6',
    },
    rules: [
      '活动时间：2022年9月5日9：00-2022年9月10日24：00',
      '参与用户：跨税云平台所有注册用户',
      '由于商品属性，所有秒杀商品不退不换',
      '如发现有违规行为（如恶意刷单获取秒杀商品等违反活动公平性问题），跨税云活动组织方将取消相关订单，订单金额概不退还',
      '活动最终解释权归跨税云（深圳）科技有限公司所有',
    ],
  },
  {
    top: '586px',
    label: '国庆活动',
    type: 'nationalDay',
    typeData: {
      LOW_PRICE_SPIKE: {
        label: 'lowList',
        title: '爆款低价',
        isRow: false,
      },
      LIMIT_TIME_DISCOUNT: {
        label: 'limitList',
        title: '限时折扣',
        isRow: false,
      },
    },
    bg: {
      banner_big: require('@/assets/images/activity/national-day/banner-big.png'),
      banner_slide: require('@/assets/images/activity/national-day/banner-slide.png'),
      color: '#FBB06C',
    },
    rules: [
      '秒杀时间：2022年9月15日9:00-2022年9月30日24:00',
      '参与用户：跨税云平台所有注册用户',
      '由于商品属性，所有秒杀商品不退不换',
      '如发现有违规行为（如恶意刷单获取秒杀商品等违反活动公平性问题），跨税云活动组织方将取消相关订单，金额概不退还',
      '活动最终解释权归跨税云（深圳）科技有限公司所有',
    ],
  },
  {
    top: '670px',
    label: '双11活动',
    type: 'doubleEle',
    typeData: {
      LOW_PRICE_SPIKE: {
        label: 'lowList',
        title: '爆款低价',
        isRow: false,
      },
      LIMIT_TIME_DISCOUNT: {
        label: 'limitList',
        title: '限时折扣',
        isRow: false,
      },
      WEBSITE_SECOND_KILL: {
        label: 'websiteList',
        title: '官网限时秒杀',
        isRow: false
      }
    },
    bg: {
      banner_big: require('@/assets/images/activity/double-ele/banner-big.svg'),
      banner_slide: require('@/assets/images/activity/double-ele/banner-slide.svg'),
      color: '#C9B0FF',
    },
    rules: [
      '活动时间：2022年10月31日9:00~2022年11月30日24:00',
      '参与用户：跨税云所有已注册用户',
      '跨税云官网活动页面或跨税云小程序限时秒杀板块可根据时间段下单秒杀商品',
      '2022年10月31日9:00~2022年11月30日24:00期间进入跨税云小程序每天可获得1次无门槛抽奖机会，下单商品付款成功可再次获得抽奖机会，多次付款得多次抽奖机会',
      '秒杀商品支付成功则代表秒杀成功，商品数量有限先到先得',
      '如被发现有违规行为（如恶意刷订单获取秒杀商品等违反活动公平性的问题），跨税云将取消相关秒杀订单与奖品',
      '由于商品属性，所有商品不退不换',
      '最终解释权归跨税云（深圳）科技有限公司所有',
    ],
  },
  {
    top: '38.54vw',
    label: '双12活动',
    type: 'double12',
    typeData: {
      LOW_PRICE_SPIKE: {
        label: 'lowList',
        title: '爆款低价',
        isRow: false,
      },
      'LIMIT_TIME_DISCOUNT': {
        label: 'limitList',
        title: '限时折扣',
        isRow: false,
      },
      WEBSITE_SECOND_KILL: {
        label: 'websiteList',
        title: '官网限时秒杀',
        isRow: false
      }
    },
    bg: {
      banner_big: require('@/assets/images/activity/double12/banner-big.png'),
      banner_slide: require('@/assets/images/activity/double12/banner-slide.png'),
      color: '#D2C3FE',
    },
    rules: [
      '活动时间：2022年12月每周一上午10点至周二24点',
      '参与用户：跨税云所有已注册用户',
      '跨税云官网活动页面或跨税云小程序限时秒杀板块可根据时间段下单秒杀商品',
      '秒杀商品支付成功后则代表秒杀成功，商品数量有限先到先得',
      '如被发现有违规行为（如恶意刷订单获取秒杀商品等违反活动公平性的问题），跨税云将取消相关秒杀订单',
      '由于商品属性，所有商品不退不换',
      '最终解释权归跨税云（深圳）科技有限公司所有',
    ],
  },
  {
    top: '38.54vw',
    label: '315活动',
    type: '315',
    newStyle: true,
    showDay: true,
    typeData: {
      LOW_PRICE_SPIKE: {
        label: 'lowList',
        title: '爆款低价',
        isRow: false,
      },
      'LIMIT_TIME_DISCOUNT': {
        label: 'limitList',
        title: '限时折扣',
        isRow: false,
      },
      COMPLIANCE_SECOND_KILL: {
        label: 'complianceList',
        title: '合规秒杀区',
        isRow: false
      }
    },
    bg: {
      banner_big: [require('@/assets/images/activity/315/big-banner-1.png'), require('@/assets/images/activity/315/big-banner-2.png')],
      banner_slide: require('@/assets/images/activity/315/slide-bg.png'),
      color: '#180159',
    },
    rules: [
      '参与用户：跨税云平台所有注册用户均可参与本次秒杀',
      '所有秒杀商品不与其他优惠活动同享',
      '由于商品属性特殊，秒杀商品付款成功后，或未在商品标注有效期内提交资料的均不退不换',
      '如发现有违反活动规则行为（如恶意刷单获取秒杀商品等违反活动公平性问题），活动组织方将取消相关订单，涉及金额概不退还',
      '活动最终解释权归跨税云（深圳）科技有限公司所有',
    ],
  },
];
function getTitleByType(type) {
  const current = ACTIVITY_TYPE.filter((v) => +v.value === +type)[0];
  return current.label;
}
// 活动时间
const activeTempTimes = {
  start: '2022/09/6 9:00:00',
  end: '2022/09/9 23:59:59',
};
/**
 * 根据活动时间判断是否进行活动
 * @returns {boolean}
 */
const activeRange = () => {
  let now = new Date().getTime();
  let start = new Date(activeTempTimes.start).getTime();
  let end = new Date(activeTempTimes.end).getTime();
  if (now < start || now > end) {
    return false;
  } else {
    return true;
  }
};
export const ACTIVITY = {
  ACTIVITY_LIST,
  getTitleByType,
  /**
   * 设置全局活动时间
   */
  activeTempTimes: {
    start: activeTempTimes.start,
    end: activeTempTimes.end,
    isTrue: activeRange(),
  },
};
