import swal from 'sweetalert'
import { useForm } from 'react-hook-form'

import Button from '../Button'
import TextField from '../TextField'

import { createSlaughterhouse, editSlaughterhouse, Slaughterhouse } from '../../services/slaughterhouse'

interface SlaughterhouseFormProps {
    slaughterhouse?: Slaughterhouse
    onSave?: (id: number) => void
}

function SlaughterhouseForm({ slaughterhouse, onSave }: SlaughterhouseFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: slaughterhouse
    })

    function onSubmit(data: any) {
        let handler: any = createSlaughterhouse
        let params = data
        let message = 'Abatedouro cadastrado com sucesso!'

        if (slaughterhouse?.id) {
            handler = editSlaughterhouse
            params = { id: slaughterhouse.id, ...data }
            message = 'Abatedouro atualizado com sucesso!'
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
                    <TextField name='name' label='Nome' register={register} errors={errors} required />
                </div>
            </div>

            <div className='row'>
                <Button type='submit' variant='secondary' text={slaughterhouse ? 'Salvar alterações' : 'Cadastrar abatedouro'} />
            </div>
        </form>
    )
}

export default SlaughterhouseForm