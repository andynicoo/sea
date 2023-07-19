<template>
  <div class="search">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <!-- <a-button>弹窗</a-button>  -->
    <div class="searchbox">
      <div class="center ksy-w1320 tit"><span>商标查询 / </span>商标搜索结果</div>
      <div class="center ksy-w1320 searchboxinner">
        <SearchBox
          :searchText="searchText"
          @goSearch="goSearch"
          @setSearchVal="setSearchVal"
          ref="searchbox"
          v-if="searchBox"
          page="search"
        />
        <div style="display: none">{{ form }}</div>
      </div>
    </div>
    <div class="center ksy-w1320" v-if="getModulesStatus('trademarkQuery_other')">
      <div class="searchoption" v-if="form.trade.length > 1 || form.countryList.length > 1">
        <a-form-model ref="ruleForm" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }" labelAlign="left">
          <a-form-model-item label="商标" v-if="form.trade.length > 1">
            <span v-for="(tag, index) in form.trade" :key="index">
              <a-checkable-tag :checked="tag === form.cruTrade" @change="(checked) => keywordChange(tag, checked)">
                {{ tag }}
              </a-checkable-tag>
            </span>
          </a-form-model-item>
          <a-form-model-item label="国家" v-if="form.countryList.length > 1">
            <span v-for="(tag, index) in form.countryList" :key="index">
              <a-checkable-tag :checked="tag === form.curKeyword" @change="(checked) => countryChange(tag, checked)">
                {{ tag }}
              </a-checkable-tag>
            </span>
          </a-form-model-item></a-form-model
        >
      </div>
      <div class="advise">
        <div class="leftbox">
          <h1 class="ksy-pr">
            注册风险图
            <RiskMap />
          </h1>
          <div class="levelbox ksy-pr">
            <!-- 引导遮罩层 -->
            <div class="zhezhaodiv" v-if="coverShow"></div>
            <div class="arrdiv" v-if="coverShow"></div>
            <div class="intordiv" v-if="coverShow">
              <h2>注册风险图</h2>
              <p>
                系统已按对应大类的近似商标数量进行统计，并进行排序。选中大类可筛选大类对应的同类近似/跨类近似商标哦！
              </p>
              <a-button @click="coverShow = false" class="ksy-fr">知道啦</a-button>
            </div>
            <div class="tabsbox level1">
              <span v-for="tag in adviseList.level1" :key="tag.id">
                <a-checkable-tag
                  @change="(checked) => trademarkValueChange(tag)"
                  class="tags ksy-mb-3"
                  :checked="curAdviseList.includes(tag)"
                >
                  <span>{{ tag.categorySort | formNum }}</span
                  >类 {{ tag.categoryName
                  }}<span class="num">{{ tag.tradermarkNum > 99 ? "99+" : tag.tradermarkNum }}</span>
                </a-checkable-tag>
              </span>
            </div>
            <div class="tabsbox level2">
              <span v-for="tag in adviseList.level2" :key="tag.id">
                <a-checkable-tag
                  @change="(checked) => trademarkValueChange(tag)"
                  class="tags ksy-mb-3"
                  :checked="curAdviseList.includes(tag)"
                >
                  <span>{{ tag.categorySort | formNum }}</span
                  >类 {{ tag.categoryName
                  }}<span class="num">{{ tag.tradermarkNum > 99 ? "99+" : tag.tradermarkNum }}</span>
                </a-checkable-tag>
              </span>
            </div>
            <div class="tabsbox level3">
              <span v-for="tag in adviseList.level3" :key="tag.id">
                <a-checkable-tag
                  @change="(checked) => trademarkValueChange(tag)"
                  class="tags ksy-mb-3"
                  :checked="curAdviseList.includes(tag)"
                >
                  <span>{{ tag.categorySort | formNum }}</span
                  >类 {{ tag.categoryName
                  }}<span class="num">{{ tag.tradermarkNum > 99 ? "99+" : tag.tradermarkNum }}</span>
                </a-checkable-tag>
              </span>
            </div>
          </div>
        </div>
        <TipCard v-if="!curAdvise.id" />
        <TipCardStatus v-else :curAdvise="curAdvise" />
      </div>

      <div class="trademarklist">
        <div class="bigbox">
          <div class="bigcard left">
            <div class="tips">
              <a-tooltip>
                <template slot="title">
                  <p style="font-size: 12px; margin-bottom: 0px">同类近似：是当前选择类别下的近似商标</p>
                  <p style="font-size: 12px">跨类近似：是当前选择类别以外的近似商标</p>
                </template>
                <a-select :default-value="0" style="width: 100px" @change="handleChangeStatus" class="selectxx">
                  <a-select-option :value="0"> 同类近似 </a-select-option>
                  <a-select-option :value="1"> 跨类近似 </a-select-option>
                </a-select>
              </a-tooltip>
              <a-select default-value="" style="width: 100px" @change="handleChangeStatus2" class="selectxx">
                <a-select-option value=""> 全部状态 </a-select-option>
                <a-select-option value="AnnouncementPeriod"> 公告期 </a-select-option>
                <a-select-option value="AuditPeriod"> 审核期 </a-select-option>
                <a-select-option value="Active"> 已注册 </a-select-option>
                <a-select-option value="Inactive"> 已失效 </a-select-option>
                <a-select-option value="Pending"> 注册中 </a-select-option>
                <a-select-option value="RegistrationFail"> 注册异常 </a-select-option>
              </a-select>
              <div class="ksy-fr page" v-if="Number(newsListPage.total) > 0">
                共为您找到 <span>{{ newsListPage.total || "" }}</span> 个搜索结果，数据更新时间为：{{
                  moment().format("YYYY-MM-DD")
                }}
                <span class="cur">
                  <img src="~/assets/images/arr-left.svg" class="hand" @click="changePage('reduce')" />
                  {{ newsListPage.current || "" }}</span
                >/{{ newsListPage.pages || "" }}
                <img src="~/assets/images/arr-right.svg" class="hand" @click="changePage('add')" />
              </div>
            </div>
            <TrademarkList v-if="newsList && newsList.length" :tradeList="newsList" :cruTrade="form.cruTrade" />

            <div class="pagination center" v-show="newsList.length">
              <div class="fenye">
                <a-space>
                  <span class="tit">每页显示</span>
                  <a-select default-value="10" style="width: 60px" @change="handleChange" class="ksy-mr-5 ksy-ml-2">
                    <a-select-option value="10"> 10 </a-select-option>
                    <a-select-option value="20"> 20 </a-select-option>
                    <a-select-option value="30"> 30 </a-select-option>
                  </a-select>
                  <a-pagination
                    :current="Number(newsListPage.current) || 1"
                    :total="Number(newsListPage.total) || 0"
                    :pageSize="pageSize"
                    @change="pageChange"
                  />
                </a-space>
              </div>
            </div>

            <div class="nodata ksy-text-center" v-show="!newsList.length">
              <NoData></NoData>
            </div>
          </div>
          <div class="right">
            <EntranceBox />
            <TradeBox />
          </div>
        </div>
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
    <!-- 人工审核弹窗 -->
    <ManualVer />

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
    try {
      let [{ data: bigBanner }, { data: navList }, { data: footerList }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "search",
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
    }),
  },
  mounted() {
    console.log("mounted--");
    setTimeout(() => {
      this.$store.commit("setSearchBoxData", { show: true });
    }, 100);
  },
  destroyed() {
    this.$store.commit("setSearchBoxData", { show: false });
  },
  methods: {
    // 商标分页查询
    async getTradeList() {
      let params = {
        pageIndex: this.newsListPage.current,
        pageSize: this.pageSize,
        country: this.getCountryCodeByName(),
        // text: this.form.cruTrade,
        // categoryStatus: this.newsListPage.categoryStatus,
        // trademarkStatus: this.newsListPage.trademarkStatus,
      };
      let category = Cookies.get("category") ? Cookies.get("category").split(",") : "";
      console.log(category, category.length, typeof category);
      // 添加分类参数
      if (category.length) {
        params.trademarkCategoryNum = category.toLocaleString();
      } else if (this.curAdviseList.length) {
        // 添加分类参数[]
        params.trademarkCategoryNum = this.trademarkCategoryNumList();
      }
      let res = await this.$axiosApi(trademark.trademarkPage.url, trademark.trademarkPage.methods, params);
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
      Cookies.remove("countryList");
      Cookies.remove("trade");
      Cookies.remove("category");
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
      Cookies.remove("category");
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
      let { keywords, trade } = data;
      console.log("goSearch 接收Data:" + keywords, trade);
      this.form.countryList = cloneDeep(keywords);
      this.form.curKeyword = this.form.countryList[0];
      this.form.trade = trade.split(";");
      this.form.cruTrade = this.form.trade[0];
      // console.log(this.form)
      (this.curAdvise = {}), (this.curAdviseList = []), (this.curAdviseNumList = []), (this.newsListPage.current = 1);
      this.$nextTick(() => {
        this.getSensitWords();
        this.getAdviseList();
        this.getTradeList();
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
@import "~/assets/css/search";
</style>

<style lang="less">
.advise {
  .ant-tag {
    border-radius: 1px 1px 1px 1px;
    opacity: 1;
    color: @textColor6 !important;
  }
  .level1 {
    .ant-tag {
      font-size: 14px;
      font-weight: 400;
      color: #00a870 !important;
    }
    .ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
      color: #00a870 !important;
      background-color: #fafafa !important;
      .num {
        background: #e8f8f2;
      }
    }
    .num {
      background: #e8f8f2;
      border-radius: 15px;
      margin-left: 6px;
      padding: 0px 2px;
    }
    .ant-tag-checkable-checked {
      color: #ffffff !important;
      background-color: #00a870;
      .num {
        color: #00a870;
      }
    }
  }
  .level2 {
    .ant-tag {
      font-size: 14px;
      font-weight: 400;
      color: #ffac0a !important;
    }
    .ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
      color: #ffac0a !important;
      background-color: #fafafa !important;
      .num {
        background: #fef3e6;
      }
    }
    .num {
      background: #fef3e6;
      border-radius: 15px;
      margin-left: 6px;
      padding: 0px 2px;
    }
    .ant-tag-checkable-checked {
      color: #ffffff !important;
      background-color: #ffac0a;
      .num {
        color: #ffac0a;
      }
    }
  }
  .level3 {
    .ant-tag {
      font-size: 14px;
      font-weight: 400;
      color: #e34d59 !important;
    }
    .ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
      color: #e34d59 !important;
      background-color: #fafafa !important;
      .num {
        background: #fdecee;
      }
    }
    .num {
      background: #fdecee;
      border-radius: 15px;
      margin-left: 6px;
      padding: 0px 2px;
    }
    .ant-tag-checkable-checked {
      color: #ffffff !important;
      background-color: #e34d59;
      .num {
        color: #e34d59;
      }
    }
  }
}
.electrocardiogram {
  float: left;
  margin-right: 10px;
  position: relative;
  top: 2px;
}
.zhezhaodiv {
  position: absolute;
  width: 118px;
  height: 31px;
  top: -1px;
  left: 0px;
  box-shadow: rgba(0, 0, 0, 0.6) 0 0 0 170vh;
  z-index: 99999;
}
.intordiv {
  position: absolute;
  width: 278px;
  height: 224px;
  top: -16px;
  left: 138px;
  background: #3a7fff;
  box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px 0px rgba(0, 0, 0, 0.12),
    0px 9px 28px 0px rgba(0, 0, 0, 0.05);
  border-radius: 2px 2px 2px 2px;
  opacity: 1;
  z-index: 999999;
  padding: 24px;
  h2 {
    font-size: 24px;
    font-weight: 500;
    color: #ffffff;
    line-height: 32px;
    margin-bottom: 5px;
  }
  p {
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
  }
}
.arrdiv {
  position: absolute;
  background: #3a7fff;
  z-index: 1000000;
  width: 25px;
  height: 25px;
  top: 2px;
  left: 127px;
  transform: rotate(45deg);
}
</style>
