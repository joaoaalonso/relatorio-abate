import swal from 'sweetalert'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Button from '../../components/Button'
import TextField from '../../components/TextField'

import { getAddressFromPostalCode } from '../../services/postalCode'
import { Client, createClient, editClient } from '../../services/clients'

interface ClientFormProps {
    client?: Client
    onSave?: (id: number) => void
}

function ClientForm({ client, onSave }: ClientFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: client
    })

    const watchPostalCode = watch('postalCode')

    useEffect(() => {
        if (watchPostalCode) {
            handlePostalCodeChange(watchPostalCode)
        }
    }, [watchPostalCode])

    function onSubmit(data: any) {
        let handler: any = createClient
        let params = data
        let message = 'Cliente cadastrado com sucesso!'
        

        if (client?.id) {
            handler = editClient
            params = { id: client.id, ...data }
            message = 'Cliente atualizado com sucesso!'
        }

        handler(params)
            .then((id: number) => { onSave && onSave(id) })
            .then(() => swal('', message, 'success'))
            .catch(swal)
    }

    function handlePostalCodeChange(postalCode: string) {
        if (client && client.postalCode == postalCode) return
        const sanitizedPostalCode = postalCode.replace('_', '').replace('-', '')
        if (sanitizedPostalCode.length === 8) {
            getAddressFromPostalCode(sanitizedPostalCode).then(address => {
                setValue('city', address.city)
                setValue('state', address.state)
                setValue('streetName', address.streetName)
                setValue('neighborhood', address.neighborhood)
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
                    <TextField name='streetName' label='Endereço' register={register} errors={errors} />
                </div>
                <div className='column'>
                    <TextField name='streetNumber' label='Número' register={register} errors={errors} />
                </div>
            </div>


            <div className='row'>
                <div className='column'>
                    <TextField name='neighborhood' label='Bairro' register={register} errors={errors} />
                </div>

                <div className='column'>
                    <TextField name='addressComplement' label='Complemento' register={register} errors={errors} />
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
                    <TextField name='document' label='CPF/CNPJ' register={register} errors={errors} />
                </div>
                <div className='column'>
                    <TextField name='phone' label='Telefone' register={register} errors={errors} />
                </div>
            </div>

            <div className='row'>
                <div className='column'>
                    <TextField name='email' label='Email' register={register} errors={errors} />
                </div>
            </div>

            <div className='row'>
                <Button type='submit' variant='secondary' text={client ? 'Salvar alterações' : 'Cadastrar cliente'} />
            </div>
        </form>
    )
}

export default ClientForm