<template>
  <div class="mainContent">
    <div class="goback">
      <span
        class="gobackIcon"
        @click="
          $router.push({
            path: `/myPatent`,
          })
        "
        ><img src="@/assets/images/common/left_arrar.svg"
      /></span>
      <strong>当前状态：</strong>
      <span>{{ processMap[info.serviceInfo.cureentNodeCode] }}</span>
    </div>
    <div class="tips" v-if="this.officialStatus || this.myFileStatus">
      <img src="@/assets/images/common/yellowTip.png" class="question" />您有待处理的文件，<a @click="handleTab"
        >立即处理</a
      ><img src="@/assets/images/common/right_arrar.svg" />
    </div>

    <Tabs v-model="activeName" :animated="false">
      <TabPane label="专利信息" name="0">
        <PatentInfo />
      </TabPane>
      <TabPane label="官方文件" name="1">
        <OfficialFile
          :fileList="info.officialFileList"
          :designPatentWorkOrder="info.designPatentWorkOrder"
          :serviceInfo="info.serviceInfo"
          :designPatentOaWorkOrder="info.designPatentOaWorkOrder"
          @onChange="handleFetch"
          :isCancel="isCancel"
        />
      </TabPane>
      <TabPane label="我的文件" name="2">
        <MyFile
          :fileList="info.myFileList"
          :modelingDrawWorkOrder="info.modelingDrawWorkOrder"
          @onChange="handleFetch"
        />
      </TabPane>
      <TabPane label="寄送地址" name="3">
        <Address
          :companyShippingInfo="info.companyShippingInfo"
          :designPatentWorkOrder="info.designPatentWorkOrder"
          @onChange="handleFetch"
        />
      </TabPane>
      <TabPane label="费用信息" name="4" v-if="info.designPatentWorkOrder.serviceId">
        <CostInfo v-if="activeName === '4'" :designPatentWorkOrder="info.designPatentWorkOrder" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import '@/assets/style/common.less';
import { getPatentDetail } from '@/api/myPatent';
import PatentInfo from './patentInfo.vue';
import OfficialFile from './officialFile.vue';
import MyFile from './myFile.vue';
import Address from './address.vue';
import CostInfo from './costInfo.vue';
import isServiceCancel from '@/mixin/isServiceCancel';
export default {
  components: {
    PatentInfo,
    OfficialFile,
    MyFile,
    Address,
    CostInfo,
  },
  mixins: [isServiceCancel],
  data() {
    return {
      processMap: {
        NODE0074: '待提交资料',
        NODE0075: '初步审核',
        NODE0076: '律师审核',
        NODE0077: '审核期',
        NODE0078: '注册成功',
        NODE0079: '建模中',
        NODE0080: '审核建模',
        NODE0081: '客户确认建模',
        NODE0082: '绘图中',
        NODE0083: '审核绘图',
        NODE0084: '客户确认绘图',
        NODE0085: '已完成',
      },
      activeName: '0',
      officialStatus: false,
      myFileStatus: false,
      info: {
        officialFileList: [],
        myFileList: [],
        companyShippingInfo: {
          consignee: '',
          mobile: '',
          address: '',
        },
        serviceInfo: {
          cureentNodeCode: '',
        },
        designPatentWorkOrder: {
          courierCompany: '',
          courierNo: '',
          serviceId: '',
        },
        modelingDrawWorkOrder: {
          serviceId: '',
        },
      },
    };
  },
  mounted() {
    this.handleFetch();
  },
  methods: {
    // 专利列表
    getDetail(serviceId) {
      getPatentDetail(serviceId).then((res) => {
        if (res.code === 0) {
          this.info = res.data;
          this.ifCancel(res.data.serviceInfo.status);
          // 遍历是否有待处理的文件
          this.getBeProcessed(res.data);
        }
      });
    },
    // 立即处理，跳转对应tab
    handleTab() {
      if (this.officialStatus) {
        this.activeName = '1';
      }
      if (this.myFileStatus) {
        this.activeName = '2';
      }
    },
    // 更新详情
    handleFetch() {
      this.getDetail(this.$route.params.id);
    },
    // 是否有文件待处理
    getBeProcessed(data) {
      // 是否有待处理官方文件
      data.officialFileList.forEach((item) => {
        if (item.fileType === 1 && (item.nodeCode === 'NODE104-002' || item.nodeCode === 'NODE104-003')) {
          this.officialStatus = true;
        }
      });

      // 是否有待处理我的文件
      data.myFileList.forEach((item) => {
        if (
          (item.fileType === 1 && item.nodeCode === 'NODE0081') ||
          (item.fileType === 2 && item.nodeCode === 'NODE0084')
        ) {
          this.myFileStatus = true;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  color: #333;
  padding: 25px 20px;
  min-height: 700px;
  /deep/.formCreate {
    padding: 0;
  }
  .goback {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .gobackIcon {
      cursor: pointer;
    }
    strong {
      font-size: 20px;
      margin-left: 5px;
    }
    span {
      color: #ff6a07;
      font-size: 14px;
    }
  }
  a {
    color: #00a4ff;
  }
  .tips {
    height: 36px;
    background: #fffbe6;
    border: 1px solid #ffe58f;
    margin: 15px 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
    a {
      margin-right: 5px;
    }
    .question {
      margin-right: 8px;
    }
  }
  /deep/ .ivu-tabs-bar {
    margin: 0;
  }
  /deep/ .ivu-tabs-nav .ivu-tabs-tab {
    padding: 8px 0;
  }
}
</style>
