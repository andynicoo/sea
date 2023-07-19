<template>
  <div>
    <div class="head">
      <div>
        <div style="padding-left: 32px">
          <span class="left">申报详情</span>
          <span class="right">（ {{ serviceName }} ）</span>
          <Button @click="seeHistoryBuyInfo" v-if="eprDeclare.type != 2 && counrtyCode == 'DE'"
            >查看历史购买产品信息</Button
          >
          <Button @click="seeYearHistoryBuyInfo" v-if="eprDeclare.type == 1">查看本年度历史申报信息</Button>
        </div>
        <!-- 顶部服务状态图 -->
        <div class="statusItem" style="margin: 20px auto; width: 70%">
          <Steps :current="orderStatus" v-if="eprDeclare.type == 2">
            <Step v-for="(item, index) in forwardNodes" :title="item.nodeName" :key="index"></Step>
          </Steps>
          <Steps :current="orderStatus2" v-else>
            <Step v-for="(item, index) in forwardNodes2" :title="item.nodeName" :key="index"></Step>
          </Steps>
        </div>
        <div class="tabTitle">
          <span :class="{ 'active-tab': pageType == 1 }" @click="pageType = 1" v-if="showDeclareInfo"> 申报信息 </span>
          <span :class="{ 'active-tab': pageType == 2 }" @click="pageType = 2">注册资料</span>
        </div>
      </div>
    </div>
    <!-- -->
    <div class="main" v-if="pageType == 2">
      <div class="content-wrap EPRDeclareDetails">
        <DynamicForm
          :moduleList="dataReview"
          :showBtn="isEdit"
          :isCancel="isCancel"
          @formCancel="isEdit = false"
          :isEdit="isEdit"
          :showSave="isEdit"
          :showSubmit="isEdit"
          :workInfo="eprDeclare"
        />

        <h2 class="module-name" v-if="counrtyCode == 'DE'">
          <b></b>{{ eprDeclare.type == 1 ? '本月实际销售总量' : '已购买产品信息' }}
        </h2>
        <div class="ivu-col-span-23" style="padding-left: 23px" v-if="eprDeclare.type == 1">
          <label class="ivu-form-item-label"
            ><span style="display: inline-block; margin: 20px 0 5px">WEEE产品信息</span></label
          >

          <Table border :columns="counrtyCode === 'DE' ? columnsProductDE : columnsProduct" :data="productList">
            <!-- 产品类别 -->
            <template slot-scope="{ row, index }" slot="productCategory">
              <Select
                v-model="row.productCategory"
                disabled
                transfer
                clearable
                @on-change="(val) => (productList[index].productCategory = val)"
              >
                <Option
                  :value="item.value"
                  v-for="item in counrtyCode === 'DE' ? productCategoryListDE : productCategoryList"
                  :key="item.value"
                  >{{ item.value }}</Option
                >
              </Select>
            </template>
            <template slot-scope="{ row, index }" slot="saleWeight">
              <InputNumber
                style="min-width: 100%"
                v-model="row.saleWeight"
                :min="0"
                :max="99999999"
                :disabled="disabled"
                :precision="5"
                @on-change="(val) => (productList[index].saleWeight = row.saleWeight)"
              >
              </InputNumber>
            </template>

            <!-- 操作 -->
            <template slot-scope="{ row, index }" slot="action">
              <Tooltip placement="top" content="添加信息栏" v-if="!disabled">
                <img
                  src="@/assets/images/compliance/add.svg"
                  style="margin-right: 5px; cursor: pointer"
                  @click="addProduct"
                />
              </Tooltip>
              <Tooltip placement="top" content="删除信息栏" transfer v-if="!disabled">
                <img
                  src="@/assets/images/compliance/cut.svg"
                  @click="remove(index)"
                  style="cursor: pointer"
                  v-if="index != 0"
                />
              </Tooltip>
            </template>
          </Table>
        </div>

        <div class="ivu-col-span-23" style="padding-left: 23px" v-if="eprDeclare.type == 3 && counrtyCode == 'DE'">
          <label class="ivu-form-item-label"
            ><span style="display: inline-block; margin: 20px 0 5px">电池法产品信息</span></label
          >
          <BatteryProductDtos :value="JSON.parse(eprDeclare.infos)" :disabled="true" />

          <span class="wran-font"
            >*当年累计出货重量若超出之前购买额度，则需要补缴费用；若低于或等于已购重量，则无需补缴，默认按照已购重量进行年度申报。</span
          >
          <br />
          <span class="btF upload-btn" type="text" @click="calcRuleDialogVisible = true">
            <img src="@/assets/images/survey/uploadBlue.png" alt />
            查看计价规则
          </span>
        </div>

        <div
          class="ivu-col-span-23 packingProductDtos"
          style="padding-left: 23px"
          v-if="eprDeclare.type == 2 && counrtyCode == 'DE'"
        >
          <PackingProductDtos :value="JSON.parse(eprDeclare.infos)" :disabled="true" />
        </div>

        <div class="btn-group" v-if="eprDeclare.status == 1 && eprDeclare.type == 1">
          <Button class="keep" @click="saveDeclare">计算费用</Button>
        </div>
      </div>
    </div>

    <div v-if="pageType == 1">
      <div class="declare-info">
        <span
          class="btF upload-btn"
          type="text"
          @click="uploadTaxDeclareReceipt(eprDeclare.declareReceipt)"
          v-if="eprDeclare.declareReceipt"
        >
          <img src="@/assets/images/survey/uploadBlue.png" alt />
          查看回执
        </span>

        <!-- 注册资料 -->
        <div v-if="eprDeclare.type == 1">
          <div class="time-tip">
            （申报区间： {{ eprDeclare.beginTime.split(' ')[0] }} -
            {{ eprDeclare.endTime.split(' ')[0] }}）WEEE产品申报信息
          </div>
          <Table :columns="columnDetail" :data="productList" border max-height="500" v-if="productList.length"></Table>

          <Table
            :columns="columnsSummary"
            max-height="500"
            :data="summary"
            border
            show-summary
            :summary-method="handleSummary"
          ></Table>

          <div class="btn-group">
            <Button type="primary" @click="pageType = 2" v-if="eprDeclare.status == 1">重新提交 </Button>
            <Button type="primary" @click="submitDeclare" v-if="eprDeclare.status == 1">确认无误</Button>
            <Button type="primary" @click="confirmPay" v-if="eprDeclare.status == 2">确认付款 </Button>
          </div>
        </div>

        <!-- 申报资料 -->
        <div class="ivu-col-span-23" v-if="eprDeclare.type == 3">
          <template v-if="showCalc && eprDeclare.status == 1">
            <BatteryProductDtos :value="productList" v-if="counrtyCode == 'DE'" />
            <FrBatteryProductDtos
              :supplierId="info.orderServicesVO.supplierId"
              :value="productList"
              :disabled="timeOver"
              v-if="counrtyCode == 'FR' && supplierCode != 'S000304'"
            />
            <FrBatteryColProductDtos
              :supplierId="info.orderServicesVO.supplierId"
              :value="productList"
              :disabled="timeOver"
              v-if="counrtyCode == 'FR' && supplierCode == 'S000304'"
            />

            <EsBatteryProductDtos
              ref="EsBatteryProductDtos"
              v-model="productList"
              :disabled="timeOver"
              v-if="counrtyCode === 'ES'"
            />

            <div class="btn-group">
              <Button class="keep" @click="() => saveDeclare()" v-if="counrtyCode == 'DE' || counrtyCode === 'ES'"
                >计算金额</Button
              >
              <Button class="keep" @click="calcAmount" v-if="counrtyCode == 'FR' && !timeOver">计算金额</Button>
              <Button class="keep" disabled v-if="counrtyCode == 'FR' && timeOver">已超过提交时间，请联系客服</Button>
            </div>
          </template>

          <div v-if="(!showCalc && eprDeclare.status == 1) || (eprDeclare.status != 0 && eprDeclare.status != 1)">
            <template v-if="counrtyCode == 'DE'">
              <Table :columns="columnBatDetail" :data="infoNews" border max-height="500" v-if="infoNews.length"></Table>

              <Table
                :columns="columnsBatSummary"
                max-height="500"
                :data="summary.infoNews"
                :span-method="handleSpan"
                border
              >
                <template slot="declarePrice" slot-scope="{ row }">
                  {{ summary.sumBeyondbuyDaAmount == 0 ? 0 : row.declarePrice }}
                </template>

                <template slot="buyAmount">
                  {{ summary.buyAmount }}
                </template>
                <template slot="sumBeyondbuyDaAmount">
                  {{ summary.sumBeyondbuyDaAmount }}
                </template>
              </Table>

              <p class="actual-pay" v-if="eprDeclare.status != 0 && eprDeclare.status != 1 && eprDeclare.status != 2">
                实际补缴金额：<span class="red-font">
                  {{ eprDeclare.paymentStatus == 1 ? summary.sumBeyondbuyDaAmount : '0' }}
                  元</span
                >
              </p>
            </template>
            <template v-if="counrtyCode == 'FR'">
              <Table
                :columns="supplierCode == 'S000304' ? columnsFrColBattSummary : columnsFrBattSummary"
                max-height="500"
                :data="summary.infos"
                border
                show-summary
                :summary-method="handleFrBattSummary"
              ></Table>
              <div style="margin-top: 20px; overflow: hidden">
                <!-- <Tooltip placement="top" content="补交费用=回收费*人民币汇率*手续费" max-width="490">
                  查看计算公式
                </Tooltip> -->
                <span style="float: right"
                  >需补缴费用：
                  <span style="color: #f7a323">{{ eprDeclare.price }}元</span>
                </span>

                <!-- <span style="float: right"
                  >实际补缴费用： <span style="color: #f7a323">{{ eprDeclare.price }}元</span>
                </span> -->
              </div>
              <!-- <div style="text-align: right; margin-top: 10px">
                <span style="color: #7f7f7f">
                  （ 人民币汇率：{{ calcMoneyConfig.exchangeRate }}、手续费：{{ calcMoneyConfig.serviceCharge }}

                  ）
                </span>
              </div> -->
              <div style="text-align: right; margin-top: 10px">
                <span style="color: #7f7f7f">
                  （ 若总费用（欧元）< {{ supplierCode == 'S000304' ? 200 : 150 }}欧，补交费用按{{
                    supplierCode == 'S000304' ? 200 : 150
                  }}欧元收取 ）
                </span>
              </div>
            </template>

            <template v-if="counrtyCode === 'ES'">
              <EsBatteryProductDeclare :eprDeclare="eprDeclare" :infoNews="infoNews" :summary="summary" />
            </template>

            <div class="btn-group">
              <Button class="keep" @click="confirmPay" v-if="eprDeclare.status == 2 && !timeOver">补缴费用</Button>
              <Button class="keep" disabled v-if="eprDeclare.status == 2 && timeOver"
                >已超过提交时间，请联系客服</Button
              >
              <Button class="keep" @click="showCalc = true" v-if="eprDeclare.status == 1">重新填写</Button>
              <Button type="primary" @click="submitDeclare" v-if="eprDeclare.status == 1">确认提交</Button>
            </div>
          </div>
        </div>

        <div class="ivu-col-span-23" style="padding-left: 23px; padding-top: 30px" v-if="eprDeclare.type == 2">
          <template v-if="counrtyCode == 'DE'">
            <template v-if="showCalc">
              <div class="tittleStyle">
                <div class="subTitle">当年实际出货产品信息</div>
              </div>
              <PackingDeclareProductDtos :value="productList" @inputSubmit="handlerInput" />

              <span class="wran-font"
                >*当年累计出货重量若超出之前购买额度，则需要补缴费用；若低于或等于已购重量，则无需补缴，默认按照已购重量进行年度申报。</span
              >
              <br />
              <span class="btF upload-btn" type="text" @click="calcRuleDialogVisible = true">
                <img src="@/assets/images/survey/uploadBlue.png" alt />
                查看补缴费用计价规则
              </span>

              <div class="btn-group">
                <Button class="keep" @click="calcAmount" v-if="eprDeclare.status == 1">计算金额</Button>
              </div>
            </template>
            <template v-else>
              <PackingDeclareProductInfo :value="productList" />
              <Table border :columns="columnsPackSummary" :data="summary.productResult"> </Table>
              <Row class="table-row">
                <Col :span="16" class="table-col">
                  <div class="grid-content">
                    * 注释： 如当年实际申报低于已购重量，则无需补缴，默认按照已购重量进行年度申报
                  </div>
                </Col>
                <Col :span="8" v-if="eprDeclare.status == 10" class="table-col">
                  <div class="grid-content">需补缴金额总计: 待人工核算， 1-2个工作日返回结果</div>
                </Col>
                <Col :span="4" v-if="eprDeclare.status != 10" class="table-col">
                  <div class="grid-content">
                    需补缴金额总计： {{ summary.toalPayAmount == -1 ? '' : summary.toalPayAmount }}
                  </div>
                </Col>

                <Col :span="4" v-if="[3, 7, 8].includes(eprDeclare.status)" class="table-col">
                  <div class="grid-content">
                    实际补缴金额总计： {{ summary.toalPayAmount == -1 ? '' : summary.toalPayAmount }}
                  </div>
                </Col>
              </Row>

              <div class="btn-group">
                <Button class="keep" @click="showCalc = true" v-if="eprDeclare.status == 1">重新填写</Button>
                <Button class="keep" @click="submitDeclare" v-if="eprDeclare.status == 1">确认提交</Button>
                <Button type="primary" @click="confirmPay" v-if="eprDeclare.status == 2">补缴费用 </Button>
              </div>
            </template>
          </template>

          <template v-if="counrtyCode == 'FR'">
            <template v-if="showCalc">
              <div style="padding: 20px">
                <span style="vertical-align: middle; margin-right: 10px"> 销售数量范围(CSU)</span>
                <RadioGroup v-model="eprDeclare.productCategoryType">
                  <Radio :label="1" :disabled="eprDeclare.status != 1">包装数(最外层包装CSU)量小于1W个</Radio>
                  <Radio :label="2" :disabled="eprDeclare.status != 1">包装数(最外层包装CSU)量1W-50W个</Radio>
                  <Radio :label="3" :disabled="eprDeclare.status != 1">包装数(最外层包装CSU)量超过50W个</Radio>
                </RadioGroup>
              </div>

              <div v-if="eprDeclare.productCategoryType == 1" class="tip-wrap">
                低于10000个包装数量（最外层包装数CSU）的不需要补缴回收费用，只需要完成申报即可。
              </div>

              <div v-if="eprDeclare.productCategoryType == 2" class="tip-wrap">
                提示：您需要申报具体的包装数量（最外层包装数CSU）与包装数量（最小包装数CU），补缴官费=包装数量（最小包装数CU）*
                单价 - 80欧元（注册时已缴纳）；
              </div>
              <div v-if="eprDeclare.productCategoryType == 3" class="tip-wrap">
                提醒：申报包装数量（最外层包装数CSU）大于
                50万需人工核算，点击按钮提交后进入款项待确认状态，联系客户经理线下收集申报数据。
              </div>

              <FrPackingProductDtos
                :value="productCategoryType == eprDeclare.productCategoryType ? productList : []"
                :showInPackage="eprDeclare.productCategoryType == 2"
                :supplierCode="supplierCode"
                v-if="eprDeclare.productCategoryType == 2 || eprDeclare.productCategoryType == 1"
                ref="packProRef"
              />
            </template>
            <template v-else>
              <div style="padding: 20px">
                <span style="vertical-align: middle; margin-right: 10px"> 销售数量范围(CSU)</span>
                <RadioGroup v-model="eprDeclare.productCategoryType">
                  <Radio :label="1" disabled>包装数(最外层包装CSU)量小于1W个</Radio>
                  <Radio :label="2" disabled>包装数(最外层包装CSU)量1W-50W个</Radio>
                  <Radio :label="3" disabled>包装数(最外层包装CSU)量超过50W个</Radio>
                </RadioGroup>
              </div>
              <Table
                border
                :columns="columnsFrPackSummary"
                :data="eprDeclare.productCategoryType == productCategoryType ? summary.frEprProductCateFeeList : []"
                v-if="eprDeclare.productCategoryType != 1"
              >
              </Table>
              <Table
                border
                :columns="columnsFrPackSummaryNoInpack"
                :data="JSON.parse(eprDeclare.infos)"
                v-if="eprDeclare.productCategoryType == 1"
              >
              </Table>
            </template>
            <div style="margin: 20px">
              <span v-if="summary.simulateurDetailFileUrl"
                >资料下载：
                <a
                  v-for="(img, i) in $util.convertImage(summary.simulateurDetailFileUrl)"
                  :key="i"
                  :href="img"
                  target="_blank"
                  >申请表下载</a
                ></span
              >

              <!-- <Tooltip
                placement="top"
                content="补交费用（非法国本土公司）=（回收费-优惠金额）*人民币汇率*手续费 补交费用（法国本土公司）=（回收费-优惠金额）*1.2*人民币汇率*手续费"
                max-width="490"
              >
                查看计算公式
              </Tooltip> -->
              <span style="float: right" v-if="productCategoryType == eprDeclare.productCategoryType"
                >需补缴费用：<span style="color='#f7a623'" v-if="eprDeclare.price == -1"
                  >待人工核算， 1-2个工作日返回结果</span
                >
                <span v-else>{{ eprDeclare.price }}元</span>
              </span>
            </div>
            <!-- <div style="text-align: right">
              <span style="color: #7f7f7f" v-if="eprDeclare.price != -1 && eprDeclare.productCategoryType != 1">
                （ 优惠金额：{{ calcMoneyConfig.discountAmount }} 欧、人民币汇率：{{
                  calcMoneyConfig.exchangeRate
                }}、手续费：{{ calcMoneyConfig.serviceCharge }}
                <span v-if="showIsLocalConpany">、本土公司加收20%</span>
                ）
              </span>
            </div> -->

            <div class="btn-group">
              <Button class="keep" @click="showCalc = true" v-if="eprDeclare.status == 1 && !showCalc">重新填写</Button>
              <Button class="keep" @click="calcFrAmount" v-if="showCalc && eprDeclare.productCategoryType != 3"
                >计算费用</Button
              >

              <Button
                type="primary"
                @click="frDeclareSubmit"
                v-if="eprDeclare.status == 1 && (!showCalc || eprDeclare.productCategoryType == 3)"
                >{{ eprDeclare.productCategoryType == 3 ? '确定提交人工核算' : '确认提交' }}</Button
              >
              <Button type="primary" @click="confirmPay" v-if="eprDeclare.status == 2">确认付款 </Button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <Modal v-model="historyBuyInfoDialog" width="860" footer-hide class="history-diag" title="查看历史购买产品信息">
      <div class="tipsModal-title" v-if="eprDeclare.type == 1">WEEE产品信息</div>
      <Table
        border
        :columns="counrtyCode === 'DE' ? columnsHisotryBuyDE : columnsHisotryBuy"
        :data="historyBuyInfoList"
        v-if="eprDeclare.type == 1"
      >
      </Table>

      <!-- <div class="tipsModal-title" v-if="eprDeclare.type == 1">德国电池法产品信息</div> -->
      <!-- <BatteryProductDtos :value="historyBuyInfoList" :disabled="true" v-if="eprDeclare.type == 3" /> -->
      <Table border :columns="columnBatHisDetail" :data="historyBuyInfoList" v-if="eprDeclare.type == 3"> </Table>
    </Modal>

    <YearHistoryDialog
      :yearHistoryDialogVisible.sync="yearHistoryDialogVisible"
      :yearHistoryList="yearHistoryList"
      :columns3="columnsSummary"
      :handleSummary="handleSummary"
    />
    <CalcRuleDialog :calcRuleDialogVisible.sync="calcRuleDialogVisible" :type="eprDeclare.type" />

    <Modal v-model="showDeclareReceipt" title="申报回执">
      <p style="margin-bottom: 5px">申报回执</p>
      <p v-for="(item, index) in declareReceiptList" :key="index" style="margin-bottom: 5px; margin-left: 32px">
        <a :href="replaceHttp(item)" target="_blank" style="color: #16ade9">
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
import {
  getDeclareDetail,
  queryDeclareHistoryList,
  queryYearHistoryList,
  getEprBJProduct,
  calcuDeclare,
} from '@/api/taxRegister.js';
import { getEprHistoryInfo } from '/xcloud-client-components-web/api/eprManage';
import { saveDeclareApi, submitDeclareApi } from '@/api/taxModule.js';
import { calcuFrDeclare, frDeclareSubmit, eprDeclareFrConfig, isLocalConpany } from '@/api/epr.js';
import TopSpeed from '../components/topSpeed.vue';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import EprAuthorizer from '../components/eprAuthorizer.vue';
import YearHistoryDialog from '../components/yearHistoryDialog.vue';
import CalcRuleDialog from '../components/calcRuleDialog.vue';
import FrPackingProductDtos from '../components/frPackingProductDtos.vue';
import EsBatteryProductDtos from '@comp/views/eprManage/components/esBatteryProductDtos.vue';

import moment from 'moment';
import {
  columnsHisotryBuy,
  columnsHisotryBuyDE,
  columnDetail,
  columnsSummary,
  columnsProduct,
  columnsProductDE,
  columnBatDetail,
  columnsBatSummary,
  columnBatHisDetail,
  columnsPackSummary,
  columnsFrPackSummary,
  columnsFrPackSummaryNoInpack,
  columnsFrColBattSummary,
  columnsFrBattSummary,
} from './eprDeclareTableConfig';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import BatteryProductDtos from '@/views/complianceBusiness/components/batteryProductDtos'; //电池法产品信息
import PackingDeclareProductDtos from '@/views/complianceBusiness/components/packingDeclareProductDtos'; //电池法产品信息
import PackingDeclareProductInfo from '@/views/complianceBusiness/components/packingDeclareProductInfo'; //包装法产品信息
import PackingProductDtos from '@/views/complianceBusiness/components/packingProductDtos'; // 包装法产品信息
import FrBatteryProductDtos from '@/views/complianceBusiness/components/frBatteryProductDtos'; //电池法产品信息
import FrBatteryColProductDtos from '@/views/complianceBusiness/components/frBatteryColProductDtos'; //电池法产品信息
import EsBatteryProductDeclare from '@comp/views/eprManage/components/esBatteryProductDeclare.vue';
import { EPRdeclareSuccess } from '@comp/api/eprManage';
import { newProductInfo } from '@/api/shoppingCar/shoppingCar';
import _ from 'lodash';

export default {
  components: {
    TopSpeed,
    DynamicForm,
    YearHistoryDialog,
    BatteryProductDtos,
    CalcRuleDialog,
    EprAuthorizer,
    FrPackingProductDtos,
    PackingDeclareProductDtos,
    PackingDeclareProductInfo,
    FrBatteryProductDtos,
    FrBatteryColProductDtos,
    PackingProductDtos,
    EsBatteryProductDtos,
    EsBatteryProductDeclare,
  },
  mixins: [isServiceCancel],
  data() {
    return {
      countryCode: '',
      showSubmit: true, //表单提交按钮
      showSave: true, //表单保存按钮
      fileDataReview: [],
      historyBuyInfoList: [],
      declareReceiptList: [],
      showDeclareReceipt: false,
      counrtyCode: '',
      productListVal: {},
      calcRuleDialogVisible: false,
      disabled: false,
      yearHistoryDialogVisible: false,
      historyBuyInfoDialog: false,
      columnsHisotryBuy: columnsHisotryBuy,
      columnsHisotryBuyDE,
      columnDetail: columnDetail,
      columnsSummary: columnsSummary,
      columnsPackSummary,
      columnBatDetail: columnBatDetail,
      columnsBatSummary: columnsBatSummary,
      columnsFrPackSummaryNoInpack,
      columnsProduct: columnsProduct,
      columnsProductDE,
      columnBatHisDetail: columnBatHisDetail,
      columnsFrPackSummary,
      columnsFrBattSummary,
      columnsFrColBattSummary,
      showIsLocalConpany: false,
      productList: [],
      infoNews: [],
      summary: [],
      productCategoryType: '',
      productCategoryList: [
        { value: '热交换器' },
        { value: '显示屏或屏幕大于100平方厘米的显示设备' },
        { value: '照明设备' },
        { value: '大型电子设备（能收缩到最短距离的长度超过50cm）' },
        { value: '小型电子电器设备（能收缩到最短距离的长度不超过50cm）' },
        { value: '小型IT和电信设备（外部尺寸不超过50cm）' },
      ],
      productCategoryListDE: [
        { value: '温度交换设备' },
        { value: '显示屏' },
        { value: '气体放电灯' },
        { value: '非气体放电灯' },
        { value: '大型非光伏设备（收缩后的单边最大尺寸>50cm）' },
        { value: '小型非光伏设备（收缩后的单边最大尺寸≤50cm）' },
        { value: '小型IT和电信设备（收缩后的单边最大尺寸≤50cm）' },
        { value: '大型光伏设备（收缩后的单边最大尺寸>50cm）' },
        { value: '小型光伏设备（收缩后的单边最大尺寸≤50cm）' },
      ],

      status: '',
      workNo: this.$route.query.workNo,
      serviceName: this.$route.query.serviceName,
      serviceNo: this.$route.query.serviceNo,
      pageType: 2,
      detailInfo: {},
      eprDeclare: {},
      supplierCode: '',

      // dataReview: [], // 表单回显数据
      info: {},
      orderServices: {},
      moduleList: [],
      detailObj: {},
      showCalc: true,
      nodeEnum: {
        WAIT_UPLOAD: 'NODE0060', //待上传资料
        WAIT_REVIEW: 'NODE0061', //待审核资料
        WAIT_AUTHORIZE: 'NODE0063', //待授权
        AUTHORIZE_WAIT_CONFIRM: 'NODE0064', //授权待确认
        REGISTERING: 'NODE0265', //转代理中
        REGISTER_COMPLETE: 'NODE0266', //转代理完成
      },
      // epr
      isEdit: false,
      yearHistoryList: [],
      calcMoneyConfig: {},
      forwardNodes: [
        { nodeCode: 0, nodeName: '未开始' },
        { nodeCode: 1, nodeName: '待上传资料' },
        { nodeCode: 10, nodeName: '款项待确认' },
        { nodeCode: 2, nodeName: '待补缴' },
        { nodeCode: -1, nodeName: '待申报' },
        { nodeCode: 7, nodeName: '申报中' },
        { nodeCode: 8, nodeName: '申报完成' },
      ],
      forwardNodes2: [
        { nodeCode: 0, nodeName: '未开始' },
        { nodeCode: 1, nodeName: '待上传资料' },
        { nodeCode: 2, nodeName: '待补缴' },
        { nodeCode: -1, nodeName: '待申报' },
        { nodeCode: 7, nodeName: '申报中' },
        { nodeCode: 8, nodeName: '申报完成' },
      ],
    };
  },
  computed: {
    orderStatus() {
      let index = this.forwardNodes.findIndex((item) => item.nodeCode === this.eprDeclare.status);
      if ([3, 4, 5, 6].includes(this.eprDeclare.status)) {
        return 4;
      }
      return index ? index : 0;
    },
    orderStatus2() {
      let index = this.forwardNodes2.findIndex((item) => item.nodeCode === this.eprDeclare.status);
      if ([3, 4, 5, 6].includes(this.eprDeclare.status)) {
        return 3;
      }
      return index ? index : 0;
    },

    timeOver() {
      return (
        this.counrtyCode == 'FR' &&
        this.eprDeclare.type == 3 &&
        moment(this.eprDeclare.due).valueOf() < moment().valueOf()
      );
    },

    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          let disabled = !this.isEdit;
          if (
            this.info.renewOrder &&
            this.info.nodeCode === this.nodeEnum.WAIT_UPLOAD &&
            ['shopNature', 'companyNameZh', 'companyCreditCode', 'companyPostCode', 'companyNameEn'].includes(
              item.keyName
            )
          ) {
            disabled = true;
          }
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', disabled);
          } else {
            item.disabled = disabled;
          }
        });
      });
      return this.moduleList;
    },
    showDeclareInfo() {
      if (this.eprDeclare.type == 1) {
        return this.summary.length && this.eprDeclare.status != 0;
      } else if (this.eprDeclare.type == 3 || this.eprDeclare.type == 2) {
        return this.eprDeclare.status != 0;
      }
    },
  },
  methods: {
    vailidDeclare() {
      let flag = true;
      if (this.eprDeclare.type == 1) {
        this.productList.forEach((item) => {
          if (item.saleWeight === '' || item.saleWeight == undefined) {
            flag = false;
          }
        });
      }

      return flag;
    },
    handlerInput(val) {
      this.productListVal = val;
    },
    async saveDeclare() {
      if (this.counrtyCode === 'ES') {
        await this.$refs.EsBatteryProductDtos.verify();
        const res = await EPRdeclareSuccess({workNo: this.eprDeclare.workNo})
        // 是否有待补缴的申报
        const fliterArr  = res.data.filter(item=> item.status === 2)
        if(fliterArr.length){
          const arr = fliterArr.map((item) => moment(item.beginTime).format('YYYY-MM-DD') + ' - ' + moment(item.endTime).format('YYYY-MM-DD'));
          this.$warning({
            title: '请先完成以下区间申报，区间申报的状态至少是“待申报”状态',
            content: (
              <div>
                {arr.map((v) => {
                  return <div>{v}</div>;
                })}
              </div>
            ),
          });
          return
        }
      }
      if (!this.vailidDeclare()) {
        this.$Message.error('请填写完整信息');
        return;
      }
      let params;
      if (this.eprDeclare.type == 1 || this.eprDeclare.type == 2) {
        params = {
          ...this.eprDeclare,
          infos: JSON.stringify(this.productList),
        };
      } else {
        params = {
          ...this.eprDeclare,
          infoNews: JSON.stringify(this.productList),
        };
      }
      saveDeclareApi(params).then((res) => {
        if (res.code === 0) {
          this.$Message.success('保存成功');
          if (this.eprDeclare.status == 4) {
            this.$router.push('/complianceBusiness/EPRDeclareList');
          }
          this.getDetail();
          this.showCalc = false;
        }
      });
    },
    validFrBatt() {
      let result = true;
      if (this.supplierCode == 'S000304') {
        this.productList.forEach((item, ind) => {
          if (!item.productType || !item.combination || !item.chargingType || !item.batteryType) {
            result = false;
          }
        });
        return result;
      }
      this.productList.forEach((item, ind) => {
        if (!item.manufacturerAttr || !item.combination || !item.household || !item.chargingType || !item.batteryType) {
          result = false;
        }
      });
      return result;
    },
    calcAmount() {
      if (this.counrtyCode == 'FR' && !this.validFrBatt()) {
        return this.$Message.error('请填写完整的信息');
      }
      calcuDeclare({
        ...this.eprDeclare,
        infos: this.counrtyCode == 'DE' ? JSON.stringify(this.productListVal) : JSON.stringify(this.productList),
        price: 0,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('保存成功');
          // if (this.eprDeclare.status == 4) {
          //   this.$router.push('/complianceBusiness/EPRDeclareList');
          // }
          this.getDetail();
          this.showCalc = false;
        }
      });
    },

    handleSpan({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex === 6 || columnIndex === 8) {
          return {
            rowspan: this.summary.infoNews.length,
            colspan: 1,
          };
        }
      } else {
        if (columnIndex === 6 || columnIndex === 8) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    frDeclareSubmit() {
      frDeclareSubmit({
        ...this.eprDeclare,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('保存成功');
          // if (this.eprDeclare.status == 4) {
          //   this.$router.push('/complianceBusiness/EPRDeclareList');
          // }
          this.getDetail();
          this.showCalc = false;
        }
      });
    },
    uploadTaxDeclareReceipt(declareReceipt) {
      const declareList = declareReceipt.split(',');

      if (declareList.length > 1) {
        this.declareReceiptList = declareList;
        this.showDeclareReceipt = true;
      } else {
        let url = this.replaceHttp(declareReceipt);

        window.open(url);
      }
    },
    replaceHttp(str) {
      return str.replace('http://', 'https://');
    },
    handleSummary({ columns, summary }) {
      const sums = {};
      const that = this;
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: '累计待补缴金额',
          };
          return;
        }
        if (key == 'price') {
          const v = that.eprDeclare.price;
          sums.price = {
            key: 'price',
            value: v,
          };
        } else {
          sums[key] = {
            key,
            value: '',
          };
        }
      });
      return sums;
    },

    handleFrBattSummary({ columns, summary }) {
      const sums = {};
      const that = this;
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: '总计',
          };
          return;
        }
        if (key == 'amount') {
          const v = that.summary.totalAmount;
          sums.amount = {
            key: 'amount',
            value: v,
          };
        } else {
          sums[key] = {
            key,
            value: '',
          };
        }
      });
      return sums;
    },

    seeHistoryBuyInfo() {
      getEprHistoryInfo({
        serviceId: this.info.eprDeclare.serviceId,
        year: moment(this.info.eprDeclare.beginTime).format('YYYY'),
      }).then((res) => {
        if (res.code === 0) {
          this.historyBuyInfoDialog = true;
          this.historyBuyInfoList = res.data;
        }
      });
    },
    calcFrAmount() {
      if (!this.eprDeclare.productCategoryType) {
        return this.$Message.error('请选择销售数量范围');
      }
      var list = this.$refs.packProRef.productList;
      var flag = true;

      list.forEach((item) => {
        if (item.parentProductCategoryName == '' || item.productCategoryId == '') {
          flag = false;
        }
      });

      if (!flag) {
        return this.$Message.error('请选择完整的产品信息');
      }

      calcuFrDeclare({
        ...this.eprDeclare,
        // infos: JSON.stringify(this.$refs.packProRef.productList),
        infos: JSON.stringify(list),
        price: 0,
        // summary: this.eprDeclare.productCategoryType == 1 ? '' : this.eprDeclare.summary,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('保存成功');
          this.getDetail();
          this.showCalc = false;
        }
      });
    },

    seeYearHistoryBuyInfo() {
      queryYearHistoryList({
        serviceId: this.orderServices.serviceId,
      }).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.yearHistoryList = res.data;
          this.yearHistoryDialogVisible = true;
        }
      });
    },
    submitDeclare() {
      submitDeclareApi({
        ...this.eprDeclare,
        infos: JSON.stringify(this.productList),
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('提交成功');
          this.getDetail();
        }
      });
    },
    async confirmPay() {
      let productId;
      let productSkuId;
      let productCategoryId;
      let productName = '';
      const batteryMap = {
        DE: '德国电池法申报补缴费用',
        FR: '法国电池法申报补缴费用',
        ES: '西班牙电池法申报补缴费用',
      }
      switch (this.eprDeclare.type) {
        case 1:
          productName = '德国WEEE申报补缴费';
          break;
        case 2:
          productName = this.counrtyCode == 'DE' ? '德国包装法申报补缴费用' : '法国包装法申报补缴费用';
          break;
        case 3:
          productName = batteryMap[this.counrtyCode];
          break;
      }
      let { code, data } = await newProductInfo({
        productName,
      });

      if (code === 0) {
        if (data && data.records && data.records.length) {
          productId = data.records[0].id;
          productSkuId = data.records[0].productSpecsDTOList[0].id;
          productCategoryId = data.records[0].productCategoryId;
        } else {
          this.$Message.error('暂无商品，请先添加商品!');
          return;
        }
      }
      const price = JSON.stringify(this.eprDeclare.price) != '{}' ? this.eprDeclare.price : this.summary.toalPayAmount;
      const buyProduct = {
        productPaymentMoney: price,
        productAmount: 1,
        price: price,
        quantity: 1,
        productAmount: 1,
        productName,
        productId: productId,
        productSkuId: productSkuId,
        productCategoryId: productCategoryId,
        countryCode: this.counrtyCode,
        countryName: this.counrtyCode == 'DE' ? '德国' : '法国',
        workNo: this.workNo,
        wordType: 'epr',
        serviceId: this.eprDeclare.serviceId,
      };
      const list = [buyProduct];
      localStorage.setItem('selectedList', JSON.stringify(list));
      localStorage.setItem('productInfo', JSON.stringify(buyProduct));
      // productInfo
      this.$router.push({
        path: '/sureOrder',
        query: {
          from: 'productDetails',
        },
      });
    },
    getDetail() {
      let data = {
        workNo: this.workNo,
      };
      getDeclareDetail(data).then((res) => {
        if (res.code === 0) {
          this.info = res.data;
          localStorage.workflowId = this.info.flowId || this.info.workflowId;
          this.counrtyCode = res.data.counrtyCode;
          this.productCategoryType = res.data.eprDeclare.productCategoryType;
          this.orderServices = res.data.eprWorkOrder;
          res.data.eprDeclare.price = Number(res.data.eprDeclare.price) || 0;
          this.eprDeclare = { ...res.data.eprDeclare, countryCode: res.data.counrtyCode };
          this.ifCancel(res.data.eprWorkOrder.status);
          this.detailObj = res.data;
          if (this.eprDeclare.status != 1) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
          if (res.data.counrtyCode == 'FR') {
            this.supplierCode = res.data.supplierCode;
            this.getEprDeclareFrConfig(res.data.supplierCode);
            if (res.data.eprDeclare.type == 2) {
              this.getIsLocalConpany(res.data.eprDeclare.serviceId);
            }
          }
          if (res.data.eprDeclare.infos) {
            this.productList = JSON.parse(res.data.eprDeclare.infos);
          }
          if (res.data.eprDeclare.summary) {
            this.summary = JSON.parse(res.data.eprDeclare.summary);
          }
          if (res.data.eprDeclare.status != 1 && this.eprDeclare.type == 2) {
            this.showCalc = false;
          }
          if (res.data.eprDeclare.infoNews && this.eprDeclare.type == 3) {
            this.infoNews = JSON.parse(res.data.eprDeclare.infoNews);
            this.productList = JSON.parse(res.data.eprDeclare.infoNews);
          }
          if (res.data.dataReview && res.data.dataReview.length > 0) {
            this.moduleList = res.data.dataReview.filter((item) => item.moduleCode != 'productInfo');
          }
          if (this.showCalc && !this.eprDeclare.productCategoryType) {
            this.eprDeclare.productCategoryType = 1;
          }

          this.status = res.data.nodeCode;
          if (this.eprDeclare.type == 1) {
            if (this.summary.length && this.eprDeclare.status != 0) {
              this.pageType = 1;
            } else {
              this.pageType = 2;
            }
          } else {
            if (this.eprDeclare.status == 0) {
              this.pageType = 2;
            } else {
              this.pageType = 1;
            }
          }
        }
      });
    },
    getEprDeclareFrConfig(supplierCode) {
      eprDeclareFrConfig({ supplierCode }).then((res) => {
        if (res.code === 0) {
          this.calcMoneyConfig = res.data;
        }
      });
    },
    getIsLocalConpany(serviceId) {
      isLocalConpany({ serviceId }).then((res) => {
        if (res.code === 0) {
          this.showIsLocalConpany = res.data;
        }
      });
    },
  },
  created() {
    this.getDetail();
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
@import './style/EPRDeclareDetails.less';

</style>
