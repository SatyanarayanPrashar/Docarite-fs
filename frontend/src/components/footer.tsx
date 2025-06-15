import React from "react";
import Image from "next/image";

export default function Footer_landing() {
    return (
        <div className="h-60  flex gap-10 mt-7 sm:mt-13 w-7xl mx-auto border-t py-10">
            <div className="flex flex-col items-start flex-1 h-full">
                <div className="flex gap-2 items-center">
                    <Image
                        src="/logo_no_name.png"
                        alt="docarite logo"
                        width={55}
                        height={40}
                        priority
                    />
                    <p className="font-bold text-4xl">Docarite</p>
                </div>
            </div>
            <div className="flex flex-col items-start flex-1 gap-3 h-full">
                <p>Features</p>
                <p>FAQ</p>
                <p>Blogs</p>
                <p>Changelog</p>
            </div>
            <div className="flex flex-col items-start flex-1 gap-3 h-full">
                <p>Contact us</p>
                <p>Support</p>
                <p>Pricing</p>
                <p>Terms & Conditions</p>
            </div>
            <div className="flex flex-col items-center flex-2 h-full">

            </div>
        </div>
    );
}
