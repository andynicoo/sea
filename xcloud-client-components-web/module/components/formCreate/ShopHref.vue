<template>
  <div>
    <a-input
      :value="shopHrefVal"
      class="shop-href-input formMaxWidth"
      :placeholder="formItem.placeHolder"
      @change="changeValue"
    /><a-button
      @click="intelligentRecognition"
      v-if="shopHrefVal && intelligentFlag"
      type="primary"
      class="intelligent-recognition-btn"
      ><img src="@comp/images/dynamicForm/frame.png" />智能识别</a-button
    >
    <a-modal
      wrapClassName="loading-modal-shophref"
      :visible="loading"
      :closable="false"
      :footer="null"
      width="448px"
      centered
    >
      <a-spin size="large" />
      <p class="shop-href-tips">店铺信息链接识别中，受网络波动影响，预计花费 5-10秒，请您耐心等待。</p>
      <a-button @click="goInput" class="go-input" type="primary" ghost> 不等了，去手动输入 </a-button>
    </a-modal>
    <!-- <a-drawer
      :title="`${formItem.keyLabel}信息`"
      placement="right"
      :visible="drawerVisible"
      width="520px"
      @close="closeOk"
    >
      <table class="automatic-recognition-info">
        <tr v-for="(item, index) in automaticRecognitionInfo" :key="index" v-show="item.value">
          <td class="bl-label">{{ item.label }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </table>
    </a-drawer> -->
  </div>
</template>

<script>
import axios from 'axios';
import { pythonOcrLink } from '@comp/api/taxRegister.js';
import { storeInformation } from '@comp/module/itaxs/DynamicForm/staticList.js';
export default {
  props: {
    value: { type: String },
    formItem: { type: Object },
    fApi: { type: Object },
    moduleListBlock: Array,
    workInfo: { type: Object },
  },
  data() {
    return {
      shopHrefVal: '',
      time: null,
      loading: false,
      drawerVisible: false,
      automaticRecognitionInfo: [
        {
          id: 'shopName',
          label: '店铺名称',
          value: '',
        },
        {
          id: 'companyNameEn',
          label: '店铺信息链接的公司英文名',
          value: '',
        },
        {
          id: '店铺信息链接的英文城市',
          label: 'companyAddressEnCity',
          value: '',
        },
        {
          id: 'companyAddressEn',
          label: '店铺信息链接的公司英文名',
          value: '',
        },
        {
          id: 'sellerMark',
          label: '卖家记号',
          value: '',
        },
        {
          id: 'shopOtherEuTaxNumber',
          label: '其他欧盟税号',
          value: '',
        },
      ],
      sourceToken: '',
      intelligentFlag: false,
      //店铺信息自动识别字段
      storeInformation,
      tradeRegisterNumber: '',
    };
  },
  mounted() {
    let shopSalePlatformName = this.fApi.getValue('shopSalePlatformName');
    if (shopSalePlatformName === 'Amazon') {
      this.intelligentFlag = true;
    }
    //在RadioComponents.vue中触发
    this.$bus.$on('intelligentFlagChange', (flag) => {
      this.intelligentFlag = flag;
    });
    this.sourceToken = axios.CancelToken.source();
  },
  watch: {
    value: {
      immediate: true, // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val) {
        this.shopHrefVal = val;
      },
    },
  },
  methods: {
    // closeOk() {
    //   this.drawerVisible = false;
    //   let companyAddressEn = this.fApi.getValue('companyAddressEn');
    //   if (/[\u4e00-\u9fa5]/.test(companyAddressEn)) {
    //     this.$bus.$emit('storeLinkDetailedAddress', true);
    //   }
    // },
    //智能识别
    intelligentRecognition() {
      this.fApi.validateField('shopHref');
      this.changeValue({ target: { value: this.shopHrefVal } });
    },
    changeValue(e) {
      this.shopHrefVal = e.target.value;
      this.$emit('input', this.shopHrefVal);
      this.fApi.validateField('shopHref');
      let shopSalePlatformName = this.fApi.getValue('shopSalePlatformName');
      console.log(shopSalePlatformName);
      clearTimeout(this.time);
      if (
        shopSalePlatformName === 'Amazon' &&
        this.shopHrefVal &&
        this.shopHrefVal.includes('https://www.amazon.de/sp')
      ) {
        this.sourceToken.cancel('取消请求');
        this.time = setTimeout(() => {
          this.sourceToken = axios.CancelToken.source();
          this.loading = true;
          this.tradeRegisterNumber = '';
          pythonOcrLink(
            {
              url: this.shopHrefVal,
            },
            this.sourceToken
          )
            .then((res) => {
              this.loading = false;
              if (res.code === 0) {
                let data = JSON.parse(res.data).data;
                if (data.info) {
                  // this.drawerVisible = true;
                  this.fApi.setValue(data.info);
                  Object.keys(data.info).forEach((key) => {
                    this.automaticRecognitionInfo.forEach((item) => {
                      if (key === item.id) {
                        item.value = data.info[key];
                      }
                      //获取邮编
                      if (key === 'companyAddressEn' && data.info[key]) {
                        this.getCompanyPostCode(data.info[key]);
                      }
                    });
                  });
                  //是否有其他欧盟国家税号
                  if (data.info.shopOtherEuTaxNumber) {
                    if (data.info.shopOtherEuTaxNumber.includes('GB')) {
                      this.fApi.setValue({ isOtherEUDutyOrServices: '2', shopOtherEuTaxNumber: '' });
                    } else {
                      this.fApi.setValue({ isOtherEUDutyOrServices: '1' });
                    }
                  } else {
                    this.fApi.setValue({ isOtherEUDutyOrServices: '2', shopOtherEuTaxNumber: '' });
                  }
                  let companyAddressEn = this.fApi.getValue('companyAddressEn');
                  if (/[\u4e00-\u9fa5]/.test(companyAddressEn) && this.workInfo.functionCode !== '2') {
                    this.$bus.$emit('storeLinkDetailedAddress', true);
                  }
                  this.fApi.validateField('shopHref');
                  this.fApi.validateField('companyAddressEn');
                  this.tradeRegisterNumber = data.info.tradeRegisterNumber;
                  if (data.info.tradeRegisterNumber) {
                    //校验社会统一信用代码
                    this.validate();
                  }
                } else {
                  this.$warning({
                    title: `非常抱歉，店铺信息自动识别失败，您可以重新复制链接再次尝试，或手动输入店铺相关信息。`,
                    centered: true,
                    okText: '确定',
                  });
                }
                this.$emit('input', this.shopHrefVal);
              } else {
                this.$message.error('您的链接有误，请查看教程，重新填写!');
              }
            })
            .catch((e) => {
              this.loading = false;
            });
          this.$nextTick(() => {
            this.fApi.display(true, this.storeInformation);
          });
        }, 500);
      }
    },
    validate() {
      let companyCreditCode = this.moduleListBlock[0].fApi.getValue('companyCreditCode');
      let validateNameIsSame = (rule, value, callback) => {
        if (this.intelligentFlag && companyCreditCode !== this.tradeRegisterNumber) {
          this.fApi.setValue({ shopHref: '' });
          return callback(
            new Error(
              '店铺信息链接获取的统一信用代码和营业执照的社会统一信用代码不一致，请检查并更换店铺信息链接重新获取!'
            )
          );
        } else {
          callback();
        }
      };

      this.fApi.updateValidate(
        'shopHref',
        [
          {
            type: 'string',
            validator: validateNameIsSame,
          },
        ],
        true
      );
      this.$nextTick(() => {
        this.fApi.validateField('shopHref');
      });
    },
    getCompanyPostCode(address) {
      let addressHandle = address.split(' ');
      let postCode = addressHandle[addressHandle.length - 2];
      if (!isNaN(postCode)) {
        this.fApi.setValue({ companyPostCode: postCode });
      }
    },
    //手动输入
    goInput() {
      this.loading = false;
      this.sourceToken.cancel('取消请求');
    },
  },
};
</script>

<style lang="less" scoped>
.shop-href-input {
  width: 300px;
  vertical-align: top;
}
.automatic-recognition-info {
  border: 1px solid #f0f0f0;
  width: 100%;
  td {
    border: 1px solid #f0f0f0;
    padding: 12px 16px;
    word-break: break-all;
  }
  .bl-label {
    background: #fafafa;
    width: 160px;
  }
}
.intelligent-recognition-btn {
  img {
    width: 18px;
    position: relative;
    top: 3px;
    margin-right: 3px;
  }
}
.go-input {
  margin-top: 20px;
}
.shop-href-tips {
  line-height: 18px;
  text-align: left;
  width: 310px;
  margin: 0 auto;
}
</style>
<style lang="less">
.loading-modal-shophref {
  .ant-modal-content {
    border-radius: 20px;
  }
  .ant-modal-body {
    text-align: center;
    height: 250px;
    .ant-spin {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    > p {
      color: #000;
    }
  }
}
</style>
