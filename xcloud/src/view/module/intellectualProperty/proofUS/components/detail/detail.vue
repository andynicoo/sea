<template>
  <div>
    <h2 class="title">使用证据详情</h2>
    <div class="scroll-container">
      <div>
        <!-- 驳回原因 -->
        <div class="details-box" v-if="useVoucherRejectReason">
          <div class="box-title">使用证据驳回原因</div>
          <div class="box-bottom">
            <el-row>
              <el-col>
                <p>
                  <span class="left-item">驳回原因：</span>
                  <span class="right-item">{{ useVoucherRejectReason }}</span>
                </p>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 商标信息 -->
        <div class="details-box">
          <div class="box-title">商标信息</div>
          <div class="box-bottom">
            <el-row>
              <el-col :span="12">
                <p>
                  <span class="left-item">商标类型：</span>
                  <span class="right-item">
                    {{ formInfo.trademarkType == 1 ? '纯文字' : formInfo.trademarkType == 2 ? '纯黑白图形' : formInfo.trademarkType == 3 ? '纯彩色图形' : formInfo.trademarkType == 4 ? '文字+黑白图形' : formInfo.trademarkType == 5 ? '文字+彩色图形' : '' }}
                  </span>
                </p>
              </el-col>
              <el-col :span="12" v-if="formInfo.trademarkType == 1 || formInfo.trademarkType == 4 || formInfo.trademarkType == 5">
                <p>
                  <span class="left-item">商标名称：</span>
                  <span class="right-item" v-html="formInfo.trademarkNameEn"></span>
                </p>
              </el-col>
              <el-col :span="12" v-if="formInfo.trademarkType == 2 || formInfo.trademarkType == 3 || formInfo.trademarkType == 4 || formInfo.trademarkType == 5">
                <p>
                  <span class="left-item">图形商标LOGO：</span>
                  <!-- {{formInfo.trademarkLogo}} -->
                  <span class="right-item">
                    <a :href="aa" target="_blank" style="color: #1890ff" v-for="(aa, cc) in JSON.parse(formInfo.trademarkLogo)" :key="cc"> <img src="@/assets/images/infoDetail/bainji-blue.svg" alt="" />图形商标LOGO</a>
                  </span>
                </p>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 商品或服务分类信息 -->
        <div class="details-box">
          <div class="box-title">商品或服务分类信息</div>
          <div class="box-bottom" v-for="(categoryItem, categoryIndex) in formInfo.trademarkCategory" :key="categoryIndex">
            <p>
              <span class="left-item">商标分类：</span>
              <span class="right-item">{{ categoryItem.category1Num }}&nbsp;{{ categoryItem.category1Name }}</span>
            </p>
            <p style="margin-top: 10px">
              <span class="left-item">商标小类名称：</span>
            </p>
            <div class="info-table">
              <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
                <tr class="header">
                  <th style="width: 68px">序号</th>
                  <th style="width: 206px">商标小类（中文）</th>
                  <th style="width: 428px">商标小类（英文）</th>
                  <th style="width: 166px">指定关键词</th>
                </tr>
                <tr v-for="(item, index) in categoryItem.listTrademarkCategory2" :key="index">
                  <td style="width: 68px">{{ index + 1 }}</td>
                  <td style="width: 206px">{{ item.category2Name }}</td>
                  <td style="width: 428px">{{ item.category2NameEn }}</td>
                  <td style="width: 166px">
                    <span v-if="item.keyword">{{ item.keyword[0] }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 官方翻译内容 -->
      <div class="details-box" v-if="evidenceType == 2">
        <div class="box-title">官方翻译内容</div>
        <div class="box-bottom">
          <p>{{ detailInfo.trademarkOrderServiceInfoVO.interpretFileContent }}</p>
        </div>
      </div>
      <!-- 客户选择处理方案信息 -->
      <div class="details-box" v-if="evidenceType == 2">
        <div class="box-title">客户选择处理方案信息</div>
        <div class="box-bottom">
          <p>{{ replyStr }}</p>
        </div>
      </div>

      <!-- 官方信息 -->
      <div class="details-box" v-if="evidenceType == 2">
        <div class="box-title">官文信息</div>
        <div class="box-bottom">
          <p class="mb-10">官方原文信息:</p>
          <p class="mb-10" v-if="detailInfo.trademarkOrderServiceInfoVO.fileUrl">
            <a :href="replaceHttps(detailInfo.trademarkOrderServiceInfoVO.fileUrl)" target="_blank" style="color: #1890ff"> <img src="@/assets/images/infoDetail/bainji-blue.svg" alt="" />{{ initFileNameFunc(detailInfo.trademarkOrderServiceInfoVO.fileUrl) }} </a>
          </p>
          <p class="mb-10">审查意见翻译文件:</p>
          <div v-if="setHlepDocument.length > 0">
            <el-row v-for="(item, index) in setHlepDocument" :key="index">
              <a :href="replaceHttps(item.fileUrl)" target="_blank" style="color: #1890ff"> <img src="@/assets/images/infoDetail/bainji-blue.svg" alt="" />{{ item.oldFileName }} </a>
            </el-row>
          </div>

          <!-- <p class="mb-10" v-if="detailInfo.trademarkOrderServiceInfoVO.interpretFileUrl">
            <a :href="replaceHttps(JSON.parse(detailInfo.trademarkOrderServiceInfoVO.interpretFileUrl)[0].fileUrl)" target="_blank" style="color:#1890ff;">
              <img src="@/assets/images/infoDetail/bainji-blue.svg" alt="">{{initFileNameFunc(JSON.parse(detailInfo.trademarkOrderServiceInfoVO.interpretFileUrl)[0].fileUrl)}}
            </a>
          </p> -->
        </div>
      </div>

      <!-- 客户修正后选择保留的小类信息 -->
      <div class="details-box" v-if="evidenceType == 2">
        <div class="box-title">客户修正后选择保留的小类信息</div>
        <div class="box-bottom" v-for="(trademarkCategoryItem, trademarkCategoryIndex) in trademarkCategoryCorrection" :key="trademarkCategoryIndex">
          <p>
            <span class="left-item">商标分类：</span>
            <span class="right-item">{{ trademarkCategoryItem.category1Num }}&nbsp;{{ trademarkCategoryItem.category1Name }}</span>
          </p>
          <p style="margin-top: 10px">
            <span class="left-item">商标小类名称：</span>
          </p>
          <div class="info-table">
            <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
              <tr class="header">
                <th style="width: 68px">序号</th>
                <th style="width: 206px">商标小类（中文）</th>
                <th style="width: 428px">商标小类（英文）</th>
                <th style="width: 166px">指定关键词</th>
              </tr>
              <tr v-for="(item, index) in trademarkCategoryItem.listTrademarkCategory2" :key="index">
                <td style="width: 68px">{{ index + 1 }}</td>
                <td style="width: 206px">{{ item.category2Name }}</td>
                <td style="width: 428px">{{ item.category2NameEn }}</td>
                <td style="width: 166px">
                  <span v-if="item.keyword">{{ item.keyword[0] }}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- 驳回原因 -->
      <div class="details-box" v-if="evidenceType == 2">
        <div class="box-title">驳回原因</div>
        <div class="box-bottom">
          <p>{{ detailInfo.trademarkOrderServiceInfoVO.rejectReason }}</p>
        </div>
      </div>

      <!-- 商标使用证据 -->
      <div style="margin-top: 12px">
        <p class="title">商标使用证据</p>
        <el-form :model="formInfo" label-position="top" :rules="formInfoRules" ref="formInfoRef">
          <!-- step1 -->
          <div class="step1-box">
            <div class="form-item">
              <el-form-item label="首次使用日期" prop="firstUseDate">
                <el-date-picker :picker-options="pickerOptions" type="date" :disabled="!isEdit" v-model="formInfo.firstUseDate" placeholder="年/月/日格式，示例：2020/01/01" value-format="yyyy-MM-dd" clearable style="width: 400px"></el-date-picker>
                <!-- tips -->
                <div class="first-tip">
                  1. 两个日期可以相同，
                  <span class="orange">建议填写在亚马逊或其他电商平台上上架产品的日期</span>
                  <br />
                  2. “首次在商业上使用的日期”
                  <span class="orange">必须是产品上架日期或者首次销售的日期</span>
                  <br />
                  3. 首次使用日期≤首次在商业上使用的日期
                </div>
              </el-form-item>
              <el-form-item label="首次在商业上使用的日期" prop="firstBusinessUseDate">
                <el-date-picker :picker-options="pickerOptions" type="date" :disabled="!isEdit" v-model="formInfo.firstBusinessUseDate" placeholder="年/月/日格式，示例：2020/01/01" value-format="yyyy-MM-dd" clearable style="width: 400px"></el-date-picker>
              </el-form-item>
              <el-form-item label="销售链接" class="width100 red-tip from" style="width: 100%">
                <div class="marketHref-list" v-for="(item, index) in formInfo.marketHref" :key="index">
                  <el-input v-model="item.marketHref" :disabled="!isEdit" placeholder="示例：http://xxx 或 https://xxx" :maxlength="300" clearable style="width: 400px"></el-input>
                  <el-select placeholder="请选择商标小类" v-model="item.category2NameEn" clearable filterable :disabled="!isEdit" @change="changeHrefCategory(item, index)" style="margin-left: 10px; margin-right: 10px; width: 260px">
                    <el-option v-for="(v, i) in checkTwoClassifyList" :key="i" :value="v.category2NameEn"> {{ v.category2Name }}-{{ v.category2NameEn }} </el-option>
                  </el-select>
                  <span v-if="isEdit">
                    <el-button v-if="index == formInfo.marketHref.length - 1" type="success" size="mini" icon="el-icon-plus" circle @click="handleAddHref"></el-button>
                    <el-button v-if="formInfo.marketHref.length > 1" type="danger" size="mini" icon="el-icon-minus" circle @click="handleRemoveHref(index)"></el-button>
                  </span>
                </div>
                <p class="gary-tip">销售链接内的商品需与使用证据的商品资料一致</p>
              </el-form-item>
            </div>
            <el-select style="width: 400px; margin: 10px 0" :placeholder="'请选择商标小类'" :disabled="!isEdit" filterable v-model="category2NameEn" :key="xiaoshou" @on-change="changeHrefClass($event, 0)">
              <el-option v-for="(v, i) in checkTwoClassifyList" :key="i" :value="v.category2NameEn">
                {{ v.category2NameEn }}
              </el-option>
            </el-select>
            <div class="proof-box form-item">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="上传产品图" prop="useProductImg">
                    <el-upload
                      drag
                      class="upload-proof"
                      :class="{ 'upload-disabled': !isEdit }"
                      :action="workOrderFileName"
                      ref="useProductImg"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'useProductImg');
                        }
                      "
                      :before-upload="
                        (file) => {
                          beforeUploadHandler2(file, 'useProductImg');
                          return false;
                        }
                      "
                      :show-file-list="false"
                      :disabled="!isEdit"
                      accept="jpg,jpeg,png,gif,zip,pdf"
                    >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                      </div>
                    </el-upload>
                    <div class="evidence-box" v-if="formInfo.useProductImg && formInfo.useProductImg.length > 0">
                      <div v-for="(item, index) in formInfo.useProductImg" :key="index">
                        <p>
                          <a :href="item.fileUrl" target="_blank">
                            <img src="@/assets/images/infoDetail/bianji.png" alt="" />
                            {{ item.fileName }}
                          </a>
                        </p>
                        <img src="@/assets/images/infoDetail/del.png" class="del-img" v-if="isEdit" @click="removeHandler(index, 'useProductImg')" alt="" />
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="上传订单详情截图" prop="useEvidence">
                    <el-upload
                      drag
                      class="upload-proof"
                      :class="{ 'upload-disabled': !isEdit }"
                      ref="useEvidence"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'useEvidence');
                        }
                      "
                      :before-upload="
                        (file) => {
                          beforeUploadHandler2(file, 'useEvidence');
                          return false;
                        }
                      "
                      :action="workOrderFileName"
                      :show-file-list="false"
                      :disabled="!isEdit"
                      accept="jpg,jpeg,png,gif,zip,pdf"
                    >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                      </div>
                    </el-upload>
                    <div class="evidence-box">
                      <div v-for="(item, index) in formInfo.useEvidence" :key="index">
                        <p>
                          <a :href="item.fileUrl" target="_blank">
                            <img src="@/assets/images/infoDetail/bianji.png" alt="" />
                            {{ item.fileName }}
                          </a>
                        </p>
                        <img src="@/assets/images/infoDetail/del.png" class="del-img" v-if="isEdit" @click="removeHandler(index, 'useEvidence')" alt="" />
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="line"></div>
            <div style="text-align: center" v-if="showBottomBtn">
              <el-button :disabled="isCancel" @click="handleSave">仅保存不提交</el-button>
              <el-button :disabled="isCancel" @click="handleSubmit" type="primary">确认并提交</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { submitEvidencelistApi, evidenceDetailApi } from '@/api/newApi/proffus/proffus.js';
import { upload2 } from '@/api/newApi/intellectualProperty/classify';
export default {
  props: {
    serviceId: String,
    nodeCode: String,
    evidenceType: String,
    serviceProgress: [Number, String],
    workflowColumns: Array,
    isCancel: Boolean,
    detailInfo: Object,
    useVoucherRejectReason: String,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      // 是否可以编辑
      isEdit: false,

      // 详情信息<style lang="less"></style>
      formInfo: {
        trademarkType: '', // 商标类型
        trademarkNameEn: '', // 商标名称
        trademarkLogo: '', //商标LOGO
        trademarkCategory: [], // 商标分类
        firstUseDate: '', // 首次使用日期
        firstBusinessUseDate: '', // 首次在商业上使用的日期
        marketHref: [], // 销售链接列表
        useProductImg: [], // 上传产品图列表
        useEvidence: [], // 上传订单详情截图
      },
      // 校验
      formInfoRules: {
        firstUseDate: [{ required: true, message: '请选择首次使用日期', trigger: 'change' }],
        firstBusinessUseDate: [{ required: true, message: '请选择首次在商业上使用日期', trigger: 'change' }],
        marketHref: [{ required: true, message: '请填写销售链接', trigger: 'change' }],
        useProductImg: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value || value.length == 0) {
                callback(new Error('请上传产品图'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
      },

      //商标分类
      checkTwoClassifyList: [],
      xiaoshou: true,
      category2NameEn: '',
      marketHrefList: [],
      replyStr: '',
      trademarkCategoryCorrection: [],
      supplementaryEvidence: null, //补正回显数据
    };
  },
  computed: {
    // 底部按钮，只有在 NODE0039 状态下都会显示
    showBottomBtn() {
      if (this.nodeCode == 'NODE0039') {
        return true;
      } else {
        return false;
      }
    },
    setHlepDocument() {
      if (this.detailInfo.trademarkOrderServiceInfoVO.interpretFileUrl) {
        const val = JSON.parse(this.detailInfo.trademarkOrderServiceInfoVO.interpretFileUrl);
        return val.length > 0 ? val : [];
      } else {
        return [];
      }
    },
  },
  created() {
    // 设置是否可以编辑，只有在待录入下可以主动编辑， 驳回后需要点击编辑才可以

    if (this.nodeCode == 'NODE0039') {
      this.isEdit = true;
    }
    // console.log('this.nodeCode', this.nodeCode);
    this.renderDetail();
  },
  methods: {
    async getList() {
      let {
        code,
        data: { trademarkOrderServiceInfoVO },
      } = await evidenceDetailApi({
        serviceId: this.$route.query.serviceId,
        nodeCode: this.$route.query.nodeCode,
      });
      if (code == 0 && trademarkOrderServiceInfoVO.evidenceType == 2) {
        this.setSupplementaryEvidenceData(trademarkOrderServiceInfoVO);
      }
    },
    escape2Html(str) {
      if (str == '' || str == undefined) {
        return '';
      } else {
        var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
          return arrEntities[t];
        });
      }
    },

    /**
     * 查询详情
     */
    renderDetail() {
      this.setDetailFields(this.workflowColumns);

      if (this.detailInfo.trademarkOrderServiceInfoVO.plan && this.detailInfo.trademarkOrderServiceInfoVO.plan.planInfo) {
        this.replyStr = (JSON.parse(this.detailInfo.trademarkOrderServiceInfoVO.plan.planInfo) || {}).replyStr;
      }
      if (this.detailInfo.trademarkOrderServiceInfoVO.trademarkCategoryCorrection) {
        this.trademarkCategoryCorrection = JSON.parse(this.detailInfo.trademarkOrderServiceInfoVO.trademarkCategoryCorrection);
      }
    },

    setTrademarklogo(data) {
      let logo = JSON.parse(data);
      // console.log(logo);
      let bol = Array.isArray(logo);
      if (!bol) {
        //logo只能上传一个
        return new Array(logo);
      } else {
        return logo;
      }
      // else{
      //   return
      // }
      // if (!bol) this.formInfo.trademarkLogo = new Array.push(logo) //转数组
    },

    /** 补充证据数据 */
    setSupplementaryEvidenceData(trademarkOrderServiceInfoVO) {
      let { firstUseDate, firstBusinessUseDate, marketHref, useEvidence, useProductImg } = trademarkOrderServiceInfoVO;
      // firstUseDate 首次使用日期
      // firstBusinessUseDate 首次在商业上使用的日期
      // marketHref 销售链接
      // useEvidence 订单图片
      // useProductImg 产品图片

      this.formInfo.useProductImg = useProductImg != '' ? JSON.parse(useProductImg) : [];
      this.formInfo.useEvidence = useEvidence != '' ? JSON.parse(useEvidence) : [];
      this.formInfo.marketHref = marketHref != '' ? JSON.parse(marketHref) : [{ marketHref: '' }];
      this.formInfo.firstBusinessUseDate = firstBusinessUseDate;
      this.formInfo.firstUseDate = firstUseDate;
    },
    /**
     * 设置详情字段
     */
    setDetailFields(moduleList) {
      if (!moduleList || moduleList.length == 0) return;
      // 通过key，获得value值
      let getValue = function (key) {
        let keyValue;
        moduleList.forEach((v) => {
          v.columns &&
            v.columns.forEach((vv) => {
              if (vv.keyName == key) {
                keyValue = JSON.stringify(vv.keyNameValue) == '{}' ? '' : vv.keyNameValue;
              }
            });
        });
        return keyValue;
      };
      // 设置表单的值
      this.formInfo.trademarkType = getValue('trademarkType'); // 商标类型
      if (getValue('trademarkNameEn')) this.formInfo.trademarkNameEn = getValue('trademarkNameEn'); // 商标名称
      if (getValue('trademarkLogo')) {
        this.formInfo.trademarkLogo = JSON.stringify(this.setTrademarklogo(getValue('trademarkLogo')));
      }

      if (getValue('trademarkCategory')) {
        this.formInfo.trademarkCategory = JSON.parse(getValue('trademarkCategory')); // 商标分类
        // 商标分类
        this.checkTwoClassifyList = this.formInfo.trademarkCategory[0].listTrademarkCategory2;
      }

      this.formInfo.firstUseDate = getValue('firstUseDate'); // 首次使用日期
      this.formInfo.firstBusinessUseDate = getValue('firstBusinessUseDate'); // 首次在商业上使用的日期
      // 处理 销售链接列表
      if (getValue('marketHref') != '') {
        this.formInfo.marketHref;
        let hrefList = JSON.parse(getValue('marketHref')) || [{ marketHref: '' }]; // 销售链接列表，默认有一个
        if (hrefList.length > 0) {
          this.formInfo.marketHref = [...hrefList];
        }
      } else {
        this.formInfo.marketHref = [{ marketHref: '' }];
      }
      // 处理 产品图片列表
      if (getValue('useProductImg') != '') {
        this.formInfo.useProductImg = JSON.parse(getValue('useProductImg'));
      }
      // 处理 上传订单详情截图
      if (getValue('useEvidence') != '') {
        this.formInfo.useEvidence = JSON.parse(getValue('useEvidence'));
      }

      if (this.detailInfo.trademarkOrderServiceInfoVO.evidenceType == 2) this.getList();
    },

    /**
     * 新增和删除链接
     */
    handleAddHref() {
      this.formInfo.marketHref.push({
        marketHref: '',
      });
    },
    handleRemoveHref(index) {
      this.formInfo.marketHref.splice(index, 1);
    },
    // 改变链接中的商品分类
    changeHrefCategory(item, index) {
      let category = this.checkTwoClassifyList.filter((v) => v.category2NameEn == item.category2NameEn)[0];
      item.category2Name = category.category2Name;
    },
    changeHrefClass(data, ins) {
      this.checkTwoClassifyList.map((v, i) => {
        if (data == v.category2NameEn) {
          this.marketHrefList[ins].category2Name = v.category2Name;
        }
      });
    },
    initFileNameFunc(fileName) {
      if (!fileName) return '';
      let newStr = fileName.substring(fileName.lastIndexOf('/') + 1);
      return newStr;
    },
    // 文件上传
    beforeUploadHandler2(file, type) {
      if (this.category2NameEn === '' || this.category2NameEn === undefined) {
        this.$Notice.warning({
          title: type === 'useProductImg' ? '请先选择商标小类，再上传产品图' : '请先选择商标小类，再上传订单详情截图',
        });
        return false;
      }

      let len = this.formInfo[type].length;
      const check = len < 30;
      if (!check) {
        this.$Notice.warning({
          title: '最多只可上传30个文件',
        });
        return false;
      }

      let suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (suffix !== 'jpg' && suffix !== 'pdf') {
        this.$Notice.warning({
          title: '文件格式错误',
          desc: '文件格式不正确, 请上传jpg,pdf格式的文件',
        });
        return false;
      }

      let reg = /\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
      let newName = this.category2NameEn.replace(reg, '_');

      let fileNameNo = 0;

      const uploadList = this.formInfo[type];

      uploadList.map((item) => {
        let itemName = item.fileName;
        let itemSuffix = itemName.substring(itemName.lastIndexOf('.') + 1);

        if (itemSuffix === suffix && (itemName.slice(0, itemName.length - 4) === newName || itemName.slice(0, itemName.length - 7) === newName || itemName.slice(0, itemName.length - 8) === newName)) fileNameNo++;
      });

      newName = fileNameNo === 0 ? newName : `${newName}(${fileNameNo})`;

      const copyFile = new File([file], `${newName}.${suffix}`);
      this.uploadFile(copyFile, type);
      return false;
    },
    uploadFile(file, type) {
      const formdata = new FormData();
      formdata.append('file', file);
      upload2(formdata)
        .then((res) => {
          // console.log(res);
          let obj = {
            fileName: res.data.origFileName,
            fileUrl: res.data.fileUrl,
          };
          this.formInfo[type].push(obj);
          // this.category2NameEn = "";
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '上传文件失败',
          });
        });
    },

    /**
     * 上传成功
     */
    successHandler(res, file, fileList, keyName) {
      this.formInfo[keyName].push({
        uid: file.uid,
        name: res.data.origFileName,
        url: res.data.fileUrl,
      });
      // 上传产品图片，校验
      if (keyName == 'useProductImg') {
        this.$refs.formInfoRef.validateField('useProductImg');
      }
    },
    // 删除
    removeHandler(index, keyName) {
      this.formInfo[keyName].splice(index, 1);
    },

    /**
     * 保存
     */
    handleSave() {
      let data = this.parseSaveOrSubmitData('');
      submitEvidencelistApi(data).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
        }
      });
    },
    /**
     * 提交数据
     */
    handleSubmit() {
      this.$refs.formInfoRef.validate((valid) => {
        if (valid) {
          let data = this.parseSaveOrSubmitData(true);
          // 校验首次使用日期 需要小于 首次在商业上使用的日期
          if (new Date(data.firstUseDate) > new Date(data.firstBusinessUseDate)) {
            this.$message({
              type: 'warning',
              message: '首次使用日期小于首次在商业上使用的日期',
            });
            return;
          }
          submitEvidencelistApi(data).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '提交成功',
              });
              this.$emit('backPage');
            }
          });
        }
      });
    },
    /**
     * 解析保存或者提交的数据，同样适用于驳回
     * @param {String|Boolean} flag 普通保存传空字符串；提交传true；驳回传false；
     */
    parseSaveOrSubmitData(flag) {
      let jsonData = {};
      jsonData.firstUseDate = this.formInfo.firstUseDate;
      jsonData.firstBusinessUseDate = this.formInfo.firstBusinessUseDate;
      jsonData.marketHref = JSON.stringify(this.formInfo.marketHref);
      // 上传产品图片
      jsonData.useProductImg = JSON.stringify(this.formInfo.useProductImg);
      // 上传订单详情截图
      jsonData.useEvidence = JSON.stringify(this.formInfo.useEvidence);

      // 组装数据
      return {
        nodeCode: this.nodeCode,
        path: flag,
        serviceId: this.serviceId,
        json: jsonData,
      };
    },
  },
};
</script>
<style lang="less" scoped>
h2.title {
  font-size: 14px;
  padding: 15px 0 10px 28px;
  border-bottom: 1px solid #ebeef5;
  position: relative;
  &::after {
    position: absolute;
    content: '';
    left: 4px;
    top: 20px;
    width: 2px;
    height: 14px;
    background-color: #1890ff;
    border-radius: 1px;
  }
}
.scroll-container {
  padding: 26px 0;
  overflow-y: scroll;
  height: calc(100vh - 270px);
}
.step-box {
  margin-top: 12px;
  text-align: center;
}
.step1-box {
  .example-box {
    margin-left: 10px;
    display: inline-block;
    width: 156px;
    height: 156px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #cfcfcf;
    vertical-align: top;
    padding: 16px 10px;
    text-align: center;
    .example-img {
      width: 85px;
      height: 52px;
      background: #d8d8d8;
    }
    p {
      margin-top: 6px;
      text-align: center;
      color: #00a3ff;
      font-size: 12px;
      cursor: pointer;
      img {
        vertical-align: middle;
        margin-left: 4px;
      }
    }
  }
  .upload-proof {
    margin-top: 10px;
  }
  .first-tip {
    position: absolute;
    right: 0;
    top: 0;
    border: solid 1px #f9f5f3;
    padding: 10px;
    z-index: 1;
    background: #f9f5f3;
  }
  .tip-box {
    padding: 6px 8px;
    background-color: #eff9ff;
    font-size: 10px;
    font-family: PingFangSC;
    color: #00a3ff;
    line-height: 18px;
    margin-top: 6px;
    width: 364px;
  }
  .marketHref-list {
    margin-bottom: 8px;
    img {
      vertical-align: middle;
      margin-left: 6px;
      cursor: pointer;
    }
  }
  .proof-box {
    position: relative;
    .tip1 {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
      margin-top: 10px;
    }
    .tip2 {
      height: 128px;
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      margin-top: 24px;
      padding: 12px 0;
      .right-box {
        margin-left: 24px;
      }
      .right-tip {
        display: inline-block;
        width: 355px;
        margin-left: 2px;
        font-size: 14px;
        font-family: PingFangSC;
        color: #999999;
        line-height: 22px;
      }
      img {
        vertical-align: top;
        margin-top: 6px;
      }
      .tip2-example-box {
        cursor: pointer;
        padding: 9px 20px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #00a3ff;
        max-width: 472px;
        img {
          vertical-align: bottom;
          margin: 0 6px;
        }
      }
    }
  }
  .evidence-box {
    width: 398px;
    p {
      margin-top: 8px;
      position: relative;
      width: 366px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      img {
        vertical-align: middle;
      }
      a {
        color: #00a3ff;
      }
    }
    .del-img {
      text-align: right;
      cursor: pointer;
      margin-left: 8px;
    }
  }
}
.bread-logo-box {
  display: inline-block;
  width: 156px;
  height: 156px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .hover-box {
    width: 100%;
    height: 100%;
    background: #333333;
    opacity: 0.65;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    padding-top: 38px;
    font-size: 14px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #ffffff;
    display: none;
    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }
  }
}
.show-change:hover .hover-box {
  display: block;
}
.info-title {
  margin: 24px 0 24px 0;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  .info-subTitle {
    font-size: 14px;
    font-family: PingFangSC;
    color: #999999;
  }
}
.gary-tip {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 22px;
  width: 398px;
  margin-top: 4px;
  a {
    color: #ff6600;
  }
}
.form-item {
  margin-bottom: 24px;
  .item-label {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-right: 16px;
    span {
      font-size: 14px;
      font-family: PingFangSC;
      color: #999999;
    }
  }
  .red-tip::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ed4014;
  }
  .item-upload {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #00a3ff;
    cursor: pointer;
    img {
      vertical-align: middle;
      margin-right: 2px;
    }
  }
  .tip {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff6600;
    margin-top: 6px;
  }
  .classify-box {
    img {
      vertical-align: sub;
    }
    span {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #00a3ff;
      margin-left: 2px;
    }
  }
}
.line {
  height: 1px;
  background: #999999;
  opacity: 0.2;
  width: 100%;
  margin: 32px 0;
}
.next-button {
  text-align: center;
  button {
    padding: 5px 16px;
    background: #00a3ff;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    border: none;
    cursor: pointer;
    margin-right: 8px;
  }
  .white-btn {
    background-color: #fff;
    border: 1px solid #00a3ff;
    color: #00a3ff;
  }
}
.classify-modal {
  .classify-header {
    .title {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      span {
        font-size: 14px;
        font-family: PingFangSC;
        color: #ff6600;
        margin-left: 12px;
      }
    }
    .tip {
      margin-top: 6px;
      font-size: 12px;
      font-family: PingFangSC;
      color: #999999;
      line-height: 18px;
      font-weight: 400;
    }
  }
  .classify-footer {
    text-align: right;
    padding-bottom: 32px;
    button {
      width: 92px;
      height: 38px;
      background-color: #00a3ff;
      color: #fff;
    }
  }
}
.subclass-table {
  margin-top: 6px;
  max-width: 808px;
  max-height: 200px;
  overflow-y: scroll;
}
.classify-add-btn {
  width: 76px;
  height: 32px;
  background: #00a3ff;
  border-radius: 2px;
  color: #fff;
}
.check-two-category {
  span {
    color: #00a3ff;
    font-size: 14px;
    margin-right: 8px;
    display: block;
    padding: 6px 8px;
    background: #eff9ff;
    margin-top: 10px;
    img {
      margin-left: 4px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}
.risk-box {
  margin-top: 24px;
  .tip-box {
    margin: 8px 0 0 0;
    width: 832px;
    .color333 {
      color: #333;
    }
  }
  .subclass-table {
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-top: 12px;
  }
}
.proof-example-modal {
  .examples {
    p {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    img {
      width: 270px;
      height: 164px;
      margin-top: 14px;
      margin-right: 8px;
    }
  }
  .modal-tip {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    padding-bottom: 30px;
    margin-top: 10px;
    img {
      vertical-align: middle;
      margin-right: 6px;
    }
  }
}
.search-subclass-btn {
  width: 76px;
  height: 32px;
  background: #00a3ff;
  border-radius: 2px;
  color: #fff;
}
.tip-content {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-left: 38px;
}

.proof-example-modal ::v-deep .ivu-modal {
  width: 610px !important;
}
::v-deep .ivu-modal-body {
  padding: 24px;
}
.classify-modal ::v-deep .ivu-checkbox-group-item {
  margin-bottom: 18px;
}
.inline-box ::v-deep .ivu-form-item-content {
  display: inline-block;
  vertical-align: bottom;
  margin-left: 20px;
}
.width100 ::v-deep .ivu-form-item-content {
  width: 100%;
}
.width156 {
  width: 156px;
  margin-right: 12px;
  display: inline-block;
}
.width156 ::v-deep .ivu-form-item-content {
  width: 156px;
}
::v-deep .ivu-table-overflowX {
  overflow-x: hidden;
}
::v-deep .ivu-table-wrapper-with-border {
  border-bottom: auto;
}
::v-deep .ivu-table:before {
  height: 0;
}
::v-deep .ivu-table-border:after {
  width: 0;
}
.details-box {
  margin-bottom: 20px;
  border: 1px solid #eee;
  .box-title {
    padding: 8px 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    background-color: #fafafa;
    border-bottom: 1px solid #e9e9e9;
  }
  .box-bottom {
    padding: 16px 24px;
  }
  .left-item {
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
  .right-item {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 500;
    color: #666666;
    line-height: 22px;
    max-width: 75%;
    word-break: break-all;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: sub;
  }

  .evidence-box {
    display: inline-block;
    min-width: 320px;
    vertical-align: top;
    p {
      width: 366px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }
  .evidence {
    img {
      vertical-align: middle;
    }
    a {
      color: #666666;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
.info-table {
  margin-top: 6px;
  // width: 100%;
  font-size: 14px;
  border-collapse: collapse;
  border: 1px solid rgba(0, 0, 0, 0.2);
  td {
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 5px 12px;
    word-break: break-all;
  }
  .header {
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 400;
    color: #333333;
    th {
      padding: 8px 0;
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
<style lang="less">
.upload-proof.upload-disabled {
  .el-upload-dragger {
    background: #eee;
    opacity: 0.7;
    cursor: not-allowed;
    &:hover,
    &:focus,
    &:active {
      border: 1px dashed #d9d9d9;
    }
  }
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
