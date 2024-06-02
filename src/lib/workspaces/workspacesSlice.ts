import { createSlice } from "@reduxjs/toolkit";


const initialState: WorkspaceType[] = []

const workspacesSlice = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            return action.payload;
        },
        addWorkspaces: (state, action) => {
            return [...state, action.payload]
        },
        removeWorkspace: (state, action) => {
            const newState = state.filter((workspace) => workspace.id !== action.payload.id)
            return newState
        }
    }
})

export const { setWorkspaces, addWorkspaces, removeWorkspace } = workspacesSlice.actions
export default workspacesSlice.reducer