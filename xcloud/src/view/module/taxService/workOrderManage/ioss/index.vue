<template>
  <div class="todoList padding16">
    <div v-if="!isDetailShow">
      <Form class="searchWrapper" :label-width="0" inline>
        <FormItem>
          <Input
            v-model="searchForm.searchContent"
            clearable
            placeholder="公司名称/手机号/服务号"
            style="width:200px;"
          />
        </FormItem>
        <!-- <FormItem>
          <Select
            style="width:200px;"
            clearable
            v-model="searchForm.shopSalePlatformName"
            placeholder="站点类型"
          >
            <Option
              v-for="(item, index) in siteTypeList"
              :value="item"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </FormItem> -->
        <FormItem>
          <Select
            style="width:200px;"
            clearable
            v-model="searchForm.countryCode"
            @on-change="countryChange"
            placeholder="注册国家"
          >
            <Option
              v-for="(item, index) in countryList"
              :value="item.code"
              :key="index"
              >{{ item.value }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <Select
            style="width:200px;"
            clearable
            v-model="searchForm.supplierId"
            placeholder="服务商"
          >
            <Option
              v-for="(item, index) in facilitatorList"
              :value="item.id"
              :key="index"
              >{{ item.shortName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <Select
            style="width:200px;"
            clearable
            v-model="searchForm.serviceStatus"
            placeholder="状态"
          >
            <Option
              v-for="(item, index) in serviceStatusList"
              :value="index"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.companyBody"
                  placeholder="归属公司">
            <Option value="1">跨税云</Option>
            <Option value="2">必胜道</Option>
            <Option value="3">卖家成长</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select
            style="width:200px;"
            clearable
            v-model="searchForm.registeredType"
            placeholder="注册类型"
          >
            <Option
              v-for="(item, index) in registerTypeList"
              :value="index + 1"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker
            type="datetimerange"
            :options="dateOptions"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="订单创建时间"
            style="width: 280px;"
            clearable
            :value="createTime"
            @on-change="changeCreateTime"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker
            type="datetimerange"
            :options="dateOptions"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="服务端审核时间"
            style="width: 280px;"
            clearable
            :value="checkTime"
            @on-change="changeCheckTime"
          ></DatePicker>
        </FormItem>
        <FormItem :label-width="0">
          <Button type="primary" style="margin-right:10px;" @click="searchQuery"
            >搜索</Button
          >
          <Button type="primary" ghost @click="resetQuery">重置</Button>
        </FormItem>
      </Form>
      <Tabs :value="searchForm.status" :animated="false" @on-click="tabsChange">
        <TabPane label="全部" name="-1"></TabPane>
        <TabPane label="待上传注册资料" name="0"></TabPane>
        <TabPane label="待审核" name="1"></TabPane>
        <TabPane label="注册中" name="3"></TabPane>
        <TabPane label="注册完成" name="4"></TabPane>
        <TabPane label="资料驳回" name="8"></TabPane>
        <TabPane label="已取消" name="82"></TabPane>
      </Tabs>
      <div class="btnTabs">
        <Button type="primary" v-show="hasAuthority('IOSS_export')" ghost @click="handleExport">导出</Button>
      </div>

      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="tableData"
        @on-selection-change="handleSelectChange"
      >
        <template slot="remarkContent" slot-scope="{ row }">
          <span class="handleBtn" @click="showRemarkList(row)">查看</span>
        </template>
        <template slot="refuseReason" slot-scope="{ row }">
          <span class="handleBtn" @click="showRefuseReason(row)">查看</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <span>{{ serviceStatusList[row.status] }}</span>
        </template>
        <!-- <template slot="shopSalePlatformName" slot-scope="{ row }">
          <span>{{ row.shopSalePlatformName }}</span>
        </template> -->
        <div slot="operation" class="action" slot-scope="{ row }">
          <Button type="primary" ghost size="small" @click="toDetail(row)"
            >查看</Button
          >
          <Button type="primary" ghost size="small" @click="toRemark(row)"
            >备注</Button
          >
        </div>
      </Table>
      <div class="paginationBox">
        <Page
          class="pagination"
          @on-page-size-change="changePageSize"
          @on-change="changePage"
          :current="searchForm.page"
          :total="searchForm.listTotal"
          :page-size="searchForm.limit"
          :page-size-opts="[5, 10, 15, 20]"
          show-total
          show-elevator
        />
      </div>
      <!-- 弹窗 -->
      <Modal v-model="remarkModal" title="添加备注">
        <div style="width:489px;margin-bottom:10px">
          <Input
            v-model="remarkObj.remarkComment"
            type="textarea"
            placeholder="请输入备注"
          />
        </div>
        <div style="display:flex;justify-content:center;">
          <span>附件：</span>
          <div>
            <Upload
              ref="taxFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreRemarkUpload"
              :on-success="remarkUploadSuccess"
              :on-remove="removeremark"
              style="width:260px"
              :show-upload-list="false"
            >
              <div style="padding: 10px 0">
                <Icon
                  type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"
                ></Icon>
                <span>请拖拽文件到此区域上传或点击上传</span>
              </div>
            </Upload>
            <div v-if="remarkObj.annex" style="width:300px">
              <a :href="remarkObj.annex" target="_blank">{{
                remarkObj.annexName
              }}</a>
              <Button class="deletBtn" type="text" ghost @click="removeremark">
                <img
                  class="closeImg"
                  src="@/assets/images/activeCloseImg.png"
                  alt=""
                />
              </Button>
            </div>
          </div>
        </div>
        <p style="color:rgb(247, 151, 40);text-align:center;">
          注：支持JPG、JPEG、PNG、PDF
        </p>
        <p slot="footer">
          <Button
            type="primary"
            ghost
            style="margin-right:20px;"
            @click="remarkModal = false"
            >取消</Button
          >
          <Button type="primary" @click="sureRemark">确认</Button>
        </p>
      </Modal>
      <Modal v-model="remarkListModal" title="备注信息">
        <div
          v-if="remarkList.length > 0"
          :class="remarkList.length > 3 ? 'overflow' : ''"
          style="padding-right: 15px;"
        >
          <div
            class="remark-list"
            v-for="(item, index) in remarkList"
            :key="index"
          >
            <p>
              <span>备注人：</span>
              <span>{{ item.remarkBy }}</span>
            </p>
            <p>
              <span>备注内容：</span>
              <span>{{ item.remarkComment }}</span>
            </p>
            <p v-if="item.annex">
              <span>附件：</span>
              <a
                :href="
                  item.annex.slice(0, 5) == 'http:'
                    ? item.annex.slice(0, 4) + 's' + item.annex.slice(4)
                    : item.annex
                "
                target="_blank"
                >{{ item.annexName ? item.annexName : "附件" }}</a
              >
            </p>
            <p>
              <span>备注时间：</span>
              <span>{{ item.remarkTime }}</span>
            </p>
            <span class="delet" @click="deletRemarkHandel(item.id, index)"
              >X</span
            >
          </div>
        </div>
        <div v-else style="text-align:center;font-size:30px;line-height:212px">
          当前服务单无备注
        </div>
        <p slot="footer" style="text-align:center">
          <Button type="primary" ghost @click="remarkListModal = false"
            >关闭</Button
          >
        </p>
      </Modal>
      <Modal v-model="refuseReasonModal" title="驳回详情">
        <div
          v-if="refuseReasonList.length > 0"
          :class="refuseReasonList.length > 3 ? 'overflow' : ''"
          style="padding-right: 15px;"
        >
          <div
            class="remark-list"
            v-for="(item, index) in refuseReasonList"
            :key="index"
          >
            <p>
              <span>驳回人：</span>
              <span>{{ item.refuseBy }}</span>
            </p>
            <p>
              <span>驳回原因：</span>
              <span>{{ item.refuseReason }}</span>
            </p>
            <p>
              <span>驳回时间：</span>
              <span>{{ item.refuseTime }}</span>
            </p>
          </div>
        </div>
        <div v-else style="text-align:center;font-size:30px;line-height:212px">
          当前服务单无驳回
        </div>
        <p slot="footer" style="text-align:center">
          <Button type="primary" ghost @click="refuseReasonModal = false"
            >关闭</Button
          >
        </p>
      </Modal>
    </div>
    <Details v-if="isDetailShow" :id="detailId" :userId="userId" :progressBar="progressBar" @back="isDetailShow=false" @refresh="refreshList" />
  </div>
</template>

<script>
import { getTaxCountry } from "@/api/taxService/common.js";
import * as API from "@/api/taxService/ioss.js";
import facilitatorAndTax from "@/view/module/taxService/common/facilitatorAndTax.js";
import axios from "axios";
import { getToken } from "@/libs/util";
import Details from "./components/Details";
export default {
  extends: facilitatorAndTax,
  components: {
    Details
  },
  data() {
    return {
      isDetailShow: false,
      fileUpload: this.workOrderFile,
      searchForm: {},
      siteTypeList: ["Amazon", "eBay", "速卖通", "独立站/自建站", "其他"],
      countryList: [],
      facilitatorList: [],
      serviceStatusList: ["未购买", "正常", "待续费", "税号注销", "已转出"],
      registerTypeList: ["服务商注册", "自行注册"],
      tabStatisInfo: {},
      createTime: "",
      checkTime: "",
      // 查询条件中日期加入快捷选择
      dateOptions: {
        shortcuts: [
          {
            text: "近一周",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "近一个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "近三个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      loading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "服务号",
          align: "center",
          key: "serverNo"
        },
        {
          title: "注册国家",
          align: "center",
          key: "iossCountryName"
        },
        {
          title: "服务商",
          align: "center",
          key: "supplierName"
        },
        {
          title: "公司名称",
          align: "center",
          key: "companyName"
        },
        // {
        //   title: "站点类型",
        //   align: "center",
        //   slot: "shopSalePlatformName"
        // },
        {
          title: "客户手机号",
          align: "center",
          key: "userMobile"
        },
        {
          title: "跟进人",
          align: "center",
          key: "followUserName"
        },
        {
          title: "申报周期",
          align: "center",
          render: (h, params) => {
            let text = '';
            if(params.row.periodType == '-1'){
              text = '暂无'
            }else if(params.row.periodType == '0'){
              text = '月报'
            }else if(params.row.periodType == '1'){
              text = '季报'
            }
            return h("span",text);
          }
        },
        {
          title: "状态",
          align: "center",
          slot: "status"
        },
        {
          title: '归属公司',
          render: (h, params) => {
            let text = '';
            if(params.row.companyBody == '1'){
              text = '跨税云';
            }else if(params.row.companyBody == '2'){
              text = '必胜道';
            }else if(params.row.companyBody == '3'){
              text = '卖家成长';
            }
            return h('span', text)
          }
        },
        {
          title: "服务截止时间",
          align: "center",
          key: "expirationTime"
        },
        {
          title: "备注",
          align: "center",
          slot: "remarkContent"
        },
        {
          title: "驳回原因",
          align: "center",
          slot: "refuseReason"
        },
        {
          title: "操作",
          align: "center",
          slot: "operation"
        }
      ],
      tableData: [],
      remarkListModal: false,
      remarkList: [],
      refuseReasonModal: false,
      refuseReasonList: [],
      remarkModal: false,
      remarkObj: {},
      detailId:'',
      progressBar:'',
      userId:'',
    };
  },
  computed: {
    roles() {
      return this.$store.state.user.roles;
    }
  },
  created() {
    this.getCountryList();
    this.getTableList();
  },
  methods: {
    refreshList() {
      this.isDetailShow = false;
      this.getTableList()
    },
    //获取税号国家下拉数据
    getCountryList() {
      API.getCountryByIoss().then(res => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    searchQuery() {
      this.searchForm.page = 1;
      // this.searchForm.status = "-1";
      this.getTableList();
    },
    resetQuery() {
      this.createTime = "";
      this.checkTime = "";
      this.searchForm = {
        page: 1,
        limit: 10,
        listTotal: 0
        // status:'-1',
      };
      this.getTableList();
    },
    // 创建时间
    changeCreateTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes("00:00:00")) {
        endTime = endTime.replace("00:00:00", "23:59:59");
      }
      this.searchForm.createTimeBegin = time[0];
      this.searchForm.createTimeEnd = endTime;
    },
    // 服务端审核时间
    changeCheckTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes("00:00:00")) {
        endTime = endTime.replace("00:00:00", "23:59:59");
      }
      this.searchForm.auditTimeBegin = time[0];
      this.searchForm.auditTimeEnd = endTime;
    },
    //选择tab状态
    tabsChange(name) {
      this.searchForm.page = 1;
      this.searchForm.status = name;
      this.getTableList();
    },
    // 选择
    handleSelectChange() {},
    // 改变当前页数
    changePage(page = 1) {
      this.searchForm.page = page;
      this.getTableList();
    },
    // 改变每页显示条数
    changePageSize(limit) {
      this.searchForm.limit = limit;
      this.getTableList();
    },
    // 获取列表
    getTableList() {
      let params = { ...this.searchForm };
      if (params.status == -1) {
        params.status = "";
      }
      API.getIOSSList(params)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.searchForm.listTotal = Number(res.data.total);
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    //导出
    handleExport() {
      // 获取查询条件
      let params = { ...this.searchForm };
      axios({
        url: this.baseUrl + "/etax/services/ioss/management/excelList",
        data: params,
        method: "post",
        headers: { 'Authorization': "Bearer " + getToken() },
        responseType: "blob",
      }).then(res => {
        if (res.data) {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          const link = document.createElement("a");
          const href = window.URL.createObjectURL(blob); //创建下载的链接
          link.href = href;
          link.download = "IOSS列表导出.xls"; //下载后文件名
          document.body.appendChild(link);
          link.click(); //点击下载
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        } else {
          this.$Message.error("导出文件失败");
        }
      });
    },
    // 显示备注弹窗
    showRemarkList(row) {
      this.remarkListModal = true;
      API.getRemarkList({ serverNo: row.serverNo }).then(res => {
        if (res.code == 0) {
          this.remarkList = res.data;
          this.remarkListModal = true;
        }
      });
    },
    // 显示驳回信息弹窗
    showRefuseReason(row) {
      this.refuseReasonModal = true;
      API.getRefuseList({ serverNo: row.serverNo }).then(res => {
        if (res.code == 0) {
          this.refuseReasonList = res.data;
          this.refuseReasonModal = true;
        }
      });
    },
    // 添加备注
    toRemark(row) {
      this.remarkObj = {
        serverNo: "",
        annex: "",
        ids: "",
        annexName: "",
        remarkComment: ""
      };
      this.remarkObj.serverNo = row.serverNo;
      this.remarkModal = true;
    },
    saveRemarkList(index) {
      this.$Modal.confirm({
        title: "删除提醒",
        content: `<p>您确定要删除该备注吗？</p>`,
        onOk: () => {
          API.addOrDeletRemark(this.remarkObj).then(res => {
            if (res.code == 0) {
              this.$Message.success("删除成功");
              this.remarkObj.ids = "";
              this.remarkList.splice(index, 1);
            }
          });
        }
      });
    },
    deletRemarkHandel(id, index) {
      this.remarkObj.ids = id;
      this.saveRemarkList(index);
    },
    sureRemark() {
      if (this.remarkObj.remarkComment == "") {
        this.$Message.info("请输入备注内容");
        return;
      }
      API.addOrDeletRemark(this.remarkObj).then(res => {
        if (res.code == 0) {
          this.$Message.success("添加成功");
          this.remarkModal = false;
        }
      });
    },
    //备注附件上传之前
    beroreRemarkUpload() {},
    //备注附件上传成功
    remarkUploadSuccess(res, file, fileList) {
      this.remarkObj.annex = res.data.fileUrl;
      this.remarkObj.annexName = res.data.origFileName;
    },
    //移除备注附件
    removeremark(file, fileList) {
      this.remarkObj.annex = "";
      this.remarkObj.annexName = "";
    },
    //查看详情
    toDetail(row) {
      // 如果当前用户是税务经理，且税务经理未认领，不可查看详情
      if (
        !row.disposeId &&
        this.roles.some(el => el.roleCode == "tax_commissioner")
      ) {
        this.$Message.warning("该工单未认领！");
        return false;
      }
      this.isDetailShow = true;
      this.detailId = row.id;
      this.progressBar = row.progressBar;
      this.userId = row.userId;
    }
  }
};
</script>

<style scoped lang="less">
* {
  word-break: break-all;
}
.todoList {
  background: #fff;
  position: relative;
}
.padding16 {
  padding: 16px;
  border-radius: 2px;
}
.searchWrapper {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.btnTabs {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}
.paginationBox {
  display: flex;
  justify-content: flex-end;
}
.handleBtn {
  color: #3388ff;
  background: none;
  border: none;
  font-size: 12px;
  padding: 0px 6px;
  cursor: pointer;
}
.overflow {
  height: 450px;
  overflow: auto;
}
.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /deep/ .ivu-btn {
    margin: 5px 0;
  }
}
.closeImg {
  width: 11px;
  height: 11px;
}
.overflow {
  height: 450px;
  overflow: auto;
}
.remark-list {
  position: relative;
  font-size: 14px;
  border-bottom: 1px solid #666;
  margin-bottom: 20px;
  padding-bottom: 10px;
  word-break: break-all;
  white-space: pre-wrap;
  p {
    width: 90%;
  }
  .delet {
    position: absolute;
    color: red;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    top: 0;
    right: 0;
  }
}
</style>
