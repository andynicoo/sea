<template>
  <a-modal
    :visible="value"
    :width="800"
    :title="title"
    :after-close="afterClose"
    destroy-on-close
    :mask-closable="false"
    @ok="ok"
    @cancel="$emit('input', false)"
  >
    <!-- --{{ formModel }} -->
    <SearchForm
      ref="searchForm"
      form-class="ad-form"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    >
      <!-- <template #selectTime>
        <a-range-picker
          v-model="formModel.selectTime"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </template> -->
      <template #noticeTitle>
        <div style="position: relative">
          <a-input
            v-model="formModel.noticeTitle"
            placeholder="请输入标题"
            :max-length="60"
          />
          <span
            style="position: absolute; right: 5px"
          >{{
            formModel.noticeTitle ? formModel.noticeTitle.length : 0
          }}/60</span>
        </div>
      </template>

      <template #noticePublishType>
        <a-radio-group
          v-model="formModel.noticePublishType"
          :options="noticePublishType"
          @change="change"
        />
        <a-range-picker
          v-model="formModel.selectTime"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          :disabled="formModel.noticePublishType === 1"
        />
        <span
          v-show="
            formModel.noticePublishType === 2 && !formModel.selectTime.length
          "
          style="color: #f5222d"
        >请填写发布时间</span>
      </template>
      <template #noticeFrequency>
        <a-radio-group
          v-model="formModel.noticeFrequency"
          :options="noticeFrequency"
        />
      </template>
      <template #receiveUser>
        <div v-show="formModel.advertisingId !== 17">
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全部
          </a-checkbox>
          <!-- {{ checkedList }} -->
          <a-checkbox-group
            v-model="checkedList"
            @change="onChange"
          >
            <a-checkbox
              v-for="item in allList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </a-checkbox>
          </a-checkbox-group>
          <div
            v-if="checkedList.includes('0')"
            class="selectpath"
            :class="shouqi === true ? 'shouqi' : ''"
          >
            选择渠道：
            <a-checkbox
              v-model="forwarderCheckAll"
              @change="forwarderCheckAllChange"
            >
              全部
            </a-checkbox>
            <a-checkbox-group
              v-model="forwarderCheckedList"
              @change="onChange2"
            >
              <a-checkbox
                v-for="item in forwarderList"
                :key="item.id"
                :value="item.id"
                class="checkboxwidth"
              >
                <span :title="item.forwarderName">{{
                  item.forwarderName
                }}</span>
              </a-checkbox>
            </a-checkbox-group>

            <div class="icons">
              <span
                v-if="shouqi === true && forwarderList.length > 6"
                @click="shouqi = false"
              >展开<a-icon
                type="down"
              /></span>
              <span
                v-if="shouqi === false && forwarderList.length > 6"
                @click="shouqi = true"
              >收起<a-icon
                type="up"
              /></span>
            </div>
          </div>
        </div>
        <div v-show="formModel.advertisingId === 17">不可选</div>
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { messageAdd, messageEdit } from '@/api/website'
import { getForwarderList } from '@/api/usermanage'
import { uniq } from 'lodash'
const initFormModel = {
  noticePublishType: 1,
  status: true,
  selectPath: '',
  selectTime: [],
  noticeFrequency: 1
}
const type = 2
export default {
  name: 'AdModel',
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    actionType: {
      type: String,
      default: ''
    },
    advertisingSelect: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '新增消息通知',
      formModel: { ...initFormModel },
      filesList: [],
      allList: [
        { name: '自然用户', id: '-1' },
        { name: '货代商渠道用户', id: '0' }
      ],
      noticeTypeOptions: [
        {
          label: '更新通知',
          value: 1
        },
        {
          label: '活动通知',
          value: 2
        },
        {
          label: '其他通知',
          value: 3
        }
      ],
      noticePublishType: [
        {
          label: '立即发布',
          value: 1
        },
        {
          label: '定时发布',
          value: 2
        }
      ],
      noticeFrequency: [
        {
          label: '发布后仅弹一次',
          value: 1
        },
        {
          label: '每次登录时弹出',
          value: 2
        },
        {
          label: '每次刷新时弹出',
          value: 3
        }
      ],
      checkedList: ['-1', '0'],
      indeterminate: true,
      checkAll: false,
      plainOptions: ['-1', '0'],

      forwarderList: [], // 货代商列表
      forwarderCheckedList: [],
      // forwarderIndeterminate: true,
      forwarderCheckAll: false,
      forwarderPlainOptions: [],
      shouqi: false
    }
  },
  computed: {
    formItem({ noticeTypeOptions }) {
      return [
        {
          title: '消息配置 ',
          span: 24
        },
        {
          label: '通知类型',
          itemType: 'select',
          itemData: noticeTypeOptions,
          required: true,
          itemProp: {
            style: 'width:250px'
          },
          key: 'noticeType',
          span: 24
        },
        // {
        //   label: '标题',
        //   itemType: 'input',
        //   itemProp: {
        //     style: 'width:550px'
        //   },
        //   key: 'noticeTitle',
        //   span: 24,
        //   required: true
        // },
        {
          label: '标题',
          slotName: 'noticeTitle',
          key: 'noticeTitle',
          span: 24,
          required: true
        },
        {
          itemType: 'editor',
          key: 'noticeContent',
          label: '编辑消息',
          required: true,
          span: 24
          // slotName: 'content'
        },
        // {
        //   label: '广告显示',
        //   itemType: 'switch',
        //   key: 'status',
        //   span: 24
        // },
        {
          title: '发布设置 ',
          span: 24
        },
        {
          label: '发布时间',
          slotName: 'noticePublishType',
          key: 'noticePublishType',
          span: 24
        },
        {
          label: '弹窗频率',
          slotName: 'noticeFrequency',
          key: 'noticeFrequency',
          span: 24
        },
        {
          label: '接收用户',
          key: 'receiveUser',
          span: 24,
          slotName: 'receiveUser'
        }
      ]
    }
  },
  watch: {
    value(val) {
      if (this.actionType === 'edit' && val) {
        this.initFormModel()
        this.title = '编辑消息通知'
      } else {
        this.title = '新增消息通知'
      }
      // 判断选择渠道的checkbox是否check
      this.arrayIncludes(this.forwarderCheckedList, this.forwarderPlainOptions)
        ? (this.forwarderCheckAll = true)
        : (this.forwarderCheckAll = false)
    }
  },
  async created() {
    await this.getList()
    //  checkAll 全选，为true
    // indeterminate,部分选，为true
    this.checkedList.length === 2
      ? (this.checkAll = true)
      : (this.checkAll = false)

    this.checkedList.length === 2 || this.checkedList.length === 0
      ? (this.indeterminate = false)
      : (this.indeterminate = true)
  },
  methods: {
    // 获取货代商列表
    async getList() {
      const params = {
        current: 1,
        size: 100
      }
      try {
        const { data } = await getForwarderList(params)
        this.forwarderList = data?.records || []
        let plainOptions = []
        this.forwarderList.map((ele) => {
          plainOptions.push(ele.id)
        })
        this.forwarderPlainOptions = plainOptions
      } catch (error) {
        console.error(error)
      }
    },
    initFormModel() {
      const { data } = this
      this.formModel = {
        id: data.id,
        noticeType: data.noticeType,
        noticeTitle: data.noticeTitle,
        noticeFrequency: data.noticeFrequency,
        noticePublishType: data.noticePublishType,
        advertisingId: data.advertisingId,
        noticeContent: data.noticeContent,
        status: !!data.status,
        // startTime: data.startTime,
        // endTime: data.endTime,
        selectTime:
          data.noticePublishType === 1 ? [] : [data.publishTime, data.endTime],
        receiveUser: data.receiveUser
      }
      this.forwarderCheckedList = data.receiveUser?.split(',') || []

      // this.filesList = [{ url: data.imgs }]
    },
    async submit(val) {
      // 拼接时间，接收用户
      let allUser = this.checkedList.concat(this.forwarderCheckedList)
      allUser = uniq(allUser)
      if (!this.checkedList.includes('0')) {
        allUser = allUser.filter((ele) => ele !== '0')
      }
      if (!this.checkedList.includes('-1')) {
        allUser = allUser.filter((ele) => ele !== '-1')
      }
      const selectTime = {
        publishTime: val.selectTime ? val.selectTime[0] : '',
        endTime: val.selectTime ? val.selectTime[1] : '',
        receiveUser: this.checkedList.includes('0')
          ? allUser.join(',')
          : this.checkedList.join(','),
        noticeFrom: 'MG',
        recPlatform: ['ERP']
      }
      const params = {
        ...val,
        type,
        ...selectTime
      }
      console.log(params)
      try {
        if (this.actionType === 'edit') {
          await messageEdit(params)
        } else {
          await messageAdd(params)
        }
        this.$emit('ok')
        this.$emit('input', false)
      } catch (error) {
        console.error(error)
      }
    },
    ok() {
      this.$refs.searchForm.validate()
    },
    afterClose() {
      this.$refs.searchForm.resetForm()
      this.formModel = { ...initFormModel }
      this.forwarderCheckedList = []
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length &&
        checkedList.length < this.$data.plainOptions.length
      this.checkAll = checkedList.length === this.$data.plainOptions.length
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.$data.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    onChange2(forwarderCheckedList) {
      // forwarderCheckAll
      this.forwarderCheckedList.length === this.forwarderPlainOptions.length
        ? (this.forwarderCheckAll = true)
        : (this.forwarderCheckAll = false)
    },
    forwarderCheckAllChange(e) {
      let isCheck = e.target.checked
      isCheck
        ? (this.forwarderCheckedList = this.forwarderPlainOptions)
        : (this.forwarderCheckedList = [])
      console.log(e.target.checked)
    },
    arrayIncludes(arr1, arr2) {
      return arr2.every((val) => arr1.includes(val))
    },
    change(e) {}
  }
}
</script>

<style lang="less" scoped>
.ad-form {
  /deep/.ant-form-item-label {
    min-width: 80px;
  }
}
.selectpath {
  background: #fafafa;
  padding: 0px 10px;
  position: relative;
  // height: 0px;
  // overflow: hidden;
  .icons {
    position: absolute;
    right: 3px;
    bottom: 0px;
    cursor: pointer;
  }
}
.shouqi {
  height: 65px;
  overflow: hidden;
}
.checkboxwidth {
  width: 100px;
  margin-left: 0px;
  span {
    width: 68px;
    overflow: hidden;
    height: 25px;
    line-height: 25px;
    display: inline-flex;
  }
}
</style>
