<template>
  <div class="mainContent">
    <div class="title" ref="title">
      <img @click="goMyBread" src="@/assets/images/common/dynamicForm/icon_fanhui2x.png" />商标使用证据
      <a-tooltip placement="top" overlayClassName="title-tips" :getPopupContainer="() => $refs.title">
        <template #title>
          <span
            >如果未在规定时间内宣誓，商标将会失效；如果您暂时不能提供证据，可联系专属客服申请延期提交使用证据，延期会产生额外的费用</span
          >
        </template>
        <i class="icon-tip">?</i>
      </a-tooltip>
    </div>
    <div class="formCreate">
      <form-create :rule="rule" class="form-create form-create-new" :option="option" v-model="fApi" />
      <div class="btn-group">
        <Button @click="() => submit(false)" :disabled="propsData.isCancel" class="keep">暂存</Button>
        <Button @click="() => submit()" :disabled="propsData.isCancel" type="primary">提交</Button>
      </div>
    </div>
    <div ref="assistantRef" class="assistant-tips" v-if="assistantShow" v-drag>
      <a-popconfirm ok-text="继续关闭" cancel-text="取消" width="120" @confirm="assistantShow = false"
        ><template slot="title">
          <p class="assistant-close-tips">暂时关闭小助手后，再次点击输入框就可以唤起小助手拉</p> </template
        ><a-icon type="close" class="drag-close-icon"
      /></a-popconfirm>
      <dl>
        <dt>{{ assistantInfo.keyLabel }}</dt>
        <dd v-if="assistantInfo.keyName == 'marketHref'" class="diy-tips remind-message">
          <div>{{ assistantInfo.remindMessage }}</div>
          <div>销售链接要求：</div>
          1、在美国境内销售，币种为美元;<br />
          2、可加入购物车，销售金额与市场价保持一致，上下浮动20%的范围比较合理;<br />
          3、至少有一张产品图显示出商标名字;<br />
          4、标题首位是商标名称或者品牌是商标名字;<br />
          5、链接可以是亚马逊/eBay/Wish/阿里巴巴国际站等。<br />
        </dd>
        <dd v-else-if="assistantInfo.keyName == 'trademarkCategory'" class="diy-tips remind-message">
          小类信息由专员在官网进行排查，最终以官网信息为准.建议最佳是10-15个商标小类名称,最多20个
        </dd>
        <dd v-else-if="assistantInfo.keyName == 'useProductImg'" class="diy-tips remind-message">
          <div>使用证据要求：</div>
          1、照片必须为 JPG 格式、每张图≤2MB; 照片清晰且无水印、产品完整且未使用过;<br />
          2、照片不可经过 PS、美化等处理，产品要真正的实拍图，不要白底图片，不要拍到 其他杂物，也不要手拿着拍;<br />
          3、照片请以小类英文名称命名，方便审核;<br />
          4、商标LOGO 不能采用贴纸、金属贴标等方式，需要真实印，可采用丝印、镭射、激 光、雕刻;<br />
          5、产品图上不能出现中文以及™、®标识。<br />
          <div class="examples">
            <p>符合的图片类型</p>
            <img src="https://fdfs.itaxs.com/group1/M00/04/EE/rBLKNV_QkQuAF2JiAACSFlBcrYk905.png" alt="" />
            <img src="https://fdfs.itaxs.com/group1/M00/04/EE/rBLKNV_QkSqAfwZfAAClUBVsIrc431.png" alt="" />
          </div>
          <div class="examples">
            <p>不符合的图片类型</p>
            <img src="https://fdfs.itaxs.com/group1/M00/04/EE/rBLKNV_QkUKAE8BbAACOuG7i62g495.png" alt="" />
            <img src="https://fdfs.itaxs.com/group1/M00/04/EE/rBLKNV_QkVqAYciLAACc2vOyxb4242.png" alt="" />
          </div>
          <p class="modal-tip">
            <img src="@/assets/images/product/error-icon.png" alt="" />不符合原因：1、产品不完整 2、没有logo 3、含有中文
            4、图片不清晰
          </p>
        </dd>
        <dd v-else class="remind-message">{{ assistantInfo.remindMessage }}</dd>
        <dd>
          <a
            v-if="assistantInfo.fileModelUrl"
            :href="assistantInfo.fileModelUrl"
            target="_blank"
            style="color: #16ade9; margin-right: 20px"
          >
            <img
              class="fileModel"
              :src="assistantInfo.fileModelUrl"
              v-if="
                assistantInfo.fileModelUrl.includes('png') ||
                  assistantInfo.fileModelUrl.includes('jpg') ||
                  assistantInfo.fileModelUrl.includes('jpeg')
              "
            />
            <div v-else class="fileModel-other">{{ fileModelUrlSuffix(assistantInfo.fileModelUrl) }}</div>
          </a>
        </dd>
      </dl>
      <div class="customer-service">
        <div class="customer-service-txt">
          挡住视线可以我把拖走呦<br />还有疑问？可以点击<span
            v-sensors="{
              type: 'LittleAssistant',
              event: 'click',
              getParams: () => {
                return { field_name: assistantInfo.keyLabel };
              },
            }"
            onclick="easemobim.bind({configId: `16969a62-0320-44bd-b2e3-b1cae76fb523`})"
            >询问客服</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dynamicForm } from '@/libs/dynamicForm.js';
import { workorderDetailAPI, updateNodeAPI } from '@/api/trademarkRegister/myBread';
import ProductPictures from '@/components/DynamicForm/ProductPictures/index.vue';
import { cloneDeep, uniqBy } from 'lodash';
import { submitEvidence } from '@/api/trademarkRegister/myBread';
import qs from 'qs';

export default {
  data() {
    return {
      propsData: {
        // 数据列表
        moduleList: [],
        // 是否显示所有按钮
        showBtn: false,
        // 是否显示取消按钮
        showCancel: true,
        // 是否显示保存按钮
        showSave: true,
        // 是否显示提交按钮
        showSubmit: true,
        // 是否税务稽查
        taxInspection: false,
        // 税务稽查国家
        taxInspectionCountry: '',
        // 是否注销税号
        logoutTaxNum: false,
        // 注销税号国家
        logoutTaxNumCountry: '',
        // 是否显示授权书
        showAuthorizeFile: false,
        // 是否海牙授权
        hyAuthorized: false,
        // 是否取消中或已取消状态，禁用按钮
        isCancel: false,
        // 栅格布局参数
        colspan: 24,
        serviceNo: '',
        // 工单id
        workOrderId: '',
        // Tabs选中的值
        tabsCurrent: {
          type: String,
          default: '1',
        },
        //服务信息
        serviceInfo: {},
        //驳回原因
        rejectInfo: '',
        //表单存值label
        formValueLabel: '',
        //旧的
        isOld: false,
        existSubclass: false,
      },
      fApi: {},
      option: {
        form: { labelWidth: undefined, labelPosition: 'top' },
        resetBtn: false,
        submitBtn: false,
      },
      trademarkCategoryList: [],
      trademarkCategoryData: {},
      riskClassifyList: [],
      assistantShow: false,
      assistantInfo: {},
      watchOpen: true,
      moduleListUpload: [],
      moduleListUploadSelect: [],
      serviceId: this.$route.query.id,
      formData: {},
      riskflag: false,
    };
  },
  computed: {
    rule() {
      return dynamicForm(this.propsData.moduleList, this.propsData);
    },
    useValidate() {
      if (this.propsData.moduleList.length) {
        const columsArr = this.propsData.moduleList[0].columns;
        const useObj = columsArr.reduce((prev, cur) => {
          const { isNeed, keyName, keyLabel } = cur;
          prev[keyName] = {
            isNeed,
            keyName,
            keyLabel,
          };
          return prev;
        }, {});
        return useObj;
      } else {
        return null;
      }
    },
  },
  components: {
    ProductPictures,
  },
  watch: {
    'propsData.moduleList': {
      handler(newVal) {
        if (this.watchOpen && newVal && newVal.length) {
          this.watchOpen = false;
          //表单元素加点击事件
          newVal.forEach((module) => {
            module.columns.forEach((item) => {
              if (item.remindMessage || item.keyName == 'useProductImg' || item.keyName == 'trademarkCategory') {
                this.fApi.on(`native-${item.keyName.replace(/([A-Z])/g, '-$1').toLowerCase()}-click`, (e) =>
                  this.eleHandleclick(e, item)
                );
              }
            });
          });
          //上传资料处理
          this.moduleListUpload = cloneDeep(newVal);
          let map = new Map();
          this.moduleListUpload.forEach((module) => {
            module.uploadArr = [];
            module.columns.forEach((item) => {
              if (item.columnId) {
                map.set(item.columnId, item);
              }
              if (item.inputType == 4) {
                module.uploadArr.push(item);
              }
              if (item.inputType == 4 && item.columnPid) {
                let columnParrent = cloneDeep(map.get(item.columnPid));
                columnParrent.info = JSON.parse(columnParrent.info);
                columnParrent.value = ['""', '{}'].includes(JSON.stringify(columnParrent[this.formValueLabel]))
                  ? columnParrent.info.groups[0].value
                  : columnParrent[this.formValueLabel].toString();
                this.moduleListUploadSelect.push(columnParrent);
                console.log(columnParrent[this.formValueLabel], this.formValueLabel, 'this.formValueLabel');
              }
            });
          });
          this.moduleListUploadSelect = uniqBy(this.moduleListUploadSelect, 'columnId');
          this.moduleListUpload = this.moduleListUpload.filter((module) => {
            if (module.uploadArr.length) {
              return module;
            }
          });
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getDetail();
    window.addEventListener('scroll', () => {
      this.assistantShow = false;
    });
    localStorage.removeItem('fillEvidenceQuery');
  },
  methods: {
    //商品分类处理
    trademarkCategoryHandle(trademarkCategory) {
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
        if (!this.propsData.existSubclass) {
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
    //处理提交信息
    handleFormInfo(info, path) {
      let cloneInfo = JSON.parse(info);

      let useProductImg = cloneInfo.useProductImg ? this.handleImg(cloneInfo.useProductImg) : '';
      let useEvidence = cloneInfo.useEvidence ? this.handleImg(cloneInfo.useEvidence) : '';
      cloneInfo.useProductImg = JSON.stringify(useProductImg);
      cloneInfo.useEvidence = JSON.stringify(useEvidence);
      if (cloneInfo.firstBusinessUseDate) {
        cloneInfo.firstBusinessUseDate = `${cloneInfo.firstBusinessUseDate} 00:00:00`;
      } else {
        cloneInfo.firstBusinessUseDate = '';
      }
      if (cloneInfo.firstUseDate) {
        cloneInfo.firstUseDate = `${cloneInfo.firstUseDate} 00:00:00`;
      } else {
        cloneInfo.firstUseDate = '';
      }

      //cloneInfo.trademarkCategory = this.trademarkCategoryHandle(cloneInfo.trademarkCategory); //JSON.stringify(cloneInfo.trademarkCategory);
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
        submitFlag: path,
      };
      return requestData;
    },
    // 默认提交动作
    async submit(isSubmit = true) {
      let info = null;
      if (isSubmit) {
        info = await this.onSubmit();
        if (this.useValidate) {
          const useInfo = JSON.parse(info);
          for (let key in this.useValidate) {
            const cur = this.useValidate[key];
            const infoItem = useInfo[key];
            if (cur.isNeed) {
              if (key === 'marketHref') {
                if (infoItem[0].marketHref === '') {
                  this.$Message.error(`${cur.keyLabel}不能为空`);
                  return;
                }
              } else if (['useProductImg', 'useEvidence'].includes(key)) {
                if (infoItem[0].fileList.length === 0) {
                  this.$Message.error(`${cur.keyLabel}不能为空`);
                  return;
                }
              }
            }
          }
        }
      } else {
        info = this.onSave();
      }
      let paramsTemp = this.handleFormInfo(info, isSubmit);
      const res = await submitEvidence(paramsTemp);
      const payLinks = res.data.paymentUrl;
      this.$Message.success({
        content: '操作成功',
        onClose: () => {
          const eviParams = qs.stringify(this.$route.query);
          const usePayLinks = `${payLinks}&fromEvidence=iipto&${eviParams}`;
          if (payLinks && isSubmit) {
            window.open(encodeURI(usePayLinks));
            // 提交成功存入路由参数方便跳转回来
            localStorage.setItem('fillEvidenceQuery', JSON.stringify(this.$route.query));
          }
          setTimeout(() => {
            this.goMyBread();
          }, 0);
        },
      });
    },
    // 移除对象中的空属性
    removePropertyOfNull(obj) {
      return Object.fromEntries(Object.entries(obj).filter((item) => item[1] !== ''));
    },
    // 保存
    onSave() {
      let { testField, ...materialData } = this.fApi.form;
      return JSON.stringify(this.removePropertyOfNull(materialData));
    },
    // 提交表单
    onSubmit() {
      return new Promise((resolve) => {
        this.fApi.submit(
          (formData, fApi) => {
            let { testField, ...materialData } = formData;
            resolve(JSON.stringify(materialData));
          },
          () => {
            this.$Message.warning('请检查输入的数据');
            this.$nextTick(() => {
              let topNum =
                document.documentElement.scrollTop +
                document.querySelector('.ivu-form-item-error-tip').getBoundingClientRect().top -
                120;
              window.scrollTo({
                top: topNum,
                behavior: 'smooth',
              });
            });
          }
        );
      });
    },
    //点击元素
    eleHandleclick(e, v) {
      this.assistantShow = true;
      this.assistantInfo = v;
    },
    //返回我的商标
    goMyBread() {
      if (this.$route.query.from == 'work') {
        this.$router.push('/work');
      } else {
        this.$router.push({
          name: '我的商标',
        });
      }
    },
    initTrademark() {
      //商标分类个数:一类一个，4类4个this.serviceInfo.trademarkCategoryCount
      for (let index = 0; index < this.propsData.serviceInfo.trademarkCategoryCount; index++) {
        let riskClassifyList = [];
        this.trademarkCategoryData.listTrademarkCategory2.map((item, index) => {
          if (item.category2NameEn && item.category2NameEn.indexOf('{') !== -1) {
            if (this.riskClassifyList.length < 2) {
              riskClassifyList.push(item);
            }
          }
        });
        this.trademarkCategoryList.push({ ...this.trademarkCategoryData, riskClassifyList });
      }
      setTimeout(() => {
        this.$store.dispatch('app/setCategoryList', this.trademarkCategoryList);
      }, 1000);
    },
    // 获取工单资料
    getDetail() {
      let data = {
        serviceId: this.$route.query.id,
        nodeCode: this.$route.query.nodeCode,
      };
      this.checkTwoClassifyList = [];
      workorderDetailAPI(data).then((res) => {
        if (res.code == 0) {
          this.propsData.serviceInfo = res.data.trademarkOrderServiceInfoVO;
          this.propsData.existSubclass = this.propsData.serviceInfo.existSubclass;
          localStorage.workflowId = this.propsData.serviceInfo.workflowId;
          if (res.data.workflowColumns.length) {
            this.propsData.moduleList = res.data.workflowColumns.filter(
              (item) => item.moduleCode === 'trademarkEvidence'
            );
            const curColumns = res.data.workflowColumns.filter((item) => item.moduleCode === 'trademarkCategory')[0]
              .columns[0];
            this.trademarkCategoryData = JSON.parse(curColumns.keyNameValue)[0];
          }
          this.initTrademark();
        }
      });
    },
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function(el) {
        let odiv = el; //获取当前元素
        el.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disY = e.clientY - odiv.offsetTop;
          let top = '';
          let bottomY = document.documentElement.clientHeight - 150;

          let disX = e.clientX - odiv.offsetLeft;
          let left = '';
          let rightX = document.documentElement.clientWidth - 150;
          document.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            top = e.clientY - disY;
            //绑定元素位置到positionY上面
            //移动当前元素
            odiv.style.top = top > 0 && top < bottomY ? top + 'px' : top <= 0 ? 0 : bottomY + 'px';
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            left = e.clientX - disX;
            //绑定元素位置到positionX上面
            //移动当前元素
            odiv.style.left = left > 0 && left < rightX ? left + 'px' : left <= 0 ? 0 : rightX + 'px';
          };
          document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  background: #fff;
  padding: 24px;
  margin-bottom: 44px;
  .title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 16px;
    img {
      vertical-align: middle;
      cursor: pointer;
      width: 24px;
      margin-right: 16px;
    }
  }
  /deep/ .ant-tooltip {
    max-width: 350px;
  }
  /deep/ .ant-tooltip-inner {
    background: #fff;
    font-size: 12px;
    color: #333333;
    line-height: 20px;
  }
  /deep/ .ant-tooltip-arrow::before {
    background: #fff;
  }
  .icon-tip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 11px;
    background: #1890ff;
    color: #fff;
    font-size: 12px;
    font-style: normal;
    border-radius: 50%;
    cursor: pointer;
  }

  .form-create-new {
    padding: 24px;
    /deep/ .ivu-row {
      > div:first-child {
        display: none;
      }
    }
    /deep/ .tittleStyle {
      height: auto;
      line-height: 100%;
      border-top: 1px solid #f0f0f0;
      border-radius: 0;
      padding-top: 48px;
      margin-top: 24px;
    }
    /deep/ .form-title-one {
      .tittleStyle {
        border-top: none;
        padding-top: 24px;
        margin-top: 0px;
      }
    }
    /deep/ .ivu-radio-wrapper {
      margin-right: 24px;
    }
    /deep/ .ivu-input,
    /deep/ .ivu-select-selection {
      border-radius: 0;
    }

    /deep/ .ivu-form-item {
      .ivu-upload-list {
        margin-bottom: 0;
      }
      .ivu-form-item-label {
        width: 150px;
        text-align: left;
        position: relative;
        top: 10px;
        font-size: 14px;
        color: #515a6e;
        font-weight: normal;
        line-height: 14px;
      }
      .ivu-form-item-label + .ivu-form-item-content {
        display: inline-block;
        vertical-align: top;
        width: auto;
      }
      .ivu-form-item-label {
        position: relative;
        &::before {
          position: absolute;
        }
        span {
          padding-left: 10px;
          display: inline-block;
        }
      }
      .ivu-form-item-error-tip {
        padding-top: 3px;
        min-width: 300px;
      }
    }
    /deep/ .productListTable-wrap {
      .ivu-form-item-content {
        width: 100% !important;
        margin-top: 10px;
      }
    }
  }
  .formCreate {
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 24px;
    margin-bottom: 75px;
    // margin: 24px;
    .form-create {
      /deep/ .ivu-upload-list-remove {
        display: inherit !important;
      }
      .text-tips {
        color: rgb(251, 183, 60);
      }
      /deep/ .ivu-input-wrapper {
        width: 300px;
      }
      /deep/ .el-textarea {
        width: 300px;
      }
      /deep/ .ivu-select {
        width: 300px;
      }
      // /deep/ .ivu-col {
      //   padding: 0 32px;
      // }
      /deep/ .ivu-col-span-8 {
        padding: 0 32px;
      }
      /deep/ .ivu-col-span-23 {
        padding-left: 32px;
      }
      /deep/ .ivu-upload-list-file {
        padding: 4px;
        color: #515a6e;
        border-radius: 4px;
        transition: background-color 0.2s ease-in-out;
        overflow: hidden;
        position: relative;
      }
      //上传文件样式
      /deep/ .ivu-upload-select {
        min-width: 110px;
        color: #919498;
        border: 1px solid #d9d9d9;
        line-height: 36px;
        height: 36px;
        border-radius: 2px;
        text-align: center;
        cursor: pointer;
        .ivu-icon-ios-cloud-upload-outline {
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    .btn-group {
      text-align: center;
      height: 64px;
      padding-top: 10px;
      position: fixed;
      right: 0;
      bottom: 0;
      background: #fff;
      width: 100%;
      box-shadow: 0px -1px 10px 0px #ebf0f5;
      button {
        margin: 5px;
        height: 32px;
        border-radius: 0;
      }
      .ivu-btn-primary {
        background: #3a7fff;
        border-color: #3a7fff;
      }
    }
  }
}
.assistant-tips {
  position: fixed;
  top: 35%;
  right: 10%;
  z-index: 1000;
  width: 342px;
  min-height: 300px;
  padding: 30px 10px;
  background: linear-gradient(135deg, #ffffff 0%, #f2f7fc 100%);
  box-shadow: 10px 4px 34px 0px rgba(216, 227, 252, 0.3), -3px 0px 20px 0px rgba(216, 227, 252, 0.1);
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
  border: 4px solid #ffffff;
  dt {
    color: #303132;
    font-size: 16px;
    padding: 0 20px;
  }
  dd {
    padding: 0 20px;
  }
  .remind-message {
    font-size: 12px;
    color: #303132;
    margin: 20px 0;
    max-height: 300px;
    overflow: hidden;
    overflow-y: auto;
  }
  .customer-service {
    width: 272px;
    height: 77px;
    position: absolute;
    bottom: -30px;
    right: -34px;
    background: url('./../../assets/images/common/customerService.png') no-repeat;
    background-size: cover;
  }
  .customer-service-txt {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin: 26px 0 0 13px;
    line-height: 18px;
    span {
      color: #3a7fff;
      cursor: pointer;
    }
  }
  .drag-close-icon {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    color: #666;
    cursor: pointer;
  }
}
</style>
