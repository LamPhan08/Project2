import React, { useState } from 'react'
import './header.css'
import userIcon from '../../assets/images/user.png'
import logo from '../../assets/images/Reporto-Logo.png'
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const {currentUser, logout} = useAuth()
  const navigate = useNavigate()
  const {pathname} = useLocation()

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu)
  }

  const handleLogout = async () => {
    await logout()

    navigate('/login')
  }

  return (
    <div className="header">
      <div className="logo_container" onClick={() => navigate('/')}>
        <img src={logo} alt="" />

        <span>Reporto</span>
      </div>

      {pathname !== '/text-editor' && <div className="searchBarContainer">
        <div className="searchBar">
          <SearchIcon className='icon' fontSize='medium'/>

          <input type="text" placeholder='Search in Reporto...' />
        </div>
      </div>}

      <div className="avatarContainer" onClick={() => handleOpenMenu()}>
        <img src={userIcon} alt="" />

        <span className='email'>{currentUser.email}</span>


      </div>

      <div className={`dropdown_menu ${openMenu ? 'active' : 'inactive'}`}>
          <div className='user_in4_container'>
            <h6>{currentUser.email}</h6>

            <img src={userIcon} alt="" />
          </div>

          <h5>Hello!</h5>

          <div className="btn_zone" onClick={handleLogout}>
            <LogoutIcon />

            <span>Logout</span>
          </div>
        </div>
    </div>
  )
}

export default Header
