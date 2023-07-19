<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div
        :class="{
          'search-aera': true,
          'search-on': moreSerch,
          'search-off': !moreSerch
        }"
      >
        <!-- 查询条件 -->
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <el-form :model="listQuery" ref="searchForm" inline label-width="80px">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="listQuery.productName" placeholder="请输入商品名称" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="商品分类" prop="productType">
              <el-cascader
                v-model="listQuery.productType"
                :options="serviceCascader"
                :props="{ expandTrigger: 'hover' }"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item style="margin-left: 5px">
              <el-button type="primary" @click="_getServiceMerchantList(1)" icon="el-icon-search">
                搜索
              </el-button>
              <el-button icon="el-icon-refresh" @click="resetSearchBox()">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="table"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        border
        :data="tableData"
        v-loading="tableLoading"
        :height="tableHeight"
        highlight-current-row
      >
        <el-table-column align="center" label="编号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" prop="productName" width="150">
          <template slot-scope="scope">
            <span>
              {{ scope.row.productName }}
              <span v-if="scope.row.productSkuName">-{{ scope.row.productSkuName }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="商品类型"
          width="120"
          show-overflow-tooltip
          prop="productCategoryName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品分类"
          width="120"
          show-overflow-tooltip
          prop="productSubCategoryName"
        ></el-table-column>
        <el-table-column align="center" label="国家" prop="countryName"></el-table-column>
        <el-table-column align="center" label="销售价" prop="price">
          <template slot-scope="scope">￥{{ scope.row.price | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="最低销售价" prop="minPrice">
          <template slot-scope="scope">
            <span v-if="JSON.stringify(scope.row.minPrice) == '{}'">-</span>
            <span v-else>￥{{ scope.row.minPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="目标毛利率" prop="gpmRate" width="100">
          <template slot-scope="scope">
            <span v-if="JSON.stringify(scope.row.gpmRate) == '{}'">-</span>
            <span v-else>{{ scope.row.gpmRate }} %</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="综合成本" prop="avgTotalCost">
          <template slot-scope="scope">￥{{ scope.row.avgTotalCost | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="目标成本" prop="targetCost">
          <template slot-scope="scope">￥{{ scope.row.targetCost | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="成本差" prop="costDiff">
          <template slot-scope="scope">￥{{ scope.row.costDiff | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="竞品参考价" prop="avgCompetitionReferencePrice">
          <template slot-scope="scope">
            ￥{{ scope.row.avgCompetitionReferencePrice | formatQianFenWei }}
            <el-button
              type="text"
              @click="
                detailDialog = true;
                rowData = scope.row;
              "
            >
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="建议定价" prop="suggestPrice">
          <template slot-scope="scope">￥{{ scope.row.suggestPrice | formatQianFenWei }}</template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>
    <DetailDialog :detailDialog.sync="detailDialog" :rowData="rowData"></DetailDialog>
  </div>
</template>
<script>
import { getallcategory, productInfoPriceListApi } from "@/api/newApi/servicemerchant/serviceMerchant.js";
import cacheQuery from "@/mixins/cacheQuery";
export default {
  components: {
    DetailDialog: () => import("./components/detailDialog")
  },
  mixins: [cacheQuery],
  data() {
    return {
      // 分页
      listTotal: 0,
      addDialogVisible: false,
      moreSerch: false,
      listQuery: {
        productName: "",
        productType: "",
        page: 1,
        limit: 20
      },
      tableLoading: false,

      //数据
      tableData: [],
      serviceCascader: [],
      countrySelect: [],
      cacheKey: "listQuery",
      copyListQuery: {},
      allCateGories: [],
      detailDialog: false,
      rowData: {}
    };
  },
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this._getServiceMerchantList(1);
    this._getallcategory();
  },
  methods: {
    /**
     * 获取表数据
     */
    _getServiceMerchantList(page) {
      this.tableLoading = true;
      if (page) this.listQuery.page = page;
      this.setPageCache();
      let { productType, ...params } = this.listQuery;
      let data = {
        ...params,
        enterpriseId: localStorage.getItem("enterpriseId"),
        productCategoryId: this.listQuery.productType
          ? this.listQuery.productType[this.listQuery.productType.length - 1]
          : ""
      };
      productInfoPriceListApi(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = parseInt(res.data.total);
        })
        .catch(err => {
          this.tableLoading = false;
          console.log(err);
        });
    },

    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      getallcategory()
        .then(res => {
          if (res.code == 0) {
            this.allCateGories = res.data;
            this.serviceCascader = this.getCategory(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 递归格式化所有商品类目和属性
     */

    getCategory(arr) {
      return arr.map(res => {
        const t = res.childrenProductCategoryVo;
        const obj = {
          label: res.categoryName,
          value: res.id
        };
        t.length == 0
          ? void 0
          : Object.defineProperty(obj, "children", {
              enumerable: true,
              configurable: false,
              writable: false,
              value: this.getCategory(t)
            });
        return obj;
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this._getServiceMerchantList(1);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this._getServiceMerchantList();
    },
    resetSearchBox() {
      // this.$refs.searchForm.resetFields()
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
      this._getServiceMerchantList(1);
    }
  }
};
</script>
<style scoped lang="scss" scoped>
.yellow-btn {
  color: #fff !important;
}
</style>
