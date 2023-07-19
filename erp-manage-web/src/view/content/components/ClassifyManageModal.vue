<template>
  <a-modal
    :visible="value"
    title="分类管理"
    :width="910"
    :after-close="afterClose"
    :closable="false"
  >
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    >
      <template #button>
        <a-button type="primary" @click="$refs.searchForm.validate()">添加</a-button>
      </template>
    </SearchForm>
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="dataList"
      row-key="classifyId"
    >
      <template #name="text,record">
        <span v-if="!record.edit">{{ text }}</span>
        <a-input v-else v-model="record.name" />
      </template>
      <template #sort="text,record">
        <span v-if="!record.edit">{{ text }}</span>
        <a-input-number v-else v-model="record.sort" />
      </template>
      <template #action="record">
        <span v-show="!record.edit" class="action-button" @click="handleEdit(record)">编辑</span>
        <span v-show="record.edit" class="action-button" @click="initData">取消</span>
        <span v-show="record.edit" class="action-button" @click="handleSava(record)">保存</span>
        <span v-show="!record.edit" class="action-button" @click="handleDelete(record)">删除</span>
      </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="$emit('input',false)">取消</a-button>
    </template>
  </a-modal>

</template>

<script>
import SearchForm from '@/components/searchForm'
import { classifyDelete, classifySava, classifyUpdate } from '@/api/contentManage'
import { cloneDeep } from 'lodash'
const initFormModel = {
  errorReasons: '',
  errorReasonsCn: '',
  shopeeErrorMessageId: null
}
export default {
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    module: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => ([])
    },
    titel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formModel: {
        ...initFormModel
      },
      dataList: []
    }
  },
  computed: {
    formItem() {
      return [
        {
          itemType: 'input',
          key: 'name',
          label: '分类名称',
          required: true,
          itemProp: {
            style: { width: '200px' }
          }
        },
        {
          itemType: 'number',
          key: 'sort',
          label: '排序',
          itemProp: {
            style: { width: '200px' }
          }
        }
        // {
        //   slotName: 'button',
        //   span: 6
        // }
      ]
    },
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'classifyId'
        },
        {
          title: '分类名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '排序',
          dataIndex: 'sort',
          scopedSlots: { customRender: 'sort' }
        },
        {
          title: '操作',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) this.initData()
      }
    },
    data: {
      handler() {
        this.initData()
      },
      depp: true
    }

  },
  methods: {
    async ok() {
      // this.$refs.searchForm.validate()
    },
    initData() {
      this.dataList = cloneDeep(this.data)
    },
    afterClose() {
      this.formModel = { ...initFormModel }
      this.initData()
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      const params = { module: this.module, ...val }
      try {
        await classifySava(params)
        this.$message.success('添加成功')
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    },
    handleEdit(record) {
      record.edit = true
    },
    async  handleDelete(record) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗?',
        onOk: async() => {
          try {
            await classifyDelete(record.classifyId)
            this.$message.success('删除成功')
            this.$emit('ok')
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    // 编辑保存
    async handleSava(record) {
      const params = { module: this.module, ...record }
      try {
        await classifyUpdate(params)
        this.$message.success('更新成功')
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    }

  }

}
</script>

<style lang="less" scoped>
.action-button{
  &:not(:last-child){
    margin-right: 5px;
  }
}
</style>
