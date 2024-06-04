interface WorkspaceType{
    id: number;
    name: string;
    color: string;
    owner: {
        id: number;
        username: string;
    };
    members?: any[];
    is_favorite: boolean
}