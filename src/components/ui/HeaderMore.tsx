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
    "workspaces",
    "recent",
    "stared",
]

interface ComponentProps {
    updateDisplayFromMore: any
    moreOptionref: any
}


const HeaderMore: FC<ComponentProps> = ({ updateDisplayFromMore, moreOptionref }) => {
    const [displayOptions, setDisplayOptions] = useState(false);
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const workspaces = useAppSelector(state => state.workspaces);


    const handleClick = (e: MouseEvent) => {
        if (moreOptionref.current
            && displayerRef.current
            && !moreOptionref.current.contains(e.target as Element)
            && !displayerRef.current.contains(e.target as Element)
            && e.target !== e.currentTarget
        ) {
            if (!moreOptionref.current.contains(e.target as Element))
                updateDisplayFromMore("closeAll")
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
                className={` flex items-center gap-2 px-3 py-1.5 rounded relative ${displayOptions ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>More</span>
                <IoIosArrowDown />
            </div>
            {displayOptions && (
                <div ref={moreOptionref} className="absolute top-10 rounded-lg left-0 w-72 bg-background p-2 shadow-lg">
                    <div className="flex flex-col gap-2">
                        {
                            optionsList.map((option, index) => <div onClick={() => {
                                updateDisplayFromMore(option)
                            }}
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
