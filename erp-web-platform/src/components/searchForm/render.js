export default {
  name: 'render',
  functional: true,
  props: {
    render: Function,
    record: Object,
    text: [String, Boolean, Array, Number, Object],
    index: Number
  },
  render: (h, ctx) => {
    const params = {
      record: ctx.props.record,
      text: ctx.props.text,
      index: ctx.props.index
    }
    return ctx.props.render(h, params)
  }
}
