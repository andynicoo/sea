<template>
  <!-- 除英国的计算税金 -->
  <div
    class="modalCount"
    :class="[isLogin == true && nowPath.indexOf('aboutComputed') == -1 ? 'hasLogin' : 'notLogin']"
  >
    <div class="headContent" v-if="isLogin == true && nowPath.indexOf('aboutComputed') == -1">
      <div class="bottom">
        <p class="" v-if="isSelectCountry">待提交申报资料<span v-if="isShowRejectReason">（驳回）</span></p>
        <p class="" v-else>计算税金</p>
        <div v-if="isShowRejectReason" class="reject-reason">
          <span class="icon">!</span>申报被驳回（原因： <span class="reason">{{ taxNumInfo.rejectReason }}</span> ）
        </div>
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
              {{ productFunctionCode == 23 ? 'IOSS税号：' : 'VAT税号：' }}
              <span class="right">
                {{ taxNumInfo.vatTaxNumber }}
              </span>
            </p>
            <p style="margin-left: 50px">
              当前申报区间：
              <span class="right">
                {{ beginTime != '' ? beginTime.slice(0, 10) : '' }}至{{ endTime != '' ? endTime.slice(0, 10) : '' }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="step1">
      <div class="subInfo subInfo-top" v-if="isLogin == true && nowPath.indexOf('aboutComputed') == -1">
        <span class="subInfo-top-label">
          <img
            src="@/assets/images/common/gantanhao.png"
            style="width: 15px; margin-right: 5px; margin-bottom: -1px"
            alt=""
          />
          温馨提醒：
        </span>
        <span v-if="addFrom.countryCode == 'EU'">
          <!-- 卢森堡IOSS注册+申报的提示 -->
          1、卢森堡税局2023年暂时性下调VAT标准税率（从17%下调为16%），该变更持续至2023年12月31日。因此，2023年IOSS申报中，销往卢森堡的交易将使用16%作为标准税率进行计税。(2022年及以前的历史交易，仍使用17%作为标准税率)
        </span>
        <span v-else>
          <span v-if="addFrom.countryCode == 'GB'">1、</span>
          {{
            addFrom.countryCode === 'GB'
              ? '由于亚马逊销售文件2021年1月1日进行了更新，建议您下载最新销售文件进行计算税金操作。英国税局规定，从2021年开始，低税率不再适用于电商平台卖家，需统一以标准税率（20%）进行申报，2020年的数据将继续保留原有税率申报。'
              : '由于亚马逊销售文件2021年7月1日进行了更新，建议您下载最新销售文件进行计算税金操作。'
          }}
        </span>
        <div v-if="addFrom.countryCode == 'GB'">
          2、PVA为postpone VAT
          account，即进口VAT递延，清关时走递延流程，不需当场交进口VAT，清关后6个月内需要做PVA申报，申报需要上传的文件为做了递延的C88文件，或者进入对应的CDS账户，下载对应的PVA
          statement。
        </div>
        <div v-if="addFrom.countryCode == 'EU'">
          <!-- 卢森堡IOSS注册+申报的提示 -->
          2、如您当前有销往卢森堡的商品交易，请及时于您的销售平台中更新该国适用的VAT标准税率。
        </div>

        <div v-if="showRegisterCountryCode">
          <p>
            1、本服务不包含德国ZM申报、意大利Intrastat申报、西班牙ECL申报等欧盟内B2B申报；如您需要提交此类申报，请务必咨询您的客户经理或我司人工客服。
          </p>
          <p>
            2、若未经人工协助申报欧盟内B2B销售，视同未实际提交上述三项申报，可能产生晚申报罚金、欧盟税号被注销的风险。
          </p>
          <p>3、如已经合作第三方进行清关缴税，请上传相应的缴税凭证，进行税金抵扣，避免重复申报和缴纳税金。</p>
          <p>
            4、请上传所有国家的完整销售报告，为确保税金计算的准确性，建议启用【亚马逊增值税计算服务】功能，避免漏申报或多申报。
          </p>
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
      </div>
      <div class="leftBox">
        <div v-if="isLogin == true && nowPath.indexOf('aboutComputed') != -1 && nowPath.indexOf('computedTax') != -1">
          <div class="tab-box">
            <span class="active-tab">税号信息</span>
          </div>
          <div class="tax-title">税号信息</div>
          <div class="taxNumber-box" v-if="JSON.stringify(taxNumInfo) != '{}'">
            <Row>
              <Col span="12">
                <span class="tax-info-name">公司中文名称：</span>
                <span class="tax-info-value">{{ taxNumInfo.companyNameZh }}</span>
              </Col>
              <Col span="12">
                <span class="tax-info-name">{{ productFunctionCode == 23 ? 'IOSS税号：' : 'VAT税号：' }}</span>
                <span class="tax-info-value">
                  {{ taxNumInfo.vatTaxNumber }}
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
                  {{ beginTime != '' ? beginTime.slice(0, 10) : '' }} 至 {{ endTime != '' ? endTime.slice(0, 10) : '' }}
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
                  v-if="productFunctionCode == 23"
                  label="申报所在国:"
                  class="chooseCountry"
                  :label-width="130"
                  prop="countryCode"
                >
                  <Select
                    v-model="addFrom.countryCode"
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
              <Col :span="8" v-if="addFrom.periodType != 2 && productFunctionCode != 23">
                <FormItem label="税率:" prop="taxRate" :label-width="120">
                  <Select v-model="addFrom.taxRate" style="width: 200px" placeholder="请选择税率">
                    <Option v-for="(item, index) in taxRateList" :value="String(item)" :key="index">
                      {{ item }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="8" v-if="addFrom.declareRule != 0">
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
                <FormItem
                  v-if="showRegisterCountryCode && addFrom.declareRule == 1"
                  label="公司注册所在地国家/地区:"
                  class="chooseCountry"
                  :label-width="220"
                  prop="registerCountryCode"
                >
                  <Select
                    v-model="addFrom.registerCountryCode"
                    style="width: 200px"
                    filterable
                    placeholder="请选择公司注册所在地国家/地区"
                  >
                    <Option v-for="(item, index) in countryList" :value="item.countryCode" :key="index">{{
                      item.countryNameZh
                    }}</Option>
                  </Select>
                  <p
                    class="label-tip"
                    style="position: absolute; left: -169px; color: rgb(247, 151, 40); bottom: -25px"
                  >
                    注释：发放营业执照的国家/地区
                  </p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <div class="tooltip" v-if="productFunctionCode != 23">
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
                    <Radio :label="1">
                      <span style="float: right; margin-top: 3px">有数据</span>
                    </Radio>
                    <Radio :label="0" v-if="isSelectCountry">
                      <span style="float: right; margin-top: 3px">零申报</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>

              <Col :span="24">
                <FormItem
                  label="销售平台："
                  prop="salePlatformType"
                  :label-width="130"
                  v-if="addFrom.declareRule != 0 && productFunctionCode != 23"
                >
                  <RadioGroup v-model="addFrom.salePlatformType">
                    <Radio :label="0">Amazon</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col :span="16">
                <FormItem
                  label="销售额文件："
                  :label-width="130"
                  v-if="addFrom.declareRule != 0 && productFunctionCode != 23"
                >
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
                      addFrom.filePath !== '' &&
                      taxNumInfo.status === 18 &&
                      (taxNumInfo.countryCode === 'AT' || taxNumInfo.countryCode === 'CZ')
                    "
                  >
                    <a target="_blank" v-if="addFrom.filePath !== ''" :href="addFrom.filePath" class="show-pdf">
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
                  <div style="font-size: 12px; color: #f79728" v-if="productFunctionCode == 23">
                    注：仅支持Amazon销售文件
                  </div>
                </FormItem>
                <div
                  v-if="taxNumInfo.isPullSellFile && AmzFileList.length > 0 && AmzFileList[0].name === '销售额文件'"
                  style="color: #ed3e3e; margin-left: 130px; margin-bottom: 20px; font-size: 14px"
                >
                  <span>提示：当前申报区间销售报告已系统生成，请确认后提交 </span>
                  <span style="color: #16ade9"><a :href="AmzFileList[0].url">下载</a></span>
                </div>
              </Col>
            </Row>
            <Row
              v-if="
                addFrom.countryCode &&
                addFrom.declareRule != '0' &&
                addFrom.countryCode != 'GB' &&
                addFrom.countryCode != 'SA' &&
                addFrom.countryCode != 'AE' &&
                productFunctionCode != 23
              "
            >
              <Col :span="24">
                <FormItem label="OSS税号：" prop="oss" :label-width="130">
                  <RadioGroup v-model="addFrom.oss">
                    <Radio :label="1">
                      <span style="float: right; margin-top: 3px">有OSS税号</span>
                    </Radio>
                    <Radio :label="2">
                      <span style="float: right; margin-top: 3px">无OSS税号</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row
              v-if="
                addFrom.countryCode &&
                addFrom.declareRule != '0' &&
                addFrom.countryCode != 'GB' &&
                addFrom.countryCode != 'SA' &&
                addFrom.countryCode != 'AE' &&
                productFunctionCode != 23
              "
            >
              <Col :span="24">
                <FormItem label="IOSS税号：" prop="ioss" :label-width="130">
                  <RadioGroup v-model="addFrom.ioss">
                    <Radio :label="1">
                      <span style="float: right; margin-top: 3px">有IOSS税号</span>
                    </Radio>
                    <Radio :label="2">
                      <span style="float: right; margin-top: 3px">无IOSS税号</span>
                    </Radio>
                  </RadioGroup>
                  <p style="color: #ed3e3e">提示：亚马逊等OMPs平台提供的IOSS，OSS税号不能作为申报号码</p>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="addFrom.countryCode == 'FR'">
              <Col :span="24">
                <FormItem label="是否有法国递延：" prop="frenchDeferredFlag" :label-width="180">
                  <RadioGroup v-model="addFrom.frenchDeferredFlag">
                    <Radio :label="1">
                      <span style="float: right; margin-top: 3px">是</span>
                    </Radio>
                    <Radio :label="0">
                      <span style="float: right; margin-top: 3px">否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <template v-if="addFrom.countryCode == 'FR' && addFrom.frenchDeferredFlag == 1">
              <Row>
                <Col :span="24">
                  <FormItem label="法国海关号：" prop="customsNumber" :label-width="180">
                    <Input placeholder="请输入法国海关号" v-model="addFrom.customsNumber" style="width: 300px"></Input>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col :span="24">
                  <FormItem label="进口递延开始日期：" prop="startDate" :label-width="180">
                    <Date-picker
                      type="date"
                      :value="addFrom.startDate"
                      placeholder="请选择日期"
                      @on-change="changeStartDate($event)"
                    ></Date-picker>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col :span="24">
                  <FormItem label="进口递延应税金额：" prop="taxableAmount" :label-width="180">
                    <InputNumber
                      :min="0"
                      v-model="addFrom.taxableAmount"
                      :precision="0"
                      :active-change="false"
                      placeholder="请输入金额"
                      type="number"
                      style="width: 300px"
                    ></InputNumber>
                    <span>EUR</span>
                    <p
                      class="label-tip"
                      style="position: absolute; left: -169px; color: rgb(237, 62, 62); bottom: -25px"
                    >
                      (填写整数)
                    </p>
                  </FormItem>
                </Col>
              </Row>

              <!-- <Row>
              <Col :span="24">
                <FormItem label="进口增值金额：" prop="vatAmount" :label-width="180">
                  <InputNumber :min="0" v-model="addFrom.vatAmount" :precision="2" :active-change="false"
                  placeholder="请输入金额" type="number" style="width: 300px"></InputNumber>
                <span>EUR</span>
                </FormItem>
              </Col>
            </Row> -->

              <Row>
                <Col :span="24">
                  <FormItem label="进口递延文件：" prop="deferredFileList" :label-width="180">
                    <span slot="label" class="fr-file-tip">
                      <span>进口递延文件：</span>
                      <Tooltip max-width="300" placement="right">
                        <span class="tips-icon">?</span>
                        <div slot="content" class="info">
                          <p class="ph">递延关单及其库存管理记录。</p>
                        </div>
                      </Tooltip>
                    </span>
                    <Upload
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          handleSuccessUpload(res, file, fileList);
                        }
                      "
                      :on-error="handleDiscountFormatError"
                      :on-remove="
                        (file, fileList) => {
                          handleRemoveFileList(file, fileList);
                        }
                      "
                      :format="['pdf', 'doc', 'docx', 'rar', 'zip', 'xls', 'xlsx', 'csv', 'txt']"
                      :max-size="102400"
                      :default-file-list="deferredFileList"
                      :on-exceeded-size="handleMaxSize"
                      :on-format-error="handleFormatErrorEcFile"
                    >
                      <Button icon="ios-cloud-upload-outline" class="amzUpload btnfile" style="margin-top: 10px">
                        请上传递延文件
                      </Button>
                    </Upload>
                    <div style="font-size: 12px; color: rgb(247, 151, 40); margin-top: 10px">
                      注：支持TXT、EXCEL、DOC、RAR、PDF、ZIP 格式上传
                    </div>
                  </FormItem>
                </Col>
              </Row>
            </template>
            <div
              class="zero-declear-tip"
              v-if="addFrom.declareRule == 0 && (addFrom.countryCode == 'AE' || addFrom.countryCode == 'SA')"
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
              <FormItem label="零申报凭证：" prop="amx_file_url" :label-width="130" v-if="addFrom.declareRule == '0'">
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
                  v-if="addFrom.declareRule == 0 && (addFrom.countryCode == 'AE' || addFrom.countryCode == 'SA')"
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
              v-if="addFrom.countryCode != 'SA' && addFrom.countryCode != 'AE' && addFrom.declareRule != '0'"
            >
              <FormItem
                v-if="productFunctionCode != 23"
                label="VAT国家:"
                class="VATCountry"
                :label-width="130"
                prop="tfnCountryCode"
              >
                <span class="zhuce">(已注册)</span>
                <CheckboxGroup v-model="addFrom.tfnCountryCode">
                  <!-- v-if="isBeforeYear" -->
                  <Checkbox
                    :label="item.countryCode"
                    :disabled="addFrom.countryCode == item.countryCode"
                    v-for="item in tfnCountryList"
                    :key="item.countryCode"
                  >
                    <img class="countryFlag" :src="item.bg" alt="" />
                    <span class="countryName">{{ item.countryName }}</span>
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </div>
            <!-- gsw IOSS的其他平台销售额 -->
            <div v-if="addFrom.declareRule != 0 && productFunctionCode == 23">
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
                      {{ item.countryName }} {{ Number(item.sales).toFixed(2) }} {{ item.currency }}
                    </Tag>
                  </div>
                  <div v-if="otherPlatformsFormObj.handIncludeTaxSalesFilePath">
                    <a :href="otherPlatformsFormObj.handIncludeTaxSalesFilePath" target="_blank">
                      {{ otherPlatformsFormObj.origFileName }}
                    </a>
                    <Icon
                      style="color: #888; cursor: pointer"
                      v-if="otherPlatformsFormObj.handIncludeTaxSalesFilePath"
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
              <Col span="18">
                <FormItem
                  :label="
                    addFrom.countryCode == 'GB' || showRegisterCountryCode ? '其它平台：' : '其它平台含税销售额：'
                  "
                  v-if="addFrom.declareRule != 0"
                >
                  <Button
                    class="amzUpload btnfile"
                    v-if="!otherPlatformsFormObj.handIncludeTaxSalesFilePath"
                    @click="otherPlatformsMadal = true"
                  >
                    点击填写
                  </Button>
                  <div v-else class="otherPlatformBox">
                    <span class="num" v-if="otherPlatformsFormObj.handIncludeTaxSales">
                      {{ otherPlatformsFormObj.handIncludeTaxSales }}
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

                    <span class="num" v-if="otherPlatformsFormObj.handExIncludeTaxSales">
                      {{ otherPlatformsFormObj.handExIncludeTaxSales }}
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

                    <span class="link" v-if="otherPlatformsFormObj.handIncludeTaxSalesFilePath">
                      <a :href="otherPlatformsFormObj.handIncludeTaxSalesFilePath" target="_blank">
                        <img
                          style="float: left; margin-right: 5px; margin-top: 2px"
                          src="../../../assets/images/common/linkIcon.png"
                          alt=""
                        />
                        {{ otherPlatformsFormObj.origFileName || '其它平台含税销售额文件' }}
                      </a>
                      <span class="link" @click="otherPlatformsMadal = true">
                        <!-- <Icon
                          style="color: #888; cursor: pointer"
                          v-if="otherPlatformsFormObj.handIncludeTaxSalesFilePath"
                          type="md-close"
                          @click="handleRemoveSaleFile"
                        /> -->

                        <img
                          src="../../../assets/images/common/edit1.png"
                          style="margin-right: -2px; margin-left: 8px"
                          alt=""
                        />
                        修改
                      </span>
                    </span>
                    <span
                      class="num"
                      style="margin-top: 8px"
                      v-if="otherPlatformsFormObj.handExPlatformWithHoldandRemitTax"
                    >
                      {{ otherPlatformsFormObj.handExPlatformWithHoldandRemitTax }}
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

                    <span
                      class="num"
                      style="margin-top: 8px"
                      v-if="otherPlatformsFormObj.handPlatformWithHoldandRemitTax"
                    >
                      {{ otherPlatformsFormObj.handPlatformWithHoldandRemitTax }}
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

                    <span class="num" style="margin-top: 8px" v-if="otherPlatformsFormObj.otherExIncludeTaxAmt">
                      {{ otherPlatformsFormObj.otherExIncludeTaxAmt }}
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

                    <span class="num" style="margin-top: 8px" v-if="otherPlatformsFormObj.eurOtherB2bExcludeTaxSales">
                      {{ otherPlatformsFormObj.eurOtherB2bExcludeTaxSales }}
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
                  </div>
                </FormItem>
              </Col>
            </Row>

            <!-- naoki add 德国欧盟内费用申报 -->

            <Row v-if="addFrom.countryCode == 'DE' && addFrom.declareRule == 0">
              <Col span="24">
                <FormItem label="是否有德国递延或欧盟内免税采购项?：">
                  <RadioGroup v-model="addFrom.deDeferFlag">
                    <Radio :label="1">
                      <span style="float: right; margin-top: 3px">是</span>
                    </Radio>
                    <Radio :label="0">
                      <span style="float: right; margin-top: 3px">否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>

            <Row
              v-if="
                addFrom.countryCode == 'DE' &&
                (addFrom.declareRule != 0 || (addFrom.declareRule == 0 && addFrom.deDeferFlag))
              "
            >
              <Col span="24">
                <FormItem label="欧盟内免税收购项金额：">
                  <InputNumber
                    :min="1"
                    v-model="addFrom.ecAcqPrice"
                    :precision="0"
                    placeholder="请输入金额"
                    type="number"
                    style="width: 300px"
                  ></InputNumber>
                  <span>EUR</span>
                  <p class="label-tip" style="position: absolute; left: 20px; color: rgb(247, 151, 40); bottom: -18px">
                    （递延清关金额）
                  </p>
                  <span style="color: rgb(247, 151, 40); margin-top: 10px; margin-left: 20px"
                    >请四舍五入填写整数金额，若填写小数系统会自动四舍五入取整数</span
                  >
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="欧盟内免税收购项文件：">
                  <Upload
                    :disabled="!addFrom.ecAcqPrice"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-progress="
                      () => {
                        (spinShow = true), (operateText = '上传文件中，请稍后');
                      }
                    "
                    :on-success="
                      (res, file, fileList) => {
                        handleAmzSuccessotherEc(res, file, fileList, 'ecAcqFilePath');
                      }
                    "
                    :on-error="handleUploadError"
                    :on-remove="
                      (file, fileList) => {
                        handleAmzRemoveFileotherEc(file, fileList, 'ecAcqFilePath');
                      }
                    "
                    :on-exceeded-size="handleMaxSize"
                    :format="['pdf', 'jpg', 'png', 'rar', 'zip']"
                    :max-size="102400"
                    :default-file-list="ecAcqFilePathList"
                    :on-format-error="handleFormatErrorEc"
                    :before-upload="handleAmzBeforeUploadEc"
                    class="deFile"
                  >
                    <Button icon="ios-cloud-upload-outline" style="margin-top: 2px" class="amzUpload btnfile">
                      请上传文件
                    </Button>
                  </Upload>
                  <div style="color: rgb(247, 151, 40); position: absolute; left: 340px; top: 0; line-height: 16px">
                    <p>请上传应税19%的欧盟内收购（递延清关），</p>
                    <p>文件支持JPG/JPEF/PNG/压缩包</p>
                  </div>
                  <div class="saleFile" v-if="addFrom.filePath !== '' && taxNumInfo.status == 18">
                    <a target="_blank" v-if="addFrom.filePath !== ''" :href="addFrom.filePath" class="show-pdf">
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
            <Row
              v-if="
                addFrom.countryCode == 'DE' &&
                (addFrom.declareRule != 0 || (addFrom.declareRule == 0 && addFrom.deDeferFlag))
              "
            >
              <Col span="24">
                <FormItem label="欧盟内免税采购项金额：">
                  <InputNumber
                    :min="1"
                    v-model="addFrom.freePurchasePrice"
                    :precision="0"
                    placeholder="请输入金额"
                    type="number"
                    style="width: 300px"
                  ></InputNumber>
                  <span>EUR</span>
                  <span style="color: rgb(247, 151, 40); margin-top: 10px; margin-left: 20px"
                    >请四舍五入填写整数金额，若填写小数系统会自动四舍五入取整数</span
                  >
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="欧盟内免税采购项文件：">
                  <Upload
                    :disabled="!addFrom.freePurchasePrice"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-progress="
                      () => {
                        (spinShow = true), (operateText = '上传文件中，请稍后');
                      }
                    "
                    :on-success="
                      (res, file, fileList) => {
                        handleAmzSuccessotherEc(res, file, fileList, 'freePurchaseFile');
                      }
                    "
                    :on-error="handleUploadError"
                    :on-remove="
                      (file, fileList) => {
                        handleAmzRemoveFileotherEc(file, fileList, 'freePurchaseFile');
                      }
                    "
                    :on-exceeded-size="handleMaxSize"
                    :format="['pdf', 'jpg', 'png', 'rar', 'zip']"
                    :max-size="102400"
                    :default-file-list="freePurchaseFileList"
                    :on-format-error="handleFormatErrorEc"
                    :before-upload="handleAmzBeforeUploadPu"
                    class="deFile"
                  >
                    <Button icon="ios-cloud-upload-outline" style="margin-top: 2px" class="amzUpload btnfile">
                      请上传文件
                    </Button>
                  </Upload>
                  <div style="color: rgb(247, 151, 40); position: absolute; left: 340px; top: 10px; line-height: 18px">
                    <p>文件支持JPG/JPEF/PNG/压缩包</p>
                  </div>
                  <div class="saleFile" v-if="addFrom.filePath !== '' && taxNumInfo.status == 18">
                    <a target="_blank" v-if="addFrom.filePath !== ''" :href="addFrom.filePath" class="show-pdf">
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
            <Row v-if="addFrom.countryCode == 'ES'">
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
                <FormItem label="ECL申报：" prop="ecl" :label-width="130">
                  <RadioGroup v-model="addFrom.ecl">
                    <Radio :label="1">
                      <span style="float: right; margin-top: 3px">是</span>
                    </Radio>
                    <Radio :label="2">
                      <span style="float: right; margin-top: 3px">否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="addFrom.countryCode == 'ES'">
              <Col :span="24">
                <FormItem v-if="addFrom.ecl == true" :label-width="130">
                  <div style="margin-bottom: 10px">
                    <span style="width: 260px; display: inline-block">
                      ECL销售项金额：
                      <span v-if="eclSalePrice !== 0"> {{ eclSalePrice }} 欧元 </span>
                    </span>
                    <span>
                      <Button class="amzUpload btnfile" @click="eclSellAmountModal = true">添加销售项</Button>
                    </span>
                  </div>
                  <div>
                    <span style="width: 260px; display: inline-block">
                      ECL采购项金额：
                      <span v-if="eclPurchasePrice !== 0">
                        {{ eclPurchasePrice }}
                        欧元
                      </span>
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
            <div class="discountBox" v-if="addFrom.declareRule != 0 && productFunctionCode != 23">
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
                      :on-error="handleDiscountFormatError"
                      :on-remove="
                        (file, fileList) => {
                          handleRemoveFile(file, fileList, row);
                        }
                      "
                      :format="['pdf', 'jpg', 'png', 'rar', 'zip']"
                      :on-format-error="handleFormatErrorEc"
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
        <Button type="primary" @click="saveSnapshoot" v-if="workId">保存草稿</Button>
        <Button type="primary" @click="checkTax()" v-if="addFrom.declareRule != 0">核算税金</Button>
        <Button
          @click="sureSubmit('addFrom')"
          v-if="servicesId != undefined"
          :disabled="!isCheckTax && addFrom.declareRule !== 0"
          type="info"
          ghost
          style="margin-left: 15px; background-color: #fff"
        >
          {{ buttonText }}
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
    <div class="step2" v-if="addFrom.declareRule != 0">
      <div class="step2_content">
        <p class="title">
          <span>税金计算结果</span>
          <span
            @click="downLoadTaxDetail('addFrom')"
            v-if="
              addFrom.countryCode != 'SA' &&
              productFunctionCode != 23 &&
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
          <template v-if="addFrom.countryCode == 'GB'">
            <div class="item">
              <span>未代扣代缴不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.handExcludeTaxSales | formatQianFenWei }}</span
              >
            </div>
            <div class="item">
              <span>销项税金：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.outputTax | formatQianFenWei }}</span>
            </div>
            <div class="item">
              <span>进项税金：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.inputTax | formatQianFenWei }}</span>
            </div>
            <div class="item">
              <span>平台已代扣代缴不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.excludeTaxSales | formatQianFenWei }}</span
              >
            </div>
            <div class="item">
              <span>出口不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.exportExclTaxAmount | formatQianFenWei }}</span
              >
            </div>
            <div class="item">
              <span>0税率供应不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.supplySalesExcludeTaxAmount | formatQianFenWei }}</span
              >
            </div>
            <div class="item">
              <span>PVA金额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.discountAmount | formatQianFenWei }}</span>
            </div>
            <div class="item">
              <span>最终应缴税金：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.tax | formatQianFenWei }}</span>
            </div>
          </template>

          <template v-else-if="showRegisterCountryCode">
            <div class="item">
              <span>平台未代扣代缴不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.noPayExcludeTaxSales | formatQianFenWei }}</span
              >
            </div>
            <div class="item">
              <span>销项税金：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.outputTax | formatQianFenWei }}</span>
            </div>
            <div class="item">
              <span>进项税金：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.inputTax | formatQianFenWei }}</span>
            </div>
            <div class="item">
              <span>平台已代扣代缴不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.excludeTaxSales | formatQianFenWei }}</span
              >
            </div>
            <div class="item">
              <span>出口不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.exportExclTaxAmount | formatQianFenWei }}</span
              >
            </div>
            <div class="item" v-if="['IT', 'NL', 'ES', 'FR'].includes(addFrom.countryCode)">
              <span>本国B2B0税率供应不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp;
                {{ returnTaxData.homeCountryB2bSupplySalesExcludeTaxAmount | formatQianFenWei }}</span
              >
            </div>
            <div class="item">
              <span>欧盟内跨境B2B不含税销售额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.eurB2bExcludeTaxSales | formatQianFenWei }}</span
              >
            </div>
            <div class="item" v-if="addFrom.countryCode == 'DE'">
              <span>欧盟内免税收购项金额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.otherEcAcqPrice | formatQianFenWei }}</span
              >
            </div>
            <div class="item" v-if="addFrom.countryCode == 'DE'">
              <span>欧盟内免税采购项金额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.freePurchasePrice | formatQianFenWei }}</span
              >
            </div>
            <div class="item" v-if="addFrom.countryCode == 'ES'">
              <span>ECL销售项金额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.eclSales | formatQianFenWei }}</span>
            </div>
            <div class="item" v-if="addFrom.countryCode == 'ES'">
              <span>ECL采购项金额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.eclPurchaseAmount | formatQianFenWei }}</span
              >
            </div>
            <div class="item" v-if="addFrom.countryCode == 'FR'">
              <span>进口递延应税金额：</span>
              <span class="money"
                >{{ currencySign }} &nbsp; {{ returnTaxData.defTaxableAmount | formatQianFenWei }}</span
              >
            </div>

            <div class="item">
              <span>最终应缴税金：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.tax | formatQianFenWei }}</span>
            </div>
          </template>

          <template v-else>
            <div class="item">
              <span>含税销售总额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.includeTaxSales }}</span>
            </div>
            <div class="item">
              <span>不含税销售总额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.excludeTaxSales }}</span>
            </div>
            <div class="item" v-if="productFunctionCode != 23">
              <span>抵扣金额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.discountAmount }}</span>
            </div>
            <div class="item" v-if="productFunctionCode != 23">
              <span>销项税额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.outputTax }}</span>
            </div>
            <div
              class="item"
              v-if="productFunctionCode != 23 && addFrom.countryCode != 'SA' && addFrom.countryCode != 'AE'"
            >
              <span>平台代扣代缴：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.platformWithholdandremitTax }}</span>
            </div>
            <div class="item" v-if="addFrom.countryCode == 'GB'">
              <span>PVA金额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.enPvaAmount }}</span>
            </div>
            <div
              class="item"
              v-if="productFunctionCode != 23 && addFrom.countryCode != 'SA' && addFrom.countryCode != 'AE'"
            >
              <span>B2B不含税销售额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ b2bNoPrice }}</span>
            </div>
            <div class="item" v-if="addFrom.countryCode == 'ES'">
              <span>ECL销售项金额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.eclSales }}</span>
            </div>
            <div class="item" v-if="addFrom.countryCode == 'ES'">
              <span>ECL采购项金额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.eclPurchaseAmount }}</span>
            </div>
            <div class="item" v-if="addFrom.countryCode == 'DE'">
              <span>欧盟内免税收购项金额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.purchaseAmount }}</span>
            </div>
            <div class="item" v-if="addFrom.countryCode == 'DE'">
              <span>欧盟内免税采购项金额：</span>
              <span class="money">{{ currencySign }} &nbsp; {{ returnTaxData.freePurchasePrice }}</span>
            </div>
            <div class="item">
              <span>最终应缴税金：</span>
              <span class="red">{{ currencySign }} &nbsp; {{ returnTaxData.tax }}</span>
            </div>
          </template>
        </div>
        <div class="resultBox" v-if="productFunctionCode != 23">
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
          <div v-if="returnData.length > 0 && addFrom.declareRule != '0' && servicesId !== undefined">
            <div class="jiankong normal" v-if="returnTaxData.status == 0 && returnDataSale.length > 0">
              <span class="JkTitle">远程销售额监控</span>
              <span class="status" @click="getStatus()">
                <img src="../../../assets/images/common/blueStatus.png" alt="" />
                正常 >>
              </span>
            </div>
            <div class="jiankong unnormal" v-if="returnTaxData.status == 1 && returnDataSale.length > 0">
              <span class="JkTitle">远程销售额监控</span>
              <span class="status" @click="getStatus()">
                <img src="../../../assets/images/common/redStatus.png" alt="" />
                异常 >>
              </span>
            </div>
          </div>
        </div>

        <div v-if="productFunctionCode == 23">
          <span style="font-weight: 600; color: #333333; font-size: 18px">各国税金</span>
          <Table
            :data="declareIossDetailDTOS"
            max-height="300"
            :columns="returnColumnsOU"
            style="margin-top: 20px"
          ></Table>
        </div>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div class="loadingText">{{ operateText }}</div>
    </Spin>
    <div style="clear: both"></div>
    <Modal
      v-model="otherPlatformsMadal"
      :title="addFrom.countryCode == 'GB' || showRegisterCountryCode ? '其他平台' : '其他平台含税销售额'"
    >
      <div class="promptBg">
        <p v-if="addFrom.countryCode == 'GB' || showRegisterCountryCode">
          <span>温馨提示：</span>
          如有其他平台需要VAT申报，请在此处填写数据。不含税销售额=含税销售额/（1+税率）
        </p>
        <p v-else>
          <span>温馨提示：</span>
          如有其它平台需要VAT申报，请在此处填写含税销售额，含税销售额的计算方式可联系客服！(注意：填写的销售额币种为您需要申报的币种)
        </p>
      </div>
      <Form :label-width="120" ref="otherPlatforms" :model="otherPlatformsForm">
        <FormItem
          label="含税销售额"
          prop="handIncludeTaxSales"
          v-if="addFrom.countryCode != 'GB' && !showRegisterCountryCode"
          :rules="{ required: 'true', type: 'number', message: '请输入含税销售额', trigger: 'change' }"
        >
          <InputNumber
            placeholder="请输入含税销售额"
            type="number"
            v-model="otherPlatformsForm.handIncludeTaxSales"
            style="width: 300px"
          ></InputNumber>
        </FormItem>

        <FormItem
          label="其他平台未代扣代缴不含税销售额"
          prop="handExIncludeTaxSales"
          v-if="addFrom.countryCode == 'GB' || showRegisterCountryCode"
          :rules="{
            required: 'true',
            type: 'number',
            message: '请输入其他平台未代扣代缴不含税销售额',
            trigger: 'change',
          }"
        >
          <InputNumber
            placeholder="请输入其他平台未代扣代缴不含税销售额"
            type="number"
            v-model="otherPlatformsForm.handExIncludeTaxSales"
            style="width: 300px"
          ></InputNumber>
          <span> &nbsp; {{ getUnit }}</span>
        </FormItem>

        <FormItem
          :label="addFrom.countryCode == 'GB' || showRegisterCountryCode ? '其他平台销售文件' : '其它平台含税销售文件'"
          prop="handIncludeTaxSalesFilePath"
          :rules="{
            required: 'true',
            message:
              addFrom.countryCode == 'GB' || showRegisterCountryCode
                ? '请上传其它平台销售文件'
                : '请上传其它平台含税销售文件',
            trigger: 'change',
          }"
        >
          <Upload
            ref="otherSaleFileRef"
            v-model="otherPlatformsForm.handIncludeTaxSalesFilePath"
            :before-upload="handleAmzBeforeUploadPlatform"
            :on-format-error="handIncludeTaxSalesFile"
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
            :max-size="102400"
            :default-file-list="otherSaleFileList"
            :data="{ prefix: '' }"
            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'word', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'zip', 'rar']"
          >
            <Button style="width: 300px; background: #16ade9; color: #ffffff" icon="ios-cloud-upload-outline">
              点击上传
            </Button>
          </Upload>
        </FormItem>
        <FormItem
          label="其他平台平台代扣代缴金额"
          prop="handPlatformWithHoldandRemitTax"
          v-if="!['SA', 'AE', 'GB'].includes(addFrom.countryCode) && !showRegisterCountryCode"
          :rules="{
            required: 'true',
            type: 'number',
            message: '请输入其他平台平台代扣代缴金额',
            trigger: 'change',
          }"
        >
          <InputNumber
            placeholder="请输入其他平台平台代扣代缴金额"
            type="number"
            v-model="otherPlatformsForm.handPlatformWithHoldandRemitTax"
            style="width: 300px"
          ></InputNumber>
        </FormItem>

        <FormItem
          label="其他平台已代扣代缴不含税销售额"
          prop="handExPlatformWithHoldandRemitTax"
          v-if="addFrom.countryCode == 'GB' || showRegisterCountryCode"
          :rules="{
            required: 'true',
            type: 'number',
            message: '请输入其他平台已代扣代缴不含税销售额',
            trigger: 'change',
          }"
        >
          <InputNumber
            placeholder="请输入其他平台已代扣代缴不含税销售额"
            type="number"
            v-model="otherPlatformsForm.handExPlatformWithHoldandRemitTax"
            style="width: 300px"
          ></InputNumber>
          <span> &nbsp; {{ getUnit }}</span>
        </FormItem>
        <FormItem
          label="其他平台出口不含税销售额"
          prop="handPlatformWithHoldandRemitTax"
          v-if="addFrom.countryCode == 'GB'"
          :rules="{ required: 'true', type: 'number', message: '请输入其他平台出口不含税销售额', trigger: 'change' }"
        >
          <InputNumber
            placeholder="请输入其他平台出口不含税销售额"
            type="number"
            v-model="otherPlatformsForm.handPlatformWithHoldandRemitTax"
            style="width: 300px"
          ></InputNumber>
          <span> &nbsp; {{ getUnit }}</span>
        </FormItem>

        <FormItem
          label="其他平台出口不含税销售额"
          prop="otherExIncludeTaxAmt"
          v-if="showRegisterCountryCode"
          :rules="{ required: 'true', type: 'number', message: '请输入其他平台出口不含税销售额', trigger: 'change' }"
        >
          <InputNumber
            placeholder="请输入其他平台出口不含税销售额"
            type="number"
            v-model="otherPlatformsForm.otherExIncludeTaxAmt"
            style="width: 300px"
          ></InputNumber>
          <span> &nbsp; {{ getUnit }}</span>
        </FormItem>

        <FormItem
          label="其他平台跨境B2B不含税销售额"
          prop="eurOtherB2bExcludeTaxSales"
          v-if="showRegisterCountryCode"
          :rules="{ required: 'true', type: 'number', message: '请输入其他平台跨境B2B不含税销售额', trigger: 'change' }"
        >
          <InputNumber
            placeholder="请输入其他平台跨境B2B不含税销售额"
            v-model="otherPlatformsForm.eurOtherB2bExcludeTaxSales"
            style="width: 300px"
          ></InputNumber>
          <span> &nbsp; {{ getUnit }}</span>
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
    <Modal
      v-model="otherSellModal"
      :title="addFrom.countryCode == 'GB' || showRegisterCountryCode ? '其他平台' : '其他平台含税销售额'"
      :mask-closable="false"
      width="760"
    >
      <Form :label-width="180">
        <Table :data="otherOmCountryList" :columns="otherOmColumns" height="460">
          <template slot="includTaxPrice" slot-scope="{ row, index }">
            <Input v-model="row.sales" maxlength="10" @on-change="changeTaxPrice(row, index)" />
          </template>
        </Table>
        <FormItem label="其它平台含税销售文件" prop="handIncludeTaxSalesFilePath" style="margin-top: 20px">
          <Upload
            :before-upload="handleAmzBeforeUploadPlatform"
            :on-format-error="handIncludeTaxSalesFile"
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
            :max-size="102400"
            :default-file-list="otherSaleFileList"
            ref="otherPlatformsUpload"
            :data="{ prefix: '' }"
            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'word', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'zip', 'rar']"
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
      <Form :label-width="180">
        <Row>
          <Col :span="12">公司中文名称：{{ taxNumInfo.companyNameZh }}</Col>
          <Col :span="12">公司英文名称：{{ taxNumInfo.companyNameEn }}</Col>
        </Row>
        <Row>
          <Col :span="12">IOSS税号：{{ taxNumInfo.vatTaxNumber }}</Col>
          <Col :span="12">
            当前申报区间： {{ beginTime && beginTime != '' ? beginTime.slice(0, 10) : '' }} 至
            {{ endTime && endTime != '' ? endTime.slice(0, 10) : '' }}
          </Col>
        </Row>
        <Divider />
        <div class="clearfix">
          <span style="font-size: 16px; margin-top: 20px">申报数据</span>
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
              <td>{{ item.deductionAmt }}</td>
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
        <Button class="footerBt" type="primary" @click="submit">确认</Button>
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
          src="https://file.itaxs.com/dev/20230704/0069850469d4436dbbed93b6cfd48659.jpg"
          alt=""
          v-if="addFrom.countryCode !== 'SA' && addFrom.countryCode !== 'AE'"
        />
        <img
          style="width: 100%"
          src="https://file.itaxs.com/dev/20210510/70ef5ec032884477acb4c018864ce49e.png"
          alt=""
          v-else
        />
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
      :title="addFrom.declareRule == '0' ? '是否确认零申报？' : '请确认您的申报数据'"
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
              {{ beginTime != '' ? beginTime.slice(0, 10) : taxNumInfo.beginTime.slice(0, 10) }}至{{
                endTime != '' ? endTime.slice(0, 10) : taxNumInfo.endTime.slice(0, 10)
              }}
            </span>
          </Col>
        </Row>
      </div>
      <Divider />
      <div class="submit-tip-box">
        <div class="content" v-if="addFrom.declareRule == '0'">
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

          <div class="sureData-box" v-if="showRegisterCountryCode">
            <div class="row">
              <span class="row-key">
                平台未代扣代缴不含税销售额<br />
                Sales excluding VAT not withheld by platform
              </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.noPayExcludeTaxSales | formatQianFenWei }}</span
              >
            </div>

            <div class="row">
              <span class="row-key">
                销项税金<br />
                Output VAT
              </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.outputTax | formatQianFenWei }}</span
              >
            </div>

            <div class="row">
              <span class="row-key">
                进项税金<br />
                Input VAT
              </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.inputTax | formatQianFenWei }}</span
              >
            </div>

            <div class="row">
              <span class="row-key">
                平台已代扣代缴不含税销售额<br />
                Sales excluding VAT withheld by platform
              </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.excludeTaxSales | formatQianFenWei }}</span
              >
            </div>

            <div class="row">
              <span class="row-key">
                出口不含税销售额<br />
                Sales excluding VAT for export
              </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.exportExclTaxAmount | formatQianFenWei }}</span
              >
            </div>

            <div class="row" v-if="['IT', 'NL', 'ES', 'FR'].includes(addFrom.countryCode)">
              <span class="row-key"> 本国B2B0税率供应不含税销售额<br /> </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{
                  returnTaxData.homeCountryB2bSupplySalesExcludeTaxAmount | formatQianFenWei
                }}</span
              >
            </div>

            <div class="row">
              <span class="row-key"> 欧盟内跨境B2B不含税销售额<br /> </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.eurB2bExcludeTaxSales | formatQianFenWei }}</span
              >
            </div>

            <div class="row" v-if="addFrom.countryCode == 'DE'">
              <span class="row-key"> 欧盟内免税收购项金额<br /> </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.otherEcAcqPrice | formatQianFenWei }}</span
              >
            </div>

            <div class="row" v-if="addFrom.countryCode == 'DE'">
              <span class="row-key"> 欧盟内免税采购项金额<br /> </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.freePurchasePrice | formatQianFenWei }}</span
              >
            </div>

            <div class="row" v-if="addFrom.countryCode == 'ES'">
              <span class="row-key"> ECL销售项金额<br /> </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.eclSales | formatQianFenWei }}</span
              >
            </div>

            <div class="row" v-if="addFrom.countryCode == 'ES'">
              <span class="row-key"> ECL采购项金额<br /> </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.eclPurchaseAmount | formatQianFenWei }}</span
              >
            </div>

            <div class="row" v-if="addFrom.countryCode == 'FR'">
              <span class="row-key"> 进口递延应税金额<br /> </span>
              <span class="row-value"
                >{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.defTaxableAmount | formatQianFenWei }}</span
              >
            </div>

            <div class="row">
              <span class="row-key">
                最终应缴税金<br />
                VAT payable
              </span>
              <span class="row-value">{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.tax | formatQianFenWei }}</span>
            </div>
          </div>

          <div class="sureData-box" v-if="!showRegisterCountryCode">
            <div class="row">
              <span>Summe（含税销售额）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.includeTaxSales }}</span>
            </div>
            <div class="row">
              <span>Netto（不含税销售额）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.excludeTaxSales }}</span>
            </div>
            <div class="row">
              <span>Umsatzsteuer（销项税额）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.outputTax }}</span>
            </div>
            <div class="row">
              <span>Vorsteuer（抵扣金额）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.discountAmount }}</span>
            </div>
            <div class="row" v-if="addFrom.countryCode == 'DE' && addFrom.ecAcqPrice">
              <span>欧盟内免税收购项金额</span>
              <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.purchaseAmount }}</span>
            </div>
            <div class="row" v-if="addFrom.countryCode == 'DE' && addFrom.freePurchasePrice">
              <span>欧盟内免税采购项金额</span>
              <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.freePurchasePrice }}</span>
            </div>
            <template v-if="addFrom.countryCode != 'SA' && addFrom.countryCode != 'AE' && productFunctionCode !== 23">
              <div class="row">
                <span>B2B不含税销售额</span>
                <span>{{ currencySign }} &nbsp;&nbsp;{{ b2bNoPrice }}</span>
              </div>
              <div class="row">
                <span>平台代扣代缴</span>
                <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.platformWithholdandremitTax }}</span>
              </div>
            </template>
            <template v-if="addFrom.countryCode == 'ES' && addFrom.ecl == true">
              <div class="row">
                <span>采购项</span>
                <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.eclPurchaseAmount }}</span>
              </div>
              <div class="row">
                <span>销售项</span>
                <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.eclSales }}</span>
              </div>
            </template>
            <div class="row">
              <span>Guthaben（最终应缴税金）</span>
              <span>{{ currencySign }} &nbsp;&nbsp;{{ returnTaxData.tax }}</span>
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
    <Modal v-model="eclSellAmountModal" title="手动添加销售项" width="930" class="submit-box">
      <div style="margin-right: 80px">
        <table class="ecl-table">
          <thead>
            <tr>
              <th>对方税号</th>
              <th>销售金额（欧元）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in eclSaleItems" :key="index">
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
                    v-if="eclSaleItems.length > 1"
                    @click="handleRemoveEclSell(index)"
                    class="ecl-line-remove"
                    type="md-remove-circle"
                  />
                  <Icon
                    size="28"
                    v-if="index == eclSaleItems.length - 1"
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
    <Modal v-model="eclBuyAmountModal" title="手动添加采购项" width="930" class="submit-box">
      <div style="margin-right: 80px">
        <table class="ecl-table">
          <thead>
            <tr>
              <th>对方税号</th>
              <th>销售金额（欧元）</th>
              <!-- <th>购买时间<br>（TRANSACTION_COMPLETE_DATE）</th>
              <th>对方姓名<br>（BUYER_NAME）</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in eclPurchaseItems" :key="index">
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
                    v-if="eclPurchaseItems.length > 1"
                    @click="handleRemoveEclBuy(index)"
                    class="ecl-line-remove"
                    type="md-remove-circle"
                  />
                  <Icon
                    size="28"
                    v-if="index == eclPurchaseItems.length - 1"
                    @click="handleAddEclBuy"
                    class="ecl-line-add"
                    type="md-add-circle"
                  />
                </div>
              </td>
              <!-- <td>
                <Date-picker type="date"
                            :value="item.purchaseTime"
                            @on-change="changePurchaseTime($event,'eclPurchaseItems',index)"></Date-picker>
              </td>
              <td>
                <Input v-model="item.purchaser" placeholder="请输入对方姓名" maxlength="50" />
                
              </td> -->
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
    <ShowTipDialog :showTipDialog.sync="showTipDialog" :tipMessage="tipMessage" />
  </div>
</template>
<script>
import { tfnCountryList } from './enumObj.js';
const otherPlatformsFormInit = {
  handIncludeTaxSalesFilePath: '',
  handIncludeTaxSales: 0,
  handExIncludeTaxSales: 0,
  handPlatformWithHoldandRemitTax: 0,
  handExPlatformWithHoldandRemitTax: 0,
  otherExIncludeTaxAmt: 0,
  eurOtherB2bExcludeTaxSales: 0,
  origFileName: '',
};
export default {
  data() {
    return {
      otherOmCountryList: otherOmCountryList, // ioss其他平台含税销售额的国家列表
      isUpload: false,
      eclBuyAmountModal: false,
      eclSellAmountModal: false,
      // 所有销售报告类型
      productFunctionCode: this.$route.query.productFunctionCode,
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
      tfnCountryList,
      ifE: false, // 是否英国
      ruleGiveFrom: {
        tfnCountryCode: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: '至少选择一个国家',
            trigger: 'change',
          },
        ],
      },
      // 添加其他平台含税销售额
      otherSellForm: {
        handIncludeTaxSalesFilePath: '',
      },
      otherSellFormRules: {
        handIncludeTaxSalesFilePath: [
          {
            required: 'true',
            message: '请上传其它平台含税销售文件',
            trigger: 'change',
          },
        ],
      },
      declareTax: '',
      contentStyleObj: {
        height: '',
      },
      social: ['facebook', 'github'],
      otherPlatformsMadal: false,
      otherPlatformsForm: { ...otherPlatformsFormInit },
      otherPlatformsFormObj: { ...otherPlatformsFormInit },
      modelAddCom: false,
      loadingget: false,
      loadingRemark: false,
      currency: '', // 货币单位
      defaultList: [],
      uploadList: [],
      imgName: '',
      visible: false,
      fileUpload: this.ImgUrl,
      // action
      addFrom: {
        ecAcqPrice: null,
        ecAcqFilePath: '',
        freePurchasePrice: null,
        freePurchaseFile: '',
        countryCode: this.$route.query.countryCode,
        declareRule: 1,
        filePath: '',
        taxRate: '',
        tfnCountryCode: [],
        // workId: this.$route.query.workId,
        periodType: this.$route.query.periodType,
        salePlatformType: 0,
        oss: '',
        ioss: '',
        // isShop: 0,
        ecl: '', // 是否进行ECL申报
        eclPurchaseItems: [],
        eclSaleItems: [],
        iossCalu: false,
        otherPlatformSaleDto: [],
        sellFile: '',
        frenchDeferredFlag: null,
        customsNumber: '', // 法国海关号
        deferredFilePath: '', // 进口递延文件路径
        startDate: '', // 法国递延开始时间
        taxableAmount: 0, // 法国递延应税金额
        deferredFileList: '',
        deferredFileName: '',
      },
      deferredFileList: [],
      otherSaleFileList: [],
      ecAcqFilePathList: [],
      freePurchaseFileList: [],
      amx_file_url: '',
      xiaoshouUrl: '',
      ruleAddFrom: {
        declareRule: { required: 'true', type: 'number', message: '请选择计税方式', trigger: 'change' },
        countryCode: { required: 'true', message: '请选择需要报税的国家', trigger: 'change' },
        taxRate: { required: 'true', message: '请选择税率', trigger: 'change' },
        filePath: { required: 'true', message: '请上传对应的文件', trigger: 'change' },
        salePlatformType: { required: 'true', type: 'number', message: '请选择销售平台', trigger: 'change' },
        ecAcqPrice: { required: 'false', message: '请输入采购金额 ', trigger: 'change' },
        periodType: { required: 'true', message: '请选择报税周期', trigger: 'change' },
        oss: { required: 'true', type: 'number', message: '请选择是否有OSS税号', trigger: 'change' },
        ioss: { required: 'true', type: 'number', message: '请选择是否有IOSS税号', trigger: 'change' },
        ecl: { required: 'true', type: 'number', message: '请选择是否ECL申报', trigger: 'change' },
        frenchDeferredFlag: [{ required: 'true', type: 'number', message: '请选择是否有法国递延', trigger: 'change' }],
        customsNumber: [
          { required: 'true', message: '请输入法国海关号', trigger: 'blur' },
          { max: 20, message: '不能超过20个字符', trigger: 'blur' },
        ],
        registerCountryCode: [{ required: 'true', message: '请选择公司注册所在地国家/地区', trigger: 'change' }],
        deferredFileList: [{ required: 'true', message: '请上传进口递延文件', trigger: 'blur' }],
        startDate: [{ required: 'true', message: '请选择法国递延开始时间', trigger: 'change' }],
        taxableAmount: [{ required: 'true', type: 'number', message: '请输入法国递延应税金额', trigger: 'blur' }],
      },
      allFacilitator: '',
      taxType: 0,
      // all country
      allcountryList: [],
      countryList: [],
      allcountryList1: [],
      omCountryList: otherOmCountryList, // 欧盟国家
      sureOtherSellList: [], // 确定的其他平台销售额数据
      // 核算税金
      typeNow: '',
      tableFiles: [{ fileList: '' }],
      taxRateList: [],
      checkedTaxCountry: [],
      AmzFileList: [],
      lingFileList: [],
      discountData: [],
      statusModel: false, // 远程销售model
      returnDataSale: [], // 远程销售数据
      returnColumnSale: [
        // 远程销售表头
        {
          title: '到货国',
          key: 'arrivalCode',
          width: 120,
        },
        {
          title: '货币单位',
          key: 'currency',
          width: 120,
        },
        {
          title: '1月',
          key: '01',
          width: 120,
        },
        {
          title: '2月',
          key: '02',
          width: 120,
        },
        {
          title: '3月',
          key: '03',
          width: 120,
        },
        {
          title: '4月',
          key: '04',
          width: 120,
        },
        {
          title: '5月',
          key: '05',
          width: 120,
        },
        {
          title: '6月',
          key: '06',
          width: 120,
        },
        {
          title: '7月',
          key: '07',
          width: 120,
        },
        {
          title: '8月',
          key: '08',
          width: 120,
        },
        {
          title: '9月',
          key: '09',
          width: 120,
        },
        {
          title: '10月',
          key: '10',
          width: 120,
        },
        {
          title: '11月',
          key: '11',
          width: 120,
        },
        {
          title: '12月',
          key: '12',
          width: 120,
        },
        {
          title: '含税销售额',
          slot: 'includTaxPriceTotal',
          width: 120,
        },
        {
          title: '远程销售限额',
          key: 'moneyLimit',
          width: 120,
        },
      ],
      // ioss的其他平台含税销售额表格
      otherOmColumns: [
        {
          title: '欧盟国家',
          key: 'countryName',
        },
        {
          title: '简称',
          key: 'countryCode',
        },
        {
          title: '含税销售额',
          slot: 'includTaxPrice',
        },
        {
          title: '币种单位',
          key: 'currency',
        },
      ],
      discountColumns: [
        {
          width: '80px',
          title: '序号',
          render(h, params) {
            return h('span', params.row._index + 1);
          },
        },
        {
          title: '抵扣类型',
          render: (h, params) => {
            let discountTypeArr = [];
            if (this.addFrom.countryCode == 'SA') {
              discountTypeArr = [...this.discountTypeListSA];
            } else if (this.addFrom.countryCode == 'GB') {
              discountTypeArr = [...this.discountTypeListGB];
            } else {
              discountTypeArr = [...this.discountTypeList];
            }
            return h(
              'Select',
              {
                props: {
                  value: params.row.deductionType,
                  placeholder: '选择抵扣类型',
                },
                on: {
                  'on-change': (event) => {
                    this.discountData[params.index].deductionType = event;
                    if (event == 4) {
                      this.b2bType = true;
                    }
                  },
                },
              },
              discountTypeArr.map((item) => {
                return h('Option', {
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
          title: '单据日期',
          slot: 'declareDate',
        },
        {
          title: '抵扣金额',
          render: (h, params) => {
            return h('Input', {
              props: {
                type: 'number',
                value: params.row.deductionAmt,
                size: 'small',
                placeholder:
                  this.addFrom.countryCode == 'GB'
                    ? 'GBP'
                    : this.addFrom.countryCode == 'CZ'
                    ? 'CZK'
                    : this.addFrom.countryCode == 'PL'
                    ? 'PLN'
                    : this.addFrom.countryCode == 'SE'
                    ? 'SEK'
                    : this.addFrom.countryCode == 'AE'
                    ? ''
                    : 'EUR',
              },
              on: {
                input: (val) => {
                  this.discountData[params.index].deductionAmt = Number(val);
                },
                'on-blur': (event) => {
                  this.discountData[params.index].deductionAmt = this.$util.toDecimal(Number(event.target.value));
                },
              },
            });
          },
        },
        {
          title: '上传凭证',
          slot: 'uploadBox',
        },
      ],
      discountTypeList: [
        {
          val: 'C79/88',
          label: 1,
        },
        {
          val: '发票抵扣',
          label: 2,
        },
        {
          val: 'B2B发票',
          label: 4,
        },
        {
          val: '其它',
          label: 3,
        },
      ],
      discountTypeListDE: [
        {
          val: 'C79/88',
          label: 1,
        },
        {
          val: '发票抵扣',
          label: 2,
        },
      ],
      discountTypeListGB: [
        {
          val: 'C79/88',
          label: 1,
        },
        {
          val: '发票抵扣',
          label: 2,
        },
        {
          val: 'PVA',
          label: 5,
        },
        {
          val: '其它',
          label: 3,
        },
      ],
      discountTypeListSA: [
        {
          val: '平台佣金',
          label: 6,
        },
        {
          val: '运费',
          label: 7,
        },
        {
          val: '仓储费',
          label: 8,
        },
        {
          val: '推广费',
          label: 9,
        },
        {
          val: '其它',
          label: 3,
        },
      ],
      currencySign: '', //税金币种符号
      deductionAmt: 0, //可抵扣总金额
      returnData: [],
      returnColumns: [
        {
          title: '销售月份',
          render: (h, params) => {
            return h('span', params.row.month);
          },
        },
        {
          title: '发出国',
          key: 'deptCountryName',
        },
        {
          title: '到货国',
          key: 'arriCountryName',
        },
        {
          title: '币种',
          key: 'currency',
        },
        {
          title: '汇率',
          key: 'rate',
        },
        {
          title: '含税销售额',
          key: 'includTaxPrice',
          render: (h, params) => {
            return h('span', this.currencySign + params.row.includTaxPrice);
          },
        },
      ],
      b2bNoPrice: '',
      returnTaxData: {},
      rateList: {},
      taxTypeRadio: '',
      isLogin: false,
      isSelectCountry: false,
      declareList: [
        { type: '月报', status: '0' },
        { type: '季报', status: '1' },
        { type: '年报', status: '2' },
      ],
      nowPath: this.$route.path,
      salesListAE: [
        { key: '0', value: '亚马逊' },
        { key: '1', value: 'NOON' },
      ],
      salesListSA: [
        { key: '0', value: '亚马逊' },
        { key: '1', value: 'NOON' },
        { key: '2', value: 'Souq' },
        { key: '3', value: '执御' },
      ],
      returnDataAE: [],
      declareIossDetailDTOS: [],
      returnColumnsOU: [
        {
          title: '序号',
          width: 80,
          type: 'index',
        },
        {
          title: '国家',
          key: 'country',
        },
        {
          title: '含税销售额(€)',
          key: 'includeTaxSales',
        },
        {
          title: '税率',
          key: 'taxRate',
        },
        {
          title: '应缴税金(€)',
          key: 'tax',
        },
      ],
      returnColumnsAE: [
        {
          title: '序号',
          width: 80,
          type: 'index',
        },
        {
          title: '日期',
          key: 'month',
        },
        {
          title: '收货人',
          key: 'consignee',
        },
        {
          title: '辖区',
          key: 'area',
        },
        {
          title: '含税销售额',
          key: 'includTaxPrice',
        },
        {
          title: '不含税销售额',
          key: 'notIncludTaxPrice',
        },
        {
          title: '税率',
          key: 'rate',
        },
        {
          title: '应缴税金',
          key: 'taxPayablePrice',
        },
      ],
      taxNumInfo: {},
      postData: {}, //提交的数据
      ifAEorSA: false,
      fileType: '',
      sampleModel: false,
      DEtipsModal: false,
      countryNameEn: '',
      spinShow: false,
      operateText: '上传文件中，请稍后',
      detailData: [],
      newMonth: false,
      deductionStatus: false, //用于控制 申报驳回的状态

      // 西班牙ECL申报
      // 销售项
      eclSellAmountModal: false, // ecl销售项金额
      eclSalePrice: 0, // 销售项总额
      eclSaleItems: [
        {
          taxNumber: '',
          taxAmt: null,
        },
      ],
      // 采购项
      eclBuyAmountModal: false, // ecl采购项金额
      eclPurchasePrice: 0, // 采购项总额
      eclPurchaseItems: [
        {
          taxNumber: '',
          taxAmt: null,
        },
      ],
      parameters: {},
      isCheckTax: false,
      showTipDialog: false,
      tipMessage: '',
      keyList: [
        'otherSellForm',
        'otherPlatformsForm',
        'otherPlatformsFormObj',
        'addFrom',
        'deferredFileList',
        'otherSaleFileList',
        'ecAcqFilePathList',
        'freePurchaseFileList',
        'amx_file_url',
        'xiaoshouUrl',
        'sureOtherSellList',
        'AmzFileList',
        'lingFileList',
        'discountData',
        'returnDataSale',
        'eclSalePrice',
        'eclSaleItems',
        'eclPurchasePrice',
        'eclPurchaseItems',
        'isCheckTax',
      ],
    };
  },
  watch: {
    addFrom: {
      handler(val) {
        if (val) this.isCheckTax = false;
      },
      deep: true,
    },
    otherPlatformsForm: {
      handler(val) {
        if (val) this.isCheckTax = false;
      },
      deep: true,
    },
    discountData: {
      handler(val) {
        if (val) this.isCheckTax = false;
      },
      deep: true,
    },
  },
  components: {
    ShowTipDialog,
  },
  computed: {
    eclSalePriceTotal: function () {
      return Number(this.eclSalePrice) + Number(this.returnTaxData.eclSales);
    },
    eclPurchasePriceTotal: function () {
      return Number(this.eclPurchasePrice) + Number(this.returnTaxData.eclPurchaseAmount);
    },
    buttonText() {
      let text = '';
      if (!this.isCheckTax && this.addFrom.declareRule !== 0) {
        text = '请先核算税金';
      } else {
        text = '提交申报';
      }
      return text;
    },
    isShowRejectReason() {
      let fag = false;
      if (this.taxNumInfo.status === 18) fag = true;
      return fag;
    },
    showRegisterCountryCode() {
      return [
        'AT',
        'BE',
        'BG',
        'CY',
        'CZ',
        'DE',
        'DK',
        'EE',
        'GR',
        'ES',
        'FI',
        'FR',
        'HR',
        'HU',
        'IE',
        'IT',
        'LT',
        'LU',
        'LV',
        'MT',
        'NL',
        'PL',
        'PT',
        'RO',
        'SE',
        'SI',
        'SK',
      ].includes(this.addFrom.countryCode);
    },
    getUnit() {
      if (this.showRegisterCountryCode || this.addFrom.countryCode == 'GB') {
        if (this.addFrom.countryCode == 'CZ') {
          return 'Kč';
        } else if (this.addFrom.countryCode == 'PL') {
          return 'zł';
        } else if (this.addFrom.countryCode == 'SE') {
          return 'kr';
        } else if (this.addFrom.countryCode == 'GB') {
          return '£';
        } else {
          return '€';
        }
      }
      return '';
    },
  },
  created() {
    if (localStorage.getItem('sessionId') && localStorage.getItem('token')) {
      this.isLogin = true;
    }
    if (this.endTime && parseInt(this.endTime.slice(0, 4)) < 2021) {
      this.isBeforeYear = true;
    }
    if (this.endTime && parseInt(this.endTime.slice(0, 4)) >= 2021 && parseInt(this.endTime.slice(5, 7)) >= 7) {
      this.newMonth = true;
    }
  },
  methods: {
    getInfo(countryCode) {
      //获取申报周期
      this.declareList = [];
      baseInfoByCondition({ countryCode }).then((res) => {
        if (res.code == 0) {
          if (this.productFunctionCode == 23) {
            this.countryNameEn = '欧盟';
          } else {
            this.countryNameEn = res.data.countryNameEn;
          }
          let data = res.data;
          if (this.isSelectCountry) {
            this.declareList = [
              { type: '月报', status: '0' },
              { type: '季报', status: '1' },
              { type: '年报', status: '2' },
            ];
          } else {
            if (this.productFunctionCode == 23) {
              this.declareList.push({ type: '月报', status: '0' });
            } else {
              if (data.monthPeriod === 0) this.declareList.push({ type: '月报', status: '0' });
              if (data.quarterPeriod === 0) this.declareList.push({ type: '季报', status: '1' });
              if (data.yearPeriod === 0) this.declareList.push({ type: '年报', status: '2' });
            }
          }
        }
      });
      if (this.servicesId !== '' && this.servicesId !== undefined) {
        taxLogDetail(this.servicesId).then((res) => {
          if (res.code === 0) {
            this.taxNumInfo = setTaxNumInfoVal(res, this);
            if (
              this.taxNumInfo.status === 18 &&
              (this.taxNumInfo.countryCode === 'AT' || this.taxNumInfo.countryCode === 'CZ')
            ) {
              this.getDiscountList();
              this.otherPlatformsFormObj.handIncludeTaxSalesFilePath = this.taxNumInfo.handIncludeTaxSalesFilePath;
              this.otherPlatformsFormObj.handIncludeTaxSales = this.taxNumInfo.handIncludeTaxSales;
              this.otherPlatformsFormObj.handPlatformWithHoldandRemitTax =
                this.taxNumInfo.handPlatformWithHoldandRemitTax;
              this.otherPlatformsFormObj.origFileName = this.taxNumInfo.origFileName;
              this.deductionStatus = true;
              this.addFrom.declareRule = String(this.taxNumInfo.declareRule);
              this.addFrom.filePath = this.taxNumInfo.sellFile;
              this.addFrom.taxRate = String(this.taxNumInfo.taxRate);
            }

            //如果已上传文件显示出来
            if (this.taxNumInfo.isPullSellFile) {
              this.addFrom.filePath = this.taxNumInfo.sellFile;
              this.xiaoshouUrl = this.taxNumInfo.sellFile;
              this.fileType = this.taxNumInfo.sellFile.split('.')[1];
              this.AmzFileList = [
                {
                  name: '销售额文件',
                  url: this.taxNumInfo.sellFile,
                },
              ];
            }
          }
        });
      }

      function setTaxNumInfoVal(res, self) {
        let { data } = res;
        let workId = self.$route.query.workId;
        return workId ? data.find((item) => item.id === workId) : data[0];
      }
    },
    getBaseInfo() {
      return new Promise((resolve) => {
        const self = this;
        this.allcountryList = [];
        baseInfo().then((res) => {
          if (res.code === 0) {
            if (self.$route.query.countryCode) {
              self.allcountryList = res.data;
              self.changeCountry(self.$route.query.countryCode);
            } else {
              self.allcountryList = res.data.filter((item) => item.countryCode !== 'EU');
            }
            resolve();
          }
        });
      });
    },

    getBaseCountryInfo() {
      allCountryInfo().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    /**
     * 渲染ioss申报算税的抵扣国家
     */
    renderIossCountryList() {
      // gsw 如果是ioss的，抵扣项表格多一列抵扣国家，并且删除抵扣类型
      if (this.productFunctionCode == 23) {
        this.discountColumns.splice(1, 0, {
          title: '抵扣国家',
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: params.row.countryCode,
                  placeholder: '选择国家',
                },
                on: {
                  'on-change': (event) => {
                    this.discountData[params.index].countryCode = event;
                  },
                },
              },
              this.omCountryList.map((item) => {
                return h('Option', {
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
      if (val == 'AE' || val == 'SA') {
        this.addFrom.filePath = '';
        this.$refs.otherPlatformsUpload.clearFiles();
      }
      if (val == 0) {
        this.addFrom.filePath = this.amx_file_url;
      } else {
        this.addFrom.filePath = this.xiaoshouUrl;
      }
    },
    changeCountry(val) {
      this.addFrom.tfnCountryCode = [];
      // if (!this.showRegisterCountryCode) {
      this.addFrom.tfnCountryCode.push(val);
      // }
      let countryList = Object.getOwnPropertyNames(this.rateList);
      this.addFrom.filePath = '';
      this.addFrom.oss = '';
      this.addFrom.ioss = '';
      this.taxRateList = this.allcountryList
        .find((item) => item.countryCode == this.addFrom.countryCode)
        .declareTax.split(',');
      this.$nextTick(() => {
        //默认取第一个税率，英国取20%
        if (this.addFrom.countryCode == 'GB') {
          this.addFrom.taxRate = this.taxRateList[this.taxRateList.length - 1];
        } else {
          this.addFrom.taxRate = this.taxRateList[0];
        }
      });
      if (val != undefined) {
        this.getInfo(val);
        this.addFrom.taxRate = '';
        this.addFrom.filePath = '';
        this.xiaoshouUrl = '';
        this.amx_file_url = '';
        //   this.$refs.upload.clearFiles();
        this.AmzFileList = [];
        this.lingFileList = [];
      }
      if (!this.isSelectCountry) {
        if (val == 'AE' || val == 'SA') {
          this.ifAEorSA = true;
        } else {
          this.ifAEorSA = false;
        }
      }
    },
    getObj(val) {
      let data = JSON.parse(val);
      this.keyList.forEach((key) => {
        this[key] = data[key];
      });
      this.$nextTick(() => {
        if (data.isCheckTax) {
          this.checkTax();
        }
      });
    },
    // 草稿详情
    getSnapshoot() {
      getDraft({
        id: this.workId,
      }).then((res) => {
        if (res.code === 0) {
          if (res.data) {
            try {
              this.getObj(res.data);
            } catch (error) {}
          }
        }
      });
    },
    saveObj() {
      let obj = {};
      this.keyList.forEach((key) => {
        obj[key] = this[key];
      });
      return obj;
    },
    // 保存草稿
    saveSnapshoot() {
      draft({
        draft: JSON.stringify(this.saveObj()),
        workId: this.workId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('保存成功');
        }
      });
    },
    // 添加公司
    giveok(all) {
      this.$refs[all].validate((valid) => {
        if (valid) {
          const self = this;
          this.checkedTaxCountry = [];
          this.addFrom.tfnCountryCode.map((v, i) => {
            self.allcountryList1.map((val, index) => {
              if (v == val.countryCode) {
                self.checkedTaxCountry.push(val.countryName);
                // self.addFrom.tfnCountryCode.push(val.countryName)
              }
            });
          });
          self.modelAddCom = false;
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
      this.$Message.warning('上传文件失败，请重新上传');
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
    },

    // otherEc
    handleAmzSuccessotherEc(response, file, fileList, name) {
      if (response && response.data) {
        this.addFrom[name] = response.data.fileUrl;
        this.fileType = response.data.suffix;
        this[name + 'List'] = fileList;
      } else {
        // 上传失败清空上传的
        this.addFrom[name] = '';
        this.fileType = '';
        this[name + 'List'] = [];
        this.$Message.warning('上传文件失败，请重新上传');
      }
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
    },

    // ymx file
    handleAmzSuccess(response, file, fileList) {
      if (response && response.data) {
        this.addFrom.filePath = response.data.fileUrl;
        this.xiaoshouUrl = response.data.fileUrl;
        this.AmzFileList = fileList;
        this.fileType = response.data.suffix;
      } else {
        // 上传失败清空上传的
        this.addFrom.filePath = '';
        this.xiaoshouUrl = '';
        this.addFrom.ecAcqPrice = null;
        this.addFrom.freePurchasePrice = null;
        this.AmzFileList = [];
        this.fileType = '';
        this.$Message.warning('上传文件失败，请重新上传');
      }
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
    },
    handleAmzSuccessLing(response, file, fileList) {
      if (response && response.data) {
        this.addFrom.sellFile = response.data.fileUrl;
        this.amx_file_url = response.data.fileUrl;
        this.lingFileList = fileList;
        this.fileType = response.data.suffix;
      } else {
        // 上传失败清空上传的
        this.addFrom.filePath = '';
        this.amx_file_url = '';
        this.lingFileList = [];
        this.fileType = '';
        this.$Message.warning('上传文件失败，请重新上传');
      }
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
    },

    handleAmzSuccessPlatform(response, file, fileList) {
      this.otherPlatformsForm.origFileName = response.data.origFileName;
      this.otherPlatformsForm.handIncludeTaxSalesFilePath = response.data.fileUrl;
      this.otherSaleFileList = fileList;
    },

    handleAmzRemoveFilePlatform() {
      this.otherPlatformsForm.handIncludeTaxSalesFilePath = '';
      this.otherSaleFileList = [];
    },

    handleAmzBeforeUploadPlatform() {
      const check = this.otherPlatformsForm.handIncludeTaxSalesFilePath == '';
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    submitPlatformsForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.otherPlatformsForm.handIncludeTaxSales < 0) {
            this.$Message.error('请输入正确的含税销售额');
            return;
          }
          this.otherPlatformsFormObj = this.otherPlatformsForm;
          console.log(this.otherPlatformsFormObj);
          this.otherPlatformsMadal = false;
        }
      });
    },
    addDiscount() {
      let obj = {
        deductionType: '',
        billDate: '',
        deductionAmt: null,
        deductionFile: '', //url
        fileOriginalName: '', //name
      };
      this.discountData;
      this.discountData.push(obj);
    },
    deleteItem(row) {
      this.discountData.splice(row._index, 1);
    },
    changeDate(date, row) {
      this.discountData[row._index].billDate = date + ' 00:00:00';
    },
    changeTaxPrice(row, index) {
      this.otherOmCountryList[index].sales = row.sales;
      this.$forceUpdate();
    },
    handleSuccess(res, file, fileList, row) {
      this.discountData[row._index].deductionFile = res.data.fileUrl;
      this.discountData[row._index].fileOriginalName = file.name;
    },
    handleSuccessUpload(res, file, fileList) {
      this.addFrom.deferredFileList = res.data.fileUrl;
      this.deferredFileList = fileList;
    },
    handleAmzRemoveFile() {
      this.xiaoshouUrl = '';
      this.addFrom.filePath = '';
      this.AmzFileList = [];
    },
    handleAmzRemoveFileotherEc(file, fileList, name) {
      this.addFrom[name] = '';
      this[name + 'List'] = [];
    },

    handleAmzRemoveFileLing() {
      this.amx_file_url = '';
      this.addFrom.sellFile = '';
      this.lingFileList = [];
    },
    handleAmzBeforeUpload() {
      const check = this.xiaoshouUrl == '';
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },

    handleAmzBeforeUploadEc() {
      const check = this.addFrom.ecAcqFilePath == '';
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    handleAmzBeforeUploadPu() {
      const check = this.addFrom.freePurchaseFile == '';
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },

    handleAmzBeforeUploadLing() {
      const check = this.amx_file_url == '';
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: '上传文件不超过100M',
      });
    },
    handleBeforeUpload() {
      const check = this.tableFiles[0].fileList.length < 1;
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持xls、xlsx、csv、txt',
      });
    },
    handleFormatErrorEcFile() {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持xls、xlsx、csv、txt、doc、docx、zip、rar',
      });
    },

    handleFormatErrorEc(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持pdf, jpg, png, rar, zip',
      });
    },

    handleFormatErrors(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg、png、pdf、jpeg、docx、word',
      });
    },
    handIncludeTaxSalesFile(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg, jpeg, png, gif, pdf, word, docx, xls, xlsx, csv, txt, zip, rar',
      });
    },
    handleDiscountFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持pdf, jpg, png, rar, zip',
      });
    },
    handleRemoveFile(file, fileList, row) {
      if (typeof row == 'number') {
        this.discountData[row].deductionFile = '';
        this.discountData[row].fileOriginalName = '';
        return;
      }
      this.discountData[row._index].deductionFile = '';
      this.discountData[row._index].fileOriginalName = '';
    },
    handleRemoveFileList(file, fileList) {
      this.addFrom.deferredFileList = '';
      this.deferredFileList = [];
    },
    validate() {
      return new Promise((resolve) => {
        if (this.addFrom.countryCode == undefined) {
          this.$Message.info('请选择国家');
          return;
        }
        if (this.addFrom.taxRate == '' && this.productFunctionCode != 23) {
          this.$Message.info('请选择税率');
          return;
        }
        if (this.addFrom.declareRule === 1) {
          if (this.addFrom.filePath == '' && this.otherPlatformsFormObj.handIncludeTaxSalesFilePath == '') {
            this.$Message.info('请上传销售额文件');
            return;
          }
          if (this.addFrom.periodType === 'undefined') {
            this.$Message.info('请选择申报周期');
            return;
          }
          if (
            this.addFrom.oss === '' &&
            this.addFrom.countryCode != 'GB' &&
            this.addFrom.countryCode != 'SA' &&
            this.addFrom.countryCode != 'AE' &&
            this.productFunctionCode != 23 &&
            this.isSelectCountry
          ) {
            this.$Message.info('请选择是否有OSS税号');
            return;
          }
          if (
            this.addFrom.ioss === '' &&
            this.addFrom.countryCode != 'GB' &&
            this.addFrom.countryCode != 'SA' &&
            this.addFrom.countryCode != 'AE' &&
            this.productFunctionCode != 23 &&
            this.isSelectCountry
          ) {
            this.$Message.info('请选择是否有IOSS税号');
            return;
          }
          // 如果是西班牙的，则必须选择是否选择Ecl
          if (this.addFrom.countryCode == 'ES' && this.addFrom.ecl === '') {
            this.$Message.info('请选择是否申报ECL');
            return;
          }
          // 如果是德国 填写欧盟内免税收购项金额必传文件
          if (this.addFrom.countryCode == 'DE' && this.addFrom.ecAcqPrice && this.addFrom.ecAcqFilePath == '') {
            this.$Message.info('请上传欧盟内免税收购项文件');
            return;
          }
          // 填写欧盟内免税采购项金额必传文件
          if (
            this.addFrom.countryCode == 'DE' &&
            this.addFrom.freePurchasePrice &&
            this.addFrom.freePurchaseFile == ''
          ) {
            this.$Message.info('请上传欧盟内免税采购项文件');
            return;
          }
        } else {
          if (!this.amx_file_url) {
            this.$Message.warning('请上传零申报截图');
            return;
          }
        }
        this.$refs['addFrom'].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
    },
    //核算税金
    async checkTax(options = { zeroCommit: false }) {
      await this.validate();
      this.declareIossDetailDTOS = [];
      this.addFrom.taxDeductionDtos = this.discountData;
      console.log(this.addFrom.taxDeductionDtos, this.discountData, 'this.discountData');
      let discountDataFlag = false;
      this.addFrom.taxDeductionDtos.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (item[key] === '' || item[key] === null || item[key] === ' 00:00:00') {
            discountDataFlag = true;
          }
        });
      });
      if (discountDataFlag) {
        return this.$Message.warning('请检查抵扣项数据，数据未填写完整!');
      }
      let data = {
        ...options,
        ...this.addFrom,
        beginTime: this.beginTime ? this.beginTime.split(' ')[0] + ' 00:00:00' : '',
        endTime: this.endTime ? this.endTime.split(' ')[0] + ' 23:59:59' : '',
      };
      data.taxRate = this.addFrom.taxRate.replace('%', '') / 100;
      if (this.otherPlatformsFormObj.handIncludeTaxSales) {
        data.handIncludeTaxSales = this.otherPlatformsFormObj.handIncludeTaxSales;
      }
      if (this.addFrom.countryCode == 'GB' || this.showRegisterCountryCode) {
        if (this.otherPlatformsFormObj.handExIncludeTaxSales) {
          data.handExIncludeTaxSales = this.otherPlatformsFormObj.handExIncludeTaxSales;
        }
        if (this.otherPlatformsFormObj.handExPlatformWithHoldandRemitTax) {
          data.handExPlatformWithHoldandRemitTax = this.otherPlatformsFormObj.handExPlatformWithHoldandRemitTax;
        }
      }

      data.handIncludeTaxSalesFilePath = this.otherPlatformsFormObj.handIncludeTaxSalesFilePath;
      data.eurOtherB2bExcludeTaxSales = this.otherPlatformsFormObj.eurOtherB2bExcludeTaxSales;
      data.otherExIncludeTaxAmt = this.otherPlatformsFormObj.otherExIncludeTaxAmt;
      data.handPlatformWithHoldandRemitTax =
        this.otherPlatformsFormObj.handPlatformWithHoldandRemitTax != ''
          ? this.otherPlatformsFormObj.handPlatformWithHoldandRemitTax
          : undefined;
      data.vatTaxNumber = this.vatTaxNumber;
      data.eurOtherEcAcqPrice = this.addFrom.ecAcqPrice;
      data.eurOtherEcAcqFile = this.addFrom.ecAcqFilePath;
      data.ioss = this.addFrom.ioss == 1 ? true : false;
      data.oss = this.addFrom.oss == 1 ? true : false;
      data.ecl = this.addFrom.ecl == 1 ? true : false;
      data.ecAcqPrice = this.addFrom.ecAcqPrice || 0;
      data.freePurchasePrice = this.addFrom.freePurchasePrice || 0;
      if (this.productFunctionCode == 23) {
        data.iossCalu = true;
      }
      if (this.isSelectCountry) {
        data.beginTime = this.beginTime ? this.beginTime + ' 00:00:00' : '';
        data.endTime = this.endTime ? this.endTime + ' 23:59:59' : '';
      }
      data.frenchDeferredFlag = this.addFrom.countryCode === 'FR' ? this.addFrom.frenchDeferredFlag : null;
      if (this.addFrom.countryCode === 'FR' && this.addFrom.frenchDeferredFlag == 1) {
        data.frenchDeferredDTO = {
          customsNumber: this.addFrom.customsNumber,
          deferredFilePath: this.addFrom.deferredFileList,
          startDate: this.addFrom.startDate,
          taxableAmount: this.addFrom.taxableAmount,
        };
      } else {
        data.frenchDeferredDTO = null;
      }
      this.parameters = data;
      this.spinShow = true;
      this.operateText = '正在计算税金，请稍后';
      caluTax(data)
        .then((res) => {
          if (res.code == 0) {
            this.currencySign = res.data.currencySign;
            this.deductionAmt = res.data.deductionAmt;
            this.returnTaxData = res.data;
            this.returnTaxData.freePurchasePrice = data.freePurchasePrice;

            // 获取欧盟下的各国税金数据
            this.declareIossDetailDTOS =
              res.data.declareIossDetailDTOS.length > 0 ? res.data.declareIossDetailDTOS : [];

            if (res.data.taxPriceDetailDtos != undefined) {
              this.returnData = res.data.taxPriceDetailDtos;
            }
            if (this.addFrom.countryCode == 'AE') {
              this.returnDataAE = res.data.taxPriceDetailDtos;
            }
            this.b2bNoPrice = this.$util.accAdd(
              this.returnTaxData.b2bExcludeTaxSales,
              this.returnTaxData.notVatNumberB2bExcludeTaxSales
            );
            this.isCheckTax = true;
          } else if (res.code === 1001) {
            if (res.data === 1) {
              this.tipMessage = res.message;
              this.showTipDialog = true;
            } else if (res.data === 2) {
              this.reconfirm({ message: res.message });
            } else {
              this.$Message.error(res.message);
            }
          } else {
            this.$Message.error(res.message);
          }
        })
        .finally(() => {
          this.spinShow = false;
        });
    },
    reconfirm({ message }) {
      this.$Modal.confirm({
        title: '提示',
        content: message,
        okText: '确认无误，继续算税',
        onOk: () => {
          this.checkTax({ zeroCommit: true });
        },
      });
    },
    //提交申报数据
    async sureSubmit(name) {
      await this.validate();
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.currencySign == '') {
            if (this.returnData.length == 0 && this.addFrom.declareRule != 0) {
              this.$Message.error('请先核算税金');
              return;
            }
          }

          if (this.addFrom.countryCode == 'ES' && this.addFrom.ecl === '' && this.addFrom.declareRule == 0) {
            this.$Message.info('请选择是否申报ECL');
            return;
          }
          // 如果是德国 填写欧盟内免税收购项金额必传文件
          if (
            this.addFrom.countryCode == 'DE' &&
            this.addFrom.declareRule == 0 &&
            this.addFrom.ecAcqPrice &&
            this.addFrom.ecAcqFilePath == ''
          ) {
            this.$Message.info('请上传欧盟内免税收购项文件');
            return;
          }
          // 填写欧盟内免税采购项金额必传文件
          if (
            this.addFrom.countryCode == 'DE' &&
            this.addFrom.declareRule == 0 &&
            this.addFrom.freePurchasePrice &&
            this.addFrom.freePurchaseFile == ''
          ) {
            this.$Message.info('请上传欧盟内免税采购项文件');
            return;
          }

          let params = {};
          if (this.addFrom.declareRule == 0) {
            params = {
              sellFile: this.addFrom.sellFile,
              id: this.workId,
              freePurchasePrice: this.addFrom.freePurchasePrice,
              otherEcAcqPriceFile: this.addFrom.ecAcqFilePath,
              freePurchaseFile: this.addFrom.freePurchaseFile,
              eurOtherEcAcqPrice: this.addFrom.ecAcqPrice,
              ecAcqPrice: this.addFrom.ecAcqPrice,
              eurOtherEcAcqFile: this.addFrom.ecAcqFilePath,
              isEcl: this.addFrom.ecl == 1 ? true : false,
              frenchDeferredFlag: this.addFrom.countryCode === 'FR' ? this.addFrom.frenchDeferredFlag : null,
              declareRule: this.addFrom.declareRule,
            };
            if (this.addFrom.ecl == true) {
              params.eclSaleItems = this.addFrom.eclSaleItems;
              params.eclPurchaseItems = this.addFrom.eclPurchaseItems;
            }
            if (this.addFrom.countryCode === 'FR' && this.addFrom.frenchDeferredFlag == 1) {
              params.frenchDeferredDTO = {
                customsNumber: this.addFrom.customsNumber,
                deferredFilePath: this.addFrom.deferredFileList,
                startDate: this.addFrom.startDate,
                taxableAmount: this.addFrom.taxableAmount,
              };
            } else {
              params.frenchDeferredDTO = null;
            }
          } else {
            params = {
              id: this.workId,
              agentTaxPrice: this.returnTaxData.platformWithholdandremitTax,
              allTaxPrice: this.returnTaxData.tax,
              deductionItems: this.addFrom.taxDeductionDtos,
              declareRule: this.addFrom.declareRule,
              deductionPrice: this.returnTaxData.discountAmount,
              eclPurchasePrice: this.returnTaxData.eclPurchaseAmount,
              eclSalePrice: this.returnTaxData.eclSales,
              inputTax: this.returnTaxData.inputTax,
              excludeTaxPrice: this.returnTaxData.excludeTaxSales,
              includeTaxPrice: this.returnTaxData.includeTaxSales,
              paidExcludeTaxSales: this.returnTaxData.excludeTaxSales,
              ioss: this.addFrom.ioss == 1 ? true : false,
              oss: this.addFrom.oss == 1 ? true : false,
              isEcl: this.addFrom.ecl == 1 ? true : false,
              ecl: this.addFrom.ecl == 1 ? true : false,
              eurOtherEcAcqPrice: this.returnTaxData.otherEcAcqPrice,
              otherEcAcqPrice: this.showRegisterCountryCode
                ? this.returnTaxData.otherEcAcqPrice
                : this.returnTaxData.purchaseAmount,
              otherIncludeTaxAmt: this.otherPlatformsFormObj.handPlatformWithHoldandRemitTax,
              handExIncludeTaxSales: this.otherPlatformsFormObj.handExIncludeTaxSales,
              handExPlatformWithHoldandRemitTax: this.otherPlatformsFormObj.handExPlatformWithHoldandRemitTax,
              eurOtherB2bExcludeTaxSales: this.otherPlatformsFormObj.eurOtherB2bExcludeTaxSales,
              otherExIncludeTaxAmt: this.otherPlatformsFormObj.otherExIncludeTaxAmt,
              otherSaleFileUrl: this.otherPlatformsFormObj.handIncludeTaxSalesFilePath,
              registerCountryCode: this.addFrom.registerCountryCode,
              salePlatformType: this.addFrom.salePlatformType,
              awsExcludeTaxSales: this.returnTaxData.awsExcludeTaxSales,
              awsHandExcludeTaxSales: this.showRegisterCountryCode
                ? this.returnTaxData.notAwsExcludeTaxSales
                : this.returnTaxData.awsHandExcludeTaxSales,
              sellFile: this.addFrom.declareRule == 0 ? this.addFrom.sellFile : this.addFrom.filePath,
              taxAmtTotal: this.returnTaxData.outputTax,
              taxRate: this.returnTaxData.taxRate,
              noPayExcludeTaxSales: this.returnTaxData.noPayExcludeTaxSales,
              exportExclTaxAmount: this.returnTaxData.exportExclTaxAmount,
              homeCountryB2bSupplySalesExcludeTaxAmount: this.returnTaxData.homeCountryB2bSupplySalesExcludeTaxAmount,
              eurB2bExcludeTaxSales: this.returnTaxData.eurB2bExcludeTaxSales,
              defTaxableAmount: this.returnTaxData.defTaxableAmount,
              fcTransferArriExcludeSale: this.returnTaxData.fcTransferArriExcludeSale,
              fcTransferSendExcludeSale: this.returnTaxData.fcTransferSendExcludeSale,
              comminglingBuySale: this.returnTaxData.comminglingBuySale,
              exportExcludeTaxSales: this.returnTaxData.exitAwsExcludeTaxSales,
              comminglingSellSale: this.returnTaxData.comminglingSellSale,
              frenchDeferredFlag: this.addFrom.countryCode === 'FR' ? this.addFrom.frenchDeferredFlag : null,
              tfnCountryCode: this.addFrom.tfnCountryCode ? this.addFrom.tfnCountryCode.toString() : '',
              otherEcAcqPriceFile: this.addFrom.ecAcqFilePath,
              freePurchasePrice: this.addFrom.freePurchasePrice,
              freePurchaseFile: this.addFrom.freePurchaseFile,
              excludeTaxB2bPrice: this.b2bNoPrice,
              declareIossDetailDTOS: this.declareIossDetailDTOS.length > 0 ? this.declareIossDetailDTOS : [],
            };
          }

          if (this.addFrom.ecl == true) {
            params.eclSaleItems = this.returnTaxData.eclDetailList;
            params.eclPurchaseItems = this.addFrom.eclPurchaseItems;
          }
          if (this.addFrom.countryCode == 'GB') {
            params.gbDeclareExtra = this.returnTaxData.taxResult;
          }

          if (this.addFrom.countryCode === 'FR' && this.addFrom.frenchDeferredFlag == 1) {
            params.frenchDeferredDTO = {
              customsNumber: this.addFrom.customsNumber,
              deferredFilePath: this.addFrom.deferredFileList,
              startDate: this.addFrom.startDate,
              taxableAmount: this.addFrom.taxableAmount,
            };
          } else {
            params.frenchDeferredDTO = null;
          }

          this.postData = {
            ...params,
            purchaseTime:
              this.addFrom.declareRule !== 0
                ? [...new Set(this.returnTaxData.taxPriceDetailDtos.map((item) => item.month))]
                : [],
          };
          this.submitModal = true;
        }
      });
    },

    fileFormat(file) {
      if (file && file.length) {
        return file.map((item) => item.url).join(',');
      } else {
        return '';
      }
    },
    submit() {
      if (
        this.postData.ecl == true &&
        this.returnTaxData.eclPurchasePrice == 0 &&
        this.returnTaxData.eclSalePrice == 0
      ) {
        this.$Message.info('销售项和采购项目不能同时为0！');
        return;
      }
      let ifCheckStatus =
        (!this.$route.query.isProcess || this.$route.query.isProcess === 'false') &&
        ['GB', 'DE'].includes(this.addFrom.countryCode);
      let query = {
        serviceId: this.servicesId,
        workOrderId: this.workId,
        declareRule: this.addFrom.declareRule,
        endTime: this.endTime,
        beginTime: this.beginTime,
        companyName: this.taxNumInfo.companyNameZh,
        countryNameEn: this.countryNameEn,
        taxDeclarationDeadline: this.taxDeclarationDeadline,
        productFunctionCode: this.productFunctionCode,
        checkStatus: ifCheckStatus ? 'checkStatus' : '',
      };
      submitTaxdate(this.postData).then((res) => {
        if (res.code == 0) {
          this.submitNavigate({
            ...query,
            taxPaymentDeadline: res.data.taxPaymentDeadline,
            declareTime: res.timestamp,
            status: res.data.status,
          });
        }
      });
    },
    submitNavigate(query) {
      this.sureApplyDataModal = false;
      this.submitModal = false;
      sessionStorage.setItem('declareData', JSON.stringify(this.saveObj()));
      if (Number(this.returnTaxData.taxTotal) < 0) {
        this.$router.push({
          path: '/taxFinishSuccess',
          query,
        });
      } else {
        this.$router.push({
          path: '/declareSuccess',
          query,
        });
      }
    },
    // 验证抵扣项有没有值，如果没有传空对象，有则每一个字段都必填
    verifyPaymentInsert(obj) {
      let arr = Object.values(obj);
      let flag = false,
        isEmpty = false;
      if (arr.length > 0) {
        arr.forEach((item) => {
          const values = this.getObjectValues(item);
          let nulls = 0,
            notNull = 0,
            allDiscountLength = 0;
          values.map((val) => {
            if (val == '') {
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
      this.currencySign = '';
      this.deductionAmt = '';
      this.returnData = [];
      this.$refs['giveFrom'].resetFields();
      this.$refs[name].resetFields();
      this.checkedTaxCountry = [];
      this.$refs.upload.clearFiles();
      this.AmzFileList = [];
      this.addFrom.tfnCountryCode = [];
      this.addFrom.filePath = '';
      this.otherPlatformsFormObj = { ...otherPlatformsFormInit };
    },

    // 远程销售弹窗
    getStatus() {
      this.statusModel = true;
    },
    clearOtherPlatformsInfo() {
      this.otherPlatformsForm = { ...otherPlatformsFormInit };
      this.otherPlatformsFormObj = { ...otherPlatformsFormInit };
      this.$refs.otherSaleFileRef.clearFiles();
    },
    getDiscountList() {
      discountList(this.workId).then((res) => {
        if (res.code === 0) {
          this.detailData = res.data;
          this.discountData = this.detailData.deductionItems;
        }
      });
    },

    /**
     * 其他平台含税销售额
     */
    showOtherSellModal() {
      let tempList = this.otherOmCountryList;
      tempList.forEach((v) => {
        v.sales = '0.00';
        this.sureOtherSellList.forEach((vv) => {
          if (vv.countryCode == v.countryCode) {
            v.sales = vv.sales;
          }
        });
      });
      this.otherOmCountryList = JSON.parse(JSON.stringify(tempList));
      this.otherSellModal = true;
    },
    handleSubmitOtherSell() {
      // 校验
      // 校验含税销售额和文件必须上传
      if (!this.otherOmCountryList.some((item) => Number(item.sales) > 0)) {
        this.$Message.warning('欧盟国家含税销售额至少填一项');
        return;
      }
      if (!this.otherPlatformsForm.handIncludeTaxSalesFilePath) {
        this.$Message.warning('其他平台含税销售文件不能为空');
        return;
      }

      // 过滤出欧盟国家中所有含税销售额大于0的
      this.sureOtherSellList = [];
      this.addFrom.otherPlatformSaleDto = [];
      this.otherOmCountryList.forEach((v) => {
        if (Number(v.sales) > 0) {
          this.sureOtherSellList.push({
            ...v,
          });
          this.addFrom.otherPlatformSaleDto.push({
            ...v,
          });
        }
      });

      this.otherPlatformsFormObj = JSON.parse(JSON.stringify(this.otherPlatformsForm));
      this.otherSellModal = false;
    },
    handleRemoveTag(index) {
      this.otherOmCountryList.forEach((item) => {
        if (item.countryCode === this.sureOtherSellList[index].countryCode) {
          item.sales = '0.00';
        }
      });
      this.sureOtherSellList.splice(index, 1);
      this.addFrom.otherPlatformSaleDto.splice(index, 1);
    },
    handleRemoveSaleFile() {
      this.otherPlatformsFormObj = {
        handIncludeTaxSalesFilePath: '',
        origFileName: '',
      };
      this.otherPlatformsForm = {
        handIncludeTaxSalesFilePath: '',
        origFileName: '',
      };
      this.clearOtherPlatformsInfo();
    },

    /**
     * 西班牙ECL申报
     */
    // 增加销售项
    handleAddEclSell() {
      this.eclSaleItems.push({
        taxNumber: '',
        taxAmt: null,
      });
    },
    // 删除销售项
    handleRemoveEclSell(index) {
      this.eclSaleItems.splice(index, 1);
      // 计算销售额
      this.clacuSellAmount();
    },
    //
    changePurchaseTime(date, data, index) {
      this[data][index].purchaseTime = date + ' 00:00:00';
    },
    // 计算销售额
    clacuSellAmount() {
      let eclSalePrice = 0;
      this.eclSaleItems.forEach((v) => {
        if (v.taxAmt) {
          eclSalePrice += this.$util.toDecimalRound(v.taxAmt);
        }
      });
      this.eclSalePrice = Number(this.$util.toDecimalRound(eclSalePrice)).toFixed(2);
    },

    // 增加采购项
    handleAddEclBuy() {
      this.eclPurchaseItems.push({
        taxNumber: '',
        taxAmt: null,
      });
    },
    // 删除采购项
    handleRemoveEclBuy(index) {
      this.eclPurchaseItems.splice(index, 1);
      // 计算采购项
      this.clacuSellAmount();
    },
    // 计算采购项
    clacuBuyAmount() {
      let eclPurchasePrice = 0;
      this.eclPurchaseItems.forEach((v) => {
        if (v.taxAmt) {
          eclPurchasePrice += this.$util.toDecimalRound(v.taxAmt);
        }
      });
      this.eclPurchasePrice = Number(this.$util.toDecimalRound(eclPurchasePrice)).toFixed(2);
    },

    submitBuyAmount() {
      if (this.eclPurchaseItems.some((item) => item.taxAmt === '')) {
        this.$Message.warning('销售金额不能为空！');
        return;
      }
      if (this.eclPurchaseItems.some((item) => !item.taxNumber)) {
        this.$Message.warning('税号不能为空！');
        return;
      }

      this.addFrom.eclPurchaseItems = this.eclPurchaseItems;

      this.eclBuyAmountModal = false;
    },
    changeStartDate(val) {
      if (val) {
        this.addFrom.startDate = val + ' 00:00:00';
      } else {
        this.addFrom.startDate = '';
      }
    },
    submitSellAmount() {
      if (this.eclSaleItems.some((item) => item.taxAmt === '')) {
        this.$Message.warning('销售金额不能为空！');
        return;
      }
      if (this.eclSaleItems.some((item) => !item.taxNumber)) {
        this.$Message.warning('税号不能为空！');
        return;
      }

      this.addFrom.eclSaleItems = this.eclSaleItems;

      this.eclSellAmountModal = false;
    },
    // 下载税金明细
    downLoadTaxDetail(name) {
      if (this.currencySign == '') {
        this.$Message.error('请先核算税金');
        return;
      }
      let params = this.parameters;
      axios({
        url: this.baseUrl + '/workorder/tax/taxDetailDownLoad',
        data: params,
        method: 'post',
        responseType: 'blob',
      }).then((res) => {
        if (res.data) {
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });
          const link = document.createElement('a');
          const href = window.URL.createObjectURL(blob); //创建下载的链接
          link.href = href;
          link.download = '销售数据报表.xlsx'; //下载后文件名
          document.body.appendChild(link);
          link.click(); //点击下载
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        } else {
          this.$Message.error('导出文件失败');
        }
      });
    },
    //下载模板
    uploadTemplate(row) {
      downloadCertificate(this.workId).then((res) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          try {
            const jsonData = JSON.parse(fileReader.result); // 说明是普通对象数据，后台转换失败
            this.$Message.error('下载失败！');
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            // 下载文件
            this.$util.exporPdf(res);
          }
        };
        fileReader.readAsText(new Blob([res]));
      });
    },
    getData() {
      if (!this.workId) {
        return;
      }
      if (!!sessionStorage.getItem('getDeclareData')) {
        try {
          this.getObj(sessionStorage.getItem('declareData'));
        } catch (error) {}
      } else {
        this.getSnapshoot();
      }
    },
  },
  async mounted() {
    this.contentStyleObj.height = window.screen.height + 'px';
    if (this.addFrom.countryCode != undefined) {
      this.isSelectCountry = true;
      this.getInfo(this.addFrom.countryCode);
      if (this.addFrom.countryCode == 'DE') {
        this.DEtipsModal = true;
      }
      // ioss申报的默认选中有数据申报，并且删除抵扣类型这一列
      if (this.productFunctionCode == 23) {
        this.addFrom.declareRule = '1';
      }
    }
    await this.getBaseInfo();
    this.getData();
    this.getBaseCountryInfo();
  },
};

import {
  submitTaxdate,
  taxLogDetail,
  baseInfoByCondition,
  discountList,
  caluTax,
  downloadCertificate,
  draft,
  getDraft,
} from '@/api/taxModule';
import { baseInfo, allCountryInfo } from '@/api/shoppingCar/shoppingCar';
import { otherOmCountryList } from './enumObj.js';
import ShowTipDialog from '@/views/home/computeTax/components/showTipDialog';
import axios from 'axios';
</script>
<style lang="less" scoped>
@import url(./css/index.less);
.subInfo-top {
  padding-left: 120px !important;
  position: relative;
  .subInfo-top-label {
    position: absolute;
    top: 6px;
    left: 20px;
  }
}
</style>
