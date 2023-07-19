<!-- oa工单详情 关联文件信息 -->
<template>

  <div>
    <el-row class="re-table-title">
      {{tableTitle}}
    </el-row>
    <div class="re-table info-table">
      <table style="width: 100%;text-align: center" cellpadding="0" cellspacing="0">
        <tr class="t-header">
          <th v-for=" (val,index) in tableHeaderDat" :key="index">{{val}}</th>
        </tr>
        <tr v-for="(item,index) in answerFileList" :key="index">
          <td style="width:68px;">{{index+1}}</td>
          <td style="width:310px;">
            {{item.subServiceNo || '--'}}
          </td>
          <td style="width:200px; " class="file-info">
            <a v-if="item.fileUrl != ''" :href="replaceHttps(item.fileUrl)" target="_blank" class="file-info">
              {{initFileNameFunc(item.fileUrl)}}(可点击查看)
            </a>
            <a v-else-if="item.downloadAble == 1" @click="dowEvidence(item)" target="_blank" class="file-info">
              下载使用证据
            </a>
            <span v-else>
              {{"无需上传答复材料"}}
            </span>
          </td>
          <td style="width:170px;"><span>{{item.nodeCodeStr !='' ? '使用证据补正': item.fileType==1?'受理回执':item.fileType==2?'受理书':item.fileType==3?'审查意见':item.fileType==4?'审查意见的答复函':item.fileType==7?'暂停信':''}}</span></td>
          <td style="width:170px;">{{item.nodeCodeStr !='' ? item.nodeCodeStr : setStatus(item.status) }}</td>
          <td style="width:170px;">{{item.updateTime||'--'}}</td>
          <td style="width:140px;border-right:none;" class="operation-td">
            <!--  -->
            <div @click="openPlatform(item)" v-if="item.status==6 && isShowPlatformBtn(item)" v-show="hasAuthority('U1_9')">平台审核</div>
            <div @click="openLawyer(item)" v-if="item.status==7 && isShowPlatformBtn(item)" v-show="hasAuthority('U1_10')">律师审核</div>
            <!-- 用subServiceNo 判断预览 -->
            <div v-if="item.nodeCodeStr && item.nodeCodeStr != '' " @click="openPreview(item)">预览</div>
          </td>
        </tr>
      </table>
    </div>
    <r-examine ref="refExamine" v-if="exmineShow" :id="examineID" :key="exmineKey" :exmineShow.sync="exmineShow" :title="examineData.title" :lableList="examineData.lableList">
      <div slot="em-tips">
        <div class="em-tips-style">
          <div v-if='emSolt'>
            <el-row class="em-row em-row-tips">注意：审核以客户上传的最新材料为准</el-row>
            <el-row class="em-row">审核通过后，将由律师审核；资料不对，被驳回的，客户需按照要求修改资料</el-row>
          </div>
          <div v-else>
            <el-row class="em-rwo">律师审核通过，即已撰写官文回复商标局；资料不对，则驳回，填写驳回原因，客户需按照要求修改资料</el-row>
          </div>
        </div>
      </div>

    </r-examine>
    <r-preview v-if="previewShow" :id="previewID" :previewShow.sync="previewShow"></r-preview>
  </div>
</template>

<script>
import * as API from '@/api/newApi/intellectualProperty/oa.js';
import { getToken } from '@/libs/util';
export default {
  name: 'RelationOaFile',
  props: {
    tableTitle: String,
    oaId: {
      type: Number,
    },
  },
  data() {
    return {
      tableHeaderDat: ['序号', '子服务号', '相关文件信息', '文件类型', '状态', '更新时间', '操作'],
      examineData: {
        lableList: ['OA审核通过', 'OA不对，驳回', '仅驳回使用证据'],
        title: '平台审核',
      },
      answerFileList: [
        {
          createTime: '2022-04-28 17:31:45',
          answerFile: '',
          status: 6,
        },
        {
          createTime: '2022-04-28 17:31:45',
          answerFile: '',
          status: 7,
        },
        {
          createTime: '2022-04-28 17:31:45',
          answerFile: '',
          status: 7,
        },
      ],
      exmineShow: false,
      exmineKey: new Date().getTime(),
      emSolt: false,
      previewShow: false,
      serviceId: this.$route.query.serviceId,
      examineID: '',
      previewID: '',
    };
  },

  components: {
    RExamine: () => import('../../trademarkComponents/examine/index.vue'),
    RPreview: () => import('../preview/index.vue'),
  },

  created() {
    this.getList();
  },
  methods: {
    // 平台审核按钮展示
    isShowPlatformBtn(item) {
      // == null 仅仅oa单, || oa+补正单 补证 单已完成
      return item.evidenceStatus == null || item.evidenceStatus == '' || item.evidenceStatus == 'NODE0043'
        ? true
        : false;
    },
    dowEvidence(item) {
      let self = this;
      let formData = new FormData();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open(
        'get',
        this.baseUrl +
          '/workorder/management/trademark/workorder/standard/zipdowloadEvidence?serviceId=' +
          item.serviceId,
        true
      );
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken());
      xmlResquest.responseType = 'blob';
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = '';
        if (oEvent.currentTarget.status == 200 && oEvent.currentTarget.readyState == 4) {
          fileName = item.subServiceNo + item.acceptNum + '使用证据补正.zip';
        } else {
          self.$Message.warning('文件内容缺失，请补全再下载！');
          return;
        }
        // 组装a标签
        let elink = document.createElement('a');
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = 'none';

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    /**获取oa关联文件信息 */
    async getList() {
      let { code, message, data } = await API.getRelationFiles({ serviceId: this.serviceId, workId: 0 });
      if (code == 0) {
        this.answerFileList = data;
      } else {
        this.$message({ type: 'error', message });
      }
    },

    initFileNameFunc(fileName) {
      return fileName.slice(fileName.length - 36, fileName.length);
    },

    /**平台审核 */
    openPlatform(item) {
      this.setExamineData(true);
      this.exmineShow = true;
      this.examineID = item.id;
    },

    /**律师审核 */
    openLawyer(item) {
      this.setExamineData(false);
      this.exmineShow = true;
      this.examineID = item.id;
    },
    //打开预览
    openPreview(item) {
      this.previewID = item.serviceId;
      this.previewShow = true;
    },

    setStatus(data) {
      const stautsEM = [
        '正常', //1
        '被驳回', //2
        '待翻译OA', //3
        '已翻译审查意见', //4
        '待提交答复材料', //5
        '平台审核', //6
        '律师审核', //7
        '已答复审查意见', //8
        '答复材料有误', //9
        '收到暂停信', //10
        '已翻译暂停信', //11
        '待客户付款', //12
        '待上传OA文件', //13
        '取消答复审查意见', //14
      ];
      return stautsEM[data - 1];
    },

    setExamineData(type) {
      this.emSolt = type;
      let list = type
        ? ['OA审核通过', 'OA不对，驳回', '仅驳回使用证据']
        : ['审核通过', '资料不对，驳回', '仅驳回使用证据'];
      this.examineData = {
        title: type ? '平台审核' : '律师审核',
        lableList: list,
      };
    },
  },
};
</script>
<style lang='scss' scoped>
.re-table th {
  padding: 8px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.operation-td {
  div {
    cursor: pointer;
    color: #00a3ff;
    min-width: 60px;
  }
}

.re-table-title {
  font-size: 18px;
  padding-top: 10px;
}

.info-table {
  margin-top: 6px;
  // width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  box-sizing: border-box;
  tr {
    td {
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      border-right: 1px solid rgba(0, 0, 0, 0.06);
      word-break: break-word;
    }
  }
  .header {
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    th {
      padding: 8px 0;
      border-right: 1px solid rgba(0, 0, 0, 0.06);
    }
  }
  td {
    padding: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
}
.em-tips-style {
  font-family: 'Arial Normal', 'Arial', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  .em-row {
    height: 27px;
  }
  .em-row-tips {
    font-weight: 700;
    color: rgba(102, 102, 102, 0.996078431372549);
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
  }
}
.file-info {
  color: #1890ff;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  // font-weight: bold;
}
</style>