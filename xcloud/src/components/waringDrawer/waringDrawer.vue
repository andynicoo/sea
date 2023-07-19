<template>
  <el-drawer size="750px" class="d-main" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
    <template slot="title">
      <el-row class="d-title">
        <el-col :span="3">工单跟进</el-col>
        <el-col :span="8">当前服务进度：{{ currentNode.nodeName }}</el-col>
        <el-col :span="7">服务状态：{{ curreentService.value }}</el-col>
        <el-col :span="6" v-if="deatailData.warnValue > 0"
          >超过 <span>{{ deatailData.warnValue }}天</span>未处理</el-col
        >
      </el-row>
    </template>
    <div class="d-content">
      <div class="heard">
        <el-row>
          <el-col :span="8">订单号：{{ deatailData.orderNo }}</el-col>
          <el-col :span="8">服务名称：{{ deatailData.serviceName }}</el-col>
          <el-col :span="8">销售跟进人：{{ deatailData.attributionName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">服务号：{{ deatailData.serviceNo }}</el-col>
          <el-col :span="8">国家：{{ deatailData.countryNameZh }}</el-col>
          <el-col :span="8">客户等级：{{ deatailData.userLevel == 1 ? 'vip客户' : deatailData.userLevel == 0 ? '普通客户' : '' }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">服务公司：{{ deatailData.companyNameZh }}</el-col>
          <el-col :span="8" v-for="(item, index) in jsonHander(deatailData.handler)" :key="index">{{ item }} </el-col>
        </el-row>
      </div>
      <p class="title">跟进记录</p>
      <el-timeline class="d-time-line">
        <el-timeline-item v-for="(activity, index) in activities" :key="index">
          <el-row>
            <el-col :span="4">
              {{ activity.publishName }}
            </el-col>
            <el-col :span="16">
              {{ activity.publishTime }}
            </el-col>
            <el-col :span="4">
              {{ activity.trackType == 'TRACK_REMARKS' ? '跟单备注' : activity.trackType == 'TRACK_REJECT' ? '工单驳回' : '订单备注' }}
            </el-col>
          </el-row>
          <div class="card">
            <el-row>
              <el-col :span="24" style="word-wrap: break-word">
                {{ activity.content }}
              </el-col>
            </el-row>
            <el-row class="tag">
              <el-tag class="my-el-tag" v-for="(tag, tagIdx) in setTag(activity.handledName)" :key="tagIdx"> {{ tag.position }}:{{ tag.nickName }}({{ tag.isHandel ? '已处理' : '未处理' }})</el-tag>
              <el-tag class="enclosure" v-if="activity.attachment">
                <el-link type="primary" :underline="false" target="_blank" :href="activity.attachment"> 附件:{{ activity.attachment }} </el-link>
              </el-tag>
            </el-row>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-form ref="form" class="d-form" :model="form" label-width="80px">
        <el-row>
          <el-input class="d-textrea" v-model="form.content" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="500" placeholder="请输入跟单备注信息"> </el-input>
        </el-row>
        <el-row style="margin: 10px">
          <el-col :span="24">
            <el-upload
              :format="['jpg', 'pdf', 'jpej', 'png']"
              :max-size="5 * 1024"
              :action="workOrderFileName"
              ref="waringUplod"
              :file-list="defaultFileList"
              :before-upload="beforeUploadAccept1"
              :on-format-error="formatErrorHandler1"
              :on-success="
                (res, file, fileList) => {
                  successHandlerAccept1(res, file, fileList);
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeHandlerAccept1(file, fileList);
                }
              "
              style="accept-upload"
            >
              <a style="color: #2d8cf0" icon="ios-cloud-upload-outline">上传附件</a>
            </el-upload>
          </el-col>
        </el-row>
        <el-row class="d-checkBox">
          <div v-if="!isComplete">
            <el-checkbox v-model="checked.checked1" v-if="deatailData.attributionName">通知销售人员:({{ deatailData.attributionName }})</el-checkbox>
            <span v-for="(item, index) in jsonHander(deatailData.handler)" :key="index">
              <el-checkbox v-model="checked[`checked${index + 2}`]" v-if="item && item != ''">通知 {{ item }} </el-checkbox>
            </span>
          </div>
        </el-row>
        <el-row>
          <el-col :span="16"> <el-checkbox v-if="isComplete" v-model="form.isComplete">提交后完成待办</el-checkbox></el-col>
          <el-col :span="8">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="submit">提交备注</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import { saveFollow, getWarningRecords } from '../../api/home/service';
import { serviceWorkOrderDetail } from '../../api/newApi/workOrder/commonOperator';
import { getBaseUserInfo } from '../../api/user';
import { serviceProgress, serviceStatus } from '../../api/newApi/common';

export default {
  name: 'WaringDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: [String, Number],
    detailId: [String, Number],
    functionCode: [String, Number],
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      direction: 'rtl',
      form: {
        relationPeopleList: [{}, {}],
      },
      activities: [],
      defaultFileList: [],
      deatailData: {},
      checked: {},
      nodeInfoList: [],
      serviceInfoList: [],
    };
  },
  watch: {
    checked: {
      handler: function (val) {
        this.form.relationPeopleList = [];
        if (val) {
          let keys = Object.keys(val);
          for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            if (val[element] == true && element == 'checked1') {
              this.form.relationPeopleList.push({ userId: this.deatailData.attributionId });
            }
            if (val[element] == true && element != 'checked1') {
              let userIdArr = this.deatailData.handlerUserId.split('\n');
              this.form.relationPeopleList.push({ userId: userIdArr[index - 1] });
            }
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    drawer: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    currentNode() {
      const currentNodeCode = this.deatailData.currentNodeCode;
      if (currentNodeCode) {
        let info = this.nodeInfoList.find(({ nodeCode }) => nodeCode == currentNodeCode);
        return info || { nodeName: '' };
      } else {
        return { nodeName: '' };
      }
    },
    curreentService() {
      const status = this.deatailData.status;
      if (status) {
        let serciceitem = this.serviceInfoList.find(({ code }) => code == status);
        return serciceitem || { value: '' };
      } else {
        return { value: '' };
      }
    },

    setTag() {
      return (json) => {
        try {
          let arr = JSON.parse(json);
          return arr;
        } catch (error) {
          return [];
        }
      };
    },

    jsonHander() {
      return (val) => {
        try {
          let strArr = val.split('\n');
          return strArr;
        } catch (error) {
          return [];
        }
      };
    },
  },
  async created() {
    if (this.detailId) {
      const { code: detailCode, data: deatailData } = await serviceWorkOrderDetail(this.detailId);
      this.deatailData = detailCode == 0 && deatailData;
      this.getRecord();
    }
    const { functionCode: currentNode } = this.deatailData;
    const functionCode = this.functionCode || currentNode;
    let { data: nodeInfoList } = await serviceProgress({ functionCode });
    let { data: serviceInfoList } = await serviceStatus();
    this.nodeInfoList = nodeInfoList;
    this.serviceInfoList = serviceInfoList;
  },
  methods: {
    handleClose(done) {
      this.drawer = false;
      done();
    },

    async getRecord() {
      const { data: followData } = await getWarningRecords({ serviceOrderId: this.deatailData.workId, size: -1 });
      this.activities = followData.records;
    },
    submit() {
      let idList = Object.values(this.checked).filter((item) => !!item);
      if (idList.length) {
        this.sumbitDialog(idList);
      } else {
        this.saveFollowApi();
      }
    },

    async sumbitDialog(list) {
      const h = this.$createElement;
      const tips = [h('p', null, '提交后将会向以下人员发送待办消息，确认提交吗？')];
      let node = [];
      for (let index = 0; index < list.length; index++) {
        if (this.form.relationPeopleList[index]) {
          const element = this.form.relationPeopleList[index].userId;
          if (element) {
            const { data: userInfo } = await getBaseUserInfo({ userId: element });
            const { workPosition: position, nickName } = userInfo;
            this.form.relationPeopleList[index] = { userId: element, position, nickName };
            node.push(h('el-row', null, [h('el-col', { props: { span: 12 } }, userInfo.nickName + '_' + userInfo.workNum), h('el-col', { props: { span: 12 } }, userInfo.workPosition)]));
          }
        }
      }

      let dom = h('div', null, [tips.concat(node)]);
      let next = this.form.relationPeopleList.map(({ nickName }) => nickName).filter((item) => !!item);
      if (next.length == list.length) {
        this.$msgbox({
          title: '提示',
          message: dom,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              this.saveFollowApi();
              done();
            } else {
              done();
            }
          },
        }).then((action) => {
          // done();
        });
      } else {
        this.saveFollowApi();
      }
    },

    beforeUploadAccept1(file) {
      const check = this.form.attachment;
      if (check && check !== '') {
        this.$message({
          message: '最多只可上传1个文件',
          type: 'warning',
        });
        return false;
      } else if (file.size > 5242880) {
        this.$message({
          message: '文件大小超过5M',
          type: 'warning',
        });
        return false;
      }
    },
    formatErrorHandler1() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传jpg,pdf格式的文件',
      });
    },

    successHandlerAccept1(res, file, fileList) {
      let self = this;
      if (res.code !== 0) {
        self.$message({
          type: 'warning',
          message: '请尝试再次上传',
        });
        return false;
      }
      this.form.attachment = res.data.fileUrl;
    },
    removeHandlerAccept1() {
      this.form.attachment = '';
    },

    async saveFollowApi() {
      const { serviceNo, workNo, orderNo, workId: serviceOrderId } = this.deatailData;
      // if (this.isComplete) {
      const list = this.form.relationPeopleList;
      this.form.relationPeopleList = list.filter((item) => Object.keys(item).length > 1);
      // } else {
      //   this.form.relationPeopleList && delete this.form.relationPeopleList;
      // }

      let { code } = await saveFollow({ ...this.form, id: this.id, serviceProgress: this.currentNode.nodeName, serviceNo, workNo, orderNo, serviceOrderId, trackType: 'TRACK_REMARKS', identification: 'GDBZ' });
      let ble = code != 0;
      this.$refs['waringUplod'].clearFiles();
      let msg = `消息发送${ble ? '失败' : '成功'}`;
      this.$message[ble ? 'error' : 'success'](msg);
      this.getRecord();
      this.$emit('update');
      this.form.content = '';
      this.from.attachment = '';
    },
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
