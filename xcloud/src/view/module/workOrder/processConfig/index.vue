<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline>
        <el-form-item label="流程名称" prop="flowName">
          <el-input v-model="listQuery.flowName" placeholder="请输入流程名称" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="业务分类">
          <el-select style="width: 140px" v-model="listQuery.functionCode" placeholder="选择业务分类" @change="changeFunctionCode" clearable filterable default-first-option>
            <el-option :value="item.code" :label="item.name" v-for="item in productList" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <el-select style="width: 140px" v-model="listQuery.countryCode" clearable filterable default-first-option @change="querySupplierList" placeholder="选择国家">
            <el-option :value="item.countryCode" :label="item.countryNameZh" v-for="item in countryList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务商">
          <el-select style="width: 140px" v-model="listQuery.supplierId" placeholder="选择服务商" clearable filterable>
            <el-option :value="item.supplierId" :label="item.shortName" v-for="item in supplierList" :key="item.supplierId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select style="width: 120px" v-model="listQuery.status" placeholder="选择状态" clearable>
            <el-option value="0" label="待配置资料"></el-option>
            <el-option value="1" label="待审核"></el-option>
            <el-option value="3" label="审核驳回"></el-option>
            <el-option value="4" label="已发布"></el-option>
            <el-option value="5" label="已停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="default" icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" icon="el-icon-plus" @click="toEditProcess" v-show="hasAuthority('G1_1')">
            新增流程配置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <div class="table-container">
      <el-table :height="tableHeight" ref="table" :data="list" border v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="{ row, $index }">
            {{ listQuery.pageSize * (listQuery.pageNo - 1) + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="流程名称">
          <template slot-scope="{ row }">{{ row.flowName }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务商">
          <template slot-scope="{ row }">{{ row.serviceProviderName }}</template>
        </el-table-column>
        <el-table-column align="center" label="业务分类">
          <template slot-scope="{ row }">{{ row.functionName }}</template>
        </el-table-column>
        <el-table-column align="center" label="国家">
          <template slot-scope="{ row }">{{ row.countryNameCH }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="{ row }">
            {{
              row.status == 0
                ? "待配置资料"
                : row.status == 1
                ? "待审核"
                : row.status == 3
                ? "审核驳回"
                : row.status == 4
                ? "已发布"
                : row.status == 5
                ? "已停用"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人">
          <template slot-scope="{ row }">
            {{ row.createName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="150">
          <template slot-scope="{ row }">{{ row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="审核人">
          <template slot-scope="{ row }">
            {{ row.modifyName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核时间" width="150">
          <template slot-scope="{ row }">{{ row.updateTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="{ row }">
            <el-tooltip content="查看详情" placement="top" v-show="hasAuthority('G1_2')">
              <el-link v-if="row.status == 1 || row.status == 3 || row.status == 4 || row.status == 5" type="primary" :underline="false" @click="toPreviewTemplate(row)">
                <img src="@/assets/images/zt-upgrade-1/seeDetails.svg" alt="" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" v-show="hasAuthority('G1_3')">
              <el-link v-if="row.status == 0 || row.status == 1 || row.status == 3" type="primary" :underline="false" @click="toEditProcess(row)">
                <img src="@/assets/images/zt-upgrade-1/edit.svg" alt="" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="更新节点配置" placement="top" v-show="hasAuthority('G1_4')">
              <el-link v-if="row.status == 4" type="primary" :underline="false" @click="toEditProcess(row)">
                <img src="@/assets/images/zt-upgrade-1/update.svg" alt="" />
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.pageNo" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  findProducts,
  findCountrys,
  findSuppliers,
  findStatuses,
  findProcesses,
} from "@/api/newApi/processFields/processConfig";
import cacheQuery from "@/mixins/cacheQuery";
export default {
  data() {
    return {
      // 商品，国家，服务商，状态
      productList: [],
      countryList: [],
      supplierList: [],

      // 分页查询
      list: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        flowName: "",
        functionCode: "",
        countryCode: "",
        supplierId: "",
        status: "4",
        pageNo: 1,
        pageSize: 10,
      },
      cacheKey: "listQuery",
      copyListQuery: {},
    };
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this.queryProductList();
    this.queryCountryList();
    this.querySupplierList();
    this.queryList();
  },
  methods: {
    /**
     * 查询商品列表
     */
    queryProductList() {
      findProducts().then((res) => {
        if (res.code == 0) {
          this.productList = res.data;
        }
      });
    },

    /**
     * 切换业务分类
     */
    changeFunctionCode() {
      this.listQuery.supplierId = "";
      this.querySupplierList();
    },
    /**
     * 查询国家列表
     */
    queryCountryList() {
      findCountrys().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    /**
     * 改变国家code，查询服务商
     */
    changeCountryCode() {
      this.listQuery.supplierId = "";
      this.supplierList = [];
      this.querySupplierList();
    },
    /**
     * 查询服务商列表-根据国家code
     */
    querySupplierList() {
      findSuppliers({
        productCategoryId: this.listQuery.functionId,
        countryCode: this.listQuery.countryCode,
        page: 1,
        limit: 9999,
      }).then((res) => {
        if (res.code == 0) {
          this.supplierList = res.data.records;
        }
      });
    },

    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      this.setPageCache();
      findProcesses({
        flowName: this.listQuery.flowName,
        functionCode: this.listQuery.functionCode,
        countryCode: this.listQuery.countryCode,
        supplierId: this.listQuery.supplierId,
        status: this.listQuery.status,
        page: this.listQuery.pageNo,
        limit: this.listQuery.pageSize,
      })
        .then((res) => {
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
          }
        })
        .catch((error) => {
          this.listLoading = false;
        });
    },
    search() {
      this.listQuery.pageNo = 1;
      this.queryList();
    },
    handleReset() {
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
      this.queryList();
    },
    changePageNo(val) {
      this.listQuery.pageNo = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.pageSize = val;
      this.queryList();
    },

    /**
     * 跳转到节点配置页面
     */
    toEditProcess(row) {
      this.$router.push({
        path: "/workOrder/processConfig/editProcess",
        query: {
          flowId: row.flowId,
        },
      });
    },

    /**
     * 跳转到节点配置预览页面
     */
    toPreviewTemplate(row) {
      this.$router.push({
        path: "/workOrder/processConfig/previewTemplate",
        query: {
          flowId: row.flowId,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.app-container {
  .followPerson {
    text-align: center;
    padding: 10px;
    font-size: 14px;
  }
  .pagination-container {
    // margin-top: 24px;
  }
}
</style>
