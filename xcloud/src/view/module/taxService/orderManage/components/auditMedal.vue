<template>
    <div>
        <Modal v-model="detailModel" @on-visible-change="changeState" title="审核退款">
            <Form ref="auditForm" :model="auditForm" :rules="ruleForm">
                <FormItem prop="status">
                    <RadioGroup v-model="auditForm.status">
                        <Radio label="1">审核通过</Radio>
                        <Radio label="0">审核不通过</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="remark" v-if="auditForm.status === '0'">
                    <Input v-model="auditForm.remark" type="textarea" :rows="4" placeholder="请输入不通过原因（必填）" />
                </FormItem>
            </Form>   
            <div slot="footer" style="text-align:center;">
               <Button type="primary" @click="submit('auditForm')">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as API from '@/api/taxService/order.js';  
    export default {
        props: ['refundId'],
        data() {
            return {
                detailModel: true,
                auditForm: {
                    status: '',
                    remark: '',
                    refundId: this.refundId
                },
                ruleForm: {
                    status: [
                        { required: true, message: '请审核', trigger: 'change' }
                    ],
                    remark: [
                        { required: true, type: 'string', message: '请输入不通过原因', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            console.log(this.refundId)
        },
        methods: {
            changeState (val) {
                this.$emit('changeState', false)
            },
            submit(name) {
                this.$refs[name].validate((valid) => {
                if (valid) {
                    API.audit(this.auditForm).then(res => {
                        if (res.code === 0) {
                            this.$Message.success('操作成功');
                            this.$emit('refresh')
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                } else {
                    
                }
            })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>