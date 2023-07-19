<template>
  <a-form-model-item
    :key="item.key"
    :class="{ 'search-form-item': layout !== 'vertical' }"
    :label="item.label"
    :rules="checkRules(item)"
    :prop="item.key"
  >
    <slot
      v-if="!item.render"
      :name="item.slotName"
      :data="item"
      :itemData="item.Data"
    >
      <!-- 输入框 -->
      <template v-if="item.itemType === 'input'">
        <a-input
          v-model.trim="formModel[item.key]"
          v-bind="itemProp"
          allow-clear
          :placeholder="item.placeholder || `请输入${item.label}`"
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
          allow-clear
          v-bind="itemProp"
          :get-popup-container="(node) => node.parentNode"
          :placeholder="item.placeholder || `请选择${item.label}`"
          v-on="itemProp"
        >
          <a-select-option
            v-for="it in itemData"
            :key="it.value"
            :value="it.value"
            >{{ it.label }}</a-select-option
          >
        </a-select>
      </template>
      <!-- range时间选择 -->
      <template v-if="item.itemType === 'rangePicker'">
        <a-range-picker
          :v-model="formModel[item.key]"
          show-time
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
        <a-date-picker v-model="formModel[item.key]" v-bind="itemProp" />
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
        <span v-if="itemProp.showCount" class="textarea-count"
          >{{ formModel[item.key] | formatCount }}/{{
            itemProp.maxLength
          }}</span
        >
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
            >{{ it.label }}</a-radio
          >
        </a-radio-group>
      </template>
      <!-- 单选框 -->
      <template v-if="item.itemType === 'swich'">
        <a-switch v-model="formModel[item.key]" v-bind="itemProp" />
      </template>
    </slot>
    <!-- render函数自定义渲染 -->
    <RenderExpand
      v-if="item.render"
      :render="item.render"
      :text="formModel[item.key]"
      :record="item"
    />
  </a-form-model-item>
</template>

<script>
import RenderExpand from './render'
import moment from 'moment'
export default {
  components: {
    RenderExpand
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
      type: String
    }
  },
  data() {
    return { moment }
  },
  computed: {},
  methods: {
    checkRules(item) {
      const arr = ['input', 'textarea', 'editor']
      if (item.required && !item.rules) {
        const str = arr.some((it) => it === item.itemType) ? '输入' : '选择'
        return [{ required: true, message: `请${str}${item.label}` }]
      } else {
        return item.rules || []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-form-item {
  width: 100%;
  display: flex;
  margin-bottom: 24px;
  /deep/.ant-form-item-label {
    flex: none;
    min-width: 70px;
  }
  /deep/.ant-form-item-control-wrapper {
    flex: 1;
    // padding-right: 6px;
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
