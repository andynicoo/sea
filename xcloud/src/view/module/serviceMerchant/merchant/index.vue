<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div
        :class="{
          'search-aera': true,
          'search-on': moreSerch,
          'search-off': !moreSerch,
        }"
      >
        <!-- 查询条件 -->
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <el-form :model="listQuery" ref="searchForm" inline label-width="80px">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="listQuery.productName" placeholder="商品" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="商品分类" prop="productCategoryIdsList">
              <!-- <el-cascader
                v-model="listQuery.productCategoryIds"
                :options="serviceCascader"
                :props="{ expandTrigger: 'hover' }"
                clearable
              ></el-cascader> -->
              <el-cascader
                ref="productCategory"
                style="width: 168px"
                clearable
                filterable
                placeholder="请选择商品分类"
                v-model="listQuery.productCategoryIdsList"
                :options="serviceCascader"
                collapse-tags
                :props="{
                  multiple: true,
                  children: 'childrenProductCategoryVo',
                  value: 'id',
                  label: 'categoryName',
                }"
              ></el-cascader>
            </el-form-item>
            <el-form-item style="margin-left: 5px">
              <el-button type="primary" @click="_getServiceMerchantList(1)" icon="el-icon-search"> 搜索 </el-button>
              <el-button icon="el-icon-refresh" @click="resetSearchBox()"> 重置 </el-button>
              <el-button type="text" @click="handleMoreSearch">
                <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
                {{ moreSerch ? "收起" : "更多" }}筛选
              </el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="success" @click="showEditModal(null)" v-show="hasAuthority('D1_1')">
                <i class="icon icon-adds"></i>
                新增
              </el-button>
              <el-button
                class="yellow-btn"
                :loading="btnLoading"
                @click="_exportServiceMerchantList()"
                v-show="hasAuthority('D1_2')"
              >
                <i class="icon icon-export"></i>
                导出
              </el-button>
            </el-form-item>
            <div class="more-search" v-show="moreSerch">
              <el-form-item label="卖家信息" prop="sellerMobile">
                <el-input
                  v-model="listQuery.sellerMobile"
                  placeholder="请输入卖家手机号"
                  clearable
                  style="width: 168px"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select
                  style="width: 168px"
                  size="small"
                  v-model="listQuery.status"
                  filterable
                  @clear="_getServiceMerchantList"
                >
                  <el-option v-for="item in stateSelect" :value="item.id" :key="item.id" :label="item.name"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="国家" prop="countryCode">
                <el-select
                  filterable
                  style="width: 168px"
                  size="small"
                  v-model="listQuery.countryCode"
                  clearable
                  @clear="_getServiceMerchantList"
                >
                  <el-option
                    v-for="item in countrySelect"
                    :value="item.countryCode"
                    :key="item.id"
                    :label="item.countryNameZh"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="销售端" prop="applySit">
                <el-select
                  style="width: 168px"
                  size="small"
                  v-model="listQuery.applySit"
                  clearable
                  filterable
                  @clear="_getServiceMerchantList"
                >
                  <el-option
                    v-for="item in saleTargetSelect"
                    :value="item.id"
                    :key="item.name"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="创建时间" prop="time" clearable>
                <el-date-picker
                  v-model="listQuery.time"
                  type="daterange"
                  align="right"
                  size="small"
                  clearable
                  unlink-panels
                  range-separator="到"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 260px"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </el-form-item>
            </div>
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
        <el-table-column align="center" label="商品服务图片" width="120">
          <template slot-scope="scope">
            <el-image
              style="width: 48px; height: 33px"
              :src="getImgSrc(scope.row.pcProductImgUrl, scope.row.mobileProductImgUrl)"
              :preview-src-list="[getImgSrc(scope.row.pcProductImgUrl, scope.row.mobileProductImgUrl)]"
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/images/infoDetail/default.png" alt="" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" prop="productName" width="150"></el-table-column>
        <el-table-column align="center" label="商品类型" width="120" show-overflow-tooltip prop="categoryName">
          <template slot-scope="scope">
            {{
              !scope.row.productCategoryVo.parentProductCategoryVo
                ? ""
                : scope.row.productCategoryVo.parentProductCategoryVo.categoryName
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品分类" width="120" show-overflow-tooltip prop="serviceCategoryName">
          <template slot-scope="scope">
            {{ !scope.row.productCategoryVo.categoryName ? "" : scope.row.productCategoryVo.categoryName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务内容" show-overflow-tooltip width="120">
          <template slot-scope="scope">
            {{ getNoSkuContent(scope.row.noSkuProductAttributeRelationVOList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务项目" prop="productContent" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getSkuContent(scope.row.productSkuVOList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="国家">
          <template slot-scope="scope">
            {{ scope.row.countryInfo.countryNameZh }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售价" prop="basePrice">
          <template slot-scope="scope">{{scope.row.currency || '￥'}}{{ scope.row.basePrice | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="原价" prop="baseStandardPrice">
          <template slot-scope="scope">{{scope.row.currency || '￥'}}{{ scope.row.baseStandardPrice | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="最低售价" prop="lowestPrice">
          <template slot-scope="scope">
            <span v-if="JSON.stringify(scope.row.baseMinPrice) == '{}'">-</span>
            <span v-else>{{scope.row.currency || '￥'}}{{ scope.row.baseMinPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="目标毛利率" prop="grossProfitMargin" width="100">
          <template slot-scope="scope">
            <span v-if="JSON.stringify(scope.row.baseGpmRate) == '{}'">-</span>
            <span v-else>{{ scope.row.baseGpmRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" prop="sort"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            {{ getStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="单位">
          <template slot-scope="scope">
            {{ getUnit(scope.row.unit) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="卖家信息" prop="sellerMobile" width="150"></el-table-column>
        <el-table-column align="center" label="销售端" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getSaleTarget(scope.row.applySit) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" :width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link
                type="primary"
                class="icon icon-edit"
                :underline="false"
                @click="showEditModal(scope.row)"
                v-show="hasAuthority('D1_3')"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="详情" placement="top">
              <el-link
                type="primary"
                class="icon icon-see"
                :underline="false"
                @click="showDetailModal(scope.row)"
                v-show="hasAuthority('D1_4')"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="上架" placement="top">
              <el-link
                type="primary"
                class="icon icon-xiajia"
                :underline="false"
                @click="_productUpstatus(scope.row)"
                v-if="scope.row.status == 2 || scope.row.status == 3"
                v-show="hasAuthority('D1_6')"
              >
                <!-- {{ scope.row.status == 2 || scope.row.status == 3 ? "上架" : scope.row.status == 1 ? "下架" : "" }} -->
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="下架" placement="top">
              <el-link
                type="primary"
                class="icon icon-xiajia"
                :underline="false"
                @click="_productUpstatus(scope.row)"
                v-if="scope.row.status == 1 && hasAuthority('D1_5')"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="录入竞品价格" placement="top">
              <el-link
                type="primary"
                class="icon icon-add"
                :underline="false"
                @click="
                  pricingDialog = true;
                  rowData = scope.row;
                "
                v-if="scope.row.status == 1 && hasAuthority('D1_32')"
              ></el-link>
            </el-tooltip>
          </template>
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
    <PricingDialog
      :pricingDialog.sync="pricingDialog"
      :rowData="rowData"
      @refresh="_getServiceMerchantList"
    ></PricingDialog>
  </div>
</template>
<script>
import {
  getproductInfoList,
  exportServiceMerchantList,
  productUpstatus,
  getallcategory,
} from "@/api/newApi/servicemerchant/serviceMerchant.js";
import { getCountrySelectList } from "@/api/newApi/common.js";
import staticList from "../staticList";
import cacheQuery from "@/mixins/cacheQuery";
export default {
  components: {
    PricingDialog: () => import("./components/pricingDialog"),
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
        productCategoryIds: "",
        sellerMobile: "",
        status: 1,
        countryCode: "",
        applySit: "",
        page: 1,
        limit: 20,
        productCategoryIdsList: [],
        time: [],
      },
      addFormList: {
        id: "",
        name: "",
        state: "",
        parentId: "",
      },

      tableLoading: false,
      buttonLoading: false,

      //数据
      tableData: [],
      serviceCascader: [],
      countrySelect: [],
      unitSelect: staticList.unitArray,
      currencySelect: staticList.currencyList,
      saleTargetSelect: staticList.targetArray,
      stateSelect: staticList.stateArray,
      btnLoading: false,
      cacheKey: "listQuery",
      copyListQuery: {},
      allCateGories: [],
      pricingDialog: false,
      rowData: {},
    };
  },
  mounted() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this._getServiceMerchantList(1);
    this._getCountrySelectList();
    this._getallcategory();
  },
  methods: {
    /**
     * 导出表
     */
    _exportServiceMerchantList() {
      this.btnLoading = true;
      this.listQuery.limit = 10000;
      exportServiceMerchantList(this.listQuery)
        .then((res) => {
          this.btnLoading = false;
          let timestamp = new Date().getTime();
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          const link = document.createElement("a");
          const href = window.URL.createObjectURL(blob); //创建下载的链接
          link.href = href;
          link.download = timestamp + ".xlsx"; //下载后文件名
          document.body.appendChild(link);
          link.click(); //点击下载
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch((err) => {
          console.log(err, "err");
        });
    },

    /**
     * 获取表数据
     */
    _getServiceMerchantList(page) {
      this.tableLoading = true;
      if (page) this.listQuery.page = page;
      let { time, productCategoryIdsList, ...param } = this.listQuery;
      this.setPageCache();
      getproductInfoList({
        ...param,
        createTimeStart: this.listQuery.time ? this.listQuery.time[0] : "",
        createTimeEnd: this.listQuery.time ? this.listQuery.time[1] : "",
        productCategoryIds: this.listQuery.productCategoryIdsList.join(","),
      })
        .then((res) => {
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = parseInt(res.data.total);
        })
        .catch((err) => {
          this.tableLoading = false;
          console.log(err);
        });
    },

    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      getallcategory()
        .then((res) => {
          if (res.code == 0) {
            this.allCateGories = res.data;
            // this.serviceCascader = this.getCategory(res.data);
            this.formatCategory(res.data);
            this.serviceCascader = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategoryVo && item.childrenProductCategoryVo.length) {
          this.formatCategory(item.childrenProductCategoryVo);
        } else {
          item.childrenProductCategoryVo = void 0;
        }
      });
    },

    /**
     * 递归格式化所有商品类目和属性
     */

    getCategory(arr) {
      return arr.map((res) => {
        const t = res.childrenProductCategoryVo;
        const obj = {
          label: res.categoryName,
          value: res.id,
        };
        t.length == 0
          ? void 0
          : Object.defineProperty(obj, "children", {
              enumerable: true,
              configurable: false,
              writable: false,
              value: this.getCategory(t),
            });
        return obj;
      });
    },
    /**
     * 获取国家下拉框数据
     */
    _getCountrySelectList() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /********
     *
     * 商品上下架
     */
    _productUpstatus(row) {
      this.$confirm("确认操作?", "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.tableLoading = true;
          const state = row.status == 0 ? 1 : 0;
          productUpstatus(row.productId, state)
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.tableLoading = false;
                this._getServiceMerchantList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * 根据id获取状态
     */
    getStatus(code) {
      let name = "";
      if (!code && code != 0) {
        return name;
      }
      this.stateSelect.some((res) => {
        if (res.id == code) {
          name = res.name;
          return true;
        }
      });
      return name;
    },

    /**
     * 获取默认图片 优先pc端
     */
    getImgSrc(pcImg, mobileImg) {
      if (pcImg) {
        return JSON.parse(pcImg)[0].imgUrl;
      } else if (mobileImg) {
        return JSON.parse(mobileImg)[0].imgUrl;
      }

      // let img1 = !pcImg || pcImg.length == 0 ? [] : JSON.parse(pcImg);
      // let img2 =
      //   !mobileImg || mobileImg.length == 0 ? [] : JSON.parse(mobileImg);
      // return (
      //   (img1.length == 0 ? false : img1[0].imgUrl) ||
      //   (img2.length == 0 ? "" : img2[0].imgUrl)
      // );
    },

    /**
     * 获取单位
     */
    getUnit(code) {
      let name = "";
      if (!code && code != 0) {
        return name;
      }
      this.unitSelect.some((res) => {
        if (res.id == code) {
          name = res.name;
          return true;
        }
      });
      return name;
    },

    /**
     * 根据id获取销售端
     */
    getSaleTarget(val) {
      if (!val || val.length == 0) {
        return;
      }

      return JSON.parse(val)
        .map((item) => {
          let name = "";
          this.saleTargetSelect.some((t) => {
            if (t.id == item) {
              name = t.name;
              return true;
            }
          });
          return name;
        })
        .join(",");
    },
    /**
     * sku属性
     */
    getSkuContent(val) {
      if (!val || val.length == 0) {
        return;
      }
      return val
        .map((item) => {
          return item.productAttributeRelationDtoList
            .map((t) => {
              return t.productAttributeName;
            })
            .join("-");
        })
        .join(",");
    },

    /**
     * 非sku属性
     */
    getNoSkuContent(val) {
      if (!val || val.length == 0) {
        return;
      }
      return val
        .map((item) => {
          return item.productAttributeName;
        })
        .join(",");
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

    /**
     * 编辑
     */
    showEditModal(row) {
      this.$router.push({
        name: "addmerchant",
        params: {
          isDeepObj: true,
          name: "addmerchant",
          rowData: row,
          // serviceCascader: this.serviceCascader,
          countrySelect: this.countrySelect,
          unitSelect: this.unitSelect,
          currencySelect: this.currencySelect,
          saleTargetSelect: this.saleTargetSelect,
          stateSelect: this.stateSelect,
          allCateGories: this.allCateGories,
        },
      });
    },
    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        name: "merchantdetail",
        query: { productId: row.productId },
        // params: {
        //   isDeepObj: true,
        //   name: "merchantdetail",
        //   rowData: row,
        // },
      });
    },
    resetSearchBox() {
      // this.$refs.searchForm.resetFields()
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
      // this._getServiceMerchantList(1);
    },
  },
};
</script>
<style scoped lang="scss" scoped>
// .app-container {
//   height: 100%;
//   position: relative;
//   width: 100;
//   .header-container {
//     border: 0;
//     min-height: 80px;
//     .search-box {
//       position: absolute;
//       width: 98%;
//       z-index: 1;
//       .el-form {
//         padding-top: 10px;
//       }
//     }
//     .styleclass {
//       background: #f5f7f9;
//     }
//     .search-aera::before {
//       height: 0px;
//       top: 0px;
//     }
//     /deep/ .el-tabs__item {
//       width: 130px;
//       text-align: center;
//     }
//   }
// }
// .button-box {
//   float: right;
//   margin-top: 5px;
//   margin-right: 5px;
// }
.yellow-btn {
  color: #fff !important;
}
</style>
