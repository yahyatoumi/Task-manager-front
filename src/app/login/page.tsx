
"use client"
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { getGoogleAuthLink } from '@/api/auth';
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";


export default function Login() {
    const [loading, setLoading] = useState(true)
    const [googleUrl, setGoogleUrl] = useState("");
    const router = useRouter()

    const getGoogleLinkHandler = async () => {
        const res = await getGoogleAuthLink();
        if (res.status === 200) {
            setLoading(false);
            
            setGoogleUrl(res.data)
        }
        console.log("RESSSS", res)
    }

    useEffect(() => {
        if (localStorage.getItem("user_token")){
            router.push("/")
        }else{
            getGoogleLinkHandler();
        }
    }, [])

    return (
        <main className="flex min-h-screen bg-background flex-col items-center justify-center">
            {
                loading ?
                    <LoadingSpinner />
                    :
                    <a
                        href={googleUrl}
                        className='p-2 px-24 bg-gray-100 border hover:bg-gray-200 cursor-pointer rounded-full flex items-center justify-between gap-2'>
                        <FcGoogle className='w-6 h-6' />
                        <span>
                            Login with google
                        </span>
                    </a>
            }
        </main>
    );
}
