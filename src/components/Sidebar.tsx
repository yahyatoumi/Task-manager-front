"use client"
import React, { FC, useRef } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "../../public/logo.png"
import { IoInvertMode } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { decrement, increment } from "@/lib/counter/counterSlice";
import { FaChevronLeft } from "react-icons/fa";
import { hide, display } from "@/lib/sidebar/sidebarSlice";
import { MdOutlineWorkspaces } from "react-icons/md";
import { RiGroupLine } from "react-icons/ri";
import { HiPlus } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { setCurrentWorkspace } from "@/lib/currentWorkspace/currentWorkspaceSlice";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkspaces, getSingleWorkspace } from "@/api/workspaceRequests";
import { PiKanbanDuotone } from "react-icons/pi";

interface BoardsPartProps {
    projects: Project[]
}

const BoardsPart: FC<BoardsPartProps> = ({ projects }) => {
    const pathname = usePathname()
    const [currentBoardId, setCurrentBoardId] = useState<number | null>()
    const currentWorkspaceState = useAppSelector(state => state.currentWorkspace)

    useEffect(() => {
        const splitted = pathname.split("/")
        if (splitted.length > 2 && splitted[splitted.length - 2] === 'board') {
            console.log("border is", splitted, Number(splitted[splitted.length - 1]))
            setCurrentBoardId(Number(splitted[splitted.length - 1]))
        }
    }, [pathname])

    useEffect(() => {

        console.log("prrrr", currentWorkspaceState)
    }, [currentWorkspaceState])



    return <div className="w-full px-3">
        <div className="w-full flex justify-between">
            <span className="text-sm font-semibold">Your boards</span>
        </div>
        <div className="w-full flex flex-col mt-2">
            {
                currentWorkspaceState?.projects?.map((project) => <Link
                    href={`/board/${project.id}`}
                    className={`w-full flex items-center gap-2 text-sm font-normal p-2 hover:bg-gray-200 rounded ${currentBoardId === project.id && "bg-gray-200"}`}>
                    <div 
                    style={{
                        backgroundColor: project.color,
                    }}
                    className="w-8 h-5 rounded"></div>
                    <span className="capitalize">
                        {project.name}
                    </span>
                </Link>)
            }
        </div>
    </div>
}

const Sidebar = () => {
    const pathname = usePathname()
    const notAllowedIn = ["/login", "/login/googleAuth"]
    const dispatch = useAppDispatch()
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)
    const { data: currentWorkspace } = useQuery({
        queryKey: ["workspace", currentWorkspaceId],
        queryFn: () => currentWorkspaceId && getSingleWorkspace(currentWorkspaceId),
    })
    const sidebarState = useAppSelector(state => state.sidebar.value)
    const currentWorkspaceState = useAppSelector(state => state.currentWorkspace)
    const [displayComponents, setDisplayComponents] = useState({
        workspaces: false,
        members: false,
        settings: false
    })
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const pathName = usePathname()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentWorkspaceId(localStorage.getItem("currentWorkspace"));
        }
    }, []);

    useEffect(() => {
        if (!currentWorkspaceState?.id && currentWorkspace){
            dispatch(setCurrentWorkspace(currentWorkspace.data))
        }
    }, [currentWorkspace])

    useEffect(() => {
        console.log("newwww state", currentWorkspaceState)
    }, [currentWorkspaceState])


    useEffect(() => {
        console.log("ppprjscsss", currentWorkspaceState?.projects)
    }, [currentWorkspaceState?.projects])

    const handleClick = (e: MouseEvent) => {
        const clickedElement = e.target as Node;

        if (
            optionsRef &&
            !optionsRef.current?.contains(clickedElement)) {
            setDisplayComponents({
                workspaces: false,
                members: false,
                settings: false
            })
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [])

    // useEffect(() => {
    //     console.log("CURENT", currentWorkspace)
    //     if (currentWorkspace){
    //         console.log("will set", currentWorkspace)
    //         dispatch(setCurrentWorkspace(currentWorkspace.data))
    //     }
    // }, [currentWorkspace])

    let splittedPath: string[] | string = pathname.split("/")
    const lastpathName = splittedPath[splittedPath.length - 1]

    useEffect(() => {
        console.log("pathName", pathName, splittedPath)
    }, [pathName])


    if (notAllowedIn.includes(pathname) || (!splittedPath.includes("workspace") && !splittedPath.includes("board")) || !currentWorkspaceState)
        return null;
    if (!sidebarState)
        return <div className="w-4 h-[calc(100vh-48px)] absolute top-12 p-3 px-0 hidden sm:block border bg-gray-200">
            <div
                onClick={() => dispatch(display())}
                className="w-8 h-8 border rounded-full mt-2 hover:bg-gray-100 flex items-center justify-center cursor-pointer rotate-180">
                <FaChevronLeft className="w-3 h-3" />
            </div>
        </div>
    return (
        <div className="w-64 h-[calc(100vh-48px)] absolute top-12 hidden sm:block border">
            <div className="w-full py-2 px-3 flex justify-between items-center border-b">
                {
                    currentWorkspaceState &&
                    <div className="flex items-center max-w-[80%] break-words gap-2">
                        <div className="min-w-8 min-h-8 bg-blue-500 flex items-center justify-center text-xl font-semibold capitalize rounded text-white">
                            {currentWorkspaceState?.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <p className="capitalize text-sm font-semibold truncate w-36">
                                {currentWorkspaceState?.name} workspace
                            </p>
                            <span className="text-xs font-normal ">
                                Free
                            </span>
                        </div>
                    </div>
                }
                {
                    sidebarState &&
                    <div
                        onClick={() => dispatch(hide())}
                        className="w-8 h-8 hover:bg-gray-100 ml-auto rounded flex items-center justify-center cursor-pointer">
                        <FaChevronLeft className="w-3 h-3" />
                    </div>
                }
            </div>
            <div
                ref={optionsRef}
                className="flex flex-col my-4">
                <div className="relative text-sm font-medium cursor-pointer w-full gap-2">
                    <Link
                        href={`/workspace/${currentWorkspaceState?.id}`}
                        className={`flex items-center justify-between ${lastpathName !== "settings" && lastpathName !== "members" ? "bg-gray-200" : "hover:bg-gray-100"} px-4 py-2`}
                    >
                        <div className="flex items-center gap-2">
                            <PiKanbanDuotone />
                            <span>
                                Boards
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="text-sm font-medium cursor-pointer w-full gap-2">
                    <Link
                        href={`/workspace/${currentWorkspaceState?.id}/members`}
                        className={`flex items-center justify-between ${lastpathName === "members" ? "bg-gray-200" : "hover:bg-gray-100"} px-4 py-2 `}
                    >
                        <div className="flex items-center gap-2">
                            <RiGroupLine />
                            <span>
                                Members
                            </span>
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center rotate-180">
                            <FaChevronLeft className="w-3 h-3" />
                        </div>
                    </Link>
                </div>
                <Link
                    href={`/workspace/${currentWorkspaceState?.id}/settings`}
                    className="text-sm font-medium cursor-pointer w-full gap-2">
                    <div className={`flex items-center justify-between ${lastpathName === "settings" ? "bg-gray-200" : "hover:bg-gray-100"} px-4 py-2 `}>
                        <div className="flex items-center gap-2">
                            <IoSettingsOutline />
                            <span>
                                Settings
                            </span>
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center rotate-180">
                            <FaChevronLeft className="w-3 h-3" />
                        </div>
                    </div>
                </Link>
            </div>
            <BoardsPart projects={currentWorkspaceState?.projects} />
        </div>
    );
};

export default Sidebar