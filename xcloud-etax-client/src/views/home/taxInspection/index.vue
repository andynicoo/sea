<template>
  <div class="container">
    <div class="content"
         v-if="noSuccess">
      <div class="title">
        请完善稽查信息
      </div>
      <Form :model="formLeft"
            :label-width="127">
        <FormItem label="稽查国家：">
          {{countryNameZh}}
        </FormItem>
        <FormItem label="公司中文名称："
                  prop="companyNameZh">
          <AutoComplete v-model="formLeft.companyNameZh"
                        :data="lenovoSearchList"
                        @on-select="selectCompany"
                        style="width:400px;"
                        placeholder="请输入需要稽查的公司名称">
          </AutoComplete>
        </FormItem>
        <FormItem label="VAT税号：">
          {{formLeft.vatTaxNumber}}
        </FormItem>
        <div>
          <Button style="width:170px;margin-left:130px;"
                  type="primary"
                  @click="submit">提交</Button>
        </div>
      </Form>
    </div>
    <div v-else
         class="content">
      <div class="flex-column">
        <img src="@/assets/images/common/pay-success.png"
             alt />
        <div class="success">
          提交成功
        </div>
        <div class="info">
          已通知税务专员处理，请耐心等待…
        </div>
        <router-link :to="{ path: '/work'}"
                     replace>
          <div class="btn">
            返回首页
          </div>
        </router-link>

      </div>

    </div>
  </div>
</template>

<script>
import { Throttle } from "@/libs/throttle.js"
import { getCompanyInformation, getAllServiceCompanies } from "@/api/registerInfo/registerInfo";
import { taxMaterialSubmit, gServicesByCompnayname } from "@/api/taxModule";
export default {
  data() {
    return {
      countryNameZh: this.$route.query.countryNameZh,
      countryCode: this.$route.query.countryCode,
      formLeft: {
        vatTaxNumber: '',
        companyNameZh: '',
        servicesId: this.$route.query.servicesId
      },
      lenovoSearchList: [],
      noSuccess: true
    }
  },
  mounted() {
    this.automaticInformationFilling()
  },
  methods: {
    // 公司资料信息自动填充
    automaticInformationFilling() {
      getAllServiceCompanies({
        countryCode: this.countryCode
      }).then(res => {
        if (res.code === 0) {
          this.lenovoSearchList = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    selectCompany: Throttle(function (obj) {
      let that = this
      that.formLeft.companyNameZh = obj
      gServicesByCompnayname({
        companyNameZh: obj,
        countryCode: this.countryCode
      }).then(res => {
        if (res.code === 0) {
          if (res.data.length > 0) {
            this.formLeft.vatTaxNumber = res.data[0].vatTaxNumber
          } else {
            this.$Message.info('暂无税号')
            this.formLeft.vatTaxNumber = ''
          }

        }
      }).catch(error => {
        console.log(error)
      })
    }),
    submit() {
      if (!(this.formLeft.vatTaxNumber !== '' && this.formLeft.companyNameZh !== '')) {
        this.$Message.error('请输入完整信息')
        return
      }
      taxMaterialSubmit(this.formLeft).then(res => {
        if (res.code === 0) {
          this.$Message.success('提交成功')
          this.noSuccess = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  position: relative;
  margin: 24px 24px 0px 24px;
  min-width: 1024px;
  .content {
    background: #ffffff;
    min-height: calc(100vh - 84px);
    height: 100%;
    padding: 30px;
    /deep/ .ivu-auto-complete.ivu-select-dropdown {
      max-height: 300px;
    }
    .flex-column {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .title {
      margin-bottom: 30px;
      font-size: 18px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 18px;
      width: 1104px;
      height: 40px;
      background: rgba(22, 173, 233, 0.2);
      padding: 12px 24px;
    }
    img {
      margin-top: 50px;
    }
    .success {
      font-size: 20px;
      font-family: "Microsoft Yahei", SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      margin: 24px 0px 20px;
    }
    .info {
      font-size: 16px;
      font-family: "Microsoft Yahei", SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      margin: 0px 0px 30px;
    }
    .btn {
      width: 142px;
      height: 32px;
      background: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(22, 173, 233, 0.12);
      border-radius: 4px;
      border: 1px solid #16ade9;
      font-size: 14px;
      font-family: "Microsoft Yahei", SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #16ade9;
      line-height: 14px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }
  }
}
</style>