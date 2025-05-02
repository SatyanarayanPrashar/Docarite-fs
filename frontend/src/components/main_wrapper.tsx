import React, { ReactNode } from "react";
import Navbar from "@/components/navbar";

interface MainWrapperProps {
    children: ReactNode;
}

export default function Main_wrapper({ children }: MainWrapperProps) {
    return (
        <div className="flex flex-col items-center h-screen">
            <Navbar />
            <div className="w-full px-10 h-full">
                <div className="border-l border-r border-dashed border-neutral-300">
                    {children}
                </div>
            </div>
        </div>
    );
}
