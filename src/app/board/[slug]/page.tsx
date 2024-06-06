"use client"

import { getSockUuid } from "@/api/auth";
import withAuth from "@/api/withAuth";
import { getSingleProject, getSingleWorkspace } from "@/api/workspaceRequests";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect, useState, memo } from "react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import reorder, { reorderQuoteMap } from "./utils";

interface SingleSectionProps {
    section: SectionType;
    index: number
}

const SingleTAsk = memo((props) => {
    const { quote, isDragging, isGroupedOver, provided, style, isClone, index, task } = props;

    return (
        <div
            isDragging={isDragging}
            isGroupedOver={isGroupedOver}
            isClone={isClone}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            data-is-dragging={isDragging}
            data-testid={task.id}
            data-index={index}
        >
            <div className="w-full h-5">
                {task?.name}
            </div>
        </div>
    );
})

const SingleSection: FC<SingleSectionProps> = ({ section, index }) => {
    return <Draggable draggableId={section.id.toString()} index={index}>
        {(provided, snapshot) => (
            <div //container
                ref={provided.innerRef} {...provided.draggableProps}
                className="w-[272px] min-w-[272px] h-64 bg-[#f0f1f3] rounded shadow rounded-b-lg">
                <div //header
                    isDragging={snapshot.isDragging}
                    className="w-full h-12">
                    <div
                        isDragging={snapshot.isDragging}
                        {...provided.dragHandleProps}
                        aria-label={`${section.name} quote list`}
                        className="w-full h-12 bg-gray-200 rounded-t-lg">

                        {section.name}
                    </div>
                </div>
                <Droppable
                    droppableId={section.id.toString()}
                >
                    {(dropProvided, dropSnapshot) => (
                        <div //list wrapper
                            {...dropProvided.droppableProps}
                            className="w-full h-[calc(100%-48px)]"
                        >
                            <div
                                //list
                                className="w-full h-full overflow-y-scroll p-2"
                            >
                                <div className="">
                                    <div ref={dropProvided.innerRef}>
                                        {
                                            section?.tasks.map((task) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(dragProvided, dragSnapshot) => (
                                                        <div
                                                            key={task.id}
                                                            isDragging={dragSnapshot.isDragging}
                                                            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                                                            provided={dragProvided}
                                                            className="w-full bg-green-900"
                                                        >
                                                            <SingleTAsk
                                                                key={task.id}
                                                                isDragging={dragSnapshot.isDragging}
                                                                isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                                                                provided={dragProvided}
                                                                task={task} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                        {dropProvided.placeholder}
                                    </div>

                                </div>
                            </div>
                        </div>

                    )}
                </Droppable>
            </div>
        )}
    </Draggable>
}


interface SectionsProps {
    boardId: string
}

const Sections: FC<SectionsProps> = ({ boardId }) => {
    const { data } = useQuery({
        queryKey: ["project", boardId],
        queryFn: () => getSingleProject(boardId)
    })
    const [columns, setColumns] = useState<Project[] | null>(null);
    const [ordered, setOrdered] = useState<string[] | null>(null);
    const queryClient = useQueryClient()

    useEffect(() => {
        console.log("ZZZZZ DATA", data.data)
        if (data) {
            setColumns(data.data.sections)
            const ordredArr = data?.data.sections.map((section: SectionType) => section.id.toString())
            console.log("ZZZZZ DATA ordredArr", ordredArr)
            setOrdered(data?.data.sections.map((section: SectionType) => section.id.toString()))
        }
    }, [data])

    const onDragEnd = (result: any) => {
        if (result.combine) {
            if (result.type === "COLUMN") {
                const shallow = [...ordered];
                shallow.splice(result.source.index, 1);
                setOrdered(shallow);
                return;
            }

            const column = columns[result.source.droppableId];
            const withQuoteRemoved = [...column];

            withQuoteRemoved.splice(result.source.index, 1);

            const orderedColumns = {
                ...columns,
                [result.source.droppableId]: withQuoteRemoved
            };
            setColumns(orderedColumns);
            return;
        }

        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // reordering column
        if (result.type === "COLUMN") {
            console.log("ordred", ordered)
            const reorderedorder = reorder(ordered, source.index, destination.index);
            console.log("ordred", ordered)
            const oldData = { ...data?.data, sections: reorderedorder }
            setOrdered(reorderedorder);

            return;
        }

        const newData = reorderQuoteMap({
            quoteMap: columns,
            source,
            destination
        });

        setColumns(newData.quoteMap);
    };

    return data && <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
            droppableId="board"
            type="COLUMN"
            direction="horizontal"
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef} {...provided.droppableProps}
                    className="w-full h-full flex gap-2 p-4">
                    {
                        ordered?.map((key: string, index: number) => (
                            <SingleSection
                                dragginSection={snapshot.isDragging}
                                key={key}
                                index={index}
                                section={data.data.sections.find((section: SectionType) => section.id.toString() === key)} />)
                        )
                    }
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
}

function Page({ params }: { params: { slug: string } }) {
    const { data } = useQuery({
        queryKey: ["project", params.slug],
        queryFn: () => getSingleProject(params.slug)
    })
    const [uuid, setUuid] = useState(localStorage.getItem("sockUuid") || "");

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
        if (!uuid) return;
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/board/${params.slug}/?uuid=${uuid}`);

        socket.onopen = () => {
            console.log("connected to", params.slug);
        };

        socket.onclose = () => {
            console.log("disconnected from", params.slug);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("event received:", data);
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
        data && <main className="h-full w-full bg-green-200 pb-4">
            <div className="h-14 py-3 pl-4 pr-2.5 w-full bg-red-100">

            </div>
            <div className="h-[calc(100%-56px)] overflow-x-auto">
                <Sections boardId={params.slug} />
            </div>
        </main>
    );
}

export default withAuth(Page);