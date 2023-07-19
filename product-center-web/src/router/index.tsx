import React from "react";
import { Router as RouterComponent, Route, Switch, Redirect } from "react-router-dom";
import { ConfigProvider } from 'antd';
import history from "./history";
import zh_CN from 'antd/es/locale/zh_CN';

import App from "@/views/App";
import Layout from "@/views/layout";
import NotFound from "@/views/NotFound";

//机会点
import OpportunityIndex from "@/views/opportunity/index";
import OpportunityEdit from "@/views/opportunity/Edit";
import OpportunityDetails from "@/views/opportunity/Details";

// //需求
import DemandIndex from "@/views/demand/index";
import DemandEdit from "@/views/demand/Edit";
import DemandDetails from "@/views/demand/Details";
import CostReductionEdit from "@/views/demand/CostReductionEdit";
import DevelopmentEdit from "@/views/demand/DevelopmentEdit";
import EntryResultsEdit from "@/views/demand/EntryResultsEdit";
import EntryTestsheetEdit from "@/views/demand/EntryTestsheetEdit";
import EntryListingEdit from "@/views/demand/EntryListingEdit";

//供应链
import SupplyIndex from "@/views/supply/index";
import SupplyDetails from "@/views/supply/Details";

//saas平台管理
import Appcenter from "@/views/saasManage/Appcenter";
import Siteinfo from "@/views/saasManage/Siteinfo";
import Partners from "@/views/saasManage/Partners";


//结算中心
import BillingConfig from "@/views/settlementCenter/BillingConfig";
import BillingList from "@/views/settlementCenter/BillingList";
import PurchaseOrder from "@/views/settlementCenter/PurchaseOrder";
import ReceiptList from "@/views/settlementCenter/ReceiptList";
import ReceiptListDetails from "@/views/settlementCenter/ReceiptListDetails";
import ServiceProvider from "@/views/settlementCenter/ServiceProvider";
import ServiceProviderEdit from "@/views/settlementCenter/ServiceProviderEdit";

//商品库，销售商品
import GoodsSourceIndex from "@/views/goodsSource/index";
import GoodsSourceAddEdit from "@/views/goodsSource/Edit";
import GoodsSourceDetails from "@/views/goodsSource/Details";


function Router(): React.ReactElement {

    return (
        <ConfigProvider locale={zh_CN}>
            <RouterComponent history={history}>
                <App>
                    <Switch>
                        <Route path="/qkgoods" render={() =>
                            <Layout>
                                <Switch>
                                    <Route exact path="/qkgoods/opportunity/index" component={OpportunityIndex} />
                                    <Route exact path="/qkgoods/opportunity/edit" component={OpportunityEdit} />
                                    <Route exact path="/qkgoods/opportunity/details" component={OpportunityDetails} />
                                    <Route exact path="/qkgoods/demand/index" component={DemandIndex} />
                                    <Route exact path="/qkgoods/demand/edit" component={DemandEdit} />
                                    <Route exact path="/qkgoods/demand/details" component={DemandDetails} />
                                    <Route exact path="/qkgoods/demand/costReductionEdit" component={CostReductionEdit} />
                                    <Route exact path="/qkgoods/demand/developmentEdit" component={DevelopmentEdit} />
                                    <Route exact path="/qkgoods/demand/entryResultsEdit" component={EntryResultsEdit} />
                                    <Route exact path="/qkgoods/demand/entryTestsheetEdit" component={EntryTestsheetEdit} />
                                    <Route exact path="/qkgoods/demand/entryListingEdit" component={EntryListingEdit} />
                                    <Route exact path="/qkgoods/supply/index" component={SupplyIndex} />
                                    <Route exact path="/qkgoods/supply/details" component={SupplyDetails} />
                                    <Route exact path="/qkgoods/sassManage/appcenter" component={Appcenter} />
                                    <Route exact path="/qkgoods/sassManage/siteinfo" component={Siteinfo} />
                                    <Route exact path="/qkgoods/sassManage/partners" component={Partners} />

                                    <Route exact path="/qkgoods/settlementCenter/billingConfig/:id" component={BillingConfig} />
                                    <Route exact path="/qkgoods/settlementCenter/billingList" component={BillingList} />
                                    <Route exact path="/qkgoods/settlementCenter/purchaseOrder" component={PurchaseOrder} />
                                    <Route exact path="/qkgoods/settlementCenter/receiptList" component={ReceiptList} />
                                    <Route exact path="/qkgoods/settlementCenter/receiptListEdit/:id" component={ReceiptListDetails} />
                                    <Route exact path="/qkgoods/settlementCenter/receiptListDetails/:id" component={ReceiptListDetails} />
                                    <Route exact path="/qkgoods/settlementCenter/serviceProvider" component={ServiceProvider} />
                                    <Route exact path="/qkgoods/settlementCenter/serviceProviderEdit/:id" component={ServiceProviderEdit} />

                                    <Route exact path="/qkgoods/goodsSource/index" component={GoodsSourceIndex} key="goodsSource" />
                                    <Route exact path="/qkgoods/goodsSource/add" component={GoodsSourceAddEdit} key="goodsSource/add" />
                                    <Route exact path="/qkgoods/goodsSource/addGroup" component={GoodsSourceAddEdit} key="goodsSource/addGroup" />
                                    <Route exact path="/qkgoods/goodsSource/edit/:id" component={GoodsSourceAddEdit} key="goodsSource/edit" />
                                    <Route exact path="/qkgoods/goodsSource/editGroup/:id" component={GoodsSourceAddEdit} key="goodsSource/editGroup" />
                                    <Route exact path="/qkgoods/goodsSource/details/:id" component={GoodsSourceDetails} key="goodsSource/details" />
                                    <Route exact path="/qkgoods/goodsSales/index" component={GoodsSourceIndex} key="goodsSales" />
                                    <Route exact path="/qkgoods/goodsSales/edit/:id" component={GoodsSourceAddEdit} key="goodsSales/edit" />
                                    <Route exact path="/qkgoods/goodsSales/editGroup/:id" component={GoodsSourceAddEdit} key="goodsSales/editGroup" />
                                    <Route exact path="/qkgoods/goodsSales/details/:id" component={GoodsSourceDetails} key="goodsSales/details" />

                                    <Route path="/qkgoods/*" component={NotFound} />
                                </Switch>
                            </Layout>
                        } />
                        <Route path="/404" component={NotFound} />
                        <Route path="/" render={() => <Redirect to="/qkgoods/index" />} />
                    </Switch>
                </App>
            </RouterComponent >
        </ConfigProvider>
    )
}

export default Router;