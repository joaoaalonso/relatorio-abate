import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom'

import InvoiceList from './screens/invoices/List'
import InvoiceForm from './screens/invoices/Form'

import ClientList from './screens/clients/List'
import ClientDetails from './screens/clients/Details'

import SlaughterhouseList from './screens/slaughterhouse/List'
import SlaughterhouseDetails from './screens/slaughterhouse/Details'

import SettingsScreen from './screens/Settings'

function Routes() {
    return (
        <ReactRoutes>
            <Route path='/invoices' element={<InvoiceList />} />
            <Route path='/invoices/add' element={<InvoiceForm />} />

            <Route path='/clients' element={<ClientList />} />
            <Route path='/clients/:id' element={<ClientDetails />} />

            <Route path='/slaughterhouses' element={<SlaughterhouseList />} />
            <Route path='/slaughterhouses/:id' element={<SlaughterhouseDetails />} />
            
            <Route path='/settings' element={<SettingsScreen />} />

            <Route path='*' element={<Navigate to='/invoices' />} />
        </ReactRoutes>
    )
}

export default Routes