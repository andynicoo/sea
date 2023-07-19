<template>
  <div>
    <div class="vatInfoContent">
      <div class="top">
        <div class="left">
          <img src="@/assets/images/common/blueTip.svg" alt="" />
          温馨提示：
        </div>
        <div class="right" v-if="taxInfo.countryCode === 'GB'">
          <p>
            1、税号下发后从税号生效日期开始生效，生效
            <span @click="$router.push({ path: '/inquireMessage', query: { type: 1 } })"
              >查询入口<img src="@/assets/images/common/rightArrow.svg" alt=""
            /></span>
          </p>
          <p>
            2、EORI后一般在税号生效后2-4周左右生效，请生效后再进行发货清关，生效
            <span @click="$router.push({ path: '/inquireMessage', query: { type: 2 } })"
              >查询入口<img src="@/assets/images/common/rightArrow.svg" alt=""
            /></span>
          </p>
          <p style="font-weight: 500">
            3、税号生效日起即需要开始报税（如生效日为2020/1/1，申报周期季报，则4月为第一次申报时间），请及时关注申报提醒消息（建议关注公众号）
          </p>
        </div>
        <div class="right" v-if="taxInfo.countryCode === 'DE'">
          <p>
            1、税号下发后从税号生效日期开始生效，生效
            <span @click="$router.push({ path: '/inquireMessage', query: { type: 1 } })"
              >查询入口<img src="@/assets/images/common/rightArrow.svg" alt=""
            /></span>
          </p>
          <p>2、DE欧盟税号：DE+9位数字 给客户开发票和每月发货的时候用到 ，一般本土税号下来后的2-4周下DE欧盟税号；</p>
          <p>
            3、 税务副本（F22）：包含本土税号，DE欧盟税号和证书有效期，主要用于上传销售平台验证
            ，一般DE欧盟税号下来后的2-4周下税务副本；
          </p>
          <p>
            4、EORI后一般在税号生效后2-4周左右生效，请生效后再进行发货清关，生效
            <span @click="$router.push({ path: '/inquireMessage', query: { type: 2 } })"
              >查询入口<img src="@/assets/images/common/rightArrow.svg" alt=""
            /></span>
          </p>
        </div>
        <div class="right" v-if="taxInfo.countryCode === 'FR'">
          <p>
            1、税号下发后从税号生效日期开始生效，生效
            <span @click="$router.push({ path: '/inquireMessage', query: { type: 1 } })"
              >查询入口<img src="@/assets/images/common/rightArrow.svg" alt=""
            /></span>
          </p>
          <p>2、SIRET号：和VAT税号一起用于绑定亚马逊店铺使用；</p>
          <p style="font-weight: 500">
            3、税号生效日起即需要开始报税（如生效日为2020/1/1，申报周期季报，则4月为第一次申报时间），请及时关注申报提醒消息（建议关注公众号）
          </p>
        </div>
        <div class="right" v-if="taxInfo.countryCode === 'IOSS'">
          <p>
            1、税号下发后从税号生效日期开始生效，生效
            <span @click="$router.push({ path: '/inquireMessage', query: { type: 1 } })"
              >查询入口<img src="@/assets/images/common/rightArrow.svg" alt=""
            /></span>
          </p>
          <p style="font-weight: 500">
            2、税号生效日起即需要开始报税（如生效日期为
            2021/8/1，申报周期月报，则2021年9月份，为第一次申报时间，请及时关注申报提醒消息（建议关注公众号））
          </p>
        </div>
        <div
          class="right"
          v-if="
            taxInfo.countryCode !== 'FR' &&
            taxInfo.countryCode !== 'GB' &&
            taxInfo.countryCode !== 'DE' &&
            taxInfo.countryCode !== 'IOSS'
          "
        >
          <p>
            1、税号下发后从税号生效日期开始生效，生效
            <span @click="$router.push({ path: '/inquireMessage', query: { type: 1 } })"
              >查询入口<img src="@/assets/images/common/rightArrow.svg" alt=""
            /></span>
          </p>
          <p style="font-weight: 500">
            2、税号生效日起即需要开始报税（如生效日为2020/1/1，申报周期季报，则4月为第一次申报时间），请及时关注申报提醒消息（建议关注公众号）
          </p>
        </div>
      </div>
      <div class="vatInfo">
        <Row>
          <Col span="8">
            <span class="leftName"> 公司中文名称： </span>
            <span class="rightContent">
              {{ taxInfo.companyNameZh }}
            </span>
          </Col>
          <Col span="8">
            <span class="leftName"> 公司英文名称： </span>
            <span class="rightContent">
              {{ taxInfo.companyNameEn }}
            </span>
          </Col>
          <Col span="8">
            <span class="leftName"> 报税国家： </span>
            <span class="rightContent">
              {{ taxInfo.countryNameZh }}
            </span>
          </Col>
          <Col span="8" v-if="taxInfo.countryCode != 'IOSS'">
            <span class="leftName">
              VAT税号：
              <Tooltip
                placement="right"
                v-if="taxInfo.countryCode === 'GB' || taxInfo.countryCode === 'DE'"
                style="position: absolute; top: 3px; right: 9px"
              >
                <span class="tips-icon"> <img src="@/assets/images/common/wenhao.png" alt="" /></span>
                <div slot="content">
                  <p>此税号用于VAT报税使用</p>
                </div>
              </Tooltip>
            </span>
            <span class="rightContent">
              {{ registerWorkOrder.vatTaxNumber }}
            </span>
          </Col>
          <Col span="8" v-if="taxInfo.countryCode == 'IOSS'">
            <span class="leftName">
              IOSS税号：
              <Tooltip placement="right" style="position: absolute; top: 3px; right: 9px">
                <span class="tips-icon"> <img src="@/assets/images/common/wenhao.png" alt="" /></span>
                <div slot="content">
                  <p>此税号用于IOSS报税使用</p>
                </div>
              </Tooltip>
            </span>
            <span class="rightContent">
              {{ registerWorkOrder.vatTaxNumber }}
            </span>
          </Col>
          <Col span="8">
            <span class="leftName"> 税号下发日期： </span>
            <span class="rightContent">
              {{ registerWorkOrder.taxIssueDate && registerWorkOrder.taxIssueDate.slice(0, 10) }}
            </span>
          </Col>
          <Col span="8">
            <span class="leftName">
              税号生效日期：
              <Tooltip
                placement="right"
                v-if="taxInfo.countryCode === 'GB' || taxInfo.countryCode === 'DE'"
                style="position: absolute; top: 3px; right: 9px"
                :max-width="200"
              >
                <span class="tips-icon"> <img src="@/assets/images/common/wenhao.png" alt="" /></span>
                <div slot="content">
                  <p>税号生效日期为开始需要税务申报的日期</p>
                </div>
              </Tooltip>
            </span>
            <span class="rightContent">
              {{ registerWorkOrder.taxEffectiveDate && registerWorkOrder.taxEffectiveDate.slice(0, 10) }}
            </span>
          </Col>
          <Col span="8">
            <span class="leftName">
              申报周期：
              <Tooltip
                placement="right"
                v-if="taxInfo.countryCode === 'GB' || taxInfo.countryCode === 'DE'"
                style="position: absolute; top: 3px; right: 9px"
                :max-width="200"
              >
                <span class="tips-icon"> <img src="@/assets/images/common/wenhao.png" alt="" /></span>
                <div slot="content">
                  <p>
                    月度申报：即每个月申报一次；
                    季度申报：即每三个月申报一次；备注：一般在每个月3号即可在电商平台下载销售数据进行申报；
                  </p>
                </div>
              </Tooltip>
            </span>
            <span class="rightContent">
              {{
                registerWorkOrder.declarePeriod == 0
                  ? '月报'
                  : registerWorkOrder.declarePeriod == 1
                  ? '季报'
                  : registerWorkOrder.declarePeriod == 2
                  ? '年报'
                  : ''
              }}
            </span>
          </Col>
          <Col span="8">
            <div>
              <span class="leftName" v-if="taxInfo.countryCode == 'IOSS'"> IOSS税号文件： </span>
              <span class="leftName" v-else> VAT税号证书： </span>
              <a
                class="vat-file"
                target="_blank"
                v-if="registerWorkOrder.vatTaxNumberFile != ''"
                :href="registerWorkOrder.vatTaxNumberFile"
              >
                <Icon type="md-search" />
                点击查看
              </a>
              <!-- <a
                    class="vat-file"
                    target="_blank"
                    v-if="taxInfo.iossNumberFile != '' && taxInfo.countryCode == 'IOSS' "
                    :href="taxInfo.iossNumberFile"
                  >
                    <Icon type="md-search" v-if="registerWorkOrder.iossNumberFile != ''" />
                    点击查看
                  </a> -->
              <span v-else>暂无</span>
            </div>
          </Col>
          <Col span="8" v-if="taxInfo.countryCode != 'IOSS'">
            <span class="leftName">
              EORI号：
              <Tooltip
                placement="right"
                v-if="taxInfo.countryCode === 'GB'"
                style="position: absolute; top: 3px; right: 9px"
                :max-width="200"
              >
                <span class="tips-icon"> <img src="@/assets/images/common/wenhao.png" alt="" /></span>
                <div slot="content">
                  <p>
                    用于发货清关使用，英国EORI在税号生效后2-4周生效，若未生效可找英国客服重新申请，若EORI未生效，需谨慎发货，易因无法清关产生高额的仓储费；
                  </p>
                </div>
              </Tooltip>
            </span>

            <span class="rightContent">
              {{ registerWorkOrder.eoriNumber == '' ? '暂无' : registerWorkOrder.eoriNumber }}
            </span>
            <Tooltip placement="left" v-if="taxInfo.countryCode === 'GB'" :max-width="300">
              <span class="tipred">温馨提示>></span>
              <div slot="content">
                <p>
                  EORI温馨提示： 英国：EORI将在税号生效后2-4周生效，查询网址：
                  <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank"
                    >https://www.tax.service.gov.uk/check-eori-number</a
                  >，若4周未生效，联系客服处理）； 其它国家：待更新...；
                </p>
              </div>
            </Tooltip>
          </Col>
          <Col
            span="8"
            v-if="taxInfo.countryCode != 'IT' && taxInfo.countryCode != 'DE' && taxInfo.countryCode != 'IOSS'"
          >
            <span class="leftName">VAT证书：</span>

            <a
              class="vat-file"
              :href="registerWorkOrder.vatCertificate"
              target="_blank"
              v-if="registerWorkOrder.vatCertificate != ''"
              ><Icon type="md-search" />点击查看</a
            >
            <span v-else>暂无</span>
          </Col>
          <!-- <Col span="8" v-if="taxInfo.countryCode == 'GB'">
                <span class="leftName">gateway 账号：</span>

                <span class="rightContent">
                  {{ registerWorkOrder.gatewayId || "暂无" }}
                </span>
              </Col>
              <Col span="8" v-if="taxInfo.countryCode == 'GB'">
                <span class="leftName">gateway 密码：</span>

                <span class="rightContent">
                  {{ registerWorkOrder.gatewayPassword || "暂无" }}
                </span>
              </Col> -->
          <Col span="8" v-if="taxInfo.countryCode === 'DE'">
            <span class="leftName">DE欧盟证书：</span>
            <a
              class="vat-file"
              :href="registerWorkOrder.deEuCertificate"
              target="_blank"
              v-if="registerWorkOrder.deEuCertificate != ''"
              ><Icon type="md-search" />点击查看</a
            >
            <span v-else>暂无</span>
          </Col>
          <Col span="8" v-if="taxInfo.countryCode !== 'GB' && taxInfo.countryCode != 'IOSS'">
            <span class="leftName">EORI文件：</span>
            <a
              class="vat-file"
              :href="registerWorkOrder.eoriNumberFile"
              target="_blank"
              v-if="registerWorkOrder.eoriNumberFile != ''"
              ><Icon type="md-search" />点击查看</a
            >
            <span v-else>暂无</span>
          </Col>
          <Col span="8" v-if="taxInfo.countryCode === 'FR'">
            <span class="leftName">SIRET号：</span>
            <span class="rightContent">{{ registerWorkOrder.siretNumber || '暂无' }}</span>
          </Col>
          <Col span="8" v-if="taxInfo.countryCode === 'DE' && registerWorkOrder.vatTaxNumberCopyFile != ''">
            <span class="leftName">
              税务副本：
              <Tooltip
                placement="right"
                v-if="taxInfo.countryCode === 'DE'"
                style="position: absolute; top: 3px; right: 9px"
              >
                <span class="tips-icon"> <img src="@/assets/images/common/wenhao.png" alt="" /></span>
                <div slot="content">
                  <p>用于电商平台绑定使用</p>
                </div>
              </Tooltip>
            </span>
            <a
              class="vat-file"
              :href="registerWorkOrder.vatTaxNumberCopyFile"
              target="_blank"
              v-if="registerWorkOrder.vatTaxNumberCopyFile != ''"
              ><Icon type="md-search" />点击查看</a
            >
            <span v-else>暂无</span>
            <a
              href="https://fdfs.itaxs.com/group1/M00/02/65/rBLKNV8-IJaAAWdsAAbOsVTv8G0032.pdf"
              target="_blank"
              style="margin-left: 10px; color: red"
              >绑定方法>></a
            >
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    registerWorkOrder: { type: Object },
    taxInfo: { type: Object },
  },
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="less" scoped>
.vatInfoContent {
  margin: 24px;
  .top {
    background: #d7eefa;
    padding: 16px 32px;
    display: flex;
    align-items: baseline;
    .left {
      img {
        float: left;
        margin-right: 4px;
      }
    }
    .right {
      line-height: 22px;
      span {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        color: #1890ff;
      }
    }
  }
  .vatInfo {
    text-align: left;
    background: #ffffff;
    padding: 14px 24px 24px 24px;
    color: #333333;
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
</style>
