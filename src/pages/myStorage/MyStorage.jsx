import React, { useEffect } from 'react'
import './myStorage.css'
import Folder from '../../components/folder/Folder'
import File from '../../components/file/File'
import { useFolder } from '../../hooks/useFolder'
import { useParams, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentFolderId, setCurrentFolder } from '../../redux/currentFolderSlice'
import FolderBreadCrumbs from '../../components/folderBreadCrumbs/FolderBreadCrumbs'
import nothing from '../../assets/images/nothing.png'

const MyStorage = () => {
  const { folderId } = useParams()
  const { state } = useLocation()
  const { folder, childFolders, childFiles } = useFolder(folderId, state === null ? null : state.folder)
  // const { folder, childFolders, childFiles } = useFolder(folderId, state.folder)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCurrentFolderId(folderId))
    dispatch(setCurrentFolder(folder))
  }, [folderId, dispatch, folder])

  // console.log('folder:', folder)
  // console.log('childFolder:', childFolders)
  // console.log('childFiles:', childFiles)

  return (
    <div className='myStorageContainer'>
      <FolderBreadCrumbs currentFolder={folder} />

      {childFolders.length === 0 && childFiles.length === 0
        && <div className='nothingWrapper'>
          <img src={nothing} className='nothingImg'/>
          There's nothing here!
        </div>
      }

      {childFolders.length > 0 && <span className='title'>Folders</span>}

      {childFolders.length > 0
        && <div className='d-flex flex-wrap' style={{ gap: '1%', marginTop: 10, marginBottom: 30 }}>
          {childFolders.map(childFolder => (
            <Folder folder={childFolder} key={childFolder.id} />
          ))}
        </div>}

      {/* {childFolders.length > 0 && childFiles.length > 0 && <hr style={{color: 'grey', zIndex: -1}}/>} */}

      {childFiles.length > 0 && <span className='title'>Files</span>}

      {childFiles.length > 0
        && <div className='d-flex flex-wrap' style={{ gap: '1%', marginTop: 10 }}>
          {childFiles.map(childFile => (
            <File file={childFile} key={childFile.id} />
          ))}
        </div>}

    </div>
  )
}

export default MyStorage
