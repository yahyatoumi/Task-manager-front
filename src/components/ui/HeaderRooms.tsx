import { FC, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { getAllWorkspaces } from "@/api/RequestInHeader";

interface WorkspaceCardProps {
    name: string;
    color: string
}

const WorkspaceCard:FC<WorkspaceCardProps> = () => {
    return <div>

    </div>
}

const HeaderRooms = () => {
    const [displayOptions, setDisplayOptions] = useState(false);
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const [workspaces, setWorkspaces] = useState([])

    const handleClick = (e: MouseEvent) => {
        // Check if clicked outside the dropdown (excluding the button itself)
        console.log("clicked", e)
        if (optionsRef.current 
            && displayerRef.current
            && !optionsRef.current.contains(e.target as Element)
            && !displayerRef.current.contains(e.target as Element)
            && e.target !== e.currentTarget
            ) {
            setDisplayOptions(false); // Hide dropdown if clicked outside
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, []); // Empty dependency array, runs only once after mount

    const getAllWorkspacesHandler = async () => {
        const res = await getAllWorkspaces();
        if (res.status === 200){

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
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-200 rounded relative"
            >
                <span>Workspaces</span>
                <IoIosArrowDown />
            </div>
            {displayOptions && (
                <div ref={optionsRef} className="absolute top-full left-0 w-72 h-64 shadow-lg">
                    {/* Your dropdown content */}
                </div>
            )}
        </div>
    );
};

export default HeaderRooms;
