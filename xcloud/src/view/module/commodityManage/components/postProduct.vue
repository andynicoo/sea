<template>
  <div class="postProduct">
    <Card>
      <p class="back" @click="goBack">返回列表</p>
    </Card>
    <Form class="addForm" ref="addFrom" :model="addForm" :rules="ruleInline" :label-width="200">
      <FormItem label="分类：" prop="categoryId">
        <Select v-if="postProductData.type != 'look'" v-model="addForm.categoryId" style="width:300px;" placeholder="请选择商品分类" @on-change="categoryIdChange" clearable>
          <Option v-for="item in categotyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <p v-else>{{postProductData.categoryName}}</p>
      </FormItem>
      <FormItem label="服务国家：" prop="countryCode" v-if="isShowcountryCode">
        <Select v-if="postProductData.type != 'look'" v-model="addForm.countryCode" style="width:300px;" placeholder="请选择服务国家" clearable>
          <Option v-for="item in countryList" :value="item.country" :key="item.country">{{ item.countryName }}</Option>
        </Select>
        <p v-else>{{postProductData.countryName}}</p>
      </FormItem>
      <FormItem label="商品名称：" prop="productName">
        <Input v-if="postProductData.type != 'look'" v-model="addForm.productName" style="width:300px;" placeholder="请输入商品名称" :maxlength="40" clearable></Input>
        <p v-else>{{addForm.productName}}</p>
      </FormItem>
      <FormItem label="商品描述：" prop="productDesc">
        <Input v-if="postProductData.type != 'look'" v-model="addForm.productDesc" style="width:300px;" placeholder="请输入商品描述" type="textarea" :rows="4"></Input>
        <p v-if="postProductData.type != 'look'">简要描述该商品提供的服务内容、注意事项等</p>
        <p v-else>{{addForm.productDesc}}</p>
      </FormItem>
      <template v-if="(addForm.categoryId || addForm.categoryId == 0) && attributeList.length > 0">
        <Divider />
        <div class="centerBox" >
          <template v-if="postProductData.type != 'look'">
            <p class="smallTitle">请选择该商品的销售属性</p>
            <CheckboxGroup v-model="attributeValList" @on-change="attributeChange">
              <Checkbox :label="item.id" v-for="item in attributeList" :key="item.id">{{item.attributeName}}</Checkbox>
            </CheckboxGroup>
          </template>
          <p>
            <span class="title">SKU表</span>
            <span class="hint">如未填写SKU号，系统将自动生成</span>
          </p>
          <Table :columns="attrColumns" :data="attrTableData">
            <template slot="attributeName" slot-scope="{ row,index }">
              <Input v-model="attrTableData[index].attributeName" :disabled="postProductData.type == 'look'" />
            </template>
            <template slot="skuNo" slot-scope="{ row,index }">
              <Input v-model="attrTableData[index].skuNo" :disabled="postProductData.type == 'look'" />
            </template>
            <template slot="originalPrice" slot-scope="{ row,index }">
              <Input v-model="attrTableData[index].originalPrice" @on-change="numVerify($event,index,'originalPrice')" :disabled="postProductData.type == 'look'" />
            </template>
            <template slot="sellingPrice" slot-scope="{ row,index }">
              <Input v-model="attrTableData[index].sellingPrice" @on-change="numVerify($event,index,'sellingPrice')" :disabled="postProductData.type == 'look'" />
            </template>
            <template slot="productDetail" slot-scope="{ row,index }">
              <Input v-model="attrTableData[index].productDetail" :disabled="postProductData.type == 'look'" />
            </template>
          </Table>
        </div>
        <Divider />
      </template>
      <FormItem label="商品服务图片：" prop="productHeadImgUrl">
        <img :src="addForm.productHeadImgUrl" class="main-img" />
        <Upload v-if="postProductData.type != 'look'" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'productHeadImgUrl')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList)}" :format="['jpg','jpeg','png','gif']" style="display:inline-block;margin-left:10px;" :show-upload-list="false">
          <div style="padding: 10px;">
            <span>点击上传</span>
          </div>
        </Upload>
      </FormItem>
      <FormItem label="商品展示图：" prop="productImgUrl">
        <img :src="addForm.productImgUrl" class="main-img" />
        <Upload v-if="postProductData.type != 'look'" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'productImgUrl')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList)}" :format="['jpg','jpeg','png','gif']" style="display:inline-block;margin-left:10px;" :show-upload-list="false">
          <div style="padding: 10px;">
            <span>点击上传</span>
          </div>
        </Upload>
      </FormItem>
      <FormItem label="服务详情：" prop="productDetail" style="width:1000px">
        <vue-neditor-wrap v-model="addForm.productDetail" :config="myConfig" class="editbd" :destroy="false"></vue-neditor-wrap>
      </FormItem>
      <FormItem label="发布平台：" prop="pubPlatform">
        <CheckboxGroup v-model="pubPlatform">
          <Checkbox label="0" :disabled="postProductData.type == 'look'">客户端</Checkbox>
          <Checkbox label="1" :disabled="postProductData.type == 'look'">管理后台</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem v-if="postProductData.type != 'look'">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" style="margin-left: 20px" @click="submit">提交</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { getCategoryItem, addOrUpdateProduct, getAttrList, getProductDetailes, allList } from "@/api/commodityManage/commodityList";
export default {
  props: {
    postProductData: {}
  },
  data() {
    return {
      fileUpload: this.workOrderFile,
      addForm: {
        productDetail: '',
        pubPlatform: [1],
      },
      categotyList: [],
      countryList: [],
      attributeList: [],
      attributeValList: [],
      pubPlatform: [],
      attrColumns: [
        {
          title: "销售属性",
          slot: "attributeName",
          align: "center",
        },
        {
          title: "SKU编号",
          slot: "skuNo",
          align: "center",
        },
        {
          title: "原价",
          slot: "originalPrice",
          align: "center",
        },
        {
          title: "售价",
          slot: "sellingPrice",
          align: "center",
        },
        {
          title: "商品简介（选填）",
          slot: "productDetail",
          align: "center",
        },
      ],
      attrTableData: [],
      skuDTOList: [],
      myConfig: {
        // 上传文件接口
        serverUrl: this.ueditorFile,
        toolbars: [
          [
            'anchor', // 锚点
            'undo', // 撤销
            'redo', // 重做
            'bold', // 加粗
            'indent', // 首行缩进
            'underline', // 下划线
            'formatmatch', // 格式刷
            'source', // 源代码
            'pasteplain', // 纯文本粘贴模式
            'preview', // 预览
            'removeformat', // 清除格式
            'fontfamily', // 字体
            'fontsize', // 字号
            'paragraph', // 段落格式
            // 'simpleupload', //单图上传
            'insertimage', // 多图上传
            'link', // 超链接
            'spechars', // 特殊字符
            'searchreplace', // 查询替换
            'map', // Baidu地图
            'insertvideo', // 视频
            'justifyleft', // 居左对齐
            'justifyright', // 居右对齐
            'justifycenter', // 居中对齐
            'justifyjustify', // 两端对齐
            'forecolor', // 字体颜色
            'backcolor', // 背景色
            'insertorderedlist', // 有序列表
            'insertunorderedlist', // 无序列表
            'fullscreen', // 全屏
            'pagebreak', // 分页
            'attachment', // 附件
            'imagecenter', // 居中
            // 'wordimage', //图片转存
            'lineheight', // 行间距
            'autotypeset', // 自动排版
            'background', // 背景
            'template', // 模板
            'inserttable', // 插入表格
            // 'drafts', // 从草稿箱加载
          ],
        ],
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: this.UEDITOR_HOME_URL,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 初始容器高度
        initialFrameHeight: 340,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        enableAutoSave: true
      },
      ruleInline: {
        categoryId: [
          { required: true, message: '商品分类不能为空', trigger: 'change' }
        ],
        countryCode: [
          { required: true, message: '请选择服务国家', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        productDesc: [
          { required: true, message: '商品描述不能为空', trigger: 'blur' }
        ],
        productHeadImgUrl: [
          { required: true, message: '商品服务图片不能为空', trigger: 'change' }
        ],
        productImgUrl: [
          { required: true, message: '商品展示图不能为空', trigger: 'change' }
        ],
        productDetail: [
          { required: true, message: '服务详情不能为空', trigger: 'blur' }
        ],
        pubPlatform: [
          { required: true, message: '服务平台不能为空', trigger: 'change', type: 'array' }
        ],
      },
      platformList: [
        {
          label: '客户端',
          value: '0',
        },
        {
          label: '管理后台',
          value: '1',
        },
        {
          label: '全部',
          value: '3',
        },
      ],//发布平台列表
      isShowcountryCode: true,
      productTypeList: [],
    }
  },
  methods: {
    // 获取详情数据
    getDetails() {
      getProductDetailes({ productId: this.postProductData.productId })
        .then((res) => {
          this.addForm = JSON.parse(JSON.stringify(res.data));
          this.addForm.pubPlatform = [1];
          this.categoryIdChange(res.data.categoryId);
          if (res.data.skuDTOList) {
            this.attributeValList = res.data.skuDTOList.map(el => String(el.attributeId)).sort((a,b)=>a.id - b.id);
            this.attrTableData = res.data.skuDTOList.sort((a,b)=>a.id - b.id);
            this.skuDTOList = res.data.skuDTOList.sort((a,b)=>a.id - b.id);
          }
          this.pubPlatform = res.data.pubPlatform == 3 ? ['0', '1'] : ['' + res.data.pubPlatform];

        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 返回
    goBack() {
      this.$emit('changeShowPostProduct', false);
    },
    // 获取分类下拉
    getCategoryList() {
      let self = this;
      let params = { delFlag: 0 };
      getCategoryItem(params)
        .then((res) => {
          self.categotyList = res.data.map(el => {
            return {
              label: el.value,
              value: el.code,
              serviceFlag: el.serviceFlag,
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取国家下拉
    getCountryList() {
      let self = this;
      allList()
        .then((res) => {
          self.countryList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 商品分类change
    categoryIdChange(val) {
      if (!val) {
        this.attributeList = [];
        return;
      }
      let self = this;
      // 先清空原有数据
      this.attributeList = [];
      this.attributeValList = [];
      this.attrTableData = [];
      // 控制服务国家是否显示
      let arr = this.categotyList.filter(el => el.value == val);
      if (arr.length > 0) {
        this.isShowcountryCode = arr[0].serviceFlag;
      }
      getAttrList({ categoryId: val })
        .then((res) => {
          if(JSON.stringify(res.data) != '{}'){
            self.attributeList = res.data.attributeList.sort((a,b)=>a.id - b.id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 商品属性change
    attributeChange(val) {
      let self = this;
      let arr = [];
      val.forEach((el, index) => {
        if (self.attrTableData.every(v => v.attributeId != el)) {
          arr.push({
            attributeId: el,
            attributeName: self.attributeList.filter(val => val.id == el)[0].attributeName,
            skuNo: '',
            originalPrice: '',
            sellingPrice: '',
            productDetail: '',
          })
        } else {
          arr[index] = self.attrTableData.filter(val => val.attributeId == el)[0];
        }
      });
      arr = arr.sort((a,b)=>a.attributeId - b.attributeId);
      this.$set(this, 'attrTableData', arr);
    },
    // 数字校验
    numVerify(val,index,type) {
      let flag = this.attrTableData[index][type];
      if (isNaN(Number(flag))) {
        this.$Message.warning('请输入数字！');
        return;
      }
    },
    // 取消
    cancel() {
      this.$emit('changeShowPostProduct', false);
    },
    // 提交
    submit() {
      let self = this;
      if (this.attrTableData.length == 0 || this.attrTableData.some(el => !el.attributeName)) {
        this.$Message.warning('销售属性不能为空！');
        return false;
      }
      // if (this.attrTableData.some(el => !el.skuNo && el.originalPrice != 0)) {
      //   this.$Message.warning('sku编号不能为空！');
      //   return false;
      // }
      if (this.attrTableData.some(el => !el.originalPrice && el.originalPrice != 0)) {
        this.$Message.warning('原价不能为空！');
        return false;
      }
      if (this.attrTableData.some(el => !el.sellingPrice && el.sellingPrice != 0)) {
        this.$Message.warning('售价不能为空！');
        return false;
      }
      if (this.attrTableData.some(el => isNaN(Number(el.originalPrice)) || isNaN(Number(el.sellingPrice)))) {
        this.$Message.warning('价格必须是数字！');
        return false;
      }
      if (this.pubPlatform.length == 0) {
        this.$Message.warning('请选择发布平台！');
        return false;
      }
      let params = {
        ...this.addForm,
        skuDTOList: this.attrTableData,
        pubPlatform: this.pubPlatform.length == 1 ? this.pubPlatform[0] : 3,
      };
      this.$refs['addFrom'].validate(valid => {
        if (valid) {
          addOrUpdateProduct(params)
            .then((res) => {
              if (res.code == 0) {
                self.$Message.success('添加成功！');
                self.$emit('changeShowPostProduct', false);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
    },
    // 上传成功
    successHandler(res, file, fileList, type) {
      this.$set(this.addForm, type, res.data.fileUrl);
    },
    // 移除文件
    removeHandler(file, fileList) { },
  },
  created() {
    this.getCategoryList();
    this.getCountryList();
  },
  mounted() {
    if (this.postProductData.type != 'add') {
      this.getDetails();
    }
  },
}
</script>

<style scoped lang="less">
.postProduct {
  background: #fff;
  padding: 15px;
  .back {
    padding: 10px 10px;
  }
  .ivu-card {
    margin-bottom: 10px;
    cursor: pointer;
  }
  .ivu-divider-horizontal {
    margin: 10px 0;
  }
  /deep/ .ivu-card-body {
    padding: 0px;
  }
  .centerBox {
    .smallTitle {
      color: #000;
      font-size: 14px;
    }
    .ivu-checkbox-group {
      padding: 20px 0;
    }
    .ivu-checkbox-wrapper {
      padding-right: 20px;
      line-height: 35px;
    }
    .title {
      color: #000;
      font-size: 16px;
    }
    .hint {
      color: red;
      margin-left: 10px;
    }
  }
  .main-img {
    width: 160px;
    height: 143px;
  }
  .ivu-checkbox-wrapper {
    padding-right: 20px;
  }
}
</style>