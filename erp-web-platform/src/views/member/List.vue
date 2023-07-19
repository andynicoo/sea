<template>
  <div class="me-pa-2">
    <!-- <a-page-header class="me-page-header" title="我的订购"> </a-page-header> -->
    <a-layout class="me-page-layout">
      <a-tabs
        default-active-key="1"
        v-model="memberType"
        type="card"
        @change="callback"
      >
        <a-tab-pane key="1" tab="生效中"> </a-tab-pane>
        <a-tab-pane key="2" tab="已失效" force-render> </a-tab-pane>
      </a-tabs>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="tableLoading"
        rowKey="id"
        :pagination="false"
        @change="changePage"
      >
        <template slot="status" slot-scope="text, record">
          <span v-if="record.status === 'NORMAL'" class="me-status-success">
            生效中
          </span>
          <span v-else class="me-status-skip">
            已失效
          </span>
        </template>
        <template slot="id" slot-scope="text, record">
          <a-button type="link" class="me-pa-1" @click="viewDeatils(record)">
            查看详情>>
          </a-button>
        </template>

        <template slot="purchaseQuantity" slot-scope="text, record">
          <!-- 买几送几 -->
          <span v-if="record.activityType === 1" class="me-status-primary">
            买{{ record.purchaseQuantity }}送{{ record.giveQuantity }}个<span
              v-if="record.giveUnit === 1"
              >月</span
            >
            <span v-else>年</span>
          </span>
          <!-- 折扣 -->
          <span v-if="record.activityType === 2" class="me-status-primary">
            打{{ record.discount * 10 }}折
          </span>
          <span v-if="record.activityType === 3" class="me-status-primary">
            一口价{{ record.specialPrice }}旺币
          </span>
          <span v-if="record.activityType === null">
            --
          </span>
        </template>

        <template slot="operation">
          <a-button
            type="link"
            class="me-pa-1"
            @click="$router.push('/member/Index')"
          >
            续费
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="link"
            class="me-pa-1"
            @click="$router.push('/member/Index')"
          >
            升级
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" class="me-error" @click="visible = true">
            退订
          </a-button>
        </template>
      </a-table>
      <a-modal v-model="visible" :title="null" :footer="null">
        <div class="tuiding">
          <h3>
            退订套餐请联系客服人员
          </h3>
          <p>退订业务将于2~3个工作日完成</p>
          <img :src="gzh1" height="280" />
        </div>
      </a-modal>

      <a-modal v-model="visibleMember" :title="null" :footer="null">
        <div class="me-memberinfo">
          <h2>套餐使用情况</h2>
          <div v-if="memberInfo.myPrivilege.length">
            <p v-for="item in memberInfo.myPrivilege" :key="item.name">
              <span v-show="item.total !== 0"
                >{{ item.name }}
                <span v-show="item.dayUnit">({{ item.dayUnit }})</span>
                :
                <span
                  v-show="
                    item.name !== '采集箱数据存储天数' &&
                      item.name !== '订单数据存储天数'
                  "
                >
                  {{ item.current }} / </span
                >{{ item.total }}
                {{ item.unit }}
              </span>

              <!-- item.total===0，并且unit!='不限制' || unit!='独立付费'，显示'不限制' -->
              <span v-show="item.total === 0">
                <span v-if="item.unit === '不限制' || item.unit === '独立付费'">
                  {{ item.name }}:{{ item.unit }}
                </span>
                <span v-else> {{ item.name }}:不限制 </span>
              </span>
            </p>
          </div>
        </div>
      </a-modal>
    </a-layout>
  </div>
</template>

<script>
import member from '@/api/member'
import tableMixins from '@/mixins/tableMixins'
import { mapState } from 'vuex'

export default {
  components: {},
  mixins: [tableMixins],
  computed: {
    gzh1() {
      return require('@/assets/images/kferwm.png')
    },
    ...mapState({
      memberInfo: (state) => state.auth.memberInfo
    })
  },
  data() {
    return {
      memberType: '1',
      columns: [],
      columns1: [
        {
          title: '套餐信息',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '优惠信息',
          dataIndex: 'purchaseQuantity',
          scopedSlots: { customRender: 'purchaseQuantity' }
        },
        {
          title: '订购时间',
          dataIndex: 'createTime'
        },
        {
          title: '生效时间',
          dataIndex: 'orderTime'
        },
        {
          title: '到期时间',
          dataIndex: 'expiresTime'
        },
        {
          title: '套餐使用情况',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '套餐状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },

        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ], //生效中表头
      columns2: [
        {
          title: '套餐信息',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '订购时间',
          dataIndex: 'createTime'
        },
        {
          title: '生效时间',
          dataIndex: 'orderTime'
        },
        {
          title: '到期时间',
          dataIndex: 'expiresTime'
        },
        {
          title: '套餐状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ], //已失效表头
      visible: false,
      visibleMember: false
    }
  },
  mounted() {
    this.columns = this.columns1
  },
  methods: {
    callback(key) {
      console.log(key)
      this.memberType = key
      if (key === '1') {
        this.columns = this.columns1
      } else {
        this.columns = this.columns2
      }
      this.loadTable()
    },
    loadTable() {
      this.loadData()
    },
    getTableData() {
      const { size, current } = this.$data.paginationData
      const params = {
        status: this.memberType === '1' ? 'NORMAL' : 'DISABLED',
        size: size || 10,
        current
      }
      return member.getMemberListType(params)
    },
    async viewDeatils(record) {
      console.log(record)
      await member.getMemeberLevelInfo({}).then((res) => {
        this.$store.commit('SET_MEMBER_INFO', res.data)
      })
      this.visibleMember = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tuiding {
  text-align: center;
  h3 {
    font-size: 20px;
  }
  p {
    padding: 20px;
  }
}
.me-memberinfo {
  h2 {
    font-size: 24px;
    margin: 2px 0px;
  }
  p {
    line-height: 30px;
  }
}
</style>
