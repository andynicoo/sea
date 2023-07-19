<template>
  <div v-show="isShow">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="accurate-page center ksy-w1320">
      <SearchBoxNew
        :searchText="searchText"
        @goSearch="goSearch"
        @setSearchVal="setSearchVal"
        ref="searchbox"
        page="brandTargeted"
        :hasSelect="true"
        style="margin-bottom: 24px"
        :exampleList="['apple', 'huawei', 'samsung']"
      />
      <filter-risk
        style="margin-bottom: 16px"
        ref="risk"
        :riskList.sync="riskList"
        :target="true"
        :targetNum="targetNum"
      ></filter-risk>
      <filter-height
        @filterUpdate="filterUpdate"
        :riskList.sync="riskList"
        :trade="form.cruTrade"
        ref="filters"
      ></filter-height>
      <div class="flex flex-b trademarklist-wrap">
        <div class="flex1 trademarklist">
          <div class="bigbox">
            <div class="bigcard">
              <div class="tips-page" v-if="Number(newsListPage.total) > 0">
                共为您找到 <span>{{ newsListPage.total || "" }}</span> 个搜索结果，数据更新时间为：{{
                  moment().format("YYYY-MM-DD")
                }}
              </div>
              <TrademarkList
                :tradeList="newsList"
                :cruTrade="form.cruTrade"
                :loading="loading"
              />

              <div class="pagination flex flex-c-b pagination-box" v-show="newsList.length">
                <div class="pagination-left">
                  <h3>为您找到{{ newsListPage.total }}个结果</h3>
                  <p>温馨提示：商标检索结果仅供参考，不作为商标能否注册的法律依据， <br />具体以商标局官网查询为准。</p>
                </div>
                <div class="fenye pagination-fenye">
                  <a-space>
                    <a-pagination
                      :current="Number(newsListPage.current) || 1"
                      :total="Number(newsListPage.total) || 0"
                      show-quick-jumper
                      :pageSize="pageSize"
                      @change="pageChange"
                    />
                  </a-space>
                </div>
              </div>
            </div>
          </div>
        </div>
        <fast-result-right-card></fast-result-right-card>
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
import Cookies from "js-cookie";
import common from "@/apis/common";
import trademark from "@/apis/trademark";
import { cloneDeep } from "lodash";

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
      loading: null,
      isShow: false,
      searchText: "",
      countryCode: "US",
      newsList: [],
      newsListPage: {
        total: 0,
        current: 1,
        pages: 1,
        categoryStatus: 0,
        trademarkStatus: "", // 状态
      },
      pageSize: 10,
      form: {
        countryList: [],
        curKeyword: "",
        trade: [],
        cruTrade: "", // 当前商标
      },
      filterData: {},
      riskList: [],
      targetNum: [],
      moment,
      category: "",
    };
  },
  computed: {
    ...mapState({
      dimShow: (state) => state.dimShow,
      typeCategory: (state) => state.typeCategory,
      defaultBrandTarget: (state) => state.defaultBrandTarget,
    }),
  },
  methods: {
    // 商标分页查询
    async getTradeList() {
      let params = {
        pageIndex: this.newsListPage.current,
        pageSize: this.pageSize,
        country: "US",
        keyWord: this.form.cruTrade,
        ...this.filterData,
      };
      this.loading = true;
      let res = await this.$axiosApi(trademark.getTargetList.url, trademark.getTargetList.methods, params);
      let { data } = res;
      this.$nextTick(() => {
        this.newsList = data.records;
      });
      this.loading = false;
      this.newsListPage = {
        total: data.total,
        current: data.current,
        pages: data.pages,
        categoryStatus: this.newsListPage.categoryStatus,
        trademarkStatus: this.newsListPage.trademarkStatus,
      };
      //Cookies.set("trade", this.form.cruTrade);
      // Cookies.remove("countryList");
      // Cookies.remove("trade");
      // Cookies.remove("category");
    },
    pageChange(page, pageSize) {
      this.newsListPage.current = page;
      this.getTradeList();
    },
    goSearch(data) {
      if (data) {
        let { countryList: keywords, trade, cruTrade } = data;
        this.form.countryList = cloneDeep(keywords);
        this.form.curKeyword = this.form.countryList[0];
        this.form.trade = trade;
        this.form.cruTrade = cruTrade;
      }
      (this.curAdvise = {}), (this.curAdviseList = []), (this.curAdviseNumList = []), (this.newsListPage.current = 1);
      this.$nextTick(async () => {
        await this.getRiskList();
        await this.getTradeList();
        await this.$refs.filters.getData();
        // 风险大类
      });
    },
    setSearchVal(data) {
      this.searchText = data.searchText;
      this.countryCode = data.countryCode;
    },
    // 风险大类
    async getRiskList() {
      console.log("获取大类数据", this.filterData);
      if (this.$refs.risk) {
        this.$refs.risk._data.loading = true;
      }
      const res = await this.$axiosApi(trademark.getTargetRisk.url, trademark.getTargetRisk.methods, {
        country: "US", // 默认美国
        keyWord: this.form.cruTrade,
        ...this.filterData,
      });
      this.$refs.risk._data.loading = false;
      if (res.code === 0 && res.data.categoryList.length) {
        const checkRisks = this.riskList.filter((item) => item.checked);
        this.riskList = res.data.categoryList;
        this.riskList.forEach((item) => {
          item.checked = checkRisks.find((checkItem) => item.name === checkItem.name)?.checked || false;
          return item;
        });
        const arr = [res.data.registerCategoryNum, res.data.unRegisterCategoryNum];
        this.targetNum = [...arr];
      }
    },
    filterUpdate(data) {
      this.$nextTick(async () => {
        console.log("filter更新了", data);
        this.filterData = data;
        this.newsListPage.current = 1;
        this.pageSize = 10;
        await this.getRiskList();
        await this.getTradeList();
        await this.$refs.filters.getData();
      });
    },
  },
  mounted() {
    this.isShow = true;
    if(process.client){
      document.documentElement.scrollTo(0,0);
      window.scroll(0,0);
    }
  },
};
</script>
<style lang="less" scoped>
@import url("~@/assets/css/trademark.less");

.accurate {
  &-page {
    .trademarklist {
      width: 0;
      margin-right: 16px;
    }
  }
}
.tips {
  &-page {
    margin-bottom: 8px;
    font-size: 14px;
    color: #919498;
    line-height: 22px;
    span {
      color: #ff5f61;
    }
  }
}
</style>
