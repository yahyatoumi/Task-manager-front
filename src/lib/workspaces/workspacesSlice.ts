import { createSlice } from "@reduxjs/toolkit";


const initialState: WorkspaceType[] = []

const workspacesSlice = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            return action.payload;
        }
    }
})

export const { setWorkspaces } = workspacesSlice.actions
export default workspacesSlice.reducer