<template>
  <div
    ref="container"
    class="wrapper"
  >
    <div
      v-show="model === 'list'"
      class="me-config-infolist"
    >
      <div style="margin-bottom: 10px">
        <a-button
          type="primary"
          @click="addMarket"
        > 新建活动 </a-button>
      </div>
      <a-table
        :pagination="pagination"
        :columns="columns"
        :data-source="data"
        :row-key="(record, index) => index"
        :scroll="{ y: tableHeight }"
        @change="onChange"
      >
        <template
          slot="endTime"
          slot-scope="text, record"
        >
          <div class="conline">
            {{ formattime(record.startTime) }}~{{ formattime(record.endTime) }}
          </div>
        </template>

        <template
          slot="activityName"
          slot-scope="text, record"
        >
          <div class="conline">
            {{ record.activityName }}
          </div>
        </template>

        <template
          slot="giveUnit"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in record.activityDetailAOS"
            :key="item.id + index + item.configName + item.configUnit"
            class="configline"
            :class="{
              'me-merchant-store': record.activityDetailAOS.length > 1
            }"
          >
            {{ item.configName }}/<span
              v-if="item.configUnit === 'MONTH'"
            >月
            </span>
            <span v-else>年 </span>
          </div>
        </template>
        <template
          slot="activityType"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in record.activityDetailAOS"
            :key="item.id + index + item.configName + item.configUnit"
            class="configline"
            :class="{
              'me-merchant-store': record.activityDetailAOS.length > 1
            }"
          >
            <!-- 买几送几 -->
            <span v-if="item.activityType === 1">
              买{{ item.purchaseQuantity }}送{{ item.giveQuantity }}个<span
                v-if="item.giveUnit === 1"
              >月</span>
              <span v-else>年</span>
            </span>
            <!-- 折扣 -->
            <span v-if="item.activityType === 2">
              打{{ item.discount * 10 }}折
            </span>
            <span v-if="item.activityType === 3">
              一口价{{ item.specialPrice }}旺币
            </span>
          </div>
        </template>
        <template
          slot="enableStatus"
          slot-scope="text, record"
        >
          <span
            v-if="record.enableStatus"
            class="me-status-success conline"
          >
            启用
          </span>
          <span
            v-else
            class="me-status-skip"
          > 禁用 </span>
        </template>

        <template #action="text, record">
          <a-space>
            <span
              class="action-button"
              @click="handleEdit('edit', record)"
            >修改</span>
            <a-button
              v-if="record.enableStatus"
              type="link"
              :loading="record._loading"
              @click="eidtStatus(record)"
            >
              禁用
            </a-button>
            <a-button
              v-else
              type="link"
              :loading="record._loading"
              @click="eidtStatus(record)"
            >
              启用
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>
    <div v-show="model !== 'list'">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 8 }"
        label-align="left"
      >
        <a-form-model-item
          label="活动名称"
          prop="activityName"
        >
          <a-input
            v-model="form.activityName"
            placeholder="请输入活动名称"
          />
        </a-form-model-item>

        <a-form-model-item label="优惠设置">
          <div
            v-for="(item, index) in form.activityDetailAOS"
            :key="item.activityType + index"
            class="formitem"
          >
            <div>
              <span class="tit">
                选择优惠套餐:
              </span>
              <a-select
                v-model="form.activityDetailAOS[index].memberSetMealId"
                style="width: 150px"
              >
                <a-select-option
                  v-for="item in marketData"
                  :key="item.id + index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </div>
            <div>
              <span class="tit">
                优惠类型:
              </span>
              <a-radio-group
                v-model="form.activityDetailAOS[index].activityType"
              >
                <a-radio :value="1"> 赠送 </a-radio>
                <a-radio :value="2"> 折扣 </a-radio>
                <a-radio :value="3"> 一口价 </a-radio>
              </a-radio-group>
            </div>
            <div v-if="form.activityDetailAOS[index].activityType === 1">
              <span class="tit">
                优惠类型:
              </span>
              <a-space>
                买<a-input-number
                  v-model="form.activityDetailAOS[index].purchaseQuantity"
                  :min="1"
                  :max="1000"
                  :precision="0"
                />
                赠送
                <a-input-number
                  v-model="form.activityDetailAOS[index].giveQuantity"
                  :min="0"
                  :max="1000"
                  :precision="0"
                />
                <a-select
                  v-model="form.activityDetailAOS[index].giveUnit"
                  style="width: 50px"
                >
                  <a-select-option :value="1">月</a-select-option>
                  <a-select-option :value="2">年</a-select-option>
                </a-select>
              </a-space>
            </div>
            <div v-if="form.activityDetailAOS[index].activityType === 2">
              <span class="tit">
                折扣设置:
              </span>
              <a-input-number
                v-model="form.activityDetailAOS[index].discount"
                :min="0"
                :max="10"
                :precision="1"
              />折 <span class="me-status-skip">*只支持小数点后一位</span>
            </div>
            <div v-if="form.activityDetailAOS[index].activityType === 3">
              <span class="tit">
                一口价:
              </span>
              <a-input-number
                v-model="form.activityDetailAOS[index].specialPrice"
                :min="0"
                :precision="0"
              />旺币 <span class="me-status-skip">*只支持整数</span>
            </div>
            <a-button
              v-show="form.activityDetailAOS.length > 1"
              type="link"
              class="me-status-error del"
              @click="delItem(index)"
            >删除</a-button>
          </div>
          <div class="g-tac">
            <span
              class="g-cup"
              @click="addItem()"
            ><a-icon type="plus" />添加优惠套餐</span>
          </div>
        </a-form-model-item>

        <!-- <a-form-model-item label="指定套餐">
          <a-select
            v-model="form.memberSetMealId"
            style="width: 150px"
          >
            <a-select-option
              v-for="item in marketData"
              :key="item.id"
              :value="item.id"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="优惠设置">
          <a-radio-group v-model="form.activityType">
            <a-radio :value="1"> 赠送 </a-radio>
            <a-radio :value="2"> 折扣 </a-radio>
            <a-radio :value="3"> 一口价 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.activityType === 1"
          label=" "
          :colon="false"
        >
          <a-space>
            买<a-input-number
              v-model="form.purchaseQuantity"
              :min="1"
              :max="1000"
              :precision="0"
            />
            赠送
            <a-input-number
              v-model="form.giveQuantity"
              :min="0"
              :max="1000"
              :precision="0"
            />
            <a-select
              v-model="form.giveUnit"
              style="width: 50px"
            >
              <a-select-option :value="1">月</a-select-option>
              <a-select-option :value="2">年</a-select-option>
            </a-select>
          </a-space>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.activityType === 2"
          label=" "
          :colon="false"
        >
          折扣设置
          <a-input-number
            v-model="form.discount"
            :min="0"
            :max="10"
            :precision="1"
          />折 <span class="me-status-skip">*只支持小数点后一位</span>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.activityType === 3"
          label=" "
          :colon="false"
        >
          一口价
          <a-input-number
            v-model="form.specialPrice"
            :min="0"
            :precision="0"
          />旺币 <span class="me-status-skip">*只支持整数</span>
        </a-form-model-item> -->
        <a-form-model-item
          label="活动时间"
          prop="time"
        >
          <a-range-picker
            v-model="form.time"
            format="YYYY-MM-DD"
            :allow-clear="false"
            @change="onTimeChange"
          />
        </a-form-model-item>

        <a-form-model-item label="是否启用">
          <a-radio-group v-model="form.enableStatus">
            <a-radio :value="true"> 启用 </a-radio>
            <a-radio :value="false"> 禁用 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 6, offset: 2 }">
          <a-button
            type="primary"
            @click="onSubmit"
          > 确定 </a-button>
          <a-button
            style="margin-left: 10px"
            @click="golist"
          > 取消 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { debounce, setTableHeight } from '@/utils'
import { cloneDeep } from 'lodash'
import {
  getMemberInfo,
  marketList,
  editMarket,
  getMarketSelect
} from '@/api/usermanage'
import moment from 'moment'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  // memberAccount: ''
}
export default {
  name: 'ApplyStore',
  components: {},
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      moment,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}条`
      },
      tableHeight: 400,
      params: {},
      paginationParams: {
        ...initPagination
      },
      visible: false,
      data: [],
      actionType: '',
      title: '',
      currentObj: {},
      model: 'list',
      form: {
        id: null,
        activityName: '',
        discount: 1, // 几折
        specialPrice: 0, // 一口价
        activityType: 1, // 优惠类型
        memberSetMealId: 2, // 指定套餐id
        time: [],
        iconStyle: 0, // 图标样式
        enableStatus: true,
        giveUnit: 1, // 赠送单位（1：月；2年）
        giveQuantity: 0, // 赠送数
        purchaseQuantity: 1, // 购买数
        activityDetailAOS: [] // 设置集合
      },
      item: {
        memberSetMealId: '2',
        activityType: 1,
        purchaseQuantity: 1,
        giveUnit: 1,
        giveQuantity: 0,
        discount: 1,
        specialPrice: 0
      },
      rules: {
        activityName: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }
        ],
        time: [
          {
            required: true,
            message: '请输入活动时间',
            trigger: 'blur'
          }
        ]
      },
      originData: [],
      marketData: [] // 活动列表
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '账号',
          itemType: 'input',
          key: 'memberAccount',
          itemProp: {
            style: 'width:230px'
          }
        }
      ]
    },
    columns() {
      return [
        {
          title: '活动名称',
          dataIndex: 'activityName',
          scopedSlots: { customRender: 'activityName' }
        },
        {
          title: '指定套餐',
          dataIndex: 'giveUnit',
          scopedSlots: { customRender: 'giveUnit' }
        },
        {
          title: '活动',
          dataIndex: 'activityType',
          scopedSlots: { customRender: 'activityType' }
        },
        {
          title: '活动状态',
          dataIndex: 'enableStatus',
          scopedSlots: { customRender: 'enableStatus' }
        },
        {
          title: '活动时间',
          dataIndex: 'endTime',
          scopedSlots: { customRender: 'endTime' },
          width: 350
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  watch: {
    'form.giveQuantity': {
      handler(val) {
        if (typeof val !== 'number') {
          this.form.giveQuantity = 0
        }
      }
    },
    'form.purchaseQuantity': {
      handler(val) {
        if (typeof val !== 'number') {
          this.form.purchaseQuantity = 1
        }
      }
    },
    'form.specialPrice': {
      handler(val) {
        if (typeof val !== 'number') {
          this.form.specialPrice = 0
        }
      }
    }
  },
  created() {
    this.getList() // 主列表
    this.getMemberList()
    this.getMarketData() // 获取活动列表
    // this.removeItemByIndex()
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    getMarketData() {
      getMarketSelect({}).then((res) => {
        console.log(res)
        this.marketData = res.data
      })
    },
    getMemberList() {
      getMemberInfo({}).then((res) => {
        if (res.data.length) {
          this.originData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    async setTableHeight(e) {
      setTableHeight(this)
    },
    formattime(time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD')
      } else {
        return time
      }
    },
    getStartOrEndTime() {
      const [bindingStartTime, bindingEndTime] =
        this.formModel.bindingTime || []
      const [registeredStartTime, registeredEndTime] =
        this.formModel.registeredTime || []
      return {
        registeredTime: undefined,
        bindingTime: undefined,
        registeredStartTime: this.formattime(registeredStartTime),
        registeredEndTime: this.formattime(registeredEndTime),
        bindingStartTime: this.formattime(bindingStartTime),
        bindingEndTime: this.formattime(bindingEndTime)
      }
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams, // 分页参数
        this.params // 排序参数或者别的
      )
      try {
        const { data } = await marketList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    // 修改单个活动状态
    eidtStatus(record) {
      this.$set(record, '_loading', true)
      editMarket({ id: record.id, enableStatus: !record.enableStatus })
        .then((res) => {
          if (res.code === '0') {
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.$set(record, '_loading', false)
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    onChange(pagination, filters, sorter) {
      this.pagination = { ...pagination }
      const { current, pageSize: size } = pagination
      const { field, order } = sorter
      this.paginationParams = { current, size }
      const orderObj = {
        ascend: 'asc',
        descend: 'desc'
      }
      this.params = {
        field,
        order: orderObj[order]
      }
      this.getList()
    },
    handleEdit(type, record) {
      this.model = type
      this.$refs.ruleForm.resetFields()
      this.form = record
      // this.form.discount = this.form.discount * 10
      this.form.activityDetailAOS.map((ele) => {
        ele.discount = ele.discount * 10
      })
      let time = [record.startTime, record.endTime]
      // this.form.time = time
      this.$set(this.form, 'time', time)
      console.log(record)
    },
    viewContent(record) {
      this.currentObj = record
      this.visible = true
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let startTime = this.form.time[0].split(' ')[0] + ' 00:00:00'
          let endTime = this.form.time[1].split(' ')[0] + ' 23:59:59'
          let formData = cloneDeep(this.form)
          formData.activityDetailAOS.map((ele) => {
            ele.discount = ele.discount / 10
          })
          let params = {
            ...formData,
            startTime,
            endTime
            // discount: this.form.discount / 10
          }
          console.log(params)
          editMarket(params)
            .then((res) => {
              if (res.code === '0') {
                this.model === 'edit'
                  ? this.$message.success('修改成功')
                  : this.$message.success('创建成功')
                this.model = 'list'
                this.resetForm()
                this.getList()
              } else {
                // this.$message.error(res.message)
              }
            })
            .catch((err) => {
              this.$warning({
                okText: '确定',
                title: '提示',
                content: err.message
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.form.discount = 1
      this.form.activityType = 1
      this.form.id = null
    },
    addMarket() {
      this.model = 'add'
      this.resetForm()
      // this.form.item.push(this.items)
      this.$set(this.form, 'activityDetailAOS', [cloneDeep(this.item)])
    },
    onTimeChange(date, dateString) {
      console.log(date, dateString)
      this.$set(this.form, 'time', [dateString[0], dateString[1]])
    },
    golist() {
      this.model = 'list'
      this.getList()
    },
    addItem() {
      let formItem = cloneDeep(this.form.activityDetailAOS)
      formItem.push(cloneDeep(this.item))
      console.log(formItem)
      this.$set(this.form, 'activityDetailAOS', formItem)
    },
    delItem(index) {
      this.form.activityDetailAOS.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .filters {
    padding-bottom: 12px;
  }
  .configline {
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    // border-bottom: 1px solid red;
  }
}
.me-config-infolist {
  ::v-deep .ant-table-tbody > tr > td {
    padding: 0px;
  }
}
.me-merchant-store {
  margin-bottom: 0px;
  min-height: 40px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 8px;
  margin-bottom: -1px;
}
.conline {
  padding: 0px 10px;
}
.box1 {
  width: 80px;
  height: 36px;
  display: inline-block;
  background: #ff4a4a;
  color: #fff;
  text-align: center;
  line-height: 36px;
}
.box2 {
  width: 80px;
  height: 36px;
  display: inline-block;
  background: #fff;
  color: #ff4a4a;
  text-align: center;
  line-height: 34px;
  border: 2px solid #ff4a4a;
}
.formitem {
  background: #efefef;
  padding: 5px 10px;
  margin-bottom: 10px;
  position: relative;
  span.tit {
    width: 100px;
    display: inline-block;
  }
  .del {
    bottom: 0px;
    right: 0px;
    position: absolute;
  }
}
</style>
