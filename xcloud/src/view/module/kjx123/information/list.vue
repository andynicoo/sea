<template>
  <div class="userPromoteWrapper">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.newsTitle"
                 clearable
                 placeholder="请输入资讯标题"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
        <Button type="primary"
                style="float:right;margin-right:20px;"
                @click="addInformation">发布资讯</Button>
      </Form>
      <div class="tableArea">
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="pictureItem"
                    slot-scope="{ row }">
            <div style="text-align:center;">
              <img style="width:100px;height:100px;"
                   :src="row.picture"
                   alt="">
            </div>
          </template>
          <template slot="isStart"
                    slot-scope="{row,index}">
            <div>
              <i-switch v-model="row.isOpen==1? true : false"
                        :value="row.isOpen"
                        @on-change="switchStatus($event,row,index)"
                        size="large">
              </i-switch>
            </div>
          </template>
          <template slot="operate"
                    slot-scope="{ row }">
            <div class="operation">
              <Button type="info"
                      ghost
                      @click="goEditor(row)"
                      style="margin-right:8px;">编辑</Button>
              <Button type="info"
                      ghost
                      @click="deleteInformation(row)">删除</Button>
            </div>
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              :current="pageInfo.pageIndex"
              :total="listTotal"
              :page-size="pageInfo.pageSize"
              show-total
              show-elevator />
      </div>
    </div>
    <EditorInfo v-else
                @back="backFunc"
                :detail="informationDetail"></EditorInfo>
  </div>
</template>
<script>
import * as API from '@/api/kj123/information.js';
import EditorInfo from './editorInfo'
export default {
  components: {
    EditorInfo
  },
  data() {
    return {
      isDetailShow: false,
      searchForm: {
        newsTitle: '',
      },
      date: '',
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
      },
      listTotal: 0,
      tableLoading: false,
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 66
        },
        {
          title: '资讯标题',
          key: 'title',
        },
        {
          title: '资讯主图',
          align: 'center',
          slot: 'pictureItem',
          width:140
        },
        {
          title: '简介',
          key: 'newsDescribe'
        },
        {
          title: '资讯类型',
          render: (h, params) => {
            let type = this.informationType[params.row.type]
            return h('span',type)
          },
        },
        {
          title: '状态',
          slot: 'isStart'
        },
        {
          title: '资讯来源',
          key: 'source'
        },
        {
          title: '浏览量',
          key: 'browseCount'
        },
        {
          title: '发布时间',
          key: 'createTime'
        },
        {
          title: '操作',
          slot: 'operate',
          width: 170
        }
      ],
      tableData: [],
      informationType: {
        1:'电商',
        2:'运营',
        3:'工具',
        4:'服务',
        5:'金融',
        6:'物流',
        7:'选品',
        8:'插件',
        9:'营销',
        10:'政策',
        11:'行业动态',
        12:'其它'
      },
      informationDetail: {}
    }

  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.newsListAPI(params).then((res) => {
        if (res.code == 0) {
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    //启用禁用文章
    switchStatus(val,row, index) {
      let objswitch={
        id:row.id,
        isOpen:val ? 1 : 2
      }
      console.log(objswitch)
      API.isOpenNewsAPI(objswitch).then(res => {
        if (res.code === 0) {
          this.$Message.success('修改成功')
          this.searchList()
        }
      })
    },
    //搜索列表
    searchList() {
      this.pageInfo.pageIndex = 1;
      this.getList()
    },
    //重置列表
    resetList() {
      this.searchForm = {}
      this.getList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.pageIndex = page
      this.getList()
    },
    //编辑
    goEditor(row) {
      this.isDetailShow = true
      this.informationDetail = row
    },
    backFunc() {
      this.isDetailShow = false
      this.getList()
    },
    addInformation() {
      this.isDetailShow = true
      this.informationDetail = {}
    },
    deleteInformation(row) {
      this.$Modal.confirm({
        title: '确认删除？',
        onOk() {
          API.delectNewsAPI({ id: row.id }).then(res => {
            if (res.code === 0) {
              this.$Message.success('删除成功')
              this.getList()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.userPromoteWrapper {
  padding: 20px;
}
/deep/ .ivu-modal {
  width: 80% !important;
}
.add-modal /deep/ .ivu-modal-body {
  padding: 25px 30px;
}

.add-modal /deep/ .ivu-modal {
  width: 600px !important;
}
</style>