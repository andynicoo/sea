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
      <template #adImg>
        <UploadImg
          :files-list="filesList"
          tips="建议190*120px"
          @change="change"
        />
      </template>
      <template #selectTime>
        <a-range-picker
          v-model="formModel.selectTime"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
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
import UploadImg from '@/components/uploadImg'
import { advertisingEdit, advertisingAdd } from '@/api/website'
import { getForwarderList } from '@/api/usermanage'
import { uniq } from 'lodash'
const initFormModel = {
  imgs: null,
  status: true,
  selectPath: ''
}
const type = 2
export default {
  name: 'AdModel',
  components: {
    SearchForm,
    UploadImg
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
      title: '新增广告',
      formModel: { ...initFormModel },
      filesList: [],
      allList: [
        { name: '自然用户', id: '-1' },
        { name: '货代商渠道用户', id: '0' }
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
    formItem({ advertisingSelect }) {
      return [
        {
          title: '广告位配置 ',
          span: 24
        },
        {
          label: '广告名称',
          itemType: 'input',
          itemProp: {
            style: 'width:250px'
          },
          key: 'name',
          span: 24,
          required: true
        },
        {
          label: '广告链接',
          itemType: 'input',
          // rules: [{
          //   pattern: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
          //   message: '请输入合法的链接'
          // }],
          itemProp: {
            style: 'width:250px'
          },
          key: 'link',
          span: 24
        },
        {
          label: '广告位',
          itemType: 'select',
          itemData: advertisingSelect,
          required: true,
          itemProp: {
            style: 'width:250px'
          },
          key: 'advertisingId',
          span: 24
        },
        {
          label: '排序',
          itemType: 'number',
          itemProp: {
            style: 'width:250px'
          },
          key: 'sort',
          span: 24
        },
        {
          label: '广告图',
          key: 'imgs',
          span: 24,
          required: true,
          slotName: 'adImg'
        },
        // {
        //   label: '广告描述',
        //   itemType: 'input',
        //   required: true,
        //   itemProp: {
        //     style: 'width:250px'
        //   },
        //   key: 'advertisingDescribe',
        //   span: 24
        // },
        // {
        //   label: '广告显示',
        //   itemType: 'switch',
        //   key: 'status',
        //   span: 24
        // },
        {
          title: '基础信息 ',
          span: 24
        },
        {
          label: '定时发布',
          slotName: 'selectTime',
          key: 'selectTime',
          span: 24,
          required: true
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
        this.title = '编辑广告'
      } else {
        this.title = '新增广告'
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
        name: data.name,
        imgs: data.imgs,
        link: data.link,
        sort: data.sort,
        advertisingId: data.advertisingId,
        advertisingDescribe: data.advertisingDescribe,
        status: !!data.status,
        // startTime: data.startTime,
        // endTime: data.endTime,
        selectTime: [data.startTime, data.endTime],
        receiveUser: data.receiveUser
      }
      this.forwarderCheckedList = data.receiveUser?.split(',') || []

      this.filesList = [{ url: data.imgs }]
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
        startTime: val.selectTime[0],
        endTime: val.selectTime[1],
        receiveUser: this.checkedList.includes('0')
          ? allUser.join(',')
          : this.checkedList.join(',')
      }
      const params = {
        ...val,
        type,
        ...selectTime
      }
      try {
        if (this.actionType === 'edit') {
          await advertisingEdit(params)
        } else {
          await advertisingAdd(params)
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
      this.filesList = []
      this.forwarderCheckedList = []
    },
    change(list = []) {
      this.formModel.imgs = list && list.map((item) => item.url).join()
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
    // onCheckAllChange2(e) {
    //   Object.assign(this, {
    //     forwarderCheckedList: e.target.checked
    //       ? this.$data.forwarderPlainOptions
    //       : [],
    //     forwarderIndeterminate: false,
    //     forwarderCheckAll: e.target.checked
    //   })
    // },
    forwarderCheckAllChange(e) {
      let isCheck = e.target.checked
      isCheck
        ? (this.forwarderCheckedList = this.forwarderPlainOptions)
        : (this.forwarderCheckedList = [])
      console.log(e.target.checked)
    },
    arrayIncludes(arr1, arr2) {
      return arr2.every((val) => arr1.includes(val))
    }
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
