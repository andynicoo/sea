<template>
  <div class="no-data flex">
    <img :src="noImg" alt="" />
    <p><slot name="text">暂无相关信息，换个词试试～</slot></p>
    <div class="flex flex-c-c bars">
      <slot name="bar"
        ><a-button @click="customerFunc" type="primary" size="small">人工客服</a-button
        ><a-button @click="jumpPath('/productservice')" size="small">立即申请</a-button></slot
      >
    </div>
  </div>
</template>
<script>
import { customerFunc } from "@/utils/index";
export default {
  data() {
    return {
      customerFunc,
    };
  },
  props: {
    // 1 律师 2 持有人
    type: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    imgMaps() {
      return {
        0: require("@/assets/images/nodata.png"),
        1: require("@/assets/images/trademark/v230401/noData/lawyer.png"),
        2: require("@/assets/images/trademark/v230401/noData/owner.png"),
      };
    },
    noImg() {
      return this.imgMaps[this.type];
    },
  },
  methods: {
    jumpPath(path) {
      this.$router.push({
        path,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.no-data {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 300px;
  }
  p {
    margin: 10px 0 34px;
  }
  button {
    margin: 0 12px;
  }
}
</style>
