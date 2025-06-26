import { GithubRepo_type } from "./githube_types";

export interface Organisation_type {
    id: number;
    name: string;
    email?: string;
    website?: string;
    created_at?: Date;
    updated_at?: Date;
    repositories?: GithubRepo_type[];
}