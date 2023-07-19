<template>
  <div class="brand">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="add">
      <img src="@/assets/images/depot/word.png" alt="" />
    </div>
    <div class="content">
      <div class="nav wordlist">
        <a-tabs default-active-key="0" @change="changCate" v-if="isShow">
          <a-tab-pane v-for="(item, index) in cageList" :key="index">
            <div slot="tab" class="item">
              <img :src="item.img" alt="" />
              <div class="name">{{ item.categoryName }}</div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="section">
        <div class="loading" v-if="loading">
          <a-spin size="large" />
        </div>
        <ul>
          <li v-for="(item, index) in list" :key="index">{{ item.trademarkNameEn }}</li>
        </ul>
        <div class="pagination ksy-text-right ksy-mt-4" v-show="list.length">
          <a-pagination
            :current="Number(listPage.current) || 1"
            :total="Number(listPage.total) || 0"
            :pageSize="Number(listPage.size)"
            @change="change"
          />
        </div>
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" :showBanner="false" />
  </div>
</template>

<script>
import pinyin from "js-pinyin";
import common from "@/apis/common";
import depot from "@/apis/depot";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
export default {
  head() {
    return {
      title: "不建议注册词库",
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
      let [{ data: webInfo }, { data: navList }, { data: footerList }, { data: cageList }] = await Promise.all([
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(depot.getCate.url, depot.getCate.methods, { type: 2 }),
      ]);

      cageList.forEach((item) => {
        item.img = require("@/assets/images/depot/" + pinyin.getFullChars(item.categoryName) + ".svg");
      });
      let categoryName = cageList[0].categoryName;
      return {
        webInfo, // 网站信息
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
        cageList,
        categoryName,
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      isShow: false,
      title: "VAT",
      cateList: [],
      NODE_PLA: process.env.NODE_PLA,
      wordIndex: 0,
      list: [],
      listPage: {
        current: 1,
        total: 1,
        size: 30,
      },
      categoryName: "",
      loading: false,
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  mounted() {
    this.isShow = true;
    this.getList();
  },
  methods: {
    async changeWord(index) {
      this.wordIndex = index;
      let { data } = await this.$axiosApi(depot.getWordBrand.url, depot.getWordBrand.methods, {
        type: 1,
        pageIndex: 1,
        pageSize: 35,
        trademarkCategory: item.categoryName,
      });
      this.list = data.records;
    },
    changCate(index) {
      let name = this.cageList[index].categoryName;
      this.listPage.current = 1;
      this.categoryName = name;
      this.getList();
    },
    async getList() {
      this.loading = true;
      let { data } = await this.$axiosApi(depot.getWordBrand.url, depot.getWordBrand.methods, {
        type: 2,
        pageIndex: this.listPage.current,
        pageSize: 30,
        trademarkCategory: this.categoryName,
      });
      this.loading = false;
      this.list = data.records;
      // this.listPage.total = data.total
      this.listPage.total = data.total;
    },
    async change(pageNo) {
      this.listPage.current = pageNo;
      // this.changCate();
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.brand {
  padding-top: 64px;
  background: #f6f7f9;

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

  .content {
    width: 1200px;
    margin: 16px auto 48px;

    .nav {
      background: #fff;
      padding: 0 24px;

      .item {
        width: 124px;
        height: 76px;

        img {
          display: block;
          width: 22px;
          height: 22px;
          margin: 10px auto 12px;
        }

        .name {
          text-align: center;
        }
      }

      /deep/.ant-tabs-bar {
        margin-bottom: 1px;
        border: none;
      }

      /deep/ .ant-tabs-nav {
        .ant-tabs-tab {
          margin-right: 16px;
          padding: 12px 0;
        }
      }

      /deep/ .anticon {
        font-size: 24px;
      }

      /deep/ .ant-tabs-tab-active {
        background: #f5f7fa;
      }
    }

    .section {
      margin-top: 16px;
      background: #fff;
      padding: 24px;
      position: relative;
      .loading {
        z-index: 999;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        padding-top: 200px;
      }
      .word-nav {
        font-size: 14px;
        color: @textColor;
        line-height: 30px;
        overflow: hidden;

        div {
          float: left;
          margin-right: 4px;
        }

        span {
          float: left;
          padding: 0 10px;
          margin-right: 8px;
          cursor: pointer;
        }

        .active {
          background: #f5f7fa;
          border-radius: 1px;
          color: @primaryColor;
        }
      }

      > ul {
        overflow: hidden;
        margin-top: 19px;
        min-height: 305px;
        li {
          float: left;
          width: 176px;
          height: 42px;
          border: 1px solid #dcdcdc;
          font-size: 14px;
          color: @textColor;
          line-height: 42px;
          text-align: center;
          margin-right: 19px;
          margin-bottom: 19px;
          padding: 0 5px;
          .line-clamp(1);
        }

        li:nth-child(6n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
