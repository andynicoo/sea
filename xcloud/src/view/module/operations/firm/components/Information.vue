<template>
<div class="form">
  <div class="tittle">
    <el-divider direction="vertical"></el-divider>
    <span class="text-info">基础信息</span>
  </div>
  <ul class="text-desc dis-flex">
    <li>企业名称：<span class="text-info"> {{ detailData.name }}</span></li>
    <li>法人：<span class="text-info">  {{ detailData.legalPerson || "-" }}</span></li>
    <li>联系人：<span class="text-info"> {{ detailData.contactPerson || "-" }}</span></li>
    <li>手机号：<span class="text-info"> {{ detailData.mobile || "-" }}</span></li>
    <li>纳税人类型：<span class="text-info"> {{ detailData.taxpayerType || "-" }}</span></li>
    <li>年应税销售额(万元)：<span class="text-info"> {{ detailData.taxSaleYear }}</span></li>
    <li>企业信息抬头：<span class="text-info">  {{ detailData.smsSigName || "-" }}</span></li>
    <li>状态：<span class="text-info"> {{ detailData.status == 1 ? "启用" : "禁用" }}</span></li>
    <li>备注：<span class="text-info"> {{ detailData.remark }}</span></li>
    <li>钉钉CorpId：<span class="text-info"> {{ detailData.dingCorpId || "-" }}</span></li>
    <li>客户端域名：<span class="text-info"> {{ detailData.clientDomainName || "-" }}</span></li>
    <li>公众号ID：<span class="text-info"> {{ detailData.publicIdNumber || "-" }}</span></li>
  </ul>
</div>

</template>
<script>
import { detailFirm } from "@/api/newApi/operations/firm.js";
export default {
  data() {
    return {
      detailData: {},
    };
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    /**
     * 获取详情
     */
    getDetail(row) {
      this.listLoading = true;
      detailFirm({
        enterpriseId: this.$route.query.id,
      }).then((res) => {
        // 延迟loading关闭
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
        if (res.code == 0) {
          // 设置列表和总条数
          this.detailData = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
  },
};
</script>

<style  lang="scss" scoped>
.form{
  border: 1px solid #EEEEEE;
  margin: 30px 0;
  padding: 10px 0;
}
.tittle{
  font-size: 14px;
  padding: 10px 25px;
}

</style>