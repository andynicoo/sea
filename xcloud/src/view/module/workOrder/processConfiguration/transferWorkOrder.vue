<template>
  <div class="process-configuration-wrapper" :class="{ 'process-first': activeName == 'first' }">
    <div class="process-configuration-header">
      <img class="max-logo" src="@/assets/images/common/icon_logo.svg" />
      <el-tooltip placement="bottom" effect="light" popper-class="process-info-tip">
        <ul slot="content" class="process-info">
          <li><span>业务类型：</span>{{ processForm.flowType.split('-')[0] }}</li>
          <li><span>工单类型：</span>{{ processForm.flowType.split('-')[1] }}</li>
          <li><span>主体：</span>{{ enterpriseName && enterpriseName.join() }}</li>
          <li><span>国家：</span>{{ processForm.countryName && processForm.countryName.join() }}</li>
          <li><span>供应商：</span>{{ processDetail.supplierName }}</li>
          <li><span>备注：</span>{{ processForm.remarks }}</li>
        </ul>
        <dl class="process-name">
          <dt v-if="processForm.flowName">{{ processForm.flowName }}</dt>
        </dl>
      </el-tooltip>
    </div>
    <div class="process-config-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="'历史停用的流程工单('+listTotal+')'" name="first"></el-tab-pane>
        <el-tab-pane :label="'转移记录('+listTotalRecord+')'" name="third"></el-tab-pane>
      </el-tabs>
			<div class="process-handle-btn" v-if="activeName == 'first'">
				<el-button type="primary" @click="transitonWorker">转入到此流程</el-button>
			</div>
			
    </div>
		<div class="app-container" v-if="activeName == 'first'">
			<div class="header-container" ref="searchBox">
				<el-form ref="serchForm" label-width="100px" inline>
					<el-form-item label="选择工单流程">
						<el-select clearable multiple filterable v-model="listQuery.oldflowIds" placeholder="请选择工单流程">
							<el-option v-for="item in flowIdList" :key="item.flowId" :label="item.flowName +' - '+ item.createTime" :value="item.flowId"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单号">
						<el-input v-model="listQuery.orderNo" placeholder="请输入订单号" clearable style="width: 200px" />
					</el-form-item>
					<el-form-item label="服务号">
						<el-input v-model="listQuery.serviceNo" placeholder="请输入服务号" clearable style="width: 200px" />
					</el-form-item>
					<el-form-item label="所属主体">
						<el-select clearable multiple filterable v-model="listQuery.enterpriseIds" placeholder="请选择所属主体" >
							<el-option :value="item.id" :label="item.name" v-for="item in enterpriseList" :key="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="search" icon="el-icon-search" style="margin-left: 20px;">搜索</el-button>
						<el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
					</el-form-item>
					<div style="margin-top: 10px;"></div>
					<el-form-item label="国家">
						<el-select clearable  multiple filterable v-model="listQuery.countryCodes" placeholder="请选择国家">
							<el-option v-for="item in countryList" :key="item.id" :label="item.countryNameZh" :value="item.countryCode"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="服务进度">
						<el-select clearable multiple filterable v-model="listQuery.nodeCodes" placeholder="请选择服务进度">
							<el-option v-for="(item,index) in processList" :key="index" :label="item.nodeName" :value="item.nodeCode"> </el-option>
						</el-select>
					</el-form-item>
					
					
				</el-form>
			</div>
			<!-- 表格 -->
			<div class="table-container">
				<el-table border :height="tableHeight" :data="data" @selection-change="handleSelectionChange" v-loading="listLoading" element-loading-spinner="icon loading"> 
					<el-table-column type="selection" width="40"> </el-table-column>
					<el-table-column align="center" label="序号" width="55" >
						<template slot-scope="scope">{{ scope.$index + 1 }}</template>
					</el-table-column>
					<el-table-column align="center" label="订单号">
						<template slot-scope="scope">{{ scope.row.orderNo }}</template>
					</el-table-column>
					<el-table-column align="center" label="所属主体">
						<template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
					</el-table-column>
					<el-table-column align="center" label="服务名称">
						<template slot-scope="scope">{{ scope.row.serviceName }}</template>
					</el-table-column>
					<el-table-column align="center" label="国家">
						<template slot-scope="scope">{{ scope.row.countryNameZh }}</template>
					</el-table-column>
					<el-table-column align="center" label="服务公司">
						<template slot-scope="scope">{{ scope.row.companyNameZh }}</template>
					</el-table-column>
					<el-table-column align="center" label="服务号">
						<template slot-scope="scope">{{ scope.row.serviceNo }}</template>
					</el-table-column>
					<el-table-column align="center" label="服务状态">
						<template slot-scope="scope">{{ scope.row.serviceStatusStr }}</template>
					</el-table-column>
					<el-table-column align="center" label="服务进度">
						<template slot-scope="scope">{{ scope.row.serviceProgressName }}</template>
					</el-table-column>
					<el-table-column align="center" label="处理人">
						<template slot-scope="scope">{{ scope.row.handlerStr }}</template>
					</el-table-column>
					<el-table-column align="center" label="服务创建时间">
						<template slot-scope="scope">{{ scope.row.createTime }}</template>
					</el-table-column>
					<el-table-column align="center" label="服务所属流程">
						<template slot-scope="scope">{{ scope.row.flowName }}</template>
					</el-table-column>
					<el-table-column align="center" label="流程创建时间">
						<template slot-scope="scope">{{ scope.row.flowCreateTime }}</template>
					</el-table-column>
					<el-table-column align="center" label="供应商">
						<template slot-scope="scope">{{ scope.row.supplierName }}</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<div class="pagination-container">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
			</div>
		</div>
		<div class="app-container" v-else>
			<!-- 表格 -->
			<div class="table-container">
				<el-table border :data="dataRecord" v-loading="listLoading" element-loading-spinner="icon loading">
					<el-table-column align="center" label="序号">
						<template slot-scope="scope">{{ scope.$index + 1 }}</template>
					</el-table-column>
					<el-table-column align="center" label="工单类型">
						<template slot-scope="scope">{{ scope.row.functionName }}</template>
					</el-table-column>
					<el-table-column align="center" label="流程名称">
						<template slot-scope="scope">{{ scope.row.workFlowName }}</template>
					</el-table-column>
					<el-table-column align="center" label="创建时间">
						<template slot-scope="scope">{{ scope.row.workFlowCreateTime }}</template>
					</el-table-column>
					<el-table-column align="center" label="创建人">
						<template slot-scope="scope">{{ scope.row.workFlowCreateUser }}</template>
					</el-table-column>
					<el-table-column align="center" label="转入工单数">
						<template slot-scope="scope">{{ scope.row.changeNum }}</template>
					</el-table-column>
					<el-table-column align="center" label="成功转入数量">
						<template slot-scope="scope">{{ scope.row.successNum }}</template>
					</el-table-column>
					<el-table-column align="center" label="操作人">
						<template slot-scope="scope">{{ scope.row.createUser }}</template>
					</el-table-column>
					<el-table-column align="center" label="操作时间">
						<template slot-scope="scope">{{ scope.row.createTime }}</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="250px" fixed="right">
						<template slot-scope="scope">
							<el-button @click="exportWorkerOrder(scope.row,scope.$index)" size="small" type="primary" :disabled="exportLoading && selectIndex == scope.$index">导出工单</el-button>	
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<div class="pagination-container">
				<el-pagination background @size-change="handleSizeChangeRecord" @current-change="handleCurrentChangeRecord" :current-page.sync="listQueryRecord.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQueryRecord.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotalRecord"></el-pagination>
			</div>
		</div>
		<el-dialog title="转入工单" :visible.sync="dialogvisible" width="400px" center destroy-on-close>
			<div>
				<div class="notice-title">{{ '您选择了 '+ multipleSelection.length +' 条进行中的 '+processForm.flowType.split('-')[1]+' 历史工单'}}</div>
				<div>即将转入到以下工单流程,请谨慎操作</div>
				<div>{{ processForm.flowName }}</div>
				<ul slot="content" class="process-info">
					<li><span>主体：</span>{{ enterpriseName && enterpriseName.join() }}</li>
					<li><span>国家：</span>{{ processForm.countryName && processForm.countryName.join() }}</li>
					<li><span>供应商：</span>{{ processDetail.supplierName }}</li>
					<li><span>创建时间：</span>{{ $route.query.createTime }}</li>
					<li><span>创建人：</span>{{ $route.query.createName }}</li>
				</ul>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogvisible = false" size="small">取消</el-button>
				<el-button type="primary" size="small" @click="sureTranstion">确认</el-button>
			</span>
		</el-dialog>
  </div>
</template>

<script>
import { findNodes, getProcessDetail ,historyStopWorkOrders,workOrderTransfer, workOrderTransferRecord, exportWorkorderDetails ,workOrderRelatelist} from '@/api/newApi/processFields/processConfig';
import { serviceProgress } from '@/api/newApi/common';
import { supplierList, newSupplierList, getServiceFunction, supplierFunctionCode } from '@/api/newApi/workOrder/processConfiguration';
export default {
  data() {
    return {
      statusTxt: ['草稿', '未审核', '已审核', '审核失败', '已发布', '已停用'],
      processDetail: {},
      activeName: 'first',
      enterpriseList: [],
      enterpriseName: [],
      supplierName: [],
      countryList: [],
      supplierList: [
        {
          erpSupplierId: '120925',
          supplierName: 'ASIN SERVICE',
        },
        {
          erpSupplierId: '208883',
          supplierName: '深圳市中凯检测技术有限公司',
        },
      ],
      releaseData: {},
      processForm: {
        flowId: '',
        flowName: '',
        flowType: '',
        enterpriseId: '',
        countryCode: '',
        countryName: '',
        serviceProviderId: '',
        remarks: '',
        functionCode: '',
      },
			processList:[],
			flowIdList:[],
			listLoading: false,
			releaseData: {},
			listTotal: 0,
			listQuery: {
				page: 1,
				limit: 10,
				orderNo: '',
				serviceNo: '',
				countryCodes: [],
				oldflowIds: [],
				enterpriseIds: [],
				nodeCodes: [],
				flowId:this.$route.query.fid
			},
			data:[],
			listTotalRecord: 0,
			listQueryRecord: {
				page: 1,
				limit: 10,
				workFlowId:this.$route.query.fid
			},
			dataRecord:[],
			multipleSelection: [],
			dialogvisible: false,
			exportLoading: false,
			selectIndex: ''
    };
  },
  created() {
    this.enterpriseList = JSON.parse(localStorage.enterpriseList);
    this.countryList = JSON.parse(localStorage.countryList);
    if (this.$route.query.fid) {
      this.processForm.flowId = this.$route.query.fid;
      this.queryProcessDetail();
    }
    if (this.$route.query.code) {
      this.processForm.functionCode = this.$route.query.code;
      this.processForm.flowType = `${this.$route.query.bType} - ${this.$route.query.wType}`;
    }
		this.getWorkOrderRelatelist()
		if(this.$route.query.functionCode) {
			this.getFunctionCode()
		}
		this.getHistoryStopWorkOrders()
		this.getWorkOrderTransferRecord()
  },
  mounted() {
  },
  methods: {
    //更新详情
    updataProcessDetail(detail) {
      this.processDetail = detail;
    },
    handleClick(tab) {
			this.activeName = tab.name;
		},
    //下一步
    handleNext(val) {
      this.activeName = val;
    },
		handleSizeChange(val) {
			this.listQuery.limit = val;
			this.getHistoryStopWorkOrders()
		},
		handleCurrentChange(val) {
			this.listQuery.page = val;
			this.getHistoryStopWorkOrders()
		},
		handleSizeChangeRecord(val) {
			this.listQueryRecord.limit = val;
			this.getWorkOrderTransferRecord()
		},
		handleCurrentChangeRecord(val) {
			this.listQueryRecord.page = val;
			this.getWorkOrderTransferRecord()
		},
		exportWorkerOrder(row,index) {
			this.exportLoading = true;
			this.selectIndex = index
			exportWorkorderDetails({changeId:row.id})
        .then((res) => {
          this.exportLoading = false;
          this.$message.success("导出完成");
          this.$util.exportExcel(res, "导出工单");
        })
        .catch((e) => {
          this.exportLoading = false;
          this.$message.error("数据导出失败");
        });

		},
		transitonWorker() {
			if(this.multipleSelection.length == 0){
				this.$message.warning('请勾选工单');
				return false
			}
			this.dialogvisible = true
		},
		handleSelectionChange(val) {
			this.multipleSelection = val.map(item=>{
				return item.serviceId
			});
		},
		search() {
			this.listQuery.page = 1
			this.getHistoryStopWorkOrders()
		},
		handleReset () {
			this.listQuery = {
				page: 1,
				limit: 10,
				orderNo: '',
				serviceNo: '',
				countryCodes: [],
				oldflowIds: [],
				enterpriseIds: [],
				nodeCodes: [],
				flowId:this.$route.query.fid
			}
			this.getHistoryStopWorkOrders()
		},
		sureTranstion() {
			workOrderTransfer({ flowId: this.processForm.flowId,serviceIds:this.multipleSelection}).then((res) => {
        if (res.code == 0) {
					this.$message.success('成功转入工单')
					this.dialogvisible = false
					this.listQuery.page = 1;
					this.getHistoryStopWorkOrders()
					this.listQueryRecord.page = 1;
					this.getWorkOrderTransferRecord()
        }
      });
		},
    /**
     * 查询服务商列表
     */
		getWorkOrderRelatelist () {
			workOrderRelatelist({ flowId: this.processForm.flowId }).then((res) => {
        if (res.code == 0) {
					this.flowIdList = res.data
        }
      });
		},
		getFunctionCode() {
			serviceProgress({ functionCode:this.$route.query.functionCode }).then((res) => {
        if (res.code == 0) {
					this.processList = res.data.filter(item=>{
						return item.nodeId !=0
					})
        }
      });
		},
    querySupplierList(countryCodeList) {
      supplierFunctionCode({ functionCode: this.$route.query.code, countryCodeList }).then((res) => {
        if (res.code == 0) {
          this.supplierList = res.data;
        }
      });
    },
		getHistoryStopWorkOrders() {
			this.listLoading = true;
			historyStopWorkOrders(this.listQuery).then((res) => {
        if (res.code == 0) {
					this.listLoading = false
					this.data = res.data.records || [];
          this.listTotal = Number(res.data.total || 0);
        }
      });
		},
		getWorkOrderTransferRecord() {
			this.listLoading = true;
			workOrderTransferRecord(this.listQueryRecord).then((res) => {
        if (res.code == 0) {
					this.listLoading = false
					this.dataRecord = res.data.records || [];
          this.listTotalRecord = Number(res.data.total || 0);
        }
      });
		},
    // //选择国家
    countryChange(val) {
      console.log(val);
      this.processForm.serviceProviderId = '';
      let currentCountry = this.countryList.filter((item) => {
        return val.includes(item.countryCode);
      });
      this.querySupplierList(val);
      this.processForm.countryName = currentCountry.map((item) => item.countryNameZh);
      this.$set(this.releaseData, 'countryNameCH', this.processForm.countryName.join());
    },
    /**
     * 查询流程详情
     */
    queryProcessDetail() {
      getProcessDetail({ flowId: this.processForm.flowId }).then((res) => {
        if (res.code == 0) {
          this.processDetail = res.data;
          this.releaseData = res.data;
          this.processForm.flowName = res.data.flowName;
          this.processForm.countryCode = res.data.countryCode;
          this.querySupplierList(res.data.countryCode);
          this.countryChange(res.data.countryCode);
          this.processForm.serviceProviderId = res.data.serviceProviderId;
          this.processForm.enterpriseId = res.data.enterpriseId;
					this.processForm.remarks = res.data.remarks;
          this.supplierList.forEach((item) => {
            if (this.processDetail.serviceProviderId.includes(item.erpSupplierId)) {
              this.supplierName.push(item.supplierName);
            }
          });
          this.enterpriseList.forEach((item) => {
            if (this.processDetail.enterpriseId.includes(item.id)) {
              this.enterpriseName.push(item.name);
              this.processForm.enterpriseName = this.enterpriseName;
            }
          });

          this.$set(this.releaseData, 'enterpriseName', this.processForm.enterpriseName.join());
        }
      });
    },
  },
};
</script>
<style>
.process-info-tip {
  border-color: #fff !important;
  box-shadow: 0 0 5px #ddd;
}
.process-info-tip .popper__arrow {
  display: none;
}
</style>
<style lang="scss" scoped>
.process-status {
  padding: 0 10px;
  line-height: 24px;
  height: 24px;
  background: #52c41a;
  border-radius: 2px 2px 2px 2px;
  color: #fff;
  font-size: 12px;
  display: inline-block;
  position: relative;
  top: -24px;
  right: -7px;
}

.process-configuration-wrapper {
  background-color: #f4f7f9;
  height: 100%;
  overflow-x: auto;
}
.process-first {
  background: #fff;
}
.process-configuration-header {
  width: 100%;
  background: #fff;
  padding: 0 10px;
  height: 64px;
  position: absolute;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.04);

  .max-logo {
    float: left;
    margin-top: 14px;
    margin-left: 22px;
  }

  .process-name {
    float: left;
    height: 30px;
    margin-top: 15px;

    dt,
    dd {
      float: left;
    }

    dt {
      margin-top: 5px;
      font-size: 14px;
      margin-left: 20px;
    }

    dd {
      padding: 0 10px 0 20px;
      margin-left: 30px;

      img {
        border: 1px solid #1890ff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-left: -15px;
      }
    }
  }
}

.process-info {
  list-style: none;

  li {
    margin: 10px 5px;
    max-width: 500px;
  }

  span {
    display: inline-block;
    min-width: 60px;
    color: #999;
  }
}

/* .process-handle-btn {
    float: right;
    margin-top: 12px;
} */

.process-config-tabs {
  text-align: center;
  padding-top: 9px;

  .el-tabs {
    display: inline-block;
    margin-top: 5px;
    ::v-deep .el-tabs__header {
      margin-bottom: 0 !important;
    }
    ::v-deep .el-tabs__item {
      font-weight: bold;
      height: 50px;
    }
  }

  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }

  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
}

.process-serviceInformation {
  width: 700px;
  margin: 100px auto;

  h2 {
    margin-bottom: 16px;
    font-size: 14px;
    color: #000;
  }

  .serviceInformation-processForm {
    margin-top: 50px;

    .el-form-item {
      margin-bottom: 32px;
    }
  }

  .w500 {
    width: 500px;
  }
}

.process-handle-btn {
  position: absolute;
  top: 16px;
  right: 32px;
}
.notice-title{
	font-size: 16px;
	margin-bottom: 10px;
	color: #000;
}
</style>
