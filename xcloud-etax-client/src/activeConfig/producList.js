const list = function (){
    let env = process.env.NODE_ENV
    let productList1 = []
    let productList2 = []
    let productList3 = []
        // 测试环境
        // productList1=[
        //     { 
        //         countryName: '德国专区',
        //         products:[
        //             { 
        //                 id: 330,
        //                 img: require('@/assets/images/activity/product1.png'),
        //                 discount: 250,title: '德国VAT注册+申报',detail:'秒下回执 智能算税', num: 350,price: 249,original: 499
        //             },
        //             { 
        //                 id: 331,
        //                 img: require('@/assets/images/activity/product2.png'),
        //                 discount: 250,title: '德国VAT转代理+申报',detail:'秒下回执 智能算税', num: 250,price: 249,original: 499
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '法国专区',
        //         products:[
        //             { 
        //                 id: 326,
        //                 img: require('@/assets/images/activity/product3.png'),
        //                 discount: 100,title: '法国包装法',detail:'快速下号 申报回收', num: 200,price: 899,original: 999
        //             },
        //             { 
        //                 id: 327,
        //                 img: require('@/assets/images/activity/product4.png'),
        //                 discount: 100,title: '法国电池法',detail:'快速下号 申报回收', num: 200,price: 899,original: 999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '沙特专区',
        //         products:[
        //             { 
        //                 id: 328,
        //                 img: require('@/assets/images/activity/product5.png'),
        //                 discount: 1800,title: '沙特VAT注册+申报',detail:'专属服务 一键申报', num: 20,price: 3199,original: 4999
        //             },
        //             { 
        //                 id: 329,
        //                 img: require('@/assets/images/activity/product6.png'),
        //                 discount: 1800,title: '沙特VAT转代理+申报',detail:'专属服务 一键申报', num: 10,price: 3199,original: 4999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '阿联酋专区',
        //         products:[
        //             { 
        //                 id: 332,
        //                 img: require('@/assets/images/activity/product7.png'),
        //                 discount: 1100,title: '阿联酋VAT注册+申报',detail:'快速下号 智能算税', num: 20,price: 1899,original: 2999
        //             },
        //             { 
        //                 id: 333,
        //                img: require('@/assets/images/activity/product8.png'),
        //                 discount: 1100,title: '阿联酋VAT转代理+申报',detail:'快速下号 智能算税', num: 10,price: 1899,original: 2999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '墨西哥专区',
        //         products:[
        //             { 
        //                 id: 334,
        //                 img: require('@/assets/images/activity/product9.png'),
        //                 discount: 8500,title: '墨西哥VAT注册+申报',detail:'新品上架 超值特惠', num: 20,price: 26499,original: 34999
        //             }
        //         ]
        //     },
        // ],
        // productList2=[
        //     { 
        //         countryName: '德国专区',
        //         products:[
        //             { 
        //                 id: 330,
        //                 img: require('@/assets/images/activity/product1.png'),
        //                 discount: 250,title: '德国VAT注册+申报',detail:'秒下回执 智能算税', num: 450,price: 249,original: 499
        //             },
        //             { 
        //                 id: 331,
        //                 img: require('@/assets/images/activity/product2.png'),
        //                 discount: 250,title: '德国VAT转代理+申报',detail:'秒下回执 智能算税', num: 350,price: 249,original: 499
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '法国专区',
        //         products:[
        //             { 
        //                 id: 326,
        //                 img: require('@/assets/images/activity/product3.png'),
        //                 discount: 100,title: '法国包装法',detail:'快速下号 申报回收', num: 250,price: 899,original: 999
        //             },
        //             { 
        //                 id: 327,
        //                 img: require('@/assets/images/activity/product4.png'),
        //                 discount: 100,title: '法国电池法',detail:'快速下号 申报回收', num: 250,price: 899,original: 999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '沙特专区',
        //         products:[
        //             { 
        //                 id: 328,
        //                 img: require('@/assets/images/activity/product5.png'),
        //                 discount: 1800,title: '沙特VAT注册+申报',detail:'专属服务 一键申报', num: 30,price: 3199,original: 4999
        //             },
        //             { 
        //                 id: 329,
        //                 img: require('@/assets/images/activity/product6.png'),
        //                 discount: 1800,title: '沙特VAT转代理+申报',detail:'专属服务 一键申报', num: 10,price: 3199,original: 4999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '阿联酋专区',
        //         products:[
        //             { 
        //                 id: 332,
        //                 img: require('@/assets/images/activity/product7.png'),
        //                 discount: 1100,title: '阿联酋VAT注册+申报',detail:'快速下号 智能算税', num: 30,price: 1899,original: 2999
        //             },
        //             { 
        //                 id: 333,
        //                 img: require('@/assets/images/activity/product8.png'),
        //                 discount: 1100,title: '阿联酋VAT转代理+申报',detail:'快速下号 智能算税', num: 10,price: 1899,original: 2999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '墨西哥专区',
        //         products:[
        //             { 
        //                 id: 334,
        //                 img: require('@/assets/images/activity/product9.png'),
        //                 discount: 8500,title: '墨西哥VAT注册+申报',detail:'新品上架 超值特惠', num: 20,price: 26499,original: 34999
        //             }
        //         ]
        //     },
        // ],
        // productList3=[
        //     { 
        //         countryName: '德国专区',
        //         products:[
        //             { 
        //                 id: 330,
        //                 img: require('@/assets/images/activity/product1.png'),
        //                 discount: 250,title: '德国VAT注册+申报',detail:'秒下回执 智能算税', num: 350,price: 249,original: 499
        //             },
        //             { 
        //                 id: 331,
        //                 img: require('@/assets/images/activity/product2.png'),
        //                 discount: 250,title: '德国VAT转代理+申报',detail:'秒下回执 智能算税', num: 250,price: 249,original: 499
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '法国专区',
        //         products:[
        //             { 
        //                 id: 326,
        //                 img: require('@/assets/images/activity/product3.png'),
        //                 discount: 100,title: '法国包装法',detail:'快速下号 申报回收', num: 150,price: 899,original: 999
        //             },
        //             { 
        //                 id: 327,
        //                 img: require('@/assets/images/activity/product4.png'),
        //                 discount: 100,title: '法国电池法',detail:'快速下号 申报回收', num: 150,price: 899,original: 999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '沙特专区',
        //         products:[
        //             { 
        //                 id: 328,
        //                 img: require('@/assets/images/activity/product5.png'),
        //                 discount: 1800,title: '沙特VAT注册+申报',detail:'专属服务 一键申报', num: 20,price: 3199,original: 4999
        //             },
        //             { 
        //                 id: 329,
        //                 img: require('@/assets/images/activity/product6.png'),
        //                 discount: 1800,title: '沙特VAT转代理+申报',detail:'专属服务 一键申报', num: 10,price: 3199,original: 4999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '阿联酋专区',
        //         products:[
        //             { 
        //                 id: 332,
        //                 img: require('@/assets/images/activity/product7.png'),
        //                 discount: 1100,title: '阿联酋VAT注册+申报',detail:'快速下号 智能算税', num: 20,price: 1899,original: 2999
        //             },
        //             { 
        //                 id: 333,
        //                img: require('@/assets/images/activity/product8.png'),
        //                 discount: 1100,title: '阿联酋VAT转代理+申报',detail:'快速下号 智能算税', num: 10,price: 1899,original: 2999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '墨西哥专区',
        //         products:[
        //             { 
        //                 id: 334,
        //                 img: require('@/assets/images/activity/product9.png'),
        //                 discount: 8500,title: '墨西哥VAT注册+申报',detail:'新品上架 超值特惠', num: 20,price: 26499,original: 34999
        //             }
        //         ]
        //     },
        // ]

        
        ///正式环境

        // productList1=[
        //     { 
        //         countryName: '德国专区',
        //         products:[
        //             { 
        //                 id: 101243,
        //                 img: require('@/assets/images/activity/product1.png'),
        //                 discount: 250,title: '德国VAT注册+申报',detail:'秒下回执 智能算税', num: 350,price: 249,original: 499
        //             },
        //             { 
        //                 id: 101247,
        //                 img: require('@/assets/images/activity/product2.png'),
        //                 discount: 250,title: '德国VAT转代理+申报',detail:'秒下回执 智能算税', num: 250,price: 249,original: 499
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '法国专区',
        //         products:[
        //             { 
        //                 id: 101244,
        //                 img: require('@/assets/images/activity/product3.png'),
        //                 discount: 100,title: '法国包装法',detail:'快速下号 申报回收', num: 200,price: 899,original: 999
        //             },
        //             { 
        //                 id: 101245,
        //                 img: require('@/assets/images/activity/product4.png'),
        //                 discount: 100,title: '法国电池法',detail:'快速下号 申报回收', num: 200,price: 899,original: 999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '沙特专区',
        //         products:[
        //             { 
        //                 id: 101248,
        //                 img: require('@/assets/images/activity/product5.png'),
        //                 discount: 1800,title: '沙特VAT注册+申报',detail:'专属服务 一键申报', num: 20,price: 3199,original: 4999
        //             },
        //             { 
        //                 id: 101249,
        //                 img: require('@/assets/images/activity/product6.png'),
        //                 discount: 1800,title: '沙特VAT转代理+申报',detail:'专属服务 一键申报', num: 10,price: 3199,original: 4999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '阿联酋专区',
        //         products:[
        //             { 
        //                 id: 101250,
        //                 img: require('@/assets/images/activity/product7.png'),
        //                 discount: 1100,title: '阿联酋VAT注册+申报',detail:'快速下号 智能算税', num: 20,price: 1899,original: 2999
        //             },
        //             { 
        //                 id: 101251,
        //                 img: require('@/assets/images/activity/product8.png'),
        //                 discount: 1100,title: '阿联酋VAT转代理+申报',detail:'快速下号 智能算税', num: 10,price: 1899,original: 2999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '墨西哥专区',
        //         products:[
        //             { 
        //                 id: 101246,
        //                 img: require('@/assets/images/activity/product9.png'),
        //                 discount: 8500,title: '墨西哥VAT注册+申报',detail:'新品上架 超值特惠', num: 20,price: 26499,original: 34999
        //             }
        //         ]
        //     },
        // ],
        // productList2=[
        //     { 
        //         countryName: '德国专区',
        //         products:[
        //             { 
        //                 id: 101243,
        //                 img: require('@/assets/images/activity/product1.png'),
        //                 discount: 250,title: '德国VAT注册+申报',detail:'秒下回执 智能算税', num: 350,price: 249,original: 499
        //             },
        //             { 
        //                 id: 101247,
        //                 img: require('@/assets/images/activity/product2.png'),
        //                 discount: 250,title: '德国VAT转代理+申报',detail:'秒下回执 智能算税', num: 250,price: 249,original: 499
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '法国专区',
        //         products:[
        //             { 
        //                 id: 101244,
        //                 img: require('@/assets/images/activity/product3.png'),
        //                 discount: 100,title: '法国包装法',detail:'快速下号 申报回收', num: 200,price: 899,original: 999
        //             },
        //             { 
        //                 id: 101245,
        //                 img: require('@/assets/images/activity/product4.png'),
        //                 discount: 100,title: '法国电池法',detail:'快速下号 申报回收', num: 200,price: 899,original: 999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '沙特专区',
        //         products:[
        //             { 
        //                 id: 101248,
        //                 img: require('@/assets/images/activity/product5.png'),
        //                 discount: 1800,title: '沙特VAT注册+申报',detail:'专属服务 一键申报', num: 30,price: 3199,original: 4999
        //             },
        //             { 
        //                 id: 101249,
        //                 img: require('@/assets/images/activity/product6.png'),
        //                 discount: 1800,title: '沙特VAT转代理+申报',detail:'专属服务 一键申报', num: 10,price: 3199,original: 4999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '阿联酋专区',
        //         products:[
        //             { 
        //                 id: 101250,
        //                 img: require('@/assets/images/activity/product7.png'),
        //                 discount: 1100,title: '阿联酋VAT注册+申报',detail:'快速下号 智能算税', num: 30,price: 1899,original: 2999
        //             },
        //             { 
        //                 id: 101251,
        //                 img: require('@/assets/images/activity/product8.png'),
        //                 discount: 1100,title: '阿联酋VAT转代理+申报',detail:'快速下号 智能算税', num: 10,price: 1899,original: 2999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '墨西哥专区',
        //         products:[
        //             { 
        //                 id: 101246,
        //                 img: require('@/assets/images/activity/product9.png'),
        //                 discount: 8500,title: '墨西哥VAT注册+申报',detail:'新品上架 超值特惠', num: 20,price: 26499,original: 34999
        //             }
        //         ]
        //     },
        // ],
        // productList3=[
        //     { 
        //         countryName: '德国专区',
        //         products:[
        //             { 
        //                 id: 101243,
        //                 img: require('@/assets/images/activity/product1.png'),
        //                 discount: 250,title: '德国VAT注册+申报',detail:'秒下回执 智能算税', num: 350,price: 249,original: 499
        //             },
        //             { 
        //                 id: 101247,
        //                 img: require('@/assets/images/activity/product2.png'),
        //                 discount: 250,title: '德国VAT转代理+申报',detail:'秒下回执 智能算税', num: 250,price: 249,original: 499
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '法国专区',
        //         products:[
        //             { 
        //                 id: 101244,
        //                 img: require('@/assets/images/activity/product3.png'),
        //                 discount: 100,title: '法国包装法',detail:'快速下号 申报回收', num: 200,price: 899,original: 999
        //             },
        //             { 
        //                 id: 101245,
        //                 img: require('@/assets/images/activity/product4.png'),
        //                 discount: 100,title: '法国电池法',detail:'快速下号 申报回收', num: 200,price: 899,original: 999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '沙特专区',
        //         products:[
        //             { 
        //                 id: 101248,
        //                 img: require('@/assets/images/activity/product5.png'),
        //                 discount: 1800,title: '沙特VAT注册+申报',detail:'专属服务 一键申报', num: 20,price: 3199,original: 4999
        //             },
        //             { 
        //                 id: 101249,
        //                 img: require('@/assets/images/activity/product6.png'),
        //                 discount: 1800,title: '沙特VAT转代理+申报',detail:'专属服务 一键申报', num: 10,price: 3199,original: 4999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '阿联酋专区',
        //         products:[
        //             { 
        //                 id: 101250,
        //                 img: require('@/assets/images/activity/product7.png'),
        //                 discount: 1100,title: '阿联酋VAT注册+申报',detail:'快速下号 智能算税', num: 20,price: 1899,original: 2999
        //             },
        //             { 
        //                 id: 101251,
        //                 img: require('@/assets/images/activity/product8.png'),
        //                 discount: 1100,title: '阿联酋VAT转代理+申报',detail:'快速下号 智能算税', num: 10,price: 1899,original: 2999
        //             }
        //         ]
        //     },
        //     { 
        //         countryName: '墨西哥专区',
        //         products:[
        //             { 
        //                 id: 101246,
        //                 img: require('@/assets/images/activity/product9.png'),
        //                 discount: 8500,title: '墨西哥VAT注册+申报',detail:'新品上架 超值特惠', num: 20,price: 26499,original: 34999
        //             }
        //         ]
        //     },
        // ]
    return {
        productList1,
        productList2,
        productList3
    }
}
let List = list()
export default List