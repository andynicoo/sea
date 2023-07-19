import request from '@/libs/request'

//根据处理人类型+商标国家+功能查询
export const handleRuleListApi = (data) => {
  return request({
    url: '/trademark/workOrderHandleRule/getAssessmentTypeRule',
    data,
    method: 'post'
  })
}

//添加处理人数据
export const handleRuleAddApi = (data) => {
  return request({
    url: '/trademark/workOrderHandleRule/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//更新处理人数据
export const handleRuleUpdateApi = (data) => {
  return request({
    url: '/trademark/workOrderHandleRule/update',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}