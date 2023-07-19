<template>
  <div class="my-page">
    <div class="center ksy-w1320" style="margin-bottom: 100px">
      <SearchBoxNew
        :searchText="searchText"
        @goSearch="goSearch"
        @setSearchVal="setSearchVal"
        placeholder="请输入商标名查询"
        ref="searchbox"
        v-if="searchBox"
        page="brandLike"
        style="margin-bottom: 24px"
        :exampleList="['apple', 'huawei', 'samsung']"
      />
      <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
      <filter-risk
        style="margin-bottom: 16px"
        ref="risk"
        :riskList.sync="riskList"
        :name="form.cruTrade"
        :loading="loading"
      ></filter-risk>
      <filter-height @filterUpdate="filterUpdate" :riskList.sync="riskList" :filters="advanceFilter"></filter-height>
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

    <!-- 违禁词提示 -->
    <a-modal
      :title="null"
      :visible="dimShow"
      :footer="null"
      :closable="false"
      dialogClass="senwords"
      :width="487"
      :centered="true"
    >
      <div class="up">
        <img src="~/assets/images/sword.png" style="width: 252px" />
      </div>
      <div class="down ksy-text-center">
        <h2>温馨提示</h2>
        <p class="color6 font">{{ senWordText }}</p>
        <a-button type="primary" @click="closeDim()">我知道了</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import common from "@/apis/common";
import trademark from "@/apis/trademark";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
import { cloneDeep } from "lodash";
import moment from "moment";
import { mapState, mapMutations } from "vuex";
import { async } from "q";
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
      let [
        { data: bigBanner },
        { data: navList },
        { data: footerList },
        { data: webInfo },
        { data: trademarkStatusLevelOneList },
        { data: trademarkStatusLevelTwoList },
      ] = await Promise.all([
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "search",
        }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(trademark.getTrademarkStatusLevelOne.url, trademark.getTrademarkStatusLevelOne.methods, {
          countryCode: "US",
        }),
        context.$axiosApi(trademark.getTrademarkStatusLevelTwo.url, trademark.getTrademarkStatusLevelTwo.methods, {
          countryCode: "US",
        }),
      ]);
      return {
        bigBanner: bigBanner,
        navList: Array.isArray(navList) ? navList : [],
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
        webInfo,
        urlText: "",
        trademarkStatusLevelOneList,
        trademarkStatusLevelTwoList,
      };
    } catch (error) {
      console.log(error);
    }
  },
  mixins: [modulesAuth],
  data() {
    return {
      loading: null,
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
      trademarkStatusList: [
        { label: "全部", value: "" },
        { label: "已注册", value: "Active" },
        { label: "申请中", value: "Pending" },
        { label: "已核销", value: "Inactive" },
      ],
      trademarkStatus: "",
      adviseList: {
        level1: [],
        level2: [],
        level3: [],
      },
      curAdvise: {},
      curAdviseList: [],
      curAdviseNumList: [],
      adviseValue: 0,
      serialId: "",
      form: {
        countryList: [],
        curKeyword: "",
        trade: [],
        cruTrade: "", // 当前商标
      },
      countryData: [
        { name: "美国", code: "US" },
        { name: "欧盟", code: "EU" },
        { name: "英国", code: "GB" },
        { name: "日本", code: "JP" },
      ],
      moment,
      senWordText: "", // 违禁词提示语
      coverShow: false, // 引导遮罩层
      riskList: [],
      filterData: {},
    };
  },
  filters: {
    formNum(value) {
      let num = Number(value);
      return num > 9 ? num : "0" + value;
    },
  },
  computed: {
    ...mapState({
      dimShow: (state) => state.dimShow,
      searchBox: (state) => state.searchBox,
      tempRiskList: (state) => state.trademark.tempRiskList,
    }),
    // 高级筛选部分选项
    advanceFilter() {
      let temp = {};
      temp = {
        // 商标状态
        statusList: {
          single: false,
          options: this.trademarkStatusLevelOneList.map((o) => {
            return {
              count: -2,
              name: o,
              nameZh: "",
              repeat1: "",
              repeat2: "",
              repeat3: "",
            };
          }),
        },
        twoStatusList: {
          single: false,
          options: this.trademarkStatusLevelTwoList.map((o) => {
            return {
              count: -2,
              name: o,
              nameZh: "",
              repeat1: "",
              repeat2: "",
              repeat3: "",
            };
          }),
        },
        // 近似规则
        categoryStatus: {
          single: true,
          options: [
            {
              count: -1,
              name: "0",
              nameZh: "同类近似",
            },
            {
              count: -1,
              name: "1",
              nameZh: "跨类近似",
            },
          ],
        },
      };
      return temp;
    },
  },
  mounted() {
    setTimeout(() => {
      this.$store.commit("setSearchBoxData", { show: true });
    }, 100);
    if(process.client){
      document.documentElement.scrollTo(0,0);
      window.scroll(0,0);
    }
  },
  created() {
    // url channel参数,记录 用于统计跳转过来的链接的注册统计
    let channel = this.$route.query.channel;
    if (channel) {
      Cookies.set("channelQuery", channel, { expires: 7 });
    }
  },
  destroyed() {
    this.$store.commit("setSearchBoxData", { show: false });
    let arr = [];
    this.setRiskList([...arr]);
  },
  methods: {
    ...mapMutations("trademark", ["setRiskList"]),
    // 风险大类
    async getRiskList() {
      this.$refs.risk._data.loading = true;
      const res = await this.$axiosApi(
        trademark.getProbability.url,
        trademark.getProbability.methods,
        {
          countryCode: "US", // 默认美国
          text: this.form.cruTrade || "python",
          // ...this.filterData,
        },
        true
      );
      this.$refs.risk._data.loading = false;
      if (res.code === 0 && res.data.length) {
        // 其他页面的参数， 设置为默认选中
        this.tempRiskList.forEach((categoryNum) => {
          const index = res.data.findIndex((riskItem) => riskItem.categoryNum === categoryNum);
          res.data[index].checked = index > -1;
        });
        console.log("res.data", res.data);
        // 当前页面的选中
        this.riskList = res.data.map((item) => {
          const check = this.riskList.find((riskItem) => item.categoryNum === riskItem.categoryNum)?.checked || false;
          const defaultCheck = item.checked;
          return {
            ...item,
            checked: defaultCheck || check || false,
          };
        });
      }
    },
    // 商标分页查询
    async getTradeList() {
      this.loading = true;
      let params = {
        pageIndex: this.newsListPage.current,
        pageSize: this.pageSize,
        country: this.getCountryCodeByName(),
        similarRemark: this.form.cruTrade,
        ...this.filterData,
      };
      let category = Cookies.get("category") ? Cookies.get("category").split(",") : "";
      // 添加分类参数
      if (category.length) {
        //params.trademarkCategoryNum = category.toLocaleString();
      } else if (this.curAdviseList.length) {
        // 添加分类参数[]
        //params.trademarkCategoryNum = this.trademarkCategoryNumList();
      }
      let res = await this.$axiosApi(trademark.getBrandListLikes.url, trademark.getBrandListLikes.methods, params);
      this.loading = false;
      let { data } = res;
      this.$nextTick(() => {
        this.newsList = data.records;
      });
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
    filterUpdate(data) {
      this.filterData = data;
      this.newsListPage.current = 1;
      this.pageSize = 10;
      this.getTradeList();
      this.getRiskList();
    },
    // 根据搜索值查询建议列表 []
    async getAdviseList() {
      let params = {
        countryCode: this.getCountryCodeByName(),
        text: this.form.cruTrade,
      };
      let res = await this.$axiosApi(trademark.trademarkAdvise.url, trademark.trademarkAdvise.methods, params, true);
      let { data } = res;
      this.adviseList.level1 = data.level1;
      this.adviseList.level2 = data.level2;
      this.adviseList.level3 = data.level3;
    },
    // 根据搜索值查询敏感词
    async getSensitWords() {
      let params = {
        text: this.form.cruTrade,
      };
      let res = await this.$axiosApi(
        trademark.searchSensitiveWords.url,
        trademark.searchSensitiveWords.methods,
        params,
        true
      );
      let { code, data } = res;
      let searchPage = localStorage.searchPage ? Number(localStorage.searchPage) : 0;
      // 有违禁词
      if (code === 0 && data.length) {
        this.senWordText = data;
        this.$store.commit("setDimData", { show: true });
      } else {
        if (searchPage === 0) {
          this.coverShow = true;
          localStorage.searchPage = 1;
        }
      }
    },
    // 商标类别
    async trademarkValueChange(tag) {
      //Cookies.remove("category");
      this.curAdvise = tag;
      this.curAdviseList.includes(tag) ? this.removeValue(this.$data.curAdviseList, tag) : this.curAdviseList.push(tag);
      this.getTradeList();
    },
    removeValue(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1);
          break;
        }
      }
      return arr;
    },
    pageChange(page, pageSize) {
      this.newsListPage.current = page;
      this.getTradeList();
    },
    handleChange(value) {
      this.pageSize = Number(value);
      this.newsListPage.current = 1;
      this.getTradeList();
    },
    handleChangeStatus(value) {
      this.newsListPage.categoryStatus = value;
      this.getTradeList();
    },
    handleChangeStatus2(value) {
      this.newsListPage.trademarkStatus = value;
      this.getTradeList();
    },
    handleClickLink(link = "login") {
      const host = `${this.$store.state.host.server_url}/${link}`;
      window.open(host);
    },
    goSearch(data) {
      if (data) {
        let { countryList: keywords, trade, cruTrade } = data;
        this.form.countryList = cloneDeep(keywords);
        this.form.curKeyword = this.form.countryList[0];
        this.form.trade = trade;
        this.form.cruTrade = cruTrade;
        const { path, query } = this.$route;
        this.$router.push({
          path,
          query: {
            ...query,
            name: cruTrade,
          },
        });
      }
      (this.curAdvise = {}), (this.curAdviseList = []), (this.curAdviseNumList = []), (this.newsListPage.current = 1);
      this.$nextTick(async () => {
        this.getSensitWords();
        // this.getAdviseList();
        // 风险大类
        await this.getRiskList();
        await this.getTradeList();
      });
    },
    setSearchVal(data) {
      this.searchText = data.searchText;
      this.countryCode = data.countryCode;
    },
    // 根据国家查询code
    getCountryCodeByName() {
      let { curKeyword } = this.form;
      let curArr = this.countryData.filter((ele) => ele.name === curKeyword);
      let code = curArr[0];
      // return code.length? code.code:'';
      return code && code.code ? code.code : "US";
    },
    countryChange(tag, checked) {
      this.form.curKeyword = tag;
      this.getTradeList();
      this.getAdviseList();
    },
    keywordChange(tag, checked) {
      this.form.cruTrade = tag;
      this.getTradeList();
      this.getAdviseList();
    },
    changePage(type) {
      console.log(type, this.newsListPage);
      let { current, pages } = this.newsListPage;
      if (type === "add" && Number(current) < Number(pages)) {
        this.newsListPage.current = Number(current) + 1;
        this.getTradeList();
      }
      if (type === "reduce" && Number(current) > 1) {
        this.newsListPage.current = Number(current) - 1;
        this.getTradeList();
      }
    },
    // 根据分类选中获取 类目编号[]
    trademarkCategoryNumList() {
      let { curAdviseList } = this.$data;
      this.curAdviseNumList = [];
      curAdviseList.map((ele) => {
        this.curAdviseNumList.push(ele.categoryNum);
      });
      return this.curAdviseNumList.toLocaleString();
    },
    closeDim() {
      this.$store.commit("setDimData", { show: false });
      let searchPage = localStorage.searchPage ? Number(localStorage.searchPage) : 0;
      if (searchPage === 0) {
        this.coverShow = true;
        localStorage.searchPage = 1;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.my-page {
  .trademarklist {
    margin-right: 16px;
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
  .pagination {
    &-box {
      background: #fff;
      padding: 8px 24px;
    }
    &-left {
      h3 {
        font-size: 14px;
        color: #919498;
        line-height: 22px;
      }
      p {
        font-size: 12px;
        color: #c0c4cb;
        line-height: 20px;
        margin: 0;
      }
    }
  }
}
</style>
