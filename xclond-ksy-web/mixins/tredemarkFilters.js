import { mapState } from "vuex";
import moment from "moment";
import Cookies from "js-cookie";
import common from "@/apis/common";
import trademark from "@/apis/trademark";
import { cloneDeep } from "lodash";
export default {
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
      btnClick: false,
      specialArr: ['fastResult-brandLawyer', 'fastResult-brandPersonnel'],
      routeName: this.$route.name,
      // 是否有律师或者申请人数据
      hasName: false,
    }
  },
  methods: {
    async checkTrademarksName(key) {
      const res = await this.$axiosApi(trademark.checkTrademarksName.url, trademark.checkTrademarksName.methods, {
        queryField: key,
        queryValue: this.form.cruTrade,
        country: "US",
      });
      if (res.code === 0) {
        this.hasName = res.data;
      } else {
        this.hasName = false;
      }
    },
    async updateData() {
      this.newsListPage.current = 1;
      this.pageSize = 10;
      await this.getTradeList();
    },
    // 商标分页查询
    async getTradeList() {
      let params = {
        pageIndex: this.newsListPage.current,
        pageSize: this.pageSize,
        country: "US",
        //keyWord: this.form.cruTrade,
        ...this.filterData,
      };
      if(this.specialArr.includes(this.routeName)) {
        // 律师
        if(this.routeName==='fastResult-brandLawyer') {
          params['attorneyNameList'] = [this.form.cruTrade]
        }else {
          // 持有人
          params['ownerNameList'] = [this.form.cruTrade]
        }
      }else {
        params.keyWord = this.form.cruTrade
      }      
      let res = await this.$axiosApi(trademark.getTargetList.url, trademark.getTargetList.methods, params);
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
      Cookies.set("trade", this.form.cruTrade);
      // Cookies.remove("countryList");
      // Cookies.remove("trade");
      // Cookies.remove("category");
    },
    pageChange(page, pageSize) {
      this.newsListPage.current = page;
      this.getTradeList();
    },
    goSearch(data) {
      let { countryList: keywords, trade, cruTrade } = data;
      this.form.countryList = cloneDeep(keywords);
      this.form.curKeyword = this.form.countryList[0];
      this.form.trade = trade;
      if(this.btnClick) {
        this.form.cruTrade = cruTrade
      }else {
        this.form.cruTrade = this.$route.query.name || cruTrade;
      }
      (this.curAdvise = {}), (this.curAdviseList = []), (this.curAdviseNumList = []), (this.newsListPage.current = 1);
      this.$nextTick(() => {
        // this.getSensitWords();
        // this.getAdviseList();
        this.getRiskList()
        this.updateData()
      });
    },
    setSearchVal(data) {
      this.searchText = data.searchText;
      this.countryCode = data.countryCode;
    },
    // 风险大类
    async getRiskList() {
      this.$refs.risk._data.loading = true;
      const res = await this.$axiosApi(trademark.getTargetRisk.url, trademark.getTargetRisk.methods, {
        country: "US", // 默认美国
        keyWord: this.form.cruTrade,
      });
      this.$refs.risk._data.loading = false;
      if (res.code === 0 && res.data.categoryList.length) {
        this.riskList = res.data.categoryList;
        this.riskList.map((item) => {
          item.checked = false;
          return item;
        });
        const arr = [res.data.registerCategoryNum, res.data.unRegisterCategoryNum];
        this.targetNum = [...arr];
      }
    },
    filterUpdate(data) {
      this.filterData = data;
      this.newsListPage.current = 1;
      this.pageSize = 10;
      this.updateData();
    },
  }
}