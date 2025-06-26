import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface GithubRepoProps {
    organisation: any;
    repos: any[];
    refetch: () => void;
}

interface RepoInput {
    github_url: string;
    name: string;
    installation_id: string;
    organisation: number;
    active: boolean;
    preferences: object;
}

// --- Fetch GitHub token from Supabase session ---
const getGitHubToken = async (): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.provider_token;
    if (!token) throw new Error("GitHub provider token not found.");
    return token;
};

// --- Fetch all repositories for the given installation ---
const fetchGitHubRepos = async (installationId: string, token: string) => {
    const res = await fetch(
        `https://api.github.com/user/installations/${installationId}/repositories`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json"
            }
        }
    );
    if (!res.ok) throw new Error("Failed to fetch repositories from GitHub.");
    const { repositories } = await res.json();
    return repositories;
};

// --- Identify which GitHub repos are not already in your DB ---
const findNewRepos = (githubRepos: any[], existingRepos: any[], installationId: string, orgId: number): RepoInput[] => {
    const existingNames = new Set(existingRepos.map(repo => repo.name));
    return githubRepos
        .filter(repo => !existingNames.has(repo.name))
        .map(repo => ({
            github_url: repo.html_url,
            name: repo.name,
            installation_id: installationId,
            organisation: orgId,
            active: true,
            preferences: {}
        }));
};

// --- Send new repos to your backend in bulk ---
const syncReposToDatabase = async (reposToSync: RepoInput[]) => {
    const res = await fetch("http://127.0.0.1:8000/api/repository/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reposToSync)
    });
    if (!res.ok) {
        const errData = await res.json();
        throw new Error(`Failed to sync repositories: ${JSON.stringify(errData)}`);
    }
};

export const useSyncGitHubRepos = ({ organisation, repos, refetch }: GithubRepoProps) => {
    const router = useRouter();
    const [isSyncing, setIsSyncing] = useState(false);

    const startSync = async (installationId: string | null) => {
        if (!installationId || !organisation?.id || !Array.isArray(repos)) {
            console.error("Sync cannot start: missing required data.");
            return;
        }

        setIsSyncing(true);
        try {
            const token = await getGitHubToken();
            const githubRepos = await fetchGitHubRepos(installationId, token);
            const newRepos = findNewRepos(githubRepos, repos, installationId, organisation.id);

            if (newRepos.length === 0) {
                console.log("No new repositories to sync.");
                router.push("/home/repositories");
                return;
            }

            await syncReposToDatabase(newRepos);
            console.log(`${newRepos.length} repositories synced.`);
            refetch();
            router.push("/home/repositories");

        } catch (err) {
            console.error("Repository sync failed:", err);
        } finally {
            setIsSyncing(false);
        }
    };

    return { isSyncing, startSync };
};
