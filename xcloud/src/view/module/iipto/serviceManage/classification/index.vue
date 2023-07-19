<template>
  <div>
    <div v-if="!showUpload">
      <Card>
        <p class="title">数据筛选</p>
        <Form ref="searchForm"
              :model="searchForm"
              inline>
          <FormItem>
            <Input v-model="searchForm.likeCategoryName"
                   clearable
                   placeholder="商标小类（中文）/商标小类（英文）"
                   style="width:220px;" />
          </FormItem>
          <FormItem>
            <Select clearable
                    v-model="searchForm.parentCategoryNum"
                    placeholder="选择商标分类">
              <Option v-for="(item,index) in categoryList"
                      :value="item.categoryNum"
                      :key="index">{{ item.categoryNum }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="searchList('searchForm')"
                    style="margin-right:5px;">查询</Button>
            <Button type="primary"
                    ghost
                    @click="resetList">重置</Button>
          </FormItem>
        </Form>
      </Card>
      <Card style="margin-top:20px;">
        <div class="tableAreaInline">
          <Tabs :value="searchForm.status"
                :animated="false"
                @on-click="tabsChange">
            <TabPane label="全部"
                     name=" "></TabPane>
            <TabPane label="美国"
                     name="US"></TabPane>
            <TabPane label="欧盟"
                     name="EU"></TabPane>
            <TabPane label="英国"
                     name="GB"></TabPane>
            <TabPane label="日本"
                     name="JP"></TabPane>
          </Tabs>
          <div style="float:right;">
            <Button type="primary"
                    ghost
                    @click="exportList">导出</Button>
            <Button type="primary"
                    style="margin: 0 12px;"
                    ghost
                    @click="showUpload=true">导入</Button>
            <Button type="primary"
                    @click="addModal=true;modalTitle='添加小类';handleReset()">添加</Button>
          </div>
        </div>
        <Table :data="data"
               :columns="columns"
               @on-selection-change="selectChange"
               border>
        </Table>
        <Page @on-change="changePageHandler"
              :current="searchForm.page"
              :total="listTotal"
              :page-size="searchForm.limit"
              show-total
              show-elevator />
      </Card>
    </div>
    <Modal :title="modalTitle"
           v-model="addModal">
      <Form ref="addForm"
            :model="addForm"
            :label-width="140"
            :rules="formRule">
        <FormItem label="商标小类（中文）："
                  prop="categoryName">
          <Input v-model="addForm.categoryName"
                 placeholder="商标小类（中文）"
                 style="width:300px;"></Input>
        </FormItem>
        <FormItem label="商标小类（英文）："
                  prop="categoryNameEn">
          <Input v-model="addForm.categoryNameEn"
                 placeholder="商标小类（英文）"
                 style="width:300px;"></Input>
        </FormItem>
        <FormItem label="商标分类："
                  prop="parentCategoryNum">
          <Select clearable
                  v-model="addForm.parentCategoryNum"
                  placeholder="商标分类"
                  style="width:300px;">
            <Option v-for="(item,index) in categoryList"
                    :value="String(item.categoryNum)"
                    :key="index">{{ item.categoryNum }}</Option>
          </Select>
        </FormItem>
        <FormItem label="国家编码："
                  prop="countryCode">
          <Select clearable
                  v-model="addForm.countryCode"
                  placeholder="国家编码"
                  @on-change="changeCountry"
                  style="width:300px;">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryCode }}</Option>
          </Select>
        </FormItem>
        <FormItem label="国家："
                  prop="countryName">
          <Input v-model="addForm.countryName"
                 disabled
                 style="width:300px;"></Input>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary"
                :loading="sureBtnLoading"
                @click="sureChange(1)">提交</Button>
        <Button type="primary"
                :loading="sureBtnLoading"
                @click="sureChange(2)"
                style="margin: 0 20px ;"
                v-if="modalTitle=='添加小类'">提交并继续</Button>
        <Button type="primary"
                ghost
                @click="addModal=false">取消</Button>
      </p>
    </Modal>
    <div v-if="showUpload"
         class="upload-container">
      <Card>
        <Card class="returnList">
          <p @click="returnFunc">
            <Icon type="md-arrow-back" />返回</p>
        </Card>
        <p class="title">批量导入</p>
        <div class="example-box">
          <Steps :current="currentStep">
            <Step title="上传文件"></Step>
            <Step title="执行导入"></Step>
            <Step title="导入完成"></Step>
          </Steps>
          <div class="step1"
               v-if="currentStep==0">
            <Row class="upload-example">
              <Col span="2"
                   class="icon-box">
              <Icon type="md-arrow-round-down" />
              </Col>
              <Col span="18"
                   class="right-content">
              <p class="content-title">填写导入商标小类的信息</p>
              <p class="content-subtitle">请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除</p>
              <p class="content-btn"
                 @click="uploadTemp">下载模板</p>
              </Col>
            </Row>
            <Row class="upload-example">
              <Col span="2"
                   class="icon-box">
              <Icon type="md-arrow-round-up" />
              </Col>
              <Col span="18"
                   class="right-content">
              <p class="content-title">上传填好的商标小类信息表 </p>
              <p class="content-subtitle">文件后缀名必须为xls 或xlsx （即Excel格式），文件大小不得大于10M</p>
              <Upload type="drag"
                      class="content-btn"
                      :data="{ fileCode: randomStr }"
                      :action="baseUrl+'/trademark/manage/category/subcategory/checkSubcategoryFile'"
                      :on-format-error="formatErrorHandler"
                      :before-upload="handleBeforeUpload"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList)}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList)}"
                      :format="['xls','xlsx']"
                      :max-size="10240"
                      :on-exceeded-size="handleMaxSize">
                <div style="padding: 10px;">
                  <span>上传文件</span>
                </div>
              </Upload>
              </Col>
            </Row>
            <p style="text-align:center;margin-top:50px;">
              <Button type="primary"
                      :loading="loadingBtn2"
                      @click="currentStep=1">下一步</Button>
            </p>
          </div>
          <div class="step1"
               v-if="currentStep==1">
            <Row class="upload-example">
              <Col span="2"
                   class="icon-box">
              <Icon type="md-arrow-round-up" />
              </Col>
              <Col span="18"
                   class="right-content">
              <p class="content-title">本次可导入商标小类数量</p>
              <p class="content-btn">{{importSuccessTotal}}条</p>
              </Col>
            </Row>
            <Row class="upload-example">
              <Col span="2"
                   class="icon-box">
              <Icon type="ios-cut" />
              </Col>
              <Col span="18"
                   class="right-content">
              <p class="content-title">本次不可导入商标小类数量</p>
              <p class="content-btn">{{importFailTotal}}条</p>
              </Col>
            </Row>
            <p style="text-align:center;margin-top:20px;">
              <Button type="primary"
                      :loading="loadingBtn1"
                      @click="checkCategoryFunc">下一步</Button>
              <Button style="margin-left:8px;"
                      @click="currentStep=0;uploadFile=''">返回重新上传</Button>
            </p>
            <p style="margin:20px 0 10px 0;font-weight:700;">不可导入商标小类列表</p>
            <Table :data="unableData"
                   :columns="unableColumns"></Table>
          </div>
          <div class="step3-box"
               v-if="currentStep==2">
            <img src="@/assets/images/infoDetail/success.png"
                 alt="">
            <p class="submit-success">批量导入完成</p>
            <p class="submit-sub-success">成功导入商标小类数量:{{successTotal}}条</p>
            <p>请去后台执行刷新类目信息缓存，刷新后才会更新成功</p>
            <p style="text-align:center;margin-top:50px;">
              <Button type="primary"
                      @click="returnFunc">完成</Button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import * as API from '@/api/iipto/classification.js';
import { getToken } from '@/libs/util'
export default {
  data() {
    return {
      searchForm: {
        page: 1,
        limit: 10,
        countryCode: '',
        likeCategoryName: '',
        parentCategoryNum: ''
      },
      listTotal: 0,
      categoryList: [],
      countryList: [],
      data: [],
      columns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '商标小类（中文）',
          key: 'categoryName'
        },
        {
          title: '商标小类（英文）',
          key: 'categoryNameEn'
        },
        {
          title: '商标分类',
          key: 'parentCategoryNum',
          width: 100,
          align: 'center'
        },
        {
          title: '国家',
          key: 'countryName'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('Button',
                {
                  style: {
                    'margin-right': '6px'
                  },
                  on: {
                    click: () => {
                      this.addModal = true
                      this.modalTitle = '编辑小类'
                      this.addForm = { ...params.row }
                      this.addForm.parentCategoryNum = String(params.row.parentCategoryNum)
                    }
                  }
                }, '编辑'),
              h('Button', {
                on: {
                  click: () => {
                    this.deleteFunc(params.row)
                  }
                }
              }, '删除'),
            ])
          },
        },
      ],
      showUpload: false,
      id: '',
      modalTitle: '添加小类',
      addModal: false,
      addForm: {
        categoryName: '',
        categoryNameEn: '',
        countryCode: '',
        countryName: '',
        parentCategoryNum: '',
      },
      formRule: {
        categoryName: [
          { required: true, message: '商标小类（中文）不能为空', trigger: 'blur' }
        ],
        categoryNameEn: [
          { required: true, message: '商标小类（英文）不能为空', trigger: 'blur' }
        ],
        parentCategoryNum: [
          { required: true, message: '商标分类不能为空', trigger: 'change' }
        ],
        countryCode: [
          { required: true, message: '国家编码不能为空', trigger: 'change' }
        ],
      },
      selectData: [],
      sureBtnLoading: false,
      currentStep: 0,
      unableData: [],
      unableColumns: [
        {
          title: '行数',
          align: 'center',
          key: 'number'
        },
        {
          key: 'categoryName',
          title: '商标小类（中文）'
        },
        {
          key: 'categoryNameEn',
          title: '商标小类（英文）'
        },
        {
          key: 'parentCategoryNum',
          title: '商标分类'
        },
        {
          key: 'countryCode',
          title: '国家'
        },
        {
          key: 'failInfo',
          title: '错误提示'
        },
      ],
      uploadFile: '',
      loadingBtn1: false,
      loadingBtn2: false,
      randomStr: Math.random().toString(36).substr(-10),
      importSuccessTotal: 0,
      importFailTotal: 0,
      successTotal: 0,
      fileCode: ''
    }
  },
  mounted() {
    this.getConditionFunc()
    this.searchList()
  },
  methods: {
    //获取国家下拉数据
    getConditionFunc() {
      API.subcategoryConditionApi().then((res) => {
        if (res.code == 0) {
          this.categoryList = res.data.list
          this.countryList = []
          let categoryContryCodeMap = res.data.categoryContryCodeMap
          for (const key in categoryContryCodeMap) {
            let obj = {
              countryCode: key,
              countryName: categoryContryCodeMap[key]
            }
            this.countryList.push(obj)
          }
        }
      })
    },
    tabsChange(val) {
      this.searchForm.countryCode = val
      this.searchList('searchForm')
    },
    searchList(type) {
      if (type === 'searchForm') {
        this.searchForm.page = 1
      }
      API.subcategoryListApi(this.searchForm).then(res => {
        if (res.code === 0) {
          if (res.data.records.length > 0) {
            this.data = res.data.records
            this.listTotal = res.data.total - 0
          } else {
            this.data = []
            this.$Message.info('无搜索结果')
          }
        }
      })
    },
    resetList() {
      this.searchForm = {
        page: 1,
        limit: 10,
        likeCategoryName: '',
        parentCategoryNum: '',
        status: ' '
      }
      this.searchList()
    },
    changeCountry(val) {
      this.countryList.map(item => {
        if (item.countryCode == val) {
          this.addForm.countryName = item.countryName
        }
      })
    },
    changePageHandler(page) {
      this.searchForm.page = page
      this.searchList()
    },
    selectChange(val) {
      this.selectData = val
    },
    exportList() {
      let formData = new FormData()
      formData.append('countryCode', this.searchForm.countryCode)
      formData.append('likeCategoryName', this.searchForm.likeCategoryName)
      formData.append('parentCategoryNum', this.searchForm.parentCategoryNum)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/trademark/manage/category/subcategory/importSubcategoryFile')
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    deleteFunc(row) {
      this.$Modal.confirm({
        title: '确定删除小类吗？',
        content: ``,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          API.subcategoryDelApi({ categoryId: row.id, parentCategoryNum: row.parentCategoryNum }).then(res => {
            if (res.code == 0) {
              this.$Message.success('删除成功')
              this.searchList('searchForm')
            }
          })
        }
      });
    },
    sureChange(type) {
      this.sureBtnLoading = true
      let data = {
        categoryName: this.addForm.categoryName,
        categoryNameEn: this.addForm.categoryNameEn,
        countryCode: this.addForm.countryCode,
        parentCategoryNum: this.addForm.parentCategoryNum,
      }
      if (this.modalTitle == '编辑小类') {
        data.categoryId = this.addForm.id
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          API.subcategoryUpdateApi(data).then(res => {
            if (res.code == 0) {
              this.handleReset()
              this.$Message.success('操作成功')
              if (type == 1) {
                this.addModal = false
                this.searchList('searchForm')
              }
            }
          }).finally(() => {
            this.sureBtnLoading = false
          })
        } else {
          this.$Message.error('请先填写完整资料');
        }
      })
    },
    handleReset(name) {
      this.$refs['addForm'].resetFields();
    },
    returnFunc() {
      this.showUpload = false
      this.currentStep = 0
      this.uploadFile = ''
      this.searchList('searchForm')
      this.searchForm.countryCode = ' '
    },
    uploadTemp() {
      let formData = new FormData()
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('get', this.baseUrl + '/trademark/manage/category/subcategory/downLoadTemplate')
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    handleMaxSize(file) {
      this.$Message.warning('文件大小不能超过10M')
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传xls,xlsx格式的文件"
      });
    },
    successHandler(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      } else {
        this.uploadFile = file.name
        this.importSuccessTotal = res.data.importSuccessTotal
        this.importFailTotal = res.data.importFailTotal
        this.unableData = res.data.failTrademarkCategoryList
        this.loadingBtn2 = false
        this.fileCode = this.randomStr
        this.randomStr = Math.random().toString(36).substr(-10)
      }
    },
    removeHandler() {
      this.uploadFile = ''
    },
    handleBeforeUpload() {
      this.loadingBtn2 = true
      const check = this.uploadFile == '';
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传一个文件'
        });
      }
      return check;
    },
    checkCategoryFunc() {
      if (this.importSuccessTotal == 0) {
        this.$Message.info('无可上传小类')
        return
      }
      this.loadingBtn1 = true
      API.uploadSubcategoryFileApi({ fileName: this.uploadFile, fileCode: this.fileCode }).then(res => {
        if (res.code == 0) {
          this.currentStep = 2
          this.successTotal = res.data
        }
      }).finally(() => {
        this.loadingBtn1 = false
      })
    }
  },
}
</script>
<style lang="less" scoped>
/deep/ .tableAreaInline {
  display: flex;
  justify-content: space-between;
  .ivu-tabs-bar {
    margin-bottom: 0px !important;
  }
  .ivu-btn-primary {
    height: 30px;
  }
}
.upload-container {
  .returnList {
    cursor: pointer;
  }
  .title {
    font-weight: 600;
    color: #333;
    margin: 16px 0;
  }
  .example-box {
    padding: 20px 0 20px 60px;
  }
  .step1 {
    margin-top: 60px;
    padding-right: 40px;

    .upload-example {
      border: 1px solid #e4e4e4;
      margin-bottom: 16px;
      .icon-box {
        font-size: 40px;
        // background-color: #f5f5f5;
        text-align: center;
        padding: 20px;
      }
      .right-content {
        padding: 10px 20px;
        .content-title {
          color: #666;
          font-size: 16px;
          font-weight: 700;
          margin: 8px 0;
        }
        .content-subtitle {
          color: #999;
          margin-bottom: 8px;
        }
        .content-btn {
          color: #0079fe;
          cursor: pointer;
        }
      }
    }
  }
  .step3-box {
    text-align: center;
    margin-top: 52px;
    .submit-success {
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin-top: 22px;
    }
    .submit-sub-success {
      color: #999;
      margin-top: 14px;
    }
  }
}
</style>