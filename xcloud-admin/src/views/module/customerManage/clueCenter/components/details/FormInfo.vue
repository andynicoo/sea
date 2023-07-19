<template>
  <div>
    <ul class="form-list-wrap" v-if="clueInfo.length">
      <li
        class="clueInfo-item"
        v-for="(item, index) in clueInfo"
        :key="index"
        :class="{ 'clueInfo-current': index == 0 }"
      >
        <h3>
          <span>{{ item.createTime }}</span
          ><b>{{ clueInfo.length - index }}</b
          >表单：{{ typeInfo[item.type] }}
        </h3>
        <div>
          <a-card class="list" v-if="item.type == 1">
            <a-row>
              <a-col :span="8"> <span>商标名称:</span> {{ item.extTableInfo.tradeName || '--' }} </a-col>
              <a-col :span="16"> <span>商标国家:</span> {{ item.extTableInfo.countryLabels.join() || '--' }} </a-col>
            </a-row>
            <a-row>
              <a-col :span="8"> <span>商标大类:</span> {{ item.extTableInfo.categoryLabels.join() || '--' }} </a-col>
              <a-col :span="16"> <span>经营的商品:</span> {{ item.extTableInfo.productName || '--' }} </a-col>
            </a-row>
            <a-row v-for="(sub, index) in item.extTableInfo.compeProduct" :key="index">
              <a-col :span="8"> <span>竞品商标名称:</span> {{ sub.name || '--' }} </a-col>
              <a-col :span="16">
                <span>竞品商品链接:</span>
                {{ sub.url || '--' }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8"> <span>注册竞品全部小类:</span> {{ item.extTableInfo.more ? '是' : '否' }} </a-col>
            </a-row>
          </a-card>
          <a-card class="list" v-else-if="item.type == 2">
            <TypeTwo :data="item.extTableInfo"></TypeTwo>
          </a-card>
          <a-card class="list" v-else-if="item.type == 3">
            <a-row>
              <a-col :span="8"> <span>姓名:</span> {{ item.extTableInfo.name || '--' }} </a-col>
              <a-col :span="16"> <span>公司名称:</span> {{ item.extTableInfo.company || '--' }} </a-col>
            </a-row>
            <a-row>
              <a-col :span="8"> <span>公司职位:</span> {{ item.extTableInfo.capacitry || '--' }} </a-col>
              <a-col :span="16"> <span>联系电话:</span> {{ item.extTableInfo.mobile || '--' }} </a-col>
            </a-row>
            <a-row>
              <a-col :span="24"> <span>咨询内容:</span> {{ item.extTableInfo.content || '--' }} </a-col>
            </a-row>
          </a-card>
          <!-- <a-card class="list" v-else-if="item.type == 4">
            <TypeFour :data="item.extTableInfo" />
          </a-card> -->
          <a-card class="list" v-else-if="item.type == 5">
            <a-row>
              <a-col :span="8">
                <span>商品类别:</span> {{ (item.extTableInfo.commodityCategory || []).join('，') || '--' }}
              </a-col>
              <a-col :span="16">
                <span>公司注册地:</span> {{ (item.extTableInfo.registrationAddres || []).join('，') || '--' }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <span>仓储地:</span> {{ (item.extTableInfo.storagePlaces || []).join('，') || '--' }}
              </a-col>
              <a-col :span="16">
                <span>目标市场:</span> {{ (item.extTableInfo.targetMarkets || []).join('，') || '--' }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <span>售卖渠道:</span> {{ (item.extTableInfo.salesChannels || []).join('，') || '--' }}
              </a-col>
            </a-row>
          </a-card>
        </div>
      </li>
    </ul>
    <a-empty class="zt-mt-20" v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, type Ref } from 'vue';
import { leadInfoExtInfo, getServiceQueryList } from '@/api/customerManage/clueCenter';
import router from '@/router';
import { ref } from 'vue';
import TypeTwo from './components/typeTwo.vue';
import TypeFour from './components/typeFour.vue';

onMounted(() => {
  getInfo();
});
interface categoryVo {
  createTime: string;
  updateTime: string;
  id: number;
  categoryNum: string;
  categoryName: string;
  categoryNameEn: string;
  categorySort: number;
  categoryGrade: number;
  parentCategoryNum: number;
  isOpen: number;
  countryCode: string;
  createId: string;
  createName: string;
  modifyId: string;
  modifyName: string;
  categoryNameJp: string;
  similarGroup: string;
  categoryNameMore: string;
}
interface countryDataVo {
  [key: string]: string;
}
interface typeInfoVo {
  [key: number]: string;
}
interface clueInfoVo {
  leadId: string;
  extTableInfo: any;
  type: number;
  createTime: string;
}
const clueInfo: Ref<clueInfoVo[]> = ref([]);

const countryData: countryDataVo = {
  US: '美国',
  EU: '欧盟',
  GB: '英国',
  JP: '日本',
};
const typeInfo: typeInfoVo = {
  1: '免费人工核名申请',
  2: '专家取名申请',
  3: '联系我们',
  4: '商标名调整方式确认',
};
//获取信息
const getInfo = () => {
  getServiceQueryList({
    limit: 50,
    page: 1,
  }).then((res: any) => {
    leadInfoExtInfo({
      customerLeadId: router.currentRoute.value.query.id,
    }).then((res2: clueInfoVo[]) => {
      clueInfo.value = res2;
      clueInfo.value.forEach((item: clueInfoVo) => {
        item.extTableInfo = JSON.parse(item.extTableInfo);
        item.extTableInfo.countryLabels = [];
        //免费人工核名申请 专家取名
        if (item.type == 1 || item.type == 2) {
          if (item.type == 1) {
            item.extTableInfo.country.forEach((sub: string) => {
              if (countryData[sub]) {
                item.extTableInfo.countryLabels.push(countryData[sub]);
              }
            });
          }
          item.extTableInfo.categoryLabels = [];
          item.extTableInfo.class.forEach((sub: number) => {
            res.records.forEach((record: categoryVo) => {
              if (record.id == sub) {
                item.extTableInfo.categoryLabels.push(record.categoryName);
              }
            });
          });
        }
      });
    });
  });
};
</script>

<style scoped lang="less">
.form-list-wrap {
  padding: 0 18px;
  margin-bottom: 15px;
  li:last-child {
    &::before {
      display: none;
    }
  }
  .form-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    line-height: 36px;
    .link-page {
      color: #1890ff;
      font-size: 14px;
      margin-left: 12px;
      cursor: pointer;
    }
  }
  .list {
    .ant-row {
      margin-bottom: 15px;
      word-wrap: break-word;
    }
    span {
      color: #999;
      float: left;
      min-width: 95px;
      text-align: right;
      padding-right: 10px;
    }
  }
}
.clueInfo-item {
  padding-left: 160px;
  position: relative;
  padding-bottom: 20px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 116px;
    height: 100%;
    width: 1px;
    background: rgba(0, 0, 0, 0.25);
  }

  h3 {
    position: relative;
    font-size: 14px;
    margin-bottom: 10px;
    span {
      position: absolute;
      top: 0;
      left: -150px;
      width: 75px;
      text-align: right;
      font-weight: normal;
    }
    b {
      position: absolute;
      width: 32px;
      height: 32px;
      line-height: 28px;
      text-align: center;
      top: 0;
      left: -60px;
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.25);
      border-radius: 50%;
      font-weight: normal;
      color: rgba(0, 0, 0, 0.25);
      font-size: 16px;
    }
  }
}
.clueInfo-current {
  &::before {
    background: #1890ff;
  }
  h3 {
    b {
      background: #1890ff;
      border-color: #1890ff;
      color: #fff;
    }
  }
}
.zt-mt-20 {
  margin-top: 100px;
}
</style>
