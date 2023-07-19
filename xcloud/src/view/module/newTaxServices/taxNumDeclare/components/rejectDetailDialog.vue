<template>
  <el-dialog title="驳回详情" :visible.sync="dialogvisible" width="400px" center>
    <el-timeline class="ope-wrapper" v-if="rejectList.length > 0">
      <el-timeline-item v-for="(activity, index) in rejectList" :key="index" placement="top" hide-timestamp>
        <div class="ope-block">
          <div>{{ activity.createTime }}</div>
          <div>{{ activity.createBy }}</div>
        </div>
        <div>{{ activity.comment }}</div>
      </el-timeline-item>
    </el-timeline>
    <p style="text-align:center" v-else>暂无驳回原因</p>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" style="width: 65px" type="primary" @click="dialogvisible = false">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listReject } from "@/api/newApi/taxServices/serviceManage.js";
import { filingRejectInfo } from "@/api/newApi/workOrder/productFiling.js";
export default {
  props: {
    rejectDetailDialog: { type: Boolean },
    serviceId: { type: String },
    apiKey: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      rejectList: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.rejectDetailDialog;
      },
      set(val) {
        this.$emit("update:rejectDetailDialog", val);
      },
    },
  },
  created() {
    this.getListReject();
  },
  methods: {
    //驳回原因列表
    getListReject() {
      this.apiKey === "taxNumDeclare" ? this.filingRejectInfoApi() : this.listRejectApi();
    },
    listRejectApi() {
      listReject({ serviceNo: "" })
        .then((res) => {
          if (res.code === 0) {
            this.rejectList = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /**申报详情页 的驳回详情 */
    filingRejectInfoApi() {
      filingRejectInfo({
        workNo: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.rejectList = res.data;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.ope-wrapper {
  max-height: 300px;
  overflow-y: auto;
  .ope-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
    color: #666;
  }
}
</style>
