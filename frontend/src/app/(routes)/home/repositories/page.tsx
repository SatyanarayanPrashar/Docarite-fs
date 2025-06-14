"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CirclePlus, Bolt } from "lucide-react"
import { FaGithub } from "react-icons/fa"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

export default function HomePage() {
    const [repos, setRepos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRepos = async () => {
            setLoading(true)

            const { data: { session } } = await supabase.auth.getSession()
            const githubToken = session?.provider_token || ""

            if (!githubToken) {
                console.warn("No GitHub token found.")
                setLoading(false)
                return
            }

            const installationsRes = await fetch("https://api.github.com/user/installations", {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: "application/vnd.github+json"
                }
            })

            const installationsData = await installationsRes.json()
            const allRepos: any[] = []

            for (const installation of installationsData.installations || []) {
                const reposRes = await fetch(`https://api.github.com/user/installations/${installation.id}/repositories`, {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        Accept: "application/vnd.github+json"
                    }
                })

                const reposData = await reposRes.json()
                allRepos.push(...(reposData.repositories || []))
            }
            console.log("Fetched repository:", allRepos[0])

            setRepos(allRepos)
            setLoading(false)
        }

        fetchRepos()
    }, [])

    return (
        <div className="flex w-full flex-col gap-10 p-4 px-10">
            <div className="flex justify-between">
                <div>
                    <p className="text-3xl">Repositories</p>
                    <p className="text-sm text-neutral-500">List of repositories accessible to Docarite.</p>
                </div>
                <a href="https://github.com/apps/docarite/installations/new" className="px-5 h-[37px] rounded-md text-white bg-blue-500 flex gap-2 items-center ">
                    <CirclePlus size={15} />
                    Add Repositories
                </a>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading repositories...</p>
            ) : repos.length === 0 ? (
                <div className="relative w-full h-full flex flex-col items-center p-12 gap-6 justify-between rounded-lg border border-blue-200/20 backdrop-blur-[10px] bg-gradient-to-b from-blue-200/20 to-blue-100/5 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none rounded-lg bg-[radial-gradient(ellipse_at_top_left,rgba(173,216,230,0.2),transparent)]" />
                    <p className="text-xl">Docarite currently doesn't have access to repositories for this account.</p>
                    <a href="https://github.com/apps/docarite/installations/new" className="px-5 h-[37px] rounded-md text-white bg-blue-600 flex gap-2 items-center ">
                        <CirclePlus size={15} />
                        Add Repositories
                    </a>
                    <p className="text-neutral-600 text-center">Install Docarite on your GitHub account and grant access <br /> to the repositories you want to work with.</p>
                </div>
            ) : (
                <Table >
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-full">Repository</TableHead>
                            <TableHead className="w-full">Visit</TableHead>
                            <TableHead className="w-full">Settings</TableHead>
                            <TableHead className="w-full">Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {repos.map((repo, i) => (
                            <TableRow key={i} className="mx-10">
                                <TableCell className="font-medium text-md flex items-center">
                                    {repo.full_name.split("/")[1]}
                                    {repo.private 
                                        ? <div className="flex items-center py-[1px] text-[12px] px-2 font-light border rounded-full ml-4 bg-gray-100">private</div>
                                        : <div className="flex items-center py-[1px] text-[12px] px-2 font-light border rounded-full ml-4 bg-gray-100">public</div>
                                    }
                                </TableCell>
                                <TableCell><a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 text-lg"> <FaGithub/>  </a></TableCell>
                                <TableCell className="text-neutral-600 text-lg"> <Bolt/> </TableCell>
                                <TableCell className="text-neutral-600 text-lg">
                                    <Switch id="active"checked={true} onCheckedChange={()=>{}}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
