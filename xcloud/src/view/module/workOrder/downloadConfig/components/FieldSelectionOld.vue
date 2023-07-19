<template>
  <div>
    <div class="form-container">
      <el-form label-width="120px">
        <el-form-item label-width="0px" v-for="(item, index) in templateData" :key="index">
          <div class="template-box">
            <div class="template-title">
              {{ item.moduleName }}
            </div>
            <div class="template-content">
              <span
                v-for="(field, index) in item.columns"
                class="tag-item"
                :class="{ selected: columnsIdsArr.includes(field.columnId) }"
                :key="index"
                @click="handleSelectTag(field, index)"
              >
                {{ field.keyLabel }}
              </span>
            </div>
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
import { findModuleFields } from '@/api/newApi/processFields/templateConfig'
import {
  applyClient
} from '@/api/newApi/processFields/processConfig'
import { cloneDeep } from 'lodash'
export default {
  props: {
    columnIds: {
      type: Array,
      default: () => []
    },
    // 此组件类别页和详情页都有调用，默认场景是详情页，可多选； 场景是列表页的时候只能单选，确认提交用其他的接口
    scene: {
      type: String,
      default: 'index'
    },
    listParams: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      // 模板列表
      templateData: [],
      columnsIdsArr: [],
      submiting: false
    }
  },
  created () {
    console.log('init mounted')
    this.queryFields()
    this.$data.columnsIdsArr = cloneDeep(this.$props.columnIds)
    // eslint-disable-next-line no-extend-native
    Array.prototype.removeItem = function (val) {
      var index = this.indexOf(val)
      if (index > -1) {
        this.splice(index, 1)
      }
    }
  },
  methods: {
    /**
     * 查询所有模块字段列表
     */
    queryFields () {
      findModuleFields({
        // nodeId: this.nodeId,
        // workFlowId: this.flowId
        nodeId: '1',
        workFlowId: '1'
      }).then((res) => {
        if (res.code === 0) {
          this.templateData = res.data
        }
      })
    },
    // 选择/取消标签
    handleSelectTag (item, index) {
      if (this.$props.scene === 'index') {
        let columnIds = cloneDeep(this.$data.columnsIdsArr)
        if (columnIds.includes(item.columnId)) {
          columnIds.removeItem(item.columnId)
        } else {
          columnIds.push(item.columnId)
        }
        this.$data.columnsIdsArr = columnIds
      } else {
        this.$data.columnsIdsArr = [item.columnId]
      }
    },

    cancel () {
      this.$emit('cancel')
    },
    submit () {
      if (this.$props.scene === 'index') {
        this.$emit('submit', this.columnsIdsArr.filter(Boolean))
      } else {
        this.submiting = true
        const params = {
          columnId: this.columnsIdsArr[0],
          ...this.listParams
        }
        applyClient(params).then(res => {
          if (res.code === 0) {
            this.$emit('submit')
          }
        }).finally(() => {
          this.submiting = false
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.form-container {
  margin-top: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
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
.page-info {
  text-align: center;
}
</style>
