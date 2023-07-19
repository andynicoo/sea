<template>
  <div v-login="todo" :class="{ big: size === 'big' }" class="collect">
    <slot></slot>
    <img :src="status ? collectImg1 : collectImg0" alt="" />
  </div>
</template>
<script>
import trademark from "@/apis/trademark";
import { mapState, mapMutations } from "vuex";
const collectImg0 = require("@/assets/images/icons/collect-0.svg");
const collectImg1 = require("@/assets/images/icons/collect-1.svg");
export default {
  props: {
    size: {
      type: String,
      default: "small",
    },
    nameInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      collectImg0,
      collectImg1,
    };
  },
  computed: {
    ...mapState(["collectParams"]),
    status() {
      if (this.nameInfo) {
        return this.nameInfo.isFavourite;
      } else {
        return this.collectParams.isFavourite;
      }
    },
  },
  methods: {
    ...mapMutations(["updateCollect"]),
    setStatus() {
      if (this.nameInfo) {
        return this.nameInfo.isFavourite ? collectImg1 : collectImg0;
      } else {
        return this.collectParams.isFavourite ? collectImg1 : collectImg0;
      }
    },
    todo() {
      if (this.status) {
        return this.collectRemove();
      } else {
        return this.collect();
      }
    },
    judgeMent(status) {
      if (this?.nameInfo?.trademarkAiNameNo) {
        this.$bus.$emit("changeCollect", { trademarkAiNameNo: this.nameInfo.trademarkAiNameNo, status });
        if (this.nameInfo.trademarkAiNameNo == this.collectParams.trademarkAiNameNo) {
          this.updateCollect(status);
        }
      } else {
        this.updateCollect(status);
        this.$bus.$emit("changeCollect", { trademarkAiNameNo: this.collectParams.trademarkAiNameNo, status });
      }
    },
    async collect() {
      const params = this.nameInfo ? this.nameInfo : this.collectParams;
      const res = await this.$axiosApi(trademark.handleCollect.url, trademark.handleCollect.methods, params);
      this.judgeMent(1);
      this.$message.success("操作成功!");
    },
    async collectRemove() {
      const params = {
        trademarkAiNameNo: this.nameInfo ? this.nameInfo.trademarkAiNameNo : this.collectParams.trademarkAiNameNo,
      };
      const res = await this.$axiosApi(
        trademark.handleCollectRemove.url,
        trademark.handleCollectRemove.methods,
        params,
        true
      );
      this.judgeMent(0);
      this.$message.success("提交成功!");
    },
  },
};
</script>
<style lang="less" scoped>
.collect {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: none;
  z-index: 100;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.9);
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  img {
    width: 12px;
    vertical-align: middle;
  }
  &.big {
    width: auto;
    padding: 0 8px;
    img {
      margin-left: 4px;
    }
  }
}
</style>
