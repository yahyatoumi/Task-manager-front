"use client"
import { getAllWorkspaces } from "@/api/workspaceRequests";
import { useAppSelector } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { data: workspaces } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  })


  return (
    <main className="flex h-full items-center justify-between px-64">
      <div className="text-4xl font-medium w-fit mx-auto text-center">
        {workspaces?.data.length ? "Select a workspace" : "Create a workspace to start the journay"}
      </div>
    </main>
  );
}

export default Home
