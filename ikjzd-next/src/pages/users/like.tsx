import { getKjzdUsersFans } from "@/apis/users";
import HomeLayout from "@/components/users/HomeLayout";
import { PageSource } from "@/vo/PageParams";
import { GetDynamicInfoParams, UserInfo } from "@/vo/Users";
import { List } from "antd";
import { PaginationConfig } from "antd/lib/pagination";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/layouts/DefaultLayout";

interface UsersLikePageProps {

}

const UsersLikePage: NextPage<UsersLikePageProps> = () => {
    return (
        <DefaultLayout>
            <HomeLayout>
                <FansFollow />
            </HomeLayout>
        </DefaultLayout>
    )
}

export default UsersLikePage;

/**我的关注 */
interface FansFollowItemProps {
    user: UserInfo;
    user_id: string
}

const FansFollow: React.FC = () => {

    const [params, setParams] = useState<GetDynamicInfoParams>({ current: 1, size: 10, type: 2 });
    const [fansData, setFansData] = useState<PageSource<any>>();

    useEffect(() => {
        getKjzdUsersFans(params).then((res) => {
            setFansData(res.data);
        });
    }, []);

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    const pagination: false | PaginationConfig = fansData && fansData.total
        ? ({
            current: fansData?.current,
            pageSize: fansData?.size,
            total: fansData?.total,
            onChange: onChange
        })
        : false

    return <List
        dataSource={fansData?.records}
        pagination={pagination}
        renderItem={(item: FansFollowItemProps) => (
            <List.Item>
                111
            </List.Item>
        )}
    />
}
