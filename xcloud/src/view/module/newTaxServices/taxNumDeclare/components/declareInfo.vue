<template>
  <div class="declare-info-wrapper">
    <div class="title-wrapper">
      <div class="title">申报信息</div>
      <div>
        <slot></slot>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="info-block" :class="l.class" v-for="(l, index) in newList" :key="index">
        <div class="info-block-title" v-if="l.title">{{ l.title }}</div>
        <template v-for="(item, i) in l.content">
          <div class="info-item" :key="i" v-if="item.displayCountries.includes(countryCode)">
            <template>
              <div class="info-item-title">{{ item.label }}</div>
              <div class="info-item-value" v-if="item.value">{{ item.value }}</div>
              <el-link type="primary" :underline="false" v-if="item.fn" @click="item.fn">{{ item.hrefText }}</el-link>
              <el-link class="info-item-link" type="primary" target="_blank" v-else-if="item.href" :href="item.href">{{ item.hrefText }}</el-link>
              <div v-else-if="item.hrefText && !item.href">暂无</div>
            </template>
          </div>
        </template>
      </div>

      <el-table border :data="declareDetailDTOS" :height="tableHeight" highlight-current-row style="margin-top: 30px" v-if="!isIOSS">
        <el-table-column show-overflow-tooltip align="center" label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="抵扣类型">
          <template slot-scope="scope">{{ scope.row.deductionType | filterType }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="单据日期">
          <template slot-scope="scope">{{ scope.row.billDate }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="抵扣金额">
          <template slot-scope="scope">{{ scope.row.deductionAmt }}</template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="凭证">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" :href="scope.row.deductionFile" target="_blank">查看</el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-table border :data="declareIossDetailDTOS" :height="tableHeight" highlight-current-row style="margin-top: 30px" v-if="isIOSS">
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
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
  props: {
    serviceInfo: Object,
    taxesDate: Object,
    countryCode: String,
    declareRule: Number,
    isDongDong: Boolean,
    salesDataFile: String,
    id: String,
  },
  data() {
    return {
      tableHeight: 300,
    };
  },
  filters: {
    filterType(type) {
      let typeList = {
        1: 'C79/88',
        2: '发票抵扣',
        3: '其它',
        4: 'B2B发票',
        5: 'PVA',
        6: '平台佣金',
        7: '运费',
        8: '仓储费',
        9: '推广费',
      };
      return typeList[type];
    },
  },
  computed: {
    type() {
      switch (this.declareRule) {
        case 0:
          return 'NO_DATA';
        case 1:
          return 'HAVE_DATA';
      }
    },
    isIOSS() {
      return this.serviceInfo.regFunctionCode === 23;
    },
    declareDetailDTOS() {
      if (this.taxesDate.deductionItems && this.taxesDate.deductionItems.length > 0) {
        return this.taxesDate.deductionItems;
      }
    },
    // 各国税金
    declareIossDetailDTOS() {
      if (this.taxesDate.declareIossDetailDTOS && this.taxesDate.declareIossDetailDTOS.length > 0) {
        return this.taxesDate.declareIossDetailDTOS;
      }
    },
    newList() {
      let list = cloneDeep(this.list).filter((item) => item.type === this.type);
      list.forEach((item) => {
        item.content = item.content.filter((c) => !c.hidden);
        item.content.forEach((c) => {
          if (c.onlyDisplayCountries && c.onlyDisplayCountries.length) {
            c.displayCountries = c.onlyDisplayCountries;
          } else {
            c.displayCountries = (item.displayCountries || []).concat(c.displayCountries || []);
            if (c.displayCountries.includes('all')) {
              c.displayCountries.push(this.countryCode);
            }
            // 其他欧盟国使用通用模板
            if (this.europeanUnion && !['IT', 'NL', 'DE', 'ES', 'FR'].includes(this.countryCode) && c.base) {
              c.displayCountries.push(this.countryCode);
            }
            if (c.hiddenCountries && c.hiddenCountries.length) {
              c.displayCountries = c.displayCountries.filter((country) => !c.hiddenCountries.includes(country));
            }
          }
        });
        item.content = item.content.filter((c) => c.displayCountries.includes(this.countryCode));
      });
      list = list.filter((item) => item.content.length);
      return list;
    },
    list() {
      // 格式化金额
      const formatQianFenWei = this.$options.filters.formatQianFenWei;
      const otherData = [
        // 德国
        { label: '欧盟内免税收购项金额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.eurOtherEcAcqPrice), displayCountries: ['DE'] },
        { label: '欧盟内免税收购项文件', hrefText: '点击下载', href: this.taxesDate.otherEcAcqPriceFile, displayCountries: ['DE'] },
        { label: '欧盟内免税采购项金额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.freePurchasePrice), displayCountries: ['DE'] },
        { label: '欧盟内免税采购项文件', hrefText: '点击下载', href: this.taxesDate.freePurchaseFile, displayCountries: ['DE'] },
        { label: '线下申报数据文件', hrefText: '点击下载', href: this.taxesDate.sellOfflineFile, displayCountries: ['DE'] },
        // 西班牙
        { label: 'ECL申报', value: this.taxesDate.isEcl ? '是' : '否', displayCountries: ['ES'] },
        { label: 'ECL销售项金额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.eclSalePrice), displayCountries: ['ES'], hidden: !this.taxesDate.isEcl },
        { label: 'ECL采购项金额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.eclPurchasePrice), displayCountries: ['ES'], hidden: !this.taxesDate.isEcl },
        // 法国
        { label: '是否有法国递延', value: this.taxesDate.frenchDeferredFlag == 1 ? '是' : '否', displayCountries: ['FR'] },
        { label: '法国海关号', value: this.taxesDate.frenchDeferredDTO.customsNumber, displayCountries: ['FR'], hidden: this.taxesDate.frenchDeferredFlag !== 1 },
        { label: '进口递延开始日期', value: (this.taxesDate.frenchDeferredDTO.startDate || '').split(' ')[0], displayCountries: ['FR'], hidden: this.taxesDate.frenchDeferredFlag !== 1 },
        { label: '进口递延应税金额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.frenchDeferredDTO.taxableAmount), displayCountries: ['FR'], hidden: this.taxesDate.frenchDeferredFlag !== 1 },
        { label: '进口递延文件', hrefText: '点击下载', href: this.taxesDate.frenchDeferredDTO.deferredFilePath, displayCountries: ['FR'], hidden: this.taxesDate.frenchDeferredFlag !== 1 },
      ];
      return [
        {
          type: 'NO_DATA',
          content: [{ label: '零申报凭证', hrefText: '点击下载', href: this.taxesDate.sellFile, displayCountries: ['all'] }, ...otherData],
        },
        {
          type: 'HAVE_DATA',
          displayCountries: ['IT', 'NL', 'CZ', 'PL', 'AT', 'SE', 'CY', 'DE', 'ES', 'FR', 'GB'],
          content: [
            { label: '含税销售总额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.includeTaxPrice), onlyDisplayCountries: ['AE', 'SA', 'EU'] },
            { label: '不含税销售总额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.excludeTaxPrice), onlyDisplayCountries: ['AE', 'SA', 'EU'] },
            { label: '抵扣金额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.deductionPrice), onlyDisplayCountries: ['AE', 'SA'] },
            { label: '销项税额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.taxAmtTotal), onlyDisplayCountries: ['AE', 'SA'] },

            { label: '平台未代扣代缴不含税销售额', value: this.getUnit + ' ' + (this.countryCode == 'GB' ? formatQianFenWei(this.taxesDate.excludeTaxPrice) : formatQianFenWei(this.taxesDate.noPayExcludeTaxSales)), base: true },
            { label: '平台已代扣代缴不含税销售额', value: this.getUnit + ' ' + (this.countryCode == 'GB' ? formatQianFenWei(this.taxesDate.agentTaxPrice) : formatQianFenWei(this.taxesDate.paidExcludeTaxSales)), base: true },
            { label: '销项税金', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.taxAmtTotal), base: true },
            { label: '进项税金', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.inputTax), base: true },
            { label: '出口不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.exportExclTaxAmount), base: true },
            { label: '0税率供应不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.supplySalesExcludeTaxAmount), onlyDisplayCountries: ['GB'] },

            { label: 'PVA金额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.discountAmount), onlyDisplayCountries: ['GB'] },
            { label: '本国B2B0税率供应不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.homeCountryB2bSupplySalesExcludeTaxAmount), hiddenCountries: ['CZ', 'PL', 'AT', 'SE', 'CY', 'DE', 'GB'] },
            { label: '欧盟内跨境B2B不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.eurB2bExcludeTaxSales), hiddenCountries: ['GB'], base: true },
            { label: '最终应缴税金', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.allTaxPrice), flag: 'total', displayCountries: ['AE', 'SA', 'EU'], base: true },
            { label: '税金确认单', hrefText: '点击下载', href: this.taxesDate.taxAffirmForms, displayCountries: ['AE', 'SA', 'EU'], fn: this.taxesDate.taxAffirmForms ? '' : this.downloadTaxAffirmForms, base: true },
            { label: '缴税凭证', hrefText: '点击下载', href: this.taxesDate.taxCertificate, displayCountries: ['AE', 'SA', 'EU'], base: true },
          ],
        },
        {
          title: '亚马逊',
          class: 'white-wrapper',
          type: 'HAVE_DATA',
          displayCountries: ['IT', 'NL', 'CZ', 'PL', 'AT', 'SE', 'CY', 'DE', 'ES', 'FR'],
          content: [
            { label: '亚马逊未代扣代缴不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.awsHandExcludeTaxSales), displayCountries: ['GB'], base: true },
            { label: '亚马逊销售文件', hrefText: '点击下载', href: this.taxesDate.sellFile, displayCountries: ['GB', 'AE', 'SA'], base: true },
            { label: '亚马逊已代扣代缴不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.awsExcludeTaxSales), displayCountries: ['GB'], base: true },
            { label: '亚马逊出口不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.exportExcludeTaxSales), displayCountries: ['GB'], base: true },
            { label: '库存转运（移仓） 到达不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.fcTransferArriExcludeSale), base: true },
            { label: '库存转运（移仓） 发出不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.fcTransferSendExcludeSale), base: true },
            { label: '共享库存_购买不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.comminglingBuySale), base: true },
            { label: '共享库存_销售不含税销售额', value: this.getUnit + ' ' + formatQianFenWei(this.taxesDate.comminglingSellSale), base: true },
          ],
        },
        {
          title: '其他平台',
          class: 'white-wrapper',
          type: 'HAVE_DATA',
          displayCountries: ['IT', 'NL', 'CZ', 'PL', 'AT', 'SE', 'CY', 'DE', 'ES', 'FR', 'GB'],
          content: [
            { label: '含税销售额', value: formatQianFenWei(this.taxesDate.includeTaxPrice), onlyDisplayCountries: ['AE', 'SA', 'EU'] },
            { label: '其他平台未代扣代缴不含税销售额', value: formatQianFenWei(this.taxesDate.handExIncludeTaxSales), base: true },
            { label: '其他平台销售文件', hrefText: '点击下载', href: this.taxesDate.otherSaleFileUrl, displayCountries: ['AE', 'SA', 'EU'], base: true },
            { label: '其他平台已代扣代缴不含税销售额', value: formatQianFenWei(this.taxesDate.handExPlatformWithHoldandRemitTax), base: true },
            { label: '其他平台出口不含税销售额', value: formatQianFenWei(this.taxesDate.otherExIncludeTaxAmt), base: true },
            { label: '其他平台跨境B2B不含税销售额', value: formatQianFenWei(this.taxesDate.eurOtherB2bExcludeTaxSales), hiddenCountries: ['GB'], base: true },
            { label: '销售数据明细表', hrefText: '点击下载', href: this.salesDataFile, onlyDisplayCountries: ['EU'], hidden: !this.isDongDong },
          ],
        },
        {
          title: '其他数据',
          class: 'white-wrapper',
          type: 'HAVE_DATA',
          content: otherData,
        },
      ];
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
  },
  methods: {
    downloadTaxAffirmForms() {
      this.$util.downFile(this.baseUrl + `/workorder/management/download/confirm?workId=${this.id}`);
    },
  },
};
</script>

<style lang="less" scoped>
.declare-info-wrapper {
  padding: 20px 15px;
  background-color: #fffbe6;
  margin-bottom: 10px;
  .content-wrapper {
    height: calc(100% - 42px);
    overflow-y: auto;
  }
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .info-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 20px 30px;
    font-size: 14px;
    margin-bottom: 15px;
    &.white-wrapper {
      background-color: #fff;
    }
    .info-block-title {
      font-size: 18px;
      font-weight: bold;
      flex: 0 0 100%;
      margin-bottom: 20px;
    }
    .info-item {
      flex: 0 0 45%;
      border-bottom: 1px solid #f3f2ed;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 5px;
      line-height: 32px;
      &.total-item {
        color: #ff7c79;
      }
      .info-item-link {
        margin: 0;
      }
    }
    .empty-item {
      flex: 0 0 45%;
    }
  }
}
</style>
