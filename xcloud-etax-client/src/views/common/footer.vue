<template>
  <div class="box">
    <div class="content flex-between">
      <div class="left">
        <img src="../../assets/images/login/logo6.png"
             alt="">
      </div>
      <div class="right">
        <p class="title">合作伙伴</p>
        <div class="links">
          <span v-for="(v,i) in linkList"
                :key="i">
            <a :href="v.link"
               target="_blank"
               v-if="v.type=='fllow'">{{v.name}}</a>
            <a :href="v.link"
               target="_blank"
               v-else
               rel="nofllow">{{v.name}}</a>
          </span>

        </div>
      </div>
    </div>
    <p class="bottomBox">
      <a href="https://ori.itaxs.com/agreement.html"
         target="_blank">《跨税云用户协议》</a>
      <a href="https://ori.itaxs.com/privacy.html"
         target="_blank">《跨税云隐私策略》</a> ICP证:
      <a href="http://beian.miit.gov.cn/">粤ICP备20016192号</a> Copyright @ 2022 跨税云</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      linkList: [
        {
          link: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
          name: '英国税局'
        },
        {
          link: 'https://www.impots.gouv.fr/',
          name: '法国税局'
        },
        {
          // link:'https://www.berlin.de/sen/finanzen/steuern/finanzaemter/neukoelln/',
          link: 'https://www.elster.de/eportal/start',
          name: '德国税局'
        },
        {
          link: 'https://www.agenxiaentrate.gov.it/wps/portal/entrate/home',
          name: '意大利税局'
        },
        {
          link: 'https://www.agenciatributaria.es/',
          name: '西班牙税局'
        },
        {
          link: 'https://www.mazowieckie.kas.gov.pl/',
          name: '波兰税局'
        },
        {
          name: '捷克税局',
          link: 'https://adisepo.mfcr.cz/'
        },
        {
          name: '荷兰税局',
          link: 'https://www.belastingdienst.nl/'
        },
        {
          name: '沙特税局',
          link: 'https://www.gazt.gov.sa/en'
        },
        {
          name: '阿联酋税局',
          link: 'https://www.tax.gov.ae/en/'
        },
        {
          name: '亚马逊',
          link: 'https://gs.amazon.cn/'
        },
        {
          name: 'eBay',
          link: 'https://www.ebay.cn/'
        },
        {
          name: 'Avalara',
          link: 'https://www.avalara.com/'
        },
        {
          name: '雨果网',
          link: 'https://www.cifnews.com/'
        },
        {
          name: 'AMZ123',
          link: 'https://www.amz123.com/'
        },
        {
          link: 'https://www.junglescout.cn/extension/',
          name: '亚马逊选品开发工具',
          type: 'fllow'
        },
        {
          link: ' https://www.mkoo.cn/',
          name: '跨境电商',
          type: 'fllow'
        },
        {
          link: ' http://www.kuajingzhe.cn/',
          name: '跨境者商学院',
          type: 'fllow'
        },
        {
          link: ' http://www.dianshangwin.com/',
          name: '赢商荟',
          type: 'fllow'
        },
        {
          name: 'LianLian Link',
          link: 'https://lianlianlink.com/',
          type: 'fllow'
        },
        {
          name: '广州代理记账',
          link: 'http://www.huiqiaocs.com/',
          type: 'fllow'
        },
        {
          name: '东莞代理记账公司',
          link: 'http://www.dgrx68.com',
          type: 'fllow'
        },
        {
          name: '北京公司注册',
          link: 'http://www.jjcs66.com',
          type: 'fllow'
        },
        {
          name: '上海代理记账',
          link: 'https://www.yccwjt.com/',
          type: 'fllow'
        },
        {
          name: '太原财税公司',
          link: 'http://www.0351caishui.com/',
          type: 'fllow'
        },
        {
          name: '惠州注册公司',
          link: 'http://www.xunyangnet.com/  ',
          type: 'fllow'
        },
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  min-height: 148px;
  background-color: #141b21;
  color: rgba(255, 255, 255, 0.65);
  padding: 15px 0 0px 0;
}
.content {
  height: 185px;
  max-width: 1200px;
  margin: auto;
  text-align: center;
  .left {
    img {
      width: 121px;
      height: 75px;
    }
  }
  .right {
    text-align: left;
    .links {
      width: 814px;
      line-height: 24px;
    }
  }
  .title {
    color: #cccccc;
    font-size: 16px;
    margin-bottom: 35px;
  }
  .links {
    margin-top: 18px;
    padding-bottom: 24px;

    a {
      color: #cccccc;
      font-size: 14px;
      margin-right: 20px;
      color: rgba(255, 255, 255, 0.65);
    }
  }
}
.bottomBox {
  border-top: 1px solid #4c4b4b;
  text-align: center;
  padding: 20px 0px;
  a {
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
