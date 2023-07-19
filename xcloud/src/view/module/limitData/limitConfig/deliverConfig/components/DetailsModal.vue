<template>
  <el-dialog title="查看" :visible.sync="showModal" width="494px" center>
    <div class="content">
      <div v-for="(item, index) in list" :key="index" class="content-block">
        <div class="block-item">
          <div class="block-item-title">预警时效：</div>
          <div>{{ item.warnDurationLog }}</div>
        </div>
        <div class="block-item">
          <div class="block-item-title">交付时效：</div>
          <div>{{ item.deliverDurationLog }}</div>
        </div>
        <div class="block-item">
          <div class="block-item-title">{{ item.createTime ? '新建时间' : '更新时间' }} ：</div>
          <div>{{ item.createTime ? item.createTime : item.changeDate }}</div>
        </div>
        <div class="block-item">
          <div class="block-item-title">操作人：</div>
          <div>{{ item.operatorUser }}</div>
        </div>
      </div>
      <div v-if="list.length === 0">暂无记录</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="showModal = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    list: [],
  },
  data() {
    return {
      showModal: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  max-height: 50vh;
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
        width: 70px;
        flex: 0 0 70px;
        white-space: nowrap;
      }
    }
  }
}
</style>
