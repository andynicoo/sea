<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <el-form-item label="工单类型" prop="workOrderType">
            <el-cascader placeholder="请选择" size="small" filterable v-model="form.workOrderType" @change="changeSupplier()" :options="functionCodeList"></el-cascader>
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.countryCode" @change="changeSupplier('list')">
              <el-option v-for="item in countrySelectList" :key="item.countryCode" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="isUse">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable v-model="form.isUse">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right" v-show="hasAuthority('L2_1')">
            <div class="header-btn-group">
              <el-button type="primary" size="small" class="green-btn" @click="add">
                <i class="icon icon-square-add"></i>
                <span>新建</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="工单类型" width="328" show-overflow-tooltip prop="workOrderTypeName">
          <!-- <template slot-scope="{row}">{{row.functionCode | filterFunctionCode}}</template> -->
        </el-table-column>
        <el-table-column align="center" label="国家" width="328" show-overflow-tooltip prop="countryCodeName"> </el-table-column>

        <el-table-column align="center" label="监控区间" show-overflow-tooltip prop="warnDuration">
          <template slot="header">
            监控区间:
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">工单类型要监控的节点范围，以预警时效和交付时效监控该范围的服务用时，并标记出服务的预警和超时</div>
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{ row }">{{ setMonitorVal(row.workOrderType) }}</template>
        </el-table-column>
        <el-table-column align="center" sortable :sort-by="['warnDurationSort']" label="预警时效" show-overflow-tooltip prop="warnDuration">
          <template slot="header">
            预警时效
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">当监控区间的服务用时大于预警时效时，服务单进入预警工单，且异常状态为预警</div>
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{ row }">{{ row.warnDuration }}{{ row.timeUnitName }}</template>
        </el-table-column>
        <el-table-column align="center" sortable :sort-by="['warnDurationSort']" label="交付时效" show-overflow-tooltip prop="deliverDuration">
          <template slot="header">
            交付时效
            <el-tooltip class="item" effect="dark" content="" placement="top-start">
              <div slot="content">当监控区间的服务用时大于交付时效时，服务单异常状态由预警变为超时</div>
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{ row }">{{ row.deliverDuration }}{{ row.timeUnitName }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" show-overflow-tooltip prop="isUse">
          <template slot-scope="{ row }">{{ row.isUse == 1 ? '启用' : '禁用' }}</template>
        </el-table-column>
        <el-table-column align="center" width="173" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" v-show="hasAuthority('L2_2')">
              <el-link type="primary" :underline="false" icon="icon icon-edit" @click="edit(scope.row)"> </el-link>
            </el-tooltip>
            <el-tooltip content="查看" placement="top" v-show="hasAuthority('xcloudplat_deliverConfig_seerecord')">
              <el-link type="primary" :underline="false" @click="openDetail(scope.row)">
                <i class="icon icon-see"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="停用" placement="top" v-if="scope.row.isUse" v-show="hasAuthority('xcloudplat_deliverConfig_deactivate')">
              <el-link type="primary" :underline="false" @click="deactivate(scope.row)">
                <i class="icon icon-disable"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="启用" placement="top" v-else v-show="hasAuthority('xcloudplat_deliverConfig_enable')">
              <el-link type="primary" :underline="false" @click="enable(scope.row)">
                <img src="@/assets/images/zt-upgrade-1/enable.svg" style="margin-right: 12px" />
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog-container">
      <el-dialog :title="!this.checkId ? '新增' : '编辑'" :visible.sync="addDialogVisible" width="480px" center @close="resetAddFields">
        <el-form :model="addForm" :rules="formRule" ref="addDialogForm" label-width="120px">
          <el-form-item label="工单类型" prop="workOrderType">
            <el-cascader placeholder="请选择" size="small" filterable v-model="addForm.workOrderType" @change="addWorkOrderType" :options="functionCodeList"></el-cascader>
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select style="width: 200px" size="small" v-model="addForm.countryCode" clearable filterable>
              <el-option v-for="item in countrySelectList" :key="item.countryCode" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="时效单位" prop="timeUnit">
            <el-select style="width: 200px" size="small" placeholder="请选择时效计量单位" v-model="addForm.timeUnit" filterable @change="changeSupplier('addForm')">
              <el-option v-for="item in prescriptionDateList" :key="item.value" :value="item.type" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监控区间" prop="monitor">
            <el-select style="width: 100px" size="small" v-model="monitor.star" disabled></el-select>
            至
            <el-select style="width: 100px" v-model="monitor.end" disabled size="small"></el-select>
          </el-form-item>
          <el-form-item label="预警时效" prop="warnDuration">
            <el-input v-model="addForm.warnDuration" placeholder="请输入" type="number" min="1" style="width: 200px" size="small" />&nbsp;
            {{ setTimeUnit }}
          </el-form-item>
          <el-form-item label="交付时效" prop="deliverDuration">
            <el-input v-model="addForm.deliverDuration" placeholder="请输入" type="number" min="1" style="width: 200px" size="small" />&nbsp;
            {{ setTimeUnit }}
          </el-form-item>
        </el-form>
        <div class="text-warning">提示：预警时效小于交付时效，且都是大于0的正整数</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="buttonLoading" @click="submit">确 认</el-button>
          <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <DetailDialog :detailDialog.sync="detailDialog" :id="checkId" />
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[20, 50, 100]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <DetailsModal ref="DetailsModal" :list="records.durationConfigsLogsVOS" />
  </div>
</template>

<script>
import DetailDialog from './components/detailDialog.vue';
import DetailsModal from './components/DetailsModal.vue';
import { durationConfigsList, durationConfigsEdit, durationConfigsSave, durationConfigChange, openOrClose } from '@/api/newApi/limitData/deliverConfig';
import { getCountrySelectList } from '@/api/newApi/common.js';
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
import { supplyFunCodes, prescriptionDateList, countryArr, monitorEnum } from '../../supplierPublic/enum.js';
import { filterCountry, rqWorkOrderType } from '../../supplierPublic/supplieUtil.js';

export default {
  data() {
    var validateSupplier = (rule, value, callback) => {
      if (value.some((item) => !item.supplierId)) {
        callback(new Error('请选择服务商'));
      } else {
        callback();
      }
    };
    var validateDuration = (rule, value, callback) => {
      if (value < 1 || (+value + '').split('.').length !== 1) {
        callback(new Error('时效是大于0的正整数'));
      } else {
        callback();
      }
    };
    return {
      tableLoading: false,
      functionCodeList: supplyFunCodes,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 50,
        workOrderType: '', //工单类型
        isUse: '', //状态
        countryCode: '', //国家code
      },

      statusList: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
      searchFlag: false,
      addDialogVisible: false,
      buttonLoading: false,
      addForm: {
        workOrderType: '',
        countryCode: '',
        warnDuration: '',
        deliverDuration: '',
        // prescriptionDate: 2,
      },
      addSupplierItem: {
        supplierId: '',
        supplierName: '',
      },
      formRule: {
        workOrderType: [{ required: true, message: '请选择工单类型', trigger: 'blur' }],
        countryCode: [{ required: true, message: '请选择国家', trigger: 'blur' }],
        timeUnit: [{ required: true, message: '请选择时效单位', trigger: 'blur' }],
        warnDuration: [
          { required: true, message: '请输入预警时效', trigger: 'blur' },
          { validator: validateDuration, trigger: 'blur' },
        ],
        deliverDuration: [
          { required: true, message: '请输入交付时效', trigger: 'blur' },
          { validator: validateDuration, trigger: 'blur' },
        ],
      },
      checkId: '',
      monitor: {
        star: '监控开始',
        end: '监控结束',
      },
      detailDialog: false,
      countrySelectList: [],
      prescriptionDateList: prescriptionDateList,
      supplierList: [],
      addFormSupplierList: [],
      records: {},
    };
  },
  filters: {
    filterFunctionCode(functionCode) {
      let functionCodeItem = functionCodeList.find((item) => item.type === functionCode);
      return functionCodeItem ? functionCodeItem.label : '';
    },
  },
  computed: {
    setTimeUnit() {
      let val = this.addForm.timeUnit;

      return val == 'DAY' ? '天' : val == 'WEEK' ? '周' : '月';
    },
  },
  components: {
    DetailDialog,
    DetailsModal,
  },
  mounted() {
    this.addSupplier(0);
    this.getList();
    this._getCountrySelectList();
  },
  methods: {
    //查看
    openDetail(row) {
      this.records = row || {};
      this.$refs.DetailsModal.showModal = true;
    },
    //启用
    enable(row) {
      openOrClose({
        id: row.id,
      }).then((res) => {
        this.$message.success('操作成功');
        this.getList();
      });
    },
    //停用
    deactivate(row) {
      openOrClose({
        id: row.id,
      }).then((res) => {
        this.$message.success('操作成功');
        this.getList();
      });
    },
    /**时效排序 */
    // dateSort(row, index) {
    //   if (timeUnitName == "月") {
    //     row.numberTime = 3;
    //   } else if (timeUnitName == "周") {
    //     row.numberTime = 2;
    //   } else {
    //     row.numberTime = 1;
    //   }
    //   return [numberTime, warnDuration, warnDurationSort];
    // },
    /**新增排序属性 */
    setWarnDurationSort(timeUnitName, warnDuration) {
      let time = 1;
      if (timeUnitName == '月') {
        time = 30;
      } else if (timeUnitName == '周') {
        time = 7;
      }
      return warnDuration * time;
    },
    getList() {
      this.tableLoading = true;
      let fromData = JSON.parse(JSON.stringify(this.form));
      fromData.size = fromData.limit;
      fromData.current = fromData.page;
      delete fromData.limit;
      delete fromData.page;

      durationConfigsList(this.filterHttpPram(fromData))
        .then((res) => {
          let records = res.data.records;
          records.forEach((item) => (item.warnDurationSort = this.setWarnDurationSort(item.timeUnitName, item.warnDuration)));
          this.list = records;

          this.total = parseInt(res.data.total);

          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: 'success',
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },

    /** 监控区间 */
    setMonitorVal(data) {
      return monitorEnum.find((item) => item.id == data).section || '';
    },
    /** 过滤请求参数 */
    filterHttpPram(data) {
      // if (data.workOrderType && data.workOrderType.length == 2) data.workOrderType = data.workOrderType[1];

      data.workOrderType = rqWorkOrderType(data.workOrderType);
      let newData = JSON.parse(JSON.stringify(data));
      Object.keys(newData).forEach((item) => {
        if (newData[item] === '') newData[item] = null;
      });

      return newData;
    },

    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        let { data } = res;
        this.countrySelectList = data;
      });
    },

    // 获取服务商列表
    getSuppliers(functionCodes, countryCode, type) {
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCodes,
        countryCode,
      }).then((res) => {
        let list = res.data.records;
        if (type === 'list') {
          this.supplierList = list;
        } else if (type === 'addForm') {
          this.addFormSupplierList = list;
        } else {
          this.supplierList = list;
          this.addFormSupplierList = list;
        }
      });
    },

    /** 选择工单类型 联动监控区间  */
    addWorkOrderType(data) {
      let regionArr = monitorEnum.find((item) => item.id == rqWorkOrderType(data)).section.split(' - ');
      this.monitor = {
        star: regionArr[0],
        end: regionArr[1],
      };
    },

    changeSupplier(type) {
      if (type === 'list') {
        this.form.supplierId = '';
      } else if (type === 'addForm') {
      }
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
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    reset() {
      if (this.$refs.searchForm) {
        this.$refs.searchForm.workOrderType = '';
        this.form.workOrderType = '';
        this.$refs.searchForm.resetFields();
      }
    },
    addSupplier(index) {
      // this.addForm.supplierList.splice(index + 1, 0, { ...this.addSupplierItem });
    },
    delSupplier(index) {
      // this.addForm.supplierList.splice(index, 1);
    },
    add() {
      this.checkId = '';
      this.addDialogVisible = true;
    },

    /**点击编辑 */
    edit(row) {
      let newAddform = { ...this.addForm };
      Object.keys(newAddform).forEach((item) => {
        newAddform[item] = row[item];
      });
      this.addWorkOrderType(newAddform.workOrderType);
      newAddform.id = row.id;
      this.addDialogVisible = true;
      this.$nextTick(() => {
        this.addForm = newAddform;
      });
      this.checkId = String(row.id);
    },
    detail(id) {
      this.checkId = id;
      this.detailDialog = true;
    },
    disabled(row) {
      this.$confirm(`是否确认${row.isUse ? '关闭' : '开启'}?`, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.tableLoading = true;
        durationConfigChange(row.id)
          .then((res) => {
            if (res.code == 0) {
              this.tableLoading = false;
              this.$message('操作成功');
              this.getList();
            }
          })
          .catch((err) => {
            this.tableLoading = false;
          });
      });
    },
    submit() {
      let self = this;
      this.$refs.addDialogForm.validate((valid) => {
        if (valid) {
          if (Number(self.addForm.deliverDuration) <= Number(self.addForm.warnDuration)) {
            this.$message.warning('交付时效要大于预警时效！');
            return;
          }
          this.buttonLoading = true;
          if (!this.checkId) {
            // 新增
            this._addConfig();
          } else {
            this._updateConfig();
          }
        }
      });
    },

    /**添加时效 */
    _addConfig() {
      let addForm = { ...this.addForm };
      addForm.countryName = this.countrySelectList.find((item) => item.countryCode == addForm.countryCode).countryNameZh;

      durationConfigsSave(this.filterHttpPram(addForm))
        .then((res) => {
          if (res.code === 0) {
            this.addDialogVisible = false;
            // this.addOrEditSuccess();
            this.buttonLoading = false;
            this.$message.success('添加成功');
            setTimeout(() => {
              this.getList();
            }, 500);
          }
        })
        .catch((e) => {
          this.buttonLoading = false;
        });
    },
    _updateConfig() {
      let addForm = { ...this.addForm };
      addForm.countryName = this.countrySelectList.find((item) => item.countryCode == addForm.countryCode).countryNameZh;

      durationConfigsEdit(this.filterHttpPram(addForm))
        .then((res) => {
          if (res.code === 0) {
            this.addDialogVisible = false;
            // this.addOrEditSuccess();
            this.buttonLoading = false;
            this.$message.success('修改成功');
            setTimeout(() => {
              this.getList();
            }, 500);
          }
        })
        .catch((e) => {
          this.buttonLoading = false;
        });
    },
    addOrEditSuccess() {
      this.addDialogVisible = false;
      this.getList();
    },
    resetAddFields() {
      this.checkId = '';
      if (this.$refs.addDialogForm) {
        this.$refs.addDialogForm.resetFields();
      }
      if (this.buttonLoading) {
        this.buttonLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
