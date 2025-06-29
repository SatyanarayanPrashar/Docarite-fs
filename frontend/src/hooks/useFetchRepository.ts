import { useEffect, useState } from "react";
import { GithubRepo_type } from "@/types/githube_types";

export const useFetchRepository = (repo_id : string | null) => {
    const [repo, setRepo] = useState<GithubRepo_type>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrganisation = async () => {
            if (!repo_id) return;
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/repository/${repo_id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        return;
                    }
                    throw new Error("Failed to fetch organisation data.");
                }

                const data = await response.json();
                setRepo(data);
            } catch (err) {
                console.error("Repository fetch error:", err);
                setError(err instanceof Error ? err.message : "Unexpected error");
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrganisation();
    }, [repo_id]);
    
    return { repo, loading, error };
};
