<template>
  <div class="lawyer">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="add">
      <img src="@/assets/images/depot/lawyer.png" alt="" />
    </div>
    <div class="line"></div>
    <div class="content">
      <div class="loading" v-if="loading">
        <a-spin size="large" />
      </div>
      <div class="nav">
        <div class="item">
          <div class="text" @click="enterALl">
            <div class="drop"></div>
            <div class="title">全部</div>
          </div>
          <div class="progress"></div>
        </div>
        <div v-for="(item, index) in rankList" :key="index" :class="{ item: true, active: item.years === year }">
          <div class="text" @click="changeYear(item.years)">
            <div class="drop"><span></span></div>
            <div class="title">{{ item.years }}</div>
          </div>
          <div class="progress"></div>
        </div>
      </div>
      <div class="section">
        <div class="item layerbox" v-for="(item, index) in rankData" :key="index">
          <div class="title">
            <span></span>
            <div class="text">{{ item.years }}年律师代理量排名</div>
          </div>
          <a-table
            :columns="columns"
            :data-source="item.attorneyInfo"
            :pagination="false"
            :rowKey="
              (record, index) => {
                return index;
              }
            "
          >
            <div
              slot="name"
              slot-scope="text, record, index"
              :class="{ rang: true, rang1: index == 0, rang2: index == 1, rang3: index == 2, rang4: index > 2 }"
            >
              <div v-if="index > 2">{{ index + 1 }}</div>
            </div>
            <div slot="attorneyName" slot-scope="text">
              <a-popover :title="null" placement="top">
                <template slot="content">
                  <a><span class="hand" @click="enterDetails(text)">查看律师代理所有商标</span></a>
                </template>
                <a-button type="link">{{ text }}</a-button>
              </a-popover>
            </div>
            <div slot="proportion" slot-scope="text">
              <a-progress :percent="parseFloat((Number(text) * 100).toFixed(2))" status="active" />
            </div>
          </a-table>
        </div>
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" :showBanner="false" />
  </div>
</template>

<script>
import common from "@/apis/common";
import depot from "@/apis/depot";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
export default {
  head() {
    return {
      title: "",
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
      let [{ data: webInfo }, { data: navList }, { data: footerList }] = await Promise.all([
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(depot.getLawyerRanking.url, depot.getLawyerRanking.methods),
      ]);
      return {
        webInfo, // 网站信息
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      year: "",
      title: "VAT",
      activeIndex: 0,
      cateList: [],
      NODE_PLA: process.env.NODE_PLA,
      loading: false,
      columns: [
        {
          title: "排名",
          dataIndex: "name",
          key: "name",
          width: 80,
          scopedSlots: { customRender: "name" },
        },
        {
          title: "律师",
          dataIndex: "attorneyName",
          key: "attorneyName",
          scopedSlots: { customRender: "attorneyName" },
        },
        {
          title: "代理量(marks)",
          dataIndex: "agentVolume",
          key: "agentVolume",
          width: 200,
          ellipsis: true,
        },
        {
          title: "百强占比",
          dataIndex: "proportion",
          key: "proportion",
          ellipsis: true,
          scopedSlots: { customRender: "proportion" },
        },
      ],
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  mounted() {
    this.year = this.$route.query.year;
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      let { data } = await this.$axiosApi(depot.getLawyerRanking.url, depot.getLawyerRanking.methods);
      let year = this.$route.query.year;
      this.loading = false;
      let rankData = data.filter((item) => item.years == year);
      this.rankList = data;
      this.rankData = rankData;
    },
    changeYear(year) {
      this.year = year;
      this.rankData = this.rankList.filter((item) => item.years == year);
    },
    enterDetails(val) {
      this.$router.push({
        path: "/fastResult/brandLawyer",
        query: {
          name: val,
        },
      });
    },
    enterALl() {
      this.$router.push({
        path: "/depot/lawyer",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.lawyer {
  padding-top: 64px;

  .add {
    background: @whiteTextColor;
    padding: 24px 0;
    border-top: 1px solid #e3e3e3;

    img {
      display: block;
      width: 1200px;
      height: 80px;
      margin: 0 auto;
    }
  }

  .line {
    height: 16px;
    background: #f6f7f9;
  }

  .content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    padding-top: 36px;
    position: relative;
    min-height: 200px;
    .loading {
      z-index: 999;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(255, 255, 255, 0.8);
      text-align: center;
      padding-top: 100px;
    }
    .nav {
      flex: 1;
      padding-left: 7px;
      background: #fff;

      .item {
        margin-top: -5px;

        .text {
          height: 22px;
          cursor: pointer;
          .drop {
            float: left;
            width: 8px;
            height: 8px;
            background: #999999;
            border-radius: 4px;
            margin-top: 7px;
          }

          .title {
            height: 22px;
            font-size: 14px;
            font-weight: 600;
            color: @textColor;
            line-height: 22px;
            float: left;
            margin-left: 12px;
          }
        }

        .progress {
          border-left: 1px dotted #999999;
          height: 50px;
          margin-left: 3px;
          margin-top: -5px;
        }
      }
      .item:hover {
        .drop {
          background: url("@/assets/images/depot/layerhover.png") no-repeat #fff;
          width: 20px;
          height: 20px;
          margin-left: -6px;
          margin-top: 1px;
        }
        .title {
          margin-left: 6px;
        }
      }
      .active:hover {
        .drop {
          width: 8px;
          height: 8px;
          margin-left: 0px;
          margin-top: 7px;
        }
        .title {
          margin-left: 12px !important;
        }
      }

      .active {
        margin-top: -3px;

        .text {
          .drop {
            background: @primaryColor;
            position: relative;

            span {
              width: 18px;
              height: 18px;
              border-radius: 9px;
              position: absolute;
              left: -5px;
              top: -5px;
              opacity: 1;
              border: 1px solid @primaryColor;
            }
          }

          .title {
            color: @primaryColor;
          }
        }

        .progress {
          margin-top: -3px;
        }
      }

      .item:first-of-type {
        margin-top: 0;
      }
    }

    .section {
      width: 1035px;

      .item {
        .title {
          display: flex;
          margin-bottom: 16px;

          span {
            width: 17px;
            height: 17px;
            background: url("@/assets/images/rang.svg") no-repeat;
            background-size: contain;
            margin-top: 3px;
            margin-right: 5px;
          }

          .text {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            color: @textColor;
            line-height: 24px;
          }
        }
      }
      /deep/ .ant-btn-link {
        color: @textColor;
        padding: 0 10px;
      }
      .rang {
        width: 26px;
        height: 24px;
        background-size: contain;
      }

      .rang1 {
        background: url("@/assets/images/rang1.svg") no-repeat;
      }

      .rang2 {
        background: url("@/assets/images/rang2.svg") no-repeat;
      }

      .rang3 {
        background: url("@/assets/images/rang3.svg") no-repeat;
      }

      .rang4 {
        width: 30px;
        height: 20px;
        background: url("@/assets/images/rang4.svg") no-repeat;

        div {
          text-align: center;
          color: @whiteTextColor;
        }
      }

      /deep/ .ant-progress-inner {
        background-color: #d9f5ea;

        .ant-progress-bg {
          background-color: #40d9b3;
        }
      }

      /deep/.ant-progress-outer {
        width: 90%;
      }

      .more-btn {
        display: flex;
        width: 120px;
        height: 32px;
        border-radius: 2px 2px 2px 2px;
        opacity: 1;
        border: 1px solid #dcdcdc;
        cursor: pointer;
        margin: 25px auto;

        div {
          flex: 1;
          font-size: 16px;
          color: @textColor;
          line-height: 30px;
          margin-left: 16px;
        }

        span {
          width: 16px;
          height: 16px;
          background: url("@/assets/images/arrowhead.svg") no-repeat;
          background-size: contain;
          margin-top: 8px;
          margin-right: 16px;
        }
      }
    }
  }
}
</style>

<style lang="less">
.layerbox {
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: #fff;
  }
}
</style>
