<template>
  <div class="app-container">
    <div class="productBox" style="margin-bottom: 65px">
      <el-form label-width="110px" :model="orderForm" ref="baseFrom" inline>
        <!-- 基础信息 -->
        <div class="baseInfo">
          <h3 class="title">{{ enterpriseName }} 录单</h3>
          <el-form-item
            label="客户手机号："
            prop="userMobile"
            :rules="[
              { required: true, message: '请输入客户手机', trigger: 'blur' },
              { required: true, pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误', trigger: 'change' },
            ]"
          >
            <el-autocomplete :disabled="isExchange || isRenewalOrder" :maxlength="11" v-model="orderForm.userMobile" :fetch-suggestions="querySearchAsync" hide-loading placeholder="请输入已注册的手机号" @select="listByMobile()" style="width: 300px"></el-autocomplete>
          </el-form-item>
          <el-form-item label="" prop="orderType" style="margin-top: -2px" :rules="[{ required: true, message: '请选择订单类型', trigger: 'change' }]">
            <el-radio-group :disabled="isExchange" v-model="orderForm.orderType" @change="orderTypeChange">
              <el-tooltip content="在指导价范围内的订单" placement="top">
                <el-radio-button :label="ORDERTYPE.NORMAL">正常订单</el-radio-button>
              </el-tooltip>
              <el-tooltip content="低于正常活动价的订单" placement="top">
                <el-radio-button :label="ORDERTYPE.PROJECT">项目制订单</el-radio-button>
              </el-tooltip>
              <el-tooltip content="高于指导价的订单" placement="top">
                <el-radio-button :label="ORDERTYPE.PREMIUM">溢价订单</el-radio-button>
              </el-tooltip>
              <el-radio-button :label="ORDERTYPE.EXCHANGE" v-if="isExchange">退换货订单</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="paymentType" style="margin-top: -2px" :rules="[{ required: true, message: '请选择付款类型', trigger: 'change' }]">
            <el-radio-group :disabled="isExchange" v-model="orderForm.paymentType" clearable @change="changePayType">
              <el-radio-button border :label="PAYMENTTYPE.NORMAL">正常付款</el-radio-button>
              <el-radio-button :label="PAYMENTTYPE.PART">分期付款</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分期金额：" v-if="orderForm.paymentType == PAYMENTTYPE.PART" prop="instalmentMoney" :rules="[{ required: true, message: '请输入分期金额', trigger: 'change' }]">
            <el-input-number v-model="orderForm.instalmentMoney" controls-position="right" :min="0" :precision="2" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="备注说明" prop="remark" :rules="[{ max: 500, message: '不能超过500个字符', trigger: 'blur' }]">
            <el-input type="textarea" placeholder="请输入" :rows="1" v-model="orderForm.remark" show-word-limit style="width: 300px"></el-input>
          </el-form-item>
        </div>
        <!-- 国内默认开票，不可选，国际不开税率0 -->
        <!-- <div class="baseInfo" v-show="orderForm.paymentType !== PAYMENTTYPE.PART">
          <div class="title-wrapper">
            <h3 class="title">
              开发票
              <span class="title-subtitle">
                <span v-if="!hasInvoice">支持后补开票</span>
                <el-tag type="success" v-else>{{ invoiceTypeStr }}</el-tag>
              </span>
            </h3>
            <div>
              <span style="margin-right: 5px">{{ hasInvoice ? '' : '暂不' }}开票</span><el-switch v-model="hasInvoice" @change="openInvoice" :disabled="isExchange"></el-switch>
            </div>
          </div>
          <div v-if="hasInvoice">
            <div class="tips" v-if="rateType > 0">
              提示：该开票类型税点为<span class="tips-light">{{ rateType }}% </span>，仅支持<span class="tips-light">{{ paymentStr }}</span
              >进行支付
            </div>
            <div class="tips" v-else>提示：该开票类型税点为 0 ，无需支付税金</div>

            <el-form label-width="110px" :model="invoiceFrom" ref="invoiceFrom" inline>
              <el-form-item label="开票类型：" v-show="orderForm.paymentType === PAYMENTTYPE.NORMAL" :rules="[{ required: true, message: '请选择开票类型', trigger: 'change' }]">
                <el-select placeholder="请选择" :disabled="isExchange" style="width: 300px" v-model="orderForm.invoiceType">
                  <el-option label="增值税专用发票" :value="4"></el-option>
                  <el-option label="增值税普通发票（个人）" :value="2"></el-option>
                  <el-option label="增值税普通发票（公司）" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <template v-if="orderForm.invoiceType === 4">
                <el-form-item label="公司名称：" prop="name" :rules="[{ required: true, message: '请输入公司名称', trigger: 'blur' }]">
                  <el-input placeholder="请输入" clearable size="small" style="width: 300px" v-model="invoiceFrom.name" />
                </el-form-item>
                <el-form-item label="纳税识别号：" prop="idOrTaxNumber" :rules="[{ required: true, message: '请输入纳税识别号', trigger: 'blur' }]">
                  <el-input placeholder="请输入" clearable style="width: 300px" size="small" v-model="invoiceFrom.idOrTaxNumber" />
                </el-form-item>
                <el-form-item label="开户银行：" prop="openingBank" :rules="[{ required: true, message: '请输入开户银行', trigger: 'blur' }]">
                  <el-input placeholder="请输入" clearable style="width: 300px" size="small" v-model="invoiceFrom.openingBank" />
                </el-form-item>
                <el-form-item label="开户卡号：" prop="bankAccount" :rules="[{ required: true, message: '请输入开户卡号', trigger: 'blur' }]">
                  <el-input placeholder="请输入" clearable style="width: 300px" size="small" v-model="invoiceFrom.bankAccount" />
                </el-form-item>
                <el-form-item label="公司电话：" prop="companyTel" :rules="[{ required: true, message: '请输入公司电话', trigger: 'blur' }]">
                  <el-input placeholder="请输入" clearable style="width: 300px" :maxlength="20" size="small" v-model="invoiceFrom.companyTel" />
                </el-form-item>
                <el-form-item label="公司地址：" prop="companyAddress" :rules="[{ required: true, message: '请输入公司地址', trigger: 'blur' }]">
                  <el-input placeholder="请输入" clearable style="width: 300px" size="small" v-model="invoiceFrom.companyAddress" />
                </el-form-item>
              </template>
              <template v-if="orderForm.invoiceType === 2">
                <el-form-item label="姓名：" prop="name" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
                  <el-input placeholder="请输入姓名" clearable size="small" style="width: 300px" v-model="invoiceFrom.name" />
                </el-form-item>
                <el-form-item label="身份证号码：" prop="idOrTaxNumber" :rules="[{ required: true, message: '请输入身份证号码', trigger: 'blur' }]">
                  <el-input placeholder="请输入身份证号码" clearable size="small" style="width: 300px" v-model="invoiceFrom.idOrTaxNumber" />
                </el-form-item>
              </template>
              <template v-if="orderForm.invoiceType === 3">
                <el-form-item label="公司名称：" prop="name" :rules="[{ required: true, message: '请输入公司名称', trigger: 'blur' }]">
                  <el-input placeholder="请输入公司名称" clearable size="small" style="width: 300px" v-model="invoiceFrom.name" />
                </el-form-item>
                <el-form-item label="纳税识别号：" prop="idOrTaxNumber" :rules="[{ required: true, message: '请输入纳税识别号', trigger: 'blur' }]">
                  <el-input placeholder="请输入纳税识别号" clearable size="small" style="width: 300px" v-model="invoiceFrom.idOrTaxNumber" />
                </el-form-item>
              </template>
            </el-form>
          </div>
        </div> -->
        <div class="baseInfo">
          <div class="signed" v-if="needSign === true">
            <div class="title-wrapper">
              <h3 class="title">签合同<span class="title-subtitle" v-show="!hasContract">支持后补签约</span></h3>
              <div>
                <span style="margin-right: 5px">{{ hasContract ? '' : '暂不' }}签约</span><el-switch v-model="hasContract"></el-switch>
              </div>
            </div>
            <div v-if="hasContract">
              <el-form inline :model="signDto" ref="signForm">
                <el-form-item label="签订方式：" prop="contractSignType" label-width="100px">
                  <el-radio-group v-model="signDto.contractSignType">
                    <el-radio-button border :label="SIGNEM.ONLINE">线上签约</el-radio-button>
                    <el-radio-button :label="SIGNEM.OFFLINE">线下签约</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="签订主体" prop="contractSubjectType" :rules="[{ required: true, message: '请选择签订主体', trigger: 'change' }]">
                  <el-select v-model="signDto.contractSubjectType" placeholder="请选择" style="width: 100px; margin-right: -10px">
                    <el-option label="企业签订" value="ENTERPRISE"></el-option>
                    <el-option label="个人签订" value="PERSON" :disabled="signTypeRadioDisabled"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="">
                  <ChoiceSignInfo ref="choiceSignInfo" v-bind="$attrs" :signDto="signDto" :orderForm="orderForm" @changeContractSubjectId="changeContractSubjectId" @changeName="(name) => (contractName = name)" />
                </el-form-item>
                <el-form-item v-if="signDto.contractSignType == SIGNEM.ONLINE" label="合同模板：" prop="templateId" :rules="[{ required: true, message: '请选择合同模板', trigger: 'change' }]">
                  <el-select placeholder="请选择" style="width: 300px" clearable filterable v-model="signDto.templateId" :rules="[{ required: true, message: '请选择合同模板', trigger: 'blur' }]">
                    <el-option v-for="(item, index) in signTemplatesList" :key="index" :label="item.templateName" :value="item.templateId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-else label="合同文件：" prop="contract" :rules="[{ required: true, message: '请上传合同文件', trigger: 'change' }]">
                  <UploadFileUrl :drag="true" :showTip="false" fileClass uploadText="上传合同" :fileList.sync="signDto.contract" :maxSize="20"> </UploadFileUrl>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>

        <!-- 退换货商品信息 -->
        <div class="productInfo" v-if="isExchange">
          <h3 class="title">可退商品</h3>
          <el-table class="exchange-table" :data="refundData" :span-method="objectSpanMethod" height="200" border style="width: 100%" @selection-change="handleSelectionChange2">
            <el-table-column type="selection" prop="selectionCol" width="55" align="center" :selectable="selected"> </el-table-column>

            <el-table-column label="序号" align="center" width="70" prop="orderIndex">
              <template slot-scope="scope">{{ scope.row.ind + 1 }}</template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" width="200" prop="productName">
              <template slot-scope="scope">{{ scope.row.serviceName || scope.row.productName }}</template>
            </el-table-column>
            <el-table-column align="center" label="国家" width="100" prop="countryName"></el-table-column>
            <el-table-column align="center" label="服务项目" width="150" prop="specsName"></el-table-column>
            <el-table-column align="center" label="商品金额">
              <template slot-scope="scope"> ￥{{ scope.row.productMoney | formatQianFenWei }} </template>
            </el-table-column>
            <el-table-column align="center" label="优惠金额">
              <template slot-scope="scope"> ￥{{ scope.row.discountMoney | formatQianFenWei }} </template>
            </el-table-column>
            <el-table-column align="center" label="商品售价">
              <template slot-scope="scope"> ￥{{ scope.row.productPaymentMoney | formatQianFenWei }} </template>
            </el-table-column>
            <el-table-column align="center" label="商品实付金额">
              <template slot-scope="scope"> ￥{{ scope.row.productPaidMoney | formatQianFenWei }} </template>
            </el-table-column>
            <el-table-column align="center" label="付款状态" prop="price">
              <template slot-scope="scope">
                {{ scope.row.paymentStatus }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="服务公司名称" min-width="150" prop="serviceCompanyName"></el-table-column>
            <el-table-column align="center" label="服务号" width="100" prop="serviceNo"></el-table-column>
            <el-table-column align="center" label="服务进度" width="100" prop="serviceProgressName"></el-table-column>
            <el-table-column align="center" label="服务状态" width="100" prop="serviceStatusName"></el-table-column>
          </el-table>
        </div>

        <!-- 商品信息 -->
        <div class="productInfo" v-if="!isRenewal">
          <div class="title-wrapper">
            <h3 class="title" v-if="isExchange">换货商品</h3>
            <h3 class="title" v-else>
              商品信息
              <span class="title-subtitle"><el-tag type="success">正常商品</el-tag></span>
            </h3>
            <div>
              <span style="margin-right: 5px">{{ orderForm.renewFlag === 1 ? '' : '非' }}续费订单</span><el-switch v-model="orderForm.renewFlag" :active-value="1" :inactive-value="0" @change="changeRenewFlag"></el-switch>
            </div>
          </div>
          <div class="title-wrapper" style="margin-bottom: 10px">
            <el-button type="primary" @click="addProductDialog = true">
              <i class="icon icon-adds"></i>
              添加商品
            </el-button>
            <!-- <el-link type="primary" @click="fullScreen"> <i class="el-icon-full-screen"></i>全屏模式</el-link> -->
          </div>
          <el-table id="goodsInfo" ref="goodsInfo" :data="tableData" height="250" border style="width: 100%">
            <el-table-column label="序号" align="center" width="70">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" width="300">
              <template slot-scope="scope">{{ scope.row.productName }}</template>
            </el-table-column>
            <el-table-column align="center" label="国家" width="150">
              <template slot-scope="scope">{{ scope.row.countryName }}</template>
            </el-table-column>
            <el-table-column align="center" label="服务项目" width="150">
              <template slot-scope="scope">{{ scope.row.serviceName }}</template>
            </el-table-column>
            <el-table-column align="center" label="商品金额" width="200">
              <template slot="header">
                商品金额
                <el-tooltip class="item" effect="dark" content="鼠标经过可查看指导价" placement="top-start">
                  <i class="el-icon-question text-warning"></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="`指导价：￥${scope.row.rangeMinPrice} - ${scope.row.rangeMaxPrice}`" placement="top-start">
                  <span>￥{{ scope.row.productOldMoney | formatQianFenWei }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量" width="200">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.quantity" :min="1" :max="100" controls-position="right" clearable size="small" @change="changeNum($event, scope.$index)"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" label="应付金额" width="200" fixed="right">
              <template slot="header">
                应付金额
                <el-tooltip class="item" effect="dark" content="客户实际支付金额" placement="top-start">
                  <i class="el-icon-question text-warning"></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.productPaymentMoney" :min="0" :active-change="false" :precision="2" controls-position="right" clearable size="small" @change="sellingPrice($event, scope.$index)"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" label="* 服务公司" width="200" fixed="right">
              <template slot-scope="scope">
                <el-form :model="scope.row" :rules="formRules" ref="tableRef">
                  <el-form-item prop="serviceCompanyName" style="margin: 0 !important">
                    <el-select v-model="scope.row.serviceCompanyName" filterable allow-create default-first-option placeholder="请输入服务公司" @visible-change="listByMobile()" @change="getCompanyId($event, scope.$index)">
                      <el-option v-for="(item, index) in companyList" :key="index" :label="item.companyName" :value="item.companyName"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center" label="商机编号" width="200" fixed="right">
              <template slot-scope="scope">
                <el-select v-model="scope.row.opportunityNo" filterable clearable>
                  <el-option-group style="width: 420px">
                    <div class="option-title">
                      <span>企微主体</span>
                      <span>商机编号</span>
                      <span>商机名称</span>
                      <span>对接人</span>
                    </div>
                    <el-option v-for="(item, index) in opportunityList" :key="index" :label="item.opportunityNo" :value="item.opportunityNo" class="option-li">
                      <span>{{ item.enterpriseName }}</span>
                      <span>{{ item.opportunityNo }}</span>
                      <span>{{ item.businessName }}</span>
                      <span>{{ item.nickName }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="copyProduct(scope.row)">复制</el-link>
                <el-link type="primary" :underline="false" @click="handleDelet(scope.row)" v-if="!scope.row.serviceId">删除</el-link>
                <el-link type="primary" :underline="false" @click="showDelDialog(scope.row)" v-else>删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 续费订单商品信息 -->
        <div class="renewalInfo" :class="showfullDialog ? 'fullscreen' : ''" v-if="isRenewal">
          <div class="title-wrapper">
            <h3 class="title">
              商品信息

              <span class="title-subtitle" v-if="renewalList.length"
                ><el-tag>总共有 {{ renewalList.length }} 个续费商品</el-tag></span
              >
              <span class="title-subtitle" v-else><el-tag>暂无续费商品</el-tag></span>
            </h3>
            <div v-if="!isRenewalOrder">
              <span style="margin-right: 5px">{{ orderForm.renewFlag === 1 ? '' : '非' }}续费订单</span>

              <el-switch v-model="orderForm.renewFlag" :active-value="1" :inactive-value="0" @change="changeRenewFlag" v-show="!showfullDialog"></el-switch>
            </div>
          </div>
          <!-- <p class="mb-10">注：如找不到续费商品请先联系对应的商品经理；VAT注册完成、IOSS注册完成、转代理完成、英代/欧代注册完成这些状态下才可支持续费</p> -->

          <!-- <span style="margin-right: 10px">公司名称</span>
          <el-select class="mr-10 mb-20" style="width: 168px" v-model="companyNameList" placeholder="请选择公司" clearable multiple filterable>
            <el-option v-for="item in signSubjectList" :value="item.companyName" :key="item.contractSubjectId" :label="item.companyName"></el-option>
          </el-select> -->
          <el-form ref="searchForm" :model="searchForm" label-width="110px" inline v-if="!isRenewalOrder">
            <el-form-item label="公司名称">
              <el-select class="mr-10 mb-20" style="width: 168px" v-model="searchForm.companyNameList" placeholder="请选择公司" clearable multiple filterable>
                <el-option v-for="item in signSubjectList" :value="item" :key="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家">
              <el-select clearable style="width: 168px" v-model="searchForm.countryCodeList" multiple placeholder="国家" filterable>
                <el-option v-for="(item, index) in countryList" :value="item.countryCode" :label="item.countryNameZh" :key="index"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="服务截止时间">
              <el-date-picker type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" v-model="searchForm.expirationTime" style="width: 340px"></el-date-picker>
            </el-form-item>

            <el-form-item label="服务号">
              <el-input v-model="searchForm.serviceNo" clearable placeholder="服务号" style="wwidth: 168px" />
            </el-form-item>

            <el-button type="primary" @click="getRenewalList">搜索</el-button>
            <el-button @click="reset">重置</el-button>

            <el-button @click="showfullDialog = !showfullDialog">
              {{ showfullDialog ? '退出全屏' : '全屏' }}
              <!-- <img src="@/assets/icons/icon_fullScreen.svg" alt="" /> -->
            </el-button>
          </el-form>

          <div style="float: right"></div>

          <el-table ref="renewalTable" row-key="serviceId" :row-class-name="tableRowClassName" :data="renewalList" :height="showfullDialog ? 'calc(100vh - 150px)' : 250" border style="width: 100%" @selection-change="handleSelectionChange">
            <div slot="empty">该客户暂无可续费的商品</div>
            <el-table-column label="序号" align="center" width="70">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" width="300">
              <template slot-scope="scope">{{ scope.row.productName }}</template>
            </el-table-column>
            <el-table-column align="center" label="国家" width="150">
              <template slot-scope="scope">{{ scope.row.countryNameZh }}</template>
            </el-table-column>
            <el-table-column align="center" :label="isRenewalOrder ? '续费服务' : '服务项目'" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.serviceName }}</span>
                <!-- EPR注册：31, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108: -->
                <el-link type="primary" :underline="false" v-if="scope.row.supportRenewProductSpecs.length > 1 && [31, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(scope.row.productFunctionCode)" @click="changeRenewalProductSku(scope.row, scope.$index)">修改</el-link>
              </template>
            </el-table-column>
            <el-table-column align="center" label="服务截止日期" width="150">
              <template slot-scope="scope">{{ $util.formatDateTime(scope.row.expirationTime) }}</template>
            </el-table-column>
            <el-table-column align="center" label="剩余服务时间" width="150" v-if="!isRenewalOrder">
              <template slot-scope="scope">{{ scope.row.expirationTime | filterRestTime }}</template>
            </el-table-column>
            <el-table-column align="center" label="服务状态" width="150">
              <template slot-scope="scope">{{ scope.row.status | serviceStatus }}</template>
            </el-table-column>
            <el-table-column align="center" :label="isRenewalOrder ? '优惠' : '优惠金额'" width="150">
              <template slot-scope="scope">{{ scope.row.activityType | filterDiscount(scope.row.activityContent) }}</template>
            </el-table-column>
            <el-table-column align="center" label="服务金额（元）" width="150">
              <template slot-scope="scope">
                <div class="old-price" v-if="scope.row.activityType">{{ scope.row.productPaymentMoney }}</div>
                <div class="new-price">{{ scope.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量" width="100">
              <template slot-scope="scope">{{ scope.row.quantity }}</template>
            </el-table-column>
            <el-table-column align="center" :label="isRenewalOrder ? '应付金额' : '实际售价（元）'" width="200" fixed="right">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.productPrice" :min="0" :active-change="false" :precision="2" controls-position="right" clearable size="small" @change="changeRenewalPrice(scope.row, scope.$index)"></el-input-number>
              </template>
            </el-table-column>
            <template v-if="isRenewalOrder">
              <el-table-column prop="serviceNo" align="center" label="服务号" width="200"></el-table-column>
              <el-table-column prop="companyNameZh" align="center" label="服务公司" width="200"></el-table-column>
            </template>
            <el-table-column align="center" label="商机编号" width="200" fixed="right">
              <template slot-scope="scope">
                <el-select v-model="scope.row.opportunityNo" filterable clearable>
                  <el-option-group style="width: 420px">
                    <div class="option-title">
                      <span>企微主体</span>
                      <span>商机编号</span>
                      <span>商机名称</span>
                      <span>对接人</span>
                    </div>
                    <el-option v-for="(item, index) in opportunityList" :key="index" :label="item.opportunityNo" :value="item.opportunityNo" class="option-li">
                      <span>{{ item.enterpriseName }}</span>
                      <span>{{ item.opportunityNo }}</span>
                      <span>{{ item.businessName }}</span>
                      <span>{{ item.nickName }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </template>
            </el-table-column>
            <template v-if="!isRenewalOrder">
              <el-table-column prop="serviceNo" align="center" label="服务号" width="200"></el-table-column>
              <el-table-column prop="companyNameZh" align="center" label="服务公司" width="200"></el-table-column>
            </template>
            <el-table-column type="selection" :selectable="selectable" align="center" label="操作" width="100" fixed="right" v-if="!isRenewalOrder"> </el-table-column>
          </el-table>
        </div>

        <!-- <div class="baseInfo" style="padding-bottom: 20px">
          <h3 class="title">商机信息<span class="title-subtitle">请在企微上查到对应的商机编号进行填写</span></h3>
          <el-form>
            <el-form-item label="商机编号" prop="opportunityNo">
              <el-select v-model="orderForm.opportunityNo" filterable clearable>
                <el-option :label="item.opportunityNo" :value="item.opportunityNo" v-for="item in opportunityList" :key="item.opportunityNo"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div> -->

        <div class="baseInfo">
          <div class="title-wrapper">
            <h3 class="title">
              收款方式
              <!-- {{ orderPayMethod }} {{ reCreate }} -->
            </h3>
          </div>

          <!-- 退换货随便选支付方式 默认原来的 -->
          <div style="height: 40px" class="overseapayradio">
            <!-- :disabled="orderPayMethod !== '' && reCreate !== 'true'" -->
            <el-radio-group v-model="payMethod">
              <el-radio-button label="CHN_PAY">国内支付</el-radio-button>
              <el-radio-button label="INTL_PAY">国际支付(免税)</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <el-dialog class="el-dialog-del" :visible.sync="showDel" @close="delFormReset" width="504px">
          <div slot="title">
            <i class="icon icon-dialog-tip"></i>
            <span>提示</span>
          </div>
          <div class="text-tip">
            <i class="icon icon-tip"></i>
            <span>该服务项目已经生成服务工单，删除服务项目会同步取消服务工单，需要提前与交付沟通再删除</span>
          </div>
          <el-form :model="delForm" :rules="delRules" ref="delRef">
            <el-form-item label="审核凭证" prop="delAuditFile">
              <UploadFileUrl :fileList.sync="delForm.delAuditFile" fileClass :showTip="false"></UploadFileUrl>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" style="width: 65px" type="default" @click="showDel = false">取消</el-button>
            <el-button size="small" style="width: 65px" type="primary" @click="delConfirm">确定</el-button>
          </div>
        </el-dialog>
      </el-form>
    </div>

    <el-form class="totalProduct" inline>
      <div style="margin-top: 19px">
        <!-- 非退换货 -->
        <template v-if="!isExchange">
          <el-form-item>
            <span slot="label">共 {{ isRenewal ? checkedRenewalList.length : tableData.length }} 件服务商品</span>
          </el-form-item>
          <!-- {{ payMethod }} -->
          <!-- 判断：收款方式 23.5.5版本
          （1）收款方式 = 国内支付；税率取主体对应税率；自动计算“税额”；默认 开票 发票类型=增值税专用发票，生成 发票记录表 状态 为 “待补充信息” ，开票信息全部候补
          （2）收款方式 = 国际支付；税率默认为0，税额默认为0；默认 开票 发票类型=增值税专用发票，生成 发票记录表 状态 为 “待补充信息” ，开票信息全部候补 -->
          <template v-if="payMethod === 'CHN_PAY'">
            <el-form-item label="订单金额：">{{ productPrice.servicePrice | formatQianFenWei }}元</el-form-item>
            <el-form-item label="优惠金额：">{{ (productPrice.discountedPrice > 0 ? productPrice.discountedPrice : 0) | formatQianFenWei }}元</el-form-item>
            <el-form-item label="税率：">{{ rateType }}%</el-form-item>
            <el-form-item label="税额：">{{ productPrice.invoicePrice | subStringNum }}元</el-form-item>
            <el-form-item label="总应付金额：">{{ productPrice.totalPrice | subStringNum }}元</el-form-item>
          </template>
          <template v-if="payMethod === 'INTL_PAY'">
            <el-form-item label="订单金额：">{{ productPrice.servicePrice | formatQianFenWei }}元</el-form-item>
            <el-form-item label="优惠金额：">{{ (productPrice.discountedPrice > 0 ? productPrice.discountedPrice : 0) | formatQianFenWei }}元</el-form-item>
            <el-form-item label="税率：">免税</el-form-item>
            <el-form-item label="税额：">0.00 元</el-form-item>
            <el-form-item label="总应付金额：">{{ productPrice.totalPrice | subStringNum }}元</el-form-item>
          </template>
        </template>
        <template v-else>
          <el-form-item>
            <span slot="label">共 {{ isRenewal ? checkedRenewalList.length : tableData.length }} 件商品</span>
          </el-form-item>
          <div class="price-wrapper">
            <div>
              <el-form-item label="商品总售价：">{{ productPrice.servicePrice | formatQianFenWei }}</el-form-item>
              <el-form-item label="优惠金额：">{{ (productPrice.discountedPrice > 0 ? productPrice.discountedPrice : 0) | formatQianFenWei }}</el-form-item>
              <el-form-item label="总应收金额：">{{ productPrice.totalPrice | subStringNum }}</el-form-item>
              <el-form-item label="退货金额：">{{ refundPaidPrice | formatQianFenWei }}</el-form-item>
              <el-form-item label="换货金额：">{{ productPrice.totalPrice | formatQianFenWei }}</el-form-item>
              <!-- 退换货录单，需补差价时差价应计算税额,税额=尾款金额*税率 ,换货商品价格小于可退商品，不显示税率-->
              <el-form-item label="税额" v-if="payMethod === 'INTL_PAY'">￥ 0.00</el-form-item>
              <el-form-item label="税额" v-else v-show="taxAmount > 0">￥{{ taxAmount | subStringNum }}</el-form-item>
              <el-form-item label="尾款金额：" v-if="restPrice >= 0">{{ restPrice | subStringNum }}</el-form-item>
              <el-form-item label="退款金额：" v-else>{{ -restPrice | subStringNum }}</el-form-item>
            </div>
          </div>
        </template>
        <el-form-item style="float: right">
          <el-button type="primary" :loading="loading" @click="submitAdd" size="small" v-show="hasAuthority('C2_5')" v-if="!isExchange"> 提交 </el-button>
          <template v-else>
            <el-button type="primary" :loading="loading" @click="submitAdd" size="small" v-show="hasAuthority('C2_5')" v-if="!tableData.length || restPrice >= 0"> 提交 </el-button>
            <el-button type="primary" @click="submitAdd" size="small" v-else> 选择退款方式 </el-button>
          </template>
          <el-button type="primary" @click="addStash" v-if="!isExchange && !$route.query.id && !isRenewalOrder && hasAuthority('C2_6')">暂存</el-button>
          <el-button @click="goBack" v-if="hasAuthority('C2_6')">取消</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-dialog title="订单确认" :visible.sync="showConfirmDialog" width="980px" center>
      <div class="exchange-dialog-tip">提示：该订单为{{ orderForm.orderType | orderTypeFilter }}，请仔细核对后进行提交</div>

      <p class="tip-title">基本信息</p>
      <el-descriptions :column="3">
        <el-descriptions-item label="所属公司">{{ enterpriseName }}</el-descriptions-item>
        <el-descriptions-item label="是否续费">{{ isRenewal ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="签订方式" v-if="hasContract">{{ signDto.contractSignType | signType }}</el-descriptions-item>

        <el-descriptions-item label="客户手机号">{{ orderForm.userMobile }}</el-descriptions-item>
        <el-descriptions-item label="付款类型">{{ orderForm.paymentType == 'NORMAL' ? '正常付款' : orderForm.paymentType == 'PART' ? '分期付款' : '' }}</el-descriptions-item>
        <el-descriptions-item label="签订主体" v-if="hasContract">{{ contractName }}</el-descriptions-item>

        <!-- <el-descriptions-item label="开票类型">{{ orderForm.invoiceType | invoiceTypeFilter(hasInvoice) }}</el-descriptions-item> -->
        <el-descriptions-item label="订单类型">{{ orderForm.orderType | orderTypeFilter }}</el-descriptions-item>
        <el-descriptions-item label="合同模板" v-if="hasContract">{{ templateName }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ this.payMethod === 'CHN_PAY' ? '国内支付' : '国际支付' }}</el-descriptions-item>
      </el-descriptions>

      <p class="tip-title">商品信息</p>

      <div class="renew-tip-wrap" v-if="checkRenewList.length">
        <p>续费提醒：以下公司已存在vat注册+申报服务，请在续费订单中进行续费</p>
        <p v-for="(item, index) in checkRenewList" :key="index">
          {{ index + 1 }}. <span v-if="item.companyName">【{{ item.companyName }}】</span> 服务商品：{{ item.productName }} ，所属主体：{{ item.enterpriseName }} ，服务号：{{ item.serviceNo }} ，服务截至日期 {{ item.expirationTime }}
        </p>
      </div>

      <el-table :data="confirmTableData" height="250" border style="width: 100%; margin-bottom: 15px">
        <el-table-column align="center" label="商品服务" width="200">
          <template slot-scope="scope">{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务项目" width="200">
          <template slot-scope="scope">{{ scope.row.serviceName }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务公司" width="200">
          <template slot-scope="scope">
            <span v-if="!isRenewal">{{ scope.row.serviceCompanyName }}</span>
            <span v-else>{{ scope.row.companyNameZh }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="商品金额">
          <template slot-scope="scope">
            <span v-if="!isRenewal">￥{{ scope.row.productOldMoney | formatQianFenWei }}</span>
            <div v-else>
              <div class="old-price" v-if="scope.row.activityType">￥{{ scope.row.productPaymentMoney }}</div>
              <div class="new-price">￥{{ scope.row.price }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="优惠金额">
          <template slot-scope="scope">
            <span v-if="!isRenewal">￥{{ $util.accMul(scope.row.discAmountMoney, scope.row.quantity) > 0 ? $util.accMul(scope.row.discAmountMoney, scope.row.quantity) : 0 | formatQianFenWei }}</span>
            <span v-else>￥{{ ($util.accMul($util.accSub(scope.row.productPaymentMoney, scope.row.productPrice), scope.row.quantity) > 0 ? $util.accMul($util.accSub(scope.row.productPaymentMoney, scope.row.productPrice), scope.row.quantity) : 0) | formatQianFenWei }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="应付金额">
          <template slot-scope="scope">
            <span v-if="!isRenewal">￥{{ $util.accMul(scope.row.productPaymentMoney, scope.row.quantity) }}</span>
            <span v-else>￥{{ $util.accMul(scope.row.productPrice, scope.row.quantity) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="exchange-form-dialog-price-wrapper">
        <el-descriptions :column="1">
          <el-descriptions-item label="订单金额">￥{{ productPrice.servicePrice | formatQianFenWei }}</el-descriptions-item>
          <el-descriptions-item label="优惠金额">￥{{ (productPrice.discountedPrice > 0 ? productPrice.discountedPrice : 0) | formatQianFenWei }}</el-descriptions-item>
          <el-descriptions-item label="税率">{{ payMethod === 'CHN_PAY' ? rateType : '0' }}%</el-descriptions-item>
          <el-descriptions-item label="税额">￥{{ productPrice.invoicePrice | subStringNum | formatQianFenWei }}</el-descriptions-item>
          <el-descriptions-item label="总应付金额"
            ><span class="font-blod">￥{{ productPrice.totalPrice | formatQianFenWei }}</span></el-descriptions-item
          >
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmSubmit">确认提交</el-button>
        <el-button size="small" @click="showConfirmDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 换货金额 >= 退货金额 -->
    <RefundOrderConfirmDialog
      v-if="refundOrderConfirmDialog"
      :refundOrderConfirmDialog.sync="refundOrderConfirmDialog"
      :orderForm="orderForm"
      :refundData="refundData"
      :enterpriseName="enterpriseName"
      :tableData="confirmTableData"
      :isRenewal="isRenewal"
      :signDto="signDto"
      :hasContract="hasContract"
      :productPrice="productPrice"
      :refundPaidPrice="refundPaidPrice"
      :contractName="contractName"
      :restPrice="restPrice"
      :templateName="templateName"
      :params="params"
      :refundForm="refundForm"
      :checkRenewList="checkRenewList"
      :selExchangeList="selExchangeList"
      :payMethod="payMethod"
      :isExchange="isExchange"
      :taxAmount="taxAmount"
      :refundInfo="refundInfo"
      @closeChooseRefundWayDialog="chooseRefundWayDialog = false"
    />
    <!-- 换货金额 < 退货金额 -->
    <ChooseRefundWayDialog
      v-if="chooseRefundWayDialog"
      :chooseRefundWayDialog.sync="chooseRefundWayDialog"
      :refundData="refundData"
      :exchangeList="exchangeList"
      :refundPaidPrice="refundPaidPrice"
      :lastPaymentTime="lastPaymentTime"
      :restPrice="restPrice"
      :totalPrice="productPrice.totalPrice"
      :refundInfo="refundInfo"
      @submit="chooseRefundWaySubmit"
    />
    <AddCustomerDialog :addCustomerDialog.sync="addCustomerDialog" :mobile="orderForm.userMobile" @getMobile="getMobile" />
    <AddProductDialog :countrySelect="countryList" :addProductDialog.sync="addProductDialog" @getSelectedProduct="getSelectedProduct" />
    <ProductSkuDialog :productSkuDialog.sync="productSkuDialog" :renewalProduct="renewalProduct" :renewalIndex="renewalIndex" @changeSpec="changeSpec" />
  </div>
</template>
<script>
import { CONTRACTEM } from '@/libs/contractEM.js';
import { PAYMENTTYPE, ORDERTYPE, ORDERSOURCE } from './orderEM.js';
import { addOrder, taxRate, orderDeatil, updataOrder, listByCountryCode, calcRefund, checkTemporary, addTemporary, getTemporary } from '@/api/newApi/manuelorder/addOrder.js';
import { signTemplatesApi, getNeedSignApi, listByMobileApi, renewalPage, ocrPayVoucher, getRenewalSignSubject, getMobileListApi, checkRepeatRenewProductInfo } from '@/api/newApi/orderManage/salesorder.js';
import { getProductList, getProductCategory, getLastInvoice, getQywxOpportunity, getUserMobile } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { getCountrySelectList, getBankAccountList, getBaseDataByDataType } from '@/api/newApi/common.js';
import UploadImage from '@/components/UploadImages/index'; //上传图片组件
import UploadFileUrl from '@/components/UploadFileUrl/index'; //上传图片组件
import ChoiceSignInfo from './components/choiceSignInfo/choiceSignInfo.vue';
import RefundOrderConfirmDialog from './components/refundOrderConfirmDialog';
import ChooseRefundWayDialog from './components/chooseRefundWayDialog';
import AddCustomerDialog from './components/addCustomerDialog';
import AddProductDialog from './components/addProductDialog';
import ProductSkuDialog from './components/productSkuDialog';
import { cloneDeep } from 'lodash';
export default {
  components: {
    UploadImage,
    UploadFileUrl,
    ChoiceSignInfo,
    RefundOrderConfirmDialog,
    ChooseRefundWayDialog,
    AddCustomerDialog,
    AddProductDialog,
    ProductSkuDialog,
  },
  data() {
    return {
      SUBJECTEM: CONTRACTEM.SUBJECTEM,
      SIGNEM: CONTRACTEM.SIGNEM,
      ORDERTYPE: ORDERTYPE, //订单类型
      PAYMENTTYPE: PAYMENTTYPE, //付款类型
      isResouceShow: 0,
      showfullDialog: false,
      // countrySelect: [], //国家列表
      enterpriseName: '', //企业名称
      enterpriseId: '',
      showDel: false,
      companyNameList: [],
      delForm: {
        delAuditFile: '',
      },
      delRules: {
        delAuditFile: [{ required: true, message: '请上传审核凭证', trigger: 'change' }],
      },
      continueFlag: '',
      // 删除审核凭证列表
      delAuditFile: [],
      checkRow: {},
      //基础信息参数
      oldRenewFlag: null,
      orderForm: {
        paymentType: PAYMENTTYPE.NORMAL, //默认正常付款
        orderType: ORDERTYPE.NORMAL, //默认正常订单
        signType: CONTRACTEM.SIGNEM.ONLINE,
        contractSubjectType: CONTRACTEM.SUBJECTEM.ENTERPRISE,
        renewFlag: 0, //是否续费 默认续费
        invoiceType: 4, //默认不开票
        taxPoint: 0,
        orderSource: 'IN',
        userMobile: '',
        productDTO: [],
        paymentFile: '',
        tradeNo: '',
        contractCompanyId: '',
        contractCompanyName: '',
        payer: '',
        paymentChannel: '',
        acceptAccountNum: '',
        instalmentMoney: '',
        paymentTime: '',
        prepaymentTime: '',
        opportunityNo: '',
      },
      signDto: {
        contractSignType: CONTRACTEM.SIGNEM.ONLINE,
        contractSubjectType: 'ENTERPRISE',
        contractSubjectId: '',
        templateId: '',
        contract: '',
      },
      searchForm: {
        companyNameList: [],
        countryCodeList: [],
        serviceNo: '',
        expirationTime: [],
      },
      contractName: '',
      invoiceFrom: {
        idNumber: '',
        companyName: '',
        taxIdentificationNumber: '',
        companyAddress: '',
        companyTel: '',
        openingBank: '',
        bankAccount: '',
        name: '',
        idNumber: '',
      },
      copyInvoiceForm: {},
      // type: 3, //根据发票类型获取税率 1 普通，2 增值税发票，3 不开票
      //商品服务名称列表
      serviceList: {},
      //商品信息检验
      productFrom: {},
      //新增商品列表
      tableData: [],
      confirmTableData: [],
      //付款信息
      paymentFrom: {},
      //商品价格总和
      productPrice: {
        servicePrice: 0, //销售总价
        discountedPrice: 0, //优惠金额
        invoicePrice: 0, //开票金额
        totalPrice: 0, //应付总金额
      },
      signTemplatesList: [], //合同模板
      companyList: [],
      rateType: 1,
      needSign: true,
      loading: false,
      //基础信息校验
      rulebaseFrom: {
        paymentFile: [{ required: true, message: '请上传付款凭证', trigger: 'change' }],
        payer: [{ required: true, message: '请输入付款方', trigger: 'blur' }],
        paymentChannel: [{ required: true, message: '请选择付款方式', trigger: 'change' }],

        paymentTime: [{ required: true, message: '请选择付款时间', trigger: 'change' }],
      },
      formRules: {
        serviceCompanyName: [{ required: true, message: '请选择服务公司', trigger: 'blur' }],
      },

      // 续费商品列表
      renewalList: [],
      checkIds: [],
      checkedRenewalList: [],
      signSubjectList: [],
      cascaderOptList: [],
      preCustom: 0,
      curTransferVoucher: '',
      refundOrderConfirmDialog: false,
      showConfirmDialog: false,
      chooseRefundWayDialog: false,
      // 退货商品信息
      refundData: [],
      selExchangeList: [],
      paymentChannelList: [],
      exchangeList: [],
      // 模板名称
      templateName: '',
      paymentChannel: '',
      lastPaymentTime: '',
      params: {},
      refundForm: {},
      checkedProductList: [],
      // categoryList: [],
      countryList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        // emitPath: false,
        multiple: true,
      },
      options: [],
      productMap: new Map(),
      // allRelationList: [],
      checkRenewList: [], // 以前vat注册的续费商品
      simpleMap: new Map(),
      hasInvoice: false,
      hasContract: false,
      addCustomerDialog: false,
      addProductDialog: false,
      productSkuDialog: false,
      renewalProduct: {},
      renewalIndex: 0,
      invoiceTypeStr: '专用发票',
      paymentStr: `“企业网银”，“线下打款”`,
      searchMobile: '',
      opportunityList: [],
      payMethod: 'CHN_PAY', // 收款方式
      orderPayMethod: '', // 退换货订单的历史收款方式，退换货只能使用之前的收款方式，后改版可以...
      reCreate: this.$route.query.reCreate, // 是否是重新创建
      refundInfo: null, // 选择退款方式信息
    };
  },
  filters: {
    invoiceTypeFilter(invoiceType, hasInvoice) {
      if (!hasInvoice) {
        return '不开票';
      }
      switch (invoiceType) {
        case 1:
          return '不开票';
        case 2:
          return '增值税普通发票（个人）';
        case 3:
          return '增值税普通发票（公司）';
        case 4:
          return '增值税专用发票';
        default:
          return '';
      }
    },
    signType(type) {
      switch (type) {
        case 'ONLINE':
          return '电子签合同';
        case 'OFFLINE':
          return '线下签订';
      }
    },
    orderTypeFilter(val) {
      if (val == 'NORMAL') {
        return '正常订单';
      } else if (val == 'PROJECT') {
        return '项目制订单';
      } else if (val == 'PREMIUM') {
        return '溢价订单';
      } else if (val == 'EXCHANGE') {
        return '退换货订单';
      }
      return '';
    },
  },
  computed: {
    type() {
      if (!this.hasInvoice) {
        return 'NONE';
      }
      switch (this.orderForm.invoiceType) {
        case 4:
          return 'SPECIAL';
        case 3:
        case 2:
          return 'GENERAL';
        default:
          return 'NONE';
      }
    },
    isRenewal() {
      return this.orderForm.renewFlag === 1 || this.isRenewalOrder;
    },
    isEdit() {
      return this.$route.query.id && !this.$route.query.reCreate;
    },
    /**切换签订主题 */
    signTypeRadioDisabled() {
      let { invoiceType } = this.orderForm;
      if (this.hasInvoice && (invoiceType == 3 || invoiceType == 4)) {
        this.signDto.contractSubjectType = this.SUBJECTEM.ENTERPRISE;
        return true;
      } else {
        return false;
      }
    },
    // 退换货
    isExchange() {
      return this.$route.query.type === 'exchange';
    },
    // 续费录单
    isRenewalOrder() {
      return this.$route.query.type === 'renewal';
    },
    // 退货金额
    refundPaidPrice() {
      const selMapList = this.selExchangeList.map((item) => item.orderProductId);
      if (!selMapList.length) return 0;
      return this.refundData.filter((item) => selMapList.includes(item.orderProductId)).reduce((a, b) => this.$util.accAdd(a, b.productPaidMoney), 0);
    },
    // 尾款金额
    restPrice() {
      // 当 尾款金额 小于0 则 默认为国内支付  ---废弃了。。
      let restPrice = this.$util.accSub(this.productPrice.totalPrice, this.refundPaidPrice);
      // if(restPrice < 0) {
      //   this.payMethod = 'CHN_PAY'
      // }
      return restPrice;
    },
    // 税额
    taxAmount () {
      let taxAmount= this.$util.accMul(this.restPrice, this.$util.accMul(this.rateType, 0.01));
      return taxAmount > 0? taxAmount: 0
    }
  },
  watch: {
    curTransferVoucher(newVal) {
      if (newVal) {
        ocrPayVoucher({
          uri: newVal,
        }).then((res) => {
          if (res.code === 0) {
            this.orderForm.paymentTime = res.data.payTime;
            this.orderForm.tradeNo = res.data.serialNumber;
          }
        });
      } else {
        this.orderForm.paymentTime = '';
        this.orderForm.tradeNo = '';
      }
    },
    async 'orderForm.invoiceType'() {
      await this.getTaxRate(); //获取税率
      if (this.orderForm.invoiceType == 2) {
        //增值税普通发票(个人)
        this.orderForm.subjectType = 1;
        this.invoiceTypeStr = '普通发票（个人）';
        this.paymentStr = `“微信”，“支付宝”，“个人/企业网银”，“线下打款”`;
      } else if (this.orderForm.invoiceType == 3) {
        //增值税普通发票(公司)
        this.orderForm.subjectType = 2;
        this.invoiceTypeStr = '普通发票（公司）';
        this.paymentStr = `“微信”，“支付宝”，“个人/企业网银”，“线下打款”`;
      } else if (this.orderForm.invoiceType == 4) {
        // 增值税专用发票
        this.invoiceTypeStr = '专用发票';
        this.paymentStr = `“企业网银”，“线下打款”`;
      }
      if (!this.hasInvoice) {
        this.invoiceTypeStr = '';
      }
      this.tableData.map((item, index) => {
        item.invoiceprice = item.sellprice * this.orderForm.taxPoint;
      });
      this.getComputedFn(); //计算金额的方法
    },
    // 切换收款方式 重新计算开票金额
    async payMethod(newVal) {
      await this.openInvoice();
    },
    $route(to, from) {
      // 退换货录单时，点击手工录单菜单，重置页面
      let toId = to.query.id;
      let formId = from.query.id;
      if (!toId && formId) {
        this.orderForm.userMobile = '';
        this.orderForm.orderType = ORDERTYPE.NORMAL;
        this.orderForm.paymentType = PAYMENTTYPE.NORMAL;
        this.orderForm.remark = '';
        this.orderPayMethod = '';
      }
    },
  },
  async created() {
    await this.init();
    this.hasInvoice = true;
    await this.getTaxRate();
    await this.openInvoice();
  },
  methods: {
    async init() {
      this.copyInvoiceForm = { ...this.invoiceFrom };
      this.enterpriseId = this.$util.getLocalStorage('enterpriseId');
      setTimeout(() => {
        this.enterpriseName = this.$util.getLocalStorage('enterpriseName');
      }, 300);
      if (!this.isExchange && !this.$route.query.id && !this.isRenewalOrder) {
        this.checkStash(); // 检查是否有暂存
      }
      // this.getCountry(); //获取国家数据
      this.getBankList(); //获取收款账户信息
      this.getNeedSign(); // 判断是否需要走合同流程
      // this.getCategoryList();
      this.getPayChannel();
      this.getCountrySelectList();
      this.getOpportunityList();
      if (this.$route.query.id) {
        this.orderEcho();
      }
      // 入口：我的续费
      if (this.isRenewalOrder) {
        // url传递的加密的手机号，用userid查询
        let queryMobile = this.$route.query.userMobile;
        let userId = this.$route.query.userId;
        if (queryMobile.indexOf('*') > 0) {
          this.orderForm.userMobile = '...';
          getUserMobile({
            userId: userId,
          }).then((res) => {
            if (res.code === 0) {
              this.orderForm.userMobile= res.data
            }else{
              this.$message.error('手机号码失效，请稍后重试');
            }
          });
        } else {
          this.orderForm.userMobile = this.$route.query.userMobile;
        }
        this.getRenewalList();
      }
    },
    /**
     * 获取国家下拉框数据
     */
    getCountrySelectList() {
      getCountrySelectList()
        .then((res) => {
          this.countryList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    selected(row, index) {
      return row.exchangeStatus;
    },
    checkStash() {
      checkTemporary().then((res) => {
        if (res.data) {
          this.$confirm(res.data, '你有暂存的录单信息，是否使用？', {
            confirmButtonText: '继续编辑',
            cancelButtonText: '取消',
          }).then(() => {
            getTemporary().then(async (res) => {
              this.subTypeToInvoceType(res.data.invoiceDTO);
              this.paymentChannel = res.data.paymentChannel;
              this.lastPaymentTime = res.data.lastPaymentTime;
              await this.getTaxRate(); //获取税率
              const { remark, userMobile, paymentType, renewFlag, paymentFile, acceptAccountNum, instalmentMoney, orderType, opportunityNo } = res.data;
              if (res.data.signDto && res.data.signDto.contractSignType) {
                this.hasContract = true;
                this.signDto = {
                  ...this.signDto,
                  ...res.data.signDto,
                  contract: res.data.contractOfflineUrl,
                };
              }
              this.orderForm = {
                ...this.orderForm,
                remark,
                userMobile,
                paymentType,
                paymentFile,
                renewFlag: renewFlag ? 1 : 0,
                acceptAccountNum,
                instalmentMoney,
                productDTO: [],
                orderType,
                opportunityNo,
              };
              let { createBy, updateBy, ...invoiceFrom } = res.data.invoiceDTO;
              this.invoiceFrom = invoiceFrom;
              this.tableData = res.data.productDTO.map((item) => {
                let servicePrice = item.productMoney;
                let productPaymentMoney = item.productPaymentMoney;
                return {
                  opportunityNo: item.opportunityNo, //商机编号
                  serviceCompanyName: item.serviceCompanyName,
                  productImgUrl: item.pcProductImgUrl,
                  serviceName: item.productSpecs.map((pro) => pro.productSpecName).join('/'),
                  countryName: item.countryName,
                  productOldMoney: servicePrice,
                  quantity: item.quantity,
                  productMoney: servicePrice,
                  productPaymentMoney,
                  sellprice: this.$util.accMul(productPaymentMoney, item.quantity),
                  serviceprice: this.$util.accMul(servicePrice, item.quantity),
                  invoiceprice: this.$util.accMul(productPaymentMoney, this.orderForm.taxPoint),
                  discAmountMoney: item.discountMoney,
                  productSpecs: item.productSpecs,
                  productId: item.productId,
                  productName: item.productName,
                  minPrice: item.productSpecs.map((pro) => pro.minimumPrice).reduce((a, b) => parseFloat(a) + parseFloat(b)), // 最低售价
                  rangeMaxPrice: item.productSpecs.map((pro) => pro.priceRangeMax).reduce((a, b) => parseFloat(a) + parseFloat(b)), // 商品区间最大价格
                  rangeMinPrice: item.productSpecs.map((pro) => pro.priceRangeMin).reduce((a, b) => parseFloat(a) + parseFloat(b)), // 商品区间最小价格
                };
              });
              this.getServicePrice(); //计算总销售价
              this.getComputedFn(); //计算金额的方法
              this.listByMobile();
            });
          });
        }
      });
    },
    async addStash() {
      await this.formatParams();
      addTemporary(this.stashParams).then((res) => {
        this.$message.success('暂存成功');
      });
    },
    async openInvoice() {
      // 国内支付遵从原有逻辑，国际支付开票金额是0
      if (this.payMethod === 'CHN_PAY') {
        // 是否开票
        // if (this.hasInvoice) {
        //   this.getInvoiceInfo();
        //   if (!this.isRenewal) {
        //     this.tableData.map((item, index) => {
        //       item.invoiceprice = item.sellprice * this.orderForm.taxPoint;
        //     });
        //   }
        // } else {
        //   this.orderForm.taxPoint = 0;
        //   if (!this.isRenewal) {
        //     this.tableData.map((item, index) => {
        //       item.invoiceprice = 0;
        //     });
        //   }
        // }
      } else {
        this.tableData.map((item, index) => {
          item.invoiceprice = 0;
        });
      }
      this.getServicePrice(); //计算总销售价
      this.getComputedFn(); //计算金额的方法
    },
    getInvoiceInfo() {
      if (!this.orderForm.userMobile || this.orderForm.userMobile.length !== 11) {
        return;
      }
      getLastInvoice({
        userMobile: this.orderForm.userMobile,
        enterpriseId: this.enterpriseId,
      }).then((res) => {
        if (res.data.invoiceType) {
          this.subTypeToInvoceType(res.data);
          this.invoiceFrom = res.data;
        }
      });
    },
    /** 获取 联系人企业列表*/
    async contractSubjectList() {
      let { data } = await getRenewalSignSubject({ mobile: this.orderForm.userMobile, page: 1, limit: -1 });
      this.signSubjectList = data || [];
    },

    /**获取收款账户数据  */
    getBankList() {
      getBankAccountList({
        enterpriseId: this.enterpriseId,
      }).then((res) => {
        if (res.code == 0) {
          this.collectionList = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    reset() {
      this.searchForm = {
        companyNameList: [],
        countryCodeList: [],
        serviceNo: '',
        expirationTime: [],
        expirationTimeStart: '',
        expirationTimeEnd: '',
      };
    },
    // 获取商机列表
    getOpportunityList() {
      getQywxOpportunity({
        enterpriseId: this.enterpriseId,
        userId: JSON.parse(localStorage.getItem('userInfo')).userId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.opportunityList = res.data || [];
            for (const li of this.opportunityList) {
              if (li.customerList) {
                const arr = JSON.parse(li.customerList);
                li.nickName = JSON.parse(li.customerList)[0].nickName;
              }
            }
          }
        })
        .catch((e) => {
          this.$message.closeAll();
        });
    },
    changeRenewFlag(val) {
      if (val === 0) {
        this.changeRenewal();
      }
      if (this.orderForm.renewFlag === 1 && this.orderForm.userMobile.trim() == '') {
        this.$message.warning('请先填写客户手机号，再选择是否续费');
        this.orderForm.renewFlag = this.oldRenewFlag;
      } else {
        this.oldRenewFlag = val;
      }
      if (this.orderForm.renewFlag === 1) {
        this.orderTypeChange();
        this.contractSubjectList();
      }
    },
    changeContractSubjectId(id, contractName) {
      this.signDto.contractSubjectId = id;
      this.contractName = contractName;
    },

    subTypeToInvoceType({ invoiceType, subjectType }) {
      if (invoiceType == 'SPECIAL') {
        this.orderForm.invoiceType = 4;
        this.hasInvoice = true;
      } else if (invoiceType == 'GENERAL') {
        this.hasInvoice = true;
        if (subjectType == 'PERSON') {
          this.orderForm.invoiceType = 2;
        } else {
          this.orderForm.invoiceType = 3;
        }
      } else {
        this.hasInvoice = false;
      }
    },

    /** 修改时回显数据 */
    orderEcho() {
      orderDeatil(this.$route.query.id)
        .then(async (res) => {
          if (res.code == 0) {
            if (!this.isExchange) {
              this.subTypeToInvoceType(res.data.invoiceDTO);
            }
            this.paymentChannel = res.data.paymentChannel;
            this.lastPaymentTime = res.data.lastPaymentTime;
            await this.getTaxRate(); //获取税率
            const { remark, userMobile, paymentType, renewFlag, paymentFile, acceptAccountNum, instalmentMoney, orderId, orderType, opportunityNo, payMethod } = res.data;
            // 退换货订单的历史收款方式，退换货只能使用之前的收款方式，后改为可改
            this.orderPayMethod = payMethod;
            this.payMethod = payMethod;
            if (!this.isExchange) {
              this.signDto = {
                ...this.signDto,
                ...res.data.signDto,
                contract: res.data.contractOfflineUrl,
              };
            }
            this.orderForm = {
              ...this.orderForm,
              remark,
              userMobile,
              paymentType,
              paymentFile,
              renewFlag: renewFlag ? 1 : 0,
              acceptAccountNum,
              instalmentMoney,
              productDTO: [],
              orderType: this.isExchange ? this.ORDERTYPE.EXCHANGE : orderType,
              opportunityNo,
            };
            if (this.isEdit) {
              this.orderForm.orderId = orderId;
            }
            if (!this.isExchange) {
              this.invoiceFrom = res.data.invoiceDTO;
            }
            if (!this.isExchange) {
              this.tableData = res.data.orderProductSpecsList.map((item) => {
                let product = item.orderProductDetail && item.orderProductDetail.length ? item.orderProductDetail[0] : [];
                let servicePrice = item.orderProductDetail.map((item) => item.productMoney).reduce((a, b) => parseFloat(a) + parseFloat(b));
                let productPaymentMoney = item.orderProductDetail.map((pro) => pro.productPaymentMoney).reduce((a, b) => parseFloat(a) + parseFloat(b));
                return {
                  opportunityNo: item.opportunityNo, //商机编号
                  serviceCompanyName: product.serviceCompanyName,
                  productImgUrl: product.pcProductImgUrl,
                  serviceName: item.orderProductDetail.map((pro) => pro.specsName).join('/'),
                  countryName: product.countryName,
                  productOldMoney: servicePrice,
                  quantity: product.quantity,
                  productMoney: servicePrice,
                  productPaymentMoney,
                  sellprice: this.$util.accMul(productPaymentMoney, product.quantity),
                  serviceprice: this.$util.accMul(servicePrice, product.quantity),
                  invoiceprice: this.$util.accMul(productPaymentMoney, this.orderForm.taxPoint),
                  discAmountMoney: item.orderProductDetail.map((pro) => pro.discountMoney).reduce((a, b) => parseFloat(a) + parseFloat(b)),
                  productSpecs: item.orderProductDetail.filter((el) => !el.childSpecFlag).map((pro) => ({ productSpecId: pro.productSpecsId })),
                  productId: product.productId,
                  productName: product.productName,
                  minPrice: item.orderProductDetail.map((pro) => pro.minimumPrice).reduce((a, b) => parseFloat(a) + parseFloat(b)), // 最低售价
                  rangeMaxPrice: item.orderProductDetail.map((pro) => pro.priceRangeMax).reduce((a, b) => parseFloat(a) + parseFloat(b)), // 商品区间最大价格
                  rangeMinPrice: item.orderProductDetail.map((pro) => pro.priceRangeMin).reduce((a, b) => parseFloat(a) + parseFloat(b)), // 商品区间最小价格
                };
              });
            } else {
              let list = this.formatListData(res.data.orderProductSpecsList);
              this.orderForm.paymentType = PAYMENTTYPE.NORMAL;
              list.map((item) => {
                item.sellprice = this.$util.accMul(item.productPaymentMoney, item.quantity); //实际售价单条总和
                item.productOldMoney = item.productMoney;
                item.serviceprice = this.$util.accMul(item.productMoney, item.quantity); //服务金额单条总和
                item.invoiceprice = this.$util.accMul(item.productPaymentMoney, this.orderForm.taxPoint); //开票金额 实际售价*税点
                item.productImgUrl = this.getImgSrc(item.pcProductImgUrl, item.mobileProductImgUrl);
              });
              this.refundData = list;
            }
            this.getServicePrice(); //计算总销售价
            this.getComputedFn(); //计算金额的方法
            this.listByMobile();
          }
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err.message,
          });
        });
    },
    getPayChannel() {
      getBaseDataByDataType({
        dataType: 'PAYMENT_CHANNEL_TYPE',
      }).then((res) => {
        if (res.code == 0) {
          this.paymentChannelList = res.data;
        }
      });
    },
    formatListData(orderProducts) {
      let list = [];
      orderProducts.forEach((item, ind) => {
        item.orderProductDetail.forEach((detail, i) => {
          list.push({
            ...item,
            ...detail,
            rowspan: item.orderProductDetail.length,
            index: i,
            ind,
          });
        });
      });
      return list;
    },
    objectSpanMethod({ row, column }) {
      let combineList = ['productName', 'selectionCol', 'orderIndex'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    handleSelectionChange2(val) {
      this.selExchangeList = val;
    },
    // 续费商品列表
    async getRenewalList() {
      let renewalList = [];
      if (this.isRenewalOrder) {
        // 去续费入口
        renewalList = JSON.parse(localStorage.getItem('renewalList'));
        this.handleSelectionChange(renewalList);
      } else {
        // 打开续费开关
        renewalList = await this.getRenewal();
      }
      renewalList.forEach((item) => {
        item.quantity = 1;
        if (typeof item.productPaymentMoney !== 'number') {
          item.productPaymentMoney = 0;
          item.activityType = 0;
          item._disabled = true;
        }
        if (item.flagRenewal && [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(item.productFunctionCode)) {
          item._disabled = true;
        }
        if (typeof item.productPrice !== 'number') {
          item.productPrice = item.productPaymentMoney;
          item.activityType = 0;
        }
        item.price = item.productPrice;
        item.productImgUrl = item.pcProductImgUrl;
        item.serviceName = item.productSpecName;
      });
      this.renewalList = renewalList;
      this.$nextTick(() => {
        this.$refs.renewalTable.doLayout();
      });
    },
    getRenewal() {
      return new Promise((resolve) => {
        if (this.searchForm.expirationTime && this.searchForm.expirationTime.length) {
          [this.searchForm.expirationTimeStart, this.searchForm.expirationTimeEnd] = this.searchForm.expirationTime;
        } else {
          [this.searchForm.expirationTimeStart, this.searchForm.expirationTimeEnd] = ['', ''];
        }
        renewalPage({
          mobile: this.orderForm.userMobile,
          page: 1,
          ...this.searchForm,
          limit: -1,
        }).then((res) => {
          if (res.code === 0) {
            resolve(res.data.records);
          }
        });
      });
    },
    // 订单类型变更
    orderTypeChange(val) {
      this.changeRenewal();
      // 续费订单
      if (this.isRenewal) {
        this.tableData = [];
        this.getRenewalList();
      }
    },

    changeRenewal() {
      this.checkIds = [];
      this.checkedRenewalList = [];
      this.renewalList = [];
      this.getServicePrice(); //计算总销售价
      this.getComputedFn(); //计算金额的方法
    },
    handleSelectionChange(val) {
      this.checkedRenewalList = val;
      this.getServicePrice(); //计算总销售价
      this.getComputedFn(); //计算金额的方法
    },

    // 设置操作禁用
    selectable(row) {
      return !row._disabled;
    },
    // 修改已选中行颜色
    tableRowClassName({ row, rowIndex }) {
      const checkServiceIds = this.checkedRenewalList.map((item) => item.serviceId);
      if (checkServiceIds.includes(row.serviceId)) {
        return 'gray-row';
      }
    },

    // 校验表格内必填
    checkTableValid() {
      return new Promise((resolve) => {
        let flag = true;
        this.tableData.forEach((item) => {
          if (!item.serviceCompanyName) {
            flag = false;
          }
        });
        if (flag) {
          resolve();
        } else {
          this.$message.warning('服务公司必填');
        }
      });
    },
    // 有添加“VAT申报“规格的商品,怕录单录错，给续费商品提示
    getVatRenewList() {
      const req = [];
      this.tableData.forEach((el) => {
        el.productSpecs.forEach((item) => {
          req.push({
            productCategoryId: item.productCategoryId,
            countryCode: el.countryCode,
            companyName: el.serviceCompanyName,
          });
        });
      });
      checkRepeatRenewProductInfo({ dto: req })
        .then((res) => {
          if (res.code == 0) {
            this.checkRenewList = res.data;
          }
        })
        .catch((err) => {});
    },
    formatParams() {
      return new Promise((resolve) => {
        this.$refs.baseFrom.validate(async (valid) => {
          if (valid) {
            if (this.isRenewal) {
              if (!this.checkedRenewalList.length) {
                this.$message.warning('请选择续费商品');
                return;
              }
            } else {
              if (this.tableData.length == 0) {
                this.$message.warning('请添加商品');
                return false;
              } else {
                if (this.orderForm.paymentType !== 1) {
                  await this.checkTableValid();
                }
              }
            }
            this.getproducts();
            if (this.hasInvoice && !this.orderForm.invoiceType) {
              this.$message.warning('请选择开票类型');
              return;
            }
            let validate = this.verifyPaymentInfo();
            if (!validate.flag && !validate.isEmpty) {
              this.$message.warning('请完善付款信息，除备注字段为选填，其余字段均为必填！');
              return false;
            }
            let signFormValid = true;
            this.hasContract &&
              this.needSign &&
              this.$refs.signForm.validate(async (valid) => {
                if (!valid) {
                  signFormValid = false;
                }
              });
            if (!signFormValid) {
              return;
            }
            this.orderForm.copeMoney = this.productPrice.totalPrice;
            this.invoceTypeToSubType();
            let params = {
              ...this.orderForm,
              invoiceType: !this.hasInvoice ? 1 : this.orderForm.invoiceType,
              continueFlag: this.continueFlag,
              renewFlag: this.isRenewalOrder ? 1 : this.orderForm.renewFlag,
              productDTO: this.orderForm.productDTO.map((product) => ({
                ...product,
                productSpecs: product.productSpecs.map((spec) => ({
                  productSpecId: spec.productSpecId,
                  productSpecName: spec.productSpecName,
                  minimumPrice: spec.minimumPrice,
                  priceRangeMax: spec.priceRangeMax,
                  priceRangeMin: spec.priceRangeMin,
                })),
              })),
              invoiceDTO: {
                ...this.invoiceFrom,
              },
              signDto: {
                ...this.signDto,
                contractOfflineUrl: this.signDto.contract,
              },
            };
            if (!this.signDto.contractSubjectId && this.needSign && this.hasContract) {
              this.$message.warning('请选择签订主体!');
              return;
            }
            if (!this.hasContract || !this.needSign) {
              delete params.signDto;
              delete params.contractSubjectType;
              delete params.signType;
            }
            this.stashParams = params;
            resolve();
          }
        });
      });
    },
    formatProduct() {
      this.params = {
        ...this.stashParams,
        productDTO: this.stashParams.productDTO.map((product) => ({
          ...product,
          productSpecs: product.productSpecs.map((spec) => ({ productSpecId: spec.productSpecId })),
        })),
      };
    },
    /**
     * 创建订单 提交保存
     */
    async submitAdd() {
      await this.formatParams();
      if (!this.isRenewal) {
        this.getVatRenewList();
      }
      this.formatProduct();
      this.templateName = (this.signTemplatesList.find((item) => item.templateId === this.signDto.templateId) || {}).templateName;
      this.confirmTableData = this.isRenewal ? this.checkedRenewalList : this.tableData;
      if (!this.isExchange) {
        this.showConfirmDialog = true;
      } else {
        if (!this.selExchangeList.length) {
          this.$message.warning('请选择退款商品!');
          return;
        }
        // 申请退换货-入参 换货金额大于或等于退货金额时 退货商品列表需要传退款金额,virtualRefundMoney=productPaidMoney
        const refundProductDTOs = this.selExchangeList.map((item) => ({ orderProductId: item.orderProductId, refundPoundage: 0, virtualRefundMoney: item.productPaidMoney }));
        // restPrice 尾款金额
        if (this.restPrice >= 0) {
          this.refundOrderConfirmDialog = true;
          this.params.refundProductDTOs = refundProductDTOs;
        } else {
          calcRefund({
            newOrderPaymentMoney: this.productPrice.totalPrice,
            refundProductDTOs,
          })
            .then((res) => {
              if (res.code === 0) {
                this.formatRefundList(res.data.refundProductDTOs);
                this.refundInfo = res.data;
              }
            })

            .catch((err) => {});

          this.chooseRefundWayDialog = true;
        }
      }
    },

    formatRefundList(resList) {
      let list = [];
      this.selExchangeList.forEach((item) => {
        let itemObj = {
          orderProductId: item.orderProductId,
          specsName: '',
          specsNameTip: '',
          // productPaidMoney: 0,
          productName: item.productName,
        };

        const obj = resList.find((ele) => ele.orderProductId == item.orderProductId);

        if (obj) {
          itemObj = Object.assign({}, itemObj, obj);
        }

        item.orderProductDetail.forEach((detail, i) => {
          itemObj.specsName = itemObj.specsName == '' ? itemObj.specsName + detail.specsName : itemObj.specsName + ';' + detail.specsName;
          itemObj.specsNameTip = itemObj.specsNameTip == '' ? itemObj.specsName + '(' + detail.serviceNo + ')' : itemObj.specsNameTip + ';\n' + detail.specsName + '(' + detail.serviceNo + ')';
        });
        list.push(itemObj);
      });
      this.exchangeList = list;
    },

    confirmSubmit() {
      this.loading = true;
      this.showConfirmDialog = false;
      const that = this;
      const fn = this.isEdit ? updataOrder : addOrder;

      // 客户端和管理后台下单invoiceDTO这个对象中的invoiceType默认都不用传参数了，传空,森林，税额调整
      let paramsTemp = cloneDeep({
        ...this.params,
        payMethod: this.payMethod,
      });
      paramsTemp.invoiceDTO.invoiceType = '';

      fn(paramsTemp)
        .then((res) => {
          this.loading = false;
          if (res.code == 0) {
            const msg = this.isEdit ? '订单修改成功' : '录单成功';
            this.$message.success(msg);
            this.goBack();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          if (err.code == 2000) {
            this.$message.closeAll();
            this.$Modal.confirm({
              title: '订单提醒',
              content: `<p>${err.message}</p>`,
              okText: '继续提交',
              cancelText: '知道了',
              onOk: function () {
                that.continueFlag = 'Y';
                that.params.continueFlag = 'Y';
                that.confirmSubmit();
              },
            });
          }
        });
    },
    invoceTypeToSubType() {
      this.invoiceFrom.subjectType = '';
      if (!this.hasInvoice) {
        this.invoiceFrom.invoiceType = 'NONE';
      } else if (this.orderForm.invoiceType == 2) {
        this.invoiceFrom.invoiceType = 'GENERAL';
        this.invoiceFrom.subjectType = 'PERSON';
      } else if (this.orderForm.invoiceType == 3) {
        this.invoiceFrom.invoiceType = 'GENERAL';
        this.invoiceFrom.subjectType = 'ENTERPRISE';
      } else {
        this.invoiceFrom.invoiceType = 'SPECIAL';
      }
    },
    //获取商品集合
    getproducts() {
      this.orderForm.productDTO = [];
      let data = this.isRenewal ? this.checkedRenewalList : this.tableData;
      data.forEach((item) => {
        let obj = {
          countryName: item.countryName,
        };
        if (this.isRenewal) {
          let discAmountMoney = this.$util.accSub(item.productPaymentMoney, item.productPrice);
          obj = {
            ...obj,
            quantity: item.quantity,
            productMoney: item.productPaymentMoney,
            productPaymentMoney: item.productPrice,
            discAmountMoney: discAmountMoney > 0 ? discAmountMoney : 0,
            serviceId: item.serviceId,
            productId: item.productId,
            productName: item.productName,
            serviceCompanyName: item.companyNameZh,
            opportunityNo: item.opportunityNo, //商机编号
            productSpecs: [
              {
                productSpecId: item.productSpecId,
              },
            ],
          };
        } else {
          obj = {
            ...obj,
            quantity: item.quantity,
            productPaymentMoney: item.productPaymentMoney,
            discAmountMoney: item.discAmountMoney > 0 ? item.discAmountMoney : 0,
            productId: item.productId,
            productName: item.productName,
            productMoney: item.productOldMoney,
            serviceCompanyName: item.serviceCompanyName,
            opportunityNo: item.opportunityNo, //商机编号
            serviceCompanyId: item.serviceCompanyId,
            productSpecs: item.productSpecs,
          };
        }
        obj.opportunityEnterpriseId = (this.opportunityList.find((opportunity) => opportunity.opportunityNo === item.opportunityNo) || {}).enterpriseId;
        this.orderForm.productDTO.push(obj);
      });
    },
    // 通过模板id获取合同名称
    getTemplateName() {
      if (this.signDto.templateId && this.signDto.contractSignType == CONTRACTEM.SIGNEM.ONLINE) {
        this.signDto.templateName = this.signTemplatesList.find((item) => item.templateId == this.signDto.templateId).templateName;
      }
    },
    // 通过公司id获取签订合同公司名称
    getCompanyName() {
      if (this.orderForm.contractCompanyId) {
        this.orderForm.contractCompanyName = this.companyList.find((item) => item.id == this.orderForm.contractCompanyId).companyName;
      }
    },

    getMobileList(info) {
      getMobileListApi({ userMobile: this.orderForm.userMobile })
        .then((res) => {})
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 输入服务公司名称获取公司id
    getCompanyId(val, index) {
      if (val != null) {
        let result = this.companyList.find((item) => item.companyName == val);
        if (result) {
          this.tableData[index].serviceCompanyId = result.id;
        }
      }
    },
    // 需要验证付款信息字段
    verifyPaymentInfo() {
      let verifyData = {};
      verifyData.instalmentMoney = this.orderForm.instalmentMoney;
      if (this.orderForm.paymentType == 0) {
        verifyData = {
          payer: this.orderForm.payer,
          paymentChannel: this.orderForm.paymentChannel,
          acceptAccountNum: this.orderForm.acceptAccountNum,
          paymentTime: this.orderForm.paymentTime,
          paymentFile: this.orderForm.paymentFile,
        };
      }

      if (this.orderForm.paymentType == 2) {
        verifyData = {
          payer: this.orderForm.payer,
          paymentChannel: this.orderForm.paymentChannel,
          acceptAccountNum: this.orderForm.acceptAccountNum,
          instalmentMoney: this.orderForm.instalmentMoney,
          paymentTime: this.orderForm.paymentTime,
          paymentFile: this.orderForm.paymentFile,
        };
      }
      return this.verifyPaymentInsert(verifyData);
    },
    // 验证付款信息有没有值，如果全为空可通过，有则每一个字段都必填
    verifyPaymentInsert(obj) {
      let arr = Object.values(obj);
      let flag = arr.every(function (item) {
        return item == '';
      });
      let isEmpty = arr.every(function (item) {
        return item != '';
      });
      let params = {
        flag,
        isEmpty,
      };
      return params;
    },

    /** 获取税率 */
    getTaxRate() {
      return new Promise((resolve) => {
        taxRate({
          enterpriseId: this.enterpriseId,
          status: 0,
          type: this.type,
        }).then((res) => {
          if (res.data.records.length > 0) {
            // 无税率或者暂不开票，都不计算开票金额
            if (res.data.records[0].taxRate === 1 || !this.hasInvoice) {
              this.orderForm.taxPoint = 0;
              this.rateType = this.$util.floatMultiply(this.orderForm.taxPoint, 100);
            } else {
              this.orderForm.taxPoint = res.data.records[0].taxRate;
              this.rateType = this.$util.floatMultiply(this.orderForm.taxPoint, 100);
            }
          } else {
            if (this.type != 'NONE') {
              this.$message.warning('该开票类型下暂无税点，请先添加');
            }
            this.orderForm.taxPoint = 0;
          }
          resolve();
        });
      });
    },
    getMobile(mobile) {
      this.orderForm.userMobile = mobile;
    },
    querySearchAsync(queryString, cb) {
      if (this.searchMobile === queryString) {
        cb([]);
        return;
      }
      this.searchMobile = queryString;
      if (queryString.length >= 4) {
        getMobileListApi({ userMobile: this.orderForm.userMobile })
          .then((res) => {
            var result = [];
            if (res.code == 0) {
              if (res.data.length) {
                result = res.data.map((item) => ({ value: item }));
              } else {
                if (queryString.length === 11) {
                  this.$message.closeAll();
                  this.$confirm('是否需要快速添加', '该用户还未注册', {
                    confirmButtonText: '去添加',
                    cancelButtonText: '取消',
                  })
                    .then(() => {
                      this.addCustomerDialog = true;
                    })
                    .catch(() => {
                      this.getMobile('');
                    });
                }
              }
              cb(result);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      } else {
        cb([]);
      }
    },
    changePayType() {
      if (this.orderForm.paymentType !== 0 && this.orderForm.invoiceType !== 1) {
        // this.orderForm.invoiceType = 1;
        this.hasInvoice = false;
      }
      this.getInvoicePrice();
      this.getTotalPrice();
    },
    /**
     * 获取合同模板列表
     */
    getSignTemplates() {
      signTemplatesApi({ enterpriseId: this.enterpriseId })
        .then((res) => {
          this.signTemplatesList = res.data;
          // 默认选中通用合同
          let generalTemplate = res.data.find((item) => item.templateName === '通用合同');
          if (generalTemplate) {
            this.signDto.templateId = generalTemplate.templateId;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /**
     * 判断是否需要走合同流程
     */
    getNeedSign() {
      getNeedSignApi({ enterpriseId: this.enterpriseId })
        .then((res) => {
          this.needSign = res.data;
          if (this.needSign) {
            this.getSignTemplates(); //获取合同模板
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /**
     * 获取手机号
     */
    listByMobile() {
      if (this.orderForm.userMobile) {
        if (this.isRenewal) {
          this.changeRenewal();
          this.getRenewalList();
        } else {
          listByMobileApi({ userMobile: this.orderForm.userMobile }).then((res) => {
            if (res.code == 0) {
              this.companyList = res.data;
            }
          });
        }
      } else {
        this.renewalList = [];
      }

      if (this.orderForm.renewFlag === 1) {
        this.contractSubjectList();
      }
    },
    changeRenewalPrice(row, index) {
      this.$nextTick(() => {
        if (row.productPrice - 0 < row.minimumPrice) {
          this.$message.warning(`该价格低于商品最低价`);
          this.checkedRenewalList[index].productPrice = row.minimumPrice;
          this.checkedRenewalList[index].price = row.minimumPrice;
        }
        this.getServicePrice(); //计算总销售价
        this.getComputedFn(); //计算金额的方法
      });
    },
    /**
     * 获取默认图片 优先pc端
     */
    getImgSrc(pcImg, mobileImg) {
      return pcImg || mobileImg;
    },
    getSelectedProduct(selectedProduct) {
      this.checkedProductList = selectedProduct.map((item) => {
        let specList = item.chooseSpec;
        let minPrice = specList.map((s) => s.minimumPrice).reduce((a, b) => parseFloat(a) + parseFloat(b));
        let rangeMaxPrice = specList.map((s) => s.priceRangeMax).reduce((a, b) => parseFloat(a) + parseFloat(b));
        let rangeMinPrice = specList.map((s) => s.priceRangeMin).reduce((a, b) => parseFloat(a) + parseFloat(b));
        return {
          productSpecs: specList.map((s) => ({
            productSpecId: s.id,
            productSpecName: s.specsName,
            minimumPrice: s.minimumPrice,
            priceRangeMax: s.priceRangeMax,
            priceRangeMin: s.priceRangeMin,
            productCategoryId: s.productCategoryId,
          })),
          quantity: item.quantity || 1,
          countryName: item.countryCodeName,
          productImgUrl: item.productImagePc,
          productId: item.id,
          productOldMoney: specList.map((s) => s.servicePrice).reduce((a, b) => parseFloat(a) + parseFloat(b)), //服务金额
          serviceProductName: specList.map((pro) => pro.specsName).join('/'),
          productName: item.productName,
          countryCode: item.countryCode,
          minPrice, // 最低售价
          rangeMaxPrice, // 商品区间最大价格
          rangeMinPrice, // 商品区间最小价格
        };
      });
      this.addProduct();
    },
    /**动态添加商品 */
    addProduct() {
      this.checkedProductList.forEach((checkedProduct) => {
        this.tableData.push({
          productImgUrl: checkedProduct.productImgUrl, //图片
          serviceName: checkedProduct.serviceProductName, //服务名称
          countryName: checkedProduct.countryName,
          productOldMoney: checkedProduct.productOldMoney, //服务金额
          quantity: checkedProduct.quantity,
          productMoney: checkedProduct.productOldMoney,
          productPaymentMoney: checkedProduct.productOldMoney, //实际售价-添加时默认为服务金额
          sellprice: this.$util.accMul(checkedProduct.productOldMoney, checkedProduct.quantity),
          serviceprice: this.$util.accMul(checkedProduct.productOldMoney, checkedProduct.quantity),
          invoiceprice: this.$util.accMul(checkedProduct.productOldMoney, this.orderForm.taxPoint),
          discAmountMoney: 0,
          productSpecs: checkedProduct.productSpecs,
          productId: checkedProduct.productId,
          productName: checkedProduct.productName,
          countryCode: checkedProduct.countryCode,
          minPrice: checkedProduct.minPrice, // 最低售价
          rangeMaxPrice: checkedProduct.rangeMaxPrice, // 商品区间最大价格
          rangeMinPrice: checkedProduct.rangeMinPrice, // 商品区间最小价格
        });
      });
      this.productFrom.skuid = ''; //添加成功后将服务 清掉，避免重复添加
      this.getServicePrice(); //计算总销售价
      this.getComputedFn(); //计算金额的方法
      // this.getTaxRate();
    },
    // 复制商品
    copyProduct(row) {
      this.tableData.push(JSON.parse(JSON.stringify(row)));
      this.getServicePrice(); //计算总销售价
      this.getComputedFn(); //计算金额的方法
    },
    /** 动态删除商品 */
    handleDelet(row) {
      this.$confirm('是否确认删除', '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        var index = this.tableData.indexOf(row);
        if (index !== -1) {
          this.tableData.splice(index, 1);
          this.getServicePrice(); //计算总销售价
          this.getComputedFn(); //计算金额的方法
        }
      });
    },

    delFormReset() {
      if (this.$refs.delRef) {
        this.$refs.delRef.resetFields();
      }
    },

    showDelDialog(row) {
      this.checkRow = row;
      this.showDel = true;
    },
    // 删除生成服务的商品
    delConfirm() {
      this.$refs.delRef.validate((valid) => {
        if (valid) {
          var index = this.tableData.indexOf(this.checkRow);
          if (index !== -1) {
            this.tableData.splice(index, 1);
            this.getServicePrice(); //计算总销售价
            this.getComputedFn(); //计算金额的方法
          }
          this.delAuditFile.push(this.delForm.delAuditFile);
          this.showDel = false;
        }
      });
    },

    delFormReset() {
      if (this.$refs.delRef) {
        this.$refs.delRef.resetFields();
      }
    },
    // 修改续费商品规格
    changeRenewalProductSku(row, index) {
      this.renewalProduct = row;
      this.renewalIndex = index;
      this.productSkuDialog = true;
    },
    // 修改续费商品规格
    changeSpec({ index, productSpecId, specItem }) {
      this.renewalList[index].productSpecId = productSpecId;
      this.renewalList[index].productSpecName = specItem.productSpecName;
      this.renewalList[index].serviceName = specItem.productSpecName;
      this.renewalList[index].price = specItem.renewPrice;
      this.renewalList[index].productPrice = specItem.renewPrice;
      this.renewalList[index].minimumPrice = specItem.minimumPrice;
      this.renewalList[index].priceRangeMax = specItem.priceRangeMax;
      this.renewalList[index].priceRangeMin = specItem.priceRangeMin;
      this.getServicePrice(); //计算总销售价
      this.getComputedFn(); //计算金额的方法
    },

    /**
      输入数量计算实际售价
     */
    changeNum(val, index) {
      if (val != null) {
        this.tableData[index].serviceprice = this.$util.accMul(val, this.tableData[index].productOldMoney); //单条数据服务金额总和
        this.tableData[index].sellprice = this.$util.accMul(val, this.tableData[index].productPaymentMoney); //单条数据实际售价总和
        this.tableData[index].invoiceprice = this.$util.accMul(this.tableData[index].sellprice, this.orderForm.taxPoint); //开票金额
        this.getServicePrice(); //计算总销售价
        this.getComputedFn(); //计算金额的方法
      }
    },
    /** 输入实际售价计算实际售价 */
    sellingPrice(val, index) {
      if (val != null) {
        // 当输入比最低售价更低的金额时，当光标移出时，页面提示“该商品的建议售价为3000-5000元”
        if (val < this.tableData[index].minPrice) {
          this.$message.warning('该商品的建议售价为' + this.tableData[index].rangeMinPrice + '-' + this.tableData[index].rangeMaxPrice + '元');
          val = this.tableData[index].productOldMoney;
          this.$nextTick(() => {
            this.tableData[index].productPaymentMoney = val;
          });
        }
        this.tableData[index].sellprice = this.$util.accMul(val, this.tableData[index].quantity); //单条数据实际售价总额
        this.tableData[index].discAmountMoney = this.$util.accSub(this.tableData[index].productOldMoney, val); //优惠金额
        this.tableData[index].invoiceprice = this.$util.accMul(this.tableData[index].sellprice, this.orderForm.taxPoint); //开票金额
        this.getComputedFn(); //计算金额的方法
      }
    },
    getComputedFn() {
      this.getsellPrice(); //计算实际售价总和
      this.discountAmount(); //计算优惠总金额
      this.getInvoicePrice(); //计算总开票金额
      this.getTotalPrice(); //计算应收总金额
    },
    /*
    计算总销售价
    总销售价：等于明细服务商品“服务金额” 之和
    */
    getServicePrice() {
      if (!this.isRenewal) {
        this.productPrice.servicePrice = this.tableData.reduce((c, item) => c + item.serviceprice, 0);
      } else {
        this.productPrice.servicePrice = this.checkedRenewalList.reduce((c, item) => c + item.productPaymentMoney, 0);
      }
    },
    /**
     * 计算实际售价总和
     */
    getsellPrice() {
      if (!this.isRenewal) {
        this.productPrice.productPaymentMoney = this.tableData.reduce((c, item) => c + item.sellprice, 0);
      } else {
        this.productPrice.productPaymentMoney = this.checkedRenewalList.reduce((c, item) => c + item.productPrice, 0);
      }
    },
    /** 计算优惠总金额
     *  优惠=服务金额 - 实际售价
     */
    discountAmount() {
      this.productPrice.discountedPrice = this.$util.accSub(this.productPrice.servicePrice, this.productPrice.productPaymentMoney);
      this.productPrice.discountedPrice = Math.max(this.productPrice.discountedPrice, 0);
    },
    /** 计算开票总金额 */
    getInvoicePrice() {
      // 国内支付遵从原有逻辑，国际支付开票金额是0
      if (this.payMethod === 'CHN_PAY') {
        if (this.isExchange) {
          this.productPrice.invoicePrice = 0;
        } else {
          this.productPrice.invoicePrice = this.$util.accMul(this.productPrice.productPaymentMoney, this.orderForm.taxPoint);
        }
      } else {
        this.productPrice.invoicePrice = 0;
      }
    },
    /**
     * 计算应收总金额
     * 总应收金额 = 总销售价-优惠+开票金额
     * 总应收金额 = 总实际售价+开票金额
     * 两个计算公式都可以用
     */
    getTotalPrice() {
      this.productPrice.totalPrice = this.$util.accAdd(this.productPrice.productPaymentMoney, this.$options.filters.subStringNum(this.productPrice.invoicePrice));
    },
    chooseRefundWaySubmit(refundForm, refundProductDTOs) {
      this.refundForm = refundForm;
      this.params.refundProductDTOs = refundProductDTOs;
      this.refundOrderConfirmDialog = true;
    },

    uploadSuccess(filelist, fileName, file) {
      this.orderForm.paymentFile = filelist;
      this.curTransferVoucher = this.orderForm.paymentFile ? this.orderForm.paymentFile.split(',')[0] : '';
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(filelist) {
      this.orderForm.paymentFile = filelist;
      this.curTransferVoucher = this.orderForm.paymentFile ? this.orderForm.paymentFile.split(',')[0] : '';
    },

    goBack() {
      let path = this.isRenewalOrder ? '/renewalCenter/renewalOrder/index' : '/salesorder/index';
      setTimeout(() => {
        this.$router.push({
          path,
        });
      }, 300);
    },
    // 全屏模式
    fullScreen() {
      let ele = document.getElementById('goodsInfo');
      document.webkitFullscreenElement(ele);
      // this.$refs.goodsInfo.requestFullscreen();
    },
  },
};
</script>
<style lang="less" scoped>
@import url(./index.less);
.fullscreen {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.option-title {
  display: flex;
  text-align: center;
  background: #f6f8fa;
  padding: 4px 20px;
  span {
    flex: 1;
  }
}
.option-li {
  display: flex;
  text-align: center;
  span {
    flex: 1;
  }
}
</style>
<style lang="less">
.goods-name-cascader-popper {
  .el-cascader-menu:first-child {
    .el-cascader-node > .el-checkbox {
      display: none;
    }
  }
}
.exchange-table {
  .el-table__header-wrapper {
    .el-checkbox__input {
      display: none;
    }
  }
}
.overseapayradio {
  .is-disabled {
    .el-radio-button__orig-radio:disabled:checked + .el-radio-button__inner {
      background-color: #1890ff;
      color: #fff;
    }
    .el-radio-button__orig-radio:disabled + .el-radio-button__inner {
      // color: #fff;
    }
  }
}
</style>
