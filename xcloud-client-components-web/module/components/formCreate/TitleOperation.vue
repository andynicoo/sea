<template>
  <div class="title-operation">
    <span class="storeInformation-icon" v-if="storeInformation.includes(keyName)">
      <a-tooltip>
        <template slot="title"> 该字段可通过“店铺信息链接”系统 智能识别填写 </template
        ><img src="@comp/images/dynamicForm/frame2.png" /></a-tooltip
    ></span>
    <span
      v-if="['shopHref'].includes(keyName)"
      class="title-operation-btn view-tutorial"
      v-copy="fApi.getValue('shopHref')"
      ><a-icon type="link" />复制链接</span
    ><span
      v-if="['shopHref', 'shopConsoleScreenshot', 'storageAddressImg', 'articlesOfAssociationFile'].includes(keyName)"
      class="title-operation-btn view-tutorial"
      @click="tutorialShow(keyName)"
      ><a-icon type="book" />查看教程</span
    >
    <span
      class="storeInformation-icon title-operation-btn"
      v-if="['companyNameEn'].includes(keyName)"
      @mouseenter="getInfo"
    >
      <a-tooltip placement="rightTop" overlayClassName="company-name-en-tips">
        <template slot="title">
          <p v-if="companyNameZh">营业执照公司名：{{ companyNameZh }}</p>
          <p v-if="companyCreditCode">信用代码：{{ companyCreditCode }}</p> </template
        ><img src="@comp/images/dynamicForm/frame3.png" />对比</a-tooltip
      ></span
    >
    <viewer v-show="false" @inited="initedFile" :images="[tutorial[tutorialName]]">
      <img :src="tutorial[tutorialName]" />
    </viewer>
  </div>
</template>

<script>
import { storeInformation } from '@comp/module/itaxs/DynamicForm/staticList.js';
export default {
  props: {
    fApi: Object,
    keyName: String,
    moduleListBlock: Array,
  },
  data() {
    return {
      storeInformation,
      tutorialName: 'shopHref',
      tutorial: {
        shopHref: require('@comp/images/dynamicForm/shopHref.jpg'),
        shopConsoleScreenshot: require('@comp/images/dynamicForm/shopConsoleScreenshot.jpg'),
        storageAddressImg: require('@comp/images/dynamicForm/shopConsoleScreenshot.jpg'),
        articlesOfAssociationFile: require('@comp/images/dynamicForm/articlesOfAssociationFile.png'),
      },
      companyCreditCode: '',
      licenseRegisteredCompanyNameEn: '',
      companyNameZh: '',
    };
  },
  created() {
    this.tutorialName = this.keyName;
    // if (this.keyName === 'companyCreditCode') {
    //   this.companyCreditCode = this.fApi.getValue('companyCreditCode');
    // }
    // if(this.fApi.getValue('companyCreditCode'))
    // this.companyCreditCode = this.fApi.getValue('companyCreditCode')
    // console.log(this.moduleListBlock[0].fApi.getValue('companyCreditCode'), 8989);
  },
  methods: {
    getInfo() {
      this.companyNameZh = this.moduleListBlock[0].fApi.getValue('companyNameZh');
      this.licenseRegisteredCompanyNameEn = this.moduleListBlock[0].fApi.getValue('licenseRegisteredCompanyNameEn');
      this.companyCreditCode = this.moduleListBlock[0].fApi.getValue('companyCreditCode');
    },
    //初始化查看上传文件
    initedFile(viewer) {
      this.$initedFile = viewer;
    },
    //点击查看教程
    tutorialShow(keyName) {
      this.tutorialName = keyName;
      this.$initedFile.show();
    },
  },
};
</script>

<style lang="less" scoped>
.title-operation {
  display: inline-block;
  padding-left: 16px;
}
.title-operation-btn {
  padding: 2px 6px;
  border-radius: 4px;
  background: #ecf3ff;
  color: #3a7fff;
  cursor: pointer;
  margin-right: 16px;
  /deep/.anticon {
    font-size: 12px;
    margin-right: 5px;
    position: relative;
    top: -1px;
  }
}
.storeInformation-icon {
  margin-right: 16px;
  img {
    width: 18px;
    position: relative;
    top: 4px;
  }
}
</style>
<style>
.company-name-en-tips {
  max-width: 1100px;
}
</style>
