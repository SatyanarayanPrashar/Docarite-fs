'use client';

import { RepoRow, Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddRepoButton } from "./addRepo_btn";
import { EmptyState } from "./emptyState";
import { LoadingSkeleton } from "./loading";
import { GithubRepo_type } from "@/types/githube_types";
import { useUserInfo } from "@/hooks/usefetchUser";
import { useOrganisation } from "@/hooks/usefetchOrg";
import { useSearchParams } from 'next/navigation';
import { useSyncGitHubRepos } from "@/hooks/useSyncRepo";
import { useEffect, useState, useRef } from "react";
import { SyncingDisplay } from "./syncing_display";
import RegisterState from "./newOrg_state";

export default function RepoSyncWrapper() {
    const searchParams = useSearchParams();
    const installationId = searchParams.get("installation_id");
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const { userInfo, userError } = useUserInfo();
    const { organisation, repos, loading, error } = useOrganisation(userInfo?.email, refetchTrigger);

    const { isSyncing, startSync } = useSyncGitHubRepos({ organisation, onSyncSuccess: () => setRefetchTrigger(prev => prev + 1) });

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

    const handleRegisterSuccess = () => {
        setRefetchTrigger((prev) => prev + 1); // triggers useOrganisation re-fetch
    };

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
                                    {repos.map((repo: GithubRepo_type) => (
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
                            onRegisterSuccess={handleRegisterSuccess}
                        />
                    )
                )
            )}
        </div>
    );
}
