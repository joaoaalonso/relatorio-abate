import swal from 'sweetalert'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Button from '../../components/Button'
import TextField from '../../components/TextField'

import { getAddressFromPostalCode } from '../../services/postalCode'
import { createRanch, editRanch, Ranch } from '../../services/ranches'

interface RanchFormProps {
    clientId: number
    ranch?: Ranch
    onSave?: (id: number) => void
}

function RanchForm({ clientId, ranch, onSave }: RanchFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: ranch
    })

    const watchPostalCode = watch<any>(['postalCode'])

    useEffect(() => {
        if (watchPostalCode?.[0]) {
            handlePostalCodeChange(watchPostalCode[0])
        }
    }, [watchPostalCode])

    function onSubmit(data: any) {
        let handler: any = createRanch
        let params = { clientId, ...data }
        let message = 'Propriedade cadastrado com sucesso!'
        

        if (ranch?.id) {
            handler = editRanch
            params = { id: ranch.id, clientId, ...data }
            message = 'Propriedade atualizada com sucesso!'
        }

        handler(params)
            .then((id: number) => { onSave && onSave(id) })
            .then(() => swal('', message, 'success'))
            .catch(swal)
    }

    function handlePostalCodeChange(postalCode: string) {
        const sanitizedPostalCode = postalCode.replace('_', '').replace('-', '')
        if (sanitizedPostalCode.length === 8) {
            getAddressFromPostalCode(sanitizedPostalCode).then(address => {
                setValue('city', address.city)
                setValue('state', address.state)
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='row'>
                <div className='column'>
                    <TextField name='name' label='Nome' register={register} errors={errors} required />
                </div>
                <div className='column'>
                    <TextField name='postalCode' label='CEP' mask="11111-111" control={control} register={register} errors={errors} required />
                </div>
            </div>
            <div className='row'>
                <div className='column'>
                    <TextField name='address' label='Endereço' register={register} errors={errors} />
                </div>
            </div>

            <div className='row'>
                <div className='column'>
                    <TextField name='city' label='Cidade' register={register} errors={errors} required />
                </div>
                <div className='column'>
                    <TextField name='state' label='Estado' register={register} errors={errors} required />
                </div>
            </div>

            <div className='row'>
                <div className='column'>
                    <TextField name='description' label='Descrição' register={register} errors={errors} />
                </div>
            </div>

            <div className='row'>
                <Button type='submit' variant='secondary' text={ranch ? 'Salvar alterações' : 'Cadastrar propriedade'} />
            </div>
        </form>
    )
}

export default RanchForm