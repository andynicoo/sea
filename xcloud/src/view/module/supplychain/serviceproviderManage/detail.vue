<template>
  <div class="saleDetail">
    <div class="header-container">
      <div class="header">
        <div class="back" @click="back()">
          <Icon type="ios-arrow-back" />
          返回列表
        </div>
        <div class="btn-group">
          <el-button type="primary" size="small" @click="edit" v-if="hasAuthority('E1_6')">编辑</el-button>
          <el-button
            type="warning"
            class="yellow-btn"
            size="small"
            @click="_changeDisableStatus"
            v-if="hasAuthority('E1_7')"
          >
            {{ (3 - info.status) | filterStatus }}
          </el-button>
          <el-button size="small" v-if="info.status === 2" @click="del" v-show="hasAuthority('E1_8')">删除</el-button>
        </div>
      </div>

      <div class="border-box" style="margin: 20px 0">
        <div class="state">
          <span>
            <span>{{ info.supplierName }}</span>
            <span class="statusStyle">
              <span class="talkbubble">{{ info.status | filterStatus }}</span>
            </span>
          </span>
        </div>
        <div class="info-wrapper">
          <ul class="text-desc dis-flex">
            <li>
              <span class="text-title">服务商编码：</span>
              <span class="text-info">{{ info.supplierCode }}</span>
            </li>
            <li>
              <span class="text-title">简称：</span>
              <span class="text-info">{{ info.shortName }}</span>
            </li>
            <li>
              <span class="text-title">联系人：</span>
              <span class="text-info">{{ info.contacts }}</span>
            </li>
            <li>
              <span class="text-title">联系电话：</span>
              <span class="text-info">{{ info.contactsTell }}</span>
            </li>
            <li>
              <span class="text-title">邮箱：</span>
              <span class="text-info">{{ info.email }}</span>
            </li>
            <li>
              <span class="text-title">所属企业：</span>
              <span class="text-info">{{ enterpriseName }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="block-title big-size">基本信息</div>
        <ul class="text-desc dis-flex">
          <li>
            <span class="text-title">服务商编码：</span>
            <span class="text-info">{{ info.supplierName }}</span>
          </li>
          <li>
            <span class="text-title">公司名称：</span>
            <span class="text-info">{{ info.companyName }}</span>
          </li>
          <li>
            <span class="text-title">商品分类：</span>
            <span class="text-info">{{ info.categoryNames }}</span>
          </li>
          <li>
            <span class="text-title">国家：</span>
            <span class="text-info">{{ info.countryName }}</span>
          </li>
          <li>
            <span class="text-title">联系人：</span>
            <span class="text-info">{{ info.contacts }}</span>
          </li>
          <li>
            <span class="text-title">联系电话：</span>
            <span class="text-info">{{ info.contactsTell }}</span>
          </li>
          <li>
            <span class="text-title">邮箱：</span>
            <span class="text-info">{{ info.email }}</span>
          </li>
          <li>
            <span class="text-title">邮编：</span>
            <span class="text-info">{{ info.postcode }}</span>
          </li>
          <li>
            <span class="text-title">地址：</span>
            <span class="text-info">{{ info.address }}</span>
          </li>
          <li v-for="(item, index) in info.addressList" :key="index">
            <span class="text-title">注册地址：</span>
            <span class="text-info">{{ item.registerAddress }}</span>
          </li>
          <li v-if="info.countryCode == 'FR'">
            <span class="text-title">税号文件：</span>
            <el-link type="primary" :href="info.taxNumberFileTemp" target="_blank" v-if="info.taxNumberFileTemp">文件1</el-link>
          </li>
        </ul>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="block-title big-size">结算信息</div>
        <ul class="text-desc dis-flex">
          <li>
            <span class="text-title">是否支付税金：</span>
            <span class="text-info">{{ info.isPayTaxes | filterIsPayTaxes }}</span>
          </li>
          <li>
            <span class="text-title">合同号：</span>
            <span class="text-info">{{ info.contractNum }}</span>
          </li>
          <li>
            <span class="text-title">合作时间：</span>
            <span class="text-info">
              {{ info.contractStartDate ? info.contractStartDate + "至" + info.contractEndDate : "" }}
            </span>
          </li>
          <li>
            <span class="text-title">结算币种：</span>
            <span class="text-info">{{ info.currency }}</span>
          </li>
          <li>
            <span class="text-title">结算周期：</span>
            <span class="text-info">{{ info.closePeriod | filterPeriod }}</span>
          </li>
          <li>
            <span class="text-title">结算成本：</span>
            <span class="text-info">
              {{ info.closeMethod | filterMethod(info.closeMethod1Rule, info.closeMethod2Rule) }}
            </span>
          </li>
        </ul>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="block-title big-size">其他信息</div>
        <!-- <h1 class="table-title">其他信息</h1> -->
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
  getSupplierById,
  activateEnabledState,
  deleteSupplierById,
} from "@/api/newApi/supplyChain/serviceproviderManage.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      id: this.$route.query.id,
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
      }
    },
    filterIsPayTaxes(isPayTaxes) {
      switch (isPayTaxes) {
        case 1:
          return "否";
        case 2:
          return "是";
      }
    },
    filterPeriod(period) {
      switch (period) {
        case 1:
          return "月";
        case 2:
          return "季";
        case 3:
          return "年";
      }
    },
    filterMethod(method, rule1, rule2) {
      switch (method) {
        case 1:
          return "阶梯式单价" + rule1;
        case 2:
          return "分成式单价" + rule2;
      }
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getSupplierById({
        id: this.id,
      }).then((res) => {
        let result = res.data;
        // result.countryName = result.countryNames.split(",")[0];
        result.address = [
          result.countryName,
          result.province,
          result.city,
          result.streetAddress,
          result.supplierAddress,
        ]
          .filter((item) => item !== "")
          .join("，");
        try {
          if (JSON.stringify(result.registerAddress) != "{}") {
            result.addressList = JSON.parse(result.registerAddress);
          }
        } catch (e) {}
        this.info = result;
      });
    },
    /**
     * 编辑
     */
    edit() {
      this.$router.push({
        name: "serviceproviderAddEdit",
        // params: {
        //   id: this.id,
        // },
        query: {
          id: this.id,
        },
      });
    },
    /**
     * 切换禁用状态
     */
    _changeDisableStatus() {
      this.$confirm(`是否确认${this.info.status === 1 ? "禁用" : "启用"}?`, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true,
      }).then(() => {
        activateEnabledState({
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
        deleteSupplierById({
          id: this.id,
        }).then((res) => {
          if (res.code === 0) {
            this.closeTag(this.$route);
            this.back();
          }
        });
      });
    },
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/supplychain/serviceproviderManage/index",
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
