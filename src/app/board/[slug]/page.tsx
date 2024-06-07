"use client"

import { getSockUuid } from "@/api/auth";
import withAuth from "@/api/withAuth";
import { getSingleProject, getSingleWorkspace } from "@/api/workspaceRequests";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect, useState, memo, useRef } from "react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import reorder, { reorderQuoteMap } from "./utils";
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface SingleSectionProps {
    section: SectionType;
}

const SingleTAsk = (props) => {
    const ref = useRef(null);
    const [dragging, setDragging] = useState<boolean>(false); // NEW
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    useEffect(() => {
        const el = ref.current;

        const dragHandle = draggable({
            element: el!,
            onDragStart: () => setDragging(true), // NEW
            onDrop: () => setDragging(false), // NEW
        });

        const dropTarget = dropTargetForElements({
            element: el!,
            onDragEnter: (e) => {
                console.log("drag enter", e)
                setIsDraggedOver(true)
            },
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: () => setIsDraggedOver(false),
        });

        return () => {
            dragHandle()
            dropTarget()
        }
    }, []);

    return (
        <div
            ref={ref}
            className={`${isDraggedOver ? "pt-16" : "pt-2"}`}>
            <div
                className={`w-full h-14 ${dragging ? "opacity-10 bg-black" : "bg-white"}`}>
                {props?.task.name}
            </div>
        </div>
    );
}

const SingleSection: FC<SingleSectionProps> = ({ section }) => {
    return <div //container
        className="w-[272px] min-w-[272px] h-64 bg-[#f0f1f3] rounded shadow rounded-b-lg">
        <div className="w-full h-12 bg-green-100">
            {section.name}
        </div>
        {
            section?.tasks.map((task, index) => (
                <SingleTAsk key={task.id} task={task} />
            ))
        }
    </div>
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

    return data && <div>
        <div
            className="w-full h-full flex gap-2 p-4">
            {
                data.data.sections?.map((section: SectionType, index: number) => (
                    <SingleSection
                        key={section.id}
                        section={section} />)
                )
            }
        </div>
    </div>
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