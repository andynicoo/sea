<template>
  <BaseTable
    :columns="getColumns"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="tableLoading"
    :rowSelection="rowSelection"
    :onCancel="onCancel"
    :onSave="onSave"
    :onChange="onChange"
    :saveBtnText="$t('batchEditOption.save')"
    :btnStyle="btnStyle"
    :initfunc="false"
    :saveMsg="$t('common.batchEditSuccess')"
  >
    <template v-slot:before="{ record }">
      <p class="me-desc">{{ record.name }}</p>
    </template>
    <template v-slot:after="{ record }">
      <p class="me-desc">
        <a-input
          v-if="record._itemSku_ != undefined"
          @change="onDescChange(record)"
          :rows="3"
          v-model="record._itemSku_"
        />
      </p>
    </template>

    <template>
      <!-- {{ selectedRowKeys }} -->
      <a-form-model :form="form" ref="ruleForm">
        <a-row>
          <a-col :span="14">
            <a-form-model-item
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
              :label="$t('toBeEdit.fabufs')"
            >
              <a-radio-group v-model="form.value" @change="onChange">
                <a-radio :value="1">
                  批量立即发布
                </a-radio>
                <a-radio :value="2">
                  批量定时发布
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row v-if="form.value == 2">
          <a-col :span="14">
            <a-form-model-item
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
              :label="$t('toBeEdit.fabusj')"
              prop="selectTime"
            >
              <a-date-picker
                v-model="form.selectTime"
                :show-time="{ format: 'HH:mm' }"
                placeholder="发布时间"
                inputReadOnly
                :showToday="false"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                @openChange="handleOpenChange1"
                @panelChange="handlePanelChange1"
                :disabled-date="disabledDate"
                :allowClear="false"
                :disabled-time="disabledDateTime"
              >
                <template slot="renderExtraFooter">
                  设置:每间隔
                  <a-select
                    style="width: 86px"
                    v-model="minuteNum"
                    size="small"
                  >
                    <a-select-option
                      v-for="(item, index) in autoNum"
                      :key="item.text + index"
                      :value="item.num"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                  发布一个商品
                </template>
              </a-date-picker>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="form.value == 2">
          <a-col :span="14">
            <span class="tips">
              提示：请检查所有商品已编辑的内容，必填项都有填写，避免发布失败！
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </template>
    <template v-slot:bottom-btn>
      <a-button
        type="primary"
        :loading="batchPublishLoading"
        @click="batchPublish"
      >
        发布
      </a-button>
      <a-button @click="onCancel">取消</a-button>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import releaseTimeMix from '@/mixins/release-time-mix'
import Goods from '@/api/goods'
import Cnsc from '@/api/cnsc'
import moment from 'moment'
// import { cloneDeep } from 'lodash'

export default {
  mixins: [batchEditMixins, releaseTimeMix],
  components: { BaseTable },
  data() {
    return {
      btnStyle: {
        top: 10,
        left: 70
      },
      form: {
        value: 1,
        selectTime: undefined
      },
      batchPublishLoading: false, // 批量发布按钮loading
      basicColumns: [
        {
          title: this.$t('batchEditOption.productInfo'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('batchEditOption.site'),
          dataIndex: 'sourceName',
          scopedSlots: { customRender: 'source' }
        }
      ]
    }
  },
  mounted() {
    //   console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
    this.getAutoNum()
    this.$data.form.selectTime = moment().format('YYYY-MM-DD HH:mm:ss')
  },
  methods: {
    disabledDate(value) {
      const selected = moment(value).format('YYYY-MM-DD')
      const current = moment(moment()).format('YYYY-MM-DD')
      return moment(selected).isBefore(moment(current))
    },
    handleOpenChange1(open) {
      if (open) {
        this.mode1 = 'time'
      }
    },
    handlePanelChange1(value, mode) {
      this.mode1 = mode
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    onChange() {},
    /**
     * 批量立即发布
     */
    batchPublish() {
      if (this.$data.form.value == 1) {
        const { selectedRowKeys, selectedRows } = this.$data
        if (!selectedRowKeys.length) {
          this.$message.warning(this.$t('toBeEdit.batchPublishWarning'))
          return
        }

        let cnscIds = []
        let ids = []
        selectedRows.forEach((item) => {
          if (item.countryCode == 'CNSC') {
            cnscIds.push(item.id)
          } else {
            ids.push(item.id)
          }
        })
        console.log(cnscIds, ids)
        if (ids.length) {
          let params = { productId: ids }
          this.$data.batchPublishLoading = true
          // 修改成最新的批量编辑并发布接口
          Goods.productPublish(params)
            .then((data) => {
              if (data.code == 0) {
                this.$message.success(this.$t('common.handlerSuccess'))
              }
            })
            .catch(() => {
              this.$notification.info({
                message: this.$t('common.message'),
                duration: 15,
                description: this.$t('toBeEdit.publishLoadingMessage')
              })
            })
            .finally(() => {
              this.$emit('cancel')
              this.$data.batchPublishLoading = false
            })
        }
        if (cnscIds.length) {
          let params = { productId: cnscIds }
          this.$data.batchPublishLoading = true
          // 修改成最新的批量编辑并发布接口
          Cnsc.handlePublishToMerchant(params)
            .then((data) => {
              if (data.code == 0) {
                this.$message.success(this.$t('common.handlerSuccess'))
              }
            })
            .catch(() => {
              this.$notification.info({
                message: this.$t('common.message'),
                duration: 15,
                description: this.$t('toBeEdit.publishLoadingMessage')
              })
            })
            .finally(() => {
              this.$emit('cancel')
              this.$data.batchPublishLoading = false
            })
        }
      } else {
        this.onDatePickerOk()
      }
    },
    /**
     * 批量定时发布OK
     */
    onDatePickerOk() {
      const date = this.$data.form.selectTime
      // 批量定时发布，选择的定时发布时间小于提交按钮的时间时，按照立即发布处理
      const { selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.$message.warning(this.$t('toBeEdit.batchPublishWarning'))
        return
      }

      const time = moment(date).format('YYYY-MM-DD HH:mm:ss')
      let params = {
        definiteTime: time,
        productIds: selectedRowKeys,
        timeInterval: this.$data.minuteNum
      }
      this.$data.batchPublishLoading = true
      Goods.setTimedReleaseTime(params)
        .then(() => {
          this.$data.datePickerVisible = false
          this.$message.success(this.$t('common.handlerSuccess'))
          this.$emit('cancel')
        })
        .finally(() => {
          this.$data.batchPublishLoading = false
        })
    },
    /**保存 */
    onSave() {},
    /**预览 */
    onPreview() {}
  }
}
</script>

<style lang="scss" scoped>
.me-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-width: 250px;
  max-width: 350px;
}
.replace-input {
  width: 390px;
  margin-right: 10px;
}
.iconss {
  height: 36px;
  line-height: 36px;
  margin-left: 15px;
}
.ant-row {
  height: 40px;
  overflow: hidden;
}
.tips {
  color: red;
  padding-left: 110px;
}
</style>
