"use client"
import { getAllWorkspaces, getSingleWorkspace } from "@/api/workspaceRequests"
import { setCurrentWorkspace } from "@/lib/currentWorkspace/currentWorkspaceSlice"
import { useAppDispatch } from "@/lib/hooks"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

function Page({ params }: { params: { slug: string } }) {

    return <main className="flex h-full items-center justify-between">
        {params.slug}settings
    </main>
}

export default Page