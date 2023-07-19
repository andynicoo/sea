<template>
  <div class="getname">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <!-- 名字偏好 弹窗 -->
    <NamePrefer @showLoading="showLoading" />

    <!-- 商标名调整方式确认 弹窗 -->
    <AdjustStyle />
    <IndexBanner
      :list="bigBanner"
      v-if="bigBanner && bigBanner.length && getModulesStatus('trademarkQuery_banner')"
      :showData="false"
      :height="396"
    />
    <!-- 商标取名 商标名调整 -->
    <div class="center ksy-w1320 searchbox">
      <div class="banner-wrap">
        <div class="banner-title"><img src="~/assets/images/trademark/v230401/title/name.png" alt="" /></div>
        <div class="banner-content">AI智能取名，简单3步，马上取到好名字</div>
        <ul class="banner-text flex flex-c-c">
          <li v-for="(ban, banIndex) in bannerText" :key="banIndex" class="flex flex-c-c">
            <img :src="ban.icon" alt="" />{{ ban.label }}
          </li>
        </ul>
      </div>

      <FreeNameBox />
    </div>
    <div class="flex flex-c-c" style="margin: 60px auto 100px">
      <QuicklyPanel></QuicklyPanel>
    </div>

    <!-- 静态模块 -->
    <div class="trademark-query-slogan-title">为什么选择我们？</div>
    <div class="brandbox center ksy-w1320 flex">
      <BrandBox v-for="item in brandBox" :key="item.title" :item="item" />
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>
<script>
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
import common from "@/apis/common";

export default {
  head() {
    return {
      title: `国际商标取名`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: `${
            process.env.NODE_PLA === "kby"
              ? "美国商标查询,欧盟商标查询,日本商标查询,英国商标查询,"
              : "跨税云,跨税云官网,跨税云平台，跨税云VAT"
          }`,
        },
        {
          hid: "description",
          name: "description",
          content: `${
            process.env.NODE_PLA === "kby"
              ? "国际商标查询就上跨标云,100+美国本土律师,500+资深专业团队,免费商标检索,降低注册驳回风险!报价透明化,快速办理！"
              : "跨税云(itaxs.com)—智能税务平台，直连海外税局。itaxs代表intelligent tax system，连接多家跨境电商平台及多国税务系统，帮助卖家快速注册VAT税号，精准算税，一键申报，打造跨境人自己的VAT系统，助力跨境卖家开拓海外市场，已为50000+卖家提供服务。"
          }`,
        },
      ],
    };
  },
  async asyncData(context) {
    try {
      let [{ data: bigBanner }, { data: navList }, { data: footerList }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "Trademark_naming_top_banner",
        }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);
      return {
        bigBanner: bigBanner,
        navList: Array.isArray(navList) ? navList : [],
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
        webInfo,
        urlText: "",
      };
    } catch (error) {
      console.log(error);
    }
  },
  mixins: [modulesAuth],
  data() {
    return {
      brandBox: [
        {
          index: 4,
          title: "500+",
          desc: "品牌案例",
        },
        {
          index: 2,
          title: "9年",
          desc: "品牌经验",
        },
        {
          index: 3,
          title: "50人",
          desc: "创意团队",
        },
        { index: 1, title: "10+", desc: "取名步骤" },
      ],
      searching: false,
      bannerText: [
        {
          label: "传承企业文化",
          icon: require("@/assets/images/trademark/v230401/forname/b-1.png"),
        },
        {
          label: "提升品牌价值",
          icon: require("@/assets/images/trademark/v230401/forname/b-2.png"),
        },
        {
          label: "扩大竞争优势",
          icon: require("@/assets/images/trademark/v230401/forname/b-3.png"),
        },
        {
          label: "促进品牌传播",
          icon: require("@/assets/images/trademark/v230401/forname/b-4.png"),
        },
      ],
    };
  },
  mounted() {},
  methods: {
    showLoading(data) {
      let { show } = data;
      this.searching = show;
    },
  },
};
</script>
<style lang="less" scoped>
.brandbox {
  height: 355px;
  background: #ffffff;
  opacity: 1;
  justify-content: space-between;
  padding-top: 100px;
}
.searchbox {
  margin-top: -300px;
  z-index: 9;
  position: relative;
}
.banner {
  &-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &-title {
    img {
      height: 56px;
    }
  }
  &-content {
    font-size: 20px;
    color: #ffffff;
    line-height: 28px;
    margin-top: 4px;
  }
  &-text {
    font-size: 14px;
    color: #ffffff;
    line-height: 22px;
    margin: 24px auto 12px;
    li {
      margin: 0 20px;
      img {
        width: 28px;
        margin-right: 4px;
      }
    }
  }
}
.trademark-query-slogan-title {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  line-height: 40px;
  text-align: center;
}
</style>
