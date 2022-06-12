import 'react-responsive-modal/styles.css'

import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import { BiPlus } from 'react-icons/bi'
import { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal'

import ScreenTemplate from '../../components/ScreenTemplate'

import TextField from '../../components/TextField'
import ClientForm from '../../components/Form/Client'
import ClientCard from '../../components/Card/Client'
import { getClients, Client } from '../../services/clients'

function ClientList() {
    const [searchTerm, setSearchTerm] = useState('')
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

    function getFilteredClients() {
        return clients.filter(client => {
            return client.name.toLowerCase().includes(searchTerm.toLowerCase())
        })
    }

    return (
        <ScreenTemplate
            title='Clientes'
            noBackground
            rightComponent={<BiPlus onClick={() => setModalIsOpen(true)} size={25} className='svg-button' />}
        >
            <>
                <TextField placeholder='Pesquisar' onChange={setSearchTerm} />
                
                {getFilteredClients().map(client => (
                    <Link key={client.id} to={`/clients/${client.id}`}>
                        <ClientCard client={client} />
                    </Link>
                ))}
                
                {!clients.length && <p>Nenhum cliente cadastrado</p>}
                {!!clients.length && !getFilteredClients().length && <p>Nenhum cliente encontrado</p>}

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