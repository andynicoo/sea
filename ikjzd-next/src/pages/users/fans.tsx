import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { List } from "antd";
import { GetDynamicInfoParams, UserInfo } from "@/vo/Users";
import { getKjzdUsersFans } from "@/apis/users";
import HomeLayout from "@/components/users/HomeLayout";
import { PageSource } from "@/vo/PageParams";
import { PaginationConfig } from "antd/lib/pagination";
import DefaultLayout from "@/components/layouts/DefaultLayout";

interface UsersFansPageProps {
}

const UsersFans: NextPage<UsersFansPageProps> = () => {
    return (
        <DefaultLayout>
            <HomeLayout>
                <FansFollow />
            </HomeLayout>
        </DefaultLayout>
    );
};

export default UsersFans;

/**粉丝关注 */
interface FansFollowItemProps {
    user: UserInfo;
    user_id: string
}

const FansFollow: React.FC = () => {
    const [params, setParams] = useState<GetDynamicInfoParams>({ current: 1, size: 10, type: 1 });
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
                fans
            </List.Item>
        )}
    />
}
