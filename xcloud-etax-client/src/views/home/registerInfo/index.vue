<template>
  <div class="clearfix container">
    <div class="headContent" v-if="!isTaxDetails">
      <div class="bottom" style="padding-bottom: 16px" v-if="status == 0">
        待上传资料<span>({{ countryNameZh }}注册+申报)</span>
      </div>
      <div class="bottom" style="padding-bottom: 32px" v-else>
        注册详情 <span>({{ countryNameZh }}注册+申报)</span>
      </div>
      <div class="statusIndfContent" v-if="status != 0">
        <div class="statusContent">
          <div class="statusItem">
            <data-status
              v-if="leftFrom != null"
              :countryCode="countryCode"
              :hyFlag="hyFlag"
              :leftFrom="leftFrom"
              :dateTime="dateTime"
            ></data-status>
          </div>
        </div>
        <div class="rejected" v-if="status == 8">
          <div class="top-tips">
            <p class="tips-top-title">
              <img src="@/assets/images/common/yellowTip.png" alt="" />
              注册税号资料被驳回（原因：<span>{{ remark }}</span> )
            </p>
          </div>
        </div>
      </div>
      <div class="tabTitle" v-if="status != 0">
        <span
          v-if="(status == 4 || status == 21 || status == 22) && JSON.stringify(taxInfo) !== '{}'"
          :class="{ 'active-tab': pageType == 1 }"
          @click="pageType = 1"
        >
          税号信息
        </span>
        <span v-if="status == 7" :class="{ 'active-tab': pageType == 3 }" @click="pageType = 3"> 待授权注册 </span>
        <span :class="{ 'active-tab': pageType == 2 }" @click="pageType = 2"> 注册资料 </span>
      </div>
    </div>
    <div>
      <div v-if="pageType == 1" class="">
        <div
          v-if="(status == 4 || status == 21 || status == 22) && JSON.stringify(taxInfo) !== '{}'"
          class="vatInfoContent"
        >
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
              <p>
                2、DE欧盟税号：DE+9位数字 给客户开发票和每月发货的时候用到 ，一般本土税号下来后的2-4周下DE欧盟税号；
              </p>
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
              <p style="font-weight: 500">2、税号生效日起即需要开始报税（如生效日期为 2021/8/1，申报周期月报，则2021年9月份，为第一次申报时间，请及时关注申报提醒消息（建议关注公众号））</p>
            </div>
            <div
              class="right"
              v-if="taxInfo.countryCode !== 'FR' && taxInfo.countryCode !== 'GB' && taxInfo.countryCode !== 'DE' && taxInfo.countryCode !== 'IOSS'"
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
                  {{ taxInfo.companyName }}
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
                  {{ taxInfo.vatTaxNumber }}
                </span>
              </Col>
              <Col span="8" v-if="taxInfo.countryCode == 'IOSS'">
                <span class="leftName">
                  IOSS税号：
                  <Tooltip
                    placement="right"
                    style="position: absolute; top: 3px; right: 9px"
                  >
                    <span class="tips-icon"> <img src="@/assets/images/common/wenhao.png" alt="" /></span>
                    <div slot="content">
                      <p>此税号用于IOSS报税使用</p>
                    </div>
                  </Tooltip>
                </span>
                <span class="rightContent">
                  {{ taxInfo.iossNumber }}
                </span>
              </Col>
              <Col span="8">
                <span class="leftName"> 税号下发日期： </span>
                <span class="rightContent">
                  {{ taxInfo.taxIssueDate.slice(0, 10) }}
                </span>
              </Col>
              <Col span="8">
                <span class="leftName">
                  税号生效日期：
                  <Tooltip
                    placement="right"
                    v-if="taxInfo.countryCode === 'GB' || taxInfo.countryCode === 'DE'"
                    style="position: absolute; top: 3px; right: 9px"
                  >
                    <span class="tips-icon"> <img src="@/assets/images/common/wenhao.png" alt="" /></span>
                    <div slot="content">
                      <p>税号生效日期为开始需要税务申报的日期</p>
                    </div>
                  </Tooltip>
                </span>
                <span class="rightContent">
                  {{ taxInfo.taxEffectiveDate.slice(0, 10) }}
                </span>
              </Col>
              <Col span="8">
                <span class="leftName">
                  申报周期：
                  <Tooltip
                    placement="right"
                    v-if="taxInfo.countryCode === 'GB' || taxInfo.countryCode === 'DE'"
                    style="position: absolute; top: 3px; right: 9px"
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
                    taxInfo.periodType == -1
                      ? "暂无"
                      : taxInfo.periodType == 0
                      ? "月报"
                      : taxInfo.periodType == 1
                      ? "季报"
                      : ""
                  }}
                </span>
              </Col>
              <Col span="8">
                <div>
                  <span class="leftName" v-if="taxInfo.countryCode == 'IOSS'"> IOSS税号文件： </span>
                  <span class="leftName" v-else-if="taxInfo.countryCode == 'DE'"> VAT税号证书： </span>
                  <span class="leftName" v-else> VAT税号证书： </span>
                  <a
                    class="vat-file"
                    target="_blank"
                    v-if="taxInfo.vatTaxNumberFile != '' && taxInfo.countryCode != 'IOSS' "
                    :href="taxInfo.vatTaxNumberFile"
                  >
                    <Icon type="md-search" v-if="taxInfo.vatTaxNumberFile != ''" />
                    点击查看
                  </a>
                  <a
                    class="vat-file"
                    target="_blank"
                    v-if="taxInfo.iossNumberFile != '' && taxInfo.countryCode == 'IOSS' "
                    :href="taxInfo.iossNumberFile"
                  >
                    <Icon type="md-search" v-if="taxInfo.iossNumberFile != ''" />
                    点击查看
                  </a>
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
                  {{ taxInfo.eoriNumber == "" ? "暂无" : taxInfo.eoriNumber }}
                </span>
                <Tooltip placement="left" v-if="taxInfo.countryCode === 'GB'">
                  <span class="tipred">温馨提示>></span>
                  <div slot="content">
                    <p class="content-title">EORI温馨提示：</p>
                    <p class="content-content">
                      英国：EORI将在税号生效后2-4周生效，查询网址：
                      <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank"
                        >https://www.tax.service.gov.uk/check-eori-number</a
                      >，若4周未生效，联系客服处理）；
                    </p>
                    <p>其它国家：待更新...；</p>
                  </div>
                </Tooltip>
              </Col>
              <Col span="8" v-if="taxInfo.countryCode != 'IT' && taxInfo.countryCode != 'DE' && taxInfo.countryCode != 'IOSS'">
                <span class="leftName">VAT证书：</span>

                <a class="vat-file" :href="taxInfo.vatCertificate" target="_blank" v-if="taxInfo.vatCertificate != ''"
                  ><Icon type="md-search" />点击查看</a
                >
                <span v-else>暂无</span>
              </Col>
              <Col span="8" v-if="taxInfo.countryCode == 'GB'">
                <span class="leftName">gateway 账号：</span>

                <span class="rightContent">
                  {{ taxInfo.gatewayId || "暂无" }}
                </span>
              </Col>
              <Col span="8" v-if="taxInfo.countryCode == 'GB'">
                <span class="leftName">gateway 密码：</span>

                <span class="rightContent">
                  {{ taxInfo.gatewayPassword || "暂无" }}
                </span>
              </Col>
              <Col span="8" v-if="countryCode === 'DE'">
                <span class="leftName">DE欧盟证书：</span>
                <a class="vat-file" :href="taxInfo.deEuCertificate" target="_blank" v-if="taxInfo.deEuCertificate != ''"
                  ><Icon type="md-search" />点击查看</a
                >
                <span v-else>暂无</span>
              </Col>
              <Col span="8" v-if="countryCode !== 'GB' && taxInfo.countryCode != 'IOSS'">
                <span class="leftName">EORI文件：</span>
                <a class="vat-file" :href="taxInfo.eoriNumberFile" target="_blank" v-if="taxInfo.eoriNumberFile != ''"
                  ><Icon type="md-search" />点击查看</a
                >
                <span v-else>暂无</span>
              </Col>
              <Col span="8" v-if="countryCode === 'FR'">
                <span class="leftName">SIRET号：</span>
                <span class="rightContent">{{ taxInfo.siretNumber || "暂无" }}</span>
              </Col>
              <Col span="8" v-if="taxInfo.countryCode === 'DE' && taxInfo.vatTaxNumberCopyFile !=''">
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
                  :href="taxInfo.vatTaxNumberCopyFile"
                  target="_blank"
                  v-if="taxInfo.vatTaxNumberCopyFile != ''"
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
              <!-- <Col span="8"
                   v-if="countryCode == 'FR'">
              <span class="leftName">法国税号证书：</span>
              <a class="vat-file"
                 :href="taxInfo.frTaxCertificate"
                 target="_blank"
                 v-if="taxInfo.frTaxCertificate"><Icon type="md-search"/>点击查看</a>
              <span v-else>暂无</span>
              </Col> -->
            </Row>
            <!-- <Row v-if="status==4">
              <Col span="8"
                   v-if="countryCode === 'DE'">
              <span class="leftName">DE欧盟证书：</span>
              <a class="vat-file"
                 :href="taxInfo.deEuCertificate"
                 target="_blank"
                 v-if="taxInfo.deEuCertificate!=''"><Icon type="md-search"/>点击查看</a>
              <span v-else>暂无</span>
              </Col>
            </Row> -->
          </div>
        </div>
      </div>
      <div v-if="pageType == 2" class="contentContainer">
        <div id="write-info" class="write-info">
          <div id="wrapper" class="wrapper">
            <div
              v-if="
                countryCode != 'AT' &&
                countryCode != 'CZ' &&
                countryCode != 'ES' &&
                countryCode != 'IT' &&
                countryCode != 'FR' &&
                countryCode != 'DE' &&
                countryCode != 'GB' &&
                countryCode != 'SA' &&
                countryCode != 'AE' &&
                countryCode != 'PL' &&
                countryCode != 'NL' &&
                countryCode != 'IOSS'
              "
            >
              <div class="stepH" style="padding-top: 24px">
                <div class="title company-title">公司信息</div>
                <div class="inputH clearfix inputHFlex registerClass">
                  <div v-for="(item, index) in companyInfo" :key="index" class="form-item">
                    <div v-if="item.type == 'date'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <Date-picker
                        type="date"
                        :options="options"
                        :value="item.bindVal"
                        @on-change="changeDate($event, item)"
                        :disabled="item.ifDisable"
                        :placeholder="item.tips"
                      ></Date-picker>
                      <div></div>
                    </div>
                    <div v-else-if="item.type == 'companyName'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <AutoComplete
                        v-model="item.bindVal"
                        :data="lenovoSearchList"
                        @on-select="selectCompany"
                        placeholder="请输入公司中文名称"
                        :disabled="item.ifDisable"
                      >
                      </AutoComplete>
                    </div>
                    <div v-else-if="item.type == 'unit'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''"
                        >{{ item.name }}
                        <span class="tips-icon" v-if="item.tipsIcon">?</span>
                      </span>
                      <input type="text" v-model="item.bindVal" :placeholder="item.tips" :disabled="item.ifDisable" />{{
                        item.unit
                      }}
                    </div>
                    <div v-else-if="item.type == 'radio'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <RadioGroup v-model="item.bindVal">
                        <Radio v-for="(v, i) in item.valList" :key="i" :label="v.index" :disabled="item.ifDisable">{{
                          v.val
                        }}</Radio>
                      </RadioGroup>
                    </div>
                    <div v-else-if="item.type == 'number'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <input
                        type="text"
                        v-model="item.bindVal"
                        number
                        :placeholder="item.tips"
                        :disabled="item.ifDisable"
                      />
                      <div style="margin-left: 202px; color: red" v-if="isNaN(item.bindVal - 0)">
                        请填写正确公司注册资本金额
                      </div>
                    </div>
                    <div v-else-if="item.type == 'english'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''"
                        >{{ item.name }}
                        <Tooltip placement="right" v-if="item.tipsIcon">
                          <span class="tips-icon">?</span>
                          <div slot="content">
                            <p>{{ item.tipsText1 }}</p>
                            <p>{{ item.tipsText2 }}</p>
                          </div>
                        </Tooltip>
                      </span>
                      <input type="text" v-model="item.bindVal" :placeholder="item.tips" :disabled="item.ifDisable" />
                      <br />
                      <!-- <div style="margin-left:150px;color:red"
                       v-if="countryCode=='GB'">只能输入英文，如有标点符号，请用空格代替</div> -->
                    </div>
                    <div v-else-if="item.type == 'moreText'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <input
                        type="text"
                        v-model="item.text1Bindval"
                        :placeholder="item.text1Tips"
                        :disabled="item.ifDisable"
                        style="width: 178px"
                      />
                      <input
                        type="text"
                        v-model="item.text2Bindval"
                        :placeholder="item.text2Tips"
                        :disabled="item.ifDisable"
                        style="width: 208px"
                      />
                    </div>
                    <div v-else>
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''"
                        >{{ item.name }}
                        <span class="tips-icon" v-if="item.tipsIcon">?</span>
                      </span>
                      <input type="text" v-model="item.bindVal" :placeholder="item.tips" :disabled="item.ifDisable" />
                    </div>
                  </div>
                  <!-- <div v-if="countryCode=='ES'"
                   class="form-item">
                <span class="label people redTip">公司营业执照注册城市:</span>
                <input type="text"
                       v-model="companyAdd.companyRegisteredCityZh"
                       placeholder="请输入中文，如：深圳市"
                       :disabled="notChange"
                       style="width:160px;" />
                <input type="text"
                       v-model="companyAdd.companyRegisteredCityEn"
                       placeholder="请输入英文，如：ShenZhen"
                       :disabled="notChange"
                       style="width:165px;margin-left:10px;" />
              </div> -->
                  <div v-if="countryCode == 'FR'" class="form-item">
                    <span class="label people redTip">公司邮政编号:</span>
                    <input
                      type="text"
                      v-model="companyAdd.companyPostCode"
                      placeholder="请输入公司注册地邮编号"
                      :disabled="notChange"
                    />
                  </div>
                  <!-- <div v-if="countryCode=='ES'"
                   class="form-item flex">
                <span class="label people redTip">是否有股权占比25%以上的股东:</span>
                <RadioGroup v-model="stockGreaterThan25"
                            style="display: inline-block;">
                  <Radio label="0"
                         :disabled="notChange">是</Radio>
                  <Radio label="1"
                         :disabled="notChange">否，没有</Radio>
                </RadioGroup>
              </div>
              <div v-if="countryCode=='ES' && stockGreaterThan25=='0'"
                   style="width:100%;">
                <div v-for="(item,index) in sharesList"
                     :key="index"
                     class="flex">
                  <div class="form-item flex gudong">
                    <span class="label people redTip">股东姓名：</span>
                    <Input v-model="item.shareholderZhName"
                           placeholder="中文名"
                           :disabled="notChange"
                           style="width:160px;"></Input>
                    <Input v-model="item.shareholderEnName"
                           placeholder="英文名"
                           :disabled="notChange"
                           style="width:165px;margin-left:20px;"></Input>
                  </div>
                  <div class="form-item flex">
                    <span class="label people redTip">股东身份证号码：</span>
                    <Input v-model="item.identityCard"
                           placeholder="请输入股东身份证号码"
                           :disabled="notChange"
                           style="width:400px;"></Input>
                  </div>
                </div>
              </div> -->
                  <!-- <div v-if="countryCode=='ES'" class="form-item" >
              <span class="label people redTip">公司营业执照注册城市:</span>
              <input type="text" v-model="companyAdd.companyRegisteredCityZh" placeholder="请输入中文，如：深圳市" :disabled="notChange" style="width:160px;"/>
              <input type="text" v-model="companyAdd.companyRegisteredCityEn" placeholder="请输入英文，如：ShenZhen" :disabled="notChange" style="width:165px;margin-left:10px;"/>
            </div> -->
                  <div class="form-item">
                    <div class="flex-align">
                      <span class="label people redTip" style="padding-bottom: 0px; width: 147px">公司英文地址:</span>
                      <div class="flex-align companyAddress" v-if="countryCode != 'GB'">
                        <input
                          type="text"
                          placeholder="国家 如：China"
                          v-model="companyAdd.companyAddressEnCountry"
                          :disabled="notChange"
                          style="width: 120px; margin-right: 15px"
                        />
                        <input
                          type="text"
                          placeholder="城市加省份 如: shenzhenshi guangdong"
                          v-model="companyAdd.companyAddressEnCity"
                          :disabled="notChange"
                        />
                      </div>
                      <div class="flex-align companyAddress" v-else>
                        <input
                          type="text"
                          placeholder="国家 如：China"
                          v-model="companyAdd.companyAddressEnCountry"
                          :disabled="notChange"
                        />
                      </div>
                    </div>
                    <br />
                    <Input
                      class="companyEn"
                      v-model="companyAdd.companyAddressEn"
                      type="textarea"
                      placeholder="请直接复制后台英文地址，包含城市、省份、邮编、国家"
                      :disabled="notChange"
                      :rows="4"
                      v-if="countryCode !== 'ES'"
                    />
                    <Input
                      class="companyEn"
                      v-model="companyAdd.companyAddressEn"
                      type="textarea"
                      placeholder="请直接复制店铺后台英文地址（不包括国家、邮编）"
                      :disabled="notChange"
                      :rows="4"
                      v-if="countryCode == 'ES'"
                    />
                    <p class="beizhu" v-if="countryCode == 'GB' || countryCode == 'DE'">
                      注：请根据您的店铺后台英文地址进行填写（需保持一致）
                    </p>
                  </div>
                </div>
                <Divider />
              </div>
              <div class="stepH">
                <div class="title">填写法人信息</div>
                <div class="inputH clearfix inputHFlex registerClass">
                  <div v-for="(item, index) in farenInfo" :key="index" class="form-item">
                    <div v-if="item.type == 'date'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <Date-picker
                        type="date"
                        :value="item.bindVal"
                        :disabled="item.ifDisable"
                        @on-change="changeDate($event, item)"
                        :options="options"
                        :placeholder="item.tips"
                      ></Date-picker>
                    </div>
                    <div v-else-if="item.type == 'radio'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <RadioGroup v-model="item.bindVal">
                        <Radio v-for="(v, i) in item.valList" :key="i" :label="v.index" :disabled="item.ifDisable">{{
                          v.val
                        }}</Radio>
                      </RadioGroup>
                    </div>
                    <div v-else-if="item.type == 'doubleInput'" class="doubleInput">
                      <span class="label people">{{ item.name }}</span>
                      <input
                        type="text"
                        placeholder="请填身份证号码"
                        v-model="companyAdd.companyLegalPersonCard"
                        :disabled="notChange"
                      />
                      <input
                        type="text"
                        placeholder="请填护照号码"
                        v-model="companyAdd.legalPersonCardPassportNumber"
                        :disabled="notChange"
                        style="margin-left: 183px; margin-top: 10px"
                      />
                      <p style="color: #f59a23; margin-left: 183px">备注：身份证号/护照号填写一个即可</p>
                    </div>
                    <div v-else-if="item.type == 'select'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <Select v-model="item.bindVal" :placeholder="item.tips" :disabled="item.ifDisable">
                        <Option v-for="item in birthplaceList" :value="item" :key="item.value">{{ item }}</Option>
                      </Select>
                    </div>
                    <div v-else>
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''"
                        >{{ item.name }}
                        <Tooltip placement="right" v-if="item.tipsIcon">
                          <span class="tips-icon">?</span>
                          <div slot="content">
                            <p>{{ item.tipsText1 }}</p>
                            <p>{{ item.tipsText2 }}</p>
                          </div>
                        </Tooltip>
                      </span>
                      <input type="text" v-model="item.bindVal" :placeholder="item.tips" :disabled="item.ifDisable" />
                      <div
                        v-if="countryCode === 'DE'"
                        style="margin-left: 147px; color: red; position: absolute; top: 38px; left: 0px"
                      >
                        {{ item.mark }}
                      </div>
                    </div>
                  </div>
                  <div v-if="countryCode == 'ES'" class="form-item">
                    <span class="label people redTip">法人出生省份:</span>
                    <input
                      type="text"
                      v-model="companyAdd.legalPersonBirthplaceProvinceZh"
                      placeholder="请输入中文，如：广东"
                      :disabled="notChange"
                      style="width: 160px"
                    />
                    <input
                      type="text"
                      v-model="companyAdd.legalPersonBirthplaceProvinceEn"
                      placeholder="请输入英文，如：GuangDong"
                      :disabled="notChange"
                      style="width: 165px; margin-left: 10px"
                    />
                  </div>
                  <!-- <div v-if="countryCode=='ES'"
                   class="form-item">
                <span class="label people redTip">法人出生城市:</span>
                <input type="text"
                       v-model="companyAdd.legalPersonBirthplaceCityZh"
                       placeholder="请输入中文，如：深圳市"
                       :disabled="notChange"
                       style="width:160px;" />
                <input type="text"
                       v-model="companyAdd.legalPersonBirthplaceCityEn"
                       placeholder="请输入英文，如：ShenZhen"
                       :disabled="notChange"
                       style="width:165px;margin-left:10px;" />
              </div> -->
                </div>
                <div class="legalPersonSignature" v-show="countryCode == 'ES'">
                  <p class="titleSign">法人签名</p>
                  <p class="titleSign" v-if="countryCode === 'ES'">
                    说明：法人签名主要应用于注册+申报,请使用中文进行签名
                    <!-- <a href="https://pre-fdfs.itaxs.com/group1/M00/00/57/rBLKLV7YahKARoyDAAuLPibt4uQ699.jpg"
                   target="_black">查看示例>></a> -->
                  </p>
                  <p class="titleSign" v-else>
                    说明：法人签名主要应用于注册+申报,请使用英文格式签名，如张三（San Zhang）
                    <a
                      href="https://pre-fdfs.itaxs.com/group1/M00/00/57/rBLKLV7YahKARoyDAAuLPibt4uQ699.jpg"
                      target="_black"
                      >查看示例>></a
                    >
                  </p>
                  <div class="flex">
                    <div id="qrcode" v-show="status == 0 || status == 8">
                      <p>请扫码进行注册+申报授权</p>
                    </div>
                    <div class="signature">
                      <img
                        v-if="
                          companyAdd.companyLegalPersonSign !== '' && companyAdd.companyLegalPersonSign !== undefined
                        "
                        :src="companyAdd.companyLegalPersonSign"
                        alt=""
                      />
                      <Button v-else type="primary" @click="hasSignature()">我已签名</Button>
                      <span
                        v-if="
                          (status == 0 || status == 8) &&
                          companyAdd.companyLegalPersonSign !== '' &&
                          companyAdd.companyLegalPersonSign !== undefined
                        "
                        @click="hasSignature"
                      >
                        <img class="refresh" src="../../../assets/images/common/refreshBlue.png" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
                <Divider />
              </div>
              <div class="stepH">
                <div class="title">店铺信息</div>
                <div class="inputH clearfix inputHFlex shopClass registerClass">
                  <div v-for="(item, index) in shopInfo" :key="index" class="form-item">
                    <div v-if="item.type == 'date'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''"
                        >{{ item.name }}
                        <Tooltip placement="right" v-if="item.tipsIcon">
                          <span class="tips-icon">?</span>
                          <div slot="content">
                            <p>{{ item.tipsText1 }}</p>
                            <p>{{ item.tipsText2 }}</p>
                          </div>
                        </Tooltip>
                      </span>
                      <Date-picker
                        type="date"
                        :value="item.bindVal"
                        :disabled="item.ifDisable"
                        @on-change="changeDate($event, item)"
                        :placeholder="item.tips"
                      ></Date-picker>
                      <div
                        v-if="countryCode === 'DE'"
                        style="margin-left: 147px; color: red; position: absolute; top: 38px; left: 0px"
                      >
                        {{ item.mark }}
                      </div>
                    </div>
                    <div v-else-if="item.type == 'radio'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''"
                        >{{ item.name }}
                        <Tooltip placement="right" v-if="item.tipsIcon">
                          <span class="tips-icon">?</span>
                          <div slot="content">
                            <p>{{ item.tipsText1 }}</p>
                            <p>{{ item.tipsText2 }}</p>
                          </div>
                        </Tooltip>
                      </span>
                      <RadioGroup v-model="item.bindVal">
                        <Radio v-for="(v, i) in item.valList" :key="i" :label="v.index" :disabled="item.ifDisable">{{
                          v.val
                        }}</Radio>
                      </RadioGroup>
                    </div>
                    <div v-else-if="item.type == 'Radio' && countryCode === 'GB'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }} </span>
                      <RadioGroup v-model="isShopConsoleScreenshot">
                        <Radio label="1" :disabled="item.ifDisable">有截图</Radio>
                        <Radio label="2" :disabled="item.ifDisable">无截图</Radio>
                      </RadioGroup>
                    </div>
                    <div v-else-if="item.type == 'textarea'" class="bank-info">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <Input
                        v-model="item.bindVal"
                        type="textarea"
                        :row="4"
                        :placeholder="item.tips"
                        :disabled="item.ifDisable"
                        style="width: 400px; margin-left: 0"
                      ></Input>
                    </div>
                    <div v-else-if="item.type == 'number'">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <input
                        type="text"
                        v-model="item.bindVal"
                        number
                        :placeholder="item.tips"
                        :disabled="item.ifDisable"
                      />
                      <div
                        style="margin-left: 202px; color: red; position: absolute; top: 38px; left: -25px"
                        v-if="isNaN(item.bindVal - 0)"
                      >
                        请填写正确的预计销售额
                      </div>
                      <div v-else style="margin-left: 202px; color: red; position: absolute; top: 38px; left: -25px">
                        {{ item.mark }}
                      </div>
                    </div>
                    <div v-else-if="item.type == 'select' && countryCode === 'IT'" style="padding-bottom: 20px">
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''">{{ item.name }}</span>
                      <Select v-model="item.bindVal" :placeholder="item.tips" :disabled="item.ifDisable">
                        <Option :value="0">月度申报</Option>
                        <Option :value="1">季度申报</Option>
                      </Select>
                      <p style="position: absolute; top: 43px; left: 145px; color: #f59a23; font-size: 12px">
                        注：季度申报需多缴纳1%税金，月度申报/每个月申报一次；
                      </p>
                    </div>
                    <div v-else>
                      <span class="label people" :class="item.isNeed != 0 ? 'redTip' : ''"
                        >{{ item.name }}
                        <Tooltip placement="right" v-if="item.tipsIcon">
                          <span class="tips-icon">?</span>
                          <div slot="content">
                            <p>{{ item.tipsText1 }}</p>
                            <p>{{ item.tipsText2 }}</p>
                          </div>
                        </Tooltip>
                      </span>
                      <input type="text" v-model="item.bindVal" :placeholder="item.tips" :disabled="item.ifDisable" />
                    </div>
                  </div>
                </div>
                <Divider />
              </div>
              <div class="stepH file-out-box fileContainer" v-if="status == 0 || status == 8 || status == undefined">
                <div class="title file-title">文件信息（以下文件需高清、无水印、完整、未过期）</div>
                <div class="inputH clearfix">
                  <p class="expand redTip company-file">任选1种上传（大陆公司/香港公司）:</p>
                  <div class="file-box clearfix">
                    <div class="file-type-name fl">大陆公司：</div>
                    <div class="file-box-inner">
                      <div
                        @click="selectDateIndex(index, item)"
                        v-for="(item, index) in filesInfo"
                        :key="index"
                        class="file-wrapper fl clearfix"
                      >
                        <div v-if="item.type === 1 && item.row == 1" class="fl file-item">
                          <Upload
                            type="drag"
                            :ref="item.value"
                            :before-upload="beforeUploadHandler"
                            :on-format-error="formatErrorHandler"
                            :on-success="
                              (res, file, fileList) => {
                                successHandler(res, file, fileList, item);
                              }
                            "
                            :on-remove="
                              (file, fileList) => {
                                removeHandler(file, fileList, item);
                              }
                            "
                            :action="ImgUrl"
                            :data="{ prefix: '' }"
                            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                            :show-upload-list="false"
                            v-if="item.urlName == ''"
                          >
                            <div class="inner">
                              <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                              <div class="main-text">点击上传</div>
                            </div>
                          </Upload>
                          <div v-else class="imgBox">
                            <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                              <img src="@/assets/images/common/closeImg.png" alt="" />
                            </Button>
                            <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                              >点击查看</a
                            >
                            <img :src="item.urlName" alt="" v-else />
                          </div>
                          <span class="file-wrapper-title">{{ item.name }}</span>
                        </div>
                        <a
                          href="https://fdfs.itaxs.com/group1/M00/00/27/rBLKNV61CD-AM5qZAAHRKwUO8zs26.docx"
                          class="example-btn fl"
                          v-if="item.tips == 'BusinessLicenseTranslate'"
                        >
                          <img class="uplad-symbol" src="@/assets/images/common/downloadImg.png" alt="" /> 下载模板>>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="file-box clearfix">
                    <div class="file-type-name fl">香港公司：</div>
                    <div class="file-box-inner">
                      <div
                        @click="selectDateIndex(index, item)"
                        v-for="(item, index) in filesInfo"
                        :key="index"
                        class="file-wrapper fl clearfix"
                      >
                        <div v-if="item.type === 1 && item.row == 2" class="fl file-item">
                          <Upload
                            type="drag"
                            :ref="item.value"
                            :before-upload="beforeUploadHandler"
                            :on-format-error="formatErrorHandler"
                            :on-success="
                              (res, file, fileList) => {
                                successHandler(res, file, fileList, item);
                              }
                            "
                            :on-remove="
                              (file, fileList) => {
                                removeHandler(file, fileList, item);
                              }
                            "
                            :action="ImgUrl"
                            :data="{ prefix: '' }"
                            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                            :show-upload-list="false"
                            v-if="item.urlName == ''"
                          >
                            <div class="inner">
                              <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                              <div class="main-text">点击上传</div>
                            </div>
                          </Upload>
                          <div v-else class="imgBox">
                            <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                              <img src="@/assets/images/common/closeImg.png" alt="" />
                            </Button>
                            <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                              >点击查看</a
                            >
                            <img :src="item.urlName" alt="" v-else />
                          </div>
                          <span class="file-wrapper-title">{{ item.name }}</span>
                        </div>
                        <div
                          v-if="item.type === 1 && item.row == 2"
                          class="example-btn fl"
                          @click="
                            HKFileExample = true;
                            exampleIndex = item.value;
                          "
                        >
                          <img class="uplad-symbol" src="@/assets/images/common/searchImg.png" alt="" /> 查看示例>>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="expand redTip company-file" v-if="countryCode === 'GB'">
                    任选1种上传（身份证/护照/驾驶证）:
                  </p>
                  <p class="expand redTip company-file" v-else>任选1种上传（身份证/护照）:</p>
                  <div class="file-box clearfix flex">
                    <div>
                      <div class="file-type-name fl">身份证：</div>
                      <div class="file-box-inner">
                        <div
                          @click="selectDateIndex(index, item)"
                          v-for="(item, index) in filesInfo"
                          :key="index"
                          class="file-wrapper fl clearfix"
                        >
                          <div v-if="item.type === 2 && item.row == 1" class="fl file-item">
                            <Upload
                              type="drag"
                              :ref="item.value"
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, item);
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, item);
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                              :show-upload-list="false"
                              v-if="item.urlName == ''"
                            >
                              <div class="inner">
                                <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                                <div class="main-text">点击上传</div>
                              </div>
                            </Upload>
                            <div v-else class="imgBox">
                              <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                                <img src="@/assets/images/common/closeImg.png" alt="" />
                              </Button>
                              <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <img :src="item.urlName" alt="" v-else />
                            </div>
                            <span class="file-wrapper-title">{{ item.name }}</span>
                          </div>
                          <a
                            href="https://fdfs.itaxs.com/group1/M00/00/27/rBLKNV61B4yAaT_1AAJwqVWiA6w98.docx"
                            class="example-btn fl"
                            v-if="item.tips == 'IDCardTranslate'"
                          >
                            <img class="uplad-symbol" src="@/assets/images/common/downloadImg.png" alt="" /> 下载模板>>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="file-type-name fl">护照：</div>
                      <div class="file-box-inner">
                        <div
                          @click="selectDateIndex(index, item)"
                          v-for="(item, index) in filesInfo"
                          :key="index"
                          class="file-wrapper fl"
                        >
                          <div v-if="item.type === 2 && item.row == 2" class="file-item">
                            <Upload
                              type="drag"
                              :ref="item.value"
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, item);
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, item);
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                              :show-upload-list="false"
                              v-if="item.urlName == ''"
                            >
                              <div class="inner">
                                <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                                <div class="main-text">点击上传</div>
                              </div>
                            </Upload>
                            <div v-else class="imgBox">
                              <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                                <img src="@/assets/images/common/closeImg.png" alt="" />
                              </Button>
                              <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <img :src="item.urlName" alt="" v-else />
                            </div>
                            <span class="file-wrapper-title">{{ item.name }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="file-type-name fl" v-if="countryCode === 'GB'">驾驶证：</div>
                      <div class="file-box-inner" v-if="countryCode === 'GB'">
                        <div
                          @click="selectDateIndex(index, item)"
                          v-for="(item, index) in filesInfo"
                          :key="index"
                          class="file-wrapper fl"
                        >
                          <div v-if="item.type === 2 && item.row == 3" class="file-item">
                            <Upload
                              type="drag"
                              :ref="item.value"
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, item);
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, item);
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                              :show-upload-list="false"
                              v-if="item.urlName == ''"
                            >
                              <div class="inner">
                                <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                                <div class="main-text">点击上传</div>
                              </div>
                            </Upload>
                            <div v-else class="imgBox">
                              <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                                <img src="@/assets/images/common/closeImg.png" alt="" />
                              </Button>
                              <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <img :src="item.urlName" alt="" v-else />
                            </div>
                            <span class="file-wrapper-title">{{ item.name }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="countryCode != 'IT' && countryCode != 'ES' && isShopConsoleScreenshot === '1'">
                    <p class="expand redTip company-file">店铺后台公司信息界面截图：</p>
                    <div class="file-box clearfix">
                      <div class="file-type-name fl"></div>
                      <div class="file-box-inner">
                        <div
                          @click="selectDateIndex(index, item)"
                          v-for="(item, index) in filesInfo"
                          :key="index"
                          class="file-wrapper fl clearfix"
                        >
                          <div v-if="item.type === 4" class="fl file-item">
                            <Upload
                              type="drag"
                              :ref="item.value"
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, item);
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, item);
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                              :show-upload-list="false"
                              v-if="item.urlName == ''"
                            >
                              <div class="inner">
                                <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                                <div class="main-text">点击上传</div>
                              </div>
                            </Upload>
                            <div v-else class="imgBox">
                              <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                                <img src="@/assets/images/common/closeImg.png" alt="" />
                              </Button>
                              <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <img :src="item.urlName" alt="" v-else />
                            </div>
                            <!-- <span class="file-wrapper-title">{{item.name}}</span> -->
                          </div>
                          <a
                            href="https://fdfs.itaxs.com/group1/M00/00/27/rBLKNV61CJKACMtaAAtFQeS7riM549.pdf"
                            class="example-btn fl"
                            v-if="item.type === 4"
                            target="_href"
                          >
                            <img class="uplad-symbol" src="@/assets/images/common/searchImg.png" alt="" /> 查看示例>>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="countryCode === 'GB' && isShopConsoleScreenshot === '2'">
                    <p class="expand redTip company-file">店铺后台确认函：</p>
                    <div class="file-box clearfix">
                      <div class="file-type-name fl"></div>
                      <div class="file-box-inner">
                        <div
                          @click="selectDateIndex(index, item)"
                          v-for="(item, index) in filesInfo"
                          :key="index"
                          class="file-wrapper fl clearfix"
                        >
                          <div v-if="item.type === 5" class="fl file-item">
                            <Upload
                              type="drag"
                              :ref="item.value"
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, item);
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, item);
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx']"
                              :show-upload-list="false"
                              v-if="item.urlName == ''"
                            >
                              <div class="inner">
                                <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                                <div class="main-text">点击上传</div>
                              </div>
                            </Upload>
                            <div v-else class="imgBox">
                              <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                                <img src="@/assets/images/common/closeImg.png" alt="" />
                              </Button>
                              <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <a :href="item.urlName" v-if="item.suffix == 'docx'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <img :src="item.urlName" alt="" v-else />
                            </div>
                            <!-- <span class="file-wrapper-title">{{item.name}}</span> -->
                          </div>
                          <a
                            href="https://pre-fdfs.itaxs.com/group1/M00/00/AF/rBLKLV-adJuAfyn0AAAv1ofoQms95.docx"
                            class="example-btn fl"
                            v-if="item.type === 5"
                            target="_href"
                          >
                            <img class="uplad-symbol" src="@/assets/images/common/searchImg.png" alt="" /> 查看示例>>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="expand redTip company-file" v-if="countryCode == 'IT' || countryCode == 'ES'">
                    公司信用报告：
                  </p>
                  <div class="file-box clearfix" v-if="countryCode == 'IT' || countryCode == 'ES'">
                    <div class="file-type-name fl"></div>
                    <div class="file-box-inner">
                      <div
                        @click="selectDateIndex(index, item)"
                        v-for="(item, index) in filesInfo"
                        :key="index"
                        class="file-wrapper fl clearfix"
                      >
                        <div v-if="item.type === 5" class="fl file-item">
                          <Upload
                            type="drag"
                            :ref="item.value"
                            :before-upload="beforeUploadHandler"
                            :on-format-error="formatErrorHandler"
                            :on-success="
                              (res, file, fileList) => {
                                successHandler(res, file, fileList, item);
                              }
                            "
                            :on-remove="
                              (file, fileList) => {
                                removeHandler(file, fileList, item);
                              }
                            "
                            :action="ImgUrl"
                            :data="{ prefix: '' }"
                            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                            :show-upload-list="false"
                            v-if="item.urlName == ''"
                          >
                            <div class="inner">
                              <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                              <div class="main-text">点击上传</div>
                            </div>
                          </Upload>
                          <div v-else class="imgBox">
                            <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                              <img src="@/assets/images/common/closeImg.png" alt="" />
                            </Button>
                            <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                              >点击查看</a
                            >
                            <img :src="item.urlName" alt="" v-else />
                          </div>
                          <!-- <span class="file-wrapper-title">{{item.name}}</span> -->
                        </div>
                        <span class="explame-out" v-if="item.type === 5">
                          信用报告
                          <a
                            class="explame"
                            href="https://fdfs.itaxs.com/group1/M00/00/1F/rBLKNV6n0kKAU23YAASrdiyBiIs540.pdf"
                            target="_blank"
                            >获取方法>></a
                          >
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="file-box clearfix" v-if="countryCode == 'IT'">
                    <div class="file-type-name fl"></div>
                    <div
                      @click="selectDateIndex(index, item)"
                      v-for="(item, index) in filesInfo"
                      :key="index"
                      class="file-wrapper fl clearfix"
                    >
                      <div v-if="item.type === 6" class="fl">
                        <Upload
                          type="drag"
                          :ref="item.value"
                          :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, item);
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, item);
                            }
                          "
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          :show-upload-list="false"
                          v-if="item.urlName == ''"
                        >
                          <div class="inner">
                            <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                            <div class="main-text">点击上传</div>
                          </div>
                        </Upload>
                        <div v-else class="imgBox">
                          <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                            <img src="@/assets/images/common/closeImg.png" alt="" />
                          </Button>
                          <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                            >点击查看</a
                          >
                          <img :src="item.urlName" alt="" v-else />
                        </div>
                        <span class="file-wrapper-title">{{ item.name }}</span>
                      </div>
                      <div class="explame-out" v-if="item.type === 6">
                        <a href="https://fdfs.itaxs.com/group1/M00/00/1F/rBLKNV6n3lGANOg0AABiANveBV8734.doc"
                          >下载授权书模板>></a
                        >
                      </div>
                    </div>
                  </div>
                  <p class="expand redTip company-file" v-if="countryCode == 'AA' || countryCode == 'ES'">
                    亚马逊证明文件：
                  </p>
                  <div class="file-box clearfix">
                    <div class="file-type-name fl"></div>
                    <div class="file-box-inner">
                      <div
                        @click="selectDateIndex(index, item)"
                        v-for="(item, index) in filesInfo"
                        :key="index"
                        class="file-wrapper fl clearfix"
                      >
                        <div v-if="item.type === 7" class="fl file-item">
                          <Upload
                            type="drag"
                            :ref="item.value"
                            :before-upload="beforeUploadHandler"
                            :on-format-error="formatErrorHandler"
                            :on-success="
                              (res, file, fileList) => {
                                successHandler(res, file, fileList, item);
                              }
                            "
                            :on-remove="
                              (file, fileList) => {
                                removeHandler(file, fileList, item);
                              }
                            "
                            :action="ImgUrl"
                            :data="{ prefix: '' }"
                            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                            :show-upload-list="false"
                            v-if="item.urlName == ''"
                          >
                            <div class="inner">
                              <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                              <div class="main-text">点击上传</div>
                            </div>
                          </Upload>
                          <div v-else class="imgBox">
                            <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                              <img src="@/assets/images/common/closeImg.png" alt="" />
                            </Button>
                            <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                              >点击查看</a
                            >
                            <img :src="item.urlName" alt="" v-else />
                          </div>
                          <span class="file-wrapper-title">{{ item.name }}</span>
                        </div>
                        <span class="explame-out" v-if="item.type === 7">
                          <a
                            class="explame"
                            href="https://pre-fdfs.itaxs.com/group1/M00/00/AD/rBLKLV-SQLOATShjABEulX0thsM706.pdf"
                            target="_blank"
                          >
                            <img class="uplad-symbol" src="@/assets/images/common/searchImg.png" alt="" /> 查看示例>>
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                  <p class="expand redTip company-file" v-if="countryCode == 'ES'">其他欧盟税号文件：</p>
                  <div class="file-box clearfix" v-if="countryCode == 'ES'">
                    <div class="file-type-name fl"></div>
                    <div class="file-box-inner">
                      <div
                        @click="selectDateIndex(index, item)"
                        v-for="(item, index) in filesInfo"
                        :key="index"
                        class="file-wrapper fl clearfix"
                      >
                        <div v-if="item.type === 8" class="fl file-item">
                          <Upload
                            type="drag"
                            :ref="item.value"
                            :before-upload="beforeUploadHandler"
                            :on-format-error="formatErrorHandler"
                            :on-success="
                              (res, file, fileList) => {
                                successHandler(res, file, fileList, item);
                              }
                            "
                            :on-remove="
                              (file, fileList) => {
                                removeHandler(file, fileList, item);
                              }
                            "
                            :action="ImgUrl"
                            :data="{ prefix: '' }"
                            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                            :show-upload-list="false"
                            v-if="item.urlName == ''"
                          >
                            <div class="inner">
                              <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                              <div class="main-text">点击上传</div>
                            </div>
                          </Upload>
                          <div v-else class="imgBox">
                            <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                              <img src="@/assets/images/common/closeImg.png" alt="" />
                            </Button>
                            <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                              >点击查看</a
                            >
                            <img :src="item.urlName" alt="" v-else />
                          </div>
                          <span class="file-wrapper-title">{{ item.name }}</span>
                        </div>
                        <span class="explame-out" v-if="item.type === 8">
                          其它欧盟国家税号证书（法国、意大利优先）
                        </span>
                      </div>
                    </div>
                  </div>
                  <p class="expand redTip company-file" v-if="countryCode == 'DE'">仓储地址截图（必填）</p>
                  <div class="file-box clearfix" v-if="countryCode == 'DE'">
                    <div class="file-type-name fl"></div>
                    <div class="file-box-inner">
                      <div
                        @click="selectDateIndex(index, item)"
                        v-for="(item, index) in filesInfo"
                        :key="index"
                        class="file-wrapper fl clearfix"
                      >
                        <div v-if="item.type === 8" class="fl file-item">
                          <Upload
                            type="drag"
                            :ref="item.value"
                            :before-upload="beforeUploadHandler"
                            :on-format-error="formatErrorHandler"
                            :on-success="
                              (res, file, fileList) => {
                                successHandler(res, file, fileList, item);
                              }
                            "
                            :on-remove="
                              (file, fileList) => {
                                removeHandler(file, fileList, item);
                              }
                            "
                            :action="ImgUrl"
                            :data="{ prefix: '' }"
                            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                            :show-upload-list="false"
                            v-if="item.urlName == ''"
                          >
                            <div class="inner">
                              <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                              <div class="main-text">点击上传</div>
                            </div>
                          </Upload>
                          <div v-else class="imgBox">
                            <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                              <img src="@/assets/images/common/closeImg.png" alt="" />
                            </Button>
                            <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                              >点击查看</a
                            >
                            <img :src="item.urlName" alt="" v-else />
                          </div>
                          <!-- <span class="file-wrapper-title">{{item.name}}</span> -->
                        </div>
                        <a
                          href="https://fdfs.itaxs.com/group1/M00/02/3D/rBLKNV8xCbeAGoDXABPw3e8DDKw534.pdf"
                          class="example-btn fl"
                          v-if="item.type === 8"
                          target="_href"
                        >
                          <img class="uplad-symbol" src="@/assets/images/common/searchImg.png" alt="" /> 查看示例>>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div v-if="countryCode == 'GB' && isShopConsoleScreenshot === '2'">
                    <p class="expand redTip">其它资料（以下资料任选1种上传）:</p>
                    <div class="otherFile-box-inner file-box">
                      <div
                        v-for="(item, index) in filesInfo"
                        :key="index"
                        @click="selectDateIndex(index, item)"
                        class="stepH other-file-box"
                      >
                        <div v-if="item.type === 3 && item.tips == 'jobProve'" class="inputH">
                          <span class="file-name">{{ item.name }}：</span>
                          <div class="file-item">
                            <Upload
                              type="drag"
                              :ref="item.value"
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, item);
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, item);
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                              :show-upload-list="false"
                              class="upload-box"
                              v-if="item.urlName == ''"
                            >
                              <div class="inner">
                                <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                                <!-- <span>点击上传</span> -->
                              </div>
                            </Upload>
                            <div v-else class="imgBox">
                              <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                                <img src="@/assets/images/common/closeImg.png" alt="" />
                              </Button>
                              <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <img :src="item.urlName" alt="" v-else />
                            </div>
                            <!-- <span v-if="item.urlName==''" class="file-wrapper-title">{{item.name}}</span> -->
                          </div>
                          <a
                            href="https://fdfs.itaxs.com/group1/M00/00/15/rBLKNV6YFGCAC-G2AAD3y5MuO1Q466.pdf"
                            target="_blank"
                            class="tips-box"
                          >
                            <img class="uplad-symbol" src="@/assets/images/common/searchImg.png" alt="" /> 查看示例>>
                          </a>
                        </div>
                        <div v-else-if="item.type === 3 && item.tips == 'rentContract'" class="inputH">
                          <span class="file-name">{{ item.name }}：</span>
                          <div class="file-item">
                            <Upload
                              type="drag"
                              :ref="item.value"
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, item);
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, item);
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                              :show-upload-list="false"
                              class="upload-box"
                              v-if="item.urlName == ''"
                            >
                              <div class="inner">
                                <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                                <!-- <span>点击上传</span> -->
                              </div>
                            </Upload>
                            <div v-else class="imgBox">
                              <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                                <img src="@/assets/images/common/closeImg.png" alt="" />
                              </Button>
                              <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <img :src="item.urlName" alt="" v-else />
                            </div>
                            <!-- <span v-if="item.urlName==''" class="file-wrapper-title">{{item.name}}</span> -->
                          </div>
                          <a
                            href="https://fdfs.itaxs.com/group1/M00/00/0D/rBLKNV6AVYGATZPqAAIHM7rZEFk849.pdf"
                            target="_blank"
                            class="tips-box"
                          >
                            <img class="uplad-symbol" src="@/assets/images/common/searchImg.png" alt="" /> 查看示例>>
                          </a>
                        </div>
                        <div v-else-if="item.type === 3" class="inputH">
                          <span class="file-name">{{ item.name }}：</span>
                          <div class="file-item">
                            <Upload
                              type="drag"
                              :ref="item.value"
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, item);
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, item);
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                              :show-upload-list="false"
                              class="upload-box"
                              v-if="item.urlName == ''"
                            >
                              <div class="inner">
                                <img class="uplad-symbol" src="@/assets/images/common/addImg.png" alt="" />
                                <!-- <span>点击上传</span> -->
                              </div>
                            </Upload>
                            <div v-else class="imgBox">
                              <Button class="deletBtn" @click="removeHandler(1, 1, item)">
                                <img src="@/assets/images/common/closeImg.png" alt="" />
                              </Button>
                              <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf"
                                >点击查看</a
                              >
                              <img :src="item.urlName" alt="" v-else />
                            </div>
                            <!-- <span v-if="item.urlName==''" class="file-wrapper-title">{{item.name}}</span> -->
                          </div>
                          <a href="" target="_blank" class="tips-box" style="visibility: hidden">
                            <img class="uplad-symbol" src="@/assets/images/common/searchImg.png" alt="" /> 查看示例>>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="stepH clearfix">
                <div class="title">文件信息</div>
                <div v-for="(item, index) in filesInfo" :key="index">
                  <div class="file-wrapper fl" v-if="item.urlName != ''">
                    <div class="showImg">
                      <a :href="item.urlName" v-if="item.suffix == 'pdf'" target="_blank" class="show-pdf">点击查看</a>
                      <img :src="item.urlName" v-else />
                    </div>
                    <span class="file-wrapper-title">{{ item.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            <SaRegister
              v-if="countryCode == 'SA' && leftFrom != null"
              ref="childSA"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></SaRegister>
            <AeRegister
              v-if="countryCode == 'AE' && leftFrom != null"
              ref="childAE"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></AeRegister>
            <PlRegister
              v-if="countryCode == 'PL' && leftFrom != null"
              ref="childPL"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></PlRegister>
            <NlRegister
              v-if="countryCode == 'NL' && leftFrom != null"
              ref="childNL"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></NlRegister>
            <GbRegister
              v-if="countryCode == 'GB' && leftFrom != null"
              ref="childGB"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></GbRegister>
            <DeRegister
              v-if="countryCode == 'DE' && leftFrom != null"
              ref="childDE"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></DeRegister>
            <FrRegister
              v-if="countryCode == 'FR' && leftFrom != null"
              ref="childFR"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></FrRegister>
            <ItRegister
              v-if="countryCode == 'IT' && leftFrom != null && supplierId != 50"
              ref="childIT"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></ItRegister>
            <It2Register
              v-if="countryCode == 'IT' && leftFrom != null && supplierId == 50"
              ref="childIT"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></It2Register>
            <EsRegister
              v-if="countryCode == 'ES' && hyFlag != 2 && leftFrom != null"
              ref="childES"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></EsRegister>
            <EsRegisterNoHy
              v-if="countryCode == 'ES' && hyFlag == 2 && leftFrom != null"
              ref="childES"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></EsRegisterNoHy>
            <CzRegister
              v-if="countryCode == 'CZ' && leftFrom != null"
              ref="childCZ"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></CzRegister>
            <AtRegister
              v-if="countryCode == 'AT' && leftFrom != null"
              ref="childAT"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></AtRegister>
            <IOSSRegister
              v-if="countryCode == 'IOSS' && leftFrom != null"
              ref="childIOSS"
              :notChange="notChange"
              :leftFrom="leftFrom"
              :status="status"
              :servicesId="servicesId"
              @submitSuccess="submitSuccessSa"
            ></IOSSRegister>
          </div>
          <div class="clearfix newBt" v-if="status == 0 || status == 8 || status == undefined">
            <div class="btn">
              <Button @click="toSave(0)" class="prev" :loading="saveBtnLoading">保存</Button>
              <Button @click="clickSubmit(1)" class="next" :loading="submitBtnLoading">提交</Button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="pageType == 3">
        <authorized-taxRegistration :countryCode="$route.query.countryCode"
                                    :serviceId="$route.query.servicesId"
                                    :countryNameZh="$route.query.countryNameZh"
                                    :supplierId="supplierId"></authorized-taxRegistration>
      </div>
    </div>
    <!-- <div class="up" @click="backTop">
      <Tooltip content="回到顶部" placement="left-start">
        <img src="@/assets/images/common/up.svg" alt="" />
        <span>顶部</span>
      </Tooltip>
    </div> -->
    <Modal v-model="HKFileExample" footer-hide width="690" class="example-modal">
      <!-- br文件 -->
      <img
        src="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_dOACF2FAALt-Hjd_Jk072.png"
        v-if="exampleIndex == 'companyBusinessRegistrationBr'"
      />
      <!-- NNC1 -->
      <img
        src="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV61AOOAaaUDAAMDXiZXCZo609.png"
        v-if="exampleIndex == 'companyCorporateFoundingNnc1'"
      />
      <!-- CI -->
      <img
        src="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_kyADlfrAAJWob8GDgQ847.png"
        v-if="exampleIndex == 'companyRegistrationCi'"
      />
    </Modal>
    <Modal v-model="tipsModal">
      <div class="tipsModal-title">温馨提示</div>
      <Divider style="margin: 16px 0" />
      <div class="tipsModal-contnet">
        <p class="tip-title">您的资料审核未通过，请按照以下指引修改...</p>
        <p>{{ remark }}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="tipsModal = false">知道了</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import {
  getMaterialSubmit,
  getRegTaxDetail,
  getMaterialSave,
  getAllServiceCompanies,
  getCompanyInformation,
  getCompanyLegalPersonSign,
  getCompanyLegalPersonSignUrl,
} from "@/api/registerInfo/registerInfo";
import { legalpersonCountry, taxInfo } from "@/api/taxModule";
import { Throttle } from "@/libs/throttle.js";
// import { apiUrl } from '@/config/index'
import dataStatus from "@/views/common/dataStatus";
import AuthorizedTaxRegistration from "@/components/AuthorizedTaxRegistration/index.vue";
import SaRegister from "@/views/home/components/registerComponents/SaRegister.vue";
import AeRegister from "@/views/home/components/registerComponents/AeRegister.vue";
import PlRegister from "@/views/home/components/registerComponents/PlRegister.vue";
import NlRegister from "@/views/home/components/registerComponents/NlRegister.vue";
import GbRegister from "@/views/home/components/registerComponents/GbRegister.vue";
import DeRegister from "@/views/home/components/registerComponents/DeRegister.vue";
import FrRegister from "@/views/home/components/registerComponents/FrRegister.vue";
import ItRegister from "@/views/home/components/registerComponents/ItRegister.vue";
import It2Register from "@/views/home/components/registerComponents/It2Register.vue";
import EsRegister from "@/views/home/components/registerComponents/EsRegister.vue";
import EsRegisterNoHy from "@/views/home/components/registerComponents/EsRegisterNoHy.vue";
import AtRegister from "@/views/home/components/registerComponents/AtRegister.vue";
import CzRegister from "@/views/home/components/registerComponents/CzRegister.vue";
import IOSSRegister from "@/views/home/components/registerComponents/IOSSRegister.vue";
export default {
  components: {
    SaRegister,
    AeRegister,
    PlRegister,
    NlRegister,
    GbRegister,
    DeRegister,
    FrRegister,
    ItRegister,
    It2Register,
    EsRegister,
    EsRegisterNoHy,
    AtRegister,
    CzRegister,
    IOSSRegister,
    dataStatus,
    AuthorizedTaxRegistration,
  },
  props: {
    isTaxDetails: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pageType: "2",
      modalMessage: false,
      HKFileExample: false,
      btnFlag: false,
      exampleIndex: 0,
      status: this.$route.query.status,
      messageStr: "", // 帮助
      currentInput: {
        type: "",
        index: "",
      },
      options: {
        disabledDate(date) {
          return date > Date.now();
        },
      },
      birthplaceList: [],
      countryCode: this.$route.query.countryCode,
      hyFlag: this.$route.query.hyFlag,
      countryNameZh: this.$route.query.countryNameZh,
      supplierId: this.$route.query.supplierId,
      verifyEng: true,
      includeChinese: false,
      saveBtnLoading: false, //保存按钮loading
      submitBtnLoading: false, //提交按钮loading
      hoverIndex: -1,
      companyInfo: [
        {
          name: "公司中文名称:",
          value: "companyNameZh", //此字段根据后台接口修改
          isNeed: 1, //0选填，其他都必填，点击提交做验证
          bindVal: this.$route.query.companyNameZh, //绑定的值
          tips: "请输入公司全称",
          type: "companyName",
        },
        {
          name: "公司英文名称:",
          value: "companyNameEn",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请直接复制店铺后台英文公司名",
          type: "english",
          tipsIcon: true, //是否显示提示
          tipsText1: "请直接复制店铺后台的英文公司名：",
          tipsText2: "备注：英国注册资料公司英文名称中间如有标点符号，请用空格代替；",
        },
        {
          name: "公司中文地址:",
          value: "companyAddressZh",
          isNeed: 0,
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入公司地址",
        },
        {
          name: "邮编号码:",
          value: "shopPostCode",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: " 请复制店铺后台的邮编号码",
        },
        {
          name: "公司统一社会信用代码:",
          value: "companyCreditCode",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入营业执照的统一信用代码",
        },
        {
          name: "公司成立日期:",
          value: "companyRegisterData",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "请选择成立日期",
        },
      ],
      shopInfo: [
        {
          name: "税号生效日期:",
          value: "shopTaxEffectiveData",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "根据实际发货/销售日期填写，建议未来一个月内",
          tipsIcon: true,
          tipsText1:
            "新账户：税号生效期请控制在未来2个月内，税号会等到中国时间此日期次日才会生效，从而才可以将税号绑定到店铺后台，请务必慎重选择。另建议填写月初不填月尾，因为计税是完整月计算的。",
          tipsText2:
            "老账户：产生第一笔FBA销售时间/海外仓产生第一笔销售额时间/超过远程销售时间，哪个时间早以哪个时间为准。",
        },
        {
          name: "销售平台名称:",
          value: "shopSalePlatformName",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "亚马逊", index: "亚马逊" },
            { val: "eBay", index: "eBay" },
            { val: "其他", index: "其他" },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "描述下公司的经营内容:",
          value: "companyBusinessModeDescribe",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入英文描述，如服装 clothing",
          tipsIcon: true,
          tipsText1: "请用英文填写店铺销售产品类型，如：Electronic product ，填写1-3种即可。",
          tipsText2: "",
        },
        {
          name: "未来12个月预计销售额（英镑）:",
          value: "shopSalePlan",
          ifDisable: false,
          type: "number",
          bindVal: "", //绑定的值
          tips: "请输入数字：（申请低税率<15W英镑，标准税率>=15W英镑）",
          mark: "注： 请输入完整的销售额，如10W，则输入100000；",
        },
        {
          name: "税率:",
          value: "shopTaxRate",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "低税率", index: 0 },
            { val: "标准税率", index: 1 },
          ],
          bindVal: "", //绑定的值
          tipsIcon: true,
          tipsText1:
            "标准税率：英国标准税率为20%，标准税率可以抵扣符合标准的进口增值税等。低税率：英国低税率有3种：6.5%、7.5%、16.5% 。低税率均不可以做任何抵扣。注册VAT申请低税率首年预估销售额不能超过15W英镑。实际年销售额不能超过23W英镑。另外需同时满足下面2点才可以使用首年6.5%、次年7.5%的低税率，不能同时满足下面2点则只能使用16.5%低税率（1）每季度进口货值必须大于或等于250英镑（2）进口货值与当季销售额的比重必须大于或等于2%",
          tipsText2: "",
        },
        {
          name: "是否有欧盟国EORI号:",
          value: "needEoriNumber",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "否", index: 0 },
            { val: "是", index: 1 },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "是否有店铺后台截图:",
          ifDisable: false,
          type: "Radio",
        },
      ],
      farenInfo: [
        {
          name: "法人中文姓名:",
          value: "companyLegalPersonZh",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入法人姓名",
        },
        {
          name: "法人英文姓名:",
          value: "companyLegalPersonEn",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "如：张三（英文名为San Zhang）",
        },
        {
          name: "法人出生日期:",
          value: "companyLegalPersonBirthday",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "请选择出生日期",
        },
        {
          name: "法人联系邮箱:",
          value: "companyLegalPersonEmail",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入有效邮箱账号",
        },
        {
          name: "法人出生地:",
          value: "companyLegalPersonBirthplace",
          ifDisable: false,
          type: "select",
          bindVal: "", //绑定的值
          tips: "请选择法人出生地",
        },
        {
          name: "法人身份证/护照号码(个人店铺必填):",
          value: "companyLegalPersonCard",
          ifDisable: false,
          isNeed: 0,
          bindVal: "", //绑定的值
          tips: "请输入身份证/护照号码",
        },
        // {
        //   name: "法人签名:",
        //   value: "companyLegalPersonSign",
        //   ifDisable:false,
        //   isNeed: 0,
        //   bindVal:'',//绑定的值
        //   tips:"请上传法人签名"
        // }
      ],
      //文件上传验证点击提交记得做，看原型
      filesInfo: [
        {
          name: "营业执照扫描件",
          value: "companyBusinessLicense",
          urlName: "",
          type: 1, //
          row: 1,
          suffix: "", //文件后缀名
          fileName: "",
        },
        {
          name: "商业登记证BR",
          value: "companyBusinessRegistrationBr",
          urlName: "",
          type: 1,
          row: 2,
          suffix: "",
          fileName: "",
        },
        {
          name: "公司注册证明书CI",
          value: "companyRegistrationCi",
          urlName: "",
          type: 1,
          row: 2,
          suffix: "",
          fileName: "",
        },
        {
          name: "法团成立表格NNC1",
          value: "companyCorporateFoundingNnc1",
          urlName: "",
          type: 1,
          row: 2,
          suffix: "",
          fileName: "",
        },
        {
          name: "身份证正反面扫描件",
          value: "companyLegalPersonCardFront",
          urlName: "",
          type: 2,
          row: 1,
          suffix: "",
          fileName: "",
        },
        {
          name: "护照扫描件",
          value: "companyLegalPersonCardPassport",
          urlName: "",
          type: 2,
          row: 2,
          suffix: "",
          fileName: "",
        },
        {
          name: "法人驾驶证",
          value: "driverLicense",
          urlName: "",
          type: 2,
          row: 3,
          suffix: "",
          fileName: "",
        },
        {
          name: "工作证明",
          value: "certificateOfEmployment",
          urlName: "",
          type: 3,
          suffix: "",
          fileName: "",
          tips: "jobProve",
          isNeed: 0,
        },
        {
          name: "租房合同",
          value: "leaseAgreement",
          urlName: "",
          type: 3,
          suffix: "",
          fileName: "",
          tips: "rentContract",
          isNeed: 0,
        },
        {
          name: "结婚证",
          value: "marriageLicense",
          urlName: "",
          type: 3,
          suffix: "",
          fileName: "",
          isNeed: 0,
        },
        {
          name: "离婚证",
          value: "divorceCertificate",
          urlName: "",
          type: 3,
          suffix: "",
          fileName: "",
          isNeed: 0,
        },
        {
          name: "房产证",
          value: "houseProprietaryCertificate",
          urlName: "",
          type: 3,
          suffix: "",
          fileName: "",
          isNeed: 0,
        },
        {
          name: "出生证/户口本（户主页+本人页）",
          value: "birthCertificate",
          urlName: "",
          type: 3,
          suffix: "",
          fileName: "",
          isNeed: 0,
        },
        {
          name: "房屋贷款明细",
          value: "otherCertificate",
          urlName: "",
          type: 3,
          suffix: "",
          fileName: "",
          isNeed: 0,
        },
        {
          name: "店铺后台截图",
          value: "shopConsoleScreenshot",
          urlName: "",
          type: 4,
          row: 2,
          suffix: "",
          fileName: "",
        },
        {
          name: "确认函",
          value: "shopConsoleConfirmationLetter",
          urlName: "",
          type: 5,
          row: 1,
          suffix: "",
          fileName: "",
        },
      ],
      currentStep: 0,
      isSuccess: false,
      contentStyleObj: {
        "min-height": "",
      },
      title: "待上传注册资料",
      taxInfo: {},
      companyAdd: {
        companyAddressEnCountry: "", //国家
        companyAddressEnCity: "", //城市
        companyAddressEn: "", //详细地址
        companyRegisteredCityZh: "", //公司注册城市中文
        companyRegisteredCityEn: "", //公司注册城市英文
        legalPersonBirthplaceProvinceZh: "", //法人出生省份中文
        legalPersonBirthplaceProvinceEn: "", //法人出生省份英文
        legalPersonBirthplaceCityZh: "", //法人出生城市中文
        legalPersonBirthplaceCityEn: "", //法人出生城市英文
        companyLegalPersonSign: "", //法人签名
        companyLegalPersonCard: "", //身份证号码
        legalPersonCardPassportNumber: "", //护照号码
      },
      notChange: false,
      remark: "",
      isShopConsoleScreenshot: "1", // 是否有店铺后台截图:
      lenovoSearchList: [], //联想列表
      leftFrom: null,
      dateTime: "",
      servicesId: this.$route.query.servicesId,
      stockGreaterThan25: "1",
      sharesList: [
        {
          shareholderZhName: "",
          shareholderEnName: "",
          position: "",
          stockProportion: "",
          shareholderBirthday: "",
          identityCard: "",
        },
      ],
      tipsModal: false,
    };
  },
  methods: {
    // guanzhu(){
    //   this.$Modal.confirm({
    //     render: (h)=>{
    //       return h('img',{
    //         props: {
    //           src:'@/assets/images/common/gongzhonghao.png',
    //           style:'width:100px'
    //         }
    //       })
    //     }
    //       // title: '扫码关注公众号',
    //       // content: '<img src="@/assets/images/common/gongzhonghao.png" style="width:100px" />'
    //   });
    // },
    // 屏幕高度
    getHeight() {
      this.contentStyleObj["min-height"] = window.screen.height - 220 + "px";
    },
    toBackPeople() {
      let self = this;
      self.currentStep -= 1;
      window.scroll(0, 0);
    },
    changeDate(date, item) {
      item.bindVal = date;
    },
    getLegalpersonCountry() {
      legalpersonCountry().then((res) => {
        if (res.code === 0) {
          this.birthplaceList = res.data;
        }
      });
    },
    toSave(type) {
      if (this.countryCode == "SA") {
        this.$refs.childSA.saveData();
        return;
      }
      if (this.countryCode == "AE") {
        this.$refs.childAE.saveData();
        return;
      }
      if (this.countryCode == "PL") {
        this.$refs.childPL.saveData();
        return;
      }
      if (this.countryCode == "NL") {
        this.$refs.childNL.saveData();
        return;
      }
      if (this.countryCode == "GB") {
        this.$refs.childGB.saveData();
        return;
      }
      if (this.countryCode == "DE") {
        this.$refs.childDE.saveData();
        return;
      }
      if (this.countryCode == "FR") {
        this.$refs.childFR.saveData();
        return;
      }
      if (this.countryCode == "IT") {
        this.$refs.childIT.saveData();
        return;
      }
      if (this.countryCode == "ES") {
        this.$refs.childES.saveData();
        return;
      }
      if (this.countryCode == "CZ") {
        this.$refs.childCZ.saveData();
        return;
      }
      if (this.countryCode == "AT") {
        this.$refs.childAT.saveData();
        return;
      }
      if (this.countryCode == "IOSS") {
        this.$refs.childIOSS.saveData();
        return;
      }
      let self = this;
      let formData = {
        servicesId: this.$route.query.servicesId,
      };
      if (self.countryCode === "GB") {
        formData.isShopConsoleScreenshot = this.isShopConsoleScreenshot;
      }
      // console.log(self.filesInfo)
      this.shopInfo.map((v, i) => {
        formData[v.value] = v.bindVal;
      });
      this.companyInfo.map((v, i) => {
        formData[v.value] = v.bindVal;
      });
      this.farenInfo.map((v, i) => {
        formData[v.value] = v.bindVal;
      });
      self.filesInfo.map((v, i) => {
        formData[v.value] = v.urlName;
      });
      if (this.countryCode == "GB") {
        if (isNaN(Number(formData.shopSalePlan))) {
          this.$Message.error("请填写正确的预计销售额");
          return;
        }
        formData.shopSalePlan = Number(formData.shopSalePlan);
      }
      let data = {};
      Object.assign(data, self.companyAdd, formData);
      if (this.countryCode == "ES") {
        if (this.stockGreaterThan25 == "0") {
          data.companyStockCondition = JSON.stringify(this.sharesList);
        } else {
          data.companyStockCondition = "";
        }
      }
      // console.log(formData)
      // console.log(this.farenInfo)

      getMaterialSave(data)
        .then(
          (res) => {
            this.saveBtnLoading = true;
            if (res.code == 0) {
              this.$Message.success("保存成功");
              window.scroll(0, 0);
            } else {
              // self.$Message.warning(res.message);
            }
          },
          (err) => {
            // self.$Message.warning(err.message);
          }
        )
        .catch((e) => {})
        .finally(() => {
          this.saveBtnLoading = false;
        });
    },
    clickSubmit() {
      this.$Modal.confirm({
        title: "是否确认提交",
        content:
          '<p style="text-align:left">温馨提示：提交后不可修改，不同国家注册税号时效不同，请确认资料的完整性（资料不完整有可能影响时效）；</p>',
        cancelText: "我再想想",
        okText: "已确认，提交",
        onOk: () => {
          setTimeout(() => {
            this.toSubmit();
          }, 100);
        },
      });
    },
    //提交
    toSubmit(type) {
      if (this.countryCode == "SA") {
        this.$refs.childSA.submitData();
        return;
      }
      if (this.countryCode == "AE") {
        this.$refs.childAE.submitData();
        return;
      }
      if (this.countryCode == "PL") {
        this.$refs.childPL.submitData();
        return;
      }
      if (this.countryCode == "NL") {
        this.$refs.childNL.submitData();
        return;
      }
      if (this.countryCode == "GB") {
        this.$refs.childGB.submitData();
        return;
      }
      if (this.countryCode == "DE") {
        this.$refs.childDE.submitData();
        return;
      }
      if (this.countryCode == "FR") {
        this.$refs.childFR.submitData();
        return;
      }
      if (this.countryCode == "IT") {
        this.$refs.childIT.submitData();
        return;
      }
      if (this.countryCode == "ES") {
        this.$refs.childES.submitData();
        return;
      }
      if (this.countryCode == "CZ") {
        this.$refs.childCZ.submitData();
        return;
      }
      if (this.countryCode == "AT") {
        this.$refs.childAT.submitData();
        return;
      }
      if (this.countryCode == "IOSS") {
        this.$refs.childIOSS.submitData();
        return;
      }
      let self = this;
      let formData = {
        servicesId: this.$route.query.servicesId,
      };
      if (self.countryCode === "GB") {
        formData.isShopConsoleScreenshot = this.isShopConsoleScreenshot;
      }
      // console.log(self.filesInfo)
      this.shopInfo.map((v, i) => {
        formData[v.value] = v.bindVal;
      });
      this.companyInfo.map((v, i) => {
        formData[v.value] = v.bindVal;
      });
      this.farenInfo.map((v, i) => {
        formData[v.value] = v.bindVal;
      });
      self.filesInfo.map((v, i) => {
        formData[v.value] = v.urlName;
      });
      let data = {};
      Object.assign(data, self.companyAdd, formData);
      if (this.countryCode == "FR") {
        if (isNaN(Number(formData.companyRegisteredCapital)) || formData.companyRegisteredCapital == "") {
          this.$Message.warning("请填写正确公司注册资本金额");
          return;
        }
      }
      if (this.countryCode == "GB") {
        if (isNaN(Number(formData.shopSalePlan)) || formData.shopSalePlan == "") {
          this.$Message.warning("请填写正确的预计销售额");
          return;
        }
        formData.shopSalePlan = Number(formData.shopSalePlan);
        var IdCardNumberReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
        var PassportNumberReg =
          /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/;
        if (formData.companyLegalPersonCard.trim() !== "") {
          let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
          if (reg.test(formData.companyLegalPersonCard)) {
            this.$Message.warning("请填写正确的法人护照或身份证号码");
            return;
          }
        }
      }
      if (this.countryCode == "DE") {
        if (
          isNaN(Number(formData.shopPredictSale)) ||
          isNaN(Number(formData.shopNextYearSale)) ||
          formData.shopPredictSale == "" ||
          formData.shopNextYearSale == ""
        ) {
          this.$Message.warning("请填写正确的预计销售额");
          return;
        }
      }
      if (this.countryCode == "ES") {
        if (this.stockGreaterThan25 == "0") {
          data.companyStockCondition = JSON.stringify(this.sharesList);
        } else {
          data.companyStockCondition = "";
        }
      }
      // console.log(formData)
      // console.log(this.farenInfo)

      getMaterialSubmit(data)
        .then(
          (res) => {
            this.submitBtnLoading = true;
            if (res.code == 0) {
              this.$router.replace({
                path: "/submitSuccess",
                query: {
                  countryCode: this.countryCode,
                  countryNameZh: this.countryNameZh,
                  productFunctionCode: "5",
                },
              });
            } else {
              // self.$Message.warning(res.message);
            }
          },
          (err) => {
            // self.$Message.warning(err.message);
          }
        )
        .catch((e) => {})
        .finally(() => {
          this.submitBtnLoading = false;
        });
    },
    goHome() {
      let self = this;
      self.$router.push({ name: "首页" });
    },

    beforeUploadHandler() {
      let self = this;
      const check = self.filesInfo[self.currentInput.index].urlName == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1张图片",
        });
      }
      return check;
    },
    successHandler(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传",
        });
        let obj = {
          index: self.currentInput.index,
        };
        self.removeHandler(file, fileList, item);
        return false;
      }
      self.filesInfo[self.currentInput.index].urlName = file.response.data.fileUrl;
      self.filesInfo[self.currentInput.index].suffix = file.response.data.suffix;
      self.filesInfo[self.currentInput.index].fileName = file.response.data.origFileName;
      // console.log(self.filesInfo[self.currentInput.index])
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件",
      });
    },
    removeHandler(obj, file, fileList) {
      let self = this;
      self.filesInfo[self.currentInput.index].urlName = "";
    },
    selectDateIndex(index, type) {
      let self = this;
      self.currentInput.index = index;
      self.currentInput.type = type;
    },
    //获取基础信息
    getDetailInfo() {
      const self = this;
      getRegTaxDetail({ serviceId: this.$route.query.servicesId }).then((res) => {
        if (res.code === 0) {
          this.leftFrom = { ...res.data };
          // this.leftFrom['dateTime'] = res.extra.dateTime
          this.dateTime = res.extra.dateTime;
          let raxInfo = res.data;
          this.formContentFill(self, res.data);
          if (JSON.stringify(raxInfo) != "{}") {
            if (this.countryCode == "ES") {
              if (res.data.companyStockCondition != "") {
                this.stockGreaterThan25 = "0";
                this.sharesList = JSON.parse(res.data.companyStockCondition);
              }
            }
            if(this.leftFrom.countryCode == 'IT' && this.leftFrom.companyType == 3){
               this.leftFrom.companyBusinessLicense1 = this.leftFrom.companyBusinessLicense;
            }
            this.isShopConsoleScreenshot = String(raxInfo.isShopConsoleScreenshot);
          }

          this.companyAdd = {
            companyAddressEnCountry: res.data.companyAddressEnCountry,
            companyAddressEnCity: res.data.companyAddressEnCity,
            companyAddressEn: res.data.companyAddressEn,
            companyRegisteredCityZh: res.data.companyRegisteredCityZh,
            companyRegisteredCityEn: res.data.companyRegisteredCityEn,
            legalPersonBirthplaceProvinceZh: res.data.legalPersonBirthplaceProvinceZh,
            legalPersonBirthplaceProvinceEn: res.data.legalPersonBirthplaceProvinceEn,
            legalPersonBirthplaceCityZh: res.data.legalPersonBirthplaceCityZh,
            legalPersonBirthplaceCityEn: res.data.legalPersonBirthplaceCityEn,
            companyLegalPersonSign: res.data.companyLegalPersonSign,
            companyPostCode: res.data.companyPostCode,
            companyLegalPersonCard: res.data.companyLegalPersonCard,
            legalPersonCardPassportNumber: res.data.legalPersonCardPassportNumber,
          };
          this.remark = raxInfo.remark;
        }
      });
    },
    formContentFill(self, data) {
      let raxInfo = data;
      let keys = Object.getOwnPropertyNames(data);
      if (keys.length === 0) {
        this.companyInfo.map((v, i) => {
          v.bindVal = "";
        });
        this.shopInfo.map((v, i) => {
          v.bindVal = "";
        });
        this.farenInfo.map((v, i) => {
          v.bindVal = "";
        });
        this.filesInfo.map((v, i) => {
          let file = self.getFileType("");
          v.suffix = file;
          v.urlName = "";
        });
      } else {
        this.companyInfo.map((v, i) => {
          keys.map((val, index) => {
            if (v.value === val) {
              v.bindVal = raxInfo[val];
            }
          });
          if (this.status != 0 && this.status != 8) {
            v.ifDisable = true;
          }
        });
        this.shopInfo.map((v, i) => {
          if (this.status != 0 && this.status != 8) {
            v.ifDisable = true;
          }
          keys.map((val, index) => {
            if (v.value === val) {
              v.bindVal = raxInfo[val];
            }
          });
        });
        this.farenInfo.map((v, i) => {
          if (this.status != 0 && this.status != 8) {
            v.ifDisable = true;
          }
          keys.map((val, index) => {
            if (v.value === val) {
              v.bindVal = raxInfo[val];
            }
          });
        });
        this.filesInfo.map((v, i) => {
          keys.map((val, index) => {
            if (v.value === val) {
              let file = self.getFileType(raxInfo[val]);
              v.suffix = file;
              v.urlName = raxInfo[val];
            }
          });
        });
      }
    },
    //获取税号信息
    getTaxInfo() {
      taxInfo({ id: this.$route.query.servicesId }).then((res) => {
        if (res.code == 0) {
          this.taxInfo = res.data;
          if ((this.status == 4 || this.status == 21 || this.status == 22) && JSON.stringify(this.taxInfo) !== "{}") {
            this.pageType = 1;
          } else {
            this.pageType = 2;
          }
        }
      });
    },
    //当国家是德国时重组信息
    getDEinfo() {
      //公司信息重组
      let DECompany = [...this.companyInfo].filter((item, index, arr) => {
        return index < 3;
      });
      let newDecompany = [
        {
          name: "公司邮箱:",
          value: "companyEmail",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入公司邮箱",
        },
        {
          name: "公司电话:",
          value: "companyTel",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入公司联系电话",
        },
        {
          name: "公司成立日期:",
          value: "companyRegisterData",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "请选择成立日期",
        },
      ];
      let companyList = DECompany.concat(newDecompany);
      this.companyInfo = [...companyList];
      //法人信息重组
      let DEfaren = [...this.farenInfo].filter((item, index, arr) => {
        return index < 4;
      });
      let newDefaren = [
        {
          name: "法人身份证地址:",
          value: "companyLegalPersonCardAddress",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入法人身份证地址，请用英文格式填写",
          mark: "注：请使用 拼音 输入身份证地址；",
        },
        {
          name: "法人电话:",
          value: "companyLegalPersonMobile",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入法人联系电话",
        },
        {
          name: "法人出生地邮编:",
          value: "legalPersonPostCode",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入法人身份证地址邮编号码",
        },
      ];
      let farenInfoList = DEfaren.concat(newDefaren);
      this.farenInfo = [...farenInfoList];
      //店铺信息重组
      this.shopInfo = [
        {
          name: "税号生效日期:",
          value: "shopTaxEffectiveData",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "如实填写应缴税日期，税号从此日期生效并申报",
          tipsIcon: true,
          tipsText1: "新账户：填写最近一个月左右的时间为税号生效日；",
          tipsText2:
            "老账户：产生第一笔FBA销售时间/海外仓产生第一笔销售额时间/超过远程销售时间，哪个时间早以哪个时间为准，建议填写月初不填月尾，因为计税是完整月计算的；",
          mark: "可点击(?)查看说明后填写；",
        },
        {
          name: "销售平台名称:",
          value: "shopSalePlatformName",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "亚马逊", index: "亚马逊" },
            { val: "eBay", index: "eBay" },
            { val: "其他", index: "其他" },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "描述下公司的经营内容:",
          value: "companyBusinessModeDescribe",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入英文描述，如服装 clothing",
          tipsIcon: true,
          tipsText1: "请用英文填写店铺销售产品类型，如：Electronic product ，填写1-3种即可。",
          tipsText2: "",
        },
        {
          name: "店铺链接:",
          value: "shopHref",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入亚马逊后台店铺链接",
        },
        {
          name: "店铺名称:",
          value: "shopName",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入亚马逊/其它平台店铺名称",
        },
        {
          name: "今年预计销售额(欧元):",
          value: "shopPredictSale",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "预计销售额需要大于等于50000，小于等于200000",
          type: "number",
        },
        {
          name: "明年预计销售额(欧元):",
          value: "shopNextYearSale",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "预计销售额需要大于等于50000，小于等于200000",
          type: "number",
        },
        {
          name: "邮编号码:",
          value: "shopPostCode",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入店铺后台的邮编号码",
          // type:'number'
        },
        {
          name: "是否有欧盟国EORI号:",
          value: "needEoriNumber",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "否", index: 0 },
            { val: "是", index: 1 },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "是否有其它欧盟税号:",
          value: "shopOtherEuTaxNumber",
          ifDisable: false,
          isNeed: 0,
          bindVal: "", //绑定的值
          tips: "如有则填写税号信息",
          // type:'number'
        },
        {
          name: "德国仓库地址:",
          value: "shopEntrepotAddress",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入(如无，可联系客服)",
        },
        {
          name: "物流承运商公司名称:",
          value: "shopLogisticsCompanyName",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入物流承运商公司名称",
        },
        {
          name: "物流承运商地址:",
          value: "shopLogisticsCompany",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入物流承运商地址",
        },
      ];

      //文件信息重组
      let DEfile = [...this.filesInfo].filter((item, index, arr) => {
        return index < 4;
      });
      let newfile = [
        //  {
        //   name: "营业执照翻译件",
        //   value: "companyBusinessLicenseTranslate",
        //   urlName:'',
        //   type:1,//
        //   row:1,
        //   suffix:'',//文件后缀名
        //   fileName:'',
        //   tips:'BusinessLicenseTranslate'
        // },
        {
          name: "法人身份证正反面扫描件",
          value: "companyLegalPersonCardFront",
          urlName: "",
          type: 2,
          row: 1,
          suffix: "",
          fileName: "",
        },
        // {
        //   name: "身份证正反面翻译件",
        //   value: "companyLegalPersonCardFrontTranslate",
        //   urlName:'',
        //   type:2,
        //   row:1,
        //   suffix:'',
        //   fileName:'',
        //   tips:'IDCardTranslate'
        // },
        {
          name: "法人护照扫描件",
          value: "companyLegalPersonCardPassport",
          urlName: "",
          type: 2,
          row: 2,
          suffix: "",
          fileName: "",
        },
        {
          name: "店铺后台截图",
          value: "shopConsoleScreenshot",
          urlName: "",
          type: 4,
          row: 2,
          suffix: "",
          fileName: "",
        },
        {
          name: "仓储地址截图",
          value: "storageAddressImg",
          urlName: "",
          type: 8,
          row: 2,
          suffix: "",
          fileName: "",
        },
      ];
      let fileList = newfile.concat(DEfile);
      this.filesInfo = [...fileList];
      // console.log('fileList', fileList)
    },
    //当国家是意大利时信息重组
    getITinfo() {
      //公司信息重组
      let ITCompany = [...this.companyInfo].filter((item, index, arr) => {
        return index < 2;
      });
      let newITCompany = [
        {
          name: "公司统一社会信用代码:",
          value: "companyCreditCode",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入营业执照的统一信用代码",
        },
      ];
      let companyList = ITCompany.concat(newITCompany);
      this.companyInfo = [...companyList];
      //法人信息
      this.farenInfo = [
        {
          name: "法人英文姓名:",
          value: "companyLegalPersonEn",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "如：张三（英文名为San Zhang）",
        },
        {
          name: "法人身份证/护照号码:",
          value: "companyLegalPersonCard",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入身份证/护照号码",
        },
        {
          name: "法人身份证英文地址:",
          value: "companyLegalPersonCardAddress",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入法人身份证英文地址",
        },
        {
          name: "法人出生日期:",
          value: "companyLegalPersonBirthday",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "请选择出生日期",
        },
        {
          name: "法人出生地:",
          value: "companyLegalPersonBirthplace",
          ifDisable: false,
          type: "select",
          bindVal: "", //绑定的值
          tips: "请选择法人出生地",
        },
      ];
      //店铺信息
      this.shopInfo = [
        {
          name: "店铺链接:",
          value: "shopHref",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入亚马逊后台店铺链接",
        },
        {
          name: "是否有欧盟国EORI号:",
          value: "needEoriNumber",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "否", index: 0 },
            { val: "是", index: 1 },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "税号生效日期:",
          value: "shopTaxEffectiveData",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "请选择税号生效日期",
          tipsIcon: true,
          tipsText1: "请如实填写应交税日期，税号从此日期开始生效（一个星期内）",
          tipsText2: "",
        },
        {
          name: "是否使用意大利仓库:",
          value: "useEntrepot",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "否", index: 2 },
            { val: "是", index: 1 },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "申报周期:",
          value: "declareRule",
          ifDisable: false,
          type: "select",
          tips: "请选择申报周期",
          bindVal: "", //绑定的值
        },
        {
          name: "是否开通泛欧:",
          value: "dredgeEuronext",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "否", index: 1 },
            { val: "是", index: 2 },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "描述下公司的经营内容:",
          value: "companyBusinessModeDescribe",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入英文描述，如服装 clothing",
          tipsIcon: true,
          tipsText1: "请用英文填写店铺销售产品类型，如：Electronic product ，填写1-3种即可。",
          tipsText2: "",
        },
        {
          name: "货物进口及配送流程:",
          value: "shippingProcess",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "如：货物从哪国运送到哪国？是否经过其他欧盟国家？",
        },
        {
          name: "是否有其它欧盟国家税号（选填）:",
          value: "shopOtherEuTaxNumber",
          ifDisable: false,
          isNeed: 0,
          bindVal: "", //绑定的值
          tips: "如有，请如实填写",
        },
      ];
      //文件信息重组
      let DEfile = [...this.filesInfo].filter((item, index, arr) => {
        return index < 6;
      });
      let newfile = [
        {
          name: "公司信用报告",
          value: "companyCreditReport",
          urlName: "",
          type: 5, //
          row: 1,
          suffix: "", //文件后缀名
          fileName: "",
        },
        //  {
        //   name: "注册授权书",
        //   value: "registrationAuthorization",
        //   urlName:'',
        //   type:6,
        //   row:1,
        //   suffix:'',
        //   fileName:''
        // },
      ];
      let fileList = newfile.concat(DEfile);
      this.filesInfo = [...fileList];
    },
    //当国家是西班牙时信息重组
    getESinfo() {
      //公司信息重组
      this.companyInfo = [
        {
          name: "公司中文名称:",
          value: "companyNameZh", //此字段根据后台接口修改
          isNeed: 1, //0选填，其他都必填，点击提交做验证
          bindVal: this.$route.query.companyNameZh, //绑定的值
          tips: "请输入公司全称",
          type: "companyName",
        },
        {
          name: "公司英文名称:",
          value: "companyNameEn",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请直接复制店铺后台英文公司名",
          type: "english",
          tipsIcon: true, //是否显示提示
          tipsText1: "请直接复制店铺后台的英文公司名：",
          tipsText2: "备注：英国注册资料公司英文名称中间如有标点符号，请用空格代替；",
        },
        {
          name: "公司统一社会信用代码:",
          value: "companyCreditCode",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入营业执照的统一信用代码",
        },
      ];
      //法人信息
      this.farenInfo = [
        {
          name: "法人英文姓名:",
          value: "companyLegalPersonEn",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "如：张三（英文名为San Zhang）",
        },
        {
          name: "法人身份证/护照号码:",
          value: "companyLegalPersonCard",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入身份证/护照号码",
        },
        {
          name: "法人身份证英文地址:",
          value: "companyLegalPersonCardAddress",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入法人身份证英文地址",
        },
      ];
      //店铺信息
      this.shopInfo = [
        {
          name: "店铺链接:",
          value: "shopHref",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入亚马逊后台店铺链接",
        },
      ];
      //文件信息重组
      let ESfile = [...this.filesInfo].filter((item, index, arr) => {
        return index < 6;
      });
      let newfile = [
        {
          name: "公司信用报告",
          value: "companyCreditReport",
          urlName: "",
          type: 5, //
          row: 1,
          suffix: "", //文件后缀名
          fileName: "",
        },
        {
          name: "亚马逊证明文件",
          value: "amazonProveFile",
          urlName: "",
          type: 7,
          row: 1,
          suffix: "",
          fileName: "",
        },
        {
          name: "其它国家税号证书",
          value: "vatTaxEuFile",
          urlName: "",
          type: 8,
          row: 1,
          suffix: "",
          fileName: "",
        },
      ];
      let fileList = newfile.concat(ESfile);
      this.filesInfo = [...fileList];
    },
    //当国家是法国时信息重组
    getFRinfo() {
      //公司信息重组
      let FRCompany = [...this.companyInfo].filter((item, index, arr) => {
        return index < 2;
      });
      let newDecompany = [
        {
          name: "公司联系电话:",
          value: "companyTel",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入公司联系电话",
        },
        {
          name: "公司统一社会信用代码:",
          value: "companyCreditCode",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入营业执照的统一信用代码",
        },
        {
          name: "公司注册资本:",
          value: "companyRegisteredCapital",
          ifDisable: false,
          type: "number",
          unit: "（万元）",
          bindVal: "", //绑定的值
          tips: "请输入公司注册资本(万元)",
        },
      ];
      let companyList = FRCompany.concat(newDecompany);
      this.companyInfo = [...companyList];
      //法人信息
      this.farenInfo = [
        {
          name: "法人英文姓名:",
          value: "companyLegalPersonEn",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "如：张三（英文名为San Zhang）",
        },
        {
          name: "法人出生日期:",
          value: "companyLegalPersonBirthday",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "请选择出生日期",
        },
        {
          name: "邮编号码:",
          value: "legalPersonPostCode",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入法人出生地邮政编号",
        },
        {
          name: "身份证/护照号码：",
          ifDisable: false,
          type: "doubleInput",
        },
        {
          name: "法人性别:",
          value: "legalPersonSex",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "男", index: 1 },
            { val: "女", index: 2 },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "法人身份证英文地址:",
          value: "companyLegalPersonCardAddress",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入法人身份证英文地址",
        },
      ];
      //店铺信息
      this.shopInfo = [
        {
          name: "店铺链接:",
          value: "shopHref",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入亚马逊后台店铺链接",
        },
        {
          name: "是否有欧盟国EORI号:",
          value: "needEoriNumber",
          ifDisable: false,
          type: "radio",
          valList: [
            { val: "否", index: 0 },
            { val: "是", index: 1 },
          ],
          bindVal: "", //绑定的值
        },
        {
          name: "税号生效日期:",
          value: "shopTaxEffectiveData",
          ifDisable: false,
          type: "date",
          bindVal: "", //绑定的值
          tips: "请选择税号生效日期",
          tipsIcon: true,
          tipsText1: "1. 建议写在申请注册后一个月。",
          tipsText2:
            "2. 属于老账户，其中产生第一笔FBA销售时间/海外仓产生第一笔销售额时间/ 超过远程销售时间。选择最早的时间填写",
        },
        {
          name: "描述下公司的经营内容:",
          value: "companyBusinessModeDescribe",
          ifDisable: false,
          bindVal: "", //绑定的值
          tips: "请输入英文描述，如服装 clothing",
          tipsIcon: true,
          tipsText1: "请用英文填写店铺销售产品类型，如：Electronic product ，填写1-3种即可。",
          tipsText2: "",
        },
        {
          name: "未来一年预计销售额（欧元）:",
          value: "shopSalePlan",
          ifDisable: false,
          type: "number",
          bindVal: "", //绑定的值
          tips: "请输入数字：（申请低税率<15W英镑，标准税率>=15W英镑）",
        },
        {
          name: "是否有其它欧盟国家税号（选填）:",
          value: "shopOtherEuTaxNumber",
          ifDisable: false,
          isNeed: 0,
          bindVal: "", //绑定的值
          tips: "如有，请如实填写",
        },
      ];
      //文件信息重组
      let ESfile = [...this.filesInfo].filter((item, index, arr) => {
        return index < 6;
      });
      let newfile = [
        {
          name: "店铺后台截图",
          value: "shopConsoleScreenshot",
          urlName: "",
          type: 4,
          row: 2,
          suffix: "",
          fileName: "",
        },
      ];
      let fileList = newfile.concat(ESfile);
      this.filesInfo = [...fileList];
    },
    getFileType(filePath) {
      let startIndex = filePath.lastIndexOf(".");
      if (startIndex != -1) return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
      else return "";
    },
    // 公司资料信息自动填充
    automaticInformationFilling() {
      getAllServiceCompanies()
        .then((res) => {
          if (res.code === 0) {
            this.lenovoSearchList = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectCompany: Throttle(function (obj) {
      let self = this;
      getCompanyInformation({
        companyName: obj,
      })
        .then((res) => {
          if (res.code === 0) {
            self.formContentFill(self, res.data);
            this.companyAdd = {
              companyAddressEnCountry: res.data.companyAddressEnCountry,
              companyAddressEnCity: res.data.companyAddressEnCity,
              companyAddressEn: res.data.companyAddressEn,
            };
            if (JSON.stringify(res.data) === "{}") {
              self.companyInfo[0].bindVal = obj;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500),
    // 生成二维码
    qrcode() {
      let servicesId = this.$route.query.servicesId;
      getCompanyLegalPersonSignUrl({
        servicesId: servicesId,
      })
        .then((res) => {
          if (res.code === 0) {
            let qrcode = new QRCode("qrcode", {
              width: 180,
              height: 180,
              text: res.data, // 二维码地址
              colorDark: "#000",
              colorLight: "#fff",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 我已签名
    hasSignature: Throttle(function () {
      getCompanyLegalPersonSign({
        servicesId: this.$route.query.servicesId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success("刷新成功");
            this.companyAdd.companyLegalPersonSign = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000),
    submitSuccessSa(timestamp) {
      this.$router.replace({
        path: "/submitSuccess",
        query: {
          countryCode: this.countryCode,
          countryNameZh: this.countryNameZh,
          timestamp: timestamp,
          productFunctionCode: "5",
          hyFlag: this.hyFlag,
        },
      });
    },
    backTop() {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    scrollToTop() {
      const that = this;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 60) {
        that.btnFlag = true;
      } else {
        that.btnFlag = false;
      }
    },
  },
  created() {
    let self = this;
    this.getHeight();
    if (this.countryCode == "DE") {
      this.getDEinfo();
    } else if (this.countryCode == "IT") {
      this.getITinfo();
    } else if (this.countryCode == "ES") {
      this.getESinfo();
    } else if (this.countryCode == "FR") {
      this.getFRinfo();
    }
    this.getDetailInfo();
    if (this.status == 4 || this.status == 22) {
      this.getTaxInfo();
    }
    if (this.status == 21 && !this.isTaxDetails) {
      this.getTaxInfo();
    }
    if (this.status == 7) {
      this.pageType = 3;
    }
    if (this.status == 8) this.tipsModal = true;
  },
  mounted() {
    this.title =
      this.status == 0
        ? "待上传资料"
        : this.status == 1
        ? "待审核资料"
        : this.status == 3
        ? "注册中"
        : this.status == 4
        ? "注册完成"
        : this.status == 5
        ? "待授权海牙认证"
        : this.status == 6
        ? "海牙认证中"
        : this.status == 7
        ? "待授权注册税号"
        : this.status == 8
        ? "资料驳回"
        : "未知状态";
    if (this.status != 0 && this.status != 8 && this.status != undefined) this.notChange = true;
    this.getLegalpersonCountry();
    this.automaticInformationFilling();
    window.addEventListener("scroll", this.scrollToTop);
  },
  computed: {},
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
  watch: {
    companyInfo: {
      handler(val, old) {
        let reg = /^(?!_)([A-Za-z ]+)$/;
        // this.verifyEng = reg.test(val[1].bindVal)
        // return this.verifyEng
        val.map((item, index) => {
          if (item.value == "companyNameEn" && this.countryCode == "GB") {
            if (item.bindVal != "") {
              // console.log(item.value)
              this.verifyEng = reg.test(item.bindVal);
              if (!this.verifyEng) {
              }
            }
          }
        });
      },
      deep: true,
    },
    shopInfo: {
      handler(val, old) {
        val.map((item, index) => {
          if (item.value == "shopSalePlan" && this.countryCode == "GB") {
            if (item.bindVal - 0 >= 150000) {
              val[4].bindVal = 1;
            } else {
              val[4].bindVal = 0;
            }
          }
        });
      },
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
.clearfix::after {
  content: " ";
  line-height: 0;
  display: block;
  clear: both;
}
.fr {
  float: right;
}
.fl {
  float: left;
}
.container {
  min-height: calc(100vh - 60px);
  padding-bottom: 56px;
  box-sizing: border-box;
  position: relative;

  min-width: 1024px;
  margin-bottom: 0px;
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
        margin-left: 10px;
      }
    }
    .statusIndfContent {
      overflow: hidden;
      .statusContent {
        margin: 20px 0px;
      }
      .rejected {
        padding: 10px 40px;
        background: #fff1dd;
        .tips-top-title {
          font-size: 14px;
          font-family: "PingFangSC-Regular,PingFang SC";
          color: #333333ff;
          img {
            float: left;
            margin-right: 6px;
          }
          span {
            color: #fa5555ff;
          }
        }
        .bottom-tips {
          margin-left: 24px;
          margin-top: 4px;
          p {
            line-height: 26px;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
          }
          .last-tip {
            font-weight: 400;
            margin-top: 4px;
          }
        }
      }
    }
    .tabTitle {
      border-bottom: 1px solid #e9e9e9ff;
      // margin-top: -18px;
      span {
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        font-family: PingFangSC;
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
  .contentContainer {
    margin: 24px;
  }
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
      }
      /deep/ .ivu-col-span-8 {
        margin-top: 10px;
      }
    }
  }

  .infoTip {
    background-color: #ffff;
    padding: 20px 32px 20px;
    // margin-bottom: 15px;
    font-size: 22px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    margin-left: -24px;
    margin-top: -24px;
    margin-bottom: 24px;
    span.smallTitle {
      font-size: 17px;
      font-family: PingFangSC;
      color: rgba(102, 102, 102, 1);
      line-height: 20px;
      margin-left: 10px;
    }
    span {
      margin-left: 15px;
      font-size: 14px;
      color: #313233;
      font-weight: 400;
    }
  }
  // .infoTip::before{
  //   content: '';
  //   display: inline-block;
  //   width:2px;
  //   height:14px;
  //   background:rgba(22,173,233,1);
  //   margin-right: 8px;
  // }
  .stepH {
    background-color: #fff;
    padding: 0 24px;

    .redTip::before {
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 14px;
      color: #ed4014;
    }
    .tips-icon {
      width: 17px;
      height: 17px;
      border: 1px solid rgba(237, 62, 62, 1);
      border-radius: 50%;
      display: inline-block;
      line-height: 17px;
      text-align: center;
      color: #ed3e3e;
      cursor: pointer;
    }
  }
  .fileContainer {
    .fl {
      float: none;
    }
    .file-box {
      padding-left: 50px;
      .file-type-name {
        text-align: left !important;
      }
      .file-box-inner {
        display: flex;
        .file-wrapper {
          margin-right: 0px;
          .imgBox {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 1px dashed #dcdee2;
            position: relative;
            text-align: center;
            z-index: 11;
            background: #fff;
            .deletBtn {
              left: 50%;
              transform: translateX(-50%);
              width: 0px;
              padding: 0px;
              border: none;
              img {
                position: absolute;
                width: 26px;
                height: 26px;
                top: -70px;
                right: -88px;
              }
            }
          }
          .file-item {
            width: 200px;
            height: 124px;
            background: rgba(244, 245, 246, 1);
            border-radius: 2px;
            position: relative;
            margin-right: 10px;
            .ivu-upload {
              width: 100%;
              height: 100%;
              .ivu-upload-drag {
                height: 100%;
              }
              .inner {
                width: 100%;
                height: 100%;
                background: #f4f5f6;
                margin: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                .main-text {
                  display: none;
                }
                img {
                  width: 50px;
                  // margin-bottom: 14px;
                }
              }
            }
            .file-wrapper-title {
              position: absolute;
              bottom: 0px;
              width: 100%;
              font-size: 14px;
              font-family: PingFangSC;
              color: rgba(153, 153, 153, 1);
              line-height: 32px;
              z-index: 1;
            }
          }
          .explame-out {
            margin-top: 10px;
            display: block;
            text-align: center;
            .uplad-symbol {
              width: 16px;
              height: 16px;
            }
          }
          .example-btn {
            margin-top: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 16px;
            }
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    /deep/ .otherFile-box-inner {
      display: flex;
      flex-wrap: wrap;
      .stepH {
        padding: 0px;
      }
      .file-name {
        text-align: left;
      }
      .other-file-box {
        .file-item {
          width: 200px;
          height: 124px;
          background: rgba(244, 245, 246, 1);
          border-radius: 2px;
          position: relative;
          margin-right: 10px;
          .file-name {
            text-align: left;
          }
          .imgBox {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 1px dashed #dcdee2;
            position: relative;
            text-align: center;
            z-index: 11;
            background: #fff;
            img {
              width: 100%;
              height: 100%;
            }
            .deletBtn {
              left: 50%;
              transform: translateX(-50%);
              width: 0px;
              padding: 0px;
              border: none;
              position: absolute;
              img {
                position: absolute;
                width: 26px;
                height: 26px;
                top: 5px;
                right: -92px;
                display: none;
              }
            }
            .uploadItem {
              width: 100%;
              height: 100%;
              margin-top: -14px;
            }
            .show-pdf {
              display: inline-block;
              color: #313233;
              font-size: 16px;
              margin-top: 26px;
            }
          }
          .upload-box {
            width: 100%;
            height: 100%;
            padding: 0;
            .ivu-upload-drag {
              height: 100%;
              width: 100%;
              background: #f4f5f6;
              border: none;
            }
            .inner {
              width: 100%;
              height: 100%;
              background: #f4f5f6;
              margin: auto;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              justify-content: center;
              .main-text {
                display: none;
              }
              .uplad-symbol {
                width: 50px;
                height: 50px;
                margin-bottom: 14px;
              }
            }
          }
          .file-wrapper-title {
            position: absolute;
            bottom: 0px;
            width: 100%;
            font-size: 14px;
            font-family: PingFangSC;
            color: rgba(153, 153, 153, 1);
            line-height: 14px;
            z-index: 1;
            left: 0px;
            height: 32px;
            text-align: center;
          }
          .imgBox:hover img {
            display: block;
          }
        }
        .tips-box {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          text-align: center;
          margin-bottom: 10px;
          img {
            width: 16px;
          }
        }
        .other-file-url-box {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
          position: relative;
          text-align: center;
          a {
            font-size: 16px;
          }
          .close-img {
            position: absolute;
            width: 26px;
            height: 26px;
            top: 5px;
            right: 5px;
            z-index: 11;
          }
        }
        .other-file-url-box:hover a {
          color: #16ade9;
        }
        .other-file-url-box:hover .close-img {
          display: block;
        }
      }
    }
    .expand {
      text-align: left !important;
    }
  }
  .other-file-box {
    .file-name {
      display: inline-block;
      vertical-align: super;
      min-width: 210px;
      text-align: right;
      color: #666;
    }
    .upload-box {
      display: inline-block;
      width: 50%;
      text-align: left;
      padding: 10px 0;
      .inner {
        text-align: left;
        font-size: 12px;
        padding-left: 12px;
        img {
          width: 14px;
        }
        span {
          color: #16ade9;
        }
      }
    }
    /deep/ .ivu-upload-drag {
      padding: 6px 0;
      border: 1px solid #e6e6e6;
      font-size: 12px;
    }
    .other-file-url-box {
      display: inline-block;
      width: 50%;
      text-align: left;
      padding: 6px 0 6px 12px;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      position: relative;
      img {
        width: 12px;
      }
      a {
        color: #333;
      }
      .close-img {
        width: 9px;
        display: none;
        position: absolute;
        right: 15px;
        top: 10px;
        cursor: pointer;
      }
    }
    .other-file-url-box:hover a {
      color: #16ade9;
    }
    .other-file-url-box:hover .close-img {
      display: block;
    }
  }
  & .step-wrapper {
    box-sizing: border-box;
    width: 80%;
    position: absolute;
    left: 50%;
    transform: translate(-40%, 0);
    & /deep/ .ivu-steps-item {
      // text-align: center;
      line-height: 44px;
    }
    & /deep/ .ivu-steps-horizontal .ivu-steps-item .ivu-steps-head {
      padding-left: 18px;
    }
    & /deep/ .ivu-steps-content {
      color: #9a9ca1;
      padding-left: 0px;
      font-size: 14px;
    }
    & /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-content,
    & /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-content {
      color: #626466;
    }
    & /deep/ .ivu-steps-head-inner {
      width: 44px;
      height: 44px;
      & span {
        line-height: 44px;
      }
    }
    & /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner,
    & /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
      background: #16ade9;
      border-color: #16ade9;
    }
    & /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span,
    & /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner > .ivu-steps-icon {
      color: #fff;
    }
    & /deep/ .ivu-steps-horizontal .ivu-steps-title:after {
      background: #dedfe0;
      height: 2px;
    }
    & /deep/ .ivu-steps-horizontal .ivu-steps-status-finish .ivu-steps-title:after {
      background: #16ade9;
    }
  }
  & .line {
    border: 1px solid #f5f5f5;
    margin-top: 120px;
    margin-bottom: 50px;
  }

  & .write-info {
    position: relative;
    & .wrapper {
      margin: 0 auto;
      width: 100%;
      // padding-bottom: 20px;
      background-color: #fff;

      & .title {
        color: #313233;
        font-size: 14px;
        margin-bottom: 28px;
        font-weight: 700;
        color: #333;
        height: 40px;
        background: rgba(22, 173, 233, 0.2);
        line-height: 40px;
        padding-left: 20px;
      }
      .file-title {
        text-align: left;
        margin-left: 0;
        height: 40px;
        background: rgba(22, 173, 233, 0.2);
        line-height: 40px;
        padding-left: 20px;
      }
      .inputH {
        .tips-box {
          vertical-align: super;
          color: #16ade9;
        }
      }
      /deep/ .inputHFlex {
        display: flex;
        flex-wrap: wrap;
        .form-item {
          width: 50%;
        }
      }
      /deep/ .registerClass {
        .form-item {
          input,
          .ivu-date-picker,
          .ivu-select {
            width: 340px;
          }
          .label {
            width: 147px;
            white-space: normal;
            padding-bottom: 0px;
            @media (min-width: 1920px) {
              width: 300px !important;
            }
          }
          .companyAddress {
            width: 342px;
            margin-left: 3px;
          }
          .ivu-input-wrapper {
            // width: 340px;
            textarea.ivu-input {
              margin-left: 148px;
              width: 350px;
            }
          }
          .companyEn {
            textarea.ivu-input {
              @media (min-width: 1920px) {
                margin-left: 300px !important;
              }
            }
          }
          .beizhu {
            margin-left: 143px;
            margin-top: 10px;
            font-size: 14px;
            color: #ed3e3e;
          }
          & > div {
            display: flex;
            align-items: center;
          }
          .doubleInput {
            display: block;
          }
        }
        .form-item:nth-child(2n) {
          // .label {
          //   width: 180px;
          // }
          .ivu-input-wrapper {
            textarea.ivu-input {
              // margin-left: 180px;
            }
          }
          .bank-info {
            textarea.ivu-input {
              margin-left: 0px;
            }
          }
        }
      }
      // /deep/ .shopClass {
      //   .form-item {
      //     .label {
      //       width: 195px;
      //       white-space: normal;
      //     }
      //   }
      //   .form-item:nth-child(2n) {
      //     .label {
      //       width: 210px;
      //     }
      //   }
      // }
      & .form-item {
        padding-bottom: 20px;
        position: relative;
        & .label {
          color: #666666;
          font-size: 14px;
          font-weight: 500;
          line-height: 18px;
          display: inline-block;
          // min-width: 248px;
          padding-bottom: 10px;
          white-space: nowrap;
          text-align: right;
          padding-right: 24px;
          width: 190px;
        }
        & .file {
          width: 172px;
        }
        & input {
          width: 400px;
          font-size: 14px;
          border: 1px solid #dadada;
          text-indent: 8px;
          height: 34px;
        }
        & input::-webkit-input-placeholder {
          color: #c6c8cc;
        }

        & .ivu-select {
          height: 38px;
          width: 400px;
          height: 34px;
          text-align: left;
          & /deep/ .ivu-select-selection {
            height: 38px;
            border-radius: 0px;
            border-color: #dadada;
            & .ivu-select-placeholder,
            & .ivu-select-selected-value {
              height: 38px;
              line-height: 38px;
              font-size: 14px;
            }
            & .ivu-tag {
              height: 30px;
              line-height: 30px;
            }
          }
        }

        & .ivu-radio-group {
          line-height: 20px;
          text-align: left;
          width: 402px;
        }

        & .ivu-date-picker {
          height: 34px;
          width: 400px;
          & /deep/ .ivu-date-picker-rel {
            // height: 34px;
            & .ivu-input-wrapper {
              // height: 34px;
              & input {
                height: 34px;
                line-height: 34px;
                font-size: 14px;
                border-radius: 0px;
                border-color: #dadada;
              }
            }
          }
        }
      }

      & .expand {
        margin: 20px 0;
        font-size: 16px;
        font-family: "Noto Sans S Chinese";
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        max-width: 350px;
        text-align: right;
        color: #666666;
        font-weight: bold;
      }
      & .file-box {
        margin-bottom: 26px;
        .file-type-name {
          font-size: 14px;
          color: #666;
          min-width: 248px;
          text-align: right;
          min-height: 1px;
          margin-bottom: 10px;
        }
      }
      & .subTitle {
        font-size: 14px;
        font-family: "Noto Sans S Chinese";
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 18px;
        margin-bottom: 20px;
      }
      & .file-wrapper {
        margin-right: 10px;
        .out-box {
          display: inline-block;
        }
        .explame-out {
          display: inline-block;
          margin-top: 88px;
          margin-left: 8px;
          a {
            color: #16ade9;
          }
        }
        .explame {
          color: #16ade9;
          margin-left: 8px;
          cursor: pointer;
          font-size: 12px;
          vertical-align: bottom;
        }

        & .file-wrapper-title {
          text-align: center;
          width: 100%;
          color: #333;
          font-size: 12px;
          display: block;
          margin-top: 10px;
          height: 32px;
        }
        & img {
          width: 100%;
          height: auto;
        }
        & .ivu-upload {
          width: 104px;
          & /deep/ .ivu-upload-drag {
            border: none;
            height: 100%;
            background: rgba(244, 245, 246, 1);
            &:hover {
              border: none;
            }
            & .inner {
              margin-top: 26px;
              & .uplad-symbol {
                width: 24px;
                height: auto;
              }
              & .main-text {
                color: #16ade9;
                font-size: 12px;
              }
            }
          }

          & /deep/ .ivu-upload-list {
            text-align: left;
            & .ivu-upload-list-file {
              background: #f5f5f5;
              & span {
                color: #9a9ca1;
                font-size: 12px;
              }
              & .ivu-upload-list-remove {
                opacity: 1;
                color: #444;
              }
            }
            // & .ivu-upload-list-file:hover {
            //   background: #f5f5f5;
            // }

            & .ivu-progress-success .ivu-progress-bg {
              background: #16ade9;
            }
          }
        }
        .imgBox {
          width: 104px;
          height: 104px;
          overflow: hidden;
          border: 1px dashed #dcdee2;
          position: relative;
          text-align: center;
          .deletBtn {
            position: absolute;
            bottom: 10px;
            left: 22px;
            display: none;
          }
          .pdf-name {
            margin-top: 60px;
          }
          .show-pdf {
            display: inline-block;
            color: #313233;
            font-size: 16px;
            margin-top: 26px;
          }
        }
        &:hover .deletBtn {
          display: block;
        }
        .showImg {
          width: 200px;
          height: 124px;
          border: 1px dashed #dcdee2;
          overflow: hidden;
          text-align: center;
          .show-pdf {
            display: inline-block;
            color: #313233;
            font-size: 16px;
            margin-top: 40px;
          }
          img {
            width: 100%;
            height: auto;
          }
        }
        .example-btn {
          margin-top: 88px;
          margin-left: 10px;
          color: #16ade9;
          font-size: 12px;
          cursor: pointer;
        }
      }

      & .line {
        margin-top: 30px;
        margin-bottom: 30px;
      }
    }
    .newBt {
      text-align: center;
      margin: 20px 10px;
      // position: fixed;
      // bottom: 0px;
      // width: 100%;
      // left: 0px;
      // background: #ffffff;
      // padding: 20px;
      // box-shadow: 0px -1px 4px 0px rgba(0,0,0,0.04);
      // z-index: 11;
      & .btn {
        // text-align: center;
        & .next,
        & .prev {
          display: inline-block;
          width: 98px;
          height: 32px;
          background: #16ade9;
          border: 1px solid #16ade9;
          color: #313233;
          font-size: 14px;
          line-height: 33px;
          text-align: center;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        & .prev {
          background: #fff;
          border: 1px solid #16ade9;
          color: #16ade9;
          margin-right: 20px;
        }
        & .next {
          color: #ffffff;
          margin-right: 16px;
        }
      }
    }
  }

  & .success {
    text-align: center;
    min-height: 600px;
    background: #ffffff;
    & > img {
      margin-top: 50px;
      width: 76px;
      height: 76px;
      margin-bottom: 24px;
    }
    & .success-tips {
      font-size: 20px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      margin-bottom: 24px;
    }
    & .btn {
      margin-top: 40px;

      & span {
        display: inline-block;
        width: 140px;
        height: 36px;
        border: 1px solid #16ade9;
        line-height: 36px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        color: #16ade9;
        margin-bottom: 32px;
      }
    }
    & .followContent {
      width: 730px;
      height: 240px;
      background: rgba(22, 173, 233, 0.1);
      margin: 0px auto;
      padding: 24px;
      .title {
        font-size: 16px;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        margin-bottom: 17px;
      }
      img {
        width: 144px;
      }
    }
  }
}
/deep/ .ivu-form-item-error-tip {
  // left: 130px !important;
}
.legalPersonSignature {
  padding: 0px 150px 50px;
  .titleSign {
    color: #626466;
    font-size: 14px;
    padding-bottom: 10px;
    background-color: rgba(24, 144, 255, 0.19);
  }
  .signature {
    background: #f2f2f2;
    width: 360px;
    height: 180px;
    display: inline-block;
    margin-left: 50px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: inline-block;
    }
    img.refresh {
      width: 30px;
      height: 30px;
      margin: 10px;
      position: absolute;
      right: 0px;
      cursor: pointer;
    }
    button {
      position: absolute;
      top: 0px;
      left: 42px;
      right: 0px;
      bottom: 0px;
      margin: auto;
    }
  }
}
#qrcode {
  display: inline-block;
  position: relative;
  img {
    width: 132px;
    height: 132px;
    background-color: #fff;
    padding: 6px;
  }
  p {
    position: absolute;
    bottom: -24px;
    width: 200px;
    font-size: 14px;
    color: #626466;
  }
}
.meStr {
  line-height: 27px;
  padding: 0 30px;
}
.iconHelp {
  font-size: 20px;
  color: #ffcd1e;
  cursor: pointer;
}
.btBottom {
  width: 440px;
  display: inline-block;
  text-align: left;
}
.row-cel {
  margin-right: 10px;
}
&/deep/ .ivu-select-dropdown-list {
  max-height: 300px;
}
/deep/ .ivu-radio-checked .ivu-radio-inner {
  background-color: #fff !important;
}
&/deep/ .ivu-radio-inner:after {
  width: 8px;
  height: 8px;
  left: 3px;
  top: 3px;
  background-color: #2d8cf0 !important;
}
&/deep/ .ivu-upload-drag:hover {
  border-color: #16ade9;
}
/deep/ .ivu-row {
  font-size: 14px;
}
/deep/ .ivu-tooltip-popper {
  .ivu-tooltip-arrow {
    // border-right-color: #FEFFE8;
  }
}
/deep/ .ivu-tooltip-inner {
  max-width: 350px;
  // color: #333333;
  // background-color: #FEFFE8;
  // border: 1px solid rgba(251,183,60,1);
  p {
    white-space: normal;
  }
}
/deep/ textarea.ivu-input {
  margin-left: 39px;
}
input:disabled {
  background-color: #f5f5f5;
  color: #626466 !important;
}
/deep/ .bank-info textarea.ivu-input {
  margin-left: 0;
}
.flex-align {
  display: flex;
  align-items: center;
}
.up {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: #1890ff;
  position: fixed;
  right: 0px;
  bottom: 131px;
  width: 42px;
  height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 7px;
  /deep/ .ivu-tooltip-popper {
    top: 12px !important;
    left: -93px !important;
  }
  /deep/ .ivu-tooltip-rel {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  span {
    font-size: 14px;
    color: #ffffff;
  }
  img {
    width: 20px;
    height: 20px;
    margin-bottom: 3px;
  }
}
/deep/ .gudong .ivu-input {
  width: 100% !important;
}
.red {
  color: red;
}
.content-title {
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}
.content-content {
  margin-top: 8px;
  a {
    color: #fff;
    word-break: break-all;
  }
}
.tipsModal-title {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}
.tipsModal-contnet {
  font-size: 18px;
  .tip-title {
    color: #d9001b;
    margin-bottom: 18px;
  }
}
</style>
