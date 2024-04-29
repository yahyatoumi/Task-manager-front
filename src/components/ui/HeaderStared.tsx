import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const HeaderStared = () => {
    const [displayOptions, setDisplayOptions] = useState(false);
    const displayerRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);

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

    return (
        <div className="relative">
            <div
                ref={displayerRef}
                onClick={() => setDisplayOptions(!displayOptions)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded relative ${displayOptions ? "text-primary bg-blue-100 hover:bg-blue-200" : " hover:bg-gray-200"}`}
            >
                <span>Stared</span>
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

export default HeaderStared;
