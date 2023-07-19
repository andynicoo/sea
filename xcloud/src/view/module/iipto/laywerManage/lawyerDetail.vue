<template>
  <Card>
    <p @click="goBack()"
       class="back">
      <Icon type="md-arrow-back" />返回列表</p>
    <div class="from-box">
      <p class="title">律师详情</p>
      <Form ref="formValidate"
            :model="formValidate"
            :label-width="180"
            v-if="JSON.stringify(formValidate)!='{}'">
        <p class="title-type">基础信息</p>
        <FormItem label="律师姓名：">
          <span>{{formValidate.attorneyName}}</span>
        </FormItem>
        <FormItem label="公司名：">
          <span>{{formValidate.attorneyCompanyNameEn||'未填写'}}</span>
        </FormItem>
        <FormItem label="国家编码：">
          <span>{{formValidate.attorneyCountryCode}}</span>
        </FormItem>
        <FormItem label="国家：">
          <span>{{formValidate.attorneyCountryNameEn}}</span>
        </FormItem>
        <FormItem label="州：">
          <span>{{formValidate.attorneyProvinceEn||'未填写'}}</span>
        </FormItem>
        <FormItem label="城市：">
          <span>{{formValidate.attorneyCityEn||'未填写'}}</span>
        </FormItem>
        <FormItem label="街道地址：">
          <span>{{formValidate.attorneyStreetEn||'未填写'}}</span>
        </FormItem>
        <FormItem label="详细地址：">
          <span>{{formValidate.attorneyAddresEn||'未填写'}}</span>
        </FormItem>
        <FormItem label="邮编：">
          <span>{{formValidate.attorneyPostcode||'未填写'}}</span>
        </FormItem>
        <FormItem label="邮箱：">
          <span>{{formValidate.attorneyEmail||'未填写'}}</span>
        </FormItem>
        <FormItem label="第二邮箱：">
          <span>{{formValidate.attorneyTwoEmail||'未填写'}}</span>
        </FormItem>
        <FormItem label="电话：">
          <span>{{formValidate.attorneyTel||'未填写'}}</span>
        </FormItem>
        <FormItem label="律师代表：">
          <span>{{formValidate.attorneyRepresentative||'未填写'}}</span>
        </FormItem>
        <p class="title-type">律师执照</p>
        <FormItem label="上传证件：">
          <img v-if="formValidate.attorneyCertificate!=''"
               :src="formValidate.attorneyCertificate"
               alt=""
               style="width:220px;height:160px;">
          <span v-else>未填写</span>
        </FormItem>
        <FormItem label="参考号：">
          <span>{{formValidate.attorneyCertificateReferenceNum||'未填写'}}</span>
        </FormItem>
        <FormItem label="获得律师执照的年份：">
          <span v-if="formValidate.attorneyCertificateDate!=''">{{formValidate.attorneyCertificateDate.slice(0,4)}}</span>
          <span v-else>未填写</span>
        </FormItem>
        <FormItem label="律师执照所在国家：">
          <span>{{formValidate.attorneyCertificateCountryNameEn||'未填写'}}</span>
        </FormItem>
        <FormItem label="律师执照所在州：">
          <span>{{formValidate.attorneyCertificateProvinceEn||'未填写'}}</span>
        </FormItem>
        <FormItem label="律师执照编号：">
          <span>{{formValidate.attorneyCertificateNum||'未填写'}}</span>
        </FormItem>
        <FormItem>
          <Button @click="goBack()"
                  style="margin-left: 8px">返回</Button>
        </FormItem>
      </Form>
    </div>
  </Card>
</template>
<script>
import { detailLawyerApi } from '@/api/iipto/lawyer.js'
export default {
  props: ['detail'],
  data() {
    return {
      formValidate: {},
    }
  },
  methods: {
    goBack() {
      this.$emit('returnList', true)
    },
    getDetail() {
      detailLawyerApi({ id: this.detail.id }).then(res => {
        if (res.code == 0) {
          this.formValidate = res.data
        }
      })
    }
  },
  mounted() {
    this.getDetail()
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


