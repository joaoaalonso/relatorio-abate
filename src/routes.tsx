import { Routes as ReactRoutes, Route } from 'react-router-dom'

import InvoiceScreen from './screens/Invoices'
import SettingsScreen from './screens/Settings'

import ClientList from './screens/clients/List'
import ClientDetails from './screens/clients/Details'

import SlaughterhouseList from './screens/slaughterhouse/List'
import SlaughterhouseDetails from './screens/slaughterhouse/Details'

function Routes() {
    return (
        <ReactRoutes>
            <Route path='/' element={<InvoiceScreen />} />
            <Route path='/settings' element={<SettingsScreen />} />

            <Route path='/clients' element={<ClientList />} />
            <Route path='/clients/:id' element={<ClientDetails />} />

            <Route path='/slaughterhouses' element={<SlaughterhouseList />} />
            <Route path='/slaughterhouses/:id' element={<SlaughterhouseDetails />} />
        </ReactRoutes>
    )
}

export default Routes