<template>
  <div>
    <!-- 普通输入框 -->
    <template v-if="attr.inputType === 'text'">
      <a-input :value="value" @blur="onBlur" />
    </template>

    <!-- 数字输入框 -->
    <template v-if="attr.inputType === 'numeric'">
      <a-input-number :value="value" @blur="onBlur" style="width: 100%" />
    </template>

    <!-- 日期选择器 -->
    <template v-if="attr.inputType === 'date'">
      <a-date-picker :value="value" @blur="onBlur" style="width: 100%" />
    </template>

    <!-- 枚举选择器 -->
    <template v-if="attr.inputType === 'enumInput'">
      <a-select
        :value="value"
        @popupScroll="onSelectPopupScroll"
        @focus="onSelectFocus"
        @change="onSelectChange"
      >
        <a-select-option
          v-for="option of options"
          :key="option.name"
          :value="option.name"
        >
          {{ option.name }}
        </a-select-option>
      </a-select>
    </template>

    <!-- 多项选择器 -->
    <template
      v-if="
        attr.inputType === 'multiSelect' || attr.inputType === 'multiEnumInput'
      "
    >
      <a-select
        mode="multiple"
        :value="value"
        @focus="onSelectFocus"
        @change="onSelectChange"
        @popupScroll="onSelectPopupScroll"
      >
        <a-select-option
          v-for="option of options"
          :key="option.name"
          :value="option.name"
        >
          {{ option.name }}
        </a-select-option>
      </a-select>
    </template>

    <!-- 图片选择器 -->
    <template v-if="attr.inputType === 'img'">
      <Upload :value="value" @blur="onBlur" />
    </template>

    <!-- 富文本 -->
    <template v-if="!type && attr.inputType === 'richText'">
      <!-- <div :id="attr.name"></div> -->
      <a-textarea :rows="10" :value="value" @blur="onBlur" />
    </template>

    <!-- 富文本 -->
    <template v-if="type === 'richText'">
      <div :id="attr.name"></div>
    </template>

    <!-- 单选 -->
    <template v-if="attr.inputType === 'singleSelect'">
      <a-select
        :value="value"
        @popupScroll="onSelectPopupScroll"
        @focus="onSelectFocus"
        @change="onSelectChange"
      >
        <a-select-option
          v-for="option of options"
          :key="option.name"
          :value="option.name"
        >
          {{ option.name }}
        </a-select-option>
      </a-select>
    </template>
  </div>
</template>

<script>
import E from 'wangeditor'
import { slice } from 'lodash'
import Upload from './Upload'

export default {
  components: {
    Upload
  },
  props: {
    value: [String, Number, Array],
    attr: Object,
    type: String
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    options() {
      const attr = this.$props.attr
      const step = this.$data.step
      return slice(attr.options, 0, step * 50)
    }
  },
  mounted() {
    if (this.$props.type === 'richText') {
      // if (this.$props.attr.inputType === 'richText') {
      this.createRichInput(this.$props.attr.name)
    }
  },
  methods: {
    createRichInput(element) {
      const editContainer = new E(`#${element}`)
      editContainer.config.zIndex = 8
      editContainer.config.onchange = (html) => {
        this.$emit('input', html)
      }
      editContainer.create()
      editContainer.txt.html(this.$props.value)
      this.editContainer = editContainer
    },
    changeEditContainer(value) {
      this.editContainer.txt.html(value)
    },
    onBlur(event) {
      this.$emit('input', event.target.value)
    },
    /**选择器获取焦点事件 */
    onSelectFocus() {
      this.$data.step = 1
    },
    onSelectChange(value) {
      this.$emit('input', value)
    },
    onSelectPopupScroll(event) {
      const attr = this.$props.attr
      if (
        attr.options.length <= 50 ||
        this.options.length === attr.options.length
      ) {
        return
      }
      const { target } = event
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      if (scrollHeight - clientHeight <= 50) {
        this.$data.step = this.$data.step + 1
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
