import Link from 'next/link';
import { FaExclamationTriangle } from "react-icons/fa";

export default function AuthCodeError() {
  return (
    <div className="relative h-[100vh] w-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md flex p-10 flex-col gap-6 justify-center items-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl">
        
        <div className="bg-red-100 p-4 rounded-full">
            <FaExclamationTriangle className="text-red-500" size={40} />
        </div>

        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-800">Authentication Failed</h2>
            <p className="text-zinc-600">
                There was a problem verifying your identity with GitHub. This usually happens if the link expired or the permission was denied.
            </p>
        </div>

        <Link 
            href="/" 
            className="w-full px-8 py-3 flex items-center justify-center gap-2 rounded-2xl border border-white/50 text-white bg-gradient-to-br from-blue-600/80 to-blue-600/60 shadow-lg hover:from-blue-600/90 hover:to-blue-600/70 transition-all hover:cursor-pointer"
        >
            Try Logging In Again
        </Link>
        
      </div>
    </div>
  );
}