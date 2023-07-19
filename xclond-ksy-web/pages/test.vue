<template>
  <div>
    <!-- {{$PLA===1}}-- -->
    {{PLA}}--

    <!-- {{$CONFIG}} -->
    <nuxt-link to="/about"> about </nuxt-link>
    <div class="ksy-w1320 content">

      <a-row :gutter="[16, 40]">
        <a-col :span="8"> <div class="blue">30%</div> </a-col>
        <a-col :span="8"> <div class="blue">30%</div> </a-col>
        <a-col :span="8"> <div class="blue">30%</div> </a-col>
      </a-row>
    </div>

    <div class="ksy-w1320 content">
      <div class="flex">
        <div class="left">
          <a-row :gutter="[16, 40]">
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
            <a-col :span="8"> <div class="blue">30%</div> </a-col>
          </a-row>
        </div>

        <div class="right">aaaaaaa</div>
      </div>
    </div>
  </div>
</template>
<script>
import config from '../static/config'
export default {
  head() {
    return {
      title: `${config[process.env.NODE_PLA].title}`,
    };
  },
  data() {
    return {
      PLA: this.$PLA,
    };
  },
  mounted() {
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.content {
  margin: 0 auto;

  margin-top: 80px;
}
.blue {
  background: blue;
  color: #fff;
}
.left {
  flex: 1;
}
.right {
  width: 300px;
  background: yellow;
  padding-left: 10px;
  margin-left: 10px;
}
</style>
