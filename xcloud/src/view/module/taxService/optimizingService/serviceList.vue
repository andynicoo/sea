<template>
    <div class="invoiceList">
        <div class="mainPage" >
            <Form ref="searchForm" :model="searchForm" inline>
                <FormItem>
                    <Input v-model="searchForm.categoryName" clearable  placeholder="请输入类目名称" style="width:240px;"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="searchList" style="margin-right:5px;">查询</Button>
                    <Button type="primary" ghost @click="resetList">重置</Button>
                </FormItem>
                <FormItem style="float:right;">
                    <Button type="primary" @click="addAdvFun()" style="margin-right:5px;">新增优选类目</Button>
                </FormItem>
            </Form>
            <div class="tableArea">
                <Table
                    border 
                    :loading="tableLoading"
                    :columns="columns"
                    :data="tableData"
                >
                <template slot="operate" slot-scope="{ row }">
                    <span class="operateBtn" @click="toDeatil(row)">【编辑】</span>
                    <span class="operateBtn" @click="addService(row)">【新增服务商】</span>
                </template>
                <template slot="status" slot-scope="{ row }"> 
                    <i-switch
                        :value="row.status"
                        @on-change="switchStatus(row)"
                        size="large"
                    >
                        <span slot="open">启用</span>
                        <span slot="close">禁用</span>
                    </i-switch>
                </template>
                <template slot="categoryPicture" slot-scope="{ row }" >
                    <div style="text-align:center;">
                        <img style="width:100px;height:100px;" :src="row.categoryPicture" alt="">
                    </div>
                </template>
                <template slot="serviceCount" slot-scope="{ row }"> 
                    <span style="cursor: pointer;" @click="showServiceProviders(row)">{{row.serviceCount}}</span>
                </template>
                </Table>
                <Page
                    @on-change="changePageHandler"
                    :current="pageInfo.page"
                    :total="listTotal"
                    :page-size="pageInfo.limit"
                    show-total
                    show-elevator
                />
            </div>
        </div>
        <Modal v-model="advModal" :title="advTitle">
            <Form ref="addModalForm" :model="addForm" :label-width="100"  inline>
                <Row>
                    <FormItem label="优选类目名称" prop="advertiseName">
                        <Input v-model="addForm.categoryName" clearable  :maxlength="10"  placeholder="请输入优选类目名称，最多可输入10字符" style="width:240px;"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="类目介绍" prop="advertiseName">
                        <Input type="textarea" :maxlength="20" v-model="addForm.categorySummary" clearable  placeholder="请输入类目介绍，最多可输入20字符" style="width:240px;"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="类目排序" prop="rank">
                        <Input type="number" v-model="addForm.rank" clearable  placeholder="请输入类目序号,数字越大，排序越靠后，只可输入数字" style="width:240px;"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="类目图片" prop="categoryPicture">
                        <Upload
                            ref="taxFile"
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :format="['jpg','jpeg','png','svg']"
                            :before-upload="beroreTaxUpload"
                            :on-success="taxUploadSuccess"
                            :on-remove="removetax"
                            style="width:260px"
                            :disabled='isEdit'
                            >
                            <div style="padding: 10px 0">
                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                <span>请拖拽文件到此区域上传或点击上传</span>
                            </div>
                        </Upload>
                        <div v-if="addForm.categoryPicture !=='' && isEdit" >
                            <a :href="addForm.categoryPicture" target="_blank" >类目图片</a><Icon v-if="isEdit" type="ios-close-circle" @click.stop="removeHandler('category')"/>
                        </div>
                    </FormItem>
                </Row>
            </Form>
            <p slot="footer">
                <Button type="primary" ghost style="margin-right:20px;" @click="advModal=false">取消</Button>
                <Button type="primary" @click="sureUploadTax('addModalForm')">确认</Button>
            </p>
        </Modal>
        <Modal v-model="serviceModal" :title="serviceTitle">
            <Form ref="addServiceModalForm" :model="serviceProvidersForm" :label-width="100"  inline>
                <Row>
                    <FormItem label="服务商名称" prop="advertiseName">
                        <Input v-model="serviceProvidersForm.serviceName" :maxlength="20" clearable  placeholder="请输入服务商名称，最多不超过20个字符" style="width:240px;"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="服务介绍" prop="advertiseName">
                        <Input type="textarea" :maxlength="100" v-model="serviceProvidersForm.serviceSummary" clearable  placeholder="请输入服务介绍，最多不超过100个字符" style="width:240px;"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="服务网址" prop="advertiseName">
                        <Input v-model="serviceProvidersForm.serviceUrl" clearable  placeholder="请输入服务网址" style="width:240px;"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="类目排序" prop="rank">
                        <Input type="number" v-model="serviceProvidersForm.rank" clearable  placeholder="请输入类目序号,数字越大，排序越靠后，只可输入数字" style="width:240px;"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="服务商LOGO" prop="categoryPicture">
                        <Upload
                            ref="taxFile"
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :format="['jpg','jpeg','png','svg']"
                            :before-upload="beroreTaxUploadService"
                            :on-success="taxUploadSuccessService"
                            :on-remove="removetaxService"
                            style="width:260px"
                            :disabled='isEdit'
                            >
                            <div style="padding: 10px 0">
                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                <span>请拖拽文件到此区域上传或点击上传</span>
                            </div>
                        </Upload>
                        <div v-if="serviceProvidersForm.serviceLogo !=='' && isEdit" >
                            <a :href="serviceProvidersForm.serviceLogo" target="_blank" >服务商图片</a><Icon v-if="isEdit" type="ios-close-circle" @click.stop="removeHandler('service')"/>
                        </div>
                    </FormItem>
                </Row>
            </Form>
            <p slot="footer">
                <Button type="primary" ghost style="margin-right:20px;" @click="serviceModal=false">取消</Button>
                <Button type="primary" @click="sureUploadService()">确认</Button>
            </p>
        </Modal>
        <Modal v-model="serviceListModal" width="1000" title="服务商列表">
            <Table
                border 
                :loading="tableLoading"
                :columns="columnsService"
                :data="serviceData"
            >
                <template slot="operate" slot-scope="{ row }">
                    <span class="operateBtn" style="cursor: pointer;" @click="editService(row)">【编辑】</span>
                    <span class="operateBtn" style="cursor: pointer;" @click="removeService(row)">【删除服务商】</span>
                </template>
                <template slot="serviceLogo" slot-scope="{ row }" >
                    <div style="text-align:center;">
                        <img style="width:100px;height:100px;" :src="row.serviceLogo" alt="">
                    </div>
                </template>
            </Table>
        </Modal>
    </div>
</template>
<script>
import * as API from '@/api/taxService/optimizingService.js';
export default {
    name: 'orderList',
    data() {
        return {
            advModal:false,
            fileUpload: this.workOrderFile,
            serviceListModal: false,
            searchForm: {
                categoryName: '',
            },
            addForm: {
                categoryName: '',
                categoryPicture: '',
                categorySummary: '',
                rank: '',
            },
            serviceModal: false,
            serviceProvidersForm: {
                serviceName: '',
                serviceSummary: '',
                serviceUrl: '',
                serviceLogo: '',
                rank: '',
            },
            date: '',
            pageInfo: {
                limit: 10,
                page: 1,
            },
            listTotal: 0,
            tableLoading: false,
            advTitle: '新增优选类目',
            serviceTitle: '新增服务商',
            addformRules: {
                advertiseName: [
                    { required: true, message: '广告名称不能为空', trigger: 'blur' }
                ],
                channelType: [
                    { required: true, message: '系统类型不能为空', trigger: 'blur' }
                ],
                advertiseType: [
                    { required: true, message: '广告类型不能为空', trigger: 'blur' }
                ],
                rank: [
                    { required: true, message: '排序不能为空', trigger: 'blur' }
                ],
                advertiseUrl: [
                    { required: true, message: '链接不能为空', trigger: 'blur' }
                ],
                categoryPicture: [
                    { required: true, message: '请上传图片', trigger: 'blur' }
                ],
                advertiseStatus: [
                    { required: true, message: '请选择是否启用', trigger: 'blur' }
                ]
            },
            columnsService: [
               {
                    title: '序号',
                    type: 'index',
                    width: 50
                },
                {
                    title: '服务商名称',
                    key: 'serviceName',
                    minWidth:50,
                },
                {
                    title:'服务介绍',
                    key:'serviceSummary'
                },
                {
                    title:'图片',
                    slot:'serviceLogo'
                },
                {
                    title: '服务网址',
                    key: 'serviceUrl'
                },
                {
                    title: '操作',
                    slot: 'operate'
                }
            ],
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 50
                },
                {
                    title: '类目名称',
                    key: 'categoryName',
                    minWidth:50,
                },
                {
                    title:'类目介绍',
                    key:'categorySummary'
                },
                {
                    title:'类目图片',
                    slot:'categoryPicture'
                },
                {
                    title: '服务商数量',
                    slot: 'serviceCount'
                },
                {
                    title: '创建时间',
                    key: 'createTime'
                },
                {
                    title: '是否开启',
                    slot: 'status'
                },
                {
                    title: '操作',
                    slot: 'operate'
                }
            ],
            serviceData: [],
            tableData:[],
            id: '',
            isEdit: false
        }
    },
    mounted() {
        this.getAdvList();
    },
    components: {
    },
    methods: {
        //获取列表
        getAdvList() {
            this.tableLoading = true;
            let params = {...this.searchForm, ...this.pageInfo};
            API.getCategoryList(params).then((res) => {
                if(res.code == 0) {
                    this.tableLoading = false;
                    this.tableData = res.data.records;
                    this.listTotal = Number(res.data.total);
                    this.tableData.forEach(element => {
                        if (element.status === 1) element.status = false
                        if (element.status === 0) element.status = true
                    });
                }else {
                    this.$Message.warning(res.message);
                    this.tableLoading = false
                }
            })
            .catch((err) => console.log(err))
        },
        //搜索列表
        searchList() {
            this.pageInfo.page = 1;
            this.getAdvList()
        },
        showServiceProviders(row) {
            this.serviceListModal = true
            this.tableLoading = true;
            this.getService(row)
        },
        getService(row) {
            API.serviceList({categoryId: row.id}).then((res) => {
                if(res.code == 0) {
                    this.tableLoading = false;
                    this.serviceData = res.data;
                    this.listTotal = Number(res.data.total);
                }else {
                    this.$Message.warning(res.message);
                    this.tableLoading = false
                }
            })
            .catch((err) => console.log(err))
        },
        // 添加服务商
        addService(row) {
            this.serviceProvidersForm = {
                serviceName: '',
                serviceSummary: '',
                serviceUrl: '',
                serviceLogo: '',
                rank: '',
            }
            this.serviceTitle = '新增服务商'
            this.serviceId = row.id
            this.isEdit = false
            this.serviceModal = true
        },
        // 编辑服务商
        editService(row) {
            this.serviceModal = true
            this.$refs['addServiceModalForm'].resetFields()
            this.isEdit = true 
            this.serviceTitle = '编辑服务商'
            this.serviceProvidersForm = JSON.parse(JSON.stringify(row))
        },
        //新增优选类目
        addAdvFun() {
            this.advTitle = '新增优选类目'
            this.isEdit = false
            this.addForm = {
                categoryName: '',
                categoryPicture: '',
                categorySummary: '',
                rank: '',
            }
            this.advModal = true
        },
        // 编辑优选类目
        toDeatil(row) {
            if (row.status === false) row.status = 1
            if (row.status === true) row.status = 0
            this.$refs['addModalForm'].resetFields()
            this.advTitle = '编辑优选类目'
            this.addForm = JSON.parse(JSON.stringify(row))
            this.isEdit = true
            this.advModal = true
        },
        switchStatus(val) {
            if (val.status === false) val.status = 0
            if (val.status === true) val.status = 1
            API.addSaveOrUpdate(val).then(res =>{
                if (res.code === 0) {
                    this.$Message.success('服务操作成功')
                    this.getAdvList()
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        //重置列表
        resetList() {
            this.searchForm = {
                categoryName: '',
            };
            this.pageInfo.page = 1;
            this.getAdvList()
        },
        //分页
        changePageHandler(page) {
            this.pageInfo.page = page
            this.getAdvList()
        },
        //上传之前
        beroreTaxUpload() {
            let self = this;
            const check1 = self.addForm.categoryPicture == "";
            if (!check1) {
                self.$Notice.warning({
                title: "最多只可上传1个文件"
                });
            }
            return check1
        },
        beroreTaxUploadService() {
            let self = this;
            const check2 = self.serviceProvidersForm.serviceLogo == "";
            if (!check2) {
                self.$Notice.warning({
                title: "最多只可上传1个文件"
                });
            }
            return check2
        },
        //上传成功
        taxUploadSuccess(res,file,fileList) {
           this.addForm.categoryPicture = res.data.fileUrl;
        },
        //移除图片
        removetax(res, file,fileList) {
            this.addForm.categoryPicture = '';
        },
        removeHandler(type) {
            this.isEdit = false
            if (type === 'category') this.addForm.categoryPicture = '';
            if (type === 'service')  this.serviceProvidersForm.serviceLogo = '';
        },
        //上传成功
        taxUploadSuccessService(res,file,fileList) {
            this.serviceProvidersForm.serviceLogo = res.data.fileUrl;
        },
        //移除图片
        removetaxService(res, file,fileList) {
            this.serviceProvidersForm.serviceLogo = '';
        },
        // 删除广告
        removeAdv(row) {
            this.id = row.id
            this.$Modal.confirm({
                title: '温馨提醒',
                content: '<p>是否删除该广告</p>',
                onOk: () => {
                    API.removeAdv({
                        id: row.id
                    }).then(res => {
                        if (res.code === 0) {
                            this.$Message.success('广告删除成功')
                            this.getAdvList()
                        }
                    })
                }
            });
        },
        // 新增服务
        sureUploadTax() {
            if(this.addForm.categoryName==''){
                this.$Message.info('优选类目名称不能为空')
                return
            }
            if(this.addForm.channelType===''){
                this.$Message.info('类目介绍不能为空')
                return
            }
            if(this.addForm.rank==='' || this.addForm.rank < 0){
                this.$Message.info('排序输入有误')
                return
            }
            if(this.addForm.categoryPicture === ''){
                this.$Message.info('图片不能为空')
                return
            }
            API.addSaveOrUpdate(this.addForm).then(res =>{
                if (res.code === 0) {
                    this.$Message.success('类目操作成功')
                    this.advModal = false
                    this.getAdvList()
                }
            }).catch(err=>{
                console.log(err)
            })
           
        },
        // 新增/编辑服务商
        sureUploadService () {
            this.isEdit = false
            if(this.serviceProvidersForm.serviceName==''){
                this.$Message.info('服务商不能为空')
                return
            }
            if(this.serviceProvidersForm.serviceSummary===''){
                this.$Message.info('服务介绍不能为空')
                return
            }
            if(this.serviceProvidersForm.rank ==='' ||  this.serviceProvidersForm.rank < 0){
                this.$Message.info('排序输入有误')
                return
            }
            if(this.serviceProvidersForm.serviceLogo === ''){
                this.$Message.info('图片不能为空')
                return
            }
            if(this.serviceProvidersForm.serviceUrl === ''){
                this.$Message.info('服务网址不能为空')
                return
            }
            let data = {...{categoryId: this.serviceId}, ...this.serviceProvidersForm}
            API.addService(data).then(res =>{
                if (res.code === 0) {
                    this.$Message.success('服务商操作成功')
                    this.serviceModal = false
                    this.serviceListModal = false
                    this.getAdvList()
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        // 删除服务商
        removeService(row) {
            this.$Modal.confirm({
                title: '温馨提醒',
                content: '<p>是否删除该服务商</p>',
                onOk: () => {
                    API.removeService({
                        id: row.id
                    }).then(res =>{
                        if (res.code === 0) {
                            this.$Message.success('服务商删除成功')
                            this.getService(row)
                            this.getAdvList()
                        }
                    }).catch(err=>{
                        console.log(err)
                    }) 
                }
            });
        }
    }
}
</script>
<style lang="less" scoped>
    .invoiceList {
        .tableArea {
            .operateBtn {
                cursor: pointer;
            }
        }
    }
</style>