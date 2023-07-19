<template>
  <div>
    <el-form>
      <el-form-item>
        <div class="legalPersonSign">
          <div id="qrcode" ref="qrcode" v-show="!imgUrl"></div>
          <div class="confirm">
            <template v-if="imgUrl">
              <i class="el-icon-refresh-right" @click="clearRefresh"></i>
              <img :src="imgUrl" alt="" />
            </template>
            <el-button type="primary" class="btn-has" @click="getRefresh" v-else>我已签名</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { signCode, refresh } from '@/api/newApi/taxServices/serviceManage.js'
export default {
  props: {
    serviceNo: { type: String },
    signatureUrl: { type: String },
    value: { type: String }
  },
  data () {
    return {
      personSignCode: '',
      imgUrl: ''
    }
  },

  mounted () {
    if (this.serviceNo || this.$route.query.serviceNo) {
      this.getSignCode(this.signatureUrl) // 法人签名二维码
    }
    if (this.signatureUrl) this.imgUrl = this.signatureUrl
    if (this.value) this.imgUrl = this.value
  },
  methods: {
    /** 初始化签名二维码 */
    getSignCode () {
      signCode({ serviceNo: this.serviceNo || this.$route.query.serviceNo })
        .then(res => {
          if (res.code == 0) {
            this.personSignCode = res.data
            this.$nextTick(() => {
              this.qrcode(124, 124, this.personSignCode, 'canvas')
            })
          }
        })
        .catch(err => {
          this.$message.error(err.message)
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
      refresh({ serviceNo: this.serviceNo || this.$route.query.serviceNo })
        .then(res => {
          if (res.code === 0) {
            this.imgUrl = res.data
            this.$emit('input', res.data)
          }
        })
        .catch(err => {
          this.$message.error(err.message)
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

<style lang="scss" scoped>
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
    bottom: 0px;
    height: 32px;
    margin: auto;
  }
  .el-icon-refresh-right {
    float: right;
    font-size: 18px;
    cursor: pointer;
    margin: 10px;
    position: absolute;
    right: 0;
  }
}
</style>
