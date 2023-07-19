<template>
  <div
    ref="container"
    class="all-user wrapper"
  >
    <div class="tabs">
      <a-tabs
        v-model="activeKey"
        @change="callback"
      >
        <a-tab-pane
          v-for="(item,index) in tabsData"
          :key="index+1"
          :tab="`${item.name+getUnit(item.unit)}`"
        />
      </a-tabs>
    </div>
    <!-- {{ originData }} -->

    <div class="vipcontent">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        row-key="memberSetMealConfigInfoId"
      >
        <span
          slot="unit"
          slot-scope="text, record"
        >
          <a-button
            v-if="record.isEnable"
            type="link"
          >
            启用中
          </a-button>
          <a-button
            v-else
            type="link"
            class="me-skip"
          >未启用</a-button>
        </span>
        <span
          slot="limitCount"
          slot-scope="text, record"
        >
          {{ record.limitCount === 0 ? record.name==='聊聊工具'?'独立付费': '不限制' : record.limitCount }}
        </span>
        <span
          slot="operate"
          slot-scope="text, record"
        >
          <a-space>
            <a-button
              type="link"
              :disabled="record.name==='聊聊工具'"
              @click="editConfig(record)"
            >
              修改参数
            </a-button>
            <!-- <a-button
              v-if="!record.isEnable"
              type="link"
              @click="editStatus(record)"
            >启用</a-button>
            <a-button
              v-else
              type="link"
              @click="editStatus(record)"
            >禁用</a-button> -->
          </a-space>
        </span>
      </a-table>

      <a-modal
        v-model="visible"
        :title="curKey + '设置'"
        @ok="handleOk"
      >
        <a-form
          :form="form"
          :label-col="{ span: 10 }"
          :wrapper-col="{ span: 10 }"
        >
          <a-form-item :label="curKey">
            <a-space align="end">
              <a-icon
                v-show="curKey === '子账户数'"
                type="minus-circle"
                :style="{ fontSize: '20px' }"
                @click="minusAcc"
              />
              <a-input
                v-decorator="[
                  curKey,
                  {
                    rules: [
                      { required: true, message: '请输入正确的数字' },
                      {
                        pattern: /^\d+$/,
                        message: '请输入正确的数字'
                      }
                    ]
                  }
                ]"
                style="width:100px"
                :suffix="curItem.unit==='不限制'||curItem.unit==='独立付费'?'':curItem.unit"
              />
              <a-icon
                v-show="curKey === '子账户数'"
                type="plus-circle"
                :style="{ fontSize: '20px' }"
                @click="plusAcc"
              />
              <span v-show="curKey != '子账户数'">
                <span v-show="hasTian.includes(curKey)">/每天</span> /用户</span>
            </a-space>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
// import SearchForm from '@/components/searchForm'
import { download, debounce, setTableHeight } from '@/utils/index'
import { getMemberInfo, memberInfoSaveOrUpdate } from '@/api/usermanage'
const initPagination = {
  current: 1,
  size: 20
}
let unitType = {
  'MONTH': '月',
  'SEASON': '季',
  'HALFYEAR': '半年',
  'YEAR': '年'
}
export default {
  name: 'Alluser',
  components: {},
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      pagination: {
        current: 1,
        pageSize: 100
      },
      activeKey: 1,
      // 原始所有vip等级信息
      originData: [],
      // 处理后当前vip等级信息
      dataSource: [],
      columns: [
        {
          dataIndex: 'memberSetMealConfigInfoId',
          key: 'memberSetMealConfigInfoId',
          title: '功能ID',
          width: 100
        },
        {
          scopedSlots: { customRender: 'name' },
          dataIndex: 'name',
          title: '功能名称',
          width: 250
        },
        {
          scopedSlots: { customRender: 'limitCount' },
          dataIndex: 'limitCount',
          title: '参数配置',
          width: 250
        },
        {
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
          title: '参数配置',
          width: 180
        },
        {
          key: 'operate',
          scopedSlots: { customRender: 'operate' },
          title: '操作'
        }
      ],
      visible: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      curKey: '',
      curValue: '',
      curItem: {},
      hasTian: [
        '图片翻译',
        '已绑定店铺商品采集',
        '未绑定店铺商品采集',
        '商品刊登',
        '在线修图'
      ],
      unitType,
      tabsData: [] // 头部tabs切换数据
    }
  },
  computed: {},
  created() {
    this.getMemberList()
  },
  mounted() {
    // this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    getMemberList() {
      getMemberInfo({}).then((res) => {
        if (res.data.length) {
          this.originData = res.data
          this.dataSource = res.data[Number(this.activeKey) - 1]?.configInfoList

          this.originData.map(item => {
            this.$data.tabsData.push({name: item.name, unit: item.unit})
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    callback(key) {
      this.dataSource = this.originData[key - 1]?.configInfoList
    },
    buildData(index) {
      const originData = this.$data.originData
      const curData = originData[index].configInfoList
      if (curData.length) {
        this.dataSource = curData
      }
      console.log(curData)
    },
    editConfig(record) {
      console.log(record)
      this.curKey = record.name
      this.curValue = record.limitCount
      this.curItem = record
      this.visible = true
      setTimeout(() => {
        this.$data.form.setFieldsValue({ [record.name]: record.limitCount })
      }, 100)
    },
    editStatus(record) {
      const params = {
        memberSetMealConfigInfoId: record.memberSetMealConfigInfoId,
        isEnable: !record.isEnable,
        limitCount: record.limitCount
      }
      memberInfoSaveOrUpdate(params).then((res) => {
        if (Number(res.code) === 0) {
          this.$message.success('修改成功')
          this.$set(record, 'isEnable', !record.isEnable)
          // this.$set(node, 'checked', false)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let config = this.$data.form.getFieldsValue()
          console.log(config[this.curKey])
          const params = {
            memberSetMealConfigInfoId: this.curItem.memberSetMealConfigInfoId,
            isEnable: this.curItem.isEnable,
            limitCount: Number(config[this.curKey])
          }
          memberInfoSaveOrUpdate(params).then((res) => {
            if (Number(res.code) === 0) {
              this.$message.success('修改成功')
              this.getMemberList()
              this.visible = false
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    plusAcc() {
      let config = this.$data.form.getFieldsValue()
      var value = config[this.curKey]
      this.form.setFieldsValue({
        '子账户数': value + 1
      })
    },
    minusAcc() {
      let config = this.$data.form.getFieldsValue()
      var value = config[this.curKey]
      if (value === 0) {
        return
      }
      this.form.setFieldsValue({
        '子账户数': value - 1
      })
    },
    getUnit(unit) {
      if (unit) {
        return '/' + this.$data.unitType[unit]
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.all-user {
  padding: 16px;
  padding-top: 20px;
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .edit {
    color: #f7622f;
    cursor: pointer;
  }
  .link {
    color: #f7622f;
    cursor: pointer;
  }
  .me-skip {
    color: #a8a8b3 !important;
  }
}
</style>
