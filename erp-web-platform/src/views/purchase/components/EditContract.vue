<template>
  <div>
    <div class="me-contract--dialog">
      <a-form
        :form="contractForm"
        layout="horizontal"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item
          :label="$t('purchase.tempName')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.tempName2')"
            v-decorator="[
              'contractName',
              {
                rules: [
                  { required: true, message: $t('purchase.tempNamePlease') }
                ]
              }
            ]"
          />
        </a-form-item>
        <div class="me-contract--dialog--line"></div>
        <h3>{{ $t('purchase.contractPrintConfig') }}</h3>
        <a-form-item label="">
          <a-row :gutter="0">
            <a-col :span="3"> </a-col>
            <a-col :span="20">
              <a-checkbox-group
                @change="onChange"
                :options="printConfig"
                v-decorator="['contractConfig']"
              >
              </a-checkbox-group>
            </a-col>
          </a-row>
        </a-form-item>
        <div class="me-contract--dialog--line"></div>
        <h3>{{ $t('purchase.purchaseInfo') }}</h3>
        <a-form-item
          :label="$t('purchase.contractName')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.contractName')"
            v-decorator="['purchaseContractName']"
          />
        </a-form-item>
        <div></div>
        <a-form-item
          :label="$t('purchase.purchaser')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.purchaser')"
            v-decorator="['purchaseName']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.address')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.address')"
            v-decorator="['purchaseAddress']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.consignee')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.consignee')"
            v-decorator="['purchaseConsignee']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.contacts')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.contacts')"
            v-decorator="['purchaseContacts']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.tel')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.tel')"
            v-decorator="['purchasePhone']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.fax')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.fax')"
            v-decorator="['purchaseFax']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.companyLogo')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <div class="upimg" v-if="gsImg != ''">
            <img :src="gsImg" />
            <div class="icon-box">
              <span class="iconfont iconremove" @click="removeImg('gs')"></span>
            </div>
          </div>
          <div
            @click="pushImages('gs')"
            class="product-upload"
            v-show="gsImg == ''"
          >
            <span class="iconfont icon-add-image"></span>
          </div>
          {{ $t('purchase.isPng') }}
        </a-form-item>
        <a-form-item
          :label="$t('purchase.electronicSeal')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <div class="upimg" v-if="dzzImg != ''">
            <img :src="dzzImg" />
            <div class="icon-box">
              <span
                class="iconfont iconremove"
                @click="removeImg('dzz')"
              ></span>
            </div>
          </div>
          <div
            @click="pushImages('dzz')"
            class="product-upload"
            v-show="dzzImg == ''"
          >
            <span class="iconfont icon-add-image"></span>
          </div>
          {{ $t('purchase.isPng') }}
        </a-form-item>
        <a-form-item :label="$t('purchase.contractNotice')">
          <a-textarea
            :placeholder="$t('purchase.contractNotice')"
            v-decorator="['remark']"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import Purchase from '@/api/purchase'
import { loadImage } from '@/util/document'
import Basic from '@/api/basic'
const printCheck = []
export default {
  props: {
    currentId: {
      type: Number,
      default: 0
    },
    handleCancel: {
      type: Function,
      default: null
    },
    updataList: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      contractForm: this.$form.createForm(this), // 供应商编辑form
      confirmLoading: false,
      printConfig: [
        { label: this.$t('purchase.storeName'), value: 'cangku' },
        { label: this.$t('purchase.miniPicture'), value: 'suolvtu' },
        // { label: '原厂SKU', value: 'yuanchang' },
        { label: this.$t('purchase.chieseName'), value: 'zhongwen' },
        { label: this.$t('purchase.englishName'), value: 'yingwen' },
        { label: this.$t('purchase.deliveryDate'), value: 'jiaohuo' },
        { label: this.$t('purchase.showRemark'), value: 'xianshi' },
        { label: this.$t('purchase.contractNotice'), value: 'hetong' },
        { label: this.$t('purchase.stampinfo'), value: 'gaizhang' },
        { label: this.$t('purchase.taxes'), value: 'shuijin' },
        { label: this.$t('purchase.discountAmount'), value: 'zhekou' },
        { label: this.$t('purchase.purchaseInfo'), value: 'caigou' },
        { label: this.$t('purchase.unitPrice'), value: 'danjia' },
        { label: this.$t('purchase.price'), value: 'jiner' },
        { label: this.$t('purchase.totalAmount'), value: 'heji' },
        { label: this.$t('purchase.orderNote'), value: 'dingdan' }
      ],
      printCheck,
      gsImg: '',
      dzzImg: ''
    }
  },
  mounted() {
    console.log(this.currentId)
    if (this.currentId != 0) {
      this.getContractOne()
    } else {
      // 新增合同
      // var pConfig="cangku-suolvtu-zhongwen-yingwen-jiaohuo-xianshi-hetong-gaizhang-shuijin-zhekou"
      var pConfig = ''
      this.printConfig.map((cur, index) => {
        index == 0
          ? (pConfig = cur.value)
          : (pConfig = pConfig + '-' + cur.value)
      })
      // console.log(pConfig)
      this.$nextTick(() => {
        this.$data.contractForm.setFieldsValue({
          contractConfig: pConfig.split('-')
        })
      })
    }
  },
  methods: {
    handleCancelTemp() {
      this.handleCancel('visible')
    },
    handleChangePayShou(val) {
      this.$data.paymentMethod = val
    },
    handleChangePayFu(val) {
      this.$data.fuPay = val
    },
    onChange(checkedValues) {
      console.log('checked = ', checkedValues)
    },
    // 编辑弹窗
    getContractOne() {
      Purchase.getContractOne({ contractId: this.currentId }).then((res) => {
        if (res.code == 0) {
          // console.log(res.data.contractConfig)
          // this.$data.contractForm=res.data
          var pConfig
          res.data.contractConfig == null
            ? ''
            : (pConfig = res.data.contractConfig.split('-'))
          // console.log(res.data.contractConfig)
          this.$data.visible = true

          this.$nextTick(() => {
            this.$data.contractForm.setFieldsValue({
              contractName: res.data.contractName,
              contractConfig: res.data.contractConfig || pConfig,
              purchaseContractName: res.data.purchaseContractName,
              purchaseContacts: res.data.purchaseContacts, // 联系人
              purchaseName: res.data.purchaseName,
              purchaseAddress: res.data.purchaseAddress,
              purchaseConsignee: res.data.purchaseConsignee,
              name: res.data.name,
              purchasePhone: res.data.purchasePhone,
              purchaseFax: res.data.purchaseFax,
              remark: res.data.remark
            })
            this.$data.gsImg = res.data.purchaseLogo
            this.$data.dzzImg = res.data.purchaseElectron
          })
        }
      })
    },
    // 添加、编辑合同提交
    submit(e) {
      // e.preventDefault()
      return new Promise((resolve, reject) => {
        this.contractForm.validateFields((err, values) => {
          if (!err) {
            // 合同打印设置
            values.contractConfig != undefined &&
            values.contractConfig.length > 0
              ? (values.contractConfig = values.contractConfig.join('-'))
              : ''
            values.purchaseLogo = this.$data.gsImg
            values.purchaseElectron = this.$data.dzzImg
            // console.log(this.currentId)
            if (this.currentId == 0) {
              Purchase.addContract(values).then((res) => {
                if (res.code == 0) {
                  this.$Message({
                    type: 'success',
                    content: this.$t('common.handlerSuccess')
                  })
                  this.handleCancel('visible')
                  this.updataList()

                  resolve()
                }
              })
            } else {
              var params = {
                ...values,
                contractId: this.currentId
              }
              // console.log(params)
              Purchase.editContract(params).then((res) => {
                if (res.code == 0) {
                  this.$Message({
                    type: 'success',
                    content: this.$t('common.handlerSuccess')
                  })
                  this.handleCancel('visible')
                  this.updataList()

                  resolve()
                }
              })
            }
          } else {
            reject()
          }
        })
      })
    },
    /**
     * 新增图片
     */
    pushImages(val) {
      loadImage({ accept: 'image/png', multiple: false }, async (files) => {
        // 还能上传几张
        // const len = 9 - this.$data.productDetail.images.length
        files = Array.from(files).slice(0, 1)
        const formData = new FormData()
        files.forEach((e) => {
          formData.append('file', e)
        })
        // const formData = new FormData()
        var { data } = await Basic.handleUploadImages(formData)
        // var imgPath = await Basic.handleUploadImages(formData)
        // console.log(imgPath)
        // console.log(files)
        // console.log(formData)
        console.log(data)
        if (val == 'gs') {
          this.$data.gsImg = data[0]
        } else {
          this.$data.dzzImg = data[0]
        }
      })
    },
    removeImg(val) {
      val == 'gs' ? (this.$data.gsImg = '') : (this.$data.dzzImg = '')
    },
    //预览合同模板
    goPreview() {
      this.contractForm.validateFields((err, values) => {
        values.contractConfig != undefined && values.contractConfig.length > 0
          ? (values.contractConfig = values.contractConfig.join('-'))
          : ''
        let routeData = this.$router.resolve({
          path: '/purchase/preview-contract',
          query: values
        })
        this.openPage(routeData.href, '_blank')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-contract--dialog {
  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  span.title {
    float: right;
    padding-right: 5px;
    &.mr10 {
      margin-right: 10px;
    }
  }
  i {
    color: #f5222d;
    margin-left: 19px;
  }
  .upimg {
    text-align: center;
    float: left;
    width: 48px;
    height: 48px;
    background-color: #f0f0f1;
    position: relative;
    img {
      width: 48px;
      height: 48px;
    }
    .icon-box {
      display: none;
    }
  }
  .upimg:hover {
    .icon-box {
      position: absolute;
      display: block;
      bottom: 0px;
      left: 0px;
      right: 0px;
      height: 15px;
      line-height: 15px;
      width: 48px;
      background-color: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      .iconfont {
        color: #fff;
      }
    }
  }
  .product-upload {
    text-align: center;
    display: inline-block;
    width: 48px;
    height: 48px;
    background-color: #f0f0f1;
    cursor: pointer;
    .icon-add-image {
      font-size: 18px;
      line-height: 48px;
      color: #aeaeae;
    }
  }
  .inline {
    display: inline-block;
    width: 50%;
  }
}
</style>

<style lang="scss"></style>
