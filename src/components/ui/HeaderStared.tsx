import { useEffect, useRef, useState, FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { WorkspaceCardWithStar } from "./HeaderRecent";
import { useAppSelector } from "@/lib/hooks";

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

const HeaderStared: FC<ComponentProps> = ({ displayFromMore, updateDisplayFromMore, moreOptionref }) => {
    const [displayOptions, setDisplayOptions] = useState(false);
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const workspaces = useAppSelector(state => state.workspaces)
    const [favoriteWorkspaces, setFavoriteWorkspaces] = useState<WorkspaceType[]>([])

    useEffect(() => {
        setFavoriteWorkspaces(workspaces.filter((workspace) => workspace.is_favorite))
    }, [workspaces])

    const handleClick = (e: MouseEvent) => {
        // Check if clicked outside the dropdown (excluding the button itself)
        if (
            (optionsRef.current
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
            // setDisplayOptions(false); // Hide dropdown if clicked outside
        }
    };



    useEffect(() => {
        if (displayFromMore) {
            setDisplayOptions(displayFromMore.stared)
            console.log("WILLLL DISPLAY Stared")
        }
        if (displayFromMore?.closeAll) {
            setDisplayOptions(false);
        }
    }, [displayFromMore])

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, []); // Empty dependency array, runs only once after mount

    return (
        <div className="relative">
            <div
                ref={displayerRef}
                onClick={() => setDisplayOptions(!displayOptions)}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded relative ${displayOptions && favoriteWorkspaces.length > 0 ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>Stared</span>
                <IoIosArrowDown />
            </div>
            {displayOptions && (
                <div ref={optionsRef} className={`${favoriteWorkspaces.length ? "absolute" : "hidden"} top-10 rounded-lg left-0 w-72 bg-background p-2 shadow-lg ${favoriteWorkspaces.length >= 5 ? "max-h-64 overflow-y-scroll" : ""}`}>
                    <div className="flex flex-col gap-2">
                        {
                            favoriteWorkspaces.map((workspace) => <WorkspaceCardWithStar key={workspace?.id} workspace={workspace} />)
                        }
                    </div>
                </div>
            )}
            {
                displayOptions && !favoriteWorkspaces.length && <div ref={optionsRef} className={`absolute top-10 rounded-lg left-0 w-72 bg-background p-2 shadow-lg ${favoriteWorkspaces.length >= 5 ? "max-h-64 overflow-y-scroll" : ""}`}>
                    <div className="flex flex-col gap-2 p-3">
                        <span className="text-sm font-normal">Star important Workspaces and projects to access them quickly and easily</span>
                    </div>
                </div>
            }
        </div>
    );
};

export default HeaderStared;
