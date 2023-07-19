<template>
  <div>
    <div class="back" @click="goBack()">
      <Icon type="md-arrow-back" />返回列表
    </div>
    <div class="content">
      <div class="content-l">
        <Card>
          <p slot="title" class="companyTitleBox">
            <span>其他服务资料</span>
            <span v-if="detailObj.status==1">
              <Button type="primary" @click="cancelErrorBox = true" ghost>无需处理</Button>
              <Button type="primary" @click="sureSuccessBox = true" style="margin-left:20px">开始处理</Button>
            </span>
            <span v-if="detailObj.status==4">
              <Button type="primary" @click="finishBox=true" style="margin-left:8px;">处理完成</Button>
            </span>
          </p>
          <div class="companyInfo">
            <Form ref="detailObj" :label-width="160">
              <FormItem label="处理结果：" class="requiredItem" v-if="detailObj.status == 6" style="color:#F79728">
                <span v-if="detailObj.applyType !=4 && detailObj.applyType !=5">{{ detailObj.disposeResult }}</span>
                <a v-else target="_blank" :href="detailObj.docUrl">{{detailObj.countryNameZh == '英国'?'英代DOC文件':'欧代DOC文件'}}</a>
              </FormItem>
              <FormItem label="无需处理：" class="requiredItem" v-if="detailObj.status == 5">
                <span>{{ detailObj.disposeResult }}</span>
              </FormItem>
              <FormItem label="服务类型：" class="requiredItem">
                <span style="font-size:16px;font-weight:600;color:#16ADE9">{{ addApplyType[detailObj.applyType] }}</span>
              </FormItem>
              <FormItem label="服务公司：" class="requiredItem">
                <Input disabled v-model="detailObj.companyNameZh" style="width: 300px" />
              </FormItem>
              <FormItem label="服务国家：" class="requiredItem">
                <Input disabled v-model="detailObj.countryNameZh" style="width: 300px" />
              </FormItem>
              <FormItem label="备注：" class="requiredItem">
                <span>{{ detailObj.remark }}</span>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
      <div class="content-r">
        <Card style="margin-top: 6px;">
          <p slot="title">服务信息</p>
          <Form :label-width=100>
            <FormItem label="服务号：">
              <span>{{detailObj.applyWorkNo}}</span>
            </FormItem>
            <FormItem label="状态：">
              <span style="color:#F79728">{{progressStatus[detailObj.status]}}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{detailObj.createTime}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">用户信息</p>
          <Form :label-width=100>
            <FormItem label="用户昵称：">
              <span>{{detailObj.userNickname}}</span>
            </FormItem>
            <FormItem label="手机号：">
              <span>{{detailObj.userMobile}}</span>
            </FormItem>
            <FormItem label="电子邮箱：">
              <span>{{detailObj.userEmail}}</span>
            </FormItem>
            <FormItem label="公司名称：">
              <span>{{detailObj.userCompanyName}}</span>
            </FormItem>
            <FormItem label="地址：">
              <span>{{detailObj.userAddress}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">操作日志</p>
          <div v-for="(item,indev) in logData">
            <p class="itemTop">{{ item.operation }}</p>
            <p class="itemBottom">{{ item.createName }}-{{ item.createTime }}</p>
          </div>
        </Card>
      </div>
    </div>
    <Modal v-model="cancelErrorBox" title="无需处理">
      <p style="padding:10px 0;font-size:16px;">请输入无需处理原因（用户可见）：</p>
      <Input v-model="errorReason" type="textarea" :rows="4" placeholder="请输入无需处理原因" />
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="cancelErrorBox=false">取消</Button>
        <Button type="primary" @click="sureCancelError">确认</Button>
      </div>
    </Modal>
    <Modal v-model="finishBox" title="处理完成">
      <div v-if="detailObj.applyType !=4 && detailObj.applyType !=5">
        <p style="padding:10px 0;font-size:16px;">请输入处理结果（用户可见）；</p>
        <Input v-model="submitResult" type="textarea" :rows="4" placeholder="请输入服务结果内容，如：注册下来的EORI号" />
      </div>
      <div v-else>
        <p style="padding:10px 0;font-size:16px;">请上传{{detailObj.countryNameZh == '英国'?'英代DOC文件':'欧代DOC文件'}}</p>
        <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'docUrl')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'docUrl')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
          <div style="padding: 10px 0;width:300px">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div v-if="docUrl">
          <div class="fileBox" v-if="docUrl!=''">
            <a target="_blank" @click="previewFile(docUrl)">
              {{detailObj.countryNameZh == '英国'?'英代DOC文件':'欧代DOC文件'}}
              <Icon type="ios-close-circle" @click.stop="removeHandler('','','docUrl')" />
            </a>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="finishBox=false">取消</Button>
        <Button type="primary" @click="finishSubmit">确认</Button>
      </div>
    </Modal>
    <Modal v-model="sureSuccessBox">
      <p class="sure-submit">是否确认开始处理</p>
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="sureSuccessBox=false">取消</Button>
        <Button type="primary" @click="sureSuccessSubmit">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getDeclareServiceDetail } from '@/api/taxService/workOrder.js';
import * as API from '@/api/taxService/addedService.js';
export default {
  props: ['serviceId', 'detailObj'],
  data() {
    return {
      addApplyType: {
        1: "英国低税率（保留）",
        2: "德国EORI申请",
        3: "意大利EORI申请",
        4: "英代DOC申请",
        5: "欧代DOC申请"
      },
      progressStatus: {
        1: "待处理",
        4: "处理中",
        5: "无需处理",
        6: "处理完成"
      },
      finishBox: false,
      cancelErrorBox: false,
      sureSuccessBox: false,
      errorReason: '',
      submitResult: '',
      docUrl: '',
      fileUpload: this.workOrderFile,
      logData: [],
    }
  },
  methods: {
    //返回列表页
    goBack() {
      this.$emit('back')
    },
    getLog() {
      let params = {
        recordId: this.serviceId,
        logType: 'TICKET',
        subType: 'ETAX_APPLY_SERVICES_CONFIG_LOG',
      };
      API.getLog(params)
        .then(res => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              this.logData = res.data;
            }
          } else {
            this.$Message.warning(res.message);
          }
        })
        .finally(() => { });
    },
    //无需处理确认
    sureCancelError() {
      let data = {
        id: this.detailObj.id,
        disposeResult: this.errorReason
      }
      API.noChuli(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.goBack()
          this.$emit('refresh')
        }

      })
    },
    //确认开始处理
    sureSuccessSubmit() {
      let data = {
        id: this.detailObj.id,
      }
      API.startChuli(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.goBack()
          this.$emit('refresh')
        }
      })
    },
    finishSubmit() {
      if (this.detailObj.applyType != 4 && this.detailObj.applyType != 5 && this.submitResult.trim() == '') {
        this.$Message.info('请输入处理结果')
        return
      } else if ((this.detailObj.applyType == 4 || this.detailObj.applyType == 5) && this.docUrl == '') {
        this.$Message.info('请上传DOC文件')
        return
      }
      let data = {
        id: this.detailObj.id,
        disposeResult: this.submitResult,
        docUrl: this.docUrl
      }
      API.finishChuli(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.goBack()
          this.$emit('refresh')
        }
      })
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    successHandler(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.docUrl = res.data.fileUrl;
    },
    removeHandler(file, fileList, item, index) {
      let self = this;
      this.docUrl = "";
    },
  },
  created() {
    this.getLog();
  },
}
</script>
<style lang="less" scoped>
.sure-submit {
  font-size: 18px;
  text-align: center;
  padding: 30px 0;
  font-weight: 600;
}
.back {
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  margin-bottom: 5px;
  cursor: pointer;
}
.content {
  display: flex;
  .content-l {
    flex: 1;
    .companyTitleBox {
      display: flex;
      justify-content: space-between;
      min-height: 34px;
    }
    .classTitle {
      display: flex;
      justify-content: space-between;
      span {
        &:first-child {
          font-size: 16px;
          font-weight: 700;
          padding-left: 10px;
        }
        &:last-child {
          cursor: pointer;
        }
      }
    }
    .classifyTitleBox {
      padding: 10px 5px;
      // font-size: 12px;
      // color: #18CEA5;
      .classifyTitle {
        font-weight: bold;
        font-size: 14px;
        color: #666;
      }
    }
    .legalPersonSignBox {
      margin-top: 20px;
    }
    .legalPersonSign {
      width: 300px;
      height: 200px;
      background: #f2f2f2;
      img {
        width: 300px;
        height: 200px;
      }
    }
    .fileBtn {
      text-align: center;
      margin-top: 20px;
    }

    .titleItem {
      text-align: right;
      padding-right: 12px;
    }
    .fileBox {
      display: flex;
      flex-wrap: wrap;
      a {
        text-decoration: none;
        margin-right: 40px;
      }
    }
  }
  .content-r {
    width: 300px;
    margin-left: 10px;
  }
}
.file-box {
  .fl {
    width: 110px;
    float: left;
  }
}
.itemTop {
  font-size: 12px;
  font-weight: bold;
}
.itemBottom {
  font-size: 12px;
  margin-bottom: 10px;
  border-bottom: 1px #f2f2f2 dashed;
  padding-bottom: 5px;
}
</style>