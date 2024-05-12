"use client"
import { FC } from "react";
import { hide } from "@/lib/workspaceModal/workspaceModalSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";


const Modal = () => {
    const workspaceModal = useAppSelector(state => state.workspaceModal.value)
    const dispatch = useAppDispatch()

    if (!workspaceModal) return <></>

    return (
        <>
            <div
                className="fixed inset-0 z-40 p-8 overflow-y-scroll"
            >
                {/* <div onClick={() => setDisplayModal(false)} className="fixed top-0 left-0 right-0 bottom-0 bg-blue-500 opacity-50">
                </div> */}
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 h-[700px] rounded-lg shadow-lg relative flex flex-col w-full bg-white">
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}

export default Modal