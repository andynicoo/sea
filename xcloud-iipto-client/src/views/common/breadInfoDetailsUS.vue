<template>
  <div class="mainContent">
    <div class="my-card">
      <!-- {{ rejectInfo }} 显示固定的驳回原因 -->
      <!-- <div class="rejectinfo" v-if="rejectInfo.progressBar === 2 && rejectInfo.rejectReason">
        <h2><Icon type="md-alert" style="color:#E34D59;" />驳回原因</h2>
        <p>{{ rejectInfo.rejectReason }}</p>
      </div> -->
      <DynamicForm
        ref="dynamicForm"
        :moduleList="dataReview"
        @formsubmit="formsubmit"
        @formSave="formSave"
        :showSubmit="true"
        :showSave="true"
        :serviceNo="serviceInfo.serviceNo"
        :serviceInfo="serviceInfo"
        :rejectInfo="serviceInfo.rejectInfo"
        formValueLabel="keyNameValue"
      />
    </div>
  </div>
</template>

<script>
import '@/assets/style/common.less';
import { getPatentDetail, submitInfo, saveInfo } from '@/api/myPatent';
import DynamicForm from '@/components/DynamicForm/dynamicForm'; // 表单配置

import { workorderDetailAPI, updateNodeAPI } from '@/api/trademarkRegister/myBread';

export default {
  components: {
    DynamicForm,
  },
  data() {
    return {
      moduleList: [],
      serviceId: this.$route.params.id,
      serviceInfo: {},
      isEdit: true,
      rejectInfo: {
        // 判定是否被驳回
        rejectReason: '',
        progressBar: 0,
      },
      riskflag: false,
      existSubclass: false,
    };
  },
  mounted() {
    this.getDetail();
  },
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item, i) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit);
          } else {
            item.disabled = !this.isEdit;
          }
          let hiddenList = [];
          switch (this.serviceInfo.modelingDrawType) {
            // 1仅建模，隐藏建模，是建模后再绘图，包含建模绘图
            // 3建模绘图，隐藏建模和绘图
            case 1:
            case 3:
              hiddenList = ['modelingFile', 'drawingFile'];
              break;
            case 2:
              // 仅绘图，隐藏绘图
              hiddenList = ['drawingFile'];
              break;
            default:
              hiddenList = ['productProtection', 'modelingFile'];
              // 0:无建模绘图，隐藏
              break;
          }
          if (hiddenList.includes(item.keyName)) {
            item.inputType = 'hidden';
          }
        });
      });
      return this.moduleList;
    },
  },
  methods: {
    // 模板导入
    templateImport() {
      this.$refs.dynamicForm.importTemplatesModal = true;
    },
    // 获取工单资料
    getDetail() {
      let data = {
        serviceId: this.$route.query.id,
        nodeCode: this.$route.query.nodeCode,
      };
      this.checkTwoClassifyList = [];
      workorderDetailAPI(data)
        .then((res) => {
          if (res.code == 0) {
            this.serviceInfo = res.data.trademarkOrderServiceInfoVO;
            this.existSubclass = this.serviceInfo.existSubclass;
            localStorage.workflowId = this.serviceInfo.workflowId;
            if (res.data.workflowColumns.length) {
              this.moduleList = res.data.workflowColumns;
            }
            this.$emit('sendRejectInfo', this.serviceInfo)
          }
        })
        .finally(() => {
          // this.changeCheckRadio();
        });
    },
    // 提交信息
    formsubmit(info) {
      let params = this.handleFormInfo(info, true);
      if (this.riskflag) {
        return this.$Message.warning('请填写风险小类关键词!');
      }
      this.$Modal.confirm({
        title: '确定提交资料？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          updateNodeAPI(params).then((res) => {
            if (res.code == 0) {
              localStorage.backPath = '/myBrand';
              let typeList = ['纯文字', '黑白图形', '彩色图形', '文字+黑白图形', '文字+彩色图形'];
              let trademarkInfo = {
                title: this.$route.query.countryNameZh + '商标注册',
                type: typeList[JSON.parse(info).trademarkType - 1],
                name: JSON.parse(info).trademarkNameEn,
                logo: JSON.parse(info).trademarkLogo,
              };
              localStorage.trademarkInfo = JSON.stringify(trademarkInfo);
              this.$router.push('/submittedSucceeded');
            }
          });
        },
        onCancel: () => {},
      });
    },
    //处理图片
    handleImg(imgList) {
      let imgs = [];
      imgList.forEach((item) => {
        item.fileList.forEach((pic) => {
          imgs.push({
            fileName: pic.name,
            fileUrl: pic.url,
          });
        });
      });
      return imgs;
    },
    //商品分类处理
    trademarkCategoryHandle(trademarkCategory) {
      console.log(trademarkCategory, 999);
      this.riskflag = false;
      trademarkCategory.forEach((cate) => {
        if (cate.riskClassifyList && cate.riskClassifyList.length) {
          cate.riskClassifyList.forEach((risk) => {
            if (Array.isArray(risk.keyword)) {
              if (!risk.keyword[0]) {
                this.riskflag = true;
              } else {
                cate.listTrademarkCategory2.forEach((cate2) => {
                  if (risk.category2Num == cate2.category2Num) {
                    cate2.keyword = risk.keyword;
                  }
                });
              }
            } else if (!risk.keyword) {
              this.riskflag = true;
            } else {
              cate.listTrademarkCategory2.forEach((cate2) => {
                if (risk.category2Num == cate2.category2Num) {
                  cate2.keyword = [risk.keyword];
                }
              });
            }
          });
        }
      });
      if (this.riskflag) {
        return false;
      } else {
        if (!this.existSubclass) {
          trademarkCategory.forEach((item, index) => {
            if (trademarkCategory[index].textareaubclass) {
              let textareaubclass = trademarkCategory[index].textareaubclass.split(';') || [];
              trademarkCategory[index].listTrademarkCategory2 = [];
              textareaubclass.forEach((element) => {
                let obj = {
                  // category2Name: element,
                  category2NameEn: element,
                  category2Num: '000-00',
                  parentCategoryNum: '',
                };
                trademarkCategory[index].listTrademarkCategory2.push(obj);
              });
            }
          });
        }
        return JSON.stringify(trademarkCategory);
      }
    },
    /**
     * 校对 otherSamll小语种值
     */
    ProofreadingOtherSmallLanguagesFiles(otherSmallLanguagesFiles) {
      if (otherSmallLanguagesFiles) {
        if (Array.isArray(otherSmallLanguagesFiles)) {
          return JSON.stringify(otherSmallLanguagesFiles);
        } else if (otherSmallLanguagesFiles.substring(0, 5) == 'http:') {
          return JSON.stringify([otherSmallLanguagesFiles]);
        } else {
          return otherSmallLanguagesFiles;
        }
      }
    },
    parseFileUrl(keyNameValue) {
      try {
        keyNameValue = JSON.parse(keyNameValue)[0];
      } catch (error) {
        if (keyNameValue && keyNameValue.length && typeof keyNameValue === 'object') {
          keyNameValue = keyNameValue[0];
        }
      }
      return keyNameValue;
    },
    //处理提交信息
    handleFormInfo(info, path) {
      let cloneInfo = JSON.parse(info);

      let useProductImg = cloneInfo.useProductImg ? this.handleImg(cloneInfo.useProductImg) : '';
      let useEvidence = cloneInfo.useEvidence ? this.handleImg(cloneInfo.useEvidence) : '';
      cloneInfo.useProductImg = JSON.stringify(useProductImg);
      cloneInfo.useEvidence = JSON.stringify(useEvidence);
      cloneInfo.trademarkCategory = this.trademarkCategoryHandle(cloneInfo.trademarkCategory); //JSON.stringify(cloneInfo.trademarkCategory);
      cloneInfo.marketHref = JSON.stringify(cloneInfo.marketHref);
      if (Array.isArray(cloneInfo.identityCardFront) && cloneInfo.identityCardFront.length) {
        cloneInfo.identityCardFront = '"' + cloneInfo.identityCardFront[0] + '"';
      }
      if (Array.isArray(cloneInfo.identityCardReverse) && cloneInfo.identityCardReverse.length) {
        cloneInfo.identityCardReverse = '"' + cloneInfo.identityCardReverse[0] + '"';
      }
      if (Array.isArray(cloneInfo.companyBusinessLicense) && cloneInfo.companyBusinessLicense.length) {
        cloneInfo.companyBusinessLicense = '"' + cloneInfo.companyBusinessLicense[0] + '"';
      }
      if (Array.isArray(cloneInfo.trademarkLogo) && cloneInfo.trademarkLogo.length) {
        cloneInfo.trademarkLogo = '"' + cloneInfo.trademarkLogo[0] + '"';
      }
      cloneInfo.otherSmallLanguagesFiles =
        cloneInfo.otherSmallLanguagesFiles &&
        this.ProofreadingOtherSmallLanguagesFiles(cloneInfo.otherSmallLanguagesFiles);
      Object.keys(cloneInfo).forEach((item) => {
        if (Array.isArray(cloneInfo[item])) {
          cloneInfo[item] = this.parseFileUrl(cloneInfo[item]);
        }
      });
      let requestData = {
        serviceId: this.$route.query.id,
        nodeCode: this.$route.query.nodeCode,
        json: cloneInfo,
        path: path ? true : '',
      };
      return requestData;
    },
    getFormInfo() {
      let params = this.handleFormInfo(this.$refs.dynamicForm.getMaterial());
      return params;
    },
    // 保存信息
    formSave(info, next) {
      const infoObj = JSON.parse(info);
      const categoryArr = infoObj['trademarkCategory'];
      let arr = [];
      let all = [];
      categoryArr.forEach((v) => {
        let subArr = [];
        v.listTrademarkCategory2.forEach((v) => {
          if (v.similarGroup) {
            console.log('v.similarGroup.indexOf(', ')', v.similarGroup.indexOf(','));
            if (v.similarGroup.indexOf(',') != -1) {
              const arr = v.similarGroup.split(',');
              arr.forEach((v) => subArr.push(v));
            } else {
              const arr = v.similarGroup.split(' ');
              arr.forEach((v) => subArr.push(v));
            }
          }
        });
        arr = [...new Set(subArr.filter((v) => v != ''))];
        all.push([...arr]);
        console.log('小类群组', subArr.length, [...new Set(subArr)].length, arr.length);
      });
      console.log('小类群组all', all);
      for (let i = 0; i < all.length; i++) {
        if (all[i].length > 22) {
          return this.$Message.error(`已选择类似群组${all[i].length}个，最多不能超过22个`);
        }
      }

      let params = this.handleFormInfo(info);
      if (this.riskflag) {
        return this.$Message.warning('请填写风险小类关键词!');
      }
      if (next) {
        let cloneInfo = JSON.parse(info);
        let category1 = false;
        let category2 = false;
        if (cloneInfo.trademarkCategory && cloneInfo.trademarkCategory.length) {
          cloneInfo.trademarkCategory.forEach((item) => {
            if (!item.category1Name) {
              category1 = true;
            }
            if (!item.listTrademarkCategory2.length) {
              category2 = true;
            }
          });
        } else {
          return this.$Message.warning('请选择商品分类!');
        }
        if (category1) {
          return this.$Message.warning('请选择商品分类!');
        }
        if (category2 && this.existSubclass) {
          return this.$Message.warning('请选择商品小类!');
        }
        let marketHrefFlg = false;
        if (cloneInfo.marketHref && cloneInfo.marketHref.length) {
          cloneInfo.marketHref.forEach((item) => {
            if ((!item.category2Name && !item.category2NameEn) || !item.marketHref) {
              marketHrefFlg = true;
            }
          });
        }
        if (marketHrefFlg) {
          return this.$Message.warning('请填写销售链接!');
        }
        let useProductImgFlg = false;
        if (cloneInfo.useProductImg && cloneInfo.useProductImg.length) {
          cloneInfo.useProductImg.forEach((item) => {
            if (!item.category2Num || !item.fileList.length) {
              useProductImgFlg = true;
            }
          });
        }
        if (useProductImgFlg) {
          return this.$Message.warning('请上传产品图!');
        }
      }
      updateNodeAPI(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('操作成功');
          if (next) {
            this.$refs.dynamicForm.stepsIndex = 3;
            this.$store.dispatch('app/setStepIndex', 3);
            this.$nextTick(() => {
              document.documentElement.scrollTop = document.body.scrollTop = 0;
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 100%;
  padding: 0;
  vertical-align: top;
  box-shadow: none;
  margin-top: 20px;
  .my-card {
    padding: 0;
  }
  .formCreate {
    padding: 0;
  }
}
</style>
