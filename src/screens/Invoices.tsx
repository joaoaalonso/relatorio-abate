import swal from 'sweetalert'
import formatDate from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { save } from '@tauri-apps/api/dialog'
import { BiPlus, BiTrash } from 'react-icons/bi'

import Table from '../components/Table'
import Button from '../components/Button'
import Select from '../components/Select'
import Photos from '../components/Photos'
import Loading from '../components/Loading'
import TextField from '../components/TextField'
import DatePicker from '../components/DatePicker'
import { getSettings } from '../services/settings'
import ScreenTemplate from '../components/ScreenTemplate'

import generateReport from '../services/generateReport'

function Invoices() {
    const [loading, setLoading] = useState(false)
    const [isFemale, setIsFemale] = useState(true)

    const [maturidade, setMaturidade] = useState<any[]>([{ type: '', value: '' }])
    const [acabamento, setAcabamento] = useState<any[]>([{ type: '', value: '' }])
    const [escoreRuminal, setEscoreRuminal] = useState<any[]>([{ type: '', value: '' }])
    const [fetos, setFetos] = useState<any[]>([{ type: '', value: '' }])
    const [premiacoes, setPremiacoes] = useState<any[]>([{ type: '', value: '' }])

    const [dif, setDif] = useState<any[]>([{ seq: '', type: '', value: '' }])
    const [hematomas, setHematomas] = useState<any[]>([{ seq: '', type: '', value: '' }])

    const [fotos, setFotos] = useState<string[]>([])

    const [discounts, setDiscounts] = useState<string[]>([])
    const [fetalSizes, setFetalSizes] = useState<string[]>([])
    
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            data: new Date(),
        }
    })

    const watchSex = watch<any>(['sexo'])

    useEffect(() => {
        setIsFemale(watchSex[0] === 'F')
    }, [watchSex])

    useEffect(() => {
        getSettings()
            .then(settings => {
                setDiscounts(settings.discounts.map(d => d.name))
                setFetalSizes(Object.keys(settings.fetalAges))
            })
    }, [])

    function parseNumber(number: string) {
        return parseFloat(number.replace(',', '.'))
    }

    function onSubmit(data: any) {
        const input = {
            ...data,
            data: formatDate(data.data, 'dd/MM/yyyy', { locale: ptBr }),
            dataCriacao: formatDate(data.dataCriacao, 'dd/MM/yyyy', { locale: ptBr }),
            dataRevisao: formatDate(data.dataRevisao, 'dd/MM/yyyy', { locale: ptBr }),
            valorArroba: data.valorArroba ? parseNumber(data.valorArroba) : '',
            adicionalPrecoce: JSON.parse(data.adicionalPrecoce),
            PV: parseNumber(data.PV),
            PC: parseNumber(data.PC),
            pesoVacina: parseNumber(data.pesoVacina),
            maturidade,
            acabamento,
            escoreRuminal,
            fetos,
            dif,
            hematomas,
            fotos,
            premiacoes
        }
        
        save({
            title: 'Onde deseja salvar o relatório?',
            defaultPath: `${input.proprietario.toLowerCase()} ${input.data.replaceAll('/', '-')} ${input.sexo}.pdf`,
            filters: [{name: 'PDF', extensions: ['pdf']}]
        })
        .then(path => {
            if (!path) return false
            setLoading(true)
            return generateReport(input, path)
        })
        .then(success => {
            success && swal('', 'Relatório gerado com sucesso!', 'success')
        })
        .catch(e => {
            swal('', 'Ocorreu um erro ao gerar o relatório!', 'error')
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function resetForm() {
        setIsFemale(true)
        setMaturidade([{ type: '', value: '' }])
        setAcabamento([{ type: '', value: '' }])
        setEscoreRuminal([{ type: '', value: '' }])
        setFetos([{ type: '', value: '' }])
        setDif([{ seq: '', type: '', value: '' }])
        setHematomas([{ seq: '', type: '', value: '' }])
        setFotos([])
    }

    function addTableRow(table: any[], setTable: any, threeColumns: boolean = false) {
        if (threeColumns) {
            setTable([...table, { seq: '', type: '', value: '' }])
        } else {
            setTable([...table, { type: '', value: '' }])
        }
    }

    function removeTableRow(table: any[], setTable: any, index: number, threeColumns: boolean = false) {
        let newTable = table.filter((_, i) => i !== index)
        if (!newTable.length) {
            if (threeColumns) {
                newTable = [{ seq: '', type: '', value: '' }]
            } else {
                newTable = [{ type: '', value: '' }]
            }
        }
        setTable(newTable)
    }

    function updateTableRow(table: any[], setTable: any, index: number, field: string, value: string) {
        const newTable = JSON.parse(JSON.stringify(table))
        newTable[index][field] = value
        setTable(newTable)
    }

    return (
        <ScreenTemplate title='Gerar relatório'>
            <>
                <Loading loading={loading} text='Gerando relatório...' />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className='column'>
                            <DatePicker
                                label="Data"
                                name="data"
                                control={control}
                                errors={errors}
                                required
                            />
                        </div>
                        <div className='column'>
                            <DatePicker
                                label="Data da criação"
                                name="dataCriacao"
                                control={control}
                                errors={errors}
                                required
                            />
                        </div>
                        <div className='column'>
                            <TextField name='numeroRevisao' type='number' label='Nº da revisão' step="1" register={register} errors={errors} required />
                        </div>
                        <div className='column'>
                            <DatePicker
                                label="Data da revisão"
                                name="dataRevisao"
                                control={control}
                                errors={errors}
                                required
                            />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            <TextField name='unidadeAbatedoura' label='Unidade abatedoura' register={register} errors={errors} required />
                        </div>
                        <div className='column'>
                            <TextField name='municipioUnidadeAbatedoura' label='Município' register={register} errors={errors} required />
                        </div>
                    </div>
                    <TextField name='proprietario' label='Proprietário' register={register} errors={errors} required />
                    <div className='row'>
                        <div className='column'>
                            <TextField name='propriedade' label='Propriedade' register={register} errors={errors} required />
                        </div>
                        <div className='column'>
                            <TextField name='municipioPropriedade' label='Município' register={register} errors={errors} required />
                        </div>
                    </div>
                    
                    <div className='row'>
                        <div className='column'>
                            <TextField name='numeroAnimais' label='Nº de animais' type='number' step='1' register={register} errors={errors} required />
                            <Select label='Sexo' name='sexo' register={register} errors={errors} options={[
                                {value: 'F', text: 'F'},
                                {value: 'MI', text: 'MI'},
                                {value: 'MC', text: 'MC'},
                                {value: 'MI/MC', text: 'MI/MC'}
                            ]} required />
                        </div>
                        <div className='column'>
                            <TextField name='lote' label='Lote' register={register} errors={errors} required />
                            <TextField name='curral' label='Curral' register={register} errors={errors} required />
                            
                        </div>
                        <div className='column'>
                            <TextField name='sequencial' label='Sequencial' register={register} errors={errors} required />
                            <TextField name='raca' label='Raça' register={register} errors={errors} required />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            <TextField name='valorArroba' label='Valor da arroba' type='number' step='0.01' register={register} errors={errors} />
                        </div>
                        <div className='column'>
                            <Select label='Precoce?' name='adicionalPrecoce' register={register} errors={errors} options={[
                                {value: 'false', text: 'Não'},
                                {value: 'true', text: 'Sim'}
                            ]} required />
                        </div>
                        <div className='column'>
                            <Select 
                                label='Desconto' 
                                name='desconto' 
                                register={register} 
                                errors={errors} 
                                options={discounts.map(discount => {
                                    return { value: discount, text: discount }
                                })} 
                                required 
                            />
                        </div>
                        <div className='column'>
                            <TextField name='pesoVacina' label='Peso da vacina' type='number' step='0.01' register={register} errors={errors} required />
                        </div>
                        <div className='column'>
                            <TextField name='PV' label='PV' type='number' step='0.01' register={register} errors={errors} required />
                        </div>
                        <div className='column'>
                            <TextField name='PC' label='PC' type='number' step='0.01' register={register} errors={errors} required />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            <TextField name='avaliacaoCurral' label='Avaliação do curral' type='textarea' register={register} errors={errors} required />
                            <TextField name='observacoes' label='Observações' type='textarea' register={register} errors={errors} />
                        </div>
                    </div>

                    <div className='row'>
                        <Table title='Maturidade'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Dentição</th>
                                        <th>Nº de animais</th>
                                        <th><BiPlus size={15} onClick={() => addTableRow(maturidade, setMaturidade)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {maturidade.map((elem, index) => {
                                        return (
                                            <tr key={`maturidade-${index}`}>
                                                <td><TextField onChange={(value) => updateTableRow(maturidade, setMaturidade, index, 'type', value)} value={elem.type} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(maturidade, setMaturidade, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(maturidade, setMaturidade, index)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>

                        <Table title='Acabamento'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Nº de animais</th>
                                        <th><BiPlus size={15} onClick={() => addTableRow(acabamento, setAcabamento)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {acabamento.map((elem, index) => {
                                        return (
                                            <tr key={`acabamento-${index}`}>
                                                <td><TextField onChange={(value) => updateTableRow(acabamento, setAcabamento, index, 'type', value)} value={elem.type} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(acabamento, setAcabamento, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(acabamento, setAcabamento, index)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>

                        <Table title='Escore ruminal'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Nº de animais</th>
                                        <th><BiPlus size={15} onClick={() => addTableRow(escoreRuminal, setEscoreRuminal)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {escoreRuminal.map((elem, index) => {
                                        return (
                                            <tr key={`escore-ruminal-${index}`}>
                                                <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'type', value)} value={elem.type} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(escoreRuminal, setEscoreRuminal, index)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>
                    </div>

                    <div className='row'>
                        <Table title='DIF'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Seq.</th>
                                        <th>Motivo</th>
                                        <th>Destino</th>
                                        <th><BiPlus size={15} onClick={() => addTableRow(dif, setDif, true)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dif.map((elem, index) => {
                                        return (
                                            <tr key={`dif-${index}`}>
                                                <td><TextField onChange={(value) => updateTableRow(dif, setDif, index, 'seq', value)} value={elem.seq} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(dif, setDif, index, 'type', value)} value={elem.type} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(dif, setDif, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(dif, setDif, index, true)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>

                        <Table title='Hematomas'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Seq.</th>
                                        <th>Local</th>
                                        <th>Origem</th>
                                        <th><BiPlus size={15} onClick={() => addTableRow(hematomas, setHematomas, true)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hematomas.map((elem, index) => {
                                        return (
                                            <tr key={`hematomas-${index}`}>
                                                <td><TextField onChange={(value) => updateTableRow(hematomas, setHematomas, index, 'seq', value)} value={elem.seq} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(hematomas, setHematomas, index, 'type', value)} value={elem.type} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(hematomas, setHematomas, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(hematomas, setHematomas, index, true)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>
                        
                        { isFemale && <Table title='Fetos'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Tamanho</th>
                                        <th>Quantidade</th>
                                        <th><BiPlus size={15} onClick={() => addTableRow(fetos, setFetos)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetos.map((elem, index) => {
                                        return (
                                            <tr key={`fetos-${index}`}>
                                                <td><Select  
                                                    name='desconto' 
                                                    register={register} 
                                                    errors={errors} 
                                                    required 
                                                    options={fetalSizes.map(size => {
                                                        return { value: size, text: size }
                                                    })} 
                                                /></td>
                                                <td><TextField onChange={(value) => updateTableRow(fetos, setFetos, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(fetos, setFetos, index)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>}
                    </div>

                    <div className='row'>
                        <Table title='Premiações'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Valor</th>
                                        <th><BiPlus size={15} onClick={() => addTableRow(premiacoes, setPremiacoes)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {premiacoes.map((elem, index) => {
                                        return (
                                            <tr key={`premiacoes-${index}`}>
                                                <td><TextField onChange={(value) => updateTableRow(premiacoes, setPremiacoes, index, 'type', value)} value={elem.type} /></td>
                                                <td><TextField type='number' step='0.01' onChange={(value) => updateTableRow(premiacoes, setPremiacoes, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(premiacoes, setPremiacoes, index)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>
                    </div>

                    <div className='row'>
                        <Photos photos={fotos} setPhotos={setFotos} />
                    </div>

                    <div className='row'>
                        <Button type="reset" onClick={resetForm} variant='primary' text='Limpar formulário' />
                        <Button type='submit' variant='secondary' text='Gerar relatório' />
                    </div>
                </form>
            </>
        </ScreenTemplate>
    )
}

export default Invoices