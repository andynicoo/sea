<template>
  <div>
    <p class="back">
      <Button @click="goBack()">返回</Button>
    </p>
    <div class="bottom-box">
      <p class="title">编辑</p>
      <Form :model="categoryForm"
            :label-width="120"
            label-position="left"
            ref="categoryForm">
        <FormItem label="一级类目名称"
                  prop="bulletinTitle">
          <Input v-model="categoryForm.firstGradeName"
                 placeholder="一级类目名称"
                 style="width:300px;"
                 :maxlength="20"></Input>
        </FormItem>
        <FormItem label="一级类目排序"
                  prop="bulletinTitle">
          <Input v-model="categoryForm.firstGradeSort"
                 placeholder="一级类目排序，只可输入数字"
                 type="number"
                 style="width:300px;"
                 :maxlength="20"></Input>
        </FormItem>
        <FormItem label="二级类目："
                  prop="bulletinType">
          <div class="cat-list"
               v-for="(item,index) in categoryForm.listTwoCategoryDto"
               :key="index">
            <Input v-model="item.twoGradeName"
                   style="width:150px"></Input>
            <Select clearable
                    v-model="item.modelStyle"
                    placeholder="选择模板"
                    style="width:100px;margin:0 10px">
              <Option :value="1">上图下文样式</Option>
              <Option :value="2">左图右文样式</Option>
              <Option :value="3">左图又文加描述</Option>
            </Select>
            <Input v-model="item.twoGradeSort"
                   style="width:80px;margin-right:10px;"
                   type="number"></Input>
            <Button @click="deleteItem(item,index)">【删除】</Button>
          </div>
        </FormItem>
        <Button @click="addCategory"
                style="margin-left:120px;">+新增类目</Button>
        <FormItem class="button"
                  style="margin-top:20px;">
          <Button type="primary"
                  size="large"
                  class="submit"
                  @click="submitCategory">确认</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import * as API from '@/api/kj123/navigation.js';
export default {
  props: {
    categoryInfo: Object
  },
  data() {
    return {
      categoryForm: {}
    }
  },
  methods: {
    deleteItem(item, i) {
      let self = this
      this.$Modal.confirm({
        title: '确认删除？',
        onOk() {
          API.delCategoryAPI({ id: item.twoid }).then(res => {
            if (res.code === 0) {
              self.$Message.success('删除成功')
              self.categoryForm.listTwoCategoryDto.splice(i, 1)
            }
          })
        }
      })
    },
    addCategory() {
      let obj = {
        input1: '',
        input3: '',
        countryCode: ''
      }
      this.categoryForm.listTwoCategoryDto.push(obj)
    },
    //返回列表页
    goBack() {
      this.$emit('back')
    },
    //新增类目确认
    submitCategory() {
      API.addCategoryAPI(this.categoryForm).then(res => {
        if (res.code == 0) {
          this.$Message.success('添加成功')
          this.$emit('back')
        }
      })
    }
  },
  created() {
    this.categoryForm = {
      firstGradeName: this.categoryInfo.categoryName,
      firstGradeSort: this.categoryInfo.categorySort,
      id: this.categoryInfo.id,
      listTwoCategoryDto: []
    }

    this.categoryInfo.listTwoCategory.map((item, index) => {
      let obj = {
        modelStyle: item.modelStyle,
        twoGradeName: item.categoryName,
        twoGradeSort: item.categorySort,
        twoid: item.id
      }
      this.categoryForm.listTwoCategoryDto.push(obj)
    })
  }
}
</script>
<style lang="less" scoped>
.back {
  padding: 10px;
  background-color: #fff;
}
.bottom-box {
  margin-top: 10px;
  background-color: #fff;
  padding: 20px;
  .title {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    padding-bottom: 20px;
    border-bottom: 1px solid #999;
  }
  .tips {
    color: #f59a23;
    margin-bottom: 15px;
  }
}
/deep/ .ivu-form {
  margin: 20px 0 0 20px;
}
</style>

