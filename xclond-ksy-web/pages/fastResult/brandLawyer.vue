<template>
  <div>
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="center ksy-w1320">
        <SearchBoxNew
          :searchText="searchText"
          @goSearch="goSearch"
          @setSearchVal="setSearchVal"
          @btnClick="btnClick = $event"
          placeholder="请输入您要查询的律师名称"
          ref="searchbox"
          page="brandLawyer"
          :exampleList="defaultLawyer"
          :isFuzzyMatch="true"
          :fuzzyMatchLoading="fuzzyMatchLoading"
          :fuzzyMatchList="fuzzyMatchList"
          @getFuzzyMatchList="getFuzzyMatchList"
        />
      <!-- 统计区 -->
      <div class="agency-static-wrap">
        <StaticBar
          @timeChange="timeChange"
          :name="form.cruTrade"
          :status="statusData"
          :total="+staticTotal"
          :hasName="hasName"
          :rangeDate="rangeDate"
        ></StaticBar>
        <div class="agency-static-main flex flex-b">
          <div style="width: 516px">
            <StaticLine :data="lineData" :maxData="+staticTotal"></StaticLine>
          </div>
          <div style="width: 260px">
            <StaticPie :data="columnData">
              <template #title>
                代理商标分类 <img src="~/assets/images/trademark/v230401/top/top4.png" alt="" />
              </template>
            </StaticPie>
          </div>
          <div style="width: 260px">
            <StaticPie :data="pieData" id="main-pie2">
              <template #title>
                代理商标地区 <img src="~/assets/images/trademark/v230401/top/top4.png" alt="" />
              </template>
            </StaticPie>
          </div>
        </div>
      </div>
      <filter-height
        @filterUpdate="filterUpdate"
        :riskList.sync="riskList"
        :trade="form.cruTrade"
        :rangeDate="rangeDate"
        typeStr="attorneyNameList"
        ref="filter"
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
                :type="1"
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
import common from "@/apis/common";
import trademark from "@/apis/trademark";
import Cookies from "js-cookie";
import tredemarkFilters from "@/mixins/tredemarkFilters";
import { mapState } from "vuex";

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
  mixins: [tredemarkFilters],
  data() {
    return {
      loading: null,
      form: {
        countryList: [],
        curKeyword: "",
        trade: [],
        cruTrade: "", // 当前商标
      },
      staticTotal: 0,
      rangeDate: [],
      // 申请注册趋势数据
      lineData: [],
      // 代理律师统计数据
      columnData: [],
      // 商标分类布局统计数据
      pieData: [],
      statusData: [],
      // 模糊匹配列表
      fuzzyMatchList: [],
      fuzzyMatchLoading: false,
    };
  },
  computed: {
    ...mapState("trademark", ["defaultLawyer"]),
  },
  methods: {
    timeChange(val) {
      this.rangeDate = val;
      this.updateData();
    },
    // 统计数据
    async getAnalysis() {
      const res = await this.$axiosApi(trademark.getLawyerStatics.url, trademark.getLawyerStatics.methods, {
        country: "US", // 默认美国
        applyDateStr: this.rangeDate.join(","),
        attorneyNameList: [this.form.cruTrade],
      });
      if (res.code === 0) {
        this.lineData = res.data.trademarkAttorneyTrendDTOList;
        this.columnData = res.data.categoryList.slice(0, 4);
        this.pieData = res.data.organizedZhList.filter((item) => item.name).slice(0, 4);
        this.statusData = res.data.statusList;
        this.staticTotal = res.data.total;
      }
    },
    // 风险大类
    async getRiskList() {
      const res = await this.$axiosApi(trademark.getTargetRisk.url, trademark.getTargetRisk.methods, {
        country: "US", // 默认美国
        //keyWord: this.form.cruTrade,
        attorneyNameList: [this.form.cruTrade],
        applyDateStr: this.rangeDate.join(","),
        ...this.filterData,
      });
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
    // 商标分页查询
    async getTradeList() {
      console.log("商标分页查询");
      this.loading = true;
      let params = {
        pageIndex: this.newsListPage.current,
        pageSize: this.pageSize,
        country: "US",
        applyDateStr: this.rangeDate.join(","),
        //keyWord: this.form.cruTrade,
        ...this.filterData,
      };
      if (this.specialArr.includes(this.routeName)) {
        // 律师
        if (this.routeName === "fastResult-brandLawyer") {
          params["attorneyNameList"] = [this.form.cruTrade];
        } else {
          // 持有人
          params["ownerNameList"] = [this.form.cruTrade];
        }
      } else {
        params.keyWord = this.form.cruTrade;
      }
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
    },
    updateData() {
      console.log("updateData1");
      this.$nextTick(async () => {
        this.newsListPage.current = 1;
        this.pageSize = 10;
        this.$refs["filter"] && this.$refs["filter"].getData();
        await this.getRiskList();
        await this.checkTrademarksName("attorneyName");
        await this.getTradeList();
        await this.getAnalysis();
      });
    },
    // 申请人模糊匹配
    async getFuzzyMatchList(val) {
      this.fuzzyMatchList = [];
      this.fuzzyMatchLoading = true;
      const { data } = await this.$axiosApi(trademark.getAttorneyList.url, trademark.getAttorneyList.methods, {
        keyWord: val,
        pageIndex: 1,
        pageSize: 20,
      });
      this.fuzzyMatchList = data || [];
      this.fuzzyMatchLoading = false;
    },
  },
  mounted() {
    Cookies.remove("trade");
    if(process.client){
      document.documentElement.scrollTo(0,0);
      window.scroll(0,0);
    }
  },
};
</script>
<style lang="less" scoped>
@import url("~@/assets/css/trademark.less");
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
.trademarklist {
  margin-right: 16px;
}
.agency-static {
  &-wrap {
    padding: 16px 24px;
    background: #fff;
    font-size: 14px;
    color: #606266;
    line-height: 22px;
    margin-bottom: 16px;
  }
}
</style>
