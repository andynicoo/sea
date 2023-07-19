<template>
  <div class="tags">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="tags-content ksy-w1320">
      <h2 class="title ksy-mt-3">标签</h2>
      <ul class="breadcrumb">
        <li>
          <NuxtLink to="/">首页</NuxtLink>
          &nbsp;/&nbsp;
        </li>
        <li>
          <NuxtLink to="/tags">首页标签</NuxtLink>
        </li>
      </ul>
      <ul class="letter-list">
        <li v-for="item in category" :key="item" :class="{ active: isActive === item }" @click="toggleCategory(item)">
          {{ item }}
        </li>
      </ul>
      <ol class="tag-list">
        <li v-for="(tag, index) in tagsList" :key="index">
          <span class="tag-name" @click="tagsDetails(tag)">{{ tag.labelName }}</span>
        </li>
        <li v-if="tagsList.length == 0" class="emtry">
          <span>暂无相关标签</span>
        </li>
      </ol>
      <div class="pagination ksy-text-center ksy-mt-4" v-show="tagsList.length">
        <a-pagination :current="Number(tagsListPage.current) || 1" :total="Number(tagsListPage.total) || 0"
          :pageSize="125" @change="change" />
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" :showBanner="false" />
  </div>
</template>

<script>
import tags from "@/apis/tags";
import common from "@/apis/common";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
export default {
  head() {
    return {
      title: '标签',
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: '标签',
        },
        {
          hid: "description",
          name: "description",
          content: '标签',
        },
      ],
    };
  },
  async asyncData(context) {
    try {

      let [
        { data: webInfo },
        { data: navList },
        { data: footerList },
      ] = await Promise.all([
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
      ]);
      // 资讯分页查询
      let { data } = await context.$axiosApi(tags.getTagsList.url, tags.getTagsList.methods, { current: 1, size: 125, character: "A" });
      let tagsList = data.records;
      let tagsListPage = {
        total: data.total,
        current: data.current,
      };
      return {
        webInfo, // 网站信息
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
        tagsList,
        tagsListPage
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      title: "VAT",
      isActive: "A",
      category: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  methods: {
    toggleCategory(letter) {
      this.isActive = letter;
      this.getTagList();
    },
    change(pageNo) {
      this.tagsListPage.current = pageNo;
      this.getTagList();
    },
    async getTagList() {

      let { data } = await this.$axiosApi(tags.getTagsList.url, tags.getTagsList.methods, { current: this.tagsListPage.current, size: 125, character: this.isActive });
      this.tagsList = data.records;
      this.tagsListPage = {
        total: data.total,
        current: data.current,
      };
    },
    tagsDetails(tags) {
      this.$router.push({
        path: '/tags/' + tags.id,
        query: {
          name: tags.labelName,
        },
      });
    }
  },
};
</script>

<style lang="less" scoped>
.tags-content {

  margin: 0 auto;
  padding: 64px 0;

  .title {
    font-size: 28px;
    color: @textColor;
    margin: 0;
  }

  .breadcrumb {
    font-size: 14px;
    margin: 0;
    display: flex;
    align-items: center;
    height: 50px;

    li {
      a {
        color: @textColor6;

        &:hover {
          color: @primaryClick;
        }
      }
    }
  }

  .letter-list {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    li {
      width: 58px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      border: 1px solid #bbbbbb;
      cursor: pointer;
      margin: 0 10px 10px 0;

      &.active,
      &:hover {
        color: @primaryClick;
        border-color: @primaryClick;
      }
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 28px;

    li {
      flex-basis: 20%;
      padding: 0 20px 16px 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      .tag-name {
        cursor: pointer;
        color: @textColor;

        &:hover {
          color: @primaryClick;
        }
      }
    }

    .emtry {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 90px 0 160px 0;
      flex: 1;

      img {
        margin-bottom: 16px;
      }

      span {
        font-size: 16px;
        color: @textColor;
      }
    }
  }

  &:deep(.ant-pagination-options) {
    display: none;
  }

  .pages {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 18px;
  }
}
</style>
