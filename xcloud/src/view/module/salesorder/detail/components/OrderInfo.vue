<template>
  <div id="salesOrderorderInfo">
    <div class="tittle">
      <el-divider direction="vertical"></el-divider>
      <span class="text-info">{{ detailInfo.orderTypeEn === 'EXCHANGE' ? '换货商品' : '商品信息' }}</span>

      <div class="float-right mr-20">
        <!-- {{ showRefundBtn }} -->
        <el-button :disabled="disabledOpportunityNo" type="primary" @click="submitOpportunityNo()" v-if="editOpportunityNoFlag">提交编辑商机</el-button>
        <el-button :disabled="disabledOpportunityNo" type="primary" @click="changeFlag()" v-else>编辑商机</el-button>
        <el-button type="primary" @click="refundOrder" v-if="showRefundBtn" v-show="hasAuthority('C2_25')">申请退款</el-button>
        <el-button @click="applyExchange" v-if="showExchangeBtn" v-show="hasAuthority('C2_38')">申请退换货</el-button>
      </div>
    </div>
    <el-table border :data="formatList" :span-method="objectSpanMethod" v-loading="tableLoading" :max-height="260" class="table">
      <el-table-column align="center" label="编号" width="70">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column align="left" label="商品名称" prop="productName" width="180">
        <template slot-scope="scope">
          {{ scope.row.productName }}
          <span class="bard-item">
            {{ detailInfo.activityType | activeFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="国家" prop="countryName"></el-table-column>
      <el-table-column align="center" label="服务项目" prop="specsName"></el-table-column>
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
      <el-table-column align="center" label="服务公司名称" prop="serviceCompanyName" width="150"></el-table-column>
      <el-table-column align="center" label="服务号" prop="serviceNo" width="150"></el-table-column>
      <el-table-column align="center" label="服务进度" prop="serviceProgressName" width="150"></el-table-column>
      <el-table-column align="center" label="服务状态" prop="serviceStatusName" width="150"></el-table-column>
      <el-table-column align="center" label="商机编号" prop="opportunityNo" width="180">
        <template slot-scope="scope">
          <template v-if="editOpportunityNoFlag">
            <span v-if="scope.row.opportunityNo">{{ scope.row.opportunityNo }}</span>
            <el-select v-else v-model="scope.row.opportunityNoInput" filterable clearable>
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
          <template v-else>
            {{ scope.row.opportunityNo || '-' }}
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="150" prop="operation">
        <template slot-scope="{ row }">
          <el-link type="primary" v-if="!detailInfo.renewFlag && (detailInfo.orderStatus === 'PAID' || (detailInfo.orderStatus === 'PART_PAID' && detailInfo.paymentTypeEn == 'PART'))" @click="createService(row)" v-show="hasAuthority('C2_43')">生成服务</el-link>
          <!-- <el-link type="primary" :underline="false" @click="refundOrder(scope.row)" v-if="scope.row.paymentStatus == '部分付款' || scope.row.paymentStatus == '已付款'" v-show="hasAuthority('C2_25')" class="mb-5"> 申请退款 </el-link>

          <el-link type="primary" :underline="false" v-if="scope.row.exchangeStatus" @click="applyExchange(scope.row)" v-show="hasAuthority('C2_25')"> 申请退换货 </el-link> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 申请退款 -->
    <el-dialog title="是否确认申请退款" :visible.sync="orderModel" width="392px">
      <el-form :model="service" :rules="rules" ref="serviceForm">
        <el-form-item label="是否说服过客户，你还要继续吗？" label-width="265px"></el-form-item>
        <el-form-item label="是否同时取消服务" prop="isCancelService" label-width="178px">
          <el-radio-group v-model="service.isCancelService">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="removeService">确 定</el-button>
        <el-button @click="orderModel = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-drawer size="80%" title="申请退款" :visible.sync="dialogvisible" @close="reset">
      <div slot="title" class="drawer-title-wrapper">
        <div class="drawer-title">申请退款</div>
        <div class="drawer-title-btn-group">
          <el-button @click="dialogvisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="refundConfirm" size="small">确 定</el-button>
        </div>
      </div>

      <div class="refund-left float-left">
        <p>
          <span class="refund-blod">可退款商品</span> <span>至少选择1个退款商品</span>
          <el-link class="float-right mt-10" type="primary" @click="autoFundDialogVisible = true">自动计算规则</el-link>
        </p>
        <el-table border :data="refundList" :max-height="560" class="table" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="selected"> </el-table-column>
          <el-table-column label="商品名称" prop="productName" width="200">
            <template slot-scope="scope">
              <span class="bold-font">{{ scope.row.productName }}</span
              >&nbsp;&nbsp;

              <el-tag type="danger" effect="dark" v-if="scope.row.showFinishFlag">已下号</el-tag>

              <br />
              服务项目：
              <!-- <el-tooltip popper-class="w-400" :content="item.serviceNo" placement="top" v-for="(item, index) in scope.row.orderProductDetail" :key="index">
                <span> {{ item.specsName }}; </span>
              </el-tooltip> -->
              <template v-for="(item, index) in scope.row.orderProductDetail"
                ><span style="color: #361ebb" :title="item.serviceNo" :key="index">{{ item.specsName }};</span></template
              >
              <br />
              服务公司：{{ scope.row.serviceCompanyNames.join(';') }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="实付金额（元）" prop="countryName">
            <template slot-scope="scope">
              {{ scope.row.productPaidMoney | formatQianFenWei }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="手续费（元）" width="160">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.refundPoundage" :min="0" :precision="2" :max="Number(scope.row.productPaidMoney)" size="small" @blur="changereFundPoundage(scope.row, scope.$index, scope.row.refundPoundage)" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="退款金额（元）" width="160">
            <template slot-scope="scope">
              <!-- ￥{{ scope.row.refundMoney | formatQianFenWei }} -->
              <el-input-number v-model="scope.row.refundMoney" :min="0" :precision="2" :max="Number(scope.row.productPaidMoney)" size="small" @blur="changereRefundMoney(scope.row, scope.$index, scope.row.refundMoney)" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="refund-right float-left">
        <h2>退款信息</h2>

        <p class="refund-tip">提示：微信支付超过30天，支付宝超过90天 ，线下转账不支持原路退回</p>

        <!-- <el-row class="title bold">
          <span>退款服务：{{ refund.productName }}</span>
          <span style="margin-left: 20px">支付金额：{{ refund.productPaidMoney | formatQianFenWei }}元</span>

        </el-row> -->
        <el-row class="title bold">
          <span>退款商品：{{ productName }}</span>
        </el-row>
        <el-row class="title bold" v-if="orderPayments.length">
          <span
            >实付金额： ￥{{ paidMoney }}
            <!-- 分期付款不展示外币信息 -->
            <template v-if="detailInfo.payMethod === 'INTL_PAY' && detailInfo.paymentTypeEn !== 'PART' && orderPayments.length"
              >{{ orderPayments[0].currencySymbol }}{{ floor(divide(paidMoney, orderPayments[0].exRate), 2) }}<span class="zt-ml-2">汇率：{{ orderPayments[0].exRate }}</span></template
            >
          </span>
          <span style="margin-left: 20px" v-if="orderPayments.length">付款方式：{{ orderPayments[0].paymentChannelName }}</span>
          <span style="margin-left: 20px" v-if="orderPayments.length">最后付款时间：{{ moment(orderPayments[0].paymentTime).format('YYYY-MM-DD') }}</span>
        </el-row>
        <el-form :model="refundForm" label-width="140px" :rules="rulefundform" ref="refundForm">
          <el-form-item label="选择退款类型" prop="refundApplyType">
            <el-radio-group v-model="refundForm.refundApplyType" @change="refundApplyTypeChange">
              <el-radio label="REFUND_CANCEL_SERVICE">退款并取消服务</el-radio>
              <el-radio label="ONLY_REFUND">仅退款</el-radio>
              <el-radio label="ONLY_CANCEL_SERVICE">仅取消服务</el-radio>
            </el-radio-group>
            <div class="item-tip" v-show="refundText">
              <i class="icon icon-tip"></i>
              {{ refundText }}
            </div>
          </el-form-item>
          <template v-if="refundForm.refundApplyType != 'ONLY_CANCEL_SERVICE'">
            <el-form-item label="退款路径" prop="refundMethod">
              <el-radio-group v-model="refundForm.refundMethod">
                <!-- 国际支付 退款路径 需要有原路退回-->
                <el-radio label="RETURN_TO_SOURCE" v-if="detailInfo.supportReturnSourceFlag">原路返回</el-radio>
                <el-radio label="RETURN_TO_BANK">退回到银行卡</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="手续费" prop="refundPoundage">
              <el-input v-model="refundForm.refundPoundage" placeholder="请输入" disabled type="number" :min="0" clearable style="width: 300px" size="small" />
              <div class="item-tip">
                <i class="icon icon-tip"></i>
                手续费为平台需要扣除的服务费，全额退款时输入为0
              </div>
            </el-form-item>
            <el-form-item label="不扣除手续费原因" prop="noPoundageReason">
              <el-input v-model="refundForm.noPoundageReason" placeholder="请输入不扣除手续费原因" clearable style="width: 300px" size="small" />
            </el-form-item>
            <el-form-item label="第三方平台手续费">
              <el-input v-model="refundForm.refundBacktrackCost" v-if="refundForm.refundMethod === 'RETURN_TO_SOURCE'" disabled placeholder="请输入" clearable style="width: 300px" size="small" />
              <el-input v-model="refundForm.refundCardCost" v-else disabled placeholder="请输入" clearable style="width: 300px" size="small" />
            </el-form-item>
            <!-- 退款金额，判断 支付类型 国内/国际
            （1）国内： 只 显示 退款金额
            （2）国际：退款金额 显示  人民币，增加 显示 外汇金额 （对应销售的订单客户支付的币种）；汇率取 销售订单当时记录的汇率。 根据汇率自动计算出对应外币金额             -->
            <!-- 退款金额<0时(商品金额小于手续费)无法退款 -->
            <el-form-item label="退款金额" prop="refundMoney">
              <template v-if="detailInfo.payMethod === 'CHN_PAY'"> ￥{{ refundNum }} </template>
              <template v-if="detailInfo.payMethod === 'INTL_PAY'">
                ￥{{ refundNum || '0.00' }}
                <!-- 分期付款不展示外币信息 -->
                <template v-if="detailInfo.paymentTypeEn !== 'PART' && orderPayments.length">
                  <span class="zt-ml-2">{{ orderPayments[0].currencySymbol }}</span>
                  {{ floor(divide(refundNum, orderPayments[0].exRate), 2) }} <span class="zt-ml-2">汇率:</span>{{ orderPayments[0].exRate }}
                </template>
              </template>
            </el-form-item>

            <el-form-item label="退款账户类型" prop="bankCountType" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
              <el-radio-group v-model="refundForm.bankCountType">
                <el-radio label="PERSONAL">个人</el-radio>
                <el-radio label="ENTERPRISE">企业</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="退款银行：" prop="refundBank" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
              <el-input v-model="refundForm.refundBank" placeholder="请输入" clearable style="width: 300px" size="small" />
            </el-form-item>
            <el-form-item label="退款账户：" prop="refundAccount" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
              <el-input v-model="refundForm.refundAccount" placeholder="请输入" clearable style="width: 300px" size="small" />
            </el-form-item>

            <el-form-item label="收款人姓名：" prop="refundPayee" v-if="refundForm.bankCountType == 'PERSONAL' && refundForm.refundMethod == 'RETURN_TO_BANK'">
              <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
            </el-form-item>
            <el-form-item label="收款公司名称：" prop="refundPayee" v-if="refundForm.bankCountType == 'ENTERPRISE' && refundForm.refundMethod == 'RETURN_TO_BANK'">
              <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
            </el-form-item>
            <el-form-item label="开户支行：" prop="bankBranch" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
              <el-input v-model="refundForm.bankBranch" placeholder="请输入" clearable style="width: 300px" size="small" />
            </el-form-item>

            <el-form-item label="省市：" prop="provincesCities">
              <el-select style="width: 145px; margin-right: 10px" v-model="refundForm.province" placeholder="省" filterable @change="provinceChange">
                <el-option :value="province.name" :label="province.name" v-for="province in provinceList" :key="province.id"></el-option>
              </el-select>
              <el-select style="width: 145px" v-model="refundForm.city" placeholder="市" filterable>
                <el-option :value="city.name" :label="city.name" v-for="city in cityList" :key="city.id"></el-option>
              </el-select>
            </el-form-item>
          </template>

          <el-form-item label="退款原因分类：" prop="refundReasonType">
            <el-select clearable style="width: 300px" placeholder="请选择" size="small" filterable v-model="refundForm.refundReasonType">
              <el-option v-for="(item, index) in refundclass" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退款原因：" prop="refundReason">
            <el-input
              type="textarea"
              :rows="6"
              style="width: 300px"
              v-model="refundForm.refundReason"
              placeholder="1、付款时间：
2、退款具体原因：
3、直属主管是否协助挽留：
4、客户是否有其他业务办理：
5、客户历史消费："
            />
          </el-form-item>
          <div v-if="showFinishText" class="finish-tip-wrap">你选择的退款服务已下号，请说明注销或转走，如转走请告知客户在当月30号之前转走，如未转走将默认税号注销，请在退款原因中备注处理方式</div>
        </el-form>
      </div>
    </el-drawer>

    <el-dialog title="自动退款规则" :visible.sync="autoFundDialogVisible" class="auto-fund-diag" width="850">
      <div>
        <p>辰海云商标、辰海云VAT对应的计算规则如下：</p>
        <span>1、若对应的服务工单已交付，原则上不能再退款，则“退款金额”为0；退款手续费等于商品的实付金额；</span><br />
        <span>2、若对应的服务工单未交付，退款手续费扣除规则如下：</span><br />
        <span class="two-indent"> 2.1、2022年5月1日之后支付成功的订单扣除手续费的规则：</span><br />
        <span class="four-indent"> a、普通客户自付款之日起15天内退款不扣除手续费，可全额退款；16-90天按照商品实付金额扣除10%手续费；91天及以上按照商品实付金额扣除20%手续费；</span><br />
        <span class="four-indent"> b、VIP和KA客户自付款之日起90天内不扣除手续费，可全额退款；91天及以上按照商品实付金额扣除10%手续费；</span><br />
        <span class="two-indent"> 2.2 、2021年7月1日-2022年4月30日支付成功的订单扣除手续费的规则：</span><br />
        <span class="four-indent"> a、普通客户自付款之日起30天内按照商品实付金额扣1.5%手续费；31-90天按照商品实付金额扣5%手续费；91-180天按照商品实付金额扣11.5%手续费；181天以上按照商品实付金额扣除21.5%手续费；</span><br />
        <span class="four-indent"> b、VIP和KA客户自付款之日起90天内不扣除手续费，可全额退款，91天及以上按照商品实付金额扣除10%手续费；</span><br />
        <span class="two-indent"> 2.3、2020年12月1日至 2021年6月30日支付成功的订单，统一按照商品实付金额扣除20%手续费；</span><br />
        <span class="two-indent"> 2.4、2020年11月30日之前支付成功的订单，不扣除任何手续费。</span><br /><br />

        <p>跨标云、跨税云对应的计算规则如下：</p>
        <span>1、若对应的服务工单已交付，原则上不能再退款，则“退款金额”为0；退款手续费等于商品的实付金额；</span><br />
        <span>2、若对应的服务工单未交付，退款手续费扣除规则如下：</span><br />
        <span class="two-indent"> 2.1、2022年5月1日之后支付成功的订单退款扣除手续费规则：</span><br />
        <span class="four-indent"> a、普通客户自付款之日起15天内退款不扣除手续费；16天-90天按照商品实付金额扣除10%手续费，91天及以上按照商品实付金额扣除20%手续费；</span><br />
        <span class="four-indent"> b、VIP和KA客户自付款之日起90天内不扣除手续费，91天及以上按照商品实付金额扣除10%手续费；</span><br />
        <span class="two-indent"> 2.2、2021年9月22日-2022年4月30日支付成功的订单扣除手续费规则：</span><br />
        <span class="four-indent"> a、确认到账日期算30天以内，按照商品实付金额扣1.5%手续费；</span><br />
        <span class="four-indent"> b、确认到账日期算31-90天，按照商品实付金额扣5%手续费；</span><br />
        <span class="four-indent"> c、确认到账日期算91-180天,按照商品实付金额扣11.5%手续费；</span><br />
        <span class="four-indent"> d、确认到账日期算181天及以上，按照商品实付金额扣除21.5%手续费；</span><br />
        <span class="two-indent">2.3、2021年9月21日之前支付成功的订单不扣除手续费。</span><br /><br />

        <p>卖旺科技对应的计算规则如下：</p>
        <span>1、若对应的服务工已交付，原则上不能再退款，则“退款金额”为0；退款手续费等于商品的实付金额；</span><br />
        <span>2、若对应的服务工单未交付，退款手续费扣除规则如下：</span><br />
        <span class="two-indent"> 2.1、2022年5月1日之后支付成功的订单退款扣除手续费规则：</span><br />
        <span class="four-indent"> a、普通客户自付款之日起15天内退款不扣除手续费；16天-90天按照商品实付金额扣除10%手续费，91天及以上按照商品实付金额扣除20%手续费；</span><br />
        <span class="four-indent"> b、VIP和KA客户自付款之日起90天内不扣除手续费，91天及以上按照商品实付金额扣除10%手续费；</span><br />
        <span class="two-indent"> 2.2、2022年4月30日之前支付成功的订单不扣除手续费。</span><br />
      </div>
    </el-dialog>

    <el-dialog title="确认退款申请" :visible.sync="confirmFundDialogVisible" width="500px">
      <div>
        <el-descriptions class="margin-top" title="" :column="1">
          <el-descriptions-item label="退款商品">{{ productName }}</el-descriptions-item>
          <el-descriptions-item label="退款类型">{{ refundForm.refundApplyType | filterRefundApplyType }}</el-descriptions-item>
          <el-descriptions-item label="退款路径" v-if="refundForm.refundApplyType != 'ONLY_CANCEL_SERVICE'">{{ refundForm.refundMethod | filterRefundMethod }}</el-descriptions-item>
          <el-descriptions-item label="实付金额" v-if="detailInfo.payMethod === 'INTL_PAY'"
            >￥{{ paidMoney }}
            <template v-if="orderPayments.length">
              {{ orderPayments[0].currencySymbol }}{{ floor(divide(refundForm.refundMoney, orderPayments[0].exRate), 2) }} <template v-if="detailInfo.payMethod === 'INTL_PAY'">汇率:{{ orderPayments[0].exRate }}</template>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="实付金额" v-else>￥{{ paidMoney }}</el-descriptions-item>
          <el-descriptions-item label="平台手续费" v-if="refundForm.refundApplyType != 'ONLY_CANCEL_SERVICE'">{{ refundForm.refundPoundage }}</el-descriptions-item>
          <el-descriptions-item label="第三方手续费" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">￥{{ refundForm.refundCardCost }}</el-descriptions-item>
          <el-descriptions-item label="省市" v-if="refundForm.refundApplyType != 'ONLY_CANCEL_SERVICE'">{{ refundForm.province }}{{ refundForm.city }}</el-descriptions-item>
          <el-descriptions-item label="退款原因分类">{{ refundForm.refundReasonType | refundReasonTypeFilter(refundclass) }}</el-descriptions-item>
          <el-descriptions-item label="退款原因">{{ refundForm.refundReason }}</el-descriptions-item>
          <el-descriptions-item label="退款金额" v-if="refundForm.refundApplyType != 'ONLY_CANCEL_SERVICE'">
            <template v-if="detailInfo.payMethod === 'INTL_PAY'">
              ￥{{ refundNum || '0.00' }}
              <template v-if="orderPayments.length">
                <span class="zt-ml-2">{{ orderPayments[0].currencySymbol }}</span
                >{{ floor(divide(refundNum, orderPayments[0].exRate), 2) }} <span class="zt-ml-2">汇率:</span>{{ orderPayments[0].exRate }}
              </template>
            </template>
            <template v-else> ￥{{ refundNum }} </template>
          </el-descriptions-item>
        </el-descriptions>

        <span slot="footer" class="dialog-footer">
          <div style="text-align: right">
            <el-button type="primary" @click="confirmRefund" :loading="isLoading">确 定</el-button>
            <el-button @click="confirmFundDialogVisible = false">取 消</el-button>
          </div>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UploadImages from '@/components/UploadImages/index'; //图片上传
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { applyOrderRefund, calculateRefundAmount, createOrderService } from '@/api/newApi/orderManage/salesorder.js';
import { getWorldCountryListByPid } from '@/api/newApi/customer/companyInfo';
import { getQywxOpportunity, editOpportunity } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import moment from 'moment';
import { divide, floor, cloneDeep } from 'lodash';

export default {
  components: { UploadImages, UploadFileUrl },
  props: {
    detailInfo: { type: Object },
    orderProducts: { type: Array },
    orderPayments: { type: Array },
    id: { type: String },
    paymentChannelList: { type: Array },
  },

  data() {
    var validateReason = (rule, value, callback) => {
      if (this.refundForm.refundPoundage === '0' && value === '') {
        callback(new Error('请输入不扣除手续费原因'));
      } else {
        callback();
      }
    };
    return {
      moment,
      divide,
      floor,
      tableLoading: false,
      buttonLoading: false,
      orderModel: false,
      confirmFundDialogVisible: false,
      radio: '2',
      productName: '',
      paidMoney: 0,
      autoFundDialogVisible: false,
      dialogvisible: false, //申请退款弹窗
      refundForm: {
        refundApplyType: 'REFUND_CANCEL_SERVICE',
        refundPoundage: '',
        refundMoney: '',
        refundBank: '',
        refundAccount: '',
        bankCountType: '',
        bankBranch: '',
        refundMethod: this.detailInfo && this.detailInfo.supportReturnSourceFlag ? 'RETURN_TO_SOURCE' : 'RETURN_TO_BANK',
        refundPayee: '',
        refundReasonType: '',
        refundReason: '',
        noPoundageReason: '',
        province: '',
        city: '',
        thirdRefundPoundage: 0, // 第三方手续费 废弃
        refundBacktrackCost: 0, // 第三方平台退款手续费-原路退回
        refundCardCost: 0, // 第三方平台退款手续费-退款转到卡费用
      },
      service: {
        isCancelService: null,
      },
      refund: {},
      formatList: [],
      provinceList: [],
      isLoading: false,
      cityList: [],
      rules: {
        isCancelService: [
          {
            required: true,
            message: '请选择是否取消服务',
            trigger: 'change',
          },
        ],
      },
      rulefundform: {
        refundApplyType: [
          {
            required: true,
            message: '请输入选择退款类型',
            trigger: 'change',
          },
        ],
        refundPoundage: [
          {
            required: true,
            message: '请输入退款手续费',
            trigger: 'blur',
          },
        ],
        refundMoney: [
          {
            required: true,
            message: '请输入退款金额',
            trigger: 'blur',
          },
        ],
        refundBank: [
          {
            required: true,
            message: '请输入银行名称',
            trigger: 'blur',
          },
        ],
        refundAccount: [
          {
            required: true,
            message: '请输入退款账户',
            trigger: 'blur',
          },
        ],
        refundPayee: [
          {
            required: true,
            message: '请输入收款人/公司名称',
            trigger: 'blur',
          },
        ],
        refundReasonType: [
          {
            required: true,
            message: '请选择退款原因分类',
            trigger: 'change',
          },
        ],
        refundMethod: [{ required: true, message: '请选择退款路径', trigger: 'change' }],
        bankBranch: [{ required: true, message: '请输入开户支行', trigger: 'blur' }],
        bankCountType: [{ required: true, message: '请选择退款账户类型', trigger: 'change' }],
        refundReason: [
          {
            required: true,
            message: '请输入退款原因',
            trigger: 'blur',
          },
        ],
        auditFile: [
          {
            required: true,
            message: '请上传凭证',
            trigger: 'change',
          },
        ],
        noPoundageReason: [{ validator: validateReason, trigger: 'change' }],
      },
      selectArr: [],
      refundList: [],
      refundclass: [
        { label: '客户店铺原因（挂掉/没注册下来等）', value: 'RRT001' },
        { label: '买多了/不想要了/拍错了', value: 'RRT002' },
        { label: '目前活动更优惠', value: 'RRT003' },
        { label: '重新合作/店铺关闭', value: 'RRT004' },
        { label: '时效太慢', value: 'RRT005' },
        { label: '信息弄错', value: 'RRT006' },
        { label: '服务态度不好', value: 'RRT007' },
        { label: '专业问题未及时处理', value: 'RRT008' },
        { label: '其他', value: 'RRT009' },
      ],
      disabledOpportunityNo: true, //是否禁用商机编辑，列表每一条都有商机就禁用编辑
      editOpportunityNoFlag: false, //是否编辑商机状态
      opportunityList: [], //商机列表
    };
  },
  computed: {
    refundText() {
      switch (this.refundForm.refundApplyType) {
        case 'ONLY_REFUND':
          return '仅退款，服务商品对应的服务工单正常交付';
        case 'ONLY_CANCEL_SERVICE':
          return '仅取消服务，钉钉审批通过后会自动取消服务，不退款';
        case 'REFUND_CANCEL_SERVICE':
          return '退款并取消服务，会同步取消已经生成的服务工单';
      }
    },
    refundKind() {
      // 1：微信 2：支付宝 3：银联
      // 如果为手工录单，退款方式为银联
      if (this.detailInfo.orderSource === 3) {
        return 3;
      }
      return this.detailInfo.paymentChannel;
    },

    showRefundBtn() {
      return this.formatList.find((item) => item.paymentStatus == '已付款');
    },

    showExchangeBtn() {
      if (this.detailInfo.orderType == '退换货订单') return false;
      return this.formatList.find((item) => item.outterExchangeStatus);
    },
    showFinishText() {
      return this.selectArr.find((item) => item.showFinishFlag);
    },

    // discAmountMoneyFun: function () {
    //   return function (param) {
    //     let { discAmountMoney, productOldMoney } = param;
    //     return discAmountMoney > productOldMoney ? productOldMoney : discAmountMoney;
    //   };
    // },
    // 退款金额 减去第三方平台手续费， 退款路径不同时，手续费不同
    refundNum() {
      let num = 0;
      let thirdRefundPoundage = this.refundForm.refundMethod === 'RETURN_TO_SOURCE' ? this.refundForm.refundBacktrackCost : this.refundForm.refundCardCost || 0;
      num = this.refundForm.refundMoney - thirdRefundPoundage;
      num > 0 ? '' : (num = 0);
      return num;
    },
  },
  watch: {
    'refundForm.refundMoney'(newVal) {
      if (newVal) {
        this.refundForm.refundMoney = Number(newVal);
      }
    },
    'refundForm.refundPoundage'(newVal) {
      if (newVal) {
        this.refundForm.refundPoundage = this.$util.formatPrice(newVal);
      }
    },
    orderProducts: {
      handler(val) {
        this.formatListData();
        this.formatRefundList();
      },
      immediate: true,
    },
  },
  filters: {
    filterPaymentChannel(paymentChannel, payChannelList) {
      return (payChannelList.find((item) => item.dataCode == paymentChannel) || {}).dataValue;
    },
    //订单状态
    filterPayStatus(val) {
      switch (val) {
        case 'WAIT_PAY':
          return '待付款 ';
        case 'PAID':
          return '已付款';
        case 'PART_PAID':
          return '部分付款';
        case 'APPLY_REFUND':
          return '申请退款';
        default:
          return '';
      }
    },
    activeFilter(activeType) {
      // （WAIT_PAY:待付款；WAIT_INFO:
      // 待补充信息；WAIT_INVOICE:
      // 待开票；INVOICED:已开票；APPLY_REFUND:申请退款；CANCEL:已取消）
      const activeTypeList = [
        {
          label: 'ZERO_BUY',
          value: '零元购',
        },
        {
          label: 'LOW_PRICE_SPIKE',
          value: '爆款低价秒杀',
        },
        {
          label: 'VAT_SPIKE',
          value: 'vat秒杀',
        },
        {
          label: 'ERP_SPIKE',
          value: 'erp秒杀',
        },
        {
          label: 'COM_GOODS',
          value: '组合商品',
        },
        {
          label: 'LIMIT_TIME_KILL',
          value: '官网限时秒杀活动',
        },
        {
          label: 'COUPON',
          value: '优惠卷',
        },
      ];
      let item = activeTypeList.find((i) => i.label === activeType);
      return item ? item.value : '';
    },
    filterRefundApplyType(type) {
      switch (type) {
        case 'ONLY_REFUND':
          return '仅退款';
        case 'REFUND_CANCEL_SERVICE':
          return '退款并取消服务';
        case 'ONLY_CANCEL_SERVICE':
          return '仅取消服务';
        default:
          return type;
      }
    },
    filterRefundMethod(method) {
      switch (method) {
        case 'RETURN_TO_SOURCE':
          return '原路返回';
        case 'RETURN_TO_BANK':
          return '退回到银行卡';
        default:
          return '';
      }
    },
    refundReasonTypeFilter(typeName, list) {
      let item = list.find((i) => i.value === typeName);
      return item ? item.label : '';
    },
  },
  created() {
    this.refundForm.enterpriseId = this.$util.getLocalStorage('enterpriseId');
    this.getProvinceOrCityList(1, 'province');
    // 国际支付退款只能  退回到银行卡
    if (this.detailInfo.payMethod === 'INTL_PAY') {
      this.refundForm.refundMethod = 'RETURN_TO_BANK';
    }
  },
  methods: {
    // 生成服务
    createService(row) {
      createOrderService(this.detailInfo.orderId).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.$parent.getDeatilData();
        }
      });
    },
    formatListData() {
      let list = [];
      let opportunityNoArr = [];
      this.orderProducts.forEach((item) => {
        if (item.opportunityNo) {
          opportunityNoArr.push(item.opportunityNo);
        }
        item.orderProductDetail.forEach((detail, i) => {
          list.push({
            ...item,
            ...detail,
            rowspan: item.orderProductDetail.length,
            index: i,
            outterExchangeStatus: item.exchangeStatus,
          });
        });
      });
      this.formatList = list;
      this.disabledOpportunityNo = opportunityNoArr.length === this.orderProducts.length ? true : false;
    },
    selected(row, index) {
      return row.isCancel;
    },
    formatRefundList() {
      let list = [];
      this.orderProducts.forEach((item) => {
        item.productPaidMoney = 0;
        item.specsName = '';
        item.specsNameTip = '';
        item.serviceCompanyNames = [];
        item.showFinishFlag = false;
        item.orderProductDetail.forEach((detail, i) => {
          item.orderProductId = detail.orderProductId;
          item.productName = detail.productName;
          item.specsName = item.specsName == '' ? item.specsName + detail.specsName : item.specsName + ';' + detail.specsName;
          item.specsNameTip = item.specsNameTip == '' ? item.specsName + '(' + detail.serviceNo + ')' : item.specsNameTip + ';\n' + detail.specsName + '(' + detail.serviceNo + ')';
          item.productPaidMoney = this.$util.accAdd(item.productPaidMoney, detail.productPaidMoney);
          if (detail.functionCode == 5 && detail.serviceProgressName == '已完成') {
            item.showFinishFlag = true;
          }
          if (!item.serviceCompanyNames.includes(detail.serviceCompanyName)) {
            item.serviceCompanyNames.push(detail.serviceCompanyName);
          }
        });
        item.isCancel = !!item.orderProductDetail.find((el) => el.serviceStatusName != '取消中' && el.serviceStatusName != '已取消' && el.paymentStatus != '部分付款');
        list.push(item);
      });
      this.refundList = list;
    },

    handleSelectionChange(val) {
      this.selectArr = val;
      // this.form.refundMoney = 0
      // this.form.refundPoundage = 0;

      this.refundForm.refundMoney = val.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.refundMoney);
      }, 0);

      this.refundForm.refundPoundage = val.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.refundPoundage);
      }, 0);

      this.productName = val.reduce((pre, cur) => {
        return pre == '' ? pre + cur.productName : pre + ',' + cur.productName;
      }, '');

      this.paidMoney = val.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.productPaidMoney);
      }, 0);
    },
    changereFundPoundage(item, index, val) {
      if (val != undefined) {
        const map = this.selectArr.map((item) => item.orderProductId);
        this.$set(this.refundList[index], 'refundMoney', this.$util.accSub(item.productPaidMoney, item.refundPoundage));
        if (map.includes(item.orderProductId)) {
          // this.$set(this.formatList[index], 'refundMoney', this.$util.accAdd(item.productPaidMoney, item.refundPoundage));
          this.handleSelectionChange(this.selectArr);
        }
      }
    },
    changereRefundMoney(item, index, val) {
      if (val != undefined) {
        const map = this.selectArr.map((item) => item.orderProductId);

        if (map.includes(item.orderProductId)) {
          // this.$set(this.formatList[index], 'refundMoney', this.$util.accAdd(item.productPaidMoney, item.refundPoundage));
          this.handleSelectionChange(this.selectArr);
        }
      }
    },
    objectSpanMethod({ row, column }) {
      let combineList = ['productName', 'opportunityNo'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    removeService() {
      this.$refs.serviceForm.validate((valid) => {
        if (valid) {
          this.dialogvisible = true;
        }
      });
    },
    refundApplyTypeChange(val) {
      if (val == 'ONLY_CANCEL_SERVICE') {
        this.refundForm = {
          ...this.refundForm,
          refundPoundage: this.refundForm.refundPoundage,
          refundMoney: this.refundForm.refundMoney,
          refundBank: '',
          refundAccount: '',
          bankBranch: '',
          refundPayee: '',
          bankCountType: '',
          province: '',
          refundMethod: this.refundForm.refundMethod,
          refundReasonType: '',
          refundApplyType: 'ONLY_CANCEL_SERVICE',
          refundReason: '',
          noPoundageReason: '',
          city: '',
        };
      }
    },
    /**
     * 取消服务
     */
    cancelService(row) {
      this.$confirm('取消后会产生成本费用，你还要继续吗？', '确定取消服务吗？', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {});
    },

    refundOrder(row) {
      let order = this.orderPayments;
      for (var i = 0; i < order.length; i++) {
        if (order[i].reconciliationStatus == 0 && order[i].paymentSource == 1) {
          this.$message.warning('请先确认发票到账');
          return false;
        }
      }

      this.refundList.forEach((item, index) => {
        calculateRefundAmount({
          orderProductId: item.orderProductId,
          orderId: this.detailInfo.orderId,
        }).then((res) => {
          if (res.code === 0) {
            console.log(res.data);
            // this.refundForm.refundPoundage = (res.data || {}).refundPoundage;
            if (JSON.stringify(res.data.refundPoundage) != '{}') {
              this.$set(this.refundList[index], 'refundPoundage', (res.data || {}).refundPoundage);
            }
            if (JSON.stringify(res.data.refundMoney) != '{}') {
              this.$set(this.refundList[index], 'refundMoney', (res.data || {}).refundMoney);
            }

            // this.refundForm.thirdRefundPoundage = res.data.thirdRefundPoundage;
            this.refundForm.refundBacktrackCost = res.data.refundBacktrackCost;
            this.refundForm.refundCardCost = res.data.refundCardCost;
          }
        });
      });
      // this.orderModel = true;
      this.dialogvisible = true;
      this.refund = row;
      this.refundForm.orderProductId = row.orderProductId;
      // 清空已选
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
        this.handleSelectionChange([]);
      });
    },
    applyExchange(row) {
      this.$router.push({
        path: '/manuelorder/index',
        query: {
          id: this.id,
          orderProductId: row.orderProductId,
          type: 'exchange',
          supportReturnSourceFlag: this.detailInfo.supportReturnSourceFlag,
        },
      });
    },
    reset() {
      if (this.$refs.refundForm) {
        this.$refs.refundForm.resetFields();
      }
    },
    /**
     * 申请退款
     */
    refundConfirm() {
      const errorRefundPoundageObj = this.selectArr.find((item) => item.refundPoundage === undefined || item.refundPoundage === '');
      if (errorRefundPoundageObj) {
        return this.$message.error('请填写正确的手续费');
      }
      if (!this.selectArr.length) {
        return this.$message.error('请选择要退款的商品');
      }
      if (this.refundForm.refundMoney == 0 && this.refundForm.refundApplyType != 'ONLY_CANCEL_SERVICE') {
        return this.$message.error('退款金额为0，只能选择仅取消服务');
      }
      this.$refs.refundForm.validate((valid) => {
        if (valid) {
          this.confirmFundDialogVisible = true;
          // productPaidMoney": 0,
          // 			"realRefundMoney": 0,
          // 			"refundPoundage": 0,
          // const refundProductDTOs = this.selectArr.map((item) => ({ orderProductId: item.orderProductId, productPaidMoney: item.productPaidMoney, realRefundMoney: item.refundMoney, refundPoundage: item.refundPoundage }));
          // applyOrderRefund({
          //   //后台录单，取银联方式
          //   // refundMethod: this.refundKind,
          //   // orderSource: this.detailInfo.orderSource,
          //   orderId: this.detailInfo.orderId,
          //   refundType: 'ORDER', // 商品
          //   ...this.refundForm,
          //   refundProductDTOs,
          // })
          //   .then((res) => {
          //     if (res.code == 0) {
          //       this.$message.success('申请成功');
          //       this.dialogvisible = false;

          //       this.$parent.getDeatilData();
          //     }
          //   })
          //   .catch((err) => {});
        }
      });
    },

    confirmRefund() {
      const refundProductDTOs = this.selectArr.map((item) => ({ orderProductId: item.orderProductId, productPaidMoney: item.productPaidMoney, realRefundMoney: item.refundMoney, refundPoundage: item.refundPoundage }));
      this.isLoading = true;
      let params = cloneDeep(this.refundForm);
      params.refundMoney = this.refundNum;
      let { refundMethod, refundBacktrackCost, refundCardCost } = this.refundForm;
      params.thirdRefundPoundage = refundMethod === 'RETURN_TO_SOURCE' ? refundBacktrackCost : refundCardCost;
      // 切换退款类型时，仅取消服务时，为计算 退款金额 保留了两个值， 提交时清空
      if (params.refundApplyType === 'ONLY_CANCEL_SERVICE') {
        params.refundMoney = 0;
        params.refundPoundage = 0;
        params.refundMethod = '';
      }
      applyOrderRefund({
        orderId: this.detailInfo.orderId,
        refundType: 'ORDER', // 商品
        ...params,
        refundProductDTOs,
      })
        .then((res) => {
          this.isLoading = false;
          if (res.code == 0) {
            this.$message.success('申请成功');
            this.dialogvisible = false;
            this.confirmFundDialogVisible = false;

            this.$parent.getDeatilData();
          }
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
    /**
     * 获取默认图片 优先pc端
     */
    getImgSrc(pcImg, mobileImg) {
      let img1 = !pcImg || pcImg.length == 0 ? [] : JSON.parse(pcImg);
      let img2 = !mobileImg || mobileImg.length == 0 ? [] : JSON.parse(mobileImg);
      return (img1.length == 0 ? false : img1[0].imgUrl) || (img2.length == 0 ? '' : img2[0].imgUrl);
    },
    // 获取省市列表
    getProvinceOrCityList(pid, type) {
      getWorldCountryListByPid({
        pid,
      }).then((res) => {
        if (type === 'province') {
          this.provinceList = res.data;
        } else if (type === 'city') {
          this.cityList = res.data;
        }
      });
    },
    // 更改省
    provinceChange(name) {
      // 根据名称获取id
      let id = this.provinceList.find((item) => item.name == name).id;
      this.getProvinceOrCityList(id, 'city');
      this.refundForm.city = '';
    },
    /**
     * 上传图片的操作
     */
    uploadSuccess(file) {
      this.refundForm.auditFile = file;
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file, uploadFiles) {
      this.refundForm.auditFile = file;
    },
    // 获取商机列表
    getOpportunityList() {
      getQywxOpportunity({
        enterpriseId: localStorage.getItem('enterpriseId'),
        userId: this.detailInfo.attributionId,
      }).then((res) => {
        if (res.code === 0) {
          this.opportunityList = res.data || [];
          for (const li of this.opportunityList) {
            if (li.customerList) {
              const arr = JSON.parse(li.customerList);
              li.nickName = JSON.parse(li.customerList)[0].nickName;
            }
          }
        }
      });
    },
    //编辑商机
    changeFlag() {
      this.editOpportunityNoFlag = true;
      if (this.opportunityList.length === 0) {
        this.getOpportunityList();
      }
    },
    //提交编辑商机
    submitOpportunityNo() {
      const list = this.formatList.filter((v) => v.index === 0 && v.opportunityNoInput) || [];
      if (list.length === 0) {
        this.$message.error('请添加商机编号');
        return false;
      }
      this.$confirm('确认提交后，已填入商机将不能再次修改', '请注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        editOpportunity({
          orderId: this.detailInfo.orderId,
          productList: list.map((v) => {
            return {
              opportunityNo: v.opportunityNoInput,
              orderProductId: v.orderProductId,
              opportunityEnterpriseId: (this.opportunityList.find((opportunity) => opportunity.opportunityNo === v.opportunityNoInput) || {}).enterpriseId,
            };
          }),
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.editOpportunityNoFlag = false;
            for (const li of list) {
              li.opportunityNo = li.opportunityNoInput;
            }
            const list2 = this.formatList.filter((v) => v.index === 0 && v.opportunityNo) || [];
            this.disabledOpportunityNo = list2.length === this.orderProducts.length ? true : false;
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table .el-table__header th {
  background: #f6f6f6 !important;
}
#salesOrderorderInfo {
  // margin: 30px 0px;
  .tittle {
    // padding: 24px 0px 0px 0px;
    font-size: 16px;
    font-weight: bold;
  }
  .table {
    margin: 15px 20px;
    width: auto;
  }
}
.title {
  margin: 0 20px 10px 20px;
  font-size: 14px;
  color: black;
  &.bold {
    font-weight: bold;
    margin-bottom: 20px;
  }
}
// ::v-deep .el-drawer {
//   width: auto !important;
// }
::v-deep .el-drawer__header {
  padding: 0 30px;
  border-bottom: 1px solid #ddd;
}
.drawer-title-wrapper {
  height: 60px;
  padding-right: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .drawer-title {
    font-size: 14px;
    color: #333;
  }
}
.item-tip {
  line-height: 28px;
  box-shadow: 0px 2px 3px 0px rgba(57, 61, 70, 0.06), 0px -2px 3px 0px rgba(57, 61, 70, 0.06);
  color: #999;
  padding: 0 20px;
  margin-top: 10px;
}
.auto-fund-diag ::v-deep .el-dialog__body {
  max-height: 500px;
  overflow: auto;
}
.auto-fund-diag p {
  font-size: 16px;
  margin-bottom: 10px;
}

.auto-fund-diag .two-indent {
  margin-left: 20px;
}

.auto-fund-diag .four-indent {
  margin-left: 40px;
}
.bard-item {
  display: inline-block;
  padding: 0px 7px;
  background: #444;
  color: #fff;
  border-radius: 4px;
}
.refund-left {
  width: 50%;
}

.refund-right {
  padding-left: 30px;
  width: 48%;
  .refund-tip {
    height: 32px;
    line-height: 32px;
    background: #f2f2f2;
    padding-left: 20px;
    margin-bottom: 10px;
  }
}

::v-deep .el-drawer__body {
  padding: 0 40px;
  h2,
  .refund-blod {
    font-size: 22px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 800;
    margin-right: 20px;
  }
}

.drawer-title-wrapper ::v-deep.drawer-title {
  font-size: 18px;
}

::v-deep .el-drawer__header {
  margin-bottom: 10px !important;
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
.el-tag--small {
  height: 20px;
  padding: 0 4px;
  line-height: 18px;
  font-size: 11px;
}
.bold-font {
  color: #333;
  font-weight: 700;
}
.finish-tip-wrap {
  width: 450px;
  border: 1px solid #f5222d;
  padding: 10px;
  color: #f5222d;
  border-radius: 4px;
  margin-bottom: 15px;
}
</style>
