<template>
  <div>
    <el-drawer :size="750" :visible.sync="dialogvisible">
      <template slot="title">
        <p class="font-14">申报数据</p>
        <el-link class="view-receipts" type="primary" :underline="false" v-if="taxesDate.declareReceipt" @click="downloadDeclareReceipt(taxesDate.declareReceipt)">查看回执</el-link>
      </template>

      <div class="conten">
        <template v-if="countryCode == 'GB'">
          <div class="declare-detail-wrap">
            <el-descriptions :column="2">
              <el-descriptions-item label="VAT税号">{{ taxesDate.vatTaxNumber }}</el-descriptions-item>

              <el-descriptions-item label="周期类型">
                {{ taxesDate.declarePeriod == 0 ? '月报' : taxesDate.declarePeriod == 1 ? '季报' : '年报' }}
              </el-descriptions-item>

              <el-descriptions-item label="申报周期"> {{ (taxesDate.beginTime || '').split(' ')[0] }}~{{ (taxesDate.endTime || '').split(' ')[0] }} </el-descriptions-item>
              <el-descriptions-item label="税率">{{ taxesDate.taxRate }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="declare-detail-wrap">
            <p>汇总数据</p>
            <el-descriptions :column="2">
              <el-descriptions-item label="未代扣代缴不含税销售额">￡ &nbsp;&nbsp; {{ taxesDate.excludeTaxPrice | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="平台已代扣代缴不含税销售额">￡ &nbsp;&nbsp; {{ taxesDate.agentTaxPrice | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="销项税金">￡ &nbsp;&nbsp; {{ taxesDate.taxAmtTotal | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="进项税金">￡ &nbsp;&nbsp; {{ taxesDate.inputTax | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="出口不含税销售额">￡ &nbsp;&nbsp; {{ taxesDate.exportExclTaxAmount | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="0税率供应不含税销售额">￡ &nbsp;&nbsp; {{ taxesDate.supplySalesExcludeTaxAmount | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="PVA金额">￡ &nbsp;&nbsp; {{ taxesDate.discountAmount | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="最终应缴税金">￡ &nbsp;&nbsp; {{ taxesDate.allTaxPrice | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="税金确认单">
                <el-link type="primary" :underline="false" v-if="taxesDate.declareRule == 1" @click="downloadShuijinForms">点击查看</el-link>
                <span v-else>暂无</span>
              </el-descriptions-item>

              <el-descriptions-item label="缴税凭证">
                <el-link type="primary" :underline="false" v-if="taxesDate.taxCertificate" :href="taxesDate.taxCertificate.slice(0, 5) == 'http:' ? taxesDate.taxCertificate.slice(0, 4) + 's' + taxesDate.taxCertificate.slice(4) : taxesDate.taxCertificate" target="_blank"> 点击查看 </el-link>
                <span v-else>暂无</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="declare-detail-wrap">
            <p>亚马逊</p>
            <el-descriptions :column="2">
              <el-descriptions-item label="亚马逊未代扣代缴不含税销售额">￡ &nbsp;&nbsp; {{ taxesDate.awsHandExcludeTaxSales | formatQianFenWei }}</el-descriptions-item>

              <el-descriptions-item label="亚马逊销售文件">
                <el-link type="primary" :underline="false" v-if="taxesDate.sellFile" @click="download(taxesDate.sellFile)"> 下载 </el-link>
                <span v-else>暂无</span>
              </el-descriptions-item>

              <el-descriptions-item label="亚马逊已代扣代缴不含税销售额"> ￡ &nbsp;&nbsp; {{ taxesDate.awsExcludeTaxSales | formatQianFenWei }} </el-descriptions-item>
              <el-descriptions-item label="亚马逊出口不含税销售额">￡ &nbsp;&nbsp; {{ taxesDate.exportExcludeTaxSales | formatQianFenWei }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="declare-detail-wrap">
            <p>其他平台</p>
            <el-descriptions :column="2">
              <el-descriptions-item label="其他平台未代扣代缴不含税销售额">￡ &nbsp;&nbsp; {{ taxesDate.handExIncludeTaxSales | formatQianFenWei }}</el-descriptions-item>

              <el-descriptions-item label="其他平台销售文件">
                <el-link type="primary" :underline="false" v-if="taxesDate.otherSaleFileUrl" @click="download(taxesDate.otherSaleFileUrl)"> 下载 </el-link>
                <span v-else>暂无</span>
              </el-descriptions-item>

              <el-descriptions-item label="其他平台已代扣代缴不含税销售额"> ￡ &nbsp;&nbsp; {{ taxesDate.handExPlatformWithHoldandRemitTax | formatQianFenWei }} </el-descriptions-item>
              <el-descriptions-item label="其他平台出口不含税销售额">￡ &nbsp;&nbsp; {{ taxesDate.otherExIncludeTaxAmt | formatQianFenWei }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </template>

        <template v-if="europeanUnion">
          <div class="declare-detail-wrap">
            <el-descriptions :column="2">
              <el-descriptions-item label="VAT税号">{{ taxesDate.vatTaxNumber }}</el-descriptions-item>

              <el-descriptions-item label="周期类型">
                {{ taxesDate.declarePeriod == 0 ? '月报' : taxesDate.declarePeriod == 1 ? '季报' : '年报' }}
              </el-descriptions-item>

              <el-descriptions-item label="申报周期"> {{ (taxesDate.beginTime || '').split(' ')[0] }}~{{ (taxesDate.endTime || '').split(' ')[0] }} </el-descriptions-item>
              <el-descriptions-item label="税率">{{ taxesDate.taxRate ? taxesDate.taxRate + '%' : taxesDate.taxRate }}</el-descriptions-item>
              <el-descriptions-item label="报税方式">{{ taxesDate.declareRule == 1 ? '有数据' : '零申报' }}</el-descriptions-item>
              <template v-if="taxesDate.declareRule == 1">
                <el-descriptions-item label="公司注册所在国家">{{ taxesDate.registerCountryCode }}</el-descriptions-item>
                <el-descriptions-item label="OSS税号">{{ taxesDate.oss ? '有' : '无' }}</el-descriptions-item>
                <el-descriptions-item label="IOSS税号">{{ taxesDate.ioss ? '有' : '无' }}</el-descriptions-item>
                <el-descriptions-item label="其他有税号国家">{{ taxesDate.tfnCountryCode }}</el-descriptions-item>
              </template>
            </el-descriptions>
          </div>

          <div class="declare-detail-wrap" v-if="taxesDate.declareRule == 1">
            <p>汇总数据</p>
            <el-descriptions :column="2">
              <el-descriptions-item label="平台未代扣代缴不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.noPayExcludeTaxSales | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="平台已代扣代缴不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.paidExcludeTaxSales | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="销项税金">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.taxAmtTotal | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="进项税金">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.inputTax | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="出口不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.exportExclTaxAmount | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item v-if="['IT', 'NL', 'ES', 'FR'].includes(countryCode)" label="本国B2B0税率供应不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.homeCountryB2bSupplySalesExcludeTaxAmount | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="欧盟内跨境B2B不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.eurB2bExcludeTaxSales | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="最终应缴税金">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.allTaxPrice | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="税金确认单">
                <el-link type="primary" :underline="false" v-if="taxesDate.declareRule == 1" @click="downloadShuijinForms">点击查看</el-link>
                <span v-else>暂无</span>
              </el-descriptions-item>

              <el-descriptions-item label="缴税凭证">
                <el-link type="primary" :underline="false" v-if="taxesDate.taxCertificate" :href="taxesDate.taxCertificate.slice(0, 5) == 'http:' ? taxesDate.taxCertificate.slice(0, 4) + 's' + taxesDate.taxCertificate.slice(4) : taxesDate.taxCertificate" target="_blank"> 点击查看 </el-link>
                <span v-else>暂无</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="declare-detail-wrap" v-if="taxesDate.declareRule == 1">
            <p>亚马逊</p>
            <el-descriptions :column="2">
              <el-descriptions-item label="亚马逊未代扣代缴不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.awsHandExcludeTaxSales | formatQianFenWei }}</el-descriptions-item>

              <el-descriptions-item label="亚马逊销售文件">
                <el-link type="primary" :underline="false" v-if="taxesDate.sellFile" @click="download(taxesDate.sellFile)"> 下载 </el-link>
                <span v-else>暂无</span>
              </el-descriptions-item>

              <el-descriptions-item label="亚马逊已代扣代缴不含税销售额"> {{ getUnit }} &nbsp;&nbsp; {{ taxesDate.awsExcludeTaxSales | formatQianFenWei }} </el-descriptions-item>
              <el-descriptions-item label="亚马逊出口不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.exportExcludeTaxSales | formatQianFenWei }}</el-descriptions-item>

              <el-descriptions-item label="库存转运（移仓） 到达不含税销售额"> {{ getUnit }} &nbsp;&nbsp; {{ taxesDate.fcTransferArriExcludeSale | formatQianFenWei }} </el-descriptions-item>
              <el-descriptions-item label="库存转运（移仓） 发出不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.fcTransferSendExcludeSale | formatQianFenWei }}</el-descriptions-item>
              <el-descriptions-item label="共享库存_购买不含税销售额"> {{ getUnit }} &nbsp;&nbsp; {{ taxesDate.comminglingBuySale | formatQianFenWei }} </el-descriptions-item>
              <el-descriptions-item label="共享库存_销售不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.comminglingSellSale | formatQianFenWei }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="declare-detail-wrap" v-if="taxesDate.declareRule == 1">
            <p>其他平台</p>
            <el-descriptions :column="2">
              <el-descriptions-item label="其他平台未代扣代缴不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.handExIncludeTaxSales | formatQianFenWei }}</el-descriptions-item>

              <el-descriptions-item label="其他平台销售文件">
                <el-link type="primary" :underline="false" v-if="taxesDate.otherSaleFileUrl" @click="download(taxesDate.otherSaleFileUrl)"> 下载 </el-link>
                <span v-else>暂无</span>
              </el-descriptions-item>

              <el-descriptions-item label="其他平台已代扣代缴不含税销售额"> {{ getUnit }} &nbsp;&nbsp; {{ taxesDate.handExPlatformWithHoldandRemitTax | formatQianFenWei }} </el-descriptions-item>
              <el-descriptions-item label="其他平台出口不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.otherExIncludeTaxAmt | formatQianFenWei }}</el-descriptions-item>

              <el-descriptions-item label="其他平台跨境B2B不含税销售额">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.eurOtherB2bExcludeTaxSales | formatQianFenWei }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="declare-detail-wrap">
            <p>{{ taxesDate.declareRule == 1 ? '其他数据' : '申报数据' }}</p>
            <el-descriptions :column="2" v-if="taxesDate.declareRule != 1">
              <el-descriptions-item label="零申报凭证" :span="1"><el-link type="primary" :underline="false" v-if="taxesDate.sellFile" @click="download(taxesDate.sellFile)"> 下载 </el-link> </el-descriptions-item>
            </el-descriptions>

            <template v-if="countryCode == 'DE'">
              <el-descriptions :column="2">
                <el-descriptions-item label="欧盟内免税收购项金额" :span="2">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.eurOtherEcAcqPrice || 0 }}</el-descriptions-item>
                <el-descriptions-item label="欧盟内免税收购项文件" :span="2">
                  <el-link type="primary" :underline="false" :href="replaceHttps(taxesDate.otherEcAcqPriceFile)" target="_blank" v-if="taxesDate.otherEcAcqPriceFile"> 下载 </el-link>
                  <span v-else>暂无</span>
                </el-descriptions-item>
                <el-descriptions-item label="欧盟内免税采购项金额" :span="2">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.freePurchasePrice || 0 }}</el-descriptions-item>
                <el-descriptions-item label="欧盟内免税采购项文件" :span="2">
                  <el-link type="primary" :underline="false" :href="replaceHttps(taxesDate.freePurchaseFile)" target="_blank" v-if="taxesDate.freePurchaseFile"> 下载 </el-link>
                  <span v-else>暂无</span>
                </el-descriptions-item>
                <el-descriptions-item label="线下申报数据文件" :span="2" v-if="countryCode == 'GB' || countryCode == 'DE'">
                  <el-link type="primary" :underline="false" :href="replaceHttps(taxesDate.sellOfflineFile)" target="_blank" v-if="taxesDate.sellOfflineFile"> 下载 </el-link>
                  <span v-else>暂无</span>
                </el-descriptions-item>
              </el-descriptions>
            </template>

            <template v-if="countryCode == 'ES'">
              <el-descriptions :column="2">
                <el-descriptions-item label="ECL申报" :span="1">{{ taxesDate.isEcl ? '是' : '否' }}</el-descriptions-item>
                <el-descriptions-item label="ECL销售项金额" :span="2">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.eclSalePrice }}</el-descriptions-item>
                <el-descriptions-item label="ECL采购项金额" :span="2">{{ getUnit }} &nbsp;&nbsp; {{ taxesDate.eclPurchasePrice }}</el-descriptions-item>
              </el-descriptions>
            </template>
            <!-- {{ countryCode }} -->
            <template v-if="countryCode == 'FR'">
              <el-descriptions :column="2">
                <el-descriptions-item label="是否有法国递延" :span="2">
                  {{ taxesDate.frenchDeferredFlag == 1 ? '是' : '否' }}
                </el-descriptions-item>
                <template v-if="taxesDate.frenchDeferredFlag == 1">
                  <el-descriptions-item label="法国海关号">
                    {{ taxesDate.frenchDeferredDTO.customsNumber }}
                  </el-descriptions-item>
                  <el-descriptions-item label="进口递延开始日期">
                    {{ (taxesDate.frenchDeferredDTO.startDate || '').split(' ')[0] }}
                  </el-descriptions-item>
                  <el-descriptions-item label="进口递延应税金额"> {{ getUnit }} &nbsp;&nbsp; {{ taxesDate.frenchDeferredDTO.taxableAmount }} </el-descriptions-item>

                  <el-descriptions-item label="进口递延文件">
                    <el-link type="primary" :underline="false" v-if="taxesDate.frenchDeferredDTO.deferredFilePath" :href="replaceHttps(taxesDate.frenchDeferredDTO.deferredFilePath)" target="_blank"> 下载 </el-link>
                    <span v-else>暂无</span>
                  </el-descriptions-item>
                </template>
              </el-descriptions>
            </template>
          </div>
        </template>

        <el-descriptions :column="2" border v-if="countryCode != 'GB' && !europeanUnion">
          <el-descriptions-item label="VAT税号">{{ taxesDate.vatTaxNumber }}</el-descriptions-item>
          <el-descriptions-item label="含税销售额">{{ taxesDate.includeTaxPrice }}</el-descriptions-item>
          <el-descriptions-item label="周期类型">
            {{ taxesDate.declarePeriod == 0 ? '月报' : taxesDate.declarePeriod == 1 ? '季报' : '年报' }}
          </el-descriptions-item>
          <el-descriptions-item label="不含税销售额">{{ taxesDate.excludeTaxPrice }}</el-descriptions-item>
          <el-descriptions-item label="申报周期"> {{ (taxesDate.beginTime || '').split(' ')[0] }}~{{ (taxesDate.endTime || '').split(' ')[0] }} </el-descriptions-item>
          <el-descriptions-item label="抵扣金额">{{ taxesDate.deductionPrice }}</el-descriptions-item>
          <el-descriptions-item label="销售平台">
            {{ taxesDate.salePlatformType == 0 ? '亚马逊' : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="销项税金">{{ taxesDate.taxAmtTotal }}</el-descriptions-item>
          <el-descriptions-item label="亚马逊销售文件">
            <el-link type="primary" :underline="false" v-if="taxesDate.sellFile" @click="download(taxesDate.sellFile)"> 下载 </el-link>
            <span v-else>暂无</span>
          </el-descriptions-item>
          <el-descriptions-item label="税金确认单" v-if="taxesDate.declareRule == 1">
            <el-link type="primary" :underline="false" @click="downloadShuijinForms">点击查看</el-link>
          </el-descriptions-item>
          <template v-if="!['SA', 'AE'].includes(countryCode)">
            <el-descriptions-item label="平台代扣代缴金额">{{ taxesDate.agentTaxPrice }}</el-descriptions-item>
            <el-descriptions-item label="B2B不含税销售额">{{ taxesDate.excludeTaxB2bPrice }}</el-descriptions-item>
          </template>
          <el-descriptions-item label="其他平台销售额">{{ taxesDate.otherIncludeTaxAmt }}</el-descriptions-item>
          <el-descriptions-item label="最终应缴税金" :labelStyle="{ color: 'red' }" :contentStyle="{ color: 'red' }">
            {{ taxesDate.allTaxPrice }}
          </el-descriptions-item>
          <el-descriptions-item label="其他平台销售文件" :span="2">
            <el-link type="primary" :underline="false" v-if="taxesDate.otherSaleFileUrl" @click="download(taxesDate.otherSaleFileUrl)"> 下载 </el-link>
            <span v-else>暂无</span>
          </el-descriptions-item>
        </el-descriptions>

        <el-table border :data="list" :height="tableHeight" highlight-current-row style="margin-top: 30px" v-if="this.productFunctionCode !== 23">
          <el-table-column show-overflow-tooltip align="center" label="序号">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="抵扣类型">
            <template slot-scope="scope">{{ filterType(scope.row.deductionType) }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="单据日期">
            <template slot-scope="scope">{{ scope.row.billDate }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="抵扣金额">
            <template slot-scope="scope">{{ scope.row.deductionAmt }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="凭证">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" :href="scope.row.deductionFile" target="_blank">查看</el-link>
            </template>
          </el-table-column>
        </el-table>

        <el-table border :data="declareIossDetailDTOS" :height="tableHeight" highlight-current-row style="margin-top: 30px" v-if="this.productFunctionCode === 23">
          <el-table-column align="center" type="index" width="50" label="序号"> </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="国家">
            <template slot-scope="scope">{{ scope.row.country }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="含税销售额(€)">
            <template slot-scope="scope">{{ scope.row.includeTaxSales }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="税率">
            <template slot-scope="scope">{{ scope.row.taxRate }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="应缴税金(€)">
            <template slot-scope="scope">{{ scope.row.tax }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-dialog title="回执" :visible.sync="showReceiptImgModel" width="400px">
      <div class="row-title">申报回执：</div>
      <el-row type="flex">
        <el-col :span="12" v-for="(item, index) in imglist" :key="index" style="text-align: center; margin-bottom: 5px">
          <el-link :href="item.replace('http://', 'https://')" target="_blank" type="primary" :underline="false"> <i class="el-icon-search"></i>查看回执 </el-link>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
import { taxConfirm, downloadECLInfo } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    checkInfoDialog: Boolean,
    taxesDate: Object,
    productFunctionCode: Number,
    row: Object,
    companyNameZh: String,
    countryCode: String,
  },
  data() {
    return {
      typeList: {
        1: 'C79/88',
        2: '发票抵扣',
        3: '其它',
        4: 'B2B发票',
        5: 'PVA',
        6: '平台佣金',
        7: '运费',
        8: '仓储费',
        9: '推广费',
      },
      tableHeight: 500,
      showReceiptImgModel: false,
      imglist: [],
    };
  },
  components: {
    UploadFile,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.checkInfoDialog;
      },
      set(val) {
        this.$emit('update:checkInfoDialog', val);
      },
    },
    list() {
      if (this.taxesDate.deductionItems && this.taxesDate.deductionItems.length > 0) {
        return this.taxesDate.deductionItems;
      }
    },
    europeanUnion() {
      return ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'GR', 'ES', 'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'].includes(this.countryCode);
    },

    getUnit() {
      if (this.europeanUnion || this.countryCode == 'GB') {
        if (this.countryCode == 'CZ') {
          return 'Kč';
        } else if (this.countryCode == 'PL') {
          return 'zł';
        } else if (this.countryCode == 'SE') {
          return 'kr';
        } else if (this.countryCode == 'GB') {
          return '£';
        } else {
          return '€';
        }
      }
      return '';
    },

    // 各国税金
    declareIossDetailDTOS() {
      if (this.taxesDate.declareIossDetailDTOS && this.taxesDate.declareIossDetailDTOS.length > 0) {
        return this.taxesDate.declareIossDetailDTOS;
      }
    },
  },
  created() {},
  methods: {
    // 下载税金确认文件
    downloadShuijinForms() {
      this.$util.downFile(this.baseUrl + `/workorder/management/download/confirm?workId=${this.row.id}`);
    },
    download(file) {
      this.$util.downloadFile(file);
    },
    //查看回执
    downloadDeclareReceipt(file) {
      let fileArr = file.split(',');
      if (fileArr.length > 1) {
        this.imglist = fileArr;
        this.showReceiptImgModel = true;
      } else {
        this.$util.downloadFile(file);
      }
    },
    downloadECL() {
      downloadECLInfo(this.row.id).then((res) => {
        this.$util.exportExcel(res, `${this.companyNameZh}ECL明细`);
      });
    },
    filterType(type) {
      return this.typeList[type];
    },
  },
};
</script>

<style lang="less" scoped>
.conten {
  padding: 0 30px;
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
    margin-bottom: 5px;
  }
}
.view-receipts {
  float: right;
  position: relative;
  top: 26px;
}
.row-title {
  margin: 10px 0;
}
</style>
