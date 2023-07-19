<template>
  <div>
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="risk-detail-page">
      <a-spin :spinning="loading">
        <div class="main center ksy-w1320">
          <a-breadcrumb separator="">
            <a-breadcrumb-item> 风险报告 </a-breadcrumb-item>
            <a-breadcrumb-separator />
            <a-breadcrumb-item class="crumb-current"> 风险报告详情 </a-breadcrumb-item>
          </a-breadcrumb>
          <div class="panel-1">
            <h3>商标名近似风险评估报告</h3>
            <span>检索时间：{{ $route.query.searchDate }}</span>
          </div>
          <!-- 基本信息 评估风险 -->
          <a-row class="panel-2">
            <a-col class="panel-2-left" span="12">
              <div class="panel-title">商标基本信息</div>
              <div>
                <dl>
                  <dt>商标名称：</dt>
                  <dd>{{ $route.query.name }}</dd>
                </dl>
                <dl>
                  <dt>商标国家：</dt>
                  <dd>美国</dd>
                </dl>
                <dl v-if="categoryList.length">
                  <dt>商标分类：</dt>
                  <dd>
                    <span v-for="(item, index) in categoryList" :key="index"
                      >{{ item.categoryNum }}类 {{ item.categoryName }}；</span
                    >
                  </dd>
                </dl>
              </div>
            </a-col>
            <a-col v-if="riskScore" class="panel-2-right" span="12">
              <div class="panel-title">近似商标评估风险</div>
              <img :src="riskMap[riskScore].bigImg" alt="" />
            </a-col>
          </a-row>
          <div>
            <a-row :gutter="40" class="panel-3" v-if="riskScore">
              <div>
                <a-col class="panel-3-left" span="12">
                  <div class="panel-title flex flex-c">
                    近似风险分类统计
                    <div @click="toBrandLike" class="tips flex flex-c">
                      <img src="~/assets/images/trademark/v230401/risk/view.png" alt="" />查看注册风险图
                    </div>
                  </div>
                  <div class="panel-3-left-content">
                    <div
                      v-for="(item, index) in riskConcat.filter((v) => v.list.length)"
                      :key="index"
                      class="item"
                      :style="{ background: riskMap[item.key].bgColor }"
                    >
                      <div :style="{ color: riskMap[item.key].color }" class="item-title">
                        {{ riskMap[item.key].label }}
                      </div>
                      <ul class="item-content">
                        <li v-for="(inner, iIndex) in item.list" :key="iIndex">
                          {{ inner.categoryNum }}类 {{ inner.categoryName }}
                          <span>{{ inner.tradermarkNum }}近似</span>
                        </li>
                      </ul>
                      <img :src="riskMap[item.key].smallImg" alt="" />
                    </div>
                  </div>
                </a-col>
                <a-col class="panel-3-right" span="12">
                  <div class="panel-title">注册申请建议</div>
                  <ul>
                    <li v-if="level1.length" class="flex flex-c-b">
                      <p>{{ showType(level1) }}为低风险，建议尽快申请注册</p>
                      <span @click="customerFunc">联系客户经理 <i class="icon-right"></i></span>
                    </li>
                    <li v-if="level2.length" class="flex flex-c-b">
                      <p>{{ showType(level2) }}为中风险，可尝试申请注册</p>
                      <span @click="customerFunc">联系客户经理 <i class="icon-right"></i></span>
                    </li>
                    <li v-if="level2.length" class="flex flex-c-b">
                      <p>{{ showType(level2) }}为中风险，可通过起名调整增加通过率。</p>
                      <span @click="jumpPath('/trademarkname')">AI智能取名 <i class="icon-right"></i></span>
                    </li>
                    <li v-if="level3.length" class="flex flex-c-b">
                      <p>{{ showType(level3) }}为高风险，建议换名字。</p>
                      <span @click="goExpert">专家起名服务 <i class="icon-right"></i></span>
                    </li>
                  </ul>
                  <div class="banner flex flex-c-b">
                    更多增加通过率的建议，请联系客户经理进行咨询哦~<a-button @click="customerFunc" type="primary"
                      >联系客户经理</a-button
                    >
                  </div>
                </a-col>
              </div>
            </a-row>
          </div>
          <div class="flex flex-b">
            <div class="flex1 main-list">
              <div v-if="newsList && newsList.length">
                <TrademarkList :tradeList="newsList" :cruTrade="$route.query.name" />
                <div class="flex flex-c-c" style="height: 54px; background: #fff">
                  <span @click="toBrandLike" class="ksy-status-primary" style="cursor: pointer">查看更多近似商标</span>
                </div>
              </div>
              <div v-else class="nodata-wrap flex flex-c-c">
                <NoData></NoData>
              </div>
              <div class="bottom-infos flex">
                <div class="bottom-infos-left">
                  <div class="top">
                    <img src="~/assets/images/trademark/v230401/risk/title-bottom.png" alt="" />
                  </div>
                  <ul>
                    <li><img src="~/assets/images/trademark/v230401/check-p.png" alt="" />更加精准的通过率预估</li>
                    <li><img src="~/assets/images/trademark/v230401/check-p.png" alt="" />更详细风险预案制定</li>
                    <li><img src="~/assets/images/trademark/v230401/check-p.png" alt="" />申请流程详解，专员解疑</li>
                    <li><img src="~/assets/images/trademark/v230401/check-p.png" alt="" />更多增加通过率的实用建议</li>
                  </ul>
                </div>
                <a-button @click="customerFunc" type="primary">咨询客户经理</a-button>
              </div>
            </div>
            <div class="main-static">
              <StaticTop :data="topData"></StaticTop>
              <StaticType :data="statusData" :cate="statusCate"></StaticType>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
    <!-- 专家取名 弹窗 -->
    <ExpertslVer />
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>
<script>
import Cookies from "js-cookie";
import trademark from "@/apis/trademark";
import common from "@/apis/common";
import { customerFunc } from "@/utils/index";
import { mapMutations } from "vuex";

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
    console.log(context, "context");
    try {
      let [{ data: navList }, { data: footerList }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);

      return {
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
        urlText: "",
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      categoryList: [],
      riskScore: "",
      loading: false,
      // 低风险
      level1: [],
      // 中风险
      level2: [],
      // 高风险
      level3: [],
      newsList: [],
      // 统计数据
      staticInfo: {},
      pieCategory: ["审核期", "注册异常", "公告期", "已注册", "已下证", "已失效"],
      customerFunc,
    };
  },
  computed: {
    riskConcat() {
      if (this.riskScore) {
        return [
          {
            key: "low",
            list: this.level1,
          },
          {
            key: "medium",
            list: this.level2,
          },
          {
            key: "high",
            list: this.level3,
          },
        ];
      } else {
        return {};
      }
    },
    riskMap() {
      return {
        low: {
          value: 1,
          color: "#48BB10",
          bgColor: "#F6FFED",
          label: "低风险",
          smallImg: require("@/assets/images/trademark/v230401/risk/b-1.png"),
          bigImg: require("@/assets/images/trademark/v230401/risk/s-1.png"),
        },
        medium: {
          value: 2,
          color: "#FBB52C",
          bgColor: "#FFFBE6",
          label: "中风险",
          smallImg: require("@/assets/images/trademark/v230401/risk/b-2.png"),
          bigImg: require("@/assets/images/trademark/v230401/risk/s-2.png"),
        },
        high: {
          value: 3,
          color: "#FF5F61",
          bgColor: "#FFF1F0",
          label: "高风险",
          smallImg: require("@/assets/images/trademark/v230401/risk/b-3.png"),
          bigImg: require("@/assets/images/trademark/v230401/risk/s-3.png"),
        },
      };
    },
    myCategory() {
      if (this.categoryList) {
        const inc = this.$route.query.category;
        return this.categoryList.filter((item) => inc.includes(item.categoryNum));
      } else {
        return [];
      }
    },
    topData() {
      let arr = [];
      if (this.staticInfo.categoryList) {
        const list = this.staticInfo.categoryList.slice(0, 5);
        arr = list.map((item) => {
          let temp = {};
          temp.name = item.nameZh;
          temp.value = item.count;
          return temp;
        });
      }
      return arr;
    },
    statusData() {
      let arr = [];
      if (this.staticInfo.statusList && this.staticInfo.statusList.length) {
        const list = this.staticInfo.statusList;
        arr = this.pieCategory.map((item) => {
          let temp = {};
          temp.name = item;
          temp.value = 0;
          list.forEach((n) => {
            if (item === n.name) {
              temp.value = n.count;
            }
          });
          return temp;
        });
      }
      return arr;
    },
    statusCate() {
      if (this.categoryList.length) {
        return this.categoryList.map((item) => item.categoryNum);
      } else {
        return [];
      }
    },
    paramsCategory() {
      let cate = this.$route.query.category;
      if (Array.isArray(cate)) {
        return cate;
      } else {
        return [cate];
      }
    },
  },
  methods: {
    ...mapMutations("trademark", ["setRiskList"]),
    toBrandLike() {
      Cookies.set("trade", this.$route.query.name);
      this.setRiskList(this.categoryList.map((item) => item.categoryNum));
      this.$router.push({
        path: "/fastResult/brandLike",
      });
    },
    goExpert() {
      this.$bus.$emit("changeExpertslVer", { show: true });
    },
    jumpPath(path) {
      this.$router.push({
        path,
      });
    },
    dealData(xData, yDada) {
      let arr = [];
      return [];
    },
    // 商标分页查询
    async getTradeList() {
      let params = {
        pageIndex: 1,
        pageSize: 5,
        country: "US",
        similarRemark: this.$route.query.name,
        categoryList: this.paramsCategory,
      };
      let res = await this.$axiosApi(trademark.getBrandListLikes.url, trademark.getBrandListLikes.methods, params);
      if (res.code === 0) {
        this.newsList = res.data.records;
      }
    },
    // 处理注册申请建议
    showType(list) {
      const types = list.map((item) => item.categoryNum + "类");
      return types.join("、");
    },
    async getReportStatistics() {
      const params = {
        aggregationSize: 30,
        country: "US",
        similarRemark: this.$route.query.name,
        categoryList: this.paramsCategory,
      };
      const res = await this.$axiosApi(
        trademark.getReportStatistics.url,
        trademark.getReportStatistics.methods,
        params
      );
      if (res.code === 0) {
        this.staticInfo = res.data;
      }
    },
    async getRiskReport() {
      const params = {
        country: "US",
        similarRemark: this.$route.query.name,
        categoryList: this.paramsCategory,
      };
      const res = await this.$axiosApi(trademark.getRiskReport.url, trademark.getRiskReport.methods, params);
      if (res.code === 0) {
        const { trademarkCategoryList, riskScore, level1, level2, level3 } = res.data;
        this.categoryList = trademarkCategoryList;
        this.riskScore = riskScore;
        this.level1 = level1;
        this.level2 = level2;
        this.level3 = level3;
      }
    },
  },
  async mounted() {
    try {
      this.loading = true;
      await this.getRiskReport();
      await this.getTradeList();
      await this.getReportStatistics();
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  },
};
</script>
<style lang="less" scoped>
.risk-detail-page {
  padding: 64px 0 100px;
  min-height: 500px;
  background: #f5f7fa url("~@/assets/images/trademark/v230401/risk-detail-bg-bottom.png") no-repeat left bottom / 100%
    auto;
  .main {
    margin: 18px auto 0;
    overflow: hidden;
    .panel {
      &-title {
        font-size: 16px;
        font-weight: 500;
        color: #303132;
        line-height: 24px;
        margin-bottom: 16px;
      }
      &-1 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 108px;
        background: linear-gradient(315deg, #3370ff 0%, #33a9ff 100%);
        font-size: 12px;
        color: #ffffff;
        line-height: 20px;
        margin: 16px 0;
        padding: 0 0 0 24px;
        h3 {
          font-size: 24px;
          font-weight: 500;
          line-height: 32px;
          margin-bottom: 8px;
          color: #ffffff;
        }
      }
      &-2 {
        background: #fff;
        padding: 24px;
        &-left {
          dl {
            display: flex;
            align-items: flex-start;
            font-size: 14px;
            color: #919498;
            line-height: 22px;
            &:first-child {
              dt {
                margin-top: 7px;
              }
              dd {
                font-size: 24px;
                font-weight: 500;
                color: #606266;
                line-height: 32px;
              }
            }
            dd {
              flex: 1;
              width: 0;
              margin-bottom: 0;
              color: #606266;
            }
          }
        }
        &-right {
          img {
            display: block;
            width: 100%;
          }
        }
      }
      &-3 {
        margin: 16px 0;
        background: #fff;
        padding: 24px;
        &-left {
          .tips {
            margin-left: 16px;
            color: @primaryColor;
            font-size: 12px;
            cursor: pointer;
            img {
              width: 16px;
              margin-right: 4px;
            }
          }
          &-content {
            .item {
              position: relative;
              padding: 14px 15px;
              margin-bottom: 6px;
              &:last-child {
                margin-bottom: 0;
              }
              > img {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 120px;
              }
              &-title {
                margin-bottom: 16px;
              }
              &-content {
                font-size: 14px;
                color: #303132;
                line-height: 22px;
                margin-bottom: 0;
                li {
                  margin-bottom: 8px;
                  span {
                    color: #606266;
                    margin-left: 40px;
                  }
                  &:last-child {
                    margin-bottom: 0;
                  }
                }
              }
            }
          }
        }
        &-right {
          ul {
            margin-bottom: 16px;
            li {
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 54px;
              background: #ffffff;
              border-bottom: 1px solid #f0f0f0;
              font-size: 14px;
              color: #606266;
              line-height: 22px;
              p {
                margin-bottom: 0;
                flex: 1;
                width: 0;
                .ellipsis();
              }
              span {
                color: @primaryColor;
                cursor: pointer;
              }
            }
          }
          .banner {
            height: 80px;
            padding: 0 24px;
            font-size: 14px;
            color: #606266;
            background: url(@/assets/images/trademark/v230401/risk/bg-1.png) no-repeat left top / 100% auto;
          }
        }
      }
    }
    &-list {
      margin-right: 16px;
      width: 0;
    }
    &-static {
      width: 319px;
    }
  }
  .nodata-wrap {
    height: 786px;
    background: #ffffff;
  }
  .bottom-infos {
    margin-top: 136px;
    display: flex;
    align-items: flex-start;
    &-left {
      margin-right: 90px;
      .top {
        margin-bottom: 42px;
        img {
          height: 36px;
        }
      }
      ul {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-row-gap: 14px;
        grid-column-gap: 32px;
        font-size: 14px;
        color: #606266;
        line-height: 22px;
        li {
          display: flex;
          align-items: center;
          img {
            height: 20px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
