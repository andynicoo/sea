<template>
  <div class="hotnews" :class="hasBorder ? 'hasborder' : ''">
    <h2>热点资讯</h2>
    <div class="list" v-if="hotNewsList.length">
      <div class="item" v-for="(item, index) in hotNewsList" :key="index">
        <span>0{{ index + 1 }}</span>
        <div class="text">
          <h3>
            <nuxt-link :to="'/news/' + item.id"> {{ item.title }} </nuxt-link>
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    hasBorder: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    hotNewsList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.hotnews {
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  padding: 16px 26px;
  h2 {
    font-size: 16px;
    font-weight: bold;
    color: @textColor;
  }
  .list {
    border-top: 1px solid #e3e3e3;
    padding-top: 6px;
    .item {
      display: flex;
      margin-bottom: 6px;
      align-items: center;
      height: 44px;
      span {
        font-size: 24px;
        font-weight: 600;
        color: rgba(#000, .26);
      }
      .text {
        margin-left: 16px;
        h3 {
          .line-clamp(2);
          margin-bottom: 0;
          a {
            font-size: 14px;
            line-height: 22px;
            color: rgba(@textColor, .9);
          }
        }
        h3:hover {
          color: @primaryClick;
        }
      }
    }
    .item:nth-child(1) {
      span {
        color: @tagColor;
      }
    }
    .item:nth-child(2) {
      span {
        color: @warningColor;
      }
    }
    .item:nth-child(3) {
      span {
        color: @warningDisable;
      }
    }
  }
}
.hasborder {
  border: 1px solid #dcdcdc;
}
</style>
