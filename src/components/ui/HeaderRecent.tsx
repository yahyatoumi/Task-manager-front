import { useEffect, useRef, useState, FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useAppSelector } from "@/lib/hooks";
import { FaRegStar } from "react-icons/fa6";

interface WorkspaceCardProps {
    workspace: WorkspaceType
}

const WorkspaceCard: FC<WorkspaceCardProps> = ({ workspace }) => {
    return <div key={workspace?.id} className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
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
            <FaRegStar className="w-5 h-5"/>
        </div>
    </div>
}

const HeaderRecent = () => {
    const [displayOptions, setDisplayOptions] = useState(false);
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const workspaces = useAppSelector(state => state.workspaces);


    const handleClick = (e: MouseEvent) => {
        console.log("clicked", e)
        if (optionsRef.current
            && displayerRef.current
            && !optionsRef.current.contains(e.target as Element)
            && !displayerRef.current.contains(e.target as Element)
            && e.target !== e.currentTarget
        ) {
            setDisplayOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <div className="relative">
            <div
                ref={displayerRef}
                onClick={() => setDisplayOptions(!displayOptions)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded relative ${displayOptions ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>Recent</span>
                <IoIosArrowDown />
            </div>
            {displayOptions && (
                <div ref={optionsRef} className="absolute top-10 rounded-lg left-0 w-72 bg-background p-2 shadow-lg">
                    <div className="flex flex-col gap-2">
                        {
                            workspaces?.slice(0, 6).map((workspace) => <WorkspaceCard workspace={workspace} />)
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderRecent;
