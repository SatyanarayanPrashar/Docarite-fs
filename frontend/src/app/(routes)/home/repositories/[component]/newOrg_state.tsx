import { AddRepoButton } from "./addRepo_btn";

const EmptyState = () => (
    <div className="relative w-full flex flex-col items-center text-center p-10 sm:p-16 gap-6 rounded-lg border border-dashed border-neutral-300 bg-neutral-50">
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-[radial-gradient(ellipse_at_center,rgba(200,200,255,0.1),transparent)]" />
        <h3 className="text-xl font-semibold text-neutral-800">No Repositories Found</h3>
        <p className="text-neutral-600 max-w-md">
            Docarite currently doesn&apos;t have access to any repositories for this account. Please install the Docarite GitHub App and grant access to the repositories you want to work with.
        </p>
        <div className="mt-2">
            <AddRepoButton />
        </div>
    </div>
);