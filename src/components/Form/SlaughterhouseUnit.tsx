import swal from 'sweetalert'
import { useForm } from 'react-hook-form'

import Button from '../Button'
import TextField from '../TextField'

import { createSlaughterhouseUnit, editSlaughterhouseUnit, SlaughterhouseUnit } from '../../services/slaughterhouse'

interface SlaughterhouseUnitFormProps {
    slaughterhouseId: number
    slaughterhouseUnit?: SlaughterhouseUnit
    onSave?: (id: number) => void
}

function SlaughterhouseUnitForm({ slaughterhouseId, slaughterhouseUnit, onSave }: SlaughterhouseUnitFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: slaughterhouseUnit
    })

    function onSubmit(data: any) {
        let handler: any = createSlaughterhouseUnit
        let params = { slaughterhouseId, ...data }
        let message = 'Unidade abatedoura cadastrado com sucesso!'

        if (slaughterhouseUnit?.id) {
            handler = editSlaughterhouseUnit
            params = { id: slaughterhouseUnit.id, slaughterhouseId, ...data }
            message = 'Unidade abatedoura atualizado com sucesso!'
        }

        handler(params)
            .then((id: number) => swal('', message, 'success').then(() => id))
            .then((id: number) => { onSave && onSave(id) })
            .catch(swal)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='row'>
                <div className='column'>
                    <TextField name='city' label='Cidade' register={register} errors={errors} required />
                </div>
            </div>

            <div className='row'>
                <div className='column'>
                    <TextField name='state' label='Estado' register={register} errors={errors} required />
                </div>
            </div>

            <div className='row'>
                <Button type='submit' variant='secondary' text={slaughterhouseUnit ? 'Salvar alterações' : 'Cadastrar abatedouro'} />
            </div>
        </form>
    )
}

export default SlaughterhouseUnitForm