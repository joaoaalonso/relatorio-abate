import 'react-responsive-modal/styles.css'

import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import { BiPlus } from 'react-icons/bi'
import { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal'

import Card from '../../components/Card'
import TextField from '../../components/TextField'
import ScreenTemplate from '../../components/ScreenTemplate'
import SlaughterhouseForm from '../../components/Form/Slaughterhouse'

import { getSlaughterhouses, Slaughterhouse } from '../../services/slaughterhouse'

function SlaugtherhouseList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [slaughterhouses, setSlaughterhouses] = useState<Slaughterhouse[]>([])

    useEffect(() => {
        fetch()
    }, [])

    function fetch() {
        getSlaughterhouses()
            .then(setSlaughterhouses)
            .catch(swal)
    }

    function handleOnSave() {
        setModalIsOpen(false)
        fetch()
    }

    function getFilteredSlaughterhouses() {
        return slaughterhouses.filter(slaughterhouse => {
            return slaughterhouse.name.toLowerCase().includes(searchTerm.toLowerCase())
        })
    }


    return (
        <ScreenTemplate
            title='Abatedouros'
            noBackground
            rightComponent={<BiPlus size={25} onClick={() => setModalIsOpen(true)} className='svg-button' />}
        >
            <>
                <TextField placeholder='Pesquisar' onChange={setSearchTerm} />

                {getFilteredSlaughterhouses().map(slaughterhouse => (
                    <Link key={slaughterhouse.id} to={`/slaughterhouses/${slaughterhouse.id}`}>
                        <Card text={slaughterhouse.name} />
                    </Link>
                ))}

                {!slaughterhouses.length && <p>Nenhum abatedouro cadastrado</p>}
                {!!slaughterhouses.length && !getFilteredSlaughterhouses().length && <p>Nenhum abatedouro encontrado</p>}

                <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                    <div style={{ width: 400, padding: 24, paddingTop: 36 }}>
                        <SlaughterhouseForm onSave={handleOnSave} />
                    </div>
                </Modal>
            </>
        </ScreenTemplate>
    )
}

export default SlaugtherhouseList