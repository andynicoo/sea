<template>
  <div class="todoList padding16">
    <!-- 显示列表 -->
    <div class="tableWrapper" v-if="!isDetailPage">
      <Form class="searchWrapper clearfix" :label-width="70" inline>
        <FormItem label="国家" :label-width="40">
          <Select
            style="width:140px;"
            clearable
            filterable
            v-model="listQuery.countryName"
            placeholder="请选择国家"
          >
            <Option
              v-for="(item, index) in countryList"
              :value="item"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="商品名称">
          <Select
            style="width:140px;"
            clearable
            filterable
            v-model="listQuery.productName"
            placeholder="请选择商品名称"
          >
            <Option
              v-for="(item, index) in productList"
              :value="item"
              :key="index"
              >{{ item }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="创建时间">
          <DatePicker
            type="datetimerange"
            :options="dateOptions"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择创建时间"
            style="width: 280px;"
            clearable
            :value="listQuery.createTime"
            @on-change="changeCreateTime"
          ></DatePicker>
        </FormItem>
        <FormItem label="提交服务商时间" :label-width="110">
          <DatePicker
            type="datetimerange"
            :options="dateOptions"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择提交服务商时间"
            style="width: 280px;"
            clearable
            :value="listQuery.submitServiceTime"
            @on-change="changeSubmitServiceTime"
          ></DatePicker>
        </FormItem>
        <FormItem label="完成时间">
          <DatePicker
            type="datetimerange"
            :options="dateOptions"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择完成时间"
            style="width: 280px;"
            clearable
            :value="listQuery.finishTime"
            @on-change="changeFinishTime"
          ></DatePicker>
        </FormItem>
        <FormItem :label-width="0">
          <Input
            v-model="listQuery.searchContent"
            placeholder="请输入查询内容"
            style="width: 300px;"
            clearable
          >
            <Select
              v-model="listQuery.selectTypeName"
              slot="prepend"
              style="width: 80px"
            >
              <Option
                :value="item.value"
                v-for="(item, index) in searchSelectList"
                :key="index"
              >
                {{ item.label }}
              </Option>
            </Select>
          </Input>
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
          <TabPane
            :label="'全部（' + (tabStatisInfo.sums || 0) + '）'"
            name="-1"
          ></TabPane>
          <TabPane
            :label="'待处理（' + (tabStatisInfo.pending || 0) + '）'"
            name="101"
          ></TabPane>
          <TabPane
            :label="'处理中（' + (tabStatisInfo.processing || 0) + '）'"
            name="102"
          ></TabPane>
          <TabPane
            :label="'已完成（' + (tabStatisInfo.completed || 0) + '）'"
            name="103"
          ></TabPane>
          <TabPane
            :label="'已关闭（' + (tabStatisInfo.closed || 0) + '）'"
            name="104"
          ></TabPane>
        </Tabs>

        <!-- 操作权限按钮 -->
        <div class="btnTabs">
          <!-- 待处理下，显示这3个按钮 -->
          <div class="dai-btn" v-if="tabName == '101'">
            <span v-show="hasAuthority('taxManagerBatchClaim')">
              <Button
                type="primary"
                style="margin-right: 10px"
                v-if="hasTaxReviceRole"
                @click="handleBatchClaim(1)"
              >
                税务经理批量认领
              </Button>
            </span>
            <span v-show="hasAuthority('supplyAttachBatchClaim')">
              <Button
                type="primary"
                style="margin-right: 10px"
                v-if="hasSupplyReviceRole"
                @click="handleBatchClaim(2)"
              >
                供应链批量认领
              </Button>
            </span>
            <span v-show="hasAuthority('submitServicerClaim')">
              <Button
                type="primary"
                style="margin-right: 10px"
                @click="handleBatchClaim(3)"
              >
                批量提交服务商
              </Button>
            </span>
          </div>
          <!-- 以下的按钮所有状态下都显示 -->
          <Button
            v-show="hasAuthority('editTaxManager')"
            type="primary"
            style="margin-right: 10px"
            @click="showUpdateTaxManagerModal"
          >
            更改税务经理
          </Button>
          <Button
            v-show="hasAuthority('editSupplyAttach')"
            type="primary"
            style="margin-right: 10px"
            @click="showUpdateSupplyManagerModal"
          >
            更改供应链专员
          </Button>
          <Button type="primary" ghost @click="handleExport">导出</Button>
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
          <template slot="companyName" slot-scope="{ row }">
            <span style="display:inline-block;margin-right:10px;">{{row.companyName}}</span>
            <Icon  v-show="hasAuthority('otherWorkOrder_editCompanyName')" class="editIcon" type="ios-create-outline" @click="editCompanyNameModal = true,currentServiceId = row.id,newCompanyName = row.companyName" />
          </template>
          <template slot="orderStatus" slot-scope="{ row }">
            <span v-if="row.status == 101">待处理</span>
            <span v-if="row.status == 102">处理中</span>
            <span v-if="row.status == 103">已完成</span>
            <span v-if="row.status == 104">已关闭</span>
          </template>
          <template slot="operate" slot-scope="{ row }">
            <!-- 待处理 -->
            <span v-if="row.status == 101">
              <div @click="queryOrderDetail(row)" class="handleBtn">详情</div>
              <div
                v-show="hasAuthority('addProgress')"
                @click="showAddProcessModal(row)"
                class="handleBtn"
              >
                添加进度
              </div>
              <div
                v-show="hasAuthority('submitServicer')"
                @click="submitServiceClaim([row], 1)"
                class="handleBtn"
              >
                提交服务商
              </div>
            </span>
            <!-- 处理中 -->
            <span v-else-if="row.status == 102">
              <div @click="queryOrderDetail(row)" class="handleBtn">详情</div>
              <div
                v-show="hasAuthority('addProgress')"
                @click="showAddProcessModal(row)"
                class="handleBtn"
              >
                添加进度
              </div>
              <div
                v-show="hasAuthority('signComplete')"
                @click="handleMarkFinish(row)"
                class="handleBtn"
              >
                标记完成
              </div>
            </span>
            <!-- 其他状态只显示详情 -->
            <span v-else>
              <div @click="queryOrderDetail(row)" class="handleBtn">详情</div>
            </span>
          </template>
          <!-- 税务经理（为空则显示认领按钮操作） -->
          <template slot="taxManager" slot-scope="{ row }">
            <span v-if="row.disposeName">{{ row.disposeName }}</span>
            <span v-else>
              <!-- 是否有操作税务经理批量认领的按钮权限 -->
              <span
                v-if="hasTaxReviceRole"
                @click="taxManagerClaim([row], 1)"
                class="handleBtn"
              >
                认领
              </span>
            </span>
          </template>
          <!-- 供应链专员（为空则显示认领按钮操作） -->
          <template slot="supplyManager" slot-scope="{ row }">
            <span v-if="row.supplyChainName">{{ row.supplyChainName }}</span>
            <span v-else>
              <!-- 是否有供应链批量认领的按钮权限 -->
              <span
                v-if="hasSupplyReviceRole"
                @click="supplyManagerClaim([row], 1)"
                class="handleBtn"
              >
                认领
              </span>
            </span>
          </template>
          <!-- 点击列表的订单详情弹出popup -->
          <template slot="orderInfo" slot-scope="{ row }">
            <OrderInfo v-if="row" :sendObj="row"></OrderInfo>
          </template>
        </Table>

        <Page
          class="pagination"
          @on-page-size-change="changePageSize"
          @on-change="changePageNo"
          :current="listQuery.page"
          :total="listTotal"
          :page-size="listQuery.limit"
          :page-size-opts="[3, 6, 10, 15]"
          show-total
          show-elevator
        />
      </div>
    </div>

    <!-- 显示详情 -->
    <div class="detailWrapper clearfix" v-if="isDetailPage">
      <div class="header">
        <Button type="default" @click="isDetailPage = false">返回列表</Button>
      </div>
      <div class="processRecordBox">
        <div class="headerBar clearfix">
          <div style="float:right;margin-bottom:10px;">
            <span v-show="hasAuthority('addProgress')">
              <Button
                v-if="orderInfo.status == 101 || orderInfo.status == 102"
                type="primary"
                style="margin-right: 10px"
                @click="showAddProcessModal(orderInfo)"
              >
                添加进度
              </Button>
            </span>
            <span v-show="hasAuthority('submitServicer')">
              <Button
                v-if="orderInfo.status == 101"
                @click="submitServiceClaim([orderInfo], 1)"
                type="primary"
                style="margin-right: 10px"
              >
                提交服务商
              </Button>
            </span>
            <span v-show="hasAuthority('signComplete')">
              <Button
                v-if="orderInfo.status == 102"
                @click="handleMarkFinish(orderInfo)"
                type="primary"
                style="margin-right: 10px"
              >
                标记完成
              </Button>
            </span>
          </div>
          <div class="leftTitle">进度记录</div>
        </div>
        <div class="recordData">
          <!-- 进度记录有数据 -->
          <div
            class="recordItem"
            v-for="(item, index) in processRecords"
            :key="index"
          >
            <!-- 有记录内容 -->
            <div class="record-content" v-if="item.progressCont">
              <div class="rc-left">
                记录了进度
              </div>
              <div class="rc-right">
                {{ item.progressCont }}
              </div>
            </div>

            <!-- 有上传文件 -->
            <div class="record-file" v-if="item.annexUrl">
              <div class="rc-left">
                上传了文件
              </div>
              <div class="rc-right">
                <span
                  style="margin-right:8px;"
                  class="text-success"
                  v-for="(v, i) in splitAnnexUrl(item.annexUrl)"
                  :key="i"
                >
                  <a :href="v.url" target="_blank" class="text-success alink">{{
                    v.name
                  }}</a>
                </span>
              </div>
            </div>
            <!-- 操作时间等信息 -->
            <div class="record-desc text-desc">
              <div class="rc-left">
                {{ item.createTime }}
              </div>
              <div class="rc-right">
                记录人：{{ item.recordName }}
                <span
                  class="text-warning"
                  v-if="item.isDisplay && item.isDisplay == '2'"
                  >（不显示在客户端）</span
                >
              </div>
            </div>
          </div>
        </div>
        <!-- 操作记录 -->
        <div class="operate-record">
          <div class="operate-title ">操作记录</div>
          <div class="operate-content">
            <div
              class="record-list"
              v-for="(item, index) in operateRecords"
              :key="index"
            >
              <div>
                {{ item.instruction }}
              </div>
              <div>
                时间：{{ item.createTime }}
                <span style="margin-left:12px;"
                  >操作人：{{ item.adminUserNickName }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="attributeBox">
        <div class="title">属性</div>
        <div class="info">
          <Form :label-width="100" :model="orderInfo" :label-colon="true">
            <FormItem label="状态">
              <span v-if="orderInfo.status == 101">待处理</span>
              <span v-if="orderInfo.status == 102">处理中</span>
              <span v-if="orderInfo.status == 103">已完成</span>
              <span v-if="orderInfo.status == 104">已关闭</span>
            </FormItem>
            <FormItem label="税务经理">
              <span>{{ orderInfo.disposeName }}</span>
            </FormItem>
            <FormItem label="供应链专员">
              <span>{{ orderInfo.supplyChainName }}</span>
            </FormItem>
            <FormItem label="公司名称">
              {{ orderInfo.companyName }}
            </FormItem>
            <FormItem label="国家">
              <span>{{ orderInfo.countryNameZh }}</span>
            </FormItem>
            <FormItem label="商品名称">
              <span>{{ orderInfo.productName }}</span>
            </FormItem>
            <FormItem label="订单号">
              <span>{{ orderInfo.orderNo }}</span>
            </FormItem>
            <FormItem label="创建时间">
              <span>{{ orderInfo.createTime }}</span>
            </FormItem>
            <!-- 处理中 的详情 -->
            <div v-if="orderInfo.status == '102'">
              <FormItem label="提交服务商时间">
                <span>{{ orderInfo.submitServiceTime }}</span>
              </FormItem>
            </div>
            <!-- 已完成和已关闭 的详情 -->
            <div v-if="orderInfo.status == '103' || orderInfo.status == '104'">
              <FormItem label="提交服务商时间">
                <span>{{ orderInfo.submitServiceTime }}</span>
              </FormItem>
              <FormItem label="完成时间">
                <span>{{ orderInfo.completeTime }}</span>
              </FormItem>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <!-- 添加进度弹框 -->
    <Modal v-model="addProcessModal" title="添加进度">
      <div>
        <div style="margin-bottom: 10px;">
          <Checkbox v-model="unDisplayClient">不显示在客户端</Checkbox>
        </div>
        <div class="content-text">
          <Input
            v-model="processContent"
            type="textarea"
            :rows="4"
            :maxlength="500"
            show-word-limit
            placeholder="请输入内容"
          />
        </div>
        <div class="content-file" style="margin-top:10px;">
          上传文件：
          <Upload
            ref="uploadFileRef"
            multiple
            type="drag"
            :action="uploadUrl"
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
                注：支持JPG、JPEG、PNG、PDF、zip、xls、xlsx格式上传
              </div>
              <div style="font-size:12px; color:#ff9900;">
                温馨提示：可以上传多个文件
              </div>
            </div>
          </Upload>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="addProcessModal = false"
          >取消</Button
        >
        <Button type="primary" size="large" @click="handleSubmitProcess"
          >保存</Button
        >
      </div>
    </Modal>

    <!-- 批量更改税务经理弹框 -->
    <Modal v-model="updateTaxManagerModal" title="更改税务经理">
      <div style="margin:20px;">
        <Select v-model="selectRoleUserId">
          <Option
            v-for="(item, index) in roleUserList"
            :value="item.userId"
            :key="index"
          >
            {{ item.nickName }}
          </Option>
        </Select>
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

    <!-- 批量更改供应链专员 -->
    <Modal v-model="updateSupplyManagerModal" title="更改供应链专员">
      <div style="margin:20px;">
        <Select v-model="selectRoleUserId">
          <Option
            v-for="(item, index) in roleUserList"
            :value="item.userId"
            :key="index"
          >
            {{ item.nickName }}
          </Option>
        </Select>
      </div>
      <div slot="footer">
        <Button
          type="default"
          size="large"
          @click="updateSupplyManagerModal = false"
        >
          取消
        </Button>
        <Button type="primary" size="large" @click="handleUpdateSupplyManager">
          确定
        </Button>
      </div>
    </Modal>

    <!-- 修改服务公司 -->
    <Modal width="350" v-model="editCompanyNameModal" title="修改服务公司">
      <div style="margin:20px;">
        <Input
            v-model="newCompanyName"
            placeholder="请输服务公司名称"
            clearable
          >
          </Input>
      </div>
      <div slot="footer">
        <Button
          type="default"
          size="large"
          @click="editCompanyNameModal = false"
        >
          取消
        </Button>
        <Button type="primary" size="large" @click="editCompanyName">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
// 引入api
import {
  getProductList,
  getCountyList,
  getTabStatis,
  getOrderList,
  getOrderDetail,
  taxClaim,
  taxUpdate,
  supllyClaim,
  supllyUpdate,
  addProcess,
  getProcessRecord,
  markComplete,
  deleteProcess,
  getUserRoleList,
  currentRole,
  submitServiceProvider,
  changeCompanyName,
} from "@/api/taxService/otherService.js";

// 引入组件
import OrderInfo from "./components/OrderInfo";
export default {
  components: {
    OrderInfo
  },
  data() {
    return {
      // 当前页面是否显示详情页面，默认false
      isDetailPage: false,

      //  当前选择的tab name，默认全部（-1）
      tabName: "-1",
      tabStatisInfo: {}, // tab对应的数量显示

      // 查询条件-商品列表
      productList: [],
      // 查询条件-国家列表
      countryList: [],

      // 批量更改税务经理弹框
      updateTaxManagerModal: false,
      // 批量更改供应链专员弹框
      updateSupplyManagerModal: false,
      // 更改弹出的人员列表
      roleUserList: [],
      selectRoleUserId: "",

      // 列表和分页
      orderList: [],
      listLoading: false, // 表格listLoading
      listTotal: 1, // 总条数
      listQuery: {
        orderStatus: "", // 根据状态查询：传空代表全部，101-待处理，102-处理中，103-已完成，104-已关闭
        countryName: "", // 国家名称
        productName: "", // 商品名称
        createTime: "", // 创建时间
        submitServiceTime: "", // 提交服务商时间
        finishTime: "", // 完成时间
        selectTypeName: "", // 下拉选择查询的字段名
        searchContent: "", //  查询的内容
        page: 1,
        limit: 10
      },
      // 查询条件的组合下拉列表
      searchSelectList: [
        {
          label: "订单号",
          value: "orderNo"
        },
        {
          label: "服务号",
          value: "serverNo"
        },
        {
          label: "手机号",
          value: "mobile"
        }
        // {
        //   label: "公司名称",
        //   value: "companyName"
        // },
        // {
        //   label: "销售名称",
        //   value: "saleName"
        // }
      ],

      // 多选的表格数据
      selectRows: [],
      // 批量操作
      selectobj: [],

      // 表格的列数据
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "编号",
          align: "center",
          key: "serverNo"
        },
        {
          title: "公司",
          align: "center",
          slot: "companyName"
        },
        {
          title: "国家",
          align: "center",
          key: "countryNameZh",
          render(h, params) {
            return h("span", params.row.countryNameZh);
          }
        },
        {
          title: "服务商",
          align: "center",
          key: "supplierName",
          render(h, params) {
            return h("span", params.row.supplierName);
          }
        },
        {
          title: "商品名称",
          align: "center",
          key: "productName"
        },
        {
          title: "创建时间",
          align: "center",
          key: "createTime",
          render: (h, { row }) => {
            return h("span", row.createTime);
          }
        },
        {
          title: "工单状态",
          align: "center",
          slot: "orderStatus"
        },
        {
          title: "订单详情",
          slot: "orderInfo"
        },
        {
          title: "税务经理",
          align: "center",
          slot: "taxManager"
        },
        {
          title: "供应链专员",
          align: "center",
          slot: "supplyManager"
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
      // 是否有供应链批量认领的按钮权限
      hasSupplyReviceRole: false,

      // 操作点击的订单详情信息
      orderInfo: {},
      processRecords: [], // 进度记录数据
      operateRecords: [], // 操作记录数据

      // 添加进度
      dataFlag: false, // 是否存在进度数据
      processServiceId: "",
      addProcessModal: false,
      unDisplayClient: false, // 不显示在客户端
      processContent: "", // 记录的进度内容

      // 上传
      uploadUrl: this.workOrderFile,
      fileList: [], // 成功上传的文件

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

      editCompanyNameModal:false,
      editCompanyNameLoading:false,
      newCompanyName:'',
      currentServiceId:'',
    };
  },
  created() {
    this.getCurrentRole();
    this.queryProductData();
    this.queryCountyData();
    this.queryTabStatis();
    this.queryOrderList();
  },
  methods: {
    // 修改公司名称
    editCompanyName(){
      let params = {
        companyName:this.newCompanyName,
        serviceId:this.currentServiceId,
      };
      this.editCompanyNameLoading = true;
      changeCompanyName(params)
        .then(res => {
          if(res.code == 0){
            this.editCompanyNameLoading = false;
            this.editCompanyNameModal = false;
            this.$Message.success("修改成功！");
            this.queryOrderList();
          }
        })
        .catch(err => {
          this.editCompanyNameLoading = false;
          console.log(err);
        })
        .finally(()=>{
          this.newCompanyName = '';
        });
    },
    /**
     * 选择tab状态
     */
    tabsChange(name) {
      this.listQuery.page = 1;
      this.tabName = name;
      this.listQuery.orderStatus = name;
      if (name == "-1") {
        this.listQuery.orderStatus = "";
      }
      this.queryOrderList();
    },
    // 创建时间
    changeCreateTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes("00:00:00")) {
        endTime = endTime.replace("00:00:00", "23:59:59");
      }
      const dateTime = [time[0], endTime];
      this.listQuery.createTime = dateTime;
    },
    // 提交服务商时间
    changeSubmitServiceTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes("00:00:00")) {
        endTime = endTime.replace("00:00:00", "23:59:59");
      }
      const dateTime = [time[0], endTime];
      this.listQuery.submitServiceTime = dateTime;
    },
    // 完成时间
    changeFinishTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes("00:00:00")) {
        endTime = endTime.replace("00:00:00", "23:59:59");
      }
      const dateTime = [time[0], endTime];
      this.listQuery.finishTime = dateTime;
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
        countryName: this.listQuery.countryName,
        productFlow: this.listQuery.productName,
        startCreateTime:
          this.listQuery.createTime && this.listQuery.createTime.length > 0
            ? this.listQuery.createTime[0]
            : "",
        endCreateTime:
          this.listQuery.createTime && this.listQuery.createTime.length > 0
            ? this.listQuery.createTime[1]
            : "",
        startSubmitServiceTime:
          this.listQuery.submitServiceTime &&
          this.listQuery.submitServiceTime.length > 0
            ? this.listQuery.submitServiceTime[0]
            : "",
        endSubmitServiceTime:
          this.listQuery.submitServiceTime &&
          this.listQuery.submitServiceTime.length > 0
            ? this.listQuery.submitServiceTime[1]
            : "",
        startCompleteTime:
          this.listQuery.finishTime && this.listQuery.finishTime.length > 0
            ? this.listQuery.finishTime[0]
            : "",
        endCompleteTime:
          this.listQuery.finishTime && this.listQuery.finishTime.length > 0
            ? this.listQuery.finishTime[1]
            : "",
        page: this.listQuery.page,
        limit: this.listQuery.limit
      };
      // 根据查询下拉框的value当做查询条件字段
      if (this.listQuery.selectTypeName) {
        params[this.listQuery.selectTypeName] = this.listQuery.searchContent;
      }

      return params;
    },
    /**
     * 查询条件-获取商品下拉列表
     */
    queryProductData() {
      getProductList().then(res => {
        if (res.code == 0) {
          this.productList = res.data;
        } else {
          this.$Message.warning("获取商品列表失败");
        }
      });
    },
    /**
     * 查询条件-获取国家下拉列表
     */
    queryCountyData() {
      getCountyList().then(res => {
        if (res.code == 0) {
          this.countryList = res.data;
        } else {
          this.$Message.warning("获取国家列表失败");
        }
      });
    },

    /**
     * 查询列表tab的统计数量
     */
    queryTabStatis() {
      getTabStatis().then(res => {
        this.tabStatisInfo = res.data;
      });
    },
    /**
     * 点击查询按钮和重置
     */
    handleQuery() {
      this.listQuery.page = 1;
      this.queryOrderList();
    },
    // 重置查询
    resetQuery() {
      this.listQuery = {
        countryName: "", // 国家名称
        productName: "", // 商品名称
        createTime: "", // 创建时间
        submitServiceTime: "", // 提交服务商时间
        finishTime: "", // 完成时间
        selectTypeName: "", // 下拉选择查询的字段名
        searchContent: "", //  查询的内容
        page: 1,
        limit: 10
      };
    },

    /**
     * 获得当前登录人的角色
     */
    getCurrentRole() {
      currentRole().then(res => {
        if (res.code == 0) {
          let roleList = res.data;
          // 是否有操作税务经理批量认领的按钮权限（超级管理员、税务经理、税务专员、税务主管）
          if (
            roleList.includes("admin") ||
            roleList.includes("tax_manager") ||
            roleList.includes("tax_commissioner") ||
            roleList.includes("tax_supervisor")
          ) {
            this.hasTaxReviceRole = true;
          }
          // 是否有供应链批量认领的按钮权限（超级管理员、供应链专员、供应链主管）
          if (
            roleList.includes("admin") ||
            roleList.includes("supply_commissioner") ||
            roleList.includes("supply_supervisor")
          ) {
            this.hasSupplyReviceRole = true;
          }
        }
      });
    },
    /**
     * 查询工单分页列表
     */
    queryOrderList() {
      this.listLoading = true;
      // 每次查询，都重新查一次tab的同级数量
      this.queryTabStatis();

      // 获取查询条件
      let params = this.generateQueryParams();
      getOrderList(params)
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
    changePageNo(page = 1) {
      this.listQuery.page = page;
      this.queryOrderList();
    },
    // 改变每页显示条数
    changePageSize(limit) {
      this.listQuery.limit = limit;
      this.queryOrderList();
    },

    /**
     * 列表中操作列点击获取工单详情
     */
    queryOrderDetail(row) {
      // 展示详情页面
      this.isDetailPage = true;
      getOrderDetail({
        serviceId: row.id
      }).then(res => {
        if (res.code == 0) {
          this.orderInfo = res.data.orderServices;
          this.orderInfo.companyBody = res.data.order.companyBody;
          this.orderInfo.companyName = res.data.order.companyName;
          this.operateRecords = res.data.consoleOperationLogs;
        } else {
          this.$Message.warning(res.message);
        }
      });
      this.queryProcessRecords(row);
    },
    // 点击详情查询操作记录
    queryProcessRecords(row) {
      getProcessRecord({ serviceId: row.id }).then(res => {
        if (res.code == 0) {
          this.processRecords = res.data;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    // 解析上传的文件列表，获取到文件名
    splitAnnexUrl(annexUrl) {
      let list = annexUrl.split(";");
      let fileList = [];
      list.forEach(v => {
        let files = v.split("|");
        fileList.push({
          name: files[0],
          url: files[1]
        });
      });
      return fileList;
    },

    /**
     * 导出数据
     */
    handleExport() {
      // 获取查询条件
      let params = this.generateQueryParams();
      axios({
        url: this.baseUrl + "/etax/otherWorkOrder/excelList",
        data: params,
        method: "post",
        responseType: "blob"
      }).then(res => {
        if (res.data) {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          const link = document.createElement("a");
          const href = window.URL.createObjectURL(blob); //创建下载的链接
          link.href = href;
          link.download = "工单列表导出.xls"; //下载后文件名
          document.body.appendChild(link);
          link.click(); //点击下载
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        } else {
          this.$Message.error("导出文件失败");
        }
      });
    },

    /**
     * 批量认领公用方法-type区分
     */
    handleBatchClaim(type) {
      if (this.selectRows.length === 0) {
        this.$Message.warning("请至少选择一条工单数据");
      } else {
        // 税务经理批量认领
        if (type == 1) {
          this.taxManagerClaim(this.selectRows);
        }
        // 供应链批量认领
        if (type == 2) {
          this.supplyManagerClaim(this.selectRows);
        }
        // 批量提交服务商
        if (type == 3) {
          this.submitServiceClaim(this.selectRows);
        }
      }
    },
    /**
     * 税务经理认领
     * @params type 类型是1，则说明是点击列表中的认领，提示文案会不一样
     */
    taxManagerClaim(rows, type) {
      let ids = [];
      rows.forEach(item => {
        ids.push(item.id);
      });
      this.$Modal.confirm({
        title: "提示",
        content:
          type && type == "1"
            ? "是否确认税务经理认领？"
            : "是否确认税务经理批量认领？",
        onOk: () => {
          taxClaim({
            serviceIds: ids.join(";")
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success("认领成功");
              this.selectRows = [];
              this.queryOrderList();
            } else {
              this.$Message.warning(res.message);
            }
          });
        },
        onCancel: () => {}
      });
    },
    /**
     * 供应链专员认领
     * @params type 类型是1，则说明是点击列表中的认领，提示文案会不一样
     */
    supplyManagerClaim(rows, type) {
      let ids = [];
      rows.forEach(item => {
        ids.push(item.id);
      });
      this.$Modal.confirm({
        title: "提示",
        content:
          type && type == "1"
            ? "是否确认供应链认领？"
            : "是否确认供应链批量认领？",
        onOk: () => {
          supllyClaim({
            serviceIds: ids.join(";")
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success("认领成功");
              this.selectRows = [];
              this.queryOrderList();
            } else {
              this.$Message.warning(res.message);
            }
          });
        },
        onCancel: () => {}
      });
    },
    /**
     * 提交服务商
     * @params type 类型是1，则说明是点击列表中的认领，提示文案会不一样
     */
    submitServiceClaim(rows, type) {
      let ids = [];
      rows.forEach(item => {
        ids.push(item.id);
      });
      this.$Modal.confirm({
        title: "提示",
        content:
          type && type == "1"
            ? "是否确认提交服务商？"
            : "是否确认批量提交服务商？",
        onOk: () => {
          submitServiceProvider({
            serviceIds: ids.join(";")
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.isDetailPage = false;
              this.queryOrderList();
            } else {
              this.$Message.warning(res.message);
            }
          });
        }
      });
    },

    /**
     * 批量更改税务经理操作
     */
    showUpdateTaxManagerModal() {
      // 校验必须至少选择一条
      if (this.selectRows.length == 0) {
        this.$Message.warning("请至少选择一条要更改的工单");
        return;
      }
      this.updateTaxManagerModal = true;
      this.roleUserList = [];
      this.selectRoleUserId = "";
      // 查询税务经理用户列表
      getUserRoleList({
        roleCode: "tax_manager;tax_commissioner;tax_supervisor"
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
      taxUpdate({
        serviceIds: ids.join(";"),
        userId: this.selectRoleUserId,
        nickName: userInfo.nickName,
        userName: userInfo.userName
      }).then(res => {
        if (res.code == 0) {
          this.updateTaxManagerModal = false;
          this.$Message.success("操作成功");
          this.selectRows = [];
          this.queryOrderList();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },

    /**
     * 批量更改供应链专员操作
     */
    showUpdateSupplyManagerModal() {
      // 校验必须至少选择一条
      if (this.selectRows.length == 0) {
        this.$Message.warning("请至少选择一条要更改的工单");
        return;
      }
      this.updateSupplyManagerModal = true;
      this.roleUserList = [];
      this.selectRoleUserId = "";
      // 查询供应链专员用户列表
      getUserRoleList({
        roleCode: "supply_commissioner;supply_supervisor"
      }).then(res => {
        if (res.code == 0) {
          this.roleUserList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    // 更改供应链
    handleUpdateSupplyManager() {
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
      supllyUpdate({
        serviceIds: ids.join(";"),
        userId: this.selectRoleUserId,
        nickName: userInfo.nickName,
        userName: userInfo.userName
      }).then(res => {
        if (res.code == 0) {
          this.updateSupplyManagerModal = false;
          this.$Message.success("操作成功");
          this.selectRows = [];
          this.queryOrderList();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },

    /**
     * 列表的工单标记完成
     */
    handleMarkFinish(row) {
      this.$Modal.confirm({
        title: "提示",
        content: "该工单是否标记为已完成？",
        onOk: () => {
          markComplete({
            serviceId: row.id
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.queryOrderList();
            } else {
              this.$Message.warning(res.message);
            }
          });
        },
        onCancel: () => {}
      });
    },

    /**
     * 显示添加进度弹框
     */
    showAddProcessModal(row) {
      this.addProcessModal = true;
      this.processServiceId = row.id;
      // 重置弹框中其他字段的
      this.fileList = [];
      this.processContent = "";
      this.unDisplayClient = false;
      if (this.$refs.uploadFileRef) {
        this.$refs.uploadFileRef.clearFiles();
      }
    },
    // 添加进度点击提交
    handleSubmitProcess() {
      // 进度内容和文件必须填一个
      if (!this.processContent && this.fileList.length == 0) {
        this.$Message.info("进度内容或者上传文件至少填一项");
        return;
      }
      // 如果上传了多个文件，需要按照规则拼加
      let annexUrlList = [];
      if (this.fileList && this.fileList.length > 0) {
        this.fileList.forEach(v => {
          annexUrlList.push(v.name + "|" + v.url);
        });
      }
      // 请求后台
      addProcess({
        annexUrl: annexUrlList.join(";"),
        progressCont: this.processContent,
        serviceId: this.processServiceId,
        isDisplay: this.unDisplayClient ? 2 : 1
      }).then(res => {
        if (res.code == 0) {
          this.addProcessModal = false;
          this.$Message.success("添加成功");
          this.queryOrderList();
          // 如果是在详情页添加的进度，会刷新当前的详情数据
          if (this.isDetailPage) {
            this.queryOrderDetail(this.orderInfo);
          } else {
            this.isDetailPage = false;
          }
        } else {
          this.$Message.warning(res.mesage);
        }
      });
    },

    /**
     * 添加进度-上传文件操作
     */
    // 上传之前
    onBeforeUpload(file) {
      // 校验文件格式
      const FILE_TYPE = [
        ".jpg",
        ".jpeg",
        ".png",
        ".pdf",
        ".zip",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".xls",
        ".xlsx"
      ];
      const fileSuffix = file.name.substring(file.name.lastIndexOf("."));
      console.log("fileSuffix", fileSuffix);
      if (!FILE_TYPE.includes(fileSuffix.toLowerCase())) {
        this.$Message.warning("只能上传jpg,jpeg,png,pdf,zip,xls,xlsx的文件");
        return false;
      }
      // 校验文件大小
      const MAX_SIZE = file.size / 1024 / 1024 < 100;
      if (!MAX_SIZE) {
        this.$Message.warning("上传文件大小不能超过100M");
        return false;
      }
    },
    onUploadRemove(file) {
      console.log("onUploadRemove", file);
    },
    // 上传成功
    onUploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
        this.$Message.warning("上传失败，请再次重新上传");
        return;
      }
      // 给file赋值
      file.url = res.data.fileUrl;
      this.fileList = this.$refs.uploadFileRef.fileList;
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
.editIcon{
  margin-left:10px;
  font-size:20px;
  color:#2D8cF0;
  cursor:pointer;
}
</style>
