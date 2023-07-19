<!-- 基本信息 -->
<template>
  <div v-show="isShow" class="main">
    <div class="info-block-item" v-for="(item,index) in list " :key="index">
      <span class="info-block-title">{{item.name}}</span>
      <span>{{item.value}}</span>
    </div>
  </div>
</template>

<script>
import eaitMixins from "../../util/eaitMixins.js";
export default {
  name: "InfoItem",
  mixins: [eaitMixins],
  props: {
    tabkey: {
      //当前点击的tab Key
      type: [Number, String],
      default: "1",
    },
    comKey: {
      //组件的key
      type: [Number, String],
      default: "1",
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang='scss' scoped>
.main{
  padding: 15px;
}
</style>