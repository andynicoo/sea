<template>
    <div class="orderDetail">
        <div class="back" @click="goBack()"><Icon type="md-arrow-back" />返回列表</div>
        <div class="letterDetailInfo">
            <div class="basicInfoBox">
                <Row class="rowItem">
                    <Col span="4">英文公司名称：</Col>
                    <Col span="4">{{letterDetailInfo.companyNameEn || '暂无'}}</Col>
                    <Col span="4">中文公司名称：</Col>
                    <Col span="4">{{letterDetailInfo.companyName}}</Col>
                </Row>
                <Row class="rowItem">
                    <Col span="4">VAT税号：</Col>
                    <Col span="4">{{letterDetailInfo.vatTaxNumber || "暂无"}}</Col>
                    <Col span="4">信件类型：</Col>
                    <Col span="4">{{letterDetailInfo.letterType == '1' ? "罚款利息通知" : letterDetailInfo.letterType == '2' ? "滞纳金通知" : letterDetailInfo.letterType == '3' ? "催税罚款通知" : letterDetailInfo.letterType == '4' ? "罚款通知" : letterDetailInfo.letterType == '5' ? '税务稽查通知' : letterDetailInfo.letterType == '6' ? '退税文件' : letterDetailInfo.letterType == '7' ? '退税支票' : letterDetailInfo.letterType == '8' ? 'C79' : letterDetailInfo.letterType == '9' ? '申报周期变更' : letterDetailInfo.letterType == '11' ? '税率文件' : letterDetailInfo.letterType == '12' ? '催申报文件' : letterDetailInfo.letterType == '13' ? '调查问卷': '其它'  }}</Col>
                </Row>
                <Row class="rowItem">
                    <Col span="4">是否需用户处理：</Col>
                    <Col span="4">{{letterDetailInfo.isDispose == 1 ? "待处理" :letterDetailInfo.isDispose == 2　? '不需要用户处理' : letterDetailInfo.isDispose == 3 ? '处理完成' : '其他'}}</Col>
                    <Col span="4">信件接收时间：</Col>
                    <Col span="4">{{letterDetailInfo.receptionTime}}</Col>
                </Row>
                <Row class="rowItem">
                    <Col span="4">信件文件：</Col>
                    <Col span="4">
                        <div class="file">
                            <a v-for="(item, index) in fileList" :key="index" :href="item" target="_blank">信件</a>
                        </div>
                    </Col>
                </Row>
                <Row class="rowItem">
                    <Col span="4">处理建议（选填）：</Col>
                    <Col span="4">{{letterDetailInfo.advise}}</Col>
                </Row>
            </div>
        </div>
    </div>
</template>
<script>
import * as API from '@/api/taxService/letters.js';
export default {
    name: 'orderDetail',
    props: ['rowInfo'],
    data() {
        return {
            letterDetailInfo: {

            },
            fileList: []
        }
    },
    created(){
    },
    mounted() {
        this.getRefundDetail();
    },
    methods: {
        //返回列表
        goBack() {
            this.$emit('back')
        },
        //分页
        changePageHandler(page) {
            this.pageInfo.page = page
        },
        //详情信息
        getRefundDetail() {
            this.tableLoading = true;
            let refundId = this.id
            API.detail({
                id: this.rowInfo
            }).then((res) => {
                this.tableLoading = false;
                console.log('tetal', res)
                if(res.code == 0) {
                    this.letterDetailInfo = res.data
                    this.fileList = this.letterDetailInfo.letterFile.split(';')
                    console.log(this.fileList)
                }else {
                    this.$Message.warning(res.message);
                }
            })
            .catch((err) => console.log(err))
        },
        //确认到账操作
        // confirm() {
        //     this.$Modal.confirm({
        //         title: '是否确认到账',
        //         content: '可在详情页查看付款凭证',
        //         onOk: () => {
        //             API.sureAccount({orderId: this.id}).then((res) => {
        //                 if(res.code == 0) {
        //                     this.$Message.success('确认成功')
        //                     this.$emit('refresh')
        //                 }else {
        //                     this.$Message.warning(res.message)
        //                 }
        //             })
        //             .catch(err => console.log(err))
        //         }
        //     })
        // },
        auditMedalFun(obj) {
          this.isAuditMedalShow = obj.state
          this.isRefundMedalShow = obj.state
        },
        auditFun() {
            this.isAuditMedalShow = true
        },
        refundFun() {
            this.isRefundMedalShow = true
        },
        requestRefund() {
            if (this.ModalData.length === 0) {
                this.$Message.warning('请选择服务')
                return
            }
            for (let index = 0; index < this.ModalData.length; index++) {
                const element = this.ModalData[index];
                this.formLeft.orderProductIds += element.orderProductId + ','
                this.formLeft.refundMoney += (Number(element.price) - Number(element.discAmount)) * 100
            }
            this.formLeft.refundMoney = this.formLeft.refundMoney / 100
            this.formLeft.orderProductIds = this.formLeft.orderProductIds.substr(0, this.formLeft.orderProductIds.length - 1)
            this.refundModal = true
        },
        refreshDetail() {
            this.getRefundDetail();
            this.isAuditMedalShow = false
            this.isRefundMedalShow = false
        }
        // 提交申请
        // submitApplication(name) {
        //     if(this.id === undefined){
        //         this.formLeft.orderId = this.$route.query.id
        //     }else{
        //         this.formLeft.orderId = this.id
        //     }
        //     if (this.formLeft.refundMoney < 0) {
        //         this.$Message.error('退款金额不能小于0')
        //         return
        //     }
        //     if (this.formLeft.refundMoney > Number(this.letterDetailInfo.amountMoney)) {
        //         this.$Message.error('退款金额不能大于订单已付金额');
        //         return
        //     }
        //     this.$refs[name].validate((valid) => {
        //         if (valid) {
        //             API.requestRefund(this.formLeft).then(res => {
        //                 if (res.code === 0) {
        //                     this.$Message.success('申请退款成功');
        //                     this.refundModal = false
        //                     this.getRefundDetail()
        //                 }
        //             }).catch(error => {
        //                 console.log(error)
        //             })
        //         } else {
        //             this.$Message.error('请填写完整资料');
        //         }
        //     })
        // }
    },
}
</script>
<style lang="less" scoped>
    .orderDetail {
        background: #ffffff;
        .back {
            height: 40px;
            line-height: 40px;
            cursor: pointer;
        }
        /deep/ .serviceInfo {
            .title {
                font-size: 16px;
                font-weight: 700;
                padding-left: 10px;
                height:60px;
                line-height: 60px;
                border-bottom: 1px solid #ccc;
            }
            .ivu-btn {
              float: right;
            }
        }
        .letterDetailInfo {
            .titleBox {
                display: flex;
                justify-content: space-between;
                height: 36px;
                line-height: 36px;
                border-bottom: 1px solid #ccc;
                .title {
                    font-size: 16px;
                    font-weight: 700;
                }
            }
            .basicInfoBox {
                padding: 20px;
                .rowItem {
                    margin-bottom: 10px;
                    .file {
                        a {
                            margin-right: 10px;
                        }
                    }
                }
            }
        }

    }
    /deep/ .serviceList {
      .ivu-table td {
        border-right: 1px solid #e8eaec;
      }
    }
    /deep/ .refundModal {
      .ivu-form-item {
        display: flex;
        flex-direction: column;
      }
      .ivu-form-item-content {
        margin-left: 0px !important;
      }
      .money {
        .ivu-form-item-content {
          display: inherit;
        }
      }
    }
</style>