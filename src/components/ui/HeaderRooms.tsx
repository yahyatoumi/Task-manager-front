import { FC, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { getAllWorkspaces } from "@/api/RequestInHeader";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setWorkspaces } from "@/lib/workspaces/workspacesSlice";
import { setCurrentWorkspace } from "@/lib/currentWorkspace/currentWorkspaceSlice";

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
    const workspaces = useAppSelector(state => state.workspaces);
    const dispatch = useAppDispatch();


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
    }, [display]); // Empty dependency array, runs only once after mount

    useEffect(() => {
    }, [display])

    const getAllWorkspacesHandler = async () => {
        const res = await getAllWorkspaces();
        if (res.status === 200) {
            const workspaces = res.data
            dispatch(setWorkspaces(workspaces))
            dispatch(setCurrentWorkspace(workspaces[0]))
        }
    }

    useEffect(() => {
        getAllWorkspacesHandler();
    }, []);

    return (
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
                    <div >
                        <span className="text-xs ml-2">Current Workspace</span>
                        {
                            workspaces.length >= 1 && <WorkspaceCard key={workspaces[0]?.id} workspace={workspaces[0]} />
                        }
                    </div>
                    <div className="w-full h-[1px] bg-gray-100 my-2"></div>
                    <div >
                        <span className="text-xs ml-2">Your Workspace</span>
                        <div className="flex flex-col gap-2 max-h-64 overflow-y-scroll">
                            {
                                workspaces.map((workspace) => <WorkspaceCard key={workspace?.id} workspace={workspace} />)
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderRooms;
