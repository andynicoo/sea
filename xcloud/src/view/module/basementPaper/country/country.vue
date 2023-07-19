<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div>
        <!-- 查询条件 -->
        <div class="search-box">
          <el-form ref="searchForm" inline>
            <el-form-item label="国家名称">
              <el-input v-model="listQuery.countryName" placeholder="国家名称" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select style="width: 120px" size="small" clearable v-model="listQuery.status">
                <el-option :value="0" label="启用">启用</el-option>
                <el-option :value="1" label="禁用">禁用</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="_getCounrtyTableData()" icon="el-icon-search">
                搜索
              </el-button>
              <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="success" icon="el-icon-plus" size="small" v-show="hasAuthority('B1_9')" @click="showEditModal(null, false)">
                新增国家
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table border ref="table" :data="data" v-loading="tableLoading" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="编号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="国旗">
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 40px" :src="scope.row.countryImgUrl" :preview-src-list="[scope.row.countryImgUrl]"></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="国家名称" prop="countryNameZh"></el-table-column>
        <el-table-column align="center" label="英文名称" prop="countryNameEn"></el-table-column>
        <el-table-column align="center" label="国家代码" prop="countryCode"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span class="text-success" v-if="scope.row.status == 0">
              <i class="icon icon-stuts-enable" style="margin: 0px; width: 10px"></i>
              启用
            </span>
            <span class="text-danger" v-else>
              <i class="icon icon-stuts-disable" style="margin: 0px; width: 10px"></i>
              禁用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createName"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="150"></el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName"></el-table-column>
        <el-table-column align="center" label="交易手续费" prop="transFeeScale" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.enableRTrade && scope.row.transFeeScale">{{scope.row.transFeeScale}}%</span>
            <span v-else> </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="150"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="showEditModal(scope.row, true)" v-show="hasAuthority('B1_7')">
                <img src="@/assets/images/zt-upgrade-1/edit.svg" />
              </el-link>
            </el-tooltip>
            <!--  @click="changeDisableStatus(scope.row)" -->
            <el-link type="primary" class="icon" :underline="false" @click="_changeDisableStatus(scope.row)" v-show="hasAuthority('B1_8')">
              <el-tooltip content="启用状态" placement="top" v-show="scope.row.status == 0">
                <img src="@/assets/images/zt-upgrade-1/enable.svg" />
              </el-tooltip>
              <el-tooltip content="禁用状态" placement="top" v-show="scope.row.status != 0">
                <img src="@/assets/images/zt-upgrade-1/prohibit.svg" />
              </el-tooltip>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>

    <el-dialog class="cuontry-dilalog" :title="edOradDigType ? '编辑' : '新增' + '国家信息'" :visible.sync="dialogVisibleAddOrEdit" width="760px" :before-close="handleClose">
      <div id="countryEditContent" v-loading="loading">
        <el-form :model="addFormList" class="countr-el-form" label-position="right" label-width="100px" :rules="formRule" ref="addCountryForm">
          <div>
            <el-form-item label="企业名称">
              <span>{{ enterpriseName }}</span>
            </el-form-item>
            <el-form-item label="国家名称" prop="countryNameZh">
              <el-select style="width: 200px" size="small" clearable filterable v-model="addFormList.countryNameZh" @change="changeCountry">
                <el-option v-for="item in countryCodeList" :key="item.countryCode" :value="item.countryName" :label="item.countryName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="启用R标交易" prop="enableRTrade">
              <el-switch v-model="addFormList.enableRTrade" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="手续费比例" prop="transFeeScale" v-if="addFormList.enableRTrade == 1">
              <el-input type="number" v-model="addFormList.transFeeScale" placeholder="设置默认交易手续费百分比" clearable style="width: 200px" size="small" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio v-model="addFormList.status" :label="0">启用</el-radio>
              <el-radio v-model="addFormList.status" :label="1">禁用</el-radio>
            </el-form-item>
            <el-form-item label="报税周期" prop="taxPeriod">
              <el-checkbox-group v-model="addFormList.taxPeriod">
                <el-checkbox label="0">月报</el-checkbox>
                <el-checkbox label="1">季报</el-checkbox>
                <el-checkbox label="2">年报</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="申报税率" prop="declareTax">
              <el-checkbox-group v-model="addFormList.declareTax">
                <el-checkbox :label="item" v-for="(item, index) in taxList" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="国家代码" prop="countryCode">
              <el-input v-model="addFormList.countryCode" placeholder="国家代码" clearable style="width: 200px" size="small" disabled />
            </el-form-item>
            <el-form-item label="英文名称" prop="countryNameEn">
              <el-input v-model="addFormList.countryNameEn" placeholder="英文名称" clearable style="width: 200px" size="small" />
            </el-form-item>
            <div v-if="addFormList.enableRTrade == 1">
              <div style="height: 50px"></div>
              <el-form-item label="转让费金额" prop="transFeeAmount">
                <el-input type="number" v-model="addFormList.transFeeAmount" placeholder="设置交易转让费用" clearable style="width: 200px" size="small" />
              </el-form-item>
            </div>
            <el-form-item label="国旗" prop="countryImgUrl">
              <UploadImage ref="uploadImageRef" :imageUrl="addFormList.countryImgUrl" :imgType="1" :on-success="uploadSuccess" upload-tips="上传图片"></UploadImage>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="_addCountryData()">保存</el-button>
        <el-button @click="dialogVisibleAddOrEdit = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCounrtyTableData, changeDisableStata } from "@/api/newApi/basementPaper/basementPaper.js";
import UploadImage from "@/components/UploadImage/index.vue";
import { getCountriesName } from "@/api/newApi/common.js";
import { addCountryData, getCountryById, getDeclareTax } from "@/api/newApi/basementPaper/basementPaper.js";
export default {
  components: { UploadImage },
  data() {
    return {
      // 分页
      enterpriseName: localStorage.getItem("enterpriseName"),
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        countryName: "",
        status: "",
      },
      tableLoading: false,
      //数据
      data: [],
      dialogVisibleAddOrEdit: false,
      edOradDigType: false,
      addFormList: {
        id: "",
        countryNameZh: "",
        countryNameEn: "",
        countryCode: "",
        status: 0,
        countryImgUrl: "",
        taxPeriod: [],
        declareTax: [],
        enableRTrade: 0,
        transFeeScale: '',
        transFeeAmount: ''
      },
      formRule: {
        countryNameZh: [{ required: true, message: "请输入名称", trigger: "blur" }],
        countryNameEn: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z ]+$/,
            message: "请输入正确数据",
            trigger: "blur",
          },
        ],
        // countryImgUrl: [{ required: true, message: "请上传国旗", trigger: "blur" }],
        taxPeriod: [
          {
            type: "array",
            required: true,
            message: "请选择报税周期",
            trigger: "change",
          },
        ],
        declareTax: [
          {
            type: "array",
            required: true,
            message: "请选择申报税率",
            trigger: "change",
          },
        ],
        transFeeScale: [
          { required: true, message: '设置默认交易手续费百分比', trigger: "blur"},
          {
            pattern: /^[0-9]\d*$/,
            message: "请输入非负整数",
            trigger: "blur",
          }
        ],
        transFeeAmount: [
          // { required: true, message: '设置转让费用金额', trigger: "blur"},
          {
            pattern: /^[0-9]\d*$/,
            message: "请输入非负整数",
            trigger: "blur",
          }
          ]
      },
      countryCodeList: [],
      taxList: [],
      loading: false,
      checkList: [],
    };
  },
  watch: {
    'addFormList.enableRTrade'(val) {
      if( val != 1) {
        this.addFormList.transFeeScale = ''
        this.addFormList.transFeeAmount = ''
      }
    }
  },
  created() {
    this._getCounrtyTableData();
  },
  methods: {
    handleClose(done) {
      done();
    },
    /**
     * 获取国家列表
     */
    _getCounrtyTableData() {
      this.tableLoading = true;
      getCounrtyTableData(
        this.listQuery.countryName,
        this.listQuery.pageSize,
        this.listQuery.pageNo,
        this.listQuery.status
      )
        .then((res) => {
          this.data = res.data.records;
          this.listTotal = parseInt(res.data.total);
          this.tableLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
    },

    handleReset() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        countryName: "",
        status: "",
      };
      this._getCounrtyTableData();
    },
    _addCountryData() {
      this.$refs["addCountryForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const { countryCode, countryImgUrl, countryNameEn, countryNameZh, status, declareTax, taxPeriod, id, enableRTrade, transFeeScale, transFeeAmount } =
            this.addFormList;
          let data = {
            countryCode,
            countryImgUrl,
            countryNameEn,
            status,
            countryNameZh,
            declareTax: declareTax.join(","),
            taxPeriod: taxPeriod.join(","),
            id,
            enableRTrade: Number(enableRTrade),
            transFeeScale: Number(transFeeScale),
            transFeeAmount: Number(transFeeAmount)
          };
          addCountryData(data)
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: "'操作成功'",
                });
                this.dialogVisibleAddOrEdit = false;
                this._getCounrtyTableData();
              }
              this.loading = false;
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
        } else {
          this.$message({
            message: "请检查输入的数据",
            type: "warning",
          });
          return false;
        }
      });
    },

    getInfo(id) {
      getCountryById({ id }).then((res) => {
        let result = res.data;
        result.declareTax = result.declareTax.split(",").filter((item) => item !== "");
        result.taxPeriod = result.taxPeriod.split(",").filter((item) => item !== "");
        this.addFormList = result;
        // 未开启
        if( result.enableRTrade != 1 ) {
          this.addFormList.transFeeScale = ''
          this.addFormList.transFeeAmount = ''
        }
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this._getCounrtyTableData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this._getCounrtyTableData();
    },

    /**
     * 编辑弹框
     */
    showEditModal(row, type) {
      this.dialogVisibleAddOrEdit = true;
      this.edOradDigType = type;
      this.initData();
      if (type) {
        this.addFormList = row;
        this.getInfo(row.id);
      } else {
        this.addFormList = {
          id: "",
          countryNameZh: "",
          countryNameEn: "",
          countryCode: "",
          status: 0,
          countryImgUrl: "",
          taxPeriod: [],
          declareTax: [],
          enableRTrade: 0,
          transFeeScale: '',
          transFeeAmount: ''
        };
      }
    },

    async initData() {
      await this._getCountryCode();
      await this._getDeclareTax();
    },

    _getCountryCode() {
      return new Promise((resolve) => {
        getCountriesName().then((res) => {
          this.countryCodeList = res.data;
          resolve();
        });
      });
    },
    changeCountry(e) {
      this.addFormList.countryCode = this.countryCodeList.find((item) => item.countryName === e).countryCode;
    },

    _getDeclareTax() {
      return new Promise((resolve) => {
        getDeclareTax().then((res) => {
          this.taxList = res.data;
          resolve();
        });
      });
    },
    uploadSuccess(v) {
      this.addFormList.countryImgUrl = v.file.fileUrl;
    },
    /**
     * 切换禁用启用
     */
    _changeDisableStatus(row) {
      this.$confirm(`是否确认要${row.status === 0 ? "禁用" : "启用"}吗? `, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.tableLoading = true;
          changeDisableStata(row.id)
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: "操作成功",
                });

                this._getCounrtyTableData();
              }
              this.tableLoading = false;
            })
            .catch((err) => {
              console.log(err);
              this.tableLoading = false;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped lang="less"></style>
<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
.cuontry-dilalog {
  #countryEditContent {
    padding: 0%;
    min-height: 0px;
    .countr-el-form {
      display: grid;
      grid-template-columns: repeat(2, 50%);
      justify-items: center;
    }
  }
  /deep/.el-dialog .el-dialog__footer {
    padding: 0px 55px 30px 30px;
  }
  /deep/ .el-dialog__body {
    padding: 30px 20px 0px 20px;
  }
}
</style>
