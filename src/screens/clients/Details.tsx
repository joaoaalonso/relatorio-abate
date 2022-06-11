import 'react-responsive-modal/styles.css';

import swal from 'sweetalert'
import { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal'
import { BiEdit, BiTrash } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router-dom'

import ClientForm from '../../components/Form/Client';
import ScreenTemplate from '../../components/ScreenTemplate'

import { getClientById, deleteClient, Client } from '../../services/clients'
import { deleteRanch, getRanches, Ranch } from '../../services/ranches'
import RanchForm from '../../components/Form/Ranch';

function ClientDetails() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [ranchModalIsOpen, setRanchModalIsOpen] = useState(false)
    
    const [client, setClient] = useState<Client>()
    const [ranches, setRanches] = useState<Ranch[]>([])

    const [selectedRanch, setSelectedRanch] = useState<Ranch>()

    const { id } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        fetch()
    }, [id])

    function fetch() {
        if (id) {
            getClientById(parseInt(id)).then(setClient)
            getRanches(parseInt(id)).then(setRanches)
        }
    }

    function removeClient() {
        if (!id) return
        swal({
            text: 'Deseja realmente remover o cliente?',
            icon: 'warning',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'Não'
                },
                confirm: {
                    text: 'Sim',
                },
            },
            dangerMode: true,
        })
        .then(confirm => {
            if (confirm) {
                deleteClient(parseInt(id))
                    .then(() => { swal('', 'Cliente removido com sucesso!', 'success') })
                    .then(() => navigate('/clients'))
                    .catch(swal)
            }
        })
    }

    function renderTopBarButtons() {
        return (
            <div className="row">
                <BiEdit onClick={() => setModalIsOpen(true)} size={25} className='svg-button' />
                <BiTrash onClick={removeClient} size={25} className='svg-button' />
            </div>
        )
    }

    function handleOnSave() {
        fetch()
        resetModal()
    }

    function resetModal() {
        setModalIsOpen(false)
        setRanchModalIsOpen(false)
        setSelectedRanch(undefined)
    }

    function editRanch(ranch: Ranch) {
        setSelectedRanch(ranch)
        setRanchModalIsOpen(true)
    }

    function removeRanch(ranch: Ranch) {
        swal({
            text: 'Deseja realmente remover essa propriedade?',
            icon: 'warning',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'Não'
                },
                confirm: {
                    text: 'Sim',
                },
            },
            dangerMode: true,
        })
        .then(confirm => {
            if (confirm) {
                deleteRanch(ranch.id)
                    .then(() => { swal('', 'Propriedade removida com sucesso!', 'success') })
                    .then(fetch)
                    .catch(swal)
            }
        })
    }

    return (
        <ScreenTemplate
            backLink='/clients'
            title='Detalhes do cliente'
            rightComponent={renderTopBarButtons()}
        >
            <>
                <p>{JSON.stringify(client)}</p>
                {ranches.map(ranch => (
                    <div key={ranch.id}>
                        {JSON.stringify(ranch)}
                        <button onClick={() => editRanch(ranch)}>edit</button>
                        <button onClick={() => removeRanch(ranch)}>delete</button>
                    </div>
                ))}
                <button onClick={() => setRanchModalIsOpen(true)}>Adicionar propriedade</button>
                <Modal open={modalIsOpen} onClose={resetModal}>
                    <div style={{ width: 400, padding: 24, paddingTop: 36 }}>
                        <ClientForm
                            onSave={handleOnSave}
                            client={client}
                        />
                    </div>
                </Modal>
                {!!client &&
                    <Modal open={ranchModalIsOpen} onClose={resetModal}>
                        <div style={{ width: 400, padding: 24, paddingTop: 36 }}>
                            <RanchForm
                                onSave={handleOnSave}
                                clientId={client.id}
                                ranch={selectedRanch}
                            />
                        </div>
                    </Modal>
                }
            </>
        </ScreenTemplate>
    )
}

export default ClientDetails