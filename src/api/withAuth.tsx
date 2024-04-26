"use client"
import { useRouter } from 'next/navigation'

// utility function to check access token in localStorage
const getAccessToken = () => {
    return localStorage.getItem('user_token');
};

// HOC to protect routes
const withAuth = (WrappedComponent: any) => {

    const AuthComponent = (props: any) => {
        const router = useRouter()

        const accessToken = getAccessToken();
        if (!accessToken) {
            localStorage.clear();
            router.push("/login")
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
