import { useEffect, useReducer } from "react"
import { database } from '../firebase/firebase'
import { useAuth } from "../contexts/AuthContext"

const ACTIONS = {
    SELECT_FOLDER: "select-folder",
    UPDATE_FOLDER: "update-folder",
    SET_CHILD_FOLDERS: "set-child-folders",
    SET_CHILD_FILES: "set-child-files",
    SET_REMOVED_FILES: "set-removed-files",
    SET_REMOVED_FOLDERS: "set-removed-folders",
    SET_ALL_FILES: "set-all-files",
    SET_ALL_FOLDERS: "set-all-folders",
}

const reducer = (state, { type, payload }) => {
    switch (type) {
        case ACTIONS.SELECT_FOLDER: {
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFolders: [],
                childFiles: []
            }
        }
        case ACTIONS.UPDATE_FOLDER: {
            return {
                ...state,
                folder: payload.folder
            }
        }
        case ACTIONS.SET_CHILD_FOLDERS: {
            return {
                ...state,
                childFolders: payload.childFolders
            }
        }
        case ACTIONS.SET_CHILD_FILES: {
            return {
                ...state,
                childFiles: payload.childFiles
            }
        }
        case ACTIONS.SET_REMOVED_FILES: {
            return {
                ...state,
                removedFiles: payload.removedFiles
            }
        }
        case ACTIONS.SET_REMOVED_FOLDERS: {
            return {
                ...state,
                removedFolders: payload.removedFolders
            }
        }
        case ACTIONS.SET_ALL_FILES: {
            return {
                ...state,
                allFiles: payload.allFiles
            }
        }
        case ACTIONS.SET_ALL_FOLDERS: {
            return {
                ...state,
                allFolders: payload.allFolders
            }
        }
        default: {
            return state
        }
    }
}

export const ROOT_FOLDER = { name: "My Storage", id: null, path: [] }

export const useFolder = (folderId = null, folder = null) => {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
        removedFolders: [],
        removedFiles: [],
        allFiles: [],
        allFolders: []
    })

    const {currentUser} = useAuth()

    useEffect(() => {
        dispatch({
            type: ACTIONS.SELECT_FOLDER, payload: {
                folderId, folder
            }
        })
    }, [folderId, folder])

    useEffect(() => {
        if (folderId === null) {
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        }

        database.folders
            .doc(folderId)
            .get()
            .then(doc => {
                dispatch({
                    type: ACTIONS.UPDATE_FOLDER,
                    payload: { folder: database.formatDoc(doc) }
                })
            })
            .catch(() => {
                dispatch({
                    type: ACTIONS.UPDATE_FOLDER,
                    payload: { folder: ROOT_FOLDER }
                })
            })
    }, [folderId])

    useEffect(() => {
        return database.folders
          .where("parentId", "==", folderId)
          .where("userId", "==", currentUser.uid)
          .orderBy("createdAt")
          .onSnapshot(snapshot => {
            dispatch({
              type: ACTIONS.SET_CHILD_FOLDERS,
              payload: { childFolders: snapshot.docs.map(database.formatDoc) },
            })
          })
      }, [folderId, currentUser])
    
      useEffect(() => {
        return (
          database.files
            .where("folderId", "==", folderId)
            .where("userId", "==", currentUser.uid)
            .orderBy("createdAt")
            .onSnapshot(snapshot => {
              dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles: snapshot.docs.map(database.formatDoc) },
              })
            })
        )
      }, [folderId, currentUser])
      useEffect(() => {
        return database.removedFolders
          .where("userId", "==", currentUser.uid)
          .orderBy("createdAt")
          .onSnapshot(snapshot => {
            dispatch({
              type: ACTIONS.SET_REMOVED_FOLDERS,
              payload: { removedFolders: snapshot.docs.map(database.formatDoc) },
            })
          })
      }, [currentUser])
      useEffect(() => {
        return (
          database.removedFiles
            .where("userId", "==", currentUser.uid)
            .orderBy("createdAt")
            .onSnapshot(snapshot => {
              dispatch({
                type: ACTIONS.SET_REMOVED_FILES,
                payload: { removedFiles: snapshot.docs.map(database.formatDoc) },
              })
            })
        )
      }, [currentUser])
      useEffect(() => {
        return (
          database.files
            .where("userId", "==", currentUser.uid)
            .onSnapshot(snapshot => {
              dispatch({
                type: ACTIONS.SET_ALL_FILES,
                payload: { allFiles: snapshot.docs.map(database.formatDoc) },
              })
            })
        )
      }, [currentUser])
      useEffect(() => {
        return (
          database.folders
            .where("userId", "==", currentUser.uid)
            .onSnapshot(snapshot => {
              dispatch({
                type: ACTIONS.SET_ALL_FOLDERS,
                payload: { allFolders: snapshot.docs.map(database.formatDoc) },
              })
            })
        )
      }, [currentUser])

    return state
}