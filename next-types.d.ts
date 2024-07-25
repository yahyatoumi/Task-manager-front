interface Member{
    id: number
    username: string
}

interface Project{
    id: number,
    name: string,
    created_by: Member;
    color: string;
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

interface TaskType{
    id: number;
    name: string;
    description: string;
    created_by: Member;
    assignee: Member;
    due_date: string;
    is_completed: boolean
}

interface SectionType{
    id: number;
    name: string
    tasks: TaskType[]
}

interface CreateProjectDataType {
    room_id: string,
    project_title: string,
    color?: string,
}