import React from 'react'
import './sidebar.css'
import AddIcon from '@mui/icons-material/Add';
import { SidebarData } from './sidebarData';

const Sidebar = () => {
    return (
        <div className='sidebar_container'>
            <div className="newBtnContainer">
                <AddIcon />

                <span>New</span>
            </div>

            {SidebarData.map((item) => {
                return (
                    <div className='sidebar_item'>
                        <item.icon/>
                        {item.title}
                    </div>
                )
            })}
        </div>
    )
}

export default Sidebar
