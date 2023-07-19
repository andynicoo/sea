<!-- 新增 | 编辑 广告 -->
<template>
  <div class="template-form">
    <el-dialog
      :title="title"
      :visible.sync="dialogvisible"
      :close-on-click-modal="false"
      :width="dialogWidth"
      :before-close="handleClose"
    >
      <form-create :rule="moduleList" class="form-create" :option="option" v-model="fApi"> </form-create>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    title: {
      type: String,
      default: '',
    },
    moduleList: {
      type: Array,
      default: () => [],
    },
    dialogWidth: {
      type: String,
      default: '555px',
    },
  },
  data() {
    return {
      fApi: {},
      option: {
        inline: true,
        resetBtn: false,
        submitBtn: false,
      },
    };
  },

  computed: {
    dialogvisible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
    },
  },

  methods: {
    handleClose() {
      this.$emit('update:show', false);
    },

    submit() {
      this.$emit('confirm', this.fApi);
    },
  },
};
</script>
<style lang="scss" scoped>
.template-form {
  width: 380px;
}
</style>
