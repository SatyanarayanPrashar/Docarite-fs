import { useEffect, useState } from "react";
import { GithubRepo_type } from "@/types/githube_types";
import { Organisation_type } from "@/types/model_types";

export const useOrganisation = (userEmail?: string | null, refetchKey = 0) => {
    const [organisation, setOrganisation] = useState<Organisation_type | null>(null);
    const [repos, setRepos] = useState<GithubRepo_type[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrganisation = async () => {
            if (!userEmail) return;
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/user_org_repo/list/by-email/?email=${encodeURIComponent(userEmail)}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setOrganisation(null);
                        setRepos([]);
                        return;
                    }
                    throw new Error("Failed to fetch organisation data.");
                }

                const data = await response.json();
                if (data.organisations?.length > 0) {
                    setOrganisation(data.organisations[0]);
                    setRepos(data.repositories || []);
                } else {
                    setOrganisation(null);
                    setRepos([]);
                }
            } catch (err) {
                console.error("Organisation fetch error:", err);
                setError(err instanceof Error ? err.message : "Unexpected error");
            } finally {
                setLoading(false);
            }
        };

        fetchOrganisation();
    }, [userEmail, refetchKey]);

    return { organisation, repos, loading, error };
};
