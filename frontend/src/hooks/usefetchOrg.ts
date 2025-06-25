import { useEffect, useState } from "react";
import { GithubRepo } from "@/types/githube_types";

export const useOrganisation = (userEmail?: string | null) => {
    const [organisation, setOrganisation] = useState<any | null>(null);
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        fetchOrganisation();
    }, [userEmail]);

    return { organisation, repos, loading, error, refetch: fetchOrganisation };
};
