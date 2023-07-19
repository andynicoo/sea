<template>
  <div class="recordlist">
    <h3>
      被跟卖记录
    </h3>
    <div style="width:400px; padding:20px 10px;">
      <div class="product-info">
        <div class="txtl">
          <img
            :src="product.mainImg"
            style="width: 60px; height: 60px; border-radius: 2px"
          />
        </div>

        <div class="info-text">
          <CountryFlag :site="product.sourceSite" />
          <a class="name"> {{ product.title }}</a>

          <p class="txtl">
            <span class="me-mr-5 me-fs12 me-status-skip"
              >Asin：<span>
                <a target="blank" class="me-fs12">
                  {{ product.asin }}
                </a>
              </span></span
            >
          </p>
        </div>
      </div>
    </div>
    <div>
      <div class="no-data" v-if="tableData.length == 0">
        <img
          src="http://file.itaxs.com/pro/20210925/57f49c27e67b44ce8594af3f50b99efa.svg"
          alt=""
        />
        <p>无跟卖记录</p>
      </div>
      <div class="table-box" v-else>
        <table
          style="width: 100%;text-align: center"
          class="tbNull"
          cellpadding="0"
          cellspacing="0"
        >
          <tr class="header">
            <th style="width:150px;">
              <Select
                v-model="status"
                size="small"
                style="width:85px; margin-left:10px;"
              >
                <Option
                  v-for="item in statusList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </th>
            <th style="width:150px;">被跟卖时间</th>
            <th style="width:150px;">跟卖下架时间</th>

            <th style="width:150px;">店铺名</th>
            <th style="width:150px;">配送方式</th>
            <th style="width:150px;">店铺评价</th>
            <th style="width:200px;">跟卖价格</th>
          </tr>
          <div v-for="(item, index) in tableData" :key="index">
            <div
              class="table-div"
              v-show="
                status === 'all' ||
                  (status === 'SHELVES' && item.shelverStatus === 'SHELVES') ||
                  (status === 'UNSHELVES' && item.shelverStatus !== 'SHELVES')
              "
            >
              <tr>
                <td style="width:150px;" class="service-box">
                  <span
                    v-if="item.shelverStatus === 'SHELVES'"
                    class="me-status-link"
                    ><img
                      src="@/assets/images/setting/jilu.svg"
                      style="vertical-align: middle;"
                      alt=""
                    />跟卖中
                    </span
                  >
                  <span v-else class="me-status-skip"><Icon type="md-arrow-down" />当前未跟卖</span>
                </td>
                <td style="width:150px;">
                  <div class="me-status-skip me-fs12 txtl">
                    {{ item.createTime }}
                  </div>
                </td>

                <td style="width:150px;">
                  <p
                    class="me-status-skip me-fs12 txtl"
                    v-if="item.offShelvesTime"
                  >
                    {{ item.offShelvesTime }}
                  </p>
                  <p class="me-status-skip me-fs12 txtl" v-else>--</p>
                </td>
                <td style="width:150px;">
                  <p class="me-status-link me-fs12 txtl">
                    {{ item.sellerName }}
                  </p>
                </td>
                <td style="width:150px;">
                  <p class="me-status-skip me-fs12 txtl">
                    --
                  </p>
                </td>
                <td style="width:150px;">
                  <p
                    class="me-status-skip me-fs12 txtl"
                    v-html="item.evaluate"
                  ></p>
                </td>
                <td style="width:200px;" class="operation">
                  <p class="me-status-skip me-fs12">
                    <div>总价:{{ item.priceUnit }}{{Number(item.price)+Number(item.freightPrice)}}</div>
                    <div>售价:{{ item.priceUnit }}{{ item.price }} </div>
                    <div>运费:{{ item.priceUnit }}{{item.freightPrice}}</div>
                  </p>
                </td>
              </tr>
            </div>
          </div>
        </table>
      </div>
      <div class="pageSetion clearfix">
        <Page
          class="pagination"
          show-total
          :current="pageInfo.page"
          :total="pageInfo.total"
          @on-change="registerChangePageHandler"
          :page-size="pageInfo.limit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import '../table.less'
import CountryFlag from '../components/countryFlag'
import { pageAntiSellingMinitorGoodsLog } from '@/api/myBread'
export default {
  components: {
    CountryFlag
  },
  props: {
    product: {
      type: Object
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show: {
      handler (newVal) {
        if (newVal) {
          console.log(this.product)
          console.log(newVal)
          this.getRecordList()
        } else {
          console.log('else')
        }
      }
    }
  },
  data () {
    return {
      tableData: [],
      pageInfo: {
        page: 1,
        total: 0,
        limit: 10
      },
      statusList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'SHELVES',
          label: '跟卖中'
        },
        {
          value: 'UNSHELVES',
          label: '未跟卖'
        }
      ],
      status: 'all'
    }
  },
  mounted () {},
  methods: {
    getRecordList () {
      let data = {
        current: this.pageInfo.page,
        size: this.pageInfo.limit,
        goodsId: this.product.id
      }
      pageAntiSellingMinitorGoodsLog(data).then(res => {
        if (Number(res.code) === 0) {
          this.tableData = res.data.records
          this.pageInfo = {
            page: Number(res.data.current),
            total: Number(res.data.total),
            limit: 10
          }
        }
      })
    },
    checkCountry (item) {
      this.curCountry = item.label
      this.curCountryValue = item.value
      this.selectCountry = false
    },
    registerChangePageHandler (page) {
      this.pageInfo.page = page
      this.getRecordList()
    }
  }
}
</script>

<style lang="less" scoped>
.recordlist {
  padding-bottom: 20px;
  h3 {
    height: 18px;
    font-size: 18px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #2a2929;
    line-height: 27px;
  }
}
</style>
