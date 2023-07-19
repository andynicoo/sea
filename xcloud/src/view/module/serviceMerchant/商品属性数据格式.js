/******
 * 
 * @这个是原始数据格式 考虑到tree的形式在插入节点和删除节点比较方便 只需要找到父节点id挂上去就行了
 */
const attributeTypeList = [
    {
        name: "颜色",
        id: 1,
        level: 1,
        children: [
            {
                name: "红",
                id: 1,
                level: 2,
                children: [
                    {
                        name: "深红",
                        id: 1,
                        level: 3,
                        children: [
                            {
                                name: "深红1号",
                                id: 1,
                                level: 3,
                                children: [
                                    {
                                        name: "深红1号001",
                                        id: 1,
                                        level: 3,
                                    },
                                    {
                                        name: "深红1号002",
                                        id: 1,
                                        level: 3,
                                    },
                                ],
                            },
                            {
                                name: "深红2号",
                                id: 1,
                                level: 3,
                            },
                        ],
                    },
                    {
                        name: "浅红",
                        id: 1,
                        level: 3,
                    },
                ],
            },
            {
                name: "黄",
                id: 2,
                level: 2,
                children: [
                    {
                        name: "深黄",
                        id: 1,
                        level: 3,
                    },
                    {
                        name: "浅黄",
                        id: 1,
                        level: 3,
                    },
                ],
            },
        ],
    },
    {
        name: "材质",
        id: 2,
        level: 1,
        children: [
            {
                name: "铁",
                id: 1,
                level: 2,
                children: [
                    {
                        name: "白铁",
                        id: 1,
                        level: 3,
                    },
                    {
                        name: "黑铁",
                        id: 1,
                        level: 3,
                    },
                ],
            },
            {
                name: "铜",
                id: 2,
                level: 2,
                children: [
                    {
                        name: "青铜",
                        id: 1,
                        level: 3,
                    },
                    {
                        name: "黄铜",
                        id: 1,
                        level: 3,
                    },
                ],
            },
        ],
    },
    {
        name: "尺寸",
        id: 3,
        level: 1,
        children: [
            {
                name: "大",
                id: 1,
                level: 2,
                children: [
                    {
                        name: "大一",
                        id: 1,
                        level: 3,
                    },
                    {
                        name: "大二",
                        id: 1,
                        level: 3,
                    },
                ],
            },
            {
                name: "小",
                id: 2,
                level: 2,
                children: [
                    {
                        name: "小一",
                        id: 1,
                        level: 3,
                        children: [
                            {
                                name: "小一1",
                                id: 1,
                                level: 3,
                            },
                            {
                                name: "小一2",
                                id: 1,
                                level: 3,
                            },
                        ],
                    },
                    {
                        name: "小二",
                        id: 1,
                        level: 3,
                    },
                ],
            },
        ],
    },
];


/******
 * 
 * @这个我前段做一次转换之后的数据 主要是方便前端用,typeFullName这个也可以转成字符串形式或者是id形式
 * 
 */

const typeList = [
    {
        "id": 1,
        "name": "颜色",
        "type": [
            {
                "id": 1,
                "name": "深红1号001",
                "typeFullName": [
                    "颜色",
                    "红",
                    "深红",
                    "深红1号",
                    "深红1号001"
                ]
            },
            {
                "id": 1,
                "name": "深红1号002",
                "typeFullName": [
                    "颜色",
                    "红",
                    "深红",
                    "深红1号",
                    "深红1号002"
                ]
            },
            {
                "id": 1,
                "name": "深红2号",
                "typeFullName": [
                    "颜色",
                    "红",
                    "深红",
                    "深红2号"
                ]
            },
            {
                "id": 1,
                "name": "浅红",
                "typeFullName": [
                    "颜色",
                    "红",
                    "浅红"
                ]
            },
            {
                "id": 1,
                "name": "深黄",
                "typeFullName": [
                    "颜色",
                    "黄",
                    "深黄"
                ]
            },
            {
                "id": 1,
                "name": "浅黄",
                "typeFullName": [
                    "颜色",
                    "黄",
                    "浅黄"
                ]
            }
        ]
    },
    {
        "id": 2,
        "name": "材质",
        "type": [
            {
                "id": 1,
                "name": "白铁",
                "typeFullName": [
                    "材质",
                    "铁",
                    "白铁"
                ]
            },
            {
                "id": 1,
                "name": "黑铁",
                "typeFullName": [
                    "材质",
                    "铁",
                    "黑铁"
                ]
            },
            {
                "id": 1,
                "name": "青铜",
                "typeFullName": [
                    "材质",
                    "铜",
                    "青铜"
                ]
            },
            {
                "id": 1,
                "name": "黄铜",
                "typeFullName": [
                    "材质",
                    "铜",
                    "黄铜"
                ]
            }
        ]
    },
    {
        "id": 3,
        "name": "尺寸",
        "type": [
            {
                "id": 1,
                "name": "大一",
                "typeFullName": [
                    "尺寸",
                    "大",
                    "大一"
                ]
            },
            {
                "id": 1,
                "name": "大二",
                "typeFullName": [
                    "尺寸",
                    "大",
                    "大二"
                ]
            },
            {
                "id": 1,
                "name": "小一1",
                "typeFullName": [
                    "尺寸",
                    "小",
                    "小一",
                    "小一1"
                ]
            },
            {
                "id": 1,
                "name": "小一2",
                "typeFullName": [
                    "尺寸",
                    "小",
                    "小一",
                    "小一2"
                ]
            },
            {
                "id": 1,
                "name": "小二",
                "typeFullName": [
                    "尺寸",
                    "小",
                    "小二"
                ]
            }
        ]
    }
]


/******
 * 
 * @这个是做商品属性组合之后的数据 同样也可以是字符串或者id
 * 
 */
const allCombine = [
    [
        "深红1号001",
        "白铁",
        "大一"
    ],
    [
        "深红1号001",
        "白铁",
        "大二"
    ],
    [
        "深红1号001",
        "黑铁",
        "大一"
    ],
    [
        "深红1号001",
        "黑铁",
        "大二"
    ],
    [
        "深红1号001",
        "青铜",
        "大一"
    ],
    [
        "深红1号001",
        "青铜",
        "大二"
    ],
    [
        "深红1号002",
        "白铁",
        "大一"
    ],
    [
        "深红1号002",
        "白铁",
        "大二"
    ],
    [
        "深红1号002",
        "黑铁",
        "大一"
    ],
    [
        "深红1号002",
        "黑铁",
        "大二"
    ],
    [
        "深红1号002",
        "青铜",
        "大一"
    ],
    [
        "深红1号002",
        "青铜",
        "大二"
    ]
]

/******
 * 
 * @递归回溯算法
 * 
 * 
 */

const chunks = [
    [
        "深红1号001",
        "深红1号002"
    ],
    [
        "黑铁",
        "白铁"
    ],
    [
        "大一",
        "大二"
    ]
]

const getAllCombine = function (chunks) {
    let res = [];

    let helper = function (chunkIndex, prev) {
        let chunk = chunks[chunkIndex];
        let isLast = chunkIndex === chunks.length - 1;
        for (let val of chunk) {
            let cur = prev.concat(val);
            if (isLast) {
                // 如果已经处理到数组的最后一项了 则把拼接的结果放入返回值中
                res.push(cur);
            } else {
                helper(chunkIndex + 1, cur);
            }
        }
    };

    // 从属性数组下标为 0 开始处理
    // 并且此时的 prev 是个空数组
    helper(0, []);

    return res;
}



 function getTypeList(arr, /*itemnameArr,*/ itemArr) {

    arr.map((res) => {
        if (itemArr.length == 0) {
            skuTypeList.push({
                id: res.id,
                attributeTypeName: res.attributeTypeName,
                productAttributeVoList: [],
            });
        }
        // itemnameArr.push(res.name);
        itemArr.push({
            id: res.id,
            attributeName: res.attributeName,
        });

        if (!res.productAttributeVoList || res.productAttributeVoList.length == 0) {
            // const typeFullName = [].concat(itemnameArr);
            const typeData = Object.assign({}, itemArr[itemArr.length - 1])
            // Object.defineProperty(typeData, 'typeFullName', {
            //     value: typeFullName,
            //     writable: false,
            //     configurable: false,
            //     enumerable: true,
            // })
            skuTypeList[skuTypeList.length - 1].productAttributeVoList.push(
                typeData
            );
            // itemnameArr.pop();
            itemArr.pop();
        } else {
            getTypeList(res.productAttributeVoList, /*itemnameArr,*/ itemArr);
        }
    });
    // itemnameArr.pop();
    itemArr.pop();
}