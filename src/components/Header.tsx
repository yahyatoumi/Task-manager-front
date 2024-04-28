"use client"
import React from "react";
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


const Header = () => {
    const pathname = usePathname()
    const notAllowedIn = ["/login", "/login/googleAuth"]

    if (!localStorage.getItem("user_token") || notAllowedIn.includes(pathname))
        return null;
    return (
        <>
            <div className="w-full h-12 sticky top-0 border-b">
                <div className="mx-auto px-12 h-full">
                    <div className="flex justify-between items-center h-full">
                        <ul className="flex gap-1 items-center font-medium text-sm">
                            <li className="cursor-pointer hover:bg-gray-200 flex items-center gap-2 px-3 py-1.5 rounded">
                                <Image src={logo} alt="Logo" className="relative w-6 h-6" />
                                <span className="font-bold text-md">Taskello</span>
                            </li>
                            <li className="cursor-pointer">
                                <HeaderRooms />
                            </li>
                            <li className="cursor-pointer">
                                <HeaderRecent />
                            </li>
                            <li className="cursor-pointer">
                                <HeaderStared />
                            </li>
                            <li className="cursor-pointer">
                                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded">
                                    Create
                                </button>
                            </li>
                        </ul>
                        <ul className="flex gap-x-6 text-white items-center">
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
                                <img src='https://cdn.intra.42.fr/users/c4a7a6c32f60b4dac15f2f7eaa128a5c/ytoumi.jpg' alt="Logo" className="relative w-8 h-8 rounded-full" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;