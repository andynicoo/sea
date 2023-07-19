<template>
  <el-dialog title="备注信息" :visible.sync="dialogvisible" width="494px" center>
    <div class="content">
      <div v-for="(item, index) in remarkList" :key="index" class="content-block">
        <div class="block-item">
          <div class="block-item-title">备注人：</div>
          <div>{{ item.remarkBy }}</div>
        </div>
        <div class="block-item">
          <div class="block-item-title">内容：</div>
          <div>{{ item.remarkComment }}</div>
        </div>
        <div class="block-item" v-if="item.annex">
          <div class="block-item-title">附件：</div>
          <a :href="item.annex" :underline="false" target="_blank" class="text-primary file">{{ item.annexName || item.annex }}</a>
        </div>
        <div class="block-item">
          <div class="block-item-title">时间：</div>
          <div>{{ item.createTime }}</div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  props: {
    workOrderRemarkDialog: Boolean,
    workNo: String,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.workOrderRemarkDialog;
      },
      set(val) {
        this.$emit('update:workOrderRemarkDialog', val);
      },
    },
  },
  data() {
    return {
      remarkList: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      workOrderCommonOperator('checkRemark', { serviceNo: this.workNo }).then((res) => {
        if (res.code == 0) {
          this.remarkList = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 35px;
  .content-block {
    padding: 20px;
    border: 1px solid #eeeeee;
    margin-bottom: 20px;
    .block-item {
      display: flex;
      margin-bottom: 10px;
      .block-item-title {
        color: #999;
        width: 60px;
        flex: 0 0 60px;
        white-space: nowrap;
      }
    }
  }
}
</style>
