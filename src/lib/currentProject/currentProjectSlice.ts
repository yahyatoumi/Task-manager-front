import { PayloadAction, createSlice } from "@reduxjs/toolkit";



const initialState: Project | null = null

interface TaskWithSectionType {
    data: TaskType,
    sectionId: number
}

const currentProjectSlice = createSlice({
    name: 'currentWorkspace',
    initialState,
    reducers: {
        setCurrentProject: (state, action) => {
            console.log("TATEEEE", action.payload)
            return action.payload;
        },
        updateSections: (state, action: PayloadAction<SectionType[]>) => {
            console.log("oldddd", state, "payloaddd", action.payload)
            if (state){
                return {...state, sections: action.payload}
            }
        }
    }
})

export const { setCurrentProject, updateSections } = currentProjectSlice.actions
export default currentProjectSlice.reducer