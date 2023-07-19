<template>
  <el-button
    type="primary"
    size="small"
    class="green-btn"
    @click="_export"
    v-if="hasAuthority(auth)"
    :loading="exportLoading"
  >
    <template v-slot:default>
      <i class="icon icon-export" />
      <slot><span>导出</span></slot>
    </template>
  </el-button>
</template>
<script>
export default {
  props: {
    auth: {
      require: true,
      type: String,
    },
    exportApi: {
      require: true,
      type: Function,
    },
    excelTitle: {
      default: "excel",
      require: true,
      type: String,
    },
    params: {
      type: Object,
    },
    total: {
      type: Number,
    },
    ids: {
      default: [],
      type: Array,
    },
    onOk: {
      default: () => {},
      type: Function,
    },
    onError: {
      default: () => {},
      type: Function,
    },
    onCance: {
      default: () => {},
      type: Function,
    },
  },
  data() {
    return {
      exportLoading: false,
    };
  },
  methods: {
    _export() {
      const idsLength = this.ids.length;
      this.$confirm(`当前选择${idsLength || this.total}条数据 ，是否确认导出？`, "数据导出", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(
        () => {
          this.exportLoading = true;

          // 用ids的长度来判断是否是'全部导出'或者'部分导出'
          let req = {
            ...this.params,
            total: this.total,
            options: idsLength ? this.ids : null,
          };
          console.log("req", req);
          this.exportApi(req)
            .then((res) => {
              this.$util.exportExcel(res, this.excelTitle);
            })
            .then(() => {
              this.onOk();
            })
            .catch(() => {
              this.onError();
            })
            .finally(() => {
              this.exportLoading = false;
            });
        },
        () => {
          this.onCance();
        }
      );
    },
  },
};
</script>
<style scoped></style>
