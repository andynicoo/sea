<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="70px">
        <el-form-item label="税确名称">
          <el-input v-model="listQuery.templateName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select style="width: 140px" v-model="listQuery.functionCode" placeholder="选择业务分类" clearable filterable default-first-option>
            <el-option :value="item.value" :label="item.label" v-for="item in productList" :key="item.value"></el-option>
          </el-select>
          <!-- <el-cascader style="width: 200px" :props="{ value: 'code', label: 'name', children: 'workFunctionList' }" v-model="listQuery.functionCode" :options="workOrderTypeList" clearable></el-cascader> -->
        </el-form-item>
        <el-form-item label="国家">
          <el-select style="width: 120px" v-model="listQuery.countryCode" clearable @change="changeCountryCode" placeholder="选择国家" filterable default-first-option>
            <el-option :value="item.countryCode" :label="item.countryNameZh" v-for="item in countryList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务商">
          <el-select style="width: 200px" v-model="listQuery.supplierId" placeholder="选择服务商" clearable filterable default-first-option>
            <el-option :value="item.id" :label="item.shortName" v-for="item in supplierList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" icon="el-icon-plus" v-show="hasAuthority('I1_1')" @click="toEditProcess"> 新增税确模板 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="list" :height="tableHeight" ref="table" border v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="模板名称">
          <template slot-scope="{ row }">{{ row.templateName }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务商" prop="supplierId">
          <template slot-scope="{ row }">{{ row.supplierName }}</template>
        </el-table-column>
        <el-table-column align="center" label="工单类型">
          <template slot-scope="{ row }">
            <span v-if="row.functionCode === 2">IOSS</span>
            <span v-else>VAT</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="国家">
          <template slot-scope="{ row }">{{ row.countryName }}</template>
        </el-table-column>
        <el-table-column align="center" label="文件格式">
          <template slot-scope="{ row }">{{ row.templateSuffix }}</template>
        </el-table-column>
        <el-table-column align="center" label="最后操作人">
          <template slot-scope="{ row }">
            {{ row.modifyName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="最后操作时间" width="150">
          <template slot-scope="{ row }">{{ row.updateTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="{ row }">
            <el-tooltip content="查看" placement="top" v-show="hasAuthority('I1_2')">
              <el-link type="primary" :underline="false" @click="toPreviewTemplate(row)">
                <img src="@/assets/images/zt-upgrade-1/seeDetails.svg" alt="" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="替换" placement="top" v-show="hasAuthority('I1_3')">
              <el-link type="primary" :underline="false" @click="toEditProcess(row)">
                <img src="@/assets/images/zt-upgrade-1/replace.svg" alt="" />
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
import { findProducts, findCountrys, newfindProcesses, taxConfirmTemplate } from '@/api/newApi/processFields/processConfig';
import { workCategoryList } from '@/api/newApi/workOrder/typeConfig.js';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      //工单类型列表
      workOrderTypeList: [],
      // 商品，国家，服务商，状态
      productList: [
        { label: 'VAT', value: 1 },
        { label: 'IOSS', value: 2 },
      ],
      countryList: [],
      supplierList: [],

      // 分页查询
      list: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        functionCode: '',
        countryCode: '',
        supplierId: '',
        pageNo: 1,
        pageSize: 10,
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
    };
  },
  mixins: [cacheQuery],
  watch: {
    'listQuery.countryCode'(val) {
      if (val) {
        this.querySupplierList();
      } else {
        this.listQuery.supplierId = '';
        this.supplierList = [];
      }
    },
  },
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    // this.queryProductList()
    this.queryCountryList();
    this.querySupplierList();
    this.queryList();
    // workCategoryList().then((res) => {
    //   if (res.code === 0) {
    //     res.data.forEach((item) => {
    //       item.code = 'i' + item.id;
    //     });
    //     this.workOrderTypeList = res.data;
    //   }
    // });
  },
  methods: {
    /**
     * 切换业务分类
     */
    changeFunctionCode() {
      this.listQuery.supplierId = '';
      this.querySupplierList();
    },
    /**
     * 查询国家列表
     */
    queryCountryList() {
      findCountrys().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    /**
     * 改变国家code，查询服务商
     */
    changeCountryCode() {
      this.listQuery.supplierId = '';
    },
    /**
     * 查询服务商列表-根据国家code
     */
    querySupplierList() {
      newfindProcesses({
        countryCode: this.listQuery.countryCode,
        page: 1,
        limit: 9999,
        supplierType: '1',
      }).then((res) => {
        if (res.code === 0) {
          this.supplierList = res.data;
        }
      });
    },

    getValueByKey(val, key, arr, rVal) {
      const aa = arr.find((item) => val === item[key]);
      return aa[rVal];
    },

    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      const params = {
        // functionCode: this.listQuery.functionCode.length ? this.listQuery.functionCode[1] : '',
        functionCode: this.listQuery.functionCode,
        countryCode: this.listQuery.countryCode,
        supplierId: this.listQuery.supplierId,
        page: this.listQuery.pageNo,
        limit: this.listQuery.pageSize,
        templateName: this.listQuery.templateName,
      };
      this.setPageCache();
      taxConfirmTemplate(params)
        .then((res) => {
          console.log(res);
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code === 0) {
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
          }
        })
        .catch(() => {
          this.listLoading = false;
        });

      // auditProcess({
      //   flowId: this.flowId,
      //   operation: this.auditForm.status
      // }).then(res => {
      //   if (res.code == 0) {
      //     this.$message({
      //       type: "success",
      //       message: "操作成功"
      //     });
      //     this.auditModal = false;
      //     this.goback();
      //   }
      // });
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
      console.log(row);
      this.$router.push({
        path: '/workOrder/taxConfig/editDownload',
        query: {
          tempId: row.id,
        },
      });
    },

    /**
     * 跳转到节点配置预览页面
     */
    toPreviewTemplate(row) {
      this.$router.push({
        path: '/workOrder/taxConfig/details',
        query: {
          tempId: row.id,
          preView: true,
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
    // padding-top: 20px !important;
    // padding-bottom: 20px !important;
  }
}
</style>
