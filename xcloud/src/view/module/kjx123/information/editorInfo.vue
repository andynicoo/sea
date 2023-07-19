<template>
  <div>
    <p @click="goBack"
       class="return"> 返回列表</p>
    <Form :model="addFrom"
          :label-width="100"
          label-position="left"
          :rules="formRule"
          ref="addFrom">
      <FormItem label="文章标题："
                prop="title">
        <Input v-model="addFrom.title"
               :maxlength="30"
               placeholder="请输入文章标题"></Input>
      </FormItem>
      <FormItem label="简介："
                prop="newsDescribe">
        <Input v-model="addFrom.newsDescribe"
               :maxlength="70"
               type="textarea"
               placeholder="请输入简介"></Input>
      </FormItem>
      <FormItem label="资讯分类："
                prop="type">
        <Select v-model="addFrom.type"
                placeholder="选择资讯分类">
          <Option :value="String(item.key)"
                  v-for="item in typeList"
                  :key="item.key">{{item.value}}</Option>
        </Select>
      </FormItem>
      <FormItem label="主图："
                prop="picture">
        <Upload type="drag"
                :action="kjxFile"
                :data="{ prefix: '' }"
                :before-upload="beforeUploadHandler"
                :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'picture')}"
                :on-remove="(file,fileList)=>{removeHandler (file,fileList,'picture')}"
                style="width:260px"
                v-if="addFrom.picture==''">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div class="main-img-box"
             v-else>
          <img :src="addFrom.picture">
          <Button @click="removeHandler(1,1,'picture')">删除</Button>
        </div>
      </FormItem>
      <FormItem label="广告图："
                prop="advertisingImg">
        <Upload type="drag"
                :action="kjxFile"
                :data="{ prefix: '' }"
                :before-upload="beforeUploadHandler"
                :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'advertisingImg')}"
                :on-remove="(file,fileList)=>{removeHandler (file,fileList,'advertisingImg')}"
                style="width:260px"
                v-if="addFrom.advertisingImg==''">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div class="main-img-box"
             v-else>
          <img :src="addFrom.advertisingImg">
          <Button @click="removeHandler(1,1,'advertisingImg')">删除</Button>
        </div>
      </FormItem>
      <FormItem label="广告链接："
                prop="advertisingUrl">
        <Input v-model="addFrom.advertisingUrl"
               placeholder="广告链接："
               style="width:400px;"></Input>
      </FormItem>
      <FormItem label="内容："
                prop="content">
        <vue-neditor-wrap v-model="addFrom.content"
                          :config="myConfig"
                          class="editbd"
                          :destroy="false"></vue-neditor-wrap>
      </FormItem>
      <FormItem label="作者："
                prop="author">
        <Input v-model="addFrom.author"
               placeholder="请输入作者名称"
               style="width:400px;"></Input>
      </FormItem>
      <FormItem label="是否启用："
                prop="isOpen">
        <i-switch v-model="addFrom.isOpen"
                  :value="addFrom.isOpen"
                  @on-change="switchStatus()"
                  size="large">
        </i-switch>
      </FormItem>
      <div class="button">
        <Button type="primary"
                size="large"
                class="submit"
                @click="submit">立即发布</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import * as API from '@/api/kj123/information.js';
export default {
  props: ['detail'],
  data() {
    return {
      addFrom: {
        title: '',
        newsDescribe: '',
        picture: '',
        advertisingImg: '',
        advertisingUrl: '',
        type: '',
        content: '',
        author: '',
        isOpen: true
      },
      typeList: [
        {
          key: 1,
          value: '电商'
        },
        {
          key: 2,
          value: '运营'
        },
        {
          key: 3,
          value: '工具'
        },
        {
          key: 4,
          value: '服务'
        },
        {
          key: 5,
          value: '金融'
        },
        {
          key: 6,
          value: '物流'
        },
        {
          key: 7,
          value: '选品'
        },
        {
          key: 8,
          value: '插件'
        },
        {
          key: 9,
          value: '营销'
        },
        {
          key: 10,
          value: '政策'
        },
        {
          key: 11,
          value: '行业动态'
        },
        {
          key: 12,
          value: '其它'
        },
      ],
      myConfig: {
        // 上传文件接口
        serverUrl: this.kjxUeditorFile,
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
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' }
        ],
        newsDescribe: [
          { required: true, message: '摘要不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择资讯分类', trigger: 'change' }
        ],
        picture: [
          { required: true, message: '请上传主图', trigger: 'change' }
        ],
        advertisingImg: [
          { required: false, message: '请上传广告图', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写内容', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请填写作者名称', trigger: 'blur' }
        ]
      },
      companyList: [],
      previewLoading: false
    }
  },
  created() {
    if (JSON.stringify(this.detail) != '{}') {
      this.addFrom = { ...this.detail }
      this.addFrom.isOpen = this.detail.isOpen == 1 ? true : false
      this.addFrom.type = String(this.detail.type)
      this.addFrom.content = decodeURI(this.detail.content)
    } else {
    }
  },
  methods: {
    beforeUploadHandler(res, file, fileList) { },
    successHandler(res, file, fileList, type) {
      this.addFrom[type] = res.data.fileUrl;
    },
    removeHandler(file, fileList, type) {
      this.addFrom[type] = ''
    },
    goBack() {
      this.$emit('back', true)
    },
    switchStatus() {
      let addFrom = this.addFrom
      if (addFrom.status === false) addFrom.status = 0
      if (addFrom.status === true) addFrom.status = 1
    },
    submit() {
      if (this.addFrom.advertisingImg !== '' && this.addFrom.advertisingUrl == '') {
        this.$Message.info('请填写广告链接')
        return
      }
      const self = this
      let data = { ...this.addFrom }
      data.content = encodeURI(this.addFrom.content)
      data.type = Number(this.addFrom.type)
      data.isOpen = data.isOpen ? 1 : 2
      this.$refs['addFrom'].validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title: '确认发布',
            onOk() {
              API.addOrUpdateNewsAPI(data).then(res => {
                if (res.code === 0) {
                  if (res.code === 0) {
                    self.$emit('back', true)
                    this.$Message.success('操作成功')
                    this.addFrom = {
                      title: '',
                      newsDescribe: '',
                      picture: '',
                      advertisingImg: '',
                      advertisingUrl: '',
                      type: '',
                      content: '',
                      author: '',
                      isOpen: true
                    }
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
.return {
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  background-color: #fff;
  margin-bottom: 30px;
}
.main-img-box {
  img {
    width: 268px;
    max-height: 160px;
    vertical-align: bottom;
    margin-right: 10px;
  }
}
/deep/ .edui-editor.edui-notadd {
  z-index: 9 !important;
}
</style>
