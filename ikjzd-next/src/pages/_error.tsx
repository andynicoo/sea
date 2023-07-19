import Icon from "@/components/Icon";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { css } from "@emotion/css";
import { Button, Space } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import cookie from "cookie_js";
interface ErrorPageProps {
    statusCode?: number;
}

/**错误页面 */
const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {

    return (
        <DefaultLayout>
            {/* {statusCode === 500
                ? <ErrorContent statusCode={500} /> */}
            <ErrorContent statusCode={404} />
            {/* } */}

        </DefaultLayout>
    )
}

ErrorPage.getInitialProps = ({ res, err }) => {
    return { statusCode: res?.statusCode }
}

export default ErrorPage;

interface ErrorContentProps {
    statusCode: number;
}

const ErrorContent: React.FC<ErrorContentProps> = (props) => {

    const [time, setTime] = useState<number>(3);

    const images: { [key: number]: string } = {
        404: "/asset/image/404-error.png",
        500: "/asset/image/500-error.png",
    }

    const src = images[props.statusCode];

    const imgCls = css`
        width: 500px;
        margin-bottom: 40px;
    `;

    const router = useRouter();

    const onBack = () => {
        cookie.set(process.env.TOKEN_KEY, "");
        if (router.isFallback) router.back();
        else router.replace("/");
    }

    useEffect(() => {
        const interval = setInterval(() => setTime(time - 1), 1000);
        if (time <= 0) {
            onBack();
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [time]);

    return (
        <div className={"text-center mb-[40px]"}>
            <img
                src={src}
                className={imgCls}
            />
            <p className="mb-[40px]">
                {
                    props.statusCode === 500
                        ? "哎呀,服务器出了点小问题"
                        : "没有找到你的请求路径"
                }
            </p>
            <p className="mb-[40px]">
                {
                    props.statusCode === 500
                        ? "如果你看到该提示,说明服务器出现了问题,刚从被窝中努力爬起来的程序员哥哥正在拼命修复中拷贝"
                        : "仔细找过了,没有发现您要找的页面,3秒后返回上一页或点击进入首页"
                }
            </p>
            <Space>
                <Button size={"large"} onClick={onBack} ghost type={"primary"}>
                    <Icon type={"icon-shuaxin"} />
                    {time} 秒后 返回上一页
                </Button>
                <Link href={"/"} replace>
                    <a>
                        <Button size={"large"} ghost type={"primary"}>
                            <Icon type={"icon-shouye"} />
                            网站首页
                        </Button>
                    </a>
                </Link>
            </Space>
        </div>
    )
}