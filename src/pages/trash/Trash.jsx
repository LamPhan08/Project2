import React from 'react'
import './trash.css'
import { useFolder } from '../../hooks/useFolder'
import RemovedFolder from '../../components/removedFolder/RemovedFolder'
import nothing from '../../assets/images/nothing.png'
import RemovedFile from '../../components/removedFile/RemovedFile'

const Trash = () => {
  const { removedFiles, removedFolders } = useFolder(null, null)

  console.log(removedFolders?.length)

  return (
    <div className='trashContainer'>
      <p className='heading'>Trash</p>  

      {removedFolders?.length === 0 && removedFiles?.length === 0
        && <div className='nothingWrapper'>
          <img src={nothing} className='nothingImg' alt=''/>
          There's nothing here!
        </div>
      }

      {removedFolders?.length > 0 && <span className='title'>Folders</span>}

      {removedFolders?.length > 0
        && <div className='d-flex flex-wrap' style={{ gap: '1%', marginTop: 10, marginBottom: 30 }}>
          {removedFolders.map(removedFolder => (
            <RemovedFolder folder={removedFolder} key={removedFolder.id} />
          ))}
        </div>}

      {removedFolders?.length > 0 && removedFiles?.length > 0 && <hr style={{color: 'grey', zIndex: -1}}/>}

      {removedFiles?.length > 0 && <span className='title'>Files</span>}

      {removedFiles?.length > 0
        && <div className='d-flex flex-wrap' style={{ gap: '1%', marginTop: 10 }}>
          {removedFiles.map(removedFile => (
            <RemovedFile file={removedFile} key={removedFile.id} />
          ))}
        </div>}
    </div>
  )
}

export default Trash
