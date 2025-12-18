import { useState } from "react";
import { Organisation_type } from "@/types/model_types";

interface GithubRepoProps {
    organisation: Organisation_type | null;
    onSyncSuccess?: () => void;
}

interface Github_response {
    id: number;
    name: string;
    html_url: string;
    active: boolean;
}

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export const useSyncGitHubRepos = ({ organisation, onSyncSuccess }: GithubRepoProps) => {
    const [isSyncing, setIsSyncing] = useState(false);

    const startSync = async (installationId: string | null) => {
        if (!installationId || !organisation?.id) {
            console.error("Sync cannot start: missing installation ID or organisation.");
            return;
        }

        setIsSyncing(true);

        try {
            // FIX: Read the token from the cookie we set in the callback
            const githubToken = getCookie('gh_provider_token');

            if (!githubToken) {
                console.error("Token missing. Please try logging out and logging back in.");
                throw new Error("GitHub provider token not found in cookies.");
            }

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
            const installedRepos = githubRepos.map((repo: Github_response) => ({
                github_url: repo.html_url,
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
            
            // Trigger refetch in parent
            onSyncSuccess?.();
        } catch (err) {
            console.error("Repository sync failed:", err);
        } finally {
            setIsSyncing(false);
        }
    };

    return { isSyncing, startSync };
};