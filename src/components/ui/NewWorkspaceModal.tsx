"use client"
import { FC, useState } from "react";
import { hide } from "@/lib/workspaceModal/workspaceModalSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { createWorkspace } from "@/api/workspaceRequests";
import { toast } from "react-toastify";
import { addWorkspaces } from "@/lib/workspaces/workspacesSlice";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const Modal = () => {
    const workspaceModal = useAppSelector(state => state.workspaceModal.value)
    const dispatch = useAppDispatch()
    const [workspaceName, setWorkspaceName] = useState<string>("")
    const [workspaceDescription, setWorkspaceDescription] = useState<string>("")
    const queryClient = useQueryClient();

    const { mutateAsync: addTodoMutation } = useMutation({
        mutationFn: () => createWorkspace(workspaceName, workspaceDescription),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            dispatch(hide())
        },
    });

    if (!workspaceModal) return <></>
    return (
        <>
            <div
                className="fixed flex justify-center left-0 top-0 right-0 bottom-0 z-20 p-8 px-0 overflow-y-auto"
            >
                <div
                    onClick={() => dispatch(hide())}
                    className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-10"></div>
                <div className="relative z-30 m-6 max-w-[475px] w-[calc(100vw-16px)] h-fit lg:h-[700px] bg-white lg:max-w-[1200px] flex flex-col justify-start lg:justify-between lg:flex-row-reverse">
                    <IoMdClose
                        onClick={() => dispatch(hide())}
                        className="absolute top-4 right-4 w-6 h-6 cursor-pointer" />
                    <div
                        style={{
                            backgroundImage: "url('https://trello.com/assets/df0d81969c6394b61c0d.svg')",
                            backgroundRepeat: "no-repeat",
                        }}
                        className="hidden lg:flex w-1/2 h-full pt-[112px] justify-center">
                        <div className="relative">
                            <img src="https://trello.com/assets/d1f066971350650d3346.svg" alt="" />
                        </div>
                    </div>
                    <div
                        className="flex lg:hidden w-full justify-center bg-[#E4F7FA]">
                        <div className="relative">
                            <img src="https://trello.com/assets/d1f066971350650d3346.svg" alt="" />
                        </div>
                    </div>
                    <div className="w-full flex justify-center lg:w-1/2 my-6 px-4 text-text">
                        <div className="w-[388px]">
                            <h2 className="text-2xl font-semibold">Let's build a Workspace</h2>
                            <h3 className="text-base font-normal mt-3 mb-6">Boost your productivity by making it easier for everyone to access boards in one location.</h3>
                            <div
                                className="mt-6">
                                <label className="w-full">
                                    <p className="text-xs font-bold">Worspace name</p>
                                    <input
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                        className="mt-1 rounded-[3px] w-full h-12 py-2 px-3 border-[1.5px] border-gray-300 focus:outline-none focus:border-primary"
                                        placeholder="Enter a name for your workspace"
                                        type="text" />

                                </label>
                                <span className="text-xs font-normal mt-1">This is the name of your company, team or organization.</span>
                            </div>
                            <div
                                className="mt-6">
                                <label className="w-full">
                                    <p className="text-xs font-bold">Workspace description <span className="font-normal">Optional</span> </p>
                                    <textarea
                                        value={workspaceDescription}
                                        onChange={(e) => setWorkspaceDescription(e.target.value)}
                                        name="" id=""
                                        rows={5}
                                        className="mt-1 resize-none rounded-[3px] w-full py-2 px-3 border-[1.5px] border-gray-300 focus:outline-none focus:border-primary"
                                        placeholder="Enter a name for your workspace" />
                                </label>
                                <span className="text-xs font-normal mt-1">Get your members on board with a few words about your Workspace</span>
                            </div>
                            <button
                                onClick={() => addTodoMutation()}
                                className={`mt-3 w-full h-12 rounded ${workspaceName.trim() ? "bg-primary hover:bg-primary-dark text-white " : "bg-gray-100"} flex items-center justify-center text-sm font-medium`}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal