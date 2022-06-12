import 'react-responsive-modal/styles.css'

import swal from 'sweetalert'
import { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal'
import { BiEdit, BiPlus, BiTrash } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router-dom'

import Table from '../../components/Table'
import ScreenTemplate from '../../components/ScreenTemplate'
import SlaughterhouseForm from '../../components/Form/Slaughterhouse';
import SlaughterhouseUnitForm from '../../components/Form/SlaughterhouseUnit'

import { 
    deleteSlaughterhouse, 
    getSlaughterhouseById, 
    getSlaughterhouseUnits, 
    deleteSlaughterhouseUnit,
    Slaughterhouse, 
    SlaughterhouseUnit
} from '../../services/slaughterhouse'

function SlaughterhouseDetails() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [unitModalIsOpen, setUnitModalIsOpen] = useState(false)
    
    const [units, setUnits] = useState<SlaughterhouseUnit[]>([])
    const [slaughterhouse, setSlaughterhouse] = useState<Slaughterhouse>()

    const [selectedUnit, setSelectedUnit] = useState<SlaughterhouseUnit>()
    
    const { id } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        fetch()
    }, [id])

    function fetch() {
        if (id) {
            getSlaughterhouseById(parseInt(id)).then(setSlaughterhouse)
            getSlaughterhouseUnits(parseInt(id)).then(setUnits)
        }
    }

    function removeSlaughterhouse() {
        if (!id) return
        swal({
            text: 'Deseja realmente remover esse abatedouro?',
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
                deleteSlaughterhouse(parseInt(id))
                    .then(() => { swal('', 'Abatedouro removido com sucesso!', 'success') })
                    .then(() => navigate('/slaughterhouses'))
                    .catch(swal)
            }
        })
    }

    function renderTopBarButtons() {
        return (
            <div className="row">
                <BiEdit onClick={() => setModalIsOpen(true)} size={25} className='svg-button' />
                <BiTrash onClick={removeSlaughterhouse} size={25} className='svg-button' />
            </div>
        )
    }

    function handleOnSave() {
        fetch()
        resetModal()
    }

    function resetModal() {
        setModalIsOpen(false)
        setUnitModalIsOpen(false)
        setSelectedUnit(undefined)
    }

    function editUnit(unit: SlaughterhouseUnit) {
        setSelectedUnit(unit)
        setUnitModalIsOpen(true)
    }

    function deleteUnit(unit: SlaughterhouseUnit) {
        swal({
            text: 'Deseja realmente remover essa unidade abatedoura?',
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
                deleteSlaughterhouseUnit(unit.id)
                    .then(() => { swal('', 'Unidade abatedoura removida com sucesso!', 'success') })
                    .then(fetch)
                    .catch(swal)
            }
        })
    }

    return (
        <ScreenTemplate
            backLink='/slaughterhouses'
            title='Detalhes do abatedouro'
            rightComponent={renderTopBarButtons()}
        >
            <>
                <p>Nome: {slaughterhouse?.name}</p>
                <Table
                    title='Unidades abatedoura'
                    righComponent={<BiPlus size={25} className='svg-button' onClick={() => setUnitModalIsOpen(true)} />}
                >
                    <>
                        <thead>
                            <tr>
                                <th>Cidade</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map(unit => (
                                <tr key={unit.id}>
                                    <td>{unit.city}</td>
                                    <td>{unit.state}</td>
                                    <td><BiEdit size={15} onClick={() => editUnit(unit)} /></td>
                                    <td><BiTrash size={15} onClick={() => deleteUnit(unit)} /></td>
                                </tr>
                            ))}
                            {!units.length && <tr><td colSpan={3}>Nenhuma unidade abatedoura cadastrada</td></tr>}
                        </tbody>
                    </>
                </Table>
                
                <Modal open={modalIsOpen} onClose={resetModal}>
                    <div style={{ width: 400, padding: 24, paddingTop: 36 }}>
                        <SlaughterhouseForm
                            onSave={handleOnSave}
                            slaughterhouse={slaughterhouse}
                        />
                    </div>
                </Modal>
                {!!slaughterhouse &&
                    <Modal open={unitModalIsOpen} onClose={resetModal}>
                        <div style={{ width: 400, padding: 24, paddingTop: 36 }}>
                            <SlaughterhouseUnitForm
                                onSave={handleOnSave}
                                slaughterhouseId={slaughterhouse.id}
                                slaughterhouseUnit={selectedUnit}
                            />
                        </div>
                    </Modal>
                }
            </>
        </ScreenTemplate>
    )
}

export default SlaughterhouseDetails