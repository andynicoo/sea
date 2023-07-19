<template>
    <div>
        <Modal v-model="refundModel" @on-visible-change="changeState" title="确认退款">
            <Form ref="refundForm" :model="refundForm" >
                <FormItem prop="status" label="退款方式" :label-width="120">
                    <RadioGroup v-model="status">
                        <Radio label="1" disabled>微信</Radio>
                        <Radio label="2" disabled>支付宝</Radio>
                        <Radio label="3" disabled>银联退款</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="退款金额" :label-width="120">
                    <span>
                        {{refundInfo.refundMoney}}
                    </span>
                </FormItem>
                <FormItem label="退款银行" :label-width="120" v-if="refundInfo.refundMethod == '3'">
                    <span>
                        {{refundInfo.refundBank}}
                    </span>
                </FormItem>
                <FormItem label="退款账户" :label-width="120" v-if="refundInfo.refundMethod == '3'"> 
                    <span>
                        {{refundInfo.refundAccount}}
                    </span>
                </FormItem>
                <FormItem label="收款人/公司" :label-width="120" v-if="refundInfo.refundMethod == '3'">
                    <span>
                        {{refundInfo.refundPayee}}
                    </span>
                </FormItem>
                <FormItem label="退款凭证" prop="refundCertificate" :label-width="120" v-if="refundInfo.refundMethod == '3'">
                    <Upload
                        type="drag"
                        :action="workOrderFile"
                        :data="{ prefix: '' }"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'refundCertificate')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'refundCertificate')}"
                        style="width:260px"
                        >
                        <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                    </Upload>
                </FormItem>
                <FormItem label="退款说明" :label-width="120" v-if="refundInfo.refundMethod == '2' || refundInfo.refundMethod == '1'">
                    <p>微信、支付宝支付的操作退款后，自动退款到原渠道，请谨慎操作</p>
                </FormItem>
            </Form>   
            <div slot="footer" style="text-align:center;">
               <Button type="primary" @click="submit('refundForm')">确定退款</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as API from '@/api/taxService/order.js'; 
    export default {
        props: ['refundInfo'],
        data() {
            return {
                refundModel: true,
                fileUpload: this.workOrderFile,
                refundForm: {
                    refundCertificate: '',
                    refundId: ''
                },
                status: '0'
            }
        },
        created() {
            console.log('refundInfo', this.refundInfo)
            this.status = this.refundInfo.refundMethod + ''
            this.refundForm.refundId = this.refundInfo.id
        },
        methods: {
            changeState (val) {
                this.$emit('changeState', false)
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
                this.refundForm[item] = res.data.fileUrl;
            },
            formatErrorHandler() {
                this.$Notice.warning({
                    title: "文件格式错误",
                    desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
                });
            },
            removeHandler(file, fileList, item) {
                let self = this;
                this.refundForm[item] = "";
            },
            submit(name) {
                var that = this
                this.$Modal.confirm({
                    title: '确认退款',
                    content: '请确认是否退款',
                    onOk: () => {
                        that.confirmRefund()
                    },
                    onCancel: () => {
                        this.$emit('changeState', false)
                    }
                });
                return
            },
            confirmRefund() {
                if (this.refundInfo.refundMethod === 3 && this.refundForm.refundCertificate === '') {
                    this.$Message.error('请上传退款凭证');
                    return
                }
                API.confirmRefund(this.refundForm).then(res => {
                if (res.code === 0) {
                    this.$Message.success('退款成功')
                    this.$emit('refresh')
                }
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>