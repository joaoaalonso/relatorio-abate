import 'react-responsive-modal/styles.css';

import swal from 'sweetalert'
import { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal'
import { BiEdit, BiPlus, BiTrash } from 'react-icons/bi'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Table from '../../components/Table'
import RanchForm from '../../components/Form/Ranch'
import ReportCard from '../../components/ReportCard'
import ClientForm from '../../components/Form/Client'
import ScreenTemplate from '../../components/ScreenTemplate'

import { getReportsBy, ReportItem } from '../../services/report'
import { deleteRanch, getRanches, Ranch } from '../../services/ranches'
import { getClientById, deleteClient, Client } from '../../services/clients'

function ClientDetails() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [ranchModalIsOpen, setRanchModalIsOpen] = useState(false)
    
    const [client, setClient] = useState<Client>()
    const [ranches, setRanches] = useState<Ranch[]>([])
    const [reports, setReports] = useState<ReportItem[]>([])

    const [selectedRanch, setSelectedRanch] = useState<Ranch>()

    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetch()
        if (id) {
            getReportsBy('clientId', parseInt(id)).then(setReports)
        }
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
            title: 'Deseja realmente remover o cliente?',
            text: 'Todos os relatórios desse cliente também serão removidos.',
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
            title: 'Deseja realmente remover essa propriedade?', 
            text: 'Os relatórios relacionados a essa propriedade também serão removidos.',
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

    function renderAddress() {
        const addressComponents = []

        if (client?.streetName) addressComponents.push(client.streetName)
        if (client?.streetNumber) addressComponents.push(client.streetNumber)
        if (client?.addressComplement) addressComponents.push(client.addressComplement)
        if (client?.neighborhood) addressComponents.push(client.neighborhood)
        if (client?.postalCode) addressComponents.push(client.postalCode)
        if (client?.city) addressComponents.push(client.city)
        if (client?.state) addressComponents.push(client.state)
        
        return addressComponents.join(', ')
    }

    return (
        <ScreenTemplate
            backLink='/clients'
            title='Detalhes do cliente'
            rightComponent={renderTopBarButtons()}
        >
            <>
                <p>Nome: {client?.name || '-'}</p>
                <p>Endereço: {renderAddress()}</p>
                <p>CPF/CNPJ: {client?.document || '-'}</p>
                <p>Email: {client?.email || '-'}</p>
                <p>Telefone: {client?.phone || '-'}</p>
                <Table 
                    title='Propriedades'
                    righComponent={<BiPlus size={25} className='svg-button' onClick={() => setRanchModalIsOpen(true)} />}
                >
                    <>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Endereço</th>
                                <th>Cidade</th>
                                <th>Estado</th>
                                <th>Inscrição</th>
                                <th>Observações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranches.map(ranch => (
                                <tr key={ranch.id}>
                                    <td>{ranch.name}</td>
                                    <td>{ranch.address}</td>
                                    <td>{ranch.city}</td>
                                    <td>{ranch.state}</td>
                                    <td>{ranch.ie}</td>
                                    <td>{ranch.comments}</td>
                                    <td><BiEdit size={15} onClick={() => editRanch(ranch)} /></td>
                                    <td><BiTrash size={15} onClick={() => removeRanch(ranch)} /></td>
                                </tr>
                            ))}
                            {!ranches.length && <tr><td colSpan={6}>Nenhuma propriedade cadastrada</td></tr>}
                        </tbody>
                    </>
                </Table>

                <p>Relatórios</p>
                {reports.map(report => (
                    <Link key={report.id} to={`/reports/${report.id}`}>
                        <ReportCard report={report} />
                    </Link>
                ))}
                {!reports.length && <p>Nenhum relatório cadastrado</p>}
                
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