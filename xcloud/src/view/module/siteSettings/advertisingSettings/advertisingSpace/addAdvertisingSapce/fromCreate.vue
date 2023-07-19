<!-- 新增 | 编辑 广告 -->
<template>
  <div class="template-form">
    <el-dialog :title="title" :visible.sync="dialogvisible" :width="dialogWidth" :close-on-click-modal="false" :before-close="handleClose">
      <form-create :rule="moduleList" class="form-create" :option="option" v-model="fApi">
        <template slot="type-field-component" slot-scope="scope">
          <el-input type="text" placeholder="请输入广告位尺寸" :value="scope.model.value" @input="(v) => scope.model.callback(v)"></el-input>
          <div class="addAdvertisingSapce-tips">广告位尺寸，填写格式：300px*300px，单位：px,用于提醒需要上传的广告尺寸</div>
        </template>
      </form-create>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addAdvertisingLocation, advertisingLocationEdit } from '@/api/newApi/siteSettings/index.js';

export default {
  props: {
    show: Boolean,
    title: {
      type: String,
      default: '',
    },
    isAdd: Boolean,
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
      this.fApi.submit((formData) => {
        formData.terminalType = this.$parent.terminalType;
        console.log('cs', this.$parent.terminalType);
        this.addAdvertisingLocationApi(formData);
        this.$emit('update:show', false);
      });
    },
    async addAdvertisingLocationApi(formData) {
      let { code } = this.isAdd ? await addAdvertisingLocation(formData) : await advertisingLocationEdit(formData, this.$parent.editId);
      if (code == 0) {
        this.$message.success(`${this.isAdd ? '添加' : '编辑'}成功`);
        this.$parent.getList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.template-form {
  width: 380px;
  .addAdvertisingSapce-tips {
    font-family: 'ArialMT', 'Arial';
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
    letter-spacing: normal;
    color: #b0b0b0;
  }
}
</style>
