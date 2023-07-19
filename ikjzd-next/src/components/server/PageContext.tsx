import { Product, Store } from "@/vo/Domain";
import { PageSource } from "@/vo/PageParams";
import React from "react";

export interface ServerPageContextProps {
    product?: Product;
    store?: Store;
    products?: PageSource<Product>;
}

const ServerPageContext = React.createContext<ServerPageContextProps>({} as ServerPageContextProps);

export default ServerPageContext;