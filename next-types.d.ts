interface WorkspaceType{
    id: number;
    name: string;
    color: string;
    owner: {
        id: number;
        username: string;
    };
    is_favorite: boolean
}