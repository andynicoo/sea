// 0706 暂时先不动，后期可删除
<template>
  <div class="me-pa-2">
    <div class="problem-pages">
      <div class="search-content">
        <a-form class="me-search-form" layout="inline">
          <a-form-item :label="$t('packages.solveStatus')">
            <a-select
              v-model="selectSolve"
              style="width:190px"
              :placeholder="$t('packages.solveStatus')"
              option-label-prop="label"
              allowClear
            >
              <a-select-option
                v-for="item in solveAll"
                :key="item.value"
                :value="item.value"
                :label="item.text"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('packages.orderOrexpressNo')">
            <a-input
              v-model="expressNo"
              style="width:190px"
              clearable
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-button depressed type="primary" @click="search">
              {{ $t('common.searchit') }}
            </a-button>
            <a-button @click="reset">{{ $t('common.reset') }}</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="table-content">
        <a-table
          :columns="columns"
          :data-source="orderList"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:[`item.solveStatus`]="{ item }">
            <a-select
              style="width:200px"
              v-model="item.solveStatus"
              @change="statusChange($event, item)"
              option-label-prop="label"
            >
              <a-select-option
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
          </template>
          <template v-slot:[`item.oper`]="{ item }">
            <div class="oper-box" @click="operReply(item)">
              <span>{{ $t('packages.reply') }}</span>
            </div>
          </template>
          <template v-slot:[`no-data`]>
            <div
              style="
                height: 500px;
                background: #fff;
                text-align: center;
                color: #999;
              "
            >
              <img
                style="margin-top: 56px;"
                src="@/assets/images/no-data.png"
              />
              <p>{{ $t('common.noData') }}</p>
            </div>
          </template>
          <template v-slot:[`no-data`]>
            <div
              style="
                height: 500px;
                background: #fff;
                text-align: center;
                color: #999;
              "
            >
              <img
                style="margin-top: 56px;"
                src="@/assets/images/no-data.png"
              />
              <p>暂无数据</p>
            </div>
          </template>
        </a-table>
      </div>
      <div class="text-center pt-2" v-show="orderList.length">
        <Pagination :paginationData="paginationData" @change="changePage">
        </Pagination>
      </div>
    </div>
    <!-- 回复的弹窗 -->
    <DialogReply
      :dialogReply="dialogReply"
      @cancle="cancleReply"
      @update="getPackageProblem"
      :replyId="replyId"
    ></DialogReply>
  </div>
</template>

<script>
import Package from '@/api/package'
import Pagination from '@/components/Pagination'
import DialogReply from './components/DialogReply'
import tableMixins from '@/mixins/tableMixins'

export default {
  mixins: [tableMixins],
  components: {
    Pagination,
    DialogReply
  },
  data() {
    return {
      expressNo: '',
      sellerId: '',
      paginationData: {
        current: 1,
        pages: 1,
        size: 10
      },
      current: 1,
      columns: [
        {
          title: this.$t('packages.platformOrderNo'),
          dataIndex: 'platformOrderNo'
        },
        { title: this.$t('packages.expressNo'), dataIndex: 'expressNo' },
        {
          title: this.$t('packages.problemDescription'),
          dataIndex: 'problemDescription'
        },
        { title: this.$t('packages.maName'), dataIndex: 'maName' },
        { title: this.$t('packages.telphone'), dataIndex: 'telphone' },
        { title: this.$t('packages.solveStatus'), dataIndex: 'solveStatus' },
        { titledataIndex: this.$t('common.handler'), dataIndex: 'oper' }
      ],
      orderList: [],
      solveAll: [
        {
          text: this.$t('packages.all'),
          value: ''
        },
        {
          text: this.$t('packages.noSovle'),
          value: 0
        },
        {
          text: this.$t('packages.isSovle'),
          value: 1
        }
      ],
      solveArry: [
        {
          text: this.$t('packages.noSovle'),
          value: 0
        },
        {
          text: this.$t('packages.isSovle'),
          value: 1
        }
      ],
      soloveId: '',
      dialogReply: false,
      replyId: '',
      selectSolve: null
    }
  },
  mounted() {
    this.getPackageProblem()
  },
  methods: {
    getPackageProblem() {
      let params = {
        current: this.paginationData.current,
        size: this.paginationData.size,
        param: this.expressNo,
        solveStatus: this.selectSolve
      }
      Package.getPackageProblem(params).then((res) => {
        if (res.code == 0) {
          let orderList = res.data.records
          for (let i in orderList) {
            orderList[i].solveStatus = orderList[i].solveStatus ? 1 : 0
          }
          this.orderList = orderList
          this.paginationData = this.getPageFromRespNum(res.data)
          console.log(this.paginationData)
        }
      })
    },
    reset() {
      this.$refs.form.reset()
    },
    // 点击分页
    changePage(page) {
      if (
        page.current == this.paginationData.current &&
        page.size == this.paginationData.size
      )
        return false
      this.paginationData = page
      this.getPackageProblem()
    },
    // 指定跳转页
    changeList(val) {
      this.paginationData.current = val
      if (this.current == val) return false
      this.current = val
      this.getPackageProblem()
    },
    search() {
      this.paginationData.current = 1
      this.getPackageProblem()
    },
    cancleReply() {
      this.dialogReply = false
    },
    operReply(item) {
      this.replyId = item.expressNo
      this.dialogReply = true
    },
    setReply() {},
    statusChange(val, item) {
      let params = {
        solveStatus: val,
        expressNo: item.expressNo
      }
      Package.changeSolveStatus(params).then((res) => {
        if (res.code == 0) {
          console.log(444)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.problem-pages {
  .search-content {
    background: #fff;
    border-radius: 2px;
    padding: 12px;
    margin-bottom: 15px;
    button {
      margin-right: 20px;
    }
  }
  .oper-box {
    span {
      cursor: pointer;
      line-height: 40px;
      color: #409eff;
    }
  }
}
</style>
