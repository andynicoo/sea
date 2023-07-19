<template>
  <div class="container" :style="contentStyleObj">
    <div class="commontitle">VAT申报</div>
    <div class="infoTb">
      <div class="clearfix title_wait">
        <div class="flex content">
          <Form :model="taxForm" :label-width="70" style="width: 100%" label-position="left" inline ref="taxForm">
            <FormItem prop="companyName" label="公司名称">
              <AutoComplete
                v-model="taxForm.companyName"
                clearable
                :data="companyNameSearhList"
                placeholder="请输入公司名称"
                style="width: 180px"
              ></AutoComplete>
            </FormItem>
            <FormItem prop="taxNumber" label="VAT税号" style="margin-left: 32px">
              <Input v-model="taxForm.taxNumber" style="width: 180px" placeholder="请输入VAT税号"></Input>
            </FormItem>
            <FormItem style="margin-left: 32px" label="申报国家" prop="country">
              <Select v-model="taxForm.country" filterable clearable style="width: 180px" placeholder="请选择申报国家">
                <Option :value="v.countryCode" v-for="(v, i) in countryList" :key="i">{{ v.countryNameZh }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" style="margin-left: -50px" @click="searchBtn()" class="searchBtn">搜索</Button>
              <Button @click="handleReset('taxForm')" class="resetBtn">重置</Button>
            </FormItem>
            <FormItem label="服务状态" :label-width="80" style="display: block; margin-top: 15px">
              <RadioGroup v-model="taxForm.serviceStatus" @on-change="changeServiceStatus">
                <Radio
                  v-for="(item, index) in serviceStatusList"
                  :label="item.value"
                  class="statusStyle"
                  :key="index"
                  border
                >
                  {{ item.label }}
                </Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </div>
        <div class="tabs-box">
          <div :class="statusIndex == 'undefined' ? 'active' : ''" @click="changeStatus('undefined')">
            全部
            <span class="huibiao" v-if="taxListStatics.taxTotalCount > 0">{{ taxListStatics.taxTotalCount }}</span>
          </div>
          <div :class="statusIndex == 10 ? 'active' : ''" @click="changeStatus(10)">
            待提交申报
            <span class="huibiao" v-if="taxListStatics.uploadCount > 0">{{ taxListStatics.uploadCount }}</span>
          </div>
          <div :class="statusIndex == 11 ? 'active' : ''" @click="changeStatus(11)">
            待审核申报
            <span class="huibiao" v-if="taxListStatics.auditCount > 0">{{ taxListStatics.auditCount }}</span>
          </div>
          <div :class="statusIndex == 12 ? 'active' : ''" @click="changeStatus(12)">
            申报中
            <span class="huibiao" v-if="taxListStatics.taxIngCount > 0">{{ taxListStatics.taxIngCount }}</span>
          </div>
          <div :class="statusIndex == 13 ? 'active' : ''" @click="changeStatus(13)">
            待缴纳税金
            <span class="huibiao" v-if="taxListStatics.paymentCount > 0">{{ taxListStatics.paymentCount }}</span>
          </div>
          <div :class="statusIndex == 14 ? 'active' : ''" @click="changeStatus(14)">
            待审核税金
            <span class="huibiao" v-if="taxListStatics.paymentAuditCount > 0">
              {{ taxListStatics.paymentAuditCount }}
            </span>
          </div>
          <div :class="statusIndex == -1 ? 'active' : ''" @click="changeStatus(-1)">
            申报完成
            <span class="huibiao" v-if="taxListStatics.taxCompleteCount > 0">
              {{ taxListStatics.taxCompleteCount }}
            </span>
          </div>
        </div>
      </div>
      <div class>
        <div class="tbNull">
          <Table  :loading="loading" style="min-height: 184px" :no-data-text="nodatas" :columns="columns1" :data="registerList">
            <template slot="status" slot-scope="{ row }">
              <span>
                {{ statusList[row.status] }}
              </span>
            </template>
            <template slot="declareData" slot-scope="{ row }">
              <span v-if="row.status === 10">无</span>
              <span v-else class="blue flex-center" style="cursor: pointer" @click="checkTaxDetail(row)">
                <img src="@/assets/images/common/searchIcon.png" />
                点击查看
              </span>
            </template>
            <template slot="operate" slot-scope="{ row }">
              <div class="operate">
                <Button
                  class="btF upload-btn"
                  type="text"
                  v-if="!row.isProcess && ['GB', 'DE'].includes(row.countryCode) && row.responseStatus === 'WAIT'"
                  @click="checkDeclareProgress"
                >
                  <img src="@/assets/images/survey/uploadBlue.png" alt />
                  查看申报进度
                </Button>
                <span v-if="!row.isProcess && row.countryCode === 'GB' && row.status === 10">
                  <Button type="text" @click.stop="authorization(row)" class="btF flex-center">
                    <img src="@/assets/images/survey/uploadYellow.png" alt />
                    提交申报数据
                    <span v-if="row.responseStatus === 'FAIL'">
                      <Tooltip placement="top" :content="row.responseMessage" transfer>
                        <Icon type="md-alert" color="#f59a23" size="18" />
                      </Tooltip>
                    </span>
                  </Button>
                </span>
                <span v-else-if="row.status === 18">
                  <Button type="text" @click.stop="toRegister(row.status, row)" class="btF btn-red flex-center">
                    <Icon type="ios-list-box-outline" />
                    查看驳回原因
                  </Button>
                </span>
                <span v-else-if="row.status === 19">
                  <Button type="text" @click.stop="toRegister(row.status, row)" class="btF btn-red flex-center">
                    <Icon type="ios-list-box-outline" />
                    查看驳回原因
                  </Button>
                </span>
                <span v-else>
                  <Button
                    @click.stop="toRegister(row.status, row)"
                    class="btF flex-center"
                    type="text"
                    v-if="[13, 18, 19, 10].includes(row.status)"
                  >
                    <img src="@/assets/images/survey/uploadYellow.png" alt />
                    {{
                      row.status == 13
                        ? '上传缴税凭证'
                        : row.status == 18
                        ? '提交申报数据'
                        : row.status == 19
                        ? '上传缴税凭证'
                        : row.status == 10
                        ? '提交申报数据'
                        : ''
                    }}
                    <span v-if="[10, 18].includes(row.status) && row.responseStatus === 'FAIL'">
                      <Tooltip placement="top" content="传输税局失败，请重新提交" transfer>
                        <Icon type="md-alert" color="#f59a23" size="18" />
                      </Tooltip>
                    </span>
                  </Button>
                </span>
                <Button class="btF upload-btn" type="text" v-if="row.status == 13" @click="uploadTaxBill(row)">
                  <img src="@/assets/images/survey/uploadBlue.png" alt />
                  下载税金单
                </Button>

                <Button
                  class="btF upload-btn"
                  type="text"
                  @click="uploadReceipt(row)"
                  v-if="row.status == 16 && !row.isProcess && row.countryCode == 'GB' && !row.declMethod && !row.declareReceipt"
                >
                  <img src="@/assets/images/survey/uploadBlue.png" alt />
                  查看回执
                </Button>
                <Button
                  class="btF upload-btn"
                  type="text"
                  @click="uploadTaxDeclareReceipt(row)"
                  v-else-if="row.status == 16 && row.declareReceipt"
                >
                  <img src="@/assets/images/survey/uploadBlue.png" alt />
                  查看回执
                </Button>

                <Button
                  class="btF upload-btn"
                  type="text"
                  @click="onlinePayTax(row)"
                  v-if="
                    row.status === 13 &&
                    row.payStatus === 0 &&
                    row.allTaxPrice > 0 &&
                    ((row.countryCode == 'GB' && row.showPayment) || row.countryCode == 'DE')
                  "
                >
                  在线缴税
                </Button>

                <Button
                  class="btF upload-btn"
                  type="text"
                  @click="showPayProcessModal(row)"
                  v-if="row.status === 13 && (row.payStatus === 1 || row.payStatus === 2 || row.payStatus === 3)"
                >
                  查缴税进度
                </Button>
              </div>
            </template>
          </Table>
        </div>
        <div class="pageSetion clearfix">
          <Page
            class="pagination"
            :current="taxForm.page"
            :total="registerListTotal"
            @on-change="registerChangePageHandler"
            @on-page-size-change="registerPageSizeChangeHandler"
            :page-size="taxForm.limit"
          />
        </div>
      </div>
    </div>
    <Modal v-model="showDetail" :width="900" class="declare-data-modal">
      <div slot="header">
        <span class="modal-title">报税信息</span>
      </div>
      <div v-if="JSON.stringify(detailData) != '{}'">
        <template v-if="taxDetailInfo.countryCode == 'GB' || europeanUnion">
          <div class="declare-detail-wrap">
            <Row>
              <Col span="12">
                <span class="tax-info-name">VAT税号</span>
                <span class="tax-info-value">{{ detailData.vatTaxNumber }}</span>
              </Col>
              <Col span="12">
                <span class="tax-info-name">周期类型</span>
                <span class="tax-info-value">
                  {{
                    detailData.declarePeriod == 0
                      ? '月报'
                      : detailData.declarePeriod == 1
                      ? '季报'
                      : detailData.declarePeriod == 2
                      ? '年报'
                      : ''
                  }}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <span class="tax-info-name">报税周期</span>
                <span class="tax-info-value">
                  {{ detailData.beginTime && detailData.beginTime.slice(0, 7) }} 至
                  {{ detailData.endTime && detailData.endTime.slice(0, 7) }}
                </span>
              </Col>
              <Col span="12">
                <span class="tax-info-name">税率</span>
                <span class="tax-info-value">
                  {{ detailData.taxRate ?  (detailData.taxRate + '%') : detailData.taxRate}}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <span class="tax-info-name">报税方式</span>
                <span class="tax-info-value">
                 {{ detailData.declareRule == 1 ? '有数据' : '零申报' }}
                </span>
              </Col>
            </Row>
          </div>

          <template v-if="taxDetailInfo.countryCode == 'GB'">
            <div class="declare-detail-wrap">
              <p>汇总数据</p>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">未代扣代缴不含税销售额</span>
                  <span class="tax-info-value">￡ &nbsp; {{ detailData.excludeTaxPrice | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">平台已代扣代缴不含税销售额</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.agentTaxPrice | formatQianFenWei }} </span>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">销项税金</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.taxAmtTotal | formatQianFenWei }} </span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">进项税金</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.inputTax | formatQianFenWei }} </span>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <span class="tax-info-name">出口不含税销售额</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.exportExclTaxAmount | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">0税率供应不含税销售额</span>
                  <span class="tax-info-value">
                     ￡ &nbsp; {{ detailData.supplySalesExcludeTaxAmount | formatQianFenWei }}
                  </span>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <span class="tax-info-name">PVA金额</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.discountAmount | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name" style="font-weight: 800">最终应缴税金</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.allTaxPrice | formatQianFenWei }} </span>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <span class="tax-info-name">税金确认单</span>
                  <span class="tax-info-value" v-if="detailData.declareRule != 0">
                    <a @click="downloadTaxSure">点击查看</a>
                  </span>
                  <span v-else>暂无</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">缴税凭证</span>
                  <span class="tax-info-value">
                    <a
                      v-if="taxDetailInfo.taxCertificate"
                      :href="
                        taxDetailInfo.taxCertificate.slice(0, 5) == 'http:'
                          ? taxDetailInfo.taxCertificate.slice(0, 4) + 's' + taxDetailInfo.taxCertificate.slice(4)
                          : taxDetailInfo.taxCertificate
                      "
                      target="_blank"
                    >
                      点击查看
                    </a>
                    <span v-else>暂无</span>
                  </span>
                </Col>
              </Row>
            </div>

            <div class="declare-detail-wrap">
              <p>亚马逊</p>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">亚马逊未代扣代缴不含税销售额</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.awsHandExcludeTaxSales | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">亚马逊销售文件</span>
                  <span class="tax-info-value" v-if="detailData.sellFile">
                    <img
                      src="@/assets/images/common/downloadImg.png"
                      alt=""
                      style="width: 20px; position: relative; top: 4px"
                    />
                    <a
                      :href="
                        detailData.sellFile.slice(0, 5) == 'http:'
                          ? detailData.sellFile.slice(0, 4) + 's' + detailData.sellFile.slice(4)
                          : detailData.sellFile
                      "
                    >
                      点击下载
                    </a>
                  </span>
                  <span v-else>暂无</span>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">亚马逊已代扣代缴不含税销售额</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.awsExcludeTaxSales | formatQianFenWei }} </span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">亚马逊出口不含税销售额</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.exportExcludeTaxSales | formatQianFenWei }} </span>
                </Col>
              </Row>
            </div>

            <div class="declare-detail-wrap">
              <p>其他平台</p>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">其他平台未代扣代缴不含税销售额</span>
                  <span class="tax-info-value"> ￡ &nbsp; {{ detailData.handExIncludeTaxSales | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">其他平台销售文件</span>
                  <span class="tax-info-value" v-if="detailData.otherSaleFileUrl">
                    <img
                      src="@/assets/images/common/downloadImg.png"
                      alt=""
                      style="width: 20px; position: relative; top: 4px"
                    />
                    <a
                      :href="
                        detailData.otherSaleFileUrl.slice(0, 5) == 'http:'
                          ? detailData.otherSaleFileUrl.slice(0, 4) + 's' + detailData.otherSaleFileUrl.slice(4)
                          : detailData.otherSaleFileUrl
                      "
                    >
                      点击下载
                    </a>
                  </span>
                  <span v-else>暂无</span>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">其他平台已代扣代缴不含税销售额</span>
                  <span class="tax-info-value">
                    ￡ &nbsp;  {{ detailData.handExPlatformWithHoldandRemitTax | formatQianFenWei }}
                  </span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">其他平台出口不含税销售额</span>
                  <span class="tax-info-value"> ￡ &nbsp;  {{ detailData.otherExIncludeTaxAmt | formatQianFenWei }} </span>
                </Col>
              </Row>
            </div>
          </template>

          <template v-if="europeanUnion">
            <template v-if="detailData.declareRule == 1">
            <div class="declare-detail-wrap">
              <p>汇总数据</p>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">平台未代扣代缴不含税销售额</span>
                  <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.noPayExcludeTaxSales | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">平台已代扣代缴不含税销售额</span>
                  <span class="tax-info-value"> {{ getUnit }} &nbsp; {{ detailData.paidExcludeTaxSales | formatQianFenWei }} </span>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">销项税金</span>
                  <span class="tax-info-value"> {{ getUnit }} &nbsp; {{ detailData.taxAmtTotal | formatQianFenWei }} </span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">进项税金</span>
                  <span class="tax-info-value"> {{ getUnit }}  &nbsp; {{ detailData.inputTax | formatQianFenWei }} </span>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <span class="tax-info-name">出口不含税销售额</span>
                  <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.exportExclTaxAmount | formatQianFenWei }}</span>
                </Col>
                <Col span="12" v-if="['IT', 'NL', 'ES', 'FR'].includes(taxDetailInfo.countryCode)">
                  <span class="tax-info-name">本国B2B0税率供应不含税销售额</span>
                  <span class="tax-info-value">
                    {{ getUnit }} &nbsp;  {{ detailData.homeCountryB2bSupplySalesExcludeTaxAmount | formatQianFenWei }}
                  </span>
                </Col>
              </Row>

              <Row v-if="taxDetailInfo.countryCode == 'DE'">
                <Col span="12">
                  <span class="tax-info-name">欧盟内免税收购项金额</span>
                  <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.eurOtherEcAcqPrice | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">欧盟内免税采购项金额</span>
                  <span class="tax-info-value"> {{ getUnit }} &nbsp; {{ detailData.freePurchasePrice | formatQianFenWei }} </span>
                </Col>
              </Row>

              <Row v-if="taxDetailInfo.countryCode == 'ES'">
                <Col span="12">
                  <span class="tax-info-name">ECL销售项金额</span>
                  <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.eclSalePrice | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">ECL采购项金额</span>
                  <span class="tax-info-value"> {{ getUnit }} &nbsp; {{ detailData.eclPurchasePrice | formatQianFenWei }} </span>
                </Col>
              </Row>

              <Row v-if="taxDetailInfo.countryCode == 'FR'">
                <Col span="12">
                  <span class="tax-info-name">进口递延应税金额</span>
                  <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.taxableAmount | formatQianFenWei }}</span>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <span class="tax-info-name">欧盟内跨境B2B不含税销售额</span>
                  <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.eurB2bExcludeTaxSales | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">最终应缴税金</span>
                  <span class="tax-info-value"> {{ getUnit }} &nbsp; {{ detailData.allTaxPrice | formatQianFenWei }} </span>
                </Col>
              </Row>

              <Row>
                <Col span="12">
                  <span class="tax-info-name">税金确认单</span>
                  <span class="tax-info-value" v-if="detailData.declareRule != 0">
                    <a @click="downloadTaxSure">点击查看</a>
                  </span>
                  <span v-else>暂无</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">缴税凭证</span>
                  <span class="tax-info-value">
                    <a
                      v-if="taxDetailInfo.taxCertificate"
                      :href="
                        taxDetailInfo.taxCertificate.slice(0, 5) == 'http:'
                          ? taxDetailInfo.taxCertificate.slice(0, 4) + 's' + taxDetailInfo.taxCertificate.slice(4)
                          : taxDetailInfo.taxCertificate
                      "
                      target="_blank"
                    >
                      点击查看
                    </a>
                    <span v-else>暂无</span>
                  </span>
                </Col>
              </Row>
            </div>

            <div class="declare-detail-wrap">
              <p>亚马逊</p>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">亚马逊未代扣代缴不含税销售额</span>
                  <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.awsHandExcludeTaxSales | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">亚马逊销售文件</span>
                  <span class="tax-info-value" v-if="detailData.sellFile">
                    <img
                      src="@/assets/images/common/downloadImg.png"
                      alt=""
                      style="width: 20px; position: relative; top: 4px"
                    />
                    <a
                      :href="
                        detailData.sellFile.slice(0, 5) == 'http:'
                          ? detailData.sellFile.slice(0, 4) + 's' + detailData.sellFile.slice(4)
                          : detailData.sellFile
                      "
                    >
                      点击下载
                    </a>
                  </span>
                  <span v-else>暂无</span>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">亚马逊已代扣代缴不含税销售额</span>
                  <span class="tax-info-value"> {{ getUnit }}  &nbsp; {{ detailData.awsExcludeTaxSales | formatQianFenWei }} </span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">亚马逊出口不含税销售额</span>
                  <span class="tax-info-value"> {{ getUnit }}  &nbsp; {{ detailData.exportExcludeTaxSales | formatQianFenWei }} </span>
                </Col>
              </Row>
            </div>

            <div class="declare-detail-wrap">
              <p>其他平台</p>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">其他平台未代扣代缴不含税销售额</span>
                  <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.handExIncludeTaxSales | formatQianFenWei }}</span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">其他平台销售文件</span>
                  <span class="tax-info-value" v-if="detailData.otherSaleFileUrl">
                    <img
                      src="@/assets/images/common/downloadImg.png"
                      alt=""
                      style="width: 20px; position: relative; top: 4px"
                    />
                    <a
                      :href="
                        detailData.otherSaleFileUrl.slice(0, 5) == 'http:'
                          ? detailData.otherSaleFileUrl.slice(0, 4) + 's' + detailData.otherSaleFileUrl.slice(4)
                          : detailData.otherSaleFileUrl
                      "
                    >
                      点击下载
                    </a>
                  </span>
                  <span v-else>暂无</span>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">其他平台已代扣代缴不含税销售额</span>
                  <span class="tax-info-value">
                    {{ getUnit }} &nbsp; {{ detailData.handExPlatformWithHoldandRemitTax | formatQianFenWei }}
                  </span>
                </Col>
                <Col span="12">
                  <span class="tax-info-name">其他平台出口不含税销售额</span>
                  <span class="tax-info-value"> {{ getUnit }} &nbsp; {{ detailData.otherExIncludeTaxAmt | formatQianFenWei }} </span>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <span class="tax-info-name">其他平台跨境B2B不含税销售额</span>
                  <span class="tax-info-value">
                    {{ getUnit }} &nbsp; {{ detailData.eurOtherB2bExcludeTaxSales | formatQianFenWei }}
                  </span>
                </Col>
              </Row>
            </div>
            </template>
            <template v-else>
              
              <div class="declare-detail-wrap">
                <p>申报数据</p>
                <Row>
                  <Col span="12">
                    <span class="tax-info-name">零申报凭证</span>
            
                      <span class="tax-info-value" v-if="detailData.sellFile">
                        <img
                          src="@/assets/images/common/downloadImg.png"
                          alt=""
                          style="width: 20px; position: relative; top: 4px"
                        />
                        <a
                          :href="
                            detailData.sellFile.slice(0, 5) == 'http:'
                              ? detailData.sellFile.slice(0, 4) + 's' + detailData.sellFile.slice(4)
                              : detailData.sellFile
                          "
                          target="_blank"
                        >
                          点击下载
                        </a>
                      </span>
                      <span v-else>暂无</span>
                    </span>
                  </Col>
                  
                </Row>

                <template v-if="taxDetailInfo.countryCode == 'DE'">
                  <Row>
                    <Col span="12">
                      <span class="tax-info-name">欧盟内免税收购项金额</span>
              
                        <span class="tax-info-value">
                          {{ getUnit }} &nbsp; {{ detailData.otherEcAcqPrice || 0 }}
                      </span>
                    </Col>
                    <Col span="12">
                      <span class="tax-info-name">欧盟内免税收购项文件</span>
              
                        <span class="tax-info-value" v-if="detailData.otherEcAcqPriceFile">
                          <img
                            src="@/assets/images/common/downloadImg.png"
                            alt=""
                            style="width: 20px; position: relative; top: 4px"
                          />
                          <a
                            :href="
                              detailData.otherEcAcqPriceFile.slice(0, 5) == 'http:'
                                ? detailData.otherEcAcqPriceFile.slice(0, 4) + 's' + detailData.otherEcAcqPriceFile.slice(4)
                                : detailData.otherEcAcqPriceFile
                            "
                          >
                            点击下载
                          </a>
                        </span>
                        <span v-else>暂无</span>
                      </span>
                    </Col>
                    
                  </Row>

                  <Row>
                    <Col span="12">
                      <span class="tax-info-name">欧盟内免税采购项金额</span>
              
                        <span class="tax-info-value">
                          {{ getUnit }} &nbsp; {{ detailData.freePurchasePrice || 0 }}
                      </span>
                    </Col>
                    <Col span="12">
                      <span class="tax-info-name">欧盟内免税采购项文件</span>
              
                        <span class="tax-info-value" v-if="detailData.freePurchaseFile">
                          <img
                            src="@/assets/images/common/downloadImg.png"
                            alt=""
                            style="width: 20px; position: relative; top: 4px"
                          />
                          <a
                            :href="
                              detailData.freePurchaseFile.slice(0, 5) == 'http:'
                                ? detailData.freePurchaseFile.slice(0, 4) + 's' + detailData.freePurchaseFile.slice(4)
                                : detailData.freePurchaseFile
                            "
                          >
                            点击下载
                          </a>
                        </span>
                        <span v-else>暂无</span>
                      </span>
                    </Col>
                    
                  </Row>

                  <Row>
                    <Col span="12">
                      <span class="tax-info-name">线下申报数据文件</span>
              
                        <span class="tax-info-value" v-if="detailData.sellOfflineFile">
                          <img
                            src="@/assets/images/common/downloadImg.png"
                            alt=""
                            style="width: 20px; position: relative; top: 4px"
                          />
                          <a
                            :href="
                              detailData.sellOfflineFile.slice(0, 5) == 'http:'
                                ? detailData.sellOfflineFile.slice(0, 4) + 's' + detailData.sellOfflineFile.slice(4)
                                : detailData.sellOfflineFile
                            "
                          >
                            点击下载
                          </a>
                        </span>
                        <span v-else>暂无</span>
                      </span>
                    </Col>
                    
                  </Row>
                </template>

                <template v-if="taxDetailInfo.countryCode == 'ES'">
                  <Row>
                    <Col span="12">
                      <span class="tax-info-name">ECL申报</span>
              
                        <span class="tax-info-value">
                         {{ detailData.isEcl ? '是' : '否' }}
                      </span>
                    </Col>
                  </Row>

                  <Row>
                    <Col span="12">
                      <span class="tax-info-name">ECL销售项金额</span>
              
                      <span class="tax-info-value">
                          {{ getUnit }} &nbsp; {{ detailData.eclSalePrice }}
                      </span>
                    </Col>
                    <Col span="12">
                      <span class="tax-info-name">ECL采购项金额</span>
                      <span class="tax-info-value">
                          {{ getUnit }} &nbsp; {{ detailData.eclPurchasePrice }}
                      </span>
                    </Col>
                    
                  </Row>
                </template>


                <template v-if="taxDetailInfo.countryCode == 'FR'">
                  <Row>
                    <Col span="12">
                      <span class="tax-info-name">是否有法国递延</span>
              
                      <span class="tax-info-value">
                        {{ detailData.frenchDeferredFlag == 1 ? '是' : '否' }}
                      </span>
                    </Col>
                    <Col span="12" v-if="detailData.frenchDeferredFlag == 1">
                      <span class="tax-info-name">法国海关号</span>
                      <span class="tax-info-value">
                        {{ detailData.frenchDeferredDTO.customsNumber }}
                      </span>
                    </Col>
                    
                  </Row>

                  <Row v-if="detailData.frenchDeferredFlag == 1">
                    <Col span="12">
                      <span class="tax-info-name">进口递延开始日期</span>
              
                        <span class="tax-info-value">
                           {{ (detailData.frenchDeferredDTO.startDate || '').split(' ')[0] }}
                      </span>
                    </Col>
                    <Col span="12">
                      <span class="tax-info-name">进口递延应税金额</span>
              
                        <span class="tax-info-value">
                           {{ getUnit }} &nbsp;  {{ detailData.frenchDeferredDTO.taxableAmount }}
                        </span>
                      </span>
                    </Col>
                    
                  </Row>

                  <Row v-if="detailData.frenchDeferredFlag == 1">
                    <Col span="12">
                      <span class="tax-info-name">进口递延文件</span>
              
                        <span class="tax-info-value" v-if="detailData.frenchDeferredDTO.deferredFilePath">
                          <img
                            src="@/assets/images/common/downloadImg.png"
                            alt=""
                            style="width: 20px; position: relative; top: 4px"
                          />
                          <a
                            :href="
                              detailData.frenchDeferredDTO.deferredFilePath.slice(0, 5) == 'http:'
                                ? detailData.frenchDeferredDTO.deferredFilePath.slice(0, 4) + 's' + detailData.frenchDeferredDTO.deferredFilePath.slice(4)
                                : detailData.frenchDeferredDTO.deferredFilePath
                            "
                          >
                            点击下载
                          </a>
                        </span>
                        <span v-else>暂无</span>
                      </span>
                    </Col>
                    
                  </Row>
                </template>

              </div>
            </template>
          </template>
        </template>
        <template v-if="taxDetailInfo.countryCode != 'GB' && !europeanUnion">
          <Row>
            <Col span="12">
              <span class="tax-info-name">VAT税号</span>
              <span class="tax-info-value">{{ detailData.vatTaxNumber }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">含税销售额</span>
              <span class="tax-info-value">{{ detailData.includeTaxPrice }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">报税类型</span>
              <span class="tax-info-value">
                {{
                  detailData.declarePeriod == 0
                    ? '月报'
                    : detailData.declarePeriod == 1
                    ? '季报'
                    : detailData.declarePeriod == 2
                    ? '年报'
                    : ''
                }}
              </span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">不含税销售额</span>
              <span class="tax-info-value">{{ detailData.excludeTaxPrice }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">报税周期</span>
              <span class="tax-info-value">
                {{ detailData.beginTime && detailData.beginTime.slice(0, 7) }} 至
                {{ detailData.endTime && detailData.endTime.slice(0, 7) }}
              </span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">抵扣金额</span>
              <span class="tax-info-value">{{ detailData.deductionPrice }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">销售平台</span>
              <span class="tax-info-value">{{ detailData.salePlatformType == 0 ? '亚马逊' : '' }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">销项税金</span>
              <span class="tax-info-value">{{ detailData.taxAmtTotal }}</span>
            </Col>
          </Row>
          <Row v-if="taxDetailInfo.countryCode != 'SA' && taxDetailInfo.countryCode != 'AE'">
            <Col span="12">
              <span class="tax-info-name">平台代扣代缴金额</span>
              <span class="tax-info-value">{{ detailData.agentTaxPrice }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">B2B不含税销售额</span>
              <span class="tax-info-value">{{ detailData.excludeTaxB2bPrice }}</span>
            </Col>
          </Row>
          <Row v-if="taxDetailInfo.countryCode == 'DE'">
            <Col span="12">
              <span class="tax-info-name">欧盟内免税收购项金额</span>
              <span class="tax-info-value">{{ detailData.otherEcAcqPrice }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">欧盟内免税收购项文件</span>
              <span class="tax-info-value" v-if="detailData.otherEcAcqPriceFile">
                <img
                  src="@/assets/images/common/downloadImg.png"
                  alt=""
                  style="width: 20px; position: relative; top: 4px"
                />
                <a
                  :href="
                    detailData.otherEcAcqPriceFile.slice(0, 5) == 'http:'
                      ? detailData.otherEcAcqPriceFile.slice(0, 4) + 's' + detailData.otherEcAcqPriceFile.slice(4)
                      : detailData.otherEcAcqPriceFile
                  "
                >
                  点击下载
                </a>
              </span>
              <span v-else>暂无</span>
            </Col>
          </Row>
          <Row v-if="taxDetailInfo.countryCode == 'DE'">
            <Col span="12">
              <span class="tax-info-name">欧盟内免税采购项金额</span>
              <span class="tax-info-value">{{ detailData.freePurchasePrice }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">欧盟内免税采购项文件</span>
              <span class="tax-info-value" v-if="detailData.freePurchaseFile">
                <img
                  src="@/assets/images/common/downloadImg.png"
                  alt=""
                  style="width: 20px; position: relative; top: 4px"
                />
                <a
                  :href="
                    detailData.freePurchaseFile.slice(0, 5) == 'http:'
                      ? detailData.freePurchaseFile.slice(0, 4) + 's' + detailData.freePurchaseFile.slice(4)
                      : detailData.freePurchaseFile
                  "
                >
                  点击下载
                </a>
              </span>
              <span v-else>暂无</span>
            </Col>
          </Row>
          <Row v-if="taxDetailInfo.countryCode == 'ES'">
            <Col span="12">
              <span class="tax-info-name">ECL销售项总金额</span>
              <span class="tax-info-value">{{ detailData.eclSalePrice }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">ECL采购项总金额</span>
              <span class="tax-info-value">{{ detailData.eclPurchasePrice }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">最终缴纳税金</span>
              <span class="tax-info-value">{{ detailData.allTaxPrice }}</span>
            </Col>
            <Col span="12" v-if="taxDetailInfo.declareRule != 0">
              <span class="tax-info-name">亚马逊销售文件</span>
              <span class="tax-info-value" v-if="detailData.sellFile">
                <img
                  src="@/assets/images/common/downloadImg.png"
                  alt=""
                  style="width: 20px; position: relative; top: 4px"
                />
                <a
                  :href="
                    detailData.sellFile.slice(0, 5) == 'http:'
                      ? detailData.sellFile.slice(0, 4) + 's' + detailData.sellFile.slice(4)
                      : detailData.sellFile
                  "
                >
                  点击下载
                </a>
              </span>
              <span v-else>暂无</span>
            </Col>
            <Col v-else>
              <span class="tax-info-name">截图凭证</span>
              <span class="tax-info-value" v-if="detailData.sellFile">
                <a
                  :href="
                    detailData.sellFile.slice(0, 5) == 'http:'
                      ? detailData.sellFile.slice(0, 4) + 's' + detailData.sellFile.slice(4)
                      : detailData.sellFile
                  "
                  target="_blank"
                >
                  点击查看
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">缴税凭证</span>
              <span class="tax-info-value">
                <a
                  v-if="taxDetailInfo.taxCertificate"
                  :href="
                    taxDetailInfo.taxCertificate.slice(0, 5) == 'http:'
                      ? taxDetailInfo.taxCertificate.slice(0, 4) + 's' + taxDetailInfo.taxCertificate.slice(4)
                      : taxDetailInfo.taxCertificate
                  "
                  target="_blank"
                >
                  点击查看
                </a>
                <span v-else>暂无</span>
              </span>
            </Col>
            <Col span="12" v-if="detailData.status !== 11 && detailData.status !== 18">
              <span class="tax-info-name">税金确认单</span>
              <span class="tax-info-value" v-if="detailData.declareRule != 0">
                <a @click="downloadTaxSure">点击查看</a>
              </span>
              <span v-else>暂无</span>
            </Col>
            <Col span="12" v-if="taxDetailInfo.countryCode == 'FR'">
              <span class="tax-info-name">是否有法国递延</span>
              <span class="tax-info-value">{{ detailData.frenchDeferredFlag == 1 ? '是' : '否' }}</span>
            </Col>
          </Row>
        </template>

        <!-- <template v-if="detailData.frenchDeferredFlag == 1">
          <Row>
            <Col span="12">
              <span class="tax-info-name">法国海关号</span>
              <span class="tax-info-value">{{ detailData.frenchDeferredDTO.customsNumber }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">进口递延开始日期</span>
              <span class="tax-info-value">{{ (detailData.frenchDeferredDTO.startDate || '').split(' ')[0] }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">进口递延应税金额</span>
              <span class="tax-info-value">{{ detailData.frenchDeferredDTO.taxableAmount }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">进口递延文件</span>
              <span class="tax-info-value">
                <a
                  v-if="detailData.frenchDeferredDTO.deferredFilePath"
                  :href="
                    detailData.frenchDeferredDTO.deferredFilePath.slice(0, 5) == 'http:'
                      ? detailData.frenchDeferredDTO.deferredFilePath.slice(0, 4) +
                        's' +
                        detailData.frenchDeferredDTO.deferredFilePath.slice(4)
                      : detailData.frenchDeferredDTO.deferredFilePath
                  "
                  target="_blank"
                >
                  下载
                </a>
                <span v-else>暂无</span>
              </span>
            </Col>
          </Row>
        </template> -->
      </div>
      <div class="country-list" v-if="alist.length > 0">
        <p class="country-list-left">VAT国家（已注册）：</p>
        <p class="country-list-right">
          <span v-for="(item, index) in alist" :key="index">{{ index == alist.length - 1 ? item : item + '、' }}</span>
        </p>
      </div>
      <Divider class="detailModal-footer-line" />
      <Table :data="detailData.deductionItems" :columns="detailColumns" v-if="this.productFunctionCode !== 23">
        <template slot="deductionType" slot-scope="{ row }">
          <div>
            {{ typeList[row.deductionType] }}
          </div>
        </template>
        <template slot="certificateFile" slot-scope="{ row }">
          <div>
            <a v-if="row.deductionFile !== ''" target="_blank" :href="row.deductionFile">{{ row.fileOriginalName }}</a>
          </div>
        </template>
      </Table>

      <Table
        :columns="returnColumnsOU"
        :data="detailData.declareIossDetailDTOS"
        max-height="300"
        v-if="this.productFunctionCode === 23"
      ></Table>
      <!-- <Table :columns="returnColumnsOU" :data="declareIossDetailDTOS" max-height="300" v-if="this.productFunctionCode === 23"></Table> -->

      <Divider />
    </Modal>
    <Modal v-model="showDeclareReceipt" title="申报回执">
      <p v-for="(item, index) in declareReceiptList" :key="index" style="margin-bottom: 5px; margin-left: 32px">
        <a :href="item" target="_blank" class="btF upload-btn" style="color: #16ade9">
          <img style="position: relative; top: 3px" src="@/assets/images/survey/uploadBlue.png" alt />
          查看回执
        </a>
      </p>
      <p slot="footer">
        <Button type="primary" @click="showDeclareReceipt = false">确认</Button>
      </p>
    </Modal>
    <UploadBox
      v-if="upload"
      @changeState="changeStates"
      :workId="workId"
      :status="status"
      :serviceId="orderId"
    ></UploadBox>
    <StartModal v-if="modalStart" @changeState="getModelStartState" :serviceInfo="serviceInfo"></StartModal>
    <UploadModal
      v-if="modalPay"
      @changeState="getModelPayState"
      :workId="modalPayRowId"
      :serviceId="serviceInfo.serviceId"
      :status="status"
      :detailData="detailData"
      whereKey="filingManagement"
      :countryCode="countryCode"
    ></UploadModal>
    <BuyDeclareModal v-if="modalBuyd" @changeState="getModelBuyState" :sendType="buyType"></BuyDeclareModal>
    <GBtaxDetails
      v-if="showGbTaxDetails"
      @changeState="getTaxModelBuyTax"
      :workNumber="workId"
      :serviceId="orderId"
      :vatTaxNumber="workId"
    ></GBtaxDetails>
    <TaxDetails
      v-if="showTaxDetails"
      @changeState="getTaxModelBuyTax"
      @needVatObligations="needVatObligations"
      :workNumber="workId"
      :serviceId="orderId"
      :countryCode="countryCode"
    ></TaxDetails>
    <submitDeclareEntry
      v-if="showDeclareEntry"
      :DeclareInfo="DeclareInfoGB"
      @changeState="getShowDeclareEntryState"
    ></submitDeclareEntry>

    <Modal v-model="showPayTax" :width="850" class="online-pay-modal">
      <div slot="header">
        <span class="modal-title">在线缴纳税金</span>
      </div>

      <div class="modal-tip">
        <span class="modal-foot-title">
          <Icon class="tip-icon" type="ios-alert" />
          温馨提示：跨境支付是安全便捷的跨境电商收款支付平台合作商
        </span>
      </div>
      <div>
        <template v-if="detailData.countryCode == 'GB'">
          <Row class="mb-15">
            <Col span="8">
              <span class="tax-info-name">VAT税号：</span>
              <span class="tax-info-value">{{ detailData.taxNumber }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">国家：</span>
              <span class="tax-info-value">{{ detailData.countryNameZh }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">报税周期：</span>
              <span class="tax-info-value">
                {{ detailData.beginTime && detailData.beginTime.slice(0, 7) }} 至
                {{ detailData.endTime && detailData.endTime.slice(0, 7) }}
              </span>
            </Col>
          </Row>

          <Row class="mb-15">
            <Col span="8">
              <span class="tax-info-name">平台未代扣代缴不含税销售额：</span>
              <span class="tax-info-value">￡{{ detailData.excludeTaxPrice }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">进项税金：</span>
              <span class="tax-info-value">￡{{ detailData.inputTax }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">销项税金：</span>
              <span class="tax-info-value"> ￡ {{ detailData.taxAmtTotal }} </span>
            </Col>
          </Row>

          <Row class="mb-15">
            <Col span="12">
              <span class="tax-info-name">最终应缴税金：</span>
              <span class="tax-info-value">￡{{ detailData.allTaxPrice }}</span>
            </Col>
          </Row>
        </template>
        <template v-else>
          <Row class="mb-15">
            <Col span="8">
              <span class="tax-info-name">VAT税号：</span>
              <span class="tax-info-value">{{ detailData.taxNumber }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">含税销售额：</span>
              <span class="tax-info-value">{{ detailData.includeTaxPrice }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">不含税销售额：</span>
              <span class="tax-info-value">{{ detailData.excludeTaxPrice }}</span>
            </Col>
          </Row>
          <Row class="mb-15">
            <Col span="8">
              <span class="tax-info-name">抵扣总金额：</span>
              <span class="tax-info-value">{{ detailData.deductionPrice }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">销项税金：</span>
              <span class="tax-info-value">{{ detailData.allTaxPrice }}</span>
            </Col>
            <Col span="8">
              <span class="tax-info-name">国家：</span>
              <span class="tax-info-value">{{ detailData.countryNameZh }}</span>
            </Col>
          </Row>
          <Row class="mb-15">
            <Col span="12">
              <span class="tax-info-name">报税周期：</span>
              <span class="tax-info-value">
                {{ detailData.beginTime && detailData.beginTime.slice(0, 7) }} 至
                {{ detailData.endTime && detailData.endTime.slice(0, 7) }}
              </span>
            </Col>
          </Row>
        </template>
      </div>

      <div class="pay-wrap">
        <p class="pay-wrap-title">支付平台：</p>
        <div :class="['lian-pay', payChannel == 'LIANLIANGLOBAL' ? 'active' : '']" @click="payLian">
          <img src="@/assets/images/sureOrder/lian.png" alt="" />
        </div>
        <!-- <div :class="['air-pay', payChannel == 'AIRWALLEX' ? 'active' : '']" @click="confirmAuth">
          <img src="@/assets/images/sureOrder/air.png" alt="" />
        </div> -->
      </div>

      <div v-if="showMoney">
        <p class="pay-wrap-title">
          钱包余额：
          <!-- <Button type="text" @click="handleMoreMoney" style="color: #57a3f3;">
            <Icon :type="moreMoney ? 'ios-arrow-up' : 'ios-arrow-down'" />
            {{ moreMoney ? "收起" : "更多" }}钱包
          </Button> -->
          {{ authAccount }}
          <span @click="showAccountManage = true">其他账户</span>
        </p>
        <!-- <div class="more-wrap"> -->
        <div class="money-wrap">
          <div
            :class="['money-item', sourceCurrency == item.currency ? 'active' : '']"
            v-for="(item, index) in filterMoney"
            :key="index"
            @click="chooseCurrency(item.currency)"
          >
            <span>{{ item.availableAmount }}</span>
            <span> {{ item.currency }}</span>
          </div>
        </div>
        <Button type="text" @click="handleMoreMoney" style="color: #57a3f3" v-if="moneyList.length">
          <Icon :type="moreMoney ? 'ios-arrow-up' : 'ios-arrow-down'" />
          {{ moreMoney ? '收起' : '更多' }}钱包
        </Button>

        <div class="money-wrap more-wrap">
          <div
            v-show="moreMoney"
            :class="['money-item', sourceCurrency == item.currency ? 'active' : '']"
            v-for="(item, index) in moneyList"
            :key="'moneyList' + index"
            @click="chooseCurrency(item.currency)"
          >
            <span>{{ item.availableAmount }}</span>
            <span> {{ item.currency }}</span>
          </div>
        </div>
      </div>

      <!-- </div> -->

      <div slot="footer">
        <div class="footer-wrap">
          <Button @click="showPayTax = false">取消</Button>
          <Button class="mr-15" type="primary" @click="goPay">确定</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="showPayProcess" :width="550">
      <div slot="header">
        <span>查看支付进度</span>
      </div>

      <div>
        <Row class="mb-15">
          <Col span="10">
            <span class="tax-info-name">VAT税号：</span>
            <span class="tax-info-value">{{ detailData.taxNumber }}</span>
          </Col>
          <Col span="14">
            <span class="tax-info-name">报税区间：</span>
            <span class="tax-info-value">
              {{ detailData.beginTime && detailData.beginTime.slice(0, 7) }} 至
              {{ detailData.endTime && detailData.endTime.slice(0, 7) }}
            </span>
          </Col>
        </Row>
        <Row class="mb-15">
          <Col span="10">
            <span class="tax-info-name">支付平台：</span>
            <span class="tax-info-value">
              {{
                detailData.payPlatform == 'LIANLIANGLOBAL'
                  ? '连连国际'
                  : detailData.payPlatform == 'AIRWALLEX'
                  ? '空中云汇'
                  : ''
              }}
            </span>
          </Col>
          <Col span="14">
            <span class="tax-info-name">支付凭证号：</span>
            <span class="tax-info-value">{{ detailData.paymentOrderNo }}</span>
          </Col>
        </Row>
        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">支付状态：</span>
            <span class="tax-info-value">
              {{
                detailData.payStatus === 1 || detailData.payStatus === 2
                  ? '支付中'
                  : detailData.payStatus === 3
                  ? '支付完成'
                  : ''
              }}
              <img class="refresh" @click="refreshPayProcess" src="@/assets/images/common/refreshBlue.png" alt="" />
            </span>
          </Col>
        </Row>
      </div>

      <div slot="footer">
        <div class="footer-tip">注：在线支付平台缴纳时间3-7天完成缴费，支付完成后请到对应平台下载回执凭证</div>
      </div>
    </Modal>

    <Modal v-model="showAccountName" :width="500" class="account-modal" :closable="false" :mask-closable="false">
      <div slot="header">
        <span>授权账户命名</span>
      </div>

      <div>
        <p class="account-title">
          <img src="@/assets/images/hague/chenggong.png" />
          您已成功授权空中云汇账户！
        </p>
      </div>

      <Form ref="accountForm" :model="accountForm" :rules="ruleAccount" inline class="account-form">
        <FormItem label="为了便于您的多账户管理，请给此账户一个命名：" prop="accountName">
          <Input
            type="text"
            maxlength="50"
            v-model="accountForm.accountName"
            placeholder="请使用自己能够记忆、识别的名称"
          />
        </FormItem>
      </Form>
      <template #footer>
        <Button type="primary" @click="auth">确认</Button>
      </template>
    </Modal>

    <Modal v-model="showAccountManage" :width="650" class="account-manage-modal">
      <div slot="header">
        <span>账户管理</span>
      </div>

      <div>
        <p class="account-manage-title mb-20">已授权的账户余额，可以直接在线缴纳税金</p>
      </div>

      <div class="table-wrap mb-20">
        <Table border :columns="columnsAuth" :data="dataAuth">
          <template #name="{ row, index }">
            <span>{{ index + 1 }}</span>
          </template>
          <!--
          <template #plat="{ row }">
              <span>{{row.authPlatform === 'AIRWALLEX' ? '空中云汇'  : row.authPlatform === 'LIANLIANGLOBAL' ?  '连连国际' : ''}}</span>
          </template> -->

          <template #radio="{ row }">
            <Radio v-model="row.checked"></Radio>
            <div class="radio-wrap" @click="radioChange(row)"></div>
          </template>
          <template #use="{ row }">
            <Radio v-model="row.used"></Radio>
            <div class="radio-wrap" @click="useChange(row)"></div>
          </template>
          <template #action="{ row }">
            <template v-if="(row.checked || row.used) && dataAuth.length != 1">
              <img src="@/assets/images/user/disableCancel.svg" alt="" title="请先调整默认账户和本次使用账户" />
            </template>
            <span @click="unbindCheck(row)" v-else class="blue-font">解除授权</span>
          </template>
        </Table>
      </div>

      <span class="blue-font" @click="addAccount"><Button size="small" icon="md-add"></Button>添加授权账户</span>

      <template #footer>
        <Button @click="showAccountManage = false">取消</Button>
        <Button type="primary" @click="confirmAccount">确认</Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getMaterialByid } from '@/api/registerInfo/registerInfo.js';
import StartModal from './modalComponents/startDeclare';
import UploadModal from './modalComponents/uploadPay';
import BuyDeclareModal from './modalComponents/buyDeclare';
import submitDeclareEntry from './modalComponents/submitDeclareEntry';
import TaxDetails from './modalComponents/taxDetails';
import GBtaxDetails from './modalComponents/GBtaxDetails';
import { taxLogDetail } from '@/api/taxModule';
import {
  getProduct,
  taxManageList,
  getTaxBill,
  freeDeclare,
  orderStatistic,
  declareManagerStatistics,
  downloadAffirm,
  declareManagerList,
  discountList,
} from '@/api/taxModule';
import { personalCenterIndex } from '@/api/user/userModule';
import {
  isAuthorized,
  taxBureauGetWay,
  authorizeCallback,
  retrievalVAT,
  forms,
  authUrl,
  createOrder,
  auth,
  getPayProgress,
  getCurrentBalances,
  mohuSearchCompany,
  unbindCheck,
  changeDefault,
} from '@/api/taxBureauService/taxBureauService';
import { baseInfo } from '@/api/shoppingCar/shoppingCar';
import { productInfo } from '@/api/shoppingCar/shoppingCar';
import UploadBox from '../components/modalComponents/uploadPay';
import { statusList as serviceStatusList } from '@/views/home/components/staticList.js';
import { authorizeList } from '@/api/user/userModule';
export default {
  name: 'Survey',
  components: {
    StartModal,
    UploadModal,
    BuyDeclareModal,
    TaxDetails,
    GBtaxDetails,
    submitDeclareEntry,
    UploadBox,
  },
  data() {
    return {
      productFunctionCode: null,
      serviceStatusList: serviceStatusList,
      statusList: {
        10: '待提交申报',
        11: '待审核申报',
        12: '申报中',
        13: '待缴纳税金',
        14: '待审核税金',
        15: '申报对接完成',
        16: '申报完成',
        17: '转出代理',
        18: '待提交申报(驳回)',
        19: '待缴纳税金(驳回)',
      },
      typeList: {
        1: '进口增值税抵扣',
        2: '发票抵扣',
        3: '其它',
        4: 'B2B',
        5: 'PVA',
        6: '平台佣金',
        7: '运费',
        8: '仓储费',
        9: '推广费',
      },
      showAccountManage: false,
      columnsAuth: [
        {
          title: '序号',
          slot: 'name',
        },
        // {
        //   title: '平台',
        //   slot: 'plat',
        // },
        {
          title: '已授权账户',
          key: 'authAccount',
        },
        {
          title: '默认账户',
          slot: 'radio',
        },
        {
          title: '本次使用',
          slot: 'use',
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center',
        },
      ],
      alist: [],
      showDeclareReceipt: false,
      showAccountName: false,
      accountName: '',
      declareReceiptList: [],
      authAccount: '',
      companyNameSearhList: [],
      buyType: 'declare', //购买类型，tax注册，declare申报
      modalStart: false, //开始报税弹窗
      modalPay: false, //凭证
      modalBuyd: false, //我要报税
      modalBuyt: false, //注册新税号
      showTaxDetails: false, //报税详情
      showGbTaxDetails: false, //英国税局详情
      showPayProcess: false,
      // showRegTax: false, //注册详情
      inviteBox: false,
      moreMoney: false,
      showPayTax: false,
      showMoney: false,
      sourceCurrency: '',
      shareLink: '',
      payChannel: '',
      contentStyleObj: {
        height: '',
      },
      modalPayRowId: '',
      workId: '',
      serviceId: '',
      orderId: '',
      countryCode: '',
      serviceInfo: {},
      taxForm: {
        limit: 10,
        page: 1,
        country: '',
        companyName: '',
        taxNumber: '',
        serviceStatus: '1',
      },
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
          key: 'deductionAmt',
        },
        {
          title: '凭证',
          align: 'center',
          slot: 'certificateFile',
        },
      ],
      // declareIossDetailDTOS:[

      // ],
      returnColumnsOU: [
        {
          title: '序号',
          width: 60,
          type: 'index',
          align: 'center',
        },
        {
          title: '国家',
          key: 'country',
          align: 'center',
        },
        {
          title: '含税销售额(€)',
          key: 'includeTaxSales',
          align: 'center',
        },
        {
          title: '税率',
          key: 'taxRate',
          align: 'center',
        },
        {
          title: '应缴税金(€)',
          key: 'tax',
          align: 'center',
        },
      ],
      showDetail: false,
      taxDetailInfo: {},
      nodatas: '暂无处理事项',
      survey: {}, // 概况数据
      declareCurrentPage: 1,
      moneyList: [],
      registerCurrentPage: 1,
      declareListTotal: 0,
      registerListTotal: 0,
      perPageCount: 3,
      declareList: [],
      registerList: [],
      taxApplication: {},
      registerTax: {},
      upload: false,
      fileUpload: this.ImgUrl,
      fileList: [],
      // total: '',
      accountForm: {
        accountName: '',
      },
      ruleAccount: {
        accountName: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { type: 'string', max: 49, message: '限制录入50个字符', trigger: 'blur' },
        ],
      },
      columns1: [
        {
          title: '序号',
          type: 'index',
          width: 50,
        },
        {
          title: '公司名称',
          key: 'companyNameZh',
          minWidth: 100,
          render(h, params) {
            let type = '暂未填写';
            if (params.row.companyNameZh != '') {
              type = params.row.companyNameZh;
              return h('span', type);
            } else {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                type
              );
            }
          },
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80,
        },
        {
          title: '申报周期',
          key: 'declarePeriod',
          minWidth: 65,
          render(h, params) {
            let declarePeriod = params.row.declarePeriod,
              type = '暂无';
            if (declarePeriod == 1) {
              type = '季报';
            } else if (declarePeriod == 0) {
              type = '月报';
            } else if (declarePeriod == 2) {
              type = '年报';
            }
            if (type == '暂无') {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                type
              );
            } else {
              return h('span', type);
            }
          },
        },
        {
          title: '申报区间',
          render: (h, params) => {
            let self = this;
            let beginTime = params.row.beginTime !== '' ? params.row.beginTime.slice(0, 7) : '';
            let endTime = params.row.endTime !== '' ? params.row.endTime.slice(0, 7) : '';
            let biaoShi = params.row.isSuppleDecl && params.row.isSuppleDecl == 1 ? '补申报：' : '';
            return h('span', [
              h(
                'span',
                {
                  style: {
                    color: 'red',
                  },
                },
                biaoShi
              ),
              h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : ''),
            ]);
          },
          minWidth: 120,
        },
        {
          title: '报税数据',
          minWidth: 95,
          slot: 'declareData',
        },
        {
          title: '申报截止日期',
          key: 'taxDeclarationDeadline',
          render(h, params) {
            let expirationTime = params.row.taxDeclarationDeadline;
            if (expirationTime == '') {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                '暂无'
              );
            } else {
              return h('span', expirationTime);
            }
          },
          minWidth: 95,
        },
        {
          title: '税金到账截止日期',
          key: 'taxPaymentDeadline',
          render(h, params) {
            let expirationTime = params.row.taxPaymentDeadline;
            if (expirationTime == '') {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                '暂无'
              );
            } else {
              return h('span', expirationTime);
            }
          },
          minWidth: 130,
        },
        {
          title: '工单状态',
          minWidth: 95,
          slot: 'status',
        },
        {
          title: '操作',
          slot: 'operate',
          minWidth: 200,
        },
      ],
      countryList: [],
      thirdPaymentOauthId: '',
      showDeclareEntry: false,
      timer: null,
      DeclareInfoGB: [],
      showAuthorization: false,
      status: '',
      sendType: 0,
      allMoney: [],
      filterMoney: [],
      sendServiceId: '',
      taxListStatics: {
        auditCount: 0,
        paymentAuditCount: 0,
        paymentCount: 0,
        taxCompleteCount: 0,
        taxIngCount: 0,
        taxTotalCount: 0,
        uploadCount: 0,
      },
      statusIndex: 'undefined',
      dataAuth: [],
      used: '',
      accessCode: '',
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      token: 'gettoken',
      sessionId: 'getsessionid',
    }),
    europeanUnion() {
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
      ].includes(this.taxDetailInfo.countryCode);
    },
    getUnit() {
      if (this.europeanUnion || this.taxDetailInfo.countryCode == 'GB') {
        if (this.taxDetailInfo.countryCode == 'CZ') {
          return 'Kč';
        } else if (this.taxDetailInfo.countryCode == 'PL') {
          return 'zł';
        } else if (this.taxDetailInfo.countryCode == 'GB') {
          return '£';
        } else if (this.taxDetailInfo.countryCode == 'SE') {
          return 'kr';
        } else {
          return '€';
        }
      }
      return '';
    },
  },
  watch: {
    showPayTax(val) {
      if (!val) {
        this.payChannel = '';
        this.showMoney = false;
        this.moneyList = [];
        this.filterMoney = [];
        this.moreMoney = false;
      }
    },
  },
  methods: {
    // filterMethod(value, option) {
    //   return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    // },
    handleSearchCompany() {
      mohuSearchCompany().then((res) => {
        if (res.code == 0) {
          this.companyNameSearhList = res.data;
        }
      });
    },
    addAccount() {
      authUrl({ channel: this.payChannel.toLocaleLowerCase() }).then((res) => {
        if (res.code == 0) {
          window.open(res.data);
        }
      });
    },
    confirmAccount() {
      const obj = this.dataAuth.find((item) => item.used);
      if (!obj) {
        return;
      }
      this.sourceCurrency = '';
      this.thirdPaymentOauthId = obj.id;
      this.authAccount = obj.authAccount;
      this.showAccountManage = false;
      this.getCurrentBalances({
        payChannel: this.payChannel,
        thirdPaymentOauthId: this.thirdPaymentOauthId,
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
      }).then((result) => {
        this.allMoney = result;
        this.filterMoney = result.slice(0, 6);
        if (result.length > 6) {
          this.moneyList = result.slice(6, result.length - 1);
        } else {
          this.moneyList = [];
        }
        // this.moneyList = this.filterMoney
        // this.showMoney = true
      });
    },
    radioChange(row) {
      changeDefault({
        defaultFlag: 1,
        id: row.id,
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
      }).then((res) => {
        if (res.code == 0) {
          // this.refreshAuthorizeList()
          this.isAuth(this.refreshAuthorizeList);
        }
      });
    },
    useChange(row) {
      const temp = JSON.parse(JSON.stringify(this.dataAuth));
      temp.forEach((item) => {
        if (item.id != row.id) {
          item.used = false;
        } else {
          item.used = true;
          this.used = item.id;
        }
      });
      this.dataAuth = [...temp];
    },
    // 开始报税弹窗
    getModelStartState(obj) {
      this.modalStart = obj.state;
      if (obj.refresh) {
        this.getTaxManageList();
      }
    },
    async isAuth(cb) {
      const res = await this.getAuthorizeList();
      if (!res.records.length) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p style="color: #333;font-size: 14px;">使用空中云汇支付需要您先授权！</p>',
          okText: '去授权',
          cancelText: '取消',
          onOk: () => {
            authUrl({ channel: this.payChannel.toLocaleLowerCase() }).then((res) => {
              if (res.code == 0) {
                window.open(res.data);
              }
            });
          },
        });
        return false;
      }
      if (cb) {
        cb(res);
      }
      return true;
    },
    async confirmAuth() {
      this.payChannel = 'AIRWALLEX';
      // const res = await this.getAuthorizeList()
      // if (!res.records.length) {
      //   this.$Modal.confirm({
      //     title: '提示',
      //     content: '<p style="color: #333;font-size: 14px;">使用空中云汇需要您先授权</p>',
      //     okText: '去授权',
      //     cancelText: '取消',
      //     onOk: () => {
      //         authUrl({ channel: this.payChannel.toLocaleLowerCase() }).then((res) => {
      //           if (res.code == 0) {
      //             window.open(res.data);
      //           }
      //         });
      //     },
      //   });
      //   return
      // } else {
      //   res.records.map(item => {
      //     if (item.defaultFlag == 1) {
      //       item.checked = true
      //       this.thirdPaymentOauthId = item.id
      //       this.authAccount = item.authAccount
      //       item.used = true
      //     }
      //   })
      //   this.dataAuth = res.records
      // }
      const that = this;
      const cb = function (res) {
        res.records.map((item) => {
          if (item.defaultFlag == 1) {
            item.checked = true;
            that.thirdPaymentOauthId = item.id;
            that.authAccount = item.authAccount;
            item.used = true;
            that.used = item.id;
          }
        });
        that.dataAuth = res.records;
      };
      const result = await this.isAuth(cb);
      if (!result) {
        return;
      }
      this.showMoney = true;
      this.getCurrentBalances({
        payChannel: this.payChannel,
        thirdPaymentOauthId: this.thirdPaymentOauthId,
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
      }).then((result) => {
        this.allMoney = result;
        this.filterMoney = result.slice(0, 6);
        if (result.length > 6) {
          this.moneyList = result.slice(6, result.length - 1);
        } else {
          this.moneyList = [];
        }
        // this.moneyList = this.filterMoney
        // this.showMoney = true
      });
    },

    getCurrentBalances(data) {
      return new Promise((resolve) => {
        getCurrentBalances(data).then((res) => {
          if (res.code === 0) {
            const result = JSON.parse(res.data);
            if (Array.isArray(result)) {
              resolve(result);
            }
          }
        });
      });
    },
    getModelPayState(obj) {
      this.modalPay = obj.state;
      if (obj.refresh) {
        this.getTaxManageList();
      }
    },
    getModelBuyState(obj) {
      this.modalBuyd = obj.state;
      if (obj.refresh) {
        this.getTaxManageList();
      }
    },
    getModelBuyInfoState(obj) {
      this.modalBuyInfo = obj.state;
    },
    getShowDeclareEntryState(obj) {
      this.showDeclareEntry = obj;
    },
    //屏幕高度
    getHeight() {
      // debugger;
      this.contentStyleObj.height = window.screen.height + 'px';
    },
    // 不同报税状态对应不同的操作
    toRegister(status, row) {
      let self = this;
      this.serviceInfo = row;
      this.status = status;
      //开始报税或修改
      if (status == 10) {
        self.modalStart = true;
      }
      //待缴纳税金
      if (status == 13 || status == 19) {
        discountList(row.id).then((res) => {
          if (res.code === 0) {
            this.detailData = res.data;
          }
        });
        self.countryCode = row.countryCode;
        self.modalPayRowId = row.id;
        self.modalPay = true;

        return;
      }
      if (row) {
        // 待提交申报
        if (row.status == 10 || row.status == 18) {
          if (!row.isProcess && row.countryCode === 'GB') {
            this.authorization(row);
          } else {
            this.$router.push({
              path: '/filingManagement/computedTax',
              query: {
                servicesId: row.serviceId,
                countryCode: row.countryCode,
                periodType: row.declarePeriod,
                beginTime: row.beginTime,
                endTime: row.endTime,
                workId: row.id,
                companyNameEn: row.companyNameEn,
                companyNameZh: row.companyNameZh,
                productFunctionCode: row.regProductFunctionCode,
                taxDeclarationDeadline: row.taxDeclarationDeadline,
                vatTaxNumber: row.vatTaxNumber,
                isProcess: row.isProcess,
              },
            });
          }
        }
      }
    },
    // 查看申报进度
    checkDeclareProgress() {
      this.$router.push({
        path: '/submitConfirm',
        query: {
          status: 'WAIT',
        },
      });
    },
    authorization(row) {
      var that = this;
      var vatTaxNumber = row.taxNumber;
      isAuthorized({
        vatTaxNumber: vatTaxNumber,
        // serviceId: row.serviceId,
        workOrderId: row.workId
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
                isProcess: row.isProcess,
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
    getModelBuyTaxState(obj) {
      this.modalBuyt = obj.state;
    },
    getTaxModelBuyTax(obj) {
      if (obj.type == 'GB') {
        this.showGbTaxDetails = false;
      }
      this.showTaxDetails = obj.state;
    },
    // getRegTaxModelBuyTax(obj) {
    //   this.showRegTax = obj;
    // },F
    registerChangePageHandler(page) {
      this.taxForm.page = page;
      this.getTaxManageList(page);
    },
    //获取授权信息
    getAuthorizeList() {
      return new Promise((resolve) => {
        authorizeList({ limit: 9999, page: 1, userId: JSON.parse(localStorage.getItem('objInfo')).userId })
          .then(
            (res) => {
              if (res.code == 0) {
                resolve(res.data);
              } else {
                this.$Message.error(res.message);
              }
            },
            (err) => {
              this.$Message.error(err.message);
            }
          )
          .finally(() => {});
      });
    },
    onlinePayTax(row) {
      this.showPayTax = true;
      // this.getAuthorizeList()
      this.detailData = row;
    },
    showPayProcessModal(row) {
      this.showPayProcess = true;
      this.detailData = row;
    },
    payLian() {
      this.payChannel = 'LIANLIANGLOBAL';
      this.showMoney = false;
      this.moneyList = [];
      this.sourceCurrency = '';
    },
    refreshPayProcess() {
      getPayProgress({
        payChannel: this.detailData.payPlatform,
        workOrderId: this.detailData.id,
        thirdPaymentOauthId: this.detailData.thirdPaymentOauthId,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('获取支付进度成功');
            if (this.detailData.payStatus != res.data) {
              this.detailData.payStatus = res.data;
            }
            this.getTaxManageList();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    registerPageSizeChangeHandler(pageSize) {
      this.taxForm.limit = pageSize;
      this.getTaxManageList();
    },
    handleReset(name) {
      this.$refs[name].resetFields();
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
      this.getTaxManageList(1);
      this.statisticsfun();
    },
    //获取列表数据
    getTaxManageList(page) {
      if (page) {
        this.taxForm.page = page;
      }
      if (this.statusIndex == 'undefined') {
        this.taxForm.status = '';
      } else {
        this.taxForm.status = this.statusIndex;
      }
      this.loading = true
      declareManagerList(this.taxForm).then((res) => {
        if (res.code === 0) {
          // this.total = res.data.total
          this.registerList = res.data.records;
          this.registerListTotal = res.data.total - 0;
        }
      }).finally(() => {
        this.loading = false
      })
    },
    async goPay() {
      // authUrl({ channel: this.payChannel }).then((res) => {
      //   console.log(res)
      //   window.open(res);
      //   if (res.code === 0) {
      //     console.log(res)
      //   }
      // });
      if (!this.payChannel) {
        return this.$Message.error('请选择支付平台');
      }
      if (this.payChannel === 'AIRWALLEX') {
        const result = await this.isAuth();
        if (!result) {
          return;
        }
      }
      if (this.payChannel === 'AIRWALLEX' && !this.sourceCurrency) {
        return this.$Message.error('请选择钱包余额');
      }
      const params = {
        payChannel: this.payChannel,
        workOrderId: this.detailData.id,
        sourceCurrency: this.payChannel === 'AIRWALLEX' ? this.sourceCurrency : undefined,
        thirdPaymentOauthId: this.payChannel === 'AIRWALLEX' ? this.thirdPaymentOauthId : undefined,
      };
      createOrder(params).then((res) => {
        if (res.code === 0) {
          this.showPayTax = false;
          this.getTaxManageList();
          if (this.payChannel === 'AIRWALLEX') {
            if (res.message === 'success') {
              this.$Message.success({
                content: '支付成功',
                duration: 4,
              });
            }
            this.$util.getUserInegralMessage(this, '消费');
            return;
          }
          window.open(res.data.invoiceUrl);
        }
      });
    },
    // 统计
    statisticsfun() {
      let data = {
        country: this.taxForm.country,
        companyName: this.taxForm.companyName,
        taxNumber: this.taxForm.taxNumber,
        serviceStatus: this.taxForm.serviceStatus
      };
      declareManagerStatistics(data).then((res) => {
        if (res.code === 0 && JSON.stringify(res.data) != '{}') {
          this.taxListStatics = res.data;
        } else {
          this.taxListStatics = {
            auditCount: 0,
            paymentAuditCount: 0,
            paymentCount: 0,
            taxCompleteCount: 0,
            taxIngCount: 0,
            taxTotalCount: 0,
            uploadCount: 0,
          };
        }
      });
    },
    downloadTaxSure() {
      this.$util.downFile(this.baseUrl + `/workorder/management/download/confirm?workId=${this.taxDetailInfo.id}`);
    },
    changeState(val) {
      let obj = {
        state: val,
      };
      this.$emit('changeState', obj);
    },
    changeStates(obj) {
      this.upload = obj.state;
    },
    // 更改服务状态
    changeServiceStatus() {
      this.getTaxManageList(1);
      this.statisticsfun()
    },
    //根据状态查询
    changeStatus(type) {
      this.statusIndex = type;
      this.getTaxManageList(1);
    },
    getUserService() {
      personalCenterIndex().then((res) => {
        if (res.code === 0) {
          let host = '',
            url = window.location.href;
          let regex = /.*\:\/\/([^\/]*).*/;
          let match = url.match(regex);
          host = match[1];
          this.shareLink = this.shareUrl + '?invitedCode=' + res.data.invitedCode;
        }
      });
    },
    needVatObligations(row) {
      // console.log('弹窗', row)
    },
    //查看报税详情
    checkTaxDetail(row) {
      this.productFunctionCode = row.regProductFunctionCode ? row.regProductFunctionCode : null;

      this.showDetail = true;
      this.status = row.status;
      this.serviceId = row.serviceId;
      this.taxDetailInfo = { ...row };
      this.alist = [];
      if (row.tfnCountryCode && row.tfnCountryCode.length > 0) {
        let list = row.tfnCountryCode.split(',');
        list.map((item) => {
          let i = this.countryList.find((t) => t.countryCode == item.trim());
          if (i) {
            this.alist.push(i.countryNameZh);
          }
        });
      }
      discountList(row.id).then((res) => {
        if (res.code === 0) {
          this.detailData = res.data;
        }
      });
    },
    uploadFile(row) {
      if (row.status == 13 || row.status == 16 || row.status == 19) {
        this.upload = true;
        this.workId = row.id;
      }
    },
    chooseCurrency(currency) {
      this.sourceCurrency = currency;
    },
    // 下载税金确认单
    uploadTaxBill(row) {
      this.$util.downFile(this.baseUrl + `/workorder/management/download/confirm?workId=${row.id}`);
    },

    // 下载回执
    uploadReceipt(row) {
      this.$util.downFile(this.baseUrl + `/workorder/client/download/receipt?workId=${row.id}`);
    },

    // 查看ecl申报回执
    uploadEclReceipt(row) {
      let url = row.eclReceipt;
      if (url.slice(0, 5) == 'http:') url = url.slice(0, 4) + 's' + url.slice(4);
      window.open(url);
    },

    uploadTaxDeclareReceipt(row) {
      if (row.declareReceipt) {
        if (row.declareReceipt.split(',').length > 1 || row.declareReceipt.split(';').length > 1) {
          // this.declareReceiptList = row.declareReceipt.split(",");
          if (row.declareReceipt.indexOf(',') != -1) {
            this.declareReceiptList = row.declareReceipt.split(',');
          } else if (row.declareReceipt.indexOf(';') != -1) {
            this.declareReceiptList = row.declareReceipt.split(';');
          }
          for (let i = 0; i < this.declareReceiptList.length; i++) {
            if (this.declareReceiptList[i].slice(0, 5) == 'http:') {
              this.declareReceiptList[i] =
                this.declareReceiptList[i].slice(0, 4) + 's' + this.declareReceiptList[i].slice(4);
            }
          }
          this.showDeclareReceipt = true;
        } else if (row.declareReceipt.split(',').length == 1) {
          let url = row.declareReceipt;
          if (url.slice(0, 5) == 'http:') url = url.slice(0, 4) + 's' + url.slice(4);
          window.open(url);
        }
      } else {
        this.$Modal.info({
          title: '暂无回执',
          content: '由于税局系统报税较多，下发回执会稍有延迟， 请耐心等待...',
        });
      }
    },
    handleMoreMoney() {
      this.moreMoney = !this.moreMoney;
      // if (!this.moreMoney) {
      //   this.moneyList = this.filterMoney
      // } else {
      //   this.moneyList = this.allMoney;
      // }
    },
    unbindCheck(row) {
      this.$Modal.confirm({
        title: '解除授权',
        content:
          '<p style="color: #333;font-size: 14px;">解除授权后，将不能再使用此账户的钱包余额在线支付税金，除非您再次授权。确认解除？</p>',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unbindCheck({ thirdPaymentOauthId: row.id })
            .then((res) => {
              if (res.code == 0) {
                if (res.data) {
                  // this.$Message.success("解绑成功");
                  // this.refreshAuthorizeList()
                  // this.isAuth(this.refreshAuthorizeList)
                  window.open(res.data);
                  this.showAccountManage = false;
                  this.showPayTax = false;
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },
    refreshAuthorizeList(res) {
      res.records.map((item) => {
        if (item.defaultFlag == 1) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        if (item.id == this.used) {
          item.used = true;
        } else {
          item.used = false;
        }
      });
      this.dataAuth = res.records;
    },
    auth() {
      this.$refs['accountForm'].validate((valid) => {
        if (valid) {
          auth({
            authAccount: this.accountForm.accountName,
            authCode: this.accessCode,
            userId: JSON.parse(localStorage.getItem('objInfo')).userId,
          })
            .then((res) => {
              if (res.code == 0) {
                if (res.data) {
                  this.$Message.success('授权成功');
                } else {
                  this.$Message.error('授权失败');
                }
                this.showAccountName = false;
                this.$router.replace({
                  path: '/filingManagement',
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
  },
  created() {
    if (this.$route.query.key) {
      this.statusIndex = this.$route.query.key;
      this.taxForm.status = this.$route.query.key;
    }
    this.getUserService();
  },
  mounted() {
    var code = '';
    if (window.location.search) {
      let urlStr = window.location.search.substring(1).split('&');
      urlStr.forEach((item) => {
        if (item.indexOf('code') != -1) {
          code = item.substring(item.indexOf('=') + 1);
        }
      });
    }
    if (code) {
      this.accessCode = code;
      this.showAccountName = true;
    }
    this.getCountry();
    this.getTaxManageList();
    this.statisticsfun();
    // this.handleSearchCompany();
  },
};
</script>

<style lang="less" scoped>
.statusStyle {
  width: 80px;
  margin-right: 10px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  border-radius: 5px !important;
}
.infoTb /deep/ .ivu-radio {
  display: none;
}
.country-list {
  display: flex;
  margin-top: 5px;
  .country-list-left {
    width: 140px;
  }
}
/deep/ .ivu-row {
  margin-top: 5px;
}
.tax-info-name {
  margin-right: 10px;
}
&/deep/ .ivu-select-dropdown-list {
  max-height: 300px !important;
  // overflow: auto;
}
.mb-15 {
  margin-bottom: 15px;
}
.tabs-box {
  border-bottom: 1px solid #f6f6f6;
  padding-left: 24px;
  display: flex;
  div {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
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
      text-align: center;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      // width: 24px;
      padding: 0 5px;
      margin-left: 4px;
    }
  }
}
.container {
  // max-width: 1292px;
  box-sizing: border-box;
  // padding: 0px 20px 15px 20px;
  // background: #fff;
  margin-bottom: 7px;
  border-radius: 2px;
  .headContent {
    height: 78px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 500;
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
      span {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
  }
  & .title {
    color: #212121;
    font-size: 18px;
    font-weight: bold;
    line-height: 56px;
  }
  .title_wait {
    margin: 0px 0 11px 0;
    .content {
      padding-top: 24px;
    }
    &/deep/ .ivu-form .ivu-form-item-label {
      font-weight: bold;
    }
    .tax-status {
      border-bottom: 1px solid rgba(153, 153, 153, 0.16);
      span.status-item {
        display: inline-block;
        width: 149px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: rgba(153, 153, 153, 0.1);
        border-radius: 4px 4px 0px 0px;
        border: 1px solid rgba(153, 153, 153, 0.16);
        color: #666;
        font-size: 14px;
        border-bottom: none;
        margin-right: 4px;
        cursor: pointer;
        .status-count {
          color: #ed3e3e;
        }
      }
      span.status-item.active {
        background: #ffffff;
        color: #2db7f5;
        .status-count {
          color: #2db7f5;
        }
      }
    }
  }
  & .line {
    border: 1px solid #f5f5f5;
    margin-bottom: 16px;
  }
  & .info {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .item {
      img {
        width: 102%;
        cursor: pointer;
      }
    }
    .item:nth-child(1) {
      margin-left: -5px;
    }
  }
  .infoTb {
    background-color: #fff;
    padding: 0px 27px;
    margin-top: 24px;
    margin-left: 24px;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  //TabsNav 样式
  & /deep/ .ivu-tabs-bar {
    margin: 0px;
  }
  & /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
    border-color: #e6e6e6 !important;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar {
    border-color: #f2f2f2;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab {
    margin-right: 0px;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab:nth-child(2n) {
    border-top-right-radius: 0px;
    background: rgba(247, 247, 247, 1);
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab:nth-child(2n-1) {
    border-top-left-radius: 0px;
  }
  & /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused:nth-child(2n-1),
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab-focused:nth-child(2n-1),
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab-active:nth-child(2n-1) {
    border-left-color: #fff !important;
    font-weight: 400;
  }
  //表格样式
  &/deep/.ivu-table:before {
    background-color: #f2f2f200;
  }
  &/deep/.ivu-table:after {
    background-color: #f2f2f2;
  }
  & .ivu-tabs /deep/ .ivu-table-wrapper {
    margin-bottom: 11px;
    border-color: #f2f2f2;
  }

  & .ivu-tabs /deep/ .ivu-table-wrapper tr td {
    color: #16ade9;
    font-size: 12px;
  }
  & /deep/ .ivu-table-tip tr {
    height: 144px;
  }
  .pageSetion {
    text-align: right;
    margin-top: 24px;
    padding-bottom: 36px;
    .pagination {
      display: inline-block;
      // margin-right: 12px;
      line-height: 20px;
    }
    .totalNum {
      // position: absolute;
      // top: 2px;
      // right: 0px;
      font-size: 14px;
      color: #9a9ca1;
    }
    &/deep/.ivu-page-simple .ivu-page-simple-pager input {
      padding: 0;
      margin: 0;
    }
    &/deep/.ivu-page-simple-pager {
      margin-right: 0;
    }
  }
}
.container {
  &/deep/.ivu-tabs .ivu-table-wrapper .ivu-table-tip tr td {
    color: #9a9ca1;
  }
  .tbNull {
    // position: relative;
    /deep/ .ivu-table table {
      border-left: 1px solid #ebebebff;
    }
    &/deep/ td .ivu-table-cell {
      font-size: 12px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      color: #333333;
      .grey {
        color: #999999;
      }
      .red {
        color: #16ade9;
      }
      .blue {
        color: #16ade9;
      }
      .yellow {
        color: #f79728;
      }
      .orange {
        color: #fc9153;
      }
      .green {
        color: #5ab187;
      }
    }
    .operate {
      cursor: pointer;
      text-align: center;
      font-weight: 500;
      justify-content: center;
      img {
        width: 11px;
        margin-right: 4px;
        margin-bottom: 2px;
      }
      &/deep/ .ivu-btn-text {
        // width: 63px;
        color: #16ade9;
        font-size: 12px;
        padding: 0 5px;
        text-align: left;
        background: #fff;
        border-color: #16ade9;
        margin-right: 10px;
        display: inline-block;
        margin: 0px 20px;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        img {
          width: 18px;
          height: 18px;
        }
      }
      .btF {
        // min-width: 124px;
      }
      .btF.flex-center {
        // min-width: 124px;
        background: none;
        color: #f79728;
        border-color: #f79728;
        border: none;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .btF.flex-center.btn-red {
        color: #ed3e3e;
        i {
          font-size: 18px;
        }
      }
      .red-button {
        color: #ed3e3e;
        border-color: #ed3e3e;
      }
      .upload-btn {
        border: none;
        border-color: #16ade9;
        color: #16ade9;
        background: none;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .btR {
        min-width: 124px;
        background: #ed3e3e;
      }
    }
    /deep/ th .ivu-table-cell {
      font-size: 14px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    &/deep/ .ivu-table {
      color: #333333;
      font-size: 12px;
      td,
      th {
        border-bottom: 1px solid #e6e6e6;
        padding: 16px 0;
        text-align: center;
        // border-right: none;
        border-right: 1px solid #ebebebff;
      }
      th {
        color: #666666;
        font-weight: inherit;
        background: rgba(22, 173, 233, 0.2);
      }
    }
    &/deep/ .ivu-table-header {
      .ivu-table-cell {
        & > div div:nth-child(1) {
          font-weight: bold;
          font-size: 12px;
        }
        & > div div:nth-child(2) {
          // font-weight: bold;
          font-size: 10px;
        }
      }
    }
  }
  .activity-box,
  .activity-rule {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .invite-banner {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: relative;
    .inviteBox {
      position: absolute;
      left: 50%;
      margin-left: -370px;
      .bg {
        width: 100%;
        height: auto;
      }
      .btn {
        width: 143px;
        height: 29px;
        position: absolute;
        bottom: 13px;
        left: 50%;
        transform: translateX(-50%);
        background: url(../../../assets/images/survey/inviteBtn.png) no-repeat;
        background-size: contain;
        text-align: center;
        color: #ed3e3e;
        font-size: 14px;
        font-weight: 500;
        line-height: 29px;
      }
    }
    .close {
      z-index: 9999999;
      top: 140px;
      left: 50%;
      position: absolute;
      margin-left: 340px;
    }
  }
}
@media screen and (max-width: 1440px) {
  .container .info .info-item {
    padding-right: 16px;
  }
  .info-img {
    img {
      width: 100%;
    }
  }
  .info-right-wrapper {
    margin-left: 10px;
  }
}
.searchBtn {
  // margin-right: 12px;
  height: 32px;
  background-color: #16ade9;
  border: 1px solid rgba(230, 230, 230, 1);
  color: #ffffff;
  font-size: 12px;
  // margin-left: 10px;
  &/deep/ .ivu-icon {
    font-size: 17px;
    margin-top: 3px;
  }
  &/deep/ span {
    font-size: 12px;
    margin-bottom: 10px;
    float: right;
    margin-top: 6px;
  }
}
.resetBtn {
  font-size: 12px;
  font-family: 'MicrosoftYaHei';
  color: #999999;
  border: none;
  line-height: 12px;
  border: 1px solid #cccccc;
  &/deep/ .ivu-icon {
    font-size: 19px;
    margin-top: 2px;
  }
  &/deep/ span {
    font-size: 12px;
    margin-bottom: 10px;
    float: right;
    margin-top: 9px;
  }
}
.fr &/deep/.ivu-form-item {
  margin-bottom: 0;
}
.invit-title {
  font-size: 20px;
  font-weight: 500;
  color: #303033;
  text-align: center;
  margin-top: 22px;
}
.invit-content {
  margin-left: 20px;
  margin-top: 20px;
  padding-bottom: 30px;
  .invit-input {
    width: 480px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    background-color: #f0f0f0;
  }
  /deep/ .ivu-input {
    height: 40px;
    border-radius: 0;
    padding: 11px 14px;
  }
  .link-btn {
    display: inline-block;
    width: 88px;
    height: 40px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    background-color: #16ade9;
    font-size: 14px;
    cursor: pointer;
  }
  .active-rule {
    width: 568px;
    margin-top: 15px;
    background-color: #faf7f8;
    padding: 18px 10px;
    color: #303033;

    .rule-title {
      font-size: 14px;
      font-size: 500;
      margin-top: 8px;
    }
    .rule-content {
      font-size: 12px;
      line-height: 24px;
    }
  }
}
@media screen and (min-width: 1882px) {
  .container .info .item:nth-child(1) {
    margin-left: -32px;
  }
}
.online-pay-modal .ivu-modal-footer {
  border-top: 1px solid red;
}
.footer-wrap {
  padding-top: 15px;
  margin-top: 20px;
}

.footer-tip {
  text-align: left;
}

.mr-15 {
  margin-right: 15px;
}

.pay-wrap {
  overflow: hidden;
  .active {
    border: 1px solid #16ade9;
    background: url('../../../assets/images/sureOrder/check-pay.png') no-repeat;
    background-position: right bottom;
  }
}
.lian-pay,
.air-pay {
  border: 1px solid #eee;
  float: left;
  width: 192px;
  height: 50px;
  background: #f8f8f8;
  border-radius: 4px;
}

.lian-pay {
  margin-left: 24px;
  padding: 16px 0 0 16px;
}
.air-pay {
  margin-left: 46px;
  padding: 16px 0 0 33px;
}
.air-pay img {
  width: 126px;
}
.lian-pay img {
  width: 160px;
}

.online-pay-modal {
  /deep/ .ivu-modal-header {
    border-radius: 4px;
    padding: 0 16px;
    background: #fff !important;
    height: 64px;
    .modal-title {
      color: #333;
      font-size: 16px;
      font-weight: 800;
      line-height: 64px;
    }
  }
  .modal-tip {
    width: 769px;
    height: 40px;
    background: rgba(22, 173, 233, 0.1);
    border-radius: 4px 4px 0px 0px;
    margin: 8px 0 16px 24px;
    .modal-foot-title {
      line-height: 38px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      padding-left: 24px;
    }
  }
  .tax-info-name[data-v-0a48ba9f] {
    display: inline-block;
    width: 100px;
    text-align: right;
    color: #666;
    font-size: 14px;
  }
  .tax-info-value {
    color: #333;
    font-size: 14px;
  }
  .pay-wrap-title {
    color: #333;
    font-size: 18px;
    margin: 20px 0 20px 24px;
    font-weight: 800;
    font-family: PingFangSC-Medium, PingFang SC;
    span {
      font-size: 14px;
      cursor: pointer;
      color: #57a3f3;
      font-weight: 200;
      margin-left: 5px;
    }
  }
  .tip-icon {
    color: #16ade9;
    font-size: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .more-wrap {
    max-height: 150px;
    width: 735px;
    overflow-y: auto;
  }
  .money-wrap {
    padding-left: 24px;
    display: flex;
    width: 735px;
    flex-wrap: wrap;

    .money-item {
      width: 230px;
      flex-shrink: 0;
      padding: 6px 10px;

      img {
        vertical-align: middle;
      }

      span {
        font-size: 16px;
        margin-left: 5px;
        vertical-align: middle;
      }
    }

    .active {
      background: rgba(22, 173, 233, 0.05);
      border-radius: 2px;
      span {
        color: #16ade9;
      }
    }
  }
}

img.refresh {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  vertical-align: middle;
  cursor: pointer;
}

.account-modal img {
  width: 20px;
}

.account-modal /deep/ .ivu-modal-body {
  padding: 20px 40px;
}
.account-title {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 10px;
}
.account-label {
  margin-bottom: 10px;
}
.account-modal /deep/ .ivu-input-type-text {
  width: 300px;
}

.account-form {
  margin-bottom: 20px;
}

.radio-wrap {
  width: 22px;
  height: 22px;
  position: absolute;
  top: 1px;
  left: 42px;
  z-index: 10;
  cursor: pointer;
}

/deep/ .ivu-table-cell {
  position: relative;
}

.account-manage-modal /deep/ .ivu-modal-header {
  font-size: 18px;
  font-weight: 800;
}
.account-manage-title {
  font-size: 15px;
}
.mb-20 {
  margin-bottom: 20px;
}
.blue-font {
  color: #16ade9;
  cursor: pointer;
  button {
    border: 1px solid #16ade9;
    margin-right: 3px;
    /deep/ .ivu-icon {
      color: #16ade9;
    }
  }
}

.table-wrap {
  max-height: 400px;
  overflow: auto;

  /deep/ .ivu-table-header thead tr th {
    text-align: center;
  }

  /deep/ .ivu-table-border td {
    text-align: center;
  }
}

.declare-data-modal {
  /deep/ .ivu-modal-body {
    max-height: 500px;
    overflow: auto;
  }

  .declare-detail-wrap {
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 10px;
    p {
      color: #333;
      font-size: 16px;
      font-weight: 800;
    }
  }
}
</style>
