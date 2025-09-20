"use client"

import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { LoadingSkeleton } from "./loading";

interface RegisterStateProps {
    userName: string;
    userEmail: string;
    onRegisterSuccess?: () => void;
}

export default function RegisterState({ userName, userEmail, onRegisterSuccess }: RegisterStateProps) {
    const [orgName, setOrgName] = useState("");
    const [orgEmail, setOrgEmail] = useState("");
    const [orgWebsite, setOrgWebsite] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        if (!orgName) {
            setError("Organisation Name is required.");
            return;
        }
        setLoading(true);    
        setError(null);
        try {
            const body = JSON.stringify({
                org_name: orgName,
                org_email: orgEmail || null,
                org_website: orgWebsite || null,
                user_name: userName,
                user_email: userEmail
            })
            const res = await fetch("http://127.0.0.1:8000/api/user_register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            });
        
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to register organisation.");
            }

            onRegisterSuccess?.();
        } catch (err) {
             if (err instanceof Error) {
                setError(err.message);
                console.error("Error registering organisation:", err);
            } else {
                setError("An unknown error occurred.");
                console.error("Error registering organisation:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    if(loading){
        return (
            <LoadingSkeleton />
        )
    }

    return (
        <div className="relative w-full flex flex-col p-10 sm:p-16 rounded-lg border border-dashed border-neutral-300 bg-neutral-50">
            <div className="absolute inset-0 pointer-events-none rounded-lg bg-[radial-gradient(ellipse_at_center,rgba(200,200,255,0.1),transparent)]" />

            <h3 className="text-xl font-semibold text-neutral-800">No Organisation Found</h3>
            <p className="text-neutral-600 max-w-xl">
                Create an organisation to manage your repositories and settings. An organisation allows you to group repositories, add people and manage access permissions.
            </p>
            <div className="flex flex-col gap-4 w-full max-w-xl text-left mt-6">
                <input
                    type="text"
                    placeholder="Organisation Name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="email"
                    placeholder="Organisation Email (optional)"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="url"
                    placeholder="Organisation Website (optional)"
                    value={orgWebsite}
                    onChange={(e) => setOrgWebsite(e.target.value)}
                    className="border rounded px-3 py-2"
                />
            </div>
             {error && <p className="text-red-500 mt-2">{error}</p>}
            <div onClick={handleRegister} className="max-w-[8rem] px-5 h-[40px] rounded-md text-white bg-blue-600 hover:bg-blue-700 flex gap-2 items-center transition-colors hover:cursor-pointer shadow-sm mt-6">
                <CirclePlus size={16} />
                Create
            </div>
        </div>
    )
}