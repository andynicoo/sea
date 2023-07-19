import {
    getGoodsCategory
} from "@/api/newApi/servicemerchant/goodsCenter.js";
export default{
  data() {
    return {
        serviceCascader:[],
    }
  },
  created() {
    this._getallcategory();
  },
  methods: {
    /**
        * 获取所有商品类目和属性，级联选择器分类数据
        */
     _getallcategory() {
        getGoodsCategory()
            .then(res => {
                if (res.code == 0) {
                    this.serviceCascader = this.getCategory(res.data.records);
                }
            })
            .catch(err => {
                console.log(err);
            });
    },
    /**
     * 递归格式化所有商品类目和属性
     */

    getCategory(arr) {
        return arr.map(res => {
            const t = res.childrenProductCategory;
            const obj = {
                label: res.categoryName,
                value: res.id
            };
            t.length == 0
                ? void 0
                : Object.defineProperty(obj, "children", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: this.getCategory(t)
                });
            return obj;
        });
    },
  }
}