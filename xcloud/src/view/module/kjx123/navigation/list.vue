<template>
  <div class="userPromoteWrapper">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.queryCategoryName"
                 clearable
                 placeholder="请输入类目名称"
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
                @click="addCategoryModal=true"
                style="float:right;margin-right:20px;">新增类目</Button>
      </Form>
      <div class="tableArea">
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="operate"
                    slot-scope="{ row }">
            <div class="operation">
              <Button type="info"
                      ghost
                      @click="goEditor(row)"
                      style="margin:10px;">编辑</Button>
              <Button type="info"
                      ghost
                      @click="goDelete(row)"
                      style="margin:10px;">删除</Button>
              <Button type="info"
                      ghost
                      @click="addService(row)">新增服务</Button>

            </div>
          </template>
          <template slot="lookService"
                    slot-scope="{ row }">
            <div class="operation"
                 style="cursor:pointer;color:#2db7f5"
                 @click="lookDetail(row,1)">查看</div>
          </template>
        </Table>
      </div>
    </div>
    <Editor-nav v-else
                @back="refresh"
                :categoryInfo="categoryInfo"></Editor-nav>
    <Modal v-model="serviceModal"
           title="查看"
           class="serviceModal"
           footer-hide>
      <Table :data="detailData"
             :columns="detailColumns"
             border>
        <template slot="categoryPicture"
                  slot-scope="{ row }">
          <div style="text-align:center;">
            <img style="width:100px;height:100px;"
                 :src="row.serviceLogo"
                 alt="">
          </div>
        </template>
        <template slot="operation"
                  slot-scope="{row}">
          <Button @click="changeService(row)">修改</Button>
          <Button @click="delService(row)">删除</Button>
        </template>
      </Table>
      <Page @on-change="changePageHandler1"
            :current="pageInfo1.pageIndex"
            :total="listTotal1"
            :page-size="pageInfo1.pageSize"
            show-total
            show-elevator />
    </Modal>
    <Modal v-model="addModal"
           :title="modalTitle"
           class="add-modal"
           footer-hide>
      <Form :model="addFrom"
            :label-width="120"
            label-position="left"
            :rules="formRule"
            ref="addFrom">
        <FormItem label="一级类目名称："
                  prop="bulletinTitle">
          <span>{{nowCategory.categoryName}}</span>
        </FormItem>
        <FormItem label="二级类目："
                  prop="categoryIdTwo">
          <Select v-model="addFrom.categoryIdTwo"
                  placeholder="选择资讯分类"
                  style="width:400px;">
            <Option :value="item.id"
                    v-for="item in typeList"
                    :key="item.type">{{item.categoryName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务名称："
                  prop="serviceName">
          <Input v-model="addFrom.serviceName"
                 placeholder="最多不超过20个字符："
                 style="width:400px;"
                 :maxlength="20"></Input>
        </FormItem>
        <FormItem label="服务介绍（选填）："
                  prop="serviceIntro">
          <Input v-model="addFrom.serviceIntro"
                 placeholder="最多不超过100个字符："
                 style="width:400px;"
                 :maxlength="100"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <FormItem label="服务网址："
                  prop="serviceUrl">
          <Input v-model="addFrom.serviceUrl"
                 placeholder="服务网址"
                 style="width:400px;"></Input>
        </FormItem>
        <FormItem label="排序："
                  prop="serviceSort">
          <Input v-model="addFrom.serviceSort"
                 placeholder="数字越大，排序越靠后，只可输入数字"
                 style="width:400px;"
                 type="number"></Input>
        </FormItem>
        <FormItem label="服务商LOGO："
                  prop="serviceLogo">
          <Upload type="drag"
                  :action="kjxFile"
                  :data="{ prefix: '' }"
                  :before-upload="beforeUploadHandler"
                  :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'serviceLogo')}"
                  :on-remove="(file,fileList)=>{removeHandler (file,fileList,'serviceLogo')}"
                  style="width:260px"
                  v-if="addFrom.serviceLogo==''">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div class="main-img-box"
               v-else>
            <img :src="addFrom.serviceLogo"
                 style="width:48px;height:48px;">
            <Button @click="removeHandler(1,1,'serviceLogo')">删除</Button>
          </div>
        </FormItem>
        <FormItem class="button">
          <Button type="primary"
                  size="large"
                  class="submit"
                  @click="submitService">确认</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="addCategoryModal"
           title="新增类目"
           footer-hide
           class="addCategoryModal">
      <Form :model="categoryForm"
            :label-width="120"
            label-position="left"
            ref="categoryForm">
        <FormItem label="一级类目名称"
                  prop="bulletinTitle">
          <Input v-model="categoryForm.firstGradeName"
                 placeholder="一级类目名称"
                 style="width:300px;"
                 :maxlength="20"></Input>
        </FormItem>
        <FormItem label="一级类目排序"
                  prop="bulletinTitle">
          <Input v-model="categoryForm.firstGradeSort"
                 placeholder="一级类目排序，只可输入数字"
                 type="number"
                 style="width:300px;"
                 :maxlength="20"></Input>
        </FormItem>
        <FormItem label="二级类目："
                  prop="bulletinType">
          <div class="cat-list"
               v-for="(item,index) in categoryForm.listTwoCategoryDto"
               :key="index">
            <Input v-model="item.twoGradeName"
                   style="width:150px"></Input>
            <Select clearable
                    v-model="item.modelStyle"
                    placeholder="选择模板"
                    style="width:100px;margin:0 10px">
              <Option :value="1">上图下文样式</Option>
              <Option :value="2">左图右文样式</Option>
              <Option :value="3">左图又文加描述</Option>
            </Select>
            <Input v-model="item.twoGradeSort"
                   style="width:80px;margin-right:10px;"
                   type="number"></Input>
            <Button @click="deleteItem(index)">【删除】</Button>
          </div>
        </FormItem>
        <Button @click="addCategory"
                style="margin-left:120px;">+新增类目</Button>
        <FormItem class="button"
                  style="margin-top:20px;">
          <Button type="primary"
                  size="large"
                  class="submit"
                  @click="submitCategory">确认</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/kj123/navigation.js';
import EditorNav from './editorNav'
export default {
  components: {
    EditorNav
  },
  data() {
    return {
      isDetailShow: false,
      serviceModal: false,
      addCategoryModal: false,
      addModal: false,
      categoryInfo: {},
      searchForm: {
        queryCategoryName: '',
      },
      listTotal1: 0,
      pageInfo1: {
        pageSize: 10,
        pageIndex: 1,
      },
      tableLoading: false,
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 66
        },
        {
          title: '一级类目名称',
          key: 'categoryName',
        },
        {
          title: '二级类目',
          render(h, params) {
            let twoCategoryName = ''
            params.row.listTwoCategory.map((item, index) => {
              twoCategoryName += item.categoryName + '，'
            })
            return h('span', twoCategoryName)
          },
        },
        {
          title: '排序',
          key: 'categorySort',
          width: 66
        },
        {
          title: '服务',
          slot: 'lookService',
          width: 80
        },
        {
          title: '创建时间',
          key: 'pcHrefPv'
        },
        {
          title: '操作',
          slot: 'operate',
          width: 210
        }
      ],
      tableData: [],
      detailData: [],
      detailColumns: [
        {
          type: 'index',
          key: 'serviceSort',
          width: 66
        },
        {
          title: '服务名称',
          key: 'serviceName',
        },
        {
          title: '服务描述',
          key: 'serviceIntro'
        },
        {
          title: '图片',
          slot: 'categoryPicture'
        },
        {
          title: '链接',
          key: 'serviceUrl'
        },
        {
          title: '操作',
          slot: 'operation'
        }
      ],
      addFrom: {
        categoryIdOne: 0,
        categoryIdTwo: 0,
        id: '',
        serviceIntro: "",
        serviceLogo: "",
        serviceName: "",
        serviceSort: 0,
        serviceUrl: ""
      },
      typeList: [],
      formRule: {},
      categoryForm: {
        firstGradeName: '',
        firstGradeSort: '',
        id: '',
        listTwoCategoryDto: [
          {
            modelStyle: '',
            twoGradeName: '',
            twoGradeSort: '',
            twoid: ''
          }
        ]
      },
      nowCategory: {},
      modalTitle:'新增服务'
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm };
      API.categoryListAPI(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.tableData = res.data;
        } else {
          this.$Message.warning(res.message);
        }
      })
        .catch((err) => console.log(err))
    },
    getServiceList(id, page) {
      if (page) {
        this.pageInfo1.pageIndex = page
      }
      let data = { ...this.pageInfo1 }
      data.firstGradeId = id
      API.categoryServiceListAPI(data).then(res => {
        if (res.code == 0) {
          this.detailData = res.data.records;
          this.listTotal1 = Number(res.data.total)
        } else {
          this.$Message.warning(res.message);
        }
      })
    },
    addCategory() {
      let obj = {
        modelStyle: '',
        twoGradeName: '',
        twoGradeSort: '',
        twoid: ''
      }
      this.categoryForm.listTwoCategoryDto.push(obj)
    },
    deleteItem(i) {
      this.categoryForm.listTwoCategoryDto.splice(i, 1)
    },
    //搜索列表
    searchList() {
      this.getList()
    },
    //重置列表
    resetList() {
      this.searchForm = {}
      this.getList()
    },
    //邀请用户分页
    changePageHandler1(page) {
      this.pageInfo1.pageIndex = page
      this.getServiceList(this.nowCategory.id)
    },
    //编辑
    goEditor(row) {
      this.categoryInfo = row
      this.isDetailShow = true
    },
    //查看
    lookDetail(row, page) {
      this.serviceModal = true
      this.typeList = row.listTwoCategory
      this.nowCategory = row
      this.addFrom.categoryIdOne = row.id
      this.getServiceList(row.id, page)
    },
    addService(row) {
      this.addModal = true
      this.typeList = row.listTwoCategory
      this.nowCategory = row
      this.addFrom.categoryIdOne = row.id
      this.modalTitle='新增服务'
    },
    goDelete(row) {
      let self = this
      this.$Modal.confirm({
        title: '确认删除？',
        onOk() {
          API.delCategoryAPI({ id: row.id }).then(res => {
            if (res.code === 0) {
              self.getList()
              this.$Message.success('删除成功')
            }
          })
        }
      })
    },
    beforeUploadHandler(res, file, fileList) { },
    successHandler(res, file, fileList, type) {
      this.addFrom[type] = res.data.fileUrl;
    },
    removeHandler(file, fileList, type) {
      this.addFrom[type] = ''
    },
    submitService() {
      API.addCategoryServiceAPI(this.addFrom).then(res => {
        if (res.code === 0) {
          this.$Message.success('操作成功')
          this.addModal = false
          this.getServiceList(this.addFrom.categoryIdOne, 1)
          this.addFrom = {
            categoryIdOne: 0,
            categoryIdTwo: 0,
            id: '',
            serviceIntro: "",
            serviceLogo: "",
            serviceName: "",
            serviceSort: 0,
            serviceUrl: ""
          }
        }
      })
    },
    //新增类目确认
    submitCategory() {
      API.addCategoryAPI(this.categoryForm).then(res => {
        if (res.code == 0) {
          this.$Message.success('添加成功')
          this.addCategoryModal = false;
          this.categoryForm = {
            firstGradeName: '',
            firstGradeSort: '',
            id: '',
            listTwoCategoryDto: [
              {
                modelStyle: '',
                twoGradeName: '',
                twoGradeSort: '',
                twoid: ''
              }
            ]
          }
          this.getList(1)
        }
      })
    },
    refresh() {
      this.isDetailShow = false
      this.getList(1)
    },
    //点击修改服务商
    changeService(row) {
      this.modalTitle='修改服务'
      this.addModal = true
      this.addFrom = { ...row }
    },
    //删除服务商
    delService(row) {
      let self = this
      this.$Modal.confirm({
        title: '确认删除？',
        onOk() {
          API.delServiceAPI({ id: row.id }).then(res => {
            if (res.code === 0) {
              this.$Message.success('删除成功')
              self.getServiceList(self.nowCategory.id)
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
  /deep/ .ivu-table-wrapper {
    overflow: inherit;
  }
}
.serviceModal /deep/ .ivu-modal {
  width: 80% !important;
  max-height: 80% !important;
  overflow-y: scroll;
}
.addCategoryModal /deep/ .ivu-modal {
  width: 60% !important;
}
.add-modal /deep/ .ivu-modal-body {
  padding: 25px 30px;
}

.add-modal /deep/ .ivu-modal {
  width: 600px !important;
}
</style>