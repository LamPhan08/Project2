import React, {useEffect} from 'react'
import Header from '../header/Header'
import Sidebar from '../sidebar/Sidebar'
import Routers from '../../router/Routers'
import './layout.css'
import { useAuth } from '../../contexts/AuthContext'

const Layout = () => {
  const {login} = useAuth()
  

  // console.log("FolderId", folderId)
  // console.log("Folder", folder)

  useEffect(() => {
    async function _login () {
      try {
        await login('nhatlampr@gmail.com', '123456')
      }
      catch(err) {
        console.log(err)
      }
    }

    _login()
  }, [login])

  return (
    <div className='layout_container'>
      <Header />
      
      <div className='main_container'>
          <Sidebar/>

          <div className="main_content">
            <Routers />
          </div>
      </div>
    </div>
  )
}

export default Layout
