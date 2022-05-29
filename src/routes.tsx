import { Routes as ReactRoutes, Route } from 'react-router-dom'

import Clients from './screens/Clients'
import InvoiceScreen from './screens/Invoices'
import SettingsScreen from './screens/Settings'
import Slaughterhouse from './screens/Slaughterhouse'

function Routes() {
    return (
        <ReactRoutes>
            <Route path='/' element={<InvoiceScreen />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/settings' element={<SettingsScreen />} />
            <Route path='/slaughterhouse' element={<Slaughterhouse />} />
        </ReactRoutes>
    )
}

export default Routes