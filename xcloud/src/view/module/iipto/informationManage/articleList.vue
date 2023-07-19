<template>
  <div class="box-content">
    <div class="articleList"
         v-if="!isShowArticle">
      <Form :model="searchForm"
            inline
            ref="searchForm">
        <FormItem>
          <Input v-model="searchForm.bulletinTitle"
                 clearable
                 placeholder="请输入资讯标题"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select v-model="searchForm.bulletinType"
                  style="width:150px">
            <Option v-for="(item,index) in typeList"
                    :value="item.type"
                    :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">搜索</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
          <Button type="primary"
                  style="margin-left:30px;"
                  @click="isShowArticle=true">发布文章</Button>
        </FormItem>
      </Form>
      <Table :data="articleData"
             :columns="articleColumns"
             :loading="tableLoading"
             border>
        <template slot="mainBanner"
                  slot-scope="{row}">
          <img :src="row.bulletinMainPicture"
               class="mainImg">
        </template>
        <template slot="isStart"
                  slot-scope="{row,index}">
          <div>
            <i-switch v-model="row.bulletinStatus==0? true : false"
                      :value="row.bulletinStatus"
                      @on-change="switchStatus(row,index)"
                      size="large">
            </i-switch>
          </div>
        </template>
        <template slot="operation"
                  slot-scope="{row}">
          <div>
            <Button style="margin-right:8px;"
                    @click="editor(row)">编辑</Button>
            <Button @click="delectArticle(row)">删除</Button>
          </div>
        </template>
      </Table>
      <Page :total="listTotal"
            show-elevator
            show-sizer
            transfer
            :current="searchForm.page"
            :page-size="searchForm.limit"
            show-total
            @on-change="handlePage"
            @on-page-size-change="handlePageSize" />
    </div>
    <PublishArticle v-if="isShowArticle"
                    @returnList="returnFunc"
                    :detail="detail"></PublishArticle>
  </div>
</template>
<script>
import PublishArticle from './publishArticle'
import { informationList, submitInformation ,deleteInformation} from '@/api/iipto/information.js'
export default {
  components: {
    PublishArticle
  },
  data() {
    return {
      isShowArticle: false,
      searchForm: {
        bulletinTitle: '',
        bulletinType: '0',
        page: 1,
        limit: 10
      },
      typeList: [
        { type: '0', name: '全部' },
        { type: '1', name: '商标百科' },
        { type: '2', name: '专利百科' },
      ],
      articleData: [],
      tableLoading: false,
      articleColumns: [
        {
          align: 'center',
          title: '序号',
          width: '60px',
          render: (h, params) => {
            return h('span', params.row._index + 1)
          },
        },
        {
          align: 'center',
          title: '主图',
          slot: 'mainBanner'
        },
        {
          align: 'center',
          key: 'bulletinTitle',
          title: '资讯标题'
        },
        {
          align: 'center',
          key: 'createTime',
          title: '创建时间'
        },
        {
          align: 'center',
          key: 'bulletinPublisherName',
          title: '发布人'
        },
        {
          align: 'center',
          title: '是否启用',
          slot: 'isStart'
        },
        {
          align: 'center',
          title: '操作',
          slot: 'operation'
        },
      ],
      listTotal: 0,
      detail: {}
    }
  },
  mounted() {
    this.searchList()
  },
  methods: {
    searchList() {
      // console.log(this.searchForm)
      let data = { ...this.searchForm }
      if (this.searchForm.bulletinType == undefined) { data.bulletinType = '' }
      // console.log(data)
      this.tableLoading = true
      informationList(data).then(res => {
        if (res.code === 0) {
          this.articleData = res.data.records
          this.listTotal = res.data.total - 0
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    resetList() {
      this.searchForm = {
        bulletinTitle: '',
        bulletinType: '-1',
        page: 1,
        limit: 10
      }
    },
    switchStatus(row, index) {
      let objswitch = { ...row }
      objswitch.bulletinId = row.id
      objswitch.bulletinStatus = objswitch.bulletinStatus ? 0 : 1
      // return
      submitInformation(objswitch).then(res => {
        if (res.code === 0) {
          this.$Message.success('修改成功')
          this.searchList()
        }
      })
    },
    delectArticle(row) {
      const self = this
      this.$Modal.confirm({
        title: '是否确认删除',
        onOk: function () {
          let objswitch = { ...row }
          objswitch.bulletinId = row.id
          objswitch.bulletinStatus = 2
          deleteInformation({id:row.id}).then(res => {
            if (res.code === 0) {
              self.$Message.success('删除成功')
              self.searchList()
            }
          })
        }
      })

    },
    handlePage(page) {
      this.searchForm.page = page
      this.searchList()
    },
    handlePageSize(pageSize) {
      this.searchForm.limit = pageSize
      this.searchList()
    },
    returnFunc(stats) {
      this.isShowArticle = false
      this.detail = {}
      this.searchList()
    },
    editor(row) {
      this.detail = row
      this.isShowArticle = true
    }
  }
}
</script>
<style scoped lang="less">
.box-content {
  margin: 15px;
}
.mainImg {
  width: 100px;
  height: 60px;
}
</style>

