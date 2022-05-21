import { BrowserRouter } from 'react-router-dom'

import './App.css'
import Routes from './routes'
import SideMenu from './components/SideMenu'

function App() {
  return (
    <BrowserRouter>
      <div className='app'>
        <SideMenu />
        <Routes />
      </div>
    </BrowserRouter>
  )
}

export default App
