<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox" v-if="!isShowDetail">
      <el-form ref="searchForm" :model="searchForm" label-width="100px" inline>
        <el-form-item prop="serviceNo" label="服务号">
          <el-input v-model="searchForm.serviceNo" clearable placeholder="请输入服务号" style="width: 168px" />
        </el-form-item>
        <el-form-item prop="trademarkNameEn" label="商标名称">
          <el-input v-model="searchForm.trademarkNameEn" clearable placeholder="请输入商标名称" style="width: 168px" />
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-button type="primary" @click="searchList" style="margin: 0 12px" icon="el-icon-search">查询</el-button>
          <el-button type="default" ghost @click="resetList" icon="el-icon-refresh-left">重置</el-button>
          <el-button type="text" size="small" @click="handleMoreSearch"><i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
            {{moreSerch ? '收起' : '更多'}}筛选</el-button>
        </el-form-item>
        <el-button style="float: right" class="yellow-btn" @click="exportOrderFunc()" v-show="hasAuthority('W1_1')"> <i class="icon icon-export"></i>批量导出</el-button>
        <div v-show="moreSerch">
          <el-form-item prop="serviceProgressName" label="服务进度">
            <el-select clearable filterable v-model="searchForm.serviceProgressName" @change="changeService" placeholder="服务进度" style="width: 168px">
              <el-option :label="v.nodeServiceProgressName" :value="v.nodeServiceProgressName" v-for="(v, i) in serviceStatusList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="servicesStatus" label="服务状态">
            <el-select placeholder="服务状态" v-model="searchForm.servicesStatus" clearable>
              <el-option label="服务中" :value="1"></el-option>
              <el-option label="已取消" :value="9"></el-option>
              <el-option label="取消中" :value="11"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" clearable placeholder="订单编号" style="wwidth: 168px" />
          </el-form-item>
          <el-form-item prop="materialAuditDate" label="初审通过日期">
            <el-date-picker type="daterange" start-placeholder="初审通过开始" end-placeholder="初审通过结束" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[,'23:59:59']" v-model="searchForm.materialAuditDate" style="width: 340px" range-separator="至"></el-date-picker>
          </el-form-item>
          <el-form-item prop="updateTime" label="最新处理日期">
            <el-date-picker type="daterange" start-placeholder="最新处理日期开始" end-placeholder="最新处理日期结束" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[,'23:59:59']" v-model="searchForm.updateTime" style="width: 340px" range-separator="至"></el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table-container" v-if="!isShowDetail">
     
      <div class="tableArea1">
        <!-- tab标签 -->
        <el-tabs ref="elTabs" v-model="searchForm.status" :animated="false" @tab-click="tabsChange">
          <el-tab-pane label="全部" name="-1"></el-tab-pane>
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.nodeName" :name="item.nodeCode"></el-tab-pane>
        </el-tabs>
        <!-- table数据 -->
        <el-table border v-loading="tableLoading" @selection-change="tableSelectChange" @sort-change="sortChange" :data="tableData" ref="table" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
          <Empty slot="empty" />
          <el-table-column type="selection" width="60" />
          <el-table-column label="服务号" align="center" min-width="160">
            <template slot-scope="{ row }">
              {{ row.serviceNo }}
            </template>
          </el-table-column>
          <el-table-column label="订单编号" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{ row.orderNo }}
            </template>
          </el-table-column>
          <el-table-column label="商标名称" align="center" min-width="160">
            <template slot-scope="{ row }">
              <span v-if="row.trademarkType == 2 || row.trademarkType == 3" v-html="row.trademarkNameEn"></span>
              <span v-else v-html="row.trademarkNameEn"></span>
            </template>
          </el-table-column>

          <el-table-column label="使用证据类型" align="center" min-width="160">
            <template slot-scope="{ row }">
              <span>{{row.evidenceType == 1 ? '新申请使用证据' : (row.evidenceType == 2 ? '补正使用证据': '')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="商标类型" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{
                row.trademarkType == 1
                  ? "纯文字"
                  : row.trademarkType == 2
                  ? "纯黑色图形"
                  : row.trademarkType == 3
                  ? "纯彩色图形"
                  :row.trademarkType == 4
                  ? "文字+黑色图形"
                  :row.trademarkType == 5
                  ?"文字+彩色图形" 
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="商标类目" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{ row.trademarkCategoryOneNum }}
            </template>
          </el-table-column>

          <el-table-column label="服务进度" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{ row.serviceProgressStr }}
            </template>
          </el-table-column>
          <el-table-column label="服务状态" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{ row.serviceStatusStr }}
            </template>
          </el-table-column>
          <el-table-column label="处理人" align="center" min-width="120">
            <template slot-scope="{ row }">
              <div v-for="(item, index) in row.workorderHandlerList" :key="index">
                {{ item.handleTypeName }}：{{ item.handlerUserName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="制作套餐" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{ row.evidenceComboName }}
              <i class="el-icon-edit" style="cursor: pointer;color:#1890FF;" @click="showMealModal(row)" v-show="hasAuthority('W1_2')" />
            </template>
          </el-table-column>
          <el-table-column label="初审通过日期" prop="materialAuditDate" sortable="custom" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{ row.materialAuditDate }}
            </template>
          </el-table-column>
          <el-table-column label="最新处理时间" prop="updateTime" sortable="custom" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{ row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" min-width="120">
            <template slot-scope="{ row }">
              {{ row.orderRemark }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template slot-scope="{ row }">
              <!-- 待录入状态 -->
              <el-tooltip content="录入证据" placement="top" v-if="row.nodeCode == 'NODE0039' && row.serviceProgress == 1" v-show="hasAuthority('W1_3')">
                <el-link type="primary" :underline="false" @click="toDetail(row)">
                  <img src="@/assets/icons/icon_edit.svg" alt="">
                </el-link>
              </el-tooltip>
              <!-- 查看 -->
              <el-tooltip content="查看" placement="top" v-show="hasAuthority('W1_4')" v-else>
                <el-link type="primary" :underline="false" @click="toDetail(row)">
                  <img src="@/assets/icons/icon_see.svg" alt="">
                </el-link>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>
    <div class="pagination-container">
      <el-pagination @current-change="changePageNo" @size-change="changePageSize" :current-page.sync="pageInfo.page" :total="pageInfo.total" :page-size="pageInfo.limit" show-total background layout="total, sizes, prev, pager, next, jumper" show-sizer></el-pagination>
    </div>
    <!-- 修改制作套餐 -->
    <el-dialog width="460px" :visible.sync="mealModal" title="修改制作套餐">
      <el-form :model="mealForm">
        <el-form-item label="套餐类型">
          <el-select v-model="mealForm.mealName" placeholder="请选择套餐类型" clearable filterable>
            <el-option v-for="(item, index) in mealList" :value="item" :key="index">{{ item }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义" v-if="mealForm.mealName == '其他'">
          <el-input v-model="mealForm.customMealName" type="textarea" clearable :maxlength="50" :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请录入制作套餐，最多50字" />
        </el-form-item>
      </el-form>
      <p slot="footer">
        <el-button type="primary" @click="handleMeal">确认提交</el-button>
        <el-button @click="mealModal = false">取消</el-button>
      </p>
    </el-dialog>
    <!-- 备注 -->
    <el-dialog :visible.sync="remarkModal" title="备注">
      <el-form :model="remarkForm" label-width="90" ref="editorRow">
        <el-form-item>
          <el-input v-model="remarkForm.content" type="textarea" :maxlength="1000" :autosize="{ minRows: 8, maxRows: 8 }" placeholder="
            输入备注，参考格式：
            1、不包括单价超过30块钱的产品，超过的需要客户补差价或者邮寄产品
            2、35类及以上的类目不能做使用证据（因为35至45类为服务类）
            3、需要外包装的需单独付费，成本30-50不等" />
        </el-form-item>
      </el-form>
      <p slot="footer">
        <el-button type="primary">确认提交</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
import { evidencelistApi, evidenceComboListApi, updateEvidenceApi } from "@/api/newApi/proffus/proffus.js";
import * as API from "@/api/newApi/intellectualProperty/trademark.js";
import ProofDetail from "./components/detail";
import { getToken } from "@/libs/util";
import { findNodes } from "@/api/newApi/processFields/processConfig";
import store from '@/store';
import {setSearchVal,getSearchVal,getSearchTime,removeSearchVal} from '../handleSearch';
export default {
  components: {
    ProofDetail
  },
  data() {
    return {
      // 服务状态列表
      serviceStatusList: [],
      // tab节点列表
      tabList: [],

      // 分页查询
      tableLoading: false,
      searchForm: {
        orderNo: '',
        serviceNo: "",
        trademarkNameEn: "",
        materialAuditDate: [],
        updateTime: [],
        nodeCode: "",
        serviceProgress: "",
        serviceProgressName: "",
        servicesStatus: "",
        status: "-1"
      },
      pageInfo: {
        total: 0,
        limit: 10,
        page: 1
      },
      tableData: [],

      // 当前行数据
      selectRow: {},
      // 多选的数据
      selectRows: [],

      // 详情
      isShowDetail: false,

      // 修改套餐
      mealModal: false,
      mealForm: {
        mealName: "",
        customMealName: ""
      },
      mealList: [],

      // 修改备注
      remarkModal: false,
      remarkForm: {
        content: ""
      },
      selectList: [],
      moreSerch: false,
      pagePath:this.$route.name,
    };
  },
  created() {
    if(getSearchVal(this.pagePath)!=null) {
      this.searchForm=getSearchVal(this.pagePath)
    }
    this.searchList();
    this.queryServiceAndNodes();
  },
  methods: {
    /**
     * 查询服务流程列表，以及当前流程节点列表
     */
    queryServiceAndNodes() {
      // 查询当前流程节点列表
      findNodes({ functionCode: 63 }).then(res => {
        if (res.code == 0) {
          this.tabList = res.data;
        }
      });
      // 查询所有服务流程列表
      API.getAllServiceProgressAPI({ functionCode: 63 }).then(res => {
        if (res.code == 0) {
          this.serviceStatusList = res.data;
        }
      });
    },

    /**
     * 切换服务进度
     */
    changeService() {
      let service = this.serviceStatusList.filter(
        item => item.nodeServiceProgressName == this.searchForm.serviceProgressName
      )[0];
      this.searchForm.nodeCode = service.nodeCode;
      this.searchForm.serviceProgress = service.nodeServiceProgress;
      // 联动tab选择标签
      this.searchForm.status = service.nodeCode;
      this.pageInfo = {
        total: 0,
        limit: 10,
        page: 1
      };
      this.searchList();
    },
    /**
     * tab切换
     */
    tabsChange(tab) {
      this.searchForm.status = tab.name;
      // 选择tab切换，则清空服务进度，重新设置nodeCode
      this.searchForm.serviceProgress = "";
      this.searchForm.serviceProgressName = "";
      this.searchForm.nodeCode = tab.name == "-1" ? "" : tab.name;
      // 清空分页
      this.pageInfo = {
        total: 0,
        limit: 10,
        page: 1
      };
      this.searchList();
    },
    /**
     * 查询分页列表
     */
    searchList() {
      let data = {
        serviceNo: this.searchForm.serviceNo,
        orderNo: this.searchForm.orderNo,
        updateTimeOrder:this.searchForm.updateTimeOrder,
        materialAuditDateOrder:this.searchForm.materialAuditDateOrder,
        trademarkNameEn: this.searchForm.trademarkNameEn,
        materialAuditDateStart:
          this.searchForm.materialAuditDate && this.searchForm.materialAuditDate.length > 0
            ? this.searchForm.materialAuditDate[0]
            : "",
        materialAuditDateEnd:
          this.searchForm.materialAuditDate && this.searchForm.materialAuditDate.length > 0
            ? this.searchForm.materialAuditDate[1]
            : "",
        updateTimeStart:
          this.searchForm.updateTime && this.searchForm.updateTime.length > 0 ? this.searchForm.updateTime[0] : "",
        updateTimeEnd:
          this.searchForm.updateTime && this.searchForm.updateTime.length > 0 ? this.searchForm.updateTime[1] : "",
        serviceProgress: this.searchForm.serviceProgress,
        servicesStatus: this.searchForm.servicesStatus,
        nodeCode: this.searchForm.nodeCode,
        page: this.pageInfo.page,
        limit: this.pageInfo.limit
        
      };
      this.tableLoading = true;
      setSearchVal(this.pagePath,JSON.stringify(this.searchForm))
      evidencelistApi(data)
        .then(res => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 300);
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.pageInfo = {
              page: Number(res.data.current),
              total: Number(res.data.total),
              limit: Number(res.data.size)
            };
          }
        })
        .catch(error => {
          this.tableLoading = false;
        });
    },
    // 分页切换
    changePageNo(page) {
      this.pageInfo.page = page;
      this.searchList();
    },
    changePageSize(pageSize) {
      this.pageInfo.limit = pageSize;
      this.searchList(1);
    },
    // 重置列表
    resetList() {
      this.$refs.searchForm.resetFields();
      this.searchForm={
        orderNo: '',
        serviceNo: "",
        trademarkNameEn: "",
        materialAuditDate: [],
        updateTime: [],
        nodeCode: "",
        serviceProgress: "",
        serviceProgressName: "",
        status: "-1",
        updateTimeOrder:'',
        materialAuditDateOrder:''
      }
      removeSearchVal(this.pagePath)
    },

    /**
     * 表格多选
     */
    tableSelectChange(val) {
      this.selectList = val;
    },
    // 修改时间排序
    sortChange(column, key, order){
      console.log(column, key, order);
      if(column.prop=='materialAuditDate'&&column.order == 'ascending'){
        this.searchForm.materialAuditDateOrder='asc'
      }else if(column.prop=='materialAuditDate'&&column.order == 'descending'){
        this.searchForm.materialAuditDateOrder='desc'
      }else if(column.prop=='updateTime'&&column.order == 'ascending'){
        this.searchForm.updateTimeOrder='asc'
      }else if(column.prop=='updateTime'&&column.order == 'descending'){
        this.searchForm.updateTimeOrder='desc'
      }
      this.searchList();
    },

    /**
     * 导出
     */
    exportOrderFunc() {
      const menus = store.state.user.menus
      const pathname = location.pathname.substr(1)
      const menu = menus.find(item => item.path === pathname)
      let ids = "";
      this.selectList.map(item => {
        ids += item.workOrderId + ",";
      });
      let formData = new FormData();
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      const form = { ...this.searchForm };
      if (this.searchForm.status == '-1') form.status = ''
      const status = form.status ? 'status=' + form.status + '&' : ''
      const serviceNo = form.serviceNo ? "serviceNo=" + form.serviceNo + '&' : ''
      const trademarkNameEn = form.trademarkNameEn ? "trademarkNameEn=" + form.trademarkNameEn + '&' : ''
      const materialAuditDateStart = form.materialAuditDate.length > 0 ? "materialAuditDateStart=" + form.materialAuditDate[0] + '&' : ''
      const materialAuditDateEnd = form.materialAuditDate.length > 0 ? "materialAuditDateEnd=" + form.materialAuditDate[1] + '&' : ''
      const updateTimeStart = form.updateTime.length > 0 ? "updateTimeStart=" + form.updateTime[0] + '&' : ''
      const updateTimeEnd = form.updateTime.length > 0 ? "updateTimeEnd=" + form.updateTime[1] + '&' : ''
      const nodeCode = form.nodeCode ? "nodeCode=" + form.nodeCode + '&' : ''
      ids = ids ? 'workOrderEvidenceIds=' + ids : '';

      xmlResquest.open(
        "get",
        this.baseUrl +
        `/workorder/management/trademark/workorder/evidence/importWorkOrderEvidenceList?` +
        status +
        serviceNo +
        trademarkNameEn +
        materialAuditDateStart +
        materialAuditDateEnd +
        updateTimeStart +
        updateTimeEnd +
        nodeCode +
        ids,
        true
      );
      // 设置请求token
      xmlResquest.setRequestHeader("Authorization", "Bearer " + getToken());
      xmlResquest.setRequestHeader("menuId", menu.menuId);
      xmlResquest.setRequestHeader("enterpriseId", window.localStorage.getItem("enterpriseId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = timestamp + ".xlsx";
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },

    /**
     * 修改套餐
     */
    showMealModal(row) {
      this.selectRow = row;
      this.mealModal = true;
      evidenceComboListApi().then(res => {
        if (res.code == 0) {
          this.mealList = res.data;
        }
      });
    },
    handleMeal() {
      let data = {
        evidenceComboName: this.mealForm.mealName == '其他' ? this.mealForm.customMealName : this.mealForm.mealName,
        subWorkOrderId: this.selectRow.subWorkOrderId
      }
      updateEvidenceApi(data).then(res => {
        if (res.code == 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.mealModal = false
          this.searchList();
        }
      })
    },

    /**
     * 跳转详情
     */
    toDetail(row) {
      // 新增页面跳转代码
      this.$router.push({
        path: '/proofUS/detail',
        query: {
          serviceId: row.servicesId,
          nodeCode: row.nodeCode,
          evidenceType: row.evidenceType
        }
      })
      return
      // 页面内打开代码
      this.selectRow = row;
      this.serviceId = row.servicesId;
      this.isShowDetail = true;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
.pagination-container {
  padding: 15px;
  text-align: right;
}
</style>
