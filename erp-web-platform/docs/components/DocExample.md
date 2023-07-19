# AButton

> 这是一个输出标准组件文档的示例组件
> 多行文本说明可以使用多行注释，也可以用`<docs lang="md">`标签包裹起来

## Props

| Prop name  | Description                          | Type   | Values | Default |
| ---------- | ------------------------------------ | ------ | ------ | ------- |
| color      | 按钮文字颜色                         | string | -      | 'black' |
| background | 背景<br/>`@since` 1.2.0              | string | -      | 'white' |
| oldColor   | <br/>`@deprecated` Use color instead | string | -      |         |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| click      |            |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |

---

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
