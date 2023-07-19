<template>
  <div>
    <div class="commontitle">
       VAT申报
    </div>
    <div v-if="!addService">
      <div class="content">
        <div class="title">
          <div>
            <Form :model="searchForm" ref="searchForm" inline>
              <FormItem prop="searchContent">
                <Input v-model="searchForm.searchContent" style="width: 200px" placeholder="服务号/公司名称"></Input>
              </FormItem>
              <FormItem style="border-radius: 5px" prop="countryCode">
                <Select v-model="searchForm.countryCode" clearable style="width: 126px" placeholder="国家">
                  <Option :value="key" v-for="(item, key, index) in countryList" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
              <FormItem prop="applyType">
                <Select clearable v-model="searchForm.applyType" style="width: 150px" placeholder="服务类型">
                  <Option
                    :value="key"
                    v-for="(item, key, index) in applyTypeList"
                    :key="index"
                    v-show="key != 4 && key != 5 && key != 1"
                  >
                    {{ item }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem prop="status">
                <Select clearable v-model="searchForm.status" style="width: 126px" placeholder="服务状态">
                  <Option :value="key" v-for="(item, key, index) in statusList" :key="index">
                    {{ item }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSubmit" style="margin-left: 10px">搜索</Button>
                <Button @click="handleReset('searchForm')" style="margin-left: 10px">重置</Button>
              </FormItem>
            </Form>
          </div>
          <Button type="primary" @click="addService = true">申请服务</Button>
        </div>
        <div class="table1">
          <Table border :no-data-text="'暂无处理事项'" :columns="columns" :data="registerList">
            <template slot="serviceType" slot-scope="{ row }">
              <span>
                {{ applyTypeList[row.applyType] }}
              </span>
            </template>
            <template slot="serviceStatus" slot-scope="{ row }">
              <span
                :style="{
                  color:
                    row.status == 1
                      ? '#ED3E3E'
                      : row.status == 4
                      ? '#16ADE9'
                      : row.status == 6
                      ? '#16ADE9'
                      : row.status == 5
                      ? '#333333'
                      : '#666',
                }"
              >
                {{ statusList[row.status] }}
              </span>
            </template>
            <template slot="opreat" slot-scope="{ row }" style="color: #16ade9">
              <span v-if="row.status == 1 || row.status == 4">/</span>
              <span
                v-else
                @click="handelShowResult(row)"
                style="color: #16ade9; cursor: pointer"
              >
                <img src="@/assets/images/common/chakan.svg" style="position: relative; top: 2px" />
                查看服务结果
              </span>
            </template>
          </Table>
          <div style="margin-top: 30px; text-align: right">
            <Page :total="total" :current="searchForm.page" @on-change="pageChange" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="addService">
      <div class="content1">
        <div class="title1">
          <img src="@/assets/images/common/Rectangle.svg" @click="goAddList" />
          申请增值服务
        </div>
        <div class="table2">
          <Form :model="addForm" ref="addForm" :label-width="150" :rules="ruleValidate">
            <FormItem prop="applyType" label="服务类型：">
              <Select
                clearable
                v-model="addForm.applyType"
                @on-change="applyTypeChange"
                style="width: 294px"
                placeholder="请选择服务类型"
              >
                <Option
                  :value="key"
                  v-for="(item, key, index) in applyTypeList"
                  :key="index"
                  v-show="key != 4 && key != 5 && key != 1"
                >
                  {{ item }}
                </Option>
              </Select>
            </FormItem>
            <FormItem prop="companyNameZh" label="服务公司：">
              <AutoComplete
                v-model="addForm.companyNameZh"
                :data="dataList"
                transfer
                @on-change="companyNameZhChange"
                placeholder="请填写服务公司"
                style="width: 294px"
              ></AutoComplete>
              <br />
              <span
                v-if="showError"
                style="position: absolute; top: 100%; left: 0; line-height: 1; padding-top: 6px; color: #ed4014"
              >
                {{ showErrorContent }}
              </span>
            </FormItem>
            <FormItem prop="countryCode" label="服务国家：">
              <Select clearable disabled v-model="addForm.countryCode" style="width: 294px" placeholder="服务国家">
                <Option :value="key" v-for="(item, key, index) in countryList" :key="index">{{ item }}</Option>
              </Select>
            </FormItem>
            <FormItem label="备注：" prop="remark">
              <Input v-model="addForm.remark" type="textarea"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit1">提交申请</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <Modal footer-hide width="410" v-model="showResult">
      <p class="modal-title">服务结果</p>
      <div class="modal-row">
        <p class="modal-left">状态：</p>
        <p
          class="modal-right"
          :style="{
            color:
              status == 1
                ? '#ED3E3E'
                : status == 4
                ? '#16ADE9'
                : status == 6
                ? '#16ADE9'
                : status == 5
                ? '#333333'
                : '#666',
            fontWeight: '600',
          }"
        >
          {{ statusList[status] }}
        </p>
      </div>
      <div class="modal-row" v-if="status == 5 || (applyType != 4 && applyType != 5)">
        <p class="modal-left" v-if="status == 6">EORI号：</p>
        <p class="modal-left" v-else>备注：</p>
        <div class="modal-right">
          <p>{{ remart }}</p>
        </div>
      </div>
      <div class="modal-row" v-else>
        <p class="modal-left">DOC文件：</p>
        <div class="modal-right">
          <a
            target="_blank"
            :href="docUrl.slice(0, 5) == 'http:' ? docUrl.slice(0, 4) + 's' + docUrl.slice(4) : docUrl"
          >
            {{ countryName == "英国" ? "英代DOC文件模板" : "欧代DOC文件模板" }}
          </a>
        </div>
      </div>
      <div class="modal-footer">
        <Button type="primary" @click="showResult = false" style="width: 88px">确定</Button>
      </div>
    </Modal>
    <div style="height: 1px"></div>
  </div>
</template>

<script>
import { getAddedServiceList, getAddedCompanyList, submitAddedForm } from "@/api/addedService";
export default {
  data() {
    return {
      countryList: {
        GB: "英国",
        DE: "德国",
        FR: "法国",
        IT: "意大利",
        ES: "西班牙",
        CZ: "捷克",
        EU: "欧盟",
      },
      statusList: {
        1: "待处理",
        4: "处理中",
        5: "无需处理",
        6: "处理完成",
      },
      applyTypeList: {
        1: "英国低税率（保留）",
        9: "英国EORI申请",
        2: "德国EORI申请",
        3: "意大利EORI申请",
        4: "英代DOC申请",
        5: "欧代DOC申请",
        6: "西班牙EORI申请",
        7: "法国EORI申请",
        8: "捷克EORI申请",
      },
      showErrorContent: "",
      showError: false,
      companyNameZhList: [],
      dataList: [],
      addForm: {
        applyType: "",
        companyNameZh: "",
        countryCode: "",
        servicesId: "",
        remark: "",
      },
      ruleValidate: {
        applyType: [{ required: true, message: "请选择服务类型", trigger: "change" }],
        companyNameZh: [{ required: true, message: "请填写服务公司", trigger: "change" }],
        countryCode: [{ required: true, message: " ", trigger: "change" }],
      },
      addService: false,
      total: 0,
      remart: "",
      status: "",
      showResult: false,
      searchForm: {
        companyNameZh: "",
        countryCode: "",
        searchContent: "",
        status: "",
        applyType: "",
        page: 1,
        limit: 10,
      },
      registerList: [],
      columns: [
        {
          title: "序号",
          type: "index",
          width: 50,
        },
       
        {
          title: "工单号",
          key: "applyWorkNo",
          width: 180,
        },
        {
          title: "公司名称",
          key: "companyNameZh",
          width: 200,
        },
        {
          title: "国家",
          key: "countryNameZh",
        },
        {
          title: "服务类型",
          slot: "serviceType",
        },
        {
          title: "申请时间",
          key: "createTime",
        },
        {
          title: "服务进度",
          slot: "serviceStatus",
        },
        {
          title: "操作",
          slot: "opreat",
        },
      ],
      applyType: "",
      docUrl: "",
      countryName: "",
    };
  },
  methods: {
    goAddList() {
      this.addService = false;
      (this.searchForm = {
        companyNameZh: "",
        countryCode: "",
        searchContent: "",
        status: "",
        applyType: "",
        page: 1,
        limit: 10,
      }),
        (this.addForm = {
          applyType: "",
          companyNameZh: "",
          countryCode: "",
          servicesId: "",
          remark: "",
        }),
        (this.companyNameZhList = []);
      this.dataList = [];
      this.showError = false;
      this.getTableInfo();
    },
    companyNameZhChange(val) {
      this.dataList = [];

      if (JSON.stringify(this.companyNameZhList) == "{}") {
        this.showError = true;
        this.showErrorContent = "无匹配数据";
        if (this.addForm.companyNameZh == "" || this.addForm.companyNameZh == undefined) {
          this.showError = false;
        }
        return;
      }
      if (this.addForm.companyNameZh == "" || this.addForm.companyNameZh == undefined) {
        this.showError = false;
        this.addForm.servicesId = "";
        this.companyNameZhList.map((item) => {
          this.dataList.push(item.companyNameZh);
        });
        return;
      }
      this.companyNameZhList.map((item) => {
        if (item.companyNameZh.indexOf(this.addForm.companyNameZh) != -1) this.dataList.push(item.companyNameZh);
      });
  

      if (JSON.stringify(this.dataList) == "[]") {
        this.showError = true;
        this.addForm.servicesId = "";
        if (this.addForm.applyType == "" || this.addForm.applyType == undefined) {
          this.showErrorContent = "无匹配数据，请先选择服务类型";
        } else {
          this.showErrorContent = "无匹配数据";
        }
        return;
      }
      this.showError = false;
      let item = this.companyNameZhList.find((item) => item.companyNameZh == this.addForm.companyNameZh);
      console.log('item',item);
      if (item) {
        this.addForm.servicesId = item.serviceId;
      } else {
        this.addForm.servicesId = "";
      }
    },
    handleSubmit1() {
      if (this.addForm.applyType == "" || this.addForm.applyType == undefined) {
        this.$Message.error("请选择服务类型");
        return;
      }
      if (this.addForm.companyNameZh == "" || this.addForm.companyNameZh == undefined) {
        this.$Message.error("请填写服务公司");
        return;
      }
      if (JSON.stringify(this.companyNameZhList) == "{}") {
        this.$Message.error("请填写正确的服务公司");
        return;
      }
      let item = this.companyNameZhList.find((i) => i.companyNameZh == this.addForm.companyNameZh);
      if (JSON.stringify(this.dataList) == "[]" || item == undefined) {
        this.$Message.error("请填写正确的服务公司");
        return;
      }
      console.log(this.addForm)
      submitAddedForm(this.addForm).then((res) => {
        if (res.code == 0) {
          this.addService = false;
          (this.searchForm = {
            companyNameZh: "",
            countryCode: "",
            searchContent: "",
            status: "",
            applyType: "",
            page: 1,
            limit: 10,
          }),
            (this.addForm = {
              applyType: "",
              companyNameZh: "",
              countryCode: "",
              servicesId: "",
              remark: "",
            }),
            this.getTableInfo();
          this.companyNameZhList = [];
          this.dataList = [];
          this.$Message.success("已提交成功");
        }
      });
    },
    applyTypeChange(val) {
      this.dataList = [];
      if (val == "" || val == undefined) {
        this.addForm.countryCode = "";
        this.addForm.companyNameZh = "";
        this.companyNameZhList = [];
        this.showError = false;
        return;
      }
      val == "1" || val == "4"
        ? (this.addForm.countryCode = "GB")
        : val == "2"
        ? (this.addForm.countryCode = "DE")
        : val == "3"
        ? (this.addForm.countryCode = "IT")
        : val == "5"
        ? (this.addForm.countryCode = "EU")
        : val == "6"
        ? (this.addForm.countryCode = "ES")
        : val == "7"
        ? (this.addForm.countryCode = "FR")
        : val == "8"
        ? (this.addForm.countryCode = "CZ")
        : val == "9"
        ? (this.addForm.countryCode = "GB")
        : "";
      getAddedCompanyList({ applyType: val }).then((res) => {
        this.companyNameZhList = res.data;
        if (JSON.stringify(this.companyNameZhList) == "{}") {
          this.showError = true;
          this.showErrorContent = "无匹配数据";
          if (this.addForm.companyNameZh == "" || this.addForm.companyNameZh == undefined) {
            this.showError = false;
          }
          return;
        }
        this.companyNameZhList.map((item) => {
          this.dataList.push(item.companyNameZh);
        });
        let a = this.dataList.find((i) => i == this.addForm.companyNameZh);
        if (a == undefined) {
          this.dataList = [];
          this.showError = true;
          this.showErrorContent = "无匹配数据";
          if (this.addForm.companyNameZh == "") {
            this.showError = false;
            this.companyNameZhList.map((item) => {
              this.dataList.push(item.companyNameZh);
            });
          }
        }
      });
    },
    pageChange(page) {
      // console.log(page)
      this.searchForm.page = page;
      this.getTableInfo();
    },
    handelShowResult(row) {
  
      this.applyType = "";
      this.docUrl = "";
      this.countryName = "";
      this.status = row.status;
      this.remart = row.disposeResult;
      this.applyType = row.applyType;
      this.docUrl = row.docUrl;
      this.countryName = row.countryNameZh;
      this.showResult = true;
    },
    getTableInfo() {
      getAddedServiceList(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
          this.registerList.forEach((item) => {
            item.createTime = item.createTime.split(" ")[0];
          });
        }
      });
    },
    handleSubmit() {
      this.searchForm.page = 1;     
      this.getTableInfo();
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
  },
  mounted() {
    this.getTableInfo();
  },
};
</script>

<style lang="less" scoped>
.ivu-auto-complete.ivu-select-dropdown {
  max-height: 200px !important;
}

/deep/ .ivu-table-cell {
  padding-top: 10px;
  padding-bottom: 10px;
  color: #333333;
}
/deep/ .ivu-table-row {
  td {
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
.content1 {
  border-radius: 4px;
  margin: 24px;
  /deep/ textarea.ivu-input {
    width: 294px;
  }
  /deep/ .ivu-form .ivu-form-item-label {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .title1 {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 20px 24px 16px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    background-color: #ffffff;
    border-bottom: 1px solid #e9e9e9;
    img {
      cursor: pointer;
      position: relative;
      top: 3px;
    }
  }
  .table2 {
    padding: 24px;
    min-height: 727px;
    background-color: #ffffff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
/deep/ .ivu-table-header {
  text-align: center;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #333333;
  th {
    text-align: center;
    padding: 0;
  }
}
/deep/ .ivu-table-tip {
  text-align: center;
  table {
    min-height: 220px;
  }
  td {
    text-align: center;
  }
}
/deep/ .ivu-modal-content {
  min-height: 244px;
}
/deep/ .ivu-modal-body {
  padding: 0;
}
.modal-footer {
  text-align: right;
  padding-right: 40px;
  margin-top: 40px;
}
.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  padding: 15px 0 15px 24px;
  border-bottom: 1px solid #dddddd;
}
.modal-row {
  display: flex;
  justify-content: left;
  padding: 18px 24px 0 24px;
  .modal-left {
    font-size: 14px;
    font-family: PingFangSC;
    color: #666666;
  }
  .modal-right {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    width: 288px;
    color: #333;
    line-break: anywhere;
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
  .title {
    display: flex;
    justify-content: space-between;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 20px 24px 0;
    background-color: #ffffff;
    border-bottom: 1px solid #e9e9e9;
  }
  .table1 {
    padding: 24px;
    min-height: 727px;
    background-color: #ffffff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
