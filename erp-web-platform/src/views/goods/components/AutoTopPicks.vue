<template>
  <div class="me-auto-top">
    <div class="me-auto-tips">
      1、{{ $t('goodsCollection.autoTP1') }}；<br />
      2、{{ $t('goodsCollection.autoTP2') }}。
    </div>
    <a-form
      :form="form"
      :label-col="formLayout.labelCol"
      :wrapper-col="formLayout.wrapperCol"
    >
      <a-form-item :label="$t('goodsCollection.autoSwitch')">
        <a-switch
          :checked-children="$t('common.open1')"
          :un-checked-children="$t('common.close1')"
          v-decorator="[
            'auto',
            { valuePropName: 'checked', initialValue: false }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('goodsCollection.autoCreateTopPick')">
        <a-radio-group v-decorator="['handpickType', { initialValue: 1 }]">
          <a-radio :value="1">
            {{ $t('goodsCollection.handpickType1') }}
          </a-radio>
          <a-radio :value="2">
            {{ $t('goodsCollection.handpickType2') }}
          </a-radio>
          <a-radio :value="3">
            {{ $t('goodsCollection.handpickType3') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('goodsCollection.topPicksUpdate')">
        {{ $t('goodsCollection.meige') }}
        <a-input-number
          v-decorator="[
            'spacer',
            {
              rules: [
                {
                  required: true,
                  message: $t('goodsCollection.enterTopPicksTime')
                }
              ]
            }
          ]"
          :min="1"
          :max="24"
          :precision="0"
        />
        {{ $t('goodsCollection.product8') }}
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 5 }">
        <a-checkbox
          v-decorator="[
            'assignStatus',
            { valuePropName: 'checked', initialValue: false }
          ]"
        >
          {{ $t('goodsCollection.designatedSelection') }} </a-checkbox
        ><span class="me-prime-time" @click="setStore">{{
          $t('common.setting')
        }}</span
        ><span v-if="autoCount"
          >( {{ autoCount }} {{ $t('goodsCollection.sumStoreSetting') }})</span
        ><span v-else>{{ $t('goodsCollection.unSetting') }}</span>
      </a-form-item>
    </a-form>
    <!-- 选择店铺 -->
    <a-modal
      :title="$t('onSale.chooseStore')"
      destroyOnClose
      :visible="storeListModalVisible"
      @ok="handleDispatchAction"
      @cancel="storeListModalVisible = false"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
    >
      <StoreListModal
        ref="store-list-modal"
        :rowSelectionParent="rowStoreIdParent"
      />
    </a-modal>
    <!-- 定时设置 -->
    <a-modal
      :title="$t('goodsCollection.TimingSettings')"
      width="1000px"
      :visible="timingTopVisible"
      @ok="savePeriodOperate"
      @cancel="
        timingTopVisible = false
        getTopPickInfo()
      "
      :maskClosable="false"
      :confirm-loading="confirmLoading"
    >
      <div class="me-mb-4">
        <a-input-search
          :placeholder="$t('goodsCollection.searchShop')"
          style="width: 200px"
          @search="onSearch"
          v-model="searchVal"
          class="me-fr"
          allowClear
        /><a-button @click="selectStore" class="me-mr-2">{{
          $t('goodsCollection.autoPublishSet4')
        }}</a-button
        ><a-popconfirm
          :ok-text="$t('goodsCollection.ApplyAll')"
          :cancel-text="$t('goodsCollection.ApplySelected')"
          placement="bottomLeft"
          icon=" "
          @confirm="confirm"
          @cancel="cancel"
        >
          <template slot="title">
            <div>
              {{ $t('goodsCollection.EveryDay') }}
              <a-time-picker
                v-model="sTimeBatch"
                format="HH:mm"
                :disabledHours="() => sHours(eTimeBatch)"
                :disabledMinutes="(cur) => sMinutes(cur, eTimeBatch)"
              />
              -
              <a-time-picker
                v-model="eTimeBatch"
                format="HH:mm"
                :disabledHours="() => eHours(sTimeBatch)"
                :disabledMinutes="(cur) => eMinutes(cur, sTimeBatch)"
              />
            </div>
          </template>
          <a-button class="me-mr-2">{{
            $t('goodsCollection.BatchChangeTime')
          }}</a-button></a-popconfirm
        ><a-button @click="batchDel">{{
          $t('goodsCollection.BatchDel')
        }}</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="storeId"
        :pagination="getPagination"
        @change="changePage"
        :loading="tableLoading"
        :row-selection="rowSelection"
      >
        <template slot="countryCode" slot-scope="text, record">
          {{ $store.getters.site[record.countryCode] }}
        </template>
        <template slot="time" slot-scope="text, record">
          {{ $t('goodsCollection.EveryDay') }}
          <a-time-picker
            v-model="record.startStr"
            format="HH:mm"
            :disabledHours="() => sHours(record.endStr)"
            :disabledMinutes="(cur) => sMinutes(cur, record.endStr)"
          />
          -
          <a-time-picker
            v-model="record.endStr"
            format="HH:mm"
            :disabledHours="() => eHours(record.startStr)"
            :disabledMinutes="(cur) => eMinutes(cur, record.startStr)"
          />
        </template>
        <template slot="top" slot-scope="text, record">
          <a-select style="width: 160px" v-model="record.configId">
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0;" />
              <div
                style="padding: 4px 8px; cursor: pointer;"
                @mousedown="(e) => e.preventDefault()"
                @click="addItem(record)"
              >
                <a-icon type="plus" /> {{ $t('goodsCollection.createTop') }}
              </div>
            </div>
            <a-select-option
              v-for="item in record.topPicks"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="handler" slot-scope="text, record, index">
          <a-button
            type="link"
            class="me-error"
            @click="storeDel(record, index)"
          >
            {{ $t('common.delete') }}
          </a-button>
        </template>
      </a-table>
    </a-modal>
    <!-- 创建精选 -->
    <a-modal
      :title="$t('goodsCollection.createTop')"
      width="1100px"
      :visible="createTopVisible"
      @ok="saveTopPicks"
      @cancel="createTopVisible = false"
      :maskClosable="false"
      destroyOnClose
      :confirm-loading="confirmLoading"
    >
      <CreateTopPicks ref="createTopPop" :afferentStoreId="afferentStoreId" />
    </a-modal>
  </div>
</template>

<script>
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
import tableMixins from '@/mixins/tableMixins'
import Goods from '@/api/goods'
import StoreListModal from './StoreListModal'
import CreateTopPicks from './CreateTopPicks'
import moment from 'moment'
export default {
  mixins: [tableMixins],
  components: {
    StoreListModal,
    CreateTopPicks,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      afferentStoreId: '',
      searchVal: '',
      id: '',
      autoCount: 0,
      sTimeBatch: '',
      eTimeBatch: '',
      form: this.$form.createForm(this),
      autoSwitch: false,
      autoRange: 1,
      time: 1,
      formLayout,
      timingTopVisible: false,
      storeSelectedListSource: [],
      storeListModalVisible: false,
      createTopVisible: false,
      columns: [
        {
          title: this.$t('common.site'),
          dataIndex: 'countryCode',
          key: 'countryCode',
          scopedSlots: { customRender: 'countryCode' }
        },
        {
          title: this.$t('goodsCollection.columnShopName'),
          dataIndex: 'storeName',
          key: 'storeName'
        },
        {
          title: this.$t('goodsCollection.timeInterval'),
          dataIndex: 'time',
          key: 'time',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: this.$t('goodsCollection.topPicks'),
          dataIndex: 'top',
          key: 'top',
          scopedSlots: { customRender: 'top' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          key: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      rowStoreIdParent: [],
      confirmLoading: false
    }
  },
  async created() {
    this.getTopPickInfo()
  },
  mounted() {},
  methods: {
    //获取自动精选设置
    async getTopPickInfo() {
      let { data } = await Goods.handpickAutoQuery()
      let { assignStatus, auto, handpickType, spacer, id, autoCount } = data
      let params = {
        assignStatus: assignStatus ? true : false,
        auto: auto ? true : false,
        handpickType,
        spacer
      }
      this.$data.id = id
      this.$data.autoCount = autoCount
      if (id) this.$data.form.setFieldsValue(params)
    },
    //保存定时设置
    async savePeriodOperate() {
      this.$data.confirmLoading = true
      let parama = []
      this.$data.searchVal = ''
      this.onSearch()
      for (let i = 0; i < this.$data.storeSelectedListSource.length; i++) {
        let item = this.$data.storeSelectedListSource[i]
        if (item.startStr == '' || item.endStr == '' || item.configId == '') {
          this.$message.warning(this.$t('goodsCollection.autoTips'))
          this.$data.confirmLoading = false
          return false
        } else {
          parama.push({
            configId: item.configId,
            endStr: moment(item.endStr).format('HH:mm'),
            id: item.id ? item.id : 0,
            storeId: item.storeId,
            startStr: moment(item.startStr).format('HH:mm')
          })
        }
      }

      let res = await Goods.handpickPeriodOperateBatch({ periods: parama })
      if (res.code == 0) this.$message.success(this.$t('common.handlerSuccess'))
      this.$data.timingTopVisible = false
      this.$data.confirmLoading = false
      this.getTopPickInfo()
    },
    //批量时段应用到全部
    confirm(e) {
      let { sTimeBatch, eTimeBatch } = this.$data
      this.$data.dataSource.forEach((item) => {
        item.startStr = sTimeBatch
        item.endStr = eTimeBatch
      })
    },
    //批量时段应用到选中
    cancel(e) {
      if (!this.$data.selectedRows.length > 0) {
        return this.errorAlert('请选择需要应用的店铺')
      }
      let { sTimeBatch, eTimeBatch } = this.$data
      this.$data.selectedRows.forEach((item) => {
        item.startStr = sTimeBatch
        item.endStr = eTimeBatch
      })
    },
    //批量删除
    batchDel() {
      if (!this.$data.selectedRows.length > 0) {
        return this.errorAlert('请选择需要删除的店铺')
      }
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          let ids = []
          this.$data.selectedRows.forEach((item) => {
            if (item.id) ids.push(item.id)
          })
          if (ids.length) {
            let res = await Goods.handpickPeriodDelete(ids)
            if (res.code == 0) {
              this.successAlert(this.$t('common.handlerSuccess'))
              this.$data.dataSource = this.$data.dataSource.filter(
                (item) => !this.$data.selectedRowKeys.includes(item.storeId)
              )
              this.$data.storeSelectedListSource = this.$data.dataSource
              this.reLoadData()
            } else {
              this.errorAlert(`${res.message}`)
            }
          } else {
            this.$data.dataSource = this.$data.dataSource.filter(
              (item) => !this.$data.selectedRowKeys.includes(item.storeId)
            )
            this.$data.storeSelectedListSource = this.$data.dataSource
            this.reLoadData()
            this.successAlert(this.$t('common.handlerSuccess'))
          }
        }
      })
    },
    //删除店铺
    storeDel(row, index) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          if (row.id) {
            let res = await Goods.handpickPeriodDelete([row.id])
            if (res.code == 0) {
              this.successAlert(this.$t('common.handlerSuccess'))
              this.$data.dataSource.splice(index, 1)
              this.$data.storeSelectedListSource = this.$data.dataSource
            } else {
              this.errorAlert(`${res.message}`)
            }
          } else {
            this.$data.dataSource.splice(index, 1)
            this.$data.storeSelectedListSource = this.$data.dataSource
            this.successAlert(this.$t('common.handlerSuccess'))
          }
        }
      })
    },
    //时间选择限制
    sHours(time) {
      if (time) {
        let HH = parseInt(moment(time).format('HH'))
        return this.range(HH, 24)
      } else {
        return []
      }
    },
    sMinutes(currHH, time) {
      if (time) {
        let HH = parseInt(moment(time).format('HH'))
        if (HH <= currHH) {
          return this.range(0, 60)
        }
      } else {
        return []
      }
    },
    //时间选择限制
    eHours(time) {
      if (time) {
        let HH = parseInt(moment(time).format('HH')) + 1
        return this.range(0, HH)
      } else {
        return []
      }
    },
    eMinutes(currHH, time) {
      if (time) {
        let HH = parseInt(moment(time).format('HH'))
        if (HH >= currHH) {
          return this.range(0, 60)
        }
      } else {
        return []
      }
    },
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    //搜索店铺
    onSearch(value) {
      if (value) {
        this.$data.dataSource = this.$data.storeSelectedListSource.filter(
          (item) => {
            return item.storeName.indexOf(value) > -1
          }
        )
      } else {
        this.$data.dataSource = this.$data.storeSelectedListSource
      }

      this.reLoadData()
    },
    //创建精选保存
    async saveTopPicks() {
      this.$data.confirmLoading = true
      let data = await this.$refs.createTopPop.submitTopPicks()
      this.$data.createTopVisible = data
      this.$data.confirmLoading = false
      this.$data.dataSource.forEach(async (ele) => {
        if (ele.storeId == this.$data.afferentStoreId) {
          let { data } = await Goods.handpickConfigQueryBatch([
            this.$data.afferentStoreId
          ])
          ele.topPicks = data.items[0].handPick
        }
      })
    },

    //创建精选
    addItem(row) {
      this.$data.afferentStoreId = row.storeId
      this.$data.createTopVisible = true
    },
    /**
     * 选择店铺保存
     */
    async handleDispatchAction(e, data) {
      this.$data.confirmLoading = true
      const selected = data || this.$refs['store-list-modal'].submit(true)
      if (!selected.length) return
      let newSel = selected.filter((item) => !item.disabled)
      newSel.forEach((ele) => {
        if (!data) {
          this.$set(ele, 'startStr', '')
          this.$set(ele, 'endStr', '')
          this.$set(ele, 'configId', '')
        } else {
          ele.startStr = moment(ele.startStr, 'HH:mm')
          ele.endStr = moment(ele.endStr, 'HH:mm')
        }
        this.$set(ele, 'topPicks', [])
      })
      let topPicksList = await this.getTopPickBatch(newSel)

      newSel.forEach((item) => {
        let handPick = topPicksList.items.find(
          (item2) => item.storeId == item2.storeId
        )
        if (handPick) {
          item.topPicks = handPick.handPick
          if (
            !handPick.handPick.filter((ele) => ele.id == item.configId).length
          ) {
            item.configId = ''
          }
        } else {
          // item.configId = ''
        }
      })
      this.$data.dataSource.push(...newSel)
      this.$data.storeSelectedListSource = this.$data.dataSource
      this.$data.storeListModalVisible = false
      this.$data.confirmLoading = false
      this.reLoadData()
      this.$data.tableLoading = false
    },
    //批量获取店铺下的精选
    async getTopPickBatch(newSel) {
      let ids = []
      newSel.forEach((item) => {
        ids.push(item.storeId)
      })
      let { data } = await Goods.handpickConfigQueryBatch(ids)

      return data
    },

    //设置店铺定时
    async setStore() {
      this.$data.timingTopVisible = true
      this.$data.dataSource = []
      this.$data.storeSelectedListSource = []
      this.$data.tableLoading = true
      let { data } = await Goods.handpickPeriodPage({
        size: '9999',
        current: 1
      })
      if (data.records.length) {
        this.handleDispatchAction('', data.records)
      } else {
        this.$data.tableLoading = false
      }
    },
    //选择店铺
    selectStore() {
      this.$data.rowStoreIdParent = []
      this.$data.dataSource.forEach((item) => {
        this.$data.rowStoreIdParent.push(item.storeId)
      })
      this.$data.storeListModalVisible = true
    },
    //获取列表
    getTableData() {
      return {
        data: {
          ...this.$data.paginationData,
          records: this.$data.dataSource
        }
      }
    },
    //保存自动精选设置
    submitAutoTopPicks() {
      // let flag = true
      return new Promise((resolve, reject) => {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            // flag = false
            let { assignStatus, auto, handpickType, spacer } = values
            let params = {
              assignStatus: assignStatus ? 1 : 0,
              auto: auto ? 1 : 0,
              handpickType,
              spacer
            }
            let res
            if (this.$data.id) {
              params.id = this.$data.id
              res = await Goods.handpickAutoEdit(params)
            } else {
              res = await Goods.handpickAutoConfig(params)
            }
            console.log(999)
            resolve(false)
            if (res.code == 0)
              this.$message.success(this.$t('common.handlerSuccess'))
          }
        })
        // return flag
      })
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.me-auto-tips {
  font-size: 12px;
  font-weight: 400;
  color: #c5775c;
  line-height: 20px;
  border-radius: 4px;
  background: #fff8f4;
  padding: 15px 12px;
}
.me-prime-time {
  padding: 0 10px;
  line-height: 20px;
  background: #ffeee2;
  border-radius: 2px;
  border: 1px solid #ffaf76;
  font-weight: 400;
  color: #ff720d;
  font-size: 12px;
  display: inline-block;
  margin-right: 8px;
  cursor: pointer;
}
</style>
