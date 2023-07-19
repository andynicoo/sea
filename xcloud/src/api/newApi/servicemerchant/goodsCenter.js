import request from '@/libs/request';
let src = 'productcenter/';
/**
 * 获取商品中心的类目列表
 */

export const getGoodsCategory = (data = { size: -1 }) => {
  return request({
    url: src + 'productCategory/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 新增/编辑商品分类的父类
 */

export const saveProductCategory = (data) => {
  return request({
    url: src + 'productCategory/saveOrUpdate/parent',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 新增/编辑商品分类的子类
 */

export const saveCategoryChildren = (data) => {
  return request({
    url: src + 'productCategory/saveOrUpdate/children',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 生成规格
 */

export const goodsSpecs = (data) => {
  return request({
    url: src + 'productCategory/generate/specs',
    data,
    method: 'post',
    //       headers: {
    //     'Content-Type': 'application/json;charset=UTF-8',
    //   },
  });
};

/**
 * 获取工单
 */
export const getFunctionCode = (params) => {
  return request({
    url: src + 'productCategory/get/function',
    params,
    method: 'get',
  });
};

/**
 * 获取商品属性的列表
 */

export const getGoodsAttribute = (data) => {
  return request({
    url: src + 'productAttributeCategory/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 新增/编辑商品属性的父类
 */

export const saveProductAttribute = (data) => {
  return request({
    url: src + 'productAttributeCategory/saveOrUpdate/parent',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 新增/编辑商品属性的子类
 */

export const saveAttributeChildren = (data) => {
  return request({
    url: src + 'productAttributeCategory/saveOrUpdate/children',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取商品规格列表
 */

export const getGoodsSpecs = (data) => {
  return request({
    url: src + 'productBaseSpecs/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 自定义分组规格添加
 */

export const addSpecs = (data) => {
  return request({
    url: src + 'productBaseCombinationSpecs/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//修改自定义规格分组
export const productBaseCombinationSpecsEdit = (data) => {
  return request({
    url: src + 'productBaseCombinationSpecs/edit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取自定义分组数据
 */

export const getSpecsPage = (data) => {
  return request({
    url: src + 'productBaseCombinationSpecs/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取自定义分组数据
 */

export const productBaseCombinationSpecsDel = (data) => {
  return request({
    url: src + 'productBaseCombinationSpecs/del',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 查询属性值是否有修改
 */

export const productAttributeCategoryQueryChanged = () => {
  return request({
    url: src + 'productAttributeCategory/queryChanged',
    method: 'get',
  });
};

/**
 * 生成规格
 */

export const productCategoryGenerateSpecs = () => {
  return request({
    url: src + 'productCategory/generate/specs',
    method: 'get',
  });
};

/**
 * 规格单位列表
 */

export const productAdditionSpecListSpecUnit = () => {
  return request({
    url: src + 'productAdditionSpec/list/specUnit',
    method: 'get',
  });
};

/**
 * 附加规格列表
 */
export const productAdditionSpecList = (data) => {
  return request({
    url: src + 'productAdditionSpec/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 新增修改附加规格
 */

export const productAdditionSpecSave = (data) => {
  return request({
    url: src + 'productAdditionSpec/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 删除附加规格
 */

export const productAdditionSpecDelete = (data) => {
  return request({
    url: src + 'productAdditionSpec/delete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 附加规格详情
 */
export const productAdditionSpecDetail = (id) => {
  return request({
    url: src + 'productAdditionSpec/detail?id=' + id,
    method: 'get',
  });
};

/**
 * 修改规格
 */
export const productBaseSpecsEdit = (data) => {
  return request({
    url: src + 'productBaseSpecs/edit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
