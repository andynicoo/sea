<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="listQuery" inline label-width="90px">
          <el-form-item prop="enterpriseIdList" label="公司主体">
            <el-select style="width: 168px" v-model="listQuery.enterpriseIdList" placeholder="请选择公司主体" clearable multiple filterable>
              <el-option v-for="item in firmList" :value="item.id" :key="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="订单号">
            <el-input v-model="listQuery.orderNo" placeholder="请输入订单号" clearable style="width: 168px" size="small" @clear="queryData" />
          </el-form-item>
          <el-form-item label="客户手机号">
            <el-input placeholder="请输入客户手机号" clearable style="width: 168px" size="small" v-model="listQuery.userMobile" @clear="queryData" />
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="listQuery.applyTime"
              type="daterange"
              align="right"
              size="small"
              clearable
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 340px"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="开票时间">
            <el-date-picker
              v-model="listQuery.invoiceTime"
              type="daterange"
              align="right"
              size="small"
              clearable
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 340px"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="clickReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-tabs v-model="activeName" @tab-click="tabHandleClick" ref="elTabs">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane :label="item.label" :name="item.value" v-for="item in tabs" :key="item.value"></el-tab-pane>
      </el-tabs>
      <el-table v-loading="listLoading" :data="list" style="width: 100%" border max-height="700" highlight-current-row show-summary :summary-method="getSummaries" :height="tableHeight" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="编号" width="70" type="index">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售订单号" width="200">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
        </el-table-column>
        <el-table-column align="center" label="开票类型" width="200">
          <template slot-scope="scope">
            {{ scope.row.invoiceType === 'GENERAL' ? '增值税普通发票' : scope.row.invoiceType === 'SPECIAL' ? '增值税专用发票' : '不开票' }}
            <span v-if="scope.row.subjectType">({{ scope.row.subjectType === 'PERSON' ? '个人' : scope.row.subjectType === 'ENTERPRISE' ? '公司' : '' }}) </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单金额" width="130" prop="orderPaidMoney" sortable>
          <template slot-scope="scope">{{ scope.row.orderPaidMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="税点" sortable>
          <template slot-scope="scope">
            {{ scope.row.taxPoint }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发票金额" width="130" prop="makeInvoiceMoney" sortable>
          <template slot-scope="scope">{{ scope.row.makeInvoiceMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="开票状态" width="100">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" label="申请时间" width="200" sortable>
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="开票时间" width="200" sortable>
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-show="hasAuthority('B2_3')">
              <el-link type="primary" :underline="false" @click="handleDetail(scope.row)" class="icon icon-see"></el-link>
            </el-tooltip>
            <!-- <el-link
              type="primary"
              :underline="false"
              v-if="scope.row.status == 1 && scope.row.status != 6"
              @click="handleClickCancel(scope.row)"
              >取消</el-link
            > -->

            <el-tooltip effect="dark" content="上传发票" placement="top" v-show="hasAuthority('B2_4')">
              <span>
                <el-link type="primary" :underline="false" v-if="scope.row.status == 'WAIT_INVOICE'" @click="changeUploadInvoice(scope.row)" class="icon icon-upload-receipt"></el-link>
              </span>
            </el-tooltip>
            <!-- 确认到账 在“待确认到账（status：6）且付款凭证状态为待对账（reconciliationStatus：0）”时显示 -->
            <el-tooltip effect="dark" content="确认到账" placement="top" v-show="hasAuthority('B2_8')">
              <span>
                <el-link type="primary" :underline="false" v-if="scope.row.status == 6 && scope.row.orderPayment && scope.row.orderPayment.reconciliationStatus === 0" class="icon icon-refund" @click="incomeConfirm(scope.row)"></el-link>
              </span>
            </el-tooltip>
            <!-- <el-tooltip effect="dark" content="确认退票" placement="top" v-if="hasAuthority('B2_5')">
              <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.status == 5"
                class="icon icon-refund"
                @click="refundInvoice(scope.row)"
              ></el-link>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50, 100]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>

    <!-- 是否确认到账 -->
    <!-- <el-dialog title="是否确认到账" :visible.sync="payModel" width="460px">
      <el-form :rules="payRules" :model="payForm" ref="ruletimeForm">
        <el-form-item label="到账时间：" prop="gatheringTime">
          <el-date-picker
            v-model="payForm.gatheringTime"
            type="datetime"
            align="right"
            size="small"
            clearable
            placeholder="请选择付款时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 260px"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="payModel = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitPayBtn">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 上传发票 -->
    <el-dialog title="上传发票" :visible.sync="uploaInvoiced" width="500px">
      <el-form label-width="80px" :model="upload" :rules="rules" ref="ruleForm">
        <el-form-item label="发票：" prop="invoiceFile">
          <!-- 自定义上传单张图片组件 -->
          <UploadImages ref="uploadImageRef" :imageUrl="upload.invoiceFile" :on-success="uploadSuccess" :on-error="onUploadError" :on-remove="onUploadRemove" :num="1"></UploadImages>
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="primary" @click="handleUpload">保存</el-button>
        <el-button size="small" style="width: 65px" type="default" @click="uploaInvoiced = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadImages from '@/components/UploadImages';
import { getFirm, getBankAccountList } from '@/api/newApi/common.js';
import { getList, cancelInvoice, upload, totalInvoice, reFundInvoice } from '@/api/newApi/finance/invoice.js';
import { confirmPayment } from '@/api/newApi/orderManage/salesorder.js';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  components: { UploadImages },
  filters: {
    //开票状态
    filterStatus(val) {
      switch (val) {
        case 'WAIT_PAY':
          return '待付款';
        case 'WAIT_INFO':
          return '待补充信息';
        case 'WAIT_INVOICE':
          return ' 待开票';
        case 'INVOICED':
          return ' 已开票';
        case 'APPLY_REFUND':
          return '申请退款';
        case 'PAY_WAIT_CONFIRM':
          return '付款待确认';
        case 'CANCEL':
          return '已取消';
      }
    },
  },
  data() {
    return {
      // 查询日期区间配置
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      tabs: [
        { label: '待付款', value: 'WAIT_PAY' },
        { label: '付款待确认', value: 'PAY_WAIT_CONFIRM' },
        { label: '待补充信息', value: 'WAIT_INFO' },
        { label: '待开票', value: 'WAIT_INVOICE' },
        { label: '已开票', value: 'INVOICED' },
        { label: '申请退款', value: 'APPLY_REFUND' },
        { label: '已取消', value: 'CANCEL' },
      ],
      moreSerch: false, //更多查询条件
      totalPrice: {}, //合计列表

      // 分页
      listTotal: 0,
      listLoading: false,
      activeName: '0',
      list: [],
      firmList: [],
      listQuery: {
        page: 1,
        limit: 20,
        userMobile: '',
        orderNo: '',
        status: '',
        enterpriseIdList: [],
        //获取申请-开票时间
        applyTime: '',
        invoiceTime: '',
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
      collectionList: [], //收款账户列表

      uploaInvoiced: false,
      upload: {
        id: '',
        invoiceFile: '',
      },
      // uploadId: '',
      searchFlag: false,
      rules: {
        invoiceFile: [{ required: true, message: '请上传发票', trigger: 'change' }],
      },
      // 确认到账
      payModel: false,
      payForm: {
        gatheringTime: '',
      },
      payRules: {
        gatheringTime: [
          {
            required: true,
            message: '请选择到账时间',
            trigger: 'blur',
          },
        ],
      },
      checkItem: {},
    };
  },
  computed: {
    getapplyTime() {
      return this.$util.getEndTime(this.listQuery.applyTime);
    },
    getinvoiceTime() {
      return this.$util.getEndTime(this.listQuery.invoiceTime);
    },
  },
  mixins: [cacheQuery],
  created() {
    this.getFirmList();
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    // this.listQuery.enterpriseId = this.$util.getLocalStorage("enterpriseId");
    if (this.listQuery.status) {
      this.activeName = this.listQuery.status;
    }
    this.queryData();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.setPageCache();

      getList(this.listQuery)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            // this.activeName = this.listQuery.status || "0";
            // this.listQuery.status = this.activeName
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
            this.getTotalList();
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
    getFirmList() {
      getFirm().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;

      this.listQuery.applyEndTime = this.getapplyTime ? this.getapplyTime[1] : '';
      this.listQuery.applyStartTime = this.getapplyTime ? this.getapplyTime[0] : '';

      this.listQuery.invoiceStartTime = this.getinvoiceTime ? this.getinvoiceTime[0] : ''; //申请结束时间
      this.listQuery.invoiceEndTime = this.getinvoiceTime ? this.getinvoiceTime[1] : ''; //申请开始时间
      this.queryData();
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
    /** 底部合计 */
    getTotalList() {
      totalInvoice(this.listQuery).then((res) => {
        if (res.code == 0) {
          this.totalPrice = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    //金额合计显示
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        switch (column.property) {
          case 'makeInvoiceMoney': //这是是根据prop来判断是那一列的数据
            sums[index] = this.$options.filters['formatQianFenWei'](this.totalPrice.makeInvoiceMoney); //sums[index]是固定写法  this.totalPrice.amountMoney 表示的是每一空格是要写什么内容,this.totalPrice就是后台的数据
            break;
          case 'orderPaidMoney':
            sums[index] = this.$options.filters['formatQianFenWei'](this.totalPrice.amountMoney);
            break;
          default:
            break;
        }
      });
      return sums;
    },

    /** 重置查询条件 */
    clickReset() {
      // this.listQuery = {};
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
      this.time = {};
      this.queryData();
    },
    //切换tab状态时请求列表
    tabHandleClick() {
      if (this.activeName !== '0') {
        this.listQuery.status = this.activeName;
      } else {
        this.listQuery.status = '';
      }
      this.queryData();
    },
    /** 查看详情  */
    handleDetail(row) {
      console.log(row, 'row');
      this.$router.push({
        path: '/finance/invoice/invoiceDetails',
        query: { id: row.orderInvoiceId },
      });
    },

    /** 取消 */
    // handleClickCancel(row) {
    //   this.$confirm("确定取消该发票吗？", "取消提示", {
    //     customClass: "custom-confirm",
    //     type: "warning",
    //     center: true,
    //   }).then(() => {
    //     cancelInvoice({ id: row.id }).then((res) => {
    //       if (res.code == 0) {
    //         this.$message({
    //           type: "success",
    //           message: "发票取消成功",
    //         });
    //         this.queryData();
    //       } else {
    //         this.$message({
    //           type: "error",
    //           message: res.message,
    //         });
    //       }
    //     });
    //   });
    // },
    // 确认到账
    // incomeConfirm(row) {
    //   this.payForm.gatheringTime = ''
    //   this.checkItem = row
    //   this.payModel = true
    // },
    //确认到账提交
    // submitPayBtn() {
    //   this.$refs.ruletimeForm.validate(valid => {
    //     if (valid) {
    //       confirmPayment({
    //         ...this.payForm,
    //         id: this.checkItem.orderPayment.id,
    //         enterpriseId: this.$util.getLocalStorage("enterpriseId")
    //       }).then(res => {
    //         if (res.code == 0) {
    //           this.$message.success("确认到账成功");
    //           this.payModel = false;
    //           this.queryData();
    //         }
    //       }).catch(err => {
    //         this.$message.error(err.message);
    //       });
    //     }
    //   });
    // },

    /** 确认退票 */
    // refundInvoice(row) {
    //   this.$confirm("确定退票吗？", "取消提示", {
    //     customClass: "custom-confirm",
    //     type: "warning",
    //     center: true,
    //   }).then(() => {
    //     reFundInvoice(row.id).then((res) => {
    //       if (res.code == 0) {
    //         this.$message({
    //           type: "success",
    //           message: "退票成功",
    //         });
    //         this.queryData();
    //       } else {
    //         this.$message({
    //           type: "error",
    //           message: res.message,
    //         });
    //       }
    //     });
    //   });
    // },
    /** 上传发票 */
    changeUploadInvoice(row) {
      this.upload.id = row.orderInvoiceId;
      this.uploaInvoiced = true;
      this.upload.invoiceFile = '';
    },
    handleUpload() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // console.log(this.upload)
          // this.upload.id = this.uploadId
          upload(this.upload).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '发票上传成功',
              });
              this.uploaInvoiced = false;
              this.queryData();
            } else {
              this.$message({ type: 'error', message: res.message });
            }
          });
        }
      });
    },
    /**
     * 上传图片的操作
     */
    uploadSuccess(file) {
      this.upload.invoiceFile = file;
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file, uploadFiles) {
      this.upload.invoiceFile = file;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 1;
  }
}
</style>
