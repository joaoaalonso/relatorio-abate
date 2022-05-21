import { Routes as ReactRoutes, Route } from 'react-router-dom'

import ClientsScreen from './screens/Clients'
import InvoiceScreen from './screens/Invoices'
import SettingsScreen from './screens/Settings'
import SlaughterhousesScreen from './screens/Slaughterhouses'

function Routes() {
    return (
        <ReactRoutes>
            <Route path='/' element={<InvoiceScreen />} />
            <Route path='/clients' element={<ClientsScreen />} />
            <Route path='/settings' element={<SettingsScreen />} />
            <Route path='/slaughterhouses' element={<SlaughterhousesScreen />} />
        </ReactRoutes>
    )
}

export default Routes