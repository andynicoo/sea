<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="ifBack"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <el-button v-if="eprDeclare.type != 2 && info.counrtyCode == 'DE'">
          <a @click="seeHistoryBuyInfo">查看历史购买信息</a>
        </el-button>
        <template>
          <el-button size="small" type="primary" v-if="[3, 4, 5, 6, -1].includes(eprDeclare.status)" @click="formSubmit" v-show="hasAuthority('D2_4')">提交申报</el-button>
        </template>

        <el-button @click="uploadReceiptDialog = true" v-if="eprDeclare.status == 7" type="primary" v-show="hasAuthority('D2_7')"> 上传回执 </el-button>

        <!-- 待上传资料 -->
        <template v-if="eprDeclare.status == 1 || eprDeclare.status == 2">
          <!-- <el-button size="small" type="primary" @click="submit" v-show="hasAuthority('J2_9')" :disabled="!(info.dataReview && info.dataReview.length && !isEdit) || isCancel">提交</el-button> -->
          <el-button :disabled="isCancel" size="small" @click="sendRemind" v-show="hasAuthority('D2_8')">发送提醒</el-button>
        </template>
        <el-button @click="confirmFeeVisible = true" v-if="eprDeclare.status == 10" type="primary" v-show="hasAuthority('D2_11')"> 款项确认 </el-button>

        <el-button @click="finishDeclare" v-if="eprDeclare.status == 7" type="primary" v-show="hasAuthority('D2_9')"> 完成申报 </el-button>
        <!-- 下载资料 -->
        <el-button v-if="[3, 4, 5, 6, 7, 8].includes(eprDeclare.status) && hasAuthority('D2_10')">
          <a @click="_downloadTemp">下载资料</a>
        </el-button>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">{{ info.nodeCodeName }}</div>
          </div>

          <div class="el-form-wrapper">
            <DynamicForm ref="dynamicForm" :moduleList="dataReview" :showBtn="false" @formSave="formSave" :counrtyCode="info.counrtyCode" @formCancel="isEdit = false" />

            <div class="titleStyle" v-if="info.counrtyCode === 'DE'">
              <div class="talkbubble" v-if="eprDeclare.type == 2">
                {{ eprDeclare.status == 0 ? '已购产品信息' : '当年实际出货产品信息' }}
              </div>
              <div v-else>本月实际销售总量</div>

              <div class="triangle"></div>
            </div>

            <div style="display: flex; width: 96%" v-if="eprDeclare.type == 1">
              <label class="el-form-item__label form-required" style="width: 110px">
                <span>WEEE产品信息</span>
              </label>

              <div style="width: calc(100% - 110px)">
                <el-table border :data="infos" style="margin: 20px 0" highlight-current-row>
                  <el-table-column label="注册产品信息" align="center">
                    <el-table-column min-width="150px" align="center" label="* 产品类别" prop="productCategory">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.productCategory" clearable filterable disabled>
                          <el-option v-for="item in productCategoryList" :key="item.value" :label="item.value" :value="item.value"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="150px" align="center" :label="info.counrtyCode === 'DE' ? '* 产品名称 (中文+英文)' : '* 产品名称（中/英文）'" prop="productName">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.productName" clearable size="small" disabled />
                      </template>
                    </el-table-column>
                    <el-table-column min-width="150px" align="center" label="* 对应的品牌LOGO" prop="productLogo">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.productLogo" clearable size="small" disabled />
                      </template>
                    </el-table-column>
                    <el-table-column min-width="150px" align="center" :label="info.counrtyCode === 'DE' ? '* 单边最大尺寸（厘米）' : '* 单边最大尺寸/cm'" prop="sideMaxSize">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.sideMaxSize" clearable size="small" disabled />
                      </template>
                    </el-table-column>
                    <el-table-column min-width="150px" align="center" label="* 实际本月销售总量（kg）" prop="saleWeight">
                      <template slot-scope="scope">
                        <el-input-number :min="0" :precision="3" :step="1" v-model="scope.row.saleWeight" disabled clearable size="small" />
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div style="display: flex; width: 96%" v-if="eprDeclare.type == 3 && info.counrtyCode == 'DE'">
              <label class="el-form-item__label form-required" style="width: 110px">
                <span>电池法产品信息</span>
              </label>

              <div style="width: calc(100% - 110px)">
                <BatteryProductDtos :value="buyInfoNews" disabled :showOnly="true" />
              </div>
            </div>

            <div style="display: flex; width: 96%" v-if="eprDeclare.type == 2 && info.counrtyCode == 'DE'">
              <!-- <label class="el-form-item__label form-required" style="width: 110px">
                <span>电池法产品信息</span>
              </label> -->

              <div style="width: calc(100% - 110px)" class="mt-20 mb-20">
                <!-- {{ infos }} -->
                <PackingProductDtos :value="infos" disabled :showOnly="true" :showHead="false" />
              </div>
            </div>

            <div v-if="[2, 3, 4, 5, 6, 7, 8, 10].includes(eprDeclare.status)">
              <div class="titleStyle mb-20">
                <div class="talkbubble" v-if="eprDeclare.type != 2">申报资料</div>
                <div class="talkbubble" v-else>
                  <span>{{ eprDeclare.status == 2 || eprDeclare.status == 10 ? '待补缴信息' : '申报产品信息' }}</span>
                </div>
                <div class="triangle"></div>
              </div>

              <div v-if="eprDeclare.type == 1">
                <el-table border :data="infos" highlight-current-row v-if="infos.length">
                  <el-table-column :label="decalreStr" align="center">
                    <el-table-column label="明细数据" align="center">
                      <el-table-column min-width="150px" align="center" label="* 产品类别" prop="productCategory"> </el-table-column>
                      <el-table-column min-width="150px" align="center" :label="info.counrtyCode == 'DE' ? '* 产品名称 (中文+英文)' : '* 产品名称（中/英文）'" prop="productName"> </el-table-column>
                      <el-table-column min-width="150px" align="center" label="* 对应的品牌LOGO" prop="productLogo"> </el-table-column>
                      <el-table-column min-width="150px" align="center" :label="info.counrtyCode == 'DE' ? '* 单边最大尺寸（厘米）' : '* 单边最大尺寸/cm'" prop="sideMaxSize"> </el-table-column>
                      <el-table-column min-width="150px" align="center" label="本月实际销售总量（吨）" prop="saleWeightTon"> </el-table-column>
                      <el-table-column align="center" label="当年实际销售总量（吨）" prop="saleTotalWeight"> </el-table-column>
                      <el-table-column align="center" label=""> </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table>
                <div class="declare-info" v-if="!infos.length">{{ decalreStr }}</div>

                <el-table border :data="summary" highlight-current-row :summary-method="getSummaries" show-summary>
                  <el-table-column label="汇总数据" align="center">
                    <el-table-column min-width="150px" align="center" label="* 产品类别" prop="productCategory"> </el-table-column>
                    <el-table-column min-width="150px" align="center" label="*本月实际销售总量（吨）" prop="saleWeightTon"> </el-table-column>
                    <el-table-column min-width="150px" align="center" label="* 当年累计实际销售总量（吨）" prop="saleTotalWeight"> </el-table-column>
                    <el-table-column min-width="150px" align="center" label="* 已购总量（吨）" prop="totalPurchased"> </el-table-column>
                    <el-table-column min-width="150px" align="center" label="溢出总量（吨）超出已购产品包含的回收重量" prop="excess"> </el-table-column>
                    <el-table-column align="center" label="待补缴金额（元）" prop="price"> </el-table-column>
                    <el-table-column align="center" label="补申报总量（吨）" prop="waitBuy"> </el-table-column>
                  </el-table-column>
                </el-table>
              </div>

              <div v-if="eprDeclare.type == 3 && info.counrtyCode == 'DE'">
                <el-table border :data="infoNews" highlight-current-row v-if="infoNews.length">
                  <el-table-column label="申报电池产品信息" align="center">
                    <el-table-column min-width="120px" align="center" label="电池类型" prop="batteryType"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="材料类型" prop="materialType"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="是否可以充电" prop="isCharge"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="单位重量" prop="unitWeight"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="单位重量(1KG以上电池需要填写)/KG" prop="batteryWeight"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="当年实际发货数量/个" prop="yearDeliveryNum"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="电池品牌" prop="batteryBrand"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="状态">
                      <template slot-scope="scope"> {{ scope.row.flagDeclare == 1 ? '已超出' : '已购' }} </template>
                    </el-table-column>
                    <el-table-column min-width="120px" align="center" label=""> </el-table-column>
                  </el-table-column>
                </el-table>

                <el-table border :data="summary.infoNews" highlight-current-row :span-method="handleSpan">
                  <el-table-column label="汇总数据" align="center">
                    <el-table-column min-width="120px" align="center" label="电池类型" prop="batteryType"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="材料类型" prop="materialType"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="是否可以充电" prop="isCharge"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="单位重量" prop="totalPurchased">
                      <template slot-scope="scope"> {{ scope.row.unitWeight }} <span v-show="scope.row.unitWeight == '1KG以上'">/</span> {{ scope.row.batteryWeight }} </template>
                    </el-table-column>
                    <el-table-column min-width="120px" align="center" label="当年实际发货数量/个" prop="yearDeliveryNum"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="电池单价：小电池(元/个）大电池（元/kg)" prop="batteryPrice"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="已购金额/元" prop="buyAmount">
                      <template>
                        {{ summary.buyAmount }}
                      </template>
                    </el-table-column>
                    <el-table-column min-width="120px" align="center" label="实需申报金额/元" prop="declarePrice"> </el-table-column>
                    <el-table-column min-width="120px" align="center" label="溢出需补缴金额/元" prop="sumBeyondbuyDaAmount">
                      <template>
                        {{ summary.sumBeyondbuyDaAmount }}
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>

              <div v-if="eprDeclare.type == 3 && info.counrtyCode == 'FR'">
                <el-table border :data="summary.infos" highlight-current-row>
                  <el-table-column min-width="120px" align="center" v-if="supplierCode != 'S000304'" label="生成商属性" prop="manufacturerAttr"> </el-table-column>
                  <el-table-column min-width="120px" align="center" v-if="supplierCode == 'S000304'" label="产品种类" prop="productType"> </el-table-column>
                  <el-table-column min-width="120px" align="center" label="电池是否和产品组合售卖" prop="combination"> </el-table-column>
                  <el-table-column min-width="120px" align="center" label="是否家用电池" v-if="supplierCode != 'S000304'" prop="household"> </el-table-column>
                  <el-table-column min-width="120px" align="center" label="充电类型" prop="chargingType"> </el-table-column>
                  <el-table-column min-width="120px" align="center" label="电池类型" prop="batteryType"> </el-table-column>
                  <el-table-column min-width="120px" align="center" label="单个电池的重量（g）" prop="weight"> </el-table-column>
                  <el-table-column min-width="120px" align="center" label="单个产品所含电池数量" prop="number"> </el-table-column>
                  <el-table-column min-width="120px" align="center" label="产品数量" prop="productNum"> </el-table-column>
                  <el-table-column min-width="120px" align="center" label="总费用（欧元）" prop="amount"> </el-table-column>
                </el-table>

                <div style="text-align: right; margin: 20px 10px">
                  <span>{{ [3, 7, 8].includes(eprDeclare.status) ? '实际补缴费用' : '需补缴费用' }} ：{{ eprDeclare.price }} 元</span>
                </div>
              </div>

              <div v-if="eprDeclare.type == 2 && info.counrtyCode == 'DE'">
                <PackingProductInfo :value="infos" />
                <el-table border :data="summary.productResult" highlight-current-row>
                  <el-table-column label="汇总数据" align="center">
                    <el-table-column align="center" label="Material type 材料类别" prop="cate"> </el-table-column>
                    <el-table-column align="center" label="当年实际出货总重量 Kg" prop="actualWeight"> </el-table-column>
                    <el-table-column align="center" label="已购重量（Kg）" prop="buyWeight"> </el-table-column>
                    <el-table-column align="center" label="溢出重量（吨）" prop="overflowWeight"> </el-table-column>
                    <el-table-column align="center" label="需补缴金额（元）" prop="excess">
                      <template slot-scope="scope">
                        <span>{{ scope.row.payAmount == -1 ? '待人工核算' : scope.row.payAmount }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="待申报重量（Kg）" prop="decalareWeight"> </el-table-column>
                  </el-table-column>
                </el-table>
                <el-row class="table-row">
                  <el-col class="table-col" :span="16"><div class="grid-content">* 注释： 如当年实际申报低于已购重量，则无需补缴，默认按照已购重量进行年度申报</div></el-col>

                  <el-col class="table-col" :span="4">
                    <div class="grid-content">需补缴金额总计： {{ totalCheckPrice }}</div>
                  </el-col>
                  <el-col class="table-col" :span="4"
                    ><div class="grid-content" v-if="[3, 7, 8].includes(eprDeclare.status)">实际补缴金额总计：{{ eprDeclare.price }}</div></el-col
                  >
                </el-row>
              </div>

              <div v-if="eprDeclare.type == 2 && info.counrtyCode == 'FR'">
                <div style="margin: 0 20px 20px; font-size: 16px">
                  <span>销售数量范围（CSU）</span>
                  <el-radio-group v-model="eprDeclare.productCategoryType" disabled>
                    <el-radio :label="1">包装数（最外层包装CSU）量小于1W个</el-radio>
                    <el-radio :label="2">包装数（最外层包装CSU）量1W-50W个</el-radio>
                    <el-radio :label="3">包装数（最外层包装CSU）量超过50W个</el-radio>
                  </el-radio-group>
                </div>
                <el-table border :data="eprDeclare.productCategoryType == 1 ? infos : summary.frEprProductCateFeeList" highlight-current-row>
                  <el-table-column label="申报信息" align="center">
                    <el-table-column align="center" label="产品系列" prop="parentProductCategoryName"> </el-table-column>
                    <el-table-column align="center" label="产品" prop="productCategoryName"> </el-table-column>
                    <el-table-column align="center" label="包装数量（最外层包装数CSU）" prop="outerPackageQuantity"> </el-table-column>
                    <el-table-column v-if="eprDeclare.productCategoryType != 1" align="center" label="包装数量（最小包装数CU）" prop="inPackageQuantity"> </el-table-column>
                    <el-table-column align="center" label="回收官费（欧元）" prop="excess">
                      <template slot-scope="scope">
                        <span>{{ scope.row.payAmount == -1 ? '待人工核算' : scope.row.payAmount }}</span>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>

                <div style="margin: 20px; font-size: 16px">
                  <span v-if="summary.simulateurDetailFileUrl">资料下载：<el-link v-for="(img, i) in $util.convertImage(summary.simulateurDetailFileUrl)" :key="i" :href="img" type="primary" target="_blank"> 申请表下载 </el-link> </span>
                  <span class="grid-content float-right"
                    >需补缴金额总计：
                    <span v-if="eprDeclare.price == -1">待人工核算</span>
                    <span v-else>{{ eprDeclare.price }}元</span>
                  </span>
                </div>
              </div>
            </div>
            <div v-if="[1, 2, 3, 4, 5, 6, 7, 8, 10].includes(eprDeclare.status)">
              <!-- 西班牙电池法 -->
              <div v-if="eprDeclare.status === 1" class="titleStyle">
                <div class="talkbubble">产品信息</div>
                <div class="triangle"></div>
              </div>
              <div v-if="eprDeclare.type == 3 && info.counrtyCode === 'ES'">
                <EsBatteryProductDeclare :eprDeclare="eprDeclare" :infoNews="infoNews" :summary="summary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-block-wrapper">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
          <el-tab-pane name="userInfo" label="用户信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block">
          <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
            <div class="block-title">服务信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ orderServicesVO.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">订单备案：</span>
              <span>{{ orderServicesVO.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ orderServicesVO.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">工单号：</span>
              <!-- 未找到字段 -->
              <span>{{ eprDeclare.workNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务进度：</span>
              <!-- 未找到字段 -->
              <span>{{ eprDeclare.status | filterStatus(progressList) }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span
                >{{ orderServicesVO.serviceName }}<span v-if="orderServicesVO.specName">({{ orderServicesVO.specName }})</span></span
              >
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ orderServicesVO.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务商：</span>
              <span>{{ orderServicesVO.supplierName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">创建时间：</span>
              <span>{{ orderServicesVO.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">审核通过时间：</span>
              <span>{{ orderServices.checkPassTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务完成时间：</span>
              <span>{{ orderServices.completionTime }}</span>
            </div>
            <div class="info-block-item" v-if="info.nodeCode != progressBarObj.WAIT_UPLOAD && info.nodeCode != progressBarObj.WAIT_REVIEW && info.nodeCode != progressBarObj.REVIEWED">
              <span class="info-block-title">合同：</span>
              <span v-if="orderServices.contract && orderServices.contract != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(orderServices.contract)" :key="i" :href="img" type="primary" target="_blank"> 合同 </el-link>
              </span>
            </div>
            <div class="info-block-item" v-if="info.nodeCode != progressBarObj.WAIT_UPLOAD && info.nodeCode != progressBarObj.WAIT_REVIEW && info.nodeCode != progressBarObj.REVIEWED">
              <span class="info-block-title">授权书：</span>
              <span v-if="orderServices.authCertificate && orderServices.authCertificate != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(orderServices.authCertificate)" :key="i" :href="img" type="primary" target="_blank"> 授权书 </el-link>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">证书：</span>
              <span v-for="(item, i) in orderServices.registrationReceipt" :key="i" style="margin-right: 10px">
                <el-link v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">证书</el-link>
              </span>
            </div>

            <div class="info-block-item" v-if="eprDeclare.declareReceipt">
              <span class="info-block-title">查看回执：</span>
              <span style="margin-right: 10px">
                <el-link type="primary" @click="showDeclareReceipt">回执</el-link>
              </span>
            </div>

            <div class="info-block-item">
              <span class="info-block-title">申报区间：</span>
              <span>{{ eprDeclare.beginTime }} - {{ eprDeclare.endTime }}</span>
            </div>

            <div class="info-block-item">
              <span class="info-block-title">申报截止日期：</span>
              <span>{{ eprDeclare.due }}</span>
            </div>

            <div class="info-block-item">
              <span class="info-block-title">服务截止时间：</span>
              <span>{{ orderServices.expirationTime }}</span>
            </div>

            <div class="info-block-item" v-if="info.orderServicesVO">
              <span class="info-block-title">补缴订单号：</span>
              <span>{{ info.eprDeclare.repairOrderNo }}</span>
            </div>
            <div class="info-block-item" v-if="info.orderServicesVO">
              <span class="info-block-title">补缴时间：</span>
              <span>{{ info.eprDeclare.repairPaymentTime }}</span>
            </div>
          </template>
          <template v-if="JSON.stringify(userInfo) != '{}' && (tabNav === 'all' || tabNav === 'userInfo')">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ orderServicesVO.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ orderServicesVO.companyNameZh }}</span>
            </div>
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
      <UploadReceiptDialog :uploadReceiptDialog.sync="uploadReceiptDialog" :declareReceipt="eprDeclare.declareReceipt" :getInfo="getInfo" :eprDeclare="eprDeclare"> </UploadReceiptDialog>
      <HistoryBuyInfoDialog :historyBuyInfoDialog.sync="historyBuyInfoDialog" :type="eprDeclare.type" :historyBuyInfoList="historyBuyInfoList"></HistoryBuyInfoDialog>

      <ShowReceiptDialog :showReceiptImgModel.sync="showReceiptImgModel" :imglist="imglist"></ShowReceiptDialog>
      <ConfirmFeeDialog :confirmFeeVisible.sync="confirmFeeVisible" :supplierCode="supplierCode" :countryCode="info.counrtyCode" :getInfo="getInfo" :eprDeclare="eprDeclare"></ConfirmFeeDialog>
    </div>
  </div>
</template>

<script>
import { progressBarObj } from './enumObj';
import moment from 'moment';
import Decimal from 'decimal.js';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import HistoryBuyInfoDialog from '@/view/module/workOrder/addCategoryBrand/components/historyBuyInfoDialog';
import { getBusinessLogListByWorkNo } from '@/api/newApi/common';
import ShowReceiptDialog from '@/view/module/workOrder/yearManage/components/showReceiptDialog';
import UploadReceiptDialog from './components/uploadReceiptDialog';
import * as comps from '../EPRManage/components/index';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { getDeclareInfo } from '@/api/newApi/workOrder/authorizedRepresent';
import BatteryProductDtos from '@/components/WorkOrderComponents/EPRProductItems/batteryProductDtos'; //电池法产品信息
import PackingProductDtos from '@/components/WorkOrderComponents/EPRProductItems/packingProductDtos'; //电池法产品信息
import PackingProductInfo from './components/packingProductInfo'; //电池法产品信息
import { saveDeclare, submitEpr, submitDeclaration, exportDeclaration, completeDeclaration, eprDeclareNotice, getEprHistoryInfo } from '@/api/newApi/workOrder/EPRManage';
import { exportDeclarationFr } from '@/api/newApi/workOrder/epr';
// import { getRejectCode } from '@/api/newApi/common';
// import mixin from '@/view/module/workOrder/mixin';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import ConfirmFeeDialog from './components/confirmFeeDialog';
import EsBatteryProductDeclare from './components/esBatteryProductDeclare';

export default {
  data() {
    return {
      serviceId: this.$route.query.serviceId,
      workNo: this.$route.query.workNo,
      workId: this.$route.query.workId,
      progressBarObj: progressBarObj,
      isEdit: false,
      info: {},
      infos: [],
      infoNews: [],
      buyInfoNews: [],
      summary: [],
      showReceiptImgModel: false,
      confirmFeeVisible: false,
      productCategoryList: [
        { value: '热交换器' },
        { value: '显示屏或屏幕大于100平方厘米的显示设备' },
        { value: '照明设备' },
        { value: '大型电子设备（能收缩到最短距离的长度超过50cm）' },
        { value: '小型电子电器设备（能收缩到最短距离的长度不超过50cm）' },
        { value: '小型IT和电信设备（外部尺寸不超过50cm）' },
      ],
      baseRule: { required: true, message: '请输入', trigger: 'blur' },
      authorizedAgentWorkOrder: {},
      orderServices: {},
      eprDeclare: {},
      orderServicesVO: {},
      moduleList: [],
      countrySelectList: [],
      uploadReceiptDialog: false,
      historyBuyInfoDialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      userInfo: {},
      authorizeFileInfo: [],
      historyBuyInfoList: [],
      imglist: [],
      supplierCode: '',
      progressList: [
        { nodeCode: 0, nodeName: '未开始' },
        { nodeCode: 1, nodeName: '待上传资料' },
        { nodeCode: 9, nodeName: '待上传资料(驳回)' },
        { nodeCode: 2, nodeName: '待补缴' },
        { nodeCode: 3, nodeName: '待申报-客户已补缴' },
        { nodeCode: 4, nodeName: '待申报-客户未补缴' },
        { nodeCode: 5, nodeName: '待申报-客户未超额' },
        { nodeCode: 6, nodeName: '待申报-客户未提交' },
        { nodeCode: 7, nodeName: '申报中' },
        { nodeCode: 8, nodeName: '申报完成' },
        { nodeCode: 10, nodeName: '款项待确认' },
      ],
      decalreStr: '',
      typeList: [
        { label: '德国WEEE申报', value: 1 },
        { label: '德国包装法申报', value: 2 },
        { label: '德国电池法申报', value: 3 },
      ],
    };
  },
  mixins: [operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    OperationLog,
    BatteryProductDtos,
    HistoryBuyInfoDialog,
    ShowReceiptDialog,
    UploadReceiptDialog,
    PackingProductDtos,
    PackingProductInfo,
    ConfirmFeeDialog,
    EsBatteryProductDeclare,
  },
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.nodeCode === status);
      return result ? result.nodeName : '';
    },
    filterType(type, typeList) {
      let result = typeList.find((item) => item.value === type);
      return result ? result.label : '';
    },
  },
  computed: {
    showEdit() {
      return true;
    },

    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          item.disabled = true;
        });
      });
      return this.moduleList;
    },
    totalCheckPrice() {
      if (!this.summary.productResult) {
        return '';
      }
      const price = this.summary.productResult.reduce((pre, cur) => {
        const de = new Decimal(pre);
        return cur.payAmount == -1 ? pre : de.add(Decimal.sub(cur.payAmount, 0));
      }, 0);
      // this.summary.toalPayAmount = price
      this.$set(this.summary, 'toalPayAmount', price.toFixed(2));

      return price.toFixed(2);
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    _downloadTemp() {
      const apiFuncName = this.info.counrtyCode == 'FR' && this.eprDeclare.type == 2 ? exportDeclarationFr : exportDeclaration;
      apiFuncName({
        eprTypes: this.eprDeclare.type,
        workNo: this.workNo,
      }).then((res) => {
        this.$util.exportFile(res);
      });
    },
    getOperationLog(businessNo, businessType) {
      getBusinessLogListByWorkNo({
        businessNo,
        businessType,
      }).then((res) => {
        if (res.code === 0) {
          this.activities = res.data;
        }
      });
    },
    finishDeclare() {
      completeDeclaration(this.eprDeclare).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.getInfo();
        }
      });
    },
    showDeclareReceipt() {
      this.imglist = this.eprDeclare.declareReceipt.split(',');
      if (this.imglist.length == 1) {
        window.open(this.replaceHttps(this.eprDeclare.declareReceipt));
        return;
      }
      this.showReceiptImgModel = true;
    },
    getSummaries(param) {
      const that = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '累计补缴金额';
          return;
        }
        switch (column.property) {
          case 'price':
            sums[index] = that.eprDeclare.price; //sums[index]是固定写法  表示的是每一空格是要写什么内容,this.totalPrice就是后台的数据
            break;
        }
      });

      return sums;
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

    getInfo() {
      getDeclareInfo({
        workNo: this.workNo,
      }).then((res) => {
        this.info = res.data;

        this.authorizedAgentWorkOrder = res.data.authorizedAgentWorkOrder;
        this.orderServices = res.data.eprWorkOrder;
        this.eprDeclare = res.data.eprDeclare;
        this.orderServicesVO = res.data.orderServicesVO;
        this.supplierCode = res.data.supplierCode;
        this.decalreStr = `（申报区间： ${this.eprDeclare.beginTime.split(' ')[0]} - ${this.eprDeclare.endTime.split(' ')[0]}）WEEE产品申报信息`;

        // this.ifCancel(res.data.orderServices.status);
        this.userInfo = res.data.userInfoVo;
        if (res.data.dataReview.length) {
          this.moduleList = res.data.dataReview.filter((item) => item.moduleCode != 'productInfo');
        }
        if (res.data.eprDeclare.infos) {
          this.infos = JSON.parse(res.data.eprDeclare.infos);
          this.infoNews = JSON.parse(res.data.eprDeclare.infos);
          console.log('saleWeight :>> ', JSON.stringify(this.infos));
          console.log('saleWeight1 :>> ', res.data.eprDeclare.infos);
        }
        if (res.data.eprDeclare.infoNews) {
          this.infoNews = JSON.parse(res.data.eprDeclare.infoNews);
        }

        if (res.data.eprDeclare.infoNews) {
          this.buyInfoNews = JSON.parse(res.data.eprDeclare.infoNews);
        }

        if (res.data.eprDeclare.summary) {
          this.summary = JSON.parse(res.data.eprDeclare.summary);
        }
        this.getOperationLog(this.eprDeclare.workNo, 3);
      });
    },
    getData() {
      getNodeField({
        nodeCode: this.$route.query.nodeCode,
        nodeId: '',
        workFlowId: this.orderServices.workflowId,
      })
        .then((res) => {
          this.moduleList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 发送提醒
    sendRemind() {
      this.$confirm('系统将给客户发送短信，提醒客户提交资料，是否确认发送短信？', '短信提醒', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        eprDeclareNotice({
          workIds: [this.workId],
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('发送成功！');
          }
        });
      });
    },
    // comfirmFee() {
    //   confirmExpensesApi({
    //     ...this.eprDeclare,
    //     summary: JSON.stringify(this.summary),
    //   }).then((res) => {
    //     if (res.code === 0) {
    //       this.$message.success('提交成功');
    //       this.getInfo();
    //     }
    //   });
    // },
    // 提交
    submit() {
      this.$refs.dynamicForm.onSubmit().then((info) => {
        this.$confirm('是否确认提交？', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          submitEpr({
            materialData: info,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.getInfo();
            }
          });
        });
      });
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
    // 保存
    formSave() {
      saveDeclare({
        ...this.eprDeclare,
        infos: JSON.stringify(this.infos),
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('保存成功');
          this.isEdit = false;
          this.getInfo();
        }
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/EPRDeclare/index',
      });
    },
    ifBack() {
      if (this.isEdit) {
        this.$confirm('本页面如有填写资料，请先点击页面顶部的保存按钮保存资料，再离开', '温馨提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '我已点保存按钮',
          cancelButtonText: '还没点保存按钮',
          type: 'warning',
          center: true,
        }).then(() => {
          this.back();
        });
      } else {
        this.back();
      }
    },
    initURL(obj = '') {
      let url = '';
      if (this.IsJsonString(obj)) {
        url = this.replaceHttps(JSON.parse(obj)[0] || '');
      } else {
        url = this.replaceHttps(obj);
      }
      return url;
    },
    // 判断是不是json
    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    formSubmit() {
      submitDeclaration({
        ...this.eprDeclare,
        supplierCode: this.info.supplierCode,
        counrtyCode: this.info.counrtyCode,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('提交成功');
          this.isEdit = false;
          this.getInfo();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  .app-container {
    width: calc(100% - 410px);
    flex: 0 0 calc(100% - 410px);
    margin-top: 10px;
    .header-container {
      padding-left: 30px;
      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
      }
      .el-form-wrapper {
        height: calc(100vh - 312px);
        overflow-y: auto;
      }
    }
  }
  .info-block {
    max-height: calc(100vh - 272px);
  }
}

.category-table {
  .el-table__header {
    width: 100%;

    .el-table__cell {
      height: 48px;
    }
  }

  /deep/ .el-table__header th {
    background: #fff !important;
  }

  /deep/ .el-table__cell {
    background: #fff !important;
  }

  .w-300 {
    width: 300px;
  }
}
.titleStyle {
  display: inline-flex;
  font-size: 14px;
  .talkbubble {
    height: 30px;
    background-color: #eaeaea;
    padding: 0 15px;
    line-height: 30px;
  }
  .triangle {
    width: 15px;
    border: 15px solid transparent;
    border-left: 10px solid #eaeaea;
  }
}

.form-required::before {
  content: '*';
  color: #f5222d;
  margin-right: 4px;
}

.declare-info {
  background: #ebf5ff !important;
  color: #333333;
  text-align: center;
  height: 54px;
  line-height: 54px;
  border: 1px solid #ebeef5;
  border-bottom: none;
}

.table-row {
  height: 60px;
  .table-col {
    border: 1px solid #ebeef5;
    border-top: none;
    height: 60px;
    line-height: 60px;
    border-right: none;
    padding-left: 10px;
  }
}
.el-radio__label {
  font-size: 16px;
}
</style>
