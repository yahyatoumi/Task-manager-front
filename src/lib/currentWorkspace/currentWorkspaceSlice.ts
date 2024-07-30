import { PayloadAction, createSlice } from "@reduxjs/toolkit";



const initialState: WorkspaceType  = {
    id: 0,
    name: "",
    color: "",
    owner: {
        id: 0,
        username: "",
    },
    members: [],
    is_favorite: false,
    projects: []
};

const currentWorkspaceSlice = createSlice({
    name: 'currentWorkspace',
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action: PayloadAction<WorkspaceType>) => {
            console.log("TATEEEE", action.payload)
            localStorage.setItem("currentWorkspaceId", action.payload.id.toString())
            return action.payload;
        },
        setCurrentWorkspaceProjects : (state, action) => {
            console.log("olddd", {...state, projects: state.projects})
            console.log("newww", {...state, projects: action.payload})
            return {...state, projects: [...state.projects, action.payload]}
        }
    }
})

export const { setCurrentWorkspace, setCurrentWorkspaceProjects } = currentWorkspaceSlice.actions
export default currentWorkspaceSlice.reducer