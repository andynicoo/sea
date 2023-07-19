console.log(process.env.NODE_ENV);
let homePageUrl = '';
let baseUrl = '';
let serverUrl = '';
let shareUrl = '';
switch (process.env.NODE_ENV) {
  case 'production':
    homePageUrl = 'https://www.iipto.com/'; // production
    baseUrl = 'https://pro.iipto.com/api';
    serverUrl = 'https://sc-rec.gstarsea.com/sa?project=production';
    shareUrl = 'https://m.iipto.com/';
    // wgUrl='https://www.chenhaiip.com/client/'
    wgUrl = 'https://chenhaiip.itaxs.com/client/';
    if (process.env.NODE_PLA === 'wg') {
      homePageUrl = 'https://chenhaiip.itaxs.com/'; // production
      baseUrl = 'https://chenhaiip.itaxs.com/api';
      serverUrl = 'https://sc-rec.gstarsea.com/sa?project=production';
      shareUrl = 'https://m.iipto.com/';
    }
    break;
  case 'uatenvironment':
    homePageUrl = 'http://uat2.iipto.com/'; // uatenvironment
    baseUrl = 'https://uat2-xcloud-console.itaxs.com';
    serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
    shareUrl = 'https://uat-xcloud-iipto-h5.itaxs.com/';
    wgUrl = 'https://uat-patent.itaxs.com/client/';
    if (process.env.NODE_PLA === 'wg') {
      homePageUrl = 'https://uat-patent.itaxs.com/'; // uatenvironment
      baseUrl = 'https://uat-patent.itaxs.com/api';
      serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
      shareUrl = 'https://m.iipto.com/';
    }
    break;
  case 'uatenvironment2':
    homePageUrl = 'http://uat2.iipto.com/'; // uatenvironment2
    baseUrl = 'https://uat2-console.itaxs.com/api';
    serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
    shareUrl = 'https://uat-xcloud-iipto-h5.itaxs.com/';
    wgUrl = 'https://uat2-patent.itaxs.com/client/';
    if (process.env.NODE_PLA === 'wg') {
      homePageUrl = 'https://uat2-patent.itaxs.com/'; // uatenvironment
      baseUrl = 'https://uat2-console.itaxs.com/api';
      serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
      shareUrl = 'https://m.iipto.com/';
    }
    break;
  case 'testing':
    homePageUrl = 'http://sit.iipto.com/'; // testing
    baseUrl = 'https://sit2-xcloud-console.itaxs.com/api';
    serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
    shareUrl = 'https://sit-xcloud-iipto-h5.itaxs.com';
    wgUrl = 'https://sit-patent.itaxs.com/client/';
    if (process.env.NODE_PLA === 'wg') {
      homePageUrl = 'https://sit-patent.itaxs.com/'; // testing
      baseUrl = 'https://sit.iipto.com/api';
      serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
      shareUrl = 'https://m.iipto.com/';
    }
    break;
  case 'testing2':
    homePageUrl = 'https://sit2.iipto.com/'; // testing
    baseUrl = 'https://sit2-xcloud-console.itaxs.com/api';
    serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
    shareUrl = 'https://sit2-xcloud-iipto-h5.itaxs.com';
    wgUrl = 'https://sit2-patent.itaxs.com/client/';
    if (process.env.NODE_PLA === 'wg') {
      homePageUrl = 'https://sit2-patent.itaxs.com/'; // testing
      baseUrl = 'https://sit2-xcloud-console.itaxs.com/api';
      serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
      shareUrl = 'https://m.iipto.com/';
    }
    break;
  case 'development':
    homePageUrl = 'https://develop-xcloud-iipto-seo.itaxs.com/'; // development
    baseUrl = 'https://sit2-xcloud-console.itaxs.com/api';
    // beseUrl='192.168.32.59:8080'
    serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
    shareUrl = 'https://develop-xcloud-iipto-h5.itaxs.com';
    wgUrl = 'https://dev-patent.itaxs.com/client/';
    if (process.env.NODE_PLA === 'wg') {
      homePageUrl = 'https://sit-patent.itaxs.com/'; // development
      baseUrl = 'https://develop.iipto.com/api';
      serverUrl = 'https://sc-rec.gstarsea.com/sa?project=default';
      shareUrl = 'https://m.iipto.com/';
    }
    break;
}
// 活动时间
const activeTempTimes = {
  start: '2022/09/6 9:00:00',
  end: '2022/09/8 23:59:59',
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
module.exports = {
  /**
   *  api请求基础路径
   */
  apiUrl: {
    // dev: "https://pre-api.itaxs.com", //  本地环境接口请求n地址
    dev: 'https://dev-xcloud-api.itaxs.com', //  本地环境接口请求n地址
    // pro: "https://pre-api.itaxs.com", //  预发布打包请求地址
    // test环境
    pro: 'https://uat-xcloud-iipto.itaxs.com/api', //  测试接口请求地址
    server_url: serverUrl,
    shareUrl: shareUrl, // h5地址预发布
    homePageUrl: homePageUrl, // 首页地址
    wgUrl: wgUrl, // 外观首页地址
    baseUrl: baseUrl,
    // sim环境
    // pro:"https://sim-xcloud-api.itaxs.com" ,
    // shareUrl: "https://sim-xcloud-iipto-h5.itaxs.com/", //sim环境
    // homePageUrl: "https://sim-xcloud-iipto-seo.itaxs.com/" //预发布首页地址

    // 线上环境！！！
    // pro: 'https://api.iipto.com', //  生产环境打包请求地址
    // shareUrl: 'https://m.iipto.com/',//H5地址线上
    // homePageUrl: 'https://www.iipto.com/', //线上首页地址
    // server_url: "https://sc-rec.gstarsea.com/sa?project=production",
  },
  /**
   * 设置全局活动时间
   */
  activeTempTimes: {
    start: activeTempTimes.start,
    end: activeTempTimes.end,
    isTrue: activeRange(),
  },
  enterpriseCode: {
    dev: 'pn4pn456jy1', // 本地环境
    pro: 'pn4pn456jy1', // 测试环境
  },
};
