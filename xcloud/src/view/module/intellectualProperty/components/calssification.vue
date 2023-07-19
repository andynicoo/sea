<template>
  <div>
    <div class="tittleStyle">
      <div class="talkbubble">
        商标分类
        <div class="triangle"></div>
      </div>
    </div>
    <div class="category-box" v-for="(categoryItem, categoryIndex) in trademarkCategoryList" :key="categoryIndex">
      <div class="form-item">
        <p class="item-label red-tip from">商标分类</p>
        <el-input v-model="categoryItem.category1Name" :disabled="true" placeholder="添加商标分类" style="width: 398px; margin-right: 10px">
          <img src="http://file.itaxs.com/pro/20210922/357b06851e354651ab19ed470cca8cc1.svg" class="slot-img" @click="changeClassfiyFun(categoryIndex)" slot="suffix" v-if="categoryItem.category1Name == ''" />
          <img src="http://file.itaxs.com/dev/20211123/0175179106004b2590143682a20dfbe6.png" class="slot-img" v-else @click="changeClassfiyFun(categoryIndex)" slot="suffix" />
        </el-input>
      </div>

      <div class="form-item" v-if="existSubclass()">
        <div>
          <span class="item-label red-tip from">商标小类名称</span>
          <a class="subclass-tip"
            >联系我们的
            <a onclick='easemobim.bind({configId: "ccf5ac95-5a5d-42f3-9eae-2b984fc0d4f2"})'>客服人员</a>
          </a>
        </div>
        <Input v-model="categoryItem.searchtext" :disabled="isEditor" style="width: 398px" placeholder="输入的单词必须是有含义的" :maxlength="200"></Input>
        <el-button :disabled="isEditor" class="search-subclass-btn" type="primary" @click="searchSubclass(categoryIndex)">搜索</el-button>
        <div class="search-table" v-if="categoryItem.searchtext != '' && categoryItem.searchtext != undefined && categoryItem.isSearch">
          <Table
            border
            v-if="categoryItem.searchtext != '' && categoryItem.searchtext != undefined && categoryItem.isSearch"
            class="subclass-table"
            :data="categoryItem.resultData"
            :columns="subClassCloumns"
            @on-selection-change="selectData($event, categoryIndex)"
            @on-select-all-cancel="cancelData($event, categoryIndex)"
          >
          </Table>
          <img src="https://fdfs.itaxs.com/group1/M00/05/D1/rBLKNV_y1ayADmwlAAAGv_fYKHg584.svg" alt="" @click="categoryItem.isSearch = false" />
        </div>
        <div class="check-two-category" v-if="!isEditor">
          <span :style="{ color: item.isRepeat ? 'red' : '' }" v-for="(item, index) in categoryItem.listTrademarkCategory2" :key="index">
            {{ countryCode == 'CN' ? item.category2Name : item.category2NameEn }}
            <img src="http://file.itaxs.com/dev/20211123/8a9f7f16c14941468aac47dbb57420fb.png" class="del-img" @click="removeTowCategory(categoryIndex, index)" alt="" />
          </span>
        </div>
        <p class="gray-tip">小类信息由专员在官网进行排查，最终以官网信息为准.建议最佳是10-15个商标小类名称,最多20个</p>
        <div class="risk-box" v-if="riskClassifyList.length > 0 && countryCode == 'US'">
          <p class="item-label red-tip from risk-title">含有风险小类，需指定关键词</p>
          <div class="tip-box">
            <img src="@/assets/images/infoDetail/tip.svg" alt="" />
            <p><span class="color333">风险小类：</span>美国遵循国际尼斯分类，对其申请的商品/服务项目要求具体细化。例如：“计算机周边设备”该项商品在美国是<br />不能被接受，原因是范围太宽泛，需要进一步细化到“键盘、鼠标、扫描仪”等。</p>
            <p style="color: #ed7b2f; font-size: 14px; margin: 10px 0 10px 34px">风险小类被驳回机率较大，请慎重选择</p>
          </div>
          <Table border class="subclass-table" :data="riskClassifyList" :columns="riskClassCloumns"> </Table>
        </div>
      </div>
      <div class="form-item" v-else>
        <div>
          <span class="item-label red-tip from">商标小类名称</span>
          <a class="subclass-tip"
            >联系我们的
            <a onclick='easemobim.bind({configId: "ccf5ac95-5a5d-42f3-9eae-2b984fc0d4f2"})'>客服人员</a>
          </a>
        </div>
        <Input type="textarea" :disabled="isEditor" :rows="3" :autosize="{ minRows: 3, maxRows: 7 }" :placeholder="placeholder" v-model="trademarkCategoryList[categoryIndex].textareaubclass"> </Input>
        <p class="gray-tip">小类信息由专员在官网进行排查，最终以官网信息为准.建议最佳是10-15个商标小类名称,最多20个</p>
      </div>
      <div class="line"></div>
    </div>
    <div v-if="countryCode == 'US' && isNeedEvidence">
      <!-- 销售链接 -->
      <div class="form-item">
        <p class="item-label red-tip from" style="position: relative">
          销售链接
          <Poptip trigger="hover" placement="right-end" title="使用证据要求说明" style="position: absolute; top: 10px; left: 100px; color: #000">
            <Icon type="ios-help" class="icon-help" />
            <div class="api" slot="title">
              <p>销售链接要求说明</p>
            </div>
            <div class="api" slot="content">
              <div style="line-height: 1.8em">
                <p>1、在美国境内销售，币种为美元;</p>
                <p>2、可加入购物车，销售金额与市场价保持一致，上下浮动20%的范围比较合理;</p>
                <p>3、至少有一张产品图显示出商标名字;</p>
                <p>4、标题首位是商标名称或者品牌是商标名字;</p>
                <p>5、链接可以是亚马逊/eBay/Wish/阿里巴巴国际站等。</p>
              </div>
            </div>
          </Poptip>
        </p>
        <div class="marketHref-list" v-for="(item, index) in marketHrefList" :key="index">
          <el-input v-model="item.marketHref" :disabled="isEditor" placeholder="示例：http://或https://" :maxlength="300" style="width: 234px"></el-input>
          <el-select :disabled="isEditor" style="width: 170px; margin-left: 10px" placeholder="请选择商标小类" v-model="item.category2NameEn" filterable @change="changeHrefClass($event, index)">
            <el-option v-for="(v, i) in checkTwoClassifyList" :key="i" :label="v.category2NameEn" :value="v.category2NameEn"></el-option>
          </el-select>
          <img src="http://file.itaxs.com/dev/20211123/f698f3ca9b634f899ef7b11f878a7568.svg" alt="" v-if="index == marketHrefList.length - 1 && marketHrefList.length < 20" @click="addHref" />
          <img src="http://file.itaxs.com/dev/20211123/aa7d88e7df944296a3a68d042a42d11a.svg" alt="" @click="removeHref(index)" v-if="index == marketHrefList.length - 1 && marketHrefList.length > 1" />
        </div>
      </div>
      <!-- 使用证据-产品图和销售订单截图 -->
      <div style="position: relative">
        <p>上传使用证据</p>
        <Poptip trigger="hover" placement="right-end" title="使用证据要求说明" style="position: absolute; top: 10px; left: 96px; color: #000">
          <Icon type="ios-help" class="icon-help" />
          <div class="api" slot="title">
            <p>使用证据要求说明</p>
          </div>
          <div class="api" slot="content">
            <div style="line-height: 1.8em">
              <p>1、照片必须为 JPG 格式、每张图≤2MB; 照片清晰且无水印、产品完整且未使用过;</p>
              <p>2、照片不可经过 PS、美化等处理，产品要真正的实拍图，不要白底图片，不要拍到 其他杂物，也不要手拿着拍;</p>
              <p>3、照片请以小类英文名称命名，方便审核;</p>
              <p>4、商标LOGO 不能采用贴纸、金属贴标等方式，需要真实印，可采用丝印、镭射、激 光、雕刻;</p>
              <p>5、产品图上不能出现中文以及™、®标识。</p>
            </div>
          </div>
        </Poptip>
        <div class="tip2-example-box button-upload" @click="proofExampleModal = true">
          <img src="@/assets/images/infoDetail/searchIcon.png" alt="" />
          查看示例图
          <img src="@/assets/images/infoDetail/shangjiantou-you.png" alt="" />
        </div>
      </div>
      <Select :disabled="isEditor" style="width: 400px; margin: 10px 0" :placeholder="'请选择商标小类'" v-model="category2NameEn" :key="xiaoshou" @on-change="changeHrefClass($event, 0)">
        <Option v-for="(v, i) in checkTwoClassifyList" :key="i" :value="v.category2NameEn">
          {{ v.category2NameEn }}
        </Option>
      </Select>
      <div class="proof-box form-item">
        <Row>
          <Col :span="12">
            <span class="item-label red-tip from">上传产品图 </span>
            <Upload
              class="upload-proof"
              ref="uploadEvidence"
              :before-upload="
                (file) => {
                  beforeUploadHandler2(file, 'product');
                  return false;
                }
              "
              :on-format-error="formatErrorHandler"
              :on-success="
                (res, file, fileList) => {
                  successHandler(res, file, fileList, usrProductImgList);
                }
              "
              :action="workOrderFileName"
              :show-upload-list="false"
              :disabled="isEditor"
              :format="['jpg', 'pdf']"
            >
              <img src="@/assets/images/infoDetail/upload-proof.svg" alt="" />
              <p>点击或将文件拖拽到这里上传</p>
            </Upload>
            <div class="evidence-box" v-if="usrProductImgList.length > 0">
              <div v-for="(item, index) in usrProductImgList" :key="index">
                <p>
                  <a :href="item.fileUrl" target="_blank"> <img src="@/assets/images/infoDetail/bianji.png" alt="" /> {{ item.fileName }} </a>
                </p>
                <img src="@/assets/images/infoDetail/del.png" class="del-img" v-if="!isEditor" @click="removeHandler(index, usrProductImgList)" alt="" />
              </div>
            </div>
          </Col>
          <Col :span="12">
            <span class="item-label from">上传订单详情截图 </span>
            <Upload
              class="upload-proof"
              ref="uploadEvidence"
              :before-upload="
                (file) => {
                  beforeUploadHandler2(file, 'order');
                  return false;
                }
              "
              :on-format-error="formatErrorHandler"
              :on-success="
                (res, file, fileList) => {
                  successHandler(res, file, fileList, useEvidenceList);
                }
              "
              :action="workOrderFileName"
              :show-upload-list="false"
              :disabled="isEditor"
              :format="['jpg', 'pdf']"
            >
              <img src="@/assets/images/infoDetail/upload-proof.svg" alt="" />
              <p>点击或将文件拖拽到这里上传</p>
            </Upload>
            <div class="evidence-box" v-if="useEvidenceList.length > 0">
              <div v-for="(item, index) in useEvidenceList" :key="index">
                <p>
                  <a :href="item.fileUrl" target="_blank"> <img src="@/assets/images/infoDetail/bianji.png" alt="" /> {{ item.fileName }} </a>
                </p>
                <img src="@/assets/images/infoDetail/del.png" class="del-img" v-if="!isEditor" @click="removeHandler(index, useEvidenceList)" alt="" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <Modal v-model="classifyModal" class="classify-modal" footer-hide>
      <div class="classify-header" slot="header">
        <p class="title">
          添加商标分类
          <!-- <span>(您一共购买了一类，最多可选择一类）</span> -->
        </p>
        <div class="tip">提示：不确定要选择哪个分类？可尝试搜索竞争对手的商标，然后，查看它的商标详情中申请的分类。如果仍不确定要选择哪个分类，请咨询我们的客服人员。</div>
      </div>
      <CheckboxGroup @on-change="checkAllGroupChange" v-model="choiceClassify">
        <Checkbox :label="item.categoryNum" v-for="(item, index) in firstClassList" :key="index">{{ item.categoryNum < 10 ? '0' + item.categoryNum : item.categoryNum }}&nbsp;{{ item.categoryName }}</Checkbox>
      </CheckboxGroup>
      <div class="classify-footer">
        <Button @click="sureOneCategory">提交</Button>
      </div>
    </Modal>
    <Modal v-model="proofExampleModal" footer-hide title="示例图" class="proof-example-modal">
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
      <p class="modal-tip"><img src="@/assets/images/infoDetail/error-icon.png" alt="" />不符合原因：1、产品不完整 2、没有logo 3、含有中文 4、图片不清晰</p>
    </Modal>
  </div>
</template>
<script>
import { oneCategoryListAPI, subCategoryListAPI, upload2 } from '@/api/newApi/intellectualProperty/classify';
export default {
  props: ['countryCode', 'categoryCount', 'calssifyList', 'linkList', 'usrProductImgList', 'useEvidenceList', 'isNeedEvidence', 'servicesStatus'],
  inject: ['existSubclass'],
  data() {
    return {
      trademarkCategoryList: [],
      classifyModal: false,
      firstClassList: [],
      choiceClassify: [],
      isEditor: false,
      subClassCloumns: [
        {
          title: '商标小类（中文）',
          key: 'categoryName',
          // width: 318,
          align: 'center',
        },
        {
          title: '商标小类（英文）',
          key: 'categoryNameEn',
          // width: 432,
          align: 'center',
        },
        {
          title: '多选',
          width: '60px',
          type: 'selection',
          align: 'center',
          fixed: 'right',
        },
      ],

      marketHrefList: [
        {
          category2Name: '',
          category2NameEn: '',
          marketHref: '',
        },
      ],
      riskClassifyList: [],
      checkTwoClassifyList: [],
      placeholder: '多个小类,每个以英文分号分开。\n列子：Acids for etching enamels;Acrylate;Acetanil',
      riskClassCloumns: [
        {
          title: '风险小类',
          align: 'center',
          key: 'category2NameEn',
        },
        {
          title: '指定关键词',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.keyword[0],
                  placeholder: '请从风险小类{ }内指定一个关键词',
                  maxlength: 100,
                },
                on: {
                  input: (val) => {
                    this.riskClassifyList[params.row._index].keyword[0] = val;
                    this.checkTwoClassifyList.map((item) => {
                      if (item.category2Num == params.row.category2Num) {
                        item.keyword[0] = val;
                      }
                    });
                  },
                },
              }),
            ]);
          },
        },
      ],
      // 使用证据
      xiaoshou: true,
      category2NameEn: '',
      proofExampleModal: false,
    };
  },

  methods: {
    /**
     * 更具国家设置小类表单
     */
    setsubClassCloumns(code) {
      console.log('code', code);
      if (code === 'CN') {
        this.subClassCloumns.splice(1, 1);
        return;
      }
      let arr = [];
      if (code == 'JP') {
        arr = [
          {
            title: '商标小类（日文）',
            key: 'categoryNameJp',
            // width: 432,
            align: 'center',
          },
          {
            title: '类似群组',
            key: 'similarGroup',
            // width: 432,
            align: 'center',
          },
        ];
      } else if (code === 'KR') {
        arr = [
          {
            title: '商标小类（韩文）',
            key: 'categoryNameMore',
            // width: 432,
            align: 'center',
          },
        ];
      } else if (code === 'DE') {
        arr = [
          {
            title: '商标小类（德文）',
            key: 'categoryNameMore',
            // width: 432,
            align: 'center',
          },
        ];
      }
      arr.forEach((item, index) => this.subClassCloumns.splice(2 + index, 0, item));
    },
    getOneCategoryFun() {
      oneCategoryListAPI()
        .then((res) => {
          if (res.code == 0) {
            this.firstClassList = res.data;
          }
        })
        .finally(() => {
          this.initCategory(this.calssifyList);
          // console.log('isNeedEvidence', this.isNeedEvidence)
        });
    },
    initCategory(val) {
      // debugger
      let that = this;
      let obj = {
        category1Name: '',
        category1NameEn: '',
        category1Num: '',
        category1Price: 0,
        searchtext: '',
        listTrademarkCategory2: [],
      };
      this.riskClassifyList = [];
      // debugger
      for (let index = 0; index < this.categoryCount; index++) {
        that.trademarkCategoryList.push(obj);
      }
      // console.log(this.calssifyList);
      if (val.length > 0) {
        this.trademarkCategoryList.map((item, index) => {
          val.map((v, i) => {
            if (i == index) {
              this.trademarkCategoryList[index] = { ...v };
              v.listTrademarkCategory2.map((vv, ii) => {
                if (vv.category2NameEn.indexOf('{') != -1) {
                  // console.log('vv',vv);
                  let class2Obj = {
                    category2Name: vv.category2Name,
                    category2NameEn: vv.category2NameEn,
                    category2Num: vv.category2Num,

                    parentCategoryNum: vv.parentCategoryNum,
                    keyword: vv.keyword || [''],
                  };
                  if (this.countryCode == 'JP') {
                    class2Obj.categoryNameJp = vv.categoryNameJp;
                    class2Obj.similarGroup = vv.similarGroup;
                  }
                  this.riskClassifyList.push(class2Obj);
                }
              });
            }
          });
        });
        this.checkTwoClassifyList = this.trademarkCategoryList[0].listTrademarkCategory2;
      }
      if (JSON.stringify(this.linkList) != '{}' && this.linkList != '' && this.linkList != undefined) {
        this.marketHrefList = JSON.parse(this.linkList);
      }
      // console.log('trademarkCategoryList', this.trademarkCategoryList);
      // console.log('marketHrefList',this.marketHrefList);
    },
    changeClassfiyFun(i) {
      this.choiceClassify = [];
      this.classifyModal = true;
      this.changeIndex = i;
      this.trademarkCategoryList.map((item, index) => {
        if (index == i) {
          if (item.category1Num != '') {
            let categoryNum = item.category1Num;
            this.choiceClassify.push(categoryNum);
          } else {
            this.choiceClassify = [];
          }
        }
      });
    },
    // 找出数组中重复的值并在末尾插入
    filterArrayRepeatPush(arr = []) {
      if (arr.length) {
        let onlyArr = [];
        let repeatArr = [];
        for (let index = 0; index < arr.length; index++) {
          let indexArr = [];
          arr.forEach((child, childIndex) => {
            if (child['categoryNameJp'] && child['categoryNameJp'] === arr[index]['categoryNameJp']) {
              indexArr.push(childIndex);
            }
          });
          if (indexArr.length > 1) {
            arr[index]['isRepeat'] = true;
            repeatArr.push(arr[index]);
          } else {
            arr[index]['isRepeat'] = false;
            onlyArr.push(arr[index]);
          }
        }
        return onlyArr.concat(repeatArr);
      } else {
        return [];
      }
    },
    selectData(data, index) {
      let oldArr = [...this.trademarkCategoryList[index].listTrademarkCategory2];
      let obj = { ...this.trademarkCategoryList[index] };
      if (oldArr.length !== 0) {
        if (this.countryCode === 'JP') {
          obj.listTrademarkCategory2 = this.filterArrayRepeatPush(this.MergeArray(oldArr, data));
        } else {
          obj.listTrademarkCategory2 = this.MergeArray(oldArr, data);
        }
        this.$set(this.trademarkCategoryList, index, obj);
      } else {
        let cateArr = [];
        data.map((item) => {
          let obj = {
            category2Name: item.categoryName,
            category2NameEn: item.categoryNameEn,
            category2Num: item.categoryNum,
            categoryNameMore: item.categoryNameMore || '',
            keyword: [''],
            parentCategoryNum: item.parentCategoryNum,
          };
          if (this.countryCode == 'JP') {
            obj.categoryNameJp = item.categoryNameJp;
            obj.similarGroup = item.similarGroup;
          }
          cateArr.push(obj);
        });
        if (this.countryCode === 'JP') {
          obj.listTrademarkCategory2 = this.filterArrayRepeatPush(cateArr);
        } else {
          obj.listTrademarkCategory2 = cateArr;
        }
        this.$set(this.trademarkCategoryList, index, obj);
      }

      let isBreak = false,
        isRisk = 0;
      this.riskClassifyList = [];
      this.trademarkCategoryList[index].listTrademarkCategory2.map((item, index) => {
        if (item.category2NameEn.indexOf('{') != -1) {
          isRisk++;
          if (this.riskClassifyList.length < 2) {
            let obj = {
              category2Name: item.category2Name,
              category2NameEn: item.category2NameEn,
              category2Num: item.category2Num,
              categoryNameMore: item.categoryNameMore || '',
              parentCategoryNum: item.parentCategoryNum,
              keyword: [''],
            };
            if (this.countryCode == 'JP') {
              obj.categoryNameJp = item.categoryNameJp;
              obj.similarGroup = item.similarGroup;
            }
            this.riskClassifyList.push(obj);
          } else {
            isBreak = true;
          }
        }
      });
      if (isBreak && isRisk > 2) {
        this.$Message.info('风险小类最多只能选择2个');
        return;
      }
      if (this.trademarkCategoryList[index].listTrademarkCategory2.length > 20) {
        this.$Message.info('商标小类最多只能选择20个');
        obj.listTrademarkCategory2 = obj.listTrademarkCategory2.slice(0, 20);
        this.$set(this.trademarkCategoryList, index, obj);
      }
      this.checkTwoClassifyList = this.trademarkCategoryList[index].listTrademarkCategory2;
    },
    cancelData(data, index) {
      this.checkTwoClassifyList = [];
      this.riskClassifyList = [];
    },
    MergeArray(arr1, arr2) {
      var _arr = new Array();
      for (var i = 0; i < arr1.length; i++) {
        let obj = {
          category2Name: arr1[i].category2Name,
          category2NameEn: arr1[i].category2NameEn,
          category2Num: arr1[i].category2Num,
          categoryNameMore: arr1[i].categoryNameMore,
          parentCategoryNum: arr1[i].parentCategoryNum,
          keyword: [''],
        };
        if (this.countryCode == 'JP') {
          obj.categoryNameJp = arr1[i].categoryNameJp;
          obj.similarGroup = arr1[i].similarGroup;
        }
        _arr.push(obj);
      }
      for (var i = 0; i < arr2.length; i++) {
        var flag = true;
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i].categoryNum == arr1[j].category2Num) {
            flag = false;
            break;
          }
        }
        if (flag) {
          let obj = {
            category2Name: arr2[i].categoryName,
            category2NameEn: arr2[i].categoryNameEn,
            category2Num: arr2[i].categoryNum,
            categoryNameMore: arr2[i].categoryNameMore || '',
            parentCategoryNum: arr2[i].parentCategoryNum,
            keyword: [''],
          };
          if (this.countryCode == 'JP') {
            obj.categoryNameJp = arr2[i].categoryNameJp;
            obj.similarGroup = arr2[i].similarGroup;
          }
          _arr.push(obj);
        }
      }
      return _arr;
    },
    checkAllGroupChange(data) {
      if (data.length > 0) {
        this.choiceClassify = data.slice(-1);
      } else {
        this.checkTwoClassifyList = [];
        this.riskClassifyList = [];
      }
    },
    sureOneCategory() {
      let that = this;
      this.classifyModal = false;
      this.choiceClassifyList = [];
      for (var item of that.trademarkCategoryList) {
        if (item.category1Num == that.choiceClassify[0]) {
          this.$Message.info('该商标分类已存在，不能重复选择');
          return;
        }
      }
      this.choiceClassify.map((v, i) => {
        this.firstClassList.map((item, index) => {
          // console.log("item", item);
          if (v == item.categoryNum) {
            let obj = {
              category1Name: item.categoryName,
              category1NameEn: item.categoryNameEn,
              category1Num: item.categoryNum,
              category1Price: 1,
              searchtext: '',
              listTrademarkCategory2: [],
            };
            that.trademarkCategoryList[that.changeIndex] = { ...obj };
          }
        });
      });
      this.twoClassifyList = [];
      this.checkTwoClassifyList = [];
    },
    // 删除二级菜单
    removeTowCategory(categoryIndex, i) {
      let obj = { ...this.trademarkCategoryList[categoryIndex] };
      let delCategory = obj.listTrademarkCategory2.splice(i, 1);
      if (this.countryCode === 'JP') obj.listTrademarkCategory2 = this.filterArrayRepeatPush(obj.listTrademarkCategory2);
      this.$set(this.trademarkCategoryList, categoryIndex, obj);
      let delRiskClassifyIndex = this.riskClassifyList.findIndex((item) => item.category2Num === delCategory[0].category2Num);
      delRiskClassifyIndex > -1 && this.riskClassifyList.splice(delRiskClassifyIndex, 1);
    },
    searchSubclass(index) {
      if (this.trademarkCategoryList[index].category1Num == '') {
        this.$Message.info('请先选择商标分类');
        return;
      }
      if (this.trademarkCategoryList[index].searchtext == '') {
        this.$Message.info('请先输入商标小类名称');
        return;
      }
      let data = {
        countryCode: this.countryCode,
        parentCategoryNum: this.trademarkCategoryList[index].category1Num,
        searchName: this.trademarkCategoryList[index].searchtext,
        status: 1,
      };
      subCategoryListAPI(data).then((res) => {
        if (res.code == 0) {
          let obj = this.trademarkCategoryList[index];
          obj.resultData = res.data;
          obj.isSearch = true;
          this.$set(this.trademarkCategoryList, index, obj);
          this.isSearch = true;
          // debugger
        }
      });
    },
    // 销售链接
    addHref() {
      let obj = {
        category2Name: '',
        category2NameEn: '',
        marketHref: '',
      };
      this.marketHrefList.push(obj);
    },
    changeHrefClass(data, ins) {
      this.checkTwoClassifyList.map((v, i) => {
        if (data == v.category2NameEn) {
          this.marketHrefList[ins].category2Name = v.category2Name;
        }
      });
    },
    removeHref(i) {
      if (this.marketHrefList.length > 1) {
        this.marketHrefList.splice(i, 1);
      }
    },
    // 使用证据、订单截图
    formatErrorHandler() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传jpg,pdf格式的文件',
      });
    },
    beforeUploadHandler2(file, type) {
      // console.log(file);
      // console.log(type);
      // console.log(this.category2NameEn);
      if (this.category2NameEn === '' || this.category2NameEn === undefined) {
        this.$Notice.warning({
          title: type === 'product' ? '请先选择商标小类，再上传产品图' : '请先选择商标小类，再上传订单详情截图',
        });
        return false;
      }

      let len = this.useEvidenceList.length + this.usrProductImgList.length;
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

      const uploadList = type === 'product' ? [...this.usrProductImgList] : [...this.useEvidenceList];

      uploadList.forEach((item) => {
        let itemName = item.fileName;
        let itemSuffix = itemName.substring(itemName.lastIndexOf('.') + 1);

        if (itemSuffix === suffix && (itemName.slice(0, itemName.length - 4) === newName || itemName.slice(0, itemName.length - 7) === newName || itemName.slice(0, itemName.length - 8) === newName)) {
          fileNameNo++;
        }
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
          let obj = {
            fileName: res.data.origFileName,
            fileUrl: res.data.fileUrl,
          };
          if (type === 'product') {
            this.usrProductImgList.push(obj);
          } else {
            this.useEvidenceList.push(obj);
          }
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '上传文件失败',
          });
        });
    },
    removeHandler(i, item) {
      item.splice(i, 1);
    },
  },
  mounted() {
    this.getOneCategoryFun();

    this.countryCode && this.setsubClassCloumns(this.countryCode);
    {
      this.servicesStatus == 9 || this.servicesStatus == 11 ? (this.isEditor = true) : (this.isEditor = false);
    }
  },
};
</script>
<style scoped lang="scss">
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
  .subclass-tip {
    color: #999;
    a {
      color: #ff6600;
    }
  }
  /deep/ .ivu-input-wrapper {
    width: 398px;
    margin-top: 10px;
  }
  .search-subclass-btn {
    width: 76px;
    height: 32px;
    background: #00a3ff;
    border-radius: 2px;
    color: #fff;
    margin-top: 10px;
    vertical-align: bottom;
  }
  .slot-img {
    margin-top: 8px;
    cursor: pointer;
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
.category-box {
  /deep/ .ivu-input[disabled] {
    background-color: #fff !important;
    border: 1px solid #d9d9d9 !important;
    border-radius: 2px !important;
    color: #515a6e !important;
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
        display: inline-block;
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
.search-table {
  position: relative;
  width: 860px;
  max-height: 184px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin-top: 6px;
  img {
    position: absolute;
    right: 4px;
    top: 8px;
    cursor: pointer;
  }
  /deep/ .subclass-table {
    border-right: 1px solid rgba(0, 0, 0, 0.15);
  }
}
.subclass-table {
  max-width: 838px;
  max-height: 181px;
  overflow-y: scroll;
  /deep/ th {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
.subclass-table::-webkit-scrollbar {
  width: 4px;
}
.subclass-table::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45);
  border-radius: 1px;
}
.classify-modal /deep/ .ivu-checkbox-group-item {
  margin-bottom: 18px;
}
.talkbubble {
  position: relative;
  margin-bottom: 24px;
  .triangle {
    position: absolute;
    top: 0;
    right: -25px;
  }
}
.marketHref-list {
  margin-bottom: 8px;
  position: relative;
  img {
    vertical-align: middle;
    margin-left: 6px;
    cursor: pointer;
  }
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
.tip-box {
  padding: 14px;
  background-color: #eff9ff;
  font-size: 14px;
  font-family: PingFangSC;
  color: #666;
  line-height: 22px;
  display: inline-block;
  width: 528px;
  vertical-align: top;
  margin-left: 32px;
  p {
    display: inline-block;
  }
  img {
    vertical-align: top;
    margin-top: 2px;
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
.tip2-example-box {
  cursor: pointer;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #00a3ff;
  max-width: 472px;
  img {
    vertical-align: middle;
    margin: 0 6px;
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
.upload-proof {
  width: 398px;
  height: 180px;
  background: #f4f7fc;
  border-radius: 8px;
  border: 1px dashed #cfcfcf;
  text-align: center;
  padding-top: 56px;
  margin-top: 7px;
  p {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #999999;
    margin-top: 8px;
  }
}
.icon-help {
  font-size: 16px;
  border-radius: 50%;
  background: #1890ff;
  color: #fff;
  position: absolute;
  top: -24px;
  cursor: pointer;
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
.proof-example-modal /deep/ .ivu-modal {
  width: 610px !important;
}
.button-upload {
  position: absolute;
  top: -2px;
  left: 126px;
}
</style>
