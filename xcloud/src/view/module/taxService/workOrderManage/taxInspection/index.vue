<template>
  <div class="invoiceList container">
    <div class="mainPage" v-if="!isDetailShow">
      <Form ref="searchForm" class="formContainer" :model="searchForm" inline>
        <FormItem>
          <Input v-model="searchForm.searchContent" clearable placeholder="服务号/公司名称" style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.countryCode" @on-change="countryChange" placeholder="税号国家">
            <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.supplierId" placeholder="服务商" style="width:150px;">
            <Option v-for="(item,index) in facilitatorList" :value="item.id" :key="index">{{ item.shortName }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="searchForm.disposeId" clearable placeholder="税务经理">
            <Option v-for="(item,index) in taxManagerList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.companyBody"
                  placeholder="归属公司">
            <Option value="1">跨税云</Option>
            <Option value="2">必胜道</Option>
            <Option value="3">卖家成长</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchList('searchForm')" style="margin: 0 12px;">查询</Button>
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tab">
        <Button type="primary" v-show="hasAuthority('taxInspection_batchClaimTaxManager')" @click="openClaimTaxManagerModal()">修改税务经理</Button>
      </div>
      <div class="tableArea">
        <form-components v-show="hasAuthority('taxInspection_lookSupplier')" @getList="getList" :tableLoading="tableLoading" :tableData="tableData" :columns="columns_showSupplierName" :listTotal="total"  @on-selection-change="selectChange">
          <div slot="title">
            <Tabs class="tabs" :value="searchForm.status" :animated="false" @on-click="tabsChange">
              <TabPane label="全部" name="-1"></TabPane>
              <TabPane label="待处理" name="72"></TabPane>
              <TabPane label="处理中" name="73"></TabPane>
              <TabPane label="已完成" name="74"></TabPane>
              <TabPane label="已取消" name="82"></TabPane>
            </Tabs>
          </div>
        </form-components>
        <form-components v-show="!hasAuthority('taxInspection_lookSupplier')" @getList="getList" :tableLoading="tableLoading" :tableData="tableData" :columns="columns_noShowSupplierName" :listTotal="total"  @on-selection-change="selectChange">
          <div slot="title">
            <Tabs class="tabs" :value="searchForm.status" :animated="false" @on-click="tabsChange">
              <TabPane label="全部" name="-1"></TabPane>
              <TabPane label="待处理" name="72"></TabPane>
              <TabPane label="处理中" name="73"></TabPane>
              <TabPane label="已完成" name="74"></TabPane>
            </Tabs>
          </div>
        </form-components>
      </div>
    </div>
    <div v-else>
      <detail :detailId="detailId" @fresh="fresh" @back="back"></detail>
    </div>
    <!-- 修改税务经理 -->
    <Modal class="modal" v-model="claimTaxManagerModal" :mask-closable="false" :closable="false">
      <div class="text" v-if="claimTaxManagerForm.ids">
        <p v-if="claimTaxManagerForm.type == 2 && claimTaxManagerForm.ids.length > 1">共选择了{{claimTaxManagerForm.ids.length}}条工单</p>
        <p v-if="claimTaxManagerForm.type == 1 || claimTaxManagerForm.ids.length == 1">
          <span>当前税务经理：</span>
          <span>{{claimTaxManagerForm.OldDisposeName}}</span>
        </p>
        <p>
          <span>修改税务经理：</span>
          <Select v-model="claimTaxManagerForm.disposeId" clearable placeholder="税务经理" style="width:200px;">
            <Option v-for="(item,index) in taxManagerModalList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </p>
      </div>
      <div slot="header" class="header">
        <p>修改税务经理</p>
        <Icon class="closeBtn" @click="claimTaxManagerCancel()" type="ios-close" />
      </div>
      <div slot="footer">
        <Button type="default" @click="claimTaxManagerCancel()">取消</Button>
        <Button type="primary" :loading="claimTaxManagerLoading" @click="claimTaxManagerSubmit()">确认</Button>
      </div>
    </Modal>
    <Modal v-model="remarkModal" title="添加备注">
      <div style="width:489px;margin-bottom:10px">
          <Input v-model="remarkObj.remarkComment" type="textarea" placeholder="请输入备注" />
      </div>
      <div style="display:flex;justify-content:center;">
        <span>附件：</span>
        <div>
          <Upload ref="taxFile" 
                  type="drag" 
                  :action="fileUpload" 
                  :data="{ prefix: '' }" 
                  :before-upload="beroreRemarkUpload" 
                  :on-success="remarkUploadSuccess" 
                  :on-remove="removeremark" 
                  style="width:260px"
                  :show-upload-list="false">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div v-if="remarkObj.annex" style="width:300px">
          <a :href="remarkObj.annex" target="_blank">{{ remarkObj.annexName }}</a>
          <Button class="deletBtn" type="text" ghost @click="removeremark">
            <img class="closeImg"
                  src="@/assets/images/activeCloseImg.png"
                  alt="">
          </Button>
        </div>
        </div>
      </div>
      <p style="color:rgb(247, 151, 40);text-align:center;">注：支持JPG、JPEG、PNG、PDF</p>
      <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="remarkModal=false">取消</Button>
          <Button type="primary" @click="sureRemark">确认</Button>
        </p>
    </Modal>
    <Modal v-model="remarkListModal" title="备注信息">
      <div v-if="remarkList.length>0" :class="remarkList.length>3?'overflow':''" style="padding-right: 15px;">
        <div class="remark-list" v-for="(item,index) in remarkList" :key="index">
          <p>
            <span>备注人：</span>
            <span>{{ item.remarkBy }}</span>
          </p>
          <p>
            <span>备注内容：</span>
            <span>{{ item.remarkComment }}</span>
          </p>
          <p v-if="item.annex">
            <span>附件：</span>
            <a :href="item.annex.slice(0,5)=='http:'?item.annex.slice(0,4)+'s'+item.annex.slice(4):item.annex" target="_blank">{{ item.annexName?item.annexName:'附件' }}</a>
          </p>
          <p>
            <span>备注时间：</span>
            <span>{{ item.remarkTime }}</span>
          </p>
          <span class="delet" @click="deletRemarkHandel(item.id,index)">X</span>
        </div>
      </div>
      <div v-else style="text-align:center;font-size:30px;line-height:212px">
        当前服务单无备注
      </div>
      <p slot="footer" style="text-align:center">
        <Button type="primary" ghost @click="remarkListModal=false">关闭</Button>
      </p>
    </Modal>
    <Modal v-model="refuseReasonModal" title="驳回详情">
      <div v-if="refuseReasonList.length>0" :class="refuseReasonList.length>3?'overflow':''" style="padding-right: 15px;">
        <div class="remark-list" v-for="(item,index) in refuseReasonList" :key="index">
          <p>
            <span>驳回人：</span>
            <span>{{ item.refuseBy }}</span>
          </p>
          <p>
            <span>驳回原因：</span>
            <span>{{ item.refuseReason }}</span>
          </p>
          <p>
            <span>驳回时间：</span>
            <span>{{ item.refuseTime }}</span>
          </p>
        </div>
      </div>
      <div v-else style="text-align:center;font-size:30px;line-height:212px">
        当前服务单无驳回
      </div>
      <p slot="footer" style="text-align:center">
        <Button type="primary" ghost @click="refuseReasonModal=false">关闭</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/taxService/adv.js'
import * as API2 from '@/api/taxService/regAndDeclare.js';
import formComponents from "@/view/module/channelManagement/components/formComponents"
import { channelClearingList } from "@/api/taxService/channel.js"
import { taxCheckList, dispose, finish, } from "@/api/taxService/taxModule.js";
import detail from "./detail";
import facilitatorAndTax from '@/view/module/taxService/common/facilitatorAndTax.js';
export default {
  extends: facilitatorAndTax,
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      advModal: false,
      remarkList:[],
      remarkObj:{
        serverNo:'',
        annex:'',
        ids:'',
        annexName:'',
        remarkComment:''
      },
      fileUpload: this.workOrderFile,
      remarkModal:false,
      remarkListModal:false,
      refuseReasonModal:false,
      refuseReasonList:[],
      modalName: '',
      fileUpload: this.workOrderFile,
      fileUploadlist: [],
      fileList: [],
      serviceId: '',
      noteFile: '',
      searchForm: {
        searchContent: '',
        beginTime: '',
        endTime: '',
        status: '-1',
        limit: 10,
        page: 1
      },
      noteForm: {
        content: '',
        file: ''
      },
      detailId: '',
      tableLoading: false,
      noteModal: false,
      messageModal: false,
      tableLoading: false,
      declareStatus: {
        0: '未购买',
        1: '正常',
        2: '待续费',
        3: '注销税号'
      },
      columns_showSupplierName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'serverNo',
          minWidth: 50,
        },
        {
          title: '服务名称',
          render(h, params) {
            let serviceName = '', code = params.row.productFunctionCode;
            serviceName = code == 1 ? '税务注册' : code == 2 ? '税务申报' : code == 3 ? '税务补缴' : code == 4 ? '转代理' : code == 5 ? '注册+申报' : code == 6 ? '注销税号' : code == 7 ? '税务稽查' : ''
            return h('span', serviceName)
          },

        },
        {
          title: '公司名称',
          key: 'companyName',
        },
        {
          title: '国家',
          key: 'countryNameZh'
        },
        {
          title: '服务商',
          key: 'supplierName',
          render:(this.hasAuthority('taxInspection_lookSupplier') ? function(h, params) {
            return h('span',params.row.supplierName)
          } : function(h) {
            return h('span','')
          }),
        },
        {
          title: '服务进度',
          render(h, params) {
            let progressBar = params.row.progressBar == 71 ? '待上传资料' : params.row.progressBar == 72 ? '待处理 ' : params.row.progressBar == 73 ? '处理中' : params.row.progressBar == 74 ? '处理完成' : ''
            return h('span', progressBar)
          },
        },
        {
          title: '归属公司',
          render: (h, params) => {
            let text = '';
            if(params.row.companyBody == '1'){
              text = '跨税云';
            }else if(params.row.companyBody == '2'){
              text = '必胜道';
            }else if(params.row.companyBody == '3'){
              text = '卖家成长';
            }
            return h('span', text)
          }
        },
        {
          title: '税务经理',
          key: 'disposeName',
          render(h, params) {
            return h('span', params.row.disposeName);
          },
        },
        {
          title: '客户手机号',
          key: 'userMobile'
        },
        {
          title: '备注信息',
          key: 'operate',
          render: (h, params) => {
            return h('div', [
              h('span', {
                class:'button',
                on: {
                  click: () => {
                    this.showRemarkList(params.row)
                  }
                }
              }, '【查看】')
            ])
          }
        },
        {
          title: '状态',
          render: (h, params) => {
            let self = this
            return h('span', self.declareStatus[params.row.status])
          }
        },
        {
          title: '操作',
          key: 'operate',
          render: (h, params) => {
            let add = h('p', {
              class: "button",
              on: {
                click: () => {
                  this.toRemark(params.row)
                }
              }
            }, '【添加备注】')
            let detail = h('p', {
              class: "button",
              on: {
                click: () => {
                  this.detailShow(params.row.id)
                }
              }
            }, '【详情】')
            let start = h('p', {
              class: "button",
              on: {
                click: () => {
                  this.start(params.row.id)
                }
              }
            }, '【开始处理】')
            let finish = h('p', {
              class: "button",
              on: {
                click: () => {
                  this.finish(params.row.id)
                }
              }
            }, '【处理完成】')
            switch (params.row.progressBar) {
              case 71:
                return h('div',[detail, add])
                break;
              case 72:
                return h('div',[detail, add, start])
                break;
              case 73:
                return h('div',[detail, add, finish])
                break;
              case 74:
                return h('div',[detail, add])
                break;
            }
          }
        }
      ],
      columns_noShowSupplierName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'serverNo',
          minWidth: 50,
        },
        {
          title: '服务名称',
          render(h, params) {
            let serviceName = '', code = params.row.productFunctionCode;
            serviceName = code == 1 ? '税务注册' : code == 2 ? '税务申报' : code == 3 ? '税务补缴' : code == 4 ? '转代理' : code == 5 ? '注册+申报' : code == 6 ? '注销税号' : code == 7 ? '税务稽查' : ''
            return h('span', serviceName)
          },

        },
        {
          title: '公司名称',
          key: 'companyName',
        },
        {
          title: '国家',
          key: 'countryNameZh'
        },
        {
          title: '服务进度',
          render(h, params) {
            let progressBar = params.row.progressBar == 71 ? '待上传资料' : params.row.progressBar == 72 ? '待处理 ' : params.row.progressBar == 73 ? '处理中' : params.row.progressBar == 74 ? '处理完成' : ''
            return h('span', progressBar)
          },
        },
        {
          title: '归属公司',
          render: (h, params) => {
            let text = '';
            if(params.row.companyBody == '1'){
              text = '跨税云';
            }else if(params.row.companyBody == '2'){
              text = '必胜道';
            }else if(params.row.companyBody == '3'){
              text = '卖家成长';
            }
            return h('span', text)
          }
        },
        {
          title: '税务经理',
          key: 'disposeName',
          render(h, params) {
            return h('span', params.row.disposeName);
          },
        },
        {
          title: '客户手机号',
          key: 'userMobile'
        },
        {
          title: '备注信息',
          key: 'operate',
          render: (h, params) => {
            return h('div', [
              h('span', {
                class:'button',
                on: {
                  click: () => {
                    this.showRemarkList(params.row)
                  }
                }
              }, '【查看】')
            ])
          }
        },
        {
          title: '状态',
          render: (h, params) => {
            let self = this
            return h('span', self.declareStatus[params.row.status])
          }
        },
        {
          title: '操作',
          key: 'operate',
          render: (h, params) => {
            let add = h('p', {
              class: "button",
              on: {
                click: () => {
                  this.toRemark(params.row)
                }
              }
            }, '【添加备注】')
            let detail = h('p', {
              class: "button",
              on: {
                click: () => {
                  this.detailShow(params.row.id)
                }
              }
            }, '【详情】')
            let start = h('p', {
              class: "button",
              on: {
                click: () => {
                  this.start(params.row.id)
                }
              }
            }, '【开始处理】')
            let finish = h('p', {
              class: "button",
              on: {
                click: () => {
                  this.finish(params.row.id)
                }
              }
            }, '【处理完成】')
            switch (params.row.progressBar) {
              case 71:
                return h('div',[detail, add])
                break;
              case 72:
                return h('div',[detail, add, start])
                break;
              case 73:
                return h('div',[detail, add, finish])
                break;
              case 74:
                return h('div',[detail, add])
                break;
            }
          }
        }
      ],
      tableData: [],
      total: 0,
      id: '',

      claimTaxManagerModal: false,
      claimTaxManagerLoading: false,
      claimTaxManagerForm: {},
    }
  },
  mounted() {
    this.getTaxList();
  },
  components: {
    formComponents,
    detail
  },
  methods: {
    saveRemarkList(index){
      this.$Modal.confirm({
          title: '删除提醒',
          content: `<p>您确定要删除该备注吗？</p>`,
          onOk: () => {
            API2.addOrDeletRemark(this.remarkObj).then(res=>{
              if(res.code == 0){
                this.$Message.success('删除成功')
                this.remarkObj.ids = ''
                this.remarkList.splice(index,1)
              }
            })
          },
      });
    },
    deletRemarkHandel(id,index){
      this.remarkObj.ids = id
      // if(this.remarkObj.ids == ''){
      //   this.remarkObj.ids = id
      // }else{
      //   this.remarkObj.ids = this.remarkObj.ids+';'+id
      // }
      this.saveRemarkList(index)
    },
    sureRemark(){
      if(this.remarkObj.remarkComment == ''){
        this.$Message.info('请输入备注内容')
        return
      }
      API2.addOrDeletRemark(this.remarkObj).then(res=>{
        if(res.code == 0){
          this.$Message.success('添加成功')
          this.remarkModal = false
        }
      })
    },
    //备注附件上传之前
    beroreRemarkUpload() {

    },
    //备注附件上传成功
    remarkUploadSuccess(res, file, fileList) {
      this.remarkObj.annex = res.data.fileUrl
      this.remarkObj.annexName = res.data.origFileName
    },
    //移除备注附件
    removeremark(file, fileList) {
      this.remarkObj.annex = ''
      this.remarkObj.annexName = ''
    },
    showRemarkList(row){
      this.remarkObj = {
        serverNo:'',
        annex:'',
        ids:'',
        annexName:'',
        remarkComment:''
      }
      this.remarkObj.serverNo = row.serverNo
      API2.getRemarkList({serverNo:row.serverNo}).then(res=>{
        if(res.code == 0){
          this.remarkList = res.data
          this.remarkListModal = true
        }
      })
    },
    toRemark(row){
      this.remarkObj = {
        serverNo:'',
        annex:'',
        ids:'',
        annexName:'',
        remarkComment:''
      }
      this.remarkObj.serverNo = row.serverNo
      this.remarkModal = true
    },
    showRefuseReason(row){
      API2.getRefuseList({serverNo:row.serverNo}).then(res=>{
        if(res.code == 0){
          this.refuseReasonList = res.data
          this.refuseReasonModal = true
        }
      })
    },
    getList(pageInfo) {
      this.searchForm.page = pageInfo.page
      this.getTaxList()
    },
    detailShow(id) {
      this.detailId = id
      this.isDetailShow = true
    },
    tabsChange(val) {
      this.searchForm = {
        status: val,
        limit: 10,
        page: 1
      },
        this.getTaxList()
    },
    start(id) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否开始处理该稽查服务',
        onOk: () => {
          dispose({ serviceId: id }).then(res => {
            if (res.code === 0) {
              this.$Message.success('处理成功')
              this.getTaxList()
            }
          })
        },
      });
    },
    finish(id) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '该稽查服务是否处理完成',
        onOk: () => {
          finish({ serviceId: id }).then(res => {
            if (res.code === 0) {
              this.$Message.success('处理成功')
              this.getTaxList()
            }
          })
        },
      });
    },
    //获取列表
    getTaxList() {
      this.tableLoading = true;
      taxCheckList(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.total = Number(res.data.total)
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList(type) {
      this.searchForm.page = 1
      this.getTaxList();
    },
    //重置列表
    resetList() {
      this.searchForm = {}
      this.searchForm.searchContent = ''
      this.searchForm.limit = 10
      this.searchForm.page = 1
      this.getTaxList()
    },
    //分页
    changePageHandler(page) {
      this.searchForm.page = page
      this.getTaxList()
    },
    back() {
      this.isDetailShow = false
    },
    fresh() {
      this.searchForm = {
        searchContent: '',
        beginTime: '',
        endTime: '',
        status: '-1',
        limit: 10,
        page: 1
      }
      this.getTaxList()
    },
    successHandler(res, file, fileList) {
      var obj = {
        fileUrl: res.data.fileUrl,
        origFileName: res.data.origFileName
      }
      this.fileUploadlist.push(obj)
      this.noteForm.file = ''
      this.fileUploadlist.forEach(item => {
        this.noteForm.file += item.fileUrl + ";";
      })
    },
    changeModal(form) {
      this.fileUploadlist = []
      this.noteForm.file = ''
      this.noteForm.content = ''

    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.noteFile = "";
      this.fileUploadlist = []
      this.noteForm.file = ''
    },
    removeItem(index) {
      this.noteForm.file = ''
      this.fileUploadlist.splice(index, 1)
      this.fileUploadlist.forEach(item => {
        this.noteForm.file += item.fileUrl + ";"
      })
    },
    addNote(id) {
      this.serviceId = id
      this.noteModal = true
    },
    // 开启修改税务经理弹窗
    openClaimTaxManagerModal(row) {
      // row有值，表示单个，没值表示批量
      let self = this;
      if (row) {
        // self.claimTaxManagerForm.type = 1;
        // self.claimTaxManagerForm.ids = [row.id];
        // self.claimTaxManagerForm.OldDisposeName = row.disposeName;
        let params = {
          serviceId: row.id
        };
        self.$Modal.confirm({
          title: '确定认领吗？',
          content: '',
          onOk: () => {
            self.orderServiceClaimTaxManager(params)
              .then((res) => {
                if (res.code == 0) {
                  self.$Message.success('认领成功！');
                  self.getList();
                }
              })
              .catch((err) => {
                console.log(err);
              })
          },
          onCancel: () => { }
        });
      } else {
        if (this.selectList.length == 0) {
          this.$Message.warning('请先选择要操作的工单！')
          return false;
        }
        self.claimTaxManagerForm.type = 2;
        self.claimTaxManagerForm.ids = self.selectList.map(el => el.id);
        self.claimTaxManagerForm.OldDisposeName = self.selectList[0].disposeName;
        self.claimTaxManagerModal = true;
      }
    },
    // 取消税务经理
    claimTaxManagerCancel() {
      this.claimTaxManagerModal = false;
      this.claimTaxManagerForm = {};
    },
    // 修改税务经理
    claimTaxManagerSubmit() {
      let self = this;
      if (!self.claimTaxManagerForm.disposeId) {
        this.$Message.warning('请选择要修改的税务经理！')
        return false;
      }
      let params = {
        ...this.claimTaxManagerForm,
        disposeName: self.taxManagerModalList.find(el => el.id == self.claimTaxManagerForm.disposeId).name,
        productFunctionCode: '7',
      };
      this.claimTaxManagerLoading = true;
      this.extendsClaimTaxManager(params)
        .then((res) => {
          if (res.code == 0) {
            self.$Message.success('修改成功！');
            self.getList();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          self.claimTaxManagerLoading = false;
          self.selectList = [];
          self.claimTaxManagerCancel();
        });
    },
  }
}
</script>
<style lang="less" scoped>
.deletBtn{
  padding: 0;
}
.closeImg {
  width: 11px;
  height: 11px;
}
/deep/ .ivu-modal-body{
  padding-right: 0;
}
.overflow{
  height: 450px;
  overflow: auto;
}
.remark-list{
  position: relative;
  font-size: 14px;
  border-bottom: 1px solid #666;
  margin-bottom: 20px;
  padding-bottom: 10px;
  word-break: break-all;
  white-space: pre-wrap;
  p{
    width: 90%;
  }
  .delet{
    position: absolute;
    color: red;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    top: 0;
    right: 0;
  }
}
.invoiceList {
  // background: #ffffff;
  min-height: 100vh;
  padding: 20px;
  .tableArea {
    .operateBtn {
      cursor: pointer;
    }
    .tabs {
      /deep/ .ivu-tabs-bar {
        margin-bottom: 0px;
        padding-bottom: -10px;
        border: none;
      }
    }
  }
}
.messageContent {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #f2f2f2;
}
.container {
  background: #fff;
  padding: 15px;
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 15px;
  }
  .button {
    color: #2d8cf0;
    cursor: pointer;
  }
}
.formContainer {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.supplierName {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    cursor: pointer;
    margin-left: 10px;
    font-size: 16px;
  }
}
.tab {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}
.modal {
  /deep/ .ivu-modal-header {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .closeBtn {
      font-size: 31px;
      cursor: pointer;
    }
  }
  /deep/ .ivu-transfer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .ivu-table-wrapper {
    overflow: visible;
  }

  .text {
    p {
      height: 40px;
      line-height: 40px;
    }
  }
}
.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /deep/ .ivu-btn {
    margin: 5px 0;
  }
}
/deep/ .ivu-table-cell {
  .button {
    color: #2d8cf0;
    cursor: pointer;
  }
}
</style>