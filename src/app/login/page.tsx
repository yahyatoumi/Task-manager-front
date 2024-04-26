
"use client"
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import jwt from "jsonwebtoken";


export default function Login() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (localStorage.getItem("user_token"))
            router.push("/");
    }, [])

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET

    const googleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            setLoading(true)
            console.log("codeResponse", codeResponse)
            console.log("codeResponse", codeResponse.code)
            const redirectUri = 'http://localhost:3000';
            const code = codeResponse.code; // Replace with the authorization code you received

            const tokenUrl = 'https://oauth2.googleapis.com/token';
            const requestBody = {
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code: code,
                grant_type: 'authorization_code'
            };
            axios.post(tokenUrl, requestBody)
                .then(response => {
                    console.log('Access Token:', response.data.access_token);
                    console.log('Refresh Token:', response.data.refresh_token);
                    console.log('Expires in (seconds):', response.data.expires_in);
                    const tokenDRFUrl = 'http://localhost:8000/google/auth';
                    axios.post(tokenDRFUrl, { access_token: response.data.access_token })
                        .then(response => {
                            console.log("RESSSSS", response)
                            const decodedToken: any = jwt.decode(response.data.access);
                            localStorage.setItem("token_expiration", decodedToken.exp);
                            localStorage.setItem('user_token', response.data.access);
                            localStorage.setItem("refresh_token", response.data.refresh);
                            router.push('/')
                        })
                        .catch(error => {
                            console.error('Error exchanging authorization code for token:', error.response.data.error);
                        });
                })
                .catch(error => {
                    console.error('Error exchanging authorization code for token:', error.response.data.error);
                });
        },
        onError: () => {
            console.error('Google login failed');
        },
        flow: 'auth-code',
        client_id: clientId
        //@ts-ignore
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {
                loading ?
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    <div onClick={googleLogin} className='p-2 px-24 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full flex items-center justify-between gap-2'>
                        <FcGoogle className='w-6 h-6' />
                        <span>
                            Login with google
                        </span>
                    </div>
            }
        </main>
    );
}
