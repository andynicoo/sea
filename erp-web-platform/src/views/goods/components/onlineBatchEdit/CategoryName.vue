<template>
  <BaseTable
    :columns="getColumns"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="tableLoading"
    :onCancel="onCancel"
    :onSave="onSave"
    :onPreview="onPreview"
    :onChange="onChange"
    :saveBtnText="$t('edit.update')"
    :saveMsg="$t('edit.updateSuccess')"
  >
    <template v-slot:before="{ record }">
      {{ $t('toBeEdit.fenlei') }}:
      <!-- {{ record.shopCategories }} -->
      {{ getCategoryStr(record, 'shopCategories') }}
    </template>
    <template v-slot:after="{ record }">
      <p class="me-desc"></p>
      <p v-if="record._shopCategories_">
        <!-- {{ record._shopCategories_ }} -->
        {{ getCategoryStr(record, '_shopCategories_') }}
        <span class="me-cred" v-if="errorItemMsg(record.itemId) != null">
          <!-- errorItemId.includes(record.itemId) -->
          <!-- {{$t('toBeEdit.xiapitip')}} -->
          {{ errorItemMsg(record.itemId) }}
        </span>
      </p>
    </template>

    <template>
      <!-- selectedRowKeys:{{ selectedRowKeys }} -->
      <!-- {{ errorItem }} -->
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- {{cataValue}} -->
        <a-form-model-item class="me-ma-0" :label="$t('toBeEdit.editType')">
          <a-radio-group v-model="value">
            <a-radio :value="1">
              {{ $t('toBeEdit.addCate') }}
            </a-radio>
            <a-radio :value="2">
              {{ $t('toBeEdit.repaceCate') }}
            </a-radio>
            <a-radio :value="3">
              {{ $t('toBeEdit.equitCate') }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item class="me-ma-0" :label="$t('toBeEdit.selectCate')">
          <!-- {{ cataValue }} -->
          <a-select
            style="width: 300px"
            :disabled="isAsyncCate"
            v-model="cataValue"
            @change="selectChange"
          >
            <a-select-option
              v-for="item in cateData"
              :value="item.shopCategoryId + '@' + item.name"
              :key="item.shopCategoryId"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-button
            icon="sync"
            type="primary"
            :loading="asyncBatchLoading"
            @click="asyncCategory"
            class="syncbutton"
          >
            {{ $t('toBeEdit.syncStore') }}
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import Goods from '@/api/goods'
import { cloneDeep, includes } from 'lodash'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  props: {
    storeId: Number
  },
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      value: 1, // 单选框
      asyncBatchLoading: false, // 同步分类按钮loading
      paginationData: {
        size: '1000',
        current: 1,
        total: 0
      },
      whetherSave: true,
      cateData: [], // 分类下拉数据
      isAsyncCate: true, // 是否同步过店铺分类，同步之后才请求下拉数据
      cataValue: null, // 下拉分类选中值,包含id和name
      shopCategories: '', // 请求新的dataSource数据中的分类
      itemId: [], // 店内分类选中商品的itemId []
      errorItemId: [], // 提交后后端返回的不可修改的itemId []
      errorItem: [] // 提交后后端返回的不可修改的itemId和msg[{}]
    }
  },
  mounted() {
    console.log(this.$props.storeId)

    this.getCateData()
  },
  computed: {
    getCategoryStr() {
      return (record, field) => {
        if (record[field]) {
          var cateStr = ''
          for (var i = 0; i < record[field].length; i++) {
            if (i == record[field].length - 1) {
              cateStr += record[field][i].name
            } else {
              cateStr += record[field][i].name + '--'
            }
          }
          return cateStr
        } else return null
      }
    }
  },
  methods: {
    errorItemMsg(itemId) {
      var msg = ''
      this.$data.errorItem.map((ele) => {
        if (itemId == ele.itemId) {
          msg = ele.msg
        }
      })
      return msg
    },
    selectChange(value) {
      console.log(`selected ${value}`)
    },
    // 店内分类组件进来，请求新的dataSource数据，重置batchEditMixins中的getTableData方法
    getTableData() {
      // this.$data.dataSource=[]
      const { selectedRowKeys } = this.$data
      this.$data.tableLoading = true
      var params = {
        storeId: this.$props.storeId
      }
      Goods.getCategoryProductlist(params)
        .then((res) => {
          if (res.code == 0) {
            this.$data.dataSource = res.data
            // this.$data.dataSource.map((ele) => {
            //   this.$data.selectedRowKeys.push(ele.id)
            // })
            this.$data.selectedRowKeys.length = res.data.length
            this.$data.total = res.data.length
          }
        })
        .finally(() => {
          this.$data.tableLoading = false
        })
    },
    // 获取分类列表
    getCateData() {
      const { size, current } = this.$data.paginationData
      const storeId = this.$props.storeId
      console.log({ size, current, storeId })
      // return false
      Goods.handleGetCateShop({ size, current, storeId })
        .then((res) => {
          if (res.code == 0) {
            this.$data.cateData = res.data.records
          }
        })
        .finally(() => {
          this.$data.isAsyncCate = false
        })
    },
    /**
     * 同步分类
     */
    asyncCategory() {
      this.$data.asyncBatchLoading = true
      var data = Goods.handleSyncCate()
        .then(() => {
          this.$message.success(this.$t('common.handlerSuccess'))
        })
        .finally(() => {
          this.$data.asyncBatchLoading = false
          this.getCateData()
        })
        .catch(() => {})
      // console.log(data)
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**设置默认值 */
    setDefaultValue() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._shopCategories_) {
          this.$set(element, '_shopCategories_', element.shopCategories)
        }
      })
    },
    onSave() {
      return new Promise((resolve, reject) => {
        const { dataSource, selectedRowKeys, value } = this.$data
        if (this.$data.cataValue === null) {
          this.$message.error(this.$t('toBeEdit.selectCatePlace'))
          return reject()
        }
        dataSource.map((ele) => {
          // if (this.rowSelection.selectedRowKeys.indexOf(ele.id) > -1) {
          this.$data.itemId.push(ele.itemId)
          // }
          // return ele
        })

        var params = {
          shopCategoryId: this.$data.cataValue.split('@')[0],
          storeId: this.$props.storeId,
          name: this.$data.cataValue.split('@')[1],
          itemId: this.$data.itemId //this.$data.selectedRowKeys
        }
        // 加入新分类
        if (value === 1) {
          Goods.addShopCategory(params)
            .then((res) => {
              if (res.code == 0) {
                resolve()
              }
            })
            .catch(() => reject(false))
        }
        // 替换原有分类
        if (value === 2) {
          Goods.updateShopCategory(params)
            .then((res) => {
              if (res.code == 0) {
                res.data.map((ele) => {
                  this.$data.errorItemId.push(ele.itemId)
                })
                this.$data.errorItem = res.data
                var unSuccessCount = 0
                this.$data.errorItem.map((ele) => {
                  if (ele.msg != null) {
                    unSuccessCount++
                  }
                })
                if (unSuccessCount == 0) {
                  resolve()
                } else {
                  // 有未修改成功的情况，提示信息，不刷新列表
                  this.$message.warning({
                    content: (h) => (
                      <p style="color: red">
                        {this.$t('toBeEdit.tipss')}
                      </p>
                    ),
                    duration: 10
                  })

                  reject(false)
                }
              }
            })
            .catch(() => reject(false))
        }
        // 退出选中的分类
        if (value === 3) {
          Goods.deleteShopCategory(params)
            .then((res) => {
              if (res.code == 0) {
                resolve()
              }
            })
            .catch(() => reject(false))
        }
      })
    },
    /**预览 */
    onPreview() {
      this.$data.errorItemId = []
      this.$data.errorItem = []
      const { dataSource, selectedRowKeys, value } = this.$data
      if (this.$data.cataValue === null) {
        this.$message.error(this.$t('toBeEdit.selectCatePlace'))
        return false
      }

      this.$data.dataSource = dataSource.map((ele) => {
        // if (selectedRowKeys.includes(ele.id)) {
        // ele._shopCategories_ = ele.shopCategories
        this.$set(ele, '_shopCategories_', ele.shopCategories)
        if (value === 1) {
          var s = cloneDeep(ele.shopCategories)
          // s.filter(({ shopCategoryId }) => shopCategoryId==(this.$data.cataValue.split('@')[0]))
          // console.log(s)
          var hasShopCategoryId = false
          s.map((ele) => {
            if (ele.shopCategoryId == this.$data.cataValue.split('@')[0])
              hasShopCategoryId = true
          })

          if (!hasShopCategoryId) {
            this.$set(
              ele,
              '_shopCategories_',
              s.concat({
                shopCategoryId: this.$data.cataValue.split('@')[0],
                storeId: this.$props.storeId,
                name: this.$data.cataValue.split('@')[1]
              })
            )
          }
        }
        if (value === 2) {
          this.$set(ele, '_shopCategories_', [
            {
              shopCategoryId: this.$data.cataValue.split('@')[0],
              storeId: this.$props.storeId,
              name: this.$data.cataValue.split('@')[1]
            }
          ])
        }
        if (value === 3) {
          var ind = 0
          ele._shopCategories_.map((ele, index) => {
            if (ele.shopCategoryId == this.$data.cataValue.split('@')[0])
              ind = index
          })
          var s = cloneDeep(ele.shopCategories)

          var hasShopCategoryId = false
          s.map((ele) => {
            if (ele.shopCategoryId == this.$data.cataValue.split('@')[0])
              hasShopCategoryId = true
          })

          // console.log(ele._shopCategories_[ind])
          if (hasShopCategoryId) {
            if (s[ind] != undefined) {
              s.splice(ind, 1)
              this.$set(ele, '_shopCategories_', s)
            }
          }
        }
        // }
        return ele
      })
    },
    whetherChange() {
      const { dataSource } = this.$data
      const changes = dataSource.map(({ shopCategories, _shopCategories_ }) => {
        if (_shopCategories_ && shopCategories != _shopCategories_) {
          return true
        } else {
          return false
        }
      })
      return changes.some(Boolean)
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

.form-table {
  tr {
    td {
      text-align: right;
      padding: 0 5px;

      &:nth-child(1) {
        min-width: 70px;
      }
      &:nth-child(2) {
        min-width: 100px;
      }
      .input {
        width: 200px;
        margin-right: 5px;
      }
    }
  }
}
._input_ {
  width: 90px;
  margin-right: 5px;
}
.syncbutton {
  margin-left: 5px;
}
.me-cred {
  color: red;
}
</style>
