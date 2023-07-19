<template>
  <div>
    <div class="dimmodal">
      <div class="wbox"></div>
    </div>
    <div class="dimcontent">
      <a-button @click="changeDim()">弹窗</a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      dimShow: (state) => state.dimShow,
    }),
  },
  mounted() {},
  methods: {
    changeDim() {
      this.$store.commit("setDimData", {
        show: !this.dimShow,
      });
    },
  },
};
</script>

<style lang="less">
.dimmodal {
  filter: alpha(Opacity=40);
  -moz-opacity: 0.4;
  opacity: 0.4;
  background: #000;
  z-index: 99999;
  position: fixed;
  height: 600px;
  width: 100%;
  top: 0px;
  .wbox {
    width: 100px;
    height: 100px;
    position: fixed;
    top: 200px;
    filter: alpha(Opacity=0);
    -moz-opacity: 0;
    opacity: 0;
  }
}
.dimcontent {
  z-index: 999999;
  position: fixed;
  top: 100px;
}
</style>
