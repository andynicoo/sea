<template>
    <div>
        <p class="returnList" @click="returnList">返回列表</p>
        <p class="title">编辑商品服务信息</p>
        <Divider></Divider>
          <Form :model="addFrom" :label-width="108" label-position="left" :rules="formRule" ref="addFrom">
            <FormItem label="商品服务图片：" prop="productImgUrl">
                <img :src="addFrom.productImgUrl" class="main-img"/>
                <Upload
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'productImgUrl')}"
                    :on-remove="(file,fileList)=>{removeHandler(file,fileList)}"
                    :format="['jpg','jpeg','png','gif']"
                    style="display:inline-block;margin-left:10px;"
                    :show-upload-list="false"
                >
                    <div style="padding: 10px;">
                        <span>点击重新上传</span>
                    </div>
                </Upload>
            </FormItem>
            <FormItem label="商品展示图：" prop="productHeadImgUrl">
                <img :src="addFrom.productHeadImgUrl" class="main-img"/>
                <Upload
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'productHeadImgUrl')}"
                    :on-remove="(file,fileList)=>{removeHandler(file,fileList)}"
                    :format="['jpg','jpeg','png','gif']"
                    style="display:inline-block;margin-left:10px;"
                    :show-upload-list="false"
                >
                    <div style="padding: 10px;">
                        <span>点击重新上传</span>
                    </div>
                </Upload>
            </FormItem>
            <FormItem label="服务名称：" prop="productName">
                <Input v-model="addFrom.productName" placeholder="请输入服务名称" ></Input>
            </FormItem>
            <FormItem label="服务国家：" prop="countryCode">
                <Select clearable v-model="addFrom.countryCode" placeholder="服务国家">
                    <Option
                        v-for="(item,index) in countryList"
                        :value="item.countryCode"
                        :key="index"
                        >{{ item.countryNameZh }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务费用：" prop="price">
                <Input v-model="addFrom.price" placeholder="请输入服务费用" style="width:200px;" number></Input>
                <Select clearable v-model="addFrom.unit" placeholder="单位" style="width:200px;">
                    <Option
                        v-for="(item,index) in unitList"
                        :value="item.status"
                        :key="index"
                        >{{ item.unit }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务内容：" prop="productContent">
                <Input v-model="addFrom.productContent" type="textarea" :maxlength="50" placeholder="请输入服务内容" ></Input>
            </FormItem>
            <FormItem label="产品类型：" prop="productType">
                <Select clearable v-model="addFrom.productType" placeholder="产品类型">
                    <Option value="1" >PC端</Option>
                    <Option value="2" >小程序端</Option>
                </Select>
            </FormItem>
            <FormItem label="状态：" prop="status">
                <Select clearable v-model="addFrom.status" placeholder="单位" style="width:200px;">
                    <Option value="0">上架</Option>
                    <Option value="1">下架</Option>
                    <Option value="2">未上架</Option>
                </Select>
            </FormItem>
            <FormItem label="服务详情：" prop="productDetail">
                <vue-neditor-wrap
                    v-model="addFrom.productDetail"
                    :config="myConfig"
                    class="editbd"
                    :destroy="false"
                    ></vue-neditor-wrap>
            </FormItem>
            <div class="button">
                <Button type="primary" size="large" class="submit" @click="submit">确认</Button>
            </div>
        </Form>
    </div>
</template>
<script>
import { getTaxCountry } from '@/api/taxService/common.js';
import * as API from '@/api/goodsManage/goodsApi.js';
export default {
    props:['id'],
    data(){
        return{
            fileUpload: this.workOrderFile,
            addFrom:{},
            countryList:[],
            unitList:[
                {
                    unit:'年',
                    status:'1'
                },
                {
                    unit:'个',
                    status:'2'
                },
            ],
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
            formRule: {
                productImgUrl: [
                    { required: true, message: '商品服务图片不能为空', trigger: 'change' }
                ],
                productHeadImgUrl: [
                    { required: true, message: '商品展示图不能为空', trigger: 'change' }
                ],
                productName: [
                    { required: true, message: '服务名称不能为空', trigger: 'blur' }
                ],
                countryCode: [
                    { required: true, message: '请选择服务国家', trigger: 'change' }
                ],
                price: [
                    { required: true, message: '请输入服务费用', trigger: 'blur' ,type:'number'}
                ],
                productContent: [
                    { required: true, message: '服务内容不能为空', trigger: 'blur' }
                ],
                productDetail: [
                    { required: true, message: '服务详情不能为空', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                productType: [
                    { required: true, message: '请选择产品类型', trigger: 'change' }
                ]
            },
        }
    },
    mounted(){
        this.getCountryList()
        this.getDetail()
    },
    methods:{
         //获取税号国家下拉数据
        getCountryList() {
            getTaxCountry().then((res) => {
                if(res.code == 0) {
                    this.countryList = res.data
                }
            })
        },
        returnList(){
            this.$emit('refresh')
        },
        getDetail(){
            API.getGoodsDetail({id:this.id}).then(res=>{
                if(res.code===0){
                    this.addFrom=res.data
                    this.addFrom.productType = this.addFrom.productType.toString()
                    this.addFrom.unit=String(res.data.unit)
                    this.addFrom.status=String(res.data.status)
                    this.addFrom.productDetail=decodeURI(res.data.productDetail)
                }
            })
        },
        successHandler(res,file,fileList,type){
            this.addFrom[type]=res.data.fileUrl
        },
        removeHandler(file,fileList){},
        submit(){
            let params={...this.addFrom}
            params.productDetail=encodeURI(this.addFrom.productDetail)
            // console.log(params)
            // return
            this.$refs['addFrom'].validate(valid => {
                if (valid) {
                    API.updateGoodsDetail(params).then(res=>{
                        if(res.code===0){
                            this.$Message.success('修改成功')
                            this.returnList()
                        }
                    })
                }
            })
        }
    },

}
</script>
<style lang="less" scoped>
.returnList{
    padding:10px;
    background-color:#eee;
    cursor:pointer;
}
.title{
    font-size:18px;
    font-weight:700;
}
.main-img{
    width:160px;
    height:143px;
}
/deep/ .ivu-select-dropdown{
    z-index:9999;
}
</style>