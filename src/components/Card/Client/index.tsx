import './styles.css'

import { Client } from "../../../services/clients"

interface ClientCardProps {
    client: Client
}

function ClientCard({ client }: ClientCardProps) {
    return (
        <div className='client-card'>
            {client.name}
        </div>
    )
}

export default ClientCard