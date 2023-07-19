<template>
  <div>
    <div>
      <span class="g-mr10">用户标签:</span>
      <a-checkbox
        :indeterminate="indeterminate"
        :checked="checkAll"
        @change="onCheckAllChange"
      >
        全选
      </a-checkbox>

      <a-checkbox-group
        v-model="checkedList"
        class="g-mb10"
        @change="onChange"
      >
        <a-checkbox
          v-for="item in plainOptions"
          :key="item.memberLabelId"
          :value="item"
        >
          {{ item.memberLabelName }}
        </a-checkbox>
      </a-checkbox-group>
    </div>
    <div style="height: 40px;">
      <a-space class="me-fr">
        <a-button
          type="primary"
          @click="tagsListVisible = true"
        >
          用户标签管理
        </a-button>
        <a-button
          type="primary"
          @click="openModel"
        >
          创建标签
        </a-button>
      </a-space>
    </div>

    <a-modal
      v-model="addVisible"
      :title="editType === 'add' ? '创建标签' : '修改标签'"
      :closable="true"
      width="900px"
      :confirm-loading="submiting"
      :mask-closable="false"
      destroy-on-close
      @ok="submit"
      @cancel="closeTagsForm"
    >
      <!-- {{ editType }}---{{ form }} -->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="标签名称"
          prop="memberLabelName"
        >
          <a-input
            v-model="form.memberLabelName"
            class="me-w400"
            :suffix="
              (form.memberLabelName ? form.memberLabelName.length : '0') + '/10'
            "
          />
        </a-form-model-item>
        <a-form-model-item
          label="查询条件"
          prop="orderMax"
        >
          <div>
            <a-space>
              <a-checkbox v-model="checkBox[0]" />
              订单量
              <a-input
                v-model="form.orderMin"
                v-enterIntNumber
                class="me-w60"
                placeholder="0"
              />~<a-input
                v-model="form.orderMax"
                v-enterIntNumber
                class="me-w60"
                placeholder="100"
              />单
              <timeSection
                :name="'order'"
                :type="form.orderType"
                :time-value="[form.orderStartTime, form.orderEndTime]"
                @changeTime="changeTime"
              />
            </a-space>
          </div>
          <div>
            <a-space>
              <a-checkbox v-model="checkBox[1]" />
              登录次数
              <a-input
                v-model="form.loginMin"
                v-enterIntNumber
                class="me-w60"
                placeholder="0"
              />~<a-input
                v-model="form.loginMax"
                v-enterIntNumber
                class="me-w60"
                placeholder="100"
              />次
              <timeSection
                :name="'login'"
                :type="form.loginType"
                :time-value="[form.loginStartTime, form.loginEndTime]"
                @changeTime="changeTime"
              />
            </a-space>
          </div>
          <div>
            <a-space>
              <a-checkbox v-model="checkBox[2]" />
              会员购买次数
              <a-input
                v-model="form.setMealBuyMin"
                v-enterIntNumber
                class="me-w60"
                placeholder="0"
              />~<a-input
                v-model="form.setMealBuyMax"
                v-enterIntNumber
                class="me-w60"
                placeholder="100"
              />次
              <timeSection
                :name="'setMealBuy'"
                :type="form.setMealBuyType"
                :time-value="[form.setMealBuyStartTime, form.setMealBuyEndTime]"
                @changeTime="changeTime"
              />
            </a-space>
          </div>
          <div>
            <a-space>
              <a-checkbox v-model="checkBox[3]" />
              复购
              <timeSection
                :name="'repurchase'"
                :type="form.repurchaseType"
                :time-value="[form.repurchaseStartTime, form.repurchaseEndTime]"
                @changeTime="changeTime"
              />
            </a-space>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="tagsListVisible"
      title="用户标签管理"
      :closable="true"
      destroy-on-close
      width="900px"
      :mask-closable="false"
      :footer="null"
    >
      <TagsList
        @getTagsObj="getTagsObj"
        @asyncList="asyncList"
      />
      <div>
        <a-button
          type="primary"
          class="me-fl"
          icon="plus"
          @click="
            ;(tagsListVisible = false), openModel()
            editType = 'add'
          "
        >
          新增标签
        </a-button>
        <a-button
          type="primary"
          class="me-fr"
          @click="tagsListVisible = false"
        >
          关闭
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
const timeSectionData = [
  { label: '近7天', value: 7, type: 1 },
  { label: '近15天', value: 15, type: 2 },
  { label: '近1月', value: 30, type: 3 },
  { label: '近1季度', value: 90, type: 4 },
  { label: '近1年', value: 365, type: 5 },
  { label: '自定义时间', value: 'user', type: 6 }
]

import timeSection from '@/components/timeSection'
import TagsList from './TagsList'
import { addUserTags, eidtUserTags, getUserTagsList } from '@/api/usermanage'
const intiForm = {
  memberLabelName: '',
  // 订单相关
  orderMax: '',
  orderMin: '',
  orderStartTime: '',
  orderEndTime: '',
  orderType: 1,
  // 登录相关
  loginMax: null,
  loginMin: null,
  loginStartTime: '',
  loginEndTime: '',
  loginType: 1,
  // 会员购买相关
  setMealBuyMax: null,
  setMealBuyMin: null,
  setMealBuyStartTime: '',
  setMealBuyEndTime: '',
  setMealBuyType: 1,
  // 复购相关
  repurchaseStartTime: '',
  repurchaseEndTime: '',
  repurchaseType: 1
}
export default {
  provide: {
    for: timeSectionData
  },
  components: {
    timeSection,
    TagsList
  },
  data() {
    return {
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      editType: 'add',
      addVisible: false,
      submiting: false,
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      rules: {
        memberLabelName: [
          {
            required: true,
            message: '请输入标签名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '不超过10个字符',
            trigger: 'blur'
          }
        ],
        orderMax: [{ validator: this.checkTerm }]
      },
      checkBox: [false, false, false, false],
      form: {
        ...intiForm
      },
      tagsListVisible: false
    }
  },
  mounted() {
    this.getTagsList()
  },
  methods: {
    // 勾选的标签ids传入上级组件
    getTagsId() {
      let { checkedList } = this.$data
      let ids = []
      checkedList.map((ele) => {
        ids.push(ele.memberLabelId)
      })
      this.$emit('getTagsId', ids)
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.plainOptions.length
      this.checkAll = checkedList.length === this.plainOptions.length

      this.getTagsId()
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })

      this.getTagsId()
    },
    openModel() {
      console.log(intiForm)
      this.editType = 'add'
      this.form = intiForm
      this.addVisible = true
      //   this.resetForm()
    },
    async getTagsList() {
      let res = await getUserTagsList({})
      this.$data.plainOptions = res.data
    },
    changeTime(data) {
      let { time, name, type } = data
      let name1 = name + 'StartTime'
      let name2 = name + 'EndTime'
      let type1 = name + 'Type'
      if (time.length) {
        this.form[name1] = time[0]
        this.form[name2] = time[1]
      } else {
        this.form[name1] = ''
        this.form[name2] = ''
      }
      this.form[type1] = type
    },
    checkTerm(rule, value, callback) {
      let { checkBox } = this.$data
      let checkLength = checkBox.filter((ele) => ele).length
      let tempForm = this.$data.form

      let {
        orderMax,
        orderMin,
        loginMax,
        loginMin,
        setMealBuyMax,
        setMealBuyMin
      } = tempForm

      if (!checkLength) {
        callback('请勾选至少一个查询条件')
      }
      let check1 = checkBox[0]
      let check2 = checkBox[1]
      let check3 = checkBox[2]
      if (
        check1 &&
        orderMin &&
        orderMax &&
        Number(orderMax) < Number(orderMin)
      ) {
        callback('订单数范围有误')
      }
      if (
        check2 &&
        loginMin &&
        loginMax &&
        Number(loginMax) < Number(loginMin)
      ) {
        callback('登录次数范围有误')
      }
      if (
        check3 &&
        setMealBuyMin &&
        setMealBuyMax &&
        Number(setMealBuyMax) < Number(setMealBuyMin)
      ) {
        callback('会员购买数范围有误')
      }

      callback()
    },
    submit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let { checkBox } = this.$data
          // 只提交勾选的选项。。
          let check1 = checkBox[0]
          let check2 = checkBox[1]
          let check3 = checkBox[2]
          let check4 = checkBox[3]
          let {
            memberLabelId,
            memberLabelName,
            orderMax,
            orderMin,
            orderType,
            orderStartTime,
            orderEndTime,
            loginMax,
            loginMin,
            loginType,
            loginStartTime,
            loginEndTime,
            setMealBuyMax,
            setMealBuyMin,
            setMealBuyType,
            setMealBuyStartTime,
            setMealBuyEndTime,
            repurchaseType,
            repurchaseStartTime,
            repurchaseEndTime
          } = this.$data.form
          let params = {}
          params.memberLabelName = memberLabelName
          this.editType === 'add' ? '' : (params.memberLabelId = memberLabelId)
          if (check1) {
            params.orderMax = orderMax
            params.orderMin = orderMin
            params.orderType = orderType
            params.orderStartTime = orderStartTime
            params.orderEndTime = orderEndTime
          }
          if (check2) {
            params.loginMax = loginMax
            params.loginMin = loginMin
            params.loginType = loginType
            params.loginStartTime = loginStartTime
            params.loginEndTime = loginEndTime
          }
          if (check3) {
            params.setMealBuyMax = setMealBuyMax
            params.setMealBuyMin = setMealBuyMin
            params.setMealBuyType = setMealBuyType
            params.setMealBuyStartTime = setMealBuyStartTime
            params.setMealBuyEndTime = setMealBuyEndTime
          }
          if (check4) {
            params.repurchaseStartTime = repurchaseStartTime
            params.repurchaseEndTime = repurchaseEndTime
            params.repurchaseType = repurchaseType
          }
          this.submiting = true
          if (this.editType === 'add') {
            addUserTags(params)
              .then((res) => {
                console.log(res)
                let { code, message } = res
                if (code === '0') {
                  this.$message.success('创建成功')
                  this.closeTagsForm()
                  //  刷新用户标签数量
                  this.getTagsList()
                } else if (message) {
                  this.$message.error(message)
                }
              })
              .finally(() => {
                this.submiting = false
              })
          } else {
            eidtUserTags(params)
              .then((res) => {
                console.log(res)
                let { code, message } = res
                if (code === '0') {
                  this.$message.success('编辑成功')
                  this.closeTagsForm()
                  //  刷新用户标签数量
                  this.getTagsList()
                } else if (message) {
                  this.$message.error(message)
                }
              })
              .finally(() => {
                this.submiting = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeTagsForm() {
      this.$refs.ruleForm.resetFields()
      this.$data.checkBox = [false, false, false, false]
      this.addVisible = false
    },

    asyncList() {
      //  刷新用户标签数量
      this.getTagsList()
    },

    getTagsObj(item) {
      this.editType = 'edit'
      // 根据列表回传的obj数据，回填边框form,查询条件有数据的，勾选前面的checkbox
      console.log(item)
      this.addVisible = true
      let { obj } = item
      this.form = obj
      let {
        orderMax,
        orderMin,
        orderStartTime,
        loginMax,
        loginMin,
        loginStartTime,
        setMealBuyMax,
        setMealBuyMin,
        setMealBuyStartTime,
        repurchaseStartTime
      } = this.form
      // min,max有值或等于0，都回填勾选
      if (orderMax || orderMin || orderStartTime || orderMax === 0 || orderMin === 0) {
        this.$data.checkBox[0] = true
      }
      if (loginMax || loginMin || loginStartTime || loginMax === 0 || loginMin === 0) {
        this.$data.checkBox[1] = true
      }
      if (setMealBuyMax || setMealBuyMin || setMealBuyStartTime || setMealBuyMax === 0 || setMealBuyMin === 0) {
        this.$data.checkBox[2] = true
      }
      if (repurchaseStartTime) {
        this.$data.checkBox[3] = true
      }

      this.tagsListVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.radioStyle {
  display: block;
  height: 30px;
  line-height: 30px;
}
.me-w60 {
  width: 60px;
}
.me-w400 {
  width: 400px;
}
</style>
