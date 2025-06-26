export interface GithubRepo {
    id: number;
    name: string;
    private?: boolean | null;
    github_url: string;
    active: boolean;
}