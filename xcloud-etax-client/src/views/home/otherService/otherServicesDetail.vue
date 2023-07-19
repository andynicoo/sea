<template>
  <div class="content">
    <div class="head-content">
      <div class="head-title">
        {{ serviceInfo.serviceName }}
        <span class="status-name">({{ statusName }})</span>
      </div>
      <div class="tip-box" v-if="serviceInfo.progressBar == 5 && serviceInfo.rejectReason !== ''">
        <div class="tip-content">
          <p>
            <img src="@/assets/images/common/yellowTip.png" alt="" />
            请重新提交当前资料
          </p>
          <p class="reason">当前资料被驳回（原因：{{ serviceInfo.rejectReason }}）</p>
        </div>
      </div>
      <div class="worker-info-box" v-if="[2, 3].includes(serviceInfo.progressBar)">
        <p class="info-item" v-if="serviceInfo.completeTime">
          <span class="left-item">服务完成日期：</span>
          <span>{{ serviceInfo.completeTime.slice(0, 10) }}</span>
        </p>
        <p class="info-item">
          <span class="left-item">回执：</span>
          <span class="right-item" v-if="workOrderInfo.receiptUrl != ''" @click="downLoad(3)">
            <img src="@/assets/images/survey/uploadBlue.png" alt />
            点击下载
          </span>
          <span v-else class="c666">暂无</span>
        </p>
      </div>
    </div>
    <div class="bottom-content">
      <Form ref="formData" :model="formData" :label-width="90" label-position="right" :rules="ruleValidate" inline>
        <div class="form-item">
          <div class="form-title">公司信息</div>
          <FormItem label="公司名称" prop="companyNameZh">
            <Input
              v-model="formData.companyNameZh"
              style="width: 294px"
              placeholder="请输入"
              :disabled="isEditor || isCancel"
            ></Input>
          </FormItem>
        </div>
        <div class="form-item">
          <div class="form-title">
            申请资料
            <span class="title-explain">(请准备以下材料)</span>
          </div>
          <div class="tip-box" v-if="serviceInfo.progressBar == 1">
            <p class="tip-content">
              <img src="@/assets/images/common/yellowTip.png" alt="" />
              温馨提示：暂无资料，请联系您的客户经理或者客服
            </p>
          </div>
          <FormItem label="资料清单" prop="likeName" v-else>
            <span class="downLoad-box" @click="downLoad(1)">
              <img src="@/assets/images/survey/uploadBlue.png" alt />
              点击下载
            </span>
          </FormItem>
        </div>
        <div class="form-item">
          <div class="form-title">
            上传资料
            <span class="title-explain">(按照资料清单要求上传资料，支持上传多个文件及压缩包)</span>
          </div>
          <FormItem label="资料" prop="fileList">
            <Upload
              class="upload-box"
              ref="uploadEvidence"
              v-model="formData.fileList"
              :on-success="successHandler"
              :on-format-error="formatErrorHandler"
              :default-file-list="formData.fileList"
              :show-upload-list="false"
              :action="ImgUrl"
              :disabled="isEditor || isCancel"
              :max-size="102400"
              :data="{ prefix: '' }"
              :format="['jpg', 'jpeg', 'png', 'pdf', 'zip', 'xls', 'doc', 'docx', 'xlsx', 'rar', 'zip']"
              :limit="20"
              :on-exceeded-size="handleMaxSize"
            >
              <img src="@/assets/images/common/uploadTransparent.svg" alt="" />
              <span>点击上传</span>
            </Upload>
            <p class="upload-tip" v-if="formData.fileList.length == 0">注：支持JPG、JPEG、PNG、PDF、ZIP格式上传</p>
            <ul class="file-list" v-if="formData.fileList.length > 0">
              <li v-for="(vv, ii) in formData.fileList" :key="ii">
                <a :href="replaceHttps(vv.url)" target="_blank">
                  <img src="@/assets/images/common/link-icon.png" alt="" class="link-img" />
                  {{ vv.name }}
                </a>
                <img
                  src="@/assets/images/common/close.png"
                  alt=""
                  class="del-img"
                  @click="removeHandler(ii)"
                  v-if="!isEditor && !isCancel"
                />
              </li>
            </ul>
          </FormItem>
        </div>
        <div class="operation-box" v-if="!isEditor && !isCancel">
          <Button @click="handleSubmit(0)">保存</Button>
          <Button type="primary" @click="handleSubmit(1)">提交</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import {
  getSimpleWorkOrderDetail,
  simpleWorkOrderSubmit,
  simpleWorkOrderStatus,
} from '@/api/otherService/otherService';
import { progressList } from './progressList.js';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
export default {
  data() {
    return {
      formData: {
        companyNameZh: '',
        fileList: [],
      },
      ruleValidate: {
        companyNameZh: [{ required: true, message: '请填写公司名称', trigger: 'blur' }],
        fileList: [{ required: true, message: '请上传资料', trigger: 'change', type: 'array' }],
      },
      isEditor: false,
      newFileList: [],
      id: this.$route.query.id,
      serviceInfo: {},
      workOrderInfo: {},
    };
  },
  mixins: [isServiceCancel],
  methods: {
    getDetailInfo() {
      getSimpleWorkOrderDetail(this.id).then((res) => {
        if (res.code == 0) {
          this.serviceInfo = res.data.serviceInfo;
          this.ifCancel(res.data.serviceInfo.status);
          this.workOrderInfo = res.data.workOrderInfo;
          this.formData.companyNameZh = res.data.serviceInfo.companyNameZh;
          this.isEditor = this.serviceInfo.progressBar !== 5 ? true : false;
          if (this.workOrderInfo.materialUrl) {
            let fileUrlList = this.workOrderInfo.materialUrl.split(',');
            let fileNameList = this.workOrderInfo.materialName.split(',');
            fileUrlList.map((item, index) => {
              let obj = {
                name: fileNameList[index],
                url: item,
              };
              this.formData.fileList.push(obj);
            });
          }
        }
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: '上传文件不超过100M',
      });
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传jpg,png,jpeg,pdf,zip,xls,doc,docx,xlsx,rar,zip格式的文件',
      });
    },
    successHandler(res, file, fileList) {
      if (res.message !== 'success') {
        return;
      }
      console.log('successHandler', fileList);
      let obj = {
        name: res.data.origFileName,
        url: res.data.fileUrl,
      };
      this.formData.fileList.push(obj);
    },
    removeHandler(i) {
      this.formData.fileList.splice(i, 1);
    },
    // 下载资料
    downLoad(type) {
      let fileName = type == 1 ? '资料清单' : '回执';
      this.$util.downFile(
        this.baseUrl + `/workorder/client/simpleWorkOrder/material/down?id=${this.id}&materialType=${type}`,
        `${this.serviceInfo.serviceName}_${fileName}`
      );
    },
    handleSubmit(type) {
      if (type) {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.submitApi(type);
          } else {
            this.$Message.error('请填写完整信息');
          }
        });
      } else {
        this.submitApi();
      }
    },
    submitApi(type) {
      let materialName = '',
        materialUrl = '';
      console.log(this.formData.fileList);
      if (this.formData.fileList.length > 0) {
        materialName = this.formData.fileList.map((item) => item.name).join(',');
        materialUrl = this.formData.fileList.map((item) => item.url).join(',');
      }
      let submitData = {
        id: this.workOrderInfo.id,
        companyNameZh: this.formData.companyNameZh,
        materialName,
        materialUrl,
      };
      simpleWorkOrderSubmit(submitData).then((res) => {
        if (res.code == 0) {
          this.$Message.success('操作成功');
          if (type) {
            simpleWorkOrderStatus({ id: this.id, progressBar: this.serviceInfo.progressBar }).then((res) => {
              if (res.code == 0) {
                this.$router.push('/otherService');
              }
            });
          }
        }
      });
    },
  },
  mounted() {
    this.getDetailInfo();
  },
  computed: {
    statusName() {
      let progressName = '';
      progressList.map((item) => {
        if (this.serviceInfo.progressBar == item.progressBar) {
          progressName = item.progressName;
        }
      });
      return progressName;
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  min-height: calc(100vh - 60px);
  /deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  /deep/ .ivu-table:before,
  /deep/ .ivu-table-border:after {
    width: 0px;
  }
  /deep/ .ivu-table-header thead tr th {
    font-size: 14px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    // line-height: 14px;
    height: 48px;
  }
  /deep/ .ivu-table td {
    height: 114px;
    font-size: 12px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .head-content {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 12px 32px;
    .head-title {
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      .status-name {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .tip-box {
      padding: 12px 0;
      p {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ed3e3e;
        line-height: 26px;
      }
      .reason {
        margin-left: 22px;
      }
    }
  }
  .bottom-content {
    margin: 24px;
    .form-item {
      margin-bottom: 24px;
      background-color: #ffffff;
      .form-title {
        background: #ffdc87;
        border-radius: 4px 4px 0px 0px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        padding: 15px 32px;
        background: rgba(24, 144, 255, 0.19);
        .title-explain {
          font-size: 14px;
        }
      }
      /deep/ .ivu-form-item {
        margin: 0;
        padding: 24px;
      }
      /deep/ .ivu-form-item-label {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }

      .downLoad-box {
        color: #16ade9;
        cursor: pointer;
        img {
          vertical-align: middle;
          margin-right: 4px;
        }
      }
      .upload-box {
        background-color: #16ade9;
        color: #ffffff;
        border-radius: 2px;
        width: 294px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        margin-top: 2px;
        cursor: pointer;
        img {
          vertical-align: middle;
          margin-right: 4px;
        }
        /deep/ .ivu-upload-select {
          width: 100%;
        }
      }
      .file-list {
        li {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3e9dff;
          line-height: 12px;
          margin: 8px 0;
          .link-img {
            width: 12px;
            margin-right: 12px;
          }
          img {
            vertical-align: middle;
          }
          .del-img {
            float: right;
            cursor: pointer;
          }
        }
      }
      .upload-tip {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #16ade9;
      }
    }
    .operation-box {
      text-align: center;
      button {
        width: 98px;
        height: 32px;
        margin-right: 32px;
      }
    }
  }
  .tip-box {
    padding: 24px;
    .tip-content {
      background: rgba(212, 234, 255, 0.2);
      border: 1px dashed #1890ffff;
      padding: 6px;
      img {
        vertical-align: bottom;
        margin-right: 4px;
      }
    }
  }
  .worker-info-box {
    padding: 12px 0;
    font-size: 14px;
    color: #333333;
    .info-item {
      line-height: 28px;
    }
    .left-item {
      width: 98px;
      display: inline-block;
      text-align: right;
    }
    .right-item {
      color: #16ade9;
      cursor: pointer;
      img {
        vertical-align: middle;
      }
    }
    .c666 {
      color: #666;
    }
  }
}
</style>
