"use client"
import { creatProject, getProjectInWorkspace } from "@/api/projectRequests"
import { getAllWorkspaces, getSingleWorkspace } from "@/api/workspaceRequests"
import { setCurrentWorkspace, setCurrentWorkspaceProjects } from "@/lib/currentWorkspace/currentWorkspaceSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FC, MouseEvent, useEffect, useRef, useState } from "react"
import { FaRegStar, FaStar } from "react-icons/fa6"
import { FiLock, FiUserPlus } from "react-icons/fi"
import { GoPencil } from "react-icons/go"
import { IoMdClose } from "react-icons/io"
import { IoChevronDown } from "react-icons/io5"
import { LuSearch } from "react-icons/lu"
import { useDispatch } from "react-redux"

interface BoardsHeaderProps {
    workspace: WorkspaceType
}

const BoardsHeader: FC<BoardsHeaderProps> = ({ workspace }) => {
    return <div className="w-full h-[124px] flex items-center">
        <div className="w-full max-w-[912px] flex items-center justify-between p-8 bg-redr-50 mx-auto">
            <div className="flex gap-2.5">
                <div className="min-w-[60px] h-[60px] rounded bg-primary text-white flex items-center justify-center text-[35px] font-bold capitalize">
                    {workspace?.name.charAt(0)}
                </div>
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold text-text capitalize">{workspace?.name}</span>
                        <GoPencil className="cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-1">
                        <FiLock className="w-3 h-3" />
                        <span className="text-text text-xs font-normal">Private</span>
                    </div>
                </div>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-3 px-3 py-1.5 rounded">
                <FiUserPlus />
                <span className="text-sm font-medium">Invite Workspace members</span>
            </button>
        </div>
    </div>
}

const sortOptions = [
    "Most recently active",
    "Least recently active",
    "Alphabetically A-Z",
    "Alphabetically Z-A"
]

const SortBySelect = () => {
    const [sortBy, setSortBy] = useState(0);
    const [displayOptions, setDisplayOptions] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = (e: any) => {
        const clickedElement = e.target
        if (optionsRef && !optionsRef.current?.contains(clickedElement))
            setDisplayOptions(false);
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [])

    return <div className="w-[200px] relative text-sm font-normal">
        <span className="text-xs font-bold">Sort by</span>
        <div
            ref={optionsRef}
            className="w-full">
            <div
                onClick={() => setDisplayOptions(!displayOptions)}
                className={`w-full py-2 px-3 rounded mt-1 h-9 flex items-center justify-between cursor-pointer outline ${displayOptions ? "outline-2 outline-focus" : "outline-1 outline-text"}`}>
                <span>
                    {sortOptions[sortBy]}
                </span>
                <IoChevronDown />
            </div>
            {
                displayOptions && <div className="absolute top-[calc(100%+4px)] rounded left-0 w-full shadow overflow-hidden bg-white z-10">
                    {
                        sortOptions.map((option, index) => <div
                            key={index}
                            onClick={() => { setSortBy(index); setDisplayOptions(false) }}
                            className={`w-full ${index === sortBy ? "text-primary bg-blue-200" : "hover:bg-blue-100"} px-3 py-2 cursor-pointer`}>
                            {option}
                        </div>)
                    }
                </div>
            }
        </div>
    </div>
}

const SearchInput = () => {
    return <div className="w-[250px] relative text-sm font-normal">
        <span className="text-xs font-bold">Search</span>
        <div className="w-full h-9 relative flex items-center mt-1">
            <LuSearch className="absolute left-2 top-1/2 -mt-2" />
            <input
                className="w-full h-full py-2 bg-background pl-8 pr-3 outline outline-text outline-1 focus:outline-2 focus:outline-focus rounded text-sm"
                placeholder="Search boards"
                type="text" />
        </div>
    </div >
}

interface NewBoardPopupProps {
    hide: () => void;
    workspaceId: string;
}

const colors = [
    "#44403c",
    "#0e7490",
    "#4338ca",
    "#a21caf",
    "#e11d48",
]

const NewBoardPopup: FC<NewBoardPopupProps> = ({ hide, workspaceId }) => {
    const popupRef = useRef<HTMLDivElement>(null)
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [titleValue, setTitleValue] = useState("")
    const queryClient = useQueryClient();
    const dispatch = useDispatch()

    const { mutateAsync: addProject } = useMutation({
        mutationFn: () => creatProject({
            room_id: workspaceId,
            project_title: titleValue,
            color: selectedColor,
        }),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["workspaceProjects", workspaceId] });
            dispatch(setCurrentWorkspaceProjects(res?.data))
        },
    });

    // const mutation = useMutation((newProject: CreateProjectDataType) => creatProject(newProject), {
    //     onSuccess: () => {
    //         // Invalidate or refetch the projects query to update the project list
    //         queryClient.invalidateQueries('projects');
    //     },
    // });

    const handleClickOutside = (e: any) => {
        const clickedElement = e.target
        if (popupRef.current && !popupRef.current.contains(clickedElement)) {
            hide();
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [])

    return <div
        ref={popupRef}
        className="absolute z-10 right-0 lg:left-[calc(100%+4px)] shadow rounded-md top-0 bg-white w-[304px] p-3">
        <div className="w-full flex items-center justify-center relative">
            <span className="text-sm font-semibold">Creat board</span>
            <IoMdClose
                onClick={hide}
                className="absolute right-0 top-1/2 -mt-2 cursor-pointer" />
        </div>
        <div
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1715963433657-559b3ea01e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDF8MzE3MDk5fHx8fHwyfHwxNzE3NTI0NDM3fA&ixlib=rb-4.0.3&q=80&w=400")'
            }}
            className="w-[200px] h-[120px] bg-cover bg-no-repeat bg-center bg-red-100 mx-auto mt-3 flex items-center justify-center">
            <img src="https://trello.com/assets/14cda5dc635d1f13bc48.svg" alt="" />
        </div>
        <div className="mt-5">
            <span className="text-xs font-bold">Background</span>
            <div className="w-full flex gap-2 mt-1">
                {
                    colors.map((color) => <div
                        key={color}
                        style={{
                            backgroundColor: color
                        }}
                        onClick={() => setSelectedColor(color)}
                        className={`w-full cursor-pointer h-8 rounded-lg ${selectedColor === color && "outline outline-4 outline-blue-500 shadow"}`}></div>)
                }
            </div>
        </div>
        <div className="mt-4 w-full">
            <p className="text-xs font-bold">Board title <span className="text-error">*</span></p>
            <input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                className="py-2 bg-background p-3 mt-1 outline outline-text outline-1 focus:outline-2 focus:outline-focus rounded text-sm w-full"
                type="text" />
        </div>
        <div className="mt-5 w-full relative">
            <button
                onClick={() => addProject()}
                className={`w-full h-8 flex items-center justify-center ${titleValue.trim() ? "text-white bg-primary hover:bg-primary-dark cursor-pointer" : "bg-gray-100 text-gray-200 cursor-not-allowed"}`}>
                create
            </button>
        </div>
    </div>
}

const ProjectCard = ({ project }) => {
    const router = useRouter()


    const handleMakeFavorite = (e: MouseEvent<SVGElement, globalThis.MouseEvent>) => {
        e.stopPropagation();
        console.log("will make favorite");
    };

    return <div key={project.id} className="w-full md:w-1/2 lg:w-1/4 h-24 py-1 px-2">
        <div
            style={{ backgroundColor: project.color }}
            className="group h-full text-white capitalize cursor-pointer flex p-2 text-sm font-semibold rounded relative"
        >
            {project?.name}
            <div
                onClick={(e) => {
                    if (e.target instanceof SVGElement) {
                        e.preventDefault();
                    } else {
                        router.push(`/board/${project.id}`)
                    }
                }}
                className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex items-end justify-end p-2"
            >
                <FaRegStar onClick={handleMakeFavorite} className="w-5 h-5" />
            </div>
        </div>
    </div>
}

const BoardMainProjects = ({ workspaceId }: { workspaceId: string }) => {
    const [displayNewBoardPopup, setDisplayNewBoardPopup] = useState(false)
    const { data } = useQuery({
        queryKey: ["workspaceProjects", workspaceId],
        queryFn: () => getProjectInWorkspace(workspaceId),
    })
    const [projects, setProjects] = useState<Project[]>([])
    const currentWorkspaceState = useAppSelector(state => state.currentWorkspace)
    const dispatch = useAppDispatch()

    useEffect(() => {
        console.log("dataaaa", data)
        if (data) {
            setProjects(data.data)

        }
    }, [data])

    useEffect(() => {
        console.log("cuuuurrrrrt", currentWorkspaceState)
    }, [currentWorkspaceState])


    return <div className="w-full">
        <div className="flex flex-wrap w-full ">
            <div className="w-full md:w-1/2 lg:w-1/4 h-24 py-1 px-2 relative rounded">
                <div
                    onClick={() => setDisplayNewBoardPopup(!displayNewBoardPopup)}
                    className="bg-gray-100 h-full hover:bg-gray-200 cursor-pointer flex items-center justify-center text-sm font-normal">
                    create new board
                </div>
                {
                    displayNewBoardPopup && <NewBoardPopup hide={() => setDisplayNewBoardPopup(false)} workspaceId={workspaceId} />
                }
            </div>
            {
                projects?.map(project => {
                    return <ProjectCard project={project} />
                })
            }
        </div>

    </div>
}

const BoardsMain = ({ workspaceId }: { workspaceId: string }) => {

    return <div className="w-full max-w-[1330px] mx-auto p-8">
        <h2 className="font-semibold text-xl text-text">Boards</h2>
        <div className="w-full flex items-center mt-[30px]">
            <div className="w-full flex flex-col gap-2 lg:flex-row justify-between">
                <SortBySelect />
                <SearchInput />
            </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-6 -mx-2">
            <BoardMainProjects workspaceId={workspaceId} />
        </div>
    </div>
}

function Page({ params }: { params: { slug: string } }) {
    const dispatch = useAppDispatch();
    const { data } = useQuery({
        queryKey: ["workspace", params.slug],
        queryFn: () => getSingleWorkspace(params.slug),
    })

    useEffect(() => {
        if (data) {
            console.log("DDDTTT", data)
            dispatch(setCurrentWorkspace(data.data))
        }
    }, [data])

    return data && <main className="h-full">
        <BoardsHeader workspace={data.data} />
        <hr className="w-[95%] mx-auto" />
        <BoardsMain workspaceId={params.slug} />
    </main>
}

export default Page
