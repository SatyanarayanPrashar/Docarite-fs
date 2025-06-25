import { CirclePlus } from "lucide-react";

const GITHUB_APP_INSTALL_URL = "https://github.com/apps/docarite/installations/new";

export const AddRepoButton = () => (
    <a href={GITHUB_APP_INSTALL_URL} className="px-5 h-[40px] rounded-md text-white bg-blue-600 hover:bg-blue-700 flex gap-2 items-center transition-colors shadow-sm">
        <CirclePlus size={16} />
        Add Repositories
    </a>
);