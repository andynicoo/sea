<template>
  <div class="saleDetail">
    <div class="header-container">
      <div class="header">
        <div class="back" @click="back()">
          <Icon type="ios-arrow-back" />
          返回列表
        </div>
        <div class="btn-group">
          <el-button type="primary" size="small" @click="edit" v-if="hasAuthority('E1_14')">编辑</el-button>
          <el-button type="primary" size="small" class="yellow-btn" @click="_changeDisableStatus" v-if="hasAuthority('E1_15')">
            {{ (3 - info.isOpen) | filterStatus }}
          </el-button>
          <el-button size="small" v-if="info.isOpen === 2" @click="del" v-show="hasAuthority('E1_16')">删除</el-button>
        </div>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="state">
          <span>
            <span>{{ info.attorneyName }}</span>
            <span class="statusStyle">
              <span class="talkbubble">{{ info.isOpen | filterStatus }}</span>
            </span>
          </span>
        </div>
        <div class="info-wrapper">
          <el-descriptions>
            <el-descriptions-item label="律师编码">{{ info.attorneyCode }}</el-descriptions-item>
            <el-descriptions-item label="律师英文名称">{{ info.attorneyAbbreviation }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ info.attorneyTel }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ info.attorneyEmail }}</el-descriptions-item>
            <el-descriptions-item label="所属企业">{{ enterpriseName }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="block-title big-size">基本信息</div>
        <el-descriptions>
          <el-descriptions-item label="律师名称">{{ info.attorneyName }}</el-descriptions-item>
          <el-descriptions-item label="公司名称">{{ info.attorneyCompanyNameEn }}</el-descriptions-item>
          <el-descriptions-item label="服务分类">{{ info.categoryNames }}</el-descriptions-item>
          <el-descriptions-item label="国家">{{ info.countryName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ info.attorneyTel }}</el-descriptions-item>
          <el-descriptions-item label="邮箱1">{{ info.attorneyEmail }}</el-descriptions-item>
          <el-descriptions-item label="邮箱2">{{ info.attorneyTwoEmail }}</el-descriptions-item>
          <el-descriptions-item label="律师代表">{{ info.attorneyRepresentative }}</el-descriptions-item>
          <el-descriptions-item label="邮编">{{ info.attorneyPostcode }}</el-descriptions-item>
          <el-descriptions-item label="传真号">{{ info.attorneyFaxNo }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ info.address }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="block-title big-size">律师执照</div>
        <el-descriptions>
          <el-descriptions-item label="参考号">{{ info.attorneyCertificateReferenceNum }}</el-descriptions-item>
          <el-descriptions-item label="获得律师执照的年份">{{ info.attorneyCertificateDate }}</el-descriptions-item>
          <el-descriptions-item label="上传证件">
            <el-image v-if="info.attorneyCertificate" class="block-img" :src="info.attorneyCertificate" :preview-src-list="[info.attorneyCertificate]"></el-image>
          </el-descriptions-item>
          <el-descriptions-item label="律师执照所在州">{{ info.attorneyCertificateProvinceEn }}</el-descriptions-item>
          <el-descriptions-item label="律师执照编号">{{ info.attorneyCertificateNum }}</el-descriptions-item>
          <el-descriptions-item label="律师执照所在国家">
            {{ info.attorneyCertificateCountryNameEn }}
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
              <div class="ope-content">创建人：{{ info.createName }}</div>
              <div class="ope-content">创建时间：{{ info.createTime }}</div>
              <div class="ope-content">备注：{{ info.remark }}</div>
            </div>
          </div>
          <div class="ope-block" v-if="info.modifyName">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <div class="ope-info">
              <div class="ope-content">修改人：{{ info.modifyName }}</div>
              <div class="ope-content">修改时间：{{ info.updateTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAttorneyInfoById,
  activateAttorneyDisabledState,
  deleteAttorneyInfo,
} from "@/api/newApi/supplyChain/lawyerManage.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      id: this.$route.params.id,
      enterpriseName: localStorage.getItem("enterpriseName"),
      info: {},
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 1:
          return "启用";
        case 2:
          return "禁用";
        default:
          return status;
      }
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getAttorneyInfoById({
        id: this.id,
      }).then((res) => {
        let result = res.data;
        result.attorneyCertificateDate = res.data.attorneyCertificateDate.split(" ")[0];
        result.countryName = result.countryNames.split(",")[0];
        result.address = [
          result.countryName,
          result.attorneyProvinceEn,
          result.attorneyCityEn,
          result.attorneyCityEn,
          result.attorneyAddressEn,
        ]
          .filter((item) => item !== "")
          .join("，");
        this.info = result;
      });
    },
    /**
     * 编辑
     */
    edit() {
      this.$router.push({
        name: "lawyermanageAddEdit",
        params: {
          id: this.id,
        },
      });
    },
    /**
     * 切换禁用状态
     */
    _changeDisableStatus() {
      this.$confirm(`是否确认${this.info.isOpen === 1 ? "禁用" : "启用"}?`, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true,
      }).then(() => {
        activateAttorneyDisabledState({
          id: this.id,
        }).then((res) => {
          if (res.code == 0) {
            this.$message("操作成功");
            this.getInfo();
          }
        });
      });
    },
    ...mapMutations(["closeTag"]),
    /**
     * 删除
     */
    del(id) {
      this.$confirm("确定删除？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true,
      }).then(() => {
        deleteAttorneyInfo({
          id: this.id,
        }).then((res) => {
          if (res.code === 0) {
            this.closeTag(this.$route);
            this.back();
          }
        });
      });
    },
    //返回列表页
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/supplychain/lawyerManage/index",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.block-title {
  margin-bottom: 20px;
}
.border-box {
  border: 1px solid #eeeeee;
  margin: 30px 0;
  padding: 20px 30px;
}
.header {
  width: 100%;
  height: 30px;
  .btn-group {
    float: right;
  }
  .back {
    float: left;
    cursor: pointer;
  }
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
    .info-wrapper {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      width: 100%;
      padding-bottom: 20px;
      .btn-group {
        flex: 0 0 150px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        flex-wrap: nowrap;
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
        .ope-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
