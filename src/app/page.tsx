"use client"
import withAuth from "@/api/withAuth";
import { getAllWorkspaces } from "@/api/workspaceRequests";
import { useAppSelector } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const {data: workspaces} = useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces
  })

  return (
    <main className="flex h-full flex-col items-center justify-between">
      <div className="">
        {workspaces?.data.length ? "Select a workspace" : "Create a workspace to start the journay"}
      </div>
    </main>
  );
}

export default withAuth(Home)
