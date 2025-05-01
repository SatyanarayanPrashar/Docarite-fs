import Image from "next/image";

export default function Home() {
  return (
    <div className="h-[85%] flex px-28 items-center">
      <div className="flex flex-col w-1/2">
        <h1 className="font-light leading-none text-6xl">Docarite</h1>
        {/* <p className="text-xl">Documentation, Done Right.</p> */}
        <p className="font-light text-3xl">Automated Documentation generation and maintainance</p>
        <p className="mt-3 text-neutral-600 font-extralight">Enter the URL of a public GitHub repository</p>
        <input type="text" className="border p-2 rounded-sm font-extralight" placeholder="https://github.com/owner/repo"/>
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
  );
}
