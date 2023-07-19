<template>
  <div class="todoList padding16">
    <!-- 显示列表 -->
    <div class="tableWrapper" v-if="!isDetailPage">
      <Form class="searchWrapper clearfix" :label-width="0" inline>
        <FormItem>
          <Input
            style="width:140px;"
            clearable
            filterable
            v-model="listQuery.searchContent"
            placeholder="公司名称/手机号/税号"
          >
          </Input>
        </FormItem>
        <FormItem>
          <Select
            style="width:140px;"
            clearable
            filterable
            v-model="listQuery.countryCode"
            placeholder="税号国家"
          >
            <Option
              v-for="(item, index) in countryList"
              :value="item.countryCode"
              :key="index"
              >{{ item.countryNameZh }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker
            type="datetimerange"
            :options="dateOptions"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="服务单创建时间"
            style="width: 280px;"
            clearable
            :value="listQuery.createServiceTime"
            @on-change="changeCreateServiceTime"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker
            type="datetimerange"
            :options="dateOptions"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="审核通过时间"
            style="width: 280px;"
            clearable
            :value="listQuery.passServiceTime"
            @on-change="changePassServiceTime"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker
            type="datetimerange"
            :options="dateOptions"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="退税完成时间"
            style="width: 280px;"
            clearable
            :value="listQuery.refundFinishTime"
            @on-change="changeRefundFinishTime"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Select
            style="width:140px;"
            clearable
            filterable
            v-model="listQuery.companyBody"
            placeholder="选择归属公司"
          >
            <Option value="1">跨税云</Option>
            <Option value="2">必胜道</Option>
            <Option value="3">卖家成长</Option>
          </Select>
        </FormItem>
        <FormItem :label-width="0">
          <Button type="primary" style="margin-right:10px;" @click="handleQuery"
            >搜索</Button
          >
          <Button type="primary" ghost @click="resetQuery">重置</Button>
        </FormItem>
      </Form>
      <div class="table-wrapper clearfix">
        <Tabs
          :value="listQuery.status"
          :animated="false"
          @on-click="tabsChange"
        >
          <TabPane label="全部" name="-1"></TabPane>
          <TabPane label="待提交资料" name="80"></TabPane>
          <TabPane label="待审核" name="81"></TabPane>
          <TabPane label="退税中" name="86"></TabPane>
          <TabPane label="退税完成" name="85"></TabPane>
          <TabPane label="资料驳回" name="83"></TabPane>
          <TabPane label="已关闭" name="82"></TabPane>
        </Tabs>

        <!-- 操作权限按钮 -->
        <div class="btnTabs">
          <Button
            v-show="hasAuthority('taxRefund_editTaxManager')"
            type="primary"
            style="margin-right: 10px"
            @click="showUpdateTaxManagerModal"
          >
            修改税务经理
          </Button>
        </div>

        <!-- 表格显示 -->
        <Table
          :loading="listLoading"
          ref="orderListRef"
          border
          :columns="tableColumns"
          :data="orderList"
          @on-selection-change="handleSelectChange"
        >
          <!-- 服务进度：80待提交资料，81待审核，82退税中，83资料驳回，84已关闭，85退税完成 -->
          <template slot="progressBar" slot-scope="{ row }">
            {{
              row.progressBar == 80
                ? "待上传退税资料"
                : row.progressBar == 81
                ? "退税待审核"
                : row.progressBar == 86
                ? "退税中"
                : row.progressBar == 83
                ? "退税资料驳回"
                : row.progressBar == 82
                ? "退税已关闭"
                : row.progressBar == 85
                ? "退税已完成"
                : "暂无"
            }}
          </template>
          <!-- 税务经理（为空则显示认领按钮操作） -->
          <template slot="taxManager" slot-scope="{ row }">
            <span v-if="row.disposeName">{{ row.disposeName }}</span>
            <span v-else>
              <!-- 是否有操作税务经理批量认领的按钮权限 -->
              <span
                v-if="hasTaxReviceRole"
                @click="taxManagerClaim(row)"
                class="handleBtn"
              >
                认领
              </span>
            </span>
          </template>
          <!-- 查看备注 -->
          <template slot="remark" slot-scope="{ row }">
            <div
              v-show="hasAuthority('taxRefund_searchRemarkDetail')"
              @click="showDetailRemarkModal(row)"
              class="handleBtn"
            >
              查看备注
            </div>
          </template>
          <!-- 查看驳回原因 -->
          <template slot="rejectResult" slot-scope="{ row }">
            <div
              v-show="hasAuthority('taxRefund_DetailReject')"
              @click="showDetailRejectModal(row)"
              class="handleBtn"
            >
              查看原因
            </div>
          </template>
          <!-- 操作 -->
          <template slot="operate" slot-scope="{ row }">
            <div
              v-show="hasAuthority('taxRefund_searchDetail')"
              @click="showDetailPage(row)"
              class="handleBtn"
            >
              查看
            </div>
            <div
              v-show="hasAuthority('taxRefund_addRemark')"
              @click="showAddRemarkModal(row)"
              class="handleBtn"
            >
              添加备注
            </div>
          </template>
        </Table>

        <Page
          class="pagination"
          @on-page-size-change="changePageSize"
          @on-change="changePageNo"
          :current="listQuery.pageNo"
          :total="listTotal"
          :page-size="listQuery.pageSize"
          :page-size-opts="[3, 6, 10, 15]"
          show-total
          show-elevator
        />
      </div>
    </div>

    <!-- 详情页面 -->
    <DetailInfo
      v-if="isDetailPage"
      @back="isDetailPage = false"
      :status="selectObj.progressBar"
      :serviceId="selectObj.id"
      :countryCode="selectObj.countryCode"
      @refresh="queryData"
    />

    <!-- 添加备注 -->
    <Modal v-model="addRemarkModal" title="添加备注">
      <div>
        <div class="content-text">
          <Input
            v-model="remarkContent"
            type="textarea"
            :rows="4"
            :maxlength="500"
            show-word-limit
            placeholder="请输入备注内容"
          />
        </div>
        <div class="content-file" style="margin-top:10px;">
          附件：
          <Upload
            ref="remarkUploadFileRef"
            type="drag"
            :action="remarkUploadUrl"
            :before-upload="onBeforeUpload"
            :on-success="onUploadSuccess"
            :on-remove="onUploadRemove"
            :data="{ prefix: 'other_order' }"
          >
            <div style="padding: 20px 0">
              <Icon
                type="ios-cloud-upload"
                size="52"
                style="color: #3399ff"
              ></Icon>
              <div>请拖拽文件到此区域上传或点击上传</div>
              <div style="font-size:12px; color:#ff9900;">
                注：支持JPG、JPEG、PNG、PDF格式上传
              </div>
              <div style="font-size:12px; color:#ff9900;">
                温馨提示：只能上传一个文件
              </div>
            </div>
          </Upload>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="addRemarkModal = false"
          >取消</Button
        >
        <Button type="primary" size="large" @click="handleSubmitRemark"
          >保存</Button
        >
      </div>
    </Modal>

    <!-- 查看备注详情 -->
    <Modal v-model="detailRemarkModal" title="备注详情">
      <div class="remark-box">
        <!-- eslint-disable -->
        <template v-if="detailRemarkList && detailRemarkList.length > 0">
          <div
            class="remark-list"
            v-for="(item, index) in detailRemarkList"
            :key="item.id"
          >
            <div class="remark-item">
              <div class="remark-label">备注人：</div>
              <div class="remark-content">
                {{ item.remarkBy }}
                <span
                  v-show="hasAuthority('taxRefund_deleteRemarkDetail')"
                  class="btn-delete"
                  @click="handleDeleteRemark(item, index)"
                  >删除</span
                >
              </div>
            </div>
            <div class="remark-item">
              <div class="remark-label">备注内容：</div>
              <div class="remark-content">{{ item.remarkComment }}</div>
            </div>
            <div class="remark-item" v-if="item.annex">
              <div class="remark-label">附件：</div>
              <div class="remark-content">
                <a :href="item.annex" target="_blank">{{ item.annexName }}</a>
              </div>
            </div>
            <div class="remark-item">
              <div class="remark-label">备注时间：</div>
              <div class="remark-content">{{ item.remarkTime }}</div>
            </div>
          </div>
        </template>

        <!-- 无备注信息 -->
        <div class="nodata" v-else>
          当前服务单无备注
        </div>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="detailRemarkModal = false">
          关闭
        </Button>
      </div>
    </Modal>

    <!-- 查看驳回原因 -->
    <Modal v-model="detailRejectModal" title="驳回详情">
      <div class="remark-box">
        <!-- eslint-disable -->
        <template v-if="detailRejectList && detailRejectList.length > 0">
          <div
            class="remark-list"
            v-for="(item, index) in detailRejectList"
            :key="item.id"
          >
            <div class="remark-item">
              <div class="remark-label">驳回人：</div>
              <div class="remark-content">
                {{ item.refuseBy }}
              </div>
            </div>
            <div class="remark-item">
              <div class="remark-label">驳回原因：</div>
              <div class="remark-content">{{ item.refuseReason }}</div>
            </div>
            <div class="remark-item">
              <div class="remark-label">驳回时间：</div>
              <div class="remark-content">{{ item.refuseTime }}</div>
            </div>
          </div>
        </template>

        <!-- 无驳回原因 -->
        <div class="nodata" v-else>
          当前服务单无驳回
        </div>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="detailRejectModal = false">
          关闭
        </Button>
      </div>
    </Modal>

    <!-- 批量更改税务经理弹框 -->
    <Modal v-model="updateTaxManagerModal" title="更改税务经理">
      <div style="margin:20px;">
        <div
          style="display:flex;align-items:center;"
          v-if="selectRows.length == 1"
        >
          <div>当前税务经理：</div>
          <div>{{ selectRows[0].disposeName }}</div>
        </div>
        <div style="display:flex;align-items:center;margin-top:20px;">
          <div>修改税务经理：</div>
          <div>
            <Select
              v-model="selectRoleUserId"
              style="width:300px;"
              placeholder="选择税务经理"
            >
              <Option
                v-for="(item, index) in roleUserList"
                :value="item.userId"
                :key="index"
              >
                {{ item.nickName }}
              </Option>
            </Select>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button
          type="default"
          size="large"
          @click="updateTaxManagerModal = false"
        >
          取消
        </Button>
        <Button type="primary" size="large" @click="handleUpdateTaxManager">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// 引入api
import { getUserRoleList, currentRole } from "@/api/taxService/otherService.js";
import {
  getCountryList,
  getRefundList,
  addRemark,
  getRemarkList,
  deleteRemark,
  rejectDetail,
  taxManagerRevice,
  taxManagerUpdate
} from "@/api/taxRefund/gbRefund";

// 引入组件
import DetailInfo from "./components/DetailInfo";
export default {
  components: { DetailInfo },
  data() {
    return {
      // 当前页面是否显示详情页面，默认false
      isDetailPage: false,

      //  当前选择的tab name，默认全部（-1）
      tabName: "-1",

      // 查询条件-国家列表
      countryList: [],

      // 批量更改税务经理弹框
      updateTaxManagerModal: false,
      // 更改弹出的人员列表
      roleUserList: [],
      selectRoleUserId: "",

      // 列表和分页
      orderList: [],
      listLoading: false, // 表格listLoading
      listTotal: 1, // 总条数
      listQuery: {
        orderStatus: "",
        searchContent: "", //  查询的内容
        countryCode: "", // 税号国家code
        createServiceTime: "", // 服务单创建时间
        passServiceTime: "", // 审核通过时间
        refundFinishTime: "", // 退税完成时间
        companyBody: "", // 选择归属公司
        pageNo: 1,
        pageSize: 10
      },

      // 多选多条数据
      selectRows: [],
      // 单选某条数据
      selectObj: {},

      // 表格的列数据
      tableColumns: [
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
          title: "服务进度",
          align: "center",
          slot: "progressBar"
        },
        {
          title: "退税国家",
          align: "center",
          key: "countryNameZh",
          render(h, params) {
            return h("span", params.row.countryNameZh);
          }
        },
        {
          title: "税号",
          align: "center",
          key: "vatTaxNumber",
          render(h, params) {
            return h("span", params.row.vatTaxNumber);
          }
        },
        {
          title: "公司名称",
          align: "center",
          key: "companyName"
        },
        {
          title: "退税周期",
          align: "center",
          key: "taxRefundInterval"
        },
        {
          title: "审核通过时间",
          align: "center",
          key: "checkPassTime"
        },
        {
          title: "归属公司",
          align: "center",
          key: "companyBody",
          render(h, params) {
            return h(
              "span",
              params.row.companyBody == 1
                ? "跨税云"
                : params.row.companyBody == 2
                ? "必胜道"
                : params.row.companyBody == 3
                ? "卖家成长"
                : ""
            );
          }
        },
        {
          title: "税务经理",
          align: "center",
          slot: "taxManager"
        },
        {
          title: "备注",
          align: "center",
          slot: "remark"
        },
        {
          title: "驳回原因",
          align: "center",
          slot: "rejectResult"
        },
        {
          title: "操作",
          align: "center",
          slot: "operate",
          minWidth: 60
        }
      ],

      // 是否有操作税务经理批量认领的按钮权限
      hasTaxReviceRole: false,

      // 操作点击的订单详情信息
      orderInfo: {},
      processRecords: [], // 进度记录数据
      operateRecords: [], // 操作记录数据

      // 添加备注
      addRemarkModal: false,
      remarkContent: "", // 记录的进度内容
      // 备注上传文件
      remarkUploadUrl: this.workOrderFile,
      remarkFileList: [], // 成功上传的文件

      // 查看备注详情
      detailRemarkModal: false,
      detailRemarkList: [],

      // 查看驳回原因
      detailRejectModal: false,
      detailRejectList: [],

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
      }
    };
  },
  created() {
    this.getTaxReviceRole();
    this.queryCountry();
    this.queryData();
  },
  methods: {
    /**
     * 选择tab状态
     */
    tabsChange(name) {
      this.listQuery.pageNo = 1;
      this.tabName = name;
      this.listQuery.orderStatus = name;
      if (name == "-1") {
        this.listQuery.orderStatus = "";
      }
      this.queryData();
    },

    // 服务单创建时间
    changeCreateServiceTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes("00:00:00")) {
        endTime = endTime.replace("00:00:00", "23:59:59");
      }
      const dateTime = [time[0], endTime];
      this.listQuery.createServiceTime = dateTime;
    },
    // 审核通过时间
    changePassServiceTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes("00:00:00")) {
        endTime = endTime.replace("00:00:00", "23:59:59");
      }
      const dateTime = [time[0], endTime];
      this.listQuery.passServiceTime = dateTime;
    },
    // 退税完成时间
    changeRefundFinishTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes("00:00:00")) {
        endTime = endTime.replace("00:00:00", "23:59:59");
      }
      const dateTime = [time[0], endTime];
      this.listQuery.refundFinishTime = dateTime;
    },

    /**
     * 表格复选框多选
     */
    handleSelectChange(rows) {
      this.selectRows = rows;
    },

    /**
     * 生成列表的查询条件，供查询和导出时候公用
     */
    generateQueryParams() {
      let params = {
        status: this.listQuery.orderStatus,
        searchContent: this.listQuery.searchContent,
        countryCode: this.listQuery.countryCode,
        // 服务单创建时间区间
        startCreatedTime:
          this.listQuery.createServiceTime &&
          this.listQuery.createServiceTime.length > 0
            ? this.listQuery.createServiceTime[0]
            : "",
        endCreatedTime:
          this.listQuery.createServiceTime &&
          this.listQuery.createServiceTime.length > 0
            ? this.listQuery.createServiceTime[1]
            : "",
        // 审核通过区间
        startCheckPassTime:
          this.listQuery.passServiceTime &&
          this.listQuery.passServiceTime.length > 0
            ? this.listQuery.passServiceTime[0]
            : "",
        endCheckPassTime:
          this.listQuery.passServiceTime &&
          this.listQuery.passServiceTime.length > 0
            ? this.listQuery.passServiceTime[1]
            : "",
        // 退税完成时间区间
        startCompleteTime:
          this.listQuery.refundFinishTime &&
          this.listQuery.refundFinishTime.length > 0
            ? this.listQuery.refundFinishTime[0]
            : "",
        endCompleteTime:
          this.listQuery.refundFinishTime &&
          this.listQuery.refundFinishTime.length > 0
            ? this.listQuery.refundFinishTime[1]
            : "",
        // 公司主体
        companyBody: this.listQuery.companyBody,
        // 分页
        page: this.listQuery.pageNo,
        limit: this.listQuery.pageSize
      };

      return params;
    },
    /**
     * 查询条件-查询税号国家列表
     */
    queryCountry() {
      getCountryList().then(res => {
        if (res.code == 0) {
          this.countryList = res.data;
        } else {
          this.$Message.warning("获取税号国家列表失败");
        }
      });
    },

    /**
     * 点击查询按钮和重置
     */
    handleQuery() {
      this.listQuery.pageNo = 1;
      this.queryData();
    },
    // 重置查询
    resetQuery() {
      this.listQuery = {
        orderStatus: "",
        searchContent: "", //  查询的内容
        countryCode: "", // 税号国家code
        createServiceTime: "", // 服务单创建时间
        passServiceTime: "", // 审核通过时间
        refundFinishTime: "", // 退税完成时间
        companyBody: "", // 选择归属公司
        pageNo: 1,
        pageSize: 10
      };
    },

    /**
     * 查询工单分页列表
     */
    queryData() {
      this.listLoading = true;

      // 获取查询条件
      let params = this.generateQueryParams();
      getRefundList(params)
        .then(res => {
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            this.listTotal = Number(res.data.total);
            this.orderList = res.data.records;
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
        });
    },
    // 改变当前页数
    changePageNo(val) {
      this.listQuery.pageNo = val;
      this.queryData();
    },
    // 改变每页显示条数
    changePageSize(val) {
      this.listQuery.pageSize = val;
      this.queryData();
    },

    /**
     * 判断当前角色是否有税务经理认领权限
     */
    getTaxReviceRole() {
      currentRole().then(res => {
        if (res.code == 0) {
          let roleList = res.data;
          // 是否有税务经理认领权限（超级管理员、税务经理、税务主管）
          if (
            roleList.includes("admin") ||
            roleList.includes("tax_manager") ||
            roleList.includes("tax_supervisor")
          ) {
            this.hasTaxReviceRole = true;
          }
        }
      });
    },
    /**
     * 展示退税单详情
     */
    showDetailPage(row) {
      // 展示详情页面
      this.isDetailPage = true;
      this.selectObj = row;
    },

    /**
     * 税务经理认领
     */
    taxManagerClaim(row) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否确认税务经理认领？",
        onOk: () => {
          taxManagerRevice({
            serviceId: row.id
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success("认领成功");
              this.queryData();
            } else {
              this.$Message.warning(res.message);
            }
          });
        },
        onCancel: () => {}
      });
    },

    /**
     * 批量更改税务经理操作
     */
    showUpdateTaxManagerModal() {
      // 校验必须至少选择一条
      if (this.selectRows.length == 0) {
        this.$Message.warning("至少选择一条数据");
        return;
      }
      this.updateTaxManagerModal = true;
      this.roleUserList = [];
      this.selectRoleUserId = "";

      // 查询税务经理用户列表
      getUserRoleList({
        roleCode: "tax_manager;tax_supervisor;admin"
      }).then(res => {
        if (res.code == 0) {
          this.roleUserList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    // 更改税务经理
    handleUpdateTaxManager() {
      // 获得表格多选的id
      let ids = [];
      this.selectRows.forEach(item => {
        ids.push(item.id);
      });
      // 根据选择的用户id，获得用户信息
      let userInfo = this.roleUserList.filter(
        item => item.userId == this.selectRoleUserId
      )[0];
      // 请求后台
      taxManagerUpdate({
        ids: ids,
        disposeId: userInfo.userId,
        disposeName: userInfo.nickName,
        productFunctionCode: 24
      }).then(res => {
        if (res.code == 0) {
          this.updateTaxManagerModal = false;
          this.$Message.success("操作成功");
          this.selectRows = [];
          this.queryData();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },

    /**
     * 显示添加备注弹框
     */
    showAddRemarkModal(row) {
      this.addRemarkModal = true;
      this.selectObj = row;
      // 重置弹框中其他字段的
      this.remarkFileList = [];
      this.remarkContent = "";
      if (this.$refs.remarkUploadFileRef) {
        this.$refs.remarkUploadFileRef.clearFiles();
      }
    },
    // 添加备注点击提交
    handleSubmitRemark() {
      // 进度内容和文件必须填一个
      if (!this.remarkContent && this.remarkFileList.length == 0) {
        this.$Message.info("进度内容或者上传文件至少填一项");
        return;
      }
      // 控制只能上传一个文件
      let annexUrlList = [];
      if (this.remarkFileList && this.remarkFileList.length > 1) {
        this.$Message.info("只能上传一个文件");
      }
      // 请求后台
      addRemark({
        serverNo: this.selectObj.serverNo,
        remarkComment: this.remarkContent,
        annexName:
          this.remarkFileList && this.remarkFileList.length == 1
            ? this.remarkFileList[0].name
            : "",
        annex:
          this.remarkFileList && this.remarkFileList.length == 1
            ? this.remarkFileList[0].url
            : ""
      }).then(res => {
        if (res.code == 0) {
          this.addRemarkModal = false;
          this.$Message.success("添加成功");
        } else {
          this.$Message.warning(res.mesage);
        }
      });
    },
    // 上传文件操作
    onBeforeUpload(file) {
      console.log(333, this.remarkFileList);
      // 校验文件格式
      const FILE_TYPE = [".jpg", ".jpeg", ".png", ".pdf"];
      const fileSuffix = file.name.substring(file.name.lastIndexOf("."));
      if (!FILE_TYPE.includes(fileSuffix.toLowerCase())) {
        this.$Message.warning("只能上传jpg,jpeg,png,pdf的文件");
        return false;
      }
      // 校验文件大小
      const MAX_SIZE = file.size / 1024 / 1024 < 100;
      if (!MAX_SIZE) {
        this.$Message.warning("上传文件大小不能超过100M");
        return false;
      }

      // 只能上传一个
      if (this.remarkFileList && this.remarkFileList.length >= 1) {
        this.$Message.warning("只能上传一个文件");
        return false;
      }
    },
    onUploadRemove(file) {
      console.log("onUploadRemove", file);
      this.remarkFileList = [];
    },
    // 上传成功
    onUploadSuccess(res, file, remarkFileList) {
      if (res.code !== 0) {
        this.$Message.warning("上传失败，请再次重新上传");
        return;
      }
      // 给file赋值
      file.url = res.data.fileUrl;
      this.remarkFileList = this.$refs.remarkUploadFileRef.fileList;
    },

    /**
     * 查看备注详情操作
     */
    showDetailRemarkModal(row) {
      this.selectObj = row;
      this.detailRemarkModal = true;
      getRemarkList({ serverNo: row.serverNo }).then(res => {
        if (res.code == 0) {
          this.detailRemarkList = res.data;
        }
      });
    },
    // 删除备注
    handleDeleteRemark(row, index) {
      this.$Modal.confirm({
        title: "提示",
        content: "您确定要删除该备注吗？",
        onOk: () => {
          deleteRemark({
            ids: row.id
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success("删除备注成功");
              this.detailRemarkList.splice(index, 1);
            } else {
              this.$Message.warning(res.message);
            }
          });
        },
        onCancel: () => {}
      });
    },

    /**
     * 查看驳回原因
     */
    showDetailRejectModal(row) {
      this.selectObj = row;
      this.detailRejectModal = true;
      rejectDetail({ serverNo: row.serverNo }).then(res => {
        if (res.code == 0) {
          this.detailRejectList = res.data;
        }
      });
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
.ivu-upload-list-file {
  max-width: 500px;
}
.padding16 {
  padding: 16px;
  border-radius: 2px;
}
.selector-wrapper {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.clear-btn {
  color: #3388ff;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}
.table-wrapper {
  margin-top: 10px;
  .pagination {
    margin-top: 13px;
    height: 41px;
    line-height: 41px;
    border-top: none;
    float: right;
  }
}
.clearfix::after {
  display: block;
  line-height: 0px;
  content: "";
  clear: both;
}
.searchWrapper {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.handleBtn {
  color: #3388ff;
  background: none;
  border: none;
  font-size: 12px;
  padding: 0px 6px;
  cursor: pointer;
}

// 备注详情列表样式
.remark-box {
  max-height: 400px;
  overflow-y: auto;
  padding: 0px 10px;
  .nodata {
    text-align: center;
    padding: 20px;
  }
  .remark-list {
    &:not(:last-child) {
      border-bottom: solid 1px #eee;
      margin-bottom: 20px;
    }
    margin-bottom: 14px;
    .remark-item {
      display: flex;
      margin-bottom: 8px;
      .remark-label {
        width: 100px;
        text-align: right;
      }
      .remark-content {
        flex: 1;
        .btn-delete {
          color: red;
          float: right;
          cursor: pointer;
        }
      }
    }
  }
}
// 详情样式
.detailWrapper {
  .header {
    height: 60px;
  }
  .headerBar {
    border-bottom: 1px solid #ccc;

    .leftTitle {
      float: left;
      font-size: 14px;
      font-weight: 700;
    }
    .rightBtn {
      float: right;

      button {
        margin: 0 10px 10px 0;
      }
    }
  }
  // 操作日志记录
  .operate-record {
    margin-top: 20px;
    padding-top: 10px;
    border-top: solid 1px #ccc;
    .operate-title {
      font-size: 14px;
      font-weight: bold;
    }
    .operate-content {
      max-height: 300px;
      overflow: auto;
      .record-list {
        margin: 12px;
        border-bottom: solid 1px #f2f2f3;
      }
    }
  }
  .processRecordBox {
    float: left;
    width: 65%;
    overflow: auto;

    .noData {
      .top,
      .bottom {
        padding: 100px;
      }
    }
    // 进度记录
    .recordData {
      max-height: 300px;
      overflow: auto;
      .text-desc {
        color: #909399;
      }
      .text-success {
        color: #3bcece;
        &.alink:hover {
          text-decoration: underline;
        }
      }
      .text-warning {
        color: #ff9900;
      }
      .recordItem {
        margin: 12px;
        border-bottom: solid 1px #f2f2f3;
        .record-content,
        .record-file,
        .record-desc {
          display: flex;
          padding: 2px 0px;
          .rc-left {
            width: 200px;
          }
          .rc-right {
            flex: 1;
          }
        }
      }
    }
  }
  .attributeBox {
    float: right;
    width: 33%;
    padding-left: 10px;
    border-left: solid 1px #eee;
    .info {
      padding: 20px;
    }
  }
}
.searchword {
  display: inline-block;
  /deep/.ivu-form-item {
    .ivu-form-item-content {
      margin-left: 0 !important;
    }
  }
}
.btnTabs {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}
.editIcon {
  margin-left: 10px;
  font-size: 20px;
  color: #2d8cf0;
  cursor: pointer;
}
</style>
