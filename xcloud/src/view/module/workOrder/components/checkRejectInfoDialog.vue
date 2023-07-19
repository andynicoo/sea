<template>
  <el-dialog title="驳回详情" :visible.sync="dialogvisible" width="478px" center>
    <el-timeline class="ope-wrapper" v-if="list.length > 0">
      <el-timeline-item v-for="(item, index) in list" :key="index" placement="top" hide-timestamp>
        <div class="ope-title">
          <div style="white-space: nowrap; margin-right: 10px">{{ item.createTime }}</div>
          <div>{{ item.createBy }}</div>
        </div>
        <div class="ope-block"><span>驳回路径：</span>{{ item.comment }}</div>
        <div class="ope-block"><span class="text-red">驳回原因：</span>{{ item.reason }}</div>
      </el-timeline-item>
    </el-timeline>
    <p style="text-align: center" v-else>暂无驳回数据</p>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listReject } from '@/api/newApi/taxServices/serviceManage.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  props: {
    checkRejectInfoDialog: Boolean,
    serviceNo: String,
    workNo: String,
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.checkRejectInfoDialog;
      },
      set(val) {
        this.$emit('update:checkRejectInfoDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.getRejectList();
      }
    },
  },
  methods: {
    getRejectList() {
      if (this.workNo) {
        workOrderCommonOperator('checkReject', {
          workNo: this.workNo,
        }).then((res) => {
          if (res.code === 0) {
            this.list = res.data;
          }
        });
      } else {
        listReject({
          serviceNo: this.serviceNo,
        }).then((res) => {
          if (res.code === 0) {
            this.list = res.data;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ope-wrapper {
  max-height: 300px;
  overflow-y: auto;
  padding: 0 35px;
  font-size: 12px;
  .ope-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #666 !important;
  }
  .ope-block {
    margin-bottom: 6px;
    color: #666 !important;
  }
}
</style>
