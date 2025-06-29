"use client"

import * as React from "react"
import { Bolt } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Switch } from "./switch"
import { GithubRepo_type } from "@/types/githube_types"
import Link from "next/link"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto border rounded-md"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-color text-[15px]",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-[15px] py-2 px-5 text-foreground h-12 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-5 py-2 text-[15px] align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

const RepoRow = ({ repo }: { repo: GithubRepo_type }) => {
  const [isActive, setIsActive] = useState(repo.active);

  const handleToggle = () => {
      setIsActive(prevState => !prevState);
  };

  return (
      <TableRow>
          <TableCell className="font-medium">
              <div className="flex items-center gap-4">
                  <span>{repo.name}</span>
                  <span className={`py-0.5 px-2.5 text-xs font-semibold border rounded-full ${repo.private ? "bg-gray-100 text-gray-800 border-gray-300" : "bg-green-100 text-green-800 border-green-300"}`}>
                      {repo.private ? "Private" : "Public"}
                  </span>
              </div>
          </TableCell>
          <TableCell>
              <a href={repo.github_url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  <FaGithub size={20} />
              </a>
          </TableCell>
          <TableCell>
              <Link href={`/home/repositories/settings?id=${repo.id}`} className="text-neutral-500 hover:text-neutral-900 transition-colors" aria-label="Settings">
                  <Bolt size={20} />
              </Link>
          </TableCell>
          <TableCell>
              <Switch
                  id={`active-${repo.id}`}
                  checked={isActive}
                  onCheckedChange={handleToggle}
                  aria-label={`Activate ${repo.active}`}
              />
          </TableCell>
      </TableRow>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  RepoRow
}
