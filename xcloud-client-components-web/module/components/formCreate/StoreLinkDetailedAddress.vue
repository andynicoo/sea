<template>
  <div class="storeLinkDetailedAddress">
    <a-textarea
      :value="currentVal"
      :auto-size="{ minRows: 3, maxRows: 5 }"
      :placeholder="formItem.placeHolder"
      @change="changeValue"
      class="formMaxWidth"
    />
    <div class="example-file" v-if="formItem.fileModelUrl">
      <dl class="example-file-ul">
        <dt>示例</dt>
        <dd>
          <div class="example-fileA">
            <embed
              v-if="formItem.fileModelUrl.includes('.pdf')"
              :src="formItem.fileModelUrl"
              type="application/pdf"
              width="100%"
              height="100%"
            />
            <viewer v-else @inited="initedA" :images="[formItem.fileModelUrl]">
              <img :src="formItem.fileModelUrl" />
            </viewer>
          </div>
          <b @click="exampleFile('$viewerA', formItem.fileModelUrl)">查看示例</b>
        </dd>
      </dl>
    </div>
    <a-modal centered :visible="visible" :closable="false" :maskClosable="false">
      <template slot="footer">
        <a-button v-if="steps !== 3" class="view-tutorial" @click="$tutorialInitedFile.show()">
          查看教程
        </a-button>
        <a-button key="back" @click="handleCancel" v-show="steps !== 3">
          {{ cancelText }}
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk">
          {{ okText }}
        </a-button>
      </template>
      <template slot="title"> <a-icon class="exclamation-circle" type="exclamation-circle" />温馨提示 </template>
      <div v-if="steps === 1" class="storeLinkDetailedAddress-tips">
        系统检测到您提供的店铺信息链接中<span>公司地址（Business Address）</span>显示的是中文的
        地址，应该为全英语/德语页面，<span>不能出现中文</span>。请查看教程进行修改，建议您改为与
        营业执照意思一致的英文或者拼音。
      </div>
      <div v-if="steps === 2" class="storeLinkDetailedAddress-tips">
        如果店铺后台显示中文地址/信息，税局无法识别中文内容会导致税号下不来、下号后
        绑定不上店铺、无法通过亚马逊德国站地址审查等风险，<span>由卖家公司/个人承担。</span>
      </div>
      <div v-if="steps === 3" class="storeLinkDetailedAddress-tips">
        如您坚持使用含中文地址的链接，请自行输入店铺的英文地址用于注册， 我们会按照您输入的英文信息进行提交。
      </div>
    </a-modal>
    <viewer v-show="false" @inited="tutorialInitedFile" :images="[tutorialUrl]">
      <img :src="tutorialUrl" />
    </viewer>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String },
    formItem: { type: Object },
    fApi: { type: Object },
  },
  data() {
    return {
      currentVal: '',
      visible: false,
      steps: 1,
      cancelText: '不修改，继续注册',
      okText: '知道了，重新填写',
      tutorialUrl: require('@comp/images/dynamicForm/shopHrefCn.jpg'),
    };
  },
  mounted() {
    // let shopSalePlatformName = this.fApi.getValue('shopSalePlatformName');
    // if (shopSalePlatformName === 'Amazon') {
    //   this.isDisabled = true;
    // }
    // //在RadioComponents.vue中触发
    // this.$bus.$on('isDisabledChange', (flag) => {
    //   this.isDisabled = flag;
    // });
    //在ShopHref.vue中触发
    this.$bus.$on('storeLinkDetailedAddress', (flag) => {
      if (flag) {
        this.steps = 1;
        this.visible = flag;
      }
    });
  },
  watch: {
    value: {
      immediate: true, // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val) {
        this.currentVal = val;
      },
    },
  },
  methods: {
    //初始化查看示例A
    initedA(viewer) {
      this.$viewerA = viewer;
    },
    exampleFile(key, url) {
      if (url.includes('.pdf')) {
        window.open(url);
      } else {
        this[key].show();
      }
    },
    //初始化教程
    tutorialInitedFile(viewer) {
      this.$tutorialInitedFile = viewer;
    },
    //确定
    handleOk() {
      this.visible = false;
      if (this.steps === 3) {
        // this.isDisabled = false;
      } else {
        this.fApi.setValue({ shopHref: '', companyAddressEn: '' });
      }
    },
    //取消
    handleCancel() {
      console.log(this.steps, 999);
      if (this.steps === 1) {
        this.steps = 2;
        this.cancelText = '我已知晓风险，继续注册';
      } else if (this.steps === 2) {
        this.steps = 3;
        this.okText = '我已知晓风险，去填写';
      }
    },
    changeValue(e) {
      this.currentVal = e.target.value;
      this.$emit('input', this.currentVal);
      this.fApi.validateField('companyAddressEn');
    },
  },
};
</script>

<style lang="less" scoped>
.exclamation-circle {
  color: rgba(251, 193, 79);
  font-size: 18px;
  margin-right: 5px;
  vertical-align: top;
  position: relative;
  top: 2px;
}
.storeLinkDetailedAddress-tips {
  color: #000;
  span {
    color: #e81e19;
  }
}
.view-tutorial {
  float: left;
}

.example-file {
  display: inline-block;
  position: absolute;
  top: -70px;
  left: 560px;
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
  .error-example {
    width: 150px;
    text-align: left;
    img {
      width: 54px;
      margin-right: 11px;
    }
  }
}
.example-fileA,
.example-fileB,
.example-fileOr {
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
.example-fileB {
  width: 147px;
}
.example-fileOr {
  width: 36px;
  border: none;
  color: rgba(0, 0, 0, 0.4);
}

.example-file-ul {
  display: inline-block;
  margin: 0 0 0 24px;
  dd {
    margin: 0;
  }
}
.storeLinkDetailedAddress {
  position: relative;
}
</style>
