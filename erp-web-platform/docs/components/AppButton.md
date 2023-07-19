# AButton

## Props

| Prop name  | Description                                            | Type   | Values | Default |
| ---------- | ------------------------------------------------------ | ------ | ------ | ------- |
| size       | Set size of the element                                | string | -      | '14px'  |
| color      | Sets the button font color                             | string | -      | 'black' |
| background | Sets background color of the button<br/>`@since` 1.2.0 | string | -      | 'white' |
| oldColor   | <br/>`@deprecated` Use color instead                   | string | -      |         |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| click      |            |
| gator      |            |

## Slots

| Name    | Description                               | Bindings |
| ------- | ----------------------------------------- | -------- |
| default | Use this slot to place the button content |          |

---

This button is amazing, use it responsibly.

## Examples

Orange button:

```jsx
<app-button color="orange">Push Me</app-button>
```

Ugly button with pink font and blue background:

```jsx
<app-button color="pink" background="blue">
  Ugly button
</app-button>
```

Button containing custom tags:

```jsx
<app-button>
  Text with <b>bold</b>
</app-button>
```
