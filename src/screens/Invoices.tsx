import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiPlus, BiTrash } from 'react-icons/bi'

import Table from '../components/Table'
import Button from '../components/Button'
import Select from '../components/Select'
import TextField from '../components/TextField'
import ScreenTemplate from '../components/ScreenTemplate'

import generateReport from '../services/generateReport'

function Invoices() {
    const [result, setResult] = useState('')
    const [maturidade, setMaturidade] = useState<any[]>([{ type: '', value: '' }])
    const [acabamento, setAcabamento] = useState<any[]>([{ type: '', value: '' }])
    const [escoreRuminal, setEscoreRuminal] = useState<any[]>([{ type: '', value: '' }])
    const [fetos, setFetos] = useState<any[]>([{ type: '', value: '' }])
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            data: (new Date()).toLocaleDateString('pt-BR')
        }
    })

    function parseNumber(number: string) {
        return parseFloat(number.replace(',', '.'))
    }

    function onSubmit(data: any) {
        const newData = {
            ...data,
            valorArroba: data.valorArroba ? parseNumber(data.valorArroba) : '',
            PV: parseNumber(data.PV),
            PC: parseNumber(data.PC),
            pesoVacina: parseNumber(data.pesoVacina),
            maturidade,
            acabamento,
            escoreRuminal
        }
        setResult(JSON.stringify(newData))
        generateReport(newData)
    }

    function makeTextField(label: string, name: string, required = true) {
        return <TextField name={name} register={register} label={label} errors={errors} required={required} />
    }

    function addTableRow(table: any[], setTable: any) {
        setTable([...table, { type: '', value: '' }])
    }

    function removeTableRow(table: any[], setTable: any, index: number) {
        let newTable = table.filter((_, i) => i !== index)
        if (!newTable.length) {
            newTable = [{ type: '', value: '' }]
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
                {result}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className='column'>
                            {makeTextField('Data', 'data')}
                        </div>
                        <div className='column'>
                            {makeTextField('Data da criação', 'dataCriacao')}
                        </div>
                        <div className='column'>
                            {makeTextField('Nº da revisão', 'numeroRevisao')}
                        </div>
                        <div className='column'>
                            {makeTextField('Data da revisão', 'dataRevisao')}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            {makeTextField('Unidade abatedoura', 'unidadeAbatedoura')}
                        </div>
                        <div className='column'>
                            {makeTextField('Município', 'municipioUnidadeAbatedoura')}
                        </div>
                    </div>
                    {makeTextField('Proprietário', 'proprietario')}
                    <div className='row'>
                        <div className='column'>
                            {makeTextField('Propriedade', 'propriedade')}
                        </div>
                        <div className='column'>
                            {makeTextField('Município', 'municipioPropriedade')}
                        </div>
                    </div>
                    
                    <div className='row'>
                        <div className='column'>
                            {makeTextField('Nº de animais', 'numeroAnimais')}
                            <Select label='Sexo' name='sexo' register={register} errors={errors} options={[
                                {value: 'F', text: 'F'},
                                {value: 'MI', text: 'MI'},
                                {value: 'MC', text: 'MC'},
                                {value: 'MI/MC', text: 'MI/MC'}
                            ]} required />
                        </div>
                        <div className='column'>
                            {makeTextField('Lote', 'lote')}
                            {makeTextField('Curral', 'curral')}
                        </div>
                        <div className='column'>
                            {makeTextField('Sequencial', 'sequencial')}
                            {makeTextField('Raça', 'raca')}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            {makeTextField('Valor da arroba', 'valorArroba', false)}
                        </div>
                        <div className='column'>
                            <Select label='Precoce?' name='adicionalPrecoce' register={register} errors={errors} options={[
                                {value: 'false', text: 'Não'},
                                {value: 'true', text: 'Sim'}
                            ]} required />
                        </div>
                        <div className='column'>
                            <Select label='Desconto' name='desconto' register={register} errors={errors} options={[
                                {value: 'funrural', text: 'Funrural'},
                                {value: 'senar', text: 'Senar'}
                            ]} required />
                        </div>
                        <div className='column'>
                            {makeTextField('Peso da vacina', 'pesoVacina')}
                        </div>
                        <div className='column'>
                            {makeTextField('PV', 'PV')}
                        </div>
                        <div className='column'>
                            {makeTextField('PC', 'PC')}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='column'>
                            {makeTextField('Avaliação do curral', 'avaliacaoCurral')}
                            {makeTextField('Observações', 'observacoes', false)}
                        </div>
                    </div>

                    
                    {/* {makeTextField('Maturidade', 'maturidade')}
                    {makeTextField('Acabamento', 'acabamento')}
                    {makeTextField('Escore ruminal', 'escoreRuminal')}
                    {makeTextField('DIF', 'dif')}
                    {makeTextField('Hematomas', 'hematomas')}
                    {makeTextField('Fetos', 'fetos')} */}
                    
                    {/* {renderMaturidade()} */}
                    {/* {makeTextField('Premiações', 'premiacoes')} */}

                    <div className='row'>
                        <Table title='Maturidade'>
                            <>
                                <tr>
                                    <th>X</th>
                                    <th>Nº de animais</th>
                                    <th><BiPlus size={15} onClick={() => addTableRow(maturidade, setMaturidade)} /></th>
                                </tr>
                                {maturidade.map((elem, index) => {
                                    return (
                                        <tr>
                                            <td><TextField onChange={(value) => updateTableRow(maturidade, setMaturidade, index, 'type', value)} value={elem.type} /></td>
                                            <td><TextField onChange={(value) => updateTableRow(maturidade, setMaturidade, index, 'value', value)} value={elem.value} /></td>
                                            <td><BiTrash onClick={() => removeTableRow(maturidade, setMaturidade, index)} /></td>
                                        </tr>
                                    )
                                })}
                            </>
                        </Table>

                        <Table title='Acabamento'>
                            <>
                                <tr>
                                    <th>X</th>
                                    <th>Nº de animais</th>
                                    <th><BiPlus size={15} onClick={() => addTableRow(acabamento, setAcabamento)} /></th>
                                </tr>
                                {acabamento.map((elem, index) => {
                                    return (
                                        <tr>
                                            <td><TextField onChange={(value) => updateTableRow(acabamento, setAcabamento, index, 'type', value)} value={elem.type} /></td>
                                            <td><TextField onChange={(value) => updateTableRow(acabamento, setAcabamento, index, 'value', value)} value={elem.value} /></td>
                                            <td><BiTrash onClick={() => removeTableRow(acabamento, setAcabamento, index)} /></td>
                                        </tr>
                                    )
                                })}
                            </>
                        </Table>

                        <Table title='Escore ruminal'>
                            <>
                                <tr>
                                    <th>X</th>
                                    <th>Nº de animais</th>
                                    <th><BiPlus size={15} onClick={() => addTableRow(escoreRuminal, setEscoreRuminal)} /></th>
                                </tr>
                                {escoreRuminal.map((elem, index) => {
                                    return (
                                        <tr>
                                            <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'type', value)} value={elem.type} /></td>
                                            <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'value', value)} value={elem.value} /></td>
                                            <td><BiTrash onClick={() => removeTableRow(escoreRuminal, setEscoreRuminal, index)} /></td>
                                        </tr>
                                    )
                                })}
                            </>
                        </Table>
                    </div>

                    <div className='row'>
                        <Table title='DIF'>
                            <>
                                <tr>
                                    <th>Seq.</th>
                                    <th>Motivo</th>
                                    <th>Destino</th>
                                    <th><BiPlus size={15} onClick={() => addTableRow(escoreRuminal, setEscoreRuminal)} /></th>
                                </tr>
                                {escoreRuminal.map((elem, index) => {
                                    return (
                                        <tr>
                                            <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'type', value)} value={elem.type} /></td>
                                            <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'value', value)} value={elem.value} /></td>
                                            <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'value', value)} value={elem.value} /></td>
                                            <td><BiTrash onClick={() => removeTableRow(escoreRuminal, setEscoreRuminal, index)} /></td>
                                        </tr>
                                    )
                                })}
                            </>
                        </Table>

                        <Table title='Hematomas'>
                            <>
                                <tr>
                                    <th>Seq.</th>
                                    <th>Local</th>
                                    <th>Origem</th>
                                    <th><BiPlus size={15} onClick={() => addTableRow(escoreRuminal, setEscoreRuminal)} /></th>
                                </tr>
                                {escoreRuminal.map((elem, index) => {
                                    return (
                                        <tr>
                                            <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'type', value)} value={elem.type} /></td>
                                            <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'value', value)} value={elem.value} /></td>
                                            <td><TextField onChange={(value) => updateTableRow(escoreRuminal, setEscoreRuminal, index, 'value', value)} value={elem.value} /></td>
                                            <td><BiTrash onClick={() => removeTableRow(escoreRuminal, setEscoreRuminal, index)} /></td>
                                        </tr>
                                    )
                                })}
                            </>
                        </Table>

                        <Table title='Fetos'>
                            <>
                                <tr>
                                    <th>Tamanho</th>
                                    <th>Quantidade</th>
                                    <th><BiPlus size={15} onClick={() => addTableRow(fetos, setFetos)} /></th>
                                </tr>
                                {fetos.map((elem, index) => {
                                    return (
                                        <tr>
                                            <td><TextField onChange={(value) => updateTableRow(fetos, setFetos, index, 'type', value)} value={elem.type} /></td>
                                            <td><TextField onChange={(value) => updateTableRow(fetos, setFetos, index, 'value', value)} value={elem.value} /></td>
                                            <td><BiTrash onClick={() => removeTableRow(fetos, setFetos, index)} /></td>
                                        </tr>
                                    )
                                })}
                            </>
                        </Table>
                    </div>

                    <Button type='submit' text='Gerar' />
                </form>
            </>
        </ScreenTemplate>
    )
}

export default Invoices