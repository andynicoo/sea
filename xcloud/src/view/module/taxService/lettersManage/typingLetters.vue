<template>
  <div class="container">
    <Form :model="formItem"
          ref="formItem"
          :label-width="80"
          :rules="ruleValidate">
      <Row>
        <Col span="16">
        <FormItem label="请输入信件英文公司："
                  :label-width="150">
          <AutoComplete @on-change="serviceInfo($event, 'en')"
                        v-model="formItem.companyNameEn"
                        placeholder="请输入英文">
            <Option v-for="item in lenovoSearchList"
                    @click.native="selectCompany(item)"
                    :value="item.companyNameEn"
                    :key="item.id">{{ item.countryNameZh }}--{{ item.companyNameEn }}</Option>
          </AutoComplete>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="16">
        <FormItem label="请输入中文公司："
                  :label-width="150">
          <AutoComplete @on-change="serviceInfo($event,'zh')"
                        v-model="formItem.companyName"
                        placeholder="请输入中文">
            <Option v-for="item in lenovoSearchList"
                    @click.native="selectCompany(item)"
                    :value="item.companyName"
                    :key="item.id">{{ item.countryNameZh }}--{{ item.companyName }}</Option>
          </AutoComplete>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
        <FormItem label="请选择国家："
                  prop="country"
                  :label-width="150">
          <Input v-model="countryName"
                 placeholder="国家"
                 :disabled="true"></Input>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="请输入税号："
                  prop="vatTaxNumber"
                  :label-width="150">
          <Input v-model="formItem.vatTaxNumber"
                 placeholder="请输入报税税号"
                 @on-blur="serchCompany"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="信件上传处："
                  :label-width="150"
                  prop="lettersFile">
          <Upload type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lettersFile')}"
                  :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lettersFile')}"
                  :format="['jpg','jpeg','png','gif','pdf']"
                  style="width:300px"
                  :show-upload-list="false">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span v-if="lettersFile==''">请拖拽文件到此区域上传或点击上传</span>
              <span v-else>点击或拖拽文件到此区域重新上传</span>
            </div>
          </Upload>
          <div v-if="fileUploadlist.length !== 0">
            <span v-for="(item, index) in fileUploadlist"
                  :key="index">
              <a :href="item.fileUrl"
                 target="_blank"
                 style="margin-right:20px;margin-left:20px">{{item.origFileName}}</a>
              <Icon type="ios-close-circle"
                    @click.stop="removeItem(index)" />
            </span>
          </div>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="15">
        <FormItem label="处理建议（选填）："
                  :label-width="150">
          <Input v-model="formItem.advise"
                 type="textarea"
                 :rows="4"
                 placeholder="请输入处理建议" />
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="6">
        <FormItem label="请选择信件类型："
                  prop="letterType"
                  :label-width="150">
          <Select clearable
                  v-model="formItem.letterType"
                  placeholder="信件类型">
            <Option value="1">罚款利息文件</Option>
            <Option value="2">滞纳金通知</Option>
            <Option value="3">催税罚款文件</Option>
            <Option value="4">罚款通知</Option>
            <Option value="5">税务稽查文件</Option>
            <Option value="6">退税文件</Option>
            <Option value="7">退税支票</Option>
            <Option value="8">C79</Option>
            <Option value="9">申报周期变更</Option>
            <Option value="11">税率文件 </Option>
            <Option value="12">催申报文件</Option>
            <Option value="13">调查问卷</Option>
            <Option value="10">其他</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="信件是否需处理："
                  prop="isDispose"
                  :label-width="150">
          <Select clearable
                  v-model="formItem.isDispose"
                  placeholder="请选择">
            <Option value="1">需用户处理</Option>
            <Option value="2">无需处理</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="信件接收时间："
                  prop="receptionTime"
                  :label-width="150">
          <DatePicker v-model="formItem.receptionTime"
                      @on-change="dateChange"
                      type="date"
                      placeholder="请选择信件接收时间"></DatePicker>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <p class="footer">
      <Button @click="save('formItem')">保存，暂不发送</Button>
      <Button @click="send('formItem')"
              type="primary">立即发送</Button>
    </p>
  </div>
</template>

<script>
import * as API from '@/api/taxService/letters.js';
import { Throttle } from '@/libs/throttle'
export default {
  data() {
    return {
      fileUpload: this.workOrderFile,
      countryList: [],
      formItem: {
        companyNameEn: '',
        companyName: '',
        vatTaxNumber: '',
        letterType: '',
        servicesId: '',
        isDispose: '',
        receptionTime: '',
        letterFile: '',
        advise: ''
      },
      lettersFile: '',
      countryName: '',
      fileUploadlist: [],
      lenovoSearchList: [],
      ruleValidate: {
        companyName: [
          { required: true, message: '请输入公司中文名', trigger: 'change' }
        ],
        companyNameEn: [
          { required: true, message: '请输入公司英文名', trigger: 'change' }
        ],
        vatTaxNumber: [
          { required: true, message: '请输入税号', trigger: 'change' }
        ],
        letterType: [
          { required: true, message: '请选择信件类型', trigger: 'change' }
        ],
        isDispose: [
          { required: true, message: '请选择信件是否处理', trigger: 'change' }
        ],
        // receptionTime: [
        //     { required: true, message: '请选择信件接收时间', trigger: 'change' }
        // ],
      }
    }
  },
  mounted() {
    this.baseInfo();
  },
  methods: {
    serchCompany(){
      let data = {
        vatTaxNumber:this.formItem.vatTaxNumber
      }
      if(data.vatTaxNumber.trim() != ''){
          API.vatNumSerch(data).then(res=>{
          if(res.code == 0){
            if(JSON.stringify(res.data) != '[]'){
              // console.log(1)
              this.formItem.companyName = res.data[0].companyName
              this.formItem.companyNameEn = res.data[0].companyNameEn
              this.formItem.servicesId = res.data[0].id
              this.countryName = res.data[0].countryNameZh
            }else if(this.formItem.vatTaxNumber != ''){
              this.$Message.error('请填写正确的税号');
              this.formItem.companyName = ''
              this.formItem.companyNameEn = ''
              this.formItem.servicesId = ''
              this.countryName = ''
            }
          }
        })
      }
      
    },
    baseInfo() {
      API.baseInfo().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    serviceInfo(event, type) {
      switch (type) {
        case 'en':
          var data = {
            companyNameEn: event
          }
          break;
        case 'zh':
          var data = {
            companyNameZh: event
          }
          break;
      }
      API.compnayname(data).then(res => {
        if (res.code === 0) {
          this.lenovoSearchList = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    selectCompany(item) {
      // console.log('item', item)
      this.formItem.companyName = item.companyName
      this.formItem.companyNameEn = item.companyNameEn
      this.formItem.vatTaxNumber = item.vatTaxNumber
      this.formItem.servicesId = item.id
      this.countryName = item.countryNameZh
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
      var obj = {
        fileUrl: res.data.fileUrl,
        origFileName: res.data.origFileName
      }
      this.fileUploadlist.push(obj)
      this.formItem.letterFile = ''
      this.fileUploadlist.forEach(item => {
        this.formItem.letterFile += item.fileUrl + ";";
      })
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.lettersFile = "";
      this.fileUploadlist = []
      this.formItem.letterFile = ''
    },
    removeItem(index) {
      this.fileUploadlist.splice(index, 1)
      this.fileUploadlist.forEach(item => {
        this.formItem.letterFile += item.fileUrl + ";"
      })
    },
    dateChange(date) {
      this.formItem.receptionTime = date
    },
    save(name) {
      this.formItem.letterFile = this.formItem.letterFile.replace(/;$/gi, '')
      if (this.formItem.receptionTime === '') {
        this.$Message.error('信件接收时间不能为空');
        return
      }
      if (this.formItem.letterFile === '') {
        this.$Message.error('请上传信件');
        return
      }
      if (this.formItem.vatTaxNumber === '') {
        this.$Message.error('该服务没有税号');
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          API.add(this.formItem).then(res => {
            if (res.code === 0) {
              this.$Message.success('保存成功');
              this.$refs['formItem'].resetFields()
              this.fileUploadlist = []
              this.formItem = {
                companyNameEn: '',
                companyName: '',
                vatTaxNumber: '',
                letterType: '',
                servicesId: '',
                isDispose: '',
                receptionTime: '',
                letterFile: '',
                advise: ''
              }
              this.countryName = ''
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    send(name) {
      this.formItem.letterFile = this.formItem.letterFile.replace(/;$/gi, '')
      if (this.formItem.receptionTime === '') {
        this.$Message.error('信件接收时间不能为空');
        return
      }
      if (this.formItem.letterFile === '') {
        this.$Message.error('请上传信件');
        return
      }
      if (this.formItem.vatTaxNumber === '') {
        this.$Message.error('该服务没有税号');
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          API.send(this.formItem).then(res => {
            if (res.code === 0) {
              this.$Message.success('发送成功');
              this.$refs['formItem'].resetFields()
              this.fileUploadlist = []
              this.formItem = {
                companyNameEn: '',
                companyName: '',
                vatTaxNumber: '',
                letterType: '',
                servicesId: '',
                isDispose: '',
                receptionTime: '',
                letterFile: '',
                advise: ''
              }
              this.countryName = ''
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #ffffff;
  padding: 20px;
  // height: 100vh;
}
/deep/ .footer {
  text-align: center;
  padding-top: 30px;
  padding-bottom: 30px;
  .ivu-btn:nth-child(2) {
    margin-left: 30px;
  }
}
// /deep/ .ivu-select-dropdown-list {
//   height: 400px;
// }
</style>