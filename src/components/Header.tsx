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


const Header = () => {
    const pathname = usePathname()

    const isLoginPage = pathname === '/login'; // Adjust the path as needed
    if (isLoginPage)
        return null;
    return (
        <>
            <div className="w-full h-20 sticky top-0">
                <div className="mx-auto px-12 h-full">
                    <div className="flex justify-between items-center h-full">
                        <ul className="flex gap-6 items-center font-semibold">
                            <li className="cursor-pointer hover:bg-b-hover flex items-center gap-2 p-2 rounded">
                                <Image src={logo} alt="Logo" className="relative w-8 h-8" />
                                <span className="font-semibold text-xl">Taskello</span>
                            </li>
                            <li className="cursor-pointer">
                                <HeaderRooms />
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
                                <img src='https://cdn.intra.42.fr/users/c4a7a6c32f60b4dac15f2f7eaa128a5c/ytoumi.jpg' alt="Logo" className="relative w-10 h-10 rounded-full" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;