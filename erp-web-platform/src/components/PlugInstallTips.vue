<template>
  <div>
    <a-modal
      :visible="plugPopVisible"
      @cancel="$emit('closePlugPop')"
      width="400px"
      :footer="false"
      :maskClosable="false"
    >
      <div class="me-plug-pop">
        <img class="me-mt-4" src="../assets/images/plugin-icon2.png" />
        <h2 class="me-mt-4">系统检测到您当前未安装插件</h2>
        <p class="me-mt-1">
          请先安装马六甲插件后再采集，安装<br />成功后请刷新页面
        </p>
        <a-button
          class="me-mt-2"
          type="primary"
          @click="
            openPage(systemConfig.plugDownloadUrl, '_blank')
            $emit('closePlugPop')
          "
          >下载插件
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    plugPopVisible: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      systemConfig: (state) => state.app.systemConfig
    })
  }
}
</script>
<style lang="scss" scoped>
.me-plug-pop {
  text-align: center;

  h2 {
    font-weight: 600;
    color: #262424;
    line-height: 25px;
    font-size: 18px;
  }

  p {
    line-height: 22px;
    color: #909099;
    font-size: 12px;
  }

  .me-f12 {
    font-size: 12px;
  }
}
</style>
