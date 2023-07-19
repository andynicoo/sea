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
    :onTranslate="onTranslate"
    :onChange="onChange"
    :saveBtnText="$t('batchEditOption.save')"
    :saveMsg="$t('common.batchEditSuccess')"
    :btnStyle="btnStyle"
    @initData="initData"
  >
    <template #preStep>
      <a-button class="me-ml-2" :disabled="preData.length < 2" @click="goPre">
        上一步
      </a-button>
    </template>
    <template v-slot:before="{ record }">
      <p class="me-desc">{{ record.description }}</p>

      <a-popover :title="null" placement="bottom">
        <template slot="content">
          <!-- <div style="width: 800px">{{ record.description }}</div> -->
          <a-textarea
            readonly
            style="width:800px"
            :auto-size="{ minRows: 5, maxRows: 15 }"
            v-model="record.description"
          ></a-textarea>
        </template>
        <a class="me-link">{{ $t('descEdit.showAll') }}</a>
      </a-popover>
    </template>
    <template v-slot:after="{ record }">
      <div class="me-desc">
        <template v-if="record._change_">
          <a-form-model>
            <a-form-model-item
              :validateStatus="record._valid_ && 'error'"
              :help="record._valid_"
            >
              <a-textarea
                @change="onItemValid(record)"
                :rows="3"
                v-model="record._description_"
              />
              <span
                :class="{ 'me-error': record._valid_ }"
                class="me-text-length"
              >
                {{ record._description_.length }}/{{ record._desLen_ }}
              </span>
            </a-form-model-item>
          </a-form-model>
        </template>
      </div>
    </template>

    <template>
      <a-form :form="form">
        <table style="width: 880px">
          <tr>
            <td class="me-text-right">{{ $t('descEdit.newDesc') }}：</td>
            <td colspan="3">
              <a-form-item class="me-mb-0">
                <!-- <a-input v-decorator="['newDesc']" /> -->
                <Emoji
                  v-model="emojiText"
                  @input="onEmojiChange"
                  ids="newDesc"
                  textType="textarea"
                ></Emoji>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="me-text-right">{{ $t('descEdit.appendBefor') }}：</td>
            <td>
              <a-form-item class="me-mb-0">
                <!-- <a-input v-decorator="['appendBefor']" /> -->
                <Emoji v-model="emojiBefor" ids="emojiBefor"></Emoji>
              </a-form-item>
            </td>
            <td class="me-text-right" style="padding-left:20px">
              {{ $t('descEdit.appendAfter') }}：
            </td>
            <td>
              <a-form-item class="me-mb-0">
                <!-- <a-input v-decorator="['appendAfter']" /> -->
                <Emoji v-model="emojiAfter" ids="emojiAfter"></Emoji>
              </a-form-item>
            </td>
          </tr>
          <tr v-for="(item, index) in replaceList" :Key="index">
            <td class="me-text-right">{{ $t('descEdit.find') }}：</td>
            <td>
              <a-form-item class="me-mb-0">
                <a-input v-model="item.find" />
              </a-form-item>
            </td>
            <td class="me-text-right">{{ $t('descEdit.replace') }}：</td>
            <td>
              <a-form-item class="me-mb-0">
                <a-input v-model="item.replace" />
              </a-form-item>
            </td>
            <td>
              <div class="me-ml-2">
                <a-icon
                  v-if="index == 0"
                  type="plus"
                  @click="addReplactItem"
                /><a-icon
                  v-if="index > 0"
                  type="minus"
                  @click="delReplactItem(item)"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td class="me-text-right">{{ $t('descEdit.remove') }}：</td>
            <td>
              <a-form-item class="me-mb-0">
                <a-input v-decorator="['remove']" />
              </a-form-item>
            </td>
            <td class="me-text-right">{{ $t('descEdit.settings') }}：</td>
            <td>
              <a-form-item class="me-mb-0">
                <a-checkbox
                  v-decorator="[
                    'settings',
                    { valuePropName: 'checked', initialValue: false }
                  ]"
                >
                  {{ $t('descEdit.letterWord') }}
                </a-checkbox>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { upperFirst, cloneDeep } from 'lodash'
import Goods from '@/api/goods'
import Emoji from '@/components/Emoji'
const replaceTemplate = { find: '', replace: '', id: Date.now() }
export default {
  mixins: [batchEditMixins],
  components: { BaseTable, Emoji },
  data() {
    return {
      preData: [
        {
          emojiText: '',
          emojiBefor: '',
          emojiAfter: '',
          replaceList: [{ ...replaceTemplate }]
        }
      ],
      btnStyle: {
        top: 10,
        left: 111
      },
      form: this.$form.createForm(this, {
        initialValue: { newDesc: '33334444' }
      }),
      maxDescript: 255,
      isValid: true,
      emojiText: '',
      emojiBefor: '',
      emojiAfter: '',
      replaceList: [{ ...replaceTemplate }]
    }
  },
  methods: {
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**校验 */
    onValids() {
      const { selectedRows, size } = this.$data
      let valids = selectedRows.map(this.onItemValid)
      valids = valids.every((v, i) => {
        if (!v) {
          const current = Number.parseInt(i / size) + 1
          this.$data.current = current
        }
        return v
      })
      return valids
    },
    /**保存 */
    async onSave() {
      const { dataSource, selectedRowKeys, emojiText } = this.$data
      this.setDefaultValu()
      if (!this.onValids()) {
        this.$message.error(this.$t('descEdit.validMsg3'))
        return Promise.reject()
      }
      let _data = dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      _data = cloneDeep(_data).map((ele) => {
        ele.description = ele._description_
        return ele
      })
      // _data.newDesc = emojiText
      await Goods.handleEditBatch(_data)
    },
    //上一步
    goPre() {
      let { preData, form } = this.$data
      if (preData.length > 1) {
        preData.pop()
        let currData = cloneDeep(preData[preData.length - 1])
        Object.entries(currData).forEach(([key, value]) => {
          this.$data[key] = value
        })
        form.setFieldsValue({
          remove: currData.remove,
          settings: currData.settings
        })
        this.replaceList = currData.replaceList
        if (preData.length == 1) {
          this.initData()
        } else {
          this.onPreview(true)
        }
      }
    },
    /**预览 */
    onPreview(pre) {
      const {
        form,
        dataSource,
        validData,
        emojiText,
        emojiBefor,
        emojiAfter,
        replaceList
      } = this.$data
      this.setDefaultValu()
      this.validDataStatus()
      const data = form.getFieldsValue()
      data.newDesc = emojiText
      data.appendBefor = emojiBefor
      data.appendAfter = emojiAfter
      const {
        appendAfter,
        appendBefor,
        // find,
        newDesc,
        remove,
        // replace = '',
        settings
      } = data

      if (!pre) {
        this.preData.push(
          cloneDeep({
            emojiText,
            emojiBefor,
            emojiAfter,
            replaceList,
            remove,
            settings
          })
        )
      }

      this.$data.dataSource = dataSource.map((ele) => {
        const oldValue = ele.description
        ele._description_ = oldValue
        ele._change_ = true
        if (newDesc) ele._description_ = newDesc
        if (appendBefor) ele._description_ = appendBefor + ele._description_
        if (appendAfter) ele._description_ = ele._description_ + appendAfter
        if (replaceList.length) {
          replaceList.forEach((item) => {
            if (item.find) {
              const reg = new RegExp(item.find, 'g')
              ele._description_ = ele._description_.replace(reg, item.replace)
            }
          })
        }
        if (remove) {
          const reg = new RegExp(remove, 'g')
          ele._description_ = ele._description_.replace(reg, '')
        }
        if (settings) {
          let ds = ele._description_.split(' ')
          ds = ds.map((word) => upperFirst(word))
          ele._description_ = ds.join(' ')
        }

        let findValid = (code, type) => {
          const current = validData.find(({ type }) => type === code)
          const types = { 2: 'cross_border', 1: 'cross_border' }
          return current[types[type]]
        }
        const currentValid = findValid(ele.countryCode, ele.storeType)
        if (ele._description_.length > currentValid.dec) {
          const valid = currentValid.dec
          ele._valid_ = this.$t('descEdit.validMsg2', { valid })
        }
        ele._desLen_ = currentValid.dec
        return ele
      })
    },
    /**翻译 */
    async onTranslate({ lang }) {
      await this.handlerTranslate('_description_', lang)
      this.validDataStatus()
      return
    },
    /**内容改变事件 */
    onItemValid(source) {
      const { countryCode, storeType, _description_ } = source
      const { validData, validField } = this.$data
      this.$set(source, '_valid_', null)
      if (!_description_) {
        this.$set(source, '_valid_', this.$t('descEdit.validMsg1'))
        return false
      }
      let valid = validData.find(({ type }) => type === countryCode)
      valid = valid[validField[storeType]]['dec']
      if (_description_.length > valid) {
        this.$set(source, '_valid_', this.$t('descEdit.validMsg2', { valid }))
        return false
      }
      return true
    },
    /**清除校验 */
    validDataStatus() {
      const { dataSource, validData } = this.$data
      let findValid = (code, type) => {
        const current = validData.find(({ type }) => type === code)
        const types = { 2: 'cross_border', 1: 'cross_border' }
        return current[types[type]]
      }
      dataSource.forEach((element) => {
        const currentValid = findValid(element.countryCode, element.storeType)
        if (element._description_.length > currentValid.dec) {
          const valid = currentValid.dec
          const error = this.$t('descEdit.validMsg2', { valid })
          this.$set(element, '_valid_', error)
        } else {
          this.$set(element, '_valid_', null)
        }
      })
    },
    /**设置默认值 */
    setDefaultValu() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_description_', element.description)
          this.$set(element, '_desLen_', element.description.length)
          this.$set(element, '_change_', true)
        }
      })
    },
    onEmojiChange(value) {
      console.log(value)
      // this.$data.form.setFieldsValue({newDesc: value})
    },
    initData() {
      this.getTableData()
    },
    addReplactItem() {
      this.replaceList.push({ ...replaceTemplate, id: Date.now() })
    },
    delReplactItem(item) {
      let index = this.replaceList.findIndex((it) => it.id === item.id)
      this.replaceList.splice(index, 1)
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

td {
  &.me-text-right {
    min-width: 10px;
  }

  &:not(.me-text-right) {
    min-width: 100px;
  }
}
.me-error {
  color: #f5222d;
}
.me-text-length {
  position: absolute;
  bottom: -26px;
  right: 0;
  line-height: 13px;
}
</style>
