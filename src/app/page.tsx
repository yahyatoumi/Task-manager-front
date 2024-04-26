"use client"
import withAuth from "@/api/withAuth";

const Home = () => {

  // console.log("GOOOOGLE", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

  return (
    <main className="flex h-full flex-col items-center justify-between">
      homeee
    </main>
  );
}

export default withAuth(Home)
