<template>
  <div class="hotserver" :class="hasBorder ? 'hasborder' : ''">
    <p>热门产品</p>
    <div class="list" v-if="hotServerList.length">
      <div class="item" v-for="(item, index) in hotServerList" :key="index" @click="handleServiceBuy(item)">
        <img :src="item.productImage" />
        <div class="text">
          <h3 class="ellipsis">{{ item.productName }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import computedMixin from "@/mixins/computedMixin";
export default {
  mixins: [computedMixin],
  data() {
    return {

    };
  },
  props: {
    hasBorder: {
      type: Boolean,
      default: true,
    },
    hotServerList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() { },
  methods: {
    handleServiceBuy(item) {
      let host = `${this.$store.state.host.detail_url}?id=${item.id}`;
      window.open(host);
      window.location.href;
    },
  },
};
</script>

<style lang="less" scoped>
.hotserver {
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
      display: flex;
      margin-bottom: 16px;
      cursor: pointer;
      justify-content: space-between;

      img {
        width: 64px;
        height: 64px;
      }

      .text {
        margin-left: 16px;
        flex: 1;
        width: 0;

        h3 {
          font-size: 16px;
          color: @textColor;
          margin-bottom: 18px;
        }

        h3:hover {
          color: @primaryClick;
        }

        p {
          color: @priceColor;
          margin-bottom: 0;
          font-weight: 500;
        }
      }
    }
  }
}

.hasborder {
  border: 1px solid #dcdcdc;
}
</style>
