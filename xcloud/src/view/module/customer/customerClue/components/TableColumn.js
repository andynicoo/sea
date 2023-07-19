import { TableColumn } from "element-ui";

export default {
  extends: TableColumn,
  props: {
    align: {
      default: "center",
      type: String,
    },
    showOverflowTooltip: {
      default: true,
      type: Boolean,
    },
    formatter: {
      default: (row, column, cellValue, index) => {
        return cellValue === null || cellValue === undefined || cellValue === "" ? "-" : cellValue;
      },
      type: Function,
    },
  },
  errorCaptured() {
    return false;
  },

  watch: {
    // emptyContent: {
    //   handler: function (v) {
    //     console.log("emptyContent", v);
    //     if (typeof v === "function") {
    //       this.formatter = v;
    //     } else {
    //       this.formatter = (row, column, cellValue, index) => {
    //         return cellValue === null || cellValue === undefined || cellValue === "" ? v : cellValue;
    //       };
    //     }
    //   },
    //   immediate: true,
    // },
  },
  methods: {},
};
