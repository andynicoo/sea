import Icon from "@/components/Icon";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { css } from "@emotion/css";
import { Button, Space } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import cookie from "cookie_js";
interface UserPageProps {
  statusCode?: number;
}

/**错误页面 */
const UserPage: NextPage<UserPageProps> = ({ statusCode }) => {
  return (
    <DefaultLayout>
      {/* {statusCode === 500
                ? <ErrorContent statusCode={500} /> */}
      <ErrorContent />
      {/* } */}
    </DefaultLayout>
  );
};

UserPage.getInitialProps = ({ res, err }) => {
  return { statusCode: res?.statusCode };
};

export default UserPage;

interface ErrorContentProps {}

const ErrorContent: React.FC<ErrorContentProps> = () => {
  const [time, setTime] = useState<number>(2);

  const images: { [key: number]: string } = {
    404: "/asset/image/normal-error.png",
  };

  const src = images[404];

  const imgCls = css`
    width: 500px;
    margin-bottom: 55px;
    margin-top: 50px;
  `;

  const router = useRouter();
  if (process.browser) {
      cookie.set(process.env.TOKEN_KEY, "");
  }
  
  const onBack = () => {
    cookie.set(process.env.TOKEN_KEY, "");
    if (router.isFallback) router.back();
    else router.replace("/");
  };

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
      <img src={src} className={imgCls} />
      <p className="mb-[40px]">您的登录已失效，请重新登录！</p>

      <Space>
        <Button size={"large"} onClick={onBack} ghost type={"primary"}>
          <Icon type={"icon-shuaxin"} />
          {time} 秒后 返回首页
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
  );
};
