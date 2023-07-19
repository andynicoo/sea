<template>
  <BaseTable
    :columns="getColumns"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="tableLoading"
    :rowSelection="rowSelection"
    :onCancel="onCancel"
    :onSave="onSave"
    :onPreview="onPreview"
    :onChange="onChange"
    :saveBtnText="$t('batchEditOption.save')"
    :saveMsg="$t('common.batchEditSuccess')"
    :btnStyle="btnStyle"
    @initData="initData"
  >
    <template v-slot:before="{ record }">
      <p class="me-desc">
        {{ $t('toBeEdit.store') }}：
        <span v-if="record.storeType == 1">{{ $t('toBeEdit.bentudian') }}</span>
        <span v-if="record.storeType == 2">{{
          $t('toBeEdit.kuajingdian')
        }}</span>
        <span v-if="record.storeType == 0">{{ $t('toBeEdit.qitadian') }}</span>
        <!-- 普通店铺 -->
        <span v-if="!record.merchantId">
          <span v-if="record.isPreOrder == true">
            {{ $t('toBeEdit.yugoutianshu') }}：{{ record.daysToShip }}
            {{ $t('toBeEdit.day') }}
          </span>
          <a-tag v-if="record.isPreOrder == true">{{
            $t('toBeEdit.yugou')
          }}</a-tag>
          <a-tag v-else>{{ $t('toBeEdit.feiyugou') }}</a-tag>
        </span>
        <!-- cnsc店铺 -->
        <span v-else>
          <a-tag v-if="record.daysToShip <= 3">非预购</a-tag>
          <a-tag v-else>预购</a-tag>
        </span>
      </p>
    </template>
    <template v-slot:after="{ record }">
      <p
        class="me-desc"
        v-if="record._isPreOrder_ != undefined && record._isPreOrder_ == false"
      >
        <a-tag>{{ $t('toBeEdit.feiyugou') }}</a-tag>
      </p>
      <p
        class="me-desc tips"
        v-if="record._isPreOrder_ != undefined && record._isPreOrder_ == true"
      >
        <a-tag>{{ $t('toBeEdit.yugou') }}</a-tag>
        <a-input
          v-if="record._daysToShip_ != undefined"
          :rows="3"
          v-model="record._daysToShip_"
          type="Number"
          class="days"
          :class="{ 'me-bred': validLen(record) }"
        />
        <span
          class="tip"
          v-show="validLen(record)"
          :class="{ 'me-cred': validLen(record) }"
          >应大于等于{{ getMinDay(record)
          }}{{ $t('toBeEdit.day') }},并小于等于{{ getMaxDay(record)
          }}{{ $t('toBeEdit.day') }}</span
        >
        <!-- <span v-if="record.storeType == 1">本土店</span>
        <span v-if="record.storeType == 2">跨境店</span>
        <span v-if="record.storeType == 0">其他店铺</span> -->
      </p>
    </template>

    <template>
      <a-form-model
        :form="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item :label="$t('toBeEdit.choseyugou')">
          <a-radio-group v-model="value" @change="onChangeRidio">
            <a-radio class="radioStyle" :value="1">
              <span class="tit">{{ $t('toBeEdit.fou') }}</span>
            </a-radio>
            <a-radio class="radioStyle" :value="2">
              <span class="tit">{{ $t('toBeEdit.shide') }}</span>
              <span v-if="dataSource.length && dataSource[0].merchantId">
                <a-input-number
                  :step="2"
                  :min="3"
                  :max="10"
                  :precision="0"
                  type="Number"
                  v-model="form.day"
                  @change="handlerDaysChange"
                />
                出货天数
                <span>(预售商品:5-10天)</span>
              </span>
              <span v-else>
                <a-input-number
                  class="input"
                  v-model="form.day"
                  :step="1"
                  :min="1"
                  :max="1000"
                  :precision="0"
                  type="Number"
                  :placeholder="$t('toBeEdit.ketian')"
                />
                天内发货(现货3天,预售商品:5-10天)
                <!-- {{ $t('toBeEdit.fahuoday') }} -->
              </span>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import Goods from '@/api/goods'
import { cloneDeep } from 'lodash'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      btnStyle: {
        top: 5,
        left: 138
      },
      labelCol: { span: 3 },
      wrapperCol: { span: 15 },
      value: 1, // 是否预扣，1否
      form: {
        day: 5
      },
      isValid: true, // 拉取验证规则
      validFlag: false
    }
  },
  methods: {
    //校验字符
    validLen(row) {
      if (
        Number(row._daysToShip_) >= Number(this.getMinDay(row)) &&
        Number(row._daysToShip_) <= Number(this.getMaxDay(row))
      ) {
        return false
      } else {
        return true
      }
    },
    //获取最大天数
    getMaxDay(row) {
      // 根据countryCode获取validData中对应的数据，根据店铺类型找到对应的预购天数匹配
      const { countryCode, storeType, _daysToShip_ } = row
      const { validData, validField } = this.$data
      if (_daysToShip_) {
        let valid = validData.find(({ type }) => type === countryCode)
        valid = valid[validField[storeType]]['preEnd']
        this.$set(row, '_preEnd_', valid)
        return valid
      }
    },
    getMinDay(row) {
      // 根据countryCode获取validData中对应的数据，根据店铺类型找到对应的预购天数匹配
      const { countryCode, storeType, _daysToShip_ } = row
      const { validData, validField } = this.$data
      if (_daysToShip_) {
        let valid = validData.find(({ type }) => type === countryCode)
        valid = valid[validField[storeType]]['preStart']
        this.$set(row, '_preStart_', valid)
        return valid
      }
    },
    onChangeRidio() {},
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**设置默认值 */
    setDefaultValu() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_daysToShip_', element.daysToShip)
          this.$set(element, '_isPreOrder_', element.isPreOrder)
        }
      })
    },
    /**保存 */
    async onSave() {
      this.setDefaultValu()
      const { dataSource, selectedRowKeys } = this.$data
      let data = cloneDeep(dataSource).filter(({ id }) => {
        return selectedRowKeys.includes(id)
      })
      this.$data.validFlag = false
      for (let i = 0; i < data.length; i++) {
        if (this.validLen(data[i])) {
          this.$data.validFlag = true
          break
        }
      }
      if (this.$data.validFlag && this.$data.value == 2) {
        this.$Message({ type: 'error', content: this.$t('toBeEdit.zqqj') })
        return Promise.reject()
      }
      data = data.map((ele) => {
        ele.isPreOrder = ele._isPreOrder_
        ele.daysToShip = ele._daysToShip_
        return ele
      })
      console.log(data)
      let res = await Goods.handleEditBatch(data)
    },
    /**预览 */
    onPreview() {
      this.setDefaultValu()
      const { form, dataSource } = this.$data
      const { day } = form
      this.$data.dataSource = dataSource.map((ele) => {
        ele._isPreOrder_ = ele.isPreOrder
        ele._daysToShip_ = ele.daysToShip
        //非预购
        if (this.$data.value == 1) {
          ele._isPreOrder_ = false
          ele._daysToShip_ = 0
        } else {
          ele._isPreOrder_ = true
          ele._daysToShip_ = day
        }
        return ele
      })
      console.log(this.$data.dataSource)
    },
    initData() {
      this.getTableData()
    },
    handlerDaysChange(data) {
      if (data == 4) {
        this.form.day = 3
      }
    }
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
  .days {
    display: inline-block;
    width: 100px;
  }
}
.replace-input {
  width: 390px;
  margin-right: 10px;
}
.radioStyle {
  display: block;
  height: 40px;
  line-height: 40px;
  .input {
    width: 100px;
    margin-right: 10px;
    margin-left: 10px;
  }
}

.me-cred {
  color: red;
}
.me-bred {
  border: 1px solid red;
}
.tips {
  position: relative;
  height: 55px;
  .tip {
    position: absolute;
    top: 35px;
    left: 47px;
  }
}
</style>
