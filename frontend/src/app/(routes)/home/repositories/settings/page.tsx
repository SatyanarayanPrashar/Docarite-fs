'use client';

import { useFetchRepository } from '@/hooks/useFetchRepository';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GithubRepo_type, RepoPreferences } from '@/types/githube_types';

const defaultPreferences: RepoPreferences = {
    reviewLanguage: 'English',
    automaticReview: true,
    automaticIncrementalReview: true,
    highLevelSummary: true,
    summaryInWalkthrough: false,
    changedFilesSummary: true,
    assessLinkedIssues: true,
    addLabels: true,
    autoApplyLabels: false,
    suggestedReviewers: true,
    autoAssignReviewers: false,
};

export default function SettingPage() {
    const searchParams = useSearchParams();
    const repo_id = searchParams.get("id");
    const { repo: initialRepo, loading, error } = useFetchRepository(repo_id);

    const [repo, setRepo] = useState<Partial<GithubRepo_type>>({});
    const [preferences, setPreferences] = useState<Partial<RepoPreferences>>(defaultPreferences);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialRepo) {
            setRepo(initialRepo);
            setPreferences({ ...defaultPreferences, ...initialRepo.preferences });
        }
    }, [initialRepo]);

    const handleSwitchChange = (key: keyof RepoPreferences, value: boolean) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleTopLevelSwitchChange = (key: keyof GithubRepo_type, value: boolean) => {
        setRepo(prev => ({ ...prev, [key]: value }));
    }

    const handleLanguageChange = (language: string) => {
        setPreferences(prev => ({ ...prev, reviewLanguage: language }));
    };

    const handleSaveChanges = async () => {
        if (!repo_id) return;
        setIsSaving(true);
        try {
            const updatedData = {
                active: repo.active,
                early_adopter: repo.early_adopter,
                preferences: preferences,
            };
            const updatedRepo = await updateRepository(repo_id, JSON.stringify(updatedData));
            setRepo(updatedRepo);
            setPreferences({ ...defaultPreferences, ...updatedRepo.preferences });
        } catch (err: any) {
        } finally {
            setIsSaving(false);
        }
    };

    const updateRepository = async (repoId: string, data: string) => {
        const response = await fetch(`http://127.0.0.1:8000/api/repository/${repoId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update repository');
        }

        return response.json();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 sm:p-6 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-lg font-semibold text-zinc-600">Repository</p>
                    <h1 className="text-3xl font-bold text-zinc-900">{repo?.name}</h1>
                    <p className="text-sm text-neutral-500 mt-1">Configure the features for the pull request reviews.</p>
                </div>
                <Button className='bg-blue-600 hover:bg-blue-800 hover:cursor-pointer' onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </header>
            <Tabs defaultValue="General" className="w-full">
                <TabsList>
                    <TabsTrigger value="General">General</TabsTrigger>
                    <TabsTrigger value="Preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="Knowledge Base">Knowledge Base</TabsTrigger>
                </TabsList>
                <TabsContent value="General" className='rounded-lg shadow border p-8'>
                    <div className="flex gap-3 justify-between items-center w-2/3">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Active</p>
                            <p className="text-zinc-600">Enable Docarite for this repository.</p>
                        </div>
                        <Switch
                            id={`active-${repo?.id}`}
                            checked={repo?.active || false}
                            onCheckedChange={(value) => handleTopLevelSwitchChange('active', value)}
                            aria-label={`Activate ${repo?.name}`}
                        />
                    </div>
                    <div className="flex gap-3 mt-8 justify-between items-center">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Review Language</p>
                            <p className="text-zinc-600">Natural language for CodeRabbit to write the review in.</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='border px-4 py-1 rounded-lg w-40'>{preferences?.reviewLanguage || 'English'}</DropdownMenuTrigger>
                            <DropdownMenuContent className='w-40'>
                                {['English', 'French', 'Spanish', 'Hindi', 'Japanese'].map(lang => (
                                     <DropdownMenuItem key={lang} onSelect={() => handleLanguageChange(lang)}>{lang}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex gap-3 mt-8 justify-between items-center w-2/3">
                         <div>
                             <p className="text-md font-semibold text-zinc-900">Early Access</p>
                             <p className="text-zinc-600">Enable early-access features.</p>
                         </div>
                         <Switch
                             id='early-adopter'
                             checked={repo?.early_adopter || false}
                             onCheckedChange={(value) => handleTopLevelSwitchChange('early_adopter', value)}
                         />
                     </div>
                </TabsContent>
                <TabsContent value="Preferences" className='rounded-lg shadow border p-8'>
                    <div className="flex gap-3 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Automatic Review</p>
                            <p className="text-zinc-600">Automatic Code Review on PR raise</p>
                            <p className="text-zinc-600 text-sm">If disabled, use tag "@docarite" in the PR description.</p>
                        </div>
                        <Switch
                            id="automatic-review"
                            checked={preferences?.automaticReview || false}
                            onCheckedChange={(value) => handleSwitchChange('automaticReview', value)}
                            aria-label="Automatic Review"
                        />
                    </div>
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                         <div>
                             <p className="text-md font-semibold text-zinc-900">Automatic Incremental Review</p>
                             <p className="text-zinc-600">Automatic incremental code review on each push.</p>
                             <p className="text-zinc-600 text-sm">On pushing a new commit, Docarite will check if objectives were achieved.</p>
                         </div>
                         <Switch
                             id="automatic-incremental-review"
                             checked={preferences?.automaticIncrementalReview || false}
                             onCheckedChange={(value) => handleSwitchChange('automaticIncrementalReview', value)}
                             aria-label="Automatic Incremental Review"
                         />
                     </div>
                     <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                         <div>
                             <p className="text-md font-semibold text-zinc-900">High Level Summary</p>
                             <p className="text-zinc-600">Generate a high-level summary of changes in the PR description.</p>
                         </div>
                         <Switch
                             id="high-level-summary"
                             checked={preferences?.highLevelSummary || false}
                             onCheckedChange={(value) => handleSwitchChange('highLevelSummary', value)}
                             aria-label="High Level Summary"
                         />
                     </div>
                     <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">High Level Summary In Walkthrough</p>
                            <p className="text-zinc-600">Include the high level summary in the walkthrough comment.</p>
                        </div>
                        <Switch
                            id="summary-in-walkthrough"
                            checked={preferences?.summaryInWalkthrough || false}
                            onCheckedChange={(value) => handleSwitchChange('summaryInWalkthrough', value)}
                            aria-label="High Level Summary In Walkthrough"
                        />
                    </div>
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Changed Files Summary</p>
                            <p className="text-zinc-600">Generate a summary of the changed files in the walkthrough.</p>
                        </div>
                        <Switch
                            id="changed-files-summary"
                            checked={preferences?.changedFilesSummary || false}
                            onCheckedChange={(value) => handleSwitchChange('changedFilesSummary', value)}
                            aria-label="Changed Files Summary"
                        />
                    </div>
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Assess Linked Issues</p>
                            <p className="text-zinc-600">Generate an assessment of how well the changes address linked issues.</p>
                             <p className="text-zinc-600 text-sm">Note: Tag the linked issue like "Issue: #20" in the PR description.</p>
                        </div>
                        <Switch
                            id="assess-linked-issues"
                            checked={preferences?.assessLinkedIssues || false}
                            onCheckedChange={(value) => handleSwitchChange('assessLinkedIssues', value)}
                            aria-label="Assess Linked Issues"
                        />
                    </div>
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                         <div>
                             <p className="text-md font-semibold text-zinc-900">Add Labels</p>
                             <p className="text-zinc-600">Add labels to the title, based on changes and linked issues.</p>
                         </div>
                         <Switch
                             id="add-labels"
                             checked={preferences?.addLabels || false}
                             onCheckedChange={(value) => handleSwitchChange('addLabels', value)}
                             aria-label="Add Labels"
                         />
                     </div>
                     <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Auto Apply Labels</p>
                            <p className="text-zinc-600">Automatically apply the suggested labels to the PR/MR.</p>
                        </div>
                        <Switch
                            id="auto-apply-labels"
                            checked={preferences?.autoApplyLabels || false}
                            onCheckedChange={(value) => handleSwitchChange('autoApplyLabels', value)}
                            aria-label="Auto Apply Labels"
                        />
                    </div>
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Suggested Reviewers</p>
                            <p className="text-zinc-600">Suggest reviewers based on the changes in the pull request.</p>
                        </div>
                        <Switch
                            id="suggested-reviewers"
                            checked={preferences?.suggestedReviewers || false}
                            onCheckedChange={(value) => handleSwitchChange('suggestedReviewers', value)}
                            aria-label="Suggested Reviewers"
                        />
                    </div>
                    <div className="flex gap-3 mt-6 justify-between items-center">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Auto Assign Reviewers</p>
                            <p className="text-zinc-600">Automatically assign suggested reviewers to the pull request.</p>
                        </div>
                        <Switch
                            id="auto-assign-reviewers"
                            checked={preferences?.autoAssignReviewers || false}
                            onCheckedChange={(value) => handleSwitchChange('autoAssignReviewers', value)}
                            aria-label="Auto Assign Reviewers"
                        />
                    </div>
                </TabsContent>
                <TabsContent value="Knowledge Base" className='rounded-lg shadow border p-8'>
                     <p className="text-lg font-semibold text-zinc-800">Coming Soon</p>
                     <div className="flex gap-3 mt-5 justify-between items-center w-1/2">
                         <p className="text-zinc-700">Become an early adopter</p>
                         <Switch
                             id='kb-early-adopter'
                             checked={repo?.early_adopter || false}
                             onCheckedChange={(value) => handleTopLevelSwitchChange('early_adopter', value)}
                         />
                     </div>
                     <p className="text-zinc-700 mt-5">Docarite bot is evolving daily; soon, he will become codebase aware.</p>
                     <p className="text-zinc-700 text-balance">With the upcoming Knowledge Base feature, Docarite will understand the full context of your codebase — not just the files in a pull request. This means smarter suggestions, deeper impact analysis, and early detection of changes that could break things elsewhere. It's like giving your PR reviewer full project memory.</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
