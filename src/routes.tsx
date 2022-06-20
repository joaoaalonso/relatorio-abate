import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom'

import ReportList from './screens/reports/List'
import ReportForm from './screens/reports/Form'

import ClientList from './screens/clients/List'
import ClientDetails from './screens/clients/Details'

import SlaughterhouseList from './screens/slaughterhouse/List'
import SlaughterhouseDetails from './screens/slaughterhouse/Details'

import SettingsScreen from './screens/Settings'

function Routes() {
    return (
        <ReactRoutes>
            <Route path='/reports' element={<ReportList />} />
            <Route path='/reports/add' element={<ReportForm />} />
            <Route path='/reports/:id' element={<ReportForm />} />

            <Route path='/clients' element={<ClientList />} />
            <Route path='/clients/:id' element={<ClientDetails />} />

            <Route path='/slaughterhouses' element={<SlaughterhouseList />} />
            <Route path='/slaughterhouses/:id' element={<SlaughterhouseDetails />} />
            
            <Route path='/settings' element={<SettingsScreen />} />

            <Route path='*' element={<Navigate to='/reports' />} />
        </ReactRoutes>
    )
}

export default Routes