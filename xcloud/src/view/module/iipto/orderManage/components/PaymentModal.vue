<template>
  <div>
    <Modal v-model="payModal"
           title="录入付款凭证"
           @on-visible-change="changeState"
           :width="1000">
      <Form :model="formInfo"
            label-position="top"
            :rules="ruleValidate"
            ref="formInfo">
        <Row>
          <Col span="6">
          <FormItem label=" 付款凭证"
                    prop="voucherUrl">
            <div class="bread-logo-box"
                 :class="formInfo.voucherUrl==''?'':'show-change'">
              <Upload :action="workOrderFile"
                      v-if="formInfo.voucherUrl==''"
                      class="upload-logo"
                      :on-format-error="formatErrorHandler1"
                      :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'voucherUrl')}"
                      :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'voucherUrl')}"
                      :on-exceeded-size="handleMaxSize"
                      :format="['jpg','png','jpeg']"
                      :max-size="2048"
                      :show-upload-list="false">
                <img src="@/assets/images/infoDetail/upload.png"
                     alt="">
              </Upload>
              <img :src="formInfo.voucherUrl"
                   class="bread-logo"
                   alt=""
                   v-else>
              <Upload class="hover-box"
                      :on-format-error="formatErrorHandler1"
                      :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'voucherUrl')}"
                      :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'voucherUrl')}"
                      :on-exceeded-size="handleMaxSize"
                      :format="['jpg','png','jpeg','svg']"
                      :max-size="2048"
                      :show-upload-list="false"
                      :action="workOrderFile">
                <img src="@/assets/images/infoDetail/editor-bai.png"
                     alt="">更换图片
              </Upload>
            </div>
            <p>文件格式：.jpg，.png，图片大小&lt;2M</p>
          </FormItem>
          </Col>
          <Col span="18">
          <Row type="flex"
               justify="center">
            <Col span="10">
            <FormItem label="支付方式"
                      prop="payType">
              <Select clearable
                      v-model="formInfo.payType"
                      placeholder="请选择支付方式">
                <Option v-for="(item,index) in paymentChannelList"
                        :key="index"
                        :value="String(item.id)">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="收款账户"
                      prop="acceptAccountName">
              <Select clearable
                      v-model="formInfo.acceptAccountName"
                      placeholder="请选择收款账户">
                <Option v-for="(item,index) in companyBodyList"
                        :key="index"
                        :value="item.accountName">{{item.accountName}}</Option>
              </Select>
            </FormItem>
            <!-- <FormItem label="交易流水号"
                      prop="serialNumber">
              <Input v-model="formInfo.serialNumber"
                     placeholder="请输入交易流水号" />
            </FormItem> -->
             <FormItem label="付款日期"
                      prop="payTime">
              <DatePicker type="date"
                          v-model="formInfo.payTime"
                          placeholder="选择付款日期"></DatePicker>
            </FormItem>
            </Col>
            <Col span="10"
                 offset="2">
            <FormItem label="付款方"
                      prop="payer">
              <Input v-model="formInfo.payer"
                     placeholder="请输入付款方" />
            </FormItem>
            <FormItem label="实收金额"
                      prop="amount">
              <Input v-model="formInfo.amount"
                     prefix="logo-yen"
                     placeholder="请输入实收金额" />
            </FormItem>
            </Col>
          </Row>
          </Col>
        </Row>
      </Form>
      <p slot="footer">
        <Button type="primary"
                @click="handleSubmit('formInfo')">确定</Button>
        <Button @click="changeState(false);payModal=false"
                style="margin-left: 8px">取消</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { companyBodySettingListApi, orderConditionApi, orderAddPayVoucheApi } from '@/api/iipto/typeInOrder.js'
export default {
  props: ['orderId'],
  data() {
    return {
      payModal: true,
      formInfo: {
        voucherUrl: ''
      },
      ruleValidate: {
        voucherUrl: [
          { required: true, trigger: "change", message: "请上传付款凭证" }
        ],
        payType: [
          { required: true, trigger: "change", message: "请选择支付方式" }
        ],
        acceptAccountName: [
          { required: true, trigger: "change", message: "请选择收款账户" }
        ],
        serialNumber: [
          { required: true, trigger: "blur", message: "请输入交易流水号" }
        ],
        payer: [
          { required: true, trigger: "change", message: "请输入付款方", }
        ],
        amount: [
          { required: true, trigger: "change", message: "请输入实收金额" }
        ],
        payTime: [
          { required: true, trigger: "change", message: "请选择付款日期", type: "date" }
        ],
      },
      companyBodyList: [],//收款账户
      paymentChannelList: [],//支付方式
    }
  },
  mounted() {
    this.queryBaseInfoFunc()
  },
  methods: {
    changeState(val) {
      this.$emit('changeState', false)
    },
    queryBaseInfoFunc() {
      companyBodySettingListApi().then(res => {
        if (res.code == 0) {
          this.companyBodyList = res.data
        }
      })
      orderConditionApi().then(res => {
        if (res.code == 0) {
          let returnData = res.data
          returnData.map(item => {
            switch (item.name) {
              case 'paymentChanne':
                this.paymentChannelList = item.orderConditionInfoVoList
                break;
              default:
                break;
            }
          })
        }
      })
    },
    formatErrorHandler1() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg,png,jpeg,svg格式的文件"
      });
    },
    successHandler1(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.formInfo[item] = res.data.fileUrl
    },
    removeHandler1(i, item) {
      this.formInfo[item] = ''
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: ' ',
        desc: '文件太大啦, 不能超过2M.'
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = { ...this.formInfo }
          data.payTime = this.formatDate(this.formInfo.payTime, 'date')
          data.acceptAccountNum = ''
          data.orderId = this.orderId
          orderAddPayVoucheApi(data).then(res => {
            if (res.code == 0) {
              this.$Message.success('操作成功');
              this.payModal = false
              this.changeState(false);
            }
          })
        } else {
          this.$Message.error('请录入完整信息');
        }
      })
    },
    formatDate(date, type) {
      if (typeof date === "object") {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        if (type == "month") {
          return y + "-" + m;
        } else if (type == "date") return y + "-" + m + "-" + d;
      } else {
        return date;
      }
    },
  },
}
</script>
<style lang="less" scoped>
.bread-logo-box {
  display: inline-block;
  width: 156px;
  height: 156px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .hover-box {
    width: 100%;
    height: 100%;
    background: #333333;
    opacity: 0.65;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    padding-top: 38px;
    font-size: 14px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #ffffff;
    display: none;
    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }
  }
}
.show-change:hover .hover-box {
  display: block;
}
</style>
