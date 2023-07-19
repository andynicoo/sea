<template>
  <div class="app-container">
    <div class="page-header">
      <div style="flex: 1">
        <h2>资料字段配置：{{ processInfo.currentNodeName }}</h2>
        <div style="font-size: 16px; margin-top: 4px">
          {{ processInfo.functionCodeName }}-{{ processInfo.countryNameCh }}-{{ processInfo.serviceProviderName }}：
          <span v-for="(item, index) in processInfo.forwardNodes" :key="index">
            <span>
              {{ item.nodeName }}
            </span>
            <span v-if="index < processInfo.forwardNodes.length - 1" style="margin: 0px 2px">/</span>
          </span>
        </div>
      </div>
      <div>
        <el-button size="mini" type="default" @click="showCopyNodeModal">复用配置</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="
            showEditFieldModal();
            fieldFlag = 'add';
          "
        >
          新增字段
        </el-button>
      </div>
    </div>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="120px">
        <el-form-item label-width="0px" v-for="(item, index) in templateData" :key="index">
          <div class="template-box">
            <div class="template-title">
              {{ item.moduleName }}
            </div>
            <div class="template-content">
              <draggable
                :list="item.columns"
                animation="300"
                ghost-class="ghostClass"
                @end="dragEnd($event, item.columns)"
              >
                <span
                  v-for="(field, fieldIndex) in item.columns"
                  class="tag-item"
                  :class="{ selected: field.selected }"
                  :key="fieldIndex"
                  @click="handleSelectTag(field, fieldIndex)"
                >
                  {{ field.keyLabel }}
                  <i
                    v-if="field.selected"
                    class="el-icon-edit-outline tag-edit"
                    @click.stop="
                      showEditFieldModal(item.moduleId, field.id, field);
                      fieldFlag = 'edit';
                    "
                  />
                </span>
              </draggable>
            </div>
          </div>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="margin-top-10 text-align-center">
          <el-button @click="goback()">取消</el-button>
          <el-button type="primary" @click="handleSubmitTemplate">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 复用配置弹框 -->
    <el-dialog title="复用配置" :visible.sync="copyNodeModal" :close-on-click-modal="false" width="520px">
      <el-alert v-if="fieldFlag == 'edit'" type="warning" :closable="false" show-icon style="margin-bottom: 16px">
        <template slot="title">
          <h4>说明</h4>
          <div>即在此节点选择与其他节点相同的资料字段</div>
        </template>
      </el-alert>
      <div style="margin-bottom: 4px">请选择此节点要复用的节点配置：</div>
      <div>
        <el-select v-model="copyNodeId" clearable filterable placeholder="选择要复用的节点" style="width: 360px">
          <el-option
            :label="item.nodeName"
            :value="item.nodeId"
            v-for="(item, index) in copyNodeList"
            :key="index"
          ></el-option>
        </el-select>
      </div>

      <div slot="footer" class="text-align-center">
        <el-button @click="copyNodeModal = false">取消</el-button>
        <el-button type="primary" @click="handleCopyNode">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹框修改字段信息 -->
    <el-dialog
      :title="fieldFlag == 'edit' ? '修改字段' : '添加字段'"
      :visible.sync="editFieldModal"
      :close-on-click-modal="false"
      width="950px"
    >
      <el-alert v-if="fieldFlag == 'edit'" type="warning" :closable="false" show-icon style="margin-bottom: 16px">
        <template slot="title">
          <h4>说明</h4>
          <div>
            修改字段可以修改某个字段在此服务资料中的属性，但并不影响其基本属性。
            若要修改字段的基本属性，请到字段配置页进行修改。
          </div>
        </template>
      </el-alert>
      <el-alert v-if="fieldFlag == 'add'" type="warning" :closable="false" show-icon style="margin-bottom: 16px">
        <template slot="title">
          <h4>说明</h4>
          <div>
            新增字段即在字段配置中添加了自定义字段，下次在配置其他服务资料时仍可直接选择。
            此次保存的属性即为字段的基本属性。。
          </div>
        </template>
      </el-alert>

      <FieldConfig
        v-if="editFieldModal"
        ref="editFieldRef"
        from="field-template"
        :id="selectedFieldId"
        :flow-id="flowId"
        :node-id="nodeId"
        :selected-field="selectedField"
        @editTemplateField="editTemplateField"
        @addTemplateField="addTemplateField"
      />
      <div slot="footer" class="text-align-center">
        <el-button @click="editFieldModal = false">取消</el-button>
        <el-button type="primary" @click="handleEditField">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  findModuleFields,
  findTemplateFields,
  getProcessInfo,
  saveOrUpdateTemplate
} from "@/api/newApi/processFields/templateConfig";
import FieldConfig from "@/view/module/workOrder/fieldConfig/editField";
import draggable from "vuedraggable";
export default {
  components: { FieldConfig, draggable },
  data() {
    return {
      // 对应的流程以及所属节点id
      flowId: "",
      nodeId: "",

      // 流程详情
      processInfo: {},

      // 复用配置操作
      copyNodeModal: false,
      copyNodeList: [],
      copyNodeId: "",

      // 模板列表
      templateData: [],

      // 编辑选中的字段
      editFieldModal: false,
      fieldFlag: "edit", // edit or add
      // 编辑对应的模块和字段id
      selectedModuleId: "",
      selectedField: {},
      selectedFieldId: ""
    };
  },
  created() {
    if (this.$route.query && this.$route.query.nodeId) {
      this.flowId = this.$route.query.flowId;
      this.nodeId = this.$route.query.nodeId;
      this.queryProcessInfo();
    }
    this.queryFields();
  },
  methods: {
    /**
     * 查询所有模块字段列表
     */
    queryFields() {
      findModuleFields({
        nodeId: this.nodeId,
        workFlowId: this.flowId
      }).then(res => {
        if (res.code == 0) {
          this.templateData = res.data;
        }
      });
    },

    /**
     * 查询流程详情
     */
    queryProcessInfo() {
      getProcessInfo({ nodeId: this.nodeId, flowId: this.flowId }).then(res => {
        if (res.code == 0) {
          this.processInfo = res.data;
        }
      });
    },

    /**
     * 复用配置操作
     */
    showCopyNodeModal() {
      // 过滤掉当前的节点
      this.copyNodeList = this.processInfo.forwardNodes.filter(item => item.nodeId != this.processInfo.currentNodeId);
      this.copyNodeModal = true;
    },
    // 根据选择的节点，查询对应的字段配置
    handleCopyNode() {
      findTemplateFields({
        nodeId: this.copyNodeId,
        workFlowId: this.flowId
      }).then(res => {
        if (res.code == 0) {
          this.copyNodeModal = false;
          // 将复制的节点下选中的字段，勾选到当前节点的字段里
          // 根据传递的 columnId ，获取到对应的selected值
          const findField = columnId => {
            for (let v of res.data) {
              for (let vv of v.columns) {
                if (vv.columnId == columnId) {
                  return vv;
                }
              }
            }
          };

          // 合并复制的字段selected
          this.templateData.forEach(v => {
            v.columns.map(vv => {
              vv.selected = 0;
              let field = findField(vv.columnId);
              if (field) {
                // vv.selected = 1;
                Object.assign(vv, field);
              }
            });
          });
        }
      });
    },

    /**
     * 点击改变选中，只包含一层的关系
     * @params item 选择的项
     * @params index 当前选中的下标
     */
    handleSelectTag(item, index) {
      let selected = item.selected;
      item.selected = !selected;
      this.$forceUpdate();
    },

    /**
     * 展示编辑字段弹框
     */
    showEditFieldModal(moduleId, fieldId, field) {
      this.selectedModuleId = moduleId;
      this.selectedFieldId = fieldId;
      this.selectedField = field;
      this.editFieldModal = true;
      console.log(field, this.templateData);
    },
    // 点击确定
    handleEditField() {
      this.$refs.editFieldRef.handleSubmit();
    },
    // 编辑字段后的回调信息
    editTemplateField(field) {
      let moduleIndex = this.templateData.findIndex(item => item.moduleId == this.selectedModuleId);
      let fieldIndex = this.templateData[moduleIndex].columns.findIndex(item => item.id == this.selectedFieldId);
      this.templateData[moduleIndex].columns[fieldIndex] = { ...this.selectedField, ...field };
      this.$forceUpdate();
      this.$message({
        type: "success",
        message: "修改成功"
      });
      this.editFieldModal = false;
    },
    // 新增字段后的回调信息
    addTemplateField() {
      this.editFieldModal = false;
      this.queryFields();
    },

    /**
     * 保存当前的字段模板信息
     */
    handleSubmitTemplate() {
      // 过滤出已经选中的数据
      let templateFields = [];
      this.templateData.forEach(v => {
        v.columns.forEach(vv => {
          if (vv.selected) {
            templateFields.push(vv);
          }
        });
      });
      if (templateFields.length == 0) {
        this.$message({
          type: "warning",
          message: "至少选择一个资料配置！"
        });
        return;
      }
      saveOrUpdateTemplate({ columnsRelations: templateFields, flowId: this.flowId, nodeId: this.nodeId }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.goback();
        }
      });
    },

    /**
     * 拖拽怕徐
     */
    dragEnd(event, list) {
      list.forEach((v, i) => {
        v.sort = i;
      });
      this.$forceUpdate();
    },

    /**
     * 返回列表页面
     */
    goback() {
      this.$router.push({
        path: "/workOrder/processConfig/editProcess",
        query: {
          flowId: this.flowId
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  position: relative;
  .page-header {
    background: #fff;
    padding: 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
  .form-container {
    margin-top: 16px;
    background: #fff;
    padding: 16px;
    border-radius: 4px;
  }
  .margin-top-10 {
    margin-top: 10px;
  }

  // 模块样式
  .template-box {
    .template-title {
      font-size: 16px;
      font-weight: bold;
      border-bottom: solid 1px #ddd;
      margin-bottom: 10px;
    }
  }
  // 标签样式
  .tag-item {
    display: inline-block;
    border: solid 1px #eee;
    border-radius: 4px;
    font-size: 14px;
    margin: 3px;
    padding: 0px 10px;
    line-height: 40px;
    height: 40px;
    background: #fff;
    transition: background 0.2s;
    cursor: pointer;
    &:hover {
      border: solid 1px #ecf5ff;
      background: #ecf5ff;
    }
    &.selected {
      border: solid 1px #79bbff;
      background: #79bbff;
      color: #333;
    }
    .tag-edit {
      padding: 4px;
      border: solid 1px #79bbff;
      background: #79bbff;
      border-radius: 20px;
      position: relative;
      right: -4px;
      &:hover {
        border: solid 1px #fff;
        background: #fff;
        border-radius: 20px;
      }
    }
  }
}
</style>
<style>
.ghostClass {
  background-color: #ed4014 !important;
  opacity: 0.8 !important;
}
</style>
