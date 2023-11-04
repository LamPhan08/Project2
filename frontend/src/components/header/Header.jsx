import React, { useState } from 'react'
import './header.css'
import userIcon from '../../assets/images/user.png'
import logo from '../../assets/images/Reporto-Logo.png'
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false)

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu)
  }

  return (
    <div className="header">
      <div className="logo_container">
        <img src={logo} alt="" />

        <span>Reporto</span>
      </div>

      <div className="searchBarContainer">
        <div className="searchBar">
          <SearchIcon className='icon' />

          <input type="text" placeholder='Search in Reporto...' />
        </div>
      </div>

      <div className="avatarContainer" onClick={() => handleOpenMenu()}>
        <img src={userIcon} alt="" />

        <span>Username</span>


      </div>

      <div className={`dropdown_menu ${openMenu ? 'active' : 'inactive'}`}>
          <div className='user_in4_container'>
            <h6>example@gmail.com</h6>

            <img src={userIcon} alt="" />
          </div>

          <h5>Hi Username!</h5>

          <div className="btn_zone">
            <LogoutIcon />

            <span>Logout</span>
          </div>
        </div>
    </div>
  )
}

export default Header
