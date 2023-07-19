<template>
  <div class="app-container">
    <div class="header-container" style="padding-left: 24px" v-if="deatil">
      <div class="back" @click="goBack()">
        <Icon type="ios-arrow-back" />
        返回列表
      </div>
      <div class="info border-box">
        <div class="block-title big-size">处理人分配规则</div>
        <ul class="text-desc dis-flex">
          <li>
            <span class="text-title">服务类型：</span>
            <span class="text-info">{{ deatil.serviceTypeName }}</span>
          </li>
          <li>
            <span class="text-title">国家：</span>
            <span class="text-info">{{ deatil.countryName }}</span>
          </li>
          <li>
            <span class="text-title">状态：</span>
            <span class="text-info">{{ deatil.status == 1 ? '启用' : deatil.status == 2 ? '禁用' : '已过期' }}</span>
          </li>
          <li>
            <span class="text-title">有效执行时间：</span>
            <span class="text-info">{{ deatil.startDate.substr(0, 10) }}~{{ deatil.endDate.substr(0, 10) }}</span>
          </li>
        </ul>
        <!-- <el-descriptions :column="5" :colon="false">
          <el-descriptions-item label="服务类型：">
            {{ deatil.serviceTypeName }}
          </el-descriptions-item>
          <el-descriptions-item label="国家：">
            {{ deatil.countryName }}
          </el-descriptions-item>
          <el-descriptions-item label="状态：">
            {{ deatil.status == 1 ? "启用" : deatil.status == 2 ? "禁用" : "已过期" }}
          </el-descriptions-item>
          <el-descriptions-item label="有效执行时间：">
            {{ deatil.startDate.substr(0, 10) }}~{{ deatil.endDate.substr(0, 10) }}
          </el-descriptions-item>
        </el-descriptions> -->
      </div>
      <div class="detail border-box">
        <div class="block-title big-size">详情信息</div>
        <div v-for="(item, index) in list" :key="index">
          <p class="tittle">{{ item.handleTypeName }}</p>
          <el-table :data="item.handlerUserVOList" border highlight-current-row style="width: 1000px">
            <el-table-column align="center" label="处理人" prop="handlerUserName"></el-table-column>
            <el-table-column align="center" label="所属部门" prop="handlerUserDepartmentName"></el-table-column>
            <el-table-column align="center" label="分配百分比">
              <template slot-scope="scope">{{ scope.row.percentage }}%</template>
            </el-table-column>
            <el-table-column align="center" label="今日分配件数" prop="todayHandleCount"></el-table-column>
            <el-table-column align="center" label="当月分配件数" prop="monthHandleCount"></el-table-column>
            <el-table-column align="center" label="时间范围内总分配数" prop="rangeDateHandleCount"></el-table-column>
            <el-table-column align="center" label="总累计分配数" prop="handleCount"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="detail border-box">
        <div class="block-title big-size">指定客户</div>
        <el-table :data="refUserList" border highlight-current-row style="width: 1000px">
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="客户手机号" prop="userMobile"></el-table-column>
          <el-table-column align="center" label="公司中文名称" prop="companyNameZh"></el-table-column>
          <el-table-column align="center" label="公司英文名称" prop="companyNameEn"></el-table-column>
          <el-table-column align="center" label="客户创建时间" prop="customerCreateTime"></el-table-column>
        </el-table>
      </div>
      <div class="otherInfo border-box" style="margin: 20px 0">
        <div class="block-title big-size">其他信息</div>

        <!-- <el-button type="text" class="check-btn">查看详情操作日志</el-button> -->
        <div class="other-info-wrapper">
          <div class="ope-block">
            <el-avatar :size="60" icon="el-icon-user-solid"></el-avatar>
            <div class="ope-info">
              <div class="ope-content">创建人： {{ deatil.createName }}</div>
              <div class="ope-content">创建时间：{{ deatil.createTime }}</div>
            </div>
          </div>
          <div class="ope-block">
            <el-avatar :size="60" icon="el-icon-user-solid"></el-avatar>
            <div class="ope-info">
              <div class="ope-content">修改人：{{ deatil.modifyName }}</div>
              <div class="ope-content">修改时间：{{ deatil.updateTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getInfo } from '@/api/newApi/supplyChain/assignProcessor.js';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      deatil: null,
      list: [],
      refUserList: [],
    };
  },
  created() {
    this.getDeail();
  },
  methods: {
    getDeail() {
      getInfo({ xcloudHaxndlerAllotId: this.$route.query.id })
        .then((res) => {
          if (res.code == 0) {
            this.deatil = res.data;
            this.list = res.data.xcloudHandlerAllotDetailsVOList;
            this.refUserList = res.data.refUserList;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    ...mapMutations(['closeTag']),
    goBack() {
      this.closeTag(this.$route);
      this.$router.push({ path: '/supplychain/assignProcessor/index' });
    },
  },
};
</script>
<style lang="scss" scoped>
.block-title {
  margin-bottom: 20px;
}
.back {
  margin: 15px;
  cursor: pointer;
}
.border-box {
  border: 1px solid #eeeeee;
  margin: 30px 0;
  padding: 20px 30px;
}
.tittle {
  margin: 15px 0;
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
      .ope-content {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 10px;
      }
    }
  }
}
</style>
