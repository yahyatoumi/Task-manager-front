import { createSlice } from "@reduxjs/toolkit";

interface sidebarType {
    value: boolean;
}

const isBrowser = typeof window !== 'undefined';

const initialState: sidebarType = {
    value: isBrowser ? localStorage.getItem('sidebar') !== 'hidden' : true,
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