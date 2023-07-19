<template>
  <div class="container ">
    <div class="back">
      <span @click="goBack">返回</span>
    </div>
    <div class="flex-between">
      <div class="left">
        <Card style="width:100%;height: 100%;">
          <p slot="title">
            税务稽查资料
          </p>
          <div slot="extra">
            <Button type="primary"
                    @click="submit"
                    v-if="detailInfo.progressBar === 71">提交</Button>
          </div>
          <Form :model="formLeft"
                ref="formLeft"
                :label-width="135">
            <FormItem label="稽查国家：">
              {{detailInfo.countryNameZh}}
            </FormItem>
            <FormItem label="请输入公司中文名称：">
              <AutoComplete @on-search="serviceInfo($event)"
                            v-model="formLeft.companyNameZh"
                            style="width:400px;"
                            :disabled="detailInfo.progressBar !== 71"
                            placeholder="请输入需要稽查的公司中文名称">
                <Option v-for="item in lenovoSearchList"
                        @click.native="selectCompany(item)"
                        :value="item.companyName"
                        :key="item.id">{{ item.companyName }}</Option>
              </AutoComplete>
            </FormItem>
            <FormItem label="VAT税号："
                      prop="vatNumber">
              <Input style="width:400px;"
                     v-model="formLeft.vatTaxNumber"
                     placeholder="请输入VAT税号"
                     :disabled="detailInfo.progressBar !== 71"></Input>
            </FormItem>
          </Form>
        </Card>
      </div>
      <div class="right">
        <Card>
          <p slot="title">服务信息</p>
          <Form :label-width=100>
            <FormItem label="订单号：">
              <span>{{orderNo}}</span>
            </FormItem>
            <FormItem label="订单备注：">
                <span>{{orderRemark}}</span>
            </FormItem>
            <FormItem label="工单号：">
              <span>{{detailInfo.serverNo}}</span>
            </FormItem>
            <FormItem label="状态：">
              <span>{{detailInfo.progressBar == '71' ? "待上传资料 " : detailInfo.progressBar == '72' ? "待处理" : detailInfo.progressBar == '73' ? "处理中 " : detailInfo.progressBar == '74' ? "处理完成" :''}}</span>
            </FormItem>
            <FormItem label="服务公司：">
              <span>{{detailInfo.companyName}}</span>
            </FormItem>
            <FormItem label="服务名称：">
              <span>{{detailInfo.countryNameZh}}{{ detailInfo.productFunctionCode == '1' ? "税号注册" : detailInfo.productFunctionCode == '2' ? "税务申报" : detailInfo.productFunctionCode == '3' ? "税务补缴" : detailInfo.productFunctionCode == '4' ? "转代理" : detailInfo.productFunctionCode == '5' ? "注册+申报" : detailInfo.productFunctionCode == '6' ?'注销税号':detailInfo.productFunctionCode == '7' ?'税务稽查':''}}</span>
            </FormItem>
            <FormItem label="国家：">
              <span>{{detailInfo.countryNameZh}}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{detailInfo.createTime}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">用户信息</p>
          <Form :label-width=100>
            <FormItem label="用户昵称：">
              <span>{{detailInfo.userNickname}}</span>
            </FormItem>
            <FormItem label="手机号：">
              <span>{{detailInfo.userMobile}}</span>
            </FormItem>
            <FormItem label="电子邮箱：">
              <span>{{detailInfo.userEmail}}</span>
            </FormItem>
            <FormItem label="公司名称：">
              <span>{{detailInfo.userCompanyName}}</span>
            </FormItem>
            <FormItem label="地址：">
              <span>{{detailInfo.userAddress}}</span>
            </FormItem>
          </Form>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { getRegDetailInfo } from "@/api/taxService/regAndDeclare";
import * as API from '@/api/taxService/letters.js';
import { Throttle } from '@/libs/throttle'
import { taxSubmit } from "@/api/taxService/taxModule.js";
export default {
  props: ['detailId'],
  data() {
    return {
      detailInfo: {},
      lenovoSearchList: [],
      orderNo: '',
      formLeft: {
        companyNameZh: '',
        vatTaxNumber: ''
      },
      orderRemark:'',
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    //返回列表
    goBack() {
      this.$emit('back')
    },
    serviceInfo: Throttle(function (event) {
      API.compnayname({ companyNameZh: event, countryCode: this.detailInfo.countryCode }).then(res => {
        if (res.code === 0) {
          this.lenovoSearchList = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    }, 500),
    selectCompany(item) {
      this.formLeft.vatTaxNumber = item.vatTaxNumber
    },
    submit() {
      if (!(this.formLeft.companyNameZh !== '' && this.formLeft.vatTaxNumber !== '')) {
        this.$Message.error('信息填写不全')
        return
      }
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否提交税务稽查资料',
        onOk: () => {
          taxSubmit({
            serviceId: this.detailId,
            companyNameZh: this.formLeft.companyNameZh,
            vatTaxNumber: this.formLeft.vatTaxNumber
          }).then(res => {
            if (res.code === 0) {
              this.$Message.success('提交成功')
              this.$emit('fresh')
            }
          })
        },
      });
    },
    getDetail() {
      getRegDetailInfo({
        serviceId: this.detailId
      }).then(res => {
        if (res.code === 0) {
          this.formLeft.companyNameZh = res.data.orderServices.companyName
          this.orderNo = res.data.orderNo
          this.orderRemark = res.data.remark
          this.detailInfo = res.data.orderServices
          this.formLeft.vatTaxNumber = res.data.taxCheckWorkOrder.vatTaxNumber
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .back {
    margin-bottom: 10px;
    cursor: pointer;
  }
  .left {
    width: 90%;
    margin-right: 10px;
  }
  .right {
    width: 400px;
    /deep/ .ivu-form-item {
      margin-bottom: 0px;
    }
  }
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
</style>