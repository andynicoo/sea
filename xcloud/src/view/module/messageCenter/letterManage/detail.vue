<template>
  <div class="saleDetail">
    <div class="header-container">
      <div class="back" @click="navigate()">
        <Icon type="ios-arrow-back" />
        返回列表
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="state">
          <span>
            <span>信件类型：{{ rowData.typeName }}</span>
            <span class="statusStyle">
              <span class="talkbubble">{{ info.processStatus | filterStatus }}</span>
            </span>
          </span>
        </div>

        <el-descriptions>
          <el-descriptions-item label="客户手机号">{{ info.taxUserMobile }}</el-descriptions-item>
          <el-descriptions-item label="VAT税号">{{ info.vatTaxNumber }}</el-descriptions-item>
          <el-descriptions-item label="客户公司名称">{{ info.companyNameZh }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="block-title big-size">基本信息</div>
        <el-descriptions>
          <el-descriptions-item label="信件类型">{{ rowData.typeName }}</el-descriptions-item>
          <!-- <el-descriptions-item label="VAT税号">{{ info.vatTaxNumber }}</el-descriptions-item> -->
          <!-- <el-descriptions-item label="客户手机号">{{ info.taxUserMobile }}</el-descriptions-item> -->
          <el-descriptions-item label="是否需用户处理">{{ info.processStatus | filterStatus }}</el-descriptions-item>
          <!-- <el-descriptions-item label="信件接收时间">
            {{ info.receiveTime && info.receiveTime.slice(0, 10) }}
          </el-descriptions-item> -->
          <el-descriptions-item label="税号对应国家">{{ info.taxCountry }}</el-descriptions-item>
          <el-descriptions-item label="信件内容" :span="3">{{ info.processSuggestions }}</el-descriptions-item>
          <el-descriptions-item label="信件文件" :span="3">
            <span v-for="(item, index) in info.fileList" :key="index">
              <el-image v-if="item.isImage" class="block-img" :src="item.url" :preview-src-list="[item.url]"></el-image>
              <div v-else style="margin-bottom: 5px">
                <el-link type="primary" :href="item.url" class="el-icon-paperclip" target="_blank">
                  {{ item.name }}
                </el-link>
              </div>
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="block-title big-size">其他信息</div>
        <!-- <el-button type="text" class="check-btn">查看详情操作日志</el-button> -->
        <div class="other-info-wrapper">
          <div class="ope-block">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <div class="ope-info">
              <div class="ope-content">发送人：{{ info.sender }}</div>
              <div class="ope-content">发送时间：{{ info.sendTime }}</div>
            </div>
          </div>
          <!-- <div class="ope-block">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <div class="ope-info">
              <div class="ope-content">修改人：{{ info.modifyName }}</div>
              <div class="ope-content">修改时间：{{ info.updateTime }}</div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import letterTypeList from "./letterTypeList";
import { getStationLetterAllInfo } from "@/api/newApi/messageCenter/letterManage";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      rowData: this.$route.params.rowData,
      info: {},
      letterTypeList: letterTypeList
    };
  },
  filters: {
    filterIsSend(isSend) {
      switch (isSend) {
        case 0:
          return "未发送";
        case 1:
          return "已发送";
      }
    },
    filterStatus(status) {
      switch (status) {
        case 0:
          return "无需处理";
        case 1:
          return "待处理";
        case 2:
          return "已处理";
        case 3:
          return "处理完成";
      }
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getStationLetterAllInfo(this.rowData.id).then(res => {
        let result = res.data;
        // result.typeStr = letterTypeList.find((item) => item.value === result.type - 0).name;
        let imgSuffix = ["jpg", "png", "jpge", "gif"];
        let files = this.$util.splitStr(result.letterFile);
        let fileNames = this.$util.splitStr(result.fileNames || result.letterFile);
        result.fileList = files
          .map((item, index) => ({
            isImage: imgSuffix.includes(item.substr(item.lastIndexOf(".") + 1).toLowerCase()),
            name: fileNames[index] || files[index],
            url: files[index].replace("http:", "https:")
          }))
          .sort((a, b) => a.isImage - b.isImage);
        this.info = result;
      });
    },
    ...mapMutations(["closeTag"]),
    navigate() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/messageCenter/letterManage/index"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.block-title {
  margin-bottom: 20px;
}
.back {
  margin-bottom: 20px;
  cursor: pointer;
}
::v-deep .el-descriptions-item__label {
  white-space: nowrap;
}
.border-box {
  border: 1px solid #eeeeee;
  margin: 30px 0;
  padding: 20px 30px;
}
.saleDetail {
  .header-container {
    padding: 20px;
    background-color: #fff;
    .state {
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding: 20px 0;
      .sn {
        font-size: 14px;
        margin-left: 5px;
        font-weight: bold;
      }
    }
  }
  .block-img {
    width: 200px;
    height: 100px;
    margin-right: 10px;
    cursor: zoom-in;
  }
  .table-title {
    font-size: 16px;
    padding: 20px 0;
    color: #333;
  }
  .check-btn {
    width: 100% !important;
    text-align: right !important;
    border-top: 1px solid #ccc;
  }
  .other-info-wrapper {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    .ope-block {
      display: flex;
      margin-right: 30px;
      margin-bottom: 50px;
      .avatar {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .ope-info {
        width: 250px;
        margin-left: 10px;
      }
    }
  }
}
</style>
