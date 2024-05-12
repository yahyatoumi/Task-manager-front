import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./counter/counterSlice"
import workspacesReducer from "./workspaces/workspacesSlice"
import workspaceModalReducer from './workspaceModal/workspaceModalSlice'
import currentWorkspaceReducer from './currentWorkspace/currentWorkspaceSlice'
import sidebarReducer from './sidebar/sidebarSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      workspaces: workspacesReducer,
      workspaceModal: workspaceModalReducer,
      currentWorkspace: currentWorkspaceReducer,
      sidebar: sidebarReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']