"use client";

import useSWR from "swr";
import { GithubRepo_type } from "@/types/githube_types";
import { Organisation_type } from "@/types/model_types";

// Fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      return { organisations: [], repositories: [] }; // Treat 404 as valid empty response
    }
    throw new Error("Failed to fetch organisation data.");
  }
  return response.json();
};

// Hook using SWR
export const useOrganisation = (userEmail?: string | null, refetchKey = 0) => {
  const shouldFetch = !!userEmail;

  const url = shouldFetch
    ? `http://127.0.0.1:8000/api/user_org_repo/list/by-email/?email=${encodeURIComponent(
        userEmail
      )}&refetchKey=${refetchKey}` // refetchKey added to URL to trigger refetch
    : null;

  const { data, error, isLoading } = useSWR(url, fetcher, {revalidateOnFocus: false});

  const organisation: Organisation_type | null = data?.organisations?.[0] ?? null;
  const repos: GithubRepo_type[] = data?.repositories ?? [];

  return {
    organisation,
    repos,
    loading: isLoading,
    error: error ? error.message : null,
  };
};
