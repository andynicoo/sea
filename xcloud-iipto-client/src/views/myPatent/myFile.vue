<template>
  <div class="content">
    <table class="table" width="100%" cellspacing="0">
      <thead>
        <tr>
          <td>序号</td>
          <td>文件</td>
          <td>类型</td>
          <td>上传时间</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody v-if="fileList.length">
        <tr v-for="(item,index) in fileList" :key="index">
          <td>{{ index + 1 }}</td>
          <td><a :href="item.officialFile" target="_blank" download>{{ fileTypeMap[item.fileType] }}</a></td>
          <td>{{ fileTypeMap[item.fileType] }}</td>
          <td>{{ item.createTime }}</td>
          <td>
            <a v-if="(item.fileType === 1 && item.nodeCode === 'NODE0081') || (item.fileType === 2 && item.nodeCode === 'NODE0084')" @click="visible = true; current = item">确认{{ item.nodeCode === 'NODE0081' ? '建模' : '绘图'}}文件</a>
            <span v-if="item.nodeCode === 'NODE0085'">已确认无误</span>
            <span v-if="item.serviceProgress === '2'">已驳回</span>
            <a v-if="item.progressBar === 2 && item.rejectReason" @click="reasonVisible = true; reason = item.rejectReason">驳回原因</a>
            <a v-if="item.productFunctionCode === 101 && item.nodeCode === 'NODE0082'" @click="uploadVisible = true">上传绘图文件</a>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6">
            <div class="empty">暂无数据</div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 确认弹窗 -->
    <Modal width="420" v-model="visible" :title="`确认${current.nodeCode === 'NODE0081' ? '建模' : '绘图'}文件`" @on-cancel="visible = false">
      <div class="dialog-content">
        <p><img src="@/assets/images/common/yellowTip.svg">确认之前请先下载并查看{{current.nodeCode === 'NODE0081' ? '建模' : '绘图'}}文件</p>
        <div>
          确认结果：
          <RadioGroup v-model="info.result">
            <Radio label="1" >没问题</Radio>
            <Radio label="2" >有问题，需要修改</Radio>
          </RadioGroup>
        </div>
        <Input class="textarea" v-if="info.result === '2'" v-model="info.suggest" type="textarea" maxlength="200" :rows="4" placeholder="输入修改建议" />
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleOk">确认</Button>
      </div>
    </Modal>

    <!-- 驳回原因 -->
    <Modal
      v-model="reasonVisible"
      width="400"
      title="驳回原因">
      <div class="reason">
        {{ reason }}
      </div>
      <div slot="footer">
        <Button type="primary" @click="reasonVisible = false">我知道了</Button>
      </div>
    </Modal>

    <!-- 上传文件 -->
    <Modal
      v-model="uploadVisible"
      width="500"
      title="上传绘图文件">
      <div class="upload">
        <Row>
          <Col span="6"><span class="label"><strong>*</strong>上传文件：</span></Col>
          <Col span="18">
            <Upload :action="uploadUrl" class="uploadBox" :format="['zip','rar','pdf']" :on-success="(res,file,fileList)=>{handleSuccess(res,file,fileList)}" :on-remove="(file,fileList)=>{handleRemoveFile (file,fileList)}" :before-upload="handleBeforeUpload" :on-format-error="handleFormatError">
              <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
            </Upload>
            <p>支持格式：zip、rar、pdf</p>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="uploadVisible = false">取消</Button>
        <Button type="primary" @click="handleSubmitFile">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import '@/assets/style/common.less'
import {confirmFile, submitDrawFile} from '@/api/myPatent'
export default {
  data () {
    return {
      visible: false,
      info: {
        result: '1',
        suggest: undefined
      },
      fileTypeMap: {
        1: '建模文件',
        2: '绘图文件',
        3: '审查意见答复材料'
      },
      current: {},
      reasonVisible: false,
      reason: '',
      uploadVisible: false,
      uploadFileList: []
    }
  },
  props: {
    fileList: {
      type: Array
    },
    modelingDrawWorkOrder: {
      type: Object
    }
  },
  mounted () {},
  methods: {
    // 确认
    handleOk () {
      const { info } = this
      if (info.result === '2' && !info.suggest) {
        this.$Message.warning('请输入修改建议')
        return
      }
      confirmFile({
        ...info,
        workOrderId: this.current.id
      }).then(res => {
        if (res.code === 0) {
          this.$Message.success('文件已确认')
          this.visible = false
          this.$emit('onChange')
        }
      })
    },
    // 上传文件
    handleSuccess (res, file, fileList) {
      this.uploadFileList = [{
        fileUrl: res.data.fileUrl
      }]
    },
    handleRemoveFile () {
      this.uploadFileList = []
    },
    handleBeforeUpload () {
      const check = this.uploadFileList.length === 0
      if (!check) {
        this.$Message.warning('只能上传一个文件')
      }
      return check
    },
    handleFormatError (file) {
      this.$Message.warning('文件类型错误，只支持zip、rar、pdf')
    },
    // 提交绘图文件
    handleSubmitFile () {
      if (this.uploadFileList.length === 0) {
        this.$Message.warning('请先上传绘图文件')
        return
      }
      submitDrawFile({
        fileStr: this.uploadFileList[0].fileUrl,
        serviceId: this.modelingDrawWorkOrder.serviceId
      }).then(res => {
        if (res.code === 0) {
          this.$Message.success('提交成功')
          this.uploadVisible = false
          this.$emit('onChange')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  a {
    color: #00a4ff;
    margin: 0 5px;
  }
  .table {
    text-align: center;
    font-size: 14px;
    border-collapse: collapse;
    margin-top: 20px;
    thead {
      td {
        height: 44px;
        line-height: 44px;
        width: 23%;
        color: #333;
        font-weight: 700;
        border-top: solid 1px #e9e9e9;
        background: #fafafa;
      }
      td:first-child {
        width: 8%;
        border-left: solid 1px #e9e9e9;
      }
      td:last-child {
        border-right: solid 1px #e9e9e9;
      }
    }
    tbody {
      td {
        border: solid 1px #e9e9e9;
        padding: 16px 0;
      }
      .empty{
        padding: 190px 0;
        text-align: center;
      }
    }
  }
}
.dialog-content{
  padding: 10px 10px 30px;
  p{
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
    img{
      margin-right: 10px;
    }
  }
  div{
    margin-bottom: 10px;
  }
}
.reason{
  padding:10px 0 30px;
  word-break: break-all;
}
.upload{
  padding: 50px 0;
  .label{
    text-align: right;
    width: 100%;
    display: inline-block;
    line-height: 32px;
    strong{
      color: #f00;
    }
  }
}
</style>
