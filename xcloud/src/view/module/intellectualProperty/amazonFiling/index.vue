<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" :model="searchForm" label-width="85px" inline>
        <el-form-item label="服务号">
          <el-input v-model="searchForm.serviceNo" clearable placeholder="服务号" style="wwidth: 168px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.userMobile" clearable placeholder="手机号" style="wwidth: 168px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchList(1)" style="margin: 0 12px">查询</el-button>
          <el-button type="default" icon="el-icon-refresh-left" @click="resetList">重置</el-button>
          <el-button type="text" size="small" @click="handleMoreSearch">
            <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
            {{ moreSerch ? "收起" : "更多" }}筛选
          </el-button>
        </el-form-item>
        <div v-show="moreSerch">
          <el-form-item label="公司名称">
            <el-input v-model="searchForm.applyName" clearable placeholder="公司名称" style="wwidth: 168px" />
          </el-form-item>
          <el-form-item label="受理号">
            <el-input v-model="searchForm.acceptNum" clearable placeholder="受理号" style="wwidth: 168px" />
          </el-form-item>
          <el-form-item label="商标名称">
            <el-input v-model="searchForm.trademarkNameEn" clearable placeholder="商标名称" style="wwidth: 168px" />
          </el-form-item>
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" clearable placeholder="订单编号" style="wwidth: 168px" />
          </el-form-item>
          <el-form-item label="国家">
            <el-select clearable v-model="searchForm.countryCode" placeholder="国家" filterable>
              <el-option v-for="(item, index) in countryList" :value="item.countryCode" :label="item.countryNameZh" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单归属人" prop="attributionId">
            <el-select style="" clearable placeholder="选择跟进人" filterable v-model.trim="searchForm.attributionId" :filter-method="onFilter">
              <el-option-group>
                <li class="option_title" style="background: #f6f8fa">
                  <span>姓名</span>
                  <span>手机号</span>
                  <span>部门</span>
                </li>

                <el-option v-for="item in followListCopy" :key="item.userId" :label="item.nickName" :value="item.userId" class="option_title">
                  <span>{{ item.nickName }}</span>
                  &nbsp;
                  <span>{{ item.mobile }}</span>
                  &nbsp;
                  <span>{{ item.departmentName }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker type="daterange" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" v-model="searchForm.declareEndTime" @change="changeDate" style="width: 340px"></el-date-picker>
          </el-form-item>
          <el-form-item label="修改时间">
            <el-date-picker type="daterange" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" v-model="searchForm.updateTime" @change="changeUpdateDate" style="width: 340px"></el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="searchForm.status" @tab-click="tabsChange">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane label="待录入验证码" name="1"></el-tab-pane>
        <el-tab-pane label="已录验证码" name="2"></el-tab-pane>
        <el-tab-pane label="驳回申请" name="3"></el-tab-pane>
      </el-tabs>
      <el-table border ref="table" :height="tableHeight" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :data="tableData">
        <Empty slot="empty" />
        <el-table-column align="center" label="服务编号" width="180" prop="serviceNo"></el-table-column>
        <el-table-column label="商标" width="180">
          <template slot-scope="{ row }">
            <p>订单编号：{{ row.orderNo }}</p>
            <p>商标名称：{{ row.trademarkNameEn }}</p>
            <p>服务名称：{{ row.serviceName }}</p>
            <p>受理号：{{ row.acceptNum }}</p>
          </template>
        </el-table-column>
        <el-table-column label="国家" prop="countryNameZh"></el-table-column>
        <el-table-column label="订单归属人" prop="attributionName"></el-table-column>
        <el-table-column label="律师/邮箱">
          <template slot-scope="{ row }">
            <p>律师：{{ row.attorneyName }}</p>
            <p>邮箱：{{ row.attorneyEmail }}</p>
            <p>第二邮箱：{{ row.attorneyTwoEmail }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <p>{{ codeStatus[row.verificationStatus] }}</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-tooltip content="驳回原因" placement="top" v-if="row.verificationStatus == 3" v-show="hasAuthority('V1_3')">
              <el-link
                type="primary"
                :underline="false"
                @click="
                  () => {
                    rejectModal = true;
                    getProgress(row.id, 1);
                    rowInfo = row;
                  }
                "
              >
                <img src="@/assets/icons/icon_see.svg" alt="" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="录入验证码" placement="top" v-if="row.verificationStatus == 1" v-show="hasAuthority('V1_1')">
              <el-link
                type="primary"
                :underline="false"
                @click="
                  filingCodeModal = true;
                  title = '录入验证码';
                  rowInfo = row;
                "
              >
                <img src="@/assets/icons/icon_edit.svg" alt="" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="修改验证码" placement="top" v-if="row.verificationStatus == 2" v-show="hasAuthority('V1_2')">
              <el-link type="primary" :underline="false" @click="editorCodeFunc(row)">
                <img src="@/assets/icons/icon_edit.svg" alt="" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="更新进度" placement="top" v-if="row.verificationStatus == 1" v-show="hasAuthority('V1_4')">
              <el-link
                type="primary"
                :underline="false"
                @click="
                  () => {
                    progressModal = true;
                    getProgress(row.id, 2);
                    rowInfo = row;
                  }
                "
              >
                <img src="@/assets/icons/icon-refrnesh.svg" alt="" />
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @current-change="changePageHandler"
        @size-change="handlePageSize"
        :current-page.sync="pageInfo.page"
        :total="pageInfo.total"
        :page-sizes="$constant.WORKER_SERVER_PAGELIST"
        :page-size="pageInfo.limit"
        show-total
        show-elevator
        layout="total, sizes, prev, pager, next, jumper"
        show-sizer
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="filingCodeModal" width="460" @close="cancelModal" :title="title">
      <el-form :model="formCodeItem" label-width="100" ref="formCodeItem" :rules="ruleValidate">
        <el-form-item label="验证码：" prop="radioFilingCode" v-if="title != '修改验证码'">
          <RadioGroup v-model="formCodeItem.radioFilingCode" style="line-height: 1">
            <Radio label="0" style="vertical-align: sub">收到了</Radio>
            <Radio label="1" style="vertical-align: sub">没有收到，驳回重新申请</Radio>
          </RadioGroup>
        </el-form-item>
        <el-form-item label="录入验证码：" key="verificationCode" prop="verificationCode" v-if="formCodeItem.radioFilingCode == 0">
          <el-input v-model="formCodeItem.verificationCode" key="formCodeItem.verificationCode" placeholder="输入验证码"></el-input>
        </el-form-item>
        <el-form-item label="驳回原因：" key="rejectReason" prop="rejectReason" v-if="formCodeItem.radioFilingCode == 1">
          <el-input type="textarea" :rows="6" key="formCodeItem.rejectReason" v-model.trim="formCodeItem.rejectReason" maxLength="200" placeholder="驳回原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right; padding: 10px 0">
        <el-button type="primary" ghost @click="filingCodeModal = false">取消</el-button>
        <el-button @click="sureFilingCode('formCodeItem')">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="progressModal" width="460" @close="onProgressModalClose" title="更新进度" :footer="null">
      <el-form :model="updateCode" label-width="100" ref="updateCode" :rules="updateCodeRule">
        <el-form-item label="更新进度" prop="record" v-if="title != '修改验证码'">
          <el-popover :close-delay="0" :offset="-10" placement="bottom" width="430" trigger="focus">
            <el-input type="text" v-model.trim="updateCode.record" maxLength="20" style="width: 430px" slot="reference" placeholder="更新进度" />
            <div slot="default">
              <div class="progress-option" v-for="item in progressOption" :key="item.value" @click="() => (updateCode.record = item.value)">{{ item.value }}</div>
            </div>
          </el-popover>
          <!-- <el-select ref="recordRef"    filterable  :filter-method="() => progressOption" clear allow-create default-first-option @focus="onProgressFocus" @blur="onProgressBlur">
            <el-option v-for="item in progressOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select> -->
          <el-button @click="onProgressConfirm" style="margin-left: 20px" type="primary">确定</el-button>
        </el-form-item>
        <div class="record-container">
          <el-empty v-if="recordList.length === 0" class="record-item" description="暂无数据"></el-empty>
          <div v-else v-for="item in recordList" :key="item.createTime" class="record-item">
            <div class="time">
              <span>{{ item.operateName || "客户" }}</span>
              <span>{{ item.createTime }}</span>
            </div>
            <div class="record-content">{{ item.recordText }}</div>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="rejectModal" width="300" @close="() => (rejectModal = false)" title="驳回原因" :footer="null">
      <div class="record-container reject-c">
        <el-empty v-if="recordList.length === 0" class="record-item" description="暂无数据"></el-empty>
        <div v-else v-for="item in recordList" :key="item.operateId" class="record-item">
          <div class="reject">
            <span class="reject-title">操作时间:</span>
            <span>{{ item.createTime }}</span>
          </div>
          <div class="reject">
            <span class="reject-title">驳回原因:</span>
            <span class="content">{{ item.recordText }}</span>
          </div>
          <div class="reject">
            <span class="reject-title">操作人:</span>
            <span class="content">{{ item.operateName }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as API from "@/api/newApi/intellectualProperty/amazonFiling";
import { getCountrySelectList, userList } from "@/api/newApi/common.js";
import cacheQuery from "@/mixins/cacheQuery";
export default {
  data() {
    return {
      countryList: [],
      followList: [],
      followListCopy: [],
      filingCodeModal: false,
      progressModal: false,
      rejectModal: false,
      title: "录入验证码",
      searchForm: {
        status: "-1",
      },
      cacheKey: "searchForm",
      copyListQuery: {},
      tableLoading: false,
      pageInfo: {
        total: 0,
        limit: 10,
        page: 1,
      },
      tableData: [],
      formCodeItem: {
        radioFilingCode: "0",
        verificationCode: "",
        rejectReason: "",
      },
      updateCode: {
        record: "",
      },
      ruleValidate: {
        radioFilingCode: [{ required: true, message: "请选择是否收到验证码", trigger: "change" }],
        verificationCode: [{ required: true, message: "请录入验证码", trigger: "blur" }],
        rejectReason: [{ required: true, message: "请输入驳回原因", trigger: "blur" }],
      },
      updateCodeRule: {
        record: [{ required: true, message: "请输入当前进度描述", trigger: "change" }],
      },
      codeStatus: {
        1: "待录入验证码",
        2: "已录入验证码",
        3: "驳回申请",
      },
      rowInfo: {},
      moreSerch: false,
      progressOption: [
        {
          value: "验证码暂未查询到，请耐心等待~",
          label: "验证码暂未查询到，请耐心等待~",
        },
        {
          value: "验证码已超过3天未收到，建议您可以联系亚马逊重新备案哦~",
          label: "验证码已超过3天未收到，建议您可以联系亚马逊重新备案哦~",
        },
      ],
      recordList: [],
    };
  },
  mixins: [cacheQuery],
  methods: {
    onFilter(v = "") {
      const inputVal = v.replace(/^\s+|\s+$/gm, "");
      this.followListCopy = this.followList.filter((item) => item.nickName.includes(inputVal));
    },
    onProgressModalClose() {
      this.updateCode.record = "";
      this.progressModal = false;
      this.$refs["updateCode"].resetFields();
    },
    onProgressConfirm() {
      this.$refs["updateCode"].validate((valid) => {
        if (valid) {
          let paramsData = {
            id: this.rowInfo.id,
            record: this.updateCode.record,
          };
          API.setAmazonRecordAPI(paramsData).then((res) => {
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.progressModal = false;
              this.searchList();
              this.$refs["updateCode"].resetField();
            }
          });
        }
      });
    },
    // 获取归属人
    getUserList() {
      userList({
        page: 1,
        limit: 100,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
          this.followListCopy = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取 更新记录
    getProgress(id, recordType = 1) {
      this.recordList = [];
      API.getAmazonRecordAPI({ id, recordType })
        .then((res) => {
          this.recordList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountrySelectList() {
      getCountrySelectList()
        .then((res) => {
          this.countryList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    changeDate(date) {
      console.log(date);
      if (date) {
        this.searchForm.createEndTime = date[1];
        this.searchForm.createStartTime = date[0];
      } else {
        this.searchForm.createEndTime = "";
        this.searchForm.createStartTime = "";
      }
    },
    changeUpdateDate(date) {
      if (date) {
        this.searchForm.updateEndTime = date[1];
        this.searchForm.updateStartTime = date[0];
      } else {
        this.searchForm.updateEndTime = "";
        this.searchForm.updateStartTime = "";
      }
    },
    searchList(page) {
      this.tableLoading = true;
      if (page) {
        this.pageInfo.page = page;
      }
      let data = { ...this.searchForm };
      delete data.declareEndTime;
      delete data.updateTime;
      data.page = this.pageInfo.page;
      data.limit = this.pageInfo.limit;
      if (this.searchForm.status == "-1") delete data.status;
      this.setPageCache();
      API.amazonRecordListAPI(data)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.pageInfo.total = res.data.total - 0;
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    resetList() {
      this.searchForm = { ...this.copyListQuery };
      this.removePageCache();
    },
    tabsChange(val) {
      this.searchList(1);
    },
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.searchList();
    },
    handlePageSize(pageSize) {
      this.pageInfo.limit = pageSize;
      this.searchList(1);
    },
    editorCodeFunc(row) {
      this.filingCodeModal = true;
      this.title = "修改验证码";
      this.rowInfo = row;
      this.formCodeItem = {
        radioFilingCode: "0",
        verificationCode: row.verificationCode,
      };
    },
    cancelModal() {
      this.formCodeItem = {
        radioFilingCode: "0",
        verificationCode: "",
      };
    },
    sureFilingCode(name) {
      let that = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.formCodeItem.radioFilingCode);
          if (this.title == "录入验证码") {
            if (this.formCodeItem.radioFilingCode == "0") {
              that.inputSureFunc();
            } else {
              that.rejectFunc();
            }
          } else {
            that.updateFunc();
          }
        }
      });
    },
    inputSureFunc() {
      let paramsData = {
        id: this.rowInfo.id,
        verificationCode: this.formCodeItem.verificationCode,
      };
      API.inputFilingCodeAPI(paramsData).then((res) => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.filingCodeModal = false;
          this.searchList();
        }
      });
    },
    rejectFunc() {
      let paramsData = {
        id: this.rowInfo.id,
        rejectReason: this.formCodeItem.rejectReason,
      };
      API.rejectFilingCodeAPI(paramsData).then((res) => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.filingCodeModal = false;
          this.searchList();
        }
      });
    },
    updateFunc() {
      let paramsData = {
        id: this.rowInfo.id,
        serviceNo: this.rowInfo.serviceNo,
        servicesId: this.rowInfo.servicesId,
        verificationCode: this.formCodeItem.verificationCode,
      };
      API.updateFilingCodeAPI(paramsData).then((res) => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.filingCodeModal = false;
          this.searchList();
        }
      });
    },
  },
  mounted() {
    this.copyListQuery = { ...this.searchForm };
    this.getUserList();
    this.getPageCache();
    this.searchList(1);
    this.getCountrySelectList();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  line-height: 1;
  span {
    flex: 3;
  }
}
.record-container {
  height: 300px;
  overflow: auto;
}
.record-item {
  margin: 10px 0 0;
  padding-bottom: 10px;
  .time {
    color: #999;
    & span:nth-child(1) {
      margin-right: 10px;
    }
  }
  .reject {
    color: #333;
    .reject-title {
      color: #999;
      margin-right: 10px;
      width: 60px;
      text-align: right;
    }
  }
}
.reject-c .record-item {
  border-bottom: 1px solid #DCDFE6
}
.progress-option {
  padding: 5px 0;
  cursor: pointer;
  &:hover {
    background: #EBF5FF 
  }
}
</style>