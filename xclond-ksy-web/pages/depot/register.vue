<template>
  <div class="register">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <!-- 搜索 -->
    <a-affix :offset-top="64" class="affix">
      <div class="header-search">
        <div class="search-content">
          <div class="search-item">
            <label>申请人国家</label>
            <a-select
              show-search
              option-filter-prop="children"
              class="select"
              v-model="applyCountry"
              mode="multiple"
              placeholder="请选择国家"
              allowClear
              showArrow
              :maxTagCount="2"
              @change="handleChangeApplyCountry"
              :getPopupContainer="node => node.parentNode"
            >
              <a-select-opt-group>
                <span slot="label" class="opt-group-label"><img src="~/assets/images/depot/hot.svg" width="14" />热门国家</span>
                <a-select-option value="ALL" :disabled="applyCountry.length >= 1">全部</a-select-option>
                <a-select-option 
                  v-for="(item,index) in hotCountryList"
                  :key="countryList.length + index"
                  :value="item.countryZh"
                  :disabled="
                    (applyCountry.length >= 5 && applyCountry.findIndex((o) => o === item.countryZh) === -1)
                  "
                >
                  {{ item.countryZh }}
                </a-select-option>
              </a-select-opt-group>
              <a-select-opt-group>
                <span slot="label" class="opt-group-label"><img src="~/assets/images/depot/global.svg" width="14" />全部国家</span>   
                <a-select-option
                  :value="item.countryZh"
                  v-for="(item, index) in countryList"
                  :key="index"
                  :disabled="
                    (applyCountry.length >= 5 && applyCountry.findIndex((o) => o === item.countryZh) === -1)
                  "
                >
                  {{ item.countryZh }}
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </div>
          <div class="search-item">
            <label>律师名称</label>
            <a-select
              class="select"
              showArrow
              allowClear
              placeholder="请输入律师名"
              v-model="attorneyName"
              show-search
              :filter-option="false"
              :not-found-content="attorneyLoading ? undefined : null"
              :show-arrow="false"
              @search="handleSearchAttorney"
              @change="val => attorneyName = val"
              :getPopupContainer="node => node.parentNode"
            >
              <a-spin v-if="attorneyLoading" slot="notFoundContent" size="small" />
              <a-select-option
                v-for="(item, index) in attorneyNameList"
                :value="item.name"
                :key="index"
              >{{ item.name ? item.name : '全部' }}</a-select-option>              
            </a-select>
          </div>
          <div class="search-item search-item-time">
            <label>申请时间</label>
            <div>
              <div class="labels">
                <span 
                  @click="handleChangeTimeRange(item)"
                  v-for="(item,index) in timeRangeList"
                  :key="index"
                  :class="item.key === timeRange.key ? 'active' : ''"
                >{{ item.label }}</span>
              </div>
              <a-range-picker
                class="range-picker"
                :value="timeRange.value"
                v-show="customize"
                @change="handleRangePicker"
                style="width: 200px;"
              />
            </div>
          </div>
          <a-button type="primary" icon="search" class="btn" @click="searchBtn"> 查一下</a-button>
          <div class="search-tips">
            数据只含：<img src="~/assets/images/countryFlag/US.svg" height="14" />美国商标<br/>更新时间：{{ currentDate }}
          </div>
        </div>
      </div>
    </a-affix>
   
    <div class="content ksy-w1320">
      <div class="data-board">
        <!-- 美标数据看板 -->
        <StandardData
          :mapList="mapList"
          :applyList="applyList"
          :applyPrescriptionTrendList="applyPrescriptionTrendList"
          :trendList="trendList"
          :timeList="timeList"
          :speType="speType"
          :disType="disType"
          :applyStatus="applyStatus"
          :loading="loading"
          :speardLoading="speardLoading"
          :discountLoading="discountLoading"
          :prescriptionTrendLoading="prescriptionTrendLoading"
          :prescriptionTrendType="prescriptionTrendType"
          :prescriptionTrendStatus="prescriptionTrendStatus"
          :timeLoading="timeLoading"
          :statissticsType="statissticsType"
          :selectCountry="selectCountry"
          :isChildEmit="isChildEmit"
          @changeSpeard="changeSpeard"
          @changeDiscount="changeDiscount"
          @changeStatusTime="changeStatusTime"
          @changeApplyPrescriptionTrend="changeApplyPrescriptionTrend"
        />
      </div>
      <div class="lawyer-board">
        <!-- 代理律师数据看板 -->
        <LawyerData
          :distributionList="distributionList"
          :topLawyerList="topLawyerList"
          :topTrademarkList="topTrademarkList"
          :loading="loading"
          :agentLoading="agentLoading"
          :applicantLoading="applicantLoading"
          @pageAgent="pageAgent"
          @pageTrademark="pageTrademark"
          @change="goToAggregated"
        />
      </div>
      <div class="trademark-section">
        <!-- 商标分类数据看板 -->
        <TrademarkBoard
          :cateList="cateList"
          :smallList="smallList"
          :cateSmall="cateSmall"
          :smallLoading="smallLoading"
          @changeSmallPage="changeSmallPage"
        />
      </div>

      <!-- 分类品牌 -->
      <!-- <div class="brand-section">
        <BrandBoard
          :cateList="cateList"
          :trademarkList="trademarkList"
          :cateBrand="cateBrand"
          :brandLoading="brandLoading"
          @changePage="changePage"
          @changeCategory="changeCategory"
        />
      </div> -->
      <div class="brand-board"></div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" :showBanner="false" />
  </div>
</template>

<script>
import moment from "moment";
import common from "@/apis/common";
import depot from "@/apis/depot";
import trademark from "@/apis/trademark";
import { getHotCountryList, getCountryList } from "@/utils/index";
import { debounce} from 'lodash';
import qs from 'qs';
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
const timeRangeList = [{
  key: 0,
  label:'近5年',
  value: [moment().subtract(1828, 'days'), moment().subtract(3, 'days')]
},{
  key: 1,
  label:'近1年',
  value: [moment().subtract(368, 'days'), moment().subtract(3, 'days')]
},{
  key: 2,
  label: '近30天',  
  value: [moment().subtract(33, 'days'), moment().subtract(3, 'days')]
},{
  key: 3,
  label:'自定义',
  value: []
}]
export default {
  head() {
    return {
      title: "注册商标库",
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: "",
        },
        {
          hid: "description",
          name: "description",
          content: "",
        },
      ],
    };
  },
  async asyncData(context) {
    try {
      let [{ data: webInfo }, { data: navList }, { data: footerList }, { data: countryList }, { data: cateList }] =
        await Promise.all([
          context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
          context.$axiosApi(common.newslist.url, common.newslist.methods),
          context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
          context.$axiosApi(depot.getCountryList.url, depot.getCountryList.methods),
          context.$axiosApi(trademark.trademarkCate.url, trademark.trademarkCate.methods),
        ]);
      return {
        webInfo, // 网站信息
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
        countryList: getCountryList([...countryList]), //非热门国家
        hotCountryList: getHotCountryList(countryList), // 热门国家
        cateList,
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    this.handleSearchAttorney = debounce(this.handleSearchAttorney, 500);
    return {
      startValue: null,
      applyCountry: ['ALL'],
      selectCountry: [],
      valueTime: ["", ""],
      value: [],
      cateList: [],
      mapList: [],
      applyList: [],
      applyPrescriptionTrendList: [],
      trendList: [],
      timeList: {},
      distributionList: {},
      topLawyerList: {},
      topTrademarkList: {},
      smallList: {},
      trademarkList: [],
      barndPage: 1,
      monthArr: [],
      endOpenMonth: false,
      currentDate: "",
      speType: "COUNTRY",
      disType: "ALL",
      statissticsType: 1,
      applyStatus: "NO_ASSIGNED_TO_EXAMINER",
      cateSmall: "",
      cateBrand: "",
      loading: true,
      speardLoading: true,
      discountLoading: true,
      prescriptionTrendLoading: true,
      prescriptionTrendType:'ALL',
      prescriptionTrendStatus:'NO_ASSIGNED_TO_EXAMINER',
      timeLoading: true,
      agentLoading: true,
      applicantLoading: true,
      smallLoading: true,
      brandLoading: true,
      customize: false,
      timeRange: timeRangeList[1],
      timeRangeList,
      attorneyLoading: true,
      attorneyNameList:[{ name: ''}],
      attorneyName:'',
      isChildEmit: false,
      rangePickerOpen: false
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  mounted() {
    this.cateSmall = this.cateList[0].categoryNum;
    this.cateBrand = this.cateList[0].categoryNum;
    this.currentDate = moment().subtract(2, 'days').format('LL');
    let start = this.timeRange.value[0].format('YYYY-MM-DD');
    let end = this.timeRange.value[1].format('YYYY-MM-DD');
    this.valueTime = [start, end];
    this.searchData("init");
  },
  methods: {   
    searchBtn() {
      if (this.applyCountry.length === 0) {
        this.$message.error("最选择国家");
        return false;
      }
      let start = this.timeRange.value[0].format('YYYY-MM-DD');
      let end = this.timeRange.value[1].format('YYYY-MM-DD');
      if (!start || !end) {
        this.$message.error("请选择时间范围");
        return false;
      }
      this.valueTime = [start, end];
      if (this.applyCountry[0] === "ALL") {
        this.searchData();
        return false;
      }
      this.searchData();
    },
    // 搜索
    async searchData(type) {
      this.loading = true;
      this.speardLoading = true;
      this.discountLoading = true;
      this.prescriptionTrendLoading = true;
      this.timeLoading = true;
      this.agentLoading = true;
      this.applicantLoading = true;
      this.smallLoading = true;
      this.brandLoading = true;
      this.speType = "COUNTRY";
      this.applyStatus = "NO_ASSIGNED_TO_EXAMINER";
      this.cateSmall = [];
      this.cateBrand = this.cateList[0].categoryNum;
      let selectCountry = "";
      if (this.applyCountry[0] === "ALL") {
        selectCountry = [];
      } else {
        selectCountry = this.applyCountry;
      }
      this.selectCountry = selectCountry;
      try {
        let [
          { data: applyList },
          { data: trendList },
          { data: timeData },
          { data: distributionList },
          { data: topLawyerList },
          { data: topTrademarkList },
          { data: smallList },
          { data: trademarkList },
          { data: applyPrescriptionTrendList}
        ] = await Promise.all([
          this.$axiosApi(depot.getRegisgerDepot.url, depot.getRegisgerDepot.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 6,
            type: this.speType,
          }),
          this.$axiosApi(depot.getTrend.url, depot.getTrend.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 10,
            pageIndex: 1,
            type: this.disType,
            statissticsType: this.statissticsType
          }),
          this.$axiosApi(depot.getApplicationTime.url, depot.getApplicationTime.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 20,
            pageIndex: 1,
            applyStatus: this.applyStatus,
          }),
          this.$axiosApi(depot.getDistribution.url, depot.getDistribution.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 20,
            pageIndex: 1,
          }),
          this.$axiosApi(depot.getTopLawyer.url, depot.getTopLawyer.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 5,
            pageIndex: 1,
          }),
          this.$axiosApi(depot.getTopTrademark.url, depot.getTopTrademark.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 5,
            pageIndex: 1,
          }),
          this.$axiosApi(depot.getTopSmallCategory.url, depot.getTopSmallCategory.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 10,
            pageIndex: 1,
            categoryNum: "",
          }),
          this.$axiosApi(depot.getSearchTrademark.url, depot.getSearchTrademark.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 20,
            pageIndex: 1,
            categoryNum: this.cateList[0].categoryNum,
          }),
          this.$axiosApi(depot.getApplyPrescriptionTrendList.url, depot.getApplyPrescriptionTrendList.methods, {
            applyCountry: selectCountry,
            attorneyName: this.attorneyName,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            applyStatus: this.prescriptionTrendStatus,
            type: this.prescriptionTrendType
          })
        ]);        
        if (type === "init") {
          this.mapList = JSON.parse(JSON.stringify(applyList));
        }
        this.isChildEmit = false
        this.loading = false;
        this.speardLoading = false;
        this.discountLoading = false;
        this.prescriptionTrendLoading = false;
        this.timeLoading = false;
        this.agentLoading = false;
        this.applicantLoading = false;
        this.smallLoading = false;
        this.brandLoading = false;
        this.applyList = applyList;
        this.trendList = trendList;
        this.timeList = timeData;
        this.distributionList = distributionList;
        this.topLawyerList = topLawyerList;
        this.topTrademarkList = topTrademarkList;
        this.smallList = smallList;
        this.trademarkList = trademarkList;
        this.applyPrescriptionTrendList = applyPrescriptionTrendList
      } catch (error) {
        console.log(error);
      }
    },
    changePage(val) {
      this.brandData(1, val);
    },
    changeCategory(val) {
      this.cateBrand = val;
      let page = 1;
      this.brandData(page, val);
    },
    changeSmallPage(json) {
      this.cateSmall = json.categoryNum;
      this.smallData(json);
    },
    // 获取美标申请分布
    async changeSpeard(val) {
      this.speardLoading = true;
      this.speType = val;
      let { data } = await this.$axiosApi(depot.getRegisgerDepot.url, depot.getRegisgerDepot.methods, {
        applyCountry: this.selectCountry,
        attorneyName: this.attorneyName,
        startTime: this.valueTime[0],
        endTime: this.valueTime[1],
        pageSize: 6,
        type: this.speType,
      });
      this.speardLoading = false;
      this.applyList = data;
    },
    // 获取美标申请时效
    async changeStatusTime(obj) {
      this.timeLoading = true;
      this.applyStatus = obj.status;
      let { data } = await this.$axiosApi(depot.getApplicationTime.url, depot.getApplicationTime.methods, {
        applyCountry: obj.country === '全部' ? this.selectCountry : [obj.country],
        attorneyName: this.attorneyName,
        startTime: this.valueTime[0],
        endTime: this.valueTime[1],
        pageSize: 20,
        pageIndex: 1,
        applyStatus: obj.status,
      });
      this.timeLoading = false;
      this.isChildEmit = true
      this.timeList = data;      
    },
    // 美标申请趋势
    async changeDiscount(obj) {
      this.discountLoading = true;
      this.disType = obj.type;
      this.statissticsType = obj.statissticsType
      let { data } = await this.$axiosApi(depot.getTrend.url, depot.getTrend.methods, {
        attorneyName: this.attorneyName,
        applyCountry: this.selectCountry,
        startTime: this.valueTime[0],
        endTime: this.valueTime[1],
        pageSize: 10,
        pageIndex: 1,
        type: this.disType,
        statissticsType: this.statissticsType
      });
      this.discountLoading = false;
      this.trendList = data;
    },

    // 获取代理人商标数量
    async pageAgent(val) {
      this.agentLoading = true;
      let { data } = await this.$axiosApi(depot.getTopLawyer.url, depot.getTopLawyer.methods, {
        applyCountry: this.selectCountry,
        attorneyName: this.attorneyName,
        startTime: this.valueTime[0],
        endTime: this.valueTime[1],
        pageSize: 5,
        pageIndex: val,
      });
      this.agentLoading = false;
      this.topLawyerList = data;
    },
    // 获取持有人商标数量
    async pageTrademark(val) {
      this.applicantLoading = true;
      let { data } = await this.$axiosApi(depot.getTopTrademark.url, depot.getTopTrademark.methods, {
        applyCountry: this.selectCountry,
        attorneyName: this.attorneyName,
        startTime: this.valueTime[0],
        endTime: this.valueTime[1],
        pageSize: 5,
        pageIndex: val,
      });
      this.applicantLoading = false;
      this.topTrademarkList = data;
    },
    // 获取小类的数据
    async smallData(json) {
      this.smallLoading = true;
      let { data } = await this.$axiosApi(depot.getTopSmallCategory.url, depot.getTopSmallCategory.methods, {
        applyCountry: this.selectCountry,
        attorneyName: this.attorneyName,
        startTime: this.valueTime[0],
        endTime: this.valueTime[1],
        pageSize: 10,
        pageIndex: json.page,
        categoryNum: json.categoryNum,
      });
      this.smallLoading = false;
      this.smallList = data;
    },
    // 获取品牌的数据
    async brandData(page, val) {
      this.brandLoading = true;
      let { data } = await this.$axiosApi(depot.getSearchTrademark.url, depot.getSearchTrademark.methods, {
        applyCountry: this.selectCountry,
        attorneyName: this.attorneyName,
        startTime: this.valueTime[0],
        endTime: this.valueTime[1],
        pageSize: 20,
        pageIndex: page,
        categoryNum: val,
      });
      this.brandLoading = false;
      this.trademarkList = data;
    },
    // 获取申请时效走势
    async changeApplyPrescriptionTrend(obj) {
      this.prescriptionTrendLoading = true;
      let { data } = await this.$axiosApi(depot.getApplyPrescriptionTrendList.url, depot.getApplyPrescriptionTrendList.methods, {
        applyCountry: this.selectCountry,
        attorneyName: this.attorneyName,
        startTime: this.valueTime[0],
        endTime: this.valueTime[1],
        type: obj.type,
        applyStatus: obj.status
      });
      this.prescriptionTrendType = obj.type
      this.prescriptionTrendStatus = obj.status
      this.prescriptionTrendLoading = false;
      this.applyPrescriptionTrendList = data;
    },
    moment,
    // 点选申请人国家
    handleChangeApplyCountry(val, option){
      if(val.toString() !== 'ALL'){
        this.applyCountry = [...val].filter(item => item !== 'ALL')
      } 
    },
    // 点选时间范围
    handleChangeTimeRange(item){
      this.timeRange = item
      // key为3是自定义日期，隐藏本身标签，显示日期选择框
      if(item.key === 3){
        this.timeRangeList = timeRangeList.filter(o => o.key !==3)
        this.customize = true
        return
      }
      this.customize = false
      this.timeRangeList = [...timeRangeList]
    },
    // 日期选择
    handleRangePicker(dates){
      this.timeRange.value = dates
    },
    // 模糊查询律师
    async handleSearchAttorney(val){
      this.attorneyLoading = true
      this.attorneyNameList = []
      let { data } = await this.$axiosApi(depot.getAttorneyList.url, depot.getAttorneyList.methods, {
        keyWord: val,
        pageIndex: 1,
	      pageSize: 20
      });
      this.attorneyLoading = false
      this.attorneyNameList = data
      this.attorneyNameList.unshift({ name: ''})
    },
    //跳转到聚合商标列表页
    goToAggregated(params){
      let start = moment(this.valueTime[0]).format('YYYY-MM-DD')
      let end = moment(this.valueTime[1]).format('YYYY-MM-DD')
      // 判断收尾时间交差部分
      if(params.applyDateStr){
        let _start = params.applyDateStr.split(',')[0]
        let _end = params.applyDateStr.split(',')[1]
        start = moment(_start).isBefore(moment(start)) ? start :_start        
        end = moment(_end).isAfter(moment(end)) ? end : _end
      }
      let urlParams = {
        attorneyNameList:  this.attorneyName ? [this.attorneyName] : undefined,
        organizedList: this.selectCountry,
        ...params,
        applyDateStr: `${start},${end}`      
      }
      window.open(`/fastResult/aggregatedTrademarkList?${qs.stringify(urlParams)}`, '_blank');
    }
  },
};
</script>

<style lang="less" scoped>
.register {
  padding-top: 64px;
  background: #f6f7f9;
  .affix{
    position: relative;
    z-index: 10;
  }
  .header-search {
    background: #ffffff;
    .search-content {
      margin: 0 auto;
      display: flex;
      height: 80px;
      align-items: center;
      max-width: 1200px;
      .search-item{
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        border: 1px solid #D9D9D9;
        padding: 4px 14px 0;
        margin-right: 20px;
        width: 210px;
        height: 56px;
        label{
          font-size: 12px;
          color:#ccc;
        }
        .select{
          width: 180px;
          border:none;
          font-size: 12px;
        }
        /deep/ .ant-select-selection{
          border:none
        }
        /deep/ .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active{
          box-shadow: none;
        }
        /deep/ .ant-select-selection--multiple .ant-select-selection__placeholder,
        /deep/ .ant-select-selection--multiple .ant-select-selection__rendered, /deep/ .ant-select-selection__rendered{
          margin-left: 0;
        }
        /deep/ .ant-select-selection__rendered ul{
          width: 500px;
        }
      }
      .search-item-time{
        width: 410px;
        >div{
          display: flex;
          align-items: center;
          height: 32px;
          .labels{
            span{
              cursor: pointer;
              padding: 0 12px; 
              border-right: solid 1px #ddd;
            }
            :first-child{
              padding-left: 0;
            }
            :last-child{
              padding-right: 0 !important;
              border: none;
            }
            span.active{
              font-weight: 700;
              color:#333;
            }
          }
          .range-picker{
            width: 200px;
            margin-left: 10px;
          }
          /deep/ .ant-calendar-picker-input.ant-input{
            border:none;
            padding: 4px;
          }
          /deep/ .ant-calendar-picker-clear, .ant-calendar-picker-icon{
            right: 6px;
          }
        }
      }
      .btn{
        height: 56px;
        font-size: 16px;
        margin-right: 20px;
      }
      .search-tips{
        color: #999
      }

      span {
        font-size: 14px;
        color: @textColor4;
      }

      /deep/ .ant-btn-primary {
        background: #faad14;
        border-color: #faad14;
      }
    }
  }
  .brand-section {
    margin-bottom: 100px;
  }
  .content {
    margin: 0 auto;
  }
}
.opt-group-label{
    display: flex;
    align-items: center;
    img{
      margin-right: 5px;
    }
  }
</style>

