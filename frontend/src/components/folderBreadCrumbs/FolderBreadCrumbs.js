import React from 'react'
import './folderBreadCrumbs.css'
import { Breadcrumb, BreadcrumbItem, } from 'reactstrap'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import { Link } from 'react-router-dom'

const FolderBreadCrumbs = ({ currentFolder }) => {
    let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER]

    if (currentFolder) {
        path = [...path, ...currentFolder.path]
    }
    return (
        <Breadcrumb className='breadcrumb'>
            {path.map((folder, index) => (
                <BreadcrumbItem
                    key={folder.id}
                    
                    className="text-truncate d-inline-block">
                    <Link to={folder.id ? `/mystorage/folder/${folder.id}` : '/'} state ={{folder: {...folder, path: path.slice(1, index)}}} className='breadcrumbItem'>
                        {folder.name}
                    </Link> 
                </BreadcrumbItem>
            ))}

            {currentFolder && (
                <BreadcrumbItem
                    // className='text-truncate d-inline-block' 
                    style={{ maxWidth: 200 }}
                    active>
                    <span className='breadcrumbItem'>{currentFolder.name}</span>
                </BreadcrumbItem>
            )}
        </Breadcrumb>
    )
}

export default FolderBreadCrumbs
