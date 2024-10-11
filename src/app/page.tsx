"use client"
import { getAllWorkspaces } from "@/api/workspaceRequests";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppSelector } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  })


  return (
    <>
      {/* <Sidebar /> */}
      <Header />
      <main className="flex h-[calc(100vh-48px)] items-center justify-between px-64">
        <div className="text-4xl font-medium w-fit mx-auto text-center">
          {
            isLoading ?
              <LoadingSpinner />
              : <>
                {workspaces?.data.length ? "Select a workspace" : "Create a workspace to start the journay"}
              </>
          }
        </div>
      </main>
    </>
  );
}

export default Home
