<template>
  <div class="container" :style="contentStyleObj">
    <p class="title">
      <span class="line">|</span>
      <span>寄送文件</span>
    </p>
    <p class="top-tips">
      西班牙特别说明：根据西班牙海关要求，合理进行VAT税号注册及申报服务（包括海牙认证），需要卖家提供真实有效的相关证件；
    </p>
    <p class="remark">备注：以下资料下载打印后需要进行线下邮寄（法人签名及盖章、授权书需要盖骑缝章、建议彩色打印）；</p>
    <div class="files-example" v-if="supplierId === '43'">
      <p>
        董事申明书：
        <span
          @click="
            type = 1;
            showExample = true;
          "
        >
          【查看示例】
        </span>
        <span @click="downLoad(1)">【点击下载】</span>
      </p>
      <p style="margin-top: 18px">
        {{ productFunctionCode == 5 ? "注册授权书：" : productFunctionCode == 2 ? "转代理授权书" : "" }}
        <span
          @click="
            type = 2;
            showExample = true;
          "
        >
          【查看示例】
        </span>
        <span @click="downLoad(2)">【点击下载】</span>
      </p>
    </div>

    <!-- 服务商id=44 -->
    <div class="files-example" v-if="supplierId === '44'">
      <Row>
        <Col :span="12">
          <p>
            授权书：
            <span>
              <a
                href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1ZiAbdA4AAsuRQ2eESA296.pdf"
                style="color: #16ade9"
                target="_blank"
              >
                【查看示例】
              </a>
            </span>
            <span @click="esDownLoad('1')">【点击下载】</span>
          </p>
        </Col>
        <Col :span="12">
          <p style="margin-top: 18px">
            海牙中西语授权书：
            <span>
              <a
                href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1cmAP8yUAA46SnMkOwE525.pdf"
                style="color: #16ade9"
                target="_blank"
              >
                【查看示例】
              </a>
            </span>
            <span @click="esDownLoad('2')">【点击下载】</span>
          </p>
        </Col>
        <Col :span="12">
          <p style="margin-top: 18px">
            OtorgaApodera_es_es 中文版：
            <span>
              <a
                href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1eaAUNtyAAS_eQxSV9E201.pdf"
                style="color: #16ade9"
                target="_blank"
              >
                【查看示例】
              </a>
            </span>
            <span @click="esDownLoad('3')">【点击下载】</span>
          </p>
        </Col>
        <Col :span="12">
          <p style="margin-top: 18px">
            OtorgaApodera_es_es 西语版：
            <span>
              <a
                href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1g6AW77_AAJ9-6Djk6Y416.pdf"
                style="color: #16ade9"
                target="_blank"
              >
                【查看示例】
              </a>
            </span>
            <span @click="esDownLoad('4')">【点击下载】</span>
          </p>
        </Col>
      </Row>
    </div>

    <!-- 服务商id=87 -->
    <div class="files-example" v-if="supplierId == 87">
      <Row>
        <Col :span="12">
          <p>
            授权书：
            <span>
              <a
                href="http://file.itaxs.com/pro/20210813/1dabebf8a0ed4f83836a39a00afe8a7b.pdf"
                style="color: #16ade9"
                target="_blank"
              >
                【查看示例】
              </a>
            </span>
            <span @click="esDownLoad('1')">【点击下载】</span>
          </p>
        </Col>
        <Col :span="12">
          <p>
            公司董事声明书：
            <span>
              <a
                href="http://file.itaxs.com/pro/20210813/3f99573815c3461b88d0b5297960cfed.pdf"
                style="color: #16ade9"
                target="_blank"
              >
                【查看示例】
              </a>
            </span>
            <span @click="esDownLoad('5')">【点击下载】</span>
          </p>
        </Col>
        <!-- <Col :span="12">
          <p style="margin-top: 18px">
            海牙中西语授权书：
            <span>
              <a
                href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1cmAP8yUAA46SnMkOwE525.pdf"
                style="color: #16ade9"
                target="_blank"
              >
                【查看示例】
              </a>
            </span>
            <span @click="esDownLoad('2')">【点击下载】</span>
          </p>
        </Col> -->
      </Row>
    </div>

    <p class="add-title">寄送地址：</p>
    <div class="address-box">
      <p class="info">
        <span class="info-title">收件人：</span>
        <span class="info-content">跨税云注册组</span>
      </p>
      <p class="info">
        <span class="info-title">联系电话：</span>
        <span class="info-content">15323756779</span>
      </p>
      <p class="info">
        <span class="info-title">寄送地址：</span>
        <span class="info-content">广东省深圳市龙岗区天安云谷2期4栋34楼</span>
      </p>
      <p class="info-remark">
        备注：1、寄送费用由寄方承担； 2、收到资料后即可递交税局，建议3天内邮寄哦
        <span style="color: red">3、寄送资料后即可，平台收到后会立即处理</span>
      </p>
    </div>

    <!-- naoki add vat fr -->
    <div class="address-box">
      <Form  inline style=" margin-top: 20px;" :model="submitForm" >
        <FormItem>
            <p>为了更好接收您的邮件，请填写邮寄信息</p>
        </FormItem>
        <FormItem  prop="logisticsProviders">
          <Select
            clearable
            filterable
            placeholder="请选择快递公司名称"
            style="width: 200px"
            v-model="submitForm.logisticsProviders"
            :disabled="isEditing"
          >
            <Option v-for="item in expressList" :value="item" :key="item">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="trackingNo">
          <Input
            clearable
            placeholder="请输入快递单号"
            style="width: 250px"
            v-model="submitForm.trackingNo"
            :disabled="isEditing"
          />
        </FormItem>
        <FormItem  prop="sendTime">
          <DatePicker
            type="date"
            v-model="submitForm.sendTime"
            placeholder="寄出日期"
            :disabled="isEditing"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button @click="cancel" v-show="cancelShow">取消</Button>
          <Button type="primary" @click="submit"  v-show="submitShow">提交</Button>
          <Button type="primary" @click="editing"  v-show="editingShow">编辑</Button>
        </FormItem>
      </Form>
    </div>


    <Modal v-model="showExample" footer-hide :width="830">
      <p slot="header" class="header">{{ type === 1 ? "董事声明书" : "注册授权书" }}</p>
      <img
        :src="
          type === 1
            ? 'https://fdfs.itaxs.com/group1/M00/00/3C/rBLKNV7Lc0eAa3tuAALnWNYre94078.svg'
            : 'https://fdfs.itaxs.com/group1/M00/00/3C/rBLKNV7Lc5qAZBsSABkaN2VKdYU416.png'
        "
        alt=""
      />
    </Modal>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div class="loadingText">{{ operateText }}</div>
    </Spin>
  </div>
</template>
<script>
import {getLogisticsInfo} from '../../../api/taxModule.js';
export default {
  data() {
    return {
      submitForm:{
        logisticsProviders:this.$route.query.logisticsProviders,
        trackingNo:this.$route.query.trackingNo,
        sendTime:this.$route.query.sendTime,
        id:""
      },
      expressList:[
          "顺丰速运",
          "邮政平邮",
          "邮政EMS",
          "韵达快递",
          "天天快递",
          "申通快递",
          "圆通快递",
          "德邦快递",
          "百世快递",
          "中通快递",
          "国通快递",
          "其他",],
      contentStyleObj: {
        height: "",
      },
      spinShow: false,
      operateText: "",
      showExample: false,
      showExampleNew: false,
      type: 1,
      servicesId: this.$route.query.servicesId,
      productFunctionCode: this.$route.query.productFunctionCode,
      supplierId: this.$route.query.supplierId,
      cancelShow:false,
      editingShow:false,
      submitShow:true,
      isEditing : false,
      oldSubmitForm:{}
    };
  },
  mounted(){
    this.isDisabled()
  },
  methods: {
    isDisabled(){
      if (this.submitForm.logisticsProviders) {
        this.editingShow = true
        this.submitShow = false
        this.isEditing = true
      }
    },
    submit(){
      this.submitForm.id = this.$route.query.servicesId
      this.submitForm.sendTime = this.formatDate(this.submitForm.sendTime)
      if (!this.submitForm.logisticsProviders || !this.submitForm.sendTime || !this.submitForm.trackingNo) {
        this.$Message.warning("请填写完整资料");
        return
      }
      let data = {...this.submitForm}
      getLogisticsInfo(data).then(res=>{
        this.$Message.success("提交成功！");
        this.editingShow = true
        this.submitShow = false
        this.isEditing = true
        this.cancelShow = false
      })
    },
    cancel(){
      this.submitForm = this.oldSubmitForm
      this.editingShow = true
      this.submitShow = false
      this.cancelShow = false
      this.isEditing = true
    },
    editing(){
      console.log("editing");
      this.oldSubmitForm = {...this.submitForm}
      this.editingShow = false
      this.submitShow = true
      this.cancelShow = true
      this.isEditing = false
    },
    //时间格式转换
    formatDate(date) {
      if (typeof date === "object") {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d  + " 00:00:00";
      } else {
        return date;
      }
    },
    getHeight() {
      this.contentStyleObj.height = window.screen.height - 180 + "px";
    },
    downLoad(type) {
      let self = this;
      this.spinShow = true;
      let text = type == "1" ? "董事申明书" : "授权书";
      this.operateText = "正在下载" + text + "，请稍后";
      let formData = new FormData();
      formData.append("servicesId", this.servicesId);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      if (type === 1) {
        xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/statement", true);
      } else if (type === 2) {
        xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/authorization", true);
      }

      // 设置请求token
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(xmlResquest.getResponseHeader("content-disposition").split(";")[1].split("=")[1]);
          self.spinShow = false;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          return;
        }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    // 下载西班牙授权资料
    esDownLoad(fileType) {
      let self = this;
      this.spinShow = true;
      let text = "";
      switch (fileType) {
        case "1":
          text = "授权书";
          break;
        case "2":
          text = "海牙中西语授权书";
          break;
        case "3":
          text = "OtorgaApodera_es_es 中文版";
          break;
        case "4":
          text = "OtorgaApodera_es_es 西语版";
          break;
        default:
          text = "";
      }
      this.operateText = "正在下载" + text + "，请稍后";
      let formData = new FormData();
      formData.append("servicesId", this.servicesId);
      formData.append("fileType", fileType);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/authorization/es", true);
      // 设置请求token
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(xmlResquest.getResponseHeader("content-disposition").split(";")[1].split("=")[1]);
          self.spinShow = false;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          return;
        }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
  },
  created() {
    this.getHeight();
  },
};
</script>
<style lang="less" scoped>
.container {
  margin: 24px;
  background-color: #fff;
  padding: 20px;
  font-family: "Microsoft Yahei", Source Han Sans SC;
  color: #333;
  .title {
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 15px;
    .line {
      width: 2px;
      height: 14px;
      color: rgba(22, 173, 233, 1);
      margin-right: 10px;
    }
  }
  .top-tips {
    padding: 12px;
    font-size: 14px;
    color: #fbb73c;
    background-color: #fff7ea;
    margin-top: 15px;
  }
  .remark {
    margin: 30px 0 20px 12px;
    color: #ed3e3e;
    font-size: 18px;
  }
  .files-example {
    margin-left: 12px;
    padding: 30px 18px;
    background-color: #f0fbff;
    font-size: 18px;
    font-weight: 500;
    p {
      line-height: 18px;
      font-size: 16px;
      span {
        cursor: pointer;
      }
      :nth-child(2) {
        color: #16ade9;
      }
    }
  }
  .add-title {
    margin: 30px 0 20px 12px;
    font-size: 16px;
  }
  .address-box {
    margin-left: 12px;
    margin-bottom: 30px;
    padding: 24px 0 24px 18px;
    background-color: #f0fbff;
    .info {
      line-height: 26px;
      font-size: 16px;
      color: #666666;
      .info-title {
        width: 80px;
        text-align: right;
        display: inline-block;
      }
      .info-content {
        color: #333333;
      }
    }
    .info-remark {
      font-size: 14px;
      color: #666666;
      margin-top: 20px;
    }
  }
  .header {
    text-align: center;
    margin-bottom: 70px;
  }
}
</style>
