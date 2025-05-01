import React, { ReactNode } from "react";
import Navbar from "@/app/components/navbar";

interface MainWrapperProps {
    children: ReactNode;
}

export default function Main_wrapper({ children }: MainWrapperProps) {
    return (
        <div className="flex flex-col items-center">
            <Navbar />
            <div className="mx-10 border-l border-r border-neutral-300 h-screen border-dashed">
                {children}
            </div>
        </div>
    );
}
