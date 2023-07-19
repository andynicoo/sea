<!-- 新增 | 编辑 广告 -->
<template>
  <div class="template-form">
    <el-dialog :title="title" :visible.sync="dialogvisible" :close-on-click-modal="false" :width="dialogWidth" :before-close="handleClose">
      <form-create @url-type-change="externalLink" :rule="moduleList" class="form-create" ref="ruleForm" :option="option" v-model="fApi" :value.sync="fromDataValue">
        <template slot="type-field-component" slot-scope="scope">
          <el-upload list-type="picture-card" :limit="1" :action="baseUrl + '/file/oss/upload'" :before-upload="beforeUpload" :value="scope.model.value" :on-remove="(v) => uplodRemove(v, scope)" :on-success="(v) => setUplodValue(v, scope)" :file-list="fileList">
            <i class="el-icon-plus"></i>
          </el-upload>
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
import util from '@/utils/util.js';
import { addAdvertising, eidtDvertising, sendCount } from '@/api/newApi/siteSettings/index.js';

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
  watch: {
    watchFromData: {
      async handler(val) {
        let { adPositionId, sectionDay, terminalType } = val;
        let params = { adPositionId, terminalType, enterpriseId: localStorage.getItem('enterpriseId') };
        sectionDay && ((params.startAt = sectionDay[0]), (params.endAt = sectionDay[1]));
        if (adPositionId != '' && typeof adPositionId == 'string' && (adPositionId || sectionDay || terminalType)) {
          let { code, data } = await sendCount(params);
          code == 0 && (this.fromDataValue.releaseNum = data + '/8');
        }
      },
      deep: true,
      immediate: true,
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
      fromDataValue: {},
      fileList: [],
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

    watchFromData() {
      let { adPositionId, sectionDay } = this.fromDataValue,
        terminalType = this.$parent.terminalType;
        console.log('terminalType',terminalType);
      return {
        adPositionId,
        sectionDay,
        terminalType,
      };
    },
  },

  methods: {
    handleClose() {
      this.$emit('update:show', false);
    },

    externalLink() {
      let value = this.fApi.getValue('urlType');
      console.log('value', value);
      if (value == 2) {
        this.$alert('请联系技术人员确认小程序管理后台已添加外部链接，否则配置无效', '提示', {
          confirmButtonText: '我知道了',
        });
      }
    },
    submit() {
      this.fApi.submit(async (formData, fApi) => {
        const params = this.setParams(formData);
        this.$parent.isAdd ? this.addAdvertisingApi(params) : this.editAdvertisingApi(this.setParams(params));
        this.$emit('update:show', false);
        this.$parent.getList();
      });
    },

    setParams(formData) {
      formData.terminalType = this.$parent.terminalType;
      let postageBol = !!(formData.isPostage == 0) || !formData.sectionDay;
      let time = {
        startAt: postageBol ? null : formData.sectionDay[0],
        endAt: postageBol ? null : formData.sectionDay[1],
      };

      return { ...formData, ...time };
    },

    /**添加广告 */
    async addAdvertisingApi(formData) {
      let { code } = await addAdvertising(formData);
      if (code == 0) this.$message.success('添加成功');
    },

    /**编辑广告 */
    async editAdvertisingApi(formData) {
      let { code } = await eidtDvertising(formData, this.$parent.editId);
      if (code == 0) this.$message.success('编辑成功');
    },

    setUplodValue(v, scope) {
      scope.model.callback(v.data.fileUrl);
    },

    uplodRemove(file, scope) {
      scope.model.callback('');
    },
    beforeUpload(file) {
      let MAX_SIZE = file.size / 1024 / 1024 < 0.48;
      let fileType = util.getFileSuffixName(file.name);
      // 验证文件大小
      if (!MAX_SIZE) {
        this.$message.error(`上传文件大小不能超过500kb`);
        return false;
      }
      const FILE_TYPE = ['jpg', 'gif', 'png', 'jpeg'];
      // 验证文件类型
      if (!FILE_TYPE.includes(fileType)) {
        this.$message.warning('请上传jpg、gif、png、jepg格式的文件！');
        return false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.template-form {
  .addAdvertisment-tips {
    font-family: 'ArialMT', 'Arial';
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
    letter-spacing: normal;
    color: #b0b0b0;
  }
}
/deep/ .from-create-select {
  width: 100%;
  display: none;
}
</style>
<style>
.from-create-select {
  width: 100%;
}

.from-create-select {
  width: 100%;
}
</style>
