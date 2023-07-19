export function setObj(source, key) {
  let obj = Object.create(null);
  key.forEach((item) => {
    if (typeof item === 'object') {
      let deepKey = Object.values(item).toString().split('.');
      let value = undefined;
      deepKey.forEach((key) => {
        value = (value && value[key]) || source[key];

        obj[Object.keys(item).toString()] = value;
      });
    } else {
      obj[item] = source[item];
    }
  });
  return obj;
}

/**
 * util
 * 多维转一维数据
 * @param {*} arr
 */
export function flatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(item, Array.isArray(item.children) ? flatten(item.children) : []);
  }, []);
}

/**
 * 递归格式化所有商品类目和属性
 *
 */
export function getCategory(self, isGetChildIds, source, sourceKey, label, value) {
  return source.map((res) => {
    const t = res[sourceKey],
      obj = {
        label: res[label],
        value: res[value],
      };
    if (t.length != 0) {
      obj.children = getCategory(self, isGetChildIds, t, sourceKey, label, value);
    } else {
      isGetChildIds && self.childgoryids.push(res.id);
    }
    return obj;
  });
}

function setLeaf(source) {
  const keys = ['productId', 'productName', 'productCategoryId', 'productSkuVOList', { productCategoryName: ['productCategoryVo.categoryName'] }];
  return {
    value: JSON.stringify({ ...setObj(source, keys) }),
    label: source.productName,
  };
}

export function getProductSkuList(data) {
  return data.map((skuItem) => ({
    ...setObj(skuItem, [{ productName: 'skuName' }, { productSkuId: 'skuId' }]),
  }));
}
/**
 * 校验 用户手机号
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */

/**
 * 合并 初始化 层级数据
 * @param {*} source 源数据数据
 */
export function setNewServiceCascaderList(source, treeData) {
  return Object.values(source).map((item) => {
    return {
      ...item,
      children: item.children.map((childrenItem) => {
        let treeList = treeData
          .map((item) => (item.productCategoryId == childrenItem.value ? item : void 0))
          .filter((item) => item != void 0)
          .map((item) => setLeaf(item));
        childrenItem.children = treeList;
        return childrenItem;
      }),
    };
  });
}
