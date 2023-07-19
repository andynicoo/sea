<template>
  <div class="container">
    <div class="taxBox">
      <div class="topTaxBoxContainer">
        <div class="top">
          <!-- <Breadcrumb>
            <BreadcrumbItem>
              <span class="flink">工作台</span>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <span class="clink">详情</span>
            </BreadcrumbItem>
          </Breadcrumb> -->
        </div>
        <p class="page-title">
          <span class="title">税号信息</span>
          <span class="country">
            <!-- 1 税号注册 2、税务申报 3、税务补缴 4、转代理 5、注册+申报 6、注销税号 7、税务稽查 -->
            （
            {{ baseData.countryNameZh }}
            {{
              baseData.productFunctionCode == '1'
                ? '税号注册'
                : baseData.productFunctionCode == '2'
                ? '转代理+申报'
                : baseData.productFunctionCode == '3'
                ? '税务补缴'
                : baseData.productFunctionCode == '4'
                ? '转代理'
                : baseData.productFunctionCode == '5'
                ? '注册+申报'
                : baseData.productFunctionCode == '6'
                ? '注销税号'
                : baseData.productFunctionCode == '7'
                ? '税务稽查'
                : baseData.productFunctionCode == '23'
                ? '注册+申报'
                : ''
            }}
            ）
          </span>
        </p>
        <!-- 英国 -->
        <div v-if="countryCode == 'GB'">
          <Row>
            <Col span="8">
              <span class="tax-info-name">公司名称：</span>
              <span class="tax-info-value">{{ baseData.companyName || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">报税国家：</span>
              <span class="tax-info-value">{{ baseData.countryNameZh || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">申报周期：</span>
              <span class="tax-info-value">
                {{
                  baseData.periodType == 0
                    ? '月报'
                    : baseData.periodType == 1
                    ? '季报'
                    : baseData.periodType == -1
                    ? '暂无'
                    : ''
                }}
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">VAT税号：</span>
              <span class="tax-info-value">{{ baseData.vatTaxNumber || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号生效日期：</span>
              <span class="tax-info-value">{{ baseData.taxEffectiveDate || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号下发日期：</span>
              <span class="tax-info-value">{{ baseData.taxIssueDate || '暂无' }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">EORI号：</span>
              <span class="tax-info-value">{{ baseData.eoriNumber || '暂无' }}</span>
            </Col>
            <!-- <Col span="8">
            <span class="tax-info-name">EORI文件：</span>
            <span class="tax-info-value">
              <span v-if="baseData.eoriNumberFile==''">暂无</span>
              <a :href="baseData.eoriNumberFile"
                 v-else
                 target="_blank"><img src="@/assets/images/common/searchIcon.png">点击查看</a>
            </span>
            </Col> -->
            <Col span="8">
              <span class="tax-info-name">VAT税号文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatTaxNumberFile == ''">暂无</span>
                <a :href="baseData.vatTaxNumberFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8" v-if="baseData.productFunctionCode == '5'">
              <span class="tax-info-name">VAT证书：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatCertificate == ''">暂无</span>
                <a :href="baseData.vatCertificate" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">gateway 账号：</span>
              <span class="tax-info-value">{{ baseData.gatewayId || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">gateway 密码：</span>
              <span class="tax-info-value">{{ baseData.gatewayPassword || '暂无' }}</span>
            </Col>
          </Row>
        </div>
        <!-- 德国 -->
        <div v-else-if="countryCode == 'DE'">
          <Row>
            <Col span="8">
              <span class="tax-info-name">公司名称：</span>
              <span class="tax-info-value">{{ baseData.companyName || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">报税国家：</span>
              <span class="tax-info-value">{{ baseData.countryNameZh || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">申报周期：</span>
              <span class="tax-info-value">
                {{
                  baseData.periodType == 0
                    ? '月报'
                    : baseData.periodType == 1
                    ? '季报'
                    : baseData.periodType == -1
                    ? '暂无'
                    : ''
                }}
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">VAT税号：</span>
              <span class="tax-info-value">{{ baseData.vatTaxNumber || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号生效日期：</span>
              <span class="tax-info-value">{{ baseData.taxEffectiveDate || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号下发日期：</span>
              <span class="tax-info-value">{{ baseData.taxIssueDate || '暂无' }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">EORI号：</span>
              <span class="tax-info-value">{{ baseData.eoriNumber || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">EORI文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.eoriNumberFile == ''">暂无</span>
                <a :href="baseData.eoriNumberFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税务副本：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatTaxNumberCopyFile == ''">暂无</span>
                <a :href="baseData.vatTaxNumberCopyFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
                <a
                  href="https://fdfs.itaxs.com/group1/M00/02/65/rBLKNV8-IJaAAWdsAAbOsVTv8G0032.pdf"
                  target="_blank"
                  style="margin-left: 10px; color: red"
                >
                  绑定方法>>
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">DE欧盟证书：</span>
              <span class="tax-info-value">
                <span v-if="baseData.deEuCertificate == ''">暂无</span>
                <a :href="baseData.deEuCertificate" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">VAT税号文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatTaxNumberFile == ''">暂无</span>
                <a :href="baseData.vatTaxNumberFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8" v-if="baseData.productFunctionCode == '2' && baseData.vatTaxLocalFile">
              <span class="tax-info-name">本地税号文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatTaxLocalFile == ''">暂无</span>
                <a :href="baseData.vatTaxLocalFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
        </div>
        <!-- 意大利 -->
        <div v-else-if="countryCode == 'IT'">
          <Row>
            <Col span="8">
              <span class="tax-info-name">公司名称：</span>
              <span class="tax-info-value">{{ baseData.companyName || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">报税国家：</span>
              <span class="tax-info-value">{{ baseData.countryNameZh || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">申报周期：</span>
              <span class="tax-info-value">
                {{
                  baseData.periodType == 0
                    ? '月报'
                    : baseData.periodType == 1
                    ? '季报'
                    : baseData.periodType == -1
                    ? '暂无'
                    : ''
                }}
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">VAT税号：</span>
              <span class="tax-info-value">{{ baseData.vatTaxNumber || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号生效日期：</span>
              <span class="tax-info-value">{{ baseData.taxEffectiveDate || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号下发日期：</span>
              <span class="tax-info-value">{{ baseData.taxIssueDate || '暂无' }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">EORI号：</span>
              <span class="tax-info-value">{{ baseData.eoriNumber || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">EORI文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.eoriNumberFile == ''">暂无</span>
                <a :href="baseData.eoriNumberFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">VAT税号文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatTaxNumberFile == ''">暂无</span>
                <a :href="baseData.vatTaxNumberFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8" v-if="baseData.productFunctionCode == '5'">
              <span class="tax-info-name">VAT证书：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatCertificate == ''">暂无</span>
                <a :href="baseData.vatCertificate" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8" v-if="!(baseData.countryCode === 'IT' && baseData.productFunctionCode == '5')">
              <span class="tax-info-name">VAT税号文件（新）：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatCertificate == ''">暂无</span>
                <a :href="baseData.vatCertificate" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
        </div>
        <!-- gsw 新增 -->
        <!-- IOSS注册+申报 -->
        <div v-else-if="countryCode == 'IOSS'">
          <Row>
            <Col span="8">
              <span class="tax-info-name">公司名称：</span>
              <span class="tax-info-value">{{ baseData.companyName || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">公司英文名称：</span>
              <span class="tax-info-value">{{ baseData.companyNameEn || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">报税国家：</span>
              <span class="tax-info-value">{{ baseData.countryNameZh || '暂无' }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">IOSS税号：</span>
              <span class="tax-info-value">{{ baseData.iossNumber }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号下发日期：</span>
              <span class="tax-info-value">{{ baseData.taxIssueDate || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号生效日期：</span>
              <span class="tax-info-value">{{ baseData.taxEffectiveDate || '暂无' }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">申报周期：</span>
              <span class="tax-info-value">{{ baseData.periodType == 0 ? '月报' : '' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">IOSS税号文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.iossNumberFile == ''">暂无</span>
                <a :href="baseData.iossNumberFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
        </div>
        <div v-else>
          <Row>
            <Col span="8">
              <span class="tax-info-name">公司名称：</span>
              <span class="tax-info-value">{{ baseData.companyName || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">报税国家：</span>
              <span class="tax-info-value">{{ baseData.countryNameZh || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">申报周期：</span>
              <span class="tax-info-value">
                {{
                  baseData.periodType == 0
                    ? '月报'
                    : baseData.periodType == 1
                    ? '季报'
                    : baseData.periodType == -1
                    ? '暂无'
                    : ''
                }}
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">VAT税号：</span>
              <span class="tax-info-value">{{ baseData.vatTaxNumber || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号生效日期：</span>
              <span class="tax-info-value">{{ baseData.taxEffectiveDate || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">税号下发日期：</span>
              <span class="tax-info-value">{{ baseData.taxIssueDate || '暂无' }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <span class="tax-info-name">EORI号：</span>
              <span class="tax-info-value">{{ baseData.eoriNumber || '暂无' }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">EORI文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.eoriNumberFile == ''">暂无</span>
                <a :href="baseData.eoriNumberFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">VAT税号文件：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatTaxNumberFile == ''">暂无</span>
                <a :href="baseData.vatTaxNumberFile" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8" v-if="countryCode != 'ES' && baseData.productFunctionCode == '5'">
              <span class="tax-info-name">VAT证书：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatCertificate == ''">暂无</span>
                <a :href="baseData.vatCertificate" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8" v-if="countryCode == 'ES' && baseData.productFunctionCode == '5'">
              <span class="tax-info-name">欧盟税号证书：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatCertificate == ''">暂无</span>
                <a :href="baseData.vatCertificate" v-else style="font-size: 14px" target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
            <Col span="8" v-if="countryCode == 'FR' && baseData.productFunctionCode == '5'">
              <span class="tax-info-name">SIRET号：</span>
              <span class="tax-info-value">{{ baseData.siretNumber || '暂无' }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="8" v-if="baseData.countryCode === 'FR' && baseData.productFunctionCode == '2'">
              <span class="tax-info-name">VAT税号文件（新）：</span>
              <span class="tax-info-value">
                <span v-if="baseData.vatCertificate == ''">暂无</span>
                <a :href="baseData.vatCertificate" v-else target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
          <Row v-if="countryCode == 'ES' && baseData.hyFlag != 2">
            <Col span="8">
              <span class="tax-info-name">海牙文件</span>
              <span class="tax-info-value">
                <span v-if="baseData.hyFile == ''">暂无</span>
                <a :href="baseData.hyFile" v-else target="_blank">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
        </div>
        <div class="tab-box">
          <span :class="{ 'active-tab': tabIndex == 1 }" @click="tabIndex = 1">报税记录</span>
          <span :class="{ 'active-tab': tabIndex == 2 }" @click="tabIndex = 2">
            {{
              baseData.productFunctionCode == '2'
                ? '转代理资料'
                : baseData.productFunctionCode == '5' || baseData.productFunctionCode == 23
                ? '注册资料'
                : '提交资料'
            }}
          </span>
        </div>
      </div>
      <div class="tabBoxContainer">
        <div style="background: #ffffff; border-radius: 4px; padding: 0px 20px 20px 20px" v-if="tabIndex == 1">
          <div v-if="!showDEannals">
            <div class="tax-title">报税记录</div>
            <Table :data="logData" :columns="logColumns" border>
              <template slot="checkTax" slot-scope="{ row }">
                <div class="checkTax" @click="checkTaxDetail(row)">
                  <img src="@/assets/images/common/searchIcon.png" />
                  点击查看
                </div>
              </template>
              <template slot="vatInterval" slot-scope="{ row }">
                <div class="vatIntervalBox">
                  <!-- <img v-if="row.taxPeriodStatus == 1"
                       src="@/assets/images/common/yuqi.svg"> -->
                  <span style="color: red">{{ row.isSuppleDecl && row.isSuppleDecl == 1 ? '补申报：' : '' }}</span>
                  <span>{{ row.beginTime.slice(0, 7) }} 至 {{ row.endTime.slice(0, 7) }}</span>
                </div>
              </template>
              <template slot="operation" slot-scope="{ row }">
                <div style="display: flex; justify-content: space-around">
                  <div
                    style="cursor: pointer; color: #16ade9"
                    v-if="row.status > 21 && row.countryCode === 'GB'"
                    @click="getLink(row)"
                  >
                    查看申报回执
                  </div>
                  <div v-if="row.status > 21 && row.declareReceipt !== '' && row.countryCode === 'DE'">
                    <a
                      :href="row.declareReceipt"
                      style="cursor: pointer; color: #16ade9; font-size: 12px"
                      target="_blank"
                    >
                      查看申报回执
                    </a>
                  </div>
                  <div class="upload" @click="uploadFile(row)" v-if="row.status == 21">提交申报数据</div>
                  <div
                    class="upload"
                    @click="uploadFile(row)"
                    v-if="row.status == 24 && (row.countryCode === 'AT' || row.countryCode === 'CZ')"
                  >
                    提交申报数据
                  </div>
                  <div class="upload" style="display: flex; justify-content: space-around" v-else-if="row.status == 22">
                    <span @click="uploadFile(row)" style="margin-right: 10px">
                      <img src="@/assets/images/common/upload.png" />
                      上传缴税凭证
                    </span>
                    <span v-if="row.countryCode !== 'GB'" @click="uploadTaxBill(row)">下载税金单</span>
                  </div>
                  <div class="upload" @click="uploadFile(row)" v-else-if="row.status == 34">重新上传缴税凭证</div>
                  <div class="upload" @click="uploadFile(row)" v-else-if="row.status == 35">上传零申报凭证</div>
                </div>
                <div v-if="row.status == 27 || row.status == 25" style="display: flex; justify-content: space-around">
                  <!-- <div v-if="row.countryCode !=='IT'&&row.countryCode !=='GB'&&row.countryCode !=='DE' && row.status==27 && row.declareReceipt!==''">
                    <p v-for="(v,i) in row.declareReceipt.split(';')"
                       :key="i">
                      <a :href="v.slice(0,5)=='http:'?(v.slice(0,4)+'s'+v.slice(4)):v"
                         target="_blank">查看申报回执</a>
                    </p>
                  </div> -->
                  <div
                    style="cursor: pointer; color: #16ade9"
                    v-if="
                      (row.status == 27 || row.status == 25) &&
                      row.countryCode !== 'GB' &&
                      row.countryCode !== 'DE' &&
                      row.status == 27 &&
                      row.declareReceipt !== ''
                    "
                    @click="uploadTaxDeclareReceipt(row)"
                  >
                    查看申报回执
                  </div>
                  <!-- <div v-if="row.countryCode =='IT' && (row.status==27 ||row.status==25) && row.declareReceipt!==''"
                       style="color: #16ade9;font-size: 12px;cursor: pointer;">
                    <p v-for="(v,i) in row.declareReceipt.split(';')"
                       :key="i">
                      <a :href="v.slice(0,5)=='http:'?(v.slice(0,4)+'s'+v.slice(4)):v"
                         target="_blank">查看申报回执</a>
                    </p>
                  </div> -->
                  <div v-if="row.countryCode == 'SA'">
                    <div style="display: flex; justify-content: space-between; padding-bottom: 5px">
                      <p v-if="row.invoiceReceipt != ''">
                        <a :href="row.invoiceReceipt" target="_blank">发票开具通知</a>
                      </p>
                      <p v-if="row.payLetterInvoiceReceipt != ''">
                        <a :href="row.payLetterInvoiceReceipt" target="_blank">纳税付款发票信件</a>
                      </p>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-bottom: 5px">
                      <p v-if="row.paySystemInvoiceReceipt != ''" style="margin-right: 10px">
                        <a :href="row.paySystemInvoiceReceipt" target="_blank">纳税付款系统发票</a>
                      </p>
                      <p v-if="row.taxDeclareReceiveInformReceipt != ''">
                        <a :href="row.taxDeclareReceiveInformReceipt" target="_blank">税务申报接收通知</a>
                      </p>
                    </div>

                    <p v-if="row.taxDeclareBlankReceipt != ''">
                      <a :href="row.taxDeclareBlankReceipt" target="_blank">税务申请表</a>
                    </p>
                  </div>
                  <div v-if="row.countryCode == 'AE'">
                    <p v-if="row.taxesReceipt != ''">
                      <a :href="row.taxesReceipt" target="_blank">税金收款回执</a>
                    </p>
                  </div>
                  <a
                    class="upload"
                    v-if="row.status == 27 && row.debitReceipt !== ''"
                    :href="row.debitReceipt"
                    target="_blank"
                  >
                    查看扣款回执
                  </a>
                </div>
                <!-- <div v-else>无</div> -->
                <!-- gsw 西班牙ECL查看回执 -->
                <div v-if="row.countryCode == 'ES' && row.isEcl == 1 && row.eclReceipt != ''">
                  <a :href="row.eclReceipt" target="_blank">查看ECL申报回执</a>
                </div>
              </template>
            </Table>
            <div class="overdue">
              <!-- taxPeriodStatus = 1表示逾期 -->
              <div class="info" v-if="baseData.countryCode === 'GB'">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  温馨提示：请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；逾期申报/补申报会产生罚金，罚金比例一般是应缴税金的3.25%，10%，20%，30%递增，可能含利息，最终解释权在税局；
                </p>
              </div>
              <div class="info" v-if="baseData.countryCode === 'DE'">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；逾期申报/补申报会产生罚金，罚金比例一般是应缴税金的10%；
                </p>
              </div>
              <!-- gsw 新增 -->
              <div class="info" v-if="baseData.countryCode === 'IOSS'">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；逾期申报/补申报会产生罚金，具体以税局为准；
                </p>
              </div>
              <div class="info" v-if="baseData.countryCode === 'FR'">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；逾期申报/补申报会产生罚金，具体以税局为准；
                </p>
              </div>
              <div class="info" v-if="baseData.countryCode === 'IT'">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；若申报在截止日期后的15天之内提交：罚款金额为27,78欧元
                  ，时间越长罚金越高，若税金到账在截止到账时间之后违规后起的1-14天内，罚款金额约等于增值税的1%
                  *滞纳天数，时间越长，罚金越高；
                </p>
              </div>
              <div class="info" v-if="baseData.countryCode === 'ES'">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；逾期3个月内收取当季申报税金的5%，3-6个月10%，6-12个月15%，12个月以上20%+利息（年息3.75%）；
                </p>
              </div>
              <div class="info" v-if="baseData.countryCode === 'SA'">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；逾期申报罚金=未按时提交申报的金额*x%，x等于5至25。逾期缴纳税金罚金按照未缴纳部分的税金乘以5%计算罚金；
                </p>
              </div>
              <div class="info" v-if="baseData.countryCode === 'AE'">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；若两年内一次逾期申报1000AED，一次以上每次累加2000AED，若逾期缴纳税金：根据未缴纳的税金金额乘以一个百分比。一旦逾期即产生2%，超过7天产生4%，如果在付款截止日期之后一个日历月内仍未缴纳，按照每天1%累加，最高可达300%；
                </p>
              </div>
              <div
                class="info"
                v-if="baseData.countryCode === 'AT' || baseData.countryCode === 'CZ' || baseData.countryCode === 'PL'"
              >
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <p>
                  请按时进行申报，逾期申报有可能产生罚金（每个月初3-4号可从销售平台下载数据申报）；逾期申报/补申报会产生罚金，具体以税局为准；
                </p>
              </div>
            </div>
            <Divider v-if="countryCode == 'DE' && annalsDeData.length > 0" />
            <div class="tax-title" v-if="countryCode == 'DE' && annalsDeData.length > 0">
              年度申报

              <span class="red">注意：</span>
              <span class="black">如您已在其它地方申报过，可忽略此处</span>
            </div>
            <Table
              v-if="countryCode == 'DE' && annalsDeData.length > 0"
              :data="annalsDeData"
              :columns="annalsDeColumns"
              border
              style="margin-bottom: 40px"
            >
              <template slot="operation" slot-scope="{ row }">
                <div class="operation-box">
                  <span v-if="row.status == 21" style="cursor: pointer; color: #f79728" @click="goAnnalsDE(row, false)">
                    <img src="@/assets/images/common/upload-small.png" alt="" />
                    提交申报
                  </span>
                  <span v-if="row.status == 27 && row.declareReceipt != ''">
                    <a :href="row.declareReceipt" target="_blank">
                      <img src="@/assets/images/common/download-small.png" alt="" />
                      查看回执
                    </a>
                  </span>
                  <span @click="goAnnalsDE(row, true)" style="cursor: pointer; color: #16ade9">
                    <img src="@/assets/images/common/xiangqing.png" alt="" />
                    详情
                  </span>
                </div>
              </template>
            </Table>
            <div class="overdue" v-if="countryCode == 'DE' && annalsDeData.length > 0">
              <div class="info">
                <img src="@/assets/images/common/prompt.svg" alt="" />
                <!-- <img src="@/assets/images/common/rb.svg"
                     alt=""> -->
                <p>温馨提示：请于2021年7月26日前提交德国2020年年报，逾期提交会产生滞纳金且导致店铺被关；</p>
              </div>
            </div>
          </div>
          <annalsDE
            v-if="showDEannals"
            :workId="workId"
            :serviceId="serviceId"
            :baseData="baseDataDe"
            :isDetails="isDetails"
            :detailsReturnData="detailsReturnData"
            @back="goBack"
          ></annalsDE>
        </div>
        <div v-if="tabIndex == 1" class="processContent">
          <process-status
            v-if="JSON.stringify(baseData) != '{}'"
            :countryCode="baseData.countryCode"
            :countryNameZh="baseData.countryNameZh"
            :supplierId="supplierId"
          ></process-status>
        </div>
        <div v-if="tabIndex == 2">
          <registerInfo
            v-if="baseData.productFunctionCode == 5 || baseData.countryCode == 'IOSS'"
            isTaxDetails="true"
          ></registerInfo>
          <turnToAgent v-if="baseData.productFunctionCode == 2"></turnToAgent>
        </div>
      </div>
    </div>
    <UploadBox
      v-if="upload"
      @changeState="changeStates"
      :workId="workId"
      :status="status"
      :serviceId="serviceId"
      :countryCode="baseData.countryCode"
    ></UploadBox>
    <Modal v-model="showDetail" :width="616">
      <div slot="header">
        <span class="modal-title">报税信息</span>
      </div>
      <p class="modal-title">报税信息</p>
      <div v-if="JSON.stringify(taxDetailInfo) != '{}'">
        <Row>
          <Col span="12" v-if="baseData.countryCode === 'IOSS'">
            <span class="tax-info-name">IOSS税号</span>
            <span class="tax-info-value">{{ taxDetailInfo.iossNumber || '暂无' }}</span>
          </Col>
          <Col span="12" v-else>
            <span class="tax-info-name">VAT税号</span>
            <span class="tax-info-value">{{ taxDetailInfo.vatTaxNumber || '暂无' }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">含税销售额</span>
            <span class="tax-info-value">{{ taxDetailInfo.includTaxPrice || '暂无' }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">报税区间</span>
            <span class="tax-info-value">
              {{ taxDetailInfo.beginTime.slice(0, 7) }}至{{ taxDetailInfo.endTime.slice(0, 7) }}
            </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">不含税销售额</span>
            <span class="tax-info-value">{{ taxDetailInfo.excludeTaxPrice || '暂无' }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">抵扣总金额</span>
            <span class="tax-info-value">{{ taxDetailInfo.deductionPrice || '暂无' }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">销项税金</span>
            <span class="tax-info-value">{{ taxDetailInfo.taxAmtTotal || '暂无' }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">最终缴纳金额</span>
            <span class="tax-info-value">{{ taxDetailInfo.allTaxPrice || '暂无' }}</span>
          </Col>
          <Col span="12" v-if="taxDetailInfo.declareRule != 2">
            <span class="tax-info-name">亚马逊销售文件</span>
            <span class="tax-info-value" v-if="taxDetailInfo.sellFile != ''">
              <img src="@/assets/images/common/downloadImg.png" alt="" />
              <a
                :href="
                  taxDetailInfo.sellFile.slice(0, 5) == 'http:'
                    ? taxDetailInfo.sellFile.slice(0, 4) + 's' + taxDetailInfo.sellFile.slice(4)
                    : taxDetailInfo.sellFile
                "
              >
                点击下载
              </a>
            </span>
            <span v-else>暂无</span>
          </Col>
          <Col v-else>
            <span class="tax-info-name">截图凭证</span>
            <span class="tax-info-value" v-if="taxDetailInfo.taxCertificate != ''">
              <a
                :href="
                  taxDetailInfo.taxCertificate.slice(0, 5) == 'http:'
                    ? taxDetailInfo.taxCertificate.slice(0, 4) + 's' + taxDetailInfo.taxCertificate.slice(4)
                    : taxDetailInfo.taxCertificate
                "
                target="_blank"
              >
                点击查看
              </a>
              <img src="@/assets/images/user/modifyBlue.png" alt="" class="editor" @click="uploadFile(taxDetailInfo)" />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span="12" v-if="taxDetailInfo.declareRule != 2">
            <span class="tax-info-name">缴税凭证</span>
            <span class="tax-info-value" v-if="taxDetailInfo.taxCertificate != ''">
              <a
                v-for="(item, index) in taxCertificateList"
                :key="index"
                :href="item.slice(0, 5) == 'http:' ? item.slice(0, 4) + 's' + item.slice(4) : item"
                :style="{ marginRight: index == taxCertificateList.length - 1 ? '0' : '7px' }"
                target="_blank"
              >
                点击查看
              </a>
            </span>
            <span class="tax-info-value" v-else>暂无</span>
          </Col>
          <Col span="12" v-if="taxDetailInfo.status !== 23 && taxDetailInfo.status !== 24">
            <span class="tax-info-name">税金确认单</span>
            <span class="tax-info-value" v-if="taxDetailInfo.declareRule != 2">
              <a @click="downloadTaxSure">点击查看</a>
            </span>
            <span v-else>暂无</span>
          </Col>
        </Row>
      </div>
      <!-- <div class="country-list" v-if="taxDetailInfo.status != 21">
        <p class="country-list-left">VAT国家（已注册）：</p>
        <p class="country-list-right">
          <span v-for="(item,index) in alist" :key="index">{{ index == alist.length-1? item : item+'、' }}</span>
        </p>
      </div> -->
      <Divider class="detailModal-footer-line" />
      <Table :data="detailData" :columns="detailColumns" border>
        <template slot="deductionType" slot-scope="{ row }">
          <div>
            {{
              row.deductionType === 1
                ? 'C79/88'
                : row.deductionType === 2
                ? '发票抵扣'
                : row.deductionType === 3
                ? '欧盟内采购'
                : row.deductionType === 4
                ? 'B2B发票'
                : '其他'
            }}
          </div>
        </template>
        <template slot="certificateFile" slot-scope="{ row }">
          <div>
            <a v-if="row.deductionFile !== ''" target="_blank" :href="row.deductionFile">{{ row.fileOriginalName }}</a>
          </div>
        </template>
      </Table>
      <Divider />
    </Modal>
    <Modal v-model="showDeclareReceipt" title="申报回执">
      <p style="margin-bottom: 5px">申报回执</p>
      <p v-for="(item, index) in declareReceiptList" :key="index" style="margin-bottom: 5px; margin-left: 32px">
        <a :href="item" target="_blank" style="color: #16ade9">
          <img style="position: relative; top: 3px" src="@/assets/images/survey/uploadBlue.png" alt />
          查看回执
        </a>
      </p>
      <p slot="footer">
        <Button type="primary" @click="showDeclareReceipt = false">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { taxLogDetail, taxInfo, discountList, getTaxBill, downloadAffirm, downloadITReceiptAPI } from '@/api/taxModule';
import {
  isAuthorized,
  taxBureauGetWay,
  authorizeCallback,
  retrievalVAT,
  forms,
} from '@/api/taxBureauService/taxBureauService';
import { annalsDetailDE } from '@/api/annalsDE/index';
import UploadBox from '../components/modalComponents/uploadPay';
import annalsDE from '../computeTax/annalsDe';
import processStatus from '@/views/common/processStatus';
import registerInfo from '../registerInfo/index';
import turnToAgent from '../turnToAgent/index';
export default {
  components: {
    UploadBox,
    annalsDE,
    registerInfo,
    turnToAgent,
    processStatus,
  },
  data() {
    return {
      contentStyleObj: {
        height: '',
      },
      showDeclareReceipt: false,
      declareReceiptList: [],
      taxCertificateList: [],
      workNumber: this.$route.query.workNumber,
      serviceId: this.$route.query.serviceId,
      countryCode: this.$route.query.countryCode,
      supplierId: this.$route.query.supplierId,
      detailModel: true,
      baseData: {},
      logData: [],
      tabIndex: 1,
      logColumns: [
        {
          title: '报税次数',
          width: '80',
          align: 'center',
          render(h, params) {
            return h('span', params.index + 1);
          },
        },
        {
          title: '申报区间',
          align: 'center',
          // render(h, params) {
          //   let beginTime = params.row.beginTime.slice(0, 7), endTime = params.row.endTime.slice(0, 7);
          //   return h('span', beginTime + '至' + endTime)
          // },
          slot: 'vatInterval',
          width: 200,
        },
        {
          title: '状态',
          align: 'center',
          minWidth: 100,
          render(h, params) {
            let num = params.row.status,
              status = '';
            switch (num) {
              case 18:
                status = '申报中';
                break;
              case 19:
                status = '未开始';
                break;
              case 20:
                status = '未开始';
                break;
              case 21:
                status = '待申报';
                break;
              case 22:
                status = '待缴纳税金';
                break;
              case 23:
                status = '待审核申报';
                break;
              case 24:
                status = '申报驳回';
                break;
              case 25:
                status = '申报完成';
                break;
              case 26:
                status = '申报失败';
                break;
              case 27:
                status = '申报完成';
                break;
              case 28:
                status = '未开始';
                break;
              case 27:
                status = '转代理中';
                break;
              case 33:
                status = '缴税凭证待审核';
                break;
              case 34:
                status = '缴税凭证被驳回';
                break;
              case 35:
                status = '待上传零申报凭证';
                break;
              case 36:
                status = '待授权海牙认证';
                break;
              case 37:
                status = '海牙认证中';
                break;
              case 38:
                status = '待授权转代理';
                break;
            }
            return h('span', status);
          },
        },
        {
          title: '税率',
          minWidth: 90,
          align: 'center',
          render(h, params) {
            if (params.row.status > 21) {
              return h('span', params.row.taxRate + '%');
            }
          },
        },
        {
          title: '申报规则',
          minWidth: 100,
          align: 'center',
          render(h, params) {
            let num = params.row.declareRule,
              status = '';
            switch (num) {
              case 0:
                status = '目的国';
                break;
              case 1:
                status = '发出国';
                break;
              case 2:
                status = '零申报';
                break;
              case 3:
                status = '有数据申报';
                break;
            }
            return h('span', status);
          },
        },
        {
          title: '缴纳税金',
          align: 'center',
          key: 'allTaxPrice',
          minWidth: 90,
        },
        {
          title: '报税数据',
          align: 'center',
          slot: 'checkTax',
          minWidth: 120,
        },
        {
          title: '申报截止日期',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            let taxDeclarationDeadline = '';
            if (params.row.taxDeclarationDeadline != '') {
              taxDeclarationDeadline = params.row.taxDeclarationDeadline.slice(0, 10);
            }
            return h('span', taxDeclarationDeadline);
          },
        },
        {
          title: '税金到账截止日期',
          align: 'center',
          width: 126,
          render: (h, params) => {
            let taxPaymentDeadline = '';
            if (params.row.taxPaymentDeadline != '') {
              taxPaymentDeadline = params.row.taxPaymentDeadline.slice(0, 10);
            }
            return h('span', taxPaymentDeadline);
          },
        },
        {
          title: '备注',
          align: 'center',
          key: 'remark',
          minWidth: 100,
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operation',
          fixed: 'right',
          minWidth: 220,
        },
      ],
      upload: false,
      fileUpload: this.ImgUrl,
      fileList: [],
      workId: '',
      status: '',
      formsData: '',
      showDetail: false,
      detailData: [],
      detailColumns: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 60,
        },
        {
          title: '抵扣类型',
          align: 'center',
          slot: 'deductionType',
        },
        {
          title: '单据日期',
          align: 'center',
          key: 'billDate',
        },
        {
          title: '抵扣金额',
          align: 'center',
          key: 'deductiontAmt',
        },
        {
          title: '凭证',
          align: 'center',
          slot: 'certificateFile',
        },
      ],
      taxDetailInfo: {},
      annalsDeData: [],
      annalsDeColumns: [
        {
          title: '年度申报时间（年）',
          align: 'center',
          key: 'year',
        },
        {
          title: '年度申报区间',
          align: 'center',
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7);
            let endTime = params.row.endTime.slice(0, 7);
            if (beginTime == '') {
              return h('span', '暂无');
            } else {
              return h('span', beginTime + '至' + endTime);
            }
          },
        },
        {
          title: '状态',
          align: 'center',
          render(h, params) {
            let status = params.row.status;
            if (status == 21) {
              return h('div', [
                h(
                  'span',
                  {
                    style: {
                      color: '#F79728',
                    },
                  },
                  '待申报'
                ),
              ]);
            }
            if (status == 27) {
              return h('div', [
                h(
                  'span',
                  {
                    style: {
                      color: '#16ADE9',
                    },
                  },
                  '申报完成'
                ),
              ]);
            }
          },
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operation',
        },
      ],
      showDEannals: false,
      baseDataDe: {},
      isDetails: false,
      detailsReturnData: {},
      taxPeriodStatus: 0,
    };
  },
  methods: {
    //查看报税详情
    checkTaxDetail(row) {
      this.showDetail = true;
      this.taxDetailInfo = { ...row };
      // console.log(row)
      if (this.taxDetailInfo.taxCertificate != '' && this.taxDetailInfo.taxCertificate.indexOf(';') != -1) {
        this.taxCertificateList = this.taxDetailInfo.taxCertificate.split(';');
      } else {
        this.taxCertificateList[0] = this.taxDetailInfo.taxCertificate;
      }
      discountList({ workOrderId: row.id }).then((res) => {
        if (res.code === 0) {
          this.detailData = res.data;
        }
      });
    },
    uploadTaxDeclareReceipt(row) {
      if (row.declareReceipt.split(';').length > 1) {
        this.declareReceiptList = row.declareReceipt.split(';');
        for (let i = 0; i < this.declareReceiptList.length; i++) {
          if (this.declareReceiptList[i].slice(0, 5) == 'http:') {
            this.declareReceiptList[i] =
              this.declareReceiptList[i].slice(0, 4) + 's' + this.declareReceiptList[i].slice(4);
          }
        }
        this.showDeclareReceipt = true;
      } else if (row.declareReceipt.split(';').length == 1) {
        let url = row.declareReceipt;
        if (url.slice(0, 5) == 'http:') url = url.slice(0, 4) + 's' + url.slice(4);
        window.open(url);
      } else {
        this.$Modal.info({
          title: '暂无回执',
          content: '由于税局系统报税较多，下发回执会稍有延迟， 请耐心等待...',
        });
      }
    },
    //屏幕高度
    getHeight() {
      // debugger;
      this.contentStyleObj.height = window.screen.height + 'px';
    },
    getLink(row) {
      if (row.status > 21) {
        forms({
          // servicesId: row.orderServicesId,
          workOrderId: row.id,
        }).then((res) => {
          if (res.code === 0) {
            window.open(res.data);
          }
        });
      }
    },
    changeState(val) {
      let obj = {
        state: val,
      };
      this.$emit('changeState', obj);
    },
    // 下载税金单
    uploadTaxBill(row) {
      if (row.countryCode == 'ES' && this.baseData.supplierId == '43') {
        this.$Modal.confirm({
          title: '温馨提示',
          content:
            '支付税金一定要按照税金单的银行信息来支付（如果您是之前已经申报过的客户，因银行账户更改，请您按照现在最新的税金单上的银行信息支付）',
          onOk: () => {
            getTaxBill({ workOrderId: row.id }).then((res) => {
              if (res.code == 0) {
                let url = res.data;
                if (url.slice(0, 5) == 'http:') {
                  url = url.slice(0, 4) + 's' + url.slice(4);
                }
                window.open(url);
              }
            });
          },
        });
      } else {
        getTaxBill({ workOrderId: row.id }).then((res) => {
          if (res.code == 0) {
            let url = res.data;
            if (url.slice(0, 5) == 'http:') {
              url = url.slice(0, 4) + 's' + url.slice(4);
            }
            window.open(url);
          }
        });
      }
    },
    handleSuccess(res, file, fileList, row) {
      this.fileList = fileList;
    },
    handleBeforeUpload() {
      const check = this.fileList.length < 2;
      if (!check) {
        this.$Notice.warning({
          title: '最多上传两张图片',
        });
      }
      return check;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg、jpeg、png',
      });
    },
    handleRemoveFile(file, fileList, row) {
      this.fileList = fileList;
    },
    getInfo() {
      var that = this;
      taxLogDetail({ servicesId: this.serviceId }).then((res) => {
        if (res.code === 0) {
          res.data.forEach((element) => {
            if (element.taxPeriodStatus === 1) {
              this.taxPeriodStatus = 1;
            }
          });
          this.logData = res.data;
        }
      });
      taxInfo({ id: this.serviceId }).then((res) => {
        if (res.code === 0) {
          that.baseData = res.data;
        }
      });
    },
    changeStates(obj) {
      this.upload = obj.state;
    },
    uploadFile(row) {
      this.status = row.status;
      if (row.status == 21 || row.status == 24) {
        if (row.countryCode === 'GB') {
          this.authorization(row);
        } else {
          this.$router.push({
            path: '/computedTax',
            query: {
              servicesId: row.orderServicesId,
              countryCode: row.countryCode,
              periodType: row.declarePeriod,
              vatTaxNumber: row.vatTaxNumber,
              beginTime: row.beginTime,
              endTime: row.endTime,
              workId: row.id,
            },
          });
        }
      } else if (
        row.status == 22 ||
        row.status == 25 ||
        row.status == 26 ||
        row.status == 27 ||
        row.status == 34 ||
        row.status == 35
      ) {
        this.upload = true;
        this.workId = row.id;
      }
    },
    authorization(row) {
      var that = this;
      var vatTaxNumber = row.vatTaxNumber;
      isAuthorized({
        vatTaxNumber: vatTaxNumber,
        // serviceId: row.orderServicesId,
        workOrderId: row.id,
      })
        .then((res) => {
          if (res.data) {
            row.from = 'fromRedBtn';
            this.$store.commit('getDeclareInfo', row);
            window.sessionStorage.setItem('DeclareInfoGB', JSON.stringify(row));
            this.$router.push({
              path: '/filingData',
              query: {
                index: 0,
                workId: row.id,
              },
            });
            that.changeState(false);
          } else {
            // that.taxBureauGetWayFun(row)
            that.$Message.error('您还没授权，请联系客服进行授权');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 税局getway授权
    taxBureauGetWayFun(row) {
      taxBureauGetWay({
        vatTaxNumber: row.vatTaxNumber,
        serviceId: row.id,
      })
        .then((res) => {
          localStorage.setItem('allowAuthorized', Boolean(true));
          window.location.href = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取德国年报数据
    getDEannals() {
      annalsDetailDE({ servicesId: this.serviceId }).then((res) => {
        if (res.code === 0) {
          this.annalsDeData = res.data;
        }
      });
    },
    goAnnalsDE(row, type) {
      this.showDEannals = true;
      this.workId = row.id;
      this.isDetails = type;
      let beginTime = '';
      if (this.baseData.productFunctionCode == 5 || (this.baseData.productFunctionCode == 2 && row.beginTime)) {
        beginTime = row.beginTime.slice(0, 7);
      }
      let endTime = row.endTime.slice(0, 7);
      this.baseDataDe = {
        companyName: this.baseData.companyName,
        companyNameEn: this.baseData.companyNameEn,
        vatTaxNumber: this.baseData.vatTaxNumber,
        year: row.year,
        time: beginTime + '至' + endTime,
        endTime: endTime,
        beginTime: beginTime,
        productFunctionCode: this.baseData.productFunctionCode,
        declareReceipt: row.declareReceipt,
      };
      this.detailsReturnData = {
        excludeTaxPrice: row.excludeTaxPrice,
        deductionPrice: row.deductionPrice,
        allTaxPrice: row.allTaxPrice,
      };
    },
    goBack() {
      this.showDEannals = false;
      this.getDEannals();
    },
    downloadTaxSure() {
      downloadAffirm({ workOrderId: this.taxDetailInfo.id }).then((res) => {
        if (res.code === 0) {
          window.open(res.data);
        }
      });
    },
    //意大利申报回执下载
    uploadITdeclare(row) {
      downloadITReceiptAPI({ workOrderId: row.id }).then((res) => {
        if (res.code == 0) {
          if (res.data !== '') {
            window.open(res.data);
          } else {
            this.$Modal.confirm({
              title: '暂无回执',
              content: '<p>由于税局系统报税较多，下发回执会稍有延迟，请耐心等待...</p>',
              onOk: () => {},
              onCancel: () => {},
            });
          }
        }
      });
    },
  },
  created() {
    this.getHeight();
    this.getInfo();
    if (this.countryCode == 'DE') {
      this.getDEannals();
    }
    if (this.countryCode == 'IOSS') {
      this.logColumns.splice(3, 1);
    }
  },
};
</script>
<style lang="less" scoped>
.country-list {
  display: flex;
  margin-top: 5px;
  .country-list-left {
    width: 176px;
  }
}
/deep/ .ivu-table-tip {
  overflow-x: auto;
}
/deep/ .ivu-table-tbody {
  background-color: #fff;
}
/deep/ .ivu-table-cell {
  white-space: nowrap;
}
a {
  color: #16ade9;
  font-size: 12px;
}
.container {
  min-height: calc(100vh - 60px);
}
.taxBox {
  font-size: 12px;
  .topTaxBoxContainer {
    background: #ffffff;
    padding: 24px 24px 0px 24px;
    .top {
      margin-bottom: 16px;
      font-size: 14px;
      /deep/ .ivu-breadcrumb {
        font-size: 14px !important;
      }
    }
  }
  .page-title {
    span.title {
      font-size: 24px;
      font-family: 'Microsoft Yahei', 'PingFangSC-Semibold,PingFang SC';
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 22px;
    }
    span.country {
      font-size: 14px;
      font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
    margin-bottom: 25px;
  }
  .tabBoxContainer {
    margin: 20px;
    .processContent {
      margin-top: 24px;
    }
    /deep/ .contentContainer {
      margin: 0px;
    }
    .vatIntervalBox {
      width: 100%;
      position: relative;
      min-height: 40px;
      line-height: 40px;
      img {
        position: absolute;
        right: -10px;
        top: 0px;
        width: 39px;
      }
    }
    .overdue {
      .info {
        background: #fff1dd;
        margin-top: 18px;
        padding: 10px 12px;
        display: flex;
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 26px;
        position: relative;
        p {
          padding-left: 20px;
        }
        img {
          position: absolute;
          top: 14px;
        }
      }
    }
  }
  .tab-box {
    // margin-top: 30px;
    span {
      display: inline-block;
      font-size: 14px;
      font-family: 'Microsoft Yahei', PingFangSC;
      color: #333333;
      line-height: 35px;
      margin-right: 46px;
      cursor: pointer;
    }
    .active-tab {
      color: #1890ffff;
      border-bottom: 2px solid #1890ffff;
    }
  }
  .tax-title {
    // margin: 0 0 24px 0;
    padding: 11px 0px;
    // background-color: #d6e8fd;
    font-size: 18px;
    font-family: 'Microsoft Yahei', 'PingFangSC-Medium,PingFang SC';
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    .red {
      color: #ef5757;
      font-size: 14px;
      margin-left: 16px;
    }
    .black {
      color: #333;
      font-size: 14px;
    }
  }
}
.tax-info-name {
  display: inline-block;
  font-size: 14px;
  font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  margin-right: 10px;
}
.tax-info-value {
  font-size: 14px;
  font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
  a {
    color: #16ade9;
  }
  img {
    vertical-align: middle;
    // margin-right: 5px;
    width: 18px;
  }
  .editor {
    cursor: pointer;
  }
}
.baseInfo {
  margin: 22px 0 12px 0;
}
.upload {
  vertical-align: middle;
  color: #16ade9;
  font-size: 12px;
  cursor: pointer;
  img {
    vertical-align: middle;
    width: 18px;
    height: 18px;
  }
}
.footer {
  text-align: center;
  padding: 26px 0;
}
.uploadFile {
  text-align: center;
  .uploadBtn {
    width: 350px;
  }
}
&/deep/ .ivu-modal-header-inner {
  color: #303033 !important;
}
&/deep/.ivu-table th {
  background-color: #d6e8fd;
  font-weight: 400;
  font-family: 'MicrosoftYaHei';
}
&/deep/ .ivu-table {
  overflow: auto;
  font-size: 12px;
  color: #626266;
}
&/deep/ .ivu-modal {
  width: 750px;
}
/deep/ .ivu-col-span-12 {
  line-height: 26px;
}
/deep/ .ivu-table th {
  background-color: #d6e8fd;
}
/deep/ .ivu-table th {
  border-bottom: none;
  font-size: 12px;
  font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 14px;
}
/deep/ .ivu-table td {
  font-size: 12px;
  font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
/deep/ .submitModal-footer-line {
  margin: 40px 0;
}
/deep/ .ivu-row {
  margin-bottom: 8px;
}
/deep/ .checkTax {
  vertical-align: middle;
  color: #16ade9;
  font-size: 12px;
  cursor: pointer;
  img {
    vertical-align: middle;
  }
}
.modal-title {
  font-size: 14px;
  font-family: 'Microsoft Yahei', PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  line-height: 14px;
  margin-bottom: 24px;
}
.detailModal-footer-line {
  margin-top: 10px;
}
/deep/ .ivu-modal-header {
  display: none;
}
.operation-box {
  span {
    font-size: 14px;
    margin-right: 12px;
    img {
      vertical-align: middle;
      margin-right: 2px;
    }
  }
}

/deep/ .infoTip {
  display: none;
}
/deep/ .typeTitle,
/deep/ .wramTip {
  display: none;
}
/deep/ .container {
  padding: 0px;
  margin: 0px !important;
}
</style>
