
import { getRedirectUri } from "@/apis/users";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";


const BackPage: NextPage = (props) => {
    const { query } = useRouter()
    useEffect(() => {
        getRedirectUri({ ...query }).then((res) => {
            window.close()
        })
    }, [])
    return <div></div>
}
export default BackPage;