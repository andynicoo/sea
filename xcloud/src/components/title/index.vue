<template>
  <div class="title">
    <i class="sing "></i>
    <span class="text">{{ titieName }}</span>
  </div>
</template>

<script>
export default {
  name: "Title",
  props: {
    titieName: {
      type: String,
    },
  
  },
  computed: {},
  methods: {},
};
</script>

<style lang="less">
.title {
  display: flex;
  align-items: center;
  .sing {
    width: 2px;
    height: 14px;
    background: #1890ff;
    border-radius: 2px;
    display: inline-block;
  }
  .text {
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(51, 51, 51, 0.85);
    line-height: 20px;
    margin-left: 4px;
  }
}
</style>
