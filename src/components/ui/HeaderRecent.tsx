import { useEffect, useRef, useState, FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { getAllWorkspaces, makeWorkspaceFavorite, makeWorkspaceNotFavorite } from "@/api/workspaceRequests";
import { toast } from "react-toastify";
import { setWorkspaces } from "@/lib/workspaces/workspacesSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface WorkspaceCardProps {
    workspace: WorkspaceType
}

export const WorkspaceCardWithStar: FC<WorkspaceCardProps> = ({ workspace }) => {
    const dispatch = useAppDispatch()
    const { data: workspaces } = useQuery({
        queryKey: ["workspaces"],
        queryFn: getAllWorkspaces
    })
    const queryClient = useQueryClient();

    const makeWorkspaceFovoriteHandler = async (workspaceId: number) => {
        const res = await makeWorkspaceFavorite(workspaceId)
        if (res.status === 202) {
            toast.success("Workspace set as favorite");
            const newWorkspaces = workspaces?.data.map((workspace: WorkspaceType) => {
                if (workspace.id !== res.data.id)
                    return workspace
                return res.data;
            })
            const newQueryState = {
                data: [...newWorkspaces]
            }
            queryClient.setQueryData(["workspaces"], newQueryState)
        }
    }

    const makeWorkspaceNotFovoriteHandler = async (workspaceId: number) => {
        const res = await makeWorkspaceNotFavorite(workspaceId)
        if (res.status === 202) {
            toast.success("Workspace no longer favorite");
            const newWorkspaces = workspaces?.data.map((workspace: WorkspaceType) => {
                if (workspace.id !== res.data.id)
                    return workspace
                return res.data;
            })
            const newQueryState = {
                data: [...newWorkspaces]
            }
            queryClient.setQueryData(["workspaces"], newQueryState)
        }
    }

    return <Link onClick={() => localStorage.setItem("currentWorkspace", workspace?.id?.toString())} href={`/workspace/${workspace.id}`} className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
        <div className="h-8 w-10 rounded flex items-center justify-center text-xl font-semibold capitalize text-white" style={{ backgroundColor: workspace?.color }}>
            {workspace.name.charAt(0)}
        </div>
        <div className="flex justify-between w-full items-center">
            <div className="flex flex-col">
                <span>
                    {workspace?.name}
                </span>
                <span className="text-xs font-normal">
                    <span className="capitalize">
                        {workspace.owner.username}
                    </span>
                    's Workspace
                </span>
            </div>
            {
                workspace.is_favorite ? <FaStar
                    onClick={() => makeWorkspaceNotFovoriteHandler(workspace?.id)}
                    className="w-5 h-5 text-yellow-400"
                /> : <FaRegStar
                    onClick={() => makeWorkspaceFovoriteHandler(workspace?.id)}
                    className="w-5 h-5"
                />
            }
        </div>
    </Link>
}

interface ComponentProps {
    display: boolean;
    closeAll: () => void;
    toggleSingleTab: (tab: string) => void;
}

const HeaderRecent: FC<ComponentProps> = ({ closeAll, display, toggleSingleTab }) => {
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const { data: workspaces } = useQuery({
        queryKey: ["workspaces"],
        queryFn: getAllWorkspaces
    })


    const handleClick = (e: MouseEvent) => {
        const clickedElement = e.target as Node;

        if (
            optionsRef.current &&
            !optionsRef.current.contains(clickedElement) &&
            displayerRef.current &&
            !displayerRef.current.contains(clickedElement) &&
            display
        ) {
            closeAll();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [display]);

    return (
        <div className="relative">
            <div
                ref={displayerRef}
                onClick={() => toggleSingleTab("recent")}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded relative ${display ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>Recent</span>
                <IoIosArrowDown />
            </div>
            {display && (
                <div ref={optionsRef} className="absolute top-6 sm:top-10 rounded-lg -left-20 sm:left-0 w-72 max-h-96 overflow-y-auto bg-background p-2 shadow-lg">
                    <div className="flex flex-col gap-2">
                        {
                            workspaces?.data?.map((workspace: WorkspaceType) => <WorkspaceCardWithStar key={workspace?.id} workspace={workspace} />)
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderRecent;
