<template>
  <a-modal
    :title="null"
    :visible="show"
    :closable="false"
    :footer="null"
    :centered="true"
    @ok="show = false"
    @cancel="show = false"
  >
    <div class="mansurebox center ksy-text-center">
      <img src="~/assets/images/check-ok.svg" />
      <h2><slot name="title">恭喜您！提交人工核名申请成功！</slot></h2>
      <p><slot name="text">核名专家将尽快联系您并进行详细核名分析~</slot></p>
      <a-button type="primary" @click="show = false">确认</a-button>
    </div>
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      show: false,
    };
  },
};
</script>
