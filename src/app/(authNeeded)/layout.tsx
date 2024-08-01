import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Sidebar />
            <Header />
            <main className="h-[calc(100vh-48px)] w-screen sm:w-[calc(100vw-256px)] sm:ml-64">
                {children}
            </main>

        </>
    );
}
