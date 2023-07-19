import { Layout } from 'antd';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import { getUser } from '@/api/opportunity';
import { setButtonAuth, setCountryAll, setProductCategory, setUsersAll } from '@/store/actions/globalActions';
import { AuthorityItem } from '@/vo/opportunityVo';
import { getCountryList, getUserAll, loginToken } from '@/api/public';
import { productCategoryGetPage } from '@/api/goodsSource';

const { Content } = Layout;

const LayoutPage: React.FC = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isAuth, setIsAuth] = useState(false)
    //第二次进入乾坤路由不更新处理
    //@ts-ignore 
    if (window.__POWERED_BY_QIANKUN__) {
        if (window.location.pathname !== history.location.pathname) {
            history.push(window.location.pathname)
        }
    }
    useEffect(() => {
        //获取登入用户信息
        getUser().then(res => {
            let actionAuth: string[] = ['qkgoods']
            res.data.authorities.forEach((ele: AuthorityItem) => {
                if (ele.authority.includes('ACTION_')) {
                    actionAuth.push(ele.authority)
                }
            });
            sessionStorage.buttonAuth = JSON.stringify(actionAuth)
            setButtonAuth(actionAuth)(dispatch)
            setIsAuth(true)
        })
        //获取所有用户列表
        if (!sessionStorage.usersAll) {
            getUserAll().then(res => {
                sessionStorage.usersAll = JSON.stringify(res.data)
                setUsersAll(res.data)(dispatch)
            })
        } else {
            setUsersAll(JSON.parse(sessionStorage.usersAll))(dispatch)
        }
        if (!sessionStorage.countryAll) {
            getCountryList().then(res => {
                let countryAllHandle: any = res.data.map((item: any) => { return { label: item.countryNameZh, value: item.countryCode } })
                sessionStorage.countryAll = JSON.stringify(countryAllHandle)
                setCountryAll(countryAllHandle)(dispatch)
            })
        } else {
            setCountryAll(JSON.parse(sessionStorage.countryAll))(dispatch)
        }
        if (!sessionStorage.productCategory) {
            productCategoryGetPage({ current: 1, size: 100 }).then(res => {
                sessionStorage.productCategory = JSON.stringify(res.data.records)
                setProductCategory(res.data.records)(dispatch)
            })
        } else {
            setProductCategory(JSON.parse(sessionStorage.productCategory))(dispatch)
        }

    }, [])
    return <Layout className='qiankun-gc-wrap'>
        {
            //@ts-ignore 
            !window.__POWERED_BY_QIANKUN__ && <div style={{ "display": "flex" }}>
                <Link className='gc-mr-2' to="/qkgoods/opportunity/index">机会点</Link>
                <Link className='gc-mr-2' to="/qkgoods/demand/index">需求</Link>
                <Link className='gc-mr-2' to="/qkgoods/supply/index">供应链</Link>
                <Link className='gc-mr-2' to="/qkgoods/sassManage/appcenter">应用中心</Link>
                <Link className='gc-mr-2' to="/qkgoods/sassManage/siteinfo">网站信息</Link>
                <Link className='gc-mr-2' to="/qkgoods/sassManage/partners">合作伙伴</Link>

                <Link className='gc-mr-2' to="/qkgoods/settlementCenter/purchaseOrder">采购订单列表</Link>
                <Link className='gc-mr-2' to="/qkgoods/settlementCenter/billingList">结算明细</Link>
                <Link className='gc-mr-2' to="/qkgoods/settlementCenter/receiptList">付款单管理</Link>

                <Link className='gc-mr-2' to="/qkgoods/goodsSource/index">商品库</Link>
                <Link className='gc-mr-2' to="/qkgoods/goodsSales/index">销售商品</Link>


            </div>
        }
        {isAuth && <Content>
            {props.children}
        </Content>}
    </Layout >
}

export default LayoutPage;