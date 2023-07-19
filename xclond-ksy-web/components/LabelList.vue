<template>
  <div class="hotnews">
    <p>相关热门标签</p>
    <div class="list" v-if="labelList.length">
      <a-row :gutter="8">
        <!-- <nuxt-link :to="'/news/' + item.id">  -->
        <!-- {{ item.labelName }} -->
        <!-- </nuxt-link> -->
        <a-col class="gutter-row item" :span="11" v-for="(item, index) in labelList" :key="index">
          <nuxt-link :title="item.labelName" :to="'/tags/' + item.id + '?name=' + item.labelName">
            {{ item.labelName }}
          </nuxt-link>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {};
  },
  props: {
    labelList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() { },
  methods: {
    // enterDetails(item) {
    //   if (this.type == 'tag') {
    //     this.$router.push({
    //       path: '/tags/' + item.id,
    //       query: {
    //         name: item.labelName,
    //       },
    //     });
    //   }
    // }
  },
};
</script>

<style lang="less" scoped>
.hotnews {
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  padding: 16px 26px;

  p {
    font-size: 16px;
    font-weight: bold;
    color: @textColor;
    margin-bottom: 0.5em;
  }

  .list {
    border-top: 1px solid #e3e3e3;
    padding-top: 20px;

    .item {
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      background: #f5f7fa;
      border-radius: 1px 1px 1px 1px;
      opacity: 1;
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      .line-clamp(1);
      margin-bottom: 10px;
      // padding: 0px 8px;
      margin-left: 6px;
      margin-right: 6px;

      a {
        color: @textColor6;
      }
    }
  }
}
</style>
