import { FC, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { getAllWorkspaces } from "@/api/workspaceRequests";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setWorkspaces } from "@/lib/workspaces/workspacesSlice";
import { setCurrentWorkspace } from "@/lib/currentWorkspace/currentWorkspaceSlice";
import { useQuery } from "@tanstack/react-query";

interface WorkspaceCardProps {
    workspace: WorkspaceType
}

const WorkspaceCard: FC<WorkspaceCardProps> = ({ workspace }) => {
    return <div className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
        <div className="h-10 w-10 rounded flex items-center justify-center" style={{ backgroundColor: workspace?.color }}>
            <span className="uppercase text-white">{workspace?.name?.slice(0, 1)}</span>
        </div>
        <div>
            {workspace?.name}
        </div>
    </div>
}

interface ComponentProps {
    display: boolean;
    closeAll: () => void;
    toggleSingleTab: (tab: string) => void;
}

const HeaderRooms: FC<ComponentProps> = ({ display, closeAll, toggleSingleTab }) => {
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const { data: workspaces, isLoading } = useQuery({
        queryKey: ["workspaces"],
        queryFn: getAllWorkspaces
    })
    const currentWorkspace = useAppSelector(state => state.currentWorkspace.id ? state.currentWorkspace : null)

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
        if (workspaces){
            const currentWorkspaceId = localStorage.getItem("currentWorkspaceId")
            console.log("RURURURURU", currentWorkspaceId, workspaces.data)
            const currentWorkspace = workspaces?.data.find((workspace: WorkspaceType) => workspace.id.toString() === currentWorkspaceId)
            if (currentWorkspace){
                dispatch(setCurrentWorkspace(currentWorkspace))
            }
        }
    }, [workspaces])

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [display]); // Empty dependency array, runs only once after mount

    useEffect(() => {
        console.log("WOOOOOOO", workspaces)
    }, [workspaces])

    return (
        workspaces &&
        <div className="relative">
            <div
                ref={displayerRef}
                onClick={() => toggleSingleTab("rooms")}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded relative ${display ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>Workspaces</span>
                <IoIosArrowDown />
            </div>
            {display && (
                <div ref={optionsRef} className="absolute top-6 sm:top-10 -left-20 sm:left-0 w-80 rounded-lg shadow-lg p-2 bg-background">
                    {
                        currentWorkspace &&
                        <div >
                            <span className="text-xs ml-2">Current Workspace</span>
                            <WorkspaceCard key={currentWorkspace?.id} workspace={currentWorkspace} />
                        </div>
                    }
                    <div className="w-full h-[1px] bg-gray-100 my-2"></div>
                    <div >
                        <span className="text-xs ml-2">Your Workspace</span>
                        <div className="flex flex-col gap-2 max-h-64 overflow-y-scroll">
                            {
                                workspaces?.data.map((workspace: WorkspaceType) => <WorkspaceCard key={workspace?.id} workspace={workspace} />)
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderRooms;
