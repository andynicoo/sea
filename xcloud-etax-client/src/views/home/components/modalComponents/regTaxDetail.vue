<template>
  <div>
    <Modal v-model="detailModel"
           title="上传授权书"
           footer-hide
           :mask-closable="false"
           @on-visible-change="changeState"
           width="510">

    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detailModel: true
    }
  },
  methods: {
    changeState(val) {
      this.$emit("changeState", false);
    },
  }
}
</script>
<style lang="less" scoped>
.bottomBox {
  padding-bottom: 50px;
}
.coutryInfo {
  padding: 16px 0;
  font-size: 12px;
  border-bottom: 1px solid #e6e6e6;
  color: #626266;
  &:nth-child(1) {
    margin-right: 46px;
  }
}
.regList {
  margin-top: 18px;
}
.timeLine {
  overflow: hidden;
  position: relative;
}
.timeLine li {
  padding-bottom: 30px;
  zoom: 1;
  display: flex;
  position: relative;
}
.timeLine li:nth-last-child("li") {
  padding-bottom: 15px;
}
.timeLine li:after {
  content: " ";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.timeLine li:last-child {
  background: none !important;
}
.timeLine li p {
  display: inline-block;
  width: 168px;
  font-size: 16px;
  text-align: right;
  padding-right: 20px;
  color: #9a9ca1;
  font-size: 12px;
}
.timeLine li p span {
  display: block;
  color: #6fceff;
  font-size: 12px;
}
.timeLine li .con {
  width: calc(100% - 230px);
  display: inline-block;
  padding-left: 30px;
  color: #303133;
}
.timeLine li .con span {
  display: block;
  font-size: 12px;
  color: #606366;
  margin-top: 10px;
}
.timeLine li .con img {
  max-width: 100%;
}
ul::before {
  content: " ";
  height: 100%;
  width: 1px;
  background-color: #dadada;
  position: absolute;
  top: 0;
  left: 174px;
  z-index: 999;
}
.timeLine li .dian {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  left: 172px;
  top: 8px;
  z-index: 1000;
}
</style>