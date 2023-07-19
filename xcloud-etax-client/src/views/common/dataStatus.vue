<template>
  <div>
    <div v-if="['GB', 'DE', 'CZ', 'AT', 'PL', 'AT', 'IOSS'].includes(leftFrom.countryCode) && type != 'refund'">
      <div class="statusItem">
        <div class="item" :class="leftFrom.status != 8 ? 'active' : 'rejected'">
          <div class="itemLeft">
            <div class="top">1</div>
            <div class="bottom">提交资料</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div v-if="leftFrom.status == 8" class="rejectedOperateTime">被驳回</div>
            <div
              class="operateTime"
              v-if="
                leftFrom.status >= 0 && leftFrom.submitMaterialTime !== '' && leftFrom.submitMaterialTime !== undefined
              "
            >
              提交时间：{{ leftFrom.submitMaterialTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="8 > leftFrom.status >= 1 ? 'active' : leftFrom.status == 8 ? 'rejectedLine' : ''">
          <div class="itemLeft">
            <div class="top">2</div>
            <div class="bottom">待审核</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="
                8 > leftFrom.status >= 1 &&
                leftFrom.materialAuditDate !== '' &&
                leftFrom.materialAuditDate !== undefined
              "
            >
              审核时间：{{ leftFrom.materialAuditDate || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="{ active: leftFrom.status >= 3 && leftFrom.status < 8 }">
          <div class="itemLeft">
            <div class="top">3</div>
            <div class="bottom">注册中</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="leftFrom.status >= 3 && leftFrom.completeTime !== '' && leftFrom.completeTime !== undefined"
            >
              完成时间：{{ leftFrom.completeTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="{ active: leftFrom.status >= 4 && leftFrom.status < 8 }">
          <div class="itemLeft">
            <div class="top" v-if="8 > leftFrom.status >= 4">
              <img src="@/assets/images/common/gou.svg" alt="" />
            </div>
            <div class="top" v-else>4</div>
            <div class="bottom">注册完成</div>
          </div>
        </div>
      </div>
      <!-- <div class="info"
           v-if="leftFrom.status === 3 || leftFrom.status === 4">
        <div class="left"
             v-if="(registerEfficiencyDay > duringDay) && leftFrom.status === 3">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          时效正常
        </div>
        <div class="left timeout"
             v-if="(registerEfficiencyDay < duringDay) && leftFrom.status === 3">
          <img src="@/assets/images/common/daojishiRed.svg"
               alt="">
          时效超时
        </div>
        <div class="left"
             v-if="leftFrom.status === 4">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          您的税号已下发
        </div>
        <div class="right">累计注册天数：<span>{{duringDay}}</span> 天（正常时效{{registerEfficiencyDay}}天内）</div>
      </div>
      <div class="start"
           v-if="(registerEfficiencyDay < duringDay) && leftFrom.status === 3">
        建议您联系客服询问超时原因
      </div>
      <div class="start"
           v-if="(registerEfficiencyDay > duringDay) &&leftFrom.status === 3">
        审核资料通过后开始计时
      </div> -->
    </div>
    <div
      v-if="
        leftFrom.countryCode === 'FR' ||
        (leftFrom.countryCode === 'IT' && leftFrom.supplierId != 50) ||
        leftFrom.countryCode === 'AE' ||
        leftFrom.countryCode === 'SA' ||
        leftFrom.countryCode === 'NL'
      "
    >
      <div class="statusItem">
        <div class="item" :class="leftFrom.status != 8 ? 'active' : 'rejected'">
          <div class="itemLeft">
            <div class="top">1</div>
            <div class="bottom">提交资料</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div v-if="leftFrom.status == 8" class="rejectedOperateTime">被驳回</div>
            <div
              class="operateTime"
              v-if="
                leftFrom.status >= 0 && leftFrom.submitMaterialTime !== '' && leftFrom.submitMaterialTime !== undefined
              "
            >
              提交时间：{{ leftFrom.submitMaterialTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="8 > leftFrom.status >= 1 ? 'active' : leftFrom.status == 8 ? 'rejectedLine' : ''">
          <div class="itemLeft">
            <div class="top">2</div>
            <div class="bottom">待审核</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="
                8 > leftFrom.status >= 1 &&
                leftFrom.materialAuditDate !== '' &&
                leftFrom.materialAuditDate !== undefined
              "
            >
              审核时间：{{ leftFrom.materialAuditDate || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="{ active: leftFrom.status === 7 || leftFrom.status === 3 || leftFrom.status === 4 }">
          <div class="itemLeft">
            <div class="top">3</div>
            <div class="bottom">待授权注册</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="
                (leftFrom.status === 7 || leftFrom.status === 3 || leftFrom.status === 4) &&
                leftFrom.completeAuthorizationTime !== '' &&
                leftFrom.completeAuthorizationTime !== undefined
              "
            >
              上传时间：{{ leftFrom.completeAuthorizationTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="{ active: leftFrom.status >= 3 && leftFrom.status < 8 && leftFrom.status !== 7 }">
          <div class="itemLeft">
            <div class="top">4</div>
            <div class="bottom">注册中</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="leftFrom.status >= 3 && leftFrom.completeTime !== '' && leftFrom.completeTime !== undefined"
            >
              完成时间：{{ leftFrom.completeTime || "暂无" }}
            </div>
          </div>
        </div>
        <div
          class="item"
          style="margin-right: -14%"
          :class="{ active: leftFrom.status >= 4 && leftFrom.status < 8 && leftFrom.status !== 7 }"
        >
          <div class="itemLeft">
            <div class="top" v-if="8 > leftFrom.status >= 4">
              <img src="@/assets/images/common/gou.svg" alt="" />
            </div>
            <div class="top" v-else>5</div>
            <div class="bottom">注册完成</div>
          </div>
        </div>
      </div>
      <!-- <div class="info"
           v-if="leftFrom.status === 3 || leftFrom.status === 4">
        <div class="left"
             v-if="(registerEfficiencyDay > duringDay) && leftFrom.status === 3">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          时效正常
        </div>
        <div class="left timeout"
             v-if="(registerEfficiencyDay < duringDay) && leftFrom.status === 3">
          <img src="@/assets/images/common/daojishiRed.svg"
               alt="">
          时效超时
        </div>
        <div class="left"
             v-if="leftFrom.status === 4">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          您的税号已下发
        </div>
        <div class="right">累计注册天数：<span>{{duringDay}}</span> 天（正常时效{{registerEfficiencyDay}}天内）</div>
      </div>
      <div class="start"
           v-if="(registerEfficiencyDay < duringDay) && leftFrom.status === 3">
        建议您联系客服询问超时原因
      </div>
      <div class="start"
           v-if="(registerEfficiencyDay > duringDay) &&leftFrom.status === 3">
        审核资料通过后开始计时
      </div> -->
    </div>
    <div v-if="leftFrom.countryCode === 'IT' && leftFrom.supplierId == 50">
      <div class="statusItem">
        <div class="item" :class="leftFrom.status != 8 ? 'active' : 'rejected'">
          <div class="itemLeft">
            <div class="top">1</div>
            <div class="bottom">提交资料</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div v-if="leftFrom.status == 8" class="rejectedOperateTime">被驳回</div>
            <div
              class="operateTime"
              v-if="
                leftFrom.status >= 0 && leftFrom.submitMaterialTime !== '' && leftFrom.submitMaterialTime !== undefined
              "
            >
              提交时间：{{ leftFrom.submitMaterialTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="8 > leftFrom.status >= 1 ? 'active' : leftFrom.status == 8 ? 'rejectedLine' : ''">
          <div class="itemLeft">
            <div class="top">2</div>
            <div class="bottom">待审核</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="
                8 > leftFrom.status >= 1 &&
                leftFrom.materialAuditDate !== '' &&
                leftFrom.materialAuditDate !== undefined
              "
            >
              审核时间：{{ leftFrom.materialAuditDate || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="{ active: leftFrom.status >= 3 && leftFrom.status < 8 && leftFrom.status !== 7 }">
          <div class="itemLeft">
            <div class="top">3</div>
            <div class="bottom">注册中</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="leftFrom.status >= 3 && leftFrom.completeTime !== '' && leftFrom.completeTime !== undefined"
            >
              完成时间：{{ leftFrom.completeTime || "暂无" }}
            </div>
          </div>
        </div>
        <div
          class="item"
          style="margin-right: -14%"
          :class="{ active: leftFrom.status >= 4 && leftFrom.status < 8 && leftFrom.status !== 7 }"
        >
          <div class="itemLeft">
            <div class="top" v-if="8 > leftFrom.status >= 4">
              <img src="@/assets/images/common/gou.svg" alt="" />
            </div>
            <div class="top" v-else>4</div>
            <div class="bottom">注册完成</div>
          </div>
        </div>
      </div>
      <!-- <div class="info"
           v-if="leftFrom.status === 3 || leftFrom.status === 4">
        <div class="left"
             v-if="(registerEfficiencyDay > duringDay) && leftFrom.status === 3">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          时效正常
        </div>
        <div class="left timeout"
             v-if="(registerEfficiencyDay < duringDay) && leftFrom.status === 3">
          <img src="@/assets/images/common/daojishiRed.svg"
               alt="">
          时效超时
        </div>
        <div class="left"
             v-if="leftFrom.status === 4">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          您的税号已下发
        </div>
        <div class="right">累计注册天数：<span>{{duringDay}}</span> 天（正常时效{{registerEfficiencyDay}}天内）</div>
      </div>
      <div class="start"
           v-if="(registerEfficiencyDay < duringDay) && leftFrom.status === 3">
        建议您联系客服询问超时原因
      </div>
      <div class="start"
           v-if="(registerEfficiencyDay > duringDay) &&leftFrom.status === 3">
        审核资料通过后开始计时
      </div> -->
    </div>
    <div v-if="leftFrom.countryCode === 'ES' && hyFlag == 2">
      <div class="statusItem">
        <div class="item"
             :class="leftFrom.status != 8 ? 'active': 'rejected'">
          <div class="itemLeft">
            <div class="top">
              1
            </div>
            <div class="bottom">
              提交资料
            </div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div v-if="leftFrom.status == 8"
                 class="rejectedOperateTime">
              被驳回
            </div>
            <div class="operateTime"
                 v-if="leftFrom.status >= 0 && (leftFrom.submitMaterialTime !==''&&leftFrom.submitMaterialTime !==undefined)">
              提交时间：{{leftFrom.submitMaterialTime || '暂无'}}
            </div>
          </div>
        </div>
        <div class="item"
             :class="8 > leftFrom.status >= 1 ? 'active' :  leftFrom.status == 8  ? 'rejectedLine' : '' ">
          <div class="itemLeft">
            <div class="top">
              2
            </div>
            <div class="bottom">
              待审核
            </div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div class="operateTime"
                 v-if="8 > leftFrom.status >= 1 && (leftFrom.materialAuditDate !== ''&&leftFrom.materialAuditDate !==undefined)">
              审核时间：{{leftFrom.materialAuditDate || '暂无'}}
            </div>
          </div>
        </div>
        <div class="item"
             :class="{'active' : leftFrom.status === 3 || leftFrom.status === 4 }">
          <div class="itemLeft">
            <div class="top">
              5
            </div>
            <div class="bottom">
              注册中
            </div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div class="operateTime"
                 v-if="(leftFrom.status === 3 || leftFrom.status === 4) && (leftFrom.completeTime !==''&&leftFrom.completeTime !==undefined)">
              完成时间：{{leftFrom.completeTime || '暂无'}}
            </div>
          </div>
        </div>
        <div class="item"
             style="margin-right: -10%;"
             :class="{'active' :leftFrom.status === 4}">
          <div class="itemLeft">
            <div class="top"
                 v-if="8 > leftFrom.status >= 4">
              <img src="@/assets/images/common/gou.svg"
                   alt="">
            </div>
            <div class="top"
                 v-else>
              6
            </div>
            <div class="bottom">
              注册完成
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="info"
           v-if="leftFrom.status === 3 || leftFrom.status === 4|| leftFrom.status === 6">
        <div class="left"
             v-if="(registerEfficiencyDay > duringDay) && (leftFrom.status === 3|| leftFrom.status === 6)">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          时效正常
        </div>
        <div class="left timeout"
             v-if="(registerEfficiencyDay < duringDay) && (leftFrom.status === 3|| leftFrom.status === 6)">
          <img src="@/assets/images/common/daojishiRed.svg"
               alt="">
          时效超时
        </div>
        <div class="left"
             v-if="leftFrom.status === 4">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          您的税号已下发
        </div>
        <div class="right">累计注册天数：<span>{{duringDay}}</span> 天（正常时效{{registerEfficiencyDay}}天内）</div>
      </div> -->
      <!-- <div class="start"
           v-if="(registerEfficiencyDay < duringDay) && (leftFrom.status === 3|| leftFrom.status === 6)">
        建议您联系客服询问超时原因
      </div>
      <div class="start"
           v-if="(registerEfficiencyDay > duringDay) &&leftFrom.status === 3">
        审核资料通过后开始计时
      </div> -->
    </div>
    <div v-if="leftFrom.countryCode === 'ES' && hyFlag != 2">
      <div class="statusItem">
        <div class="item" :class="leftFrom.status != 8 ? 'active' : 'rejected'">
          <div class="itemLeft">
            <div class="top">1</div>
            <div class="bottom">提交资料</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div v-if="leftFrom.status == 8" class="rejectedOperateTime">被驳回</div>
            <div
              class="operateTime"
              v-if="
                leftFrom.status >= 0 && leftFrom.submitMaterialTime !== '' && leftFrom.submitMaterialTime !== undefined
              "
            >
              提交时间：{{ leftFrom.submitMaterialTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="8 > leftFrom.status >= 1 ? 'active' : leftFrom.status == 8 ? 'rejectedLine' : ''">
          <div class="itemLeft">
            <div class="top">2</div>
            <div class="bottom">待审核</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="
                8 > leftFrom.status >= 1 &&
                leftFrom.materialAuditDate !== '' &&
                leftFrom.materialAuditDate !== undefined
              "
            >
              审核时间：{{ leftFrom.materialAuditDate || "暂无" }}
            </div>
          </div>
        </div>
        <div
          class="item"
          :class="{
            active: leftFrom.status === 6 || leftFrom.status === 5 || leftFrom.status === 3 || leftFrom.status === 4,
          }"
        >
          <div class="itemLeft">
            <div class="top">3</div>
            <div class="bottom">待授权海牙认证</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="
                (leftFrom.status === 6 || leftFrom.status === 5 || leftFrom.status === 3 || leftFrom.status === 4) &&
                leftFrom.submitHaiyaTime !== '' &&
                leftFrom.submitHaiyaTime !== undefined
              "
            >
              上传时间：{{ leftFrom.submitHaiyaTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="{ active: leftFrom.status === 6 || leftFrom.status === 3 || leftFrom.status === 4 }">
          <div class="itemLeft">
            <div class="top">4</div>
            <div class="bottom">海牙认证中</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="
                (leftFrom.status === 6 || leftFrom.status === 3 || leftFrom.status === 4) &&
                leftFrom.completeHaiyaTime !== '' &&
                leftFrom.completeHaiyaTime !== undefined
              "
            >
              注册时间：{{ leftFrom.completeHaiyaTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" :class="{ active: leftFrom.status === 3 || leftFrom.status === 4 }">
          <div class="itemLeft">
            <div class="top">5</div>
            <div class="bottom">注册中</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="operateTime"
              v-if="
                (leftFrom.status === 3 || leftFrom.status === 4) &&
                leftFrom.completeTime !== '' &&
                leftFrom.completeTime !== undefined
              "
            >
              完成时间：{{ leftFrom.completeTime || "暂无" }}
            </div>
          </div>
        </div>
        <div class="item" style="margin-right: -10%" :class="{ active: leftFrom.status === 4 }">
          <div class="itemLeft">
            <div class="top" v-if="8 > leftFrom.status >= 4">
              <img src="@/assets/images/common/gou.svg" alt="" />
            </div>
            <div class="top" v-else>6</div>
            <div class="bottom">注册完成</div>
          </div>
        </div>
      </div>
      <!-- <div class="info"
           v-if="leftFrom.status === 3 || leftFrom.status === 4|| leftFrom.status === 6">
        <div class="left"
             v-if="(registerEfficiencyDay > duringDay) && (leftFrom.status === 3|| leftFrom.status === 6)">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          时效正常
        </div>
        <div class="left timeout"
             v-if="(registerEfficiencyDay < duringDay) && (leftFrom.status === 3|| leftFrom.status === 6)">
          <img src="@/assets/images/common/daojishiRed.svg"
               alt="">
          时效超时
        </div>
        <div class="left"
             v-if="leftFrom.status === 4">
          <img src="@/assets/images/common/daojishiBlue.svg"
               alt="">
          您的税号已下发
        </div>
        <div class="right">累计注册天数：<span>{{duringDay}}</span> 天（正常时效{{registerEfficiencyDay}}天内）</div>
      </div> -->
      <!-- <div class="start"
           v-if="(registerEfficiencyDay < duringDay) && (leftFrom.status === 3|| leftFrom.status === 6)">
        建议您联系客服询问超时原因
      </div>
      <div class="start"
           v-if="(registerEfficiencyDay > duringDay) &&leftFrom.status === 3">
        审核资料通过后开始计时
      </div> -->
    </div>
  </div>
</template>

<script>
import { listBaseInfoByCondition } from "@/api/taxModule";
export default {
  props: ['leftFrom', 'countryCode','dateTime','hyFlag'],
  data() {
    return {
      registerEfficiencyDay: "",
      duringDay: 0,
    };
  },
  created() {
    this.baseInfo();
    if (this.leftFrom.materialAuditDate) {
      if (this.leftFrom.completeTime) {
        this.duringDay = this.getDayNum(this.leftFrom.materialAuditDate, this.leftFrom.completeTime);
      } else if (this.dateTime) {
        this.duringDay = this.getDayNum(this.leftFrom.materialAuditDate, this.dateTime);
      } else {
        this.duringDay = this.getDayNum(this.leftFrom.materialAuditDate);
      }
    } else {
      this.duringDay = 0;
    }

    // console.log('leftFrom', this.leftFrom)
  },
  mounted() {},
  methods: {
    baseInfo() {
      listBaseInfoByCondition({
        countryCode: this.countryCode,
      }).then((res) => {
        if (res.code === 0) {
          this.registerEfficiencyDay = res.data.registerEfficiencyDay;
        }
      });
    },
    getDayNum(materialAuditDate, completeTime) {
      if (completeTime) {
        var date1 = new Date(materialAuditDate).getTime();
        var date2 = new Date(completeTime).getTime();
        var total = (date2 - date1) / 1000;
        var day = Math.ceil(total / (24 * 60 * 60)); //计算整数天数
        day === 0 ? (day = 1) : day;
        return day;
      } else {
        var date1 = new Date(materialAuditDate).getTime();
        var date2 = new Date().getTime();
        var total = (date2 - date1) / 1000;
        var day = Math.ceil(total / (24 * 60 * 60)); //计算整数天数
        day === 0 ? (day = 1) : day;
        return day;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.statusItem {
  display: flex;
  width: 100%;
  margin: 20px 0px 0px;
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    .itemLeft {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 100px;
      .top {
        width: 30px;
        height: 30px;
        background: #ffffff;
        border-radius: 50%;
        text-align: center;
        line-height: 29px;
        color: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bottom {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
    }
    .itemRight {
      position: relative;
      width: 100%;
      .itemLine {
        width: 100%;
        padding: 0 10px;
        position: absolute;
        left: 0px;
        top: -15px;
        & > i {
          display: inline-block;
          width: 100%;
          height: 1px;
          vertical-align: top;
          background: #e8eaec;
          border-radius: 1px;
          position: relative;
        }
      }
      .operateTime {
        font-size: 12px;
        color: #666666;
        line-height: 17px;
        text-align: center;
        position: absolute;
        width: 100%;
        top: -5px;
      }
      .rejectedOperateTime {
        font-size: 12px;
        color: #ff8900ff;
        line-height: 17px;
        text-align: center;
        position: absolute;
        width: 100%;
        top: -37px;
      }
      .requireOperateTime {
        font-size: 12px;
        color: rgb(255, 17, 0);
        line-height: 17px;
        text-align: center;
        position: absolute;
        width: 100%;
        top: -47px;
      }
    }
  }
  .statusItem .active,
  .rejected {
    .itemLeft {
      .top {
        background: #1890ffff;
        color: #ffffff;
        border: none;
        line-height: 30px;
      }
    }
    .itemRight {
      .itemLine {
        i {
          background: #1890ffff;
        }
      }
    }
  }
  .statusItem .rejected {
    .itemRight {
      .itemLine {
        i {
          background: #ff8900ff;
        }
      }
    }
  }
  .rejectedLine {
    .itemLeft {
      .top {
        background: #1890ffff;
        color: #ffffff;
        border: none;
        line-height: 30px;
      }
    }
    .itemRight {
      .itemLine {
        i {
          background: #e8eaec;
        }
      }
    }
  }
  .item:last-child {
    margin-right: -20%;
  }
}
.info {
  margin: 14px 0px 0px;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  .left {
    display: flex;
    font-weight: 500;
    color: #16ade9;
    line-height: 20px;
    margin-right: 10px;
    img {
      margin-right: 5px;
    }
  }
  .timeout {
    color: #ed3e3eff;
  }
  .right {
    span {
      color: #16ade9ff;
    }
  }
}
.start {
  text-align: center;
  font-size: 12px;
  color: #666666;
  line-height: 17px;
  margin-top: 10px;
}
</style>
