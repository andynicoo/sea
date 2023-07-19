<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div>
        <!-- 查询条件 -->
        <div class="search-box">
          <el-form ref="searchForm" inline label-width="80" :model="listQuery" :rules="formRule">
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input
                v-model="listQuery.bankAccount"
                placeholder="银行账号"
                clearable
                style="width: 168px"
                size="small"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select style="width: 120px" size="small" v-model="listQuery.status" clearable>
                <el-option :value="0" label="启用">启用</el-option>
                <el-option :value="1" label="禁用">禁用</el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="企业主体" prop="status">
              <!-- <el-select v-model="listQuery.enterpriseIdList" placeholder="请选择公司主体" clearable multiple filterable>
                <el-option v-for="item in firmList" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select> -->
              <EnterpriseSelect v-model="listQuery" :width="168" showAllOption selectCurOption multiple clearable filterable />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="_getBankTableList" icon="el-icon-search">搜索</el-button>
              <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
            </el-form-item>

            <el-form-item style="float: right">
              <el-button
                type="success"
                icon="el-icon-plus"
                v-show="hasAuthority('B1_1')"
                @click="showEditModal(null, false)"
                size="small"
              >
                新增银行
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <!-- <el-table border :data="data" element-loading-spinner="icon loading" element-loading-text="拼命加载中"> -->
      <el-table
        ref="table"
        border
        :data="data"
        v-loading="tableLoading"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        :height="tableHeight"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="编号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="银行帐号"
          prop="bankAccount"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="开户银行"
          prop="bankName"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="账户名称"
          prop="accountName"
          width="200"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column align="center" label="类型">
          <template slot-scope="scope">{{ scope.row.type == 1 ? "公户" : "私户" }}</template>
        </el-table-column>
        <el-table-column align="center" label="帐号类型">
          <template slot-scope="scope">{{ getAccountType(scope.row.accountType) }}</template>
        </el-table-column>
        <el-table-column align="center" label="收款公司" width="200">
          <template slot-scope="scope">{{ scope.row.transferAccountName }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span class="text-success" v-if="scope.row.status == 0">
              <span>
                <i class="icon icon-stuts-enable" style="margin: 0px; width: 10px"></i>
                启用
              </span>
            </span>
            <span class="text-danger" v-else>
              <i class="icon icon-stuts-disable" style="margin: 0px; width: 10px"></i>
              禁用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否默认">
          <template slot-scope="scope">
            {{ scope.row.isDefault == 0 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createName"></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName"></el-table-column>
        <el-table-column
          align="center"
          label="修改时间"
          prop="updateTime"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" class="icon" placement="top" v-show="hasAuthority('B1_2')">
              <el-link type="primary" :underline="false" @click="showEditModal(scope.row, true)">
                <img src="@/assets/images/zt-upgrade-1/edit.svg" />
              </el-link>
            </el-tooltip>
            <!--  @click="changeDisableStatus(scope.row)" -->
            <el-link
              type="primary"
              class="icon"
              :underline="false"
              @click="openDialog(scope.row)"
              v-show="hasAuthority('B1_3')"
            >
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
    <el-dialog :visible.sync="dialogVisibleTips" class="tipsDiagin" :before-close="handleClose">
      <div slot="title">
        <div class="digTitle">
          <img src="@/assets/images/zt-upgrade-1/tips.svg" width="29px" height="29px" />
          <span>提示</span>
        </div>
      </div>
      <span style="margin-left: 57px">确认要 {{ statusItem && statusItem.status == 0 ? "禁用" : "启用" }} 么?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTips = false">取 消</el-button>
        <el-button type="primary" @click="changeDisableStatus()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="edOradDigType ? '编辑银行' : '新增银行'"
      :visible.sync="dialogVisibleAddOrEdit"
      width="690px"
      :before-close="handleClose"
    >
      <div class="elorAdMain">
        <el-form label-position="right" label-width="100px" :model="addFormList" :rules="formRule" ref="addbankform">
          <el-form-item label="企业主体">
            <!-- <span>{{ enterpriseName }}</span> -->
            <el-select v-model="addFormList.enterpriseId" placeholder="请选择公司主体" clearable filterable>
             <el-option v-for="item in firmList" :value="item.id" :key="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="银行账号" prop="bankAccountSonPage">
            <el-input
              v-model="addFormList.bankAccount"
              placeholder="银行账号"
              clearable
              style="width: 200px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="账户名称" prop="accountName">
            <el-input
              v-model="addFormList.accountName"
              placeholder="账户名称"
              clearable
              style="width: 200px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="开户银行" prop="bankName">
            <el-input
              v-model="addFormList.bankName"
              placeholder="开户银行"
              clearable
              style="width: 200px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="账号类型" prop="accountType">
            <el-select style="width: 200px" size="small" v-model="addFormList.accountType">
              <el-option :value="1" label="网银转账">网银转账</el-option>
              <el-option :value="2" label="微信">微信</el-option>
              <el-option :value="3" label="支付宝">支付宝</el-option>
              <el-option :value="4" label="paypal">paypal</el-option>
              <el-option :value="5" label="ebay">ebay</el-option>
              <el-option :value="6" label="Airwallex">Airwallex</el-option>
              <el-option :value="7" label="Lianlianpay">Lianlianpay</el-option>
              <el-option :value="8" label="万里汇">万里汇</el-option>
              <el-option :value="9" label="P卡">P卡</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="类型" prop="type">
            <el-select style="width: 200px" size="small" v-model="addFormList.type">
              <el-option :value="1" label="公户">公户</el-option>
              <el-option :value="2" label="私户">私户</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否默认" prop="isDefault">
            <el-radio v-model="addFormList.isDefault" :label="0">是</el-radio>
            <el-radio v-model="addFormList.isDefault" :label="1">否</el-radio>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select style="width: 200px" size="small" v-model="addFormList.status">
              <el-option :value="0" label="启用">启用</el-option>
              <el-option :value="1" label="禁用">禁用</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开户地" prop="accountOpeningLocation">
            <el-select style="width: 200px" size="small" v-model="addFormList.accountOpeningLocation" multiple>
              <el-option value="CH" label="大陆">大陆</el-option>
              <el-option value="IN" label="境外">境外</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="收款公司名称" prop="transferAccountName">
            <el-input v-model="addFormList.transferAccountName" style="width: 200px" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddOrEdit = false">取 消</el-button>
        <el-button type="primary" size="small" @click="addOrUpdate">保存</el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash';
import { getFirm } from '@/api/newApi/common';
import { getBankTableList, changeBankState } from "@/api/newApi/basementPaper/basementPaper.js";
import { addBank, updateBank } from "@/api/newApi/basementPaper/basementPaper.js";
import EnterpriseSelect from '@/components/enterprise-select'
export default {
  components: { EnterpriseSelect },
  data() {
    return {
      // 分页
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        bankAccount: "",
        status: 0,
        enterpriseIdList:[]
      },
      formRule: {
        bankAccount: [
          { required: true, message: "请输入银行账号", trigger: "blur" },
          {
            pattern: /^-?\d+\.?\d*$/,
            message: "请输入正确数据",
            trigger: "blur",
          },
        ],
        accountName: [{ required: true, message: "请输入账户名称", trigger: "blur" }],
        bankName: [{ required: true, message: "请输入开户银行", trigger: "blur" }],
      },
      addFormList: {
        id: "",
        bankAccount: "",
        accountName: "",
        bankName: "",
        accountType: 1,
        type: 1,
        isDefault: 0,
        status: 0,
        enterpriseId: "",
        accountOpeningLocation:[],
        transferAccountName: '', // 收款公司名称
      },
      tableLoading: false,
      //数据
      data: [],
      dialogVisibleTips: false,
      dialogVisibleAddOrEdit: false,
      statusItem: null,
      edOrAddItem: null,
      edOradDigType: true,
      enterpriseName: "",
      firmList: [], // 企业列表
    };
  },
  async created() {
    this.listQuery.enterpriseIdList= [Number(localStorage.getItem("enterpriseId"))];
    this._getBankTableList();
    this.enterpriseName = this.$util.getLocalStorage("enterpriseName");
    await this.getFirmList();
  },
  mounted() {
    this.addFormList.enterpriseId = Number(this.$util.getLocalStorage('enterpriseId'));
  },
  methods: {
    _getBankTableList() {
      this.tableLoading = true;
      getBankTableList(this.listQuery)
        .then((res) => {
          this.data = res.data.records;
          this.listTotal = parseInt(res.data.total);
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    handleReset() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        bankAccount: "",
        status: 0,
        enterpriseIdList:[Number(localStorage.getItem("enterpriseId"))]
      };
      this._getBankTableList();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this._getBankTableList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this._getBankTableList();
    },

    getAccountType(v) {
      switch (parseInt(v)) {
        case 1:
          return "网银转账";
        case 2:
          return "微信";
        case 3:
          return "支付宝";
        case 4:
          return "paypal";
        case 5:
          return "ebay";
        case 6:
          return "Airwallex";
        case 7:
          return "Lianlianpay";
        case 8:
          return "万里汇";
        case 9:
          return "P卡";
        default:
          break;
      }
    },

    /**
     * 编辑弹框
     */
    showEditModal(row, type) {
      this.dialogVisibleAddOrEdit = true;
      this.edOradDigType = type;
      console.log(this.addFormList)
      if (type) {
        this.addFormList = {
          id: row.id,
          bankAccount: row.bankAccount,
          accountName: row.accountName,
          bankName: row.bankName,
          accountType: row.accountType,
          type: row.type,
          isDefault: row.isDefault,
          status: row.status,
          enterpriseId: row.enterpriseId,
          accountOpeningLocation: row.accountOpeningLocation===''?[]:row.accountOpeningLocation.split(','),
          transferAccountName: row.transferAccountName
        };
      } else {
        this.addFormList = {
          id: "",
          bankAccount: "",
          accountName: "",
          bankName: "",
          accountType: 1,
          type: 1,
          isDefault: 0,
          status: 0,
          enterpriseId: this.addFormList.enterpriseId,
          accountOpeningLocation: [],
          transferAccountName: ''
        };
      }
    },

    handleClose(done) {
      done();
    },

    openDialog(row) {
      this.statusItem = row;
      this.dialogVisibleTips = true;
    },
    async addOrUpdate() {
      let addFormList = cloneDeep(this.addFormList);
      addFormList.accountOpeningLocation= addFormList.accountOpeningLocation.join(',')
      this.$refs["addbankform"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          if (!this.addFormList.id) {
            await addBank(addFormList)
              .then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: "success",
                    message: "'操作成功'",
                  });
                  // this.back();
                }
                this.loading = false;
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          } else {
            await updateBank(addFormList)
              .then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: "success",
                    message: "'操作成功'",
                  });
                  // this.back();
                }
                this.loading = false;
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          }
          this._getBankTableList();
          this.dialogVisibleAddOrEdit = false;
        } else {
          this.$message({
            message: "请检查输入的数据",
            type: "warning",
          });
          return false;
        }
      });
    },
    /**
     * 切换禁用启用
     */
    changeDisableStatus() {
      changeBankState(this.statusItem.id).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this._getBankTableList();
        }
        this.tableLoading = false;
        this.dialogVisibleTips = false;
      });
    },
    /**
     * 获取企业列表
     */
     getFirmList() {
      getFirm().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.tipsDiagin {
  /deep/.el-dialog {
    width: 500px;
    height: 222px;
    background: #ffffff;
    border-radius: 10px;
  }
}
.digTitle {
  display: flex;
  justify-items: center;
  span {
    height: 29px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 29px;
    padding-left: 10px;
  }
}

.elorAdMain {
  width: 100%;
  > form {
    display: grid;
    grid-template-columns: repeat(2, 50%);
  }
}
</style>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>
