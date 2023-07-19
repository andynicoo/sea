<template>
  <a-modal
    :visible="value"
    title="分类管理"
    :width="910"
    :after-close="afterClose"
    @cancel="handleCancel"
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
      :scroll="{y:400,scrollToFirstRowOnChange:true}"
      :loading="loading"
      :data-source="dataList"
      row-key="id"
    >
      <template #name="text,record">
        <span v-if="!record.edit">{{ text }}</span>
        <a-input v-else v-model="record.typeName" />
      </template>
      <template #sort="text,record">
        <span v-if="!record.edit">{{ text }}</span>
        <a-input-number v-else v-model="record.sort" />
      </template>
      <template v-if="mainType !==1" #action="record">
        <span v-show="!record.edit" class="action-button" @click="handleEdit(record)">编辑</span>
        <span v-show="record.edit" class="action-button" @click="initData">取消</span>
        <span v-show="record.edit" class="action-button" @click="handleSava(record)">保存</span>
        <span v-show="!record.edit" class="action-button" @click="handleDelete(record)">删除</span>
      </template>
    </a-table>
    <template #footer>
      <!-- <a-button type="primary" @click="$emit('input',false)">取消</a-button> -->
      <div v-show="pagination.total">
        <a-pagination
          type="smill"
          v-bind="{ ...pagination }"
          @showSizeChange="onShowSizeChange"
          @change="change"
        />
      </div>
    </template>
  </a-modal>

</template>

<script>
import SearchForm from '@/components/searchForm'
import { classifyList, classifyDelete, classifyAdd, classifyUpdate } from '@/api/website'
import { cloneDeep } from 'lodash'
const initFormModel = {
  sort: 0
}
const initPagination = {
  current: 1,
  size: 10
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
    },
    mainType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      formModel: {
        ...initFormModel
      },
      dataList: [],
      copyData: [],
      paginationParams: { ...initPagination },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}条`
      },
      loading: false,
      flag: false // 记录是否操作更改了分类
    }
  },
  computed: {
    formItem() {
      return [
        {
          itemType: 'input',
          key: 'typeName',
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
      ]
    },
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'id',
          customRender: (text, record, index) => {
            return <span>{++index}</span>
          }
        },
        {
          title: '分类名称',
          dataIndex: 'typeName',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '排序',
          dataIndex: 'sort',
          scopedSlots: { customRender: 'sort' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
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
        if (val) this.getList()
      }
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const params = {
        mainType: this.mainType,
        ...this.paginationParams
      }
      try {
        const { data } = await classifyList(params)
        const arr = data?.records ?? []
        this.copyData = arr
        this.pagination.total = data?.total || 0
        this.initData()
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    initData() {
      this.dataList = cloneDeep(this.copyData)
    },
    afterClose() {
      this.formModel = { ...initFormModel }
      this.reset()
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      const params = { mainType: this.mainType, ...val }
      try {
        await classifyAdd(params)
        this.$message.success('添加成功')
        this.flag = true
        this.getList()
      } catch (error) {
        console.error(error)
      }
    },
    handleEdit(record) {
      this.$set(record, 'edit', true)
    },
    async handleDelete(record) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗?',
        onOk: async() => {
          try {
            await classifyDelete({ mainType: this.mainType, ids: [record.id] })
            if (this.dataList.length === 1) {
              this.pagination.current--
              this.paginationParams.current--
            }
            this.$message.success('删除成功')
            this.flag = true
            this.getList()
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    // 编辑保存
    async handleSava(record) {
      const params = { mainType: this.mainType, ...record }
      try {
        await classifyUpdate(params)
        this.$message.success('更新成功')
        this.flag = true
        this.getList()
      } catch (error) {
        console.error(error)
      }
    },
    change(page, pageSize) {
      this.paginationParams.current = page
      this.pagination.current = page
      this.getList()
    },
    onShowSizeChange(current, size) {
      this.paginationParams.size = size
      this.pagination.pageSize = size
      this.getList()
    },
    reset() {
      this.paginationParams = { ...initPagination }
    },
    handleCancel() {
      this.$emit('input', false)
      if (this.flag) {
        this.$emit('ok')
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
