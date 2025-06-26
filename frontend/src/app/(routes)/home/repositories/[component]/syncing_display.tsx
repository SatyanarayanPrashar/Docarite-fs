import { Loader2 } from "lucide-react";

export const SyncingDisplay = () => (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-8 border rounded-lg bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Syncing the Repositories...</h2>
        <p className="text-neutral-500">Please wait a moment while we add your new repository.</p>
    </div>
);
