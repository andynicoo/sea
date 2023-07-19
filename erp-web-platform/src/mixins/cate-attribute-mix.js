import Goods from '@/api/goods'

export default {
  data() {
    return {
      category: {
        level1: [],
        level2: [],
        level3: [],
        level4: []
      },
      categoryVisible: false, //类别菜单是否可见
      checkedCateId: null, //选中的类目id
      checkedCateItems: [], //选中的项
      attributeList: [], //属性列表
      checkedBak: {
        list: [],
        id: null
      }, //选中类别项备份
      cateValid: [(v) => !!v || '类目是必须的'],
      attrFormValid: false, // 属性表单校验
      requiredRule: {}, //属性表单校验规则
      currentStoreId: null //当前操作的店铺ID
    }
  },
  computed: {
    //用于显示
    checkedCateNames() {
      return () => {
        if (this.checkedCateItems.length > 0) {
          return this.checkedCateItems
            .map((el) => {
              return `${el.categoryName}(${el.cnName})`
            })
            .join('/')
        }
      }
    },

    isActive() {
      return (val) => {
        if (this.checkedCateItems.length > 0) {
          return this.checkedCateItems.map((el) => el.categoryId).includes(val)
        }
      }
    },

    formatOpts() {
      return (source) => {
        return JSON.parse(source)
      }
    },

    visibleCate() {
      return (item) => {
        if (item && typeof item == 'object') {
          return item.length > 0
        }
        return !!item
      }
    },

    //避免小屏三个显示不全
    calcWidth() {
      return (key) => {
        let index = key.match(/\d$/)[0]
        if (index == 1 && this.checkedCateItems.length >= 2) {
          return '200px'
        }
      }
    }
  },
  methods: {
    //获取类型列表
    getShopeeCategoryList(currentCate, currentKey) {
      let { categoryId, hasChildren } = currentCate || {}
      // 如果该条件成立说明选到最下层类目了
      if (categoryId && !hasChildren) {
        this.checkedCateId = categoryId
        this.categoryVisible = false
        this.getShopeeCategoryAttribute(this.checkedCateId)
        this.checkedBak.list = this.checkedCateItems
        this.checkedBak.id = this.checkedCateId
        // 如果是编辑页面
        if (this.dataSource) {
          this.dataSource.categoryId = this.checkedCateId // 给接口
        }
      }
      if (currentKey) {
        this.clearCheckedNextData(currentKey, currentCate)
      }
      let params = {
        parentId: categoryId,
        storeId: this.currentStoreId
      }

      Goods.getShopeeCategoryList(params).then(({ data }) => {
        if (!categoryId) {
          this.$set(this.category, 'level1', data)
        } else if (currentCate.hasChildren) {
          this.setNextCateList(currentKey, data)
        }
      })
    },

    // 1.根据key值用索引给checkedCateItems赋值，currentKey起始值是1 所以索引需要-1
    // 2.清空类目列表当前级和之后的数据
    clearCheckedNextData(currentKey, currentCate) {
      let currentIndex = parseInt(currentKey.match(/\d$/)[0]) //
      // 选中赋值
      this.checkedCateItems.splice(currentIndex, 5) //去除当前及之后的选中项
      this.checkedCateItems[currentIndex - 1] = currentCate //给当前索引项重新赋值
      // 将当前下一项列表清空
      Object.keys(this.category).forEach((key) => {
        let keyIndex = parseInt(key.match(/\d$/)[0])
        if (keyIndex > currentIndex) {
          this.category[key] = []
        }
      })
    },

    // 下一级类目列表
    setNextCateList(currentKey, nextData) {
      let index = parseInt(currentKey.match(/\d$/)[0]) //
      let nextKey = 'level' + (index + 1)
      this.$set(this.category, String(nextKey), nextData)
    },

    //获取属性列表
    getShopeeCategoryAttribute(cateId) {
      Goods.getShopeeCategoryAttribute(cateId).then(({ data }) => {
        data.map((el) => {
          el.checkedItem = null
        })
        this.attributeList = data.sort((a, b) => b.isMandatory - a.isMandatory)
        this.attributeList.map((el) => {
          // 给必填项添加规则
          let rules = el.isMandatory
            ? [(v) => !!v || el.attributeName + '项是必须的']
            : []
          this.requiredRule[el.attributeName] = rules
        })
        // 商品编辑页特用
        if (this.editType) {
          this.initDefaultAttrbute()
        }
      })
    },

    //给父组件一个获取类目和属性的方法
    getCateAndAttr() {
      return {
        categoryId: this.checkedCateId,
        attribute: this.attributeList.map((el) => {
          return {
            attributeId: el.attributeId,
            value: el.checkedItem
          }
        })
      }
    }
  }
}
