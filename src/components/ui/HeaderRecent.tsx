import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const HeaderRecent = () => {
    const [displayOptions, setDisplayOptions] = useState(false);
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);

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
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-200 rounded relative"
            >
                <span>Recent</span>
                <IoIosArrowDown />
            </div>
            {displayOptions && (
                <div ref={optionsRef} className="absolute top-full left-0 w-72 h-64 bg-secondary">
                    {/* Your dropdown content */}
                </div>
            )}
        </div>
    );
};

export default HeaderRecent;
