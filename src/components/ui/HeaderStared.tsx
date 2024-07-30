import { useEffect, useRef, useState, FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { WorkspaceCardWithStar } from "./HeaderRecent";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { getAllWorkspaces } from "@/api/workspaceRequests";
import { useQuery } from "@tanstack/react-query";

interface ComponentProps {
    display: boolean;
    closeAll: () => void;
    toggleSingleTab: (tab: string) => void;
}

const HeaderStared: FC<ComponentProps> = ({ closeAll, display, toggleSingleTab }) => {
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const [favoriteWorkspaces, setFavoriteWorkspaces] = useState<WorkspaceType[]>([])
    const { data: workspaces, isLoading } = useQuery({
        queryKey: ["workspaces"],
        queryFn: getAllWorkspaces,
    })

    useEffect(() => {
        console.log("www", workspaces)
        setFavoriteWorkspaces(workspaces?.data?.filter((workspace: WorkspaceType) => workspace.is_favorite))
    }, [workspaces])


    const handleClick = (e: MouseEvent) => {
        const clickedElement = e.target as Node;

        if (
            optionsRef?.current &&
            !optionsRef.current.contains(clickedElement) &&
            displayerRef?.current &&
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

    return (
        <div className="relative">
            <div
                ref={displayerRef}
                onClick={() => toggleSingleTab("stared")}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded relative ${display && favoriteWorkspaces.length > 0 ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>Stared</span>
                <IoIosArrowDown />
            </div>
            {display && (
                <div ref={optionsRef} className={`${favoriteWorkspaces.length ? "absolute" : "hidden"} top-6 sm:top-10 rounded-lg -left-20 sm:left-0 w-72 bg-background p-2 shadow-lg ${favoriteWorkspaces.length >= 5 ? "max-h-64 overflow-y-scroll" : ""}`}>
                    <div className="flex flex-col gap-2">
                        {
                            favoriteWorkspaces.map((workspace) => <WorkspaceCardWithStar key={workspace?.id} workspace={workspace} />)
                        }
                    </div>
                </div>
            )}
            {
                display && !favoriteWorkspaces.length && <div ref={optionsRef} className={`absolute top-6 sm:top-10 rounded-lg -left-20 sm:left-0 w-72 bg-background p-2 shadow-lg ${favoriteWorkspaces.length >= 5 ? "max-h-64 overflow-y-scroll" : ""}`}>
                    <div className="flex flex-col gap-2 p-3">
                        <span className="text-sm font-normal">Star important Workspaces and projects to access them quickly and easily</span>
                    </div>
                </div>
            }
        </div>
    );
};

export default HeaderStared;
