<template>
  <div class="commodity">
    <div class="bar">
      <Button type="primary" @click.stop="addCategory" v-show="hasAuthority('commodityCategory_addClassify')">添加分类</Button>
    </div>
    <div>
      <Table border :loading="loading" :columns="columns" :data="tableData" @on-selection-change="selectChange">
        <template slot="property" slot-scope="{ row }">
          <Button type="primary" @click.stop="editAttr(row)" v-show="hasAuthority('commodityCategory_editAttr')">编辑</Button>
        </template>
        <template slot="operation" slot-scope="{ row }">
          <span class="button" style="margin-right:10px;" @click.stop="editCategory(row.id)" v-show="hasAuthority('commodityCategory_editClassify')">编辑</span>
          <span class="button" @click.stop="deleteCategory(row.id)" v-show="hasAuthority('commodityCategory_deleteClassify')">删除</span>
        </template>
      </Table>
      <Page class="pagination" @on-page-size-change="pageSizeChangeHandler" @on-change="pageChangeHandler" :current="page" :total="listTotal" :page-size="pageSize" :page-size-opts="[10, 15, 20, 30]" show-total show-elevator />
    </div>
    <!-- 添加分类 -->
    <Modal class="modal" v-model="categoryModal" width="600" :title="categoryModalTitle + '一级分类'" cancelText :mask-closable="false">
      <Form ref="categoryModal" :model="categoryForm" :rules="categoryRule" :label-width="110">
        <FormItem label="分类名称：" prop="categoryName">
          <Input v-model="categoryForm.categoryName" show-word-limit :maxlength="10" style="width: 200px" />
        </FormItem>
        <FormItem label="商品类型：" prop="productType">
          <Select v-model="categoryForm.productType" style="width:200px;" placeholder="请选择商品类型" clearable>
            <Option v-for="item in productTypeList" :value="item.code" :key="item.code">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="排序：" prop="sort">
          <Input v-model="categoryForm.sort" style="width: 200px" />
        </FormItem>
        <FormItem label="是否显示：" prop="showFlag">
          <RadioGroup v-model="categoryForm.showFlag">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否服务商品：" prop="serviceFlag">
          <RadioGroup v-model="categoryForm.serviceFlag">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="分类图标：" prop="iconUrl">
          <Upload ref="categoryUpload" :show-upload-list="false" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList)}" :on-remove="(file,fileList)=>{removeHandler(file,fileList)}" :on-format-error="(file,fileList)=>{formatErrorHandler(file,fileList)}" :before-upload="(file)=>{beforeUploadHandle(file)}" :format="['jpg','jpeg','png','gif']">
            <Button type="primary">选择上传文件</Button>
            <p>图标尺寸为18*18比例，大小不能超过200KB，图片只能为jpg、png、gif格式</p>
          </Upload>
          <p class="docHd" v-if="categoryIconFileList.length != 0">
            <template v-for="(item, index) in categoryIconFileList">
              <div class="docIndex" :key="index">
                <img src="@/assets/images/downloadIcon.png" alt="" />
                <a :href="item.iconUrl" target="_blank">{{ item.iconName }}
                </a>
                <Icon @click.stop="removeHandler(index)" class="closeIcon" type="md-close" />
              </div>
            </template>
          </p>
        </FormItem>
        <FormItem label="分类描述：" prop="description">
          <Input v-model="categoryForm.description" type="textarea" placeholder="请输入内容" :rows="6" style="width: 400px" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="addCategoryCancel">取消</Button>
        <Button type="primary" :loading="addCategoryLoading" @click="addCategorySubmit">提交</Button>
      </div>
    </Modal>
    <!-- 添加商品属性 -->
    <Modal class="modal" v-model="attrModal" width="1000" title="编辑商品属性" cancelText :mask-closable="false">
      <Form ref="attrModal" :model="attrForm" :label-width="100">
        <FormItem label="商品分类：" prop="name">
          <Input v-model="attrForm.categoryName" style="width:200px;" :disabled="true" />
        </FormItem>
        <FormItem label="销售属性：" prop="attr">
          <Table :loading="attrLoading" :columns="attrColumns" :data="attrTableData">
            <template slot="attributeName" slot-scope="{ row,index }">
              <Input v-model="attrTableData[index].attributeName" show-word-limit :maxlength="20" />
            </template>
            <template slot="ticketFlowName" slot-scope="{ row,index }">
              <Select v-model="attrTableData[index].ticketFlowCode" :label-in-value="true" @on-change="ticketFlowNChange($event,row,index)">
                <Option v-for="item in ticketFlowList" :value="item.value" :key="item.code">{{ item.label }}</Option>
              </Select>
            </template>
            <template slot="description" slot-scope="{ row,index }">
              <Input v-model="attrTableData[index].description" placeholder="请填写属性说明" />
            </template>
            <template slot="operation" slot-scope="{ row,index}">
              <span class="button" style="margin-right:10px;" @click="deleteAttr(index)">删除</span>
              <span class="button" style="margin-right:10px;" @click="moveDownAttr(index)" v-if="index != attrTableData.length - 1">下移</span>
              <span class="button" @click="moveUpAttr(index)" v-if="index != 0">上移</span>
            </template>
          </Table>
          <Button type="primary" style="margin-top:10px;" @click.stop="addAttrItem" v-if="attrTableData.length != 0"> + 继续添加</Button>
          <Button type="primary" style="margin-top:10px;" @click.stop="addAttrItem" v-else> + 添加</Button>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="addAttrCancel">取消</Button>
        <Button type="primary" :loading="addAttrLoading" @click="addAttrSubmit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getCategoryList, addOrEditCategory, getAttrList, deleteCategory, getCategoryDetails, getProductTypeList, addAttrs, } from "@/api/commodityManage/commodityCategory";
export default {
  data() {
    return {
      fileUpload: this.workOrderFile,
      page: 1,
      listTotal: 0,
      pageSize: 10,
      selectArr: [],
      loading: false,
      columns: [
        {
          type: "selection",
          align: "center",
          width: 60,
        },
        {
          title: "编号",
          key: "id",
          align: "center",
        },
        {
          title: "一级分类",
          key: "categoryName",
          align: "center",
        },
        {
          title: "商品类型",
          key: "productTypeName",
          align: "center",
        },
        {
          title: "商品属性",
          slot: "property",
          align: "center",
        },
        {
          title: "商品数量",
          key: "prodcutCount",
          align: "center",
        },
        {
          title: "排序",
          key: "sort",
          align: "center",
        },
        {
          title: "操作",
          slot: "operation",
          align: "center",
        },
      ],
      tableData: [],
      // 添加分类
      categoryModal: false,
      categoryModalTitle: '添加',
      categoryForm: {},
      categoryIconFileList: [],
      addCategoryLoading: false,
      categoryRule: {
        categoryName: [
          { required: true, message: '请输入分类名称。', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序。', trigger: 'blur' }
        ],
        showFlag: [
          { required: true, message: '请选择是否显示。', trigger: 'change', }
        ],
        serviceFlag: [
          { required: true, message: '请选择是否服务商品。', trigger: 'change', }
        ],
        productType: [
          { required: true, message: '请选择商品类型。', trigger: 'change', }
        ],
      },
      productTypeList: [],
      // 添加商品属性
      categoryList: [],
      attrModal: false,
      attrForm: {},
      addAttrLoading: false,

      attrLoading: false,
      attrColumns: [
        {
          title: "*销售属性名称",
          slot: "attributeName",
          align: "center",
        },
        {
          title: "*对应工单流程",
          slot: "ticketFlowName",
          align: "center",
        },
        {
          title: "说明",
          slot: "description",
          align: "center",
        },
        {
          title: "操作",
          slot: "operation",
          align: "center",
        },
      ],
      attrTableData: [],
      attrLoading: false,
      ticketFlowList: [
        {
          value: 'REG_DECLARE',
          label: '注册+申报'
        },
        {
          value: 'ZAGENT_DECLARE',
          label: '转代理+申报'
        },
        {
          value: 'RENEW_DECLARE',
          label: '续申报'
        },
        {
          value: 'BACKTRACK',
          label: '回溯补缴'
        },
        {
          value: 'EORI_APPLY',
          label: 'EORI注册'
        },
        {
          value: 'ONE_REG_BRAND',
          label: '一标一类注册'
        },
        {
          value: 'TWO_REG_BRAND',
          label: '一标两类注册'
        },
        {
          value: 'THREE_REG_BRAND',
          label: '一标三类注册'
        },
        {
          value: 'FOUR_REG_BRAND',
          label: '一标四类注册'
        },
        {
          value: 'TRANSFER_BRAND',
          label: '商标转让'
        },
        {
          value: 'BRAND_ZHUAN',
          label: '商标转代理'
        },
        {
          value: 'SWEAR_BRAND',
          label: '商标宣誓'
        },
        {
          value: 'UPDATE_BRAND',
          label: '商标修改/增删产品'
        },
        {
          value: 'CORRECT_BRAND',
          label: '商标补正'
        },
        {
          value: 'REVIVE_BRAND',
          label: '商标复活'
        },
        {
          value: 'RECHECK_BRAND',
          label: '商标复审'
        },
        {
          value: 'OTHER',
          label: '其他服务'
        },
      ],
    };
  },
  methods: {
    // 添加分类
    addCategory() {
      this.categoryModal = true;
      this.categoryForm = {};
      this.categoryIconFileList = [];
      this.$refs["categoryUpload"].clearFiles();
      this.categoryModalTitle = '添加';
    },
    // 编辑分类
    editCategory(id) {
      let self = this;
      this.categoryForm = {};
      this.$refs["categoryUpload"].clearFiles();
      getCategoryDetails({ categoryId: id })
        .then((res) => {
          if (res.code == 0) {
            self.categoryForm = res.data;
            self.categoryForm.serviceFlag = '' + res.data.serviceFlag;
            self.categoryForm.showFlag = '' + res.data.showFlag;
            self.categoryForm.productType = '' + res.data.productType;
            self.categoryForm.sort = '' + res.data.sort;
            self.categoryModal = true;
            if (self.categoryForm.iconUrl) {
              self.categoryIconFileList = [{
                iconName: 'icon.png',
                iconUrl: self.categoryForm.iconUrl,
              }];
            }
            self.categoryModalTitle = '编辑';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除分类
    deleteCategory(id) {
      let self = this;
      this.$Modal.confirm({
        title: '请确认是否删除？',
        onOk: () => {
          deleteCategory({ id })
            .then((res) => {
              if (res.code == 0) {
                self.$Message.success('删除成功！');
                self.getTableList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel: () => { }
      });
    },
    // 上传文件
    successHandler(res, file, fileList) {
      this.categoryForm.iconUrl = res.data.fileUrl;
      this.categoryIconFileList.push({
        iconName: file.name,
        iconUrl: file.response.data.fileUrl,
      });
    },
    // 删除文件
    removeHandler(index) {
      this.categoryIconFileList.splice(index, 1);
      this.categoryForm.iconUrl = '';
    },
    // 上传之前
    beforeUploadHandle(file) {
      this.$refs["categoryUpload"].clearFiles();
      this.categoryIconFileList.splice(0, 1);
    },
    // 格式错误
    formatErrorHandler(file, fileList) {
      this.$Message.warning('图片只能为jpg、png、gif格式！');
    },
    // 取消
    addCategoryCancel() {
      this.categoryModal = false;
    },
    // 提交
    addCategorySubmit() {
      let self = this;
      if (!this.categoryForm.categoryName) {
        this.$Message.warning('请填写分类名称！');
        return false
      }
      if (!this.categoryForm.productType) {
        this.$Message.warning('请选择商品类型！');
        return false
      }
      if (!this.categoryForm.sort && this.categoryForm.sort != 0) {
        this.$Message.warning('请填写排序字段！');
        return false
      }
      if (!this.categoryForm.showFlag) {
        this.$Message.warning('请选择是否显示！');
        return false
      }
      if (!this.categoryForm.serviceFlag) {
        this.$Message.warning('请选择是否是服务商品！');
        return false
      }
      // if (!this.categoryForm.iconUrl) {
      //   this.$Message.warning('请上传分类图标！');
      //   return false
      // }
      // if(!this.categoryForm.description){
      //   this.$Message.warning('请填写分类描述！');
      //   return false
      // }
      let params = { ...this.categoryForm };
      addOrEditCategory(params)
        .then((res) => {
          if (res.code == 0) {
            self.categoryModal = false;
            self.$Message.success(self.categoryModalTitle + '成功！');
            self.getTableList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 编辑商品属性
    editAttr(row) {
      let self = this;
      this.attrForm.categoryId = row.id;
      this.attrForm.categoryName = row.categoryName;
      this.attrModal = true;
      // 根据商品类型区分对应的工单流程
      // vat
      if (row.productType == 1) {
        this.ticketFlowList = [
          {
            value: 'REG_DECLARE',
            label: '注册+申报'
          },
          {
            value: 'ZAGENT_DECLARE',
            label: '转代理+申报'
          },
          {
            value: 'RENEW_DECLARE',
            label: '续申报'
          },
          {
            value: 'BACKTRACK',
            label: '回溯补缴'
          },
          {
            value: 'EORI_APPLY',
            label: 'EORI注册'
          },
          {
            value: 'OTHER',
            label: '其他服务'
          },
        ];
      };
      // 商标
      if (row.productType == 2) {
        this.ticketFlowList = [
          {
            value: 'ONE_REG_BRAND',
            label: '一标一类注册'
          },
          {
            value: 'TWO_REG_BRAND',
            label: '一标两类注册'
          },
          {
            value: 'THREE_REG_BRAND',
            label: '一标三类注册'
          },
          {
            value: 'FOUR_REG_BRAND',
            label: '一标四类注册'
          },
          {
            value: 'TRANSFER_BRAND',
            label: '商标转让'
          },
          {
            value: 'BRAND_ZHUAN',
            label: '商标转代理'
          },
          {
            value: 'SWEAR_BRAND',
            label: '商标宣誓'
          },
          {
            value: 'UPDATE_BRAND',
            label: '商标修改/增删产品'
          },
          {
            value: 'CORRECT_BRAND',
            label: '商标补正'
          },
          {
            value: 'REVIVE_BRAND',
            label: '商标复活'
          },
          {
            value: 'RECHECK_BRAND',
            label: '商标复审'
          },
        ];
      };
      let params = { categoryId: row.id };
      getAttrList(params)
        .then((res) => {
          if (res.code == 0) {
            if (JSON.stringify(res.data) != '{}') {
              self.attrTableData = res.data.attributeList
            } else {
              self.attrTableData = []
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除商品属性
    deleteAttr(i) {
      this.attrTableData.splice(i, 1);
    },
    // 上移商品属性
    moveUpAttr(i) {
      let self = this;
      let arr = JSON.parse(JSON.stringify(self.attrTableData));
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      let oldSort = arr[i].sort;
      arr[i].sort = arr[i - 1].sort;
      arr[i - 1].sort = oldSort;
      this.$set(this, 'attrTableData', arr);
    },
    // 下移商品属性
    moveDownAttr(i) {
      let self = this;
      let arr = JSON.parse(JSON.stringify(self.attrTableData));
      [arr[i].sort, arr[i + 1].sort] = [arr[i + 1].sort, arr[i].sort];
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      let oldSort = arr[i].sort;
      arr[i].sort = arr[i + 1].sort;
      arr[i + 1].sort = oldSort;
      this.$set(this, 'attrTableData', arr);
    },
    // 工单流程下拉change
    ticketFlowNChange(val, row, index) {
      this.attrTableData[index].ticketFlowName = val.label;
      this.attrTableData[index].ticketFlowCode = val.value;
    },
    // 继续添加
    addAttrItem() {
      let sort = 0;
      if (this.attrTableData.length != 0) {
        sort = Number(this.attrTableData[this.attrTableData.length - 1].sort) + 1;
      }
      this.attrTableData.push(
        {
          attributeName: '',
          ticketFlowName: '',
          ticketFlowCode: '',
          description: '',
          categoryId: '',
          sort,
        }
      )
    },
    // 取消
    addAttrCancel() {
      this.attrModal = false;
    },
    // 提交
    addAttrSubmit() {
      let self = this;
      if (self.attrTableData.length == 0) {
        this.$Message.warning('请添加商品属性！');
        return false
      }
      if (self.attrTableData.some(el => !el.attributeName)) {
        this.$Message.warning('销售属性名称必填！');
        return false
      }
      if (self.attrTableData.some(el => !el.ticketFlowName)) {
        this.$Message.warning('对应工单流程必填！');
        return false
      }
      self.attrTableData.forEach(el => {
        el.categoryId = self.attrForm.categoryId;
      });
      let params = {
        attributeList: self.attrTableData,
        categoryId: self.attrForm.categoryId,
        categoryName: self.attrForm.categoryName,
      };
      addAttrs(params)
        .then((res) => {
          if (res.code == 0) {
            self.attrModal = false;
            self.$Message.success('提交成功！');
            self.getTableList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 表格select
    selectChange(rowData) {
      let self = this
      rowData.forEach(el => {
        self.selectArr.push(el.id)
      })
    },
    // 每页条数改变
    pageSizeChangeHandler(pageSize) {
      this.pageSize = pageSize
      this.changePageHandler()
    },
    // 翻页
    pageChangeHandler(page = 1) {
      this.page = page;
      this.getTableList();
    },
    // 获取商品类型下拉列表
    getProductTypeList() {
      let self = this;
      getProductTypeList()
        .then((res) => {
          if (res.code == 0) {
            self.productTypeList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取列表数据
    getTableList() {
      let self = this;
      let pageData = {
        page: self.page,
        limit: self.pageSize,
      };
      let params = { ...pageData };
      getCategoryList(params)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.listTotal = Number(res.data.total);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getTableList();
    this.getProductTypeList();
  },
};
</script>

<style scoped lang="less">
.commodity {
  background: #fff;
  padding: 0 15px;
}
.bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 0;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 15px;
}
.button {
  color: #2d8cf0;
  cursor: pointer;
}
.docHd {
  width: 100%;
  font-size: 14px;
  margin-bottom: 18px;

  .docIndex {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    height: 32px;
    // border-radius: 5px;
    position: relative;
    padding: 0 6px;
    margin-bottom: 5px;
    img {
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }
    a {
      display: inline !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .closeIcon {
    position: absolute;
    right: 5px;
    padding-left: 30px;
    color: #939399;
    font-size: 8px;
    top: 10px;
    cursor: pointer;
  }
}
/deep/ .ivu-table-wrapper {
  overflow: visible;
}
</style>