import 'react-responsive-modal/styles.css';

import swal from 'sweetalert'
import { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal'
import { BiEdit, BiTrash } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router-dom'

import ScreenTemplate from '../../components/ScreenTemplate'
import SlaughterhouseForm from '../../components/Form/Slaughterhouse';
import SlaughterhouseUnitForm from '../../components/Form/SlaughterhouseUnit';

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
                <p>{JSON.stringify(slaughterhouse)}</p>
                {units.map(unit => (
                    <div key={unit.id}>
                        <p>{JSON.stringify(unit)}</p>
                        <button onClick={() => editUnit(unit)}>edit</button>
                        <button onClick={() => deleteUnit(unit)}>delete</button>
                    </div>
                ))}
                <button onClick={() => setUnitModalIsOpen(true)}>Adicionar unidade</button>
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