<template>
  <div>
    <!-- banner start -->
    <div class="banner">
      <IndexBanner
        :list="bigBanner"
        v-if="bigBanner && bigBanner.length && getModulesStatus('homePage_topBanner')"
        :showData="NODE_PLA !== 'kby' && getModulesStatus('Home_dataShow')"
        style="height: 396px"
      />
    </div>
    <div class="ly-page">
      <div class="box-head">
        <div class="box-head-title"><img :src="titleImg" alt="" /></div>
        <div class="box-head-extend">
          <ul class="flex flex-c-c">
            <li class="flex flex-c-c active" v-for="(item, index) in typeCategory" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <LuodiCode :color="'white'" />
      </div>
      <div style="margin: 60px 0">
        <QuicklyPanel :goLink="false" />
      </div>
      <!-- 统计图 -->
      <div class="static-main">
        <LuodiCode /><br/>
        <div class="static-title">查美标数据，就上跨标云</div>
        <div class="center ksy-w1320 static-panel">
          <ul class="static-panel-hd flex flex-c">
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div class="static-panel-bd">
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
              @changeSpeard="changeSpeard"
              @changeDiscount="changeDiscount"
              @changeStatusTime="changeStatusTime"
              @changeApplyPrescriptionTrend="changeApplyPrescriptionTrend"
            />
          </div>
        </div>
        <div class="flex flex-c-c" style="margin-top: -20; margin-bottom: -80px">
          <LuodiCode />
        </div>
      </div>
      <!-- 美标律师排行榜 -->
      <!-- <div v-if="rank.length" class="rank-main">
        <div class="static-title">美标律师排行榜</div>
        <div class="rank-content flex flex-b center ksy-w1320">
          <div class="rank-content-item">
            <div class="hd flex flex-c">
              <b>2022</b>年律师排行榜<img src="~/assets/images/trademark/v230401/target/top-10.png" alt="" />
            </div>
            <div class="bd">
              <div class="bd-head flex flex-c-b">
                <span>排名</span>
                <span>律师</span>
                <span>代理量</span>
              </div>
              <div class="bd-body">
                <div
                  v-for="(rl, rlIndex) in rank[0].attorneyInfo.slice(0, 10)"
                  :key="rlIndex"
                  class="bd-body-item flex flex-c-b"
                >
                  <div class="bd-body-item-left">
                    <template v-if="rlIndex < 3">
                      <img :src="require(`@/assets/images/trademark/v230401/target/${rlIndex + 1}.png`)" alt="" />
                    </template>
                    <template v-else>{{ rlIndex + 1 }}</template>
                  </div>
                  <div class="bd-body-item-center ellipsis">{{ rl.attorneyName }}</div>
                  <div class="bd-body-item-right">{{ rl.agentVolume }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="rank-content-item">
            <div class="hd flex flex-c">
              <b>2023</b>年律师排行榜<img src="~/assets/images/trademark/v230401/target/top-10.png" alt="" />
            </div>
            <div class="bd">
              <div class="bd-head flex flex-c-b">
                <span>排名</span>
                <span>律师</span>
                <span>代理量</span>
              </div>
              <div class="bd-body">
                <div
                  v-for="(rl, rlIndex) in rank[1].attorneyInfo.slice(0, 10)"
                  :key="rlIndex"
                  class="bd-body-item flex flex-c-b"
                >
                  <div class="bd-body-item-left">
                    <template v-if="rlIndex < 3">
                      <img :src="require(`@/assets/images/trademark/v230401/target/${rlIndex + 1}.png`)" alt="" />
                    </template>
                    <template v-else>{{ rlIndex + 1 }}</template>
                  </div>
                  <div class="bd-body-item-center ellipsis">{{ rl.attorneyName }}</div>
                  <div class="bd-body-item-right">{{ rl.agentVolume }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-c-c" style="margin-top: -20; margin-bottom: -80px">
          <LuodiCode />
        </div>
      </div> -->
      <!-- 行业知名品牌商标 -->
      <div class="brandes-main">
        <h3>行业知名品牌商标</h3>
        <img src="~/assets/images/trademark/v230401/target/brandes.png" alt="" />
        <LuodiCode :color="'white'" />
      </div>
      <!-- 不能注册词库 -->
      <div class="disabled">
        <div class="disabled-main">
          <div class="static-title">不能注册词库</div>
          <div class="disabled-panel center ksy-w1320 flex">
            <div class="disabled-panel-left">
              <div
                v-for="(f, fi) in disabledFilters"
                :key="fi"
                :class="{ active: disabledVal === f.label }"
                @click="chooseDisabledVal(f)"
                @mouseenter="enterDisabled(f, fi)"
                @mouseleave="leaveDisabled(f, fi)"
                :ref="`dis${fi}`"
                class="item flex flex-c-c"
              >
                <img :ref="`img${fi}`" :src="disabledVal === f.label ? f['icon-a'] : f['icon-d']" alt="" /><span>{{
                  f.label
                }}</span
                ><i class="icon-right"></i>
              </div>
            </div>
            <div class="disabled-panel-right flex1">
              <ul class="hd flex flex-c">
                <li></li>
                <li></li>
                <li></li>
              </ul>
              <ul class="bd">
                <li v-for="(d, di) in disableList" :key="di" :style="geteRandomBg()">
                  {{ d.trademarkNameEn }}
                </li>
              </ul>
            </div>
          </div>
          <div class="bg">
            <img src="@/assets/images/trademark/v230401/target/disabled.png" alt="" />
          </div>
          <div class="flex flex-c-c" style="margin-top: -20; margin-bottom: -80px">
            <LuodiCode />
          </div>
        </div>
      </div>
    </div>
    <LuodiFooter />
  </div>
</template>
<script>
import Cookies from "js-cookie";
import common from "@/apis/common";
import trademark from "@/apis/trademark";
import depot from "@/apis/depot";
import { mapState } from "vuex";
import modulesAuth from "@/mixins/modules-auth";

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
      let [{ data: bigBanner }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "Precision_trademark_top_banner",
        }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);

      return {
        bigBanner: bigBanner, // 顶部banner
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
      titleImg: require("@/assets/images/trademark/v230401/title/target.png"),
      category: "查商标",
      disabledFilters: [
        {
          label: "常见人名",
          icon: require("@/assets/images/trademark/v230401/target/d-1.png"),
          "icon-d": require("@/assets/images/trademark/v230401/target/1-d.png"),
          "icon-a": require("@/assets/images/trademark/v230401/target/1-a.png"),
        },
        {
          label: "各行职业名称",
          icon: require("@/assets/images/trademark/v230401/target/d-2.png"),
          "icon-d": require("@/assets/images/trademark/v230401/target/2-d.png"),
          "icon-a": require("@/assets/images/trademark/v230401/target/2-a.png"),
        },
        {
          label: "行业或产品通用词",
          icon: require("@/assets/images/trademark/v230401/target/d-3.png"),
          "icon-d": require("@/assets/images/trademark/v230401/target/3-d.png"),
          "icon-a": require("@/assets/images/trademark/v230401/target/3-a.png"),
        },
        {
          label: "通用的姓氏",
          icon: require("@/assets/images/trademark/v230401/target/d-4.png"),
          "icon-d": require("@/assets/images/trademark/v230401/target/4-d.png"),
          "icon-a": require("@/assets/images/trademark/v230401/target/4-a.png"),
        },
        {
          label: "旅游景点",
          icon: require("@/assets/images/trademark/v230401/target/d-5.png"),
          "icon-d": require("@/assets/images/trademark/v230401/target/5-d.png"),
          "icon-a": require("@/assets/images/trademark/v230401/target/5-a.png"),
        },
        {
          label: "国家名字",
          icon: require("@/assets/images/trademark/v230401/target/d-6.png"),
          "icon-d": require("@/assets/images/trademark/v230401/target/6-d.png"),
          "icon-a": require("@/assets/images/trademark/v230401/target/6-a.png"),
        },
        {
          label: "知名城市",
          icon: require("@/assets/images/trademark/v230401/target/d-7.png"),
          "icon-d": require("@/assets/images/trademark/v230401/target/7-d.png"),
          "icon-a": require("@/assets/images/trademark/v230401/target/7-a.png"),
        },
      ],
      disabledVal: "常见人名",
      disableList: [],
      rank: [],
      applyList: [],
      applyPrescriptionTrendList: [],
      speType: "COUNTRY",
      disType: "ALL",
      applyStatus: "NO_ASSIGNED_TO_EXAMINER",
      prescriptionTrendLoading: true,
      prescriptionTrendType:'ALL',
      prescriptionTrendStatus:'NO_ASSIGNED_TO_EXAMINER',
      statissticsType: 1,
      selectCountry: [],
      mapList: [],
      trendList: [],
      timeList: {},
      applyCountry: [],
      valueTime: ["", ""],
      quickStr: ["apple", "huawei", "samsung"],
      loading: true,
      speardLoading: true,
      discountLoading: true,
      timeLoading: true,
    };
  },
  computed: {
    ...mapState("trademark", ["typeCategory"]),
  },
  methods: {
    // 搜索
    async getStaticData() {
      this.loading = true;
      this.speardLoading = true;
      this.discountLoading = true;
      this.timeLoading = true;
      this.speType = "COUNTRY";
      this.applyStatus = "NO_ASSIGNED_TO_EXAMINER";
      this.prescriptionTrendLoading = true;
      let selectCountry = "";
      if (this.applyCountry[0] === "ALL") {
        selectCountry = [];
      } else {
        selectCountry = this.applyCountry;
      }
      this.selectCountry = selectCountry;

      try {
        let [{ data: applyList }, { data: mapList }, { data: trendList }, { data: timeData }, { data: applyPrescriptionTrendList}] = await Promise.all([
          this.$axiosApi(depot.getRegisgerDepot.url, depot.getRegisgerDepot.methods, {
            applyCountry: selectCountry,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 6,
            type: this.speType,
          }),
          this.$axiosApi(depot.getRegisgerDepot.url, depot.getRegisgerDepot.methods, {
            applyCountry: selectCountry,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 6,
            type: this.speType,
          }),
          this.$axiosApi(depot.getTrend.url, depot.getTrend.methods, {
            applyCountry: selectCountry,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 10,
            pageIndex: 1,
            type: this.disType,
            statissticsType: this.statissticsType
          }),
          this.$axiosApi(depot.getApplicationTime.url, depot.getApplicationTime.methods, {
            applyCountry: selectCountry,
            startTime: this.valueTime[0],
            endTime: this.valueTime[1],
            pageSize: 20,
            pageIndex: 1,
            applyStatus: this.applyStatus,
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
        this.loading = false;
        this.speardLoading = false;
        this.discountLoading = false;
        this.timeLoading = false;
        this.applyList = applyList;
        this.mapList = mapList;
        this.trendList = trendList;
        this.timeList = timeData;
        this.applyPrescriptionTrendList = applyPrescriptionTrendList    
        this.prescriptionTrendLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getRecommended() {
      const params = {
        pageSize: 50,
        pageIndex: 1,
        type: 2,
        trademarkCategory: this.disabledVal,
      };
      const res = await this.$axiosApi(trademark.getRecommended.url, trademark.getRecommended.methods, params);
      if (res.code === 0) {
        this.disableList = res.data.records;
      }
    },
    async getAttorneyRank() {
      const res = await this.$axiosApi(trademark.getAttorneyRank.url, trademark.getAttorneyRank.methods);
      if (res.code === 0) {
        this.rank = res.data.filter((item) => {
          return ["2022", "2023"].includes(item.years);
        });
      }
    },
    async getData() {
      await this.getAttorneyRank();
      await this.getRecommended();
      await this.getStaticData();
    },
    enterDisabled(item, index) {
      this.$refs[`dis${index}`][0].classList.add("active");
      this.$refs[`img${index}`][0].src = item["icon-a"];
    },
    leaveDisabled(item, index) {
      if (this.disabledVal !== item.label) {
        this.$refs[`dis${index}`][0].classList.remove("active");
        this.$refs[`img${index}`][0].src = item["icon-d"];
      }
    },
    geteRandomBg() {
      const arr = [
        "linear-gradient(165deg, #EFF6FF 0%, #FFFFFF 66%)",
        "linear-gradient(165deg, #F3EFFF 0%, #FFFFFF 62%)",
        "linear-gradient(165deg, #EDF9FF 0%, #FFFFFF 66%)",
        "linear-gradient(168deg, #E9F6EB 0%, #FFFFFF 85%)",
      ];
      const index = Math.floor(Math.random() * 4) + 1;
      return {
        background: arr[index - 1],
      };
    },
    chooseDisabledVal(item) {
      this.disabledVal = item.label;
      this.getRecommended();
    },
    getLastDay(type) {
      var year = new Date().getFullYear(); //获取年份
      var month = new Date().getMonth() + 1; //获取月份
      if (type === "start") {
        if (month == 12) {
          month = 1;
        } else if (month <= 11) {
          month = month + 1;
          year = year - 1;
        }
      }
      var lastDate = type === "start" ? "01" : new Date(year, month, 0).getDate(); //获取当月最后一日
      month = month < 10 ? "0" + month : month; //月份补 0
      return [year, month, lastDate].join("-");
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
  },
  async mounted() {
    let end = this.getLastDay("end");
    let start = this.getLastDay("start");
    this.valueTime = [start, end];
    Cookies.set("categoryType", this.category);
    this.getData();
  },
};
</script>
<style lang="less" scoped>
@import url("~@/assets/css/trademark.less");
.ly-page {
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
  .box-head-extend {
    margin-bottom: 24px;
    ul {
      margin-bottom: 0;
      li {
        position: relative;
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        padding: 0 8px;
        margin: 0 16px;
        color: #ffffff;
        background: none;
        cursor: pointer;
        &.active {
          background: #fff;
          color: @primaryColor;
          border-radius: 4px;
          &::after {
            content: "";
            position: absolute;
            left: 50%;
            transform: translate(-50%, 28px);
            border: 10px solid transparent;
            border-top: 10px solid #fff;
          }
        }
      }
    }
  }
  .static {
    &-main {
      padding: 40px 0 0;
      margin-bottom: 100px;
      background: url("@/assets/images/trademark/v230401/target/bg-1.png") no-repeat left top / 100% auto;
    }
    &-title {
      text-align: center;
      font-size: 28px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
      margin-bottom: 48px;
    }
    &-panel {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 1200px;
      box-shadow: 4px 4px 34px 0px rgba(191, 197, 223, 0.3);
      border-radius: 24px 24px 24px 24px;
      border: 4px solid #ffffff;
      background: #fff;
      margin-bottom: 60px;
      &-hd {
        height: 56px;
        padding: 0 24px;
        margin: 0;
        li {
          width: 16px;
          height: 16px;
          background: #ef8892;
          border-radius: 50%;
          margin-right: 32px;
          &:nth-child(2) {
            background: #f0d265;
          }
          &:nth-child(3) {
            background: #72c78a;
          }
        }
      }
      &-bd {
        flex: 1;
        height: 0;
        padding: 0 24px;
        background: #f4f9ff;
      }
    }
    &-more {
      width: 260px;
      height: 64px;
      background: linear-gradient(270deg, #3370ff 0%, #33c2ff 100%);
      border-radius: 8px;
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      line-height: 26px;
      cursor: pointer;
      i {
        font-size: 30px;
        font-weight: 400;
        margin-left: 10px;
      }
    }
  }
  .rank {
    &-main {
      margin-bottom: 100px;
    }
    &-content {
      margin-bottom: 60px;
      &-item {
        width: 532px;
        height: 653px;
        background: #ffffff;
        box-shadow: 4px 4px 34px 0px rgba(191, 197, 223, 0.3);
        border-radius: 24px;
        overflow: hidden;
        .hd {
          height: 77px;
          font-size: 20px;
          font-weight: 500;
          color: #ffffff;
          padding: 10px 0 0 32px;
          background: linear-gradient(136deg, #33b6ff 0%, #3370ff 100%);
          box-shadow: 4px 4px 34px 0px rgba(191, 197, 223, 0.3);
          b {
            font-size: 24px;
            font-weight: 600;
            margin-right: 2px;
          }
          img {
            height: 38px;
            width: auto;
            margin-left: 12px;
            margin-bottom: 10px;
          }
        }
        .bd {
          padding: 24px 32px;
          &-head {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.4);
            line-height: 19px;
            margin-bottom: 18px;
            span {
              &:first-child {
                width: 74px;
              }
              &:nth-child(2) {
                flex: 1;
                width: 0;
              }
            }
          }
          &-body {
            font-size: 18px;
            color: rgba(0, 0, 0, 0.4);
            &-item {
              margin-bottom: 16px;
              &:last-child {
                margin-bottom: 0;
              }
              &-left {
                width: 74px;
                color: rgba(0, 0, 0, 0.4);
              }
              &-center {
                flex: 1;
                width: 0;
                font-weight: 500;
                color: #333333;
              }
              img {
                width: 50px;
                margin-top: -24px;
                margin-left: -2px;
              }
              &:first-child,
              &:nth-child(2),
              &:nth-child(3) {
                height: 51px;
                margin-bottom: 18px;
              }
              &:first-child {
                background: linear-gradient(130deg, #faebd2 0%, #fff0ee 50%, #ffffff 100%);
              }
              &:nth-child(2) {
                background: linear-gradient(130deg, #d6e2fc 0%, #e0edff 50%, #ffffff 100%);
              }
              &:nth-child(3) {
                background: linear-gradient(130deg, #ebd2ff 0%, #f8f0ff 50%, #ffffff 100%);
                margin-bottom: 16px;
              }
            }
          }
        }
      }
    }
  }
  .brandes {
    &-main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 862px;
      margin-bottom: 100px;
      background: url("@/assets/images/trademark/v230401/target/bg-2.png") no-repeat left top / 100% 100%;
      > img {
        width: 100%;
        margin: 48px 0 60px;
      }
      h3 {
        font-size: 28px;
        font-weight: 600;
        color: #ffffff;
        line-height: 40px;
      }
      .btn {
        width: 224px;
        height: 64px;
        background: linear-gradient(270deg, #ffffff 0%, #ffffff 100%);
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        font-weight: 500;
        color: @primaryColor;
      }
    }
  }
  .disabled {
    &-main {
      position: relative;
      margin-bottom: 84px;
      .bg {
        position: absolute;
        left: 50%;
        bottom: 200px;
        margin-left: 465px;
        z-index: -1;
        img {
          display: block;
          width: 270px;
        }
      }
    }
    &-panel {
      height: 530px;
      margin-bottom: 60px;
      &-left {
        width: 277px;
        margin-right: 24px;
        background: #ffffff;
        box-shadow: 4px 4px 34px 0px rgba(191, 197, 223, 0.3);
        border-radius: 24px 24px 24px 24px;
        border: 4px solid #ffffff;
        padding: 23px 16px;
        .item {
          height: 64px;
          border-radius: 10px;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.9);
          cursor: pointer;
          margin-bottom: 6px;
          padding: 0 28px;
          &.active {
            background: linear-gradient(90deg, #3370ff 0%, #3370ff 100%);
            color: #fff;
          }
          span {
            flex: 1;
            width: 0;
          }
          &:last-child {
            margin-bottom: 0;
          }
          img {
            width: 22px;
            margin-right: 10px;
          }
        }
      }
      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 0;
        background: #f5faff;
        box-shadow: 4px 4px 34px 0px rgba(191, 197, 223, 0.3);
        border-radius: 24px 24px 24px 24px;
        border: 4px solid #ffffff;
        .hd {
          height: 40px;
          background: #ffffff;
          box-shadow: 0px 4px 24px 0px rgba(220, 229, 244, 0.3);
          border-radius: 24px 24px 0px 0px;
          padding: 0 32px;
          margin: 0;
          li {
            width: 12px;
            height: 12px;
            background: #ef8892;
            margin-right: 16px;
            border-radius: 50%;
            &:nth-child(2) {
              background: #f0d265;
            }
            &:nth-child(2) {
              background: #72c78a;
            }
          }
        }
        .bd {
          flex: 1;
          height: 0;
          padding: 40px 30px 16px;
          overflow-y: auto;
          li {
            display: inline-flex;
            align-items: center;
            height: 38px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
            margin: 0 24px 24px 0;
            padding: 0 24px;
            border-radius: 24px 24px 24px 24px;
            border: 2px solid #ffffff;
          }
        }
      }
    }
  }
  /deep/ .standard {
    margin-bottom: 20px;
    .item {
      .left {
        width: 640px;
        height: 340px;
      }
      .right {
        height: 340px;
      }
    }
  }
}
</style>
