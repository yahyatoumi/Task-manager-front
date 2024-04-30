import { useEffect, useRef, useState, FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { makeWorkspaceFavorite, makeWorkspaceNotFavorite } from "@/api/RequestInHeader";
import { toast } from "react-toastify";
import { setWorkspaces } from "@/lib/workspaces/workspacesSlice";

interface WorkspaceCardProps {
    workspace: WorkspaceType
}

export const WorkspaceCardWithStar: FC<WorkspaceCardProps> = ({ workspace }) => {
    const workspaces = useAppSelector(state => state.workspaces);
    const dispatch = useAppDispatch()

    const makeWorkspaceFovoriteHandler = async (workspaceId: number) => {
        const res = await makeWorkspaceFavorite(workspaceId)
        console.log("RESSSSSXX", res, res.status, res.status === 202)
        if (res.status === 202) {
            toast.success("Workspace set as favorite");
            const newWorkspaces = workspaces.map((workspace) => {
                if (workspace.id !== res.data.id)
                    return workspace
                return res.data;
            })
            dispatch(setWorkspaces(newWorkspaces))
            console.log("new workspacessss", newWorkspaces)
        }
    }

    const makeWorkspaceNotFovoriteHandler = async (workspaceId: number) => {
        const res = await makeWorkspaceNotFavorite(workspaceId)
        console.log("RESSSSSXX", res, res.status)
        if (res.status === 202) {
            toast.success("Workspace no longer favorite");
            const newWorkspaces = workspaces.map((workspace) => {
                if (workspace.id !== res.data.id)
                    return workspace
                return res.data;
            })
            dispatch(setWorkspaces(newWorkspaces))
            console.log("new workspacessss", newWorkspaces)
        }
    }

    return <div className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
        <div className="h-8 w-10 rounded flex items-center justify-center" style={{ backgroundColor: workspace?.color }}>
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
    </div>
}

interface ComponentProps {
    displayFromMore?: {
        workspaces: boolean;
        recent: boolean;
        stared: boolean;
        closeAll: boolean
    },
    updateDisplayFromMore: any,
    moreOptionref: any
}

const HeaderRecent: FC<ComponentProps> = ({ displayFromMore, updateDisplayFromMore, moreOptionref }) => {
    const [displayOptions, setDisplayOptions] = useState(false);
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const workspaces = useAppSelector(state => state.workspaces);


    const handleClick = (e: MouseEvent) => {
        if ((optionsRef.current
            && displayerRef.current
            && !optionsRef.current.contains(e.target as Element)
            && !displayerRef.current.contains(e.target as Element)
            && e.target !== e.currentTarget
            && moreOptionref?.current
            && !moreOptionref?.current.contains(e.target as Element))
        ||
        (
            (
                optionsRef.current
                && displayerRef.current
                && !optionsRef.current.contains(e.target as Element)
                && !displayerRef.current.contains(e.target as Element)
                && e.target !== e.currentTarget
                && !moreOptionref?.current
            )
        )
        ) {
            updateDisplayFromMore("closeAll")
            // setDisplayOptions(false);
        }
    };

    useEffect(() => {
        if (displayFromMore) {
            setDisplayOptions(displayFromMore.recent)
            console.log("WILLLL DISPLAY RECENT")
        }
        if (displayFromMore?.closeAll){
            console.log("closing all")
            setDisplayOptions(false);
        }
    }, [displayFromMore])

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <div className="relative">
            <div
                ref={displayerRef}
                onClick={() => setDisplayOptions(!displayOptions)}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded relative ${displayOptions ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>Recent</span>
                <IoIosArrowDown />
            </div>
            {displayOptions && (
                <div ref={optionsRef} className="absolute top-10 rounded-lg left-0 w-72 bg-background p-2 shadow-lg">
                    <div className="flex flex-col gap-2">
                        {
                            workspaces?.slice(0, 6).map((workspace) => <WorkspaceCardWithStar key={workspace?.id} workspace={workspace} />)
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderRecent;
