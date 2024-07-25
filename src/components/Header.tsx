"use client"
import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "../../public/logo.png"
import { IoInvertMode } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import HeaderRooms from "./ui/HeaderRooms";
import HeaderRecent from "./ui/HeaderRecent";
import HeaderStared from "./ui/HeaderStared";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import NewWorkspaceModal from "./ui/NewWorkspaceModal";
import HeaderMore from "./ui/HeaderMore";
import { BiPlus } from "react-icons/bi";
import { display } from "@/lib/workspaceModal/workspaceModalSlice";

const PopUpsComponent = () => {
    const [displayPopup, setDisplayPopup] = useState({
        more: false,
        rooms: false,
        recent: false,
        stared: false
    })

    const closeAll = () => {
        setDisplayPopup({
            more: false,
            rooms: false,
            recent: false,
            stared: false
        })
    }

    const toggleSingleTab = (tab: string) => {
        const newState = {
            more: tab === "more" && !displayPopup.more,
            rooms: tab === "rooms" && !displayPopup.rooms,
            recent: tab === "recent" && !displayPopup.recent,
            stared: tab === "stared" && !displayPopup.stared
        }
        setDisplayPopup(newState);
    }


    return <>
        <li className="cursor-pointer block sm:hidden">
            <HeaderMore display={displayPopup.more} toggleSingleTab={toggleSingleTab} closeAll={closeAll} />
        </li>
        <li className="cursor-pointer">
            <HeaderRooms display={displayPopup.rooms} toggleSingleTab={toggleSingleTab} closeAll={closeAll} />
        </li>
        <li className="cursor-pointer">
            <HeaderRecent display={displayPopup.recent} toggleSingleTab={toggleSingleTab} closeAll={closeAll} />
        </li>
        <li className="cursor-pointer">
            <HeaderStared display={displayPopup.stared} toggleSingleTab={toggleSingleTab} closeAll={closeAll} />
        </li>
    </>
}


const Header = () => {
    const pathname = usePathname()
    const notAllowedIn = ["/login", "/login/googleAuth"]
    const dispatch = useAppDispatch()
    const workspaceModal = useAppSelector(state => state.workspaceModal.value)
    const [displayFromMore, setDisplayFromMore] = useState({
        workspaces: false,
        recent: false,
        stared: false,
        closeAll: true
    })
    const moreOptionref = useRef<any>(null)

    const updateDisplayFromMore = (option: string) => {
        setDisplayFromMore((prev) => ({
            ...prev,
            workspaces: false,
            recent: false,
            stared: false,
            closeAll: false,
            [option]: true,
        }));
    };

    return (
        <header className="w-full h-12 z-10 sticky top-0 border-b bg-white">
            <div className="mx-auto px-2  lg:px-12 h-full">
                <div className="flex justify-between items-center h-full">
                    <ul className="flex gap-1 items-center font-medium text-sm">
                        <li className="cursor-pointer hover:bg-gray-200 flex items-center gap-2 px-1 sm:px-3 py-1.5 rounded">
                            <Image src={logo} alt="Logo" className="relative w-6 h-6" />
                            <span className="font-bold text-md">Taskello</span>
                        </li>
                        <PopUpsComponent />
                        <li className="cursor-pointer">
                            <button onClick={() => dispatch(display())} className="bg-primary hover:bg-primary-dark text-white sm:px-4 sm:py-1.5 rounded">
                                <span className="hidden sm:block">
                                    Create
                                </span>
                                <div className="sm:hidden w-8 h-8 flex items-center justify-center">
                                    <BiPlus className="w-5 h-5" />
                                </div>
                            </button>
                        </li>
                    </ul>
                    <ul className="flex gap-x-2 sm:gap-x-6 text-white items-center">
                        <li className="cursor-pointer">
                            <IoInvertMode className="w-6 h-6 text-text" />
                        </li>
                        <li className="relative cursor-pointer">
                            <IoNotificationsOutline className="w-6 h-6 text-text" />
                            <div className="absolute -top-1 -right-1 text-xs bg-error text-white w-4 h-4 flex justify-center items-center rounded-full">
                                <span>2</span>
                            </div>
                        </li>
                        <li className=" cursor-pointer">
                            <img src='https://cdn.intra.42.fr/users/c4a7a6c32f60b4dac15f2f7eaa128a5c/ytoumi.jpg' alt="Logo" className="relative w-8 min-w-8 h-8 rounded-full" />
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;