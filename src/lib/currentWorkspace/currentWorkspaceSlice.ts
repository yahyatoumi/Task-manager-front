import { createSlice } from "@reduxjs/toolkit";



const initialState: WorkspaceType  = {
    id: 0,
    name: "",
    color: "",
    owner: {
        id: 0,
        username: "",
    },
    members: [],
    is_favorite: false
};

const currentWorkspaceSlice = createSlice({
    name: 'currentWorkspace',
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action) => {
            console.log("TATEEEE", action.payload)
            localStorage.setItem("currentWorkspaceId", action.payload.id.toString())
            return action.payload;
        }
    }
})

export const { setCurrentWorkspace } = currentWorkspaceSlice.actions
export default currentWorkspaceSlice.reducer