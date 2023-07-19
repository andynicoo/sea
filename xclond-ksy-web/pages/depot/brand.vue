<template>
  <div class="brand">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="add">
      <img src="@/assets/images/depot/brand.png" alt="" />
    </div>
    <div class="content">
      <div class="nav">
        <div class="title">行业知名品牌商标</div>
        <div class="brand-nav">
          <div
            v-for="(item, index) in cageList"
            :key="index"
            :class="{ 'nav-item': true, active: activeIndex == index }"
            @click="changeNav(index, item)"
          >
            <img :src="item.img" alt="" />
            <div class="name">{{ item.categoryName }}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="loading" v-if="loading">
          <a-spin size="large" />
        </div>
        <div class="title">
          <div class="text">知名品牌商标</div>
          <span @click="changeList">换一批</span>
        </div>
        <ul>
          <li v-for="(item, index) in list" :key="index">
            <img :src="item.image" alt="" v-if="item.image" />
            <div v-else class="text">{{ item.trademarkNameEn }}</div>
            <div class="name">{{ item.trademarkName }}</div>
          </li>
        </ul>
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
      title: "知名品牌库",
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
      let [{ data: webInfo }, { data: navList }, { data: footerList }, { data: cageList }, { data: recordList }] =
        await Promise.all([
          context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
          context.$axiosApi(common.newslist.url, common.newslist.methods),
          context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
          context.$axiosApi(depot.getCate.url, depot.getCate.methods, { type: 1 }),
          context.$axiosApi(depot.getWordBrand.url, depot.getWordBrand.methods, {
            type: 1,
            pageIndex: 1,
            pageSize: 35,
            trademarkCategory: "汽车品牌",
          }),
        ]);
      cageList.forEach((item) => {
        item.img = require("@/assets/images/depot/" + pinyin.getFullChars(item.categoryName) + ".svg");
      });
      return {
        webInfo, // 网站信息
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
        cageList,
        list: recordList.records,
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
      activeIndex: 0,
      page: 1,
      loading: false,
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  methods: {
    changeNav(index, item) {
      this.activeIndex = index;
      this.categoryName = item.categoryName;
      this.page = 1;
      this.getList();
    },
    async getList() {
      this.loading = true;
      let { data } = await this.$axiosApi(depot.getWordBrand.url, depot.getWordBrand.methods, {
        type: 1,
        pageIndex: this.page,
        pageSize: 35,
        trademarkCategory: this.categoryName,
      });
      this.loading = false;
      this.list = data.records;
    },
    changeList() {
      if (this.list.length < 35 && this.page === 1) {
        return false;
      } else if (this.list.length < 35 && this.page > 1) {
        this.page = 1;
      } else {
        this.page++;
      }
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

  .line {
    height: 16px;
    background: #f6f7f9;
  }

  .content {
    width: 1200px;
    margin: 16px auto 48px;
    display: flex;
    height: 830px;

    .nav {
      flex: 1;
      background: #fff;
      margin-right: 24px;

      .title {
        font-size: 14px;
        font-weight: 600;
        color: @textColor;
        line-height: 56px;
        padding-left: 24px;
      }

      .brand-nav::-webkit-scrollbar-thumb {
        display: block;
        width: 6px;
        margin: 0 auto;
        border-radius: 10px;
        background: #e3e3e3;
        border: none;
        /*内层轨道*/
      }

      .brand-nav::-webkit-scrollbar {
        background: #fff;
      }

      .brand-nav::-webkit-scrollbar-track-piece {
        background: #fff;
      }

      .brand-nav {
        height: 774px;
        overflow-y: auto;
        scrollbar-face-color: #333 !important;
        /*滚动条颜色*/
        scrollbar-shadow-color: #999 !important;
        /*滚动条阴影颜色*/

        .nav-item {
          display: flex;
          border-left: 1px solid #fff;
          cursor: pointer;
          padding-left: 60px;

          img {
            width: 22px;
            height: 22px;
            display: block;
            margin-top: 16px;
            margin-right: 4px;
          }

          .name {
            font-size: 14px;
            color: @textColor;
            line-height: 54px;
          }
          .name:hover {
            color: @primaryHover;
          }
        }

        .active {
          background: #f5f7fa;
          border-left: 2px solid @primaryColor;

          .name {
            color: @primaryColor;
          }
        }
      }
    }

    .section {
      width: 912px;
      background: #fff;
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
      .title {
        display: flex;
        border-bottom: 1px solid #e3e3e3;
        font-size: 14px;
        font-weight: 600;
        color: @textColor;
        line-height: 56px;
        padding: 0 24px;

        .text {
          flex: 1;
        }

        span {
          cursor: pointer;
        }
        span:hover {
          color: @primaryColor;
        }
      }

      ul {
        overflow: hidden;
        padding-top: 24px;
        padding-left: 24px;

        li {
          float: left;
          width: 160px;
          height: 90px;
          margin-right: 16px;
          margin-bottom: 16px;
          position: relative;
          border: 1px solid #dcdcdc;

          img {
            display: block;
            border: 1px solid #dcdcdc;
            width: 100%;
            height: 90px;
          }
          .text {
            width: 150px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            color: @textColor6;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            .line-clamp(1);
          }
          .name {
            font-size: 14px;
            color: @textColor6;
            line-height: 30px;
            text-align: center;
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            height: 0;
            transition: 0.1s all ease-in;
            background: #f5f7fa;
            .line-clamp(1);
          }
        }

        li:hover {
          .name {
            height: 30px;
          }
        }

        li:nth-child(5n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
