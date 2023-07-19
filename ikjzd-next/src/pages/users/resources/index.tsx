import DefaultLayout from "@/components/layouts/DefaultLayout";
import Link from "next/link";
import React, { Fragment, Key, useEffect, useImperativeHandle, useState } from "react";
import { Button, Tabs, List, Input, Card, Space, Avatar } from "antd";
import { PlusOutlined, FormOutlined } from '@ant-design/icons';
import { getResources } from "@/apis/users";
import MineLayout from "@/components/users/MineLayout";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Resources } from "@/vo/Users";
import { PaginationConfig } from "antd/lib/pagination";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Authorization from "@/components/Authorization";

interface UsersMineResourcesPageProps {

}

const UsersMineResourcesPage: NextPage<UsersMineResourcesPageProps> = () => {
    return (
        <DefaultLayout>
            <MineLayout>
                <MyResources />
            </MineLayout>
        </DefaultLayout>
    );
};

export default UsersMineResourcesPage;

/**我的资源 */
const MyResources: React.FC = () => {

    const { push } = useRouter();

    const cardExtra = (
        <Authorization.Valid>
            <Button onClick={() => push("/users/resources/add")}>
                <PlusOutlined />
                上传资源
            </Button>
        </Authorization.Valid>
    )
    return (
        <Card
            bordered={false}
            title={"我的资源"}
            extra={cardExtra}
        >
            <ResourceDownload />
        </Card>
    )
}

/**资源下载 */
const ResourceDownload: React.FC = () => {

    const ref = React.createRef<ResourceDownloadListRefProps>();

    const onSearch = (value: string) => ref.current?.onSearch(value);

    const tabBarExtra = <Input.Search onSearch={onSearch} />;

    return (
        <Tabs size={'large'} tabBarExtraContent={tabBarExtra}>
            <Tabs.TabPane tab={"我的资源"} key="1">
                <ResourceDownloadList ref={ref} />
            </Tabs.TabPane>
        </Tabs>
    )
};

/**资源，下载列表 */
interface ResourceDownloadListRefProps {
    onSearch: (value: string) => void;
}
const ResourceDownloadList = React.forwardRef<ResourceDownloadListRefProps>((_, ref) => {
    const [resources, setResources] = useState<PageSource<Resources>>();
    const [params, setParams] = useState<PageParams>({ current: 1, size: 10 });

    useEffect(() => {
        getResources(params).then((res) => {
            setResources(res.data);
        });
    }, [params]);

    const onChange = (current: number, size: number) => setParams({ current, size });

    const onSearch = (title: string) => {
        setParams({ current: 1, title })
    }

    useImperativeHandle(ref, () => ({
        onSearch
    }));

    const pagination: false | PaginationConfig = resources?.total
        ? ({
            current: resources.current,
            pageSize: resources.size,
            total: resources.total,
            onChange: onChange
        })
        : false;
    return <Fragment>
        <List
            dataSource={resources?.records}
            pagination={pagination}
            renderItem={(item) => {
                const description = (
                    <Space>
                        <span>适用平台:{item?.toolsPlatformName}</span>
                        <span>资源大小:{item.enclosureSize ? (parseInt(item.enclosureSize) / 1024).toFixed(2) + 'M' : 0 + 'M'}</span>
                        <span>下载次数:{item.enclosureDownloadNum}</span>
                        <span>所需积分:{item?.integralNum}</span>
                    </Space>
                )
                let picName = item.enclosureName?.split(".") || ['unknow']
                return <List.Item
                    actions={[<EditBtn id={item.id} />]}
                >
                    <List.Item.Meta
                        avatar={(
                            <Avatar
                                src={`/asset/image/icon/${picName[picName.length - 1]}.png`}
                                shape={"square"}
                                style={{ width: 56, height: 64 }}
                            />
                        )}
                        title={<p>{item.title}</p>}
                        description={description}
                    />
                </List.Item>
            }}
        />
    </Fragment>
})

const EditBtn: React.FC<{ id: Key }> = ({ id }) => (
    <Link href={`/users/resources/add?id=${id}`}>
        <a>
            <Button type="link" size={"small"}>
                <FormOutlined />
                编辑
            </Button>
        </a>
    </Link>
)