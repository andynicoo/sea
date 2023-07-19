import React from "react";

export interface DomainPageContextProps {

}

const DomainPageContext = React.createContext<DomainPageContextProps>({} as DomainPageContextProps);

export default DomainPageContext;