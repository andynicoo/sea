<template>
    <div class="orderDetail">
        <div class="back" @click="goBack()"><Icon type="md-arrow-back" />返回列表</div>
        <div class="letterDetailInfo">
            <div class="basicInfoBox">
                <Form ref="letterDetailInfo" :model="letterDetailInfo" :label-width="100">
                    <FormItem label="收件用户：">
                        <Select v-model="letterDetailInfo.userType" style="width:200px">
                            <Option value="2" >个人</Option>
                            <Option value="1" >所有用户</Option>
                        </Select>
                    </FormItem>    
                    <FormItem label="用户手机号：" v-if="letterDetailInfo.userType === '2'">
                        <Input style="width:300px;" v-model="letterDetailInfo.userMobiles" type="textarea" :rows="4" placeholder="请输入收件用户手机号，多个可用“;”隔开" />
                    </FormItem>
                    <Divider></Divider>
                    <FormItem label="标题：">
                        <Input v-model="letterDetailInfo.title" :rows="4" placeholder="请输入标题" />
                    </FormItem>
                    <FormItem label="内容：" prop="productDetail">
                        <vue-neditor-wrap
                            v-model="letterDetailInfo.content"
                            :config="myConfig"
                            class="editbd"
                            :destroy="false"
                            ></vue-neditor-wrap>
                    </FormItem>
                    <FormItem label="附件：">
                        <div v-if="rowInfo.status">
                            <span><a :href="letterDetailInfo.accessory" target="_blank">点击查看</a></span>
                        </div> 
                        <Upload
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList)}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList)}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            v-else
                            >
                            <div style="padding: 10px 0" >
                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                <span>请拖拽文件到此区域上传或点击上传</span>
                               
                            </div>
                        </Upload>
                        
                    </FormItem>
                </Form>    
                <div class="button" v-if="letterDetailInfo.status === 1 || letterDetailInfo.status === undefined">
                    <Button type="primary" class="submit" @click="submit">立即发送</Button>
                    <Button ghost type="primary" style="margin-left:10px;" class="submit" @click="save">保存</Button>
                </div>
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
                content: '',
                userMobiles: '',
                accessory: '',
                title: '',
                content: ''
            },
            fileList: [],
            myConfig: {
                // 上传文件接口
                serverUrl: this.ueditorFile,
                toolbars: [
                [
                    'anchor', // 锚点
                    'undo', // 撤销
                    'redo', // 重做
                    'bold', // 加粗
                    'indent', // 首行缩进
                    'underline', // 下划线
                    'formatmatch', // 格式刷
                    'source', // 源代码
                    'pasteplain', // 纯文本粘贴模式
                    'preview', // 预览
                    'removeformat', // 清除格式
                    'fontfamily', // 字体
                    'fontsize', // 字号
                    'paragraph', // 段落格式
                    // 'simpleupload', //单图上传
                    'insertimage', // 多图上传
                    'link', // 超链接
                    'spechars', // 特殊字符
                    'searchreplace', // 查询替换
                    'map', // Baidu地图
                    'insertvideo', // 视频
                    'justifyleft', // 居左对齐
                    'justifyright', // 居右对齐
                    'justifycenter', // 居中对齐
                    'justifyjustify', // 两端对齐
                    'forecolor', // 字体颜色
                    'backcolor', // 背景色
                    'insertorderedlist', // 有序列表
                    'insertunorderedlist', // 无序列表
                    'fullscreen', // 全屏
                    'pagebreak', // 分页
                    'attachment', // 附件
                    'imagecenter', // 居中
                    // 'wordimage', //图片转存
                    'lineheight', // 行间距
                    'autotypeset', // 自动排版
                    'background', // 背景
                    'template', // 模板
                    'inserttable' // 插入表格
                    // 'drafts', // 从草稿箱加载
                ]
                ],
                // 你的UEditor资源存放的路径,相对于打包后的index.html
                UEDITOR_HOME_URL: this.UEDITOR_HOME_URL,
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 工具栏是否可以浮动
                autoFloatEnabled: false,
                // 初始容器高度
                initialFrameHeight: 340,
                // 初始容器宽度
                initialFrameWidth: '100%',
                // 关闭自动保存
                enableAutoSave: true
            },
            fileUpload: this.workOrderFile,
        }
    },
    created(){
        // console.log(this.rowInfo)
        if (JSON.stringify(this.rowInfo) !==  '{}') {
            this.letterDetailInfo = this.rowInfo
            this.letterDetailInfo.userType = this.rowInfo.userType.toString()
            this.letterDetailInfo.content = decodeURI(this.letterDetailInfo.content)
        }
    },
    mounted() {
        
    },
    methods: {
        //返回列表
        goBack() {
            this.$emit('back')
        },
        //详情信息
        getRefundDetail() {
            this.tableLoading = true;
            let refundId = this.id
            API.detail({
                id: this.rowInfo
            }).then((res) => {
                this.tableLoading = false;
                if(res.code == 0) {

                }else {
                    this.$Message.warning(res.message);
                }
            })
            .catch((err) => console.log(err))
        },
        successHandler(res,file,fileList){
            this.letterDetailInfo.accessory = file.response.data.fileUrl
        },
        removeHandler(res,file,fileList) {
            this.letterDetailInfo.accessory = ''
        },
        submit() {
            // this.letterDetailInfo.content = encodeURIComponent(this.letterDetailInfo.content)
            this.$Modal.confirm({
                title: '发送站内信',
                content: '<p>是否确认发送站内信</p>',
                onOk: () => {
                   API.stationLetterAdd(this.letterDetailInfo).then((res) => {
                        this.tableLoading = false;
                        if(res.code == 0) {
                            this.$emit('refresh')
                            this.$Message.success('发送成功');
                        }else {
                            this.$Message.warning(res.message);
                        }
                    })
                    .catch((err) => console.log(err))  
                }
            });
        },
        save() {
            // this.letterDetailInfo.content = encodeURIComponent(this.letterDetailInfo.content)
            API.stationLetterSave(this.letterDetailInfo).then((res) => {
                this.tableLoading = false;
                if(res.code == 0) {
                    this.$emit('refresh')
                    this.$Message.success('保存成功');
                }else {
                    this.$Message.warning(res.message);
                }
            })
            .catch((err) => console.log(err))
        }
    },
}
</script>
<style lang="less" scoped>
    .orderDetail {
        background: #ffffff;
        padding: 20px 10px;
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
                padding: 20px 20px 20px 0px;
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
        .button {
            text-align: center;
            margin-top:20px;
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
    /deep/ .edui-notadd .edui-editor {
        z-index: 1000 !important;
    }
</style>