<template>
  <div class="feedback">
    <a-modal v-model="visible" title="意见反馈" @ok="handleOk" @cancel="handleOk" width="735px" :footer="null">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="反馈类型" prop="resource">
          <div class="feedbtn">系统功能建议</div>
        </a-form-model-item>

        <a-form-model-item label="功能模块" prop="functionalModule">
          <a-select v-model="form.functionalModule" placeholder="please select your zone">
            <a-select-option value="官网"> 官网 </a-select-option>
            <a-select-option value="产品服务"> 产品服务 </a-select-option>
            <a-select-option value="外观专利"> 外观专利 </a-select-option>
            <a-select-option value="工具箱"> 工具箱 </a-select-option>
            <a-select-option value="订单管理"> 订单管理 </a-select-option>
            <a-select-option value="账户管理"> 账户管理 </a-select-option>
            <a-select-option value="其他"> 其他 </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item ref="title" label="标题" prop="title">
          <a-input
            v-model="form.title"
            @blur="
              () => {
                $refs.title.onFieldBlur();
              }
            "
            placeholder="请准确概况要反馈的问题"
          />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-input
            v-model="form.description"
            type="textarea"
            :autoSize="{ minRows: 3, maxRows: 6 }"
            placeholder="Hi~我们正在倾听，请提供详细使用场景描述，帮助我们理解~感谢配合~"
          />
        </a-form-model-item>
        <!-- <a-button> <a-icon type="upload" /> 上传图片 </a-button> -->
        <a-form-model-item label="描述" prop="filePath">
          <a-upload
            :action="ImgUrl"
            list-type="picture-card"
            @change="(value) => handleChange2(value, 'defaultFileList')"
            :file-list="defaultFileList"
            accept=".jpg,.png,pdf"
          >
            <div v-if="defaultFileList.length < 6">
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
              <p class="uptips">jpg、png、pdf</p>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 6, offset: 16 }">
          <a-button type="primary" @click="onSubmit" :loading="subminting" class="ksy-mr-1"> 提交 </a-button>
          <a-button style="margin-left: 10px" @click="handleOk"> 取消 </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { sendFeedBack } from '../../../api/payment/index';
export default {
  props: {
    enterpriseId: {
      type: Number | String,
      default: '',
    },
    userId: {
      type: Number | String,
      default: '',
    },
    userMobile: {
      type: Number | String,
      default: '',
    },
  },
  data() {
    return {
      visible: true,
      defaultFileList: [],
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      other: '',
      form: {
        title: '',
        resource: '1',
        functionalModule: '产品服务',
        mobile: '',
        description: '',
        filePath: '',
      },
      loading: false,
      rules: {
        resource: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 50, message: '请不要超过50个字符', trigger: 'blur' },
        ],
        functionalModule: [{ required: true, message: '请选择模块', trigger: 'blur' }],
      },
      subminting: false,
    };
  },
  methods: {
    handleOk(e) {
      this.$emit('closeCom', {});
    },
    //随机字符
    randomString(e) {
      var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = '';
      for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
      return n;
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let picArr = this.defaultFileList.map((item) => {
            if (item.response.code === 0) {
              return item.response.data.fileUrl;
            }
          });
          let params = {
            ...this.form,
            screenshot: picArr.join(','),
            status: true,
            mobile: this.userMobile,
            userId: this.userId,
            enterpriseId: this.enterpriseId,
            feedbackNo: this.randomString(6),
          };

          // let { code, message } = await this.$axiosApi(common.sendFeedBack.url, common.sendFeedBack.methods, params);
          sendFeedBack(params)
            .then((res) => {
              console.log(res, 1);
              this.visible = false;
              this.$message.success('已收到，我们会认真考虑并积极改进，感谢您帮助我们成长');
            })
            .catch((err) => {
              console.log(err, 2);
              this.visible = false;
              this.$message.error(err.message);
            });
          // console.log(res);
          // this.visible = false;
          // if (res.code === 0) {
          //   this.$message.success('已收到，我们会认真考虑并积极改进，感谢您帮助跨税云成长');
          // } else {
          //   this.$message.error(message);
          // }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancal() {
      this.$emit('cancal');
    },
    handleChange2({ file, fileList }, showList) {
      let fileListCopy = fileList;

      fileListCopy = fileListCopy.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.$data[showList] = fileListCopy;
    },
  },
};
</script>

<style lang="less" scoped>
.feedback {
}
</style>
