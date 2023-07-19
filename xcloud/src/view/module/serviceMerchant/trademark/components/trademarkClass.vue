<template>
  <div>
    <!-- 查询条件 -->
    <div class="header-container" style="padding-top:0">
      <div class="search-box" ref="searchBox">
        <el-form ref="searchForm" inline label-width="100px">
          <el-form-item label="商品分类名称">
            <el-input v-model="form.categoryName" placeholder="请输入商品分类名称" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" @click="addClassDialogVisible = true" v-show="hasAuthority('D1_18')">
              <i class="icon icon-adds"></i>
              新增分类
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" border :data="list" :height="tableHeight" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商标类别编码" prop="categoryNum" width="150"></el-table-column>
        <el-table-column align="center" label="商品分类名称" prop="categoryName" width="150"></el-table-column>
        <el-table-column align="center" label="名称英文" prop="categoryNameEn"></el-table-column>
        <el-table-column align="center" label="创建人" prop="createName"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="150"></el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName" width="150"></el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="150"></el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="新增子分类" placement="top">
              <el-link type="primary" class="icon icon-add" :underline="false" @click="addSubclass(scope.row)" v-show="hasAuthority('D1_19')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="edit(scope.row)" v-show="hasAuthority('D1_20')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-link type="info" class="icon icon-del" :underline="false" @click="del(scope.row.id)" v-show="hasAuthority('D1_21')"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增分类 -->
    <el-dialog key="addDialogKey" :visible.sync="addClassDialogVisible" title="新增编辑" width="392px" @close="closeAddDialog">
      <el-form :model="addClassForm" ref="addClassFormRef" :rules="addClassRules" label-width="145px">
        <el-form-item label="商标分类编码1：" prop="categoryNum">
          <el-input v-model="addClassForm.categoryNum" placeholder="请输入商标分类编码" style="width: 168px" />
        </el-form-item>
        <el-form-item label="商标分类名称1：" prop="categoryName">
          <el-input v-model="addClassForm.categoryName" placeholder="请输入商标分类名称" style="width: 168px" />
        </el-form-item>
        <el-form-item label="商标名称英文1：" prop="categoryNameEn">
          <el-input v-model="addClassForm.categoryNameEn" placeholder="请输入商标名称英文" style="width: 168px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addClassConfirm">确 定</el-button>
        <el-button @click="addClassDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增子分类 -->
    <el-dialog :visible.sync="addSubClassDialogVisible" title="新增子分类" width="457px" @close="closeAddSubDialog">
      <el-form :model="addSubClassForm" ref="addSubClassFormRef" :rules="addSubClassRules" label-width="145px">
        <el-form-item label="商标分类" prop="parentCategoryNum">
          <el-input v-model="parentCategoryName" style="width: 168px" disabled />
        </el-form-item>
        <el-form-item label="商标小类(中文)" prop="categoryName">
          <el-input v-model="addSubClassForm.categoryName" placeholder="请输入商标分类" style="width: 168px" />
        </el-form-item>
        <el-form-item label="商标小类(英文)" prop="categoryNameEn">
          <el-input v-model="addSubClassForm.categoryNameEn" placeholder="请输入商标分类" style="width: 168px" />
        </el-form-item>
        <el-form-item label="国家" prop="countryCode">
          <el-select style="width: 168px" v-model="addSubClassForm.countryCode" clearable placeholder="请选择" filterable>
            <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubClassConfirm">确 定</el-button>
        <el-button @click="addSubClassDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getTradeMarkCateGory,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCateGory
} from "@/api/newApi/servicemerchant/trademark.js";
import { getCountrySelectList } from "@/api/newApi/common.js";
export default {
  data() {
    var validateCN = (rule, value, callback) => {
      let reg = /^[\u4E00-\u9FA5]+$/;
      if (!reg.test(value)) {
        callback(new Error("请输入中文"));
      } else {
        callback();
      }
    };
    var validateEN = (rule, value, callback) => {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error("请输入英文"));
      } else {
        callback();
      }
    };
    return {
      // 分页
      total: 0,
      addDialogKey: 0,
      form: {
        categoryName: "",
        limit: 10,
        page: 1
      },
      tableLoading: false,
      //数据
      list: [],
      addClassForm: {
        categoryName: "",
        categoryNameEn: "",
        categoryNum: ""
      },
      copyAddClassForm: { ...this.addClassForm },
      addSubClassForm: {
        categoryName: "",
        categoryNameEn: "",
        countryCode: "",
        parentCategoryNum: ""
      },
      parentCategoryName: "",
      copyAddSubClassForm: { ...this.addSubClassForm },
      addClassRules: {
        categoryNum: [
          { required: true, message: "请填写商标编码", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 45,
            message: "商标编码只能为1-45",
            trigger: "blur",
            transform: (value) => Number(value)
          }
        ],
        categoryName: [{ required: true, message: "请填写商标分类名称", trigger: "blur" }],
        categoryNameEn: [{ validator: validateEN, trigger: "blur" }]
      },
      addSubClassRules: {
        parentCategoryNum: [{ required: true }],
        categoryName: [
          { required: true, message: "请填写商标小类(中文)", trigger: "blur" }
          // { validator: validateCN, trigger: "blur" },
        ],
        categoryNameEn: [
          { required: true, message: "请填写商标小类(英文)", trigger: "blur" },
          { validator: validateEN, trigger: "blur" }
        ],
        countryCode: [{ required: true, message: "请选择国家", trigger: "blur" }]
      },
      addClassDialogVisible: false,
      addSubClassDialogVisible: false,
      searchFlag: false,
      countrySelectList: [],
      // 正在编辑的分类
      checkItem: null
    };
  },
  created() {
    this._getCountrySelectList();
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      getTradeMarkCateGory(this.form)
        .then(res => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: "success",
              duration: 2000
            });
            this.searchFlag = false;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    closeAddDialog() {
      this.checkItem = null;
      this.addClassForm = { ...this.copyAddClassForm };
    },
    closeAddSubDialog() {
      this.addSubClassForm = { ...this.copyAddSubClassForm };
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then(res => {
        this.countrySelectList = res.data;
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    /**
     * 新增子分类
     */
    addSubclass(row) {
      this.addSubClassForm.parentCategoryNum = row.categoryNum;
      this.parentCategoryName = row.categoryName;
      this.addSubClassDialogVisible = true;
    },
    /**
     * 编辑分类
     */
    edit(row) {
      const { categoryName, categoryNameEn, categoryNum } = row;
      this.$forceUpdate();
      console.log("打开");
      this.$nextTick(() => {
        this.addClassForm = {
          categoryName,
          categoryNameEn,
          categoryNum
        };
      });
      this.checkItem = row;

      this.addClassDialogVisible = true;
    },
    /**
     * 删除
     */
    del(id) {
      this.$confirm("确定要删除吗？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true
      }).then(() => {
        deleteCategory({
          categoryId: id
        }).then(res => {
          if (res.code === 0) {
            this.getList();
          }
        });
      });
    },
    // 新增/编辑分类
    addClassConfirm() {
      this.$refs["addClassFormRef"].validate(valid => {
        console.log(valid);
        if (valid) {
          if (this.checkItem === null) {
            // 新增
            addCategory(this.addClassForm).then(res => {
              if (res.code === 0) {
                this.$message.success("添加成功");
                this.addClassDialogVisible = false;
                this.getList();
              }
            });
          } else {
            // 编辑
            updateCategory({
              ...this.addClassForm,
              id: this.checkItem.id
            }).then(res => {
              if (res.code === 0) {
                this.$message.success("更新成功");
                this.addClassDialogVisible = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /**
     * 确认添加子分类
     */
    addSubClassConfirm() {
      this.$refs["addSubClassFormRef"].validate(valid => {
        if (valid) {
          addSubCateGory(this.addSubClassForm).then(res => {
            if (res.code === 0) {
              this.$message.success("添加成功");
              this.addSubClassDialogVisible = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style></style>
