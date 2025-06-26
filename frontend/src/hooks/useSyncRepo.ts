import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface GithubRepoProps {
    organisation: any;
    repos: any[];
    refetch: () => void;
}

export const useSyncGitHubRepos = ({ organisation, repos, refetch }: GithubRepoProps) => {
    const router = useRouter();
    const [isSyncing, setIsSyncing] = useState(false);

    const startSync = async (installationId: string | null) => {
        if (!installationId || !organisation?.id || repos === undefined) {
            console.error("Sync cannot start: missing required data.");
            return;
        }
        console.log("Syncing repositories for installation:", installationId, "with organisation:", organisation.id, "and repos:", repos.length);

        setIsSyncing(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.provider_token) throw new Error("GitHub provider token not found.");

            const reposRes = await fetch(
                `https://api.github.com/user/installations/${installationId}/repositories`,
                {
                    headers: {
                        Authorization: `Bearer ${session.provider_token}`,
                        Accept: "application/vnd.github.v3+json"
                    }
                }
            );
            if (!reposRes.ok) throw new Error("Failed to fetch repositories from GitHub.");
            
            const { repositories: githubRepos } = await reposRes.json();
            const existingRepoNames = new Set(repos.map(r => r.name));
            const newRepo = githubRepos.find((repo: any) => !existingRepoNames.has(repo.name));

            if (!newRepo) {
                console.log("No new repositories to add.");
                router.push("/home/repositories");
                return;
            }

            const postRes = await fetch("http://127.0.0.1:8000/api/repository/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    github_url: newRepo.html_url,
                    name: newRepo.name,
                    installation_id: installationId,
                    organisation: organisation.id,
                    active: true,
                    preferences: {}
                })
            });
            if (!postRes.ok) {
                const errData = await postRes.json();
                throw new Error(`Failed to save new repository: ${JSON.stringify(errData)}`);
            }
            
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