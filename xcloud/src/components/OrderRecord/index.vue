<template>
  <div class="orderlist">
    <el-steps>
      <el-step v-for="(item, index) in activities" :key="index">
        <div slot="title" class="title">
          <span>{{ item.businessOperateName }}</span>
        </div>
        <div slot="description" class="description">
          <div>操作人：{{ item.username || item.userMobile }}</div>
          <div>操作时间：{{ item.businessOperateTime }}</div>
          <div v-if="item.attachmentFileUrl">
            审核凭证：
            <el-link type="primary" target="_blank" :href="item.attachmentFileUrl">审核凭证</el-link>
          </div>
          <div v-if="item.businessOperateReason || item.businessRemark">
            备注：<span class="text-default">{{ item.businessOperateReason }} &nbsp; {{ item.businessRemark }}</span>
          </div>
        </div>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  props: {
    activities: { type: Array },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.orderlist {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 15px 20px;
  .title {
    span {
      color: #666666;
      margin-right: 50px;
    }
  }
  .description {
    color: #333;
  }
}
::v-deep .el-step {
  width: 300px;
}
/deep/ .el-steps {
  width: max-content;
  .el-step__line {
    top: 8px;
    background-color: #e4e7ec;
  }
  .el-step__icon.is-text {
    border: 0;
    border-color: inherit;
    background: #e4e7ec;
    color: #e4e7ec;
    width: 12px;
    height: 12px;
  }
}
</style>
