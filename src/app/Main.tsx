import { useAppSelector } from "@/lib/hooks";
import { Children } from "react";

const Main = (Children: React.ReactNode) => {
    const sidebarState = useAppSelector(state => state.sidebar.value)

    return <div className={`h-[calc(100vh-48px)] w-screen ${sidebarState ? "sm:w-[calc(100vw-256px)]" : "sm:w-[calc(100vw-16px)]"} sm:ml-64`}>
        {Children}
    </div>
}

export default Main