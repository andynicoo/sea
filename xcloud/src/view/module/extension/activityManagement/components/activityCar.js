export default {
  name: "ActivityCar",
  props: {
    textList: {
      type: Array,
      default: () => [],
    },
  },

  render(h) {
    return h("div", { class: ["card-main"] }, [
      h("i", {
        class: ["el-icon-s-marketing"],
        style: {
          fontSize: "40px",
        },
      }),
      h("h5", {}, this.textList.length > 0 ? this.textList[0] : ""),
      h("p", { class: ["card-main-p"] }, this.textList.length > 1 ? this.textList[1] : ""),
      h(
        "el-button",
        {
          class: "floatSpan",
          props: {
            type: "primary",
          },

          on: {
            click: this.clickHandler,
          },
        },
        "立即创建"
      ),
    ]);
  },

  methods: {
    clickHandler(evt) {
      this.$emit("click", evt);
    },
  },
};
