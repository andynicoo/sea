<template>
  <div :style="contentStyleObj"
       class="container">
    <p class="top-title">{{status==51?'待上传资料':status==52?'待审核':status==53?'注销中':status==54?'已完成':status==55?'资料驳回':status==56?'注销失败':''}}</p>
    <div class="top-tips">
      <p class="tips-top-title">
        <img src="@/assets/images/common/yellowTip.png"
             alt="">
        注销税号前提说明，请知悉：
      </p>
      <div class="bottom-tips">
        <p>1.请确保无漏申报（含年报，无年报国家请忽略）；</p>
        <p>2.请确保申报过的金额已经如数缴纳至税局；</p>
        <p>3.请确保收到过的税局信件（含罚金文件）已经全部处理完毕；</p>
        <p class="last-tip">如因以上原因导致税号注销不成功，我司不承担相应责任</p>
      </div>

    </div>
    <div class="reject-box"
         v-if="status==55">
      <img src="@/assets/images/common/yellowTip.png"
           alt="">注销税号资料被驳回（原因：
      <span class="reason">{{formLeft.remark}}</span>）
    </div>
    <!-- <div class="tab-box">
      <span class="active-tab">基本信息</span>
      <span>文件信息</span>
      <span>证明文件</span>
    </div> -->
    <div class="tab-title">基本信息</div>
    <Form :label-width="140"
          :rules="ruleForm"
          :model="formLeft"
          ref="formLeft">
      <Row>
        <Col span="12">
        <FormItem label="注销税号国家"
                  prop="countryNameZh"
                  class="requiredItem">
          <Input v-model="formLeft.countryNameZh"
                 placeholder="请输入需要注销税号的公司名称"
                 :disabled="true"></Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="最后一次申报日期"
                  prop="lastDeclareDate"
                  :label-width="200"
                  class="requiredItem">
          <DatePicker type="date"
                      placeholder="请选择最后一次申报日期"
                      v-model="formLeft.lastDeclareDate"
                      class="tax-date"
                      :disabled="ischange"
                      style="width:100%;"></DatePicker>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="公司中文名称"
                  prop="companyNameZh"
                  class="requiredItem">
          <Select v-model="formLeft.companyNameZh"
                  placeholder="请选择报公司中文名称"
                  :disabled="ischange"
                  @on-change="selectCompany($event,'companyName')"
                  v-if="status!=54">
            <Option :value="item.companyName"
                    v-for="(item,index) in lenovoSearchList"
                    :key="index">{{item.companyName}}</Option>
          </Select>
          <Input v-model="formLeft.companyNameZh"
                 v-if="status==54"
                 :disabled="ischange"></Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="注销开始日期"
                  prop="calcelBeginDate"
                  :label-width="200"
                  class="requiredItem">
          <DatePicker type="date"
                      placeholder="请选择注销开始日期"
                      v-model="formLeft.calcelBeginDate"
                      class="tax-date"
                      :disabled="ischange"
                      style="width:100%;"></DatePicker>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="公司英文名称"
                  prop="companyNameEn"
                  class="requiredItem">
          <Select v-model="formLeft.companyNameEn"
                  placeholder="请选择公司英文名称"
                  :disabled="ischange"
                  @on-change="selectCompany($event,'companyNameEn')"
                  v-if="status!=54">
            <Option :value="item.companyNameEn"
                    v-for="(item,index) in lenovoSearchList"
                    :key="index">{{item.companyNameEn}}</Option>
          </Select>
          <Input v-model="formLeft.companyNameEn"
                 v-if="status==54"
                 :disabled="ischange"></Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="店铺业务范围"
                  class="requiredItem"
                  prop="companyBusinessModeDescribe"
                  :label-width="200">
          <Input v-model="formLeft.companyBusinessModeDescribe"
                 placeholder="请描述经营的业务，如：在亚马逊平台上进行在线交易"
                 :disabled="ischange"
                 type="textarea"
                 :rows="3"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12"
             style="margin-top:-36px;">
        <FormItem label="VAT税号"
                  prop="vatTaxNumber"
                  class="requiredItem">
          <Input v-model="formLeft.vatTaxNumber"
                 placeholder="您的VAT报税税号"
                 :disabled="true"></Input>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="tab-title">文件信息
      <span class="title-tip">（以下文件需高清、无水印、完整、未过期，图片格式：JPG、PNG、PDF）</span>
    </div>
    <div class="file-box clearfix">
      <div class="fl">
        <div class="requiredItem">税号证书</div>
        <Upload :before-upload="beforeUploadHandler"
                :on-format-error="formatErrorHandler"
                :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxLocalFile')}"
                :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxLocalFile')}"
                :action="ImgUrl"
                :data="{prefix:''}"
                :format="['jpg','jpeg','png','gif','pdf']"
                :show-upload-list="false"
                style="margin-right:20px"
                v-if="formLeft.vatTaxLocalFile==''"
                :disabled="ischange">
          <div class="inner"
               @click="beforType('vatTaxLocalFile')">
            <img class="uplad-symbol"
                 src="@/assets/images/common/addImg.png"
                 alt="">
            <p>税号证书</p>
          </div>
        </Upload>
        <div class="out-img-box"
             v-else>
          <div class="inner img-box">
            <Button class="deletBtn"
                    v-if="!ischange">
              <img @click="removeHandler(1,1,'vatTaxLocalFile')"
                   class="closeImg"
                   src="@/assets/images/common/closeImg.png"
                   alt="">
            </Button>
            <a :href="formLeft.vatTaxLocalFile"
               v-if="fileType.vatTaxLocalFile=='pdf'"
               target="_blank"
               class="show-pdf">点击查看</a>
            <img :src="formLeft.vatTaxLocalFile"
                 alt=""
                 v-else>
          </div>
        </div>
      </div>
      <div class="fl"
           v-if="countryCode=='DE'">
        <div class="requiredItem">DE欧盟证书</div>
        <Upload :before-upload="beforeUploadHandler"
                :on-format-error="formatErrorHandler"
                :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxEuFile')}"
                :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxEuFile')}"
                :action="ImgUrl"
                :data="{prefix:''}"
                :format="['jpg','jpeg','png','gif','pdf']"
                :show-upload-list="false"
                style="margin-right:20px"
                v-if="formLeft.vatTaxEuFile==''"
                :disabled="ischange">
          <div class="inner"
               @click="beforType('vatTaxEuFile')">
            <img class="uplad-symbol"
                 src="@/assets/images/common/addImg.png"
                 alt="">
            <p>DE欧盟证书</p>
          </div>
        </Upload>
        <div class="out-img-box"
             v-else>
          <div class="inner img-box">
            <Button class="deletBtn"
                    v-if="!ischange">
              <img @click="removeHandler(1,1,'vatTaxEuFile')"
                   class="closeImg"
                   src="@/assets/images/common/closeImg.png"
                   alt="">
            </Button>
            <a :href="formLeft.vatTaxEuFile"
               v-if="fileType.vatTaxEuFile=='pdf'"
               target="_blank"
               class="show-pdf">点击查看</a>
            <img :src="formLeft.vatTaxEuFile"
                 alt=""
                 v-else>
          </div>
        </div>
      </div>
      <div class="fl"
           v-if="countryCode=='DE'">
        <div class="requiredItem">税务副本</div>
        <Upload :before-upload="beforeUploadHandler"
                :on-format-error="formatErrorHandler"
                :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxFileCopy')}"
                :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxFileCopy')}"
                :action="ImgUrl"
                :data="{prefix:''}"
                :format="['jpg','jpeg','png','gif','pdf']"
                :show-upload-list="false"
                style="margin-right:20px"
                v-if="formLeft.vatTaxFileCopy==''"
                :disabled="ischange">
          <div class="inner"
               @click="beforType('vatTaxFileCopy')">
            <img class="uplad-symbol"
                 src="@/assets/images/common/addImg.png"
                 alt="">
            <p>税务副本</p>
          </div>
        </Upload>
        <div class="out-img-box"
             v-else>
          <div class="inner img-box">
            <Button class="deletBtn"
                    v-if="!ischange">
              <img @click="removeHandler(1,1,'vatTaxFileCopy')"
                   class="closeImg"
                   src="@/assets/images/common/closeImg.png"
                   alt="">
            </Button>
            <a :href="formLeft.vatTaxFileCopy"
               v-if="fileType.vatTaxFileCopy=='pdf'"
               target="_blank"
               class="show-pdf">点击查看</a>
            <img :src="formLeft.vatTaxFileCopy"
                 alt=""
                 v-else>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-title">证明文件
      <span class="title-tip">（以下文件支持ZIP、JPG、PNG、PDF）</span>
    </div>
    <div class="file-box clearfix">
      <div class="fl">
        <div class="requiredItem">零销售截图、缴税凭证、申报回执等</div>
        <Upload :before-upload="beforeUploadHandler"
                :on-format-error="formatErrorHandler"
                :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'otherFile')}"
                :on-remove="(file,fileList)=>{removeHandler (file,fileList,'otherFile')}"
                :action="ImgUrl"
                :data="{prefix:''}"
                :format="['jpg','jpeg','png','gif','pdf']"
                :show-upload-list="false"
                style="margin-right:20px"
                v-if="formLeft.otherFile==''"
                :disabled="ischange">
          <div class="inner"
               @click="beforType('otherFile')">
            <img class="uplad-symbol"
                 src="@/assets/images/common/addImg.png"
                 alt="">
            <p>税号证书</p>
          </div>
        </Upload>
        <div class="out-img-box"
             v-else>
          <div class="inner img-box">
            <Button class="deletBtn"
                    v-if="!ischange">
              <img @click="removeHandler(1,1,'otherFile')"
                   class="closeImg"
                   src="@/assets/images/common/closeImg.png"
                   alt="">
            </Button>
            <a :href="formLeft.otherFile"
               v-if="fileType.otherFile=='pdf'"
               target="_blank"
               class="show-pdf">点击查看</a>
            <img :src="formLeft.otherFile"
                 alt=""
                 v-else>
          </div>
        </div>
      </div>
    </div>
    <Divider v-if="!ischange" />
    <div style="text-align:center;"
         v-if="!ischange">
      <Button type="primary"
              @click="submit">提交</Button>
    </div>
  </div>
</template>
<script>
import { Throttle } from "@/libs/throttle.js"
import { getservicesByCompnayname, submitFile, cancelTaxWorkOrderDetail } from "@/api/cancelTaxnum/index";
import { getAllServiceCompanies } from "@/api/registerInfo/registerInfo";
export default {
  data() {
    return {
      contentStyleObj: {
        "min-height": ""
      },
      formLeft: {
        otherFile: '',
        vatTaxFileCopy: '',
        vatTaxEuFile: '',
        vatTaxLocalFile: '',
        calcelBeginDate: '',
        companyBusinessModeDescribe: '',
        lastDeclareDate: '',
        vatNumberServicesId: '',
        orderServicesId: this.$route.query.servicesId
      },
      ischange: false,
      nowFile: '',
      fileType: {},
      lenovoSearchList: [], //联想列表
      ruleForm: {
        companyBusinessModeDescribe: [
          { required: true, trigger: "blur", message: "请填写店铺业务范围" }
        ],
        lastDeclareDate: [
          {
            required: false,
            trigger: "change",
            message: "请选择最后一次申报日期",
            type: "date"
          }
        ],
        calcelBeginDate: [
          {
            required: false,
            trigger: "change",
            message: "请选择注销开始日期",
            type: "date"
          }
        ],
      },
      countryCode: this.$route.query.countryCode,
      status: this.$route.query.status,
    }
  },
  methods: {
    getHeight() {
      this.contentStyleObj["min-height"] = window.screen.height - 220 + "px";
    },
    beforeUploadHandler() {
      let self = this;
      const check = self.formLeft[this.nowFile] == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    beforType(item) {
      this.nowFile = item;
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
      this.formLeft[item] = res.data.fileUrl;
      this.fileType[item] = res.data.suffix;
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    formatErrorHandlerzip() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf,zip,rar格式的文件"
      });
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.formLeft[item] = "";
    },
    getFileType(filePath) {
      let startIndex = filePath.lastIndexOf(".");
      if (startIndex != -1)
        return filePath
          .substring(startIndex + 1, filePath.length)
          .toLowerCase();
      else return "";
    },
    // 公司资料
    automaticInformationFilling() {
      getservicesByCompnayname({
        countryCode: this.$route.query.countryCode
      }).then(res => {
        if (res.code === 0) {
          this.lenovoSearchList = res.data
          this.formLeft.countryNameZh = res.data[0].countryNameZh
        }
      }).catch(error => {
        console.log(error)
      })
    },
    selectCompany: Throttle(function (obj, type) {
      this.filtrateData(obj, type)
    }),
    //根据选择的公司筛选出资料
    filtrateData(obj, type) {
      this.lenovoSearchList.map((item, index) => {
        if (item[type] == obj) {
          // console.log(this.lenovoSearchList[index])
          this.formLeft.vatTaxNumber = item.vatTaxNumber
          this.formLeft.companyNameEn = item.companyNameEn
          this.formLeft.companyNameZh = item.companyName
          this.formLeft.vatNumberServicesId = item.id
        }
      })
    },
    formatDate(date, type) {
      if (typeof date === "object" && date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        if (type == "month") {
          return y + "-" + m;
        } else if (type == "date") return y + "-" + m + "-" + d + ' 00:00:00';
      } else {
        return date;
      }
    },
    getDetailInfo() {
      cancelTaxWorkOrderDetail({ id: this.$route.query.servicesId }).then(res => {
        if (JSON.stringify(res.data) != '{}') {
          this.formLeft = res.data
        }
      })
    },
    submit() {
      // console.log(this.formLeft)
      let data = { ...this.formLeft }
      data.lastDeclareDate = this.formatDate(this.formLeft.lastDeclareDate, 'date')
      data.calcelBeginDate = this.formatDate(this.formLeft.calcelBeginDate, 'date')
      submitFile(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('提交成功')
          this.$router.push({ path: "work" });
        }
      })
    }
  },
  created() {
    const status = this.$route.query.status
    if (status != 51 && status != 55 && status != 56) {
      this.ischange = true
    }
  },
  mounted() {
    this.getHeight()
    this.automaticInformationFilling()
    this.getDetailInfo()
  }
}
</script>
<style lang="less" scoped>
.container {
  margin: 24px;
  background-color: #fff;
  color: rgba(51, 51, 51, 1);
  font-family: "Microsoft Yahei", "PingFangSC-Semibold,PingFang SC";
  padding: 24px;
  .top-title {
    font-size: 24px;
    font-weight: 600;
  }
  .top-tips {
    margin-top: 24px;
    background-color: #d0effb;
    padding: 12px 20px;
    .tips-top-title {
      font-size: 14px;
      font-family: "Microsoft Yahei", "PingFangSC-Regular,PingFang SC";
      color: #16ade9;
      img {
        vertical-align: middle;
      }
    }
    .bottom-tips {
      margin-left: 24px;
      margin-top: 4px;
      p {
        line-height: 26px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
      }
      .last-tip {
        font-weight: 400;
        margin-top: 4px;
      }
    }
  }
  .reject-box {
    margin-top: 16px;
    padding: 10px 20px;
    background-color: #fff1dd;
    img {
      vertical-align: middle;
    }
    .reason {
      color: #fa5555;
    }
  }
  .tab-box {
    margin-top: 28px;
    border-bottom: 1px solid #dddddd;
    margin-bottom: 24px;
    span {
      display: inline-block;
      font-size: 16px;
      margin-right: 36px;
      color: #333333;
      cursor: pointer;
    }
    .active-tab {
      border-radius: 10px 10px 0 0;
      background-color: #16ade9;
      color: #fff;
      padding: 8px 24px;
    }
  }
  .tab-title {
    padding: 11px 24px;
    background-color: #d0effb;
    font-size: 18px;
    font-weight: 600;
    margin: 24px 0;
    .title-tip {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }
  }
}

.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: "Microsoft Yahei", SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
.fl {
  margin-right: 32px;
  min-height: 172px;
  .requiredItem::before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: "Microsoft Yahei", SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
/deep/ .ivu-upload {
  width: 200px;
  height: 124px;
  background: rgba(244, 245, 246, 1);
  border-radius: 2px;
  margin-top: 12px;
  text-align: center;
  cursor: pointer;
  .inner {
    color: #999;
  }
  img {
    width: 50px;
    height: 50px;
    margin: 22px 75px 0 75px;
  }
}
.file-box {
  padding-left: 50px;
}
.out-img-box {
  margin-top: 12px;
  width: 200px;
  .img-box {
    width: 200px;
    height: 124px;
    overflow: hidden;
    border: 1px dashed #dcdee2;
    position: relative;
    text-align: center;
    z-index: 11;
    background: #fff;
    button {
      width: 0px;
      padding: 0px;
      border: none;
      position: absolute;
      top: -13px;
      height: 0px;
      z-index: 1;
      img.closeImg {
        position: absolute;
        width: 26px;
        height: 26px;
        top: 16px;
        right: -174px;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
    .deletBtn {
      left: auto;
      display: none;
    }
  }
  .img-box:hover .deletBtn {
    display: block;
  }
  .corres-name {
    width: 100%;
  }
  .show-pdf {
    display: inline-block;
    color: #313233;
    font-size: 16px;
    margin-top: 24px;
  }
}
</style>


