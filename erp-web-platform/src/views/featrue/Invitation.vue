<template>
  <div class="me-pa-2">
    <a-card class="invite-wrap me-mb-2" title="推广返利">
      <div class="desc-wrap me-mb-2">
        <p>规则描述:</p>
        <div v-html="promotionRebate"></div>
      </div>
      <a-card :bordered="false" class="card-warp me-mb-4">
        <p class="me-mb-2">链接邀请</p>
        <a-row :gutter="10">
          <a-col span="18">
            <input readonly :value="inviteLink" class="ant-input" />
          </a-col>
          <a-col span="6">
            <a-button
              block
              v-copy="inviteLink"
              class="hand copy"
              style="font-size: 14px"
              type="primary"
            >
              {{ $t('overView.copyLink') }}
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <a-card :bordered="false" class="card-warp">
        <p class="me-mb-2">图片邀请</p>
        <p class="me-mb-2">
          将邀请海报保存后分享给您的好友，您的好友通过扫描图片上的二维码进行注册体验
        </p>
        <a-button type="primary" @click="onSavePoster">保存邀请海报</a-button>
      </a-card>
    </a-card>
    <a-card class="invite-wrap" title="邀请记录">
      <a-table
        :columns="columns"
        :pagination="getPagination"
        :data-source="dataSource"
        :loading="tableLoading"
        rowKey="maAccount"
        @change="changePage"
      ></a-table>
    </a-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Member from '@/api/member'
import tableMixins from '@/mixins/tableMixins'
import FileSaver from 'file-saver'

export default {
  mixins: [tableMixins],
  components: {},
  data() {
    return {
      paginationData: {},
      inviteLink: null,
      columns: [
        {
          title: this.$t('overView.beiInvita'),
          dataIndex: 'maAccount'
        },
        {
          title: this.$t('overView.accTime'),
          dataIndex: 'registerTime'
        },
        {
          title: this.$t('overView.bindingStoreTime'),
          dataIndex: 'bindingTime'
        }
      ],
      promotionRebate: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userInfo
    })
  },
  async mounted() {
    this.inviteLink =
      window.location.host +
      '/#/auth/register?invitationCode=' +
      this.userInfo.memberNO
    this.$data.tableLoading = true
    this.loadData()

    let { data } = await Member.rebateGet()
    this.promotionRebate = data.imgs
  },
  methods: {
    async loadData() {
      if (this.getTableDataBefore) await this.getTableDataBefore()
      try {
        const { data } = await this.getTableData()
        this.$data.dataSource = data.records
        if (this.getTableDataAfter) await this.getTableDataAfter()

        this.$data.paginationData = this.getPageFromResp(data)
      } catch (error) {
        console.error(error)
      } finally {
        this.$data.tableLoading = false
      }
    },
    /**
     * 分页改变
     */
    changePage({ pageSize, current }) {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        size: pageSize,
        current
      }
      this.onSelectChange([], [])
      this.loadData()
    },

    //获取列表
    getTableData() {
      let params = Object.assign(this.paginationData)
      return Member.getInvitedList(params)
    },
    /**保存海报 */
    onSavePoster() {
      Member.getExtensionImage().then((res) => {
        FileSaver.saveAs(res.data, '马六甲ERP-邀请海报.jpg')
      })
    }
  }
}
</script>

<style lang="scss">
.invite-wrap {
  .tit {
    font-weight: bold;
    font-size: 14px;
  }
  .desc-wrap {
    color: #606166;
    line-height: 25px;
    font-size: 12px;

    & > p {
      &:nth-child(1) {
        font-size: 16px;
        font-weight: 500;
        color: #262424;
        line-height: 22px;
        display: block;
      }
    }
  }
}

.card-warp {
  background-color: #f6f6f6;
  width: 640px;

  font-size: 14px;
  font-weight: 400;
  color: #606166;
  line-height: 24px;

  .ant-card-body {
    p:nth-child(1) {
      font-size: 14px;
      font-weight: 500;
      color: #262424;
      line-height: 20px;
    }
  }
}
.records {
  h2 {
    font-size: 16px;
    margin-bottom: 20px;
  }
}
</style>
