interface Member{
    id: number
    username: string
}

interface Project{
    id: number,
    name: string,
    created_by: Member;
    members: Member[]
}

interface WorkspaceType{
    id: number;
    name: string;
    color: string;
    owner: Member;
    projects: Project[];
    members?: Member[];
    is_favorite: boolean
}

interface SectionType{
    id: number;
    name: string
}