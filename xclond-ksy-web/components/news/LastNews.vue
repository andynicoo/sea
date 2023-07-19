<template>
  <div class="lastnews ksy-mt-4">
    <div class="title">最新资讯</div>
    <div>
      <ul>
        <li v-for="(item, index) in newList" :key="index">
          <span></span>
          <nuxt-link :to="'/news/' + item.id" v-sensorsDire="{
            type: 'ClickArticle',
            event: 'click',
            getParams: () => ({
              information_kind: item.documentCategory.categoryName, // 资讯分类
              A_article_time: item.updateTime, // 文章时间
              article_source: item.author, // 文章来源
            }),
          }">
            {{ item.title }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    newList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  mounted() { },
  methods: {},
};
</script>

<style lang="less" scoped>
.lastnews {
  background: #fff;
  padding: 24px 36px 12px;

  .title {
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
    color: @textColor;
    margin-bottom: 10px;
  }

  ul {
    overflow: hidden;

    li {
      font-size: 14px;
      line-height: 31px;
      width: 43%;
      margin-right: 20px; // display: inline-block;
      .line-clamp(1);
      float: left;

      a {
        color: @textColor6;
      }

      span {
        width: 8px;
        height: 8px;
        background: #3a7fff;
        display: inline-block;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }

}
</style>
