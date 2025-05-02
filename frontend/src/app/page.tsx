"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [tool, setTool] = useState("README Generator");

  return (
    <div className="flex flex-col px-24">
      <div className="mt-24 flex items-center text-black">
        <div className="flex flex-col w-1/2 gap-10">
          <p className="text-sm font-medium tracking-wider text-transparent uppercase bg-clip-text bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600"> <span className="font-bold">Save hours</span> of manually writing code documentation</p>
          <h1 className="leading-none text-5xl "> <span className="font-bold">AI</span> Code documentation tools</h1>
          <p className="font-light text-xl">Automated AI-powered tools to generate Code & Api documentation from your source code files</p>
          {/* <p className="mt-3 text-neutral-600 font-extralight">Enter the URL of a public GitHub repository</p>
          <input type="text" className="border p-2 rounded-sm font-extralight" placeholder="https://github.com/owner/repo"/> */}
          <Button className="bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600 text-white font-bold rounded-md px-4 py-2 mt-5 hover:bg-gradient-to-l hover:from-green-500 hover:to-green-400 w-40">Get Started</Button>
        </div>
        <div className="flex w-1/2 justify-center ml-30">
          <Image
            className=""
            src="/logo_no_name.png"
            alt="Next.js logo"
            width={400}
            height={70}
            priority
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-10 mt-24 w-full h-20">
        <div
          className={cn(
            "flex items-center justify-center border rounded-md shadow-xl cursor-pointer",
            tool == "README Generator" &&
            "bg-gradient-to-r from-neutral-100 via-white to-neutral-100"
          )}
          role="button"
          onClick={() => setTool("README Generator")}
        >
          README Generator
        </div>
        <div
          className={cn(
            "flex items-center justify-center border rounded-md shadow-xl cursor-pointer",
            tool == "AI Code Documentation" &&
            "bg-gradient-to-r from-neutral-100 via-white to-neutral-100"
          )}
          role="button"
          onClick={() => setTool("AI Code Documentation")}
        >
          AI Code Documentation
        </div>
        <div
          className={cn(
            "flex items-center justify-center border rounded-md shadow-xl cursor-pointer",
            tool == "API Documentation" &&
            "bg-gradient-to-r from-neutral-100 via-white to-neutral-100"
          )}
          role="button"
          onClick={() => setTool("API Documentation")}
        >
          API Documentation
        </div>
      </div>

      {tool == "README Generator" && (
        <div className="my-24 flex gap-4 items-center text-black">
          <div className="flex w-[65%] justify-center border rounded-md shadow-2xl">
            <Image
              className="rounded-md"
              src="/readme.png"
              alt="Next.js logo"
              width={750}
              height={500}
              priority
            />
          </div>
          <div className="flex flex-col w-[35%] gap-8 ml-10">
            <p className="text-4xl font-medium text-transparent uppercase bg-clip-text bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600"> <span className="font-bold">AI README</span> file generator</p>
            <p className="font-light text-xl">Customize your README file. Choose the sections you want to include.</p>
            <p className="font-light text-xl">Our markdown editor allows you to write and edit your code documentation on-site. No need to switch between tools.</p>
            <Button className="bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600 text-white font-bold rounded-md px-4 py-2 mt-5 hover:bg-gradient-to-l hover:from-green-500 hover:to-green-400 w-40">Get Started</Button>
          </div>
        </div>
      )}
      {tool == "AI Code Documentation" && (
        <div className="my-24 flex gap-4 items-center text-black">
          <div className="flex w-[65%] justify-center border rounded-md shadow-2xl">
            <Image
              className="rounded-md"
              src="/documentation.png"
              alt="Next.js logo"
              width={750}
              height={500}
              priority
            />
          </div>
          <div className="flex flex-col w-[35%] gap-8 ml-10">
            <p className="text-4xl font-medium text-transparent uppercase bg-clip-text bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600"> <span className="font-bold">AI</span> Code Documentation Generator</p>
            {/* <p className="font-light text-xl">generate automated code documentation from your source code files.</p> */}
            <p className="font-light text-xl">Generated RAG enabled documenations from your source code</p>
            <Button className="bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600 text-white font-bold rounded-md px-4 py-2 mt-5 hover:bg-gradient-to-l hover:from-green-500 hover:to-green-400 w-40">Get Started</Button>
          </div>
        </div>
      )}
      {tool == "API Documentation" && (
        <div className="my-24 flex gap-4 items-center text-black">
          <div className="flex w-[65%] h-[25rem] justify-center border rounded-md shadow-2xl">
            <Image
              className="rounded-md object-cover"
              src="/api_doc.png"
              alt="Next.js logo"
              width={750}
              height={300}
              priority
            />
          </div>
          <div className="flex flex-col w-[35%] gap-8 ml-10">
            <p className="text-4xl font-medium text-transparent uppercase bg-clip-text bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600"> <span className="font-bold">AI API</span> Documentation </p>
            {/* <p className="font-light text-xl">generate automated code documentation from your source code files.</p> */}
            <p className="font-light text-xl">Automatically generate precise, Swagger-compliant API docs from your source code.</p>
            <Button className="bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600 text-white font-bold rounded-md px-4 py-2 mt-5 hover:bg-gradient-to-l hover:from-green-500 hover:to-green-400 w-40">Get Started</Button>
          </div>
        </div>
      )}
    </div>
  );
}
