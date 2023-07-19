let guide = {
    //操作指引条件分页查询
    operationDocumentPage: {
        url: "/api/information/management/operationDocument/page",
        methods: "get",
    },
    // 根据ID查询操作指引详情
    operationDocumentItem: {
        url: `/api/information/management/operationDocument/item/`,
        methods: "get",
    },
    // 分类条件分页查询
    documentCategoryPage: {
        url: '/api/information/management/documentCategory/page',
        methods: 'get'
    }
}
export default guide