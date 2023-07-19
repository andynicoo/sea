import { NextPage } from "next";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import React,{ useEffect, useState ,useContext}from "react";
import { Row,Col,Button,Input,Tabs,Space} from "antd";
import ToolNavArry  from "@/vo/ToolsNav";
import { SearchOutlined } from '@ant-design/icons';
import { kjzdToolsNavListAll } from "@/apis/toolsNav";
import { useRouter } from "next/router";
import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-header` });

interface ToolNavPagContextProps extends ToolNavProps {

}

const ToolNavPagContext = React.createContext<ToolNavPagContextProps>({} as ToolNavPagContextProps);
interface ToolNavProps {
    toolNav:ToolNavArry[],
}

const ToolNavPag: NextPage<ToolNavProps> = (props) => {

    const ctxValue: ToolNavPagContextProps = {
        ...props
    }
    return (
        <ToolNavPagContext.Provider value={ctxValue}>
            <DefaultLayout>
                {/* 搜索框 */}
                <SearchInput/>
                {/* 导航内容 */}
                <NavContent/>
            </DefaultLayout>
         </ToolNavPagContext.Provider>
    )
}

ToolNavPag.getInitialProps = async (ctx) => {
    const toolNavData = (await kjzdToolsNavListAll()).data;
    const toolNav = getTreeData(toolNavData)
    return {
        toolNav
    }
}

const getTreeData = (arry:ToolNavArry[])=>{
    let mainArry = arry.filter((item) => {
        item.navLevel = '顶级导航'
        return item.pid == 0
    });
    mainArry.forEach((item)=>{
        item.children = []
        arry.forEach((value)=>{
            if(value.pid == item.id){
                value.navLevel = '二级导航'
                item.children.push(value)
            }
        })
    })
    mainArry.forEach((item)=>{
        item.children.forEach((value)=>{
            value.children = []
            arry.forEach((json)=>{
                if(json.pid == value.id){
                    json.navLevel = '三级导航'
                    value.children.push(json)
                }
            })
        })
    })
    return mainArry
  }

export default ToolNavPag;

const itemHover = css`
    transition: transform 0.3s;
    background: #FFFFFF;
    border-radius: 10px;
    border: 1px solid #EEEEEE;
    &:hover {
        transform: translate(0, -5px);
        box-shadow: 0px 18px 8px -9px rgba(108, 0, 40, 0.07);
    };
`;

/**头部搜索 */
const SearchInput: React.FC = () => {
    const { query, replace } = useRouter();
    const [keyword, setKeyword] = useState<string>('');
    const [active, setActive] = useState<number>(0);
    
    interface TagProps {
        name: string;
        id?: number;
        url:string
    }
    const searchCls = css`
        height: 44px;
        box-shadow: 0px 0px 9px 0px rgba(84, 84, 84, 0.12);
        border-radius: 5px;
    `;
    const inputCls = css`
        height: 44px;
        border:none;
    `;
    const btnCls = css`
        background: #FFECF2;
        border-radius: 16px;
        color: #F676A6;
    `;
    const buttonCls = css`
        border:none;
        outline:none;
        line-height: 26px;
        font-size: 14px;
        color: #333333;
        padding: 0 11px;
        margin-right: 4px;
        cursor: pointer;
        background: none;
    `;
    const searchNav:TagProps[]= [
        {name:'跨境知道',id:0,url:"/search"},
        {name:'百度',id:1,url:"https://www.baidu.com/s?tn=94725333_hao_pg&wd="},
        {name:'直播',id:2,url:"https://www.kjyunke.com/courses-search?keyword="},
        {name:'谷歌',id:3,url:'https://www.google.com.hk/search?q='},
        {name:'美亚',id:4,url:"https://www.amazon.com/s?k="},
        {name:'英亚',id:5,url:"https://www.amazon.co.uk/s?k="},
        {name:'日亚',id:6,url:"https://www.amazon.co.jp/s?k="},
        {name:'德亚',id:7,url:"https://www.amazon.de/s?k="}
    ];
    const onSearch = () => {
        if(active == 0){
            replace({ pathname: "/search", query: { keyword} });
        }
        else {
            const searchUrl = searchNav[active].url
            window.open( searchUrl+keyword,'_bank' )
        }
        
    }
    const inputChange = (e: any) => {
        setKeyword(e.target.value)
    }
    const onselect = (item: any) => {
        setActive(item.id)
    }
    return (
        <div
            className={cx(
                "pt-[15px]",
                "w-[100%]",
                "bg-color-[#ffffff]",
                "h-[120px]",
            )}
        >  
            <Row>
                <Col span={22} offset={2}>
                    {
                        searchNav.map((item,index:number)=>(
                            <button
                                className={cx("fw-500", "c-000e6", "mr-[5px]",buttonCls,{ [btnCls]: active == item.id})}
                                onClick={()=>onselect(item)}
                                key={index}
                            >
                                {item.name}
                            </button>
                        ))
                    }
                </Col>
                <Col span={14} offset={2} className="mt-[10px]">
                    <Row className={cx(searchCls)}>
                        <Col span={21}>
                            <Input size="large" placeholder="" prefix={<SearchOutlined />} className={cx(inputCls)} onChange={(e:any)=>inputChange(e)}/>
                        </Col>
                        <Col span={3}>
                            <Button type="primary" className="h-[100%] w-[100%] fs-[16px]" onClick={onSearch}>
                                搜索
                            </Button>
                        </Col>
                    </Row>   
                </Col>
            </Row>   
        </div>
    )
}

/**导航内容 */
const NavContent: React.FC = () => {
    const { toolNav } = useContext(ToolNavPagContext);
    return (
        <Row className="mt-[20px]">
            <Col span={4} >
                <NavLeft toolNav={toolNav}/>
            </Col>
            <Col span={20}>
                {
                    toolNav.map((item:any,index:number)=>(
                        <ItemContent key={index} item={item} type={item.layout} id={item.id}/>
                    ))
                }
            </Col>
        </Row>
    )
}

/**左侧导航 */
const NavLeft: React.FC <{ toolNav: ToolNavArry[] }> = ({ toolNav }) => {
    const itemCls = css`
        position: relative;
        margin-right: 15px;
    `;
    const itemClsFixed = css`
        position: fixed;
        z-index: 9999;
        width: 185px;
        top: 86px;
    `;
    const itemClsAb = css`
        position: absolute;
        bottom: 20px;
        top: auto;
        width: 185px;
       
    `;
    const itemBox = css`
        max-height: 800px;
        overflow-x: auto;
        background: #FFFFFF;
        border-radius: 10px;
        padding-left: 33px;
        padding-top: 40px;
        padding-bottom: 40px;
    `;
    const itemUl = css`
        border-left: 4px solid #F8F8F8;
    `;
    const itemLi = css`
        position: relative;
        cursor: pointer;
        margin-bottom: 30px;
    `;
    const itemSpan = css`
        position: absolute;
        width: 4px;
        height: 14px;
        display: none;
        background: #F676A6;
        border-radius: 2px;
        left: -4px;
        top: 0px;
        z-index: 88;
    `;
    const itemActive = css`
        display: block;
    `;
    const itemText = css`
        font-size: 14px;
        color: #333333;
        line-height: 14px;
        margin-left: 25px;
    `;
    
    const [show, setShow] = useState<number>(0);
    const [active, setActive] = useState<number>(0);
    const showPosition = () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
        let scrollBottom = scrollHeight - windowHeight - scrollTop
        if(scrollTop > 150 && scrollBottom <= 340){
            setShow(2);
        } else if(scrollTop > 150 && scrollBottom > 340){
            setShow(1);
        } else{
            setShow(0);
        }
        // for(let i in toolNav){
        //     let object:any = document.getElementById(toolNav[i].id+'');
        //     let top = object.getBoundingClientRect().top
        //     if(top < 130 && top >90){
        //         setActive(parseInt(i))
        //     }
        // }
    };
    useEffect(() => {
        showPosition()
        document.addEventListener("scroll", showPosition)

        return () => {
            document.removeEventListener('scroll', showPosition)
        }
    }, []);
    const clickNav = (item:any,index: number,) => {
        let id = item.id
        setActive(index)
        naver(id)
    };
    const naver = (id:any) => {
        let obj:any = document.getElementById(id);
        let oPos:number = obj.offsetTop || 0;
        window.scrollTo({ 
            top: oPos+120, 
            behavior: "smooth" 
        });
    };
    return (
        <div className={cx(itemBox,{ [itemCls]: show == 0, [itemClsFixed] : show == 1,[itemClsAb]: show == 2 })}>
            <ul className={(itemUl)}>
                {
                    toolNav.map((item:any,index:number)=>(
                        <li className={(itemLi)} onClick={() => clickNav(item,index)} key={index}>
                            <span className={cx(itemSpan,{ [itemActive]: active == index })}></span>
                            <div className={cx("lc-1",itemText)}>{item.name}</div>
                        </li>
                    ))
                }
            </ul>        
        </div>
    )
}

const { TabPane } = Tabs;

const ItemContent: React.FC <{ item : any,type: number, id:any }> = ({ item, type, id}) => {
    const itemCls = css`
        background: #FFFFFF;
        border-radius: 10px;
        margin-bottom: 20px;
        padding:0 30px 20px;
    `;
    return (
        <Row className={cx("mb-[20px]",itemCls)} id={id}>
            <Tabs defaultActiveKey="1" className="w-[100%]">
                {
                    item.children.map((value:any,index:number)=>{
                        return (<TabPane tab={value.name} key={index+1}>
                            { type == 0 ? <ItemIcon1 item={value}/> : ''}
                            { type == 1 ? <ItemIcon2 item={value}/> : ''}
                            { type == 2 ? <ItemIcon3 item={value}/> : ''}
                            { type == 3 ? <ItemIcon4 item={value}/> : ''}
                            { type == 4 ? <ItemIcon5 item={value}/> : ''} 
                        </TabPane>)
                    })
                }
            </Tabs>
        </Row>
    )
}

const ItemIcon1: React.FC <{ item : ToolNavArry }> = ({ item }) => {
    const itemDiv = css`
        width: 104px;
        height: 110px;
    `;
    const itemImg = css`
        width: 42px;
        height: 42px;
        margin: 0 auto;
        margin-top: 15px;
        display: block;
    `;
    const itemText = css`
        color: #333333;
        font-size: 14px;
        line-height: 16px;
        text-align: center;
        margin-top: 15px;
        padding: 0 5px;
    `;
    return (
        <Row>
            <Space size={[12, 15]} wrap>
                {
                     item.children.map((value:any,index:number)=>(
                        <div key={index} className={cx(itemDiv,{ [itemHover]: true})}>
                            <a href={value.url} target='_bank'>
                                <img src={value.img} alt="" className={(itemImg)}/>
                                <div className={cx("lc-2",itemText)}>{value.name}</div>
                            </a>    
                        </div>
                    ))
                }
            </Space>
        </Row>
    )
}

const ItemIcon2: React.FC <{ item : ToolNavArry }> = ({ item }) => {
    const itemDiv = css`
        width: 178px;
        height: 44px;
    `;
    const itemImg = css`
        width: 22px;
        height: 22px;
        float: left;
        margin-left: 28px;
        margin-right: 10px;
        margin-top: 11px;
    `;
    const itemCommon = css`
        display: flex;
    `;
    const itemName = css`
        flex: 1;
        color: #333333;
        font-size: 14px;
        line-height: 44px;
    `;
    return (
        <Row>
            <Space size={[10, 15]} wrap>
                { item.children.map((value:any,index:number) => (
                    <div key={index} className={cx(itemDiv,{ [itemHover]: true})}>
                        <a href={value.url} target='_bank'>
                            <div className={cx(itemCommon)}>
                                <img src={value.img} alt="" className={(itemImg)}/>
                                <div className={cx("lc-1",itemName)}>{value.name}</div>
                            </div>
                        </a>    
                    </div>
                ))}
            </Space>
        </Row>
    )
}

const ItemIcon3: React.FC <{ item : ToolNavArry }> = ({ item }) => {
    const itemDiv = css`
        width: 220px;
        height: 98px;
        padding: 15px;
    `;
    const itemCommon = css`
        display: flex;
    `;
    const itemImg = css`
        width: 30px;
        height: 30px;
        margin-right: 10px;
    `;
    const itemBox = css`
        flex:1;
    `;
    const itemName = css`
        font-size: 14px;
        color: #333333;
    `;
    const itemText = css`
        font-size: 12px;
        color: #999999;
    `;
    const itemService = css`
        height: 24px;
        display: inline-block;
        background: #F5F5F5;
        border-radius: 12px;
        font-size: 14px;
        color: #666666;
        line-height: 24px;
        padding: 0 10px;
        margin-right:7px;
        &:hover {
            background: #f676a6;
            color: #fff;
        };
    `;
    return (
        <Row>
            <Space size={[10, 15]} wrap>
                { item.children.map((value:any,index:number) => (
                    <div key={index} className={cx(itemDiv,{ [itemHover]: true})}>
                        <div className={cx(itemCommon)}>
                            <img src={value.img} alt="" className={(itemImg)}/>
                            <div className={cx(itemBox)}>
                                <div className={cx("lc-1",itemName)}>{value.name}</div>
                                <div className={cx("lc-1",itemText)}>{value.desc}</div>
                            </div>
                        </div>
                        <div className="mt-[10px]">
                            <a href={value.url} target='_bank' className={cx(itemService)}>一站式服务</a>
                            <a href={value.turl} target='_bank' className={cx(itemService)}>入驻通道</a>
                        </div>
                    </div>
                ))}
            </Space>
        </Row>
    )
}



const ItemIcon4: React.FC <{ item : ToolNavArry }> = ({ item }) => {
    const itemDiv = css`
        width: 178px;
        padding: 10px 15px;
    `;
    const itemImg = css`
        width: 30px;
        height: 30px;
        margin-right: 10px;
    `;
    const itemCommon = css`
        display: flex;
    `;
    const itemName = css`
        flex: 1;
        font-size: 14px;
        line-height: 30px;
        color: #333333;
    `;
    const itemText = css`
        font-size: 12px;
        color: #999999;
        margin-top: 7px;
        line-height: 18px;
    `;
    return (
        <Row>
            <Space size={[10, 15]} wrap>
                { item.children.map((value:any,index:number) => (
                    <div key={index} className={cx(itemDiv,{ [itemHover]: true})}>
                        <a href={value.url} target='_bank'>
                            <div className={cx(itemCommon)}>
                                <img src={value.img} alt="" className={(itemImg)}/>
                                <div className={cx("lc-1",itemName)}>{value.name}</div>
                            </div>
                            <div className={cx("lc-1",itemText)}>{value.desc}</div>
                        </a>    
                    </div>
                ))}
            </Space>
        </Row>
    )
}

const ItemIcon5: React.FC <{ item : ToolNavArry }> = ({ item }) => {
    const itemDiv = css`
        width: 220px;
        height: 121px;
        padding: 18px;
    `;
    const itemCommon = css`
        display: flex;
    `;
    const itemBox = css`
        flex:1;
    `;
    const itemImg = css`
        width: 84px;
        height: 84px;
        margin-right: 15px;
        display: block;
    `;
    const itemText = css`
        margin-top: 2px;
        font-size: 12px;
        color: #999999;
        line-height: 18px;
    `;
    const itemName = css`
        font-size: 14px;
        color: #333333;
        line-height: 21px;
    `;
    return (
        <Row>
            <Space size={[12, 15]} wrap>
                { item.children.map((value:any,index:number) => (
                    <div key={index} className={cx(itemDiv,{ [itemHover]: true})}>
                        <a href="" target="" className={cx(itemCommon)}>
                            <img src={value.img} alt="" className={(itemImg)}/>
                            <div className={cx(itemBox)}>
                                <div className={cx("lc-2",itemName)}>{value.name}</div>
                                <div className={cx("lc-2",itemText)}>{value.desc}</div>
                            </div>
                        </a>
                    </div>
                ))}
            </Space>
        </Row>
    )
}
