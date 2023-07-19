import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { Card, Tabs } from "antd";
import { NextPage } from "next";
import React, { Fragment, Key } from "react";
import { Commend, Dynamics, Fans, InfoCard, Like } from "@/pages/users";
import { useRouter } from "next/router";

interface UsersDetailPageProps {

}

/**其他用户的主页 */
const UsersDetailPage: NextPage<UsersDetailPageProps> = () => {

    const { query } = useRouter();
    const userId = query.id as Key;


    return (
        <Fragment>
            <MinHead />
            <InfoCard userId={userId} />
            <Container>
                <Card bordered={false}>
                    <Tabs size={"large"}>
                        <Tabs.TabPane tab={"动态"} key={1}>
                            <Dynamics userId={userId} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"评论"} key={2}>
                            <Commend userId={userId} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"粉丝"} key={3}>
                            <Fans userId={userId} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"关注"} key={4}>
                            <Like userId={userId} />
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </Container>
            <Footer />
        </Fragment>
    )
}

export default UsersDetailPage;