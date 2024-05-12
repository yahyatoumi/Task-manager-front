import { createSlice } from "@reduxjs/toolkit";

interface WorkspaceModalType {
    value: boolean;
}

const initialState: WorkspaceModalType = {
    value: false
}

const workspaceModalSlice = createSlice({
    name: 'workspaceModal',
    initialState,
    reducers: {
        display() {
            return {
                value: true
            }
        },
        hide() {
            return {
                value: false
            }
        }
    }
})

export const { display, hide } = workspaceModalSlice.actions
export default workspaceModalSlice.reducer