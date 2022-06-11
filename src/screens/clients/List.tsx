import 'react-responsive-modal/styles.css';

import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import { BiPlus } from 'react-icons/bi'
import { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal'

import ScreenTemplate from '../../components/ScreenTemplate'

import { getClients, Client } from '../../services/clients'
import ClientForm from '../../components/Form/Client';

function ClientList() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [clients, setClients] = useState<Client[]>([])

    useEffect(() => {
        fetch()
    }, [])

    function fetch() {
        getClients()
            .then(setClients)
            .catch(swal)
    }

    function handleOnSave() {
        setModalIsOpen(false)
        fetch()
    }

    return (
        <ScreenTemplate
            title='Clientes'
            rightComponent={<BiPlus onClick={() => setModalIsOpen(true)} size={25} className='svg-button' />}
        >
            <>
                {clients.map(client => (
                    <Link key={client.id} to={`/clients/${client.id}`}>
                        <span>{client.name}</span>
                    </Link>
                ))}
                {!clients.length && <p>Nenhum cliente cadastrado</p>}
                <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                    <div style={{ width: 400, padding: 24, paddingTop: 36 }}>
                        <ClientForm onSave={handleOnSave} />
                    </div>
                </Modal>
            </>
        </ScreenTemplate>
    )
}

export default ClientList