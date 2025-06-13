"use client"

import { CirclePlus } from "lucide-react"

export default function HomePage() {

    return (
        <div className="flex w-full flex-col gap-10 p-4 px-10">
            <div className="flex justify-between">
                <div>
                    <p className="text-3xl">Repositories</p>
                    <p className="text-sm text-neutral-500">List of repositories accessible to Docarite.</p>
                </div>
                <button className="px-8 h-[40px] rounded-md text-white bg-blue-600 flex gap-2 items-center ">
                    <CirclePlus size={15} />
                    Add Repositories
                </button>
            </div>
            <div className="relative w-full h-full flex flex-col items-center p-12 gap-6 justify-between rounded-lg border border-blue-200/20 backdrop-blur-[10px] bg-gradient-to-b from-blue-200/20 to-blue-100/5 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none rounded-lg bg-[radial-gradient(ellipse_at_top_left,rgba(173,216,230,0.2),transparent)]" />
                <p className="text-xl">Docarite currently doesn't have access to repositories for this account.</p>
                <button className="px-8 h-[40px] rounded-md text-white bg-blue-600 flex gap-2 items-center ">
                    <CirclePlus size={15} />
                    Add Repositories
                </button>
                <p className="text-neutral-600 text-center">Install Docarite on your GitHub account and grant access <br /> to the repositories you want to work with.</p>
            </div>
        </div>
    )
}
