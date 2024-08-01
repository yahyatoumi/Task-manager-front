
"use client"
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import jwt from "jsonwebtoken";
import { authWithGoogle } from "@/api/auth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";


export default function Login() {
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const loginWithGoogleHandler = async () => {
        const res = await authWithGoogle();
        console.log("XXOXOXOXO", res.status)
        if (res.status !== 201) {
            router.push("/login")
        } else {
            console.log(res);
            const decodedToken: any = jwt.decode(res.data.access);
            localStorage.setItem("token_expiration", decodedToken.exp);
            localStorage.setItem('user_token', res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            localStorage.setItem("user_email", res.data.user.email)
            localStorage.setItem("user_username", res.data.user.username)
            localStorage.setItem("user_id", res.data.user.id)
            router.push("/")
        }
    }

    useEffect(() => {
        loginWithGoogleHandler();
    }, [])

    return (
        <main className="flex min-h-[calc(100vh-48px)] bg-background flex-col items-center justify-center sm:pr-64">
            {
                loading &&
                <LoadingSpinner />
            }
        </main>
    );
}
