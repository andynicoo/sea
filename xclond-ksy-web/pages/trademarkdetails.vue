<template>
  <div class="search white-tips" ref="page">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <a-spin size="large" :spinning="spinning" tip="Loading...">
      <div class="trademarkdetails-center">
        <div class="trademarkdetails-head">
          <div class="center ksy-w1320">
            <a-breadcrumb separator="">
              <a-breadcrumb-item> 查商标 </a-breadcrumb-item>
              <a-breadcrumb-separator />
              <a-breadcrumb-item class="crumb-current"> 商标搜索结果 </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div class="trademarkdetails-head-info center ksy-w1320 flex flex-b">
            <div class="img">
              <template v-if="trademarkInfo.ossImageUrl">
                <a-popover :title="null" placement="bottom" trigger="click">
                  <template slot="content">
                    <img :src="trademarkInfo.ossImageUrl" style="width: 500px" />
                  </template>
                  <img :src="trademarkInfo.ossImageUrl" class="hand" />
                </a-popover>
              </template>
              <template v-else>{{ trademarkInfo.similarRemark }}</template>
            </div>
            <div class="content flex1">
              <div class="content-top ellipsis" style="max-width: 900px">{{ trademarkInfo.similarRemark }}</div>
              <div class="content-bottom">
                <dl>
                  <dt>申请号：</dt>
                  <dd>{{ trademarkInfo.remarkNumber || "--" }}</dd>
                </dl>
                <dl>
                  <dt>注册号：</dt>
                  <dd>{{ trademarkInfo.registrationNumber || "--" }}</dd>
                </dl>
                <dl>
                  <dt>首次使用日期：</dt>
                  <dd>{{ trademarkInfo.firstUseDate || "--" }}</dd>
                </dl>
                <dl>
                  <dt>申请日期：</dt>
                  <dd>{{ trademarkInfo.applyDate || "--" }}</dd>
                </dl>
                <dl>
                  <dt>注册日期：</dt>
                  <dd>{{ trademarkInfo.registrationDate || "--" }}</dd>
                </dl>
                <dl>
                  <dt>商业使用日期：</dt>
                  <dd>{{ trademarkInfo.commerceUseDate || "--" }}</dd>
                </dl>
              </div>
            </div>
            <div class="btn">
              <a-button v-if="monitStatusFlag" @click="monitTrademarkHandle(trademarkInfo)">取消监测</a-button>
              <a-button v-else type="primary" @click="monitTrademarkHandle(trademarkInfo)">监测商标</a-button>
            </div>
          </div>
          <!-- 锚点 -->
          <div class="center ksy-w1320">
            <a-anchor :offsetTop="210" :targetOffset="300" wrapperClass="my-anchor">
              <a-anchor-link v-for="(an, index) in anchores" :key="index" :href="an.href" :title="an.title" />
            </a-anchor>
          </div>
        </div>
        <div style="height: 100px"></div>
        <div class="main center ksy-w1320">
          <div class="flex flex-b">
            <div class="flex1" style="margin-right: 24px; width: 0">
              <div id="box1" class="trademark-card">
                <dt>商标状态</dt>
                <dd>
                  <table class="trademark-table">
                    <tr>
                      <td class="trademark-table-label">当前状态</td>
                      <td class="w-333">{{ trademarkInfo.oneStatusName || "--" }}</td>
                      <td class="trademark-table-label">状态日期</td>
                      <td class="w-333">{{ trademarkInfo.statusDate || "--" }}</td>
                    </tr>
                    <tr>
                      <td class="trademark-table-label">状态文件</td>
                      <td colspan="3">
                        <!-- 定位锚点 -->
                        <a @click="ansorMove('box7')" href="javascript:void(0);">查看文件</a>
                      </td>
                    </tr>
                  </table>
                </dd>
              </div>
              <div class="trademark-card">
                <dt>申请人信息</dt>
                <dd id="box2">
                  <table class="trademark-table">
                    <tr>
                      <td class="trademark-table-label">申请人</td>
                      <td class="w-333">
                        <a-tooltip v-if="trademarkInfo.ownerName" :getPopupContainer="() => $refs.page">
                          <template slot="title">
                            <a :href="`/fastResult/brandPersonnel?name=${trademarkInfo.ownerName}`"
                              >查看申请人所有商标</a
                            >
                          </template>
                          {{ trademarkInfo.ownerName }}
                        </a-tooltip>
                        <span v-else>--</span>
                      </td>
                      <td class="trademark-table-label">申请地址</td>
                      <td class="w-333">{{ trademarkInfo.ownerAddress || "--" }}</td>
                    </tr>
                    <tr>
                      <td class="trademark-table-label">法人类型</td>
                      <td class="w-333">{{ trademarkInfo.legalType || "--" }}</td>
                      <td class="trademark-table-label">申请地区</td>
                      <td class="w-333">{{ trademarkInfo.organizedZh || "--" }}</td>
                    </tr>
                  </table>
                </dd>
              </div>
              <div class="trademark-card">
                <dt>分类信息</dt>
                <dd id="box3">
                  <table class="trademark-table">
                    <tr>
                      <td class="trademark-table-label">大类</td>
                      <td colspan="3">
                        <span v-for="(big, bIndex) in trademarkInfo.trademarkCategoryList" :key="bIndex"
                          >{{ +big.categoryNum > 9 ? big.categoryNum : `0${big.categoryNum}` }}
                          {{ big.categoryName }}；</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <td class="trademark-table-label">小类</td>
                      <td colspan="3">
                        <span v-for="(small, sIndex) in trademarkInfo.remarkSmallCategory" :key="sIndex"
                          >{{ small }}；</span
                        >
                      </td>
                    </tr>
                  </table>
                </dd>
              </div>
              <div class="trademark-card">
                <dt>宣誓续展信息</dt>
                <dd id="box4">
                  <img
                    src="~assets/images/trademark/v230401/bg-info.png"
                    alt="宣誓续展信息"
                    style="display: block; width: 792px; margin-bottom: 24px"
                  />
                  <table class="trademark-table">
                    <tr>
                      <td class="trademark-table-label">商标有效期</td>
                      <td colspan="3">{{ trademarkInfo.remarkEffectiveDate || "--" }}</td>
                    </tr>
                    <tr>
                      <td class="trademark-table-label">宣誓日期</td>
                      <td colspan="3">
                        <template v-if="trademarkInfo.remarkSwornDate">
                          {{ trademarkInfo.remarkSwornDate }}
                        </template>
                        <template v-if="trademarkInfo.remarkPaySwornDate">
                          （{{ trademarkInfo.remarkPaySwornDate }}为额外付费宣示日期）
                        </template>
                        <template v-if="!(trademarkInfo.remarkSwornDate && trademarkInfo.remarkPaySwornDate)">
                          --
                        </template>
                      </td>
                    </tr>
                    <tr>
                      <td class="trademark-table-label">续展日期</td>
                      <td class="w-333">{{ trademarkInfo.remarkRenewalDate || "--" }}</td>
                      <td class="trademark-table-label">宽展日期</td>
                      <td class="w-333">{{ trademarkInfo.remarkBroadspreadDate || "--" }}</td>
                    </tr>
                  </table>
                </dd>
              </div>
              <div class="trademark-card">
                <dt>律师/代理机构信息</dt>
                <dd id="box5">
                  <table class="trademark-table">
                    <tr>
                      <td class="trademark-table-label">代理律师</td>
                      <td>
                        <a-tooltip v-if="trademarkInfo.attorneyName" :getPopupContainer="() => $refs.page">
                          <template slot="title">
                            <a :href="`/fastResult/brandLawyer?name=${trademarkInfo.attorneyName}`"
                              >查看律师代理所有商标</a
                            >
                          </template>
                          {{ trademarkInfo.attorneyName }}
                        </a-tooltip>
                        <span v-else>--</span>
                      </td>
                      <td class="trademark-table-label">案卷编号</td>
                      <td>
                        {{ trademarkInfo.attorneyNumber || "--" }}
                      </td>
                    </tr>
                    <tr>
                      <td class="trademark-table-label">律师邮箱</td>
                      <td colspan="3">{{ trademarkInfo.attorneyEmail || "--" }}</td>
                    </tr>
                    <tr>
                      <td class="trademark-table-label">联系方式</td>
                      <td class="w-333">{{ trademarkInfo.correspondentName || "--" }}</td>
                      <td class="trademark-table-label">联系邮箱</td>
                      <td class="w-333">{{ trademarkInfo.correspondenEmail || "--" }}</td>
                    </tr>
                    <tr>
                      <td class="trademark-table-label">联系电话</td>
                      <td colspan="3">{{ trademarkInfo.phone || "--" }}</td>
                    </tr>
                  </table>
                </dd>
              </div>
              <div class="trademark-card">
                <dt>商标流程信息</dt>
                <dd id="box6">
                  <table class="trademark-table">
                    <tr v-for="(row, rIndex) in trademarkInfo.remarkFlows" :key="rIndex">
                      <td class="trademark-table-label">{{ row.history_date || "--" }}</td>
                      <td>{{ row.history_Description || "--" }}</td>
                    </tr>
                  </table>
                </dd>
              </div>
              <div class="trademark-card">
                <dt>商标文件</dt>
                <dd id="box7">
                  <table class="trademark-table">
                    <tr v-for="(file, fIndex) in trademarkInfo.remarkFiles" :key="fIndex">
                      <td class="trademark-table-label">{{ file.Create_Mail_Date || "--" }}</td>
                      <td colspan="3">
                        <div class="flex flex-c-b" v-if="file.Document_Description && file.Document_Description_href">
                          <span>{{ file.Document_Description }}</span>
                          <a :href="file.Document_Description_href" target="_blank">查看文件</a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </dd>
              </div>
            </div>
            <FastResultRightCard />
          </div>
        </div>
      </div>
    </a-spin>
    <!-- 人工审核弹窗 -->
    <!-- <ManualVer /> -->
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapState } from "vuex";
import common from "@/apis/common";
import trademark from "@/apis/trademark";
import { createVNode } from "vue";
// 官网模块列表权限 是否显示
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
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  data() {
    return {
      trademarkInfo: {},
      searchText: "", // 搜索值
      searchedText: "", // 搜过的值
      countryCode: "US",
      isLogin: false,
      trademarkStatus: {
        AnnouncementPeriod: "公告期",
        AuditPeriod: "审核期",
        Active: "已注册",
        Inactive: "已失效",
        Pending: "注册中",
        RegistrationFail: "注册异常",
      },
      monitStatusFlag: false,
      spinning: false,
      anchores: [
        {
          title: "商标状态",
          href: "#box1",
        },
        {
          title: "申请人信息",
          href: "#box2",
        },
        {
          title: "分类信息",
          href: "#box3",
        },
        {
          title: "宣誓信息",
          href: "#box4",
        },
        {
          title: "律师信息",
          href: "#box5",
        },
        {
          title: "商标流程信息",
          href: "#box6",
        },
        {
          title: "商标文件",
          href: "#box7",
        },
      ],
      anchoresShow: false,
    };
  },
  computed: {
    ...mapState({
      isLogined: (state) => state.isLogined,
    }),
  },
  async created() {
    let params = {
      remarkNumber: this.$route.query.id,
      countryCode: this.$route.query.countryCode,
    };
    this.spinning = true;
    let res = await this.$axiosApi(
      trademark.getTrademarkDetail.url,
      trademark.getTrademarkDetail.methods,
      params,
      true
    );

    this.spinning = false;
    if (!process.server && this.$route.query.anchor) {
      document.querySelector("html").scrollTo({
        top: 0,
      });
    }
    setTimeout(() => {
      this.anchoresShow = true;
      if (!process.server && this.$route.query.anchor) {
        let topNum = document.querySelector("#" + this.$route.query.anchor).getBoundingClientRect().top - 300;
        document.querySelector("html").scrollTo({
          top: topNum,
          behavior: "smooth",
        });
      }
    }, 100);

    this.trademarkInfo = res.data;
    if (this.trademarkInfo.monitStatus) {
      this.monitStatusFlag = true;
    }
    if (this.trademarkInfo.remarkFlows) {
      this.$set(this.trademarkInfo, "remarkFlows", eval("(" + this.trademarkInfo.remarkFlows + ")").data);
      console.log(this.trademarkInfo.remarkFlows);
    } else {
      this.trademarkInfo.remarkFlows = [];
    }
    if (this.trademarkInfo.remarkFiles) {
      this.$set(this.trademarkInfo, "remarkFiles", eval("(" + this.trademarkInfo.remarkFiles + ")").data);
    } else {
      this.trademarkInfo.remarkFiles = [];
    }
  },
  mounted() {
    const token = Cookies.get("token");
    const sid = Cookies.get("sessionId");
    if (token && sid) {
      this.isLogin = true;
    }
  },
  methods: {
    ansorMove(ansor) {
      setTimeout(() => {
        this.anchoresShow = true;
        if (!process.server) {
          let topNum = document.querySelector("#" + ansor || "box1").getBoundingClientRect().top - 300;
          document.querySelector("html").scrollTo({
            top: topNum,
            behavior: "smooth",
          });
        }
      }, 100);
    },
    async monitTrademarkHandle(trademarkInfo) {
      let isLogin = false;
      let token = Cookies.get("token");
      let sid = Cookies.get("sessionId");
      if (token && sid) {
        isLogin = true;
      }
      if (isLogin && trademarkInfo) {
        let params = {
          action: this.monitStatusFlag ? 1 : 0,
          countryCode: this.$route.query.countryCode,
          remarkNumber: trademarkInfo.remarkNumber,
          trademarkCategoryNum: trademarkInfo.resultClassNum[0],
        };
        await this.$axiosApi(trademark.monitTrademark.url, trademark.monitTrademark.methods, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        this.monitStatusFlag = !this.monitStatusFlag;
        this.$message.success("操作成功！");
      } else {
        this.$store.commit("setLoginPopData", { show: true });
        this.$nextTick(() => {
          this.$bus.$emit("loginVisiable", { type: 4 });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.w-333 {
  width: 333px;
}
.trademarkdetails-center {
  background: #f5f7fa;
  min-height: 500px;
  position: relative;
  .trademarkdetails-center-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 168px;
    background: linear-gradient(180deg, #dee7fd 0%, #f5f7fa 100%);
  }

  .center {
    position: relative;
  }
  .main {
    padding-top: 174px;
  }
  /deep/ .ant-affix {
    z-index: 100;
  }
  /deep/ .ant-anchor-wrapper {
    margin: 0;
    padding: 0;
    background: none;
    .ant-anchor-ink {
      display: none;
    }
    .ant-anchor-link {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 46px;
      margin-right: 24px;
      padding: 0;
      font-size: 14px;
      color: #606266;
      &-active {
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 56px;
          height: 2px;
          background: @primaryColor;
        }
      }
    }
    .ant-anchor {
      padding: 0;
      display: flex;
      align-items: flex-end;
    }
  }
}

.trademarkdetails-head {
  // padding: 78px 0 24px;
  padding-top: 12px;
  position: fixed;
  width: 100%;
  top: 64px;
  z-index: 10;
  background: linear-gradient(180deg, #dee7fd 0%, #f5f7fa 100%);
  &-info {
    margin-top: 24px;
    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      height: 88px;
      overflow: hidden;
      margin-right: 24px;
      img {
        display: block;
        width: 100%;
      }
    }
    .content {
      &-top {
        font-size: 24px;
        margin-bottom: 8px;
        font-weight: 500;
        color: #303132;
        line-height: 32px;
      }
      &-bottom {
        display: grid;
        grid-column-gap: 4px;
        grid-template-columns: repeat(3, auto);
        justify-content: space-between;
        width: 645px;
        dl {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #606266;
          line-height: 22px;
          margin-bottom: 0;
          * {
            margin-bottom: 0;
          }
          &:nth-child(3n) {
            dt {
              width: 98px;
            }
          }
          dt {
            color: #919498;
            width: 70px;
            margin-right: 8px;
          }
        }
      }
    }
  }
}

.monitoring-trademark-btn {
  position: absolute;
  top: 0;
  right: 20.83333333%;
}

.trademark-card {
  background: #fff;
  padding: 24px;
  width: 100%;
  min-height: 150px;
  margin-bottom: 24px;

  dt {
    color: rgba(0, 0, 0, 0.9);
    font-size: 16px;
    margin-bottom: 20px;
  }
}

.trademark-table {
  width: 100%;
  border: 1px solid #e3e3e3;

  td {
    border: 1px solid #e3e3e3;
    padding: 12px;
    word-break: break-all;
  }

  .trademark-table-label {
    background: #f5f7fa;
    width: 130px;
  }

  .trademark-table-content {
    width: 400px;
  }
}

.trademark-process {
  margin-top: 75px;
  height: 15px;

  /deep/.ant-steps-item-container {
    position: relative;

    .ant-steps-item-content {
      position: relative;
      top: -65px;

      .ant-steps-item-title {
        font-size: 14px;
      }

      .ant-steps-item-description {
        color: rgba(0, 0, 0, 0.4);
        font-size: 12px;
      }
    }
  }

  /deep/.ant-steps-item-tail::after {
    height: 1px;
    margin-top: 1px;
  }
}

.trademark-knowledge {
  p {
    color: rgba(0, 0, 0, 0.4);
    position: relative;
    margin-bottom: 0;
    padding-left: 15px;

    &::before {
      content: "";
      position: absolute;
      width: 5px;
      height: 5px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      top: 9px;
      left: 3px;
    }
  }
}

.search-login-tips {
  .ant-modal-wrap .anticon-question-circle {
    display: none;
  }

  .ant-modal-confirm-content,
  .ant-modal-confirm-title {
    margin-left: 0 !important;
    text-align: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }

  .ant-modal-confirm-title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 24px;
  }

  .ant-modal-confirm-btns {
    width: 100%;
    text-align: center;
  }

  .ant-btn-primary {
    margin-left: 24px !important;
  }
}

.crumb-current {
  color: #303132;
}

.resultClassNum-box {
  display: inline-block;
  max-width: 330px;
  word-wrap: break-word;
}

.oss-image {
  max-width: 300px;
}
</style>
