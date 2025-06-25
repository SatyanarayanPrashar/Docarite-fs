"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    RepoRow
} from "@/components/ui/table"
import { GithubRepo } from "@/types/githube_types"
import { redirect } from 'next/navigation'
import { AddRepoButton } from "./[component]/addRepo_btn"
import { EmptyState } from "./[component]/emptyState"
import { LoadingSkeleton } from "./[component]/loading"

export default function HomePage() {
    const [repos, setRepos] = useState<GithubRepo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOrganisation = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/organisation/");
            if (!response.ok) throw new Error("Failed to fetch organisation data.");

            const organisationData = await response.json();
            console.log("Organisation Data:", organisationData);
            // Process organisationData as needed
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                console.error(err);
            } else {
                setError("An unexpected error occurred.");
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }, [])

    const fetchRepos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const githubToken = session?.provider_token;

            if (!githubToken) {
                await supabase.auth.signOut();
                redirect('/authentication');
            }

            const installationsRes = await fetch("https://api.github.com/user/installations", {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: "application/vnd.github.v3+json"
                }
            });
            if (!installationsRes.ok) throw new Error("Failed to fetch GitHub App installations.");

            const installationsData = await installationsRes.json();
            if (!installationsData.installations || installationsData.installations.length === 0) {
                 setRepos([]);
                 setLoading(false);
                 return;
            }

            const repoPromises = installationsData.installations.map(async (installation: { id: number }) => {
                const reposRes = await fetch(`https://api.github.com/user/installations/${installation.id}/repositories`, {
                    headers: {
                        Authorization: `Bearer ${githubToken}`,
                        Accept: "application/vnd.github.v3+json"
                    }
                });
                if (!reposRes.ok) throw new Error(`Failed to fetch repositories for installation ${installation.id}.`);
                const reposData = await reposRes.json();
                return reposData.repositories || [];
            });

            const allReposArrays = await Promise.all(repoPromises);
            const allRepos = allReposArrays.flat().map((repo: GithubRepo) => ({ ...repo, active: true }));

            setRepos(allRepos);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                console.error(err);
            } else {
                setError("An unexpected error occurred.");
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRepos();
    }, [fetchRepos]);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 sm:p-6 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Repositories</h1>
                    <p className="text-sm text-neutral-500 mt-1">List of repositories accessible to Docarite.</p>
                </div>
                {!loading && repos.length > 0 && <AddRepoButton />}
            </header>

            {error && <div className="text-red-600 bg-red-100 border border-red-400 rounded-md p-4">{error}</div>}

            {loading ? (
                <LoadingSkeleton />
            ) : repos.length === 0 ? (
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
                            {repos.map(repo => <RepoRow key={repo.id} repo={repo} />)}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}