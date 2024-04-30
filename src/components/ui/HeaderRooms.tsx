import { FC, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { getAllWorkspaces } from "@/api/RequestInHeader";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setWorkspaces } from "@/lib/workspaces/workspacesSlice";

interface WorkspaceCardProps {
    workspace: WorkspaceType
}

const WorkspaceCard: FC<WorkspaceCardProps> = ({ workspace }) => {
    console.log("workspace", workspace)
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
    displayFromMore?: {
        workspaces: boolean;
        recent: boolean;
        stared: boolean;
        closeAll: boolean
    },
    updateDisplayFromMore: any,
    moreOptionref: any
}

const HeaderRooms:FC<ComponentProps> = ({displayFromMore, updateDisplayFromMore, moreOptionref}) => {
    const [displayOptions, setDisplayOptions] = useState(false);
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const workspaces = useAppSelector(state => state.workspaces);
    const dispatch = useAppDispatch();


    const handleClick = (e: MouseEvent) => {
        // Check if clicked outside the dropdown (excluding the button itself)
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
            // console.log("NOT UNDEFINED")
            // setDisplayOptions(false); // Hide dropdown if clicked outside
        }
    };



    useEffect(() => {
        console.log("UPDAAAAAATESSSS")
        if (displayFromMore) {
            setDisplayOptions(displayFromMore.workspaces)
            console.log("WILLLL DISPLAY Workspaces")
        }
        if (displayFromMore?.closeAll){
            setDisplayOptions(false);
        }
    }, [displayFromMore])

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, []); // Empty dependency array, runs only once after mount

    const getAllWorkspacesHandler = async () => {
        const res = await getAllWorkspaces();
        if (res.status === 200) {
            const workspaces = res.data
            dispatch(setWorkspaces(workspaces))
        }
        console.log("RESSSSS", res)
    }

    useEffect(() => {
        getAllWorkspacesHandler();
    }, []);

    return (
        <div className="relative">
            <div
                ref={displayerRef}
                onClick={() => setDisplayOptions(!displayOptions)}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded relative ${displayOptions ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>Workspaces</span>
                <IoIosArrowDown />
            </div>
            {displayOptions && (
                <div ref={optionsRef} className="absolute top-10 left-0 w-80 rounded-lg shadow-lg p-2 bg-background">
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