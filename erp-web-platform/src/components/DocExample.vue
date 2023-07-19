<template>
  <button :style="styles" @click="handleClick">
    <!-- 插槽 -->
    <slot></slot>
  </button>
</template>
<script>
/**
 * 这是一个输出标准组件文档的示例组件
 * 多行文本说明可以使用多行注释，也可以用`<docs lang="md">`标签包裹起来
 *
 */

export default {
  name: 'AButton',
  props: {
    /**
     * 按钮文字颜色
     */
    color: {
      type: String,
      default: 'black'
    },
    /** 背景
     * @since 1.2.0
     */
    background: {
      type: String,
      default: 'white'
    },
    /** @deprecated Use color instead */
    oldColor: String
  },
  computed: {
    styles() {
      return {
        'font-size': this.size,
        color: this.color,
        background: this.background
      }
    }
  },
  methods: {
    /** 点击事件
     * @event click
     * @type {Event}
     */
    /**
     * @event gator
     * @type {Event}
     */
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>
<docs lang="md">
This button is amazing, use it responsibly.
## Examples
Orange button:
```jsx
<a-button color="orange">Push Me</a-button>
```
Ugly button with pink font and blue background:
```jsx
<a-button color="pink" background="blue">
  Ugly button
</a-button>
```
Button containing custom tags:
```jsx
<a-button>
  Text with <b>bold</b>
</a-button>
```
</docs>
