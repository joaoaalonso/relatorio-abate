import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiSettings } from 'react-icons/fi'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

import './index.css'
import logo from './logo.png'

function SideMenu() {
    const ICON_SIZE = 20

    const [menuIsClosed, setMenuIsClosed] = useState(true)

    return (
        <div className={`side-menu ${menuIsClosed ? 'side-menu-close' : ''}`}>
            <img src={logo} />
            <NavLink to='/'>
                <HiOutlineDocumentReport size={ICON_SIZE} /><span>Relatório</span>
            </NavLink>
            <NavLink to='/settings'>
                <FiSettings size={ICON_SIZE} /><span>Configurações</span>
            </NavLink>
            <div 
                className='side-menu-minimize' 
                onClick={() => { setMenuIsClosed(!menuIsClosed) }}
            >
                {menuIsClosed ? <BiChevronRight size={ICON_SIZE} /> : <BiChevronLeft size={ICON_SIZE} />}
                <span>Minimizar</span>
            </div>
        </div>
    )
}

export default SideMenu