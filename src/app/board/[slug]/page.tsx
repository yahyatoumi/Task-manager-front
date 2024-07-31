"use client"

import { getSockUuid } from "@/api/auth";
import { getSingleProject, getSingleWorkspace } from "@/api/workspaceRequests";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect, useState, memo, useRef, FormEvent, KeyboardEvent } from "react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import reorder, { reorderQuoteMap } from "./utils";
import {
    draggable,
    dropTargetForElements,
    monitorForElements

} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
// import {
//     dropTargetForFiles,
// } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
    attachClosestEdge,
    Edge,
    extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import autoScroller from "@atlaskit/pragmatic-drag-and-drop-auto-scroll";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import invariant from "tiny-invariant";
import { createNewTask } from "@/api/taskRequests";
import { BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { addTaskToCurrentProject, setCurrentProject, updateSections } from "@/lib/currentProject/currentProjectSlice";
import { useAppSelector } from "@/lib/hooks";


interface SingleSectionProps {
    section: SectionType;
    socket: WebSocket | null;

}

interface SingleTaskProps {
    task: TaskType;
    prevSiblingId: number;
    socket: WebSocket | null;
}

const CutsomCardDropIndicator = ({ edge, gap, height }) => {

    return <div
        className="w-full absolute left-0 right-0 bg-gray-200 rounded-xl"
        style={{
            [edge]: `-${gap}`,
            height: height || "56px"
        }} ></div>;
};

const SingleTAsk: FC<SingleTaskProps> = memo(({ task }) => {
    console.log("RORORORORORRO", task)
    const ref = useRef(null);
    const [dragging, setDragging] = useState<boolean>(false); // NEW
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const taskDivRef = useRef<HTMLDivElement | null>(null);
    const [taskDivHeight, setTaskDivHeight] = useState<number>(0);


    useEffect(() => {
        const el = ref.current;

        return combine(
            draggable({
                element: el!,
                getInitialData: () => ({ type: "card", itemId: task.itemId }),
                onDragStart: () => setDragging(true), // NEW
                onDrop: () => setDragging(false), // NEW
            }),
            dropTargetForElements({
                element: el!,
                onDragEnter: (e) => {
                    console.log("drag enter", e)
                    setIsDraggedOver(true)
                },
                onDragLeave: () => setIsDraggedOver(false),
                onDrop: () => setIsDraggedOver(false),
            }),
            dropTargetForElements({
                element: ref.current!,
                canDrop: (args) => args.source.data.type === "card",
                getIsSticky: () => true,
                getData: ({ input, element }) => {
                    const data = { type: "card", itemId: task.itemId };

                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ["top", "bottom"],
                    });
                },
                onDragEnter: (args) => {
                    if (args.source.data.itemId !== task.itemId) {
                        setClosestEdge(extractClosestEdge(args.self.data));
                    } else {
                        setClosestEdge(null);
                    }
                },
                onDrag: (args) => {
                    if (args.source.data.itemId !== task.itemId) {
                        setClosestEdge(extractClosestEdge(args.self.data));
                    } else {
                        setClosestEdge(null);
                    }
                },
                onDragLeave: () => {
                    setClosestEdge(null);
                },
                onDrop: () => {
                    setClosestEdge(null);
                },
            })
        )
    }, []);

    useEffect(() => {
        if (closestEdge) {
            console.log("closestEdge", closestEdge)
        }
    }, [closestEdge])

    useEffect(() => {
        if (taskDivRef.current) {
            setTaskDivHeight(taskDivRef.current.clientHeight);
            console.log("HHHEIGHT", taskDivRef.current.clientHeight)
        }
    }, [task])

    return (
        <div
            ref={ref}
            className="w-full relative"
        >
            <div
                style={{
                    marginTop: closestEdge && closestEdge === "top" ? `${taskDivHeight + 8}px` : "",
                    marginBottom: closestEdge && closestEdge === "bottom" ? `${taskDivHeight + 8}px` : "",
                    boxShadow: "0px 1px 1px #091e4240, 0px 0px 1px #091e424f",
                }}
                ref={taskDivRef}
                className={`w-full rounded-lg px-3 pt-2 pb-1 bg-white ${dragging ? "hidden" : ""}`}>
                <span className="mb-1 w-full break-words">
                    {task.name}
                </span>
            </div>
            {
                dragging && <div className="w-full flex justify-center py-2">Prev position</div>
            }
            {closestEdge && <CutsomCardDropIndicator edge={closestEdge} gap={`${0}px`} height={taskDivHeight} />}
        </div>
    );
})

const NewTaskInput = ({ setDisplayNewTaskInput, displayNewTaskInput, socket, section }) => {
    const titleRef = useRef<HTMLTextAreaElement>(null)
    const dispatch = useDispatch()
    const currentProject = useAppSelector(state => state.currentProject)

    const handleSend = () => {
        socket?.send(JSON.stringify({ type: "new_task", data: "hororororo" }))
        console.log("send")
    }

    const handleCreateNewTask = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        console.log("sectiiiion bbb", section)
        const res = await createNewTask({
            name: titleRef.current?.value,
            section_id: section.columnId
        })
        if (res && res.status === 201) {
            console.log("neeeerrr", res)
            const taskWithSection = {
                section: Number(section.columnId),
                data: (res.data)
            }
            const newSections = currentProject?.sections.map((sec: SectionType) => {
                if (sec.id === Number(section.columnId)) {
                    return {
                        ...sec,
                        tasks: [...sec.tasks, res.data]
                    }
                }
                return sec
            })
            dispatch(updateSections(newSections))
        }
        setDisplayNewTaskInput(false)
        console.log("ressssx", res)
    }

    const handleEnterClick = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleCreateNewTask()
        }
    }

    return <div className={`w-full p-2 ${displayNewTaskInput ? "min-h-[100px]" : "h-11"}`}>
        {
            displayNewTaskInput ? <form
                onSubmit={handleCreateNewTask}
                className="text-sm">
                <textarea
                    ref={titleRef}
                    autoFocus
                    onKeyDown={handleEnterClick}
                    placeholder="Enter name for this card..."
                    className="w-full resize-none rounded-lg shadow px-3 py-2 placeholder:font-normal font-medium"
                    name=""
                    id=""
                    rows={1}
                ></textarea>
                <div className="flex items-center gap-2 mt-2">
                    <button
                        type="submit"
                        className="h-8 px-3 text-white rounded bg-primary hover:bg-primary-dark"
                    >
                        Add Card
                    </button>
                    <button
                        onClick={() => setDisplayNewTaskInput(!displayNewTaskInput)}
                        type="button"
                        className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded">
                        <IoClose className="w-5 h-5" />
                    </button>
                </div>
            </form>
                :
                <div
                    onClick={() => setDisplayNewTaskInput(!displayNewTaskInput)}
                    className="flex cursor-pointer items-center gap-2 w-full py-2 px-3 h-8 rounded-xl hover:bg-gray-300 text-sm font-medium">
                    <BiPlus className="w-5 h-5" />
                    <span>Add a card</span>
                </div>
        }
    </div>
}

const SingleSection: FC<SingleSectionProps> = memo(({ section, socket }) => {
    const columnId = section?.columnId;
    const columnRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const cardListRef = useRef<HTMLDivElement | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const [hoverOnList, setHoverOnList] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [displayNewTaskInput, setDisplayNewTaskInput] = useState<boolean>(false);


    useEffect(() => {

        return combine(
            draggable({
                element: columnRef.current!,
                dragHandle: headerRef.current!,
                getInitialData: () => ({ columnId, type: 'column' }),
                onDragStart: () => setIsDragging(true),
                onDrop: () => setIsDragging(false),
            }),
            dropTargetForElements({
                element: cardListRef.current!,
                getData: () => ({ columnId }),
                canDrop: args => args.source.data.type === 'card',
                getIsSticky: () => true,
                onDragEnter: () => setIsDraggingOver(true),
                onDragLeave: () => setIsDraggingOver(false),
                onDragStart: () => setIsDraggingOver(true),
                onDrop: () => setIsDraggingOver(false),
            }),
            dropTargetForElements({
                element: columnRef.current!,
                canDrop: args => args.source.data.type === 'column',
                getIsSticky: () => true,
                getData: ({ input, element }) => {
                    const data = {
                        columnId,
                    };
                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ['left', 'right'],
                    });
                },
                onDragEnter: args => {
                    setClosestEdge(extractClosestEdge(args.self.data));
                },
                onDrag: args => {
                    setClosestEdge(extractClosestEdge(args.self.data));
                },
                onDragLeave: () => {
                    setClosestEdge(null);
                },
                onDrop: () => {
                    setClosestEdge(null);
                },
            }),
        );
    }, [columnId]);

    // w-[272px] bg-red-100 h-full
    // max-h-full flex flex-col w-full p-4 bg-black
    // w-full h-12 bg-gray-100
    // overflow-y-auto w-full fle fle-col gap-2
    // w-full h-20 bg-blue-200
    // h-24 bg-yellow-200

    console.log("clossss", closestEdge)

    return <div //container
        ref={columnRef}
        onMouseEnter={() => setHoverOnList(true)}
        onMouseLeave={() => setHoverOnList(false)}
        className={`w-[272px] min-w-[272px] ${isDragging && "hidden"} h-full`}>
        <div className="w-full flex flex-col max-h-full pb-1 shadow bg-[#f1f2f4] rounded-xl">
            <div
                data-testid={`column-${columnId}--header`}
                ref={headerRef}
                className="w-full h-10 min-h-10 px-5 text-sm font-semibold flex items-center">
                {section?.title}
            </div>
            <div
                ref={cardListRef}
                style={{
                    maxHeight: displayNewTaskInput ? "calc(100% - 100px)" : "calc(100% - 44px)",
                    scrollbarWidth: "thin",
                }}
                className={`w-full flex flex-col gap-2 overflow-y-auto px-3 py-1`}>
                {
                    section?.items.map((task, index) => (
                        <SingleTAsk key={task.itemId} task={task} prevSiblingId={index > 0 ? section?.items[index - 1].id : 0} />
                    ))
                }
            </div>
            {/* <div className="px-3">
                {closestEdge && (
                    <DropIndicator edge={closestEdge} gap={`${8}px`} />
                )}
            </div> */}
            <NewTaskInput setDisplayNewTaskInput={setDisplayNewTaskInput} displayNewTaskInput={displayNewTaskInput} socket={socket} section={section} />
        </div>
    </div>
})


interface SectionsProps {
    boardId: string,
    socket: WebSocket | null;
}

function arraysEqual(arr1: string[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i].toString()) return false;
    }
    return true;
}

const compaireTasks = (arr1: any, arr2: any) => {
    for (let i = 0; i < arr1.length; i++) {
        const columnId = arr1[i].columnId
        const currentProjectSection = arr2.find(section => section.id.toString() === columnId)
        const items = arr1[i].items
        const tasks = currentProjectSection.tasks
        if (items.length !== tasks.length)
            return false
        console.log("checkkkkkk", columnId, currentProjectSection, items, tasks)
    }
    for (let i = 0; i < arr1.length; i++) {
        const columnId = arr1[i].columnId
        const currentProjectSection = arr2.find(section => section.id.toString() === columnId)
        const items = arr1[i].items
        const tasks = currentProjectSection.tasks
        for (let j = 0; j < items.length; j++) {
            console.log("checkkkkkinggg", items[j], tasks[j], tasks[j].id.toString() !== items[j].itemId)
            if (tasks[j].id.toString() !== items[j].itemId) {
                return false
            }
        }
        console.log("checkkkkkk", columnId, currentProjectSection, items, tasks)
    }
    return true
}

const Sections: FC<SectionsProps> = memo(({ boardId, socket }) => {
    const currentProjectState = useAppSelector(state => state.currentProject)
    // const queryClient = useQueryClient()
    const [data, setData] = useState<{
        columnMap: SectionType[];
        orderedColumnIds: string[];
    } | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);

    const [isCustomAutoScrollEnabled, setIsCustomAutoScrollEnabled] = useState(
        false
    );
    const isInitialRender = useRef(true);

    useEffect(() => {
        console.log("ddddfadata", data)
        console.log("ddddfadata currentProject", currentProjectState)
        if (data && socket) {
            if (isInitialRender.current) {
                // Skip the first render
                isInitialRender.current = false;
                return;
            }
            const sectionsIds = data.orderedColumnIds
            const currentProjectsectionsIds = currentProjectState?.sections?.map(section => section.id)
            const sections = Object.values(data.columnMap).map(value => {
                return value
            })
            const postSections = sections.map(section => {
                return section.items
            })
            const tasks = [];
            for (let i = 0; i < postSections.length; i++) {
                for (let j = 0; j < postSections[i].length; j++) {
                    const task = {
                        taskId: postSections[i][j].itemId,
                        sectionId: sections[i].columnId,
                        order: j
                    }
                    tasks.push(task)
                }
            }
            console.log("ddddfadata idsss", sectionsIds, sections, tasks)
            const postData = {
                projectId: currentProjectState?.id,
                sectionsIds: sectionsIds,
                tasks: tasks
            }
            console.log("checkkkk", sections, arraysEqual(data.orderedColumnIds, currentProjectsectionsIds), compaireTasks(sections, currentProjectState?.sections))
            if (!arraysEqual(data.orderedColumnIds, currentProjectsectionsIds) || !compaireTasks(sections, currentProjectState?.sections))
                socket?.send(JSON.stringify(postData))
        }
    }, [data])

    useEffect(() => {
        if (currentProjectState) {
            const sections = currentProjectState?.sections;
            const columnMap: { [key: string]: { title: string, columnId: string, items: any[] } } = {};
            const orderedColumnIds: string[] = [];

            sections.forEach((section) => {
                const sectionId = section.id.toString();
                columnMap[sectionId] = {
                    title: section.name,
                    columnId: sectionId,
                    items: section.tasks.map((task) => {
                        return {
                            itemId: task.id.toString(),
                            name: task.name,
                            title: task.name,
                            role: task.name
                        };
                    })
                };
                orderedColumnIds.push(sectionId);
            });
            console.log("dddddd", columnMap, orderedColumnIds)
            setData({
                columnMap: columnMap,
                orderedColumnIds: orderedColumnIds
            })
        }
    }, [currentProjectState])

    const reorderSender = (data: any) => {
        const columns = data.orderedColumnIds;
        const sections = data.columnMap;

        console.log("will send", columns, sections)
    }

    useEffect(() => {
        invariant(ref.current);
        return combine(
            //   monitorForFiles({
            //     onDragStart: (args) => console.log("start:file", args.source.items),
            //     onDrop: (args) => console.log("drop:file", args.source.items)
            //   }),
            monitorForElements({
                onDragStart({ location }) {
                    if (isCustomAutoScrollEnabled) {
                        // autoScroller.start({ input: location.current.input });
                    }
                },
                onDrag({ location }) {
                    if (isCustomAutoScrollEnabled) {
                        // autoScroller.updateInput({ input: location.current.input });
                    }
                },
                onDrop(args) {

                    if (isCustomAutoScrollEnabled) {
                        // autoScroller.stop();
                    }

                    const { location, source } = args;
                    // didn't drop on anything
                    if (!location.current.dropTargets.length) {
                        return;
                    }
                    // need to handle drop

                    // 1. remove element from original position
                    // 2. move to new position

                    if (!data) return;

                    if (source.data.type === "column") {
                        console.log("herrrrroo", source, location)
                        const startIndex: number = data.orderedColumnIds.findIndex(
                            (columnId) => columnId === source.data.columnId
                        );

                        const target = location.current.dropTargets[0];
                        const indexOfTarget: number = data.orderedColumnIds.findIndex(
                            (id) => id === target.data.columnId
                        );
                        const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                            target.data
                        );
                        console.log("herrrrroo2", startIndex, target, indexOfTarget, closestEdgeOfTarget)


                        const updated = reorderWithEdge({
                            list: data.orderedColumnIds,
                            startIndex,
                            indexOfTarget,
                            closestEdgeOfTarget,
                            axis: "horizontal"
                        });
                        console.log("reordering column", data, { ...data, orderedColumnIds: updated })
                        reorderSender({ ...data, orderedColumnIds: updated });
                        setData({ ...data, orderedColumnIds: updated });
                    }
                    // Dragging a card
                    if (source.data.type === "card") {
                        const itemId = source.data.itemId;
                        console.log("source 1", source)
                        invariant(typeof itemId === "string");
                        console.log("source 2", source)

                        // TODO: these lines not needed if item has columnId on it
                        const [, startColumnRecord] = location.initial.dropTargets;
                        const sourceId = startColumnRecord.data.columnId;
                        invariant(typeof sourceId === "string");
                        const sourceColumn = data.columnMap[sourceId];
                        const itemIndex = sourceColumn.items.findIndex(
                            (item) => item.itemId === itemId
                        );
                        const item: Item = sourceColumn.items[itemIndex];
                        console.log("source 3", sourceColumn, itemIndex, item)

                        if (location.current.dropTargets.length === 1) {
                            console.log("source 41", source)

                            const [destinationColumnRecord] = location.current.dropTargets;
                            const destinationId = destinationColumnRecord.data.columnId;
                            invariant(typeof destinationId === "string");
                            const destinationColumn = data.columnMap[destinationId];
                            invariant(destinationColumn);

                            // reorderinngg in same column
                            if (sourceColumn === destinationColumn) {
                                const updated = reorderWithEdge({
                                    list: sourceColumn.items,
                                    startIndex: itemIndex,
                                    indexOfTarget: sourceColumn.items.length - 1,
                                    closestEdgeOfTarget: null,
                                    axis: "vertical"
                                });
                                const updatedMap = {
                                    ...data.columnMap,
                                    [sourceColumn.columnId]: {
                                        ...sourceColumn,
                                        items: updated
                                    }
                                };
                                console.log("reordering", data, { ...data, columnMap: updatedMap });
                                reorderSender({ ...data, columnMap: updatedMap });
                                setData({ ...data, columnMap: updatedMap });
                                console.log("moving card to end position in same column", {
                                    startIndex: itemIndex,
                                    destinationIndex: updated.findIndex(
                                        (i) => i.itemId === itemId
                                    ),
                                    edge: null
                                });
                                return;
                            }

                            // moving to a new column
                            const updatedMap = {
                                ...data.columnMap,
                                [sourceColumn.columnId]: {
                                    ...sourceColumn,
                                    items: sourceColumn.items.filter((i) => i.itemId !== itemId)
                                },
                                [destinationColumn.columnId]: {
                                    ...destinationColumn,
                                    items: [...destinationColumn.items, item]
                                }
                            };
                            console.log("reordering", data, { ...data, columnMap: updatedMap });
                            reorderSender({ ...data, columnMap: updatedMap });
                            setData({ ...data, columnMap: updatedMap });
                            console.log("moving card to end position of another column", {
                                startIndex: itemIndex,
                                destinationIndex: updatedMap[
                                    destinationColumn.columnId
                                ].items.findIndex((i) => i.itemId === itemId),
                                edge: null
                            });
                            return;
                        }

                        // dropping in a column (relative to a card)
                        if (location.current.dropTargets.length === 2) {
                            console.log("source 42", source)
                            const [
                                destinationCardRecord,
                                destinationColumnRecord
                            ] = location.current.dropTargets;
                            console.log("extracting", location.current.dropTargets, location)
                            const destinationColumnId = destinationColumnRecord.data.columnId;
                            invariant(typeof destinationColumnId === "string");
                            const destinationColumn = data.columnMap[destinationColumnId];

                            const indexOfTarget = destinationColumn.items.findIndex(
                                (item) => item.itemId === destinationCardRecord.data.itemId
                            );
                            console.log("-1111", destinationColumn, destinationCardRecord.data.itemId, indexOfTarget);
                            const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                                destinationCardRecord.data
                            );

                            // case 1: ordering in the same column
                            if (sourceColumn === destinationColumn) {
                                console.log("same same", sourceColumn, itemIndex, indexOfTarget, closestEdgeOfTarget)
                                const updated = reorderWithEdge({
                                    list: sourceColumn.items,
                                    startIndex: itemIndex,
                                    indexOfTarget,
                                    closestEdgeOfTarget,
                                    axis: "vertical"
                                });
                                const updatedSourceColumn: ColumnType = {
                                    ...sourceColumn,
                                    items: updated
                                };
                                const updatedMap: ColumnMap = {
                                    ...data.columnMap,
                                    [sourceColumn.columnId]: updatedSourceColumn
                                };
                                console.log("dropping relative to card in the same column", {
                                    startIndex: itemIndex,
                                    destinationIndex: updated.findIndex(
                                        (i) => i.itemId === itemId
                                    ),
                                    closestEdgeOfTarget
                                });
                                console.log("reordering", data, { ...data, columnMap: updatedMap })
                                reorderSender({ ...data, columnMap: updatedMap });
                                setData({ ...data, columnMap: updatedMap });
                                return;
                            }

                            // case 2: moving into a new column relative to a card

                            const updatedSourceColumn: ColumnType = {
                                ...sourceColumn,
                                items: sourceColumn.items.filter((i) => i !== item)
                            };
                            const updated: Item[] = Array.from(destinationColumn.items);
                            const destinationIndex =
                                closestEdgeOfTarget === "bottom"
                                    ? indexOfTarget + 1
                                    : indexOfTarget;
                            updated.splice(destinationIndex, 0, item);

                            const updatedDestinationColumn: ColumnType = {
                                ...destinationColumn,
                                items: updated
                            };
                            const updatedMap: ColumnMap = {
                                ...data.columnMap,
                                [sourceColumn.columnId]: updatedSourceColumn,
                                [destinationColumn.columnId]: updatedDestinationColumn
                            };
                            console.log("dropping on a card in different column", {
                                sourceColumn: sourceColumn.columnId,
                                destinationColumn: destinationColumn.columnId,
                                startIndex: itemIndex,
                                destinationIndex,
                                closestEdgeOfTarget
                            });
                            console.log("reordering", data, { ...data, columnMap: updatedMap })
                            reorderSender({ ...data, columnMap: updated });
                            setData({ ...data, columnMap: updatedMap });
                        }
                    }
                }
            })
        );
    }, [data, isCustomAutoScrollEnabled]);


    return currentProjectState &&
        <div
            ref={ref}
            className="absolute left-0 right-0 top-0 bottom-0 flex gap-2 py-2">
            {/* {
                columns?.map((section: SectionType, index: number) => (
                    <SingleSection
                        key={section.id}
                        section={section} />)
                )
            } */}

            {data?.orderedColumnIds.map((columnId: string) => {
                console.log("INDEX", columnId, data, data.columnMap[columnId])
                return <SingleSection section={data.columnMap[columnId]} key={columnId} socket={socket} />;
            })}

        </div>
})

function Page({ params }: { params: { slug: string } }) {
    const { data } = useQuery({
        queryKey: ["project", params.slug],
        queryFn: () => getSingleProject(params.slug),
    })
    const [uuid, setUuid] = useState(localStorage.getItem("sockUuid") || "");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const dispatch = useDispatch();
    const currentProjectState = useAppSelector(state => state.currentProject)


    const getNewUuid = async () => {
        if (uuid) return;
        const res = await getSockUuid();
        if (res) {
            setUuid(res.data.uuid)
        } else {
            toast.error("Oops, error accured...")
        }
    }

    useEffect(() => {
        getNewUuid();
    }, [])

    useEffect(() => {
        if (data?.status === 200) {
            dispatch(setCurrentProject(data.data))
            console.log('pppprdaaa', data.data)
        }
    }, [data])

    useEffect(() => {
        if (!uuid) return;
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/board/${params.slug}/?uuid=${uuid}`);
        setSocket(socket);

        socket.onopen = () => {
            console.log("connected to", params.slug);
        };

        socket.onclose = () => {
            console.log("disconnected from", params.slug);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("event received:", data);

            if (data && data.type === "section_update") {
                console.log("event received:", event);
                dispatch(setCurrentProject(data.project))
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            toast.error("WebSocket connection error");
        };

        return () => {
            socket.close();
        };
    }, [params.slug, uuid]);

    return (
        currentProjectState && <main
            style={{
                backgroundColor: currentProjectState?.color + "44"
            }}
            className="h-full w-full p-4">
            <div className="h-14 py-3 pl-4 pr-2.5 w-full bg-red-100">

            </div>
            <div className="h-[calc(100%-56px)] overflow-x-auto overflow-y-hidden relative">
                <Sections boardId={params.slug} socket={socket} />
            </div>
        </main>
    );
}

export default Page