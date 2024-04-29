import { createSlice } from "@reduxjs/toolkit";



const initialState: WorkspaceType[] = []

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            return action.payload;
        }
    }
})

export const { setWorkspaces } = counterSlice.actions
export default counterSlice.reducer