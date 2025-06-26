'use client';

import { useFetchRepository } from '@/hooks/useFetchRepository';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from '@/components/ui/switch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SettingPage() {
    const searchParams = useSearchParams();
    const repo_id = searchParams.get("id");
    const { repo, loading, error } = useFetchRepository(repo_id);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 sm:p-6 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-lg font-semibold text-zinc-600">Repository</p>
                    <h1 className="text-3xl font-bold text-zinc-900">{repo?.name}</h1>
                    <p className="text-sm text-neutral-500 mt-1">Configure the fetures for the pull request reviews.</p>
                </div>
            </header>
            <Tabs defaultValue="General" className="w-full">
                <TabsList>
                    <TabsTrigger value="General">General</TabsTrigger>
                    <TabsTrigger value="Preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="Knowledge Base">Knowledge Base </TabsTrigger>
                </TabsList>
                <TabsContent value="General" className='rounded-lg shadow border p-8'>
                    <div className="flex gap-3 justify-between items-center w-2/3">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Active</p>
                            <p className="text-zinc-600">Enable early-access features.</p>
                        </div>
                        <Switch
                            id={`active-${repo?.id}`}
                            checked={repo?.active || false}
                            aria-label={`Activate ${repo?.active}`}
                        />
                    </div>
                    <div className="flex gap-3 mt-8 justify-between items-center">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Review Language</p>
                            <p className="text-zinc-600">Natural language in which you want CodeRabbit to write the review.</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='border px-4 py-1 rounded-lg w-40'>English</DropdownMenuTrigger>
                            <DropdownMenuContent className='w-40'>
                                <DropdownMenuLabel>English</DropdownMenuLabel>
                                <DropdownMenuItem>French</DropdownMenuItem>
                                <DropdownMenuItem>Spanich</DropdownMenuItem>
                                <DropdownMenuItem>Hindi</DropdownMenuItem>
                                <DropdownMenuItem>Japanese</DropdownMenuItem>
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
                            checked={false}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="Preferences" className='rounded-lg shadow border p-8'>
                    {/* Automatic Review */}
                    <div className="flex gap-3 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Automatic Review</p>
                            <p className="text-zinc-600">Automatic Code Review on PR raise</p>
                        </div>
                        <Switch
                            id="automatic-review"
                            checked={true}
                            aria-label="Automatic Review"
                        />
                    </div>

                    {/* Automatic Incremental Review */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Automatic Incremental Review</p>
                            <p className="text-zinc-600">Automatic incremental code review on each push</p>
                        </div>
                        <Switch
                            id="automatic-incremental-review"
                            checked={true}
                            aria-label="Automatic Incremental Review"
                        />
                    </div>

                    {/* Request Changes Workflow */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Request Changes Workflow</p>
                            <p className="text-zinc-600">Approve the review once CodeRabbit's comments are resolved. Note: In GitLab, all discussions must be resolved.</p>
                        </div>
                        <Switch
                            id="request-changes-workflow"
                            checked={true}
                            aria-label="Request Changes Workflow"
                        />
                    </div>

                    {/* High Level Summary */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">High Level Summary</p>
                            <p className="text-zinc-600">Generate a high level summary of the changes in the PR/MR description.</p>
                        </div>
                        <Switch
                            id="high-level-summary"
                            checked={true}
                            aria-label="High Level Summary"
                        />
                    </div>

                    {/* High Level Summary In Walkthrough */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">High Level Summary In Walkthrough</p>
                            <p className="text-zinc-600">Include the high level summary in the walkthrough comment.</p>
                        </div>
                        <Switch
                            id="summary-in-walkthrough"
                            checked={false}
                            aria-label="High Level Summary In Walkthrough"
                        />
                    </div>

                    {/* Changed Files Summary */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Changed Files Summary</p>
                            <p className="text-zinc-600">Generate a summary of the changed files in the walkthrough.</p>
                        </div>
                        <Switch
                            id="changed-files-summary"
                            checked={true}
                            aria-label="Changed Files Summary"
                        />
                    </div>

                    {/* Sequence Diagrams */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Sequence Diagrams</p>
                            <p className="text-zinc-600">Generate sequence diagrams in the walkthrough.</p>
                        </div>
                        <Switch
                            id="sequence-diagrams"
                            checked={true}
                            aria-label="Sequence Diagrams"
                        />
                    </div>

                    {/* Assess Linked Issues */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Assess Linked Issues</p>
                            <p className="text-zinc-600">Generate an assessment of how well the changes address the linked issues in the walkthrough.</p>
                        </div>
                        <Switch
                            id="assess-linked-issues"
                            checked={true}
                            aria-label="Assess Linked Issues"
                        />
                    </div>

                    {/* Related Issues */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Related Issues</p>
                            <p className="text-zinc-600">Include possibly related issues in the walkthrough.</p>
                        </div>
                        <Switch
                            id="related-issues"
                            checked={false}
                            aria-label="Related Issues"
                        />
                    </div>

                    {/* Related PRs */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Related PRs</p>
                            <p className="text-zinc-600">Include possibly related pull requests in the walkthrough.</p>
                        </div>
                        <Switch
                            id="related-prs"
                            checked={false}
                            aria-label="Related PRs"
                        />
                    </div>

                    {/* Suggested Labels */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Suggested Labels</p>
                            <p className="text-zinc-600">Suggest labels based on the changes in the pull request in the walkthrough.</p>
                        </div>
                        <Switch
                            id="suggested-labels"
                            checked={true}
                            aria-label="Suggested Labels"
                        />
                    </div>

                    {/* Auto Apply Labels */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Auto Apply Labels</p>
                            <p className="text-zinc-600">Automatically apply the suggested labels to the PR/MR.</p>
                        </div>
                        <Switch
                            id="auto-apply-labels"
                            checked={false}
                            aria-label="Auto Apply Labels"
                        />
                    </div>

                    {/* Suggested Reviewers */}
                    <div className="flex gap-3 mt-6 justify-between items-center border-b pb-6">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Suggested Reviewers</p>
                            <p className="text-zinc-600">Suggest reviewers based on the changes in the pull request in the walkthrough.</p>
                        </div>
                        <Switch
                            id="suggested-reviewers"
                            checked={true}
                            aria-label="Suggested Reviewers"
                        />
                    </div>

                    {/* Auto Assign Reviewers */}
                    <div className="flex gap-3 mt-6 justify-between items-center">
                        <div>
                            <p className="text-md font-semibold text-zinc-900">Auto Assign Reviewers</p>
                            <p className="text-zinc-600">Automatically assign suggested reviewers to the pull request.</p>
                        </div>
                        <Switch
                            id="auto-assign-reviewers"
                            checked={false}
                            aria-label="Auto Assign Reviewers"
                        />
                    </div>
                </TabsContent>
                <TabsContent value="Knowledge Base" className='rounded-lg shadow border p-8'>
                    <p className="text-lg font-semibold text-zinc-800">Coming Soon</p>
                    <div className="flex gap-3 mt-5 justify-between items-center w-1/2">
                        <p className="text-zinc-700">Become early adopter </p>
                        <Switch
                            id='early-adopter'
                            checked={false}
                        />
                    </div>
                    <p className="text-zinc-700 mt-5">Docarite bot is evolving daily, soon he will become codebase aware. </p>
                    <p className="text-zinc-700 text-balance">With the upcoming Knowledge Base feature, Docarite will understand the full context of your codebase — not just the files in a pull request. This means smarter suggestions, deeper impact analysis, and early detection of changes that could break things elsewhere. It&apos;s like giving your PR reviewer full project memory.</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
