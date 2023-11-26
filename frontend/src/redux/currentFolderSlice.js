import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentFolder: undefined,
    currentFolderId: undefined
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
    }
})

export const { setCurrentFolder, setCurrentFolderId } = currentFolderSlice.actions

export default currentFolderSlice.reducer


