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
import { getAllWorkspaces } from "@/api/workspaceRequests";

interface ComponentProps {
    toggleComponent: (component: string) => void;
}

const WorkspacesComponent: FC<ComponentProps> = ({ toggleComponent }) => {
    const { data: workspaces, isLoading } = useQuery({
        queryKey: ["workspaces"],
        queryFn: getAllWorkspaces
    })
    const currentWorkspace = useAppSelector(state => (state.currentWorkspace.id ? state.currentWorkspace : null))
    const dispatch = useAppDispatch();


    return <div className="absolute z-10 left-[calc(100%-48px)] top-full w-80 bg-background rounded-lg shadow-lg flex flex-col py-2">
        {
            currentWorkspace &&
            <div className="border-b w-full mb-2">
                <p className="text-xs px-4">Current Workspace</p>
                <div className='flex gap-2 items-center px-4 hover:bg-gray-100 py-2'>
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white text-xl font-semibold capitalize">
                        {currentWorkspace?.name.charAt(0)}
                    </div>
                    <p>
                        {currentWorkspace?.name}
                    </p>
                </div>
            </div>
        }
        {
            workspaces?.data.filter((workspace: WorkspaceType) => workspace.id !== currentWorkspace?.id).map((workspace: WorkspaceType) => <div
                onClick={() => dispatch(setCurrentWorkspace(workspace))}
                className="flex gap-2 items-center px-4 hover:bg-gray-100 py-2"
            >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white text-xl font-semibold capitalize">
                    {workspace.name.charAt(0)}
                </div>
                <p>
                    {workspace.name}
                </p>
            </div>)
        }
    </div>
}

const Sidebar = () => {
    const pathname = usePathname()
    const notAllowedIn = ["/login", "/login/googleAuth"]
    const dispatch = useAppDispatch()
    const currentWorkspace = useAppSelector(state => state.currentWorkspace.id ? state.currentWorkspace : null)
    const sidebarState = useAppSelector(state => state.sidebar.value)
    const [displayComponents, setDisplayComponents] = useState({
        workspaces: false,
        members: false,
        settings: false
    })
    const optionsRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        console.log("CURENT", currentWorkspace)
    }, [currentWorkspace])


    const toggleComponent = (name: string) => {
        const newState = {
            workspaces: name === "workspaces" ? !displayComponents.workspaces : false,
            members: name === "members" ? !displayComponents.members : false,
            settings: name === "settings" ? !displayComponents.settings : false
        }
        console.log("newStateee", newState);
        setDisplayComponents(newState)
    }


    if (!localStorage.getItem("user_token") || notAllowedIn.includes(pathname))
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
                    currentWorkspace &&
                    <div className="flex items-center max-w-[80%] break-words gap-2">
                        <div className="min-w-8 min-h-8 bg-blue-500 flex items-center justify-center text-xl font-semibold capitalize rounded text-white">
                            {currentWorkspace?.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <p className="capitalize text-sm font-semibold truncate w-36">
                                {currentWorkspace?.name} workspace
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
                    <div
                        onClick={() => toggleComponent("workspaces")}
                        className="flex items-center justify-between hover:bg-gray-100 px-4 py-2"
                    >
                        <div className="flex items-center gap-2">
                            <MdOutlineWorkspaces />
                            <span>
                                Workspaces
                            </span>
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center rotate-180">
                            <FaChevronLeft className="w-3 h-3" />
                        </div>
                    </div>
                    {displayComponents.workspaces && <WorkspacesComponent toggleComponent={toggleComponent} />}
                </div>
                <div className="text-sm font-medium cursor-pointer w-full gap-2">
                    <div
                        onClick={() => toggleComponent("members")}
                        className="flex items-center justify-between hover:bg-gray-100 px-4 py-2 "
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
                    </div>
                </div>
                <div className="text-sm font-medium cursor-pointer w-full gap-2">
                    <div className="flex items-center justify-between hover:bg-gray-100 px-4 py-2 ">

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
                </div>
            </div>
        </div>
    );
};

export default Sidebar;