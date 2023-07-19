<template>
  <!-- 英国的计算税金 -->
  <div class="modalCount hasLogin">
    <div class="headContent">
      <div class="top">
        <!-- <Breadcrumb>
          <BreadcrumbItem>
            <span class="flink">工作台</span>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span class="clink">提交申报数据</span>
          </BreadcrumbItem>
        </Breadcrumb> -->
      </div>
      <div class="bottom">
        <p class="Btitle">
          待提交申报资料
          <span>（英国注册+申报）</span>
        </p>
        <div class="compangInfo">
          <div class="flex">
            <p>
              公司中文名称：
              <span class="right">{{ DeclareGBInfo.companyNameZh }}</span>
            </p>
            <p style="margin-left: 50px">
              公司英文名称：
              <span class="right">{{ DeclareGBInfo.companyNameEn }}</span>
            </p>
          </div>
          <div class="flex">
            <p>
              VAT税号：
              <span class="right">{{ DeclareGBInfo.taxNumber }}</span>
            </p>
            <p style="margin-left: 50px">
              当前申报区间：
              <span class="right" style="color: #16ade9ff">
                {{ DeclareGBInfo.beginTime != '' ? DeclareGBInfo.beginTime.slice(0, 10) : '' }} 至
                {{ DeclareGBInfo.endTime != '' ? DeclareGBInfo.endTime.slice(0, 10) : '' }}
              </span>
            </p>
            <p>
              税金到账截止日期：
              <span class="right">{{ DeclareGBInfo.taxPaymentDeadline }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="bodyContent">
      <div class="step1">
        <div class="subInfo">
          <span class="subInfo-top-label">
            <img
              src="@/assets/images/common/gantanhao.png"
              style="width: 15px; margin-right: 5px; margin-bottom: -1px"
              alt=""
            />
            温馨提醒：
          </span>
          <span>
            1、由于亚马逊销售文件2021年1月1日进行了更新，建议您下载最新销售文件进行计算税金操作。英国税局规定，从2021年开始，低税率不再适用于电商平台卖家，需统一以标准税率（20%）进行申报，2020年的数据将继续保留原有税率申报。
          </span>
          <div>
            2、PVA为postpone VAT
            account，即进口VAT递延，清关时走递延流程，不需当场交进口VAT，清关后6个月内需要做PVA申报，申报需要上传的文件为做了递延的C88文件，或者进入对应的CDS账户，下载对应的PVA
            statement。
          </div>
        </div>
        <div class="leftBox">
          <Form ref="addFrom" :model="addFrom" :rules="ruleAddFrom" label-position="left" class="leftForm">
            <div class="topLeft">
              <Row>
                <Col :span="8">
                  <FormItem
                    label="选择国家："
                    :label-width="120"
                    class="chooseCountry"
                    prop="countryCode"
                    v-if="addFrom.declareRule != 0"
                  >
                    <Select
                      v-model="addFrom.countryCode"
                      style="width: 200px"
                      @on-change="changeCountry"
                      placeholder="请选择报税国家"
                      disabled
                    >
                      <Option v-for="(item, index) in allcountryList" :value="item.countryCode" :key="index">
                        {{ item.countryNameZh }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>

                <Col :span="8">
                  <FormItem label="税率：" prop="taxRate" :label-width="120" v-if="addFrom.declareRule != 0">
                    <Select v-model="addFrom.taxRate" style="width: 200px" placeholder="税率">
                      <Option v-for="(item, index) in taxRateList" :value="String(item)" :key="index">
                        {{ item }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row style="margin-top: 9px">
                <Col :span="8">
                  <FormItem label="计税方式:" prop="declareRule" :label-width="120">
                    <RadioGroup @on-change="changeRadio(addFrom.declareRule)" v-model="addFrom.declareRule">
                      <Radio :label="1">有数据</Radio>
                      <Radio :label="0">零申报</Radio>
                      <!-- <Radio label="0">目的国</Radio>
                      <Radio label="1" v-if="isBeforeYear">发出国</Radio>
                      <Radio label="2">零申报</Radio> -->
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem
                    label="销售额文件："
                    prop="amx_file_url"
                    :label-width="120"
                    class="salefile"
                    v-show="addFrom.declareRule != 0"
                  >
                    <Upload
                      ref="upload"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          handleAmzSuccess(res, file, fileList);
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          handleAmzRemoveFile(file, fileList);
                        }
                      "
                      :format="['xls', 'xlsx', 'csv', 'txt']"
                      :on-exceeded-size="handleMaxSize"
                      :max-size="102400"
                      :default-file-list="AmzFileList"
                      :on-format-error="handleFormatError"
                      :before-upload="handleAmzBeforeUpload"
                    >
                      <Button icon="ios-cloud-upload-outline" class="amzUpload btnfile">请上传店铺销售文件</Button>
                    </Upload>
                  </FormItem>
                </Col>
              </Row>
              <Row style="margin-top: 9px" v-if="addFrom.declareRule != 0">
                <Col :span="8">
                  <FormItem label="销售平台：" prop="salePlatformType" :label-width="120">
                    <RadioGroup v-model="addFrom.salePlatformType">
                      <Radio :label="0">Amazon</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <FormItem
                  label="VAT国家:"
                  :label-width="120"
                  class="VATCountry"
                  v-if="addFrom.declareRule != 0"
                  prop="tfnCountryCode"
                >
                  <span class="zhuce">(已注册)</span>
                  <CheckboxGroup v-model="addFrom.tfnCountryCode">
                    <Checkbox label="GB">
                      <img class="countryFlag" src="../../../assets/images/common/GBflag.png" alt="" />
                      <span class="countryName">英国</span>
                    </Checkbox>
                    <Checkbox label="DE">
                      <img class="countryFlag" src="../../../assets/images/common/DEflag.png" alt="" />
                      <span class="countryName">德国</span>
                    </Checkbox>
                    <Checkbox label="FR">
                      <img class="countryFlag" src="../../../assets/images/common/FGflag.png" alt="" />
                      <span class="countryName">法国</span>
                    </Checkbox>
                    <Checkbox label="IT">
                      <img class="countryFlag" src="../../../assets/images/common/ITflag.png" alt="" />
                      <span class="countryName">意大利</span>
                    </Checkbox>
                    <Checkbox label="ES">
                      <img class="countryFlag" src="../../../assets/images/common/XBYflag.png" alt="" />
                      <span class="countryName">西班牙</span>
                    </Checkbox>
                    <Checkbox label="CZ">
                      <img class="countryFlag" src="../../../assets/images/common/JKflag.png" alt="" />
                      <span class="countryName">捷克</span>
                    </Checkbox>
                    <Checkbox label="PL">
                      <img class="countryFlag" src="../../../assets/images/common/BLflag.png" alt="" />
                      <span class="countryName">波兰</span>
                    </Checkbox>
                    <Checkbox label="NL">
                      <img class="countryFlag" src="../../../assets/images/common/NLflag.png" alt="" />
                      <span class="countryName">荷兰</span>
                    </Checkbox>
                    <Checkbox label="AT">
                      <img class="countryFlag" src="../../../assets/images/common/ATflag.png" alt="" />
                      <span class="countryName">奥地利</span>
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </Row>
              <Row v-if="addFrom.declareRule != 0">
                <Col span="18">
                  <FormItem label="其它平台含税销售额：">
                    <Button
                      class="amzUpload btnfile"
                      v-if="otherPlatformsFormObj.handIncludeTaxSalesFilePath === ''"
                      @click="otherPlatformsMadal = true"
                    >
                      点击填写
                    </Button>
                    <div v-else class="otherPlatformBox">
                      <!-- {{this.otherPlatformsForm.handIncludeTaxSales}} -->
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

                      <span class="link">
                        <a :href="otherPlatformsFormObj.handIncludeTaxSalesFilePath" target="_blank">
                          <img
                            style="float: left; margin-right: 5px; margin-top: 2px"
                            src="../../../assets/images/common/linkIcon.png"
                            alt=""
                          />
                          {{ otherPlatformsFormObj.origFileName || '其它平台含税销售额文件' }}
                        </a>
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
                    </div>
                  </FormItem>
                </Col>
              </Row>
              <div>
                <FormItem label="截图凭证：" prop="amx_file_url" :label-width="120" v-show="addFrom.declareRule == 0">
                  <Upload
                    ref="uploadImg"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-success="
                      (res, file, fileList) => {
                        handleAmzSuccessLing(res, file, fileList);
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        handleAmzRemoveFileLing(file, fileList);
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'pdf']"
                    :on-exceeded-size="handleMaxSize"
                    :max-size="102400"
                    :default-file-list="lingFileList"
                    :on-format-error="handleFormatErrors"
                    :before-upload="handleAmzBeforeUploadLing"
                  >
                    <Button icon="ios-cloud-upload-outline" class="amzUpload btnfile">证明店铺零销售截图</Button>
                  </Upload>
                </FormItem>
              </div>
              <div class="discountBox" v-if="addFrom.declareRule != 0">
                <p class="discountTitle clearfix">
                  抵扣项
                  <span>（如有抵扣项，可进行上传）</span>
                  <span icon="ios-cloud-upload-outline" class="addBtn fr amzUpload" @click="addDiscount">
                    添加抵扣项
                  </span>
                </p>
                <Table :data="discountData" :columns="discountColumns" border class="table">
                  <template slot="declareDate" slot-scope="{ row }">
                    <Date-picker type="date" :value="row.billDate" @on-change="changeDate($event, row)"></Date-picker>
                  </template>
                  <template slot="uploadBox" slot-scope="{ row }">
                    <div class="uploadBox flex">
                      <Upload
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            handleSuccess(res, file, fileList, row);
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            handleRemoveFile(file, fileList, row);
                          }
                        "
                        :format="['pdf', 'jpg', 'png', 'rar', 'zip']"
                        :on-format-error="handleDiscountFormatError"
                      >
                        <Button icon="ios-cloud-upload-outline" class="amzUpload" style="margin-top: 10px">
                          请上传抵扣凭证
                        </Button>
                      </Upload>
                      <span class="close" @click="deleteItem(row)">
                        <img src="@/assets/images/common/close.png" alt="" />
                      </span>
                    </div>
                    <div v-if="discountData[row._index].deductionFile" style="margin-bottom: 10px">
                      <a :href="discountData[row._index].deductionFile" target="_blank" class="show-pdf">抵扣凭证</a>
                      <img
                        class="closeImg"
                        style="width: 10px; cursor: pointer"
                        @click="handleRemoveFile('', '', row)"
                        src="@/assets/images/common/activeCloseImg.png"
                        alt=""
                      />
                    </div>
                  </template>
                </Table>
              </div>
            </div>
          </Form>
        </div>
        <div class="btBox">
          <Button type="primary" @click="saveSnapshoot" v-if="workId">保存草稿</Button>
          <Button type="primary" @click="checkTax()" v-if="addFrom.declareRule != 0">核算税金</Button>
          <Button
            type="info"
            @click="submit"
            ghost
            style="margin-left: 15px"
            :disabled="!isCheckTax && addFrom.declareRule !== 0"
          >
            <p class="submitBottom">{{ buttonText }}</p>
          </Button>
        </div>
      </div>
      <div class="step2" v-if="addFrom.declareRule != 0">
        <div class="step2_content">
          <p class="title jisuan">
            <span>税金计算结果</span>
            <span
              @click="downLoadMingxi('addFrom')"
              v-if="isLogin"
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
                <span class="money">{{ currencySign }}{{ returnTaxData.handExcludeTaxSales | formatQianFenWei }}</span>
              </div>
              <div class="item">
                <span>销项税金：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.outputTax | formatQianFenWei }}</span>
              </div>
              <div class="item">
                <span>进项税金：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.inputTax | formatQianFenWei }}</span>
              </div>
              <div class="item">
                <span>平台已代扣代缴不含税销售额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.excludeTaxSales | formatQianFenWei }}</span>
              </div>
              <div class="item">
                <span>出口不含税销售额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.exportExclTaxAmount | formatQianFenWei }}</span>
              </div>
              <div class="item">
                <span>0税率供应不含税销售额：</span>
                <span class="money"
                  >{{ currencySign }}{{ returnTaxData.supplySalesExcludeTaxAmount | formatQianFenWei }}</span
                >
              </div>
              <div class="item">
                <span>PVA金额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.discountAmount | formatQianFenWei }}</span>
              </div>
              <div class="item">
                <span>最终应缴税金：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.tax | formatQianFenWei }}</span>
              </div>
            </template>
            <template v-if="addFrom.countryCode != 'GB'">
              <div class="item">
                <span>含税销售总额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.includeTaxSales }}</span>
              </div>
              <div class="item">
                <span>不含税销售总额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.excludeTaxSales }}</span>
              </div>
              <div class="item">
                <span>抵扣金额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.discountAmount }}</span>
              </div>
              <div class="item">
                <span>销项税额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.outputTax }}</span>
              </div>
              <div class="item">
                <span>平台代扣代缴：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.platformWithholdandremitTax }}</span>
              </div>
              <div class="item">
                <span>PVA金额：</span>
                <span class="money">{{ currencySign }}{{ returnTaxData.enPvaAmount }}</span>
              </div>
              <div class="item">
                <span>B2B不含税销售额：</span>
                <span class="money">{{ currencySign }}{{ b2bNoPrice }}</span>
              </div>
              <div class="item">
                <span>最终缴纳税金：</span>
                <span class="red">{{ currencySign }}{{ returnTaxData.tax }}</span>
              </div>
            </template>
          </div>
          <div class="resultBox">
            <p class="jisuanshuijin">
              <span>税金计算明细</span>
            </p>
            <Table :data="returnData" max-height="300" :columns="returnColumns"></Table>
            <div v-if="returnData.length > 0 && addFrom.declareRule !== 0">
              <div class="jiankong normal" v-if="returnTaxData.status === 0 && returnData.length > 0">
                <span class="JkTitle">远程销售额监控</span>
                <span class="status" @click="getStatus()">
                  <img src="../../../assets/images/common/blueStatus.png" alt="" />
                  正常 >>
                </span>
              </div>
              <div class="jiankong unnormal" v-if="returnTaxData.status === 1 && returnData.length > 0">
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
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div class="loadingText">{{ operateText }}</div>
    </Spin>
    <div style="clear: both"></div>
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
        <p style="text-align: center">
          <Button class="footerBt" type="primary" :loading="loadingget" @click="giveok('giveFrom')">确认</Button>
        </p>
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
    <Modal v-model="otherPlatformsMadal" :title="addFrom.countryCode == 'GB' ? '其他平台' : '其他平台含税销售额'">
      <div class="promptBg">
        <p v-if="addFrom.countryCode == 'GB'">
          <span>温馨提示：</span>
          如有其他平台需要VAT申报，请在此处填写数据。不含税销售额=含税销售额/（1+税率）
        </p>
        <p v-if="addFrom.countryCode != 'GB'">
          <span>温馨提示：</span>
          如有其它平台需要VAT申报，请在此处填写含税销售额，含税销售额的计算方式可联系客服！(注意：填写的销售额币种为您需要申报的币种)
        </p>
      </div>
      <Form :label-width="120" ref="otherPlatforms" :model="otherPlatformsForm">
        <FormItem
          label="含税销售额"
          prop="handIncludeTaxSales"
          v-if="addFrom.countryCode != 'GB'"
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
          v-if="addFrom.countryCode == 'GB'"
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
          <span>£</span>
        </FormItem>

        <FormItem
          :label="addFrom.countryCode == 'GB' ? '其他平台销售文件' : '其它平台含税销售文件'"
          prop="handIncludeTaxSalesFilePath"
          :rules="{
            required: 'true',
            message: addFrom.countryCode == 'GB' ? '请上传其它平台销售文件' : '请上传其它平台含税销售文件',
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
          v-if="addFrom.countryCode != 'SA' && addFrom.countryCode != 'AE' && addFrom.countryCode != 'GB'"
          :rules="{ required: 'true', type: 'number', message: '请输入其他平台平台代扣代缴金额', trigger: 'change' }"
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
          v-if="addFrom.countryCode == 'GB'"
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
          <span>£</span>
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
          <span>£</span>
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
    <ZeroDeclare
      v-if="zeroDeclareStatus"
      @changeState="zeroDeclareState"
      :isProcess="isProcess"
      :comfirmMessage="confirmDeclareZeroBox"
    ></ZeroDeclare>
    <SubmitDeclareGb
      v-if="DeclareGB"
      @changeState="declareGBState"
      :isProcess="isProcess"
      :paramsToDeclareGB="paramsToDeclareGB"
      :comfirmMessage="confirmDeclareGBBox"
      :currencySign="currencySign"
      :taxRate="sureTaxRate"
      :gbDeclareExtra="gbDeclareExtra"
    ></SubmitDeclareGb>
    <ShowTipDialog :showTipDialog.sync="showTipDialog" :tipMessage="tipMessage" />
  </div>
</template>
<script>
import { caluTax, submitTaxdate, draft, getDraft } from '@/api/taxModule';
import axios from 'axios';
import { baseInfo } from '@/api/shoppingCar/shoppingCar';
import ZeroDeclare from '@/components/AuthorizationModal/ZeroDeclare';
import SubmitDeclareGb from '@/components/AuthorizationModal/SubmitDeclareGb';
import { taxFilingInformation } from '@/api/taxBureauService/taxBureauService';
import ShowTipDialog from '@/views/home/computeTax/components/showTipDialog';
const otherPlatformsFormInit = {
  handIncludeTaxSalesFilePath: '',
  handIncludeTaxSales: '',
  origFileName: '',
  handExIncludeTaxSales: 0,
  handPlatformWithHoldandRemitTax: 0,
  handExPlatformWithHoldandRemitTax: 0,
};
export default {
  data() {
    return {
      gbDeclareExtra: {},
      b2bNoPrice: '',
      // 所有销售报告类型
      servicesId: this.$route.query.servicesId,
      allsaleType: [],
      loadBtnAuto: false, // 自动计算loading
      loadClient: false, // 客户确认loading
      loadNext: false,
      stepIndex: 0, // 步骤
      giveFrom: {},
      ifE: false, // 是否英国
      otherPlatformsMadal: false,

      otherPlatformsForm: { ...otherPlatformsFormInit },
      otherPlatformsFormObj: { ...otherPlatformsFormInit },
      otherPlatformsRules: {
        handIncludeTaxSales: [{ required: 'true', message: '请输入含税销售额', trigger: 'change' }],
        handIncludeTaxSalesFilePath: [
          {
            required: 'true',
            message: '请上传其它平台含税销售文件',
            trigger: 'change',
          },
        ],
      },
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
      contentStyleObj: {
        height: '',
      },
      social: ['facebook', 'github'],
      modelAddCom: false,
      loadingget: false,
      loadingRemark: false,
      currency: '', // 货币单位
      defaultList: [],
      uploadList: [],
      imgName: '',
      visible: false,
      fileUpload: this.ImgUrl,
      workId: this.$route.query.workId,
      // action
      addFrom: {
        countryCode: 'GB',
        declareRule: 1,
        filePath: '',
        taxRate: '20%',
        tfnCountryCode: ['GB'],
        salePlatformType: 0,
        workId: this.$route.query.workId,
      },
      otherSaleFileList: [],
      amx_file_url: '',
      xiaoshouUrl: '',
      ruleAddFrom: {
        salePlatformType: { required: 'true', type: 'number', message: '请选择销售平台', trigger: 'change' },
        declareRule: { required: 'true', type: 'number', message: '请选择计税方式', trigger: 'change' },
        countryCode: { required: 'true', message: '请选择需要报税的国家', trigger: 'change' },
        taxRate: { required: 'true', message: '请选择税率', trigger: 'change' },
      },
      allFacilitator: '',
      taxType: 0,
      // all country
      allcountryList: [],
      allcountryList1: [],
      taxTypes: [
        { value: 0, label: '目的国' },
        { value: 1, label: '发出国' },
        // { value: 2, name: "零申报" }
      ],
      // 核算税金
      saleConfigList: [], //获取申报远程销售限制配置列表
      statusModel: false, // 远程销售model
      typeNow: '',
      remoteSaleCheckInfos: {}, // 提交到税局
      tableFiles: [{ fileList: '' }],
      taxRateList: [],
      checkedTaxCountry: [],
      AmzFileList: [],
      lingFileList: [],
      diyanFileList: [],
      screenshots: [],
      discountData: [
        // {
        //   deductionType: "",
        //   billDate: "",
        //   deductionAmt: null,
        //   deductionFile: "", //url
        //   fileOriginalName: "", //name
        // },
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
            return h(
              'Select',
              {
                props: {
                  value: params.row.deductionType,
                },
                on: {
                  'on-change': (event) => {
                    this.discountData[params.index].deductionType = event;
                  },
                },
              },
              this.discountTypeList.map((item) => {
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
                placeholder: this.addFrom.countryCode == 'GB' ? 'GBP' : 'EUR',
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
          label: '1',
        },
        {
          val: '发票抵扣',
          label: '2',
        },
        {
          val: 'PVA',
          label: '5',
        },
        {
          val: '其他',
          label: '3',
        },
      ],
      currencySign: '', //税金币种符号
      deductionAmt: '', //可抵扣总金额
      returnData: [],
      returnDataSale: [],
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
          render: (h, params) => {
            return h('span', this.currencySign + params.row.includTaxPrice);
          },
        },
      ],
      returnColumnSale: [
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
      returnTaxData: {},
      rateList: {},
      taxTypeRadio: '',
      isLogin: false,
      zeroDeclareStatus: false, // 零申报
      DeclareGB: false,
      DeclareOther: false,
      DeclareGBInfo: {},
      isBeforeYear: false,
      DeclareIndex: 0,
      confirmDeclareGBBox: {},
      confirmDeclareZeroBox: {}, // 零申报数据
      sureTaxRate: '',
      paramsToDeclareGB: {},
      spinShow: false,
      operateText: '上传文件中，请稍后',
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
  beforeRouteEnter(to, from, next) {
    if (['/declareSuccess', '/taxFinishSuccess'].includes(from.path)) {
      sessionStorage.setItem('getDeclareData', true);
    } else {
      sessionStorage.removeItem('getDeclareData');
      sessionStorage.removeItem('declareData');
    }
    next();
  },
  created() {
    if (localStorage.getItem('sessionId') && localStorage.getItem('token')) {
      this.isLogin = true;
    }
    if (JSON.stringify(this.$store.state.bureau.declareInfo) !== '{}') {
      this.DeclareGBInfo = this.$store.state.bureau.declareInfo || {};
    } else {
      this.DeclareGBInfo = JSON.parse(window.sessionStorage.getItem('DeclareInfoGB')) || {};
    }
    if (this.DeclareGBInfo.from === 'fromRedBtn') {
      this.DeclareGBInfo.serviceId = this.DeclareGBInfo.orderServicesId;
    }
    if (parseInt(this.DeclareGBInfo.endTime && this.DeclareGBInfo.endTime.slice(0, 4)) < 2021) {
      this.isBeforeYear = true;
    }
  },
  // mounted() {
  //   this.addFrom.tfnCountryCode.push(this.addFrom.countryCode)
  // },
  components: {
    ZeroDeclare,
    SubmitDeclareGb,
    ShowTipDialog,
  },
  computed: {
    buttonText() {
      let text = '';
      if (!this.isCheckTax && this.addFrom.declareRule !== 0) {
        text = '请先核算税金';
      } else {
        text = '提交申报';
      }
      return text;
    },
    isProcess() {
      return !(!this.$route.query.isProcess || this.$route.query.isProcess === 'false');
    },
  },
  methods: {
    goAddService() {
      this.$router.push('/addedServices');
    },
    getBaseInfo() {
      return new Promise((resolve) => {
        const self = this;
        this.allcountryList = [];
        baseInfo().then((res) => {
          if (res.code === 0) {
            self.allcountryList = res.data;
            self.changeCountry(self.$route.query.countryCode);
            //默认取第一个税率，英国取20%
            if (this.addFrom.countryCode == 'GB') {
              this.addFrom.taxRate = this.taxRateList[this.taxRateList.length - 1];
            } else {
              self.addFrom.taxRate = self.taxRateList[0];
            }
            resolve();
          }
        });
      });
    },
    changeCountry(val) {
      // let countryList = Object.getOwnPropertyNames(this.rateList);
      // countryList.map((v, i) => {
      //   if (val === v) {
      //     this.taxRateList = this.rateList[val][0];
      //   }
      // });
      this.taxRateList = this.allcountryList
        .find((item) => item.countryCode == this.addFrom.countryCode)
        .declareTax.split(',');
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
      let self = this;
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
    // ymx file
    handleAmzSuccess(response, file, fileList) {
      this.addFrom.filePath = response.data.fileUrl;
      this.xiaoshouUrl = response.data.fileUrl;
      this.AmzFileList = fileList;
      this.fileType = response.data.suffix;
      this.spinShow = false;
    },
    handleAmzSuccessLing(response, file, fileList) {
      this.addFrom.sellFile = response.data.fileUrl;
      this.addFrom.filePath = response.data.fileUrl;
      this.amx_file_url = response.data.fileUrl;
      this.lingFileList = fileList;
      this.fileType = response.data.suffix;
      this.spinShow = false;
    },
    handleDiyanSuccess(response, file, fileList) {
      this.addFrom.diyanFile = response.data.fileUrl;
      this.diyanFileList = fileList;
    },
    handleAmzSuccess1(response, file, fileList) {
      this.addFrom.filePath = response.data.fileUrl;
      this.screenshots = fileList;
    },
    handleAmzSuccessPlatform(response, file, fileList) {
      this.otherPlatformsForm.origFileName = response.data.origFileName;
      this.otherPlatformsForm.handIncludeTaxSalesFilePath = response.data.fileUrl;
      this.otherSaleFileList = fileList;
    },
    // 统一错误处理，隐藏loading
    handleUploadError(res, file, fileList) {
      this.$Message.warning('上传文件失败，请重新上传');
      setTimeout(() => {
        this.spinShow = false;
      }, 300);
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
      this.discountData.push(obj);
    },
    // 切换计税方式
    changeRadio(val) {
      if (val == '2') {
        // this.$refs.uploadImg.clearFiles()
        this.addFrom.filePath = this.amx_file_url;
      } else {
        // this.$refs.upload.clearFiles()
        this.addFrom.filePath = this.xiaoshouUrl;
      }
      // if(val == 2){
      //   this.addFrom.filePath = this.addFrom.amx_file_url
      // }else{
      //   this.addFrom.filePath = this.addFrom.xiaoshouUrl
      // }
      this.screenshots = [];
      this.tableFiles[0].fileList = [];
    },
    changeDate(date, row) {
      this.discountData[row._index].billDate = date + ' 00:00:00';
    },
    handleSuccess(res, file, fileList, row) {
      this.discountData[row._index].deductionFile = res.data.fileUrl;
      this.discountData[row._index].fileOriginalName = file.name;
    },
    handleAmzRemoveFile() {
      this.xiaoshouUrl = '';
      this.addFrom.filePath = '';
      this.AmzFileList = [];
    },
    handleAmzRemoveFileLing() {
      this.amx_file_url = '';
      this.addFrom.filePath = '';
      this.addFrom.sellFile = '';
      this.lingFileList = [];
    },
    handleDiyanRemoveFile() {
      this.addFrom.diyanFile = '';
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: '上传文件不超过100M',
      });
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
    handleAmzBeforeUploadLing() {
      const check = this.amx_file_url == '';
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    handleDiyanBeforeUpload() {
      const check = this.diyanFileList.length < 1;
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    handleImgBeforeUpload() {
      const check = this.screenshots.length < 1;
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
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
    handleFormatErrors(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg, jpeg, png, pdf',
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
    deleteItem(row) {
      this.discountData.splice(row._index, 1);
    },
    validate() {
      return new Promise((resolve) => {
        if (this.addFrom.taxRate == '') {
          this.$Message.info('请选择税率');
          return;
        }
        if (this.addFrom.declareRule === 1) {
          if (this.addFrom.filePath === '' && this.otherPlatformsFormObj.handIncludeTaxSalesFilePath === '') {
            this.$Message.info('请上传销售额文件');
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
      this.addFrom.taxDeductionDtos = this.discountData;
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
        beginTime: this.DeclareGBInfo.beginTime ? this.DeclareGBInfo.beginTime.split(' ')[0] + ' 00:00:00' : '',
        endTime: this.DeclareGBInfo.endTime ? this.DeclareGBInfo.endTime.split(' ')[0] + ' 23:59:59' : '',
      };
      data.taxRate = this.addFrom.taxRate.replace('%', '') / 100;
      // data.endTime = this.DeclareGBInfo.endTime;
      // data.vatTaxNumber = this.DeclareGBInfo.vatTaxNumber;
      if (this.otherPlatformsFormObj.handIncludeTaxSales) {
        data.handIncludeTaxSales = this.otherPlatformsFormObj.handIncludeTaxSales;
      }

      if (this.addFrom.countryCode == 'GB') {
        if (this.otherPlatformsFormObj.handExIncludeTaxSales) {
          data.handExIncludeTaxSales = this.otherPlatformsFormObj.handExIncludeTaxSales;
        }
        if (this.otherPlatformsFormObj.handExPlatformWithHoldandRemitTax) {
          data.handExPlatformWithHoldandRemitTax = this.otherPlatformsFormObj.handExPlatformWithHoldandRemitTax;
        }
      }

      data.handIncludeTaxSalesFilePath = this.otherPlatformsFormObj.handIncludeTaxSalesFilePath;
      data.handPlatformWithHoldandRemitTax =
        this.otherPlatformsFormObj.handPlatformWithHoldandRemitTax != ''
          ? this.otherPlatformsFormObj.handPlatformWithHoldandRemitTax
          : undefined;

      this.parameters = data;
      this.spinShow = true;
      this.operateText = '正在计算税金，请稍后';
      caluTax(data)
        .then((res) => {
          if (res.code == 0) {
            this.returnTaxData = res.data;
            this.currencySign = res.data.currencySign;
            this.returnData = res.data.taxPriceDetailDtos;
            // this.deductionAmt = res.data.deductionAmt;
            // this.returnDataSale = res.data.saleCheckInfoVos;
            // this.remoteSaleCheckInfos = res.data.remoteSaleCheckInfos;
            // this.returnTaxData = res.data;
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
    async submit() {
      await this.validate();
      const validate = this.verifyPaymentInsert(this.discountData);
      let params = {};
      if (JSON.stringify(this.returnTaxData) === '{}' && this.addFrom.declareRule != 0) {
        this.$Message.error('请先上传销售文件然后核算税金在提交申报');
        return;
      }
      sessionStorage.setItem('declareData', JSON.stringify(this.saveObj()));
      if (this.addFrom.declareRule == 0) {
        params = {
          sellFile: this.addFrom.sellFile,
          id: this.DeclareGBInfo.id,
          declareRule: this.addFrom.declareRule,
        };
        this.confirmDeclareZeroBox = params;
        this.zeroDeclareStatus = true;
        return;
      } else {
        params = {
          id: this.DeclareGBInfo.id,
          agentTaxPrice: this.returnTaxData.platformWithholdandremitTax,
          allTaxPrice: this.returnTaxData.tax,
          deductionItems: this.addFrom.taxDeductionDtos,
          declareRule: this.addFrom.declareRule,
          deductionPrice: this.returnTaxData.discountAmount,
          eclPurchasePrice: this.returnTaxData.eclPurchaseAmount,
          eclSalePrice: this.returnTaxData.eclSales,
          excludeTaxPrice:
            this.addFrom.countryCode == 'GB'
              ? this.returnTaxData.handExcludeTaxSales
              : this.returnTaxData.excludeTaxSales,
          inputTax: this.returnTaxData.inputTax,
          includeTaxPrice: this.returnTaxData.includeTaxSales,
          exportExclTaxAmount: this.returnTaxData.exportExclTaxAmount,
          enPvaAmount: this.returnTaxData.enPvaAmount,
          awsExcludeTaxSales: this.returnTaxData.awsExcludeTaxSales,
          awsHandExcludeTaxSales: this.returnTaxData.awsHandExcludeTaxSales,
          supplySalesExcludeTaxAmount: this.returnTaxData.supplySalesExcludeTaxAmount,
          irelandToEuExcludeSell: this.returnTaxData.irelandToEuExcludeSell,
          euToIrelandExcludeSell: this.returnTaxData.euToIrelandExcludeSell,
          priceOfItemsVatRatePercent: this.returnTaxData.priceOfItemsVatRatePercent,
          ioss: this.addFrom.ioss == 1 ? true : false,
          oss: this.addFrom.oss == 1 ? true : false,
          ecl: this.addFrom.ecl == 1 ? true : false,
          isEcl: false,
          otherEcAcqPrice: this.returnTaxData.purchaseAmount,
          otherIncludeTaxAmt: this.otherPlatformsFormObj.handPlatformWithHoldandRemitTax,
          handExIncludeTaxSales: this.otherPlatformsFormObj.handExIncludeTaxSales,
          handExPlatformWithHoldandRemitTax: this.otherPlatformsFormObj.handExPlatformWithHoldandRemitTax,
          otherSaleFileUrl: this.otherPlatformsFormObj.handIncludeTaxSalesFilePath,
          salePlatformType: this.addFrom.salePlatformType,
          sellFile: this.addFrom.declareRule == 0 ? this.addFrom.sellFile : this.addFrom.filePath,
          taxAmtTotal: this.returnTaxData.outputTax,
          taxRate: this.returnTaxData.taxRate,
          tfnCountryCode: this.addFrom.tfnCountryCode ? this.addFrom.tfnCountryCode.toString() : '',
          otherEcAcqPriceFile: this.addFrom.ecAcqFilePath,
          gbDeclareExtra: this.returnTaxData.taxResult,
          excludeTaxB2bPrice: this.b2bNoPrice,
        };
      }
      if (!validate.flag) {
        // this.$Message.info('请填写完整抵扣项金额')
      } else if (validate.flag && validate.isEmpty) {
        params.listTaxDeductionItem = [];
      } else if (validate.flag && !validate.isEmpty) {
        params.listTaxDeductionItem = this.discountData;
      }
      params.purchaseTime = [...new Set(this.returnTaxData.taxPriceDetailDtos.map((item) => item.month))];
      this.paramsToDeclareGB = params;
      this.gbDeclareExtra = params.gbDeclareExtra;
      this.sureTaxRate = params.taxRate;
      this.DeclareGB = true;
    },
    // 验证抵扣项有没有值，如果没有传空对象，有则每一个字段都必填
    verifyPaymentInsert(obj) {
      let arr = Object.values(obj);
      let flag = false,
        isEmpty = false;
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
      this.screenshots = [];
      this.addFrom.tfnCountryCode = [];
    },
    declareGBState(obj) {
      this.DeclareGB = obj;
    },
    zeroDeclareState(obj) {
      this.zeroDeclareStatus = obj;
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
    // 下载税金明细
    downLoadMingxi(name) {
      if (this.currencySign == '') {
        if (this.returnData.length == 0 && this.addFrom.declareRule != 0) {
          this.$Message.error('请先核算税金');
          return;
        }
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
    await this.getBaseInfo();
    this.getData();
  },
};
</script>
<style lang="less" scoped>
.topLeft {
  .salefile1 {
    /deep/ .ivu-form-item-content {
      position: relative;
      .ivu-upload {
        .ivu-upload-list {
          position: absolute;
          width: 216px;
          top: 0px;
          left: 185px;
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
    }
  }
}

.modalCount {
  background-color: #fff;
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
  .title {
    font-size: 16px;
    font-weight: 500;
    padding: 18px 0 18px 0;
    border-bottom: 1px solid #e6e6e6;
    color: #303033;
    font-family: 'Microsoft Yahei', 'PingFangSC-Medium,PingFang SC';
  }
  .step1,
  .step2 {
    padding-bottom: 20px;
  }
  .step1 {
    width: 100%;
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
  .yellow {
    color: #fdaa15;
    font-size: 12px;
  }
  .red {
    font-size: 20px;
    font-weight: bold;
    color: rgba(237, 62, 62, 1);
    margin-left: 13px;
  }
  .countryFlag {
    width: 26px;
    height: 28px;
    margin-left: 5px;
    margin-right: 3px;
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
    .VATCountry {
      /deep/ .ivu-form-item {
        position: relative;
      }
      span.zhuce {
        position: absolute;
        top: 15px;
        left: -111px;
        font-size: 12px;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #666666;
      }
    }
  }
  .discountBox {
    padding-top: 30px;
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
      margin-left: 46px;
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
  .submitTop {
    font-size: 13px;
    line-height: 12px;
    margin-top: 3px;
  }
  .submitBottom {
    font-size: 12px;
    line-height: 15px;
  }
  &/deep/ .ivu-form .ivu-form-item-label {
    font-size: 16px;
    font-weight: 700;
    color: #666;
  }
  &/deep/ .ivu-radio-wrapper {
    color: #333333;
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
  &/deep/ .ivu-form-item-content {
    position: relative;
    .ivu-upload {
      .ivu-upload-list {
        position: absolute;
        width: 216px;
        top: 0px;
        left: 185px;
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
  /deep/ .ivu-checkbox-group {
    display: flex;
    margin-top: 3px;
    flex-wrap: wrap;
  }
  /deep/ .ivu-checkbox-wrapper {
    display: flex;
    align-items: center;
    margin-right: 15px;
  }
}
.hasLogin {
  background: #f6f6f6;
  margin-top: 0px;
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px 10px;
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
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      .Btitle {
        span {
          font-size: 14px;
          font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          line-height: 22px;
        }
      }
      .compangInfo {
        margin-top: 14px;
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC-Regular, Microsoft YaHe, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        p {
          min-width: 390px;
          margin: 4px 0px;
        }
        .right {
          color: #333333ff;
          font-family: 'Microsoft Yahei', PingFangSC-Medium, Microsoft YaHe, PingFang SC sans-serif;
          font-weight: 500;
        }
      }
    }
  }
  .bodyContent {
    margin: 24px;
  }
  .step1 {
    padding-bottom: 0px;
    .btBox {
      margin: 0px;
      background: #ffffff;
      padding: 15px;
      text-align: center;
    }
  }
  .step1 {
    .title {
      margin-top: 15px;
      background: #ffffff;
      border-bottom: none;
      padding-left: 15px;
      &::before {
        content: '';
        border-left: 2px solid #16ade9;
        width: 2px;
        height: 9px;
        padding-left: 15px;
      }
    }
  }
  .step2 {
    margin-top: 15px;
    background: #ffffff;
    border-bottom: none;
    padding-left: 15px;
    padding-right: 15px;
    .title {
      border-bottom: none;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
    }
  }
  .subInfo {
    padding-left: 120px !important;
    position: relative;
    // height: 67px;
    padding-bottom: 6px;
    background: #fff1dd;
    font-size: 14px;
    font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;
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
    .subInfo-top-label {
      position: absolute;
      top: 6px;
      left: 20px;
    }
    p {
      padding: 4px 0 0 81px;
    }
  }
  .leftBox {
    background: #ffffff;
    border: none;
    padding: 10px;
  }
  .topLeft {
    margin: 10px;
    &/deep/ .ivu-form-item {
      margin-bottom: 15px;
    }
  }
  .step2_content {
    .resultMoney {
      background: #ffffff;
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 320px;
        height: 50px;
      }
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

      span.red {
        font-size: 20px;
        font-weight: bold;
        color: rgba(237, 62, 62, 1);
        margin-left: 13px;
      }
      .finallyMoney {
        color: #333333;
        font-weight: 500;
        font-size: 18px;
        margin-top: 15px;
        margin-bottom: 33px;
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
  .step2 {
    .resultBox {
      padding: 0px;
      .jisuanshuijin {
        margin-bottom: 20px;
        span {
          font-size: 18px;
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
            // margin-top: 3px;
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
            // margin-top: 3px;
          }
          color: #ed3e3e;
        }
      }
    }
  }
  &/deep/ .ivu-table td {
    background: #ffffff;
    padding-left: 20px;
    padding-top: 10px;
    border: 1px solid #e8eaec;
    border-right: 0px;
    border-top: 0px;
  }
  &/deep/ .ivu-table th {
    background: #eeeeee;
    border: none;
    padding-left: 20px;
  }
  &/deep/ .ivu-input {
    height: 32px;
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
.promptBg {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: #fff1dd;
  font-size: 12px;
  font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
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
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fa5555;
    line-height: 16px;
    margin-bottom: 7px;
  }
  .link {
    font-size: 14px;
    font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3e9dff;
    line-height: 12px;
    cursor: pointer;
    margin-top: 3px;
  }
}
</style>
