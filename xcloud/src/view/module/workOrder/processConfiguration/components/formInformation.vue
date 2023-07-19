<template>
  <div class="process-formInformation">
    <dl class="process-formInformation-dl process-formInformation-database">
      <dt>
        <div class="process-database-title">资料库</div>
        <div class="process-database-search">
          <el-input @input="searchDatabase" clearable placeholder="请输入资料名称搜索" v-model="databaseSearchVal" class="input-with-select"> </el-input>
        </div>
      </dt>
      <dd class="process-database">
        <el-empty v-show="!templateDataSearch.length" description="暂无数据"></el-empty>
        <div v-show="templateDataSearch.length" class="template-box" v-for="(item, index) in templateDataSearch" :key="index">
          <div class="template-title">
            {{ item.moduleName }}
            <span v-show="!collapseArr.includes(index)" class="expand-and-collapse" @click="expandCollapse(index)">收起 <i class="el-icon-arrow-up"></i></span>
            <span v-show="collapseArr.includes(index)" class="expand-and-collapse" @click="expandCollapse(index)">展开 <i class="el-icon-arrow-down"></i></span>
          </div>
          <div class="template-content" :class="{ height0: collapseArr.includes(index) }">
            <span v-for="(field, fieldIndex) in item.columns" class="tag-item gb-line-clamp1" :class="{ selected: field.selected }" :key="fieldIndex" @click="handleSelectTag(field, item)">
              <!-- <el-tooltip placement="top-start" effect="light">
                                <span slot="content">{{ field.keyLabel }}</span> -->
              <span :title="field.keyLabel">{{ field.keyLabel }}</span>
              <!-- </el-tooltip> -->
            </span>
          </div>
        </div>
      </dd>
    </dl>
    <dl class="process-formInformation-dl process-formInformation-view">
      <dt>
        <div class="process-database-title">已添加的资料({{ columnsLength }})</div>
      </dt>
      <dd class="submitted-information">
        <el-empty v-show="!columnsLength" description="暂无数据"></el-empty>
        <DynamicForm v-show="columnsLength" ref="dynamicForm" :moduleList="templateDataPreview" :isTemplate="true" @selectFields="selectFields" @deleteFields="deleteFields" @updateModuleSort="updateModuleSort" />
      </dd>
      <dd class="submitted-information-btn">
        <el-button type="primary" @click="currentDataSave">保存</el-button>
        <el-button @click="currentDataCancel">取消</el-button>
      </dd>
    </dl>
  </div>
</template>

<script>
import { findModuleFields, findTemplateFields } from '@/api/newApi/processFields/templateConfig';
import draggable from 'vuedraggable';
import DynamicForm from './DynamicForm/dynamicForm.vue'; // 表单配置
import FieldConfig from '@/view/module/workOrder/fieldConfig/editField';
import { cloneDeep, sortBy } from 'lodash';
export default {
  name: 'formInformation',
  components: { draggable, DynamicForm, FieldConfig },
  props: {
    templateData: {
      type: Array,
    },
    templateDataPreview: {
      type: Array,
    },
  },
  watch: {
    templateDataPreview: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.columnsLength = 0;
        newVal.forEach((item) => {
          this.columnsLength += item.columns.length;
        });
      },
    },
  },
  data() {
    return {
      columnsLength: 0,
      flowId: '',
      nodeId: '',
      databaseSearchVal: '',
      editFieldModal: false,
      // 编辑对应的模块和字段id
      selectedModuleId: '',
      selectedField: {},
      selectedFieldId: '',
      input: '',
      collapseArr: [],
      templateDataSearch: [],
    };
  },
  created() {
    this.templateDataSearch = cloneDeep(this.templateData);
  },
  methods: {
    //更新模块排序
    updateModuleSort(index, type) {
      this.$emit('updateModuleSort', index, type);
    },
    //搜索资料库
    searchDatabase(val) {
      this.templateDataSearch = [];
      this.templateData.forEach((item) => {
        let itemHandel = cloneDeep(item);
        itemHandel.columns = item.columns.filter((col) => col.keyLabel.includes(val));
        if (itemHandel.columns.length) this.templateDataSearch.push(itemHandel);
      });
    },
    //展开收起资料库
    expandCollapse(index) {
      if (this.collapseArr.includes(index)) {
        this.collapseArr = this.collapseArr.filter((item) => item != index);
      } else {
        this.collapseArr.push(index);
      }
    },
    //保存添加资料视图数据
    currentDataSave() {
      this.$emit('updataTemplateDataSelected');
      this.currentDataCancel();
    },
    //取消添加资料
    currentDataCancel() {
      this.$emit('drawerClose');
    },
    //选中显示表单配置
    selectFields(editFieldModal, selectedModuleId, selectedFieldId, selectedField) {
      this.editFieldModal = false;
      this.$nextTick(() => {
        this.editFieldModal = editFieldModal;
        this.selectedModuleId = selectedModuleId;
        this.selectedFieldId = selectedFieldId;
        this.selectedField = selectedField;
      });
    },
    //删除已选择的表单配置
    deleteFields(item) {
      this.templateDataPreview.forEach((temp) => {
        if (temp.moduleCode == item.moduleParentCode) {
          temp.columns = temp.columns.filter((columnsSub) => {
            return columnsSub.keyLabel != item.title;
          });
        }
      });
      this.$emit('updateTemplateDataPreview');
      console.log(this.templateDataPreview, 'this.templateDataPreview');
      this.templateDataSearch.forEach((templatSub) => {
        if (templatSub.moduleCode == item.moduleParentCode) {
          templatSub.columns.forEach((columnsSub) => {
            if (columnsSub.keyLabel == item.title) {
              columnsSub.selected = false;
            }
          });
        }
      });
      this.templateData.forEach((ele) => {
        if (ele.moduleCode == item.moduleParentCode) {
          ele.columns.forEach((eleSub) => {
            if (eleSub.keyLabel == item.title) {
              eleSub.selected = false;
            }
          });
        }
      });
    },
    /**
     * 点击改变选中，只包含一层的关系
     * @params item 选择的项
     * @params module 当前选中的模块
     */
    handleSelectTag(item, module) {
      item.selected = !item.selected;
      //添加源item双向绑定才生效
      let sourceItem = '';
      this.templateData.forEach((ele) => {
        if (ele.moduleId == item.moduleId) {
          ele.columns.forEach((eleSub) => {
            if (eleSub.columnId == item.columnId) {
              eleSub.selected = item.selected;
              sourceItem = eleSub;
            }
          });
        }
      });
      let isAdd = false;
      this.templateDataPreview.forEach((group) => {
        if (group.moduleId == item.moduleId) {
          isAdd = true;
          if (item.selected) {
            group.columns.push(sourceItem);
          } else {
            group.columns = group.columns.filter((grougSub) => {
              return grougSub.id != item.id;
            });
          }
        }
      });
      if (!isAdd) {
        let moduleHandle = cloneDeep(module);
        moduleHandle.columns = [sourceItem];
        this.$set(moduleHandle, 'sort', this.templateDataPreview.length + 1);
        this.templateDataPreview.push(moduleHandle);
      }
    },
    //排序
    sortHandle() {},
  },
};
</script>
<style lang="scss" scoped>
.process-formInformation {
  margin: 0 20px;
  height: calc(100% - 110px);
}

.process-formInformation-database {
  width: 442px;
  float: left;
}

.process-formInformation-view {
  margin-left: 457px;
}

.process-formInformation-dl {
  height: 100%;
  background-color: #fff;
  border-radius: 2px;

  dt {
    padding: 20px;

    .input-with-select {
      ::v-deep .el-button--primary {
        color: #333 !important;
      }
    }
  }

  .process-database-title {
    font-size: 16px;

    span {
      float: right;
      font-size: 12px;
    }
  }

  .process-database-search {
    margin-top: 10px;
  }

  .template-title {
    font-size: 14px;
    margin: 15px 0 5px;
  }

  .template-content {
    display: flex;
    flex-wrap: wrap;
  }

  .tag-item {
    text-align: center;
    border: solid 1px #dcdfe6;
    font-size: 14px;
    margin: 10px 10px 10px 0;
    padding: 0px 10px;
    line-height: 32px;
    height: 32px;
    background: #fff;
    transition: background 0.2s;
    cursor: pointer;
    width: 110px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tag-item.selected {
    border: solid 1px #ebf5ff;
    background: #ebf5ff;
    color: #333;
  }
}

.process-database {
  height: 100%;
  overflow-y: auto;
  margin: 0 20px;
  padding-right: 10px;
}

.submitted-information {
  height: calc(100% - 20px);
  overflow-y: auto;
  padding: 20px;

  ::v-deep .el-col-8 {
    width: 100%;
  }
}

.submitted-information-btn {
  margin-top: 20px;
}

.expand-and-collapse {
  float: right;
  cursor: pointer;
}

.height0 {
  height: 0;
  overflow: hidden;
  border-bottom: 1px solid #999;
}
</style>
