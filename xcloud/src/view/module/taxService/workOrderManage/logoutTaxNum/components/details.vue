<template>
    <div>
        <div class="back" @click="goBack()"><Icon type="md-arrow-back" />返回列表</div>
        <div class="content">
            <div class="content-l">
                <Card>
                    <p slot="title" class="companyTitleBox">
                        <span>{{orderServices.progressBar==51?'待上传资料':orderServices.progressBar==52?'待审核':orderServices.progressBar==53?'注销中':orderServices.progressBar==54?'已完成':orderServices.progressBar==55?'资料驳回':orderServices.progressBar==56?'注销失败':''}}</span>
                        <span v-if="orderServices.progressBar==51||orderServices.progressBar==55||orderServices.progressBar==56">
                            <!-- <Button type="primary" @click="submitFormFun" v-if="orderServices.progressBar==51||orderServices.progressBar==55">提交审核</Button>
                            <Button type="primary" @click="submitFormFun" v-if="orderServices.progressBar==56">重新提交</Button> -->
                        </span>
                        <span v-if="orderServices.progressBar==52">
                            <!-- <Button @click="uploadFile">下载资料</Button> -->
                            <Button type="primary" @click="auditModal=true" style="margin-left:8px;">审核</Button>
                        </span>
                        <span v-if="orderServices.progressBar==53">
                            <!-- <Button @click="uploadFile">下载资料</Button> -->
                            <Button type="primary" @click="cancelErrorBox=true" style="margin:0 8px;">注销失败</Button>
                            <Button type="primary" @click="sureSuccessBox=true">完成注销</Button>
                        </span>
                    </p>
                    <div class="companyInfo">
                        <Form ref="submitForm" :model="submitForm" :label-width="160">
                            <FormItem label="注销税号国家：" class="requiredItem">
                                <Input disabled v-model="submitForm.countryNameZh" style="width:300px;" />
                            </FormItem>
                            <FormItem label="公司中文名称：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入公司中文名称" v-model="submitForm.companyNameZh" style="width: 300px" />
                            </FormItem>
                            <FormItem label="公司英文名称：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入公司英文名称" v-model="submitForm.companyNameEn" style="width: 300px" />
                            </FormItem>
                            <FormItem label="VAT税号：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入报税税号" v-model="submitForm.vatTaxNumber" style="width: 300px" />
                            </FormItem>
                            <FormItem label="最后一次申报日期：" prop="lastDeclareDate" class="requiredItem">
                                <DatePicker
                                    type="date"
                                    placeholder="请选择最后一次申报日期"
                                    v-model="submitForm.lastDeclareDate"
                                    format="yyyy-MM-dd"
                                    class="tax-date"
                                    :disabled="!isCompanyInfoEdit"
                                    style="width: 300px"
                                ></DatePicker>
                            </FormItem>
                             <FormItem label="注销开始日期：" prop="calcelBeginDate" class="requiredItem">
                                <DatePicker
                                    type="date"
                                    placeholder="请选择注销开始日期"
                                    v-model="submitForm.calcelBeginDate"
                                    format="yyyy-MM-dd"
                                    class="tax-date"
                                    :disabled="!isCompanyInfoEdit"
                                    style="width: 300px"
                                ></DatePicker>
                            </FormItem>
                            <FormItem label="店铺业务范围：" prop="companyBusinessModeDescribe" class="requiredItem">
                                <Input v-model="submitForm.companyBusinessModeDescribe" placeholder="请输入店铺业务范围"  type="textarea" :disabled="!isCompanyInfoEdit" :rows="4" style="width: 300px"></Input>
                            </FormItem>
                            <p>文件信息</p>
                            <FormItem label="税号证书：" class="requiredItem">
                                <Upload
                                    type="drag"
                                    :action="fileUpload"
                                    :data="{ prefix: '' }"
                                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxLocalFile')}"
                                    :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxLocalFile')}"
                                    :format="['jpg','jpeg','png','gif','pdf']"
                                    style="width:300px"
                                    :disabled='!isCompanyInfoEdit'
                                    :show-upload-list="false"
                                    >
                                    <div style="padding: 10px 0">
                                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                        <span v-if="submitForm.vatTaxLocalFile==''">请拖拽文件到此区域上传或点击上传</span>
                                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                                    </div>
                                </Upload>
                                <div v-if="submitForm.vatTaxLocalFile!=''">
                                    <a :href="submitForm.vatTaxLocalFile" target="_blank" >{{'税号证书'}}</a><Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxLocalFile')"/>
                                </div>
                            </FormItem>
                             <FormItem label="DE欧盟证书：" class="requiredItem" v-if="orderServices.countryNameZh=='德国'">
                                <Upload
                                    type="drag"
                                    :action="fileUpload"
                                    :data="{ prefix: '' }"
                                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxEuFile')}"
                                    :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxEuFile')}"
                                    :format="['jpg','jpeg','png','gif','pdf']"
                                    style="width:300px"
                                    :disabled='!isCompanyInfoEdit'
                                    :show-upload-list="false"
                                    >
                                    <div style="padding: 10px 0">
                                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                        <span v-if="submitForm.vatTaxEuFile==''">请拖拽文件到此区域上传或点击上传</span>
                                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                                    </div>
                                </Upload>
                                <div v-if="submitForm.vatTaxEuFile!=''">
                                    <a :href="submitForm.vatTaxEuFile" target="_blank" >{{'DE欧盟证书'}}</a><Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxEuFile')"/>
                                </div>
                            </FormItem>
                            <FormItem label="税务副本：" class="requiredItem" v-if="orderServices.countryNameZh=='德国'">
                                <Upload
                                    type="drag"
                                    :action="fileUpload"
                                    :data="{ prefix: '' }"
                                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxFileCopy')}"
                                    :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxFileCopy')}"
                                    :format="['jpg','jpeg','png','gif','pdf']"
                                    style="width:300px"
                                    :disabled='!isCompanyInfoEdit'
                                    :show-upload-list="false"
                                    >
                                    <div style="padding: 10px 0">
                                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                        <span v-if="submitForm.vatTaxFileCopy==''">请拖拽文件到此区域上传或点击上传</span>
                                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                                    </div>
                                </Upload>
                                <div v-if="submitForm.vatTaxFileCopy!=''">
                                    <a :href="submitForm.vatTaxFileCopy" target="_blank" >{{'税务副本'}}</a><Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxFileCopy')"/>
                                </div>
                            </FormItem>
                            <FormItem label="其他证明文件：" class="requiredItem">
                                <Upload
                                    type="drag"
                                    :action="fileUpload"
                                    :data="{ prefix: '' }"
                                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'otherFile')}"
                                    :on-remove="(file,fileList)=>{removeHandler(file,fileList,'otherFile')}"
                                    :format="['jpg','jpeg','png','gif','pdf']"
                                    style="width:300px"
                                    :disabled='!isCompanyInfoEdit'
                                    :show-upload-list="false"
                                    >
                                    <div style="padding: 10px 0">
                                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                        <span v-if="submitForm.otherFile==''">请拖拽文件到此区域上传或点击上传</span>
                                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                                    </div>
                                </Upload>
                                <div v-if="submitForm.otherFile!=''">
                                    <a :href="submitForm.otherFile" target="_blank" >{{'其他证明文件'}}</a><Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','otherFile')"/>
                                </div>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </div>
            <div class="content-r">
                <Card style="margin-top: 6px;">
                    <p slot="title">服务信息</p>
                    <Form :label-width=100>
                        <FormItem label="订单号：">
                            <span>{{orderNo}}</span>
                        </FormItem>
                        <FormItem label="订单备注：">
                            <span>{{orderRemark}}</span>
                        </FormItem>
                        <FormItem label="工单号：">
                            <span>{{orderServices.serverNo}}</span>
                        </FormItem>
                        <FormItem label="申报状态：">
                            <span>{{progressStatus[orderServices.progressBar]}}</span>
                        </FormItem>
                        <FormItem label="服务公司：">
                            <span>{{orderServices.companyName}}</span>
                        </FormItem>
                        <FormItem label="服务名称：">
                            <span>{{ orderServices.productFunctionCode == '1' ? "税号注册" : orderServices.productFunctionCode == '2' ? "税务申报" : orderServices.productFunctionCode == '3' ? "税务补缴" : orderServices.productFunctionCode == '4' ? "转代理": orderServices.productFunctionCode == '6' ? "注销税号" : ''}}</span>
                        </FormItem>
                        <FormItem label="国家：">
                            <span>{{orderServices.countryNameZh}}</span>
                        </FormItem>
                        <FormItem label="创建时间：">
                            <span>{{orderServices.createTime}}</span>
                        </FormItem>
                    </Form>
                </Card>
                 <Card style="margin-top: 6px;">
                    <p slot="title">用户信息</p>
                    <Form :label-width=100>
                        <FormItem label="用户昵称：">
                            <span>{{orderServices.userNickname}}</span>
                        </FormItem>
                        <FormItem label="手机号：">
                            <span>{{orderServices.userMobile}}</span>
                        </FormItem>
                        <FormItem label="用户级别：">
                            <span>{{''}}</span>
                        </FormItem>
                        <FormItem label="公司名称：">
                            <span>{{orderServices.userCompanyName}}</span>
                        </FormItem>
                        <FormItem label="地址：">
                            <span>{{orderServices.userAddress}}</span>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        </div>
        <Modal v-model="auditModal" title="审核资料">
            <p>
                <RadioGroup v-model="isAudit">
                    <Radio label="1">
                        <span>审核通过</span>
                    </Radio>
                    <Radio label="2">
                        <span>资料不对，驳回</span>
                    </Radio>
                </RadioGroup>
            </p>
            <p v-show="isAudit=='2'">
                <Input v-model="remark" type="textarea" placeholder="请输入驳回原因" />
            </p>
            <p slot="footer">
                <Button type="primary" ghost style="margin-right:20px;" @click="auditModal=false">取消</Button>
                <Button type="primary" @click="sureAudit">确认</Button>
            </p>
        </Modal>
        <Modal v-model="cancelErrorBox" title="注销失败">
            <p>失败原因：</p>
            <Input v-model="errorReason" type="textarea" :rows="4" placeholder="请输入失败原因"/>
            <div slot="footer">
                <Button type="primary" ghost style="margin-right:20px;" @click="cancelErrorBox=false">取消</Button>
                <Button type="primary" @click="sureCancelError">确认</Button>
            </div>
        </Modal>
        <Modal v-model="sureSuccessBox" title="是否确认完成注销">
             <Upload
                ref="declareFile"
                type="drag"
                :action="fileUpload"
                :data="{ prefix: '' }"
                :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,1)}"
                :on-remove="(file,fileList)=>{removeDeclare(file,fileList,1)}"
                style="width:260px"
                >
                <div style="padding: 10px 0">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                </div>
            </Upload >
            <div slot="footer">
                <Button type="primary" ghost style="margin-right:20px;" @click="sureSuccessBox=false">取消</Button>
                <Button type="primary" @click="sureSuccessSubmit">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {getDeclareServiceDetail} from '@/api/taxService/workOrder.js';
import * as API from '@/api/taxService/cancelTaxNum.js';
export default {
    props:['serviceId'],
    data(){
        return{
            fileUpload: this.workOrderFile,
            submitForm:{
                otherFile:'',
                vatTaxFileCopy:'',
                vatTaxEuFile:'',
                vatTaxLocalFile:'',
                calcelBeginDate:'',
                companyBusinessModeDescribe:'',
                lastDeclareDate:'',
                vatNumberServicesId:'',
                countryNameZh:''
            },
            progressStatus:{
                51: "待上传资料",
                52: "待审核",
                53: "注销中",
                54: "已完成",
                55: "资料驳回",
                56: "注销失败",
            },
            isCompanyInfoEdit:true,
            orderServices:{},
            auditModal:false,
            isAudit:'1',
            remark:'',
            cancelErrorBox:false,
            sureSuccessBox:false,
            errorReason:'',
            receiptFile:'',
            orderNo:'',
            orderRemark:'',
        }
    },
    methods: {
        //返回列表页
        goBack() {
            this.$emit('back')
        },
        getDetailInfo(){
            getDeclareServiceDetail({serviceId:this.serviceId}).then(res=>{
                if(res.code==0){
                    this.orderNo = res.data.orderNo
                    this.orderRemark = res.data.orderRemark
                    this.orderServices={...res.data.orderServices}
                    this.isCompanyInfoEdit=this.orderServices.progressBar==51?true:this.orderServices.progressBar==55?true:false
                    if (JSON.stringify(res.data.cancelTaxWorkOrder)!='{}') {
                        this.submitForm={...res.data.cancelTaxWorkOrder}
                    }else{
                        this.submitForm.countryNameZh=this.orderServices.countryNameZh
                    }
                }
            })
        },
        successHandler(res, file, fileList, item) {
            let self = this;
            if (res.code !== 0) {
                self.$Notice.warning({
                title: "警告",
                desc: "请尝试再次上传"
                });
                return false;
            }
            this.submitForm[item] = res.data.fileUrl;
        },
        formatErrorHandler() {
            this.$Notice.warning({
                title: "文件格式错误",
                desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
            });
        },
        removeHandler(file, fileList, item) {
            let self = this;
            this.submitForm[item] = "";
        },
        //点击预览文件
        previewFile(url) {
            window.open(url)
        },
        formatDate(date, type) {
            if (typeof date === "object") {
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? "0" + m : m;
                let d = date.getDate();
                d = d < 10 ? "0" + d : d;
                if (type == "month") {
                return y + "-" + m;
                } else if (type == "date") return y + "-" + m + "-" + d+' 00:00:00';
            } else {
                return date;
            }
        },
        //提交审核
        submitFormFun(){
            let data={...this.submitForm}
            data.lastDeclareDate=this.formatDate(this.submitForm.lastDeclareDate,'date')
            data.calcelBeginDate=this.formatDate(this.submitForm.calcelBeginDate,'date')
            data.orderServicesId=this.serviceId
            API.submitCancelInfo(data).then(res=>{
                if(res.code===0){
                    this.$Message.success('提交成功')
                    this.goBack()
                    this.$emit('refresh')
                }
            })
        },
        //下载资料
        uploadFile(){},
        //申报回执上传成功
        declareUploadSuccess(res,file,fileList,type) {
            if(type===1){
                this.receiptFile=file.response.data.fileUrl
            }
        },
        //移除申报回执
        removeDeclare(file,fileList,type) {
            if(type===1){
                this.receiptFile=''
            }
        },
        //审核确认
        sureAudit(){
            let params = {
                serviceId: this.serviceId,
                status: this.isAudit,
                remark: this.remark
            }
            if(this.isAudit == 1) {
                delete params.remark
            }
            API.canceltaxAudit(params).then(res=>{
                if(res.code===0){
                    this.$Message.success('审核成功')
                    this.auditModal = false
                    this.goBack()
                    this.$emit('refresh')
                }
            })
        },
        //注销失败确认
        sureCancelError(){
            if(this.errorReason==''){
                this.$Message.info('请输入原因')
                return
            }
            let data={
                serviceId:this.serviceId,
                remark:this.errorReason
            }
            API.cancelFail(data).then(res=>{
                this.$Message.success('操作成功')
                this.goBack()
                this.$emit('refresh')
            })
        },
        //确认完成注销
        sureSuccessSubmit(){
            if(this.receiptFile==''){
                this.$Message.info('请上传注销回执')
                return
            }
            let data={
                serviceId:this.serviceId,
                receiptFile:this.receiptFile
            }
            API.cancelFinish(data).then(res=>{
                this.$Message.success('操作成功')
                this.goBack()
                this.$emit('refresh')
            })
        }
    },
    created() {
        this.getDetailInfo()
    },
}
</script>
<style lang="less" scoped>
.back {
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    margin-bottom: 5px;
    cursor: pointer;
}
.content {
    display: flex;
    .content-l {
        flex: 1;
        .companyTitleBox {
            display: flex;
            justify-content: space-between;
            min-height:34px;
        }
        .classTitle {
            display: flex;
            justify-content: space-between;
            span {
                &:first-child {
                    font-size: 16px;
                    font-weight: 700;
                    padding-left: 10px;
                }
                &:last-child {
                    cursor: pointer;
                }
            }
        }
        .classifyTitleBox {
            padding: 10px 5px;
            // font-size: 12px;
            // color: #18CEA5;
            .classifyTitle {
                font-weight: bold;
                font-size: 14px;
                color: #666;
            }
        }
        .legalPersonSignBox {
        margin-top: 20px;
        }
        .legalPersonSign {
        width: 300px;
        height: 200px;
        background: #f2f2f2;
        img {
            width: 300px;
            height: 200px;
        }
        }
        .fileBtn {
            text-align: center;
            margin-top: 20px;
        }

        .titleItem {
            text-align: right;
            padding-right: 12px;
        }
        .fileBox {
            display: flex;
            flex-wrap: wrap;
            a {
                text-decoration: none;
                margin-right: 40px;
            }
        
        }
    }
    .content-r {
        width: 300px;
        margin-left: 10px;
    }
}
.file-box{
    .fl{
        width:110px;
        float:left;
    }
}
</style>