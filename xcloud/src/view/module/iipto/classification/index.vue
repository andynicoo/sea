<template>
  <div>
    <Card>
      <Table :data="tableData" :columns="tableColumns" border>
        <template slot-scope="{isShow}" slot="isShow">
          <div>
            <i-switch v-model="row.isOpen==1? true : false"
                      :value="row.isOpen"
                      @on-change="switchStatus($event,row,index)"
                      size="large">
            </i-switch>
          </div>
        </template>
        <template slot-scope="{row}" slot="operation" >
          <div>
            <Button @click="editor(row)">编辑</Button>
          </div>
        </template>
      </Table>
      <Page @on-change="changePageHandler"
            :current="pageInfo.pageIndex"
            :total="pageInfo.listTotal"
            :page-size="pageInfo.pageSize"
            show-total
            show-elevator />
    </Card>
    <Modal v-model="editorModal" title='编辑分类'>
      <Form :model="editorForm">
        <FormItem label="分类序号：">
          <Input v-model="editorForm.newsTitle"
                 clearable
                 placeholder="请输入资讯标题"
                 style="width:200px;" />
                 <p style="margin-left:72px;">必须是＞0的数字</p>
        </FormItem>
        <FormItem label="分类名称：">
          <Input v-model="editorForm.newsTitle"
                 clearable
                 placeholder="请输入资讯标题"
                 style="width:200px;" :maxlength="4"/>
                 <p style="margin-left:72px;">最多4个字</p>
        </FormItem>
        <FormItem label="是否显示：">
          <i-switch v-model="editorForm.isOpen==1? true : false"
                      :value="editorForm.isOpen"
                      @on-change="switchStatus($event,editorForm)"
                      size="large">
            </i-switch>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageInfo:{
        pageIndex:1,
        listTotal:0,
        pageSize:10
      },
      tableData:[{}],
      tableColumns:[
        {
          key:'',
          title:'分类序号'
        },
        {
          key:'',
          title:'分类名称'
        },
        {
          key:'',
          title:'创建时间'
        },
        {
          key:'',
          title:'是否显示',
          slot:'isShow'
        },
        {
          key:'',
          title:'操作',
          slot:'operation'
        }
      ],
      editorModal:false,
      editorForm:{}
    }
  },
  methods: {
    changePageHandler(){},
    editor(row){},
    switchStatus(e,row,i){}
  },
}
</script>
