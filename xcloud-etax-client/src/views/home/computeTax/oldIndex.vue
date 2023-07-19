<template>
  <!-- 除英国的计算税金 -->
  <div
    class="modalCount"
    :class="[isLogin == true && nowPath.indexOf('aboutComputed') == -1 ? 'hasLogin' : 'notLogin']"
  >
    <div class="headContent" v-if="isLogin == true && nowPath.indexOf('aboutComputed') == -1">
      <div class="bottom">
        <p class="" v-if="isSelectCountry">待提交申报资料</p>
        <p class="" v-else>计算税金</p>
        <div v-if="isSelectCountry" class="compangInfo">
          <div class="flex">
            <p>
              公司中文名称：
              <span class="right">{{ taxNumInfo.companyNameZh }}</span>
            </p>
            <p style="margin-left: 50px">
              公司英文名称：
              <span class="right">{{ taxNumInfo.companyNameEn }}</span>
            </p>
          </div>
          <div class="flex">
            <p>
              {{ addFrom.countryCode == "IOSS" ? "IOSS税号：" : "VAT税号：" }}
              <span class="right">
                {{ addFrom.countryCode == "IOSS" ? taxNumInfo.iossNumber : taxNumInfo.vatTaxNumber }}
              </span>
            </p>
            <p style="margin-left: 50px">
              当前申报区间：
              <span class="right">
                {{ beginTime != "" ? beginTime.slice(0, 10) : "" }}至{{ endTime != "" ? endTime.slice(0, 10) : "" }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="step1">
      <div
        class="dismissReason"
        v-if="taxNumInfo.status === 24 && (taxNumInfo.countryCode === 'AT' || taxNumInfo.countryCode === 'CZ')"
      >
        <span class="red">申报驳回原因：</span>
        {{ taxNumInfo.remark }}
      </div>
      <div class="subInfo" v-if="isLogin == true && nowPath.indexOf('aboutComputed') == -1">
        <img
          src="@/assets/images/common/gantanhao.png"
          style="width: 15px; margin-right: 5px; margin-bottom: -1px"
          alt=""
        />
        温馨提醒：
        <span v-if="addFrom.countryCode == 'GB'">1、</span>
        由于亚马逊销售文件2021年1月7日进行了更新，建议您下载最新销售文件进行计算税金操作
        <div
          v-if="addFrom.countryCode == 'GB'"
          style="margin-left: 95px; font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC; color: #333"
        >
          2、PVA为postpone VAT
          account，即进口VAT递延，清关时走递延流程，不需当场交进口VAT，清关后6个月内需要做PVA申报，申报需要上传的文件为做了递延的C88文件，或者进入对应的CDS账户，下载对应的PVA
          statement。
        </div>
      </div>
      <div
        style="background-color: #fff1dd; padding: 6px 0 6px 6px"
        v-if="(isLogin == false || nowPath.indexOf('aboutComputed') != -1) && addFrom.countryCode == 'GB'"
      >
        <img
          src="@/assets/images/common/gantanhao.png"
          style="width: 15px; margin-right: 5px; margin-bottom: -1px"
          alt=""
        />
        PVA为postpone VAT
        account，即进口VAT递延，清关时走递延流程，不需当场交进口VAT，清关后6个月内需要做PVA申报，申报需要上传的文件为做了递延的C88文件，或者进入对应的CDS账户，下载对应的PVA
        <span style="margin-left: 23px">statement。</span>
        <!-- <div v-if="addFrom.countryCode=='GB'"
        style="margin-left:95px;font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;color:#333;">
        2、PVA为postpone VAT account，即进口VAT递延，清关时走递延流程，不需当场交进口VAT，清关后6个月内需要做PVA申报，申报需要上传的文件为做了递延的C88文件，或者进入对应的CDS账户，下载对应的PVA statement。
        </div> -->
      </div>
      <div class="leftBox">
        <div v-if="isLogin == true && nowPath.indexOf('aboutComputed') != -1 && nowPath.indexOf('computedTax') != -1">
          <div class="tab-box">
            <span class="active-tab">税号信息</span>
            <!-- <span>注册信息</span> -->
          </div>
          <div class="tax-title">税号信息</div>
          <div class="taxNumber-box" v-if="JSON.stringify(taxNumInfo) != '{}'">
            <Row>
              <Col span="12">
                <span class="tax-info-name">公司中文名称：</span>
                <span class="tax-info-value">{{ taxNumInfo.companyNameZh }}</span>
              </Col>
              <Col span="12">
                <span class="tax-info-name">{{ addFrom.countryCode == "IOSS" ? "IOSS税号：" : "VAT税号：" }}</span>
                <span class="tax-info-value">
                  {{ addFrom.countryCode == "IOSS" ? taxNumInfo.iossNumber : taxNumInfo.vatTaxNumber }}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <span class="tax-info-name">公司英文名称：</span>
                <span class="tax-info-value">{{ taxNumInfo.companyNameEn }}</span>
              </Col>
              <Col span="12">
                <span class="tax-info-name">税金到账截止日期：</span>
                <span class="tax-info-value date-color"></span>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <span class="tax-info-name">申报区间：</span>
                <span class="tax-info-value date-color">
                  {{ beginTime != "" ? beginTime.slice(0, 10) : "" }} 至 {{ endTime != "" ? endTime.slice(0, 10) : "" }}
                </span>
              </Col>
            </Row>
          </div>
        </div>
        <div
          class="tax-title"
          v-if="isLogin == true && nowPath.indexOf('aboutComputed') != -1 && nowPath.indexOf('computedTax') != -1"
        >
          计算税金
        </div>
        <Form ref="addFrom" :model="addFrom" :rules="ruleAddFrom" label-position="left" class="leftForm">
          <div class="topLeft">
            <Row>
              <Col :span="8">
                <FormItem
                  v-if="addFrom.countryCode == 'IOSS'"
                  label="申报所在国:"
                  class="chooseCountry"
                  :label-width="130"
                  prop="countryCode"
                >
                  <Select
                    v-model="addFrom.iossCountryCode"
                    style="width: 200px"
                    placeholder="请选择申报所在国"
                    :disabled="isSelectCountry"
                  >
                    <Option v-for="(item, index) in allcountryList" :value="item.countryCode" :key="index">
                      {{ item.countryNameZh }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem v-else label="选择国家:" class="chooseCountry" :label-width="130" prop="countryCode">
                  <Select
                    v-model="addFrom.countryCode"
                    style="width: 200px"
                    @on-change="changeCountry"
                    placeholder="请选择报税国家"
                    :disabled="isSelectCountry"
                  >
                    <Option v-for="(item, index) in allcountryList" :value="item.countryCode" :key="index">
                      {{ item.countryNameZh }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8" v-if="addFrom.periodType != 2 && addFrom.countryCode != 'IOSS'">
                <FormItem label="税率:" prop="taxRate" :label-width="120">
                  <Select v-model="addFrom.taxRate" style="width: 200px" placeholder="请选择税率">
                    <Option v-for="(item, index) in taxRateList" :value="String(item.taxRate)" :key="index">
                      {{ item.taxRate }}%
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8" v-if="addFrom.declareRule != 2">
                <FormItem
                  label="报税周期："
                  prop="periodType"
                  style="margin-bottom:margin-bottom: 5px;"
                  :label-width="120"
                >
                  <Select
                    v-model="addFrom.periodType"
                    placeholder="请选择报税周期"
                    :disabled="isSelectCountry"
                    style="width: 200px"
                  >
                    <Option :value="item.status" v-for="(item, index) in declareList" :key="index">
                      {{ item.type }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <div class="tooltip" v-if="addFrom.countryCode != 'IOSS'">
                  <Tooltip max-width="300" placement="right">
                    <span class="tips-icon">?</span>
                    <div slot="content" class="info">
                      <p class="titleTip">说明</p>
                      <p class="ph">
                        (1) 目的国原则：若目的国已注册 VAT,则需在目的国报税，若未注册，则可在发货国申报。
                      </p>
                      <p class="ph">(2) 发货国原则：在发货国家进行报税。</p>
                    </div>
                  </Tooltip>
                </div>
                <FormItem label="计税方式:" prop="declareRule" :label-width="130">
                  <RadioGroup v-model="addFrom.declareRule" @on-change="changeDeclareRule">
                    <Radio label="0" v-if="addFrom.countryCode != 'IOSS'">
                      <span style="float: right; margin-top: 3px">目的国</span>
                    </Radio>
                    <Radio
                      label="1"
                      v-if="
                        addFrom.countryCode != 'SA' &&
                        addFrom.countryCode != 'AE' &&
                        addFrom.countryCode != 'GB' &&
                        addFrom.countryCode != 'IOSS' &&
                        isSelectCountry &&
                        !newMonth
                      "
                    >
                      <span style="float: right; margin-top: 3px">发出国</span>
                    </Radio>
                    <!-- ioss申报显示 有数据申报 选项 -->
                    <Radio label="3" v-if="addFrom.countryCode == 'IOSS'">有数据申报</Radio>
                    <Radio label="2" v-if="isSelectCountry || addFrom.countryCode == 'IOSS'">零申报</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col :span="8" v-if="addFrom.countryCode == 'SA' && addFrom.declareRule == '2'">
                <FormItem label="是否有店铺:" prop="isShop" :label-width="130">
                  <RadioGroup v-model="addFrom.isShop">
                    <Radio label="1">
                      <span style="float: right; margin-top: 3px">是</span>
                    </Radio>
                    <Radio label="2">否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col :span="24">
                <FormItem
                  label="销售平台："
                  prop="salePlatformType"
                  v-if="addFrom.countryCode == 'SA' && addFrom.declareRule != '2'"
                >
                  <Select v-model="addFrom.salePlatformType" placeholder="请选择销售平台" style="width: 200px">
                    <Option :value="item.key" v-for="(item, index) in salesListSA" :key="index">
                      {{ item.value }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem
                  label="销售平台："
                  prop="salePlatformType"
                  v-if="addFrom.countryCode == 'AE' && addFrom.declareRule != '2'"
                >
                  <Select v-model="addFrom.salePlatformType" placeholder="请选择销售平台" style="width: 200px">
                    <Option :value="item.key" v-for="(item, index) in salesListAE" :key="index">
                      {{ item.value }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem
                  label="销售平台："
                  prop="salePlatformType"
                  v-if="
                    addFrom.declareRule != '2' &&
                    addFrom.countryCode != 'AE' &&
                    addFrom.countryCode != 'GB' &&
                    addFrom.countryCode != 'SA' &&
                    addFrom.countryCode != 'IOSS' &&
                    (newMonth || !isSelectCountry)
                  "
                >
                  <RadioGroup v-model="addFrom.salePlatformType">
                    <Radio label="0">Amazon</Radio>
                    <Radio label="4">eBay</Radio>
                    <Radio label="5">其他</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col :span="16">
                <FormItem label="销售额文件：" :label-width="120" v-if="addFrom.declareRule != '2'">
                  <Upload
                    ref="upload"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-progress="
                      () => {
                        (spinShow = true), (operateText = '上传文件中，请稍后');
                      }
                    "
                    :on-success="
                      (res, file, fileList) => {
                        handleAmzSuccess(res, file, fileList);
                      }
                    "
                    :on-error="handleUploadError"
                    :on-remove="
                      (file, fileList) => {
                        handleAmzRemoveFile(file, fileList);
                      }
                    "
                    :on-exceeded-size="handleMaxSize"
                    :format="['xls', 'xlsx', 'csv', 'txt']"
                    :max-size="102400"
                    :default-file-list="AmzFileList"
                    :on-format-error="handleFormatError"
                    :before-upload="handleAmzBeforeUpload"
                  >
                    <Button icon="ios-cloud-upload-outline" style="margin-top: 2px" class="amzUpload btnfile">
                      请上传店铺销售文件
                    </Button>
                  </Upload>
                  <div
                    class="saleFile"
                    v-if="
                      addFrom.saleFileUrl !== '' &&
                      taxNumInfo.status === 24 &&
                      (taxNumInfo.countryCode === 'AT' || taxNumInfo.countryCode === 'CZ')
                    "
                  >
                    <a target="_blank" v-if="addFrom.saleFileUrl !== ''" :href="addFrom.saleFileUrl" class="show-pdf">
                      销售额文件
                    </a>
                    <img
                      class="closeImg"
                      @click="handleAmzRemoveFile"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </div>
                  <div class="howToGet" v-else @click="getContentModel = true">
                    如何获取？
                    <span class="line"></span>
                  </div>
                  <div style="font-size: 12px; color: #f79728" v-if="addFrom.countryCode == 'IOSS'">
                    注：仅支持Amazon销售文件
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row
              v-if="
                addFrom.countryCode &&
                addFrom.declareRule != '2' &&
                addFrom.countryCode != 'GB' &&
                addFrom.countryCode != 'SA' &&
                addFrom.countryCode != 'AE' &&
                addFrom.countryCode != 'IOSS' &&
                ((isSelectCountry && newMonth) || !isSelectCountry)
              "
            >
              <Col :span="24">
                <FormItem label="OSS税号：" prop="oss" :label-width="130">
                  <RadioGroup v-model="addFrom.oss">
                    <Radio label="1">
                      <span style="float: right; margin-top: 3px">有OSS税号</span>
                    </Radio>
                    <Radio label="0">
                      <span style="float: right; margin-top: 3px">无OSS税号</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row
              v-if="
                addFrom.countryCode &&
                addFrom.declareRule != '2' &&
                addFrom.countryCode != 'GB' &&
                addFrom.countryCode != 'SA' &&
                addFrom.countryCode != 'AE' &&
                addFrom.countryCode != 'IOSS' &&
                ((isSelectCountry && newMonth) || !isSelectCountry)
              "
            >
              <Col :span="24">
                <FormItem label="IOSS税号：" prop="ioss" :label-width="130">
                  <RadioGroup v-model="addFrom.ioss">
                    <Radio label="1">
                      <span style="float: right; margin-top: 3px">有IOSS税号</span>
                    </Radio>
                    <Radio label="0">
                      <span style="float: right; margin-top: 3px">无IOSS税号</span>
                    </Radio>
                  </RadioGroup>
                  <p style="color: #ed3e3e">提示：亚马逊等OMPs平台提供的IOSS，OSS税号不能作为申报号码</p>
                </FormItem>
              </Col>
            </Row>
            <div
              class="zero-declear-tip"
              v-if="addFrom.declareRule == 2 && (addFrom.countryCode == 'AE' || addFrom.countryCode == 'SA')"
            >
              <p class="red" v-if="addFrom.countryCode == 'AE'">
                <img
                  src="@/assets/images/common/gantanhao.png"
                  style="width: 15px; margin-right: 5px; margin-bottom: 2px"
                  alt=""
                />
                根据阿联酋税局官方要求，零申报需要卖家提交零申报信件，具体如下：
              </p>
              <p class="red" v-if="addFrom.countryCode == 'SA'">
                <img
                  src="@/assets/images/common/gantanhao.png"
                  style="width: 15px; margin-right: 5px; margin-bottom: 2px"
                  alt=""
                />
                根据沙特税局官方要求，无店铺情况下零申报需要卖家提交零申报文件，具体文件如下：
              </p>
              <p style="color: #ed3e3e; padding-left: 19px">
                备注：卖家下载文件模版后法人签名盖章上传即可（根据示例要求填写）；
              </p>
            </div>
            <div class="zero-declear-box">
              <FormItem label="零申报凭证：" prop="amx_file_url" :label-width="130" v-if="addFrom.declareRule == '2'">
                <Upload
                  :before-upload="handleAmzBeforeUploadLing"
                  :on-format-error="handleFormatErrors"
                  :on-progress="
                    () => {
                      (spinShow = true), (operateText = '上传文件中，请稍后');
                    }
                  "
                  :max-size="102400"
                  :on-exceeded-size="handleMaxSize"
                  :on-success="
                    (res, file, fileList) => {
                      handleAmzSuccessLing(res, file, fileList);
                    }
                  "
                  :on-error="handleUploadError"
                  :on-remove="
                    (file, fileList) => {
                      handleAmzRemoveFileLing(file, fileList);
                    }
                  "
                  :action="ImgUrl"
                  :default-file-list="lingFileList"
                  :data="{ prefix: '' }"
                  :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'word', 'docx']"
                >
                  <Button icon="ios-cloud-upload-outline" class="amzUpload btnfile">证明店铺零销售截图</Button>
                </Upload>
                <div
                  class="sample-box"
                  v-if="addFrom.declareRule == 2 && (addFrom.countryCode == 'AE' || addFrom.countryCode == 'SA')"
                >
                  <a
                    target="_blank"
                    v-if="addFrom.countryCode == 'SA'"
                    href="http://file.itaxs.com/dev/20210225/30223fb1952441d8b8ced00029279442.png"
                    style="margin-right: 23px; color: #16ade9"
                  >
                    <img src="@/assets/images/common/searchImg.png" alt="" />
                    查看示例
                  </a>
                  <a
                    target="_blank"
                    v-if="addFrom.countryCode == 'AE'"
                    href="http://file.itaxs.com/dev/20210225/f25d7277e8664ccfa792f1c62b493a6a.png"
                    style="margin-right: 23px; color: #16ade9"
                  >
                    <img src="@/assets/images/common/searchImg.png" alt="" />
                    查看示例
                  </a>
                  <span @click="uploadTemplate">
                    <img src="@/assets/images/common/xiazai.png" alt="" />
                    下载模板
                  </span>
                </div>
              </FormItem>
            </div>

            <div
              class="countryList"
              v-if="addFrom.countryCode != 'SA' && addFrom.countryCode != 'AE' && addFrom.declareRule != '2'"
            >
              <FormItem
                v-if="addFrom.countryCode != 'IOSS'"
                label="VAT国家:"
                class="VATCountry"
                :label-width="130"
                prop="tfnCountryCode"
              >
                <span class="zhuce">(已注册)</span>
                <CheckboxGroup v-model="addFrom.tfnCountryCode">
                  <!-- v-if="isBeforeYear" -->
                  <Checkbox label="GB" :disabled="addFrom.countryCode == 'GB'">
                    <img class="countryFlag" src="../../../assets/images/common/GBflag.png" alt="" />
                    <span class="countryName">英国</span>
                  </Checkbox>
                  <Checkbox label="DE" :disabled="addFrom.countryCode == 'DE'">
                    <img class="countryFlag" src="../../../assets/images/common/DEflag.png" alt="" />
                    <span class="countryName">德国</span>
                  </Checkbox>
                  <Checkbox label="FR" :disabled="addFrom.countryCode == 'FR'">
                    <img class="countryFlag" src="../../../assets/images/common/FGflag.png" alt="" />
                    <span class="countryName">法国</span>
                  </Checkbox>
                  <Checkbox label="IT" :disabled="addFrom.countryCode == 'IT'">
                    <img class="countryFlag" src="../../../assets/images/common/ITflag.png" alt="" />
                    <span class="countryName">意大利</span>
                  </Checkbox>
                  <Checkbox label="ES" :disabled="addFrom.countryCode == 'ES'">
                    <img class="countryFlag" src="../../../assets/images/common/XBYflag.png" alt="" />
                    <span class="countryName">西班牙</span>
                  </Checkbox>
                  <Checkbox label="CZ" :disabled="addFrom.countryCode == 'CZ'">
                    <img class="countryFlag" src="../../../assets/images/common/JKflag.png" alt="" />
                    <span class="countryName">捷克</span>
                  </Checkbox>
                  <Checkbox label="PL" :disabled="addFrom.countryCode == 'PL'">
                    <img class="countryFlag" src="../../../assets/images/common/BLflag.png" alt="" />
                    <span class="countryName">波兰</span>
                  </Checkbox>
                  <Checkbox label="NL" :disabled="addFrom.countryCode == 'NL'">
                    <img class="countryFlag" src="../../../assets/images/common/NLflag.png" alt="" />
                    <span class="countryName">荷兰</span>
                  </Checkbox>
                  <Checkbox label="AT" :disabled="addFrom.countryCode == 'AT'">
                    <img class="countryFlag" src="../../../assets/images/common/ATflag.png" alt="" />
                    <span class="countryName">奥地利</span>
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </div>
            <!-- gsw IOSS的其他平台销售额 -->
            <div v-if="addFrom.declareRule != '2' && addFrom.countryCode == 'IOSS'">
              <FormItem label="其它平台含税销售额：">
                <div style="padding-left: 172px">
                  <div v-if="sureOtherSellList.length == 0">
                    <Button class="amzUpload" @click="showOtherSellModal">点击填写</Button>
                  </div>
                  <div>
                    <Tag
                      v-for="(item, index) in sureOtherSellList"
                      :key="item.id"
                      closable
                      @on-close="handleRemoveTag(index)"
                    >
                      {{ item.countryName }} {{ Number(item.includTaxPrice).toFixed(2) }} {{ item.currency }}
                    </Tag>
                  </div>
                  <div>
                    <a
                      v-if="otherPlatformsFormObj.otherSaleFileUrl"
                      :href="otherPlatformsFormObj.otherSaleFileUrl"
                      target="_blank"
                    >
                      {{ otherPlatformsFormObj.origFileName }}
                    </a>
                    <Icon
                      style="color: #888; cursor: pointer"
                      v-if="otherPlatformsFormObj.otherSaleFileUrl"
                      type="md-close"
                      @click="handleRemoveSaleFile"
                    />
                  </div>
                  <div v-if="sureOtherSellList.length > 0">
                    <a @click="showOtherSellModal">
                      <Icon type="edit" />
                      <Icon type="ios-create" />
                      修改
                    </a>
                  </div>
                </div>
              </FormItem>
            </div>
            <Row v-else>
              <Col span="6">
                <FormItem
                  label="其它平台含税销售额："
                  v-if="addFrom.declareRule !== '2' && addFrom.countryCode != 'GB'"
                >
                  <Button
                    class="amzUpload btnfile"
                    v-if="otherPlatformsFormObj.otherSaleFileUrl === ''"
                    @click="otherPlatformsMadal = true"
                  >
                    点击填写
                  </Button>
                  <div v-else class="otherPlatformBox">
                    <!-- {{this.otherPlatformsForm.otherIncludTaxAmt}} -->
                    <span class="num">
                      {{ otherPlatformsFormObj.otherIncludTaxAmt }}
                      <span class="link" @click="otherPlatformsMadal = true">
                        <img
                          src="../../../assets/images/common/edit1.png"
                          style="margin-right: -2px; margin-left: 8px"
                          alt=""
                        />
                        修改
                      </span>
                      <span class="link" style="color: #b2b2b2" @click="clearOtherPlatformsInfo">
                        <img src="../../../assets/images/shoppingCar/shanchu.png" alt="" />
                        删除
                      </span>
                    </span>
                    <span class="link">
                      <a :href="otherPlatformsFormObj.otherSaleFileUrl" target="_blank">
                        <img
                          style="float: left; margin-right: 5px; margin-top: 2px"
                          src="../../../assets/images/common/linkIcon.png"
                          alt=""
                        />
                        {{ otherPlatformsFormObj.origFileName || "其它平台含税销售额文件" }}
                      </a>
                    </span>
                  </div>
                </FormItem>
              </Col>
            </Row>

            <!-- naoki add 德国欧盟内费用申报 -->
            <Row  v-if="addFrom.countryCode == 'DE' && addFrom.declareRule !=2">
              <Col span="24">
                <FormItem
                  label="采购金额："
                >
                  <InputNumber
                    :min="1"
                    v-model="addFrom.otherEcAcqPrice"
                    :precision="0"
                    placeholder="请输入金额（EUR）"
                    type="number"
                    style="width: 300px"
                  ></InputNumber>
                  <span>
                    EUR
                  </span>
                </FormItem>
              </Col>
            </Row>

            <Row v-if="addFrom.countryCode == 'DE'  && addFrom.declareRule !=2">
              <Col span="24">
                <FormItem label="抵扣采购文件：" >
                  <Upload
                    :disabled="!addFrom.otherEcAcqPrice"
                    ref="upload"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-progress="
                      () => {
                        (spinShow = true), (operateText = '上传文件中，请稍后');
                      }
                    "
                    :on-success="
                      (res, file, fileList) => {
                        handleAmzSuccessotherEc(res, file, fileList);
                      }
                    "
                    :on-error="handleUploadError"
                    :on-remove="
                      (file, fileList) => {
                        handleAmzRemoveFileotherEc(file, fileList);
                      }
                    "
                    :on-exceeded-size="handleMaxSize"
                    :format="['pdf', 'jpg', 'png', 'rar', 'zip']"
                    :max-size="102400"
                    :on-format-error="handleFormatErrorEc"
                    :before-upload="handleAmzBeforeUploadEc"
                  >
                    <Button icon="ios-cloud-upload-outline" style="margin-top: 2px" class="amzUpload btnfile">
                      请上传抵扣采购文件
                    </Button>
                  </Upload>
                    <div style="font-size: 12px; color: rgb(247, 151, 40);margin-top:10px;margin-left:120px">
                      <p>请上传应税19%的欧盟内收购/采购项</p>
                      <p>注：支持JPG、JPEG、PNG、PDF、压缩式格式上传</p>
                    </div>
                  <div
                    class="saleFile"
                    v-if="
                      addFrom.saleFileUrl !== '' &&
                      taxNumInfo.status === 24
                    "
                  >
                    <a target="_blank" v-if="addFrom.saleFileUrl !== ''" :href="addFrom.saleFileUrl" class="show-pdf">
                      抵扣采购文件
                    </a>
                    <img
                      class="closeImg"
                      @click="handleAmzRemoveFile"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </div>
                </FormItem>
              </Col>
            </Row>

            <!-- gsw 新增字段 -->
            <Row v-if="addFrom.declareRule != '2' && addFrom.countryCode == 'ES' &&  (newMonth || !isSelectCountry)">
              <Col span="24">
                <div class="tooltip">
                  <Tooltip max-width="300" placement="right">
                    <span class="tips-icon">?</span>
                    <div slot="content" class="info">
                      <p class="titleTip">说明</p>
                      <p class="ph">
                        请确认欧盟税号是否生效，如生效请确认是否完成ECL（B2B）申报，若不申报，则会产生罚金且有税号注销风险，ECL申报为数据上报，不影响税金。
                      </p>
                    </div>
                  </Tooltip>
                </div>
                <FormItem

                  label="ECL申报："
                  prop="isEcl"
                  :label-width="130"
                >
                  <RadioGroup v-model="addFrom.isEcl">
                    <Radio label="1">
                      <span style="float: right; margin-top: 3px">是</span>
                    </Radio>
                    <Radio label="2">
                      <span style="float: right; margin-top: 3px">否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="addFrom.declareRule != '2' && addFrom.countryCode == 'ES'  &&  (newMonth || !isSelectCountry)">
              <Col :span="24">
                <FormItem v-if="addFrom.declareRule != '2' && addFrom.isEcl == 1" :label-width="130">
                  <div style="margin-bottom: 10px">
                    <span style="width: 260px; display: inline-block">
                      ECL销售项金额：
                      <span v-if="eclSalePrice !== 0 || returnTaxData.eclSalePrice">{{ returnTaxData.eclSalePrice  == undefined ? eclSalePrice : returnTaxData.eclSalePrice}} 欧元</span>
                    </span>
                    <span>
                      <Button class="amzUpload btnfile" @click="eclSellAmountModal = true">添加销售项</Button>
                    </span>
                  </div>
                  <div>
                    <span style="width: 260px; display: inline-block">
                      ECL采购项金额：
                      <span v-if="eclPurchasePrice !== 0 || returnTaxData.eclSalePrice">{{ returnTaxData.eclPurchasePrice == undefined ? eclPurchasePrice :  returnTaxData.eclPurchasePrice}} 欧元</span>
                    </span>
                    <span>
                      <Button class="amzUpload btnfile" @click="eclBuyAmountModal = true">添加采购项</Button>
                    </span>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <div class="subInfo" v-if="b2bType && addFrom.countryCode">
              <img
                src="@/assets/images/common/gantanhao.png"
                style="width: 15px; margin-right: 5px; margin-bottom: -1px"
                alt=""
              />
              注意：亚马逊数据表中已记录B2B销售，为避免重复抵税，请检查清楚抵扣单据。
            </div>
            <div class="discountBox" v-if="addFrom.declareRule != 2 && addFrom.countryCode != 'IOSS'">
              <p class="discountTitle clearfix">
                抵扣项
                <span>（如有抵扣项，可进行上传）</span>
                <span icon="ios-cloud-upload-outline" class="addBtn fr amzUpload" @click="addDiscount">
                  <img src="../../../assets/images/common/addItem.png" alt="" />
                  <span>添加抵扣项</span>
                </span>
              </p>
              <Table :data="discountData" :columns="discountColumns" border class="table">
                <template slot="declareDate" slot-scope="{ row }">
                  <Date-picker
                    type="date"
                    :value="row.billDate"
                    placeholder="单据日期"
                    @on-change="changeDate($event, row)"
                  ></Date-picker>
                </template>
                <template slot="uploadBox" slot-scope="{ row }">
                  <div class="uploadBox flex">
                    <Upload
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :show-upload-list="false"
                      :on-success="
                        (res, file, fileList) => {
                          handleSuccess(res, file, fileList, row);
                        }
                      "
                      :on-error="handleUploadError"
                      :on-remove="
                        (file, fileList) => {
                          handleRemoveFile(file, fileList, row);
                        }
                      "
                      :format="['pdf', 'jpg', 'png', 'rar', 'zip']"
                      :on-format-error="handleFormatErrors"
                    >
                      <Button icon="ios-cloud-upload-outline" class="amzUpload btnfile" style="margin-top: 10px">
                        请上传抵扣凭证
                      </Button>
                    </Upload>
                    <div style="font-size: 12px; color: rgb(247, 151, 40); margin-top: 10px">
                      注：支持JPG、JPEG、PNG、PDF、ZIP 格式上传
                    </div>
                    <!-- this.discountData[row._index] -->
                    <div class="" v-if="discountData[row._index].deductionFile">
                      <a :href="discountData[row._index].deductionFile" target="_blank" class="show-pdf">抵扣凭证</a>
                      <img
                        class="closeImg"
                        style="width: 10px; cursor: pointer"
                        @click="handleRemoveFile('', '', row)"
                        src="@/assets/images/common/activeCloseImg.png"
                        alt=""
                      />
                    </div>
                    <span class="close" @click="deleteItem(row)">
                      <img src="@/assets/images/common/close.png" alt="" />
                    </span>
                  </div>
                </template>
              </Table>
            </div>
          </div>
        </Form>
        <Divider />
      </div>
      <div class="btBox">
        <Button type="primary" @click="checkTax" v-if="addFrom.declareRule != 2 && addFrom.countryCode != 'IOSS'">
          核算税金
        </Button>
        <!-- IOSS核算税金的按钮 -->
        <Button type="primary" @click="iossCheckTax" v-if="addFrom.declareRule != 2 && addFrom.countryCode == 'IOSS'">
          核算税金
        </Button>
        <Button
          @click="sureSubmit('addFrom')"
          v-if="servicesId != undefined && addFrom.countryCode != 'IOSS'"
          type="info"
          ghost
          style="margin-left: 15px; background-color: #fff"
        >
          提交申报
        </Button>
        <!-- IOSS申报的按钮 -->
        <Button
          v-if="servicesId != undefined && addFrom.countryCode == 'IOSS'"
          @click="sureIossSubmit('addFrom')"
          type="info"
          ghost
          style="margin-left: 15px; background-color: #fff"
        >
          提交申报
        </Button>
        <Button
          @click="reset('addFrom')"
          icon="ios-refresh-circle-outline"
          v-if="servicesId == undefined"
          style="margin-left: 15px"
        >
          重置
        </Button>
      </div>
    </div>
    <div class="step2" v-if="addFrom.declareRule != 2">
      <div class="step2_content">
        <p class="title">
          <span>税金计算结果</span>
          <span
            @click="downLoadMingxi('addFrom')"
            v-if="
              addFrom.countryCode != 'SA' &&
              addFrom.countryCode != 'IOSS' &&
              isLogin &&
              nowPath.indexOf('aboutComputed') == -1
            "
            style="
              display: inline-block;
              border: 1px solid #16ade9;
              color: #16ade9;
              width: 135px;
              height: 32px;
              font-size: 14px;
              font-weight: 400;
              padding: 5px 24px;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            <Icon type="ios-cloud-download-outline" style="font-size: 18px; color: #16ade9" />
            下载明细
          </span>
        </p>
        <div class="resultMoney">
          <div v-if="returnTaxData.taxRateBefore && returnTaxData.taxRateBefore != 0 && addFrom.countryCode == 'GB'">
            <Row>
              <Col span="6">
                <span>{{ returnTaxData.taxRateBefore ? returnTaxData.taxRateBefore + "%" : "" }}含税销售总额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.includTaxAmtBefore }}</span>
              </Col>
              <Col span="6">
                <span>{{ returnTaxData.taxRateBefore ? returnTaxData.taxRateBefore + "%" : "" }}不含税销售总额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.excludeTaxAmtBefore }}</span>
              </Col>
              <Col span="6">
                <span>{{ returnTaxData.taxRateBefore ? returnTaxData.taxRateBefore + "%" : "" }}销项税额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.taxAmtBefore }}</span>
              </Col>
              <Col span="6">
                <span>{{ returnTaxData.taxRate ? returnTaxData.taxRate + "%" : "" }}含税销售总额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.includTaxAmt }}</span>
              </Col>
            </Row>
            <p style="height: 24px"></p>
            <Row>
              <Col span="6">
                <span>{{ returnTaxData.taxRate ? returnTaxData.taxRate + "%" : "" }}不含税销售总额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.excludeTaxAmt }}</span>
              </Col>
              <Col span="6">
                <span>{{ returnTaxData.taxRate ? returnTaxData.taxRate + "%" : "" }}销项税额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.taxAmt }}</span>
              </Col>
              <Col span="6">
                <span>抵扣金额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.deductionAmt }}</span>
              </Col>
              <Col span="6">
                <span>PVA抵扣金额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.deductionB2bAmt }}</span>
              </Col>
            </Row>
          </div>
          <Row style="margin-bottom: 10px" v-if="addFrom.periodType == 2 && addFrom.countryCode == 'DE'">
            <Col span="6">
              <span>16%含税销售总额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.deIncludTaxAmtTotal16 }}</span>
            </Col>
            <Col span="6">
              <span>16%不含税销售总额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.deExcludeTaxAmtTotal16 }}</span>
            </Col>
            <Col span="6">
              <span>19%含税销售总额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.deIncludTaxAmtTotal19 }}</span>
            </Col>
            <Col span="6">
              <span>19%不含税销售总额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.deExcludeTaxAmtTotal19 }}</span>
            </Col>
          </Row>
          <Row
            v-if="
              returnTaxData.taxRateBefore == 0 ||
              (returnTaxData.taxRateBefore == undefined && addFrom.countryCode != 'IOSS')
            "
          >
            <Col span="6" v-if="addFrom.periodType != 2">
              <span>含税销售总额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.includTaxAmtTotal }}</span>
            </Col>
            <Col span="6" v-if="addFrom.periodType != 2">
              <span>不含税销售总额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.excludeTaxAmtTotal }}</span>
            </Col>
            <Col span="6">
              <span>销项税额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.taxAmtTotal }}</span>
            </Col>
            <Col span="6">
              <span>抵扣金额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.deductionAmt }}</span>
            </Col>
          </Row>
          <!-- gsw 新增 -->
          <Row style="margin-bottom: 10px" v-if="addFrom.countryCode == 'IOSS'">
            <Col span="6">
              <span>含税销售总额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.includTaxAmtTotal }}</span>
              <div style="font-size: 12px; color: #f79728; margin-top: 10px">注：各国含税销售额总和</div>
            </Col>
            <Col span="6">
              <span>净销售额总和：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.excludeTaxAmtTotal }}</span>
            </Col>
            <Col span="6">
              <span>最终缴纳金额：</span>
              <span class="money">{{ currencySign }}{{ returnTaxData.taxTotal }}</span>
            </Col>
          </Row>
          <p class="finallyMoney" v-if="addFrom.countryCode != 'IOSS'">
            <Row>
              <Col span="6" v-if="addFrom.countryCode == 'GB' && !isBeforeYear">
                <span>不含税销售额(代扣代缴)：</span>
                <span>{{ currencySign }}{{ returnTaxData.excludeTaxAmt1 }}</span>
              </Col>
              <Col span="6" v-if="addFrom.countryCode == 'GB' && !isBeforeYear">
                <span>不含税销售额(B2B抵扣)：</span>
                <span>{{ currencySign }}{{ returnTaxData.excludeTaxAmt4 }}</span>
              </Col>
              <Col span="6">
                <span>最终缴纳金额：</span>
                <span class="red">{{ currencySign }}{{ returnTaxData.taxTotal }}</span>
              </Col>
              <Col
                span="6"
                v-if="
                  addFrom.countryCode != 'GB' &&
                  addFrom.countryCode != 'SA' &&
                  addFrom.countryCode != 'AE' &&
                  ((isSelectCountry && newMonth) || !isSelectCountry)
                "
              >
                <span>平台代扣代缴金额：</span>
                <span>{{ currencySign }}{{ returnTaxData.excludeTaxAmt1 }}</span>
              </Col>
            </Row>
          </p>
        </div>
        <div class="resultBox" v-if="addFrom.countryCode != 'IOSS'">
          <p class="jisuanshuijin clearfix">
            <span>税金计算明细</span>
            <Button
              class="fr"
              @click="downLoadTaxDetail"
              v-if="
                (returnData.length > 0 || returnDataAE.length > 0) &&
                isLogin == true &&
                nowPath.indexOf('aboutComputed') != -1 &&
                nowPath.indexOf('computedTax') != -1
              "
            >
              下载明细
            </Button>
          </p>
          <Table
            :data="returnData"
            max-height="300"
            :columns="returnColumns"
            v-if="addFrom.countryCode != 'SA' && addFrom.countryCode != 'AE'"
          ></Table>
          <Table
            :data="returnDataAE"
            max-height="300"
            :columns="returnColumnsAE"
            v-if="addFrom.countryCode == 'AE'"
          ></Table>
          <div v-if="returnData.length > 0 && addFrom.declareRule !== '2' && servicesId !== undefined">
            <div class="jiankong normal" v-if="returnTaxData.status === 0 && returnDataSale.length > 0">
              <span class="JkTitle">远程销售额监控</span>
              <span class="status" @click="getStatus()">
                <img src="../../../assets/images/common/blueStatus.png" alt="" />
                正常 >>
              </span>
            </div>
            <div class="jiankong unnormal" v-if="returnTaxData.status === 1 && returnDataSale.length > 0">
              <span class="JkTitle">远程销售额监控</span>
              <span class="status" @click="getStatus()">
                <img src="../../../assets/images/common/redStatus.png" alt="" />
                异常 >>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div class="loadingText">{{ operateText }}</div>
    </Spin>
    <div style="clear: both"></div>
    <Modal v-model="otherPlatformsMadal" title="其它平台含税销售额">
      <div class="promptBg">
        <p>
          <span>温馨提示：</span>
          如有其它平台需要VAT申报，请在此处填写含税销售额，含税销售额的计算方式可联系客服！(注意：填写的销售额币种为您需要申报的币种)
        </p>
      </div>
      <Form :label-width="120" ref="otherPlatforms" :model="otherPlatformsForm" :rules="otherPlatformsRules">
        <FormItem label="含税销售额" prop="otherIncludTaxAmt">
          <Input
            placeholder="请输入含税销售额"
            type="number"
            v-model="otherPlatformsForm.otherIncludTaxAmt"
            style="width: 300px"
          ></Input>
        </FormItem>
        <FormItem label="其它平台含税销售文件" prop="otherSaleFileUrl">
          <Upload
            ref="otherSaleFileRef"
            :before-upload="handleAmzBeforeUploadPlatform"
            :on-format-error="handleFormatErrors"
            :on-success="
              (res, file, fileList) => {
                handleAmzSuccessPlatform(res, file, fileList);
              }
            "
            :on-error="handleUploadError"
            :on-remove="
              (file, fileList) => {
                handleAmzRemoveFilePlatform(file, fileList);
              }
            "
            :action="ImgUrl"
            :data="{ prefix: '' }"
            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'word', 'docx', 'xls', 'xlsx', 'csv', 'txt']"
          >
            <Button style="width: 300px; background: #16ade9; color: #ffffff" icon="ios-cloud-upload-outline">
              点击上传
            </Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button
          class="footerBt"
          style="width: 100px"
          type="primary"
          :loading="loadingget"
          @click="submitPlatformsForm('otherPlatforms')"
        >
          提交
        </Button>
      </div>
    </Modal>
    <Modal v-model="modelAddCom" title="添加国家" :mask-closable="false">
      <Form ref="giveFrom" :model="giveFrom" :rules="ruleGiveFrom" :label-width="0">
        <FormItem label prop="tfnCountryCode">
          <Row>
            <CheckboxGroup v-model="giveFrom.tfnCountryCode" @on-change="countrys">
              <Checkbox v-for="(item, index) in allcountryList1" :label="item.countryCode" :key="index">
                <!-- <span>{{item.countryCode}}</span> -->
                <span>{{ item.countryName }}</span>
                <!-- <Checkbox v-model="countries">item.countryName</Checkbox> -->
              </Checkbox>
            </CheckboxGroup>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="footerBt" type="primary" :loading="loadingget" @click="giveok('giveFrom')">确认</Button>
      </div>
    </Modal>
    <!-- gsw 添加其他平台含税销售额 -->
    <Modal v-model="otherSellModal" title="其他平台含税销售额" :mask-closable="false" width="760">
      <Form ref="otherPlatforms" :label-width="180">
        <Table :data="otherOmCountryList" :columns="otherOmColumns" height="460">
          <template slot="includTaxPrice" slot-scope="{ row, index }">
            <Input v-model="row.includTaxPrice" maxlength="10" @on-change="changeTaxPrice(row, index)" />
          </template>
        </Table>
        <FormItem label="其它平台含税销售文件" prop="otherSaleFileUrl" style="margin-top: 20px">
          <Upload
            :before-upload="handleAmzBeforeUploadPlatform"
            :on-format-error="handleFormatErrors"
            :on-success="
              (res, file, fileList) => {
                handleAmzSuccessPlatform(res, file, fileList);
              }
            "
            :on-remove="
              (file, fileList) => {
                handleAmzRemoveFilePlatform(file, fileList);
              }
            "
            :action="ImgUrl"
            ref="otherPlatformsUpload"
            :data="{ prefix: '' }"
            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'word', 'docx', 'xls', 'xlsx', 'csv', 'txt']"
          >
            <Button style="width: 300px; background: #16ade9; color: #ffffff" icon="ios-cloud-upload-outline">
              点击上传
            </Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button class="footerBtClose" @click="otherSellModal = false">取消</Button>
        <Button class="footerBt" type="primary" @click="handleSubmitOtherSell">确认</Button>
      </div>
    </Modal>
    <!-- gsw 确认申报数据 -->
    <Modal v-model="sureApplyDataModal" title="确认申报数据" :mask-closable="false" width="760">
      <Form ref="otherPlatforms" :label-width="180">
        <Row>
          <Col :span="12">公司中文名称：{{ taxNumInfo.companyNameZh }}</Col>
          <Col :span="12">公司英文名称：{{ taxNumInfo.companyNameEn }}</Col>
        </Row>
        <Row>
          <Col :span="12">IOSS税号：{{ taxNumInfo.iossNumber }}</Col>
          <Col :span="12">
            当前申报区间： {{ beginTime && beginTime != "" ? beginTime.slice(0, 10) : "" }} 至
            {{ endTime && endTime != "" ? endTime.slice(0, 10) : "" }}
          </Col>
        </Row>
        <Divider />
        <div class="clearfix">
          <span style="font-size: 16px; margin-top: 20px">申报数据</span>
          <!-- <Button style="background: #16ade9; color: #ffffff; float: right">导出申报数据</Button> -->
        </div>
        <table class="other-sell-table">
          <thead>
            <tr>
              <th>国家</th>
              <th>含税销售额（€）</th>
              <th>抵扣金额（€）</th>
              <th>税率</th>
              <th>应缴税金（€）</th>
            </tr>
          </thead>
          <template v-if="returnTaxData.salePriceInfos && returnTaxData.salePriceInfos.length > 0">
            <tr v-for="(item, index) in returnTaxData.salePriceInfos" :key="index">
              <td>{{ item.countryName }}</td>
              <td>{{ item.includTaxPrice }}</td>
              <td>{{ item.deductiontAmt }}</td>
              <td>{{ item.rate }}%</td>
              <td>{{ item.taxTotal }}</td>
            </tr>
          </template>
        </table>
        <div>
          最终税金：
          <span style="font-size: 16px; margin-right: 3px">{{ returnTaxData.taxTotal }}</span>
          欧元
        </div>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button class="footerBtClose" @click="sureApplyDataModal = false">取消</Button>
        <Button class="footerBt" type="primary" @click="iossSubmit">确认</Button>
      </div>
    </Modal>
    <Modal v-model="statusModel" width="1100" class-name="remoteSale" footer-hide>
      <div class="yuanchengxiaoshou">
        <Table :data="returnDataSale" max-height="500" :columns="returnColumnSale">
          <div slot="header" class="remoteSaleHeader">远程销售额监控</div>
          <div slot="footer" class="remoteSaleFooter">
            <span style="color: #ed3e3e">特别说明：</span>
            远程销售额监控是当您使用发出国算法进行报税，销售额达到发出国上限的的50%--70%时，建议您及时注册目的国税号使用目的国算法报税。因为根据欧洲VAT算税规定：一旦达到发出国销售额上限，将无法再以发出国进行报税。
          </div>
          <template slot="includTaxPriceTotal" slot-scope="{ row }">
            <span :class="Number(row.includTaxPriceTotal) > Number(row.moneyLimit) ? 'red' : ''">
              {{ row.includTaxPriceTotal }}
            </span>
          </template>
        </Table>
      </div>
    </Modal>
    <Modal class-name="getContentModel" v-model="getContentModel">
      <div>
        <img
          style="width: 100%"
          src="../../../assets/images/common/modelImg1.png"
          alt=""
          v-if="addFrom.countryCode !== 'SA' && addFrom.countryCode !== 'AE'"
        />
        <img src="https://file.itaxs.com/dev/20210510/70ef5ec032884477acb4c018864ce49e.png" alt="" v-else />
      </div>
      <div slot="footer" style="text-align: center">
        <Button
          style="margin-top: 20px"
          class="footerBt"
          type="primary"
          :loading="loadingget"
          @click="getContentModel = false"
        >
          确认
        </Button>
      </div>
    </Modal>
    <Modal
      v-model="submitModal"
      :title="addFrom.declareRule == '2' ? '是否确认零申报？' : '请确认您的申报数据'"
      :width="616"
      class="submit-box"
    >
      <div class="taxNumber-box" v-if="JSON.stringify(taxNumInfo) != '{}'">
        <Row>
          <Col span="12">
            <span class="tax-info-name">公司中文名称：</span>
            <span class="tax-info-value">{{ taxNumInfo.companyNameZh }}</span>
          </Col>
          <Col span="11" offset="1">
            <span class="tax-info-name">VAT税号：</span>
            <span class="tax-info-value">{{ taxNumInfo.vatTaxNumber }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">公司英文名称：</span>
            <span class="tax-info-value">{{ taxNumInfo.companyNameEn }}</span>
          </Col>
          <Col span="11" offset="1">
            <span class="tax-info-name">申报区间：</span>
            <span class="tax-info-value date-color">
              {{ beginTime != "" ? beginTime.slice(0, 10) : taxNumInfo.beginTime.slice(0, 10) }}至{{
                endTime != "" ? endTime.slice(0, 10) : taxNumInfo.endTime.slice(0, 10)
              }}
            </span>
          </Col>
        </Row>
      </div>
      <Divider />
      <div class="submit-tip-box">
        <div class="content" v-if="addFrom.declareRule == '2'">
          <div class="subtitle">税局提示：</div>
          <p>
            当您提交此增值税信息至税局时，请确保该数据真实且 完整，如果数据错误或者不实，税局有权按规定进行处
            罚。数据提交后无法更改.
          </p>
          <p>
            When you submit this VAT information you are making a legal declaration that the information is true and
            complete. A false declaration can result in prosecution.
          </p>
        </div>
        <div class="reportData-box" v-else>
          <p class="title">申报数据</p>
          <div class="sureData-box">
            <div class="row">
              <span>Summe（含税销售额）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.includTaxAmtTotal }}</span>
            </div>
            <div class="row">
              <span>Netto（不含税销售额）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.excludeTaxAmtTotal }}</span>
            </div>
            <div class="row">
              <span>Umsatzsteuer（销项税额）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.taxAmtTotal }}</span>
            </div>
            <div class="row">
              <span>Vorsteuer（抵扣金额）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.deductionAmt }}</span>
            </div>
            <div class="row">
              <span>Guthaben（最终应缴税金）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.taxTotal }}</span>
            </div>
          </div>
        </div>
        <div class="reportData-box"  v-if="addFrom.countryCode == 'DE' && addFrom.otherEcAcqPrice">
          <p class="title">采购金额</p>
          <div class="sureData-box">
            <div class="row">
              <span>采购金额</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ addFrom.otherEcAcqPrice }}</span>
            </div>
          </div>
        </div>
        <!-- gsw 新增西班牙ecl的申报 -->
        <div class="reportData-box" v-if="addFrom.countryCode == 'ES' && addFrom.isEcl == 1">
          <p class="title">ECL数据</p>
          <div class="sureData-box">
            <div class="row">
              <span>采购项</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.eclPurchasePrice }}</span>
            </div>
            <div class="row">
              <span>销售项</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{returnTaxData.eclSalePrice }}</span>
            </div>
          </div>
        </div>
      </div>
      <Divider class="submitModal-footer-line" />
      <div slot="footer">
        <Button class="footerBtClose" @click="submitModal = false">取消</Button>
        <Button class="footerBt" type="primary" @click="submit">确认</Button>
      </div>
    </Modal>
    <Modal v-model="sampleModel" width="900" footer-hide>
      <div slot="header" style="height: 14px"></div>
      <img src="https://fdfs.itaxs.com/group1/M00/02/74/rBLKNV9EfgiAPou7AAEqLTd9xwM661.png" alt="" />
    </Modal>
    <Modal v-model="DEtipsModal" :width="560">
      <p slot="header" class="DEtipsModal-header">温馨提示</p>
      <p class="DEtipsModal-content">
        根据德国税局官方最新增值税政策，从2020-7-1至2020-12-31增值税
        <br />
        税率从19%调整为16%，在此期间，您可以选择16%税率进行申报；
        <br />
        （若申报2020-7-1之前数据，请选择19%税率）
      </p>
      <div slot="footer" class="DEtipsModal-footer">
        <Button type="primary" @click="DEtipsModal = false">知道了</Button>
      </div>
    </Modal>

    <!-- gsw 手动添加销售额 -->
    <Modal v-model="eclSellAmountModal" title="手动添加销售项" width="640" class="submit-box">
      <div style="margin-right: 80px">
        <table class="ecl-table">
          <thead>
            <tr>
              <th>对方税号</th>
              <th>销售金额（欧元）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in eclSalePriceInfos" :key="index">
              <td>
                <Input v-model="item.taxNumber" placeholder="请输入对方税号" maxlength="50" />
              </td>
              <td>
                <!-- /^(\-|\+)?\d+(\.\d{0,2})?$/ 正则输入正数，负数和最多2位小数 -->
                <InputNumber
                  :active-change="false"
                  v-model="item.taxAmt"
                  placeholder="请输入销售金额（欧元）"
                  style="width: 100%"
                  :precision="2"
                  @on-change="clacuSellAmount"
                ></InputNumber>
                <!-- 操作按钮 -->
                <div class="ecl-operate">
                  <Icon
                    size="28"
                    v-if="eclSalePriceInfos.length > 1"
                    @click="handleRemoveEclSell(index)"
                    class="ecl-line-remove"
                    type="md-remove-circle"
                  />
                  <Icon
                    size="28"
                    v-if="index == eclSalePriceInfos.length - 1"
                    @click="handleAddEclSell"
                    class="ecl-line-add"
                    type="md-add-circle"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="font-size: 16px">
          总计：
          <span style="font-weight: bold">{{ eclSalePrice }} 欧元</span>
        </div>
      </div>
      <div slot="footer">
        <Button class="footerBtClose" @click="eclSellAmountModal = false">取消</Button>
        <Button class="footerBt" type="primary" @click="submitSellAmount">确认</Button>
      </div>
    </Modal>
    <!-- gsw 手动添加采购项 -->
    <Modal v-model="eclBuyAmountModal" title="手动添加采购项" width="640" class="submit-box">
      <div style="margin-right: 80px">
        <table class="ecl-table">
          <thead>
            <tr>
              <th>对方税号</th>
              <th>销售金额（欧元）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in eclPurchasePriceInfos" :key="index">
              <td>
                <Input v-model="item.taxNumber" placeholder="请输入对方税号" maxlength="50" />
              </td>
              <td>
                <!-- /^(\-|\+)?\d+(\.\d{0,2})?$/ 正则输入正数，负数和最多2位小数 -->
                <InputNumber
                  :active-change="false"
                  :precision="2"
                  v-model="item.taxAmt"
                  placeholder="请输入采购金额（欧元）"
                  style="width: 100%"
                  @on-blur="clacuBuyAmount"
                ></InputNumber>
                <!-- 操作按钮 -->
                <div class="ecl-operate">
                  <Icon
                    size="28"
                    v-if="eclPurchasePriceInfos.length > 1"
                    @click="handleRemoveEclBuy(index)"
                    class="ecl-line-remove"
                    type="md-remove-circle"
                  />
                  <Icon
                    size="28"
                    v-if="index == eclPurchasePriceInfos.length - 1"
                    @click="handleAddEclBuy"
                    class="ecl-line-add"
                    type="md-add-circle"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="font-size: 16px">
          总计：
          <span style="font-weight: bold">{{ eclPurchasePrice }} 欧元</span>
        </div>
      </div>
      <div slot="footer">
        <Button class="footerBtClose" @click="eclBuyAmountModal = false">取消</Button>
        <Button class="footerBt" type="primary" @click="submitBuyAmount">确认</Button>
      </div>
    </Modal>


  </div>
</template>
<script>
import {
  getTaxMingxi,
  getProduct,
  getTaxRate,
  taxCountry,
  calculationTaxSale,
  calculationTaxSaleIndexPageNew,
  submitTaxdate,
  submitTaxIoss,
  submitTaxDiscount,
  calculationTaxSaleIndexPage,
  taxLogDetail,
  baseInfoByCondition,
  discountList,
  calcuAmazon,
  calcuEbay,
  calcuIoss,
} from "@/api/taxModule";
import { json } from "mathjs";
export default {
  data() {
    return {
      isUpload:false,
      eclBuyAmountModal:false,
      eclSellAmountModal:false,
      // 所有销售报告类型
      servicesId: this.$route.query.servicesId,
      vatTaxNumber: this.$route.query.vatTaxNumber,
      endTime: this.$route.query.endTime,
      b2bType: false,
      isBeforeYear: false,
      a: undefined,
      beginTime: this.$route.query.beginTime,
      workId: this.$route.query.workId,
      taxDeclarationDeadline: this.$route.query.taxDeclarationDeadline,
      allsaleType: [],
      loadBtnAuto: false, // 自动计算loading
      loadClient: false, // 客户确认loading
      getContentModel: false, // 如何获取按钮 弹窗
      otherSellModal: false, // 其他平台含税销售文件弹框
      sureApplyDataModal: false, // 确认其他平台含税销售额文件信息
      loadNext: false,
      submitModal: false, //确认提交弹窗
      stepIndex: 0, // 步骤
      giveFrom: {},
      ifE: false, // 是否英国
      ruleGiveFrom: {
        tfnCountryCode: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一个国家",
            trigger: "change",
          },
        ],
      },
      // 添加其他平台含税销售额
      otherSellForm: {
        otherSaleFileUrl: "",
      },
      otherSellFormRules: {
        otherSaleFileUrl: [
          {
            required: "true",
            message: "请上传其它平台含税销售文件",
            trigger: "change",
          },
        ],
      },
      contentStyleObj: {
        height: "",
      },
      social: ["facebook", "github"],
      otherPlatformsMadal: false,
      otherPlatformsForm: {
        otherSaleFileUrl: "",
        otherIncludTaxAmt: "",
        origFileName: "",
      },
      otherPlatformsFormObj: {
        otherSaleFileUrl: "",
        otherIncludTaxAmt: "",
        origFileName: "",
      },
      otherPlatformsRules: {
        otherIncludTaxAmt: [{ required: "true", message: "请输入含税销售额", trigger: "change" }],
        otherSaleFileUrl: [
          {
            required: "true",
            message: "请上传其它平台含税销售文件",
            trigger: "change",
          },
        ],
      },
      modelAddCom: false,
      loadingget: false,
      loadingRemark: false,
      currency: "", // 货币单位
      defaultList: [],
      uploadList: [],
      imgName: "",
      visible: false,
      fileUpload: this.ImgUrl,
      // action
      addFrom: {
        otherEcAcqPrice: 0,
        otherEcAcqPriceFile:'',
        countryCode: this.$route.query.countryCode,
        iossCountryCode: "",
        declareRule: "0",
        saleFileUrl: "",
        taxRate: "",
        tfnCountryCode: [],
        workId: this.$route.query.workId,
        periodType: String(this.$route.query.periodType),
        salePlatformType: "",
        oss: "",
        ioss: "",
        isShop: 0,
        isEcl: "",// 是否进行ECL申报
        amx_file_url: "",
        xiaoshouUrl: "",
        eclPurchasePriceInfos:[],
        eclSalePriceInfos:[],
        eclPurchasePrice: 0,
        eclSalePrice: 0,
      },
      ruleAddFrom: {
        declareRule: { required: "true", message: "请选择计税方式", trigger: "change" },
        countryCode: { required: "true", message: "请选择需要报税的国家", trigger: "change" },
        taxRate: { required: "true", message: "请选择税率", trigger: "change" },
        saleFileUrl: { required: "true", message: "请上传对应的文件", trigger: "change" },
        salePlatformType: { required: "true", message: "请选择销售平台", trigger: "change" },
        otherEcAcqPrice: { required: "true", message: "请输入采购金额 ", trigger: "change" },
        periodType: { required: "true", message: "请选择报税周期", trigger: "change" },
        oss: { required: "true", message: "请选择是否有OSS税号", trigger: "change" },
        ioss: { required: "true", message: "请选择是否有IOSS税号", trigger: "change" },
        isEcl: { required: "true", message: "请选择是否ECL申报", trigger: "change" },
      },
      allFacilitator: "",
      taxType: 0,
      // all country
      allcountryList: [],
      allcountryList1: [],
      omCountryList: [], // 欧盟国家
      otherOmCountryList: [], // ioss其他平台含税销售额的国家列表
      sureOtherSellList: [], // 确定的其他平台销售额数据
      taxTypes: [
        { value: 0, label: "目的国" },
        { value: 1, label: "发出国" },
        // { value: 2, name: "零申报" }
      ],
      // 核算税金
      typeNow: "",
      tableFiles: [{ fileList: "" }],
      taxRateList: [],
      checkedTaxCountry: [],
      AmzFileList: [],
      lingFileList: [],
      discountData: [
        {
          deductionType: "",
          billDate: "",
          deductiontAmt: "",
          deductionFile: "", //url
          fileOriginalName: "", //name
        },
      ],
      statusModel: false, // 远程销售model
      returnDataSale: [], // 远程销售数据
      returnColumnSale: [
        // 远程销售表头
        {
          title: "到货国",
          key: "arrivalCode",
          width: 120,
        },
        {
          title: "货币单位",
          key: "currency",
          width: 120,
        },
        {
          title: "1月",
          key: "01",
          width: 120,
        },
        {
          title: "2月",
          key: "02",
          width: 120,
        },
        {
          title: "3月",
          key: "03",
          width: 120,
        },
        {
          title: "4月",
          key: "04",
          width: 120,
        },
        {
          title: "5月",
          key: "05",
          width: 120,
        },
        {
          title: "6月",
          key: "06",
          width: 120,
        },
        {
          title: "7月",
          key: "07",
          width: 120,
        },
        {
          title: "8月",
          key: "08",
          width: 120,
        },
        {
          title: "9月",
          key: "09",
          width: 120,
        },
        {
          title: "10月",
          key: "10",
          width: 120,
        },
        {
          title: "11月",
          key: "11",
          width: 120,
        },
        {
          title: "12月",
          key: "12",
          width: 120,
        },
        {
          title: "含税销售额",
          slot: "includTaxPriceTotal",
          width: 120,
        },
        {
          title: "远程销售限额",
          key: "moneyLimit",
          width: 120,
        },
      ],
      // ioss的其他平台含税销售额表格
      otherOmColumns: [
        {
          title: "欧盟国家",
          key: "countryName",
        },
        {
          title: "简称",
          key: "countryCode",
        },
        {
          title: "含税销售额",
          slot: "includTaxPrice",
        },
        {
          title: "币种单位",
          key: "currency",
        },
      ],
      discountColumns: [
        {
          width: "80px",
          title: "序号",
          render(h, params) {
            return h("span", params.row._index + 1);
          },
        },
        {
          title: "抵扣类型",
          render: (h, params) => {
            let discountTypeArr = [];
            // console.log(this.addFrom.countryCode)
            if (this.addFrom.countryCode == "SA" || this.addFrom.countryCode == "AE") {
              discountTypeArr = [...this.discountTypeListSA];
            } else if (this.addFrom.countryCode == "GB") {
              discountTypeArr = [...this.discountTypeListGB];
            } else {
              discountTypeArr = [...this.discountTypeList];
            }
            return h(
              "Select",
              {
                props: {
                  value: params.row.deductionType,
                  placeholder: "选择抵扣类型",
                },
                on: {
                  "on-change": (event) => {
                    this.discountData[params.index].deductionType = event;
                    if (event == 4) {
                      this.b2bType = true;
                    }
                  },
                },
              },
              discountTypeArr.map((item) => {
                return h("Option", {
                  props: {
                    value: item.label,
                    label: item.val,
                  },
                });
              })
            );
          },
        },
        {
          title: "单据日期",
          slot: "declareDate",
        },
        {
          title: "抵扣金额",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.deductiontAmt,
                size: "small",
                placeholder:
                  this.addFrom.countryCode == "GB"
                    ? "GBP"
                    : this.addFrom.countryCode == "SA"
                    ? ""
                    : this.addFrom.countryCode == "AE"
                    ? ""
                    : "EUR",
              },
              on: {
                input: (val) => {
                  this.discountData[params.index].deductiontAmt = val;
                },
              },
            });
          },
        },
        {
          title: "上传凭证",
          slot: "uploadBox",
        },
      ],
      discountTypeList: [
        {
          val: "C79/88",
          label: 1,
        },
        {
          val: "发票抵扣",
          label: 2,
        },
        {
          val: "B2B发票",
          label: 4,
        },
        {
          val: "其它",
          label: 3,
        },
      ],
      discountTypeListGB: [
        {
          val: "C79/88",
          label: 1,
        },
        {
          val: "发票抵扣",
          label: 2,
        },
        {
          val: "PVA",
          label: 4,
        },
        {
          val: "其它",
          label: 3,
        },
      ],
      discountTypeListSA: [
        {
          val: "平台佣金",
          label: 11,
        },
        {
          val: "运费",
          label: 12,
        },
        {
          val: "仓储费",
          label: 13,
        },
        {
          val: "推广费",
          label: 14,
        },
        {
          val: "其它",
          label: 3,
        },
      ],
      currencySign: "", //税金币种符号
      deductionAmt: 0, //可抵扣总金额
      returnData: [],
      returnColumns: [
        {
          title: "销售月份",
          render: (h, params) => {
            return h("span", params.row.month);
          },
        },
        {
          title: "发出国",
          key: "departCode",
        },
        {
          title: "到货国",
          key: "arrivalCode",
        },
        {
          title: "币种",
          key: "currency",
        },
        {
          title: "汇率",
          key: "rate",
        },
        {
          title: "含税销售额",
          render: (h, params) => {
            return h("span", this.currencySign + params.row.includTaxPrice);
          },
        },
      ],
      returnTaxData: {},
      rateList: {},
      taxTypeRadio: "",
      isLogin: false,
      isSelectCountry: false,
      declareList: [],
      nowPath: this.$route.path,
      salesListAE: [
        { key: "0", value: "亚马逊" },
        { key: "1", value: "NOON" },
      ],
      salesListSA: [
        { key: "0", value: "亚马逊" },
        { key: "1", value: "NOON" },
        { key: "2", value: "Souq" },
        { key: "3", value: "执御" },
      ],
      returnDataAE: [],
      returnColumnsAE: [
        {
          title: "序号",
          width: 80,
          type: "index",
        },
        {
          title: "日期",
          key: "moth",
        },
        {
          title: "收货人",
          key: "consignee",
        },
        {
          title: "辖区",
          key: "city",
        },
        {
          title: "含税销售额",
          key: "includTaxPrice",
        },
        {
          title: "不含税销售额",
          key: "excludeTaxPrice",
        },
        {
          title: "税率",
          key: "rate",
          render(h, params) {
            let rate = params.row.rate;
            return h("span", rate + "%");
          },
        },
        {
          title: "应缴税金",
          key: "allTaxPrice",
        },
      ],
      taxNumInfo: {},
      postData: {}, //提交的数据
      ifAEorSA: false,
      fileType: "",
      sampleModel: false,
      DEtipsModal: false,
      countryNameEn: "",
      spinShow: false,
      operateText: "上传文件中，请稍后",
      detailData: [],
      newMonth: false,
      deductionStatus: false, //用于控制 申报驳回的状态

      // 西班牙ECL申报
      // 销售项
      eclSellAmountModal: false, // ecl销售项金额
      eclSalePrice: 0, // 销售项总额
      eclSalePriceInfos: [
        {
          taxNumber: "",
          taxAmt: null,
        },
      ],
      // 采购项
      eclBuyAmountModal: false, // ecl采购项金额
      eclPurchasePrice: 0, // 采购项总额
      eclPurchasePriceInfos: [
        {
          taxNumber: "",
          taxAmt: null,
        },
      ],
    };
  },
  computed:{
    eclSalePriceTotal: function () {
      return Number(this.eclSalePrice)  + Number(this.returnTaxData.eclSalePrice)
    },
    eclPurchasePriceTotal: function () {
      return Number(this.eclPurchasePrice) + Number(this.returnTaxData.eclPurchasePrice)
    },
  },
  created() {
    if (localStorage.getItem("sessionId") && localStorage.getItem("token")) {
      this.isLogin = true;
    }
    if (this.endTime && parseInt(this.endTime.slice(0, 4)) < 2021) {
      this.isBeforeYear = true;
    }
    if (this.endTime && parseInt(this.endTime.slice(0, 4)) >= 2021 && parseInt(this.endTime.slice(5, 7)) >= 7) {
      this.newMonth = true;
    }
    this.getDiscountList()
  },
  methods: {
    downLoadMingxi(name) {
      if (this.currencySign == "") {
        this.$Message.error("请先核算税金");
        return;
      }
      let self = this;
      let formData = new FormData();
      if (this.addFrom.countryCode != "SA" && this.addFrom.countryCode != "AE") {
        this.spinShow = true;
        this.operateText = "正在下载明细，请稍后";
        for (let i = 0; i < this.returnData.length; i++) {
          this.returnData[i].currencySign = this.currencySign;
        }
        formData.append("taxSaleData", JSON.stringify(this.returnData));
      }
      if (this.addFrom.countryCode == "AE") {
        this.spinShow = true;
        this.operateText = "正在下载明细，请稍后";
        for (let i = 0; i < this.returnDataAE.length; i++) {
          this.returnDataAE[i].currencySign = this.currencySign;
        }
        formData.append("taxAeData", JSON.stringify(this.returnDataAE));
      }
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("post", this.baseUrl + "/etax/derive/client/calculation/export/list", true);
      // 设置请求token
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (content) {
          fileName = "销售数据报表.xlsx";
          self.spinShow = false;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          return;
        }
        // console.log(xmlResquest.getResponseHeader('content-disposition'))
        // if (xmlResquest.getResponseHeader('content-disposition')) {
        //   fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(";")[1].split("=")[1]);
        //   self.spinShow = false
        // } else {
        //   self.$Message.warning('下载出错！');
        //   self.spinShow = false
        //   return;
        // }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";
        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
        self.spinShow = false;
      };
      xmlResquest.send(formData);
    },
    getInfo(countryCode) {
      //获取申报周期
      this.declareList = [];
      baseInfoByCondition({ countryCode }).then((res) => {
        if (res.code == 0) {
          this.countryNameEn = res.data.countryNameEn;
          this.vatNumberPrefix = res.data.vatNumberPrefix;
          this.vatNumberSuffixDigitLength = res.data.vatNumberSuffixDigitLength;

          let data = res.data;
          // ioss的报税周期只有月报
          if (this.addFrom.countryCode == "IOSS") {
            this.declareList.push({ type: "月报", status: "0" });
          } else {
            if (data.monthPeriod === 0) this.declareList.push({ type: "月报", status: "0" });
            if (data.quarterPeriod === 0) this.declareList.push({ type: "季报", status: "1" });
            if (data.yearPeriod === 0) this.declareList.push({ type: "年报", status: "2" });
          }
        }
      });
      if (this.servicesId !== "" && this.servicesId !== undefined) {
        taxLogDetail({ servicesId: this.servicesId }).then((res) => {
          if (res.code === 0) {
            this.taxNumInfo = res.data[0];
            if (this.addFrom.countryCode == "IOSS") {
              this.addFrom.iossCountryCode = this.taxNumInfo.iossCountryCode;
            }
            if (
              this.taxNumInfo.status === 24 &&
              (this.taxNumInfo.countryCode === "AT" || this.taxNumInfo.countryCode === "CZ")
            ) {
              this.getDiscountList();
              this.otherPlatformsFormObj.otherSaleFileUrl = this.taxNumInfo.otherSaleFileUrl;
              this.otherPlatformsFormObj.otherIncludTaxAmt = this.taxNumInfo.otherIncludTaxAmt;
              this.otherPlatformsFormObj.origFileName = this.taxNumInfo.origFileName;
              this.deductionStatus = true;
              this.addFrom.declareRule = String(this.taxNumInfo.declareRule);
              this.addFrom.saleFileUrl = this.taxNumInfo.sellFile;
              this.addFrom.taxRate = String(this.taxNumInfo.taxRate);
            }
          }
        });
      }
    },
    getBaseInfo() {
      const self = this;
      this.allcountryList = [];
      getProduct({ functionCode: 2 }).then((res) => {
        if (res.code === 0) {
          res.data.map((v, i) => {
            if (v.status == 0) {
              self.allcountryList.push(v);
            }
          });
        }
      });
      getTaxRate().then((res) => {
        if (res.code === 0) {
          // console.log(res.data)
          // this.taxRateList=res.data.GB[0]
          this.rateList = res.data;
          this.changeCountry(this.$route.query.countryCode);
        }
      });
      taxCountry().then((res) => {
        if (res.code === 0) {
          this.allcountryList1 = res.data;
          // 筛选出欧盟国家
          let omCountry = [];
          res.data.forEach((v) => {
            if (v.isOm == 1) {
              v.includTaxPrice = "0.00";
              omCountry.push(v);
            }
          });
          this.omCountryList = omCountry;
          this.otherOmCountryList = omCountry;
          console.log(this.otherOmCountryList)
          // this.renderIossCountryList();
        }
      });
    },
    /**
     * 渲染ioss申报算税的抵扣国家
     */
    renderIossCountryList() {
      // gsw 如果是ioss的，抵扣项表格多一列抵扣国家，并且删除抵扣类型
      if (this.addFrom.countryCode == "IOSS") {
        this.discountColumns.splice(1, 0, {
          title: "抵扣国家",
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: params.row.countryCode,
                  placeholder: "选择国家",
                },
                on: {
                  "on-change": (event) => {
                    this.discountData[params.index].countryCode = event;
                  },
                },
              },
              this.omCountryList.map((item) => {
                return h("Option", {
                  props: {
                    value: item.countryCode,
                    label: item.countryName,
                  },
                });
              })
            );
          },
        });
        this.discountColumns.splice(2, 1);
      }
    },
    changeDeclareRule(val) {
      if (val == "AE" || val == "SA") {
        this.addFrom.saleFileUrl = "";
        this.$refs.otherPlatformsUpload.clearFiles();
      }
      if (val == 2) {
        this.addFrom.saleFileUrl = this.addFrom.amx_file_url;
      } else {
        this.addFrom.saleFileUrl = this.addFrom.xiaoshouUrl;
      }
      // console.log(val)
      // this.addFrom.saleFileUrl = ''
      // this.AmzFileList = []
    },
    changeCountry(val) {
      this.addFrom.tfnCountryCode = [];
      this.addFrom.tfnCountryCode.push(val);
      let countryList = Object.getOwnPropertyNames(this.rateList);
      this.addFrom.saleFileUrl = "";
      this.addFrom.oss = "";
      this.addFrom.ioss = "";
      countryList.forEach((v, i) => {
        if (val === v) {
          this.taxRateList = this.rateList[val][0];
          this.$nextTick(() => {
            if (this.addFrom.countryCode === "GB") {
              // this.taxRateList = this.taxRateList.filter(item=>item.taxRate == 20)
              this.addFrom.taxRate = "20";
            } else if (this.addFrom.countryCode === "DE") {
              if (!this.isBeforeYear) {
                this.taxRateList = this.taxRateList.filter((item) => item.taxRate == 19);
                this.addFrom.taxRate = "19";
              } else {
                this.addFrom.taxRate = "16";
              }
            } else {
              this.addFrom.taxRate = String(this.taxRateList[0].taxRate);
            }
          });
        }
      });
      if (val != undefined) {
        this.getInfo(val);
        this.addFrom.taxRate = "";
        this.addFrom.saleFileUrl = "";
        this.addFrom.xiaoshouUrl = "";
        this.addFrom.amx_file_url = "";
        //   this.$refs.upload.clearFiles();
        this.AmzFileList = [];
        this.lingFileList = [];
      }
      if (!this.isSelectCountry) {
        if (val == "AE" || val == "SA") {
          this.ifAEorSA = true;
        } else {
          this.ifAEorSA = false;
        }
      }
    },
    // 添加公司
    giveok(all) {
      let self = this;
      this.$refs[all].validate((valid) => {
        if (valid) {
          const self = this;
          this.checkedTaxCountry = [];
          // console.log(this.checkedTaxCountry)
          this.addFrom.tfnCountryCode.map((v, i) => {
            self.allcountryList1.map((val, index) => {
              if (v == val.countryCode) {
                self.checkedTaxCountry.push(val.countryName);
                // self.addFrom.tfnCountryCode.push(val.countryName)
              }
            });
          });
          self.modelAddCom = false;
        } else {
        }
      });
    },
    // 公司所有公司数据
    addCountry1() {
      this.modelAddCom = true;
    },
    // 所选公司
    countrys(arr) {
      this.addFrom.tfnCountryCode = arr;
    },
    // 统一错误处理，隐藏loading
    handleUploadError(res, file, fileList) {
      this.$Message.warning("上传文件失败，请重新上传");
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
    },

    // otherEc
    handleAmzSuccessotherEc(response, file, fileList) {
      console.log(response, file, fileList);
      if (response && response.data) {
        this.addFrom.otherEcAcqPriceFile = response.data.fileUrl;
        this.fileType = response.data.suffix;
      } else {
        // 上传失败清空上传的
        this.addFrom.otherEcAcqPriceFile = "";
        this.fileType = "";
        this.$Message.warning("上传文件失败，请重新上传");
      }
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
    },

    // ymx file
    handleAmzSuccess(response, file, fileList) {
      if (response && response.data) {
        this.addFrom.saleFileUrl = response.data.fileUrl;
        this.addFrom.xiaoshouUrl = response.data.fileUrl;
        this.AmzFileList = fileList;
        this.fileType = response.data.suffix;
      } else {
        // 上传失败清空上传的
        this.addFrom.saleFileUrl = "";
        this.addFrom.xiaoshouUrl = "";
        this.addFrom.otherEcAcqPrice = 0;
        this.AmzFileList = [];
        this.fileType = "";
        this.$Message.warning("上传文件失败，请重新上传");
      }
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
    },
    handleAmzSuccessLing(response, file, fileList) {
      if (response && response.data) {
        this.addFrom.saleFileUrl = response.data.fileUrl;
        this.addFrom.amx_file_url = response.data.fileUrl;
        this.lingFileList = fileList;
        this.fileType = response.data.suffix;
      } else {
        // 上传失败清空上传的
        this.addFrom.saleFileUrl = "";
        this.addFrom.amx_file_url = "";
        this.lingFileList = [];
        this.fileType = "";
        this.$Message.warning("上传文件失败，请重新上传");
      }
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
    },

    handleAmzSuccessPlatform(response, file, fileList) {
      console.log(response);
      this.otherPlatformsForm.origFileName = response.data.origFileName;
      this.otherPlatformsForm.otherSaleFileUrl = response.data.fileUrl;
    },


    handleAmzSuccessPlatform(response, file, fileList) {
      console.log(response);
      this.otherPlatformsForm.origFileName = response.data.origFileName;
      this.otherPlatformsForm.otherSaleFileUrl = response.data.fileUrl;
    },

    handleAmzRemoveFilePlatform() {
      this.otherPlatformsForm.otherSaleFileUrl = "";
    },

    handleAmzBeforeUploadPlatform() {
      const check = this.otherPlatformsForm.otherSaleFileUrl == "";
      if (!check) {
        this.$Notice.warning({
          title: "最多上传一个文件",
        });
      }
      return check;
    },
    submitPlatformsForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.otherPlatformsForm.otherIncludTaxAmt < 0) {
            this.$Message.error("请输入正确的含税销售额");
            return;
          }
          this.otherPlatformsFormObj = this.otherPlatformsForm;
          this.otherPlatformsMadal = false;
        }
      });
    },
    addDiscount() {
      let obj = {
        deductionType: "",
        billDate: "",
        deductiontAmt: "",
        deductionFile: "", //url
        fileOriginalName: "", //name
      };
      // if (this.addFrom.countryCode == "IOSS") {
      //   obj.countryCode = "";
      // }
      this.discountData.push(obj);
    },
    deleteItem(row) {
      this.discountData.splice(row._index, 1);
    },
    changeDate(date, row) {
      this.discountData[row._index].billDate = date + " 00:00:00";
    },
    changeTaxPrice(row, index) {
      this.otherOmCountryList[index].includTaxPrice = row.includTaxPrice;
      this.$forceUpdate();
    },
    handleSuccess(res, file, fileList, row) {
      this.discountData[row._index].deductionFile = res.data.fileUrl;
      this.discountData[row._index].fileOriginalName = file.name;
    },
    handleAmzRemoveFile() {
      this.addFrom.xiaoshouUrl = "";
      this.addFrom.saleFileUrl = "";
      this.AmzFileList = [];
    },
    handleAmzRemoveFileotherEc(){
      this.addFrom.otherEcAcqPriceFile = "";
    },

    handleAmzRemoveFileLing() {
      this.addFrom.amx_file_url = "";
      this.addFrom.saleFileUrl = "";
      this.lingFileList = [];
    },
    handleAmzBeforeUpload() {
      const check = this.addFrom.xiaoshouUrl == "";
      // console.log(this.AmzFileList)
      if (!check) {
        this.$Notice.warning({
          title: "最多上传一个文件",
        });
      }
      return check;
    },

    handleAmzBeforeUploadEc() {
      const check = this.addFrom.otherEcAcqPriceFile == "";
      // console.log(this.AmzFileList)
      if (!check) {
        this.$Notice.warning({
          title: "最多上传一个文件",
        });
      }
      return check;
    },

    handleAmzBeforeUploadLing() {
      const check = this.addFrom.amx_file_url == "";
      // console.log(this.AmzFileList)
      if (!check) {
        this.$Notice.warning({
          title: "最多上传一个文件",
        });
      }
      return check;
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超过文件大小限制",
        desc: "上传文件不超过100M",
      });
    },
    handleBeforeUpload() {
      const check = this.tableFiles[0].fileList.length < 1;
      if (!check) {
        this.$Notice.warning({
          title: "最多上传一个文件",
        });
      }
      return check;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件类型错误",
        desc: "只支持xls、xlsx、csv、txt",
      });
    },

    handleFormatErrorEc(file) {
      this.$Notice.warning({
        title: "文件类型错误",
        desc: "只支持pdf, jpg, png, rar, zip",
      });
    },

    handleFormatErrors(file) {
      this.$Notice.warning({
        title: "文件类型错误",
        desc: "只支持jpg、png、pdf、jpeg、docx、word",
      });
    },
    handleRemoveFile(file, fileList, row) {
      if (typeof row == "number") {
        this.discountData[row].deductionFile = "";
        this.discountData[row].fileOriginalName = "";
        return;
      }
      this.discountData[row._index].deductionFile = "";
      this.discountData[row._index].fileOriginalName = "";
    },
    //核算税金
    checkTax() {
      if (this.addFrom.saleFileUrl === "" && this.otherPlatformsFormObj.otherSaleFileUrl === "") {
        this.$Message.info("请上传销售额文件");
        return;
      }
      this.addFrom.deductionItems = this.discountData;
      if (this.addFrom.countryCode == undefined) {
        this.$Message.info("请选择国家");
        return;
      }
      if (this.addFrom.taxRate == "") {
        this.$Message.info("请选择税率");
        return;
      }
      if (this.addFrom.periodType === "undefined") {
        this.$Message.info("请选择申报周期");
        return;
      }
      if (
        this.addFrom.oss === "" &&
        this.addFrom.countryCode != "GB" &&
        this.addFrom.countryCode != "SA" &&
        this.addFrom.countryCode != "AE" &&
        ((this.isSelectCountry && this.newMonth) || !this.isSelectCountry)
      ) {
        this.$Message.info("请选择是否有OSS税号");
        return;
      }
      if (
        this.addFrom.ioss === "" &&
        this.addFrom.countryCode != "GB" &&
        this.addFrom.countryCode != "SA" &&
        this.addFrom.countryCode != "AE" &&
        ((this.isSelectCountry && this.newMonth) || !this.isSelectCountry)
      ) {
        this.$Message.info("请选择是否有IOSS税号");
        return;
      }
      // 如果是西班牙的，则必须选择是否选择Ecl
      if (this.addFrom.countryCode == "ES" && this.addFrom.isEcl == '') {
        this.$Message.info("请选择是否申报ECL");
        return;
      }
      let data = { ...this.addFrom };
      data.otherIncludTaxAmt = this.otherPlatformsFormObj.otherIncludTaxAmt;
      data.otherSaleFileUrl = this.otherPlatformsFormObj.otherSaleFileUrl;
      data.servicesId = this.servicesId;
      data.vatTaxNumber = this.vatTaxNumber;
      data.endTime = this.endTime;
      // console.log('data', data)
      this.$refs["addFrom"].validate((valid) => {
        if (valid) {
          this.spinShow = true;
          this.operateText = "正在计算税金，请稍后";

          // 从申报页面进入
          if (this.servicesId != undefined) {
            // 是欧盟国家，并且7月份之后的会出现选择amazon，ebay，其他，用的是新算法
            if (
              this.addFrom.countryCode != "GB" &&
              this.addFrom.countryCode != "SA" &&
              this.addFrom.countryCode != "AE"
            ) {
              // 7月份之后新算法
              if (this.newMonth) {
                // 选择amazon和其他，用一样的新算法
                if (this.addFrom.salePlatformType == "0" || this.addFrom.salePlatformType == "5") {
                  calcuAmazon(data)
                    .then((res) => {
                      if (res.code == 0) {
                        this.currencySign = res.data.currencySign;
                        this.deductionAmt = res.data.deductionAmt;
                        this.returnTaxData = res.data;
                        if (res.data.saleCheckInfos != undefined) {
                          this.returnData = res.data.saleCheckInfos;
                        }
                        if (this.addFrom.countryCode == "AE") {
                          this.returnDataAE = res.data.aeSaleDateInfo;
                        }
                      }
                      this.spinShow = false;
                    })
                    .catch((error) => {
                      this.spinShow = false;
                    });
                }
                // 选择ebay
                else if (this.addFrom.salePlatformType == "4") {
                  calcuEbay(data)
                    .then((res) => {
                      if (res.code == 0) {
                        this.currencySign = res.data.currencySign;
                        this.deductionAmt = res.data.deductionAmt;
                        this.returnTaxData = res.data;
                        if (res.data.saleCheckInfos != undefined) {
                          this.returnData = res.data.saleCheckInfos;
                        }
                        if (this.addFrom.countryCode == "AE") {
                          this.returnDataAE = res.data.aeSaleDateInfo;
                        }
                      }
                      this.spinShow = false;
                    })
                    .catch((error) => {
                      this.spinShow = false;
                    });
                }
                // 其他
                else {
                  calculationTaxSaleIndexPage(data)
                    .then((res) => {
                      if (res.code == 0) {
                        this.currencySign = res.data.currencySign;
                        this.deductionAmt = res.data.deductionAmt;
                        this.returnTaxData = res.data;
                        if (res.data.saleCheckInfos != undefined) {
                          this.returnData = res.data.saleCheckInfos;
                        }
                        if (this.addFrom.countryCode == "AE") {
                          this.returnDataAE = res.data.aeSaleDateInfo;
                        }
                      }
                      this.spinShow = false;
                    })
                    .catch((error) => {
                      this.spinShow = false;
                    });
                }
              }
              // 7月份之前老算法
              else {
                calculationTaxSaleIndexPage(data)
                  .then((res) => {
                    if (res.code == 0) {
                      this.currencySign = res.data.currencySign;
                      this.deductionAmt = res.data.deductionAmt;
                      this.returnTaxData = res.data;
                      if (res.data.saleCheckInfos != undefined) {
                        this.returnData = res.data.saleCheckInfos;
                      }
                      if (this.addFrom.countryCode == "AE") {
                        this.returnDataAE = res.data.aeSaleDateInfo;
                      }
                    }
                    this.spinShow = false;
                  })
                  .catch((error) => {
                    this.spinShow = false;
                  });
              }
            } else {
              // 非欧盟国家
              calculationTaxSale(data)
                .then((res) => {
                  if (res.code == 0) {
                    this.currencySign = res.data.currencySign;
                    this.deductionAmt = res.data.deductionAmt;
                    this.remoteSaleCheckInfos = res.data.remoteSaleCheckInfos;
                    this.returnTaxData = res.data;
                    if (this.addFrom.countryCode != "SA" && this.addFrom.countryCode != "AE") {
                      this.returnData = res.data.saleCheckInfos;
                      this.returnDataSale = res.data.saleCheckInfoVos;
                    }
                    if (this.addFrom.countryCode == "AE") {
                      this.returnDataAE = res.data.aeSaleDateInfo;
                    }
                    this.spinShow = false;
                  }
                })
                .catch((error) => {
                  this.spinShow = false;
                });
            }
          }

          // 从vat算税页面进入
          else {
            // 是欧盟国家
            if (
              this.addFrom.countryCode != "GB" &&
              this.addFrom.countryCode != "SA" &&
              this.addFrom.countryCode != "AE"
            ) {
              // 欧盟的显示选择amazon，ebay，其他，用的是新算法
              // 选择amazon，其他， 用一样的新算法接口
              if (this.addFrom.salePlatformType == "0" || this.addFrom.salePlatformType == "5") {
                calcuAmazon(data)
                  .then((res) => {
                    if (res.code == 0) {
                      this.currencySign = res.data.currencySign;
                      this.deductionAmt = res.data.deductionAmt;
                      this.returnTaxData = res.data;
                      if (res.data.saleCheckInfos != undefined) {
                        this.returnData = res.data.saleCheckInfos;
                      }
                      if (this.addFrom.countryCode == "AE") {
                        this.returnDataAE = res.data.aeSaleDateInfo;
                      }
                    }
                    this.spinShow = false;
                  })
                  .catch((error) => {
                    this.spinShow = false;
                  });
              }
              // 选择ebay
              else if (this.addFrom.salePlatformType == "4") {
                calcuEbay(data)
                  .then((res) => {
                    if (res.code == 0) {
                      this.currencySign = res.data.currencySign;
                      this.deductionAmt = res.data.deductionAmt;
                      this.returnTaxData = res.data;
                      if (res.data.saleCheckInfos != undefined) {
                        this.returnData = res.data.saleCheckInfos;
                      }
                      if (this.addFrom.countryCode == "AE") {
                        this.returnDataAE = res.data.aeSaleDateInfo;
                      }
                    }
                    this.spinShow = false;
                  })
                  .catch((error) => {
                    this.spinShow = false;
                  });
              }
              // 其他的
              else {
                calculationTaxSaleIndexPage(data)
                  .then((res) => {
                    if (res.code == 0) {
                      this.currencySign = res.data.currencySign;
                      this.deductionAmt = res.data.deductionAmt;
                      this.returnTaxData = res.data;
                      if (res.data.saleCheckInfos != undefined) {
                        this.returnData = res.data.saleCheckInfos;
                      }
                      if (this.addFrom.countryCode == "AE") {
                        this.returnDataAE = res.data.aeSaleDateInfo;
                      }
                    }
                    this.spinShow = false;
                  })
                  .catch((error) => {
                    this.spinShow = false;
                  });
              }
            }
            // 非欧盟国家，用老算法
            else {
              calculationTaxSaleIndexPage(data)
                .then((res) => {
                  if (res.code == 0) {
                    this.currencySign = res.data.currencySign;
                    this.deductionAmt = res.data.deductionAmt;
                    this.returnTaxData = res.data;
                    if (res.data.saleCheckInfos != undefined) {
                      this.returnData = res.data.saleCheckInfos;
                    }
                    if (this.addFrom.countryCode == "AE") {
                      this.returnDataAE = res.data.aeSaleDateInfo;
                    }
                  }
                  this.spinShow = false;
                })
                .catch((error) => {
                  this.spinShow = false;
                });
            }
          }
        }
      });
    },
    //提交申报数据
    sureSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const validate = this.verifyPaymentInsert(this.discountData);
          if (this.currencySign == "") {
            if (this.returnData.length == 0 && this.addFrom.declareRule != 2) {
              this.$Message.error("请先核算税金");
              return;
            }
          }
          let params = {};
          if (this.addFrom.declareRule == 2) {
            params = {
              serviceId: this.servicesId,
              allTaxPrice: 0,
              deductionPrice: 0,
              excludeTaxPrice: 0,
              includTaxPrice: 0,
              listTaxDeductionItem: [],
              sellFile: this.addFrom.saleFileUrl,
              declareRule: this.addFrom.declareRule,
              taxRate: this.addFrom.taxRate,
              remoteSaleCheckInfos: this.remoteSaleCheckInfos,
              taxAmtTotal: this.returnTaxData.taxAmtTotal,
              workId: this.workId,
              czUkTaxPrice: this.returnTaxData.czUkTaxPrice,
            };
            if (this.addFrom.countryCode == "SA") {
              params.isShop = this.addFrom.isShop;
              if (params.isShop == 0) {
                this.$Message.info("请选择是否有店铺");
                return;
              }
            }
          } else {
            params = {
              serviceId: this.servicesId,
              allTaxPrice: this.returnTaxData.taxTotal,
              excludeTaxPrice1: this.returnTaxData.excludeTaxAmt1,
              deductionPrice: this.deductionAmt,
              excludeTaxPrice: this.returnTaxData.excludeTaxAmtTotal,
              includTaxPrice: this.returnTaxData.includTaxAmtTotal,
              listTaxDeductionItem: [],
              tfnCountryCode: this.addFrom.tfnCountryCode,
              sellFile: this.addFrom.saleFileUrl,
              declareRule: this.addFrom.declareRule,
              taxRate: this.addFrom.taxRate,
              remoteSaleCheckInfos: this.remoteSaleCheckInfos,
              taxAmtTotal: this.returnTaxData.taxAmtTotal,
              deductionB2bPrice: this.returnTaxData.deductionB2bAmt,
              workId: this.workId,
              salePlatformType: this.addFrom.salePlatformType,
              czUkTaxPrice: this.returnTaxData.czUkTaxPrice,
            };
            if (this.addFrom.countryCode == "AE") {
              params = {
                serviceId: this.servicesId,
                allTaxPrice: this.returnTaxData.taxTotal,
                deductionPrice: this.deductionAmt,
                excludeTaxPrice: this.returnTaxData.excludeTaxAmtTotal,
                includTaxPrice: this.returnTaxData.includTaxAmtTotal,
                listTaxDeductionItem: [],
                sellFile: this.addFrom.saleFileUrl,
                declareRule: this.addFrom.declareRule,
                taxRate: this.addFrom.taxRate,
                remoteSaleCheckInfos: this.remoteSaleCheckInfos,
                aeSaleDataInfo: this.returnDataAE,
                remoteSaleCheckInfos: this.remoteSaleCheckInfos,
                taxAmtTotal: this.returnTaxData.taxAmtTotal,
                workId: this.workId,
                czUkTaxPrice: this.returnTaxData.czUkTaxPrice,
              };
            }
            if (this.addFrom.periodType == 2 && this.addFrom.countryCode == "DE") {
              params = {
                serviceId: this.servicesId,
                allTaxPrice: this.returnTaxData.taxTotal,
                deductionPrice: this.deductionAmt,
                excludeTaxPrice: this.returnTaxData.excludeTaxAmtTotal,
                includTaxPrice: this.returnTaxData.includTaxAmtTotal,
                listTaxDeductionItem: [],
                tfnCountryCode: this.addFrom.tfnCountryCode,
                sellFile: this.addFrom.saleFileUrl,
                declareRule: this.addFrom.declareRule,
                taxRate: this.addFrom.taxRate,
                remoteSaleCheckInfos: this.remoteSaleCheckInfos,
                taxAmtTotal: this.returnTaxData.taxAmtTotal,
                deductionB2bPrice: this.returnTaxData.deductionB2bAmt,
                workId: this.workId,
                deExcludeTaxPrice16: this.returnTaxData.deExcludeTaxAmtTotal16,
                deExcludeTaxPrice19: this.returnTaxData.deExcludeTaxAmtTotal19,
                czUkTaxPrice: this.returnTaxData.czUkTaxPrice,
              };
            }
          }
          if (!validate.flag) {
            this.$Message.info("请填写完整抵扣项金额");
            return;
          } else if (validate.flag && validate.isEmpty) {
            params.listTaxDeductionItem = [];
          } else if (validate.flag && !validate.isEmpty) {
            params.listTaxDeductionItem = this.discountData;
          }
          if (this.addFrom.countryCode == "ES") {
             params.isEcl = this.addFrom.isEcl
          }
          if (this.addFrom.isEcl == 1) {
             params.eclSalePriceInfos = this.addFrom.eclSalePriceInfos
             params.eclPurchasePriceInfos = this.addFrom.eclPurchasePriceInfos
             params.eclPurchasePrice = this.returnTaxData.eclPurchasePrice
             params.eclSalePrice = this.returnTaxData.eclSalePrice
          }
          // 平台代扣代缴金额
          params.agentAmt = this.returnTaxData.excludeTaxAmt1 || 0;
          this.postData = { ...params };
          this.postData.otherEcAcqPrice = this.addFrom.otherEcAcqPrice;
          this.postData.otherEcAcqPriceFile = this.addFrom.otherEcAcqPriceFile;
          this.postData.otherIncludTaxAmt = this.otherPlatformsFormObj.otherIncludTaxAmt;
          this.postData.otherSaleFileUrl = this.otherPlatformsFormObj.otherSaleFileUrl;
          this.submitModal = true;
        }
      });
    },
    submit() {
      if (this.postData.isEcl == 1 && this.returnTaxData.eclPurchasePrice == 0 && this.returnTaxData.eclSalePrice == 0) {
          this.$Message.info("销售项和采购项目不能同时为0！");
          return
      }
      submitTaxdate(this.postData).then((res) => {
        if (res.code == 0) {
          if (Number(this.returnTaxData.taxTotal) < 0) {
            this.$router.replace({
              path: "/taxFinishSuccess",
              query: {
                taxPaymentDeadline: res.data.taxPaymentDeadline,
                serviceId: this.servicesId,
                workOrderId: this.workId,
                declareRule: this.addFrom.declareRule,
                endTime: this.endTime,
                beginTime: this.beginTime,
                companyName: this.taxNumInfo.companyNameZh,
                countryNameEn: this.countryNameEn,
                declareTime: res.timestamp,
                taxDeclarationDeadline: this.taxDeclarationDeadline,
                status: res.data.status,
              },
            });
          } else {
            this.$router.replace({
              path: "/declareSuccess",
              query: {
                taxPaymentDeadline: res.data.taxPaymentDeadline,
                serviceId: this.servicesId,
                workOrderId: this.workId,
                declareRule: this.addFrom.declareRule,
                endTime: this.endTime,
                beginTime: this.beginTime,
                companyName: this.taxNumInfo.companyNameZh,
                countryNameEn: this.countryNameEn,
                declareTime: res.timestamp,
                taxDeclarationDeadline: this.taxDeclarationDeadline,
                status: res.data.status,
              },
            });
          }
        } else {
          // this.$Message.warning(res.message)
        }
      });
    },
    // 验证抵扣项有没有值，如果没有传空对象，有则每一个字段都必填
    verifyPaymentInsert(obj) {
      let arr = Object.values(obj);
      // console.log(arr)
      let flag = false,
        isEmpty = false;
      if (arr.length > 0) {
        arr.forEach((item) => {
          const values = this.getObjectValues(item);
          let nulls = 0,
            notNull = 0,
            allDiscountLength = 0;
          values.map((val) => {
            if (val == "") {
              nulls++;
              // 判断款项信息全部为空，可以通过验证
              if (nulls == values.length || nulls === 0) {
                allDiscountLength++;
                if (allDiscountLength == arr.length) {
                  isEmpty = true;
                  flag = true;
                } else {
                  flag = false;
                }
              } else {
                flag = false;
              }
            } else {
              notNull++;
              // 判断款项信息全部不为空,通过验证
              if (notNull === values.length) {
                flag = true;
                isEmpty = false;
              } else {
                flag = false;
              }
            }
          });
        });
        let params = {
          flag,
          isEmpty,
        };
        return params;
      } else {
        let params = {
          flag: true,
          isEmpty: true,
        };
        return params;
      }
    },
    getObjectValues(object) {
      let values = [];
      for (var property in object) values.push(object[property]);
      return values;
    },
    // 重置
    reset(name) {
      this.discountData = [];
      this.returnTaxData = {};
      this.currencySign = "";
      this.deductionAmt = "";
      this.returnData = [];
      this.$refs["giveFrom"].resetFields();
      this.$refs[name].resetFields();
      this.checkedTaxCountry = [];
      this.$refs.upload.clearFiles();
      this.AmzFileList = [];
      this.addFrom.tfnCountryCode = [];
      this.addFrom.saleFileUrl = "";
    },

    // 远程销售弹窗
    getStatus() {
      this.statusModel = true;
    },
    //下载税金明细
    downLoadTaxDetail() {
      let formData = new FormData();
      if (this.addFrom.countryCode != "AE") {
        let taxSaleData = JSON.stringify(this.returnData);
        formData.append("taxSaleData", taxSaleData);
      } else {
        let taxAeData = JSON.stringify(this.returnDataAE);
        formData.append("taxAeData", taxAeData);
      }

      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("post", this.baseUrl + "/etax/derive/client/calculation/export/list", true);
      // 设置请求token
      // xmlResquest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      xmlResquest.getResponseHeader("Content-Disposition");

      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = timestamp + ".xlsx";
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    //下载模板
    uploadTemplate(row) {
      this.spinShow = true;
      this.operateText = "正在下载模板，请稍后";
      let self = this;
      let formData = new FormData();
      formData.append("workOrderId", this.workId);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/zeroDeclaration/certificate", true);
      // 设置请求token
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(xmlResquest.getResponseHeader("content-disposition").split(";")[1].split("=")[1]);
          self.spinShow = false;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          return;
        }

        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    clearOtherPlatformsInfo() {
      this.otherPlatformsForm = {
        otherSaleFileUrl: "",
        otherIncludTaxAmt: "",
        origFileName: "",
      };
      this.otherPlatformsFormObj = {
        otherSaleFileUrl: "",
        otherIncludTaxAmt: "",
        origFileName: "",
      };
      this.$refs.otherPlatformsUpload.clearFiles();
    },
    getDiscountList() {
      discountList(this.workId).then((res) => {
        if (res.code === 0) {
          this.detailData = res.data;
          this.discountData = this.detailData;
        }
      });
    },

    /**
     * 其他平台含税销售额
     */
    showOtherSellModal() {
      let tempList = this.otherOmCountryList;
      tempList.forEach((v) => {
        v.includTaxPrice = "0.00";
        this.sureOtherSellList.forEach((vv) => {
          if (vv.countryCode == v.countryCode) {
            v.includTaxPrice = vv.includTaxPrice;
          }
        });
      });
      this.otherOmCountryList = JSON.parse(JSON.stringify(tempList));
      this.otherSellModal = true;
    },
    handleSubmitOtherSell() {
      // 校验
      // 校验含税销售额和文件必须上传
      if (!this.otherOmCountryList.some((item) => Number(item.includTaxPrice) > 0)) {
        this.$Message.warning("欧盟国家含税销售额至少填一项");
        return;
      }
      if (!this.otherPlatformsForm.otherSaleFileUrl) {
        this.$Message.warning("其他平台含税销售文件不能为空");
        return;
      }

      // 过滤出欧盟国家中所有含税销售额大于0的
      this.sureOtherSellList = [];
      this.otherOmCountryList.forEach((v) => {
        if (Number(v.includTaxPrice) > 0) {
          this.sureOtherSellList.push({
            ...v,
          });
        }
      });

      this.otherPlatformsFormObj = JSON.parse(JSON.stringify(this.otherPlatformsForm));
      this.otherSellModal = false;
    },
    handleRemoveTag(index) {
      this.sureOtherSellList.splice(index, 1);
    },
    handleRemoveSaleFile() {
      this.otherPlatformsFormObj = {
        otherSaleFileUrl: "",
        origFileName: "",
      };
      this.otherPlatformsForm = {
        otherSaleFileUrl: "",
        origFileName: "",
      };
      this.clearOtherPlatformsInfo();
    },

    /**
     * ioss申报的核算税金按钮
     */
    iossCheckTax() {
      // 校验数据
      if (this.addFrom.saleFileUrl === "" && this.otherPlatformsFormObj.otherSaleFileUrl === "") {
        this.$Message.warning("请上传销售额文件");
        return;
      }
      // 校验通过
      this.spinShow = true;
      this.operateText = "正在计算税金，请稍后";

      // 请求参数
      let params = {};
      params.countryCode = this.addFrom.countryCode;
      params.calculationType = this.addFrom.declareRule;
      params.otherSaleFileUrl = this.otherPlatformsFormObj.otherSaleFileUrl;
      params.saleFileUrl = this.addFrom.saleFileUrl;
      params.beginTime = this.beginTime;
      params.endTime = this.endTime;
      // params.deductionItems = this.discountData;
      params.workId = this.workId;
      // 其他平台销售额数组
      if (this.sureOtherSellList && this.sureOtherSellList.length > 0) {
        let otherPlatformSales = [];
        this.sureOtherSellList.forEach((v) => {
          otherPlatformSales.push({
            countryCode: v.countryCode,
            currency: v.currency,
            sales: Number(v.includTaxPrice),
          });
        });
        params.otherPlatformSales = otherPlatformSales;
      }
      // 调用后台ioss算税接口 todo
      calcuIoss(params)
        .then((res) => {
          if (res.code == 0) {
            this.currencySign = res.data.currencySign;
            this.deductionAmt = res.data.deductionAmt;
            this.returnTaxData = res.data;
            if (res.data.saleCheckInfos != undefined) {
              this.returnData = res.data.saleCheckInfos;
            }
          }
          this.spinShow = false;
        })
        .catch((error) => {
          this.spinShow = false;
        });
    },
    /**
     * ioss申报的提交按钮
     */
    sureIossSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 提示先核算税金
          // const validate = this.verifyPaymentInsert(this.discountData);
          if (this.currencySign == "") {
            if (this.returnData.length == 0 && this.addFrom.declareRule != 2) {
              this.$Message.warning("请先核算税金");
              return;
            }
          }

          // 零申报，提示上传零申报凭证
          if (this.addFrom.declareRule == 2 && !this.addFrom.saleFileUrl) {
            this.$Message.warning("请上传零申报凭证");
            return;
          }

          let params = {};
          // 是零申报的
          if (this.addFrom.declareRule == 2) {
            params = {
              serviceId: this.servicesId,
              allTaxPrice: 0,
              deductionPrice: 0,
              excludeTaxPrice: 0,
              includTaxPrice: 0,
              listTaxDeductionItem: [],
              sellFile: this.addFrom.saleFileUrl,
              declareRule: this.addFrom.declareRule,
              taxRate: this.addFrom.taxRate,
              remoteSaleCheckInfos: this.remoteSaleCheckInfos,
              taxAmtTotal: this.returnTaxData.taxAmtTotal,
              workId: this.workId,
              czUkTaxPrice: this.returnTaxData.czUkTaxPrice,
            };
          }
          // 非零申报
          else {
            params = {
              serviceId: this.servicesId,
              allTaxPrice: this.returnTaxData.taxTotal,
              excludeTaxPrice1: this.returnTaxData.excludeTaxAmt1,
              deductionPrice: this.deductionAmt,
              excludeTaxPrice: this.returnTaxData.excludeTaxAmtTotal,
              includTaxPrice: this.returnTaxData.includTaxAmtTotal,
              listTaxDeductionItem: [],
              tfnCountryCode: this.addFrom.tfnCountryCode,
              sellFile: this.addFrom.saleFileUrl,
              declareRule: this.addFrom.declareRule,
              taxRate: this.addFrom.taxRate || "0",
              remoteSaleCheckInfos: this.remoteSaleCheckInfos,
              taxAmtTotal: this.returnTaxData.taxAmtTotal,
              deductionB2bPrice: this.returnTaxData.deductionB2bAmt,
              workId: this.workId,
              salePlatformType: this.addFrom.salePlatformType,
              czUkTaxPrice: this.returnTaxData.czUkTaxPrice,
            };
          }

          this.postData = { ...params };
          this.postData.otherIncludTaxAmt = this.otherPlatformsFormObj.otherIncludTaxAmt;
          this.postData.otherSaleFileUrl = this.otherPlatformsFormObj.otherSaleFileUrl;
          this.postData.salePriceInfos = this.returnTaxData.salePriceInfos;
          // 零申报的直接调用接口
          if (this.addFrom.declareRule == 2) {
            this.iossSubmit();
          } else {
            // 有数据申报，显示确认申报弹框
            this.sureApplyDataModal = true;
          }
        }
      });
    },
    /**
     * ioss申报确定提交
     */
    iossSubmit() {
      submitTaxIoss(this.postData).then((res) => {
        if (res.code == 0) {
          if (Number(this.returnTaxData.taxTotal) < 0) {
            this.$router.replace({
              path: "/taxFinishSuccess",
              query: {
                taxPaymentDeadline: res.data.taxPaymentDeadline,
                serviceId: this.servicesId,
                workOrderId: this.workId,
                declareRule: this.addFrom.declareRule,
                endTime: this.endTime,
                beginTime: this.beginTime,
                companyName: this.taxNumInfo.companyNameZh,
                countryNameEn: this.countryNameEn,
                declareTime: res.timestamp,
                taxDeclarationDeadline: this.taxDeclarationDeadline,
                status: res.data.status,
              },
            });
          } else {
            this.$router.replace({
              path: "/declareSuccess",
              query: {
                taxPaymentDeadline: res.data.taxPaymentDeadline,
                serviceId: this.servicesId,
                workOrderId: this.workId,
                declareRule: this.addFrom.declareRule,
                endTime: this.endTime,
                beginTime: this.beginTime,
                companyName: this.taxNumInfo.companyNameZh,
                countryNameEn: this.countryNameEn,
                declareTime: res.timestamp,
                taxDeclarationDeadline: this.taxDeclarationDeadline,
                status: res.data.status,
              },
            });
          }
        } else {
          // this.$Message.warning(res.message)
        }
      });
    },

    /**
     * 西班牙ECL申报
     */
    // 增加销售项
    handleAddEclSell() {
      this.eclSalePriceInfos.push({
        taxNumber: "",
        taxAmt: null,
      });
    },
    // 删除销售项
    handleRemoveEclSell(index) {
      this.eclSalePriceInfos.splice(index, 1);
      // 计算销售额
      this.clacuSellAmount();
    },
    // 计算销售额
    clacuSellAmount() {
      let eclSalePrice = 0;
      this.eclSalePriceInfos.forEach((v) => {
        if (v.taxAmt) {
          eclSalePrice += this.toDecimalRound(v.taxAmt);
        }
      });
      this.eclSalePrice = Number(this.toDecimalRound(eclSalePrice)).toFixed(2);
    },

    // 增加采购项
    handleAddEclBuy() {
      this.eclPurchasePriceInfos.push({
        taxNumber: "",
        taxAmt: null,
      });
    },
    // 删除采购项
    handleRemoveEclBuy(index) {
      this.eclPurchasePriceInfos.splice(index, 1);
      // 计算采购项
      this.clacuSellAmount();
    },
    // 计算采购项
    clacuBuyAmount() {
      let eclPurchasePrice = 0;
      this.eclPurchasePriceInfos.forEach((v) => {
        if (v.taxAmt) {
          eclPurchasePrice += this.toDecimalRound(v.taxAmt);
        }
      });
      this.eclPurchasePrice = Number(this.toDecimalRound(eclPurchasePrice)).toFixed(2);
    },

    /**
     * 金额计算
     */
    // 相乘
    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
    },
    // 相减
    accSub(arg1, arg2) {
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      n = r1 >= r2 ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    // 加法
    accAdd(arg1, arg2) {
      var r1, r2, m;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (arg1 * m + arg2 * m) / m;
    },
    // 四舍五入，有小数则保留两位，五小数则为整数
    toDecimalRound(num) {
      if (isNaN(num) || (!num && num !== 0)) {
        return 0;
      }
      return Math.round(num * 100) / 100;
    },

    submitBuyAmount(){
        if (this.eclPurchasePriceInfos.some(item => item.taxAmt === '')) {
          this.$Message.warning("销售金额不能为空！");
          return;
        }
        if (this.eclPurchasePriceInfos.some(item => !item.taxNumber)) {
          this.$Message.warning("税号不能为空！");
          return;
        }
        this.addFrom.eclPurchasePriceInfos = this.eclPurchasePriceInfos
        this.addFrom.eclPurchasePrice = Number(this.eclPurchasePrice)
        this.eclBuyAmountModal=false
        this.checkTax()
    },
    submitSellAmount(){
        if (this.eclSalePriceInfos.some(item => item.taxAmt === '')) {
          this.$Message.warning("销售金额不能为空！");
          return;
        }
        if (this.eclSalePriceInfos.some(item => !item.taxNumber)) {
          this.$Message.warning("税号不能为空！");
          return;
        }
        this.addFrom.eclSalePriceInfos = this.eclSalePriceInfos
        this.addFrom.eclSalePrice = Number(this.eclSalePrice)
        this.eclSellAmountModal = false
        this.checkTax()
    }
  },
  mounted() {
    this.contentStyleObj.height = window.screen.height + "px";
    if (this.addFrom.countryCode != undefined) {
      this.isSelectCountry = true;
      this.getInfo(this.addFrom.countryCode);
      if (this.addFrom.countryCode == "DE") {
        this.DEtipsModal = true;
      }
      // ioss申报的默认选中有数据申报，并且删除抵扣类型这一列
      if (this.addFrom.countryCode == "IOSS") {
        this.addFrom.declareRule = "3";
        // this.discountData[0].countryCode = "";
      }
    }
    // console.log(this.addFrom.countryCode)
    this.getBaseInfo();
  },
};
</script>
<style lang="less" scoped>
.ecl-table {
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  border-collapse: collapse;
  border: solid 1px #ddd;
  thead tr th {
    background: #f2f2f3;
    padding: 8px 12px;
    border: solid 1px #ddd;
    font-size: 14px;
    text-align: center;
  }
  tr td {
    border: solid 1px #ddd;
    padding: 4px 12px;
    text-align: center;
    position: relative;
    .ecl-operate {
      position: absolute;
      top: 0;
      bottom: 0;
      right: -80px;
      margin: auto 0;
      width: 70px;
      text-align: left;
      & .ivu-icon {
        cursor: pointer;
      }
      & .ecl-line-add {
        color: #19be6b;
      }
      & .ecl-line-remove {
        color: #ed4014;
      }
    }
  }
}

.other-sell-table {
  max-height: 400px;
  overflow: auto;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  border-collapse: collapse;
  border: solid 1px #ddd;
  thead tr th {
    background: #f2f2f3;
    padding: 8px 12px;
    border: solid 1px #ddd;
    font-size: 14px;
    text-align: center;
  }
  tr td {
    border: solid 1px #ddd;
    padding: 4px 12px;
    text-align: center;
  }
}
.subInfo-1 {
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
  padding-right: 20px;
  color: red;
  font-weight: 500;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
.modalCount {
  background-color: #fff;
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
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
      .compangInfo {
        margin-top: 18px;
        font-size: 14px;
        font-family: "Microsoft Yahei", PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        p {
          min-width: 400px;
          margin: 4px 0px;
        }
        .right {
          color: #333333ff;
        }
      }
    }
  }
  /deep/ .ivu-spin-fix {
    position: fixed;
    z-index: 999;
    background-color: rgba(255, 255, 255, 0.7);
    .ivu-spin-text {
      i {
        font-size: 20px;
        font-weight: bold;
        margin-right: 10px;
      }
      display: flex;
      align-items: center;
      .loadingText {
        font-size: 16px;
      }
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .demo-spin-col {
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
  .title {
    font-size: 24px;
    font-family: "Microsoft Yahei", "PingFangSC-Semibold,PingFang SC";
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
  }
  .step1,
  .step2 {
    padding-bottom: 20px;
  }
  .step1 {
    .tab-box {
      border-bottom: 1px solid #dddddd;
      span {
        display: inline-block;
        font-size: 16px;
        margin-right: 36px;
        color: #333333;
        cursor: pointer;
      }
      .active-tab {
        border-radius: 10px 10px 0 0;
        background-color: #16ade9;
        color: #fff;
        padding: 8px 24px;
      }
    }
    .tax-title {
      margin: 24px 0;
      padding: 11px 24px;
      background-color: rgba(22, 173, 233, 0.2);
      font-size: 18px;
      font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
  .step2 {
    .resultBox {
      padding: 30px;
      .finalTaxPayment {
        background-color: rgb(255, 255, 255);
        height: 110px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 20px;
        // margin-top: 30px;
        p {
          margin: 0px;
        }
        .top {
          font-size: 12px;
          .red {
            color: #ed3e3e;
            font-weight: bold;
          }
          margin-bottom: 10px;
        }
        .bottom {
          .red {
            font-size: 23px;
            color: #ed3e3e;
            font-weight: bold;
          }
        }
        .canDiscount {
          font-size: 12px;
          margin-top: 12px;
          color: #303033;
          .top {
            margin-top: 0px !important;
          }
          .red {
          }
        }
        .canDiscount.top,
        .canDiscount.bottom {
          margin: 0px;
        }
      }
      tr {
        height: 50px;
      }
      th {
        background: #eeeeee;
        border: none;
        padding-left: 20px;
        text-align: left;
        .english {
          padding-top: 10px;
          height: 70px;
          line-height: 34px;
        }
      }
      .detail {
        background: #ffffff;
        td {
          padding-left: 20px;
          color: #333333;
        }
      }
      .finalTaxPayment {
        .english {
          padding: 0px;
          .chinese {
            top: 17px;
          }
          .red {
            font-size: 20px;
            font-weight: bold;
            color: rgba(237, 62, 62, 1);
            margin-left: 13px;
          }
        }
      }
    }
  }
  .table {
    // margin-top: 16px;
  }

  .yellow {
    color: #fdaa15;
    font-size: 12px;
  }
  .companyTax {
    margin: 15px 0px;
    background: #ffffff;
    padding: 20px 30px;
    &/deep/ .ivu-row {
      height: 50px;
    }
    .top {
    }
    .bottom {
    }
  }
  .english {
    font-weight: bold;
    font-size: 12px;
    color: #666666;
    line-height: 13px;
    height: 100%;
    position: relative;
    padding-top: 10px;
    .chinese {
      position: absolute;
      top: 28px;
      left: 0px;
    }
    .rightWord {
      font-size: 12px;
      color: rgba(22, 173, 233, 1);
      line-height: 13px;
      margin-left: 15px;
    }
  }
  .chinese {
    font-size: 14px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .leftBox {
    // margin-top: 25px;
    width: 100%;
    border: 1px solid #d8d8d8;
    .haveCountry {
      .taxCountryBox {
        margin-right: 8px;
      }
      button {
        color: #16ade9;
        border: 1px solid #e6e6e6;
      }
    }
  }
  .topLeft {
    margin: 30px 0 20px 80px;
  }
  .discountBox {
    padding-top: 10px;
    border-top: 1px solid #eeeeee;
    .discountTitle {
      font-size: 16px;
      color: #303033;
      font-weight: 500;
      background: rgba(22, 173, 233, 0.2);
      height: 48px;
      line-height: 48px;
      color: #333333;
      padding: 0px 20px;
      span {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
      }
      .addBtn {
        width: 120px;
        height: 33px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid #16ade9;
        color: #16ade9;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        line-height: 32px;
        border-radius: 5px;
        margin-top: 8px;
        cursor: pointer;
        span {
          color: #16ade9;
          font-size: 14px;
          margin-right: 5px;
          margin-top: 1px;
        }
        img {
          width: 18px;
          height: 18px;
          margin-top: 6px;
          float: left;
          margin-left: 10px;
        }
      }
    }
    .close {
      margin-left: 20px;
      margin-top: 7px;
      float: right;
      cursor: pointer;
      padding: 10px;
    }
  }
  .amzUpload {
    color: #16ade9;
  }
  .amzUpload.btnfile {
    background: #ffffff;
    color: #16ade9;
    border: 1px solid #16ade9;
  }
  .btBox {
    text-align: center;
    margin: 30px;
  }
  .countryFlag {
    width: 26px;
    height: 28px;
    margin-left: 5px;
    margin-right: 3px;
  }
  .countryName {
    height: 17px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 18px;
  }
  .countryList {
    &/deep/ .ivu-form-item-content {
      position: relative;
      .ivu-checkbox-group {
        display: flex;
        margin-top: 3px;
        flex-wrap: wrap;
      }
      .ivu-checkbox {
        width: 16px;
        height: 16px;
        .ivu-checkbox-inner {
          width: 100%;
          height: 100%;
          margin-top: 1px;
          &::after {
            width: 5px;
            height: 12px;
            top: 0px;
            left: 5px;
          }
        }
      }
    }
    .VATCountry {
      /deep/ .ivu-form-item {
        position: relative;
      }
      span.zhuce {
        position: absolute;
        top: 18px;
        left: -117px;
        font-size: 12px;
        font-family: "Microsoft Yahei", PingFangSC;
        color: #666666;
      }
    }
  }
  .submitTop {
    font-size: 13px;
    line-height: 12px;
    margin-top: 3px;
  }
  .submitBottom {
    font-size: 12px;
    line-height: 15px;
  }
  margin-top: 16px;
  &/deep/ .ivu-form .ivu-form-item-label {
    font-size: 16px;
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
    // line-height:13px;
  }
  &/deep/ .ivu-checkbox-wrapper {
    display: flex;
    align-items: center;
    margin-right: 15px;
  }
  &/deep/ .ivu-radio-wrapper {
    color: #333333;
    .ivu-radio {
      margin-top: 5px;
    }
  }
  &/deep/ .ivu-table th {
    background-color: rgba(22, 173, 233, 0.2) !important;
    color: #666666;
    font-weight: 400;
    border-top: 1px solid rgba(153, 153, 153, 0.2);
  }
  &/deep/ .ivu-table td {
    &:last-child {
      border-right: 1px solid #e8eaec;
    }
  }
  &/deep/ .ivu-table-wrapper {
    overflow: initial;
  }
  &/deep/ .ivu-modal-footer {
    text-align: center;
    margin-top: 50px;
    border-top: 1px solid #e8eaec !important;
    padding-top: 15px !important;
  }
  &/deep/ .ivu-radio-checked {
    span {
      background-color: #ffffff !important;
      &:after {
        background-color: #019dfa !important;
        width: 8px;
        height: 8px;
        left: 3px;
        top: 3px;
      }
    }
  }
  &/deep/ .ivu-icon-ios-cloud-upload-outline:before {
    font-weight: bold;
  }
  &/deep/ .ivu-icon-ios-calculator-outline:before {
    font-size: 16px;
  }
  .tooltip {
    position: relative;
    &/deep/ .ivu-tooltip {
      position: absolute;
      left: 85px;
      top: 10px;
      .tips-icon {
        width: 16px;
        height: 16px;
        background: #f79728;
        border-radius: 50%;
        color: #ffffff;
        display: block;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
      }
      .ivu-tooltip-content {
        .ivu-tooltip-arrow {
          background: #ffffff;
          border-right-color: #464c59;
          // border-top-color: #F79728;
          // border-left-color: #F79728;
          // border-bottom-color: #F79728;
        }
        .ivu-tooltip-inner {
          // background: #FEFFE8;
          // border-color: #FEFFE8;
          // box-shadow: none;
          // border: 1px solid #FAE3A4;
          color: #ffffff;
          font-size: 16px;
        }
      }
    }
    .info {
      font-size: 14px;
      white-space: normal;
      width: 270px;
      height: 150px;
      .titleTip {
        width: 37px;
        height: 16px;
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
        line-height: 18px;
        margin: 5px 0px 10px 0px;
      }
      .ph {
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 26px;
      }
    }
  }
  &/deep/ .ivu-form-item-content {
    position: relative;
    .howToGet,
    .saleFile {
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 206px;
      width: 90px;
      height: 15px;
      font-size: 16px;
      font-weight: 400;
      color: #f79728;
      line-height: 14px;
      transform: translateY(-50%);
      .line {
        position: absolute;
        top: 17px;
        left: 0px;
        height: 1px;
        width: 73px;
        background: #f79728;
      }
    }
    .saleFile {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
    }
    .saleFile .closeImg {
      width: 15px;
      height: 15px;
      cursor: pointer;
      margin-left: 5px;
    }
    .ivu-upload {
      .ivu-upload-list {
        position: absolute;
        width: 275px;
        top: 0px;
        left: 300px;
        margin-top: 0px;
        .ivu-upload-list-file {
          line-height: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 5px;
        }
      }
    }
    .chineseTitle {
      position: absolute;
      top: 17px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }
    .lf1 {
      left: 0px;
    }
    .lf2 {
      left: 0px;
    }
    .lf3 {
      left: 0px;
    }
    .lf4 {
      left: 0px;
    }
  }
  &/deep/ .zeroFile .ivu-form-item-content .ivu-upload .ivu-upload-list {
    left: 180px;
  }
  &/deep/ .ivu-radio-checked {
    span {
      background-color: #ffffff !important;
      &:after {
        background-color: #019dfa !important;
        width: 8px;
        height: 8px;
        left: 3px;
        top: 3px;
      }
    }
  }
}
.hasLogin {
  background: #f6f6f6;
  margin-top: 0px;
  min-height: calc(100vh - 60px);
  .step1 {
    margin: 24px 24px 0px 24px;
    .dismissReason {
      padding: 20px;
      background: #e4ebf1;
      height: 80px;
      font-size: 14px;
      font-weight: bold;
      .red {
        color: #e83f32;
      }
    }
    .subInfo {
      // height: 67px;
      padding-bottom: 6px;
      background: #fff1dd;
      font-size: 14px;
      font-family: "Microsoft Yahei", PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333ff;
      line-height: 22px;
      padding-top: 6px;
      // display: flex;
      align-items: center;
      padding-left: 20px;
      color: #333;
      font-weight: 500;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
    }
    padding-bottom: 0px;
    .btBox {
      margin: 0px;
      padding: 15px;
      text-align: center;
      margin-top: 24px;
      padding-top: 0px;
      padding-bottom: 20px;
    }
    .chooseCountry {
      // margin: 0px 45px;
    }
  }
  .step1 {
    .title {
      // margin-top: 15px;
      background: #ffffff;
      border-bottom: none;
      padding: 24px 0px 0px 24px;
      font-size: 24px;
      color: #333333;
    }
  }
  .step2 {
    margin: 0px 24px 24px 24px;
    background: #ffffff;
    border-bottom: none;
    padding: 10px 30px 25px;
    .title {
      display: flex;
      justify-content: space-between;
      border-bottom: none;
      font-size: 18px;
    }
  }
  .leftBox {
    background: #ffffff;
    border: none;
    padding: 20px 25px 0 25px;
  }
  .topLeft {
    .flex-between {
      padding-left: 25px;
    }
    margin: 10px;
    &/deep/ .ivu-form-item {
      //  margin-bottom: 15px;
    }
  }
  .step2_content {
    .resultMoney {
      background: #ffffff;
      margin-top: 24px;
      span {
        // padding-left: 30px;
        font-size: 16px;
        color: #333333;
      }
      .jisuan {
        margin-bottom: 28px;
      }
      span.money {
        padding-left: 0px;
      }
      .finallyMoney {
        color: #333333;
        font-weight: 500;
        font-size: 18px;
        margin-top: 15px;
        margin-bottom: 30px;
        .red {
          color: #ed3e3e;
          font-size: 22px;
          font-weight: bold;
        }
      }
    }
  }
  &/deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  &/deep/ .ivu-table:before {
    height: 0px;
  }
  &/deep/ .ivu-table-border:after {
    width: 0px;
  }
  &/deep/ .ivu-table-border td,
  .ivu-table-border th {
    border: none;
  }
  &/deep/ .ivu-form-item-content {
    .ivu-upload {
      .ivu-upload-list {
        width: 200px;
      }
    }
  }
  .step2 {
    .resultBox {
      padding: 0px;
      .jisuanshuijin {
        margin-bottom: 20px;
        span {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
        }
      }
      .jiankong {
        margin-top: 10px;
        display: flex;
        .JkTitle {
          font-size: 16px;
          color: #333333;
          font-weight: 500;
          margin-left: 33px;
          margin-right: 11px;
        }
      }
      .normal {
        cursor: pointer;
        span.status {
          display: flex;
          align-items: center;
          img {
            width: 18px;
            height: 16px;
            margin-top: 2px;
          }
          color: #16ade9;
        }
      }
      .unnormal {
        cursor: pointer;
        span.status {
          display: flex;
          img {
            width: 18px;
            height: 16px;
            margin-top: 2px;
          }
          color: #ed3e3e;
        }
      }
    }
  }
  &/deep/ .ivu-table td {
    background: #ffffff;
    border: 1px solid #e8eaec;
    border-top: none;
    padding-left: 20px;
    // padding-top: 10px;
    &:nth-child(2n) {
      border-left: none;
      border-right: none;
    }
  }
  &/deep/ .ivu-table th {
    background: #eeeeee;
    // border: none;
    padding-left: 20px;
  }
  &/deep/ .ivu-input {
    height: 32px;
  }
}
.notLogin {
  .step1 {
    max-width: 1200px;
    margin: auto;
    .title {
      text-align: center;
      color: #333333;
      font-size: 24px;
      border-color: #f0f0f0;
      padding: 18px 0 30px 0;
      font-weight: bold;
    }
  }
  .step2 {
    .title {
      text-align: center;
      color: #333333;
      font-size: 24px;
      border-bottom: 0px;
      padding: 25px 0px;
    }
    .resultBox {
      min-height: auto;
      margin-top: 0px;
      padding: 0px 30px 20px;
      .jisuanshuijin {
        margin-bottom: 20px;
        span {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
        }
      }
    }
    .step2_content {
      max-width: 1200px;
      margin: auto;
      // border-top: 1px solid rgba(221, 221, 221, 0.5);
      .resultMoney {
        padding: 20px 0px;
        margin: 0px 30px;
        background: #ffffff;
        margin-top: 30px;
        .saleTitle {
          font-size: 18px;
          color: #666666;
        }
        span {
          // padding-left: 30px;
          font-size: 17px;
          color: #333333;
        }
        span.money {
          padding-left: 0px;
        }
        .finallyMoney {
          margin-top: 13px;
          span {
            font-size: 17px;
            color: #333333;
          }
          .red {
            color: #ed3e3e;
            font-size: 22px;
            font-weight: bold;
          }
        }
      }
    }
  }
  .tooltip {
    .ivu-tooltip {
      left: 85px;
    }
  }
  .leftBox {
    border: none;
    .topLeft {
      margin: 30px 0px 20px 0px;
      .flex {
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }
  }
  &/deep/ .amzUpload {
    background: #16ade9;
    color: #ffffff;
    font-size: 14px;
    border: none;
    .ivu-icon-ios-cloud-upload-outline:before {
      font-weight: bold;
    }
  }
  &/deep/ .addBtn {
    .ivu-icon-ios-calculator-outline:before {
      font-size: 16px;
    }
  }
  &/deep/ .ivu-table td {
    background: #ffffff;
    border: 1px solid #e8eaec;
    border-top: none;
    padding-left: 20px;
    // padding-top: 10px;
    &:nth-child(2n) {
      border-left: none;
      border-right: none;
    }
  }
  &/deep/ .ivu-table th {
    background: #eeeeee;
    // border: none;
    padding-left: 20px;
  }
  &/deep/ .ivu-input {
    height: 32px;
  }
  &/deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  &/deep/ .ivu-table-border:after {
    width: 0px;
  }
  &/deep/ .ivu-table:before {
    height: 0px;
  }
}
.remoteSaleHeader {
  text-align: center;
  font-size: 26px;
  color: #333333;
  padding: 10px;
  height: 60px;
  line-height: 30px;
}
.taxNumber-box {
  /deep/ .ivu-row {
    margin-bottom: 16px;
  }
  .tax-info-name {
    display: inline-block;
    min-width: 130px;
    font-size: 14px;
    font-family: "Microsoft Yahei", PingFangSC;
    color: rgba(102, 102, 102, 1);
    line-height: 16px;
    text-align: right;
  }
  .tax-info-value {
    font-size: 14px;
    font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 18px;
  }
  .tax-info-value.date-color {
    color: #16ade9;
  }
}
.submit-tip-box {
  .content {
    background: #f4f4f4;
    border-radius: 10px;
    color: #ed3e3e;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    .companyTax {
      margin: 15px 0px;
      background: #ffffff;
      padding: 20px 30px;
      &/deep/ .ivu-row {
        height: 50px;
      }
    }
    .tableBox {
      table {
        padding: 10px;
      }
    }
    .english {
      font-weight: bold;
      font-size: 12px;
      color: #666666;
      line-height: 13px;
      height: 100%;
      position: relative;
      margin-bottom: 29px;
      padding-top: 10px;
      text-align: left;
      .chinese {
        position: absolute;
        top: 28px;
        left: 0px;
      }
      .rightWord {
        font-size: 12px;
        color: rgba(22, 173, 233, 1);
        line-height: 13px;
        margin-left: 15px;
      }
    }
    .chinese {
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
    .tableBox {
      table {
        .header {
          background: #f6f6f6;
        }
      }
    }
  }
  .reportData-box {
    .title {
      font-size: 16px;
      font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
      font-weight: 500;
      color: #333333;
      margin-bottom: 11px;
      margin-top: 10px;
    }
    .sureData-box {
      border: 1px solid #ebebeb;
      .row {
        span {
          display: inline-block;
          padding: 12px 15px;
          font-size: 14px;
          font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          width: 49%;
        }
        :nth-child(1) {
          background-color: #d0effb;
          border-bottom: 1px solid #ebebeb;
          border-right: 1px solid #ebebeb;
        }
        :nth-child(2) {
          border-bottom: 1px solid #ebebeb;
        }
      }
    }
  }
}
.remoteSale {
  /deep/ .ivu-table-header {
    background: #ffffff !important;
  }
  /deep/ .ivu-modal-content {
    border-radius: 10px !important;
  }
}
.yuanchengxiaoshou {
  /deep/ .ivu-table td,
  .ivu-table th {
    border-right: 1px solid #e8eaec;
  }
  /deep/ .ivu-table-footer {
    height: 100px;
  }
  /deep/ .ivu-table-title {
    height: 60px !important;
  }
  .remoteSaleFooter {
    line-height: 22px;
    padding: 20px;
  }
  .red {
    color: rgb(237, 62, 62);
  }
}
&/deep/ .getContentModel {
  .ivu-modal-content {
    height: 560px;
    overflow-y: auto;
    border-radius: 13px !important;
    padding: 10px 20px;
    width: 638px;
    .ivu-modal-header {
      background: #ffffff !important;
      padding: 14px 0px;
      .ivu-modal-header-inner {
        color: #333333;
        &::before {
          content: "";
          border-left: 3px solid #16ade9;
          margin-right: 6px;
        }
      }
    }
    .ivu-modal-body {
      .modelTitle {
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 18px;
        margin: 15px 0px;
      }
    }
    .ivu-modal-close {
      i {
        font-size: 43px;
      }
    }
    .ivu-modal-footer {
      .footerBt {
        width: 100px;
        height: 37px;
      }
      .footerBtClose {
        background-color: #fff;
        color: #999999;
        font-size: 14px;
      }
    }
  }
}
.submit-box {
  .tax-info-name {
    min-width: 66px;
  }
  /deep/ .ivu-modal-header {
    background: #ffffff !important;
  }
  /deep/ .ivu-divider-horizontal {
    margin: 0;
  }
  /deep/ .submitModal-footer-line {
    margin: 24px 0 32px 0;
  }
  /deep/ .ivu-modal-footer {
    padding: 0px 18px 25px 18px;
    text-align: center;
  }
}
.zero-declear-tip {
  background: #fff1dd;
  padding: 7px 12px;
  font-size: 14px;
  line-height: 26px;
  color: #16ade9;
  margin-bottom: 20px;
  img {
    position: relative;
    top: 4px;
  }
  .red {
    color: #ed3e3e;
  }
}
.zero-declear-box {
  /deep/ .ivu-upload.ivu-upload-select {
    text-align: center;
    color: #16ade9;
    border-radius: 4px;
    cursor: pointer;
    .inner {
      .uplad-symbol {
        margin-top: 30px;
        width: 50px;
      }
      p {
        color: #999999;
        font-size: 14px;
      }
    }
  }
}
.out-img-box {
  width: 200px;
  .img-box {
    width: 200px;
    height: 124px;
    overflow: hidden;
    border: 1px dashed #dcdee2;
    position: relative;
    text-align: center;
    z-index: 11;
    background: #fff;
    button {
      width: 0px;
      padding: 0px;
      border: none;
      position: absolute;
      top: -13px;
      height: 0px;
      z-index: 1;
      img.closeImg {
        position: absolute;
        width: 26px;
        height: 26px;
        top: 16px;
        right: -194px;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
    .deletBtn {
      left: auto;
      display: none;
    }
    .show-pdf {
      display: inline-block;
      color: #313233;
      font-size: 16px;
      margin-top: 24px;
    }
  }
  .img-box:hover .deletBtn {
    display: block;
  }
  .corres-name {
    width: 100%;
  }
}
.sample-box {
  color: #16ade9;
  font-size: 14px;
  img {
    width: 16px;
    vertical-align: middle;
    margin-right: 3px;
  }
  span {
    cursor: pointer;
    margin-right: 28px;
  }
}
.DEtipsModal-header {
  color: red;
  font-weight: 600;
  font-size: 18px;
}
.DEtipsModal-content {
  font-size: 16px;
  line-height: 26px;
}
.DEtipsModal-footer {
  text-align: center;
  margin: 20px;
}
.promptBg {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: #fff1dd;
  font-size: 12px;
  font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #666666ff;
  line-height: 17px;
  margin-bottom: 24px;
  span {
    color: #333333;
  }
}
.otherPlatformBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 8px;
  img {
    width: 10px;
    height: 10px;
    cursor: pointer;
  }
  .num {
    font-size: 16px;
    font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fa5555;
    line-height: 16px;
    margin-bottom: 7px;
  }
  .link {
    font-size: 14px;
    font-family: "Microsoft Yahei", PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3e9dff;
    line-height: 12px;
    cursor: pointer;
    margin-top: 3px;
  }
}
.uploadBox {
  position: relative;
  display: flex;
  flex-direction: column;
  .close {
    position: absolute;
    right: 0;
  }
}
</style>
