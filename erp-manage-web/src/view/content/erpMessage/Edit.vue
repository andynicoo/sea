<template>
  <div class="news-edit wrapper">
    <div class="title">{{ title }}</div>
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      form-class="news-form"
      @submit="submit"
    >
      <template #time>
        <TimeSelect
          v-model="formModel.time"
          :valid-list="validList"
          :min-time="minTime"
          :max-time="maxTime"
        />
      </template>
      <template #submit>
        <div class="button-group">
          <a-button type="primary" @click="$refs.searchForm.validate()">确认</a-button>
        </div>
      </template>
    </SearchForm>
  </div>
</template>

<script>
import SearchForm from '@/components/searchForm'
import TimeSelect from './components/TimeSelect'
import { erpMessageAdd, erpMessageDetail, erpMessageEdit, erpMessageAllList } from '@/api/contentManage'
import moment from 'moment'
import { checkTime } from './common'
const initFormModel = {
  status: true,
  title: '',
  time: {
    startTime: undefined,
    startDate: undefined,
    endTime: undefined,
    endDate: undefined
  },
  content: ''
}
export default {
  name: 'NewsEdit',
  components: {
    SearchForm,
    TimeSelect
  },
  data() {
    return {
      title: '发布站内信息',
      formModel: { ...initFormModel },
      validList: [],
      minTime: 0,
      maxTime: 0
    }
  },
  computed: {
    formItem() {
      return [
        {
          label: '标题',
          itemType: 'input',
          required: true,
          span: 24,
          key: 'title',
          itemProp: {
            style: {
              'min-width': '230px',
              'max-width': '50%'
            },
            maxLength: 20
          }

        },
        {
          label: '正文内容',
          itemType: 'editor',
          key: 'content',
          rules: [{ required: true, message: '请输入正文内容' }],
          span: 24
        },
        {
          label: '发布时间段',
          itemType: 'rangePicker',
          slotName: 'time',
          rules: [{ required: true, validator: this.timeValidator }],
          key: 'time',
          span: 24
        },
        {
          label: '启用状态',
          itemType: 'switch',
          key: 'status',
          span: 24
        },
        {
          span: 24,
          slotName: 'submit'
        }
      ]
    }
  },
  created() {
    this.erpMessageAllList()
    if (this.$route.params.id) {
      this.title = '编辑站内信息'
      this.getNewsDetail()
    }
  },
  methods: {
    initFormModel(data = {}) {
      this.formModel = {
        id: data.id,
        title: data.title,
        content: data.content,
        status: !!data.status,
        time: {
          startTime: data.startTime ? moment(data.startTime).format('HH:mm') : undefined,
          endTime: data.endTime ? moment(data.endTime).format('HH:mm') : undefined,
          startDate: data.startTime ? moment(data.startTime).format('YYYY-MM-DD') : undefined,
          endDate: data.endTime ? moment(data.endTime).format('YYYY-MM-DD') : undefined
        }
      }
    },
    async erpMessageAllList() {
      try {
        const { data } = await erpMessageAllList()
        const id = this.$route.params.id
        if (id) {
          this.validList = data && data.filter(item => item.id !== +id)
        } else {
          this.validList = data || []
        }
        this.calcMinOrMaxTime(this.validList)
      } catch (error) {
        console.error(error)
      }
    },
    calcMinOrMaxTime(list) {
      let startTimeArr = list.map(item => moment(item.startTime).valueOf())
      let endTimeArr = list.map(item => moment(item.endTime).valueOf())
      this.minTime = Math.min(...startTimeArr)
      this.maxTime = Math.max(...endTimeArr)
    },
    async getNewsDetail() {
      try {
        const { data = {}} = await erpMessageDetail({ id: this.$route.params.id })
        this.initFormModel(data)
      } catch (error) {
        console.error(error)
      }
    },
    formatTime(val) {
      let { startTime, startDate, endTime, endDate } = val
      return {
        time: undefined,
        startTime: `${startDate} ${startTime}`,
        endTime: `${endDate} ${endTime}`
      }
    },
    async submit(val) {
      const params = {
        ...val,
        status: val.status,
        ...this.formatTime(val.time)
      }
      try {
        if (this.$route.params.id) {
          await erpMessageEdit(params)
        } else {
          await erpMessageAdd(params)
        }
        this.$message.success(`${this.$route.params.id ? '编辑' : '添加'}成功`)
        this.$router.push({ path: '/content/erp-message' })
      } catch (error) {
        console.error(error)
      }
    },
    timeValidator(rule, value, callback) {
      let mapArr = Object.entries(value)
      //   都有值的时候
      if (mapArr.length > 3 && mapArr.every(([key, val]) => val)) {
        let start = moment(`${value.startDate} ${value.startTime}`).valueOf()
        let end = moment(`${value.endDate} ${value.endTime}`).valueOf()
        if (start >= end) {
          callback('开始时间不能大于结束时间')
        } else if (checkTime(start, end, this.validList)) {
          callback('跟原有时间段区间有重合')
        }
        callback()
      } else {
        callback('请选择发布时间段')
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      to.meta.title = '编辑站内信息'
    } else {
      to.meta.title = '发布站内信息'
    }
    next()
  }
}
</script>

<style lang="less" scoped>
.news-edit {
  padding: 0 16px;
  .title {
    height: 59px;
    line-height: 59px;
    margin: 0 -16px;
    margin-bottom: 24px;
    padding: 0 16px;
    border-bottom: 1px solid #e9e9e9;
  }
  .button-group{
    display: flex;
    justify-content: flex-end;
  }
}
.news-form {
  /deep/ .ant-form-item-label {
    min-width: 94px;
  }
}
</style>
