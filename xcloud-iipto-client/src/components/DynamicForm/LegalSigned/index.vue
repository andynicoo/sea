<template>
  <div>
    <Form>
      <FormItem>
        <div class="legalPersonSign">
          <div id="qrcode" ref="qrcode" v-show="!imgUrl"></div>
          <div class="confirm">
            <template v-if="imgUrl">
              <Icon type="md-refresh" class="refresh" @click="clearRefresh" :disabled="disabled"/>
              <img :src="imgUrl" alt="" />
            </template>
            <Button type="primary" class="btn-has" @click="getRefresh" v-else :disabled="disabled">我已签名</Button>
          </div>
        </div>
        <P class="text-tips" v-if="countryCode === 'ES'">说明：法人签名主要应用于转代理+申报,请使用中文进行签名</P>
        <p v-if="fileModelUrl">
          <a
            :href="fileModelUrl"
            target="_black"
            style="color: #16ade9"
          >
            <img src="@/assets/images/common/serch.png" style="position: relative;" />
            查看示例
          </a>
          </p>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { signCode, refresh } from '@/api/taxRegister.js'
export default {
  props: {
    value: { type: String },
    disabled: Boolean,
    fileModelUrl: String,
    serviceNo: String
  },
  data () {
    return {
      personSignCode: '',
      imgUrl: '',
      countryCode: this.$route.query.countryCode
    }
  },

  mounted () {
    this.getSignCode() // 法人签名二维码
    if (this.value) this.imgUrl = this.value
  },
  methods: {
    /** 初始化签名二维码 */
    getSignCode () {
      signCode({ serviceNo: this.serviceNo })
        .then(res => {
          if (res.code == 0) {
            this.personSignCode = res.data
            this.$nextTick(() => {
              this.qrcode(124, 124, this.personSignCode, 'canvas')
            })
          }
        })
        .catch(err => {
          this.$Message.error(err.message)
        })
    },
    // 转二维码
    qrcode (qWidth, qHeight, qText, qRender) {
      this.qrcodeImg = new this.$QRCode('qrcode', {
        width: qWidth,
        height: qHeight,
        text: qText,
        render: qRender
      })
    },
    getRefresh () {
      refresh({ serviceNo: this.serviceNo })
        .then(res => {
          if (res.code === 0) {
            this.imgUrl = res.data
            this.$emit('input', res.data)
          }
        })
        .catch(err => {
          this.$Message.error(err.message)
        })
    },
    // 重新签名
    clearRefresh () {
      this.imgUrl = ''
      if (!this.qrcodeImg) {
        this.getSignCode()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.legalPersonSign{
  overflow: hidden;
}
#qrcode {
  width: 124px;
  height: 124px;
  float: left;
}
.confirm {
  float: left;
  height: 124px;
  width: 300px;
  margin-left: 15px;
  background: #f5f7f9;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .btn-has {
    position: absolute;
    top: 0px;
    left: 132px;
    right: 0px;
    bottom: 0px;
    height: 32px;
    margin: auto;
  }
  .refresh {
    float: right;
    font-size: 18px;
    cursor: pointer;
    margin: 10px;
    position: absolute;
    right: 0;
  }
}
</style>
