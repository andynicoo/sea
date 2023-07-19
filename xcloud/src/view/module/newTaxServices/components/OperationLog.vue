<template>
  <!-- 操作日志 -->
  <div>
    <div class="block-title" v-if="showTitle">
      <span>操作记录</span>
      <slot name="title"></slot>
    </div>
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in activities" :key="index" placement="top" hide-timestamp>
        <template v-if="type === 'trademark'">
          <div>
            <b>{{ activity.businessOperateName }}</b>
            <div>时间：{{ activity.businessOperateTime }}</div>
            <div>操作人：{{ activity.username || activity.userMobile }}</div>
          </div>
          <div>操作节点：{{ activity.businessNodeName }}</div>
          <div v-if="activity.businessRemark">备注：{{ activity.businessRemark }}</div>
          <div v-if="activity.businessOperateReason">驳回原因：{{ activity.businessOperateReason }} &nbsp; {{ activity.businessRemark }}</div>
        </template>
        <template v-else>
          <div class="timeline-header">
            <div>{{ activity.businessOperateTime }}</div>
            <div>{{ activity.username || activity.userMobile }}</div>
          </div>
          <div>{{ activity.businessNodeName }}</div>
          <div class="word-break">
            <span v-html="activity.businessOperateName"> </span>
            {{ activity.businessOperateReason }} &nbsp;
            <span v-html="handleHttpStr(activity.businessRemark)"></span>
          </div>
        </template>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  props: {
    activities: { type: Array },
    type: {
      type: String,
      default: '',
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleHttpStr(str) {
      if (str.indexOf('http') == -1) {
        return str;
      }
      let urlPattern = /(https?:\/\/|www\.)[a-zA-Z_0-9\-@]+(\.\w[a-zA-Z_0-9\-:]+)+(\/[\(\)~#&\-=?\+\%/\.\w]+)?/g;
      var res = str.replace(urlPattern, function (match) {
        var href = match;
        if (match.indexOf('http') == -1) {
          href = 'http://' + match;
        }
        return '<a style=\'color: #1890ff;\' target="_blank" href="' + href + '">' + '查看' + '</a>';
      });
      return res;
    },
  },
};
</script>
<style lang="scss" scoped>
.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  color: #666;
}
.word-break {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
