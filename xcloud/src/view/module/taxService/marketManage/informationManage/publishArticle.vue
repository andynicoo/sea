<template>
  <div>
    <p @click="returnList" class="return"> 返回列表</p>
    <Form :model="addFrom" :label-width="100" label-position="left" :rules="formRule" ref="addFrom">
      <FormItem label="文章标题：" prop="bulletinTitle">
        <Input v-model="addFrom.bulletinTitle" :maxlength="30" placeholder="请输入文章标题" ></Input>
      </FormItem>
      <FormItem label="摘要：" prop="bulletinSummary">
        <Input v-model="addFrom.bulletinSummary" :maxlength="70" type="textarea" placeholder="请输入摘要" ></Input>
      </FormItem>
      <FormItem label="资讯分类：" prop="bulletinType">
        <Select v-model="addFrom.bulletinType" placeholder="选择资讯分类" >
          <Option
            :value="item.type"
            v-for="item in typeList"
            :key="item.type"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="主图：" prop="bulletinMainPicture">
        <Upload
            type="drag"
            :action="workOrderFile"
            :data="{ prefix: '' }"
            :before-upload="beforeUploadHandler"
            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'bulletinMainPicture')}"
            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'bulletinMainPicture')}"
            style="width:260px"
            v-if="addFrom.bulletinMainPicture==''"
            >
            <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
        </Upload>
        <div class="main-img-box" v-else>
          <img :src="addFrom.bulletinMainPicture">
          <Button @click="removeHandler(1,1,'bulletinMainPicture')">删除</Button>
        </div>
      </FormItem>
        <FormItem label="广告图：" prop="bulletinAdPicture">
        <Upload
            type="drag"
            :action="workOrderFile"
            :data="{ prefix: '' }"
            :before-upload="beforeUploadHandler"
            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'bulletinAdPicture')}"
            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'bulletinAdPicture')}"
            style="width:260px"
            v-if="addFrom.bulletinAdPicture==''"
            >
            <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
        </Upload>
        <div class="main-img-box" v-else>
          <img :src="addFrom.bulletinAdPicture">
          <Button @click="removeHandler(1,1,'bulletinAdPicture')">删除</Button>
        </div>
      </FormItem>
      <FormItem label="广告链接：" prop="bulletinAdPictureUrl">
         <Input v-model="addFrom.bulletinAdPictureUrl" placeholder="广告链接：" style="width:400px;"></Input>
      </FormItem>
      <FormItem label="内容：" prop="bulletinContent">
          <vue-neditor-wrap
          v-model="addFrom.bulletinContent"
          :config="myConfig"
          class="editbd"
          :destroy="false"
        ></vue-neditor-wrap>
      </FormItem>
       <FormItem label="作者：" prop="bulletinAuthorName">
         <Input v-model="addFrom.bulletinAuthorName" placeholder="请输入作者名称" style="width:400px;"></Input>
      </FormItem>
       <FormItem label="是否启用：" prop="bulletinStatus">
          <i-switch
                v-model="addFrom.bulletinStatus"
                :value="addFrom.bulletinStatus"
                @on-change="switchStatus()"
                size="large"
            >
            </i-switch>
      </FormItem>
      <div class="button">
        <Button type="primary" size="large" class="submit" @click="submit">立即发布</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import {submitInformation} from '@/api/taxService/information.js'
export default {
  props: ['detail'],
  data () {
    return {
      addFrom: {
        bulletinTitle:'',
        bulletinSummary:'',
        bulletinMainPicture:'',
        bulletinAdPicture:'',
        bulletinAdPictureUrl:'',
        bulletinType:'',
        bulletinContent:'',
        bulletinAuthorName:'',
        bulletinStatus:true
      },
      typeList:[
          {type:'-1',name:'全部'},
          {type:'0',name:'VAT资讯'},
          {type:'1',name:'专家解读'},
          {type:'2',name:'通知公告'},
      ],
      myConfig: {
        // 上传文件接口
        serverUrl: this.ueditorFile,
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: this.UEDITOR_HOME_URL,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 初始容器高度
        initialFrameHeight: 600,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        enableAutoSave: true
      },
      formRule: {
        bulletinTitle: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' }
        ],
        bulletinSummary: [
          { required: true, message: '摘要不能为空', trigger: 'blur' }
        ],
        bulletinType: [
          { required: true, message: '请选择资讯分类', trigger: 'change' }
        ],
        bulletinMainPicture: [
          { required: true, message: '请上传主图', trigger: 'change' }
        ],
        bulletinAdPicture: [
          { required: false, message: '请上传广告图', trigger: 'change' }
        ],
        bulletinContent: [
          { required: true, message: '请填写内容', trigger: 'blur' }
        ],
        bulletinAuthorName: [
          { required: true, message: '请填写作者名称', trigger: 'blur' }
        ]
      },
      companyList: [],
      previewLoading: false
    }
  },
  created() {
    if(JSON.stringify(this.detail)!='{}'){
      this.addFrom={...this.detail}
      this.addFrom.bulletinId=this.detail.id
      this.addFrom.bulletinStatus=this.detail.bulletinStatus==0?true:false
      this.addFrom.bulletinType=String(this.detail.bulletinType)
      this.addFrom.bulletinContent=decodeURI(this.detail.bulletinContent)
    }else{
      this.addFrom.bulletinType='0'
    }
  },
  methods: {
    beforeUploadHandler(res,file,fileList){},
    successHandler(res,file,fileList,type){
      this.addFrom[type] = res.data.fileUrl;
    },
    removeHandler(file,fileList,type){
      this.addFrom[type] =''
    },
    returnList(){
        this.$emit('returnList',true)
    },
    switchStatus(){
      let addFrom=this.addFrom
      if (addFrom.status === false) addFrom.status = 0
      if (addFrom.status === true) addFrom.status = 1
    },
    submit () {
      if(this.addFrom.bulletinAdPicture !=='' && this.addFrom.bulletinAdPictureUrl ==''){
        this.$Message.info('请填写广告链接')
        return
      }
      const self=this
      let data={...this.addFrom}
      data.bulletinContent=encodeURI(this.addFrom.bulletinContent)
      data.bulletinStatus=data.bulletinStatus?0:1
      this.$refs['addFrom'].validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title:'确认发布',
            onOk(){
              submitInformation(data).then(res => {
                if (res.code === 0) {
                  if(res.code===0){
                    self.$emit('returnList',true)
                  }
                }
              })
            }
          })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ivu-select-dropdown {
  z-index: 99999;
}
.button {
  text-align: center;
}
.submit {
  margin-right: 20px;
}
.return{
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  background-color: #fff;
  margin-bottom: 30px;
}
.main-img-box{
  img{
    width:268px;
    max-height:160px;
    vertical-align:bottom;
    margin-right:10px;
  }
}
/deep/ .edui-editor.edui-notadd{
  z-index:9 !important;
}
</style>
