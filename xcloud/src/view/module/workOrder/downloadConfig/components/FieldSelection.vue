<template>
  <div>
    <div>
      <div class="total">已选 {{ total }} 个字段</div>
      <el-row class="form-title">
        <el-col :span="12">字段标题</el-col>
        <el-col :span="12">系统key值</el-col>
      </el-row>
    </div>
    <div class="form-container">
      <el-form label-width="120px">
        <el-form-item label-width="0px" v-for="(item, index) in templateData" :key="index">
          <div class="template-box">
            <div class="template-title">
              {{ item.moduleName }}
            </div>
            <el-checkbox-group v-model="columnsIdsArr" :max="checkNum">
              <div v-for="i in item.columns" :key="i.columnId">
                <el-checkbox :label="i.columnId">
                  <div style="display:flex">
                    <span style="flex:1">{{ i.keyLabel }}</span>
                    <span style="flex:1">{{ i.keyName }}</span>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer page-info">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="submiting">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { findModuleFields } from "@/api/newApi/processFields/templateConfig";
import { applyClient } from "@/api/newApi/processFields/processConfig";
import { cloneDeep } from "lodash";
export default {
  props: {
    columnIds: {
      type: Array,
      default: () => []
    },
    // 此组件类别页和详情页都有调用，默认场景是详情页，可多选； 场景是列表页的时候只能单选，确认提交用其他的接口
    scene: {
      type: String,
      default: "index"
    },
    listParams: {
      type: Object,
      default: () => {}
    },
    keyName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 模板列表
      templateData: [],
      columnsIdsArr: [],
      submiting: false
    };
  },
  computed: {
    total() {
      return this.columnsIdsArr.filter(Boolean).length;
    },
    checkNum() {
      if (this.keyName == "client") {
        return 1;
      } else {
        return Infinity;
      }
    }
  },
  created() {
    this.queryFields();
    this.$data.columnsIdsArr = cloneDeep(this.$props.columnIds).filter(Boolean)
  },
  watch: {
    columnIds(val) {
      this.$data.columnsIdsArr = cloneDeep(val).filter(Boolean);
    },
    keyName(val) {
      this.$data.keyName = val;
    }
  },
  methods: {
    /**
     * 查询所有模块字段列表
     */
    queryFields() {
      findModuleFields({
        nodeId: "1",
        workFlowId: "1"
      }).then(res => {
        if (res.code === 0) {
          this.templateData = res.data;
        }
      });
    },

    cancel() {
      this.$emit("cancel");
    },
    submit() {
      if (this.$props.scene === "index") {
        this.$emit("submit", this.columnsIdsArr.filter(Boolean));
      } else {
        this.submiting = true;
        const params = {
          columnId: this.columnsIdsArr[0],
          ...this.listParams
        };
        applyClient(params)
          .then(res => {
            if (res.code === 0) {
              this.$emit("submit");
            }
          })
          .finally(() => {
            this.submiting = false;
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.total {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.form-title {
  padding: 5px;
  background: #f2f2f2;
  text-align: center;
}
.form-container {
  background: #fff;
  padding: 16px;
  padding-top: 5px;
  margin-bottom: 20px;
  max-height: 50vh;
  overflow-y: auto;
  border: 1px solid #ebebeb;
  .template-title {
    font-weight: bold;
  }
}
/deep/ .el-checkbox {
  width: 100%;
  .el-checkbox__label {
    width: 100% !important;
  }
}
.page-info {
  text-align: center;
}
.el-dialog__body {
  padding-top: 0px !important;
}
</style>
