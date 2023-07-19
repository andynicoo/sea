<template>
  <div>
    <div class="commontitle">
      欧代/英代/美代
    </div>
    <div class="content">
      <div class="title">
        <span class="label">注册主体名称/服务号</span>
        <Input
          v-model="searchForm.keyword"
          clearable
          placeholder="请输入注册主体名称/服务号"
          style="width: 200px; margin-right: 32px"
        />
        <span class="label">国家</span>
        <Select
          v-model="searchForm.country"
          placeholder="请选择国家"
          style="width: 180px; margin-right: 32px"
          clearable
        >
          <Option value="GB">英国</Option>
          <Option value="EU">欧盟</Option>
          <Option value="FR">法国</Option>
          <Option value="DE">德国</Option>
        </Select>
        <!-- <span class="label">服务名称</span>
        <Select v-model="searchForm.functionCode" placeholder="请选择服务名称" style="width: 180px">
          <Option value="16">授权代表</Option>
          <Option value="31">EPR注册</Option>
        </Select> -->

        <Button type="primary" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
        <Button @click="handleReset" style="margin-left: 10px">重置</Button>
      </div>
      <div class="tabs-box">
        <div :class="statusIndex == 'undefined' ? 'active' : ''" @click="changeStatus('undefined')">全部</div>
        <div
          @click="changeStatus(node.nodeCode)"
          :class="statusIndex === node.nodeCode ? 'active' : ''"
          v-for="node in nodeList"
          :key="node.nodeId"
        >
          {{ node.nodeName }}
        </div>
      </div>
      <div class="table1">
        <Table
          :style="{ 'min-height': registerList.length == 0 ? '184px' : '' }"
          :no-data-text="'暂无处理事项'"
          :columns="columns"
          :data="registerList"
        >
          <template slot="serviceStatus" slot-scope="{ row }">
            <div>
              <span
                :style="{
                  color:
                    row.currentNodeCode == nodeEnum.WAIT_UPLOAD || row.currentNodeCode == nodeEnum.WAIT_AUTHORIZE
                      ? '#F79728'
                      : row.currentNodeCode == nodeEnum.REGISTERING ||
                        row.currentNodeCode == nodeEnum.REGISTER_COMPLETE ||
                        row.currentNodeCode == nodeEnum.WAIT_REVIEW ||
                        row.currentNodeCode == nodeEnum.REVIEWED
                      ? '#16ADE9'
                      : '#ED3E3E',
                }"
              >
                {{
                  row.currentNodeCode == nodeEnum.WAIT_UPLOAD
                    ? "待上传资料"
                    : row.currentNodeCode == nodeEnum.WAIT_AUTHORIZE
                    ? "待授权"
                    : row.currentNodeCode == nodeEnum.WAIT_REVIEW
                    ? "待审核"
                    : row.currentNodeCode == nodeEnum.REGISTERING
                    ? "注册中"
                    : row.currentNodeCode == nodeEnum.REGISTER_COMPLETE
                    ? "注册完成"
                    : row.currentNodeCode == nodeEnum.REVIEWED
                    ? "已审核"
                    : "暂无"
                }}
              </span>
              <!-- <span v-else style="color: #ed3e3e">订单已失效</span> -->
            </div>
          </template>
          <template slot="operate" slot-scope="{ row }" style="color: #16ade9">
            <div>
              <div
                v-if="row.serviceStatus == 1 || row.serviceStatus == 12"
                style="display: flex; justify-items: center; justify-content: space-around"
              >
                <div
                  @click.stop="toRegister(row)"
                  class="btF"
                  style="color: #f79728"
                  v-if="row.currentNodeCode == nodeEnum.WAIT_UPLOAD && row.progressBar == 1"
                >
                  <img
                    src="@/assets/images/survey/shangchuan1.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                  />
                  <span>上传资料</span>
                </div>
                <div
                  class="btF"
                  v-if="
                    row.currentNodeCode == nodeEnum.WAIT_REVIEW ||
                    row.currentNodeCode == nodeEnum.REVIEWED ||
                    row.currentNodeCode == nodeEnum.AUTHORIZE_WAIT_CONFIRM ||
                    row.currentNodeCode == nodeEnum.REGISTERING
                  "
                  @click.stop="toRegister(row)"
                  style="color: #515b6e"
                >
                  <img
                    src="@/assets/images/survey/detail.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                  />
                  <span>查看进度</span>
                </div>
                <div
                  @click.stop="toRegister(row)"
                  class="btF"
                  style="color: #f79728"
                  v-if="row.currentNodeCode == nodeEnum.WAIT_AUTHORIZE && row.progressBar == 1"
                >
                  <img
                    src="@/assets/images/survey/shangchuan1.svg"
                    style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                  />
                  <span>上传授权书</span>
                </div>
                <div
                  @click.stop="toRegister(row)"
                  class="btF"
                  style="color: #ed3e3e"
                  v-if="
                    (row.currentNodeCode == nodeEnum.WAIT_UPLOAD || row.currentNodeCode == nodeEnum.WAIT_AUTHORIZE) &&
                    row.progressBar == 2
                  "
                >
                  <img
                    src="@/assets/images/survey/bohui1.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 0px"
                  />
                  <span>查看驳回原因</span>
                </div>

                <div
                  class="btF"
                  @click.stop="toRegister(row)"
                  v-if="row.currentNodeCode == nodeEnum.REGISTER_COMPLETE && row.progressBar == 1"
                  style="color: #515b6e"
                >
                  <img
                    src="@/assets/images/survey/detail.svg"
                    alt
                    style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                  />
                  <span>详情</span>
                </div>
                <div
                  class="btF"
                  v-if="
                    row.currentNodeCode == nodeEnum.REGISTER_COMPLETE &&
                    +new Date(row.agreementEndTime) > +new Date() &&
                    +new Date() > +new Date(row.agreementBeginTime) &&
                    searchFunctionCode == '16'
                  "
                  @click.stop="toFilingDetails(row)"
                  :style="{
                    color:
                      row.currentNodeCode == nodeEnum.WAIT_UPLOAD
                        ? '#F79728'
                        : row.currentNodeCode == nodeEnum.REGISTERING
                        ? '#16ADE9'
                        : '#16ADE9',
                  }"
                >
                  <img
                    src="@/assets/images/survey/icon_apply.svg"
                    alt
                    style="width: 13px; position: relative; top: 6px; margin-right: 2px"
                  />
                  <span style="position: relative; top: 4px">申请备案</span>
                </div>
                <div
                  @click.stop="toRegister(row)"
                  class="btF"
                  style="color: #ed3e3e"
                  v-if="row.currentNodeCode == nodeEnum.REGISTERING && row.progressBar == 2"
                >
                  <img
                    src="@/assets/images/survey/bohui1.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 0px"
                  />
                  <span>查看驳回原因</span>
                </div>
              </div>
              <div
                v-if="row.serviceStatus == 9 || row.serviceStatus == 11 || row.serviceStatus == 2"
                style="display: flex; justify-items: center; justify-content: space-around"
              >
                <div
                  class="btF"
                  v-if="
                    row.currentNodeCode == nodeEnum.WAIT_REVIEW ||
                    row.currentNodeCode == nodeEnum.REVIEWED ||
                    row.currentNodeCode == nodeEnum.AUTHORIZE_WAIT_CONFIRM ||
                    row.currentNodeCode == nodeEnum.REGISTERING
                  "
                  @click.stop="toRegister(row)"
                  style="color: #515b6e"
                >
                  <img
                    src="@/assets/images/survey/detail.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                  />
                  <span>查看</span>
                </div>
                <div
                  class="btF"
                  @click.stop="toRegister(row)"
                  v-if="row.currentNodeCode == nodeEnum.REGISTER_COMPLETE && row.progressBar == 1"
                  style="color: #515b6e"
                >
                  <img
                    src="@/assets/images/survey/detail.svg"
                    alt
                    style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                  />
                  <span>详情</span>
                </div>
              </div>
            </div>
          </template>
        </Table>
        <div style="margin-top: 30px; text-align: right">
          <Page :total="total" :page-size="searchForm.limit" :current="searchForm.page" @on-change="pageChange" />
        </div>
      </div>
    </div>
    <div style="height: 1px"></div>
  </div>
</template>

<script>
import { getAuthAgentNodes, hgTaxManageList, EPRManageList } from "@/api/taxModule";

export default {
  data() {
    return {
      searchForm: {
        keyword: "",
        currentNode: "",
        country: "",
        functionCode: "16",
        page: 1,
        limit: 10,
        // productClass: "2",
        // 申报管理工单分页列表平台（1.跨税云 2.必胜道 3.卖家成长）
        // companyBody: 1,
      },
      statusIndex: "undefined",
      columns: [],
      columnsCompliance: [
        {
          title: "服务号",
          key: "serviceNo",
          width: 170,
        },
        {
          title: "注册主体名称",
          key: "companyNameZh",
          width: 180,
          tooltip: true,
          render(h, params) {
            let type = "暂未填写";
            if (params.row.shopNature == 2 && params.row.registrantName != "") {
              type = params.row.registrantName;
              return h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: type,
                    maxWidth: "200px",
                  },
                  style: {
                    cursor: "pointer",
                    "white-space": "nowrap",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                    "-webkit-box-orient": "vertical",
                  },
                },
                type
              );
            } else if (params.row.companyNameZh != "") {
              type = params.row.companyNameZh;
              return h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: type,
                    maxWidth: "200px",
                  },
                  style: {
                    cursor: "pointer",
                    "white-space": "nowrap",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                    "-webkit-box-orient": "vertical",
                  },
                },
                type
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#999999",
                  },
                },
                type
              );
            }
          },
        },
        {
          title: "国家",
          key: "country",
          width: 80,
        },
        {
          title: "服务名称",
          key: "serviceName",
          minWidth: 90,
          // render(h, params) {
          //   let productFunctionCode = params.row.productFunctionCode;
          //   let productName = "";
          //   switch (productFunctionCode) {
          //     case 16:
          //       productName = "授权代表";
          //       break;
          //   }
          //   return h("span", productName);
          // },
        },
        {
          title: "协议生效日",
          key: "agreementBeginTime",
          render(h, params) {
            let beginTime = params.row.agreementBeginTime.slice(0, 10);
            // let beginTime = params.row.agreementBeginTime
            return h("span", beginTime);
          },
          width: 126,
        },
        {
          title: "协议到期日",
          key: "agreementEndTime",
          render(h, params) {
            let endTime = params.row.agreementEndTime.slice(0, 10);
            // let endTime = params.row.agreementEndTime
            return h("span", endTime);
          },
          width: 126,
        },
        {
          title: "工单状态",
          key: "status",
          minWidth: 120,
        },
        {
          title: "操作",
          slot: "operate",
          width: 200,
        },
      ],
      columnsEPR: [
        {
          title: "服务号",
          key: "serviceNo",
          width: 170,
        },
        {
          title: "注册主体名称",
          key: "companyNameZh",
          width: 180,
          tooltip: true,
          render(h, params) {
            let type = "暂未填写";
            if (params.row.shopNature == 2 && params.row.registrantName != "") {
              type = params.row.registrantName;
              return h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: type,
                    maxWidth: "200px",
                  },
                  style: {
                    cursor: "pointer",
                    "white-space": "nowrap",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                    "-webkit-box-orient": "vertical",
                  },
                },
                type
              );
            } else if (params.row.companyNameZh != "") {
              type = params.row.companyNameZh;
              return h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: type,
                    maxWidth: "200px",
                  },
                  style: {
                    cursor: "pointer",
                    "white-space": "nowrap",
                    overflow: "hidden",
                    "text-overflow": "ellipsis",
                    "-webkit-box-orient": "vertical",
                  },
                },
                type
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#999999",
                  },
                },
                type
              );
            }
          },
        },
        {
          title: "国家",
          key: "country",
          width: 80,
        },
        {
          title: "服务名称",
          key: "serviceName",
          minWidth: 90,
        },
        {
          title: "服务到期日",
          key: "expirationTime",
          render(h, params) {
            let endTime = params.row.expirationTime.slice(0, 10);
            // let endTime = params.row.agreementEndTime
            return h("span", endTime);
          },
          width: 126,
        },
        {
          title: "工单状态",
          key: "currentNode",
          minWidth: 120,
        },
        {
          title: "操作",
          slot: "operate",
          width: 200,
        },
      ],
      registerList: [],
      total: 0,
      nowDate: "",
      nodeList: [],
      nodeEnum: {
        WAIT_UPLOAD: "NODE0060", //待上传资料
        WAIT_REVIEW: "NODE0061", //待审核资料
        REVIEWED: "NODE0062", //已审核
        WAIT_AUTHORIZE: "NODE0063", //待授权
        AUTHORIZE_WAIT_CONFIRM: "NODE0064", //授权待确认
        REGISTERING: "NODE0065", //注册中
        REGISTER_COMPLETE: "NODE0066", //注册完成
      },
      statusList: [
        { label: "全部", value: "" },
        { label: "正常", value: "1" },
        { label: "待续费", value: "2" },
        { label: "已失效", value: "9" },
        { label: "取消中", value: "11" },
      ],
      searchFunctionCode: "",
    };
  },
  methods: {
    //获取当前时间
    FormatDate() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth();
      var date = now.getDate();
      month = month + 1;
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      var time = year + "-" + month + "-" + date;
      return time;
    },

    handleSubmit() {
      this.searchForm.page = 1;
      this.getList();
    },
    handleReset() {
      this.searchForm = {
        keyword: "",
        currentNode: "",
        country: "",
        functionCode: "16",
        page: 1,
        limit: 10,
        // productClass: "2",
        // companyBody: 1,
      };
    },
    toFilingDetails(row) {
      this.$router.push({
        path: "/complianceBusiness/filingDetails",
        query: {
          status: row.currentNodeCode,
          countryNameZh: row.country,
          serviceId: row.serviceId,
        },
      });
    },
    toRegister(row) {
      this.$router.push({
        path: "/complianceBusiness/manageDetails",
        query: {
          status: row.currentNodeCode,
          countryNameZh: row.country,
          serviceId: row.serviceId,
          serviceName: row.serviceName,
          serviceNo: row.serviceNo,
          // serverNo: row.serviceNo,
          // countryCode: row.country,
        },
      });
    },
    pageChange(page) {
      this.searchForm.page = page;
      this.getList();
    },
    changeStatus(nodeCode) {
      if (nodeCode == "undefined") {
        this.searchForm.currentNode = "";
      } else {
        this.searchForm.currentNode = nodeCode;
      }
      this.statusIndex = nodeCode;
      this.searchForm.page = 1;
      this.getList();
    },
    getList() {
      if (this.searchForm.functionCode == "16") {
        this.getComplianceList();
      } else if (this.searchForm.functionCode == "31") {
        this.getEPRList();
      }
      this.searchFunctionCode = this.searchForm.functionCode;
    },
    getComplianceList() {
      hgTaxManageList(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
          this.columns = this.columnsCompliance;
        }
      });
    },
    getEPRList() {
      EPRManageList(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
          this.columns = this.columnsEPR;
        }
      });
    },
    getNodes() {
      getAuthAgentNodes().then((res) => {
        if (res.code === 0) {
          this.nodeList = res.data;
        }
      });
    },
  },
  created() {
    this.getList();
    this.getNodes();
    this.nowDate = this.FormatDate();
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-table-tip {
  table {
    min-height: 184px;
    font-size: 12px;
  }
}
/deep/ .ivu-tooltip-rel {
  max-width: 150px;
  display: block;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // -webkit-box-orient: vertical;
}
/deep/ .ivu-table-row {
  th,
  td {
    text-align: center;
    font-size: 12px;
  }
}
/deep/ .ivu-table-header {
  th {
    text-align: center;
    font-weight: 600;
    color: #333;
    font-size: 12px;
  }
}
.head {
  background-color: #ffffff;
  padding: 12px 32px;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
.content {
  border-radius: 4px;
  margin: 24px;
  min-height: 800px;
  background-color: #ffffff;
  .title {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 20px 24px 0;
    background-color: #ffffff;
    .label {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #666666;
      margin-right: 6px;
    }
  }
  .table1 {
    padding: 24px;
    .btF {
      cursor: pointer;
    }
  }
  .tabs-box {
    border-bottom: 1px solid #f6f6f6;
    padding-left: 24px;
    display: flex;
    margin-top: 20px;
    div {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333;
      margin-right: 42px;
      padding-bottom: 6px;
      cursor: pointer;
      &.active {
        color: #1890ff;
        border-bottom: 2px solid #1890ff;
      }
      .huibiao {
        display: inline-block;
        background-color: #ff5050;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        // width: 16px;
        padding: 0 5px;
        margin-left: 2px;
      }
    }
  }
}
</style>
