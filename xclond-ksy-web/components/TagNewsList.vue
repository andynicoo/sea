<template>
  <div class="list">
    <a-spin :spinning="spinning">
      <div class="item" v-for="item in newsList" :key="item.id">
        <div class="img-wrap">
          <nuxt-link :to="'/news/' + item.id">
            <img v-lazy="item.mainPicUrl" :alt="item.title" :title="item.title" />
          </nuxt-link>
        </div>
        <div class="newitem">
          <h3 class="ellipsis">
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
          </h3>
          <!-- <div class="text line-clamp(2)" v-html="decodeURIComponent(item.content)"></div> -->
          <div class="newitem-bottom">
            <div class="text line-clamp(2)">
              {{ item.summary }}
            </div>
            <div class="other">
              <span> {{ item.updateTime }} </span><span style="margin-left: 16px">来源：{{ item.author }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import news from "@/apis/news";
export default {
  data() {
    return {
      spinning: false,
      newList: [],
    };
  },
  props: {
    newsList: {
      type: Array,
      default: () => { },
    },
  },
  mounted() { },
  watch: {},
  computed: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.list {
  width: 100%;
  // height: 216px;
  background: #ffffff;

  .item {
    border-bottom: 1px solid #e3e3e3;
    padding: 28px 0px;
    display: flex;

    .img-wrap {
      width: 284px;
      height: 160px;
      overflow: hidden;
      border-radius: 4px;
    }

    img {
      width: 284px;
      height: 160px;
      transition: all 0.4s ease 0s;
    }

    &:hover {
      img {
        transition: all 0.4s ease 0s;
        -webkit-transform: scale(1.1);
      }
    }

    .newitem {
      margin-left: 24px;
      flex: 1;
      width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      h3 {
        a {
          color: @textColor;
          font-size: 20px;
          font-weight: bold;
        }

        a:hover {
          color: @primaryHover;
        }
      }

      &-bottom {
        flex: 1;
        height: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .text {
          font-size: 14px;
          color: @textColor6;
          line-height: 22px;
          .line-clamp(2);
        }

        .other {
          color: @textColor4;
          line-height: 1em;
        }
      }
    }
  }
}

.pagination {
  margin-top: 33px;
  margin-bottom: 48px;
}
</style>
