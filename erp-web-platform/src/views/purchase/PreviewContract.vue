<template>
  <div class="me-pa-2">
    <div class="me-card">
      <div class="me-preview-contract">
        <table class="me-preview-table">
          <tr>
            <td class="me-brn me-bar-code me-w28b">
              <img v-lazy="barCode" />
              <p>p0000000000001</p>
            </td>
            <td class="me-tc me-contract-name me-blrn">
              {{ purchaseContractName }}
            </td>
            <td class="me-bln me-w28b">
              <p>{{ $t('purchase.orderNumber') }}：p0000000000001</p>
              <p>{{ $t('purchase.orderDiy') }}：</p>
              <p>{{ $t('purchase.printTime') }} ：admin 2018-4-28</p>
              <p>{{ $t('common.createTime') }} ：admin 2018-4-24</p>
              <p>{{ $t('purchase.buyer') }} ：admin</p>
            </td>
          </tr>
          <tr v-if="show('cangku')">
            <td colspan="3">
              {{ $t('purchase.purchasingWarehouse') }}：{{
                $t('purchase.shenzhen')
              }}
            </td>
          </tr>
          <tr>
            <td colspan="3" class="me-buyer">
              <span class="me-w50b" v-if="show('caigou')">
                <p>
                  <span>{{ $t('purchase.purchaser') }}：</span
                  ><b>{{ purchaseName }}</b>
                </p>
                <p>
                  <span>{{ $t('common.address') }}：</span
                  ><b>{{ purchaseAddress }}</b>
                </p>
                <p>
                  <span>{{ $t('purchase.consignee') }}：</span
                  ><b>{{ purchaseConsignee }}</b>
                </p>
                <p>
                  <span>{{ $t('purchase.contacts') }}：</span><b>{{ purchaseContacts }}</b>
                </p>
                <p>
                  <span>{{ $t('common.phone') }}：</span><b>{{ purchasePhone }}</b>
                </p>
                <p>
                  <span>{{ $t('purchase.fax') }}：</span><b>{{ purchaseFax }}</b>
                </p>
              </span>
              <span class="me-w50b">
                <p>
                  <span>{{ $t('purchase.supplier') }}：</span
                  ><b>{{ $t('purchase.shanghaiCompany') }} </b>
                </p>
                <p>
                  <span>{{ $t('common.address') }}：</span
                  ><b>{{ $t('purchase.shanghaiAddress') }}</b>
                </p>
                <p>
                  <span>{{ $t('purchase.contacts') }}：</span><b></b>
                </p>
                <p>
                  <span>{{ $t('common.mobile') }}：</span><b></b>
                </p>
                <p>
                  <span>{{ $t('common.phone') }}：</span><b></b>
                </p>
              </span>
            </td>
          </tr>
          <tr>
            <td
              class="me-bbn"
              colspan="3"
              v-if="show('dingdan') || show('jiaohuo')"
            >
              <span class="me-w70b" v-if="show('dingdan')"
                >{{ $t('purchase.orderNotes') }}：
                {{ $t('common.remarks') }}</span
              ><span v-if="show('jiaohuo')"
                >{{ $t('purchase.deliveryDate') }} ：2019-08-01</span
              >
            </td>
          </tr>
          <tr>
            <td colspan="3" class="me-bn">
              <table class="me-product-list">
                <tr class="me-tc">
                  <td>{{ $t('common.index') }}</td>
                  <td v-if="show('suolvtu')">{{ $t('purchase.thumbnail') }}</td>
                  <td>sku</td>
                  <td>{{ $t('purchase.productInfor') }}</td>
                  <td v-if="show('danjia')">
                    {{ $t('purchase.unitPrice') }} (RMB)
                  </td>
                  <td>{{ $t('purchase.producNum') }}</td>
                  <td v-if="show('jiner')">
                    {{ $t('purchase.amount') }} (RMB)
                  </td>
                  <td v-if="show('xianshi')">{{ $t('common.remarks') }}</td>
                </tr>
                <tr class="me-tc">
                  <td>1</td>
                  <td v-if="show('suolvtu')">
                    <img
                      width="60"
                      src="./../../assets/images/default-img.png"
                    />
                  </td>
                  <td>KS0152d100</td>
                  <td class="me-tl">
                    <p v-if="show('zhongwen')">
                      玫红色 2014年夏季新品儿童连衣裙 高品质新款花朵纱裙童装
                    </p>
                    <p v-if="show('yingwen')">
                      Cartoon Animal Baby Rattles Baby Toy Wrist Strap Children
                      Infant Newborn Soft Handbells Plush
                    </p>
                    <p>{{ $t('purchase.platformUnit') }}：piece</p>
                  </td>
                  <td v-if="show('danjia')">20.00</td>
                  <td>2</td>
                  <td v-if="show('jiner')">40</td>
                  <td v-if="show('xianshi')">--</td>
                </tr>
                <tr class="me-tc">
                  <td>2</td>
                  <td v-if="show('suolvtu')">
                    <img
                      width="60"
                      src="./../../assets/images/default-img.png"
                    />
                  </td>
                  <td>KS0152d100</td>
                  <td class="me-tl">
                    <p v-if="show('zhongwen')">
                      玫红色 2014年夏季新品儿童连衣裙 高品质新款花朵纱裙童装
                    </p>
                    <p v-if="show('yingwen')">
                      Cartoon Animal Baby Rattles Baby Toy Wrist Strap Children
                      Infant Newborn Soft Handbells Plush
                    </p>
                    <p>{{ $t('purchase.platformUnit') }}：piece</p>
                  </td>
                  <td v-if="show('danjia')">20.00</td>
                  <td>2</td>
                  <td v-if="show('jiner')">40</td>
                  <td v-if="show('xianshi')">--</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="me-btn me-ptb0" colspan="3">
              <span class="me-w70b me-lh50 me-br1" v-html="skuTxt"></span>
              <span v-if="show('heji')" class="me-total"
                >{{ $t('purchase.totalWeight') }}：44.51kg</span
              >
            </td>
          </tr>
          <tr>
            <td colspan="3" class="me-ptb0">
              <p class="me-w70b me-lh50 me-br1">
                <span>{{ $t('purchase.freight') }}：7.00</span
                ><span v-if="show('shuijin')"
                  >{{ $t('purchase.taxes') }}：10.00</span
                ><span v-if="show('zhekou')"
                  >{{ $t('purchase.discountAmount') }}：160.00</span
                >
              </p>
              <span class="me-total"
                >{{ $t('purchase.totalAmount') }}（{{
                  $t('purchase.lowercase')
                }}）：120.000 RMB</span
              >
            </td>
          </tr>
          <tr>
            <td colspan="3" class="me-ptb0">
              <p class="me-w70b me-lh25 me-br1">
                {{ $t('purchase.supplierName') }}：{{
                  $t('purchase.accountName')
                }}
                <br />{{ $t('purchase.supplierAccount') }}：1234 5678 9101 6541
              </p>
              <span class="me-total"
                >{{ $t('purchase.totalAmount') }}（{{
                  $t('purchase.capitalization')
                }}）：壹佰贰拾元整</span
              >
            </td>
          </tr>
          <tr>
            <td colspan="3">{{ $t('purchase.pleaseConfirm') }}</td>
          </tr>
          <tr v-if="show('hetong')">
            <td colspan="3" class="me-h80">
              <b>{{ $t('purchase.needingAttention') }}：</b>{{ remark }}
            </td>
          </tr>
          <tr class="me-h150" v-if="show('gaizhang')">
            <td colspan="3">
              <span class="me-w50b"
                >{{ $t('purchase.purchaserRep')
                }}{{ $t('purchase.signatureSeal') }}：</span
              >
              <span class="me-w50b"
                >{{ $t('purchase.supplierRep')
                }}{{ $t('purchase.signatureSeal') }}：</span
              >
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 合同预览
 */

export default {
  data() {
    return {
      skuTxt:`sku${this.$t('purchase.type')}：3　　sku${this.$t('purchase.total')}：6　　${this.$t('purchase.payMethod')}：${this.$t('purchase.cash')}`,
      contractConfig: '',
      purchaseContractName: '',
      purchaseName: '',
      purchaseAddress: '',
      purchaseConsignee: '',
      purchaseContacts: '',
      purchasePhone: '',
      purchaseFax: '',
      remark: '',
      barCode: require('./../../assets/images/bar-code.png')
    }
  },
  created() {
    Object.assign(this.$data, this.$route.query)
  },
  methods: {
    show(value) {
      return this.$data.contractConfig.includes(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-preview-contract {
  min-height: 20px;
  margin: 10px;
  width: 900px;
}
.me-preview-table {
  width: 100%;
  .me-bn {
    padding: 0;
    border: none;
    border-right: 1px solid #666;
  }
  td {
    padding: 5px 8px;
    height: 50px;
    min-width: 45px;
    border: 1px solid #666;
  }
  .me-ptb0 {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.me-blrn {
  border-left: none !important;
  border-right: none !important;
}
.me-bbn {
  border-bottom: none !important;
}
.me-btn {
  border-top: none !important;
}
.me-bln {
  border-left: none !important;
}
.me-brn {
  border-right: none !important;
}
.me-contract-name {
  font-size: 45px;
  font-weight: bold;
}
.me-buyer {
  vertical-align: top;
  p {
    line-height: 24px;
    overflow: hidden;
    span {
      float: left;
      min-width: 120px;
      text-align: right;
    }
    b {
      font-weight: normal;
      display: block;
      line-height: 16px;
      padding: 5px 0;
    }
  }
}
.me-bar-code {
  text-align: center;
  vertical-align: top;
}
.me-h80 {
  height: 80px;
  vertical-align: top;
}
.me-h150 {
  height: 150px;
  vertical-align: top;
}
.me-w28b {
  width: 28%;
}
.me-w50b {
  display: inline-block;
  width: 50%;
  vertical-align: top;
}
.me-w70b {
  float: left;
  width: 62%;
}
.me-product-list {
  width: 100%;
  td {
    border-right: none;
  }
}
.me-total {
  border-left: 1px solid;
  display: inline-block;
  min-height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
.me-lh25 {
  line-height: 25px;
}
.me-lh50 {
  line-height: 50px;
  span {
    padding-right: 29px;
  }
}
.me-br1{border-right: 1px solid;margin-right:-1px}
</style>
