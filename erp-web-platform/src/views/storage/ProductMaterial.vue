<template>
  <div class="me-pa-2">
    <div class="me-card">
      <a-button type="primary" @click="addMaterial">
        {{ $t('material.addBtn') }}
      </a-button>
      <a-input-search
        class="me-fr me-w300"
        :placeholder="$t('common.name')"
        :enter-button="$t('common.search')"
        allowClear
        @search="searchMaterial"
      />
    </div>
    <div class="me-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="updateTime"
        :pagination="getPagination"
        @change="changePage"
        :loading="tableLoading"
      >
        <template slot="name" slot-scope="text">
          <div class="me-max-w300">{{ text }}</div>
        </template>
        <template slot="length" slot-scope="text, record">
          {{ record.length }} X {{ record.wide }} X {{ record.high }}
        </template>

        <template slot="handler" slot-scope="text, record">
          <a-button type="link" @click="editMaterial(record)">
            {{ $t('common.edit') }}
          </a-button>
          <a-button type="link" class="me-error" @click="delMaterial(record)">
            {{ $t('common.delete') }}
          </a-button>
        </template>
      </a-table>
    </div>
    <!-- 新增修改包材-->
    <a-modal
      :title="isAdd ? $t('material.addBtn') : $t('material.editBtn')"
      :visible="materialVisible"
      @ok="materialOk"
      width="800px"
      :confirm-loading="confirmLoading"
      @cancel="materialCancel('materialVisible')"
      :maskClosable="false"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 14 }"
        class="me-material-add"
      >
        <a-form-item :label="$t('common.name')">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  { required: true, message: $t('material.inMateName') },
                  { va: /^.{1,60}$/, message: '不能超过60位字符' }
                ]
              }
            ]"
            :maxLength="maxLen100"
          />
        </a-form-item>
        <a-form-item :label="$t('material.level')">
          <a-select
            v-decorator="[
              'level',
              {
                rules: [{ required: true, message: $t('material.inMateLevel') }]
              }
            ]"
          >
            <a-select-option
              :value="item.value"
              v-for="item in levelArr"
              :key="item.value"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('common.describe')">
          <a-textarea
            v-decorator="[
              'des',
              {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (value.length >= 500)
                        return callback('不能超过500位字符')
                      callback()
                    }
                  }
                ]
              }
            ]"
            :rows="4"
          />
        </a-form-item>
        <a-form-item :label="$t('material.mateSize')" class="me-form-inline">
          <a-input
            v-decorator="[
              'length',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: validateToNumber
                  }
                ]
              }
            ]"
            :maxLength="maxLen"
            :placeholder="$t('common.length')"
            @input="calculateVolume"
          />
        </a-form-item>
        <a-form-item class="me-form-unlable">
          <a-input
            v-decorator="[
              'wide',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: validateToNumber
                  }
                ]
              }
            ]"
            :placeholder="$t('common.width')"
            :maxLength="maxLen"
            @input="calculateVolume"
          />
        </a-form-item>
        <a-form-item class="me-form-unlable">
          <a-input
            v-decorator="[
              'high',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: validateToNumber
                  }
                ]
              }
            ]"
            :placeholder="$t('common.height')"
            :maxLength="maxLen"
            @input="calculateVolume"
          /><span class="me-unlable-text"
            >{{ $t('common.volume') }}:{{ volume }}cm³</span
          >
        </a-form-item>
        <a-form-item :label="$t('common.weight')" class="me-material-weight">
          <a-input
            v-decorator="[
              'weight',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: validateToNumber
                  }
                ]
              }
            ]"
            :maxLength="maxLen"
          /><span class="me-form-text">{{ $t('common.unit') }} ：kg</span>
        </a-form-item>
        <a-form-item :label="$t('common.price')">
          <a-input
            v-decorator="[
              'price',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: validateToNumber
                  }
                ]
              }
            ]"
            :maxLength="maxLen"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
/**
 * 包材管理
 */
import Product from '@/api/product'
import tableMixins from '@/mixins/tableMixins'
import { PRICE } from '@/util/regex'
import { mcl } from '@/util'
export default {
  mixins: [tableMixins],
  data() {
    return {
      maxLen: 8,
      maxLen100: 100,
      maxLen500: 500,
      isAdd: true,
      materialVisible: false,
      form: this.$form.createForm(this),
      volume: 0,
      rowId: '',
      levelArr: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
      columns: [
        {
          title: this.$t('common.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        { title: this.$t('common.price'), dataIndex: 'price' },
        { title: this.$t('common.weight') + '(g)', dataIndex: 'weight' },
        { title: this.$t('common.level'), dataIndex: 'level' },
        {
          title: this.$t('material.mateSize') + '(cm)',
          dataIndex: 'length',
          scopedSlots: { customRender: 'length' }
        },
        { title: this.$t('common.addPeople'), dataIndex: 'createBy' },
        { title: this.$t('common.addTime'), dataIndex: 'updateTime' },
        // { title: '状态', dataIndex: 'status' },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      confirmLoading: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    //大于0正整数或最多两位小数
    validateToNumber(rule, value, callback) {
      if (!PRICE.test(value)) {
        callback(this.$t('material.twoDecimal'))
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
    },
    //获取包材列表
    getTableData() {
      return Product.getProductMaterialList({ ...this.$data.paginationData })
    },
    //搜索包材
    searchMaterial(value) {
      this.$set(this.$data.paginationData, 'name', value)
      this.reLoadData()
    },
    //添加包材
    addMaterial() {
      this.$data.volume = 0
      this.$data.materialVisible = true
      this.$data.form.resetFields()
      this.$data.isAdd = true
    },
    //编辑包材
    editMaterial(row) {
      this.addMaterial()
      this.$data.isAdd = false
      this.$data.rowId = row.materialId
      this.$nextTick(() => {
        this.$data.form.setFieldsValue({
          name: row.name,
          level: row.level,
          des: row.des,
          length: row.length,
          wide: row.wide,
          high: row.high,
          weight: row.weight,
          price: row.price
        })
        this.calculateVolume()
      })
    },
    //确定添加修改
    materialOk() {
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          let res
          this.$data.confirmLoading = true
          if (this.$data.isAdd) {
            res = await Product.addProductMaterial(values)
          } else {
            values.materialId = this.$data.rowId
            res = await Product.editProductMaterial(values)
          }
          this.$emit('change')
          this.$data.confirmLoading = false
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$data.isAdd
                ? this.$t('common.addSuccess')
                : this.$t('common.editSuccess')
            })
            this.$data.materialVisible = false
            this.loadData()
          } else {
            this.$Message({
              type: 'error',
              content: this.$t('common.handlerFail') + `:${res.message}`
            })
          }
        }
      })
    },
    //关闭新增修改弹窗
    materialCancel(visible) {
      console.log('Clicked cancel button')
      this.$data[visible] = false
    },
    delMaterial(row) {
      let _this = this
      let dataSourceLen = this.$data.dataSource.length
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          let res = await Product.delProductMaterial({
            materialId: row.materialId
          })
          this.$emit('change', row.materialId)
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })
            if (dataSourceLen == 1) {
              _this.$data.paginationData.current -= 1
            }
            _this.loadData()
          } else {
            this.$Message({
              type: 'error',
              content: this.$t('common.handlerFail') + `:${res.message}`
            })
          }
        }
      })
    },
    //计算体积
    calculateVolume() {
      let lwh = this.$data.form.getFieldsValue()
      if (
        PRICE.test(lwh.length) &&
        PRICE.test(lwh.wide) &&
        PRICE.test(lwh.high)
      ) {
        this.$data.volume = mcl(mcl(lwh.length, lwh.wide), lwh.high)
      } else {
        this.$data.volume = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.me-ml20 {
  margin-left: 20px !important;
}
.me-material-add {
  ::v-deep .ant-col-5 {
    width: 178px;
  }
}
.me-form-inline {
  display: inline-block;
  ::v-deep .ant-col-14 {
    width: 120px;
  }
}
.me-form-unlable {
  display: inline-block;
  margin-left: 10px;
  width: 149px;
  ::v-deep .ant-col-14 {
    width: 100%;
  }
}

.me-form-text {
  position: absolute;
  left: 445px;
  top: -10px;
  min-width: 120px;
}
.me-unlable-text {
  position: absolute;
  left: 156px;
  top: -10px;
  min-width: 150px;
}
.me-max-w300 {
  max-width: 220px;
}
</style>
