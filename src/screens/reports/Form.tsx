import swal from 'sweetalert'
import { useForm } from 'react-hook-form'
import formatDate from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'
import { useState, useEffect } from 'react'
import { save } from '@tauri-apps/api/dialog'
import { useNavigate, useParams } from 'react-router-dom'
import { BiDownload, BiPlus, BiTrash } from 'react-icons/bi'

import Table from '../../components/Table'
import Button from '../../components/Button'
import Select from '../../components/Select'
import Photos from '../../components/Photos'
import Loading from '../../components/Loading'
import TextField from '../../components/TextField'
import DatePicker from '../../components/DatePicker'
import ScreenTemplate from '../../components/ScreenTemplate'

import generateReport from '../../services/generateReport'
import { getRanches, Ranch } from '../../services/ranches'
import { Client, getClients } from '../../services/clients'
import { Discount, getSettings } from '../../services/settings'
import { 
    Slaughterhouse,
    getSlaughterhouses,
    SlaughterhouseUnit,
    getSlaughterhouseUnits
} from '../../services/slaughterhouse'
import { 
    Report,
    getDif, 
    getFetus, 
    getAwards, 
    getBruises, 
    getMaturity, 
    createReport, 
    getFinishing, 
    getReportById, 
    getRumenScore,
    ObjectTypeValue,
    ObjectSeqTypeValue,
    getPhotos,
    updateReport,
    deleteReport
} from '../../services/report'
import { getAvailableSex, getSexLabel } from '../../services/sex'


function ReportForm() {
    const [loading, setLoading] = useState(false)
    const [isFemale, setIsFemale] = useState(true)

    const [clients, setClients] = useState<Client[]>([])
    const [ranches, setRanches] = useState<Ranch[]>([])
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [slaughterhouses, setSlaughterhouses] = useState<Slaughterhouse[]>([])
    const [slaughterhouseUnits, setSlaughterhouseUnits] = useState<SlaughterhouseUnit[]>([])

    const [maturity, setMaturity] = useState<ObjectTypeValue[]>([
        { type: '0', value: '0' },
        { type: '2', value: '0' },
        { type: '4', value: '0' },
        { type: '6', value: '0' },
        { type: '8', value: '0' },
    ])
    const [finishing, setFinishing] = useState<ObjectTypeValue[]>([
        { type: '1', value: '0' },
        { type: '2', value: '0' },
        { type: '3', value: '0' },
        { type: '4', value: '0' },
        { type: '5', value: '0' },
    ])
    const [rumenScore, setRumenScore] = useState<ObjectTypeValue[]>([
        { type: '1', value: '0' },
        { type: '2', value: '0' },
        { type: '3', value: '0' },
        { type: '4', value: '0' },
        { type: '5', value: '0' },
    ])
    const [awards, setAwards] = useState<ObjectTypeValue[]>([{ type: '', value: '' }])
    const [fetus, setFetus] = useState<ObjectTypeValue[]>([
        { type: 'P', value: '0' },
        { type: 'M', value: '0' },
        { type: 'G', value: '0' },
    ])
    
    const [dif, setDif] = useState<ObjectSeqTypeValue[]>([{ seq: '', type: '', value: '' }])
    const [bruises, setBruises] = useState<ObjectSeqTypeValue[]>([{ seq: '', type: '', value: '' }])
    
    const [photos, setPhotos] = useState<string[]>([])
    
    const { id } = useParams()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            date: new Date(),
            slaughterhouseId: '',
            slaughterhouseUnitId: '',
            clientId: '',
            ranchId: '',
            ranchCity: '',
            discountId: '',
            numberOfAnimals: '',
            sex: 'F',
            batch: '',
            breed: '',
            cattleShed: '',
            sequential: '',
            arroba: '',
            vaccineWeight: '',
            PV: '',
            PC: '',
            corralEvaluation: '',
            comments: ''
        }
    })

    useEffect(() => {
        if (id) {
            const reportId = parseInt(id)
            getReportById(reportId)
                .then(report => {
                    reset({
                        date: new Date(),
                        slaughterhouseId: `${report.slaughterhouseId}`,
                        slaughterhouseUnitId: `${report.slaughterhouseUnitId}`,
                        clientId: `${report.clientId}`,
                        ranchId: `${report.ranchId}`,
                        ranchCity: ranches.find(r => r.id === report.ranchId)?.city || '',
                        numberOfAnimals: `${report.numberOfAnimals}`,
                        sex: report.sex,
                        batch: report.batch,
                        breed: report.breed,
                        cattleShed: report.cattleShed,
                        sequential: report.sequential,
                        arroba: report.arroba ? (report.arroba / 100).toString().replace('.', ',') : '',
                        discountId: `${report.discountId}`,
                        vaccineWeight: (report.vaccineWeight / 100).toString().replace('.', ','),
                        PV: (report.PV / 100).toString().replace('.', ','),
                        PC: (report.PC / 100).toString().replace('.', ','),
                        corralEvaluation: report.corralEvaluation,
                        comments: report.comments || ''
                    })
                })
            getMaturity(reportId).then(setMaturity)
            getFinishing(reportId).then(setFinishing)
            getRumenScore(reportId).then(setRumenScore)
            getFetus(reportId).then(setFetus)
            getDif(reportId).then(setDif)
            getBruises(reportId).then(setBruises)
            getAwards(reportId).then(setAwards)
            getPhotos(reportId).then(setPhotos)
        }
    }, [id])

    useEffect(() => {
        getClients().then(c => {
            if (c.length) {
                setClients(c),
                setValue('clientId', `${c[0].id}`)
            }
        })
        getSlaughterhouses().then(s => {
            if (s.length) {
                setSlaughterhouses(s)
                setValue('slaughterhouseId', `${s[0].id}`)
            }
        })
        getSettings()
            .then(settings => {
                setDiscounts(settings.discounts)
            })
    }, [])

    const watchSex = watch('sex')
    const watchClient = watch('clientId')
    const watchRanch = watch('ranchId')
    const watchSlaughterhouse = watch('slaughterhouseId')

    useEffect(() => {
        setIsFemale(watchSex === 'F')
    }, [watchSex])

    useEffect(() => {
        if (watchClient) {
            getRanches(parseInt(watchClient)).then(r => {
                setRanches(r)
                if (r.length) {
                    if (id) {
                        const ranch = r.find(r => r.id === parseInt(getValues('ranchId'))) || r[0]
                        setValue('ranchId', `${ranch.id}`)
                        setValue('ranchCity', `${ranch.city}`)
                    } else {
                        setValue('ranchId', `${r[0].id}`)
                        setValue('ranchCity', `${r[0].city}`)
                    }
                }
            })
        }
    }, [watchClient])

    useEffect(() => {
        if (watchRanch) {
            setValue('ranchCity', ranches.find(r => r.id === parseInt(watchRanch))?.city || '')
        }
    }, [watchRanch])

    useEffect(() => {
        if (watchSlaughterhouse) {
            getSlaughterhouseUnits(parseInt(watchSlaughterhouse)).then(s => {
                setSlaughterhouseUnits(s)
                if (s.length) {
                    setValue('slaughterhouseUnitId', `${s[0].id}`)
                }
            })
        }
    }, [watchSlaughterhouse])

    function parseNumber(number: string) {
        return parseFloat(number.replace(',', '.')) * 100
    }

    function onSubmit(data: any) {
        const input: Report = {
            date: data.date,
            slaughterhouseId: parseInt(data.slaughterhouseId),
            slaughterhouseUnitId: parseInt(data.slaughterhouseUnitId),
            clientId: parseInt(data.clientId),
            ranchId: parseInt(data.ranchId),
            numberOfAnimals: parseInt(data.numberOfAnimals),
            sex: data.sex,
            batch: data.batch,
            breed: data.breed,
            cattleShed: data.cattleShed,
            sequential: data.sequential,
            arroba: data.arroba ? parseNumber(data.arroba) : undefined,
            discountId: parseInt(data.discountId),
            vaccineWeight: parseNumber(data.vaccineWeight),
            PV: parseNumber(data.PV),
            PC: parseNumber(data.PC),
            corralEvaluation: data.corralEvaluation,
            comments: data.comments,
            photos,
            maturity,
            finishing,
            rumenScore,
            fetus,
            dif,
            bruises,
            awards
        }
        
        swal({
            text: 'Deseja realmente salvar esse relat??rio?',
            icon: 'warning',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'N??o'
                },
                confirm: {
                    text: 'Sim',
                },
            },
            dangerMode: true,
        })
        .then(confirm => {
            if (confirm) {
                if (id) {
                    updateReport(parseInt(id), input)
                        .then(() => {
                            swal('', 'Relat??rio atualizado com sucesso!', 'success')
                            navigate(`/reports/${id}`)
                        })
                        .catch(e => { swal('', e, 'error') })
                        .finally(() => { setLoading(false) })
                } else {
                    createReport(input)
                        .then(reportId => {
                            swal('', 'Relat??rio gerado com sucesso!', 'success')
                            navigate(`/reports/${reportId}`)
                        })
                        .catch(e => { swal('', e, 'error') })
                        .finally(() => { setLoading(false) })
                }
            }
        })
    }

    function removeReport() {
        if (!id) return
        swal({
            text: 'Deseja realmente delete esse relat??rio?',
            icon: 'warning',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'N??o'
                },
                confirm: {
                    text: 'Sim',
                },
            },
            dangerMode: true,
        })
        .then(confirm => {
            if (confirm) {
                deleteReport(parseInt(id))
                    .then(() => { swal('', 'Relat??rio deletado com sucesso!', 'success') })
                    .then(() => navigate('/reports'))
                    .catch(swal)
            }
        })
    }

    function downloadReport() {
        const [ranchId, selectSex, date] = getValues(['ranchId', 'sex', 'date'])
        const ranch = ranches.find(ranch => ranch.id == parseInt(ranchId))
        const formattedDate = formatDate(new Date(date), 'dd-MM-yyyy', { locale: ptBr })
        const sex = getSexLabel(selectSex)
        const defaultPath = `${ranch?.name} ${formattedDate} ${sex}.pdf`
        save({
            title: 'Onde deseja salvar o relat??rio?',
            defaultPath: defaultPath,
            filters: [{name: 'PDF', extensions: ['pdf']}]
        })
        .then(path => {
            if (!path) return false
            setLoading(true)
            return generateReport(parseInt(id || '0'), path)
        })
        .then(success => {
            success && swal('', 'Relat??rio salvo com sucesso!', 'success')
        })
        .catch(e => {
            swal('', e.message, 'error')
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function resetForm() {
        setIsFemale(true)
        setMaturity([{ type: '', value: '' }])
        setFinishing([{ type: '', value: '' }])
        setRumenScore([{ type: '', value: '' }])
        setFetus([{ type: '', value: '' }])
        setDif([{ seq: '', type: '', value: '' }])
        setBruises([{ seq: '', type: '', value: '' }])
        setPhotos([])
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

    function renderTopBarButtons() {
        if (!id) return <></>
        return (
            <div className="row">
                <BiDownload onClick={downloadReport} size={25} className='svg-button' />
                {<BiTrash onClick={removeReport} size={25} className='svg-button' />}
            </div>
        )
    }

    return (
        <ScreenTemplate
            title={`${id ? 'Editar' : 'Criar'} relat??rio`}
            backLink='/'
            rightComponent={renderTopBarButtons()}
        >
            <>
                <Loading loading={loading} text='Gerando relat??rio...' />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className='column'>
                            <DatePicker
                                label="Data"
                                name="date"
                                control={control}
                                errors={errors}
                                required
                            />
                        </div>
                        <div className='column'>
                            <Select label='Unidade' name='slaughterhouseId' control={control} errors={errors} options={
                                slaughterhouses.map(s => ({ value: `${s.id}`, label: s.name }))
                            } required />
                        </div>
                        <div className='column'>
                            <Select label='Munic??pio' name='slaughterhouseUnitId' control={control} errors={errors} options={
                                slaughterhouseUnits.map(s => ({ value: `${s.id}`, label: s.city }))
                            } required />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            <Select label='Propriet??rio' name='clientId' control={control} errors={errors} options={
                                clients.map(client => ({ value: `${client.id}`, label: client.name }))
                            } required />
                        </div>
                        <div className='column'>
                            <Select label='Propriedade' name='ranchId' control={control} errors={errors} options={
                                ranches.map(ranch => ({ value: `${ranch.id}`, label: ranch.name }))
                            } required />
                        </div>
                        <div className='column'>
                            <TextField label='Munic??pio' name='ranchCity' register={register} errors={errors} required disabled />
                        </div>
                    </div>
                    
                    <div className='row'>
                        <div className='column'>
                            <TextField label='N?? de animais' name='numberOfAnimals' type='integer' register={register} errors={errors} required />
                            <Select label='Sexo' name='sex' control={control} errors={errors} options={getAvailableSex()} required />
                        </div>
                        <div className='column'>
                            <TextField label='Lote' name='batch' register={register} errors={errors} required />
                            <TextField label='Curral' name='cattleShed' register={register} errors={errors} required />
                            
                        </div>
                        <div className='column'>
                            <TextField label='Sequencial' name='sequential' register={register} errors={errors} required />
                            <TextField label='Ra??a' name='breed' register={register} errors={errors} required />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            <TextField label='Valor da arroba' name='arroba' type='decimal' register={register} errors={errors} />
                        </div>
                        <div className='column'>
                            <Select 
                                label='Desconto' 
                                name='discountId' 
                                control={control} 
                                errors={errors} 
                                options={discounts.map(discount => {
                                    return { value: `${discount.id}`, label: discount.name }
                                })} 
                                required 
                            />
                        </div>
                        <div className='column'>
                            <TextField label='Peso da vacina' name='vaccineWeight' type='decimal' register={register} errors={errors} required />
                        </div>
                        <div className='column'>
                            <TextField label='PV' name='PV' type='decimal' register={register} errors={errors} required />
                        </div>
                        <div className='column'>
                            <TextField label='PC' name='PC' type='decimal' register={register} errors={errors} required />
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            <TextField label='Avalia????o do curral' name='corralEvaluation' type='textarea' register={register} errors={errors} required />
                            <TextField label='Observa????es' name='comments' type='textarea' register={register} errors={errors} />
                        </div>
                    </div>

                    <div className='row'>
                        <Table title='Maturidade'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Denti????o</th>
                                        <th>N?? de animais</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {maturity.map((elem, index) => {
                                        return (
                                            <tr key={`maturity-${index}`}>
                                                <td>{elem.type}</td>
                                                <td><TextField onChange={(value) => updateTableRow(maturity, setMaturity, index, 'value', value)} value={elem.value} /></td>
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
                                        <th>N??mero</th>
                                        <th>N?? de animais</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {finishing.map((elem, index) => {
                                        return (
                                            <tr key={`finishing-${index}`}>
                                                <td>{elem.type}</td>
                                                <td><TextField onChange={(value) => updateTableRow(finishing, setFinishing, index, 'value', value)} value={elem.value} /></td>
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
                                        <th>N??mero</th>
                                        <th>N?? de animais</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rumenScore.map((elem, index) => {
                                        return (
                                            <tr key={`rumen-score-${index}`}>
                                                <td>{elem.type}</td>
                                                <td><TextField onChange={(value) => updateTableRow(rumenScore, setRumenScore, index, 'value', value)} value={elem.value} /></td>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetus.map((elem, index) => {
                                        return (
                                            <tr key={`fetus-${index}`}>
                                                <td>{elem.type}</td>
                                                <td><TextField onChange={(value) => updateTableRow(fetus, setFetus, index, 'value', value)} value={elem.value} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>}
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
                                        <th><BiPlus size={15} onClick={() => addTableRow(bruises, setBruises, true)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bruises.map((elem, index) => {
                                        return (
                                            <tr key={`bruises-${index}`}>
                                                <td><TextField onChange={(value) => updateTableRow(bruises, setBruises, index, 'seq', value)} value={elem.seq} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(bruises, setBruises, index, 'type', value)} value={elem.type} /></td>
                                                <td><TextField onChange={(value) => updateTableRow(bruises, setBruises, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(bruises, setBruises, index, true)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>
                    </div>

                    <div className='row'>
                        <Table title='Premia????es'>
                            <>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Valor</th>
                                        <th><BiPlus size={15} onClick={() => addTableRow(awards, setAwards)} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {awards.map((elem, index) => {
                                        return (
                                            <tr key={`awards-${index}`}>
                                                <td><TextField onChange={(value) => updateTableRow(awards, setAwards, index, 'type', value)} value={elem.type} /></td>
                                                <td><TextField type='decimal' onChange={(value) => updateTableRow(awards, setAwards, index, 'value', value)} value={elem.value} /></td>
                                                <td><BiTrash onClick={() => removeTableRow(awards, setAwards, index)} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        </Table>
                    </div>

                    <div className='row'>
                        <Photos photos={photos} setPhotos={setPhotos} />
                    </div>

                    <div className='row'>
                        {!id && <Button type="reset" onClick={resetForm} variant='primary' text='Limpar formul??rio' />}
                        <Button type='submit' variant='secondary' text='Salvar relat??rio' />
                    </div>
                </form>
            </>
        </ScreenTemplate>
    )
}

export default ReportForm