<template>
  <div class="me-pa-2 xxx">
    <div class="me-pb-2">
      <a-breadcrumb class="me-ib">
        <a-breadcrumb-item>加购优惠</a-breadcrumb-item>
        <a-breadcrumb-item v-if="editType === 'eidt'">编辑</a-breadcrumb-item>
        <a-breadcrumb-item v-else-if="editType === 'view'"
          >查看</a-breadcrumb-item
        >
        <a-breadcrumb-item v-else>创建</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <a-form-model
      :model="form"
      :rules="rules"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!-- {{ form }} -->
      <div class="me-card">
        <h2>
          基本信息
        </h2>
        <a-form-model-item label="选择店铺" prop="storeId">
          <a-select
            v-model="form.storeId"
            class="me-w560"
            placeholder="请选择"
            :disabled="editType === 'edit' || editType === 'view'"
          >
            <a-select-option
              v-for="item in storeList"
              :key="item.storeId"
              :value="item.storeId"
            >
              {{ item.storeAlias || item.storeName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="优惠名称" prop="addOnDealName">
          <a-input
            v-model="form.addOnDealName"
            :disabled="
              (editType === 'edit' && editStatus !== 'upcoming') ||
                editType === 'view'
            "
            :suffix="form.addOnDealName.length + '/ 20'"
          />
        </a-form-model-item>
        <div class="porptips">
          <a-form-model-item label="优惠周期" prop="setTime">
            <a-range-picker
              :show-time="{ format: 'HH:mm:ss' }"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              v-model="form.setTime"
              style="min-width: 425px"
              :disabled-date="disabledDate"
              :disabled-time="disabledRangeTime"
              :disabled="
                (editType === 'edit' && editStatus !== 'upcoming') ||
                  editType === 'view'
              "
            />
          </a-form-model-item>
          <div class="tips">
            结束时间必须比开始时间晚1小时；一旦促销储存成功，活动时间缩短不能延长
          </div>
        </div>
      </div>
      <div class="me-card">
        <h2>
          优惠设置
        </h2>
        <a-form-model-item label="优惠类型">
          <a-radio-group
            name="radioGroup"
            v-model="form.promotionType"
            :disabled="editType === 'edit' || editType === 'view'"
            @change="changeType"
          >
            <a-radio :value="0">
              加购折扣
            </a-radio>
            <a-radio :value="1">
              赠品满最低消费
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="购买限制" v-if="form.promotionType === 0">
          <a-input-number
            v-model="form.promotionPurchaseLimit"
            :min="0"
            :max="10000"
            :disabled="
              (editType === 'edit' && editStatus !== 'upcoming') ||
                editType === 'view'
            "
          />
        </a-form-model-item>
        <a-form-model-item label="赠品规则" v-if="form.promotionType === 1">
          消费
          <a-input
            class="wt100"
            v-model="form.purchaseMinSpend"
            :prefix="currency"
            v-enterIntNumber
          />
          以获取<a-input
            class="wt100"
            v-model="form.perGiftNum"
            v-enterIntNumber
          />赠品
        </a-form-model-item>
      </div>

      <div class="me-card">
        <div>
          <h2>
            主商品添加
          </h2>
          <a-button
            icon="plus"
            class="addbutton me-mt-2 me-ml-2 me-mb-2"
            @click="addProduct"
            :disabled="editStatus === 'expired'"
          >
            添加商品
          </a-button>
          <div
            class="me-status-error me-mt-2 me-ml-2"
            v-if="dataSource.length === 0"
          >
            买家可以在一个加购优惠中最多购买100个主要商品
          </div>

          <DiscountTable
            :loading="tableLoading"
            :data-source="dataSource"
            tableType="addtionaddpro1"
            tabstatus="addtionaddpro1"
            v-if="dataSource.length"
            :pagination="getPagination"
            @change="changePage"
            @changeStatus="changeStatus"
            rowKey="itemId"
          >
            <template slot="actions" slot-scope="source">
              <a-icon
                type="delete"
                :disabled="editStatus === 'expired'"
                @click="handleDeleteGoods(source.source.index, 1)"
              />
            </template>
          </DiscountTable>
        </div>
      </div>

      <div class="me-card">
        <div>
          <h2 v-if="form.promotionType === 0">
            加购商品添加
          </h2>
          <h2 v-else>
            赠品
          </h2>
          <div
            class="me-status-error me-mt-2 me-ml-2"
            v-if="form.promotionType === 1"
          >
            买家只能在一个订单中领取一次赠品
          </div>
          <a-button
            icon="plus"
            class="addbutton me-mt-2 me-ml-2 me-mb-2"
            @click="addProduct2"
            :disabled="editStatus === 'expired'"
          >
            添加商品
          </a-button>
          <div
            class="me-status-error me-mt-2 me-ml-2"
            v-if="form.promotionType === 0 && dataSource2.length === 0"
          >
            买家购买任何主商品时都可以享受折扣价的加购商品
          </div>
          <div class="piliang" v-if="form.promotionType === 0">
            <div>
              <div class="me-fl">
                <h3>
                  批量设置
                </h3>
                <div>已选择{{ selectedRowKeys.length }}个商品</div>
              </div>
              <a-space class="me-fr">
                <div>
                  <div>加购折扣</div>
                  <a-input-number
                    :min="1"
                    :max="100"
                    size="small"
                    :precision="2"
                    v-model="discountNum"
                    :disabled="editStatus === 'expired'"
                  />%折扣
                </div>
                <div>
                  <div>购买限制</div>
                  <a-input-number
                    :min="0"
                    :precision="0"
                    :max="1000"
                    size="small"
                    v-model="buyNum"
                    :disabled="editStatus === 'expired'"
                  />
                </div>
                <div class="me-mr-4">
                  <div>&nbsp;</div>
                  <a-button
                    class="addbutton me-mt-2 me-ml-2 me-mb-2"
                    size="small"
                    type="primary"
                    @click="applyToPro"
                    :disabled="editStatus === 'expired'"
                  >
                    应用到已选
                  </a-button>
                </div>
                <div>
                  <div>&nbsp;</div>
                  <a-button
                    class="addbutton me-mt-2 me-ml-2 me-mb-2"
                    size="small"
                    type="primary"
                    @click="openStatus()"
                    :disabled="editStatus === 'expired'"
                  >
                    开启已选
                  </a-button>
                </div>
                <div>
                  <div>&nbsp;</div>
                  <a-button
                    class="addbutton me-mt-2 me-ml-2 me-mb-2"
                    size="small"
                    type="primary"
                    @click="deleteSelected"
                    :disabled="editStatus === 'expired'"
                  >
                    删除已选
                  </a-button>
                </div>
              </a-space>
            </div>
          </div>
          <div>
            <DiscountTable
              :loading="tableLoading"
              :data-source="dataSource2"
              tableType="addtionaddpro2"
              tabstatus="addtionaddpro2"
              v-if="dataSource2.length && form.promotionType == 0"
              :pagination="getPagination2"
              :rowSelection="rowSelection"
              @change="changePage2"
              @changeStatus="changeStatus"
              @changeDiscount="changeDiscount"
              @changePrice="changePrice"
              rowKey="itemId"
            >
              <template slot="actions" slot-scope="source">
                <div :class="{ 'me-show': source.source.record._viewflag_ }">
                  <a-icon
                    type="delete"
                    @click="handleDeleteGoods(source.source.index, 2)"
                  />
                  <div>
                    <a-button
                      type="link"
                      @click="viewAll(source.source.index)"
                      v-if="
                        source.source.record.variants &&
                          source.source.record.variants.length &&
                          source.source.record.variants.length > 2
                      "
                    >
                      {{
                        source.source.record._viewflag_
                          ? $t('toBeEdit.shouqi')
                          : $t('toBeEdit.viewall')
                      }}
                      (变体数:{{ source.source.record.variants.length }})
                    </a-button>
                  </div>
                </div>
              </template>
            </DiscountTable>
            <!-- 加购商品表格，在优惠类型为'赠品满最低消费'时，只显示控制状态 -->
            <DiscountTable2
              :loading="tableLoading"
              :data-source="dataSource2"
              tableType="addtionaddpro2"
              tabstatus="addtionaddpro2"
              v-if="dataSource2.length && form.promotionType == 1"
              :pagination="getPagination2"
              :rowSelection="rowSelection"
              @change="changePage2"
              @changeStatus="changeStatus"
              rowKey="itemId"
            >
              <template slot="actions" slot-scope="source">
                <a-icon
                  type="delete"
                  @click="handleDeleteGoods(source.source.index, 2)"
                />
              </template>
            </DiscountTable2>
          </div>
        </div>
      </div>
    </a-form-model>

    <div class="me-card">
      <a-space>
        <a-button
          class="me-ml-2 btnwid90"
          size="large"
          @click="$router.go(-1)"
          v-if="editType !== 'view'"
        >
          取消
        </a-button>
        <a-button
          type="primary"
          class="me-ml-2 btnwid90"
          size="large"
          @click="submit"
          :loading="submitIng"
          v-if="editType === 'edit' || editType === undefined"
        >
          确认
        </a-button>
        <a-button
          type="primary"
          class="me-ml-2 btnwid90"
          size="large"
          @click="$router.go(-1)"
          v-if="editType === 'view'"
        >
          确认
        </a-button>
      </a-space>
    </div>

    <a-modal
      title="选择商品"
      :visible="editVisible"
      :confirm-loading="sdConfirmLoading"
      @ok="syncOk"
      @cancel="editVisible = false"
      width="800px"
      destroyOnClose
      :maskClosable="false"
    >
      <ProductList
        ref="productlist"
        :storeId="form.storeId"
        tableType="couponaddpro"
        @getCheckPro="getCheckPro"
        :checkedProduct="addToWhere === 1 ? dataSource : dataSource2"
      />
      <!-- 主商品添加或加购商品添加，1主2加购 -->
    </a-modal>
  </div>
</template>

<script>
import Store from '@/api/store'
import Discount from '@/api/discount'
import { disabledDate, disabledRangeTime } from '@/util/timeOperation'
import ProductList from './components/ProductList'
import tableMixins from '@/mixins/tableMixins'
import DiscountTable from './components/DiscountTable'
import DiscountTable2 from './components/DiscountTable2'
import Goods from '@/api/goods'
import { mcl, division } from '@/util'

export default {
  mixins: [tableMixins],
  components: {
    ProductList,
    DiscountTable,
    DiscountTable2
  },
  data() {
    return {
      disabledDate,
      disabledRangeTime,
      rules: {
        storeId: [
          {
            required: true,
            message: '请选择店铺',
            trigger: 'blur'
          }
        ],
        addOnDealName: [
          {
            required: true,
            message: '请输入优惠名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '不超过20个字符',
            trigger: 'blur'
          }
        ],
        voucherCode: [
          {
            required: true,
            message: '请输入优惠码',
            trigger: 'blur'
          }
        ],
        setTime: [
          {
            required: true,
            message: '请输入领取期限',
            trigger: 'blur'
          }
        ],
        subItemLimit: [
          {
            required: true,
            message: '请输入发放数量',
            trigger: 'blur'
          },
          { validator: this.checkUsageQuantity }
        ]
        // maxPrice: [
        //   {
        //     required: true,
        //     message: '请输入最大限额',
        //     trigger: 'blur'
        //   }
        // ],
      },
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      djj: true,
      submitIng: false,
      form: {
        addOnDealName: '',
        promotionType: 0,
        setTime: null,
        mainItemList: [], // 主产品集合
        subItemList: [], // 加购商品集合
        storeId: null,
        promotionPurchaseLimit: 1,
        purchaseMinSpend: 1,
        perGiftNum: 1
      },

      storeList: [], //店铺列表
      currency: '', // 选择店铺时，获取对应的币种
      editVisible: false, // 添加商品相关控制
      sdConfirmLoading: false,
      dataSource2: [], // 加购商品
      addToWhere: 1, // 主商品添加或加购商品添加，1主2加购
      paginationData2: {
        size: '10',
        current: 1,
        total: 0
      },
      discountNum: 90,
      buyNum: 1
    }
  },
  computed: {
    // 通过url传递的编辑类型，id, 当前活动状态
    editType() {
      return this.$route.query.edit
    },
    discountId() {
      return this.$route.query.id
    },
    editStatus() {
      return this.$route.query.status
    },
    /**
     * 分页数据
     */
    getPagination2() {
      const { size, current, total } = this.$data.paginationData2
      return {
        pageSize: Number(size),
        current,
        total,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        defaultPageSize: 10,
        showTotal: (total) => this.$t(`common.pageTotalText`, { total })
      }
    }
  },
  watch: {
    'form.storeId': {
      handler(val) {
        this.getCurrency(val)
      },
      deep: true
    }
  },
  created() {
    this.getStoreAllStore()
  },
  async mounted() {
    // 编辑时获取活动详情
    if (this.discountId) {
      await this.getDiscountDetail()
    }
  },
  methods: {
    //获取所有可用店铺
    getStoreAllStore() {
      Store.getAllStore({ platform: 1 }).then(({ data }) => {
        this.storeList = data
      })
    },
    async submit() {
      let proLength = this.$data.dataSource.length
      let addLength = this.$data.dataSource2.length
      if (!proLength || !addLength) {
        this.$message.error('请添加主商品和加购商品')
        return false
      }
      let { dataSource, dataSource2 } = this.$data
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const { setTime } = this.$data.form
          let params = this.$data.form

          if (setTime && setTime.length) {
            params.startTime = setTime[0]
            params.endTime = setTime[1]
          }

          params.shopId = Number(this.getPlatformId())

          // 添加主产品 加购商品
          params.mainItemList = dataSource
          // dataSource.map((ele) => {
          //   params.mainItemList.push({
          //     itemId: ele.itemId,
          //     status: ele.status
          //   })
          // })

          params.subItemList = dataSource2
          // params.subItemList.subItemList = []
          params.subItemList.map((ele) => {
            if (ele.variants && ele.variants.length) {
              // ele.subItemList = ele.variants
              ele.subItemList = []
              this.$set(ele, 'subItemList', [])
              ele.variants.map((element) => {
                console.log(element.stock, element.stock && element.stock > 0)
                if (element.stock && element.stock > 0) {
                  console.log(element)
                  ele.subItemList.push(element)
                }
              })
            }
          })
          // console.log(params)
          this.submitIng = true
          let { code } = await Discount.editAddOnDeal(params).catch(() => {
            this.submitIng = false
          })
          this.submitIng = false
          console.log(code)
          if (code === 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.openPage(`/discount/additional`)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    checkUsageQuantity(rule, value, callback) {
      if (value < 1 || value > 10000) {
        callback('1 ~ 200000之间')
      }
      callback()
    },

    getPlatformId() {
      let shopId = null
      this.$data.storeList.map((ele) => {
        if (ele.storeId === this.form.storeId) {
          shopId = ele.platformId
        }
      })
      return shopId
    },
    // 根据url id，获取活动信息
    async getDiscountDetail() {
      Discount.getAddOnDeallDetail({ id: this.discountId }).then(
        async (res) => {
          this.$data.form = res.data

          this.$set(this.$data.form, 'setTime', [
            res.data.startTime,
            res.data.endTime
          ])
          // this.$data.form.setTime = [res.data.startTime, res.data.endTime]
          this.$data.dataSource = []
          this.$data.dataSource2 = []

          this.$data.dataSource = res.data.mainItemList
          res.data.subItemList.map((ele) => {
            ele.variants = ele.subItemList
          })
          this.$data.dataSource2 = res.data.subItemList
          this.$data.dataSource2.map((ele) => {
            this.$set(ele, 'variants', ele.subItemList)
            this.$set(ele, '_viewflag_', false)
            ele.variants.map((element) => {
              console.log(element.subItemInputPrice, element.price)
              this.$set(
                element,
                'itemDiscount',
                mcl(
                  division(element.subItemInputPrice, element.price),
                  100
                ).toFixed(2)
              )
            })
          })
        }
      )
    },
    // 根据storeId，获取对应币种显示
    getCurrency(val) {
      this.storeList.map((ele) => {
        if (ele.storeId === this.form.storeId) {
          this.currency = ele.currency
        }
      })
    },

    onChange(e) {
      console.log(e)
    },
    changeType(e) {},
    async loadData(flag) {},
    getTableData() {
      var data = { records: [] }
      return data
    },
    // 添加商品
    addProduct() {
      const { storeId } = this.$data.form
      if (storeId == null) {
        this.$message.error('请先选择店铺！')
        return
      }
      this.$data.addToWhere = 1
      this.$data.editVisible = true
    },
    getCheckPro(data) {
      console.log(data)
      if (data.length != 0) {
        this.$data.editVisible = false
      }
      // 主商品添加或加购商品添加，1主2加购
      let { addToWhere } = this.$data
      addToWhere === 1
        ? (this.$data.dataSource = this.$data.dataSource.concat(data))
        : (this.$data.dataSource2 = this.$data.dataSource2.concat(data))
      if (addToWhere === 1) {
        this.$data.dataSource.map((ele) => {
          this.$set(ele, 'status', 1)
        })
      } else {
        this.$data.dataSource2.map((ele) => {
          if (ele.variants && ele.variants.length) {
            this.$set(ele, '_viewflag_', false)
            ele.variants.map((element) => {
              element.stock > 0
                ? this.$set(element, 'status', 1)
                : this.$set(element, 'status', 2)
              this.$set(element, 'subItemLimit', 1)
              this.$set(element, 'itemDiscount', 90)
              this.$set(element, 'subItemInputPrice', mcl(element.price, 0.9))
            })
          }
        })
      }
    },
    viewAll(index) {
      this.$data.dataSource2[index]._viewflag_ = !this.$data.dataSource2[index]
        ._viewflag_
    },
    changeStatus(data) {
      let { index, status, table, its } = data
      if (table === 'addtionaddpro1') {
        console.log(index, status, table)
        status
          ? (this.dataSource[index].status = 1)
          : (this.dataSource[index].status = 2)
      }
      if (table === 'addtionaddpro2') {
        console.log(index, status, table)
        status
          ? (this.dataSource2[index].variants[its].status = 1)
          : (this.dataSource2[index].variants[its].status = 2)
      }
    },
    // 加购商品添加
    addProduct2() {
      const { storeId } = this.$data.form
      if (storeId == null) {
        this.$message.error('请先选择店铺！')
        return
      }
      this.$data.addToWhere = 2
      this.$data.editVisible = true
    },

    syncOk() {
      this.$refs.productlist.getCheckPro()
    },
    handleDeleteGoods(index, dataIndex) {
      if (this.editStatus === 'expired') return
      let that = this
      this.$confirm({
        title: this.$t('common.warn'),
        content: '确定删除当前产品吗？',
        onOk: async () => {
          dataIndex === 1
            ? that.$data.dataSource.splice(index, 1)
            : that.$data.dataSource2.splice(index, 1)
        }
      })
    },

    openStatus() {
      const { dataSource2, selectedRows, selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.errorAlert(this.$t('discount.inputChoseGoods'))
        return
      }
      dataSource2.forEach((item) => {
        if (selectedRowKeys.includes(item.itemId)) {
          // this.$set(item, 'status', 1)
          if (item.variants && item.variants.length) {
            item.variants.map((ele) => {
              this.$set(ele, 'status', 1)
            })
          }
        }
      })
    },

    deleteSelected() {
      const { dataSource2, selectedRows, selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.errorAlert(this.$t('discount.inputChoseGoods'))
        return
      }
      let temp = []
      dataSource2.forEach((item) => {
        if (!selectedRowKeys.includes(item.itemId)) {
          temp.push(item)
        }
      })

      this.dataSource2 = temp
      this.selectedRows = []
      this.selectedRowKeys = []
    },
    // 应用到已选 折扣，购买限制
    applyToPro() {
      // subItemLimit
      const {
        dataSource2,
        selectedRows,
        selectedRowKeys,
        discountNum,
        buyNum
      } = this.$data
      if (!selectedRowKeys.length) {
        this.errorAlert(this.$t('discount.inputChoseGoods'))
        return
      }
      let tempDiscountNum = division(discountNum, 100)
      dataSource2.forEach((item) => {
        if (selectedRowKeys.includes(item.itemId)) {
          if (item.variants && item.variants.length) {
            item.variants.map((ele) => {
              this.$set(ele, 'subItemLimit', buyNum)
              this.$set(ele, 'itemDiscount', discountNum)
              this.$set(
                ele,
                'subItemInputPrice',
                mcl(tempDiscountNum, ele.price).toFixed(2)
              )
            })
          }
        }
      })
    },
    changeDiscount(data) {
      let { vals, index, its } = data
      console.log(vals, index, its)
      let ele = this.$data.dataSource2[index].variants[its]
      this.$set(
        ele,
        'subItemInputPrice',
        mcl(division(vals, 100), ele.price).toFixed(2)
      )
    },
    changePrice(data) {
      let { vals, index, its } = data
      console.log(vals, index, its)
      let ele = this.$data.dataSource2[index].variants[its]
      // let temp = division(vals, ele.price)
      // division(vals, 100)
      this.$set(
        ele,
        'itemDiscount',
        mcl(division(vals, ele.price), 100).toFixed(2)
      )
    },

    /**
     * 分页改变
     */
    changePage2({ pageSize, current }) {
      this.$data.paginationData2 = {
        ...this.$data.paginationData2,
        size: pageSize,
        current
      }
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './components/table.scss';
.me-card {
  h2 {
    font-size: 16px;
    margin: 10px 0px 0px 10px;
  }
}
.btnwid90 {
  width: 90px;
}
.radioStyle {
  display: block;
  height: 30px;
  line-height: 30px;
}
.wt100 {
  width: 100px;
}
.piliang {
  background: #fafafa;
  padding: 10px;
  height: 85px;
}
.me-show {
  height: auto;
}
.porptips {
  position: relative;
  .tips {
    position: absolute;
    left: 583px;
    top: 10px;
  }
}
</style>
<style lang="scss">
.xxx {
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 50px !important;
  }
}
</style>
