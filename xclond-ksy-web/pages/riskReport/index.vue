<template>
  <div>
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <!-- banner start -->
    <div class="banner-big">
      <IndexBanner
        :list="bigBanner"
        v-if="bigBanner && bigBanner.length && getModulesStatus('homePage_topBanner')"
        :showData="NODE_PLA !== 'kby' && getModulesStatus('Home_dataShow')"
        style="height: 396px"
      />
    </div>
    <div class="risk-page">
      <div class="risk-page-top flex flex-c-b center ksy-w1320">
        <div class="risk-page-top-left">
          <div class="title"><img src="~@/assets/images/trademark/v230401/risk/title-1.png" alt="" /></div>
          <ul class="tips">
            <li v-for="(item, index) in tipsList" :key="index" class="flex flex-c">
              <img src="~@/assets/images/trademark/v230401/check-p.png" alt="" />{{ item }}
            </li>
          </ul>
        </div>
        <div class="risk-page-search">
          <div class="item">
            <a-input v-model="name" placeholder="请输入想要查询风险的商标名称" style="height: 46px"></a-input>
          </div>
          <div class="item item-select">
            <a-select
              v-model="category"
              mode="multiple"
              style="width: 100%"
              placeholder="请选择您的商品分类"
              :allowClear="true"
              :showSearch="true"
              :maxTagCount="2"
              @change="handleChange"
            >
              <a-select-option
                v-for="(i, index) in categoryList"
                :value="i.categoryNum"
                :key="index"
                :disabled="i.disabled"
              >
                {{ i.categoryNum > 9 ? i.categoryNum : `0${i.categoryNum}` }}类 {{ i.categoryName }}
              </a-select-option>
            </a-select>
          </div>
          <a-button @click="search" type="primary" size="large"
            ><img src="~@/assets/images/trademark/v230401/tips-yellow.png" alt="" />立即查看</a-button
          >
          <p class="text"><span>874</span>人已深度排查，了解注册风险提前预测。</p>
        </div>
      </div>
      <div class="risk-page-content">
        <QuicklyPanel></QuicklyPanel>
      </div>

      <div class="risk-page-bottom">
        <div class="trademark-query-slogan-title">为什么选择我们？</div>
        <div class="center ksy-w1320">
          <div v-for="(item, index) in whyList" :key="index" class="item">
            <div class="flex flex-c"><img :src="item.img" alt="" />{{ item.title }}</div>
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>
<script>
import trademark from "@/apis/trademark";
import common from "@/apis/common";
import moment from "moment";
import modulesAuth from "@/mixins/modules-auth";
const NODE_PLA = process.env.NODE_PLA;
export default {
  head() {
    return {
      title: `国际商标查询-免费商标检索-跨标云商标查询系统`,
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
          adKey: "Risk_Reporting_top_banner",
        }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);

      return {
        bigBanner: bigBanner, // 顶部banner
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
        urlText: "",
      };
    } catch (error) {
      console.log(error);
    }
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      tipsList: [
        "近似商标评估风险",
        "各分类风险分布",
        "注册申请建议",
        "近似商标详情",
        "类目近似商标统计",
        "TOP5近似类别分布",
      ],
      whyList: [
        {
          title: "9年+跨境服务商",
          text: "信息安全管理体系",
          img: require("@/assets/images/trademark/v230401/why/1.png"),
        },
        {
          title: "多维数据",
          text: "包含8大模块，40+权威数据",
          img: require("@/assets/images/trademark/v230401/why/2.png"),
        },
        {
          title: "解读建议",
          text: "专业解读商标注册风险信息",
          img: require("@/assets/images/trademark/v230401/why/3.png"),
        },
        {
          title: "隐私安全",
          text: "银行级数据加密，安全运营10+年",
          img: require("@/assets/images/trademark/v230401/why/4.png"),
        },
        {
          title: "极速查询",
          text: "一键生成商标注册风险报告",
          img: require("@/assets/images/trademark/v230401/why/5.png"),
        },
      ],
      categoryList: [],
      category: [],
      choose: [],
      name: "",
    };
  },
  watch: {
    $route: {
      handler(newVal) {
        if (newVal) {
          this.name = newVal.query.name;
        }
      },
      deep: true,
      immediate: true,
    },
    // 限制最多五个
    category: {
      handler(newVal) {
        if (newVal.length === 5) {
          const arr = this.categoryList.map((item) => {
            if (!newVal.includes(item.categoryNum)) {
              item.disabled = true;
            }
            return item;
          });
          console.log("arr", arr);
          this.categoryList = [...arr];
        } else {
          const arr = this.categoryList.map((item) => {
            item.disabled = false;
            return item;
          });
          this.categoryList = [...arr];
        }
      },
      deep: true,
    },
  },
  methods: {
    search() {
      const params = {
        name: this.name,
        country: "US",
        searchDate: moment(new Date()).format("YYYY-MM-DD"),
        category: this.category,
      };
      if (this.name === "") {
        return this.$message.error("商标名称不能为空");
      } else if (this.category.length === 0) {
        return this.$message.error("请选择商品分类");
      } else {
        this.$router.push({
          path: "/riskReport/detail",
          query: params,
        });
      }
    },
    handleChange() {
      this.choose = this.categoryList.filter((item, index) => this.category.includes(index));
    },
    async getCategoryList() {
      const res = await this.$axiosApi(trademark.trademarkCate.url, trademark.trademarkCate.methods);
      if (res.code === 0) {
        this.categoryList = res.data.map((item) => {
          item.disabled = false;
          return item;
        });
      }
    },
  },
  mounted() {
    this.getCategoryList();
  },
};
</script>
<style lang="less" scoped>
.banner-big {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  width: 100%;
}
.risk-page {
  position: relative;
  z-index: 10;
  padding: 64px 0 0;
  &-top {
    height: 332px;
    font-size: 14px;
    line-height: 22px;
    &-left {
      .title {
        height: 58px;
        margin-bottom: 48px;
        img {
          display: block;
          height: 100%;
          width: auto;
        }
      }
      .tips {
        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-column-gap: 40px;
        grid-row-gap: 12px;
        color: #ffffff;
        li {
          img {
            width: auto;
            height: 20px;
            margin-right: 5px;
          }
        }
      }
    }
  }
  &-search {
    width: 388px;
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
    .item {
      margin-bottom: 16px;
      &-select {
        display: flex;
        align-items: center;
        min-height: 46px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        &:hover {
          border-color: #5c92ff;
        }
        /deep/ .ant-select-selection {
          border: none !important;
          box-shadow: none !important;
        }
      }
    }
    .text {
      margin-bottom: 0;
      > span {
        color: @primaryColor;
      }
    }
    button {
      position: relative;
      width: 340px;
      height: 48px;
      margin-bottom: 12px;
      img {
        position: absolute;
        width: 100px;
        top: -18px;
        right: -14px;
      }
    }
  }
  &-content {
    margin: 60px 0 63px;
  }
  &-bottom {
    height: 888px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
    background: linear-gradient(180deg, #e3f1fe 0%, rgba(227, 241, 254, 0) 60%, #e3f1fe 100%);
    .center {
      position: relative;
      height: 100%;
      background: url("~@/assets/images/trademark/v230401/why/bg.png") no-repeat center bottom / 760px auto;
      .item {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 80px;
        background: #fff;
        border-radius: 4px;
        padding: 0 12px;
        img {
          height: 24px;
          margin-right: 8px;
        }
        > div {
          font-size: 18px;
          font-weight: 500;
          line-height: 26px;
          margin-bottom: 9px;
        }
        &:nth-child(1) {
          top: 230px;
          left: 62px;
        }
        &:nth-child(2) {
          top: 382px;
          left: 28px;
        }
        &:nth-child(3) {
          top: 551px;
          left: 88px;
        }
        &:nth-child(4) {
          top: 298px;
          right: -7px;
        }
        &:nth-child(5) {
          top: 594px;
          right: 63px;
        }
      }
    }
  }
}
.risk-page-bottom {
  position: relative;
}
.trademark-query-slogan-title {
  text-align: center;
  width: 100%;
  position: absolute;
  top: 80px;
  left: 0;
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  line-height: 40px;
}
</style>
<style lang="less">
.risk-page-search {
  .item-select {
    height: 46px;
    .ant-select {
      height: 44px;
      padding-top: 7px !important;
    }
    .ant-select-selection {
      height: 37px;
    }
    .ant-select-selection--multiple .ant-select-selection__clear,
    .ant-select-selection--multiple .ant-select-arrow {
      top: 22px !important;
    }
  }
}
</style>
