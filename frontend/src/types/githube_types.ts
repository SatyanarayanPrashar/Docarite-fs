// export interface GithubRepo_type {
//     id: number;
//     name: string;
//     private?: boolean | null;
//     github_url: string;
//     active: boolean;
//     preferences?: JSON | null;
// }

export interface RepoPreferences {
    reviewLanguage: string;
    automaticReview: boolean;
    automaticIncrementalReview: boolean;
    highLevelSummary: boolean;
    summaryInWalkthrough: boolean;
    changedFilesSummary: boolean;
    assessLinkedIssues: boolean;
    addLabels: boolean;
    autoApplyLabels: boolean;
    suggestedReviewers: boolean;
    autoAssignReviewers: boolean;
}

export interface GithubRepo_type {
    id: number;
    name: string;
    private?: boolean | null;
    github_url: string;
    active: boolean;
    early_adopter?: boolean;
    preferences?: Partial<RepoPreferences>;
}