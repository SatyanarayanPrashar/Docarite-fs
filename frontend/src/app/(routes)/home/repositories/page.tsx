"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { CirclePlus, Bolt, Link as LinkIcon } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface GithubRepo {
    id: number;
    full_name: string;
    private: boolean;
    html_url: string;
    active: boolean;
}

const GITHUB_APP_INSTALL_URL = "https://github.com/apps/docarite/installations/new";

const RepoRow = ({ repo }: { repo: GithubRepo }) => {
    const [isActive, setIsActive] = useState(repo.active);

    const handleToggle = () => {
        setIsActive(prevState => !prevState);
    };

    return (
        <TableRow>
            <TableCell className="font-medium">
                <div className="flex items-center gap-4">
                    <span>{repo.full_name}</span>
                    <span className={`py-0.5 px-2.5 text-xs font-semibold border rounded-full ${repo.private ? "bg-gray-100 text-gray-800 border-gray-300" : "bg-green-100 text-green-800 border-green-300"}`}>
                        {repo.private ? "Private" : "Public"}
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                    <FaGithub size={20} />
                </a>
            </TableCell>
            <TableCell>
                <button className="text-neutral-500 hover:text-neutral-900 transition-colors" aria-label="Settings">
                    <Bolt size={20} />
                </button>
            </TableCell>
            <TableCell>
                <Switch
                    id={`active-${repo.id}`}
                    checked={isActive}
                    onCheckedChange={handleToggle}
                    aria-label={`Activate ${repo.full_name}`}
                />
            </TableCell>
        </TableRow>
    );
};

const AddRepoButton = () => (
    <a href={GITHUB_APP_INSTALL_URL} className="px-5 h-[40px] rounded-md text-white bg-blue-600 hover:bg-blue-700 flex gap-2 items-center transition-colors shadow-sm">
        <CirclePlus size={16} />
        Add Repositories
    </a>
);

const EmptyState = () => (
    <div className="relative w-full flex flex-col items-center text-center p-10 sm:p-16 gap-6 rounded-lg border border-dashed border-neutral-300 bg-neutral-50">
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-[radial-gradient(ellipse_at_center,rgba(200,200,255,0.1),transparent)]" />
        <h3 className="text-xl font-semibold text-neutral-800">No Repositories Found</h3>
        <p className="text-neutral-600 max-w-md">
            Docarite currently doesn't have access to any repositories for this account. Please install the Docarite GitHub App and grant access to the repositories you want to work with.
        </p>
        <div className="mt-2">
            <AddRepoButton />
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
    </div>
);


export default function HomePage() {
    const [repos, setRepos] = useState<GithubRepo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchRepos = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const githubToken = session?.provider_token;

            if (!githubToken) {
                throw new Error("No GitHub token found. Please re-authenticate.");
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

            const repoPromises = installationsData.installations.map(async (installation: any) => {
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
            const allRepos = allReposArrays.flat().map((repo: any) => ({ ...repo, active: true }));

            setRepos(allRepos);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            console.error(err);
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