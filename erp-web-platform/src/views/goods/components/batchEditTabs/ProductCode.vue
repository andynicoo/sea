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
    @initData="initData"
  >
    <template v-slot:before="{ record }">
      <p class="me-desc">{{ record.itemSku }}</p>
    </template>
    <template v-slot:after="{ record }">
      <p class="me-desc">
        <!-- {{ typeof record._itemSku_ }} -->
        <a-input
          v-if="record._itemSku_ != undefined"
          @change="onDescChange(record)"
          :rows="3"
          v-model="record._itemSku_"
        />
      </p>
    </template>

    <template>
      <a-form-model :form="form">
        <!-- <a-row>
          <a-col :span="14">
            <a-form-model-item
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
              :label="$t('toBeEdit.tongyi')"
            >
              <a-input v-model="form.itemSku" />
            </a-form-model-item>
          </a-col>
        </a-row> -->

        <a-row>
          <a-col :span="7">
            <a-form-model-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              :label="$t('toBeEdit.addqianzhui')"
            >
              <a-input v-model="form.appendBefor" />
            </a-form-model-item>
          </a-col>
          <a-col :span="7">
            <a-form-model-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              :label="$t('toBeEdit.addhouzhui')"
            >
              <a-input v-model="form.appendAfter" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row v-for="(item, index) in form.replaceCode" :key="index">
          <!-- <a-col :span="14"> -->
          <a-col :span="7">
            <a-form-model-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              :label="$t('toBeEdit.jianghuohao')"
            >
              <a-input v-model="item.before" />
            </a-form-model-item>
          </a-col>
          <a-col :span="7">
            <a-form-model-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              :label="$t('descEdit.replace')"
            >
              <a-input v-model="item.after" />
            </a-form-model-item>
          </a-col>
          <a-col :span="2">
            <a-icon
              v-if="index == 0"
              type="plus"
              class="iconss"
              @click="addReplactItem"
            /><a-icon
              v-if="index > 0"
              type="minus"
              class="iconss"
              @click="delReplactItem(index)"
            />
          </a-col>
          <!-- </a-col> -->
        </a-row>

        <a-row>
          <a-col :span="14">
            <a-form-model-item
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
              :label="$t('toBeEdit.shanchuhuohao')"
            >
              <a-input v-model="form.remove" />
            </a-form-model-item>
          </a-col>
        </a-row>
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
      form: {
        itemSku: '',
        appendAfter: '',
        appendBefor: '',
        replaceCode: [{ before: '', after: '' }],
        remove: ''
      }
    }
  },
  methods: {
    addReplactItem() {
      console.log(this.$data.form.replaceCode.length)
      if (this.$data.form.replaceCode.length > 9) {
        this.$Message({ type: 'error', content: this.$t('toBeEdit.zuiduo10') })
        return false
      }
      this.$data.form.replaceCode.push({ before: '', after: '' })
    },
    delReplactItem(index) {
      this.$data.form.replaceCode.splice(index, 1)
    },
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
          this.$set(element, '_itemSku_', element.itemSku)
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

      data = data.map((ele) => {
        ele.itemSku = ele._itemSku_
        return ele
      })
      let res = await Goods.handleEditBatch(data)

      console.log(data)
    },
    /**预览 */
    onPreview() {
      this.setDefaultValu()
      const { form, dataSource } = this.$data
      const { appendAfter, appendBefor, itemSku, replaceCode, remove } = form
      this.$data.dataSource = dataSource.map((ele) => {
        ele._itemSku_ = ele.itemSku
        if (itemSku) ele._itemSku_ = itemSku
        if (appendBefor) ele._itemSku_ = appendBefor + ele._itemSku_
        if (appendAfter) ele._itemSku_ = ele._itemSku_ + appendAfter
        replaceCode.forEach((item) => {
          if (item.before)
            ele._itemSku_ = ele._itemSku_.replace(
              new RegExp(item.before, 'g'),
              item.after
            )
        })
        if (remove) {
          const reg = new RegExp(remove, 'g')
          ele._itemSku_ = ele._itemSku_.replace(reg, '')
        }
        return ele
      })
    },
    initData() {
      this.getTableData()
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
</style>
