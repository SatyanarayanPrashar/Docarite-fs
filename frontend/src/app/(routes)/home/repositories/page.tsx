"use client";

import {
    RepoRow,
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AddRepoButton } from "./[component]/addRepo_btn";
import { EmptyState } from "./[component]/emptyState";
import { LoadingSkeleton } from "./[component]/loading";
import RegisterState from "./[component]/newOrg_state";
import { GithubRepo } from "@/types/githube_types";
import { useUserInfo } from "@/hooks/usefetchUser";
import { useOrganisation } from "@/hooks/usefetchOrg";
import { useSearchParams } from 'next/navigation';
import { useSyncGitHubRepos } from "@/hooks/useSyncRepo";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

const SyncingDisplay = () => (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-8 border rounded-lg bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Syncing the Repositories...</h2>
        <p className="text-neutral-500">Please wait a moment while we add your new repository.</p>
    </div>
);


export default function HomePage() {
    const searchParams = useSearchParams();
    const installationId = searchParams.get("installation_id");

    const { userInfo, userError } = useUserInfo();
    const { organisation, repos, loading, error, refetch } = useOrganisation(userInfo?.email);
    
    const { isSyncing, startSync } = useSyncGitHubRepos({ organisation, repos, refetch });

    const syncTriggered = useRef(false);

    useEffect(() => {
        if (installationId && organisation?.id && repos !== undefined && !syncTriggered.current) {
            syncTriggered.current = true;
            const timer = setTimeout(() => {
                startSync(installationId);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [installationId, organisation, repos, startSync]);

    const handleRegistrationSuccess = () => refetch();

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 sm:p-6 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Repositories</h1>
                    <p className="text-sm text-neutral-500 mt-1">List of repositories accessible to Docarite.</p>
                </div>
                {!loading && organisation && repos.length > 0 && !isSyncing && <AddRepoButton />}
            </header>

            {(userError || error) && (
                <div className="text-red-600 bg-red-100 border border-red-400 rounded-md p-4">
                    {userError || error}
                </div>
            )}
            
            {isSyncing ? (
                 <SyncingDisplay />
            ) : ( 
                loading ? (
                    <LoadingSkeleton />
                ) : organisation ? (
                    repos.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-2/4">Repository</TableHead>
                                        <TableHead>GitHub</TableHead>
                                        <TableHead>Settings</TableHead>
                                        <TableHead>Active</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {repos.map((repo: GithubRepo) => (
                                        <RepoRow key={repo.id} repo={repo} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )
                ) : (
                    userInfo && (
                        <RegisterState
                            userName={userInfo.user_metadata.full_name ?? userInfo.email ?? ""}
                            userEmail={userInfo.email ?? ""}
                            onRegistrationSuccess={handleRegistrationSuccess}
                        />
                    )
                )
            )}
        </div>
    );
}