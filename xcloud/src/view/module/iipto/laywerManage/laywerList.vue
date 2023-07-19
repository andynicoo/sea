<template>
  <div class="box-content">
    <div class="articleList"
         v-if="!isEditor&&!isDetail">
      <Card>
        <p class="title">数据筛选</p>
        <Form :model="searchForm"
              inline
              ref="searchForm"
              class="search-form">
          <FormItem>
            <Input v-model="searchForm.attorneyName"
                   clearable
                   placeholder="律师名称"
                   style="width:200px;" />
          </FormItem>
          <FormItem>
            <Select v-model="searchForm.attorneyCountryCode"
                    style="width:150px"
                    placeholder="国家">
              <Option v-for="(item,index) in countryList"
                      :value="item.countryCode"
                      :key="index">{{ item.countryNameZh }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="searchList(1)"
                    style="margin-right:5px;">搜索</Button>
            <Button type="primary"
                    ghost
                    @click="resetList">重置</Button>
          </FormItem>
        </Form>
      </Card>
      <Card class="table-box">
        <p class="title">数据列表
          <Button style="margin-right:8px;float:right;"
                  type="primary"
                  @click="editor('add')">添加律师</Button>
        </p>
        <Table :data="articleData"
               :columns="articleColumns"
               :loading="tableLoading"
               border>
          <template slot="isOpen"
                    slot-scope="{row,index}">
            <div>
              <i-switch :value="row.isOpen==1?true:false"
                        @on-change="switchStatus(row,index)"
                        size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </div>
          </template>
          <template slot="operation"
                    slot-scope="{row}">
            <div>
              <Button style="margin-right:8px;"
                      @click="toDetail(row)">查看</Button>
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

      </Card>
    </div>
    <addLawyer v-if="isEditor"
               @returnList="returnFunc"
               :detail="detail"></addLawyer>
    <LawyerDetail v-if="isDetail"
                  @returnList="returnFunc"
                  :detail="detail"></LawyerDetail>
  </div>
</template>
<script>
import addLawyer from './addLawyer'
import LawyerDetail from './lawyerDetail'
import { lawyerListApi, isOpenLawyerApi, deleteLawyerApi } from '@/api/iipto/lawyer.js'
export default {
  components: {
    addLawyer,
    LawyerDetail
  },
  data() {
    return {
      isEditor: false,
      isDetail: false,
      searchForm: {
        attorneyName: '',
        attorneyCountryCode: '',
        page: 1,
        limit: 10,
        sortType: '2'
      },
      countryList: [
        { countryNameZh: "美国", countryCode: "US" },
        { countryNameZh: "欧盟", countryCode: "EU" },
        { countryNameZh: "日本", countryCode: "JP" },
        { countryNameZh: "英国", countryCode: "GB" },
        { countryNameZh: "加拿大", countryCode: "CA" },
      ],
      articleData: [],
      tableLoading: false,
      articleColumns: [
        {
          align: 'center',
          title: 'ID',
          width: '60px',
          key: 'id'
        },
        {
          align: 'center',
          title: '律师名称',
          key: 'attorneyName'
        },
        {
          align: 'center',
          key: 'attorneyCountryNameEn',
          title: '国家'
        },
        {
          align: 'center',
          title: '是否启用',
          slot: 'isOpen',
          width: '150px'
        },
        {
          align: 'center',
          key: 'createTime',
          title: '创建时间'
        },
        {
          align: 'center',
          title: '操作',
          slot: 'operation',
          width: '250px'
        },
      ],
      listTotal: 0,
      detail: {}
    }
  },
  mounted() {
    this.searchList(1)
  },
  methods: {
    searchList(page) {
      // console.log(this.searchForm)
      let data = { ...this.searchForm }
      if (page) {
        data.page = page
      }
      this.tableLoading = true
      lawyerListApi(data).then(res => {
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
        attorneyName: '',
        attorneyCountryCode: '',
        page: 1,
        limit: 10,
        sortType: '2'
      }
    },
    switchStatus(row, index) {

      let objswitch = {}
      objswitch.id = row.id
      objswitch.isOpen = row.isOpen == 1 ? 2 : 1
      // return
      isOpenLawyerApi(objswitch).then(res => {
        if (res.code === 0) {
          this.$Message.success('修改成功')
          this.searchList()
        }
      })
    },
    delectArticle(row) {
      const self = this
      if (row.isOpen == 1) {
        this.$Modal.confirm({
          title: '律师未禁用',
          content: '请先禁用律师，再操作删除',
          okText: '禁用',
          cancelText: '取消',
          onOk: function () {
            self.switchStatus(row)
          }
        })
      } else {
        this.$Modal.confirm({
          title: '是否确认删除',
          onOk: function () {
            deleteLawyerApi({ id: row.id }).then(res => {
              if (res.code === 0) {
                self.$Message.success('删除成功')
                self.searchList()
              }
            })
          }
        })
      }
    },
    handlePage(page) {
      this.searchForm.page = page
      this.searchList()
    },
    handlePageSize(pageSize) {
      this.searchForm.limit = pageSize
      this.searchList(1)
    },
    returnFunc(stats) {
      this.isEditor = false
      this.isDetail = false
      this.detail = {}
      this.searchList()
    },
    editor(row) {
      this.detail = row
      this.isEditor = true
      this.isDetail = false
    },
    toDetail(row) {
      this.detail = row
      this.isDetail = true
      this.isEditor = false
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
.search-form {
  margin-top: 8px;
  /deep/ .ivu-form-item {
    margin-bottom: 0;
  }
}
.table-box {
  margin-top: 10px;
  .title {
    margin-bottom: 15px;
  }
}
</style>

