<template>
  <div>
    <Form>
      <FormItem>
        <div class="legalPersonSign">
          <div id="qrcode" ref="qrcode" v-show="!imgUrl"></div>
          <div class="confirm" v-if="imgUrl">
            <div class="thumbnail" v-if="imgUrl">
              <div class="thumbnail-operate">
                <a-icon type="delete" @click="clearRefresh" />
              </div>
              <img :src="imgUrl" alt="" />
            </div>
          </div>
        </div>
        <div class="example-file" v-if="fileModelUrl">
          <dl class="example-file-ul">
            <dt>示例</dt>
            <dd>
              <div class="example-fileA">
                <viewer @inited="(v) => (viewer = v)" :images="[fileModelUrl]">
                  <img :src="fileModelUrl" />
                </viewer>
              </div>
              <b @click="viewer.show()">查看示例</b>
            </dd>
          </dl>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { signCode, refresh, clearSign } from '@/api/taxRegister.js';
export default {
  props: {
    value: { type: String },
    disabled: Boolean,
    fileModelUrl: String,
    fApi: Object,
  },
  data() {
    return {
      personSignCode: '',
      imgUrl: '',
      countryCode: this.$route.query.countryCode,
      userName: '',
      timer: null,
    };
  },
  watch: {
    imgUrl(val) {
      this.$emit('input', val);
    },
  },
  mounted() {
    this.getSignCode(); //法人签名二维码
    if (this.value) this.imgUrl = this.value;
  },
  methods: {
    /** 初始化签名二维码 */
    getSignCode() {
      signCode({ serviceNo: this.$route.query.serviceNo })
        .then((res) => {
          if (res.code == 0) {
            this.personSignCode = res.data;
            this.userName = (this.fApi && this.fApi.getValue('companyLegalPersonEn')) || '';
            this.drawQrcode();
          }
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },
    drawQrcode() {
      this.$nextTick(() => {
        this.qrcode(170, 180, this.personSignCode + '&userName=' + this.userName, 'canvas');
      });
      this.getImg();
    },
    getImg() {
      if (this.imgUrl) return;
      this.timer = setInterval(() => {
        if (this.imgUrl) {
          clearInterval(this.timer);
          return;
        }
        this.getRefresh();
      }, 3000);
    },
    // 转二维码
    qrcode(qWidth, qHeight, qText, qRender) {
      this.qrcodeImg = new this.$QRCode('qrcode', {
        width: qWidth,
        height: qHeight,
        text: qText,
        render: qRender,
      });
    },
    getRefresh() {
      refresh({ serviceNo: this.$route.query.serviceNo }).then((res) => {
        if (res.code === 0) {
          this.imgUrl = res.data;
        }
      });
    },
    //重新签名
    clearRefresh() {
      if (this.disabled) return;
      this.$confirm({
        title: `删除法人签名后，系统将清空原有签名，需重新扫描二维码，并完成签名提交，确认删除吗？`,
        centered: true,
        onOk: async () => {
          await this.clearRefreshFn();
          this.imgUrl = '';
          if (!this.qrcodeImg) {
            this.getSignCode();
          }
          this.getImg();
        },
      });
    },
    clearRefreshFn() {
      return new Promise((resolve) => {
        clearSign({ serviceNo: this.$route.query.serviceNo }).then((res) => {
          resolve();
        });
      });
    },
    updateSignCode() {
      this.$refs.qrcode.innerHTML = '';
      this.drawQrcode();
    },
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang="less" scoped>
.legalPersonSign {
  overflow: hidden;
  display: inline-block;
}
#qrcode {
  width: 240px;
  height: 200px;
  padding: 10px 35px;
  background-color: #f9f9f9;
}
.confirm {
  float: left;
  width: 240px;
  height: 200px;
  position: relative;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
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
  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 240px;
    height: 200px;
    line-height: 100%;
    display: flex;
    align-items: center; /* 主轴居中 */
    justify-content: center; /* 副轴居中 */

    img {
      width: 210px;
      height: auto;
      background-color: #f5f7f9;
    }
    .thumbnail-operate {
      border-radius: 10px;
      position: absolute;
      top: 0;
      left: 0;
      display: none;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      align-items: center; /* 主轴居中 */
      justify-content: center; /* 副轴居中 */
      .anticon {
        cursor: pointer;
        font-size: 30px;
        color: #fff;
        margin: 0 15px;
      }
    }
    &:hover .thumbnail-operate {
      display: flex;
    }
  }
}
.remark {
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.4);
  margin: 12px 0 16px;
}
.example-file {
  display: inline-block;
  margin-left: 23px;
  vertical-align: top;
  dt {
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 16px;
  }
  dd {
    float: left;
    text-align: center;
  }
  b {
    font-weight: normal;
    color: #3a7fff;
    font-size: 12px;
    cursor: pointer;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.example-fileA {
  padding: 10px;
  width: 208px;
  height: 145px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center; /* 主轴居中 */
  justify-content: center; /* 副轴居中 */
  cursor: pointer;
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center; /* 主轴居中 */
    justify-content: center; /* 副轴居中 */
    cursor: pointer;
  }
}
</style>
