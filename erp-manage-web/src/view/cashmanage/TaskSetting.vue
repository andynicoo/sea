<template>
  <div ref="container" class="wrapper">
    <div class="filters">
      <a-button type="primary" @click="handleSava">保存</a-button>
    </div>
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="data"
      bordered
      :row-key="(record, index) => index"
    >
      <template #jf="text,record">
        <a-input-number :value="record.jf" @change="(e)=>handleChange(e,record,'jf')" />
      </template>
      <template #limitNum="text,record">
        <a-input-number :value="text" :min="1" @change="(e)=>handleChange(e,record,'limitNum')" />
      </template>
      <template #isOpen="text,record">
        <a-switch :checked="!!record.isOpen" @change="(e)=>handleChange(e,record,'isOpen')" />
      </template>
    </a-table>
  </div>
</template>

<script>
import { getTaskList, savaTaskConfig } from '@/api/cashmange'
export default {
  name: 'TaskSetting',
  data() {
    return {
      data: [],
      formModel: {
        jf: {}
      }
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '任务',
          dataIndex: 'cnName'
        },
        {
          title: '赠送旺币数',
          dataIndex: 'jf',
          scopedSlots: { customRender: 'jf' }
        },
        {
          title: '限制',
          dataIndex: 'limitNum',
          scopedSlots: { customRender: 'limitNum' }
        },
        {
          title: '是否启用',
          dataIndex: 'isOpen',
          scopedSlots: { customRender: 'isOpen' }
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const { data } = await getTaskList()
        const arr = Object.entries(data).reduce((initial, [key, value]) => {
          value.id = key
          return initial.concat(value)
        }, [])
        this.data = arr || []
      } catch (error) {
        console.error(error)
      }
    },
    handleChange(val, record, key) {
      record[key] = Number(val)
    },
    async  handleSava() {
      const params = this.data.reduce((initial, current) => {
        initial[current.id] = current
        return initial
      }, {})
      try {
        await savaTaskConfig(params)
        this.$message.success('保存成功')
        this.getList()
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.filters{
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-end;
}

</style>
