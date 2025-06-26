import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Organisation_type } from "@/types/model_types";
import { GithubRepo_type } from "@/types/githube_types";

interface GithubRepoProps {
    organisation: Organisation_type | null;
}

export const useSyncGitHubRepos = ({ organisation}: GithubRepoProps) => {
    const router = useRouter();
    const [isSyncing, setIsSyncing] = useState(false);

    const startSync = async (installationId: string | null) => {
        if (!installationId || !organisation?.id) {
            console.error("Sync cannot start: missing installation ID or organisation.");
            return;
        }

        setIsSyncing(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const githubToken = session?.provider_token;

            if (!githubToken) throw new Error("GitHub provider token not found.");

            const githubRes = await fetch(
                `https://api.github.com/user/installations/${installationId}/repositories`,
                {
                    headers: {
                        Authorization: `Bearer ${githubToken}`,
                        Accept: "application/vnd.github.v3+json"
                    }
                }
            );

            if (!githubRes.ok) throw new Error("Failed to fetch GitHub repositories");

            const { repositories: githubRepos } = await githubRes.json();

            // Format data as required
            const installedRepos = githubRepos.map((repo: GithubRepo_type) => ({
                github_url: repo.github_url,
                name: repo.name,
                installation_id: installationId,
                organisation: organisation.id,
                active: true
            }));

            const payload = {
                organisation_id: organisation.id,
                installed_repos: installedRepos
            };

            const postRes = await fetch("http://127.0.0.1:8000/api/sync_repository/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!postRes.ok) {
                const errData = await postRes.json();
                throw new Error(`Failed to sync repositories: ${JSON.stringify(errData)}`);
            }

            router.push("/home/repositories");
        } catch (err) {
            console.error("Repository sync failed:", err);
        } finally {
            setIsSyncing(false);
        }
    };

    return { isSyncing, startSync };
};
