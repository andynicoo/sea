import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Tabs, List } from "antd";
import { getKjzdArticle } from "@/apis/users";
import HomeLayout from "@/components/users/HomeLayout";
import Article from "@/components/encyclopedia/Article";
import ArticleVo from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import DefaultLayout from "@/components/layouts/DefaultLayout";

interface UsersDynamicProps {
}

const UsersDynamic: NextPage<UsersDynamicProps> = () => {
    return (
        <DefaultLayout>
            <HomeLayout>
                <UsersDynamics />
            </HomeLayout>
        </DefaultLayout>
    );
};

export default UsersDynamic;

/**动态Tab */
const UsersDynamics: React.FC = () => {
    return (
        <Tabs size={'small'}>
            <Tabs.TabPane tab={"文章"} key="1">
                <ArticleList />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"百科"} key="2">
                <ArticleList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="资源" key="3">
                Content of Tab Pane 3
            </Tabs.TabPane>
            <Tabs.TabPane tab="活动" key="4">
                Content of Tab Pane 3
            </Tabs.TabPane>
        </Tabs>
    )
};

/**文章百科列表 */
export const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<PageSource<ArticleVo>>();
    const [params, setParams] = useState<PageParams>({ current: 1, size: 10 });

    useEffect(() => {
        getKjzdArticle(params).then((res) => {
            setArticles(res.data);
        });
    }, [params]);

    const onChange = (current: number, size: number) => setParams({ current, size });

    return <List
        dataSource={articles?.records}
        pagination={{
            current: articles?.current,
            pageSize: articles?.size || 10,
            onChange: onChange
        }}
        renderItem={(item: ArticleVo) => (
            <List.Item>
                <Article {...item} />
            </List.Item>
        )}
    />
};
