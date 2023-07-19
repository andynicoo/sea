<template>
  <div class="mainContent">
    <div class="my-card" :style="contentStyleObj" v-if="!isShowDetail">
      <div class="title clearfix">
        <img src="@/assets/images/setting/settingIcon.svg" alt="" />
        <span class="title">我的商标</span>
        <span class="line"></span>
        <Badge
          :count="item.count"
          :overflow-count="10000"
          class="item"
          v-for="(item, index) in statusList"
          :key="index"
        >
          <span class="status" :class="status == index ? 'active' : ''" @click="filterStatus(index, item.status)">{{
            item.text
          }}</span>
        </Badge>

        <!-- 顶部查询  栏-->
        <div class="serach-box">
          <Select
            v-model="countryCode"
            filterable
            @on-change="changeCountry"
            style="width:110px;margin-right:10px;"
            placeholder="所有国家"
          >
            <Option v-for="(item, index) in countryList" :value="item.countryCode" :key="index">{{
              item.countryNameZh
            }}</Option>
          </Select>
          <Select
            v-model="nodeServiceProgressName"
            style="width:110px;margin-right:10px;"
            @on-change="changeStatus"
            placeholder="所有状态"
          >
            <Option value="">全部</Option>
            <Option :value="item.nodeServiceProgressName" v-for="(item, index) in progressBarList" :key="index">{{
              item.nodeServiceProgressName
            }}</Option>
          </Select>
          <Select
            v-model="trademarkType"
            @on-change="changeTrademarkType"
            style="width:110px;margin-right:10px;"
            placeholder="商标类型"
          >
            <Option value="">全部</Option>
            <Option value="1">纯文字</Option>
            <Option value="2">纯黑白图形</Option>
            <Option value="3">纯彩色图形</Option>
            <Option value="4">文字+黑白图形</Option>
            <Option value="5">文字+彩色图形</Option>
          </Select>
          <DatePicker
            type="daterange"
            placeholder="受理日期"
            placement="bottom-end"
            v-model="acceptTime"
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="changeAcceptDate"
            style="width:200px;margin-right:10px;"
          ></DatePicker>
          <Input v-model="searchContent" placeholder="商标名称/申请人" style="width:150px;margin-right:10px;">
            <img
              src="http://file.itaxs.com/dev/20210617/72cdade920d941848d7e8b719f6a5229.svg"
              class="slot-img"
              @click="searchListFunc"
              slot="suffix"
            />
          </Input>
          <Button class="reset-btn" @click="getListFun()">查询</Button>
          <Button class="search-btn" @click="resetFunc">重置</Button>
        </div>
      </div>

      <div class="no-data" v-if="tableData.length == 0">
        <img class="bg" src="@/assets/images/common/no-data.png" alt />
        <p>您还没有申请商标</p>
        <button @click="goHome">去申请商标</button>
      </div>
      <div class="table-box" v-else>
        <table style="width: 100%;text-align: center" class="tbNull" cellpadding="0" cellspacing="0">
          <tr class="my-Barand-tb-header">
            <th style="width:200px;">商标</th>
            <th style="width:120px;">服务</th>
            <th style="width:126px;">服务项目</th>
            <th style="width:126px;">国家</th>
            <th style="width:150px;">状态</th>
            <th style="width:182px;">操作</th>
          </tr>

          <div v-for="(item, index) in tableData" :key="index" class="table-div">
            <p class="title clearfix servcide-number">
              <span>服务编号：{{ item.serviceNo }}</span>
            </p>
            <div class="table-item">
              <!-- 美标 -->
              <tr>
                <td style="width:200px;" class="service-box">
                  <div class="general-order">
                    <p class="p14c444">商标名称：<span v-html="item.trademarkNameEn"></span></p>
                    <p class="p14c444">商标类型：{{ item.trademarkTypeName }}</p>
                  </div>
                </td>
                <td style="width:120px;">
                  <div ref="serviceNameItem" class="general-order">
                    <!-- <p class="p14c444">{{item.serviceName}}</p> -->
                    <p class="p14c444" v-for="(serviceName, idx) in setServiceName(item.serviceName)" :key="idx">
                      {{ serviceName }}
                    </p>
                  </div>
                </td>
                <td style="width:126px;">
                  <div ref="serviceItemProductName" class="general-order">
                    <p
                      class="p14c444"
                      v-for="(serviceItemName, idx) in setServiceItemName(item.serviceItemName)"
                      :key="idx"
                    >
                      {{ serviceItemName }}
                    </p>
                  </div>
                </td>
                <td style="width:126px;">
                  <div class="general-order">
                    <p class="p14c444">{{ item.countryNameZh }}</p>
                  </div>
                </td>
                <td style="width:150px;font-size:14px;color:#333;">
                  <div class="general-order">
                    <p class="orange">{{ item.serviceProgressStr }}</p>
                  </div>
                </td>
                <td style="width:182px;" class="operation">
                  <div class="general-order">
                    <a
                      style="color:#00A3FF;"
                      v-if="item.cureentNodeCode == 'NODE0033' && item.progressBar == 1"
                      @click="toFillIn(item)"
                      ><img src="@/assets/images/infoDetail/editor.png" style="vertical-align: bottom;" alt="" />
                      填写商标信息</a
                    >
                    <a
                      style="margin-top:8px;color: #00a3ff;"
                      v-if="item.cureentNodeCode !== 'NODE0033'"
                      @click="checkDetail(item)"
                      ><img src="@/assets/images/common/xiangqing16.svg" style="vertical-align: sub;" alt="" />详情</a
                    >
                    <a
                      style="color:#00A3FF;"
                      v-if="['NODE0139', 'NODE0140'].includes(item.cureentNodeCode)"
                      @click="toFillIn(item, false)"
                      ><img src="@/assets/images/infoDetail/editor.png" style="vertical-align: bottom;" alt="" />
                      填写使用证据</a
                    >
                    <a
                      v-if="['NODE0140'].includes(item.cureentNodeCode) && item.rejectInfo"
                      style="color:#00A3FF;"
                      @click="viewEvidenceReason(item)"
                    >
                      使用证据驳回原因</a
                    >
                    <a
                      style="color:#F03226;margin-top:8px"
                      v-if="item.progressBar == 2 && item.cureentNodeCode !== 'NODE0140'"
                      @click="toFillIn(item)"
                      ><img src="@/assets/images/common/change-red.svg" style="vertical-align: sub;" alt="" />修改</a
                    >
                    <!--平台审核-签署授权书和驳回: cureentNodeCode === 'NODE0035' && [4,6].includes(item.progressBar) -->
                    <a
                      style="color:#00A3FF;margin-top:8px"
                      v-if="item.cureentNodeCode === 'NODE0035' && [4, 6].includes(item.progressBar)"
                      @click="uploadAuthorization(true, item)"
                      ><img
                        src="@/assets/images/infoDetail/editor.png"
                        style="vertical-align: bottom;"
                        alt=""
                      />上传授权书</a
                    >
                    <template v-if="item.productFunctionCode === 61 && item.flagCustomerData">
                      <a
                        style="margin-top:8px;color: #00a3ff;"
                        @click="handleSendData({ ...item, trademarkType: 1 })"
                        v-if="item.cureentNodeCode === 'NODE0035' && item.progressBar === 3"
                        ><a-icon type="file" /> 下载资料</a
                      >
                      <a
                        style="margin-top:8px;color: #00a3ff;"
                        @click="handleSendData({ ...item, trademarkType: 2 })"
                        v-if="
                          (item.cureentNodeCode === 'NODE0036' && item.progressBar === 8) ||
                            (item.cureentNodeCode === 'NODE0037' && item.progressBar === 8)
                        "
                        ><a-icon type="file" /> 下载资料</a
                      >
                    </template>
                  </div>
                </td>
              </tr>
              <!-- 补正 -->
              <tr class="supplementary-evidence" v-for="(i, idx) in item.trademarkWorkOrderEvidence" :key="idx">
                <td style="width:200px;" class="service-box">
                  <p class=" p14c444">使用证据补正</p>
                </td>
                <td style="width:120px;">
                  <p class=" p14c444">{{ i.productName || '暂无数据' }}</p>
                </td>
                <td style="width:126px;">
                  <p
                    class="p14c444"
                    v-for="(evidenceComboName, index) in setSonEvidenceComboName(i.evidenceComboName)"
                    :key="index"
                  >
                    {{ index == 0 ? evidenceComboName : '+' + evidenceComboName || '暂无数据' }}
                  </p>
                </td>
                <td style="width:126px;">
                  <p class=" p14c444">{{ i.countryNameZh || '美国' }}</p>
                </td>
                <td style="width:150px;font-size:14px;color:#333;">
                  <p class=" p14c444 orange">{{ i.serviceProgressStr || '暂无数据' }}</p>
                </td>
                <td style="width:182px;" class="operation">
                  <div class="general-order">
                    <p class=" p14c444">
                      <a
                        style="margin-top:8px;color: #00a3ff; "
                        v-if="judeSubclassEvidence(i, 2)"
                        @click="useEvidence(i)"
                        ><img
                          src="@/assets/images/common/xiangqing16.svg"
                          style="vertical-align: sub;"
                          alt=""
                        />确认使用证据</a
                      >
                      <a
                        style="margin-top:8px;color: #00a3ff;"
                        v-if="judeSubclassEvidence(i, 1)"
                        @click="adjustCate(i, idx)"
                        ><img
                          src="@/assets/images/common/xiangqing16.svg"
                          style="vertical-align: sub;"
                          alt=""
                        />调整小类</a
                      >
                    </p>
                  </div>
                </td>
              </tr>
            </div>

            <div
              v-if="item.progressBar === 2 || (item.cureentNodeCode === 'NODE0035' && item.progressBar === 6)"
              class="list-remark-style"
            >
              <span style="color:#F03226;">驳回原因：</span>{{ item.rejectInfo || '无' }}
            </div>
          </div>
        </table>

        <div class="pageSetion clearfix">
          <Page
            class="pagination"
            show-total
            :current="pageInfo.page"
            :total="pageInfo.total"
            @on-change="registerChangePageHandler"
            :page-size="pageInfo.limit"
          />
        </div>
      </div>
    </div>
    <BrandDetail
      v-else
      @backPage="
        isShowDetail = false;
        getListFun();
      "
      :cureentNodeCode="cureentNodeCode"
      :servicesId="servicesId"
      :tabIndex="tabIndex"
      :form="form"
      ref="brandDetail"
    ></BrandDetail>
    <UploadAuthorizationLetter
      :currRow="currRow"
      @uploadAuthorization="uploadAuthorization"
      @getList="getListFun"
      v-if="uploadAuthorizationLetterVisiale"
    />
    <!-- 发送资料公共弹窗 -->
    <SendDataDialog
      :item="currentItem"
      :visible="sendDialogVisible"
      @cancel="sendDialogVisible = false"
      @fetch="getListFun()"
    />
    <!-- 使用证据驳回原因弹窗 -->
    <DialogEvidenceReaject
      :reason="evidenceReason"
      :visible.sync="evidenceReasonShow"
      @edit="() => toFillIn(null, false)"
    />
  </div>
</template>
<script>
import BrandDetail from './brandDetail';
import SendDataDialog from '../../../xcloud-client-components-web/module/components/sendDataDialog';
import { getAllServiceProgressAPI, getServicesList, getNodeCount } from '@/api/trademarkRegister/myBread';
import { getCacheCountryListApi } from '@/api/country';
import { mapMutations } from 'vuex';
import DialogEvidenceReaject from './component/DialogEvidenceReaject.vue';
import moment from 'moment';

export default {
  components: {
    BrandDetail,
    SendDataDialog,
    DialogEvidenceReaject,
  },
  data() {
    return {
      contentStyleObj: {
        'min-height': '',
      },
      tableData: [],
      pageInfo: {
        page: 1,
        total: 0,
        limit: 10,
      },
      statusList: [
        {
          status: 0,
          text: '全部',
          count: 0,
        },
        {
          status: 3,
          text: '答复审查意见',
          count: 0,
        },
      ],
      status: -1,
      countryCode: '',
      tabIndex: this.$route.query.isShowDetail,
      form: this.$route.query.form,
      isShowDetail: false,
      staticObj: {
        allCount: 0,
        progress1Count: 0,
        progress2Count: 0,
        progress3Count: 0,
        progress4Count: 0,
      },
      servicesId: '',
      progressBarList: [],
      acceptTime: '',
      trademarkType: '',
      acceptTimeStart: '',
      acceptTimeEnd: '',
      searchContent: '',
      nodeServiceProgressName: '',
      nodeCode: '',
      progressBar: '',
      countryList: [],
      cureentNodeCode: '',
      status: 0,
      workOrderStatus: 0,

      uploadAuthorizationLetterVisiale: false,
      currRow: '',
      currentItem: {},
      sendDialogVisible: false,
      // 使用证据驳回原因
      evidenceReason: '',
      evidenceReasonShow: false,
      brandItemInfo: {},
    };
  },
  methods: {
    ...mapMutations(['setBrandItem']),
    setServiceName(item) {
      return item && item.split(',');
    },
    setServiceItemName(item) {
      return item && item.split(';');
    },
    setSonEvidenceComboName(item) {
      return item && item.split('+');
    },
    judeSubclassEvidence(i, type) {
      //调整小类 && //确认使用证据
      let val = Object.keys(i);

      // 1 小类 2 使用证据
      let key = type == 1 ? 'NODE0041' : 'NODE0042';
      return val.length > 0 && i.nodeCode == key;
    },
    getHeight() {
      this.contentStyleObj['min-height'] = window.screen.height - 220 + 'px';
    },
    //获取基础数据
    getBaseInfoFunc() {
      getAllServiceProgressAPI({ functionCode: 62 }).then((res) => {
        if (res.code == 0) {
          this.progressBarList = res.data;
        }
      });
      getCacheCountryListApi().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    getListFun(page, flag) {
      let data = {
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
        countryCode: this.countryCode,
        trademarkType: this.trademarkType,
        acceptTimeStart: this.acceptTimeStart,
        acceptTimeEnd: this.acceptTimeEnd,
        searchContent: this.searchContent,
        progressBar: this.progressBar,
        nodeCode: this.nodeCode,
        workOrderStatus: this.workOrderStatus,
      };
      if (data.progressBar == -1) {
        delete data.progressBar;
      }
      if (page) {
        data.page = page;
      }
      getServicesList(data).then((res) => {
        if (res.code == 0) {
          this.tableData = res.data.records;
          this.pageInfo = {
            page: Number(res.data.current),
            total: Number(res.data.total),
            limit: 10,
          };
        }
      });

      if (!flag) {
        getNodeCount(data).then((res) => {
          if (res.code == 0) {
            this.statusList[0].count = res.data.totalCount;
            // this.statusList[1].count = res.data.confirmEvidenceCount;
            // this.statusList[2].count = res.data.auditCount;
            this.statusList[1].count = res.data.oaCount;
          }
        });
      }
    },
    useEvidence(row) {
      console.log('rwo', row);
      this.$router.push({
        path: '/useEvidence',
        query: {
          servicesId: row.serviceId,
          cureentNodeCode: row.nodeCode,
        },
      });
    },
    adjustCate(row, idx) {
      console.log('rwo', row);
      this.$router.push({
        path: '/adjustCate',
        query: {
          servicesId: row.serviceId,
          cureentNodeCode: row.nodeCode,
          adjustCateIdx: idx,
        },
      });
    },
    // 注册动态变更联动tab
    changeStatus(val) {
      this.progressBar = '';
      this.nodeCode = '';
      this.progressBarList.map((item) => {
        if (item.nodeServiceProgressName == val) {
          this.progressBar = item.nodeServiceProgress;
          this.nodeCode = item.nodeCode;
        }
      });
      this.getListFun(1);
    },
    filterStatus(i, s) {
      this.status = i;
      this.workOrderStatus = s;
      this.getListFun(1);
    },
    changeCountry(i) {
      this.countryCode = i;
      this.getListFun(1);
    },
    changeTrademarkType(i) {
      this.trademarkType = i;
      this.getListFun(1);
    },
    changeAcceptDate(val) {
      this.acceptTimeStart = val[0];
      this.acceptTimeEnd = val[1];
      this.getListFun(1);
    },
    searchListFunc() {
      this.getListFun(1);
    },
    resetFunc() {
      this.status = '';
      this.countryCode = '';
      this.trademarkType = '';
      this.acceptTimeStart = '';
      this.acceptTimeEnd = '';
      this.searchContent = '';
      this.acceptTime = '';
      this.nodeServiceProgressName = '';
      this.progressBar = '';
      this.getListFun(1);
    },
    registerChangePageHandler(page) {
      this.pageInfo.page = page;
      this.getListFun(null, true);
    },
    viewEvidenceReason(item) {
      this.brandItemInfo = item;
      this.evidenceReason = item.rejectInfo;
      this.evidenceReasonShow = true;
    },
    toFillIn(row, type = true) {
      if (row) {
        this.brandItemInfo = row;
      } else {
        row = this.brandItemInfo;
      }
      // 待支付状态下判断当前是否超过宣誓截止日期
      if (row.cureentNodeCode === 'NODE0139') {
        const lastDealDate = moment(row.vowExpirationTime);
        const nowDate = moment();
        // 超时了
        if (lastDealDate.isBefore(nowDate)) {
          this.$Message.warning('已经超过宣誓截止时间，请联系客户经理或专属客服进行商标复活');
          return;
        }
      }
      this.$router.push({
        path: type ? '/infoDetail' : '/fillEvidence',
        query: {
          id: row.servicesId,
          progressBar: row.progressBar,
          nodeCode: row.cureentNodeCode,
          code: row.countryCode,
          countryNameZh: row.countryNameZh,
        },
      });
    },
    checkDetail(row) {
      console.log('detail row', row);
      this.servicesId = row.servicesId;
      this.cureentNodeCode = row.cureentNodeCode;
      this.isShowDetail = true;
      this.setBrandItem(row);
    },
    goHome() {
      let url = '';
      if (this.invitedCode != null) {
        url = this.homePageUrl + 'productservice' + '?invitedCode=' + this.invitedCode;
      } else if (this.promteCode != null) {
        url = this.homePageUrl + 'productservice' + '?promteCode=' + this.promteCode;
      } else {
        url = this.homePageUrl + 'productservice';
      }
      window.open(url);
    },
    //显示上传授权书弹窗
    uploadAuthorization(flag, row) {
      console.log(row);
      this.currRow = row;
      this.uploadAuthorizationLetterVisiale = flag;
    },
    // 发送弹窗
    handleSendData(item) {
      this.sendDialogVisible = true;
      this.currentItem = item;
    },
  },
  created() {
    this.getHeight();
    this.getListFun();
    this.getBaseInfoFunc();
  },
  mounted() {
    if (this.$route.params.goDetail) {
      this.isShowDetail = true;
      this.servicesId = this.$route.params.orderId;
    }
    if (this.$route.query.isShowDetail == 2) {
      this.servicesId = this.$route.query.servicesId;
      this.cureentNodeCode = this.$route.query.cureentNodeCode;
      this.isShowDetail = true;
    }
  },
  watch: {
    '$route.query': {
      handler(val) {
        if (val.serviceId && val.nodeCode) {
          const row = {
            servicesId: val.serviceId,
            cureentNodeCode: val.nodeCode,
          };
          this.checkDetail(row);
          this.tabIndex = 2;
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
@import url('./myBrand.less');
.supplementary-evidence {
  display: flex;
  align-items: center;
  margin: 10px 0px;
}
</style>
