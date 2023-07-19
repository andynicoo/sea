<template>
  <a-modal
    :visible="value"
    :width="800"
    :title="title"
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
    />
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { rebateEdit } from '@/api/website'
import moment from 'moment'
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
    }
  },
  data() {
    return {
      title: '编辑',
      formModel: { noticeContent: '' }
    }
  },
  computed: {
    formItem({ noticeTypeOptions }) {
      return [
        {
          itemType: 'editor',
          key: 'noticeContent',
          label: '',
          required: true,
          span: 24
        }
      ]
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.initFormModel()
      }
    }
  },
  async created() {},
  methods: {
    initFormModel() {
      const { data } = this
      this.formModel = {
        noticeContent: data.imgs
      }
    },
    async submit(val) {
      const params = {
        advertisingId: 1000001,
        name: '返利规则',
        advertisingDescribe: '返利规则',
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        imgs: val.noticeContent,
        startTime: moment().format('YYYY-MM-DD HH:mm:ss')
      }

      try {
        console.log(params)
        await rebateEdit(params)

        this.$emit('ok')
        this.$emit('input', false)
      } catch (error) {
        console.error(error)
      }
    },
    ok() {
      this.$refs.searchForm.validate()
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
