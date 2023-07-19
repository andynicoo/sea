import React, { Fragment, FC } from "react";
import { RouteComponentProps, withRouter } from "react-router";

interface AppProps {
}

const App: FC<RouteComponentProps & AppProps> = (props) => {
    return (
        <Fragment>
            {props.children}
        </Fragment>
    );
}

export default withRouter(App);