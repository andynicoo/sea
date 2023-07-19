<template>
  <div class="main">
    <Spin size="large" fix v-if="loading"></Spin>
    <div class="list">
      <div class="item" v-for="(item, index) in list" :key="index">
        <h4>{{ item.name }}</h4>
        <p>{{ item.province }} {{ item.city }} {{ item.region }} {{ item.street }} {{ item.detailAddress }}</p>
        <p>{{ item.mobile }}</p>
        <dl class="clearfix">
          <dt class="fl">
            <Button @click="handleViewDetail(item.userAddressId)">修改</Button>
            <Button @click="handleDelete(item.userAddressId)">删除</Button>
          </dt>
          <dd class="fr">
            <Button @click="setDefault(item.userAddressId)">默认地址</Button>
          </dd>
        </dl>
      </div>
      <div class="item-add">
        <Button @click="$router.push('/address/edit')"><Icon type="ios-add" /> 添加新地址</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { handleAddress, setDefault } from "@/api/address";
export default {
  name: 'Address',
  data() {
    return {
      list: [],
      loading: true
    }
  },
  methods: {
    setDefault(id) {
      this.loading = true
      setDefault({addressId: id})
      .then(res=> {
        if(res.code === 0 && res.data) {
          this.$Message.success('设置成功')
        }
        this.loading = false
      })
      .catch(err=> {
        this.loading = false
        this.$Message.error(err.message)
      })
    },
    /**
     * 收货地址详情
     */
    handleViewDetail(addressId) {
      this.$router.push({
        path: '/address/edit',
        query: {
          addressId
        }
      })
    },
    /**
     * 收货地址列表
     */
    getList() {
      this.loading = true
      handleAddress({}, 'list')
      .then(res=> {
        if(res.code === 0) {
          this.list = res.data
        }
        this.loading = false
      })
      .catch(err=> {
        this.$Message.error(err.message)
      })
    },
    /**
     * 删除收货地址
     */
    handleDelete(id) {
      this.loading = true
      handleAddress({
        addressId: id
      }, 'delete')
      .then(res=> {
        if(res.code === 0) {
          this.$Message.success('删除成功')
        }
        this.getList()
        this.loading = false
      })
      .catch(err=> {
        this.loading = false
        console.log(err);
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
.main {
  background: #fff;
  margin: 24px;
  position: relative;
  .list {
    .item {
      display: inline-flex;
      width: 280px;
      height: 160px;
      border: 1px solid #ccc;
      vertical-align: top;
      margin: 20px;
      padding: 20px;
      flex-direction: column;
      justify-content: space-between;
      &-add {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 280px;
        height: 160px;
        border: 1px solid #ccc;
        margin: 20px;
      }
    }
  }
}
</style>
