<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline :model="listQuery">
        <el-form-item label="手机号" prop="userMobile">
          <el-input v-model="listQuery.userMobile" placeholder="请输入手机号" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item label="跟进情况(VAT服务)" prop="vatFollowSituations">
          <el-select v-model="listQuery.vatFollowSituations" clearable filterable multiple placeholder="请选择">
            <el-option :value="item" :label="item" v-for="item in followSituationList" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进情况(知识产权)" prop="zsFollowSituations">
          <el-select v-model="listQuery.zsFollowSituations" clearable filterable multiple placeholder="请选择">
            <el-option :value="item" :label="item" v-for="item in zsFollowSituationList" :key="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="跟进情况(合规服务)" prop="hgFollowSituations">
          <el-select v-model="listQuery.hgFollowSituations" clearable filterable multiple placeholder="请选择">
            <el-option :value="item" :label="item" v-for="item in followSituationList" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="累积购买类目" prop="categoryNames">
          <el-select v-model="listQuery.categoryNames" clearable filterable multiple placeholder="请选择">
            <el-option :value="item" :label="item" v-for="(item, index) in categoryList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进人" prop="followUserIds">
          <el-select v-model="listQuery.followUserIds" clearable filterable multiple placeholder="请选择">
            <!-- <el-option :value="item.userId" :label="item.nickName" v-for="item in userList" :key="item.userId"></el-option> -->
            <el-option-group>
              <li class="option_title" style="background: #f6f8fa">
                <span>姓名</span>
                <span>手机号</span>
                <span>部门</span>
              </li>
              <el-option class="option_title" v-for="item in userList" :key="item.userId" :value="item.userId" :label="item.nickName">
                <span>{{ item.nickName }}</span>
                &nbsp;
                <span>{{ item.mobile }}</span>
                &nbsp;
                <span>{{ item.departmentName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="所属企业" prop="enterpriseId">
          <el-select v-model="listQuery.enterpriseId" placeholder="选择企业" clearable>
            <el-option value="" key="" label="全部"></el-option>
            <el-option :value="item.id" :label="item.name" v-for="item in firmList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择部门" prop="departmentIds">
          <el-cascader
            size="small"
            ref="department"
            :options="departmentList"
            :props="{
              multiple: true,
              label: 'departmentName',
              value: 'departmentId',
              children: 'childXcloudOrgDepartmentListVO',
              emitPath: false,
            }"
            collapse-tags
            filterable
            clearable
            v-model="listQuery.departmentIds"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" :data="list" v-loading="listLoading" show-summary :summary-method="getSummaries" :height="tableHeight" highlight-current-row border element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="姓名(微信昵称)" width="180" prop="nickName">
          <template slot-scope="scope">
            <NameEditor :row="scope.row" @handleEdit="changeRow" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号" prop="userMobile" show-overflow-tooltip min-width="80">
          <template slot-scope="{ row }">
            <span v-hidden :key="row.oldAccountId">{{ row.userMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="公司名称" prop="company" show-overflow-tooltip min-width="150"> </el-table-column>
        <el-table-column align="center" label="累计购买类目" prop="categoryName" show-overflow-tooltip min-width="150"> </el-table-column>
        <el-table-column align="center" label="类目数量" prop="categoryName" show-overflow-tooltip min-width="80">
          <template slot-scope="{ row }">{{ row.categoryName | filterCategoryNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="跟进情况(VAT服务)" prop="vatFollowSituation" show-overflow-tooltip min-width="150">
          <template slot-scope="{ row }">
            <el-select v-model="row.vatFollowSituation" placeholder="请选择" @change="(e) => changeRow(e, row)">
              <el-option :value="item" :label="item" v-for="item in followSituationList" :key="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="跟进情况(知识产权)" prop="zsFollowSituation" show-overflow-tooltip min-width="150">
          <template slot-scope="{ row }">
            <el-select v-model="row.zsFollowSituation" placeholder="请选择" @change="(e) => changeRow(e, row)">
              <el-option :value="item" :label="item" v-for="item in zsFollowSituationList" :key="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="跟进情况(合规服务)" prop="hgFollowSituation" show-overflow-tooltip min-width="150">
          <template slot-scope="{ row }">
            <el-select v-model="row.hgFollowSituation" placeholder="请选择" @change="(e) => changeRow(e, row)">
              <el-option :value="item" :label="item" v-for="item in followSituationList" :key="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip min-width="150"> </el-table-column>
        <el-table-column align="center" label="跟进人" prop="followUserName" show-overflow-tooltip min-width="150"> </el-table-column>
        <el-table-column align="center" label="跟进人部门" prop="departmentName" show-overflow-tooltip min-width="100"> </el-table-column>
        <el-table-column align="center" label="跟进时间" prop="situationTime" show-overflow-tooltip min-width="150"> </el-table-column>
        <el-table-column align="center" label="企业主体" prop="enterpriseId" show-overflow-tooltip min-width="80">
          <template slot-scope="{ row }"> {{ firmListMap[row.enterpriseId] }} </template>
        </el-table-column>
        <el-table-column align="center" label="系统" prop="newSystem" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.newSystem | filterSystem }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="备注" placement="top" v-show="hasAuthority('C1_23')">
              <el-link type="primary" :underline="false" @click="addRemark(scope.row)">
                <i class="icon icon-remarks"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>

    <!-- 添加备注 -->
    <el-dialog :visible.sync="remarkDialog" width="400px" class-name="distribution" title="添加备注" @close="reset">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入" clearable size="small" type="textarea" style="width: 300px" rows="4" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkDialog = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="addRemarkConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { userOldAccountList, editOldAccount, getTotalCustomer } from '@/api/newApi/customer/cumulativePurchase.js';
import { getProductAttrlist } from '@/api/newApi/servicemerchant/productAttributes.js';
import { getFirm } from '@/api/newApi/common.js';
import { getUsers } from '@/api/user';
import { getDepartmentTree } from '@/api/department';
import NameEditor from './components/NameEditor';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  mixins: [cacheQuery],
  components: {
    NameEditor,
  },
  data() {
    return {
      list: [],
      listLoading: false,
      // 分页
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
        categoryNames: [],
        hgFollowSituations: [],
        vatFollowSituations: [],
        zsFollowSituations: [],
        departmentIds: [],
        followUserIds: [],
        userMobile: '',
        enterpriseId: '',
      },
      form: {
        remark: '',
      },
      departmentList: [],
      remarkDialog: false, //跟进人弹窗
      searchFlag: false,
      cacheKey: 'listQuery',
      copyListQuery: {},
      followSituationList: ['已联系确认续费(已续费)', '已联系确认续费(待续费)', '已联系未确认', '意向客户', '转走', '店铺注销', '不续费不注销', '无法联系', '注销', '已联系无意向', '未联系'],
      zsFollowSituationList: ['已联系无意向', '已增购', '意向客户', '无法联系', '店铺注销', '未联系'],
      categoryList: ['财赋优', '海外工商', '外观专利', '知识产权', '合规服务', 'VAT服务', '其他'], // 大类目暂时写死，接口无法提供
      userList: [],
      rules: {
        remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }],
      },
      checkedItem: {},
      totalCustomer: {},
      firmList: [],
      firmListMap: {},
    };
  },
  filters: {
    filterSystem(newSystem) {
      switch (newSystem) {
        case 1:
          return '新系统';
        case 2:
          return '必胜道';
        default:
          return newSystem;
      }
    },
    filterCategoryNum(categoryName) {
      if (categoryName) {
        return (categoryName + '').split(',').filter((item) => item).length;
      } else {
        return 0;
      }
    },
  },
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getDepartmentAllList();
    this.getPageCache();
    this.queryData();
    this.getFirmList();
    // this._getallcategory();
    this._getUser();
  },
  methods: {
    /**
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.setPageCache();
      this.getTotal();
      userOldAccountList(this.listQuery)
        .then((res) => {
          if (res.code == 0) {
            this.listLoading = false;
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    getTotal() {
      getTotalCustomer(this.listQuery).then((res) => {
        if (res.code === 0) {
          this.totalCustomer = res.data;
        }
      });
    },
    //合计显示
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        switch (column.property) {
          case 'userMobile': //这是是根据prop来判断是那一列的数据
            sums[index] = this.totalCustomer.totalNum;
            break;
          case 'vatFollowSituation':
            sums[index] = this.totalCustomer.vatNum;
            break;
          case 'zsFollowSituation':
            sums[index] = this.totalCustomer.zsNum;
            break;
          case 'hgFollowSituation':
            sums[index] = this.totalCustomer.hgNum;
            break;
          case 'nickName':
            sums[index] = '覆盖率' + this.totalCustomer.coverage;
            break;
          default:
            break;
        }
      });
      return sums;
    },
    // 获取部门列表
    getDepartmentAllList() {
      return new Promise((resolve) => {
        getDepartmentTree().then((res) => {
          if (res.code === 0) {
            // this.departmentList = res.data
            this.departmentList = this.filterTree(res.data, 'childXcloudOrgDepartmentListVO');
            resolve();
          }
        });
      });
    },
    // 过滤为空的子列表
    filterTree(data, childrenKey) {
      data = data.filter((item) => item.status === 1);
      data.forEach((item) => {
        if (item[childrenKey].length) {
          item[childrenKey] = this.filterTree(item[childrenKey], childrenKey);
        } else {
          item[childrenKey] = undefined;
        }
      });
      return data;
    },
    _getallcategory() {
      getProductAttrlist({
        page: 1,
        limit: -1,
        status: 1,
      }).then((res) => {
        if (res.code == 0) {
          this.categoryList = res.data.records;
        }
      });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },
    getFirmList() {
      getFirm().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
          this.firmListMap = {};
          for (let item of res.data) {
            this.firmListMap[item.id] = item.name;
          }
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    // 获取跟进人列表
    _getUser() {
      getUsers({
        page: 1,
        limit: -1,
      }).then((res) => {
        this.userList = res.data.records;
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryData();
    },
    // 重置
    resetForm() {
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
    },
    /**
     * 添加备注弹窗
     */
    addRemark(row) {
      this.checkedItem = row;
      this.remarkDialog = true;
    },
    /**
     * 添加备注确认
     */
    addRemarkConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          editOldAccount({
            newSystem: this.checkedItem.newSystem,
            oldAccountId: this.checkedItem.oldAccountId,
            remark: this.form.remark,
            followUserId: this.checkedItem.followUserId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('添加成功');
              this.remarkDialog = false;
              this.queryData();
            }
          });
        }
      });
    },
    // 修改数据（跟进情况，昵称）
    changeRow(e, row) {
      const { nickName, vatFollowSituation, hgFollowSituation, zsFollowSituation, oldAccountId, newSystem, followUserId } = row;
      editOldAccount({
        nickName,
        vatFollowSituation,
        hgFollowSituation,
        zsFollowSituation,
        oldAccountId,
        newSystem,
        followUserId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功');
        }
      });
    },
    reset() {
      this.$refs['form'].resetFields();
    },
  },
};
</script>
<style scoped lang="less">
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}

/deep/.el-table__footer-wrapper tbody td:nth-of-type(2) {
  font-size: 15px;
  color: #1890ff;
  font-weight: 800;
}
</style>
