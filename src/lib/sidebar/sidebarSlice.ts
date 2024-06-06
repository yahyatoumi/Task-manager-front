import { createSlice } from "@reduxjs/toolkit";

interface sidebarType {
    value: boolean;
}


const initialState: sidebarType = {
    value: localStorage.getItem('sidebar') !== 'hidden'
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        display() {
            localStorage.setItem('sidebar', 'visible')
            return {
                value: true
            }
        },
        hide() {
            localStorage.setItem('sidebar', 'hidden')
            return {
                value: false
            }
        }
    }
})

export const { display, hide } = sidebarSlice.actions
export default sidebarSlice.reducer