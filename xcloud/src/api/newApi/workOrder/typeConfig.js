import request from '@/libs/request'

/**
 * 关联商品分类列表
 */
export const getWorkFunctionList = data => {
    return request({
        url: '/workorder/management/workFunctionCategory/list',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 关联商品分类详情
 */
export const getWorkFunctionInfo = id => {
    return request({
        url: '/workorder/management/workFunctionCategory/getDetail/' + id,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 关联商品分类保存
 */
export const workFunctionSaveOrUpdate = data => {
    return request({
        url: '/workorder/management/workFunctionCategory/saveOrUpdate',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 关联工单类型列表
 */
export const getWorkflowRelationList = data => {
    return request({
        url: '/workorder/management/workFunctionWorkflowRelation/list',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 关联工单类型详情
 */
export const getWorkflowRelationInfo = id => {
    return request({
        url: '/workorder/management/workFunctionWorkflowRelation/getDetail/' + id,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 关联工单类型保存
 */
export const workflowRelationSaveOrUpdate = data => {
    return request({
        url: '/workorder/management/workFunctionWorkflowRelation/saveOrUpdate',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 操作动作列表
 */
export const serviceFunction = params => {
    return request({
        url: '/workorder/management/serviceFunction',
        params,
        method: 'get',
    })
}

/**
 * 流程节点列表
 */
export const serviceNode = data => {
    return request({
        url: '/workorder/management/serviceNode/all/list',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 根据业务类型获取节点数据
 */
export const serviceNodeWithFunctionCode = params => {
    return request({
        url: '/workorder/management/serviceNode/serverNodeWithFunctionCode',
        params,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export const downloadTemplateRemove = (id)=> {
    return request({
        url: `/workorder/management/downloadTemplate/remove/${id}`,
        method: 'post',
        data: { id },
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
/**
 * 业务类型列表
 */
export const workCategory = params => {
    return request({
        url: "/workorder/management/workCategory",
        params,
        method: 'get',
    });
};

/**
 * 根据业务分类获取工单类型
 */
export const workType = params => {
    return request({
        url: "/workorder/management/workFunction/listByCategory",
        params,
        method: 'post',
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    });
};

/**
 * 业务分类-工单分类列表
 */
export const workCategoryList = params => {
    return request({
        url: '/workorder/management/workCategory/list',
        params,
        method: 'get',
    })
}

/**
 * 业务分类-工单分类单个查询
 */
 export const workFunctionListByCode = params => {
    return request({
        url: '/workorder/management/workFunction/listByCode',
        params,
        method: 'post',
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    })
}


