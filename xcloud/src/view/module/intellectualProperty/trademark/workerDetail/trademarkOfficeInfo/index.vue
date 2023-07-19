<!-- 商标工单详情-商标局文件 -->
<template>
  <div class="content">
    <template v-if="!empty">
      <div class="section" v-for="(item, index) in info" :key="index">
        <h4>{{ item.title }}</h4>

        <!-- 基础 -->
        <div class="list" v-if="item.type === 'basic'">
          <div :class="`list-item ${item.whole ? 'whole' : ''}`" v-for="(item, index) in item.list" :key="index">
            <label>{{ item.label }}</label>
            <div class="value">
              <img :src="item.imgUrl" v-if="item.imgUrl" width="100" />
              <template v-else>
                {{ item.value || '--' }}
              </template>
            </div>
          </div>
        </div>

        <!-- 处理流程列表 -->
        <table class="flows-table" cellspacing="0" v-if="item.type === 'process'">
          <thead>
            <tr>
              <th width="140">日期</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody v-if="item.list && item.list.length">
            <tr v-for="(item, index) in item.list" :key="index">
              <td>{{ item.history_date }}</td>
              <td>{{ item.history_Description }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2" align="center">暂无数据</td>
            </tr>
          </tbody>
        </table>

        <!-- 分类 -->
        <template v-if="item.type === 'category'">
          <div class="list list-category" v-for="(item, index) in item.list" :key="index">
            <div class="list-item">
              <label>美国大类</label>
              <div class="value">
                {{ item.US_Classes || '--' }}
              </div>
            </div>
            <div class="list-item">
              <label>国际大类</label>
              <div class="value">
                {{ item.International_Class || '--' }}
              </div>
            </div>
            <div class="list-item whole">
              <label>大类状态</label>
              <div class="value">
                {{ item.Class_Status || '--' }}
              </div>
            </div>
            <div class="list-item whole">
              <label>小类</label>
              <div class="value">
                {{ item.US_For || '--' }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <div class="empty" v-else>
      <img src="@/assets/images/infoDetail/no-file.svg" alt="" />
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
export default {
  name: 'TrademarkOfficeInfo',
  props: {
    remarkResultInfo: {
      type: Object,
    },
  },
  data() {
    const { id, similarRemark, imageUrl, applyDate, oneStatusName, tm5CommonStatusDescriptor, statusDate, publicationDate, registrationDate, registrationNumber, ownerName, ownerAddress, attorneyName, attorneyEmail, correspondenEmail, remarkFlows, goodsAndServices } = this.remarkResultInfo;
    return {
      info: [
        {
          title: '商标基础信息',
          type: 'basic',
          list: [
            {
              label: '商标名称',
              value: similarRemark,
            },
            {
              label: '商标图案',
              imgUrl: imageUrl,
              value: '--',
            },
            {
              label: '受理号',
              value: id,
            },
            {
              label: '申请日期',
              value: applyDate,
            },
            {
              label: '状态',
              value: oneStatusName,
              whole: true,
            },
            {
              label: 'TM5 通用狀態描述符',
              value: tm5CommonStatusDescriptor,
              whole: true,
            },
            {
              label: '状态更新日期',
              value: statusDate,
            },
            {
              label: '公告日期',
              value: publicationDate,
            },
            {
              label: '注册成功日期',
              value: registrationDate,
            },
            {
              label: '注册号',
              value: registrationNumber,
            },
          ],
        },
        {
          title: '商标申请处理历史',
          type: 'process',
          list: remarkFlows && JSON.parse(remarkFlows).data,
        },
        {
          title: '商标分类',
          type: 'category',
          list: goodsAndServices && JSON.parse(goodsAndServices),
        },
        {
          title: '申请人及律师',
          type: 'basic',
          list: [
            {
              label: '申请人',
              value: ownerName,
            },
            {
              label: '申请人地址',
              value: ownerAddress,
            },
            {
              label: '律师',
              value: attorneyName,
            },
            {
              label: '律师邮箱',
              value: attorneyEmail,
            },
            {
              label: '通讯员邮箱',
              value: correspondenEmail,
              whole: true,
            },
          ],
        },
      ],
    };
  },
  methods: {},
  computed: {
    empty() {
      return isEmpty(this.remarkResultInfo);
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  padding: 0 0 20px;
  .section {
    margin-top: 15px;
    h4 {
      margin-bottom: 10px;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      border: solid 1px #ddd;
      border-width: 1px 0 0 1px;
      &-item {
        width: 50%;
        display: flex;
        align-items: center;
        border-right: solid 1px #ddd;
        border-bottom: solid 1px #ddd;
        label {
          width: 140px;
          background: #eaeaea;
          padding: 20px 8px;
          height: 100%;
        }
        .value {
          flex: 1;
          padding: 8px;
        }
      }
      &-item.whole {
        width: 100%;
      }
    }
    .list-category {
      margin-bottom: 10px;
    }
    .flows-table {
      border: solid 1px #ddd;
      border-collapse: collapse;
      width: 100%;
      th,
      td {
        padding: 8px;
        border: solid 1px #ddd;
      }
      th {
        background: #eaeaea;
      }
    }
  }
  .empty {
    text-align: center;
    font-size: 16px;
    margin-top: 16px;
    p {
      margin-top: 10px;
      color: #333;
    }
  }
}
</style>
