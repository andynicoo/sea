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
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <el-form ref="searchForm" inline label-width="100px">
            <el-form-item label="服务商简称">
              <el-input v-model="form.shortName" placeholder="服务商简称" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="服务商编码">
              <el-input
                v-model="form.supplierCode"
                placeholder="服务商编码"
                clearable
                style="width: 168px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="国家">
              <el-select style="width: 168px" size="small" multiple clearable v-model="form.countryCodes" filterable>
                <el-option
                  v-for="item in countrySelectList"
                  :key="item.id"
                  :value="item.countryCode"
                  :label="item.countryNameZh"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- <el-select style="width: 168px" size="small" clearable multiple v-model="form.productCategoryIds" filterable>
              <el-option
                v-for="item in functionCode"
                :key="item.id"
                :value="item.id"
                :label="item.categoryName"
              ></el-option>
            </el-select> -->
              <el-cascader
                style="width: 168px"
                clearable
                v-model="form.productCategoryIds"
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
            <el-form-item>
              <el-button type="primary" size="small" @click="search" icon="el-icon-search">搜索</el-button>
              <el-button type="default" @click="handleReset" icon="el-icon-refresh">重置</el-button>
              <el-button type="text" @click="handleMoreSearch">
                <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
                {{ moreSerch ? "收起" : "更多" }}筛选
              </el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button
                type="success"
                size="small"
                @click="modifyOwner()"
                icon="el-icon-edit"
                v-if="hasAuthority('E1_38')"
              >
                修改归属人
              </el-button>
              <el-button type="success" size="small" @click="edit()" v-if="hasAuthority('E1_1')">
                <i class="icon icon-adds"></i>
                新增服务商
              </el-button>
            </el-form-item>

            <div class="more-search" v-show="moreSerch">
              <el-form-item label="工单分配状态">
                <el-select style="width: 168px" size="small" clearable v-model="form.status">
                  <el-option :value="1" label="分配">分配</el-option>
                  <el-option :value="2" label="不分配">不分配</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="归属人">
                <el-select
                  class="form-item"
                  placeholder="请选择"
                  size="small"
                  clearable
                  filterable
                  style="width: 168px"
                  v-model="form.affiliationCreateId"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        border
        :data="list"
        v-loading="tableLoading"
        :height="tableHeight"
        ref="table"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
      >
        <Empty slot="empty" />
        <!-- <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          align="center"
          width="150"
          label="服务商名称"
          prop="supplierName"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column align="center" width="150" label="服务商简称" prop="shortName"></el-table-column>
        <el-table-column align="center" width="150" label="服务商编码" prop="supplierCode"></el-table-column>
        <el-table-column align="center" label="商品分类" prop="categoryNames" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="国家" prop="countryName"></el-table-column>
        <el-table-column align="center" label="工单分配状态" prop="statusName">
          <template slot-scope="scope">
            <span v-if="scope.row.statusName == '启用'">
              <span class="dot-success"></span>
              分配
            </span>
            <span v-if="scope.row.statusName == '禁用'">
              <span class="dot-danger"></span>
              不分配
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" width="150" label="联系人" prop="contacts"></el-table-column> -->
        <!-- <el-table-column align="center" width="150" label="联系电话" prop="contactsTell"></el-table-column> -->
        <!-- <el-table-column
          align="center"
          width="150"
          label="联系邮箱"
          prop="email"
          show-overflow-tooltip
        ></el-table-column> -->
        <!-- <el-table-column align="center" width="150" label="是否支付税金" prop="isPayTaxesName"></el-table-column> -->
        <el-table-column align="center" label="归属人" prop="affiliationCreateName"></el-table-column>
        <el-table-column align="center" width="150" label="创建时间" prop="createTime" sortable></el-table-column>
        <el-table-column align="center" width="150" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('E1_2')">
              <el-link class="icon icon-see" type="primary" :underline="false" @click="detail(scope.row.id)"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top" v-if="hasAuthority('E1_3')">
              <el-link class="icon icon-edit" type="primary" :underline="false" @click="edit(scope.row.id)"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="禁用" placement="top" v-if="hasAuthority('E1_4')">
              <el-link
                class="icon icon-disable"
                type="primary"
                :underline="false"
                v-if="scope.row.status === 1"
                @click="_changeDisableStatus(scope.row)"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" v-if="hasAuthority('E1_5')">
              <el-link
                class="icon icon-del"
                type="primary"
                :underline="false"
                v-if="scope.row.status === 2"
                @click="del(scope.row.id)"
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
        :current-page.sync="form.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="form.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <ModifyOwnerModel
      :changeModifyOwnerDialog.sync="changeModifyOwnerDialog"
      :serviceIdColl="serviceIdColl"
      @reset="getList"
      :fromWhere="'serviceproviderManage'"
    ></ModifyOwnerModel>
  </div>
</template>
<script>
import {
  getSupplierList,
  activateEnabledState,
  deleteSupplierById,
} from "@/api/newApi/supplyChain/serviceproviderManage.js";
import { getallcategory } from "@/api/newApi/servicemerchant/serviceMerchant.js";
import { getCountrySelectList, getFunctionCode } from "@/api/newApi/common.js";
import { getUserNormal } from "@/api/user.js";
import cacheQuery from "@/mixins/cacheQuery";
export default {
  data() {
    return {
      // 分页
      total: 0,
      form: {
        countryCodes: [],
        shortName: "",
        status: 1,
        limit: 20,
        page: 1,
        productCategoryIds: [],
        supplierCode: "",
        affiliationCreateId: "",
      },
      cacheKey: "form",
      copyListQuery: {},
      tableLoading: false,
      // 数据
      list: [],
      countrySelectList: [],
      functionCode: [],
      serviceCascader: [],
      searchFlag: false,
      selectList: [],
      serviceIdColl: [],
      userList: [],
      changeModifyOwnerDialog: false,
    };
  },
  components: {
    ModifyOwnerModel: () => import("@/view/module/supplychain/allocationRules/components/modifyOwnerModel.vue"),
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this._getCountrySelectList();
    // this._getFunctionCode();
    this._getallcategory();
    this.getUserList();
    this.getList();
  },
  methods: {
    // 重置
    handleReset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
      this.getList();
      // this.form = {
      //   countryCodes: [],
      //   shortName: "",
      //   status: "",
      //   limit: 10,
      //   page: 1,
      //   productCategoryIds: [],
      // };
      // this.getList()
    },
    getList() {
      this.tableLoading = true;
      this.setPageCache();
      getSupplierList({
        ...this.form,
        countryCodes: this.form.countryCodes.join(","),
        productCategoryIds: this.form.productCategoryIds.join(","),
      })
        .then((res) => {
          let list = res.data.records;
          // list.forEach(item => {
          //   item.countryName = item.countryNames.split(",")[0];
          // });
          this.list = list;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: "success",
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    // 获取服务分类
    _getFunctionCode() {
      getFunctionCode().then((res) => {
        this.functionCode = res.data;
      });
    },
    // 获取归属人列表
    getUserList() {
      getUserNormal().then((res) => {
        if (res.code === 0) {
          this.userList = res.data;
        }
      });
    },
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      getallcategory().then((res) => {
        if (res.code == 0) {
          this.formatCategory(res.data);
          this.serviceCascader = res.data;
        }
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
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    // 多选勾选
    handleSelectionChange(val) {
      this.selectList = val;
    },
    modifyOwner() {
      if (this.selectList.length == 0) {
        this.$message.warning("请先选择服务商");
        return;
      }
      let ids = [];
      this.selectList.map((item) => {
        ids.push(item.id);
      });
      this.serviceIdColl = ids;
      this.changeModifyOwnerDialog = true;
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
     * 详情
     */
    detail(id) {
      this.$router.push({
        path: "/serviceprovider/detail",
        query: {
          id,
        },
      });
    },
    /**
     * 编辑
     */
    edit(id) {
      this.$router.push({
        path: "/serviceprovider/addEdit",
        query: {
          id,
        },
      });
    },
    /**
     * 切换禁用状态
     */
    _changeDisableStatus(row) {
      this.$confirm(`是否确认${row.status === 1 ? "禁用" : "启用"}?`, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true,
      }).then(() => {
        this.tableLoading = true;
        activateEnabledState({
          id: row.id,
        })
          .then((res) => {
            if (res.code == 0) {
              this.$message("操作成功");
              this.getList();
            }
            this.tableLoading = false;
          })
          .catch((err) => {
            this.tableLoading = false;
          });
      });
    },
    /**
     * 删除
     */
    del(id) {
      this.$confirm("确定删除？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true,
      }).then(() => {
        deleteSupplierById({ id }).then((res) => {
          if (res.code === 0) {
            this.getList();
          }
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/styles/fixedSearch.scss";
// .app-container .header-container {
//   margin-bottom: 0;
// }
</style>
