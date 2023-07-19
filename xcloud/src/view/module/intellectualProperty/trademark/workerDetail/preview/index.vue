<template>
  <el-dialog title='使用证据详情' :visible.sync="isShow" width="70%" center :before-close="handleClose">
    <div class="container">
      <div class="details-box">
        <el-row>首次使用日期：{{this.formInfo.firstBusinessUseDate || '--'}}</el-row>
        <el-row>首次在商业上的使用日期：{{this.formInfo.firstUseDate || '--'}}</el-row>
        <div class="row" v-if='setMarketHref(this.formInfo.marketHref).length != 0'>
          <el-row>销售链接：</el-row>
          <el-row v-for="(item,index) in setMarketHref(this.formInfo.marketHref)" :key="index+1">
            <el-col :span="14">链接: <a :href="replaceHttps(item.fileUrl)" target="_blank" style="color:#1890ff;">{{item.marketHref }}</a></el-col>
            <el-col :span="10">小类:{{item.category2NameEn}}</el-col>
          </el-row>
        </div>
        <el-row v-else>销售链接：--</el-row>
        <div class="row" v-if='setMarketHref(this.formInfo.useProductImg).length != 0'>
          <el-row>产品图：</el-row>
          <el-row v-for="(item,index) in setMarketHref(this.formInfo.useProductImg)" :key="index+2">
            <a :href="replaceHttps(item.fileUrl)" target="_blank" style="color:#1890ff;"><img src="@/assets/images/infoDetail/bainji-blue.svg" alt="">{{item.fileName}}</a>
          </el-row>
        </div>
        <el-row v-else>产品图:--</el-row>
        <div class="row" v-if='setMarketHref(this.formInfo.useEvidence ).length != 0'>
          <el-row>订单详情截图：</el-row>
          <el-row v-for="(item,index) in setMarketHref(this.formInfo.useEvidence )" :key="index+3">
            <a :href="replaceHttps(item.fileUrl)" target="_blank" style="color:#1890ff;"><img src="@/assets/images/infoDetail/bainji-blue.svg" alt="">{{item.fileName}}</a>
          </el-row>
        </div>
        <el-row v-else>订单详情截图：--</el-row>

      </div>
    </div>
  </el-dialog>
</template>
<script>
import * as API from '@/api/newApi/intellectualProperty/oa.js';

export default {
  props: {
    previewShow: {
      type: Boolean,
      default: false,
    },
  },
  id: {
    type: String,
    default: '',
  },
  data() {
    return {
      formInfo: {},
      usrProductImgList: [],
      isShow: false,
    };
  },
  computed: {},
  created() {
    this.getDetailFun();
  },
  methods: {
    handleClose(done) {
      done();
      this.$emit('update:previewShow', false);
    },
    close() {
      this.isShow = false;
      this.$emit('update:previewShow', false);
    },
    setMarketHref(data) {
      return data && data != '' ? JSON.parse(data) : [];
    },
    async getDetailFun() {
      let { code, data } = await API.getEvidenceDetail({ serviceId: this.id || this.$parent.previewID });
      this.formInfo = data;
    },
  },
  watch: {
    previewShow: {
      handler(val) {
        this.isShow = val;
      },
      immediate: true,
    },
  },
  mounted() {
    this.getDetailFun();
  },
};
</script>
<style lang="less" scoped>
.row {
  margin-top: 20px;
}
.container {
  background-color: #fff;
  padding: 24px;
  .title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    img {
      vertical-align: middle;
    }
  }
  p {
    line-height: 30px;
  }
  .details-box {
    margin-top: 24px;
    .box-title {
      // padding: 11px 24px;
      // font-size: 16px;
      // font-family: PingFangSC-Medium, PingFang SC;
      // font-weight: 500;
      // color: rgba(0, 0, 0, 0.85);
      // background-color: #fafafa;
      // border-bottom: 1px solid #e9e9e9;
    }
    .box-bottom {
      padding: 16px 24px;
    }
    .left-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
    .right-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      color: #666666;
      line-height: 22px;
      max-width: 75%;
      word-break: break-all;
    }
    .ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      vertical-align: sub;
    }

    .evidence-box {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      p {
        word-break: break-word;
        padding-right: 20px;
      }
      p:hover a {
        color: #00a3ff;
      }
    }
    .evidence {
      img {
        vertical-align: middle;
      }
      a {
        color: #666666;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
  .button-box {
    border-top: 1px solid #ebebeb;
    padding-top: 32px;
  }
  .back-button {
    width: 60px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #00a3ff;
    color: #00a3ff;
    margin-left: 15px;
  }
  .bread-logo {
    width: 106px;
    height: 106px;
    vertical-align: text-top;
  }
  .info-table {
    margin-top: 6px;
    // width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 14px;
    box-sizing: border-box;
    tr {
      td {
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        border-right: 1px solid rgba(0, 0, 0, 0.06);
        word-break: break-word;
      }
    }
    .header {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      th {
        padding: 8px 0;
        border-right: 1px solid rgba(0, 0, 0, 0.06);
      }
    }
    td {
      padding: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
  }
  .tab-box {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 10px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    span {
      margin-right: 32px;
      cursor: pointer;
    }
    span.tab-active {
      color: #00a3ff;
      border-bottom: 2px solid #00a3ff;
      padding-bottom: 10px;
    }
  }
  .null-file {
    text-align: center;
    margin-top: 16px;
    margin-bottom: 240px;
    .first-p {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin: 10px 0 8px 0;
    }
    p {
      font-size: 14px;
      font-family: PingFangSC;
      color: #666666;
    }
  }
  .operation-td {
    div {
      cursor: pointer;
      color: #00a3ff;
      min-width: 60px;
    }
  }
  .table-bottom-tips {
    margin: 24px;
    span {
      color: #333;
      font-size: 700;
    }
  }
  /deep/ .ivu-poptip-inner {
    white-space: break-spaces;
  }
  /deep/ .ivu-poptip-body {
    margin-top: -20px;
  }
  /deep/ .ivu-poptip-popper {
    min-width: 315px;
    font-size: 14px;
  }
}
/deep/ .ivu-form-item-label {
  color: #333;
  font-size: 14px;
  padding: 10px 12px 8px 0;
}
/deep/ .formTranslate .ivu-form-item {
  margin-bottom: 10px;
}
.formTranslate p {
  word-break: break-all;
}
.label-title {
  color: #333;
  margin-bottom: -12px;
}
</style>
