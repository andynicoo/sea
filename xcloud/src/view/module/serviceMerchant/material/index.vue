<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="名称" prop="keyword" label-width="70px">
            <el-input v-model="form.keyword" placeholder="请输入" clearable style="width: 168px" />
          </el-form-item>
          <!-- <el-form-item label="状态" prop="status" label-width="70px">
            <el-select style="width: 168px" v-model="form.status" clearable>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button icon="el-icon-refresh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right" v-if="tabIndex == 1">
            <el-button type="success" @click="batchRelations" v-show="hasAuthority('D1_18')">
              <i class="icon icon-adds"></i>
              批量管理库存物料
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 查询 -->
    <div class="table-container top-header">
      <el-tabs v-model="activeName" ref="elTabs" @tab-click="handleClick">
        <el-tab-pane label="已匹配" name="firstSort">
          <!-- 表格 -->
          <div class="table-container">
            <el-table ref="table" border :data="list" v-loading="tableLoading" highlight-current-row element-loading-spinner="icon loading" element-loading-text="拼命加载中">
              <el-table-column align="center" label="序号" width="70">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column align="center" label="库存物料编码" prop="storeProductCode" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" label="库存物料名称" prop="name" show-overflow-tooltip></el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table border :data="props.row.productInfoDTOList" highlight-current-row @selection-change="handleSelectionChangeMatch">
                    <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                    <el-table-column align="center" label="关联商品" prop="productName" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>{{ scope.row.productName }}</div>
                        <span>{{ scope.row.productCode }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="关联物料编码" prop="productCode" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>{{ scope.row.productCode + '-' + props.row.storeProductCode }}</div>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="" prop="" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-button type="success" @click="unbingStoreBtn(scope.row,props.row.storeProductCode)" v-show="hasAuthority('D1_18')">
                          解绑库存物料
                        </el-button>
                      </template>
                    </el-table-column> -->
                  </el-table>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="关联物料编码">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.productInfoDTOList" :key="index">
                    <div>{{scope.row.storeProductCode+item.productName}}</div>
                  </div>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChangeMatching" @current-change="handleCurrentChangeMatching" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="未匹配" name="secondSort">
          <div class="table-container">
            <el-table
            ref="table"
            border :data="listUnmatch"
            v-loading="tableLoading"
            highlight-current-row
            element-loading-spinner="icon loading"
            @selection-change="handleSelectionChangeMatch"
            element-loading-text="拼命加载中">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column align="center" label="库存物料名称" prop="name" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" label="关联商品名称" prop="productName" show-overflow-tooltip >
                <template slot-scope="scope">
                  <div>{{scope.row.productName}}</div>
                  <span>{{scope.row.productCode}}</span>
                </template> 
              </el-table-column>
              <el-table-column align="center" label="关联物料编码" prop="" show-overflow-tooltip ></el-table-column>
              <el-table-column align="center" label="库存物料编码" prop="storeProductCode" show-overflow-tooltip >
                <template slot-scope="scope">
                  <el-button type="success" @click="relations(scope.row)" v-show="hasAuthority('D1_18')">
                    关联库存物料
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="form.current"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="form.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>  
        </el-tab-pane> -->
      </el-tabs>
    </div>

    <!-- 关联库存物料 -->
    <el-dialog key="addDialogKey" :visible.sync="addClassDialogVisible" title="关联库存物料" width="780px" @close="closeAddDialog">
      <el-form :inline="true" :model="addForm" class="demo-form-inline" :rules="formRule" ref="refservice">
        <el-form-item label="国家">
          <el-select v-model="addForm.countryCode" placeholder="请选择" clearable>
            <el-option :label="value.countryNameZh" :value="value.countryCode" v-for="(value, index) in countryList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" prop="productCategoryId">
          <el-cascader v-model="addForm.productCategoryId" :options="serviceCascader" :props="{ expandTrigger: 'hover' }" clearable></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetSub">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-container">
        <el-table border :data="subClassList" ref="table" element-loading-spinner="icon loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column align="center" label="库存物料编码" prop="storeProductCode" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="库存物料名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 编码分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChangeCode" @current-change="handleCurrentChangeCode" :current-page.sync="addForm.current" :page-sizes="[10, 20, 30, 50]" :page-size="addForm.size" layout="total, sizes, prev, pager, next, jumper" :total="totalCode"></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addClassConfirm">确 定</el-button>
        <el-button @click="addClassDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStore, matchingStore, unmatchedStore, bingStore, unbingStore } from '@/api/newApi/material/material.js';
import { getGoodsCategory } from '@/api/newApi/servicemerchant/goodsCenter.js';
import { findCountrys } from '@/api/newApi/processFields/processConfig';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  mixins: [cacheQuery],
  data() {
    return {
      list: [],
      listUnmatch: [],
      total: 0,
      form: {
        current: 1,
        size: 10,
        keyword: '',
      },
      activeName: 'firstSort',
      tabIndex: 0,
      tableLoading: false,
      addClassDialogVisible: false,
      searchFlag: false,
      moreSerch: false,
      cacheKey: 'form',
      copyListQuery: {},
      serviceCascader: [],
      subClassList: [],
      countryList: [], //服务国家列表
      selectList: [],
      selectListMatch: [],
      addForm: {
        current: 1,
        size: 10,
        countryCode: '',
        productCategoryId: '',
      },
      totalCode: '',
      relationsType: 'single',
      relationsProductCode: '',
      formRule: {
        attributeTypeName: [{ required: true, message: '请输入服务属性名称', trigger: 'blur' }],
        attributeTypeStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        class: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        attributeName: [{ required: true, message: '请输入属性值名称', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getallcategory();
    this.matchingStoreList();
    this.queryCountryList();
    this.getCodeList();
  },
  methods: {
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    getallcategory() {
      getGoodsCategory()
        .then((res) => {
          if (res.code == 0) {
            this.serviceCascader = this.getCategory(res.data.records);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 递归格式化所有商品类目和属性
     */

    getCategory(arr) {
      return arr.map((res) => {
        const t = res.childrenProductCategory;
        const obj = {
          label: res.categoryName,
          value: res.id,
        };
        t.length == 0
          ? void 0
          : Object.defineProperty(obj, 'children', {
              enumerable: true,
              configurable: false,
              writable: false,
              value: this.getCategory(t),
            });
        return obj;
      });
    },
    // 获取国家下拉
    queryCountryList() {
      findCountrys().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    onSubmit() {
      this.addForm.current = 1;
      this.getCodeList();
    },
    resetSub() {
      this.addForm = {
        current: 1,
        size: 10,
        countryCode: '',
        productCategoryId: '',
      };
      this.getCodeList();
    },
    getCodeList() {
      let data = {
        ...this.addForm,
        productCategoryId: this.addForm.productCategoryId.length > 0 ? this.addForm.productCategoryId[this.addForm.productCategoryId.length - 1] : this.addForm.productCategoryId,
      };
      for (let key in data) {
        if (data[key] === '') {
          delete data[key];
        }
      }
      getStore(data).then((res) => {
        if (res.code === 0) {
          this.subClassList = res.data.records;
          this.totalCode = Number(res.data.total);
        }
      });
    },
    handleClick(tab) {
      let index = tab.index;
      this.tabIndex = tab.index;
      if (index == 0) {
        this.matchingStoreList();
      } else {
        this.unmatchedStoreList();
      }
    },
    handleSizeChangeCode(val) {
      this.addForm.size = val;
      this.getCodeList();
    },
    handleCurrentChangeCode(val) {
      this.addForm.current = val;
      this.getCodeList();
    },
    // 多选勾选
    handleSelectionChangeMatch(val) {
      this.selectListMatch = val.map((item) => item.productCode);
    },
    // 多选勾选关联库存物料
    handleSelectionChange(val) {
      this.selectList = val.map((item) => item.storeProductCode);
    },
    matchingStoreList() {
      this.tableLoading = true;
      let data = this.form;
      for (let key in data) {
        if (data[key] === '') {
          delete data[key];
        }
      }
      matchingStore(data)
        .then((res) => {
          this.tableLoading = false;
          if (res.code == 0) {
            this.list = res.data.records;
            this.total = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.total}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    unmatchedStoreList() {
      this.tableLoading = true;
      let data = this.form;
      for (let key in data) {
        if (data[key] === '') {
          delete data[key];
        }
      }
      unmatchedStore(data)
        .then((res) => {
          this.tableLoading = false;
          if (res.code == 0) {
            this.listUnmatch = res.data.records;
            this.total = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.total}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    batchRelations() {
      if (this.selectListMatch.length == 0) {
        this.$message.warning('请批量选择');
        return false;
      }
      this.relationsType = 'batch';
      this.addClassDialogVisible = true;
    },
    relations(row) {
      this.relationsType = 'single';
      this.addClassDialogVisible = true;
      this.relationsProductCode = row.productCode;
    },
    closeAddDialog() {
      this.addClassDialogVisible = false;
    },
    addClassConfirm() {
      let selectListMatch = [];
      let selectList = this.selectList;
      if (this.relationsType == 'single') {
        selectListMatch = [this.relationsProductCode];
      } else {
        selectListMatch = this.selectListMatch;
      }
      let arry = [];
      let data = {
        relations: arry,
      };
      selectListMatch.forEach((item) => {
        selectList.forEach((value) => {
          arry.push({
            productCode: item,
            storeProductCode: value,
          });
        });
      });
      bingStore(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              message: '绑订成功',
              type: 'success',
              duration: 2000,
            });
            this.addClassDialogVisible = false;
            this.unmatchedStoreList();
            this.getCodeList();
            this.selectListMatch = [];
            this.selectList = [];
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    unbingStoreBtn(row, storeProductCode) {
      let data = {
        productCode: row.productCode,
        storeProductCode: storeProductCode,
      };
      unbingStore(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              message: '解绑成功',
              type: 'success',
              duration: 2000,
            });
            this.matchingStoreList();
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    /**
     * 分页
     */
    handleSizeChangeMatching(val) {
      this.form.size = val;
      let index = this.tabIndex;
      if (index == 0) {
        this.matchingStoreList();
      } else {
        this.unmatchedStoreList();
      }
    },
    handleCurrentChangeMatching(val) {
      this.form.current = val;
      let index = this.tabIndex;
      // this.form.keyword = '';
      if (index == 0) {
        this.matchingStoreList();
      } else {
        this.unmatchedStoreList();
      }
    },
    search() {
      this.searchFlag = true;
      this.form.current = 1;
      // [this.form.maxCount, this.form.minCount] = [Number(this.form.maxCount), Number(this.form.minCount)]
      if (this.moreSerch) {
        this.moreSerch = false;
      }
      let index = this.tabIndex;
      if (index == 0) {
        this.matchingStoreList();
      } else {
        this.unmatchedStoreList();
      }
    },
    edit(id) {
      this.$router.push({
        path: '/servicemerchant/channelGoods/detail',
        query: {
          id,
        },
      });
    },
    detail(id) {
      this.$router.push({
        path: '/companyInfo/detail',
        query: {
          id,
        },
      });
    },
    reset() {
      this.searchFlag = true;
      this.form = {
        current: 1,
        size: 10,
        keyword: '',
      };
      // [this.form.maxCount, this.form.minCount] = [Number(this.form.maxCount), Number(this.form.minCount)]
      if (this.moreSerch) {
        this.moreSerch = false;
      }
      let index = this.tabIndex;
      if (index == 0) {
        this.matchingStoreList();
      } else {
        this.unmatchedStoreList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
