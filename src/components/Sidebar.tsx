"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "../../public/logo.png"
import { IoInvertMode } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { decrement, increment } from "@/lib/counter/counterSlice";

const Sidebar = () => {
    const pathname = usePathname()
    const notAllowedIn = ["/login", "/login/googleAuth"]
    const counter = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()
    const workspaces = useAppSelector(state => state.workspaces)

    if (!localStorage.getItem("user_token") || notAllowedIn.includes(pathname))
        return null;
    return (
        <>
            <div className="w-64 h-[calc(100vh-48px)] absolute top-12 p-2 hidden sm:block border">
                <div className="mx-auto px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        <Image src={logo} alt="Logo" className="relative w-10 h-10 cursor-pointer" />
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
                            <li onClick={() => dispatch(decrement())}>-</li>
                            <li>
                                {counter}
                            </li>
                            <li onClick={() => dispatch(increment())}>+</li>


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

export default Sidebar;