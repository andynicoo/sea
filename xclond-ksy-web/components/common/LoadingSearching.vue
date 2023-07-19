<template>
  <!-- 查询 等待 遮罩 -->
  <div class="searchingdiv">
    <a-modal
      :visible="loadingSearchingInfo.show"
      :footer="null"
      :maskClosable="false"
      :centered="true"
      :width="428"
      :keyboard="false"
      :closable="false"
      :dialogClass="'searchingdiv'"
      :maskStyle="{
        opacity: '0.45',
        background: '#FFFFFF',
        animation: 'none',
      }"
    >
      <div class="center ksy-text-center">
        <img src="~/assets/images/loading.gif" style="width: 118px" />
        <p>{{ loadingSearchingInfo.text }}</p>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("common", ["loadingSearchingInfo"]),
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-modal-content {
  height: 235px;
  background: #fff;
  box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px 0px rgba(0, 0, 0, 0.12),
    0px 9px 28px 0px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  line-height: 26px;
  p {
    margin: 16px 0 0;
    color: rgba(#000, 0.9);
  }
  .ant-modal-body {
    height: 100%;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
/deep/ .ant-modal-mask {
  opacity: 0.7 !important;
}
</style>
