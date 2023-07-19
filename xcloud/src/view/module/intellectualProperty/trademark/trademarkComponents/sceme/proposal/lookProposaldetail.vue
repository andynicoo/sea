<!--  -->
<template>
  <!-- 答复建议详情 -->

  <!-- <Modal class="p-modal" v-model="lookTranslateModal" title="答复建议详情">
  
  </Modal> -->
  <el-dialog :before-close="handleClose" class="p-modal" width="30%" title="答复建议详情" append-to-body :visible.sync="isShow">
    <span style="white-space: pre-wrap;">{{text}}</span>
  </el-dialog>

</template>

<script>
export default {
  name: 'LookProposaldetail',
  props: {
    text: {
      type: String,
      default: '',
    },
    lookTranslateModal: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    lookTranslateModal: {
      handler(val) {
        console.log('this is dialog', val);
        this.isShow = val;
      },
      immediate: true,
    },
  },
  data() {
    return {
      isShow: false, //答复建议详情
    };
  },

  components: {},

  computed: {},

  methods: {
    handleClose(done) {
      done();
      this.$emit('update:lookTranslateModal');
    },
  },
};
</script>
<style lang='scss' scoped>
.p-modal {
  position: fixed; // 浮动
  z-index: 9999999999999999999999999;
}
</style>