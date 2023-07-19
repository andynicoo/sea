import React from "react";

interface CenterProps {

}

const Center: React.FC<CenterProps> = ({ children }) => (
    <div className="text-center w-[100%]">
        {children}
    </div>
)

export default Center;