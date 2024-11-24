import React, { ReactNode } from "react";
import Navbar from "./_components/Navbar";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
    return <div className="section:bg-[hsl(320,65%,52%,20%)]">
        <Navbar />
        {children}
    </div>;
};

export default MarketingLayout;
