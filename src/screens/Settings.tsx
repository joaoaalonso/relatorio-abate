import { useState } from 'react'
import { BiPlus, BiTrash } from 'react-icons/bi'

import Table from '../components/Table'
import TextField from '../components/TextField'
import ScreenTemplate from '../components/ScreenTemplate'
import { getAvaliableFetalSizes, getDiscounts, getFetalAges, getFetalWeights } from '../services/configs'
import Button from '../components/Button'

function Settings() {
    const [discounts, setDiscounts] = useState(getDiscounts())
    const [fetalAge, setFetalAge] = useState<any>(getFetalAges())
    const [fetalWeight, setFetalWeight] = useState<any>(getFetalWeights())

    const fetalSizes = getAvaliableFetalSizes()

    function addDiscount() {
        setDiscounts([...discounts, { name: '', value: 0 }])
    }

    function removeDiscount(index: number) {
        let newDiscounts = discounts.filter((_, i) => i !== index)
        if (!newDiscounts.length) {
            newDiscounts = [{ name: '', value: 0 }]
        }
        setDiscounts(newDiscounts)
    }

    return (
        <ScreenTemplate title='Configurações'>
            <>
                {/* <p>Descontos:</p>
                {Object.keys(discounts).map(key => {
                    return <p key={key}>- {key}: {discounts[key]*100}%</p>
                })}
                <p>Peso fetal:</p>
                {Object.keys(fetalWeight).map(key => {
                    return <p key={key}>- {key}: {fetalWeight[key]}Kg</p>
                })}
                <p>Idade fetal:</p>
                {Object.keys(fetalAge).map(key => {
                    return <p key={key}>- {key}: {fetalAge[key]}</p>
                })} */}
                <div className='row' style={{ justifyContent: 'center' }}>
                    <Table title='Fetos'>
                        <>
                            <thead>
                                <tr>
                                    <th>Tamanho</th>
                                    <th>Peso (Kg)</th>
                                    <th>Idade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetalSizes.map(size => {
                                    return (
                                        <tr key={`fetal-${size}`}>
                                            <td>{size}</td>
                                            <td><TextField value={fetalWeight[size]} /></td>
                                            <td><TextField value={fetalAge[size]} /></td>
                                            {/* <td><TextField onChange={(value) => updateTableRow(premiacoes, setPremiacoes, index, 'type', value)} value={elem.type} /></td> */}
                                            {/* <td><TextField type='number' step='0.01' onChange={(value) => updateTableRow(premiacoes, setPremiacoes, index, 'value', value)} value={elem.value} /></td> */}
                                            {/* <td><BiTrash onClick={() => removeTableRow(premiacoes, setPremiacoes, index)} /></td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </>
                    </Table>

                    <Table title='Descontos'>
                        <>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Valor (%)</th>
                                    <th><BiPlus size={15} onClick={addDiscount} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {discounts.map((discount, index) => {
                                    return (
                                        <tr key={`discount-${index}`}>
                                            <td><TextField value={discount.name} /></td>
                                            <td><TextField value={discount.value.toString()} /></td>
                                            <td><BiTrash onClick={() => removeDiscount(index)} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </>
                    </Table>
                </div>

                <Button variant='secondary' text='Salvar' />
            </>
        </ScreenTemplate>
    )
}

export default Settings