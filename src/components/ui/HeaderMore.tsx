import { useEffect, useRef, useState, FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { makeWorkspaceFavorite, makeWorkspaceNotFavorite } from "@/api/RequestInHeader";
import { toast } from "react-toastify";
import { setWorkspaces } from "@/lib/workspaces/workspacesSlice";
import { WorkspaceCardWithStar } from "./HeaderRecent";

const optionsList = [
    "rooms",
    "recent",
    "stared",
]

interface ComponentProps {
    toggleSingleTab: (tab: string) => void
    closeAll: () => void;
    display: boolean
}


const HeaderMore: FC<ComponentProps> = ({ toggleSingleTab, closeAll, display }) => {
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const workspaces = useAppSelector(state => state.workspaces);


    const handleClick = (e: MouseEvent) => {
        const clickedElement = e.target as Node;

        if (
            displayerRef.current &&
            !displayerRef.current.contains(clickedElement) &&
            optionsRef.current &&
            !optionsRef.current.contains(clickedElement)
        ) {
            closeAll();
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
                onClick={() => toggleSingleTab('more')}
                className={` flex items-center gap-2 px-3 py-1.5 rounded relative ${display ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>More</span>
                <IoIosArrowDown />
            </div>
            {display && (
                <div
                    ref={optionsRef}
                    className="absolute top-10 rounded-lg left-0 w-72 bg-background p-2 shadow-lg">
                    <div className="flex flex-col gap-2">
                        {
                            optionsList.map((option, index) => <div
                                onClick={(e) => {
                                    toggleSingleTab(option)
                                }
                                }
                                key={index}
                                className="flex justify-between items-center hover:bg-gray-100 p-1">
                                <span className="">
                                    {option}
                                </span>
                                <HiOutlineChevronRight />
                            </div>)
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderMore;
