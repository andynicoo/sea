<!-- 国家商标组册页 表格 -->
<template>
  <div>
    <table style="width: 100%;text-align: center" cellpadding="0" cellspacing="0">
      <tr class="header">
        <th style="width:68px;">序号</th>
        <th style="width:310px;">文件</th>
        <th style="width:200px;">备注</th>
        <th style="width:170px;">上传时间</th>
        <th style="width:140px;border-right:none;">操作</th>
      </tr>
      <tr v-for="(item,index) in answerFileList" :key="index">
        <td style="width:68px;">{{index+1}}</td>
        <td style="width:310px;">
          <a :href="replaceHttps(item.answerFile)" target="_blank" style="color:#00A3FF">{{initFileNameFunc(item.answerFile)}}（可点击查看）</a>
        </td>
        <td style="width:200px;">{{item.remark||'答复审核意见 '}}</td>
        <td style="width:170px;">{{item.answerDate||'无'}}</td>
        <td style="width:140px;border-right:none;" class="operation-td">
          <div @click="answerInfo=item;auditModal=true" v-if="item.status==6" v-show="hasAuthority('U1_9')">平台审核</div>
          <div @click="answerInfo=item;auditModal=true" v-if="item.status==7" v-show="hasAuthority('U1_10')">律师审核</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {},
};
</script>
<style lang='scss' scoped>

</style>