"use client"
import { useAppSelector } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'
import { getAllWorkspaces } from './workspaceRequests';

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
        const currentWorkspace = localStorage.getItem("currentWorkspace")
        if (!currentWorkspace){
            router.push("/")
        }
        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
