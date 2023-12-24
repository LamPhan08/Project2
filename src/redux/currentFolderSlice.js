import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentFolder: undefined,
    currentFolderId: undefined,
    loadingCursor: false
}

export const currentFolderSlice = createSlice({
    name: 'currentFolder',
    initialState,
    reducers: {
        setCurrentFolderId: (state, action) => {
            state.currentFolderId = action.payload
        },
        setCurrentFolder: (state, action) => {
            state.currentFolder = action.payload
        },
        setLoadingCursor: (state, action) => {
            state.loadingCursor = action.payload
        }
    }
})

export const { setCurrentFolder, setCurrentFolderId, setLoadingCursor } = currentFolderSlice.actions

export default currentFolderSlice.reducer


