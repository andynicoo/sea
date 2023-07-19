<template>
  <div class="container">
    <div class="mainPage" v-if="!isDetailShow">
      <Form ref="searchForm" class="formContainer" :model="searchForm" inline>
        <FormItem>
          <Input v-model="searchForm.searchContent" clearable placeholder="公司名称/手机号/服务号" style="width:200px;" />
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
          <DatePicker type="daterange" :value="[this.searchForm.createTimeBegin, this.searchForm.createTimeEnd]" @on-change="searchFormDataChange" placeholder="请选择时间" style="width: 200px"></DatePicker>
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
          <Button type="primary" @click="searchList" style="margin: 0 12px;">查询</Button>
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tab">
        <Button type="primary" v-if="['39','40'].includes(searchForm.status)" style="margin-right:10px;" v-show="hasAuthority('hyCertification_batchEditSupplier')" @click="openEditSupplierModal()">修改服务商</Button>
        <Button type="primary" style="margin-right:10px;" v-show="hasAuthority('hyCertification_batchClaimTaxManager')" @click="openClaimTaxManagerModal()">修改税务经理</Button>
      </div>
      <div class="tableArea">
        <Tabs :value="searchForm.status" :animated="false" @on-click="tabsChange">
          <TabPane label="全部" name="-1"></TabPane>
          <TabPane label="待上传资料" name="39"></TabPane>
          <TabPane label="待审核" name="40"></TabPane>
          <TabPane label="待海牙认证" name="5"></TabPane>
          <TabPane label="海牙认证中" name="41"></TabPane>
          <TabPane label="认证完成" name="42"></TabPane>
          <TabPane label="资料驳回" name="43"></TabPane>
          <TabPane label="已取消" name="82"></TabPane>
        </Tabs>
        <Table border :loading="tableLoading" :columns="columns" :data="tableData" @on-selection-change="selectChange">
          <template slot="operate" slot-scope="{ row }">
            <Button type="primary" ghost size="small" @click="toDetail(row)" style="margin-right:5px">查看</Button>
            <Button type="primary" ghost size="small" v-show="hasAuthority('hyCertification_remark')" @click="toRemark(row)">备注</Button>
          </template>
          <template slot="supplierName" slot-scope="{ row }">
            <div class="supplierName">
              <span v-show="hasAuthority('hyCertification_lookSupplier')">{{row.supplierName}}</span>
              <Icon v-if="[39,40].includes(row.progressBar)" class="icon" type="md-create" v-show="hasAuthority('hyCertification_editSupplier')" @click="openEditSupplierModal(row)"></Icon>
            </div>
          </template>
          <template slot="disposeName" slot-scope="{ row }">
            <div class="disposeName">
              <span v-if="row.disposeId">{{row.disposeName}}</span>
              <span v-if="!row.disposeId" class="button" v-show="hasAuthority('hyCertification_claimTaxManager')" @click="openClaimTaxManagerModal(row)">认领</span>
            </div>
          </template>
          <template slot="remarkContent" slot-scope="{ row }">
            <span style="color:rgb(22, 173, 233);cursor:pointer;" @click="showRemarkList(row)">查看</span>
          </template>
          <template slot="refuseReason" slot-scope="{ row }">
            <span style="color:rgb(22, 173, 233);cursor:pointer;" @click="showRefuseReason(row)">查看</span>
          </template>
        </Table>
        <Page @on-change="changePageHandler" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator />
      </div>
    </div>
    <!-- 修改服务商 -->
    <Modal class="modal" v-model="editSupplierModal" :mask-closable="false" :closable="false">
      <div class="text" v-if="editSupplierForm.ids">
        <p v-if="editSupplierForm.type == 2 && editSupplierForm.ids.length > 1">共选择了{{editSupplierForm.ids.length}}条工单</p>
        <p v-if="editSupplierForm.type == 1 || editSupplierForm.ids.length == 1">
          <span>当前服务商：</span>
          <span>{{editSupplierForm.supplierName}}</span>
        </p>
        <p>
          <span>修改服务商：</span>
          <Select clearable v-model="editSupplierForm.supplierId" placeholder="服务商" style="width:200px;">
            <Option v-for="(item,index) in editSupplierForm.facilitatorList" :value="item.id" :key="index">{{ item.shortName }}</Option>
          </Select>
        </p>
        <!-- <p style="color:red;">提示：更改服务商后，资料模板也将更新，客户需要重新提交资料，请谨慎操作！</p> -->
      </div>
      <div slot="header" class="header">
        <p>修改服务商</p>
        <Icon class="closeBtn" @click="editSupplierCancel()" type="ios-close" />
      </div>
      <div slot="footer">
        <Button type="default" @click="editSupplierCancel()">取消</Button>
        <Button type="primary" :loading="editSupplierLoading" @click="editSupplierSubmit()">确认</Button>
      </div>
    </Modal>
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
          <span class="delet" @click="deletRemarkHandel(item.id,index)" v-show="hasAuthority('hyCertification_deletRemark')">X</span>
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
    <Details v-if="isDetailShow && detailObj!=null" :serviceId="serviceId" :detailObj="detailObj" @back="closeDetails" @refresh="getList"></Details>
  </div>
</template>
<script>
import Details from './detail'
import * as API from '@/api/taxService/hague.js';
import * as API2 from '@/api/taxService/regAndDeclare.js';
import * as extendsAPI from "@/api/extends/facilitatorAndTax";
import facilitatorAndTax from '@/view/module/taxService/common/facilitatorAndTax.js';
export default {
  extends: facilitatorAndTax,
  name: 'mainList',
  components: {
    Details
  },
  data() {
    return {
      detailObj: null,
      isDetailShow: false,
      searchForm: {
        status: '-1',
        searchContent: '',
        countryCode: 'ES',
        createTimeBegin: '',
        createTimeEnd: ''
      },
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
      countryList: [],
      tableLoading: false,
      columns_showSupplierName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'serverNo',
        },
        {
          title: '状态',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
          }
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80
        },
        {
          title: '服务商',
          slot: 'supplierName'
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '服务名称',
          key: 'productFunctionCode',
          render(h, params) {
            let serviceName = '', code = params.row.productFunctionCode;
            serviceName = code == 13 ? '海牙认证' : ''
            return h('span', serviceName)
          },
        },
        {
          title: '客户手机号',
          key: 'userMobile',
          width: 114
        },
        {
          title: '创建时间',
          key: 'createTime'
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
          slot: 'disposeName',
        },
        {
          title: '备注',
          slot: 'remarkContent',
        },
        {
          title: '驳回原因',
          slot: 'refuseReason',
        },
        {
          title: '操作',
          slot: 'operate'
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
        },
        {
          title: '状态',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
          }
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '服务名称',
          key: 'productFunctionCode',
          render(h, params) {
            let serviceName = '', code = params.row.productFunctionCode;
            serviceName = code == 13 ? '海牙认证' : ''
            return h('span', serviceName)
          },
        },
        {
          title: '客户手机号',
          key: 'userMobile',
          width: 114
        },
        {
          title: '创建时间',
          key: 'createTime'
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
          slot: 'disposeName',
        },
        {
          title: '备注',
          slot: 'remarkContent',
        },
        {
          title: '驳回原因',
          slot: 'refuseReason',
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      tableData: [],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      workId: '',
      progressBar: '',
      serviceId: '',
      progressStatus: {
        39: '待上传资料',
        40: '待审核',
        5: '待海牙认证',
        41: '海牙认证中',
        42: '认证完成',
        43: '资料驳回'
      },

      editSupplierModal: false,
      editSupplierLoading: false,
      editSupplierForm: {},

      claimTaxManagerModal: false,
      claimTaxManagerLoading: false,
      claimTaxManagerForm: {},
    }
  },
  computed: {
    roles() {
      return this.$store.state.user.roles;
    },
    columns(){
      if(this.hasAuthority('hyCertification_lookSupplier')){
        return this.columns_showSupplierName;
      }else{
        return this.columns_noShowSupplierName;
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    showRefuseReason(row){
      API2.getRefuseList({serverNo:row.serverNo}).then(res=>{
        if(res.code == 0){
          this.refuseReasonList = res.data
          this.refuseReasonModal = true
        }
      })
    },
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
        annexName:'',
        ids:'',
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
        annexName:'',
        ids:'',
        remarkComment:''
      }
      this.remarkObj.serverNo = row.serverNo
      this.remarkModal = true
    },
    // closeDetails
    closeDetails(){
      this.isDetailShow = false
      this.searchList();
    },
    searchFormDataChange(val) {
      this.searchForm.createTimeBegin = val[0]
      this.searchForm.createTimeEnd = val[1]
    },
    // 根据国家获取服务商下拉
    countryChange(countryCode) {
      let self = this;
      if (!!countryCode) {
        let params = {
          countryCode,
          supplierType: 3, //注册和转代理都是vat
        };
        extendsAPI.getSupplierCondition(params)
          .then((res) => {
            if (res.code == 0) {
              self.facilitatorList = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      } else {
        self.facilitatorList = [];
        self.searchForm.supplierId = '';
      }
    },
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo }
      if (params.status == -1) params.status = ''
      API.getHagueList(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getList();
    },
    //重置列表
    resetList() {
      this.searchForm = {
        status: '-1',
        searchContent: '',
        countryCode: '',
        createTimeBegin: '',
        createTimeEnd: ''
      },
        this.pageInfo = {
          limit: 10,
          page: 1,
        },
        this.getList()
    },
    //选择tab状态
    tabsChange(name) {
      this.searchForm.status = name;
      this.pageInfo.page = 1;
      this.getList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getList();
    },
    //查看详情
    toDetail(row) {
      // 如果当前用户是税务经理，且税务经理未认领，不可查看详情
      if (!row.disposeId && this.roles.some(el => el.roleCode == 'tax_commissioner')) {
        this.$Message.warning('该工单未认领！');
        return false;
      }
      this.isDetailShow = true;
      this.detailObj = row
      this.serviceId = row.id;
    },

    // 开启修改服务商弹窗
    openEditSupplierModal(row) {
      // row有值，表示单个，没值表示批量
      let self = this;
      let params = {};
      if (row) {
        if (![39, 40].includes(row.progressBar)) {
          this.$Message.warning('仅进度为待上传注册资料和待审核的工单可以修改服务商！')
          return false;
        }
        params = {
          countryCode: row.countryCode,
          supplierType: 3,
        };
        self.editSupplierForm.type = 1;
        self.editSupplierForm.ids = [row.id];
        self.editSupplierForm.supplierName = row.supplierName;
      } else {
        if (this.selectList.length == 0) {
          this.$Message.warning('请先选择要操作的工单！')
          return false;
        }
        if (this.selectList.some(el => ![39,40].includes(el.progressBar))) {
          this.$Message.warning('仅进度为待上传注册资料和待审核的工单可以修改服务商！')
          return false;
        }
        if (this.selectList.some(el => el.countryCode != this.selectList[0].countryCode)) {
          this.$Message.warning('仅支持同一个国家的工单批量修改服务商，请重新选择！')
          return false;
        }
        params = {
          countryCode: self.selectList[0].countryCode,
          supplierType: 3,
        };
        self.editSupplierForm.type = 2;
        self.editSupplierForm.ids = self.selectList.map(el => el.id);
        self.editSupplierForm.supplierName = self.selectList[0].supplierName;
      }
      self.editSupplierForm.countryCode = params.countryCode;
      extendsAPI.getSupplierCondition(params)
        .then((res) => {
          if (res.code == 0) {
            self.editSupplierModal = true;
            self.editSupplierForm.facilitatorList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    // 取消修改
    editSupplierCancel() {
      this.editSupplierModal = false;
      this.editSupplierForm = {};
    },
    // 修改服务商
    editSupplierSubmit() {
      let self = this;
      if (!self.editSupplierForm.supplierId) {
        this.$Message.warning('请选择要修改的服务商！')
        return false;
      }
      let params = {
        ...this.editSupplierForm,
        productFunctionCode: '13',
        supplierType:3,
      };
      this.editSupplierLoading = true;
      this.extendsEditSupplier(params)
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
          self.editSupplierLoading = false;
          self.selectList = [];
          self.editSupplierCancel();
        });
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
        productFunctionCode: '13',
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
  .button {
    color: #2d8cf0;
    cursor: pointer;
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
</style>