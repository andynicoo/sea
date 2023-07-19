import Authorization, { ErrorResult } from "@/components/Authorization";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { AuthResponse } from "@/vo/Auth";
import { Card, message } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

interface LoginPageProps {

}

const LoginPage: NextPage<LoginPageProps> = () => {

    const { push } = useRouter();

    const onError = (error: ErrorResult) => {
        message.error(error.response.data.message);
    }

    const onSuccess = (data: AuthResponse) => {
        Authorization.local(data);
        push("/");
    }

    return (
        <DefaultLayout>
            <Card className="mx-auto w-[500px]" bordered={false}>
                <Authorization

                    onError={onError}
                    onSuccess={onSuccess}
                />
            </Card>
        </DefaultLayout>
    )
}

export default LoginPage;