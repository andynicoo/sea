import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import React, { Fragment } from "react";
import Container from "@/components/Container";
import { cx } from "@emotion/css";

interface DefaultLayoutProps {
    className?: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, className }) => {

    return <Fragment>
        <MinHead />
        <Container className={cx("py-[20px]", className)}>
            {children}
        </Container>
        <Footer />
    </Fragment>
}

export default DefaultLayout;