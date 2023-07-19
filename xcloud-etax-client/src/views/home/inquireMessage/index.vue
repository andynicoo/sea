<template>
  <div class="inquireContainer">
    <div class="headContent">
      <div class="top">
        <!-- <Breadcrumb>
          <BreadcrumbItem>
            <span class="flink">工作台</span>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span class="clink">VAT&EORI查询</span>
          </BreadcrumbItem>
        </Breadcrumb> -->
      </div>
      <div class="bottom">
        VAT&EORI查询
      </div>
      <div class="tabTitle">
        <span :class="{'active-tab': type == 1}"
              @click="type = 1">
          VAT查询
        </span>
        <span :class="{'active-tab': type == 2}"
              @click="type = 2">
          EORI查询
        </span>
      </div>
    </div>
    <div class="subInfo"
         v-if="type == 2">
      <img src="@/assets/images/common/gantanhao.png"
           style="width: 15px;margin-right: 5px;margin-bottom: 2px;"
           alt="">
      EORI号：即清关号，用于跨境出口到欧盟国家内必备的欧盟登记号码；
    </div>
    <div class="content">
      <div class="tab-content"
           v-if="type == 1">
        <div class="flex-center">
          <Select v-model="searchForm.countryCode"
                  placeholder="请选择税号国家"
                  style="max-width: 200px;">
            <Option value="GB">GB-United Kingdom-英国</Option>
            <Option value="DE">DE-Germany-德国</Option>
            <Option value="IT">IT-Italy-意大利</Option>
            <Option value="FR">FR-France-法国</Option>
            <Option value="ES">ES-Spain-西班牙</Option>
            <Option value="PL">PL-Poland-波兰</Option>
            <Option value="BE">BE-Belgium-比利时</Option>
            <Option value="AT">AT-Austria-奥地利</Option>
            <Option value="DK">DK-Denmark-丹麦</Option>
            <Option value="EL">EL-Greece-希腊</Option>
            <Option value="FI">FI-Finland-芬兰</Option>
            <Option value="IE">IE-Ireland-爱尔兰</Option>
            <Option value="NL">NL-The Netherlands-荷兰</Option>
            <Option value="PT">PT-Portugal-葡萄牙</Option>
            <Option value="LT">LT-Lithuania-立陶宛</Option>
            <Option value="HR">HR-Croatia-克罗地亚</Option>
            <Option value="HU">HU-Hungary-匈牙利</Option>
            <Option value="BG">BG-Bulgaria-保加利亚</Option>
            <Option value="CY">CY-Cyprus-塞浦路斯</Option>
            <Option value="CZ">CZ-Czech Republic-捷克共和国</Option>
            <Option value="EE">EE-Estonia-爱沙尼亚</Option>
            <Option value="LU">LU-Luxembourg-卢森堡</Option>
            <Option value="SK">SK-Slovakia-斯洛伐克</Option>
            <Option value="LV">LV-Latvia-拉脱维亚</Option>
            <Option value="MT">MT-Malta-马耳他</Option>
            <Option value="RO">RO-Romania-罗马尼亚</Option>
            <Option value="SE">SE-Sweden-瑞典</Option>
            <Option value="SI">SI-Slovenia-斯洛文尼亚</Option>
          </Select>
          <div class="center-box">
            <Input v-model="searchForm.vatNumber"
                   placeholder="请输入完整税号信息"
                   style="width: 330px;margin:0px 22px;" />
            <span class="info">如：英国，则输入税号(9位数字123456789)，以税号文件上为准</span>
          </div>
          <Button type="primary"
                  style="width:100px;"
                  icon="ios-search"
                  @click="search(type)">{{searchTxt}}</Button>
        </div>
        <div class="result flex-center">
          <img src="@/assets/images/common/emptyVAT.png"
               alt=""
               v-if="!hasVatQuery&&!isvatError">
          <div class="result-box"
               v-else>
            <div class="title">
              查询结果
            </div>
            <div class="result-content">
              <Row>
                <span class="vat-title"
                      v-if="vatResult.isEnable">税号有效，如下（{{vatResult['vatQueryResult']}}）:</span>
                <span class="vat-title"
                      v-else-if="isvatError">查询繁忙 请稍后再试</span>
                <span class="vat-title"
                      v-else>税号无效，如下（{{vatResult['vatQueryResult']}}）:</span>
              </Row>
              <Row>
                <Col span="12"><span class="vat-item">税号国家（Member State）</span></Col>
                <Col span="12"><span class="vat-item">{{vatResult['Member State'] || searchForm.countryCode}}</span></Col>
              </Row>
              <Row>
                <Col span="12"><span class="vat-item">VAT税号（VAT Number）</span></Col>
                <Col span="12"><span class="vat-item">{{vatResult['VAT Number'] || searchForm.vatNumber}}</span></Col>
              </Row>
              <Row>
                <Col span="12"><span class="vat-item">查询时间（Date when request received）</span></Col>
                <Col span="12"><span class="vat-item">{{vatResult['Date when request received'] || dateTime}}</span></Col>
              </Row>
              <Row>
                <Col span="12"><span class="vat-item">公司名称（Name）</span></Col>
                <Col span="12"><span class="vat-item">{{vatResult['Name'] || '---'}}</span></Col>
              </Row>
              <Row>
                <Col span="12"><span class="vat-item">地址（Address）</span></Col>
                <Col span="12"><span class="vat-item">{{vatResult['Address'] || '---'}}</span></Col>
              </Row>
              <div class="result-notvalid"
                   v-if="!vatResult.isEnable || isvatError">
                <div class="notvalid-title">
                  税号无效原因参考：
                </div>
                <div class="notvalid-content">
                  <p><span> 1、</span>您的税号信息输入有误，请仔细检查；</p>
                  <p><span> 2、</span>税号下发后不一定立即生效，您可以查看税号文件上的税号生效日期（effective date ）</p>
                  <p><span> 3、</span>您的税号可能被注销（主动注销/被动注销），税局有可能因为一些原因对税号进行注销 如：长期零申报可能导致税号注销）；</p>
                  <p><span> 4、</span>其它原因（如查询系统繁忙等），您可以咨询客服询问；</p>
                </div>
              </div>
              <!-- <div class="result-notvalid"
                   v-else>
                <div class="notvalid-title">
                  温馨提示：
                </div>
                <div class="notvalid-content"
                     style="background:#16ADE91A;">
                  <p>2021年1月1日起，英国的EORI号将无法在欧盟境内使用，需要提前注册欧盟EORI号哦（目前在跨税云办理注册VAT税号的用户，跨税云都会免费注册欧盟EORI号）；
                    如在英国有货物运转，又没有英国的EORI号（GB开头的EORI号），也需要提前进行注册，具体可联系跨税云客服；</p>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="tab-content"
           v-if="type == 2">
        <div class="flex-center">

          <div class="center-box">
            <Input v-model="searchForm.eoriNumber"
                   placeholder="请输入完整EORI号"
                   style="width: 450px;margin:0px 22px;" />
            <span class="info">如：英国，EORI号为GB+税号+000 （示例GB356******000）以各国EORI号为准</span>
          </div>
          <Button type="primary"
                  style="width:100px;"
                  icon="ios-search"
                  @click="search(type)">{{searchTxt}}</Button>
        </div>
        <div class="result flex-center">
          <img src="@/assets/images/common/emptyVAT.png"
               alt=""
               v-if="!hasEORIQuery">
          <div class="result-box"
               v-else>
            <div class="title">
              查询结果
            </div>
            <div class="result-content">
              <Row>
                <span class="vat-title"
                      v-if="eoriResult.isEnable">您的EORI号已激活：（{{eoriResult['eoriQueryResult']}}）:</span>
                <span class="vat-title"
                      v-else>您的EORI号未查询到（{{eoriResult['eoriQueryResult']}}）:</span>
              </Row>
              <Row>
                <Col span="12"><span class="vat-item">查询时间：{{eoriResult.requestDate}}</span></Col>
              </Row>
              <Row v-if="eoriResult.isEnable">
                <Col span="12"><span class="vat-item">公司名称（EORI Name）</span></Col>
                <Col span="12"><span class="vat-item">{{eoriResult['EORI Name'] || '---'}}</span></Col>
              </Row>
              <Row v-if="eoriResult.isEnable">
                <Col span="12"><span class="vat-item">地址名称（Address Name）</span></Col>
                <Col span="12"><span class="vat-item">{{eoriResult['Address name'] || '---'}}</span></Col>
              </Row>
              <Row v-if="eoriResult.isEnable">
                <Col span="12"><span class="vat-item">街道名称（Street Number）</span></Col>
                <Col span="12"><span class="vat-item">{{eoriResult['Street number'] || '---'}}</span></Col>
              </Row>
              <Row v-if="eoriResult.isEnable">
                <Col span="12"><span class="vat-item">邮政编码（Postal Code）</span></Col>
                <Col span="12"><span class="vat-item">{{eoriResult['Postal code'] || '---'}}</span></Col>
              </Row>
              <Row v-if="eoriResult.isEnable">
                <Col span="12"><span class="vat-item">城市（City）</span></Col>
                <Col span="12"><span class="vat-item">{{eoriResult['City'] || '---'}}</span></Col>
              </Row>
              <Row v-if="eoriResult.isEnable">
                <Col span="12"><span class="vat-item">国家（Countvy Name）</span></Col>
                <Col span="12"><span class="vat-item">{{eoriResult['Country name'] || '---'}}</span></Col>
              </Row>
              <div class="result-notvalid">
                <!-- <div v-if="!eoriResult.isEnable">
                  <div class="notvalid-title">
                    税号无效原因参考：
                  </div>
                  <div class="notvalid-content">
                    <p><span> 1、</span>您的税号信息输入有误，请仔细检查；</p>
                    <p><span> 2、</span>税号下发后不一定立即生效，您可以查看税号文件上的税号生效日期（effective date ）</p>
                    <p><span> 3、</span>您的税号可能被注销（主动注销/被动注销），税局有可能因为一些原因对税号进行注销 如：长期零申报可能导致税号注销）；</p>
                    <p><span> 4、</span>其它原因（系统故障等），您可以咨询客服询问；</p>
                  </div>
                </div> -->
                <div class="notvalid-title">
                  温馨提示：
                </div>
                <div class="notvalid-content"
                     style="background:#16ADE91A;">
                  <p>2021年1月1日起，英国的EORI号将无法在欧盟境内使用，需要提前注册欧盟EORI号哦（目前在跨税云办理注册欧盟VAT税号的用户，跨税云都会免费注册欧盟EORI号）；
                    如在英国有货物运转，又没有英国的EORI号（GB开头的EORI号），也需要提前进行注册，具体可联系跨税云客服；</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { vatQuery, eoriQuery } from "@/api/inquire/index";
export default {
  data() {
    return {
      type: this.$route.query.type || 1,
      searchForm: {
        countryCode: '',
        vatNumber: '',
        eoriNumber: ''
      },
      vatResult: {},
      eoriResult: {},
      spinShow: true,
      searchTxt: '查询',
      isFinished: false,
      isValid: false,
      hasVatQuery: false,
      hasEORIQuery: false,
      isEoriError: false,
      isvatError: false,
      dateTime: ''
    }
  },
  methods: {
    search(type) {
      if (type === 1) {
        this.vatQuery()
      } else if (type === 2) {
        this.eoriQuery()
      }
    },
    vatQuery() {
      if (this.searchForm.countryCode === '') {
        this.$Message.info('请输入税号国家')
        return
      }
      if (this.searchForm.vatNumber === '') {
        this.$Message.info('请输入税号信息')
        return
      }
      if (this.isFinished) {
        this.$Message.info('正在查询中')
        return
      }
      this.searchTxt = '查询中'
      this.isFinished = true
      vatQuery({
        countryCode: this.searchForm.countryCode,
        vatNumber: this.searchForm.vatNumber
      }).then(res => {
        if (res.code === 0) {
          this.searchTxt = '查询'
          this.vatResult = res.data
          this.isFinished = false
          this.hasVatQuery = true
          this.isvatError = false
          this.$Message.success('查询成功')
        }
      }).catch(error => {
        console.log(error)
        this.searchTxt = '查询'
        this.isFinished = false
        this.isvatError = true
        this.dateTime = this.formatDate()
        // console.log('formatDate', this.formatDate())
      })
    },
    eoriQuery() {
      if (this.searchForm.eoriNumber === '') {
        this.$Message.info('请输入EORI号')
        return
      }
      if (this.isFinished) {
        this.$Message.info('正在查询中')
        return
      }
      this.isFinished = true
      this.searchTxt = '查询中'
      eoriQuery({
        eoriNumber: this.searchForm.eoriNumber
      }).then(res => {
        if (res.code === 0) {
          this.searchTxt = '查询'
          this.eoriResult = res.data
          this.isFinished = false
          this.hasEORIQuery = true
          this.isEoriError = false
          this.$Message.success('查询成功')
        }
      }).catch(error => {
        console.log(error)
        this.isFinished = false
        this.searchTxt = '查询'
        this.isEoriError = true
      })
    },
    formatDate() {
      var date = new Date();
      var YY = date.getFullYear() + '-';
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return YY + MM + DD + " " + hh + mm + ss;
    }
  }
}
</script>

<style lang="less" scoped>
.inquireContainer {
  margin-bottom: 0px;
  min-height: calc(100vh - 60px);

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px 0px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
    .tabTitle {
      border-bottom: 1px solid #e9e9e9ff;
      margin-top: 10px;
      span {
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        font-family: "Microsoft Yahei", PingFangSC;
        color: #333333;
        line-height: 40px;
        margin-right: 46px;
        cursor: pointer;
      }
      .active-tab {
        color: #1890ffff;
        border-bottom: 2px solid #1890ffff;
        font-weight: 500;
      }
    }
  }
  .subInfo {
    // width: 1104px;
    height: 40px;
    background: #fff1dd;
    font-size: 14px;
    font-family: "Microsoft Yahei", PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333ff;
    line-height: 14px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin-top: 24px;
    margin-left: 24px;
    margin: 24px 24px -24px 24px;
  }
  .content {
    background: #ffffff;
    margin: 24px;
    height: calc(100vh - 245px);
    /deep/ .ivu-select-single .ivu-select-selection {
      border-radius: 2px;
      height: 40px;
      .ivu-select-placeholder,
      .ivu-select-selected-value {
        height: 40px;
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 14px;
      }
    }
    padding: 24px;

    .tab-content {
      margin-top: 32px;

      .center-box {
        position: relative;
        .info {
          position: absolute;
          left: 23px;
          top: 45px;
          font-weight: 400;
          color: #fbb73c;
          font-size: 12px;
        }
      }
      /deep/ .ivu-input {
        border-radius: 2px;
        height: 40px;
      }
      /deep/ .ivu-btn {
        width: 108px;
        height: 40px;
        border-radius: 2px;
        position: relative;
        font-size: 14px;
        line-height: 24px;
      }
      /deep/ .ivu-icon-ios-search:before {
        font-size: 17px;
        position: absolute;
        top: 7px;
        left: 15px;
      }
      .result {
        img {
          width: 386px;
          margin-top: 70px;
        }
        .result-box {
          width: 760px;
          margin-top: 70px;
          .title {
            width: 760px;
            height: 40px;
            background: rgba(22, 173, 233, 0.2);
            font-size: 18px;
            font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 18px;
            padding: 11px 24px;
          }
          .result-content {
            border: 1px solid #ddddddff;
            border-top: none;
            padding: 23px;
            padding-bottom: 0px;
            .vat-title {
              font-size: 16px;
              font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #16ade9;
              line-height: 16px;
            }
            .vat-item {
              font-size: 14px;
              font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 14px;
            }
            /deep/ .ivu-row {
              margin-bottom: 20px;
            }
            .result-notvalid {
              border-top: 1px solid #16ade933;
              .notvalid-title {
                font-size: 16px;
                font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #333333;
                line-height: 16px;
                padding: 24px 0px 20px;
              }
              .notvalid-content {
                padding: 8px 12px;
                background: #fff1ddff;
                font-size: 14px;
                font-family: "Microsoft Yahei", PingFangSC;
                color: #333333;
                line-height: 26px;
                margin-bottom: 24px;
              }
            }
          }
        }
      }
    }
  }
}
</style>