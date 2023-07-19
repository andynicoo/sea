<template>
  <div class="mainContent">
    <div class="my-card " :style="contentStyleObj">
      <p class="title">
        <img src="@/assets/images/setting/settingIcon.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='kby'"/>
        <img src="@/assets/images/setting/settingIconwg.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='wg'" />
        防跟卖监控管理
        <span class="tips">目前功能处于内测阶段，正式上线后权限有所调整。</span>
        <span class="help fr">
          <a class="btn"> <Icon type="ios-help-circle-outline" />使用帮助 </a>
          <Button type="primary" class="btn" @click="goAddPro"
            >添加监控产品</Button
          >
          <Button @click="getCheckedPro">批量删除</Button>
        </span>
      </p>
      <p class="tips" v-if="tableData.length">
        当前监控产品: <span> {{ tableData.length }} </span> 个 被跟卖产品<span>
          {{ productNum.minitorNum }} </span
        >个 暂停监控 <span> {{ productNum.stopMinitorNum }} </span>个
      </p>
      <div class="no-data" v-if="tableData.length == 0">
        <img
          src="http://file.itaxs.com/pro/20210925/57f49c27e67b44ce8594af3f50b99efa.svg"
          alt=""
        />
        <p>还没有添加监控产品，请添加</p>
        <!-- <button @click="goHome()">去首页</button> -->
      </div>
      <div class="table-box" v-else>
        <table
          style="width: 100%;text-align: center"
          class="tbNull"
          cellpadding="0"
          cellspacing="0"
        >
          <tr class="header">
            <th style="width:110px;">
              <Checkbox
                v-model="isCheckAll"
                :indeterminate="indeterminate"
                @on-change="
                  e =>
                    checkAllChange(
                      e,
                      'tableData',
                      'indeterminate',
                      'isCheckAll'
                    )
                "
                style="margin-left: 10px"
                class="fl"
              ></Checkbox>
              <Select v-model="status" size="small" style="width:65px">
                <Option
                  v-for="item in statusList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </th>
            <th style="width:300px;">商品信息</th>
            <th style="width:126px;">店铺名</th>

            <th style="width:150px;">添加监控时间</th>
            <th style="width:260px;">操作</th>
          </tr>
          <div v-for="(item, index) in tableData" :key="index">
            <!-- <p class="title clearfix"></p> -->
            <div
              class="table-div"
              v-show="
                status === 'all' ||
                  (status === 'warning' && item.alarmsNum > 0) ||
                  (status === 'normal' &&
                    item.minitorStatus &&
                    item.alarmsNum === 0) ||
                  (status === 'suspend' &&
                    !item.minitorStatus &&
                    item.alarmsNum === 0)
              "
            >
              <tr>
                <td style="width:110px;" class="service-box">
                  <Checkbox
                    v-model="item.check"
                    @on-change="
                      e =>
                        checkChange(
                          e,
                          item,
                          'tableData',
                          'indeterminate',
                          'isCheckAll',
                          null
                        )
                    "
                    class="fl"
                  ></Checkbox>
                  <img
                    src="@/assets/images/setting/jinggao.png"
                    v-if="item.alarmsNum > 0"
                  />
                  <span class="me-status-error" v-if="item.alarmsNum > 0"
                    >警告</span
                  >

                  <span
                    v-if="item.minitorStatus && item.alarmsNum === 0"
                    class="me-status-link"
                    >正常</span
                  >
                  <span
                    v-if="!item.minitorStatus && item.alarmsNum === 0"
                    class="me-status-skip"
                    >停止监控</span
                  >
                </td>
                <td style="width:300px;">
                  <div class="product-info">
                    <div class="txtl">
                      <img
                        :src="item.mainImg"
                        style="width: 60px; height: 60px; border-radius: 2px"
                      />
                    </div>

                    <div class="info-text">
                      <CountryFlag :site="item.sourceSite" />
                      <a class="name"> {{ item.title }}</a>

                      <p class="txtl">
                        <span class="me-mr-5 me-fs12 me-status-skip"
                          >Asin：<span>
                            <a target="blank" class="me-fs12">
                              {{ item.asin }}
                            </a>
                          </span></span
                        >
                      </p>
                    </div>
                  </div>
                </td>

                <td style="width:126px;">
                  <p class="p14c333">--</p>
                </td>
                <td style="width:150px;font-size:14px;color:#333;">
                  <p class="p14c333">
                    {{ item.createTime }}
                  </p>
                </td>
                <td style="width:260px;" class="operation">
                  <p class="p14c333">
                    <a style="color:#00A3FF;" @click="viewRecord(item)"
                      ><img
                        src="@/assets/images/setting/jilu.svg"
                        style="vertical-align: middle;"
                        alt=""
                      />
                      跟卖记录</a
                    >
                    <Divider type="vertical" />
                    <a
                      style="color:#00A3FF;"
                      @click="confirmRecord(false, item.id)"
                      v-if="item.minitorStatus"
                      ><img
                        src="@/assets/images/setting/jiankong.svg"
                        style="vertical-align: middle;"
                        alt=""
                      />
                      停止监控</a
                    >
                    <a
                      style="color:#00A3FF;"
                      @click="confirmRecord(true, item.id)"
                      v-if="!item.minitorStatus"
                      ><img
                        src="@/assets/images/setting/jiankong2.svg"
                        style="vertical-align: middle;"
                        alt=""
                      />
                      重新监控</a
                    >
                    <Divider type="vertical" />
                    <Tooltip content="content of tooltip" theme="light">
                      <a>...</a>
                      <div slot="content">
                        <span class="me-handle" @click="confirmDelete(item.id)"
                          >删除</span
                        >
                      </div>
                    </Tooltip>
                  </p>
                </td>
              </tr>
            </div>
          </div>
        </table>
      </div>
      <Modal v-model="proRecord" :title="null" footer-hide width="860">
        <RecordList :product="curItem" :show="proRecord" ref="recordlist" />
      </Modal>

      <Modal v-model="addPro" :title="null" footer-hide width="680">
        <div class="addbox">
          <h3>
            添加监控产品
            <span>温馨提示，目前仅支持查询amzon平台，其他平台更新中</span>
          </h3>
          <div class="searchbox">
            <img src="@/assets/images/setting/amazon.svg" alt="" />

            <Poptip v-model="selectCountry" placement="bottom" class="me-w">
              <span :title="curCountry" class="me-handle">{{
                curCountry | stringSlice(3)
              }}</span>
              <Icon type="ios-arrow-up" v-if="selectCountry" />
              <Icon type="ios-arrow-down" v-else />
              <div slot="content">
                <div
                  class="me-handle countryline"
                  :class="{ active: item === curCountry }"
                  @click="checkCountry(item)"
                  v-for="(item, index) in countryList"
                  :key="item + index"
                >
                  {{ item.label }}
                </div>
              </div>
            </Poptip>
            <input
              type="text"
              placeholder="请输入ASIN，查询跟卖，空格输入多个"
              style="width:313px"
              v-model="asinCode"
            />
            <div class="searchbtn me-handle" @click="goSearchGoods">
              {{ searchLoading ? "搜索中..." : "免费查询" }}
            </div>
          </div>
          <div class="no-data" v-if="searchTable.length == 0">
            <img
              src="http://file.itaxs.com/pro/20210925/57f49c27e67b44ce8594af3f50b99efa.svg"
              alt=""
            />
            <p class="me-fs12 me-status-skip">无数据</p>
          </div>
          <div
            class="table-box"
            v-else
            style="max-height: 373px; overflow-y: scroll;"
          >
            <table
              style="width: 100%;text-align: center"
              class="tbNull"
              cellpadding="0"
              cellspacing="0"
            >
              <tr class="header">
                <th style="width:50px;">
                  <Checkbox
                    v-model="isCheckAllSearch"
                    :indeterminate="indeterminateSearch"
                    @on-change="
                      e =>
                        checkAllChange(
                          e,
                          'searchTable',
                          'indeterminateSearch',
                          'isCheckAllSearch',
                          'count'
                        )
                    "
                    style="margin-left: 10px"
                    class="fl"
                    :disabled="searchTable.length > 10"
                  ></Checkbox>
                </th>
                <th style="width:300px;">商品信息</th>
                <th style="width:126px;">店铺名</th>

                <th style="width:150px;">操作</th>
              </tr>
              <div
                v-for="(item, index) in searchTable"
                :key="index"
                class="table-div"
              >
                <tr>
                  <td style="width:50px;" class="service-box">
                    <Checkbox
                      v-model="item.check"
                      @on-change="
                        e =>
                          checkChange2(
                            e,
                            item,
                            'searchTable',
                            'indeterminateSearch',
                            'isCheckAllSearch',
                            'count'
                          )
                      "
                      class="fl"
                      v-show="
                        !tableDataIds.includes(item.web + item.site + item.asin)
                      "
                      :disabled="monitorCheckNum === 10 && !item.check"
                    ></Checkbox>
                    <!-- {{ item.web + item.site + item.asin }} -->
                  </td>
                  <td style="width:300px;">
                    <div class="product-info">
                      <div class="txtl">
                        <img
                          :src="item.productInfo.imageUrl"
                          style="width: 60px; height: 60px; border-radius: 2px"
                        />
                      </div>

                      <div class="info-text">
                        <CountryFlag :site="item.site" />
                        <a class="name">
                          {{ item.productInfo.title }}
                        </a>

                        <p class="txtl">
                          <span class="me-mr-5 me-fs12 me-status-skip"
                            >Asin：<span>
                              <a target="blank" class="me-fs12">
                                {{ item.asin }}
                              </a>
                            </span></span
                          >
                        </p>
                      </div>
                    </div>
                  </td>

                  <td style="width:126px;">
                    <p class="p14c333">--</p>
                  </td>
                  <td style="width:150px;" class="operation">
                    <p class="p14c333">
                      <a style="color:#00A3FF;" @click="deletePro(item, index)">
                        <img
                          src="@/assets/images/shoppingCar/shanchu.png"
                          alt=""
                          style="width:14px"
                        />
                      </a>
                    </p>
                  </td>
                </tr>
              </div>
            </table>
          </div>
          <div class="searchbtns">
            <span v-show="searchTable.length"
              >目前已勾选监控产品{{ monitorCheckNum }}个，还剩
              <!-- {{ searchTable.length - monitorCheckNum }}  -->
              {{
                searchTable.length > 9
                  ? 10 - monitorCheckNum
                  : searchTable.length - monitorCheckNum
              }}
              个可勾选添加</span
            >
            <Button class="btn" @click="addPro = false">取消</Button>
            <Button type="primary" class="" @click="sureAddPro">添加</Button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
// import { changePass } from '@/api/login/login'
import CountryFlag from './components/countryFlag'
import RecordList from './components/recordList'
import './table.less'
import {
  getMinitorGoods,
  searchGoods,
  getGoodsResp,
  addAntiSellingMinitorGoods,
  deleAntiSellingMinitorGoods,
  updateAntiSellingGoodsMinitorStatus,
  getAntiSellingMinitorGoodsNum
} from '@/api/myBread'
export default {
  components: {
    CountryFlag,
    RecordList
  },
  data () {
    return {
      contentStyleObj: {
        'min-height': ''
      },
      statusList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'warning',
          label: '警告'
        },
        {
          value: 'normal',
          label: '正常'
        },
        {
          value: 'suspend',
          label: '暂停'
        }
      ],
      status: 'all',
      tableData: [],
      checkedPro: [],
      pageInfo: {
        page: 1,
        total: 0,
        limit: 1000
      },
      isCheckAll: false,
      indeterminate: false,
      isCheckAllSearch: false,
      indeterminateSearch: false,
      monitorCheckNum: 0, // 添加监控产品已勾选数
      proRecord: false,
      curItem: {},
      addPro: false,
      selectCountry: false,
      curCountry: '美国',
      curCountryValue: 'USA',
      countryList: [
        { label: '美国', value: 'USA' },
        { label: '英国', value: 'UK' },
        { label: '德国', value: 'DE' },
        { label: '意大利', value: 'IT' },
        { label: '法国', value: 'FR' },
        { label: '西班牙', value: 'ES' },
        { label: '日本', value: 'JP' },
        { label: '澳大利亚', value: 'AU' },
        { label: '巴西', value: 'BR' },
        { label: '加拿大', value: 'CA' },
        { label: '印度', value: 'IN' },
        { label: '墨西哥', value: 'MX' },
        { label: '荷兰', value: 'NL' },
        { label: '波兰', value: 'PL' },
        { label: '土耳其', value: 'TR' },
        { label: '阿拉伯联合酋长国', value: 'AE' },
        { label: '新加坡', value: 'SG' }
      ],
      asinCode: '',
      searchTable: [],
      searchLoading: false,
      timer: null,
      checkNum: 0, // 添加监控超，勾选商品数量
      tableDataIds: [], // tabledata中 web asin site组成的唯一标识，用于添加监控产品防止重复
      productNum: {} // 顶部监控数量
    }
  },
  watch: {
    isCheckAll: {
      handler (newVal) {
        if (newVal) {
          this.tableData.map(el => (el.check = true))
        } else {
          this.tableData.map(el => (el.check = false))
        }
      }
    },
    isCheckAllSearch: {
      handler (newVal) {
        if (newVal) {
          this.searchTable.map(el => (el.check = true))
        } else {
          this.searchTable.map(el => (el.check = false))
        }
      }
    }
  },
  filters: {
    stringSlice: function (value, length) {
      value =
        value.length > length
          ? (value = value.slice(0, length) + '...')
          : value
      return value
    }
  },
  created () {
    this.getHeight()
    this.getListFun()
  },
  methods: {
    getHeight () {
      this.contentStyleObj['min-height'] = window.screen.height - 300 + 'px'
    },
    goHome () {
      let url = ''
      if (this.invitedCode != null) {
        url = this.homePageUrl + '?invitedCode=' + this.invitedCode
      } else if (this.promteCode != null) {
        url = this.homePageUrl + '?promteCode=' + this.promteCode
      } else {
        url = this.homePageUrl
      }
      window.open(url)
    },
    getListFun (page) {
      let data = {
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      this.isCheckAll = false
      this.indeterminate = false
      getMinitorGoods(data).then(res => {
        if (Number(res.code) === 0) {
          res.data.records.map(el => {
            el.check = false
          })
          this.tableData = res.data.records
          this.pageInfo = {
            page: Number(res.data.current),
            total: Number(res.data.total),
            limit: 10
          }
          this.getTableDataIds()
        }
      })
      this.getAntiSellingMinitorGoodsNum()
    },
    // tabledata中 web asin site组成的唯一标识，用于添加监控产品防止重复
    getTableDataIds () {
      let ids = []
      this.tableData.map(item => {
        ids.push(item.sourceCode + item.sourceSite + item.asin)
      })
      this.tableDataIds = ids
    },
    // 获取监控数
    getAntiSellingMinitorGoodsNum () {
      getAntiSellingMinitorGoodsNum({}).then(res => {
        this.productNum = res.data
      })
    },
    // 查看跟卖记录
    viewRecord (product) {
      this.curItem = product
      // this.$refs.recordlist.getRecordList(product.id)
      this.proRecord = true
    },
    registerChangePageHandler (page) {
      this.pageInfo.page = page
      this.getListFun()
    },
    goAddPro () {
      this.monitorCheckNum = 0
      this.isCheckAllSearch = false
      this.indeterminateSearch = false
      this.searchLoading = false
      this.asinCode = ''
      this.searchTable = []
      this.addPro = true
    },
    async goSearchGoods () {
      if (this.asinCode === '') {
        this.$Message.info('请输入ASIN!')
        return
      }
      if (this.searchLoading) return
      this.searchLoading = true
      // 查询监控产品是通过两个接口实现的
      let asinCode = this.asinCode.split(' ')
      asinCode = asinCode.filter(Boolean)
      let task = []
      asinCode.map(item => {
        task.push({ asin: item, site: this.curCountryValue })
      })

      const params = {
        web: 'Amazon',
        task: task
      }
      let { data } = await searchGoods(params)
      if (data) {
        await getGoodsResp({ uuid: data }).then(res => {
          // res.data===null，继续查询
          if (res.data === null) {
            this.$data.timer = setInterval(() => {
              this.getGoodsRespFun(data)
            }, 2000)
          }
          this.addProToSearchTable(res.data)
        })
      } else {
        this.searchLoading = false
        this.$Message.error('获取uuid失败,请重试')
      }
    },
    async getGoodsRespFun (uuid) {
      await getGoodsResp({ uuid: uuid }).then(res => {
        // res.data===null，继续查询
        if (res.data !== null) {
          this.clearTimer()
        }
        this.addProToSearchTable(res.data)
      })
    },
    addProToSearchTable (data) {
      if (!data) return
      this.searchTable = []
      data.map(item => {
        if (item.productInfo !== null && item.productInfo.title !== null) {
          this.searchTable.push(item)
        }
      })
      this.monitorCheckNum = 0
      this.isCheckAllSearch = false
      this.indeterminateSearch = false

      this.searchLoading = false
    },
    clearTimer () {
      console.log('stop timer')
      clearInterval(this.$data.timer)
      this.$data.timer = null
    },
    // 删除搜索的监控产品
    deletePro (item, index) {
      if (item.check) {
        this.monitorCheckNum--
      }
      this.searchTable.splice(index, 1)
    },
    // 全选
    checkAllChange (checked, tableData, indeter, isCheckAll, count) {
      this[isCheckAll] = checked
      this[tableData] = this[tableData].map(item => {
        item.check = checked
        return item
      })
      this[indeter] = false

      if (count) {
        this.getmonitorCheckNum()
      }
    },
    // 单项选中
    checkChange (checked, item, tableData, indeter, isCheckAll, count) {
      this.$set(item, 'check', checked)
      this[isCheckAll] = this[tableData].every(item => item.check)
      this[indeter] =
        this[tableData].some(item => item.check) && !this.isCheckAll
    },
    // 添加监控产品 单项选中
    checkChange2 (checked, item, tableData, indeter, isCheckAll, count) {
      if (count && this.monitorCheckNum === 10 && checked) {
        return
      }
      this.indeterminateSearch =
        this.searchTable.some(item => item.check)
      let checkLength = this.searchTable.filter(item => item.check).length
      console.log(checkLength, this.searchTable.length)
      // if (checkLength === this.searchTable.length) {
      //   this.isCheckAllSearch = true
      // } else {
      //   this.isCheckAllSearch = false
      // }
      this.getmonitorCheckNum()
    },
    getmonitorCheckNum () {
      this.monitorCheckNum = 0
      this.searchTable.map(item => {
        if (
          item.check &&
          !this.tableDataIds.includes(item.web + item.site + item.asin)
        ) {
          this.monitorCheckNum += 1
        }
      })
    },
    // 获取选择商品
    getCheckedPro () {
      let checkedTemp = this.tableData.filter(item => item.check)
      if (!checkedTemp.length) {
        this.$Message.error('请选择要删除的产品!')
        return
      }
      this.checkedPro = checkedTemp
      let goodsIds = []
      this.tableData.map(item => {
        if (item.check) {
          goodsIds.push(item.id)
        }
      })
      deleAntiSellingMinitorGoods({
        goodsIds: goodsIds
      }).then(res => {
        console.log(res)
        if (Number(res.code) === 0) {
          this.$Message.success('已删除')
          this.getListFun()
        }
      })
    },
    checkIsHave (asin, site, web) {
      return false
    },
    checkCountry (item) {
      this.curCountry = item.label
      this.curCountryValue = item.value
      this.selectCountry = false
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    },
    // 添加监控产品到列表
    sureAddPro () {
      let checkedTemp = this.searchTable.filter(
        item =>
          item.check &&
          !this.tableDataIds.includes(item.web + item.site + item.asin)
      )
      console.log(checkedTemp)
      if (!checkedTemp.length) {
        this.$Message.error('请选择要添加的产品!')
        return
      }
      let params = {
        respInfo: checkedTemp
      }

      addAntiSellingMinitorGoods(params).then(res => {
        if (Number(res.code) === 0) {
          this.$Message.success('已添加')
          this.addPro = false
          this.getListFun()
        }
      })
    },
    confirmDelete (id) {
      const that = this
      this.$Modal.confirm({
        title: '删除',
        content: '<p>该监控产品将从列表中删除，是否继续删除？</p>',
        onOk: () => {
          let params = {
            goodsId: id
          }
          deleAntiSellingMinitorGoods(params).then(res => {
            console.log(res)
            if (Number(res.code) === 0) {
              this.$Message.success('已删除')
              that.getListFun()
            }
          })
        },
        onCancel: () => {
          //   this.$Message.info('Clicked cancel')
        }
      })
    },
    confirmRecord (status, id) {
      this.$Modal.confirm({
        title: '确认提示',
        content:
          '<p>' + status
            ? '停止产品监控后当前的跟卖记录将停止更新，确认停止监控产品？'
            : '确认重新监控该产品？' + '</p>',
        onOk: () => {
          let params = {
            goodsId: id,
            minitorStatus: status
          }
          updateAntiSellingGoodsMinitorStatus(params).then(res => {
            if (Number(res.code) === 0) {
              this.$Message.info('已更新')
              this.getListFun()
            }
          })
        },
        onCancel: () => {
          //   this.$Message.info('Clicked cancel')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 964px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .my-card {
    .title {
      padding-bottom: 22px;
      font-size: 20px;
      font-weight: 500;
      border-bottom: 1px solid #ebebeb;
      font-family: PingFangSC-Medium, PingFang SC;
      .tips{
        font-size: 14px;
        color: #9a9ca1;
      }
      img {
        vertical-align: middle;
      }
    }
    form {
      margin-top: 24px;
    }
    .bt {
      width: 100px;
      height: 40px;
      border-radius: 5px;
    }
  }
  /deep/ .ivu-form .ivu-form-item-label {
    font-size: 16px;
  }
  .help {
    a {
      height: 12px;
      font-size: 12px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      color: #666666;
      line-height: 18px;
    }
    .btn {
      margin-right: 10px;
    }
  }
  .tips {
    font-size: 14px;
    padding: 20px 0px;
    span {
      color: #f34747;
    }
  }

  .pageSetion {
    text-align: center;
    margin-top: 36px;
    padding-bottom: 36px;
    .pagination {
      display: inline-block;
      // margin-right: 12px;
      line-height: 20px;
    }
    .totalNum {
      // position: absolute;
      // top: 2px;
      // right: 0px;
      font-size: 14px;
      color: #9a9ca1;
    }
    &/deep/.ivu-page-simple .ivu-page-simple-pager input {
      padding: 0;
      margin: 0;
    }
    &/deep/.ivu-page-simple-pager {
      margin-right: 0;
    }
  }
}
.addbox {
  h3 {
    font-size: 18px;
    color: #2a2929;
    span {
      font-size: 14px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      color: #93969c;
    }
  }
  .searchbox {
    border: 1px #ebebeb solid;
    width: 579px;
    height: 40px;
    margin: 0 auto;
    margin-top: 35px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    img {
      padding-left: 15px;
    }
    input {
      outline: none;
      background: transparent;
      border: none;
      outline: medium;
    }
    *:focus {
      outline: none;
      background-color: transparent;
    }
    // ::selection {
    //   background: transparent;
    // }
    // ::-moz-selection {
    //   background: transparent;
    // }
    .searchbtn {
      width: 131px;
      height: 40px;
      background: #00a4ff;
      border-radius: 1px;
      color: #fff;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
    }
  }
  .countryline {
    line-height: 25px;
    height: 25px;
  }
  .active {
    color: #00a3ff;
  }
}
</style>
