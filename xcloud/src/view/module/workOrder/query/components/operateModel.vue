<template>
    <!-- 操作记录 -->
    <el-dialog title="操作记录" :visible.sync="dialogvisible" width="500px">

      <div v-if="productFunctionCode == 20">
        <div class="block-title">操作记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in activities"
              :key="index + 'records'"
              placement="top"
              hide-timestamp
            >
              <div class="timeline-header">
                <div>{{ item.createTime }}</div>
                <div>{{ item.createName }}</div>
              </div>
              <div>{{ item.node }}</div>
              <div>{{ item.instruction }}</div>
            </el-timeline-item>
          </el-timeline>
      </div>

      <OperationLog :activities="activities" v-else />
    </el-dialog>
</template>

<script>

import OperationLog from "@/view/module/newTaxServices/components/OperationLog.vue"

export default {
  props: {
    showLogDialog: Boolean,
    type: String,
    activities: Array,
    productFunctionCode: Number
  },
  components: {
    OperationLog
  },
  data() {
    return {
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.showLogDialog;
      },
      set(val) {
        this.$emit("update:showLogDialog", val);
      },
    },
  },
  created() {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.el-textarea {
  width: 300px;
}

/deep/ .el-dialog__footer {
  border-top: 1px solid #eee;
  padding-top: 20px;
  p {
    text-align: left;
  }
}

/deep/ .el-dialog__body {
  max-height: 500px;
  overflow: auto;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  color: #666;
}
</style>
