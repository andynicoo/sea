<template>
  <a-form-model-item
    :key="item.key"
    :ref="item.key"
    :class="computeClass"
    :label="item.label"
    :rules="checkRules(item)"
    :prop="item.key"
  >
    <slot
      v-if="!item.render"
      :name="item.slotName"
      :record="item"
      :itemData="item.Data"
    >
      <!-- 输入框 -->
      <template v-if="item.itemType === 'input'">
        <a-input
          v-model.trim="formModel[item.key]"
          v-bind="itemProp"
          allow-clear
          :placeholder="item.placeholder || `请输入${item.label}`"
          :suffix="item.suffix || ''"
        />
      </template>
      <!-- 输入数字框 -->
      <template v-if="item.itemType === 'number'">
        <a-input-number
          v-model="formModel[item.key]"
          allow-clear
          v-bind="itemProp"
          :placeholder="item.placeholder || `请输入${item.label}`"
        />
      </template>
      <!-- 选择框 -->
      <template v-if="item.itemType === 'select'">
        <a-select
          v-model="formModel[item.key]"
          :allow-clear="calcAllowClear(item)"
          v-bind="itemProp"
          :get-popup-container="(node) => node.parentNode"
          :placeholder="item.placeholder || `请选择${item.label}`"
        >
          <a-select-option
            v-for="it in itemData"
            :key="it.value"
            :value="it.value"
            :disabled="it.disabled"
          >{{ it.label }}</a-select-option>
        </a-select>
      </template>
      <!-- 树选择 -->
      <template v-if="item.itemType === 'treeSelect'">
        <a-tree-select
          v-model="formModel[item.key]"
          :tree-data="item.data"
          v-bind="itemProp"
          :get-popup-container="(node) => node.parentNode"
          :placeholder="item.placeholder || `请选择${item.label}`"
        />
      </template>
      <!-- range时间选择 -->
      <template v-if="item.itemType === 'rangePicker'">
        <a-range-picker
          :v-model="formModel[item.key]"
          :show-time="(itemProp && itemProp.showTime) || true"
          dropdown-class-name="date-dropdown"
          v-bind="itemProp"
          :get-calendar-container="(node) => node.parentNode"
          :ranges="
            (itemProp && itemProp.ranges) || {
              最近1天: [
                moment(+new Date() - 24 * 3600000),
                moment(+new Date())
              ],
              最近3天: [
                moment(+new Date() - 3 * 24 * 3600000),
                moment(+new Date())
              ],
              最近7天: [
                moment(+new Date() - 7 * 24 * 3600000),
                moment(+new Date())
              ]
            }
          "
        />
      </template>
      <!-- date时间 -->
      <template v-if="item.itemType === 'date'">
        <a-date-picker
          v-model="formModel[item.key]"
          v-bind="itemProp"
        />
      </template>
      <!-- 文本域 -->
      <template v-if="item.itemType === 'textarea'">
        <a-textarea
          v-model="formModel[item.key]"
          allow-clear
          v-bind="itemProp"
          :placeholder="item.placeholder || `请输入${item.label}`"
          :rows="4"
        />
        <span
          v-if="itemProp.showCount"
          class="textarea-count"
        >{{ formModel[item.key] | formatCount }}/{{
          itemProp.maxLength
        }}</span>
      </template>
      <!-- 单选框 -->
      <template v-if="item.itemType === 'radio'">
        <a-radio-group
          v-model="formModel[item.key]"
          :disabled="!!itemProp.disabled"
          v-bind="itemProp"
        >
          <a-radio
            v-for="it in itemData"
            :key="it.value"
            :value="it.value"
            :style="itemProp.style"
          >{{ it.label }}</a-radio>
        </a-radio-group>
      </template>
      <!-- 单选框 -->
      <template v-if="item.itemType === 'switch'">
        <a-switch
          v-model="formModel[item.key]"
          v-bind="itemProp"
        />
      </template>
      <!-- 副文本 -->
      <template v-if="item.itemType === 'editor'">
        <editor v-model.trim="formModel[item.key]" />
      </template>
    </slot>
    <!-- render函数自定义渲染 -->
    <render-expand
      v-if="item.render"
      :render="item.render"
      :text="formModel[item.key]"
      :record="item"
    />
  </a-form-model-item>
</template>

<script>
import renderExpand from '../render'
import editor from '@/components/wangEditor'
import moment from 'moment'
export default {
  components: {
    renderExpand,
    editor
  },
  filters: {
    formatCount(val) {
      return val?.length ?? 0
    }
  },
  props: {
    itemProp: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    },
    formModel: {
      type: Object,
      default: () => ({})
    },
    itemData: {
      type: Array,
      default: () => []
    },
    layout: {
      type: String,
      default: ''
    }
  },
  data() {
    return { moment }
  },
  computed: {
    computeClass({ layout }) {
      if (layout) {
        return `search-form-item-${layout}`
      } else {
        return 'search-form-item'
      }
    }
  },
  methods: {
    checkRules(item) {
      const arr = ['input', 'textarea', 'editor', 'number']
      if (item.required && !item.rules) {
        const str = arr.some((it) => it === item.itemType) ? '输入' : '选择'
        return [{ required: true, message: `请${str}${item.label}` }]
      } else {
        return item.rules || []
      }
    },
    calcAllowClear(item) {
      return item.itemProp?.['allow-clear'] ?? true
    }
  }
}
</script>

<style lang="less" scoped>
.search-form-item-inline {
  width: 100%;
  display: flex;
  margin-bottom: 24px;
  /deep/.ant-form-item-label {
    flex: none;
    min-width: 70px;
  }
  /deep/.ant-form-item-control-wrapper {
    flex: 1;
    padding-right: 6px;
    .ant-form-explain {
      position: absolute;
    }
  }
  .textarea-count {
    position: absolute;
    right: 0;
    bottom: -15px;
    line-height: 1;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
