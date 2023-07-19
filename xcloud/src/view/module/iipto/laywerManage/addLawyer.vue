<template>
  <Card>
    <p @click="goBack()"
       class="back">
      <Icon type="md-arrow-back" />返回列表</p>
    <div class="from-box">
      <p class="title">{{title}}</p>
      <Form ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="180">
        <p class="title-type">基础信息</p>
        <FormItem label="律师姓名："
                  prop="attorneyName">
          <Input v-model="formValidate.attorneyName"
                 placeholder="请填写姓名"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="公司名："
                  prop="attorneyCompanyNameEn">
          <Input v-model="formValidate.attorneyCompanyNameEn"
                 placeholder="请填写公司名"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="国家："
                  prop="attorneyCountryCode">
          <Select v-model="formValidate.attorneyCountryCode"
                  style="width:400px;"
                  placeholder="国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem label="国家编码："
                  prop="attorneyCountryCode">
          <Select v-model="formValidate.attorneyCountryCode"
                  style="width:400px;"
                  placeholder="国家"
                  disabled>
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryCode }}</Option>
          </Select>
        </FormItem>
        <FormItem label="州："
                  prop="attorneyProvinceEn">
          <Input v-model="formValidate.attorneyProvinceEn"
                 placeholder="请填写所在州"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="城市："
                  prop="attorneyCityEn">
          <Input v-model="formValidate.attorneyCityEn"
                 placeholder="请填写所在城市"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="街道地址："
                  prop="attorneyStreetEn">
          <Input v-model="formValidate.attorneyStreetEn"
                 placeholder="请填写所在街道地址"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="详细地址："
                  prop="attorneyAddresEn">
          <Input v-model="formValidate.attorneyAddresEn"
                 placeholder="请填写所在详细地址"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="邮编："
                  prop="attorneyPostcode">
          <Input v-model="formValidate.attorneyPostcode"
                 placeholder="请填写邮编"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="邮箱："
                  prop="attorneyEmail">
          <Input v-model="formValidate.attorneyEmail"
                 placeholder="请填写邮箱"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="第二邮箱："
                  prop="attorneyTwoEmail">
          <Input v-model="formValidate.attorneyTwoEmail"
                 placeholder="请填写第二邮箱"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="电话："
                  prop="attorneyTel">
          <Input v-model="formValidate.attorneyTel"
                 placeholder="请填写电话"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="律师代表："
                  prop="attorneyRepresentative">
          <Input v-model="formValidate.attorneyRepresentative"
                 placeholder="请填写律师代表"
                 style="width:400px;"></Input>
        </FormItem>
        <p class="title-type">律师执照</p>
        <FormItem label="上传证件："
                  prop="attorneyCertificate">
          <Upload type="drag"
                  :action="workOrderFile"
                  :max-size="5*1024"
                  :format="['jpg','png']"
                  :data="{ prefix: '' }"
                  :before-upload="beforeUploadHandler"
                  :on-format-error="formatErrorHandler"
                  :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'attorneyCertificate')}"
                  :on-remove="(file,fileList)=>{removeHandler (file,fileList,'attorneyCertificate')}"
                  style="width:260px"
                  v-if="formValidate.attorneyCertificate==''">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div class="main-img-box"
               v-else>
            <img :src="formValidate.attorneyCertificate">
            <Button @click="removeHandler(1,1,'attorneyCertificate')">删除</Button>
          </div>
          <p>支持JPG、PNG格式，大小不能超过5M</p>
        </FormItem>
        <FormItem label="参考号："
                  prop="attorneyCertificateReferenceNum">
          <Input v-model="formValidate.attorneyCertificateReferenceNum"
                 placeholder="请填写参考号"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="获得律师执照的年份："
                  prop="attorneyCertificateDate">
          <DatePicker type="year"
                      v-model="formValidate.attorneyCertificateDate"
                      placeholder="Select year"
                      style="width: 400px"></DatePicker>
        </FormItem>
        <FormItem label="律师执照所在国家："
                  prop="attorneyCertificateCountryNameEn">
          <Input v-model="formValidate.attorneyCertificateCountryNameEn"
                 placeholder="请填写国家"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="律师执照所在州："
                  prop="attorneyCertificateProvinceEn">
          <Input v-model="formValidate.attorneyCertificateProvinceEn"
                 placeholder="请填写所在州"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="律师执照编号："
                  prop="attorneyCertificateNum">
          <Input v-model="formValidate.attorneyCertificateNum"
                 placeholder="请填写执照编号"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="handleSubmit('formValidate')">提交</Button>
          <Button style="margin-left: 8px"
                  @click="goBack()">取消</Button>
        </FormItem>
      </Form>
    </div>
  </Card>
</template>
<script>
import { addLawyerApi, updateLawyerApi } from '@/api/iipto/lawyer.js'
export default {
  props: ['detail'],
  data() {
    return {
      title: '添加律师',
      countryList: [
        { countryNameZh: "美国", countryCode: "US" },
        { countryNameZh: "欧盟", countryCode: "EU" },
        { countryNameZh: "日本", countryCode: "JP" },
        { countryNameZh: "英国", countryCode: "GB" },
        { countryNameZh: "加拿大", countryCode: "CA" },
      ],
      formValidate: {
        attorneyCertificate: '',
        attorneyCertificateDate: ''
      },
      ruleValidate: {
        attorneyName: [
          { required: true, trigger: "blur", message: "请填写律师姓名" }
        ],
        attorneyCountryCode: [
          { required: true, trigger: "change", message: "请选择国家" }
        ],
        attorneyCountryNameEn: [
          { required: true, trigger: "change", message: "请选择国家编码" }
        ],
      },
    }
  },
  methods: {
    beforeUploadHandler(file, fileList) {
      const check = this.formValidate.attorneyCertificate == '';
      const self = this
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
        return check
      } else if (file.size > 2097152 * 2.5) {
        self.$Notice.warning({
          title: "文件大小超过5M"
        });
        return false
      }
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg,png格式的文件"
      });
    },
    successHandler(res, file, fileList, type) {
      this.formValidate[type] = res.data.fileUrl;
    },
    removeHandler(file, fileList, type) {
      this.formValidate[type] = ''
    },
    goBack() {
      this.$emit('returnList', true)
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = { ...this.formValidate }
          this.countryList.map(item => {
            if (this.formValidate.attorneyCountryCode == item.countryCode) {
              data.attorneyCountryNameEn = item.countryNameZh
            }
          })
          data.attorneyCertificateDate = this.formatDate(this.formValidate.attorneyCertificateDate, 'date')
          if (this.detail != 'add') {
            this.handleEditor(data)
          } else {
            this.handleAdd(data)
          }
        } else {
          this.$Message.error('请完善必填信息');
        }
      })
    },
    handleEditor(data) {
      updateLawyerApi(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功!');
          this.goBack()
        }
      })
    },
    handleAdd(data) {
      addLawyerApi(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功!');
          this.goBack()
        }
      })
    }
  },
  mounted() {
    if (this.detail != 'add') {
      this.formValidate = this.detail
      this.title = '编辑律师'
    }
  },
}
</script>
<style lang="less" scoped>
.back {
  margin-bottom: 10px;
}
.from-box {
  .title {
    padding: 12px 0;
    font-size: 14px;
    color: #333;
    font-weight: 700;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
  }
  .title-type {
    padding: 12px 0;
    font-size: 14px;
    color: #333;
    font-weight: 700;
  }
}
.main-img-box {
  img {
    width: 268px;
    max-height: 160px;
    vertical-align: bottom;
    margin-right: 10px;
  }
}
</style>


