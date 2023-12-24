import { configureStore } from '@reduxjs/toolkit'
import reducer from './currentFolderSlice'

export const store = configureStore({
  reducer: {
    currentFolder: reducer
  },
})
