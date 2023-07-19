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
      <form-create :rule="formCreateSource" class="form-create" :option="option" v-model="fApi">
        <template slot="type-field-component" slot-scope="scope">
          <el-checkbox :value="scope.model.value" @change="(v) => scope.model.callback(v)"> 开启</el-checkbox>
          <span class="tree-component-checkbox-tips">
            {{ highest.navLevel == 1 ? '开启二级导航' : '如需开启/关闭请在一级菜单中操作' }}
          </span>
        </template>
        <template slot="type-service-radio" slot-scope="scope">
          <div class="tree-component-radio" v-if="highest.navLevel == 2">
            三级导航模版:
            <el-radio-group v-model="scope.model.value" @change="(v) => getThreeRadioValue(v, scope)">
              <el-radio :disabled="highest.navLevel == 1" :label="0">产品服务</el-radio>
              <el-radio :disabled="highest.navLevel == 1" :label="1">优选服务</el-radio>
            </el-radio-group>
          </div>
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
import { moduleList } from './moduleList.js';

import { addNavigation, getNavigationById, editNavigaiontion } from '@/api/newApi/siteSettings/index.js';
import { moduleListMap } from '../../../libs/setttingLibs.js';
export default {
  inject: ['highest'],
  props: {
    show: Boolean,
    title: {
      type: String,
      default: '',
    },

    moduleListData: {
      type: Array,
      default: () => moduleList(),
    },
    dialogWidth: {
      type: String,
      default: '555px',
    },
  },
  data() {
    return {
      fApi: {},
      radio: '1',
      formCreateSource: this.moduleListData,
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
  created() {},

  mounted() {
    if (this.isEidt()) {
      this.navIgationByIdApi();
    }
  },
  methods: {
    isEidt() {
      return !this.highest.isAdd;
    },

    /**获取导航等级 改变样式 */
    getNavLevel() {
      if (this.highest.navLevel == 1) {
        this.formCreateSource = moduleList(this.highest.navLevel);
      }
    },

    setNavInfo(data) {
      let formCreateSource = moduleListMap(moduleList(this.highest.navLevel), data);
      formCreateSource[4].control[0].rule[0].value = data.tertiaryType;
      console.log(formCreateSource[4].control[0]);
      this.$set(this, 'formCreateSource', formCreateSource);
    },

    /**回显获取数据 */
    async navIgationByIdApi(id = { id: this.highest.editId }) {
      let { code, data } = await getNavigationById(id);
      code == 0 && this.setNavInfo(data);
    },

    /**添加一级二级导航 */
    async addNavigaiontionApi(param) {
      let { code } = await addNavigation(param);
      if (code == 0) {
        this.handleClose();
        this.$message.success('添加成功');
      }
    },

    handleClose() {
      this.$emit('update:show', false);
    },

    submit() {
      const self = this;
      function setParmas(parma) {
        let { navLevel, rowInfo } = self.highest;
        if (navLevel == 2) parma.parentId = rowInfo.navId;
        return parma;
      }

      this.fApi.submit((formData) => {
        this.isEidt()
          ? this.editNavigaiontionApi(formData, self.highest.editId)
          : this.addNavigaiontionApi(setParmas(formData));
        this.highest.getList();
      });
    },

    /**编辑 */
    async editNavigaiontionApi(parma, id) {
      let { code } = await editNavigaiontion(parma, id);
      if (code == 0) {
        this.$message.success('编辑成功');
        this.handleClose();
      }
    },
    getThreeRadioValue(val, scope) {
      scope.model.callback(scope.model.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.tree-component-radio {
  padding-left: 25%;
}
.tree-component-checkbox-tips {
  font-family: 'ArialMT', 'Arial';
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  letter-spacing: normal;
  color: #b0b0b0;
  padding-left: 10px;
}
</style>
