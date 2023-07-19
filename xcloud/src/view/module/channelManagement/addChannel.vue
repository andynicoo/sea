<template>
  <div class="container">
    <p class="title">
      新增渠道
    </p>
    <baseChannel @channelInfo="getChannelInfo"></baseChannel>
  </div>
</template>

<script>
import base_channel_addEdit from "./components/base_channel_addEdit"
export default {
  data() {
    return {
      channelInfo: {},
    }
  },
  components: {
    baseChannel: base_channel_addEdit
  },
  created() {

  },
  methods: {
    getChannelInfo() {
      this.$router.push('/channelManagement/channelLists')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #ffffff;
  padding: 30px 20px;
  .title {
    font-size: 16px;
    margin-bottom: 20px;
    padding-left: 30px;
    font-weight: bold;
  }
}
</style>