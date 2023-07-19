<template>
  <div class="container">
    <div class="commontitle">VAT税号</div>
    <!-- 我的服务 -->
    <div class="content">
      <div class="infoTb">
        <div class="clearfix title_wait">
          <div class="tax_content">
            <div>
              <a-form class="serach-header" layout="inline">
                <a-form-item label="VAT税号/公司名称">
                  <a-input placeholder="请输入VAT税号/公司名称" v-model="taxForm.keyword" clearable />
                </a-form-item>
                <a-form-item label="国家">
                  <a-select
                    v-model="taxForm.countryCodeColl"
                    mode="multiple"
                    allowClear
                    show-search
                    option-filter-prop="children"
                    placeholder="请选择国家"
                    style="width: 190px"
                    showArrow
                    :maxTagCount="1"
                  >
                    <a-select-option :value="v.countryCode" v-for="(v, i) in countryList" :key="i">
                      {{ v.countryNameZh }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="服务名称">
                  <a-select
                    v-model="taxForm.functionCodeColl"
                    mode="multiple"
                    allowClear
                    show-search
                    option-filter-prop="children"
                    placeholder="请选择服务名称"
                    style="width: 190px"
                    showArrow
                    :maxTagTextLength="25"
                    :maxTagCount="1"
                  >
                    <a-select-option :value="v.code" v-for="(v, i) in serviceList" :key="i">
                      {{ v.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="服务状态">
                  <a-select v-model="taxForm.status" allowClear style="width: 120px">
                    <a-select-option :value="v.value" v-for="(v, i) in statusList" :key="i">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <span style="margin-top: 12px">
                  <a-button type="primary" icon="search" @click="searchBtn"> 搜索 </a-button>
                  <a-button icon="redo" style="margin-left: 16px" @click="handleReset"> 重置 </a-button>
                  <a-button class="header-btn" icon="export" @click="exportVatNumber"> 导出税号</a-button>
                </span>
              </a-form>
            </div>
            <a-tabs v-model="taxForm.activeName" @change="handClick">
              <a-tab-pane v-for="item in tabList" :key="item.value" :tab="item.label"></a-tab-pane>
            </a-tabs>

            <a-table
              :columns="['NODE2', 'NODE5', 'PROCESSING'].includes(taxForm.activeName) ? filterColumns : columns"
              :data-source="registerList"
              :loading="tableLoading"
              :pagination="false"
              :rowKey="
                (record, index) => {
                  return index;
                }
              "
              :locale="{ emptyText: '暂无数据' }"
              :scroll="{ x: true }"
            >
              <!-- 标题 -->
              <span
                :slot="`${headerSlotKey.key}Header`"
                v-for="headerSlotKey in headerSlotKeys"
                :key="headerSlotKey.key"
              >
                <span class="popover-wrapper">
                  <span>{{ headerSlotKey.title }}</span>
                  <a-tooltip style="cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                    <img class="popover-icon" src="@/assets/images/common/icon-tip.png" alt="" />
                    <template #title> {{ headerSlotKey.content }} </template>
                  </a-tooltip>
                </span>
              </span>

              <!-- 可复制字段 -->
              <span v-for="copyKey in copyKeys" :key="copyKey" :slot="copyKey" slot-scope="text, record">
                <a-tooltip class="ellipsis-wrapper">
                  <template #title>
                    {{ getKeyValue(copyKey, record) }}
                  </template>
                  <span
                    class="popover-wrapper copy-target"
                    :data-clipboard-text="getKeyValue(copyKey, record)"
                    @click="copy"
                  >
                    <span class="ellipsis-text">{{ getKeyValue(copyKey, record) }}</span>
                    <img
                      class="popover-icon"
                      v-if="getKeyValue(copyKey, record)"
                      src="@/assets/images/common/icon-copy.png"
                      alt=""
                    />
                  </span>
                </a-tooltip>
              </span>

              <!-- 内容插槽 -->
              <template slot="declarePeriod" slot-scope="text, record">
                {{ record.declarePeriod | filterDeclarePeriod }}
              </template>
              <template slot="currentNodeCode" slot-scope="text, record">
                <span>{{ record.currentNodeCode | filterKey(currentCodeList) }}</span>
              </template>
              <template slot="expirationTime" slot-scope="text, record">
                <span>{{ (record.expirationTime || '').slice(0, 10) }}</span>
                <a-tag v-if="isExpire(record.expirationTime)">服务到期</a-tag>
              </template>
              <template slot="remark" slot-scope="text, record">
                <div class="ellipsis-wrapper" style="display: flex">
                  <a-tooltip>
                    <template slot="title">
                      {{ record.remark }}
                    </template>
                    <span class="popover-wrapper" style="max-width: calc(100% - 16px)">
                      <span class="ellipsis-text">{{ record.remark }}</span>
                    </span>
                  </a-tooltip>
                  <img
                    class="remark-icon"
                    src="@/assets/images/survey/edit.png"
                    @click="
                      editorModal = true;
                      formEditor = { ...record };
                    "
                    alt
                  />
                </div>
              </template>

              <!-- 操作按钮 -->
              <template slot="operate" slot-scope="text, record">
                <div class="operate">
                  <template v-if="record.currentNodeCode == currentCodeEnum.NODE2">
                    <div class="btn" v-if="record.progressBar != 2" @click.stop="toSubAgent(record)">提交资料</div>
                  </template>
                  <div
                    class="btn"
                    v-if="
                      [
                        currentCodeEnum.NODE3,
                        currentCodeEnum.NODE4,
                        currentCodeEnum.NODE6,
                        currentCodeEnum.NODE7,
                      ].includes(record.currentNodeCode) && record.progressBar !== 2
                    "
                    @click.stop="toSubAgent(record)"
                  >
                    查看进度
                  </div>

                  <template v-if="record.currentNodeCode == currentCodeEnum.NODE5">
                    <div class="btn" @click.stop="toSubAgent(record)">去授权</div>
                    <div class="btn" @click.stop="toSubAgent(record)">下载授权书</div>
                  </template>
                  <div class="btn reject-btn" v-if="record.progressBar == 2" @click.stop="toSubAgent(record)">
                    驳回原因
                  </div>
                  <template v-if="record.currentNodeCode == currentCodeEnum.NODE7">
                    <template v-if="[2, 5, 23].includes(record.functionCode) && record.customerData">
                      <div class="btn" @click.stop="handleSendData(record)">
                        下载资料<span v-if="record.customerDataDownLoad">(已下载)</span>
                      </div>
                    </template>
                    <div class="btn" v-if="record.functionCode == 24" @click.stop="handleFinishRefund(record)">
                      退税完成
                    </div>
                  </template>
                  <template
                    v-if="
                      [currentCodeEnum.NODE3, currentCodeEnum.NODE6, currentCodeEnum.NODE7].includes(
                        record.currentNodeCode
                      )
                    "
                  >
                    <template v-if="record.countryCode === 'GB' && [5, 23].includes(record.functionCode)">
                      <div class="btn" @click.stop="toSubAgent(record, 'questionnaire')">英国调查问卷</div>
                      <div class="btn" @click.stop="toSubAgent(record, 'ppob')">PPOB</div>
                    </template>
                  </template>
                  <template v-if="record.currentNodeCode == currentCodeEnum.NODE8">
                    <template v-if="[2, 5, 23].includes(record.functionCode)">
                      <div class="btn" v-if="isExpire(record.expirationTime)" @click.stop="toRenew">去续费</div>
                    </template>

                    <template v-if="[5].includes(record.functionCode)">
                      <template v-if="record.countryCode === 'DE'">
                        <div class="btn" @click.stop="checkVatNumberInfo(record)">查看税号</div>
                        <div class="btn">
                          <a :href="imgSrc" target="_blank"> 绑定教程 </a>
                        </div>
                      </template>
                      <div class="btn" v-else @click.stop="toSubAgent(record)">查看税号</div>
                      <!-- <a-popover placement="top">
                        <template slot="content">
                          <a href="" target="_blank" style="color: #666666"> 绑定教程 </a>
                        </template>
                        <div>···</div>
                      </a-popover> -->
                    </template>
                    <template v-else>
                      <div class="btn" @click.stop="toSubAgent(record)">查看详情</div>
                    </template>
                  </template>
                </div>
              </template>
            </a-table>
          </div>
          <div class="pageSetion clearfix">
            <a-pagination
              v-model="taxForm.page"
              :page-size.sync="taxForm.limit"
              :show-total="(total) => `总共 ${total} 条`"
              :total="registerListTotal"
              @showSizeChange="registerPageSizeChangeHandler"
              @change="registerChangePageHandler"
              show-less-items
            >
              <!-- <template slot="buildOptionText" slot-scope="props">
                <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
              </template> -->
            </a-pagination>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model="editorModal" title="服务备注信息" @ok="remarkFun" cancelText="取消" okText="确定">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="公司名称：">
          <a-input placeholder="" v-model="formEditor.companyName" disabled clearable />
        </a-form-item>
        <a-form-item label="备注：">
          <a-textarea
            v-model="formEditor.remarkRecordsClient"
            placeholder="最多可输入15个字符"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 发送资料公共弹窗 -->
    <SendDataDialog
      :item="currentItem"
      :visible="sendDialogVisible"
      @cancel="sendDialogVisible = false"
      @fetch="getTaxManageList()"
    />
  </div>
</template>
<script>
import { baseInfo } from '@/api/shoppingCar/shoppingCar';
import SendDataDialog from '../../../../xcloud-client-components-web/module/components/sendDataDialog';
import cacheQuery from '../../../../xcloud-client-components-web/mixin/cacheQuery';
import { taxManageList, remarkEditAPI, vatPageExport } from '@/api/taxModule';
import { statusList, tabList, currentCodeList, currentCodeEnum } from './staticList';
import { finishRefund } from '@/api/taxRefund/gbRefund';
import { authorizeCallback } from '@/api/taxBureauService/taxBureauService';
import moment from 'moment';
export default {
  components: {
    SendDataDialog,
  },
  data() {
    return {
      imgSrc: require('@/assets/images/common/VATBindingTutorial.jpg'),
      taxForm: {
        limit: 10,
        page: 1,
        countryCodeColl: [],
        functionCodeColl: [],
        status: '1',
        currentNodeCode: '',
        activeName: '-1',
      },
      cacheKey: 'taxForm',
      countryList: [],
      statusList: statusList,
      tabList: tabList,
      tableLoading: true,
      registerListTotal: 0,
      serviceList: [
        {
          code: 1,
          name: '税号注册',
        },
        {
          code: 2,
          name: '转代理+申报',
        },
        {
          code: 5,
          name: '注册＋申报',
        },
        {
          code: 6,
          name: '注销税号',
        },
        {
          code: 7,
          name: '税务稽查',
        },
        {
          code: 13,
          name: '海牙认证',
        },
        {
          code: 23,
          name: 'IOSS注册+申报',
        },
        {
          code: 24,
          name: 'VAT退税',
        },
      ],
      columns: [
        {
          // title: '服务号',
          // dataIndex: 'serviceNo',
          key: 'serviceNo',
          slots: { title: 'serviceNoHeader' },
          scopedSlots: { customRender: 'serviceNo' },
          width: 250,
        },
        {
          title: '公司名称',
          // dataIndex: 'companyName',
          key: 'companyName',
          scopedSlots: { customRender: 'companyName' },
          width: 200,
        },
        {
          title: '国家',
          dataIndex: 'countryNameZh',
          key: 'countryNameZh',
          width: 120,
        },
        {
          title: '服务名称',
          dataIndex: 'productName',
          key: 'productName',
          width: 250,
          ellipsis: true,
        },
        {
          // title: 'VAT/IOSS税号',
          dataIndex: 'vatTaxEuNumber',
          key: 'vatTaxEuNumber',
          slots: { title: 'vatTaxEuNumberHeader' },
          scopedSlots: { customRender: 'vatTaxEuNumber' },
          width: 150,
        },
        {
          // title: '本土税号',
          dataIndex: 'vatTaxNumber',
          key: 'vatTaxNumber',
          slots: { title: 'vatTaxNumberHeader' },
          scopedSlots: { customRender: 'vatTaxNumber' },
          width: 150,
        },
        {
          // title: '申报周期',
          dataIndex: 'declarePeriod',
          key: 'declarePeriod',
          slots: { title: 'declarePeriodHeader' },
          scopedSlots: { customRender: 'declarePeriod' },
          width: 120,
        },
        {
          title: '服务进度',
          dataIndex: 'currentNodeCode',
          key: 'currentNodeCode',
          scopedSlots: { customRender: 'currentNodeCode' },
          width: 120,
        },
        {
          // title: '服务截止日期',
          dataIndex: 'expirationTime',
          key: 'expirationTime',
          slots: { title: 'expirationTimeHeader' },
          scopedSlots: { customRender: 'expirationTime' },
          width: 200,
          hideInTable: true,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          ellipsis: true,
          scopedSlots: { customRender: 'remark' },
          width: 100,
        },
        {
          title: '操作',
          key: 'operate',
          scopedSlots: { customRender: 'operate' },
          width: 130,
          fixed: 'right',
        },
      ],
      headerSlotKeys: [
        {
          key: 'serviceNo',
          title: '服务号',
          content:
            '服务号为该服务在我司系统的唯一的识别号码。您有任何疑问需咨询在线客服或客户经理时，可提供具体服务号咨询。',
        },
        {
          key: 'vatTaxEuNumber',
          title: 'VAT/IOSS税号',
          content:
            '欧盟VAT税号用于欧盟内的跨国交易，比如用于给另一个欧盟国家的公司开具发票。如公司未申请欧盟VAT税号或其欧盟VAT税号失效，可能导致该公司的跨国B2B交易需缴税。欧盟VAT税号格式为该国简称的两位大写字母开头，如德国为DE开头。',
        },
        {
          key: 'vatTaxNumber',
          title: '本土税号',
          content: '本土税号用于该国国内的交易，不同国家的本土税号有不同的格式。',
        },
        {
          key: 'declarePeriod',
          title: '申报周期',
          content:
            '不同国家的申报周期，大致包含月报、双月报、季报、年报等类型，指进行税务申报的间隔频率。通常月报为每月申报一次，双月报为每两个月申报一次，季报为每3个月申报一次，年报为每年申报一次，以此类推。请注意，税局根据税号的历史销售金额，可能会变更最近一期申报的周期类型，请注意查收站内信件并以此处的周期类型为准。',
        },
        {
          key: 'expirationTime',
          title: '服务到期日',
          content:
            '单次VAT注册/转代理+申报的服务到期日，通常自服务期内第一次申报区间开始日期的1年后到期。以此处展示的具体到期日期为准。如服务到期后未及时续费、注销或转出，则不会生成到期后的申报区间，且可能导致税务师移除代理、税号注销、逾期申报利息和罚金等风险哦。',
        },
      ],
      copyKeys: ['companyName', 'serviceNo', 'vatTaxEuNumber', 'vatTaxNumber'],
      registerList: [],
      formEditor: {},
      editorModal: false,
      currentCodeList,
      currentCodeEnum,
      currentItem: {},
      sendDialogVisible: false,
    };
  },
  mixins: [cacheQuery],
  computed: {
    filterColumns() {
      return this.columns.filter((item) => !item.hideInTable);
    },
  },
  mounted() {
    this.getPageCache();
    this.getCountry();
    this.getTaxManageList();
    this.authorizedCallBack();
  },
  methods: {
    // 授权回调
    authorizedCallBack() {
      var that = this;
      if (window.location.search.indexOf('state') > 0 && window.location.search.indexOf('code') > 0) {
        var code = this.getQueryVariable('code');
        var state = this.getQueryVariable('state');
        authorizeCallback({
          code: code,
          state: state,
          location: 0,
        })
          .then((res) => {
            if (res.code === 0) {
              that.getOrderServicesList();
            }
          })
          .catch((error) => {
            console.log(error);
          });
        var url = window.location.href;
        url = url.split('?')[0];
        window.history.pushState({}, 0, url);
      }
    },
    //获取国家
    getCountry() {
      baseInfo().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    searchBtn() {
      this.taxForm.page = 1;
      this.getTaxManageList();
    },
    handleReset() {
      this.taxForm = {
        limit: 10,
        page: 1,
        countryCodeColl: [],
        functionCodeColl: [],
        status: '1',
        currentNodeCode: '',
        activeName: '-1',
      };
      this.removePageCache();
      this.getTaxManageList();
    },
    //获取列表数据
    getTaxManageList(page) {
      this.tableLoading = true;
      this.setPageCache();
      let { activeName, ...data } = this.taxForm;
      taxManageList(data).then((res) => {
        if (res.code === 0) {
          this.registerList = res.data.records;
          this.registerListTotal = Number(res.data.total);
          this.tableLoading = false;
        }
      });
    },
    // 导出税号
    exportVatNumber() {
      let { activeName, ...data } = this.taxForm;
      vatPageExport(data).then((res) => {
        let date = moment(new Date()).format('YYYYMMDD');
        this.$util.fileStreamDownload(res, `导出税号信息_${date}`);
      });
    },
    registerPageSizeChangeHandler(pageSize) {
      this.taxForm.limit = pageSize;
      this.getTaxManageList();
    },
    registerChangePageHandler(page) {
      this.taxForm.page = page;
      this.getTaxManageList();
    },
    //根据状态查询
    handClick() {
      if (this.taxForm.activeName == '-1') {
        this.taxForm.currentNodeCode = '';
      } else {
        this.taxForm.currentNodeCode = this.taxForm.activeName;
      }
      this.taxForm.page = 1;
      this.getTaxManageList();
    },
    getKeyValue(copyKey, record) {
      let countries = ['SA', 'AE', 'JP', 'EU', 'GB'];
      if (copyKey === 'vatTaxEuNumber') {
        return countries.includes(record.countryCode) ? record.vatTaxNumber : record.vatTaxEuNumber;
      } else if (copyKey === 'vatTaxNumber') {
        return !countries.includes(record.countryCode) ? record.vatTaxNumber : '';
      } else {
        return record[copyKey];
      }
    },
    isExpire(expirationTime) {
      return Date.now() > +new Date(expirationTime);
    },
    remarkFun() {
      let data = {
        workId: this.formEditor.id,
        remark: this.formEditor.remarkRecordsClient,
      };
      this.editorModal = false;
      remarkEditAPI(data).then((res) => {
        if (res.code == 0) {
          this.getTaxManageList();
        }
      });
    },
    // 德国查看税号信息
    checkVatNumberInfo(row) {
      this.$router.push({
        path: '/registerInfo/vatNumberInfo',
        query: {
          id: row.id,
        },
      });
    },
    /**
     *  列表操作跳转/
     */
    compareDate(d1) {
      return new Date(d1.replace(/-/g, '\/')) > new Date('2023/07/06 22:30:00');
    },
    toSubAgent(row, GBQuestionnaire) {
      switch (row.functionCode) {
        case 2:
          // 转代理
          if (row.countryCode === 'DE' && this.compareDate(row.flowCreateTime)) {
            // let path = row.progressBar === 2 && row.isP2p ? '/registerInfo/rejectInfo' : '/registrationInformation';
            let path = '/registrationInformation';
            this.$router.push({
              path,
              query: {
                id: row.id,
                serviceNo: row.serviceNo,
              },
            });
          } else {
            this.$router.push({
              path: '/turnToAgent',
              query: {
                id: row.id,
                serviceId: row.serviceId,
                serviceNo: row.serviceNo,
                countryCode: row.countryCode,
                countryNameZh: row.countryNameZh,
              },
            });
          }
          break;

        case 5:
        case 23:
          // 注册
          if (row.countryCode === 'DE' && row.functionCode === 5 && this.compareDate(row.flowCreateTime)) {
            // let path = row.progressBar === 2 && row.isP2p ? '/registerInfo/rejectInfo' : '/registrationInformation';
            let path = '/registrationInformation';
            this.$router.push({
              path,
              query: {
                id: row.id,
                serviceNo: row.serviceNo,
              },
            });
          } else {
            this.$router.push({
              path: '/registerInfo',
              query: {
                id: row.id,
                serviceId: row.serviceId,
                serviceNo: row.serviceNo,
                countryCode: row.countryCode,
                countryNameZh: row.countryNameZh,
                GBQuestionnaire,
              },
            });
          }
          break;

        case 7:
          // 稽查
          this.$router.push({
            path: '/taxInspection',
            query: {
              id: row.id,
              serviceId: row.serviceId,
              serviceNo: row.serviceNo,
              countryNameZh: row.countryNameZh,
              countryCode: row.countryCode,
            },
          });
          break;

        case 6:
          // 注销
          this.$router.push({
            path: '/cancelTaxNum',
            query: {
              id: row.id,
              serviceId: row.serviceId,
              serviceNo: row.serviceNo,
              companyNameZh: row.companyName,
              status: row.progressBar,
              countryNameZh: row.countryNameZh,
              countryCode: row.countryCode,
            },
          });
          break;

        case 24:
          // 退税
          this.$router.push({
            path: '/taxRefund',
            query: {
              id: row.id,
              serviceId: row.serviceId,
              countryCode: row.countryCode,
              currentNodeCode: row.currentNodeCode,
              progressBar: row.progressBar,
            },
          });
          break;

        case 13:
          // 海牙
          this.$router.push({
            path: '/hagueInformation',
            query: {
              id: row.id,
              status: row.progressBar,
              serviceId: row.serviceId,
              serviceNo: row.serviceNo,
              productFunctionCode: row.functionCode,
              supplierId: row.supplierId,
            },
          });
          break;
      }
    },
    /**
     * 完成退税
     */
    handleFinishRefund(row) {
      this.$Modal.confirm({
        title: '退税完成提醒',
        content: '确定要编辑退税完成吗？',
        onOk: () => {
          finishRefund({ workId: row.id }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('退税完成');
              this.getTaxManageList();
            } else {
              this.$Message.success('退税出现异常，请重新尝试');
            }
          });
        },
      });
    },

    // 分页获取公司使用中服务列表
    getOrderServicesList(page) {
      if (page) {
        this.taxForm.page = page;
      }
    },

    // 获取Url参数
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return false;
    },
    // 发送弹窗
    handleSendData(item) {
      this.sendDialogVisible = true;
      this.currentItem = item;
    },
    copy() {
      this.$util.copyLink('.copy-target');
    },
    // 去续费
    toRenew() {
      this.$router.push({
        path: '/renewal',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  .content {
    box-sizing: border-box;
    padding: 15px 20px 15px 20px;
    margin-bottom: 7px;
    border-radius: 2px;
  }
  .infoTb {
    width: 100%;
    min-width: 860px;
    background-color: #fff;
    // width: calc(100vw - 450px);
    border-radius: 6px;
    padding-top: 8px;
    .tabs-box {
      border-bottom: 1px solid #f6f6f6;
      padding-left: 24px;
      display: flex;
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
    .title_wait {
      margin: 0px 0 11px 0;
      .tax_title {
        color: #333333;
        font-weight: bold;
        font-size: 18px;
        line-height: 60px;
        padding-left: 24px;
        border-bottom: 1px solid #f6f6f6;
        margin-bottom: 20px;
      }
      .tax_content {
        padding: 0px 24px;
        margin-bottom: 32px;
        .serach-header {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
          .header-btn {
            margin-left: 16px;
          }
        }
        .popover-wrapper {
          display: flex;
          align-items: center;
          .popover-icon {
            width: 14px;
            height: 14px;
            margin-left: 4px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .pageSetion {
    text-align: left;
    margin-top: 36px;
    padding-bottom: 36px;
    margin-left: 24px;
  }
  .remark-icon {
    position: relative;
    bottom: -3px;
    vertical-align: top;
    cursor: pointer;
    width: 14px;
    height: 14px;
    margin-left: 2px;
  }
  .operate {
    cursor: pointer;
    font-weight: 500;
    padding-top: 2px;
    img {
      width: 11px;
      margin-bottom: 2px;
    }
    .btn {
      min-width: 124px;
      color: #3a7fff;
      &.reject-btn {
        color: #e81e19;
      }
      &.gray-btn {
        color: #515b6e;
      }
    }
  }
}
.ellipsis-wrapper {
  cursor: pointer;
  white-space: nowrap;
  display: block;
  .ellipsis-text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .popover-icon {
    display: inline-block;
  }
}
/deep/ .ant-form-item {
  margin-top: 12px;
}
/deep/ .ant-table-fixed {
  width: fit-content !important;
}
</style>
