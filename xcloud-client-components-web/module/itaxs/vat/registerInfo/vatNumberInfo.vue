<template>
  <div>
    <div class="vatInfoContent">
      <a-affix :offset-top="60" :target="getAnchorContainer">
        <div class="headContent">
          <div class="fill-information-title">
            <img @click="$router.push('/myVantService')" src="@comp/images/dynamicForm/icon_fanhui2x.png" />
            【德国注册+申报】服务资料
          </div>
        </div>
      </a-affix>
      <div class="vatInfo">
        <div class="step">
          <a-steps :current="orderStatus">
            <a-step
              v-for="(item, index) in statusList"
              :key="index"
              :title="item.label"
              :description="taxInfo[item.content]"
            ></a-step>
          </a-steps>
        </div>
        <a-descriptions bordered class="description-title" title="基本信息" :column="2">
          <a-descriptions-item>
            <template v-slot:label>
              <a-tooltip class="popover-wrapper" placement="top">
                <span>本土税号</span>
                <img class="popover-icon" src="@/assets/images/common/icon-tip.png" alt="" />
                <template #title>
                  <span>本土税号用于该国国内的交易，不同国家的本土税号有不同的格式。</span>
                </template>
              </a-tooltip>
            </template>
            <span v-if="taxInfo.taxQualityDTO">
              {{ taxInfo.taxQualityDTO.taxNumber }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template v-slot:label>
              <a-tooltip class="popover-wrapper" placement="top">
                <span>VAT税号</span>
                <img class="popover-icon" src="@/assets/images/common/icon-tip.png" alt="" />
                <template #title>
                  <span
                    >欧盟VAT税号用于欧盟内的跨国交易，比如用于给另一个欧盟国家的公司开具发票。如公司未申请欧盟VAT税号或其欧盟VAT税号失效，可能导致该公司的跨国B2B交易需缴税。欧盟VAT税号格式为该国简称的两位大写字母开头，如德国为DE开头。</span
                  >
                </template>
              </a-tooltip>
            </template>
            <span v-if="taxInfo.taxQualityDTO">
              {{ taxInfo.taxQualityDTO.taxNumberEu }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="税号归属国家"> {{ taxInfo.countryNameZh }} </a-descriptions-item>
          <a-descriptions-item>
            <template v-slot:label>
              <a-tooltip class="popover-wrapper" placement="top">
                <span>税号生效日期</span>
                <img class="popover-icon" src="@/assets/images/common/icon-tip.png" alt="" />
                <template #title>
                  <span
                    >税局根据卖家在注册资料中填写的生效日期，及其他已掌握信息（如店铺是否有历史应税销售)，下发税号时说明税号的生效日期。从税号生效日期开始，即需要按申报周期或具体申报区间完成每一期的申报。即使当期无任何销售，也需要提交零申报。</span
                  >
                </template>
              </a-tooltip>
            </template>
            {{ taxInfo.taxEffectiveDate && taxInfo.taxEffectiveDate.slice(0, 10) }}
          </a-descriptions-item>
          <a-descriptions-item label="公司中文名">{{ taxInfo.companyNameZh }}</a-descriptions-item>
          <a-descriptions-item label="公司英文名"> {{ taxInfo.companyNameEn }} </a-descriptions-item>
          <a-descriptions-item label="税号下发日期">
            {{ taxInfo.taxIssueDate && taxInfo.taxIssueDate.slice(0, 10) }}
          </a-descriptions-item>
        </a-descriptions>

        <a-descriptions bordered class="description-title" title="申报信息" :column="2">
          <a-descriptions-item>
            <template v-slot:label>
              <a-tooltip class="popover-wrapper" placement="top">
                <span>申报周期</span>
                <img class="popover-icon" src="@/assets/images/common/icon-tip.png" alt="" />
                <template #title>
                  <span
                    >不同国家的申报周期，大致包含月报、双月报、季报、年报等类型，指进行税务申报的间隔频率。通常月报为每月申报一次，双月报为每两个月申报一次，季报为每3个月申报一次，年报为每年申报一次，以此类推。请注意，税局根据税号的历史销售金额，可能会变更最近一期申报的周期类型，请注意查收站内信件并以此处的周期类型为准。</span
                  >
                </template>
              </a-tooltip>
            </template>
            {{ taxInfo.declarePeriod | filterDeclarePeriod }}
          </a-descriptions-item>
          <a-descriptions-item label="税率">19%</a-descriptions-item>
          <a-descriptions-item>
            <template v-slot:label>
              <a-tooltip class="popover-wrapper" placement="top">
                <span>下一次申报区间</span>
                <img class="popover-icon" src="@/assets/images/common/icon-tip.png" alt="" />
                <template #title>
                  <span
                    >从上一次已开放的申报区间结束月份的次月起，系统根据申报周期推算，在此展示下一次未开始的申报区间。请注意，当下一次申报超过服务截止日期，且您未及时续费，则下一次申报区间不会生成。</span
                  >
                </template>
              </a-tooltip>
            </template>
            <span v-if="taxInfo.nextBeginTime && taxInfo.nextEndTime">
              {{ (taxInfo.nextBeginTime || '').split(' ')[0] }}至{{ (taxInfo.nextEndTime || '').split(' ')[0] }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template v-slot:label>
              <a-tooltip class="popover-wrapper" placement="top">
                <span>下一次申报截止日期</span>
                <img class="popover-icon" src="@/assets/images/common/icon-tip.png" alt="" />
                <template #title>
                  <span
                    >下一次申报区间的申报截止日期，通常为下一次申报区间结束月份的次月或隔月，根据不同国家税局的最新规定，展示下一次申报截止日期。</span
                  >
                </template>
              </a-tooltip>
            </template>
            {{ (taxInfo.nextTaxDeclarationDeadline || '').split(' ')[0] }}
          </a-descriptions-item>
          <a-descriptions-item label="本土税号证书">
            <a v-if="taxInfo.vatTaxNumberFile" class="link-wrapper" :href="taxInfo.vatTaxNumberFile" target="_blank">
              <img class="link-icon" src="@/assets/images/common/search-icon.png" alt="" />
              <span>点击查看</span>
            </a>
            <span v-else>暂无</span>
          </a-descriptions-item>
          <a-descriptions-item label="VAT税号证书">
            <a v-if="taxInfo.deEuCertificate" class="link-wrapper" :href="taxInfo.deEuCertificate" target="_blank">
              <img class="link-icon" src="@/assets/images/common/search-icon.png" alt="" />
              <span>点击查看</span>
            </a>
            <span v-else>暂无</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import { workOrderCommonOperator } from '../../DynamicForm/commonOperator.js';
import { currentCodeEnum } from '../../DynamicForm/staticList.js';
export default {
  data() {
    return {
      id: this.$route.query.id,
      taxInfo: {},
      statusList: [
        { label: '提交资料', content: 'saveMaterialTime' },
        { label: '待审核', content: 'auditPassTime' },
        { label: '注册中', content: 'submitServiceTime' },
        { label: '注册完成', content: 'completeTime' },
      ],
      orderStatus: 0,
      currentCodeEnum,
    };
  },
  created() {
    this.getWorkOrderDetail();
  },
  methods: {
    getAnchorContainer() {
      return document.querySelector('.main-container');
    },
    /**  工单详情 */
    getWorkOrderDetail() {
      workOrderCommonOperator('detail', this.id).then((res) => {
        if (res.code === 0) {
          this.taxInfo = res.data;
          this.showStatus(res.data.currentNodeCode);
        }
      });
    },
    showStatus(currentNodeCode) {
      switch (currentNodeCode) {
        case currentCodeEnum.NODE3: //待审核
        case currentCodeEnum.NODE4: //已审核
          return (this.orderStatus = 1);
        case currentCodeEnum.NODE6:
        case currentCodeEnum.NODE7: //待提交注册/注册中
          return (this.orderStatus = 2);
        case currentCodeEnum.NODE8:
          return (this.orderStatus = 4);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.vatInfoContent {
  .headContent {
    background: #ffffff;
    padding: 12px 24px 16px;
    margin-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    .fill-information-title {
      background: #fff;
      padding-bottom: 0 !important;
    }
  }
  .vatInfo {
    margin: 10px 12px;
    text-align: left;
    background: #ffffff;
    padding: 34px 29px 29px;
    color: #333333;
    .step {
      background: #fff;
      margin-bottom: 32px;
    }
    .leftName {
      width: 123px;
      display: inline-block;
      text-align: right;
      padding-right: 16px;
      position: relative;
      .tips-icon {
        img {
          width: 15px;
          height: 15px;
          cursor: pointer;
        }
      }
      /deep/ .ivu-tooltip-inner {
        width: 300px !important;
      }
    }
    .rightContent {
      font-family: PingFangSC-Medium, Microsoft YaHei, PingFang SC sans-serif;
      font-weight: 500;
    }
    .vat-file {
      color: #16ade9;
    }
    .tipred {
      color: red;
      cursor: pointer;
    }
    /deep/ .ivu-row {
      margin-left: 0px;
      font-size: 14px;
    }
    /deep/ .ivu-col-span-8 {
      margin-top: 10px;
    }
  }
}
.popover-wrapper {
  display: flex;
  align-items: center;
  .popover-icon {
    flex: 0 0 14px;
    width: 14px;
    height: 14px;
    margin-left: 7px;
  }
}
.link-wrapper {
  display: flex;
  align-items: center;
  .link-icon {
    flex: 0 0 14px;
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
}
.description-title {
  margin-bottom: 40px;
  /deep/ .ant-descriptions-title {
    position: relative;
    padding-left: 12px;
    &::before {
      content: '';
      position: absolute;
      width: 2px;
      height: 15px;
      background-color: #3a7fff;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
  /deep/ .ant-descriptions-item-label {
    width: 20%;
  }
  /deep/ .ant-descriptions-item-content {
    width: 30%;
  }
}
</style>
