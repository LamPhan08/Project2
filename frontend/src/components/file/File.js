import React from 'react'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const File = ({file}) => {
  return (
    <a href={file.url} target="_blank" className='btn btn-outline-dark'>
      <InsertDriveFileIcon/>

      {file.name}
    </a>
  )
}

export default File
