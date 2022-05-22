import { Routes as ReactRoutes, Route } from 'react-router-dom'

import InvoiceScreen from './screens/Invoices'
import SettingsScreen from './screens/Settings'

function Routes() {
    return (
        <ReactRoutes>
            <Route path='/' element={<InvoiceScreen />} />
            <Route path='/settings' element={<SettingsScreen />} />
        </ReactRoutes>
    )
}

export default Routes