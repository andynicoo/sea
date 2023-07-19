<template>
  <div>
    <div class="commontitle">
      合规备案
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
          <Option value="US">美国</Option>
        </Select>
        <span class="label">服务状态</span>
        <Select v-model="searchForm.status" placeholder="请选择服务状态" style="width: 180px" clearable>
          <Option value="0">已过期</Option>
          <Option value="1">服务中</Option>
        </Select>
        <Button type="primary" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
        <Button @click="handleReset" style="margin-left: 10px">重置</Button>
      </div>
      <div class="tabs-box">
        <div :class="statusIndex == 'undefined' ? 'active' : ''" @click="changeStatus('undefined')">全部</div>
        <div @click="changeStatus(0)" :class="statusIndex == 0 ? 'active' : ''">待审核</div>
        <div @click="changeStatus(1)" :class="statusIndex == 1 ? 'active' : ''">备案中</div>
        <div @click="changeStatus(2)" :class="statusIndex == 2 ? 'active' : ''">备案完成</div>
        <div @click="changeStatus(3)" :class="statusIndex == 3 ? 'active' : ''">备案驳回</div>
      </div>
      <div class="table1">
        <Table
          :style="{ 'min-height': registerList.length == 0 ? '184px' : '' }"
          :no-data-text="'暂无处理事项'"
          :columns="columns"
          :data="registerList"
        >
          <template slot="operate" slot-scope="{ row }" style="color: #16ade9">
            <div style="display: flex; justify-items: center; justify-content: space-around">
              <!-- <div
                @click.stop="toRegister(row)"
                class="btF"
                style="color: #ed3e3e"
                v-if="row.filingStatus == '资料驳回'"
              >
                <img
                  src="@/assets/images/survey/bohui1.svg"
                  style="width: 20px; position: relative; top: 4px; margin-right: 0px"
                />
                <span>查看驳回原因</span>
              </div> -->
              <div class="btF" @click.stop="toRegister(row)" style="color: #515b6e">
                <img
                  src="@/assets/images/survey/detail.svg"
                  alt
                  style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                />
                <span>详情</span>
              </div>
            </div>
          </template>
        </Table>
        <div style="margin-top: 30px; text-align: right">
          <Page :total="total" :current="searchForm.page" @on-change="pageChange" />
        </div>
      </div>
    </div>
    <div style="height: 1px"></div>
  </div>
</template>

<script>
import { taxManageList, getFilingProduct } from "@/api/taxModule";
export default {
  data() {
    return {
      searchForm: {
        keyword: "",
        country: "",
        status: "",
        statusCode: "",
        page: 1,
        limit: 10,
      },
      statusIndex: "undefined",
      columns: [
        {
          title: "服务号",
          key: "serviceNo",
          width: 200,
        },
        {
          title: "备案工单号",
          key: "workNo",
          width: 200,
        },
        {
          title: "注册主体名称",
          key: "bodyName",
          width: 200,
          tooltip: true,
          render(h, params) {
            let type = "暂未填写";
            if (params.row.bodyName != "") {
              type = params.row.bodyName;
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
          key: "countryNameZh",
          width: 100,
        },
        {
          title: "协议生效日",
          key: "agreementBeginTime",
          render(h, params) {
            let beginTime = params.row.agreementBeginTime.slice(0, 10);
            return h("span", beginTime);
          },
          width: 126,
        },
        {
          title: "协议到期日",
          key: "agreementEndTime",
          render(h, params) {
            let endTime = params.row.agreementEndTime.slice(0, 10);
            return h("span", endTime);
          },
          width: 126,
        },
        {
          title: "服务状态",
          key: "status",
          render(h, params) {
            let type = ''
            if (params.row.status == 0) {
              type = '已过期'
            } else if (params.row.status == 1) {
              type = '服务中'
            }
            return h('span', type)
          },
          minWidth: 120,
        },
        {
          title: "工单状态",
          key: "statusLabel",
          minWidth: 120,
        },
        {
          title: "操作",
          slot: "operate",
          width: 200,
        },
      ],
      registerList: [],
      total: 6,
    };
  },
  methods: {
    handleSubmit() {
      this.searchForm.page = 1;
      this.getList();
    },
    handleReset() {
      this.searchForm = {
        page: 1,
        limit: 10,
        keyword: "",
        country: "",
      };
    },
    toRegister(row) {
      this.$router.push({
        path: "/complianceBusiness/filingDetails",
        query: {
          id: row.id,
          status: row.workOrderStatus,
          serviceId: row.serviceId,
          countryNameZh: row.countryNameZh,
          workNo:row.workNo,
        },
      });
    },
    pageChange(page) {
      this.searchForm.page = page;
      this.getList();
    },
    changeStatus(type) {
      if (type == "undefined") {
        this.searchForm.serviceProcess = "";
      } else {
        this.searchForm.serviceProcess = type;
      }
      this.statusIndex = type;
      this.searchForm.page = 1;
      this.getList();
    },
    getList() {
      getFilingProduct(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
        }
      });
    },
  },
  created() {
    this.getList();
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
