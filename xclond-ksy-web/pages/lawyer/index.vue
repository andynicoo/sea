<template>
  <div class="lawyer">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="add">
      <img src="" alt="" />
    </div>
    <div class="content">
      <div class="nav">
        <div class="item">
          <div class="text">
            <div class="drop"></div>
            <div class="title">全部</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="item active">
          <div class="text">
            <div class="drop"><span></span></div>
            <div class="title">2023</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="item">
          <div class="text">
            <div class="drop"></div>
            <div class="title">2022</div>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="section">
        <div class="item">
          <div class="title">
            <span></span>
            <div class="text">2023年律师代理量排名</div>
          </div>
          <a-table :columns="columns" :data-source="data" :pagination="false">
            <div
              slot="name"
              slot-scope="text, record, index"
              :class="{ rang: true, rang1: index == 0, rang2: index == 1, rang3: index == 2, rang4: index > 2 }"
            >
              <div v-if="index > 2">{{ index + 1 }}</div>
            </div>
            <div slot="address2">
              <a-progress :percent="50" status="active" />
            </div>
          </a-table>
          <div class="more-btn">
            <div>展开更多</div>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" :showBanner="false" />
  </div>
</template>

<script>
import common from "@/apis/common";
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
      title: "VAT",
      cateList: [],
      NODE_PLA: process.env.NODE_PLA,
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
          dataIndex: "age",
          key: "age",
          width: 100,
        },
        {
          title: "代理量(marks)",
          dataIndex: "address",
          key: "address 1",
          ellipsis: true,
        },
        {
          title: "百强占比",
          dataIndex: "address",
          key: "address 2",
          ellipsis: true,
          scopedSlots: { customRender: "address2" },
        },
      ],
      data: [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. ",
          tags: ["nice", "developer"],
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 2",
          tags: ["loser"],
        },
        {
          key: "3",
          name: "Joe Black",
          age: 32,
          address: "Sidney No.",
          tags: ["cool", "teacher"],
        },
        {
          key: "3",
          name: "Joe Black",
          age: 32,
          address: "Sidney No.",
          tags: ["cool", "teacher"],
        },
      ],
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  methods: {},
};
</script>

<style lang="less" scoped>
.lawyer {
  padding-top: 64px;

  .add {
    background: @whiteTextColor;
    padding: 24px 0;

    img {
      display: block;
      width: 1200px;
      height: 80px;
      margin: 0 auto;
    }
  }

  .content {
    width: 1200px;
    margin: 0 auto;
    display: flex;

    .nav {
      flex: 1;
      padding-left: 7px;

      .item {
        margin-top: -5px;

        .text {
          height: 22px;

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

        .line {
          border-left: 1px dotted #999999;
          height: 50px;
          margin-left: 3px;
          margin-top: -5px;
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

        .line {
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
            width: 14px;
            height: 14px;
            background: url("@/assets/images/rang.svg") no-repeat;
            background-size: contain;
            margin-top: 5px;
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
